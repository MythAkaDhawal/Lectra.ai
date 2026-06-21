import type { LLMProvider, GeneratedNotes } from "./index";
import { NOTES_SYSTEM_PROMPT, cleanJsonString } from "./index";

/**
 * OpenRouter provider — drop-in swap for Groq.
 * Set LLM_PROVIDER=openrouter and OPENROUTER_API_KEY in .env.local.
 *
 * OpenRouter exposes an OpenAI-compatible API, so we use fetch directly
 * to avoid adding the openai SDK just for this provider.
 *
 * Default model: meta-llama/llama-3.3-70b-instruct (free tier)
 * Change via OPENROUTER_MODEL env var.
 */
export class OpenRouterProvider implements LLMProvider {
  name = "OpenRouter";
  private apiKey: string;
  private model: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.model = process.env.OPENROUTER_MODEL ?? "meta-llama/llama-3.3-70b-instruct:free";
  }

  async generateNotes(transcript: string, topic?: string): Promise<GeneratedNotes> {
    const userContent = topic
      ? `Topic: ${topic}\n\nTranscript:\n${transcript}`
      : `Transcript:\n${transcript}`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
        "X-Title": "Lectra",
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: "system", content: NOTES_SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        temperature: 0.3,
        max_tokens: 4096,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OpenRouter error ${res.status}: ${text}`);
    }

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty response from OpenRouter");

    return JSON.parse(cleanJsonString(content)) as GeneratedNotes;
  }
}
