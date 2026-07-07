import Groq from "groq-sdk";
import type { LLMProvider, GeneratedNotes } from "./index";
import { NOTES_SYSTEM_PROMPT, cleanJsonString } from "./index";

export class GroqProvider implements LLMProvider {
  name = "Groq (llama-3.3-70b)";
  private client: Groq;
  private model: string;

  constructor(apiKey: string) {
    this.client = new Groq({ apiKey });
    this.model = process.env.GROQ_LLM_MODEL ?? "llama-3.3-70b-versatile";
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
    if (!content) throw new Error("Empty response from Groq");

    return JSON.parse(cleanJsonString(content)) as GeneratedNotes;
  }
}
