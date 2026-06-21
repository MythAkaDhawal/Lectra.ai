"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  chart: string;
}

export default function MermaidDiagram({ chart }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (!chart || !ref.current) return;
    setError(null);
    setRendered(false);

    const renderDiagram = async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          themeVariables: {
            background: "#151922",
            primaryColor: "#1C2333",
            primaryTextColor: "#E6E8EB",
            primaryBorderColor: "#22C55E",
            lineColor: "#22C55E",
            secondaryColor: "#1E2530",
            tertiaryColor: "#151922",
            edgeLabelBackground: "#151922",
            fontFamily: "Inter, sans-serif",
            fontSize: "13px",
          },
          flowchart: { curve: "basis", htmlLabels: true },
        });

        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, chart);
        if (ref.current) {
          ref.current.innerHTML = svg;
          setRendered(true);
        }
      } catch (err) {
        console.error("Mermaid render error:", err);
        setError("Diagram could not be rendered. The AI may have generated invalid syntax.");
      }
    };

    renderDiagram();
  }, [chart]);

  if (error) {
    return (
      <div style={{
        padding: "16px",
        background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.2)",
        borderRadius: "8px",
        color: "#9AA4AF",
        fontSize: "13px",
        lineHeight: 1.5,
      }}>
        <strong style={{ color: "#E6E8EB" }}>Diagram unavailable</strong>
        <br />
        {error}
        <details style={{ marginTop: "10px" }}>
          <summary style={{ cursor: "pointer", color: "#22C55E", fontSize: "12px" }}>Show raw diagram code</summary>
          <pre style={{ marginTop: "8px", fontSize: "11px", overflow: "auto", whiteSpace: "pre-wrap", color: "#9AA4AF" }}>{chart}</pre>
        </details>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", minHeight: "120px" }}>
      {!rendered && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "#9AA4AF",
          fontSize: "13px",
          padding: "20px 0",
        }}>
          <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse-dot" />
          Rendering diagram...
        </div>
      )}
      <div
        ref={ref}
        style={{
          opacity: rendered ? 1 : 0,
          transition: "opacity 0.3s ease",
          overflowX: "auto",
        }}
      />
    </div>
  );
}
