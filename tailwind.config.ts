import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Lectra Obsidian palette
        bg: "#0F1115",
        surface: "#151922",
        "surface-high": "#1C2333",
        "surface-raised": "#222A3A",
        border: "#1E2530",
        "text-primary": "#E6E8EB",
        "text-secondary": "#9AA4AF",
        "text-muted": "#5C6773",
        accent: "#22C55E",
        "accent-hover": "#1DAF52",
        "accent-dim": "rgba(34,197,94,0.12)",
        error: "#F87171",
        "error-dim": "rgba(239,68,68,0.08)",
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        pill: "999px",
      },
      animation: {
        "pulse-ring": "pulseRing 1.6s ease-in-out infinite",
        "pulse-dot": "pulseDot 1.2s ease-in-out infinite",
      },
      keyframes: {
        pulseRing: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.08)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      maxWidth: {
        "2xl": "672px",  // Input page max-width
        "6xl": "1200px", // Output page max-width
      },
    },
  },
  plugins: [],
};

export default config;
