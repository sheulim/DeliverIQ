import OpenAI from "openai";
import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

const system=`You are DeliverIQ, an experienced programme delivery director and AI delivery copilot.
Review real project data and identify what a delivery leader should pay attention to.
Do not invent facts. Distinguish observed data from inference.
Prioritise customer/business impact, critical milestones, high-severity risks/issues,
unresolved dependencies and decisions blocking delivery.
Recommendations must be practical and specific.
AI recommendations are advisory and must not silently change project data.`;

export async function POST(req:NextRequest){
  const openai = getOpenAI();
  if (!openai) {
    return Response.json({ error: "AI service is not configured for this review deployment." }, { status: 503 });
  }
  try{
    const {projectId}=await req.json();
    const sb=await createClient();

    const {data:project,error:pe}=await sb.from("projects").select("*").eq("id",projectId).single();
    if(pe || !project) return NextResponse.json({error:"Project not found"},{status:404});

    const [{data:raid=[]},{data:milestones=[]},{data:dependencies=[]}]=await Promise.all([
      sb.from("raid_items").select("*").eq("project_id",projectId),
      sb.from("milestones").select("*").eq("project_id",projectId),
      sb.from("dependencies").select("*").eq("project_id",projectId)
    ]);

    const prompt=`${system}

PROJECT:
${JSON.stringify(project)}

RAID:
${JSON.stringify(raid)}

MILESTONES:
${JSON.stringify(milestones)}

DEPENDENCIES:
${JSON.stringify(dependencies)}

Return JSON with exactly these top-level fields:
overall_health: GREEN, AMBER or RED
executive_summary: concise executive paragraph
attention_items: array of {title,reason,recommended_action,urgency,owner_role}
delivery_signals: array of concise observed/inferred signals
next_actions: array of practical actions
questions_for_team: array of questions that should be answered

Keep attention_items to the 5 most important items.
Never claim a date, metric or dependency impact that is not supported by the data.`;

    const result=await openai.responses.create({
      model:process.env.OPENAI_MODEL || "gpt-5-mini",
      input:prompt
    });

    let text=result.output_text.trim();
    if(text.startsWith("```")) text=text.replace(/^```json\s*/,"").replace(/```$/,"").trim();

    const parsed=JSON.parse(text);
    return NextResponse.json(parsed);
  }catch(error){
    console.error(error);
    return NextResponse.json({error:"AI delivery review failed. Check your OpenAI configuration and project data."},{status:500});
  }
}
