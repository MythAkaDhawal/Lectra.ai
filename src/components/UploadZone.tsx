"use client";

import { useCallback, useRef, useState } from "react";

interface Props {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  disabled?: boolean;
}

const ALLOWED_MIME = [
  "audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav",
  "audio/m4a", "audio/x-m4a", "audio/mp4",
];
const ALLOWED_EXT = /\.(mp3|wav|m4a|mp4|ogg|webm)$/i;

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadZone({ onFileSelect, selectedFile, onClear, disabled }: Props) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback((file: File): boolean => {
    if (!ALLOWED_MIME.includes(file.type) && !ALLOWED_EXT.test(file.name)) {
      setError("Unsupported format — please use MP3, WAV, or M4A.");
      return false;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError("File too large — max 25MB.");
      return false;
    }
    setError(null);
    return true;
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file && validate(file)) onFileSelect(file);
  }, [disabled, validate, onFileSelect]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validate(file)) onFileSelect(file);
    e.target.value = "";
  }, [validate, onFileSelect]);

  /* ── File selected state ── */
  if (selectedFile) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-surface border border-border rounded-md">
        <div className="flex-shrink-0 w-9 h-9 bg-accent/10 rounded-sm flex items-center justify-center">
          <MusicIcon />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">{selectedFile.name}</p>
          <p className="text-xs text-text-secondary">{formatBytes(selectedFile.size)}</p>
        </div>
        {!disabled && (
          <button
            onClick={onClear}
            aria-label="Remove file"
            className="p-1.5 rounded-sm text-text-secondary hover:text-text-primary hover:bg-surface-high transition-colors"
          >
            <XIcon />
          </button>
        )}
      </div>
    );
  }

  /* ── Drop zone ── */
  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && !disabled && inputRef.current?.click()}
        className={[
          "dot-grid flex flex-col items-center gap-2.5 py-12 px-8 rounded-lg cursor-pointer",
          "border border-dashed transition-all duration-200 select-none",
          dragging
            ? "border-accent bg-accent/5"
            : "border-border hover:border-accent/40 hover:bg-accent/[0.02]",
          disabled ? "opacity-50 cursor-not-allowed" : "",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".mp3,.wav,.m4a,.mp4,.ogg,.webm,audio/*"
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Mic icon in circle */}
        <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-1">
          <MicIcon />
        </div>

        <p className="font-display font-semibold text-base text-text-primary">
          Drop your lecture audio here
        </p>
        <p className="text-sm text-text-secondary">Supports MP3, WAV, M4A · Max 25MB</p>
        <span className="text-sm font-medium text-accent underline underline-offset-2 mt-1">
          Browse files
        </span>
      </div>

      {error && (
        <p className="mt-2.5 text-xs text-error bg-error-dim border border-error/20 rounded-sm px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Inline SVG icons ── */
function MicIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.5">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function MusicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
