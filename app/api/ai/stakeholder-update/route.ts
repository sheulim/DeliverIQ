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
    const {projectId,stakeholderId,audienceType="executive",communicationType="status_update",purpose}=await req.json();
    const sb=await createClient();

    const {data:project}=await sb.from("projects").select("*").eq("id",projectId).single();
    if(!project)return NextResponse.json({error:"Project not found"},{status:404});

    const stakeholderIdValue = stakeholderId || null;
    const {data:stakeholder}=stakeholderIdValue
      ? await sb.from("stakeholders").select("*").eq("id",stakeholderIdValue).single()
      : {data:null};

    const [
      {data:raid=[]},
      {data:milestones=[]},
      {data:dependencies=[]},
      {data:actions=[]},
      {data:decisions=[]},
      {data:snapshots=[]},
      {data:reports=[]}
    ]=await Promise.all([
      sb.from("raid_items").select("*").eq("project_id",projectId),
      sb.from("milestones").select("*").eq("project_id",projectId),
      sb.from("dependencies").select("*").eq("project_id",projectId),
      sb.from("actions").select("*").eq("project_id",projectId),
      sb.from("decisions").select("*").eq("project_id",projectId),
      sb.from("delivery_snapshots").select("*").eq("project_id",projectId).order("created_at",{ascending:false}).limit(2),
      sb.from("status_reports").select("*").eq("project_id",projectId).order("created_at",{ascending:false}).limit(1)
    ]);

    const prompt=`You are DeliverIQ, a senior stakeholder communications copilot.

Create a concise communication grounded only in the supplied project data.
Do not invent progress, dates, risks, decisions, owners, or achievements.
Adapt tone and level of detail to the audience.

PROJECT:
${JSON.stringify(project)}

STAKEHOLDER:
${JSON.stringify(stakeholder)}

AUDIENCE TYPE:
${audienceType}

COMMUNICATION TYPE:
${communicationType}

PURPOSE:
${purpose || "Provide a relevant project update."}

RAID:
${JSON.stringify(raid)}

MILESTONES:
${JSON.stringify(milestones)}

DEPENDENCIES:
${JSON.stringify(dependencies)}

ACTIONS:
${JSON.stringify(actions)}

DECISIONS:
${JSON.stringify(decisions)}

RECENT SNAPSHOTS:
${JSON.stringify(snapshots)}

LATEST STATUS REPORT:
${JSON.stringify(reports[0] || null)}

Return JSON only with:
subject: string
opening: string
key_messages: string[]
risks_or_concerns: string[]
decisions_or_asks: string[]
next_steps: string[]
body: string
tone: string
confidence_note: string

Keep it ready for human review and editing.`;

    const result=await openai.responses.create({
      model:process.env.OPENAI_MODEL||"gpt-5-mini",
      input:prompt
    });

    let text=result.output_text.trim();
    if(text.startsWith("```")) text=text.replace(/^```json\s*/,"").replace(/```$/,"").trim();
    return NextResponse.json(JSON.parse(text));
  }catch(error){
    console.error(error);
    return NextResponse.json({error:"Stakeholder communication generation failed."},{status:500});
  }
}
