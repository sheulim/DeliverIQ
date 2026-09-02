import OpenAI from "openai";
import {NextRequest,NextResponse} from "next/server";

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
    const {description,answers,mode}=await req.json();
    const prompt=`You are DeliverIQ, a senior programme and delivery management copilot.
Project description: ${description}
Answers: ${JSON.stringify(answers||{})}
Mode: ${mode}
Create a practical delivery blueprint. Include project name/type/methodology/duration/team_count/objectives/scope/key_constraint,
milestones, realistic RAID items, dependencies, governance and recommended KPIs.
If facts are unknown, use sensible assumptions and avoid inventing precise dates. Return JSON only.`;

    const response=await openai.responses.create({
      model:process.env.OPENAI_MODEL||"gpt-5-mini",
      input:prompt
    });

    let text=response.output_text.trim();
    if(text.startsWith("```")) text=text.replace(/^```json\s*/,"").replace(/```$/,"").trim();
    return NextResponse.json(JSON.parse(text));
  }catch(error){
    console.error(error);
    return NextResponse.json({error:"AI project generation failed. Check your OpenAI configuration."},{status:500});
  }
}
