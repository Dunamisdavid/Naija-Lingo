"use client";

import { useState } from "react";
import { Mic } from "lucide-react";
import { LANGS } from "@/data/languages";

const results = [
  { label: "Pronunciation", pct: 84 },
  { label: "Tone", pct: 72 },
  { label: "Naturalness", pct: 87 },
];

export default function SpeakScreen({ lang }) {
  const l = LANGS[lang];
  const [listening, setListening] = useState(false);
  const [scored, setScored] = useState(false);

  const handleMicTap = () => {
    setListening(true);
    setScored(false);
    setTimeout(() => {
      setListening(false);
      setScored(true);
    }, 1800);
  };

  return (
    <div className="px-5 pt-6 flex flex-col items-center text-center">
      <p className="text-[13px] text-[#8A8478]">Your {l.label} companion</p>
      <h2 className="font-display text-[20px] text-[#22231F] mb-6">{l.tutor}</h2>

      <button
        onClick={handleMicTap}
        className="relative w-32 h-32 rounded-full flex items-center justify-center mb-4"
        style={{ background: l.accent }}
      >
        {listening && (
          <span className="absolute inset-0 rounded-full animate-ping" style={{ background: l.accent, opacity: 0.3 }} />
        )}
        <Mic size={34} color="white" />
      </button>

      <p className="text-[13px] font-medium text-[#5C5648] mb-1">
        {listening ? "I'm listening…" : scored ? "Nice work!" : "Tap to speak"}
      </p>
      <p className="text-[16px] font-display text-[#22231F] mb-6">Say: "How are you?"</p>

      {scored && (
        <div className="w-full space-y-3 text-left">
          {results.map((r) => (
            <div key={r.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] text-[#5C5648] font-medium">{r.label}</span>
                <span className="text-[12px] font-mono font-semibold" style={{ color: l.accent }}>
                  {r.pct}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#EAE3D3] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: l.accent }} />
              </div>
            </div>
          ))}
          <button
            onClick={handleMicTap}
            className="w-full mt-2 py-3 rounded-xl text-white text-[13px] font-semibold bg-[#1F4D3A]"
          >
            Try it again
          </button>
        </div>
      )}
    </div>
  );
}