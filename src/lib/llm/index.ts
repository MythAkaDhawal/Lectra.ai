/**
 * LLM Provider Interface
 * Swap the active provider by changing LLM_PROVIDER in .env.local
 * Supported: "groq" | "openrouter" | "mock"
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

// ─── Factory ─────────────────────────────────────────────────

import { GroqProvider } from "./groq";
import { OpenRouterProvider } from "./openrouter";
import { MockLLMProvider } from "./mock";

export type LLMProviderName = "groq" | "openrouter" | "mock";

export function getLLMProvider(): LLMProvider {
  const hasGroq = Boolean(process.env.GROQ_API_KEY);
  const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY);

  const requested =
    (process.env.LLM_PROVIDER as LLMProviderName | undefined) ??
    (hasGroq ? "groq" : hasOpenRouter ? "openrouter" : "mock");

  switch (requested) {
    case "groq":
      if (!hasGroq) {
        console.warn("[Lectra] GROQ_API_KEY missing — falling back to mock LLM");
        return new MockLLMProvider();
      }
      return new GroqProvider(process.env.GROQ_API_KEY!);

    case "openrouter":
      if (!hasOpenRouter) {
        console.warn("[Lectra] OPENROUTER_API_KEY missing — falling back to mock LLM");
        return new MockLLMProvider();
      }
      return new OpenRouterProvider(process.env.OPENROUTER_API_KEY!);

    case "mock":
      return new MockLLMProvider();

    default:
      console.warn(`[Lectra] Unknown LLM provider "${requested}" — using mock`);
      return new MockLLMProvider();
  }
}
