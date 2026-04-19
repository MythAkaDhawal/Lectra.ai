"use client";

import UploadZone from "@/components/UploadZone";

interface Props {
  file: File | null;
  topic: string;
  onFileSelect: (f: File) => void;
  onFileClear: () => void;
  onTopicChange: (t: string) => void;
  onGenerate: () => void;
}

export default function InputScreen({
  file, topic, onFileSelect, onFileClear, onTopicChange, onGenerate,
}: Props) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start pt-20 pb-12 px-6">
      {/* Header */}
      <header className="flex flex-col items-center gap-3 mb-10">
        <Wordmark />
        <p className="text-sm text-text-secondary tracking-wide">
          drop the audio. we do the rest.
        </p>
      </header>

      {/* Card */}
      <div className="w-full max-w-2xl bg-surface border border-border rounded-lg p-7 flex flex-col gap-6">
        <UploadZone
          onFileSelect={onFileSelect}
          selectedFile={file}
          onClear={onFileClear}
        />

        <div className="h-px bg-border" />

        {/* Topic input */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="topic"
            className="font-mono text-[10px] tracking-[0.18em] text-text-secondary uppercase"
          >
            Topic Details
          </label>
          <input
            id="topic"
            type="text"
            placeholder="e.g. Quantum Chromodynamics · Lecture 4"
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && file && onGenerate()}
            className="w-full bg-bg border border-border rounded-sm px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent/40 focus:bg-surface-high focus:outline-none"
          />
        </div>

        {/* CTA */}
        <button
          onClick={onGenerate}
          disabled={!file}
          className="w-full py-4 rounded-md bg-accent text-[#0a1a0f] font-display font-bold text-[15px] tracking-[0.01em] flex items-center justify-center gap-2 transition-all hover:bg-accent-hover active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Generate Notes <span className="text-base">⚡</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-6 flex items-center gap-1.5 font-mono text-[9px] tracking-[0.16em] text-text-muted">
        <LockIcon />
        LECTRA PROCESSES AUDIO LOCALLY · YOUR DATA STAYS PRIVATE
      </footer>
    </main>
  );
}

/* ── Sub-components ── */

export function Wordmark() {
  return (
    <div className="flex items-center gap-2">
      <span className="font-display text-xl font-extrabold tracking-[0.12em] text-text-primary">
        LECTRA
      </span>
      <span className="text-accent text-xl">•</span>
      <span className="font-mono text-[10px] font-medium text-accent border border-accent/35 rounded-pill px-2 py-0.5 tracking-[0.05em]">
        AI ✦
      </span>
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
