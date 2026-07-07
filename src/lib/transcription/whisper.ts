import OpenAI from "openai";
import type { TranscriptionProvider, TranscriptionResult } from "./index";

export class WhisperProvider implements TranscriptionProvider {
  name = "OpenAI Whisper";
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
    this.model = process.env.TRANSCRIPTION_MODEL ?? "whisper-1";
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
