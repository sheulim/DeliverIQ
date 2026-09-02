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
    const {projectId,meetingType,title,meetingDate,attendees,notes}=await req.json();
    const sb=await createClient();

    const {data:project}=await sb.from("projects").select("*").eq("id",projectId).single();
    if(!project)return NextResponse.json({error:"Project not found"},{status:404});

    const [{data:actions=[]},{data:decisions=[]},{data:raid=[]},{data:dependencies=[]}]=await Promise.all([
      sb.from("actions").select("*").eq("project_id",projectId),
      sb.from("decisions").select("*").eq("project_id",projectId),
      sb.from("raid_items").select("*").eq("project_id",projectId),
      sb.from("dependencies").select("*").eq("project_id",projectId)
    ]);

    const prompt=`You are DeliverIQ, a senior project governance copilot.

Turn raw meeting notes into concise, structured meeting minutes.
Use only the meeting notes and supplied project context.
Do not invent actions, decisions, dates, owners, or conclusions.
If an owner or due date is not stated, return null.
Avoid duplicating existing actions/decisions where clearly identifiable.

PROJECT:
${JSON.stringify(project)}

MEETING:
Type: ${meetingType}
Title: ${title}
Date: ${meetingDate || "Not supplied"}
Attendees: ${JSON.stringify(attendees || [])}

RAW NOTES:
${notes}

EXISTING ACTIONS:
${JSON.stringify(actions)}

EXISTING DECISIONS:
${JSON.stringify(decisions)}

CURRENT RAID:
${JSON.stringify(raid)}

DEPENDENCIES:
${JSON.stringify(dependencies)}

Return JSON only with:
meeting_summary: string
key_discussion_points: string[]
actions: array of {title,description,owner,due_date,priority,source_note}
decisions: array of {title,decision,context,rationale,owner_or_forum,due_date,impact}
risks_or_issues_raised: array of {type,title,description,owner,impact,mitigation_or_action}
dependencies_raised: string[]
follow_up_questions: string[]
executive_takeaways: string[]
what_changed: string[]
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
    return NextResponse.json({error:"Meeting minutes generation failed."},{status:500});
  }
}
