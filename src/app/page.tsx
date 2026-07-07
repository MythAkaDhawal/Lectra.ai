"use client";

import { useCallback, useRef, useState } from "react";
import type { ApiErrorResponse, AppData, AppState, GenerateResponse, TranscriptionResponse } from "@/types";
import InputScreen from "@/components/InputScreen";
import LoadingScreen from "@/components/LoadingScreen";
import OutputScreen from "@/components/OutputScreen";

async function getErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const body = (await response.json()) as Partial<ApiErrorResponse>;
    return body.error ?? fallback;
  } catch {
    return fallback;
  }
}

export default function Home() {
  const [state, setState] = useState<AppState>("input");
  const [file, setFile] = useState<File | null>(null);
  const [topic, setTopic] = useState("");
  const [data, setData] = useState<AppData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copyFeedback, setCopyFeedback] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  /* ── Generate flow ── */
  const handleGenerate = useCallback(async () => {
    if (!file) return;

    try {
      setState("transcribing");
      const form = new FormData();
      form.append("audio", file);

      const transcribeRes = await fetch("/api/transcribe", { method: "POST", body: form });
      if (!transcribeRes.ok) {
        throw new Error(await getErrorMessage(transcribeRes, "Transcription failed"));
      }
      const { transcript } = (await transcribeRes.json()) as TranscriptionResponse;

      setState("generating");
      const generateRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, topic: topic.trim() }),
      });
      if (!generateRes.ok) {
        throw new Error(await getErrorMessage(generateRes, "Generation failed"));
      }
      const generated = (await generateRes.json()) as GenerateResponse;

      setData({ ...generated, wordCount: transcript.split(/\s+/).length, topic: topic.trim() || undefined });
      setState("output");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }, [file, topic]);

  const handleReset = () => {
    setState("input");
    setFile(null);
    setTopic("");
    setData(null);
    setErrorMsg("");
  };

  /* ── Copy notes ── */
  const handleCopy = async () => {
    if (!data) return;
    const text = [
      `# ${data.title}`,
      "",
      "## Notes",
      ...data.notes.flatMap((s) => [`### ${s.heading}`, ...s.bullets.map((b) => `- ${b}`), ""]),
      "## Summary",
      data.summary,
      "",
      "## Key Takeaways",
      ...data.keyTakeaways.map((k, i) => `${i + 1}. ${k}`),
    ].join("\n");
    await navigator.clipboard.writeText(text);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  /* ── PDF export ── */
  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    const { default: html2canvas } = await import("html2canvas");
    const { default: jsPDF } = await import("jspdf");

    const canvas = await html2canvas(printRef.current, { backgroundColor: "#0F1115", scale: 2, useCORS: true });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    let y = 0;
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    let isFirst = true;
    while (y < h) {
      if (!isFirst) {
        pdf.addPage();
      }
      isFirst = false;

      // Fill background color #0F1115
      pdf.setFillColor(15, 17, 21);
      pdf.rect(0, 0, pageW, pageH, "F");

      pdf.addImage(img, "PNG", 0, -y, w, h);
      y += pageH;
    }
    const filename = data?.title
      ? `lectra-${data.title.toLowerCase().replace(/\s+/g, "-").slice(0, 40)}.pdf`
      : "lectra-notes.pdf";
    pdf.save(filename);
  };

  /* ── Render ── */
  if (state === "input") {
    return (
      <InputScreen
        file={file}
        topic={topic}
        onFileSelect={setFile}
        onFileClear={() => setFile(null)}
        onTopicChange={setTopic}
        onGenerate={handleGenerate}
      />
    );
  }

  if (state === "transcribing" || state === "generating") {
    return <LoadingScreen stage={state} />;
  }

  if (state === "error") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="flex flex-col items-center gap-5 max-w-md text-center bg-error-dim border border-error/20 rounded-lg p-8">
          <p className="font-display text-lg font-bold text-error">Something went wrong</p>
          <p className="text-sm text-text-secondary leading-relaxed">{errorMsg}</p>
          <button
            onClick={handleReset}
            className="mt-2 px-5 py-2.5 bg-surface border border-border rounded-pill text-sm font-medium text-text-primary hover:bg-surface-high transition-colors"
          >
            ← Try again
          </button>
        </div>
      </main>
    );
  }

  if (state === "output" && data) {
    return (
      <OutputScreen
        data={data}
        onBack={handleReset}
        onCopy={handleCopy}
        onDownloadPdf={handleDownloadPdf}
        copyFeedback={copyFeedback}
        printRef={printRef}
      />
    );
  }

  return null;
}
