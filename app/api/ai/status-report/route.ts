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
    const {projectId,reportType="weekly"}=await req.json();
    const sb=await createClient();

    const {data:project}=await sb.from("projects").select("*").eq("id",projectId).single();
    if(!project) return NextResponse.json({error:"Project not found"},{status:404});

    const [
      {data:raid=[]},
      {data:milestones=[]},
      {data:dependencies=[]},
      {data:snapshots=[]},
      {data:reports=[]}
    ]=await Promise.all([
      sb.from("raid_items").select("*").eq("project_id",projectId),
      sb.from("milestones").select("*").eq("project_id",projectId),
      sb.from("dependencies").select("*").eq("project_id",projectId),
      sb.from("delivery_snapshots").select("*").eq("project_id",projectId).order("created_at",{ascending:false}).limit(3),
      sb.from("status_reports").select("report_json,created_at").eq("project_id",projectId).order("created_at",{ascending:false}).limit(1)
    ]);

    const prompt=`You are DeliverIQ, a senior programme manager preparing an executive ${reportType} status report.

Use ONLY the supplied project data. Do not invent achievements, dates, progress percentages,
decisions, owners, blockers or milestones. If evidence is missing, say that clearly.
Separate facts from interpretation and keep the tone concise and executive-ready.

PROJECT:
${JSON.stringify(project)}

RAID:
${JSON.stringify(raid)}

MILESTONES:
${JSON.stringify(milestones)}

DEPENDENCIES:
${JSON.stringify(dependencies)}

RECENT DELIVERY SNAPSHOTS:
${JSON.stringify(snapshots)}

PREVIOUS STATUS REPORT:
${JSON.stringify(reports[0] || null)}

Return JSON only with exactly these fields:
report_title: string
reporting_period: string
overall_health: GREEN | AMBER | RED
executive_summary: string
achievements: string[]
current_status: string[]
top_risks_issues: array of {title,type,impact,mitigation_or_action}
decisions_required: array of {decision,why_needed,owner_or_forum}
milestones: array of {name,status,comment}
dependencies_attention: array of {dependency,status,impact,action}
next_week_priorities: string[]
executive_asks: string[]
what_changed_since_last_report: string[]
confidence_note: string

Keep the report compact enough for a steering committee.
If a section has no supported content, return an empty array rather than inventing content.`;

    const result=await openai.responses.create({
      model:process.env.OPENAI_MODEL || "gpt-5-mini",
      input:prompt
    });

    let text=result.output_text.trim();
    if(text.startsWith("```")) text=text.replace(/^```json\s*/,"").replace(/```$/,"").trim();

    return NextResponse.json(JSON.parse(text));
  }catch(error){
    console.error(error);
    return NextResponse.json({error:"Status report generation failed."},{status:500});
  }
}
