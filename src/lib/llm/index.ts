/**
 * LLM Provider Interface
 * Swap the active provider by changing LLM_PROVIDER in .env.local
 * Supported: "groq" | "openai" | "openrouter" | "mock"
 */

export interface NoteSection {
  heading: string;
  bullets: string[];
}

export interface GeneratedNotes {
  title: string;
  notes: NoteSection[];
  summary: string;
  keyTakeaways: string[];
  mermaid: string;
}

export interface LLMProvider {
  /** Display name for logging / error messages */
  name: string;
  /** Generate structured notes from a transcript */
  generateNotes(transcript: string, topic?: string): Promise<GeneratedNotes>;
}

// ─── Shared prompt ───────────────────────────────────────────
// Exported so all providers can use the same schema instructions

export const NOTES_SYSTEM_PROMPT = `You are Lectra, an expert academic note-taker. Given a lecture transcript, produce highly structured, student-friendly study notes.

Respond with ONLY a valid JSON object matching this exact schema (no markdown fences, no prose outside JSON):

{
  "title": "string — concise, descriptive lecture title",
  "notes": [
    { "heading": "string", "bullets": ["string", "string"] }
  ],
  "summary": "string — 2-4 sentence summary of the lecture",
  "keyTakeaways": ["string", "string"],
  "mermaid": "string — valid Mermaid flowchart (flowchart LR) of main concepts. Short labels (<30 chars). Simple IDs like A, B, C."
}

Rules: 3-6 note sections (2-5 bullets each), 3-5 key takeaways, valid Mermaid syntax only.`;

/** Clean markdown code blocks / fences from LLM responses if present */
export function cleanJsonString(str: string): string {
  let cleaned = str.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/i, "");
    cleaned = cleaned.replace(/\n?```$/, "");
  }
  return cleaned.trim();
}

// ─── Factory ─────────────────────────────────────────────────

import { getConfiguredLLMProvider, requireEnv } from "@/lib/env";
import { GroqProvider } from "./groq";
import { OpenRouterProvider } from "./openrouter";
import { OpenAIProvider } from "./openai";
import { MockLLMProvider } from "./mock";

export type LLMProviderName = "groq" | "openai" | "openrouter" | "mock";

export function getLLMProvider(): LLMProvider {
  const requested = getConfiguredLLMProvider();

  switch (requested) {
    case "groq":
      return new GroqProvider(requireEnv("GROQ_API_KEY", "LLM"));

    case "openai":
      return new OpenAIProvider(requireEnv("OPENAI_API_KEY", "LLM"));

    case "openrouter":
      return new OpenRouterProvider(requireEnv("OPENROUTER_API_KEY", "LLM"));

    case "mock":
      return new MockLLMProvider();
  }
}
