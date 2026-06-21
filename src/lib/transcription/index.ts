/**
 * Transcription Provider Interface
 * Swap the active provider by changing TRANSCRIPTION_PROVIDER in .env.local
 * Supported: "whisper" | "mock"
 */

export interface TranscriptionResult {
  transcript: string;
  /** Detected language (if supported by provider) */
  language?: string;
}

export interface TranscriptionProvider {
  /** Display name for logging / error messages */
  name: string;
  /** Transcribe an audio File and return the result */
  transcribe(file: File): Promise<TranscriptionResult>;
}

// ─── Factory ────────────────────────────────────────────────

import { WhisperProvider } from "./whisper";
import { MockTranscriptionProvider } from "./mock";

export type TranscriptionProviderName = "whisper" | "mock";

export function getTranscriptionProvider(): TranscriptionProvider {
  const hasKey = Boolean(process.env.OPENAI_API_KEY);
  const isNvidia = hasKey && process.env.OPENAI_API_KEY!.startsWith("nvapi-");

  // Explicit override via env var, or auto-fallback to mock when key is missing or Nvidia key is detected
  const requested =
    (process.env.TRANSCRIPTION_PROVIDER as TranscriptionProviderName | undefined) ??
    (hasKey && !isNvidia ? "whisper" : "mock");

  switch (requested) {
    case "whisper":
      if (!hasKey) {
        console.warn(
          "[Lectra] OPENAI_API_KEY missing — falling back to mock transcription provider"
        );
        return new MockTranscriptionProvider();
      }
      return new WhisperProvider(process.env.OPENAI_API_KEY!);

    case "mock":
      if (isNvidia) {
        console.warn(
          "[Lectra] NVIDIA API key detected in OPENAI_API_KEY. Since NVIDIA's cloud catalog does not support OpenAI-compatible audio transcriptions, falling back to the mock transcription provider. To run real transcription, please configure a standard OpenAI API key (starting with 'sk-')."
        );
      }
      return new MockTranscriptionProvider();

    default:
      console.warn(`[Lectra] Unknown transcription provider "${requested}" — using mock`);
      return new MockTranscriptionProvider();
  }
}
