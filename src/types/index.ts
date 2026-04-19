/** Shared TypeScript types used across frontend components and API routes */

export interface NoteSection {
  heading: string;
  bullets: string[];
}

export interface GeneratedNotes {
  title: string;
  notes: NoteSection[];
  summary: string;
  keyTakeaways: string[];
  mermaid: string;
  provider?: string;
}

export interface TranscriptionResult {
  transcript: string;
  language?: string;
  provider?: string;
}

export type AppState = "input" | "transcribing" | "generating" | "output" | "error";

export interface AppData extends GeneratedNotes {
  wordCount: number;
  topic?: string;
}
