# Lectra.ai

Lectra.ai is an AI-powered lecture audio transcription and note generation platform. Upload a lecture recording, let Lectra transcribe it, and receive structured study notes, summaries, key takeaways, and a Mermaid concept map that can be exported to PDF.

## Features

- Automatic transcription from audio files: MP3, WAV, M4A, MP4, OGG, and WebM
- AI-generated structured notes with headings and bullet points
- Summary and key takeaways extraction
- Mermaid diagram generation for visual concept mapping
- PDF export capability
- Support for multiple LLM providers: Groq, OpenAI, OpenRouter, and mock fallback
- Mock transcription and generation modes for local development without paid API keys

## Tech Stack

- Next.js 16.2.1 with App Router
- React 19.2
- Tailwind CSS 3.4
- TypeScript 5
- Groq SDK and OpenAI SDK for provider integrations
- Mermaid, html2canvas, and jsPDF for diagrams and PDF export

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

For a no-key local smoke test, set both providers to `mock` in `.env.local`:

```bash
TRANSCRIPTION_PROVIDER=mock
LLM_PROVIDER=mock
```

## Environment Setup

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Required when | Description |
| --- | --- | --- |
| `GROQ_API_KEY` | `TRANSCRIPTION_PROVIDER=groq` or `LLM_PROVIDER=groq` | Groq API key used for Whisper transcription and Groq-hosted chat models. |
| `OPENAI_API_KEY` | `TRANSCRIPTION_PROVIDER=openai` or `LLM_PROVIDER=openai` | OpenAI API key for Whisper transcription or GPT note generation. |
| `OPENROUTER_API_KEY` | `LLM_PROVIDER=openrouter` | OpenRouter API key for OpenAI-compatible chat completions. |
| `TRANSCRIPTION_PROVIDER` | Always recommended | `groq`, `openai`, or `mock`. Defaults to the best available configured provider. |
| `LLM_PROVIDER` | Always recommended | `groq`, `openai`, `openrouter`, or `mock`. Defaults to the best available configured provider. |

Optional variables:

| Variable | Description |
| --- | --- |
| `TRANSCRIPTION_MODEL` | Overrides the transcription model. Groq defaults to `whisper-large-v3-turbo`; OpenAI defaults to `whisper-1`. |
| `GROQ_LLM_MODEL` | Overrides the Groq chat model. Defaults to `llama-3.3-70b-versatile`. |
| `OPENAI_LLM_MODEL` | Overrides the OpenAI chat model. Defaults to `gpt-4o-mini`. |
| `OPENROUTER_MODEL` | Overrides the OpenRouter chat model. Defaults to `meta-llama/llama-3.3-70b-instruct:free`. |
| `NEXT_PUBLIC_SITE_URL` | Used as the OpenRouter referer. Defaults to `http://localhost:3000`. |

## Transcription Provider Setup

### Groq Whisper

Recommended production transcription provider:

```bash
TRANSCRIPTION_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key_here
```

Lectra uses Groq Whisper-compatible audio transcription through `groq-sdk`. The default model is `whisper-large-v3-turbo`; override it with `TRANSCRIPTION_MODEL` if your Groq account requires a different model.

Supported uploads are validated by extension and MIME type: MP3, WAV, M4A, MP4, OGG, and WebM. The UI currently limits files to 25 MB.

### Mock Transcription

Use mock mode for UI development and CI smoke tests:

```bash
TRANSCRIPTION_PROVIDER=mock
```

## LLM Provider Setup

### Groq

```bash
LLM_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key_here
```

Default model: `llama-3.3-70b-versatile`.

### OpenAI

```bash
LLM_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
```

Default model: `gpt-4o-mini`.

### OpenRouter

```bash
LLM_PROVIDER=openrouter
OPENROUTER_API_KEY=your_openrouter_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Default model: `meta-llama/llama-3.3-70b-instruct:free`.

### Mock LLM

```bash
LLM_PROVIDER=mock
```

Mock mode returns deterministic sample notes and is useful when API keys are unavailable.

## File Structure

```text
src/
  app/
    api/
      generate/route.ts       # Note generation endpoint
      transcribe/route.ts     # Audio transcription endpoint
    layout.tsx                # App metadata and root layout
    page.tsx                  # Client-side upload/generate flow
  components/
    InputScreen.tsx           # Upload and topic entry screen
    UploadZone.tsx            # Drag-and-drop audio upload
    LoadingScreen.tsx         # Transcription/generation progress UI
    OutputScreen.tsx          # Notes, stats, diagram, copy, and PDF export
    MermaidDiagram.tsx        # Client-side Mermaid rendering
  lib/
    env.ts                    # Provider environment validation helpers
    llm/                      # LLM provider interface and implementations
    transcription/            # Transcription provider interface and implementations
  types/
    index.ts                  # Shared app and API response types
```

## Development Checks

```bash
npm run lint
npm run typecheck
npm run build
```

`npm run lint` runs the Next.js ESLint configuration. `npm run typecheck` runs TypeScript without emitting build artifacts.

## Deploying to Vercel

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Add production environment variables in Vercel Project Settings:
   - `TRANSCRIPTION_PROVIDER`
   - `LLM_PROVIDER`
   - the API key for each selected provider
   - optional model overrides
4. Deploy.

The API routes use the Node.js runtime and set `maxDuration = 60`, which is important for longer audio transcription and generation requests.

## Troubleshooting

### "Missing GROQ_API_KEY"

The selected provider is `groq`, but `GROQ_API_KEY` is not set. Add the key to `.env.local` or switch the provider to `mock`.

### "Missing OPENAI_API_KEY"

The selected LLM provider is `openai`, but `OPENAI_API_KEY` is not set. Add a valid OpenAI key or use another provider.

### "Missing OPENROUTER_API_KEY"

The selected LLM provider is `openrouter`, but `OPENROUTER_API_KEY` is not set. Add the key and verify the selected model is available to your OpenRouter account.

### "Unsupported format"

Upload one of the supported file types: MP3, WAV, M4A, MP4, OGG, or WebM. If a valid file is rejected, check whether the browser provided an unusual MIME type and rely on the file extension.

### Provider returned incomplete data

The LLM response did not match Lectra's required schema. Try again, lower the temperature for custom providers, or switch models.

### Mermaid diagram could not be rendered

The notes were generated, but the model returned invalid Mermaid syntax. The UI shows the raw diagram code so the prompt or provider can be debugged.
