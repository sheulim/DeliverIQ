import OpenAI from "openai";
import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
import {commitmentMetrics} from "@/lib/delivery/commitments";

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

    const {data:project}=await sb.from("projects").select("*").eq("id",projectId).single();
    if(!project)return NextResponse.json({error:"Project not found"},{status:404});

    const [{data:actions=[]},{data:decisions=[]},{data:raid=[]},{data:dependencies=[]}]=await Promise.all([
      sb.from("actions").select("*").eq("project_id",projectId),
      sb.from("decisions").select("*").eq("project_id",projectId),
      sb.from("raid_items").select("*").eq("project_id",projectId),
      sb.from("dependencies").select("*").eq("project_id",projectId)
    ]);

    const metrics=commitmentMetrics(actions,decisions);

    const prompt=`You are DeliverIQ, a senior delivery governance copilot.

Review project commitments and identify where follow-through is at risk.
Use only supplied data. Do not invent owner actions, dates or dependencies.
Focus on overdue actions, ageing commitments, missing ownership, unresolved decisions
and commitments that may contribute to known risks or dependencies.

PROJECT:
${JSON.stringify(project)}

ACTION METRICS:
${JSON.stringify(metrics)}

ACTIONS:
${JSON.stringify(actions)}

DECISIONS:
${JSON.stringify(decisions)}

RAID:
${JSON.stringify(raid)}

DEPENDENCIES:
${JSON.stringify(dependencies)}

Return JSON only with:
headline: string
executive_summary: string
commitments_needing_attention: array of {title,owner,reason,recommended_action}
decisions_blocking_progress: string[]
ownership_gaps: string[]
overdue_or_ageing_signals: string[]
recommended_interventions: string[]
confidence_note: string`;

    const result=await openai.responses.create({
      model:process.env.OPENAI_MODEL||"gpt-5-mini",
      input:prompt
    });

    let text=result.output_text.trim();
    if(text.startsWith("```")) text=text.replace(/^```json\s*/,"").replace(/```$/,"").trim();
    return NextResponse.json(JSON.parse(text));
  }catch(error){
    console.error(error);
    return NextResponse.json({error:"Commitment review failed."},{status:500});
  }
}
