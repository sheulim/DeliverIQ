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
    const {programmeId}=await req.json();
    const sb=await createClient();

    const {data:programme}=await sb.from("programmes").select("*").eq("id",programmeId).single();
    if(!programme) return NextResponse.json({error:"Programme not found"},{status:404});

    const {data:projects=[]}=await sb.from("projects").select("*").eq("programme_id",programmeId);
    const ids=projects.map((p:any)=>p.id);

    if(ids.length===0) return NextResponse.json({error:"No projects assigned to programme."},{status:400});

    const [{data:raid=[]},{data:dependencies=[]},{data:milestones=[]},{data:snapshots=[]},{data:priorReviews=[]}]=await Promise.all([
      sb.from("raid_items").select("*").in("project_id",ids),
      sb.from("dependencies").select("*").in("project_id",ids),
      sb.from("milestones").select("*").in("project_id",ids),
      sb.from("delivery_snapshots").select("*").in("project_id",ids).order("created_at",{ascending:false}),
      sb.from("programme_reviews").select("*").eq("programme_id",programmeId).order("created_at",{ascending:false}).limit(1)
    ]);

    const prompt=`You are DeliverIQ, a senior programme director reviewing a multi-project programme.

Ground every conclusion in the supplied data.
Do not invent project status, dates, impact, ownership or dependencies.
Identify cross-project patterns and systemic issues only where the data supports them.
Use cautious language for inference.

PROGRAMME:
${JSON.stringify(programme)}

PROJECTS:
${JSON.stringify(projects)}

RAID ACROSS PROGRAMME:
${JSON.stringify(raid)}

DEPENDENCIES:
${JSON.stringify(dependencies)}

MILESTONES:
${JSON.stringify(milestones)}

DELIVERY SNAPSHOTS:
${JSON.stringify(snapshots)}

PREVIOUS PROGRAMME REVIEW:
${JSON.stringify(priorReviews[0] || null)}

Return JSON only with:
overall_health: GREEN | AMBER | RED
delivery_confidence: integer 0-100
executive_summary: string
projects_needing_attention: array of {project_id,project_name,reason,recommended_intervention}
systemic_risks: array of {theme,evidence,programme_impact,recommended_action}
dependency_hotspots: array of {dependency_or_theme,projects_affected,why_it_matters,action}
cross_project_signals: string[]
decisions_required: array of {decision,why_needed,owner_or_forum}
portfolio_priorities: string[]
what_changed: string[]
confidence_note: string

Limit each array to the most important items.`;

    const result=await openai.responses.create({
      model:process.env.OPENAI_MODEL || "gpt-5-mini",
      input:prompt
    });

    let text=result.output_text.trim();
    if(text.startsWith("```")) text=text.replace(/^```json\s*/,"").replace(/```$/,"").trim();
    const review=JSON.parse(text);

    const {data:{user}}=await sb.auth.getUser();
    if(user){
      await sb.from("programme_reviews").insert({
        programme_id:programmeId,
        user_id:user.id,
        overall_health:review.overall_health,
        delivery_confidence:review.delivery_confidence,
        review_json:review
      });
    }

    return NextResponse.json(review);
  }catch(error){
    console.error(error);
    return NextResponse.json({error:"Programme review failed."},{status:500});
  }
}
