import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export async function POST(req: NextRequest) {
  const openai = getOpenAI();
  if (!openai) {
    return Response.json({ error: "AI service is not configured for this review deployment." }, { status: 503 });
  }
  try {
    const { projectId } = await req.json();
    const supabase = await createClient();

    const { data: project } = await supabase
      .from("projects").select("*").eq("id", projectId).single();

    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const { data: raid = [] } = await supabase
      .from("raid_items")
      .select("item_type,title,description,mitigation")
      .eq("project_id", projectId);

    const prompt = `You are DeliverIQ, a senior delivery risk reviewer.
Review this saved project and its existing RAID. Suggest up to five NEW risks only.
Avoid duplicates. For each risk provide title, description, owner_role,
probability 1-5, impact 1-5, and mitigation.
Project: ${JSON.stringify(project)}
Existing RAID: ${JSON.stringify(raid)}`;

    const result = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      input: prompt
    });

    return NextResponse.json({ suggestions: result.output_text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "AI risk analysis failed." }, { status: 500 });
  }
}
