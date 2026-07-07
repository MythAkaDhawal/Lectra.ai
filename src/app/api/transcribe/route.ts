import { NextRequest, NextResponse } from "next/server";
import { getTranscriptionProvider } from "@/lib/transcription";
import type { ApiErrorResponse, TranscriptionResponse } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("audio") as File | null;

    if (!file) {
      return NextResponse.json<ApiErrorResponse>({ error: "No audio file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedExt = /\.(mp3|wav|m4a|mp4|ogg|webm)$/i;
    const allowedMime = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/x-wav",
      "audio/m4a",
      "audio/x-m4a",
      "audio/mp4",
      "audio/ogg",
      "audio/webm",
      "video/mp4",
      "video/webm",
    ];
    if (!allowedMime.includes(file.type) && !allowedExt.test(file.name)) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Unsupported format. Please upload MP3, WAV, M4A, MP4, OGG, or WebM." },
        { status: 400 }
      );
    }

    const provider = getTranscriptionProvider();
    console.log(`[Lectra] Using transcription provider: ${provider.name}`);

    const result = await provider.transcribe(file);

    return NextResponse.json<TranscriptionResponse>({
      transcript: result.transcript,
      language: result.language,
      provider: provider.name,
    });
  } catch (error: unknown) {
    console.error("[Transcribe API Error]", error);
    const message = error instanceof Error ? error.message : "Transcription failed";
    return NextResponse.json<ApiErrorResponse>({ error: message }, { status: 500 });
  }
}
