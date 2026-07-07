import { NextRequest, NextResponse } from "next/server";
import { getLLMProvider } from "@/lib/llm";
import type { ApiErrorResponse, GenerateResponse, GeneratedNotes } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

function isGeneratedNotes(result: unknown): result is GeneratedNotes {
  if (!result || typeof result !== "object") return false;
  const notes = result as Partial<GeneratedNotes>;

  return Boolean(
    notes.title &&
      Array.isArray(notes.notes) &&
      notes.notes.every((section) => section.heading && Array.isArray(section.bullets)) &&
      notes.summary &&
      Array.isArray(notes.keyTakeaways) &&
      notes.mermaid
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { transcript?: unknown; topic?: unknown };
    const { transcript, topic } = body;

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json<ApiErrorResponse>({ error: "No transcript provided" }, { status: 400 });
    }

    const provider = getLLMProvider();
    console.log(`[Lectra] Using LLM provider: ${provider.name}`);

    const result = await provider.generateNotes(
      transcript,
      typeof topic === "string" ? topic.trim() || undefined : undefined
    );

    // Validate required fields
    if (!isGeneratedNotes(result)) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Provider returned incomplete data. Please retry or choose a different LLM provider." },
        { status: 500 }
      );
    }

    return NextResponse.json<GenerateResponse>({
      ...result,
      provider: provider.name,
    });
  } catch (error: unknown) {
    console.error("[Generate API Error]", error);
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json<ApiErrorResponse>({ error: message }, { status: 500 });
  }
}
