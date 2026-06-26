# Lectra

Lectra turns lecture audio into structured study notes, summaries, key takeaways, and Mermaid diagrams. It is a Next.js app with server-side API routes for audio transcription and note generation.

## Features

- Upload lecture audio from the browser.
- Optionally provide topic context for the lecture.
- Transcribe audio through the configured transcription provider.
- Generate organized notes, a short summary, key takeaways, and a Mermaid concept diagram.
- Copy generated notes as Markdown or export the rendered result as a PDF.

## Tech stack

- Next.js 16 and React 19
- TypeScript
- Tailwind CSS
- OpenAI Whisper for transcription when `OPENAI_API_KEY` is configured
- Groq or OpenRouter for note generation when the matching API key is configured
- Mock providers as local fallbacks when provider keys are not configured

## Getting started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with the providers you want to use. The app can run without keys by falling back to mock providers, but real transcription and note generation require provider credentials.

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Provider configuration

Transcription is controlled by `TRANSCRIPTION_PROVIDER`:

- `whisper` uses `OPENAI_API_KEY`.
- `mock` returns sample transcription output for local UI testing.

Note generation is controlled by `LLM_PROVIDER`:

- `groq` uses `GROQ_API_KEY`.
- `openrouter` uses `OPENROUTER_API_KEY`.
- `mock` returns sample notes for local UI testing.

If provider variables are omitted, Lectra chooses the first available configured provider and falls back to mock providers when needed.

## Useful scripts

```bash
npm run dev    # Start the local development server
npm run build  # Create a production build
npm run start  # Start the production server
npm run lint   # Run ESLint
```

## Privacy note

When mock providers are selected, no external AI provider is used. When Whisper, Groq, or OpenRouter providers are selected, uploaded audio or generated transcripts are sent to the configured provider APIs for processing.
