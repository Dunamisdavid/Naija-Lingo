import { NextResponse } from "next/server";

function similarity(a, b) {
  a = a.trim().toLowerCase();
  b = b.trim().toLowerCase();

  const costs = [];
  for (let i = 0; i <= a.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= b.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (a[i - 1] !== b[j - 1]) {
          newValue = Math.min(newValue, lastValue, costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[b.length] = lastValue;
  }

  const distance = costs[b.length];
  const maxLen = Math.max(a.length, b.length);
  return maxLen === 0 ? 100 : Math.round((1 - distance / maxLen) * 100);
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio");
    const expectedText = formData.get("expectedText");
    const language = formData.get("language");

    if (!audio || !expectedText || !language) {
      return NextResponse.json({ error: "Missing audio, expectedText, or language" }, { status: 400 });
    }

    const spitchForm = new FormData();
    spitchForm.append("content", audio, "recording.webm");
    spitchForm.append("language", language);

    const response = await fetch("https://api.spi-tch.com/v1/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.SPITCH_API_KEY}` },
      body: spitchForm,
    });

    if (!response.ok) {
      throw new Error(`Spitch returned ${response.status}`);
    }

    const data = await response.json();
    const heard = data.text || "";
    const score = similarity(heard, expectedText);

    return NextResponse.json({ heard, score });
  } catch (error) {
    console.error("Pronunciation scoring failed:", error);
    return NextResponse.json({ error: "Could not score pronunciation right now." }, { status: 500 });
  }
}