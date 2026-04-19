import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lectra — AI Lecture Notes",
  description: "Turn your lecture audio into structured notes, summaries, and diagrams instantly.",
  keywords: ["lecture notes", "AI", "transcription", "study", "education"],
  openGraph: {
    title: "Lectra — AI Lecture Notes",
    description: "Drop the audio. We do the rest.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
