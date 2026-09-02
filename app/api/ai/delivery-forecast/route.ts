import OpenAI from "openai";
import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
import {capacityMetrics,forecastConfidence} from "@/lib/delivery/capacity";

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export async function POST(req:NextRequest){
  const openai = getOpenAI();
  if (!openai) {
    return Response.json({ error: "AI service is not configured for this review deployment." }, { status: 503 });
  }
  try{
    const {projectId,targetDate}=await req.json();
    const sb=await createClient();
    const {data:{user}}=await sb.auth.getUser();
    if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});

    const {data:project}=await sb.from("projects").select("*").eq("id",projectId).single();
    if(!project)return NextResponse.json({error:"Project not found"},{status:404});

    const [
      {data:resources=[]},
      {data:periods=[]},
      {data:raid=[]},
      {data:dependencies=[]},
      {data:milestones=[]},
      {data:snapshots=[]}
    ]=await Promise.all([
      sb.from("resources").select("*").eq("project_id",projectId),
      sb.from("capacity_periods").select("*").eq("project_id",projectId).order("period_start",{ascending:false}).limit(12),
      sb.from("raid_items").select("*").eq("project_id",projectId),
      sb.from("dependencies").select("*").eq("project_id",projectId),
      sb.from("milestones").select("*").eq("project_id",projectId),
      sb.from("delivery_snapshots").select("*").eq("project_id",projectId).order("created_at",{ascending:false}).limit(2)
    ]);

    const open=(x:any)=>!["closed","resolved","completed","complete"].includes(String(x.status||"").toLowerCase());
    const now=new Date();
    const openRisks=raid.filter((x:any)=>x.item_type==="risk"&&open(x)).length;
    const overdueDeps=dependencies.filter((x:any)=>open(x)&&x.due_date&&new Date(x.due_date)<now).length;
    const overdueMilestones=milestones.filter((x:any)=>open(x)&&x.target_date&&new Date(x.target_date)<now).length;

    const metrics=capacityMetrics(resources,periods);
    const deterministicConfidence=forecastConfidence(metrics,openRisks,overdueDeps,overdueMilestones);

    const prompt=`You are DeliverIQ, a senior programme delivery forecasting copilot.

Assess whether the supplied project has credible capacity to deliver against the target date.
Use only supplied data.
Do not invent effort estimates, resource availability, throughput, schedule dates, scope completion, or probability percentages.
If evidence is missing, state it explicitly.

PROJECT:
${JSON.stringify(project)}

TARGET DATE:
${targetDate || "Not supplied"}

RESOURCES:
${JSON.stringify(resources)}

CAPACITY / THROUGHPUT HISTORY:
${JSON.stringify(periods)}

DETERMINISTIC CAPACITY METRICS:
${JSON.stringify(metrics)}

OPEN RISKS:
${openRisks}

OVERDUE DEPENDENCIES:
${overdueDeps}

OVERDUE MILESTONES:
${overdueMilestones}

RECENT DELIVERY SNAPSHOTS:
${JSON.stringify(snapshots)}

DETERMINISTIC FORECAST CONFIDENCE:
${deterministicConfidence}

Return JSON only with:
headline: string
forecast_health: GREEN | AMBER | RED
confidence_score: integer 0-100
executive_summary: string
capacity_assessment: string
throughput_signals: string[]
resource_bottlenecks: array of {bottleneck,evidence,impact,recommended_action}
schedule_pressures: string[]
scope_capacity_gap: string[]
forecast_scenarios: array of {scenario,conditions,outcome}
recommended_actions: string[]
evidence_gaps: string[]
executive_questions: string[]
confidence_note: string

This is advisory forecast intelligence, not a guaranteed prediction.`;

    const result=await openai.responses.create({
      model:process.env.OPENAI_MODEL||"gpt-5-mini",
      input:prompt
    });

    let text=result.output_text.trim();
    if(text.startsWith("```")) text=text.replace(/^```json\s*/,"").replace(/```$/,"").trim();
    const review=JSON.parse(text);

    await sb.from("delivery_forecasts").insert({
      user_id:user.id,
      project_id:projectId,
      programme_id:project.programme_id||null,
      target_date:targetDate||null,
      confidence_score:review.confidence_score ?? deterministicConfidence,
      forecast_json:review
    });

    return NextResponse.json({
      metrics,
      deterministic_confidence:deterministicConfidence,
      review
    });
  }catch(error){
    console.error(error);
    return NextResponse.json({error:"Delivery forecast review failed."},{status:500});
  }
}
