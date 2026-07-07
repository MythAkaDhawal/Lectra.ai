import OpenAI from "openai";
import type { GeneratedNotes, LLMProvider } from "./index";
import { NOTES_SYSTEM_PROMPT, cleanJsonString } from "./index";

export class OpenAIProvider implements LLMProvider {
  name = "OpenAI";
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
    this.model = process.env.OPENAI_LLM_MODEL ?? "gpt-4o-mini";
  }

  async generateNotes(transcript: string, topic?: string): Promise<GeneratedNotes> {
    const userContent = topic
      ? `Topic: ${topic}\n\nTranscript:\n${transcript}`
      : `Transcript:\n${transcript}`;

    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: NOTES_SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      temperature: 0.3,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("Empty response from OpenAI");

    return JSON.parse(cleanJsonString(content)) as GeneratedNotes;
  }
}
