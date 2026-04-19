import Groq from "groq-sdk";
import type { LLMProvider, GeneratedNotes } from "./index";
import { NOTES_SYSTEM_PROMPT } from "./index";

export class GroqProvider implements LLMProvider {
  name = "Groq (llama-3.3-70b)";
  private client: Groq;

  constructor(apiKey: string) {
    this.client = new Groq({ apiKey });
  }

  async generateNotes(transcript: string, topic?: string): Promise<GeneratedNotes> {
    const userContent = topic
      ? `Topic: ${topic}\n\nTranscript:\n${transcript}`
      : `Transcript:\n${transcript}`;

    const completion = await this.client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: NOTES_SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      temperature: 0.3,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("Empty response from Groq");

    return JSON.parse(content) as GeneratedNotes;
  }
}
