import OpenAI from "openai";
import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
import {dependencyCriticality,simulateDate} from "@/lib/delivery/dependency";

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
    const {dependencyId,slipDays=10}=await req.json();
    const sb=await createClient();
    const {data:{user}}=await sb.auth.getUser();
    if(!user) return NextResponse.json({error:"Unauthorized"},{status:401});

    const {data:dependency}=await sb.from("dependencies").select("*").eq("id",dependencyId).single();
    if(!dependency) return NextResponse.json({error:"Dependency not found"},{status:404});

    const [{data:project},{data:milestone},{data:downstreamProject},{data:childDeps=[]}]=await Promise.all([
      sb.from("projects").select("*").eq("id",dependency.project_id).single(),
      dependency.milestone_id ? sb.from("milestones").select("*").eq("id",dependency.milestone_id).single() : Promise.resolve({data:null}),
      dependency.downstream_project_id ? sb.from("projects").select("*").eq("id",dependency.downstream_project_id).single() : Promise.resolve({data:null}),
      sb.from("dependencies").select("*").eq("upstream_dependency_id",dependencyId)
    ]);

    const programmeId = project?.programme_id || downstreamProject?.programme_id || null;
    const {data:programme}=programmeId
      ? await sb.from("programmes").select("*").eq("id",programmeId).single()
      : {data:null};

    const affectedProjectIds = Array.from(new Set(
      [dependency.project_id,dependency.downstream_project_id,...childDeps.map((d:any)=>d.downstream_project_id)]
        .filter(Boolean)
    ));

    const {data:affectedProjects=[]}=affectedProjectIds.length
      ? await sb.from("projects").select("*").in("id",affectedProjectIds)
      : {data:[]};

    const {data:affectedMilestones=[]}=affectedProjectIds.length
      ? await sb.from("milestones").select("*").in("project_id",affectedProjectIds)
      : {data:[]};

    const criticality=dependencyCriticality(dependency,milestone,downstreamProject);
    const projectedDependencyDate=simulateDate(dependency.due_date,Number(slipDays));

    const deterministic={
      slip_days:Number(slipDays),
      dependency_criticality:criticality,
      projected_dependency_date:projectedDependencyDate,
      explicitly_linked_milestone: milestone || null,
      downstream_project: downstreamProject || null,
      direct_child_dependencies: childDeps,
      affected_projects: affectedProjects,
      affected_milestones: affectedMilestones
    };

    const prompt=`You are DeliverIQ, a senior programme delivery impact analyst.

Analyse a schedule-slip scenario using ONLY the supplied data.
Do not claim that a milestone will definitely slip unless there is explicit dependency linkage supporting that conclusion.
Separate:
- directly linked impacts
- plausible downstream pressure
- unknowns requiring validation

SCENARIO:
Dependency slips by ${slipDays} days.

DEPENDENCY:
${JSON.stringify(dependency)}

SOURCE PROJECT:
${JSON.stringify(project)}

PROGRAMME:
${JSON.stringify(programme)}

DETERMINISTIC IMPACT CONTEXT:
${JSON.stringify(deterministic)}

Return JSON only with:
scenario_summary: string
severity: LOW | MEDIUM | HIGH | CRITICAL
direct_impacts: string[]
potential_downstream_impacts: string[]
projects_affected: array of {project_id,project_name,impact,confidence}
milestones_at_risk: array of {milestone_name,project_name,impact,confidence}
critical_path_signal: string
assumptions_and_unknowns: string[]
recommended_actions: string[]
escalation_recommendation: string
executive_message: string

Be cautious and evidence-based.`;

    const result=await openai.responses.create({
      model:process.env.OPENAI_MODEL || "gpt-5-mini",
      input:prompt
    });

    let text=result.output_text.trim();
    if(text.startsWith("```")) text=text.replace(/^```json\s*/,"").replace(/```$/,"").trim();
    const analysis=JSON.parse(text);

    const {data:simulation,error}=await sb.from("impact_simulations").insert({
      user_id:user.id,
      programme_id:programmeId,
      project_id:dependency.project_id,
      dependency_id:dependencyId,
      scenario_type:"dependency_slip",
      slip_days:Number(slipDays),
      assumptions_json:{deterministic},
      result_json:analysis
    }).select().single();

    if(error) throw error;

    return NextResponse.json({deterministic,analysis,simulation_id:simulation.id});
  }catch(error){
    console.error(error);
    return NextResponse.json({error:"Impact simulation failed."},{status:500});
  }
}
