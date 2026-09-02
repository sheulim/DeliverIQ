import OpenAI from "openai";
import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
import {fullPlaybooks} from "@/lib/content/fullPlaybooks";
import {templateCatalog} from "@/lib/content/templateCatalog";

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
    const {question,projectId,useWeb=true}=await req.json();
    if(!question?.trim()) return NextResponse.json({error:"Question is required."},{status:400});
    const sb=await createClient();
    const {data:{user}}=await sb.auth.getUser();

    let projectContext:any=null;
    if(projectId && user){
      const {data:project}=await sb.from("projects").select("*").eq("id",projectId).single();
      if(project){
        const tables=["raid_items","milestones","dependencies","actions","decisions","meetings","stakeholders","benefits","okrs","resources","capacity_periods","project_budgets","cost_entries","change_requests","requirements"];
        projectContext={project};
        for(const table of tables){
          const {data}=await sb.from(table).select("*").eq("project_id",projectId).limit(60);
          projectContext[table]=data||[];
        }
      }
    }

    const system=`You are DeliverIQ Agile Assistant, a practical expert assistant for Scrum Masters, Delivery Managers, Project Managers, Program Managers and Portfolio Managers.
You help with Scrum, Kanban, Agile, hybrid delivery, project governance, RAID, dependencies, metrics, ceremonies, stakeholder management, RACI, programme delivery, portfolio governance, capacity, value, change, financial delivery governance and technical/data migration delivery.

Rules:
- Prefer practical, actionable guidance over theory.
- When project context is supplied, clearly distinguish facts in that context from general advice.
- Never invent project facts, owners, dates, decisions or metrics.
- Do not present velocity as an individual performance measure.
- For Scrum questions, do not imply practices are mandatory unless the Scrum Guide or user's organisation requires them.
- If current/up-to-date information is requested and web search is available, use it.
- When useful, point the user to an appropriate DeliverIQ playbook or template by name.
- Be concise but substantive.

DELIVERIQ PLAYBOOKS:
${JSON.stringify(fullPlaybooks)}

DELIVERIQ TEMPLATE CATALOG:
${JSON.stringify(templateCatalog)}

CURRENT PROJECT CONTEXT (may be null):
${JSON.stringify(projectContext)}`;

    const tools:any[] = useWeb ? [{type:"web_search"}] : [];
    const result=await openai.responses.create({
      model:process.env.OPENAI_ASSISTANT_MODEL||process.env.OPENAI_MODEL||"gpt-5.6-luna",
      instructions:system,
      input:String(question),
      tools
    } as any);
    return NextResponse.json({answer:result.output_text});
  }catch(e){console.error(e);return NextResponse.json({error:"Agile Assistant failed to respond."},{status:500})}
}
