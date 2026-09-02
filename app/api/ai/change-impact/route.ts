import OpenAI from "openai";
import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
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
    const {projectId,changeId}=await req.json();
    const sb=await createClient();
    const {data:{user}}=await sb.auth.getUser();
    if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});

    const [{data:project},{data:change}]=await Promise.all([
      sb.from("projects").select("*").eq("id",projectId).single(),
      sb.from("change_requests").select("*").eq("id",changeId).single()
    ]);
    if(!project||!change)return NextResponse.json({error:"Project or change not found"},{status:404});

    const [
      {data:reqs=[]},{data:raid=[]},{data:deps=[]},{data:milestones=[]},
      {data:resources=[]},{data:periods=[]},{data:budget=[]},{data:costs=[]},
      {data:benefits=[]},{data:okrs=[]}
    ]=await Promise.all([
      sb.from("requirements").select("*").eq("project_id",projectId),
      sb.from("raid_items").select("*").eq("project_id",projectId),
      sb.from("dependencies").select("*").eq("project_id",projectId),
      sb.from("milestones").select("*").eq("project_id",projectId),
      sb.from("resources").select("*").eq("project_id",projectId),
      sb.from("capacity_periods").select("*").eq("project_id",projectId),
      sb.from("project_budgets").select("*").eq("project_id",projectId).limit(1),
      sb.from("cost_entries").select("*").eq("project_id",projectId),
      sb.from("benefits").select("*").eq("project_id",projectId),
      sb.from("okrs").select("*").eq("project_id",projectId)
    ]);

    const prompt=`You are DeliverIQ, a senior change-control copilot.
Assess the proposed change using ONLY supplied data. Do not invent schedule, cost, capacity, risk or benefit effects.
Separate known impacts from plausible pressures and unknowns.

PROJECT:${JSON.stringify(project)}
CHANGE:${JSON.stringify(change)}
REQUIREMENTS:${JSON.stringify(reqs)}
RAID:${JSON.stringify(raid)}
DEPENDENCIES:${JSON.stringify(deps)}
MILESTONES:${JSON.stringify(milestones)}
RESOURCES:${JSON.stringify(resources)}
CAPACITY:${JSON.stringify(periods)}
BUDGET:${JSON.stringify(budget[0]||null)}
COSTS:${JSON.stringify(costs)}
BENEFITS:${JSON.stringify(benefits)}
OKRS:${JSON.stringify(okrs)}

Return JSON only:
headline, recommendation, confidence_note,
schedule_impact:{known,pressure,unknowns},
cost_impact:{known,pressure,unknowns},
capacity_impact:{known,pressure,unknowns},
risk_impact:string[],
benefit_impact:string[],
requirements_affected:string[],
decisions_required:string[],
recommended_actions:string[]`;

    const result=await openai.responses.create({model:process.env.OPENAI_MODEL||"gpt-5-mini",input:prompt});
    let text=result.output_text.trim();
    if(text.startsWith("```"))text=text.replace(/^```json\s*/,"").replace(/```$/,"").trim();
    return NextResponse.json(JSON.parse(text));
  }catch(e){console.error(e);return NextResponse.json({error:"Change impact review failed."},{status:500})}
}
