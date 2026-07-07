/**
 * Transcription Provider Interface
 * Swap the active provider by changing TRANSCRIPTION_PROVIDER in .env.local
 * Supported: "groq" | "openai" | "mock"
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

import { getConfiguredTranscriptionProvider, requireEnv } from "@/lib/env";
import { GroqTranscriptionProvider } from "./groq";
import { MockTranscriptionProvider } from "./mock";
import { WhisperProvider } from "./whisper";

export type TranscriptionProviderName = "groq" | "openai" | "mock";

export function getTranscriptionProvider(): TranscriptionProvider {
  const requested = getConfiguredTranscriptionProvider();

  switch (requested) {
    case "groq":
      return new GroqTranscriptionProvider(requireEnv("GROQ_API_KEY", "transcription"));

    case "openai":
      return new WhisperProvider(requireEnv("OPENAI_API_KEY", "transcription"));

    case "mock":
      return new MockTranscriptionProvider();
  }
}
