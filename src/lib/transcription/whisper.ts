import OpenAI from "openai";
import type { TranscriptionProvider, TranscriptionResult } from "./index";

export class WhisperProvider implements TranscriptionProvider {
  name = "OpenAI Whisper";
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async transcribe(file: File): Promise<TranscriptionResult> {
    const response = await this.client.audio.transcriptions.create({
      file,
      model: "whisper-1",
      language: "en",
      response_format: "verbose_json",
    });

    return {
      transcript: response.text,
      language: response.language,
    };
  }
}
