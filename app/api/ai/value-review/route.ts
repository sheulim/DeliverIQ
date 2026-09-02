import OpenAI from "openai";
import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
import {aggregateValueScore} from "@/lib/delivery/value";

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
      {data:benefits=[]},
      {data:okrs=[]},
      {data:milestones=[]},
      {data:raid=[]},
      {data:snapshots=[]}
    ]=await Promise.all([
      sb.from("benefits").select("*").eq("project_id",projectId),
      sb.from("okrs").select("*").eq("project_id",projectId),
      sb.from("milestones").select("*").eq("project_id",projectId),
      sb.from("raid_items").select("*").eq("project_id",projectId),
      sb.from("delivery_snapshots").select("*").eq("project_id",projectId).order("created_at",{ascending:false}).limit(2)
    ]);

    const deterministicValueScore=aggregateValueScore(benefits,okrs);

    const prompt=`You are DeliverIQ, a senior benefits-realisation and transformation governance copilot.

Evaluate whether this project is delivering intended business value.
Use only supplied data. Do not invent realised benefits, financial impact, KPI movement or business outcomes.
Distinguish clearly between:
- planned value
- measured realised value
- delivery progress
- assumptions / missing evidence

PROJECT:
${JSON.stringify(project)}

BENEFITS:
${JSON.stringify(benefits)}

OKRS:
${JSON.stringify(okrs)}

MILESTONES:
${JSON.stringify(milestones)}

RAID:
${JSON.stringify(raid)}

RECENT DELIVERY SNAPSHOTS:
${JSON.stringify(snapshots)}

DETERMINISTIC VALUE SCORE:
${JSON.stringify(deterministicValueScore)}

Return JSON only with:
headline: string
value_health: GREEN | AMBER | RED
value_score: integer 0-100 or null
executive_summary: string
benefits_on_track: string[]
benefits_at_risk: array of {benefit,reason,recommended_action}
okr_signals: string[]
delivery_vs_value_gap: string[]
evidence_gaps: string[]
recommended_actions: string[]
executive_questions: string[]
confidence_note: string

Do not infer business value from delivery completion alone.`;

    const result=await openai.responses.create({
      model:process.env.OPENAI_MODEL||"gpt-5-mini",
      input:prompt
    });

    let text=result.output_text.trim();
    if(text.startsWith("```")) text=text.replace(/^```json\s*/,"").replace(/```$/,"").trim();
    const review=JSON.parse(text);

    await sb.from("value_reviews").insert({
      user_id:user.id,
      project_id:projectId,
      programme_id:project.programme_id||null,
      value_score:review.value_score ?? deterministicValueScore,
      review_json:review
    });

    return NextResponse.json({deterministic_value_score:deterministicValueScore,review});
  }catch(error){
    console.error(error);
    return NextResponse.json({error:"Value realisation review failed."},{status:500});
  }
}
