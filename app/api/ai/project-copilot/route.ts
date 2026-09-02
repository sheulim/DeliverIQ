import OpenAI from "openai";import {NextRequest,NextResponse} from "next/server";import {createClient} from "@/lib/supabase/server";
function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}
export async function POST(req:NextRequest){
  const openai = getOpenAI();
  if (!openai) {
    return Response.json({ error: "AI service is not configured for this review deployment." }, { status: 503 });
  }try{const {projectId,question}=await req.json();const sb=await createClient();const {data:{user}}=await sb.auth.getUser();if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});const {data:project}=await sb.from("projects").select("*").eq("id",projectId).single();if(!project)return NextResponse.json({error:"Project not found"},{status:404});
const tables=["raid_items","milestones","dependencies","actions","decisions","meetings","stakeholders","communications","benefits","okrs","resources","capacity_periods","project_budgets","cost_entries","change_requests","requirements"];
const ctx:any={project};for(const table of tables){const {data}=await sb.from(table).select("*").eq("project_id",projectId).limit(100);ctx[table]=data||[]}
const prompt=`You are DeliverIQ Project Copilot. Answer the user's project-management question using ONLY supplied context. Be concise, evidence-based and transparent about unknowns. Never claim to have changed project records. QUESTION:${question}\nCONTEXT:${JSON.stringify(ctx)}`;
const result=await openai.responses.create({model:process.env.OPENAI_MODEL||"gpt-5-mini",input:prompt});return NextResponse.json({answer:result.output_text});}catch(e){console.error(e);return NextResponse.json({error:"Copilot failed."},{status:500})}}
