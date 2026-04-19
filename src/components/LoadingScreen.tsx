"use client";

type Step = "done" | "active" | "pending";

interface Props {
  stage: "transcribing" | "generating";
}

export default function LoadingScreen({ stage }: Props) {
  const isTranscribing = stage === "transcribing";

  const stepState = (step: "upload" | "transcribe" | "ai"): Step => {
    if (step === "upload") return "done";
    if (step === "transcribe") return isTranscribing ? "active" : "done";
    return stage === "generating" ? "active" : "pending";
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-8 text-center max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-1.5">
          <span className="font-display font-extrabold tracking-[0.12em] text-text-primary">LECTRA</span>
          <span className="text-accent">•</span>
        </div>

        {/* Pulse ring */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-accent animate-pulse-ring" />
          <div className="absolute inset-[7px] rounded-full bg-accent/10 animate-pulse-dot" />
        </div>

        {/* Status text */}
        <div className="flex flex-col gap-2">
          <p className="font-display text-xl font-bold text-text-primary">
            {isTranscribing ? "Transcribing audio..." : "Generating notes..."}
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            {isTranscribing
              ? "Whisper is converting your lecture to text"
              : "Lectra is structuring your notes, summary, and diagram"}
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-2.5 items-start w-48">
          <StepRow label="Audio uploaded" state={stepState("upload")} />
          <StepRow label="Transcription" state={stepState("transcribe")} />
          <StepRow label="AI processing" state={stepState("ai")} />
        </div>
      </div>
    </main>
  );
}

function StepRow({ label, state }: { label: string; state: Step }) {
  const dotClass =
    state === "done"
      ? "bg-accent"
      : state === "active"
      ? "bg-accent animate-pulse-dot ring-4 ring-accent/20"
      : "bg-text-muted";

  const textClass =
    state === "done"
      ? "text-accent"
      : state === "active"
      ? "text-text-primary"
      : "text-text-muted";

  return (
    <div className={`flex items-center gap-2.5 text-sm ${textClass}`}>
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClass}`} />
      {label}
    </div>
  );
}
