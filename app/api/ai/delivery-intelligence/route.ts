import OpenAI from "openai";
import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
import {calculateSnapshot} from "@/lib/delivery/snapshot";

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
    if(!project) return NextResponse.json({error:"Project not found"},{status:404});

    const [{data:raid=[]},{data:milestones=[]},{data:dependencies=[]},{data:snapshots=[]}]=await Promise.all([
      sb.from("raid_items").select("*").eq("project_id",projectId),
      sb.from("milestones").select("*").eq("project_id",projectId),
      sb.from("dependencies").select("*").eq("project_id",projectId),
      sb.from("delivery_snapshots").select("*").eq("project_id",projectId).order("created_at",{ascending:false}).limit(6)
    ]);

    const current=calculateSnapshot(project,raid,milestones,dependencies);
    const previous=snapshots[0] || null;

    const changes=previous ? {
      risks: current.open_risks - previous.open_risks,
      high_risks: current.high_risks - previous.high_risks,
      issues: current.open_issues - previous.open_issues,
      dependencies: current.open_dependencies - previous.open_dependencies,
      overdue_dependencies: current.overdue_dependencies - previous.overdue_dependencies,
      overdue_milestones: current.overdue_milestones - previous.overdue_milestones,
      ageing_raid: current.ageing_raid - previous.ageing_raid,
      confidence: current.delivery_confidence - (previous.delivery_confidence ?? current.delivery_confidence)
    } : null;

    const prompt=`You are DeliverIQ, a senior programme delivery intelligence copilot.

Your job is to explain observed delivery trends and likely pressure points.
Do not claim certainty or invent data.
Use phrases such as "signal", "may indicate", or "watch" for inferences.

PROJECT:
${JSON.stringify(project)}

CURRENT SNAPSHOT:
${JSON.stringify(current)}

PREVIOUS SNAPSHOT:
${JSON.stringify(previous)}

CHANGES:
${JSON.stringify(changes)}

RAID:
${JSON.stringify(raid)}

MILESTONES:
${JSON.stringify(milestones)}

DEPENDENCIES:
${JSON.stringify(dependencies)}

Return JSON only with:
headline: short sentence
confidence_label: HIGH | MEDIUM | LOW
confidence_explanation: concise explanation
what_changed: array of strings
deteriorating_signals: array of strings
improving_signals: array of strings
predictive_watchlist: array of {signal,why_it_matters,watch_for,recommended_action}
executive_summary: concise paragraph
next_actions: array of strings

Keep predictive_watchlist to 5 items maximum.`;

    const result=await openai.responses.create({
      model:process.env.OPENAI_MODEL || "gpt-5-mini",
      input:prompt
    });

    let text=result.output_text.trim();
    if(text.startsWith("```")) text=text.replace(/^```json\s*/,"").replace(/```$/,"").trim();
    const parsed=JSON.parse(text);

    return NextResponse.json({
      current_snapshot:current,
      previous_snapshot:previous,
      changes,
      intelligence:parsed
    });
  }catch(error){
    console.error(error);
    return NextResponse.json({error:"Delivery intelligence analysis failed."},{status:500});
  }
}
