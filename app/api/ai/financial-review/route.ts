import OpenAI from "openai";
import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
import {financialMetrics,financialHealth} from "@/lib/delivery/finance";

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
    const {projectId}=await req.json();
    const sb=await createClient();
    const {data:{user}}=await sb.auth.getUser();
    if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});

    const {data:project}=await sb.from("projects").select("*").eq("id",projectId).single();
    if(!project)return NextResponse.json({error:"Project not found"},{status:404});

    const [
      {data:budgetRows=[]},
      {data:costs=[]},
      {data:forecasts=[]},
      {data:benefits=[]},
      {data:raid=[]},
      {data:dependencies=[]}
    ]=await Promise.all([
      sb.from("project_budgets").select("*").eq("project_id",projectId).limit(1),
      sb.from("cost_entries").select("*").eq("project_id",projectId).order("cost_date",{ascending:false}),
      sb.from("financial_forecasts").select("*").eq("project_id",projectId).order("created_at",{ascending:false}).limit(6),
      sb.from("benefits").select("*").eq("project_id",projectId),
      sb.from("raid_items").select("*").eq("project_id",projectId),
      sb.from("dependencies").select("*").eq("project_id",projectId)
    ]);

    const budget=budgetRows[0]||null;
    const metrics=financialMetrics(budget,costs,forecasts);
    const deterministicHealth=financialHealth(metrics);

    const prompt=`You are DeliverIQ, a senior programme finance and delivery governance copilot.

Assess project financial health using ONLY supplied data.
Do not invent budget, savings, benefits, cost overruns, burn rates, or future spend.
Separate observed financial facts from interpretation.
If financial data is incomplete, state the gap clearly.

PROJECT:
${JSON.stringify(project)}

BUDGET:
${JSON.stringify(budget)}

COST ENTRIES:
${JSON.stringify(costs)}

FORECASTS:
${JSON.stringify(forecasts)}

BENEFITS:
${JSON.stringify(benefits)}

RAID:
${JSON.stringify(raid)}

DEPENDENCIES:
${JSON.stringify(dependencies)}

DETERMINISTIC FINANCIAL METRICS:
${JSON.stringify(metrics)}

DETERMINISTIC HEALTH:
${deterministicHealth}

Return JSON only with:
headline: string
financial_health: GREEN | AMBER | RED | UNKNOWN
executive_summary: string
budget_position: string
variance_drivers: string[]
burn_rate_signals: string[]
forecast_risks: array of {risk,evidence,impact,recommended_action}
benefit_cost_signals: string[]
cost_control_actions: string[]
decisions_required: string[]
evidence_gaps: string[]
confidence_note: string

Do not imply guaranteed future overspend.`;

    const result=await openai.responses.create({
      model:process.env.OPENAI_MODEL||"gpt-5-mini",
      input:prompt
    });

    let text=result.output_text.trim();
    if(text.startsWith("```")) text=text.replace(/^```json\s*/,"").replace(/```$/,"").trim();
    const review=JSON.parse(text);

    await sb.from("financial_reviews").insert({
      user_id:user.id,
      project_id:projectId,
      programme_id:project.programme_id||null,
      financial_health:review.financial_health||deterministicHealth,
      forecast_variance:metrics.variance,
      review_json:review
    });

    return NextResponse.json({metrics,deterministic_health:deterministicHealth,review});
  }catch(error){
    console.error(error);
    return NextResponse.json({error:"Financial review failed."},{status:500});
  }
}
