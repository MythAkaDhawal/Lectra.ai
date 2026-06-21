import OpenAI from "openai";
import type { TranscriptionProvider, TranscriptionResult } from "./index";

export class WhisperProvider implements TranscriptionProvider {
  name = "OpenAI Whisper";
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string) {
    const isNvidia = apiKey.startsWith("nvapi-");
    const baseURL = isNvidia ? "https://integrate.api.nvidia.com/v1" : undefined;
    this.client = new OpenAI({ apiKey, baseURL });
    this.model = process.env.TRANSCRIPTION_MODEL ?? (isNvidia ? "nvidia/whisper-large-v3" : "whisper-1");
    if (isNvidia) {
      this.name = "NVIDIA Whisper";
    }
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
