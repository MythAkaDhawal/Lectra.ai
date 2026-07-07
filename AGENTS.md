# Agent Notes for Lectra.ai

Lectra.ai is a Next.js 16.2.1 App Router project for lecture audio transcription and AI note generation. Treat provider code as server-only, keep shared API shapes in `src/types/index.ts`, and run lint plus TypeScript checks before shipping changes.

## Framework Notes

- Next.js App Router docs: https://nextjs.org/docs/app
- Route Handlers docs: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- React docs: https://react.dev/
- Tailwind CSS docs: https://tailwindcss.com/docs
- Groq API docs: https://console.groq.com/docs
- OpenAI API docs: https://platform.openai.com/docs
- OpenRouter API docs: https://openrouter.ai/docs

This project uses Next.js 16.2.1 and React 19.2. Avoid relying on older Pages Router patterns. API endpoints live under `src/app/api/**/route.ts` and are configured for the Node.js runtime because audio transcription and provider SDKs require server-side execution.

## Module Responsibilities

```text
src/app/page.tsx
  Client-side app flow: upload audio, call transcription, call note generation, and render output state.

src/app/api/transcribe/route.ts
  Validates uploaded audio, resolves the configured transcription provider, and returns a typed transcription response.

src/app/api/generate/route.ts
  Validates transcript input, resolves the configured LLM provider, validates generated note shape, and returns typed notes.

src/lib/env.ts
  Central environment parsing and helpful missing-key validation errors.

src/lib/transcription/
  Transcription provider interface, factory, mock provider, and provider implementations.

src/lib/llm/
  LLM provider interface, shared note-generation prompt, JSON cleanup, mock provider, and provider implementations.

src/types/index.ts
  Shared TypeScript contracts used by the UI and API route responses.
```

## Adding a Transcription Provider

1. Create a provider implementation in `src/lib/transcription/<provider>.ts`.
2. Implement the `TranscriptionProvider` interface from `src/lib/transcription/index.ts`.
3. Add the provider name to `TranscriptionProviderName`.
4. Add required key validation in `src/lib/env.ts`.
5. Update `getTranscriptionProvider()` to instantiate the provider.
6. Update `.env.example`, `README.md`, and this file with setup instructions.
7. Confirm the API response still matches `TranscriptionResponse` in `src/types/index.ts`.

Provider errors should be converted into helpful messages before reaching users. Missing keys should mention the exact variable name and the provider that needs it.

## Adding an LLM Provider

1. Create a provider implementation in `src/lib/llm/<provider>.ts`.
2. Implement the `LLMProvider` interface from `src/lib/llm/index.ts`.
3. Reuse `NOTES_SYSTEM_PROMPT` unless the provider requires a format-specific wrapper.
4. Parse and validate JSON carefully; the API route performs final shape validation.
5. Add the provider name to `LLMProviderName`.
6. Add environment validation in `src/lib/env.ts`.
7. Update `.env.example`, `README.md`, and this file.
8. Confirm the API response still matches `GenerateResponse` in `src/types/index.ts`.

## Quality Checklist

- Run `npm run lint`.
- Run `npm run typecheck`.
- Keep `strict: true` enabled in `tsconfig.json`.
- Do not introduce `any`; use `unknown` and explicit response types for external provider JSON.
- Keep browser-only libraries such as Mermaid, html2canvas, and jsPDF dynamically imported from client components.
- Keep API keys server-side only. Do not expose provider secrets through `NEXT_PUBLIC_*` variables.
