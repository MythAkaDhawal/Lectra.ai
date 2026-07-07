import Groq from "groq-sdk";
import type { TranscriptionProvider, TranscriptionResult } from "./index";

export class GroqTranscriptionProvider implements TranscriptionProvider {
  name = "Groq Whisper";
  private client: Groq;
  private model: string;

  constructor(apiKey: string) {
    this.client = new Groq({ apiKey });
    this.model = process.env.TRANSCRIPTION_MODEL ?? "whisper-large-v3-turbo";
  }

  async transcribe(file: File): Promise<TranscriptionResult> {
    const response = await this.client.audio.transcriptions.create({
      file,
      model: this.model,
      language: "en",
      response_format: "verbose_json",
    });

    return {
      transcript: response.text,
      language: (response as { language?: string }).language,
    };
  }
}
