import { NextRequest, NextResponse } from "next/server";
import { getLLMProvider } from "@/lib/llm";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { transcript, topic } = await req.json();

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
    }

    const provider = getLLMProvider();
    console.log(`[Lectra] Using LLM provider: ${provider.name}`);

    const result = await provider.generateNotes(transcript, topic?.trim() || undefined);

    // Validate required fields
    if (!result.title || !result.notes || !result.summary || !result.keyTakeaways || !result.mermaid) {
      return NextResponse.json(
        { error: "Provider returned incomplete data", raw: result },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ...result,
      provider: provider.name,
    });
  } catch (error: unknown) {
    console.error("[Generate API Error]", error);
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
