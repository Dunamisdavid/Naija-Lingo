import { NextResponse } from "next/server";

export async function POST(request) {
  const { text, language } = await request.json();

  if (!text || !language) {
    return NextResponse.json({ error: "Missing text or language" }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.spi-tch.com/v1/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SPITCH_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ language, text, voice: "sade" }),
    });

    if (!response.ok) {
      throw new Error(`Spitch returned ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error) {
    console.error("Spitch TTS failed:", error);
    return NextResponse.json({ error: "Could not generate audio" }, { status: 500 });
  }
}