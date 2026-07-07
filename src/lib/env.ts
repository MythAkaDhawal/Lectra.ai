import type { LLMProviderName } from "@/lib/llm";
import type { TranscriptionProviderName } from "@/lib/transcription";

const transcriptionProviders = ["groq", "openai", "mock"] as const;
const llmProviders = ["groq", "openai", "openrouter", "mock"] as const;

function isTranscriptionProvider(value: string): value is TranscriptionProviderName {
  return transcriptionProviders.includes(value as TranscriptionProviderName);
}

function isLLMProvider(value: string): value is LLMProviderName {
  return llmProviders.includes(value as LLMProviderName);
}

export function getConfiguredTranscriptionProvider(): TranscriptionProviderName {
  const configured = process.env.TRANSCRIPTION_PROVIDER;

  if (configured) {
    if (!isTranscriptionProvider(configured)) {
      throw new Error(
        `Unsupported TRANSCRIPTION_PROVIDER "${configured}". Use one of: ${transcriptionProviders.join(", ")}.`
      );
    }
    return configured;
  }

  if (process.env.GROQ_API_KEY) return "groq";
  if (process.env.OPENAI_API_KEY) return "openai";
  return "mock";
}

export function getConfiguredLLMProvider(): LLMProviderName {
  const configured = process.env.LLM_PROVIDER;

  if (configured) {
    if (!isLLMProvider(configured)) {
      throw new Error(`Unsupported LLM_PROVIDER "${configured}". Use one of: ${llmProviders.join(", ")}.`);
    }
    return configured;
  }

  if (process.env.GROQ_API_KEY) return "groq";
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.OPENROUTER_API_KEY) return "openrouter";
  return "mock";
}

export function requireEnv(name: "GROQ_API_KEY" | "OPENAI_API_KEY" | "OPENROUTER_API_KEY", provider: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Set ${name} in .env.local or choose a different ${provider} provider.`);
  }
  return value;
}
