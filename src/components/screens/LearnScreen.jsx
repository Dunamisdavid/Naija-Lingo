"use client";

import { useState } from "react";
import { Mic, Check } from "lucide-react";
import { LANGS } from "@/data/languages";

const options = ["Good morning", "Good afternoon", "Welcome", "How are you?"];
const correctIndex = 0;

export default function LearnScreen({ lang }) {
  const l = LANGS[lang];
  const [answered, setAnswered] = useState(null);

  return (
    <div className="px-5 pt-4 space-y-4">
      <p className="text-[12px] font-semibold uppercase tracking-wide text-[#8A8478]">
        Greetings · Scene 3
      </p>

      <div className="rounded-[22px] bg-white border border-[#EDE6D6] p-5 space-y-4">
        <p className="text-[13px] text-[#5C5648] leading-relaxed">
          You're visiting your grandmother. She looks up and says —
        </p>

        <div className="rounded-2xl px-4 py-3.5" style={{ background: l.accentSoft }}>
          <p className="font-display text-[20px] text-[#22231F]">"{l.greet}."</p>
        </div>

        <p className="text-[13px] font-semibold text-[#22231F]">What does she mean?</p>

        <div className="space-y-2">
          {options.map((opt, i) => {
            const isChosen = answered === i;
            const isCorrect = i === correctIndex;

            return (
              <button
                key={i}
                onClick={() => setAnswered(i)}
                className="w-full text-left px-4 py-3 rounded-xl border text-[13px] font-medium flex items-center justify-between"
                style={{
                  borderColor: isChosen ? (isCorrect ? "#1F4D3A" : "#B4483B") : "#EDE6D6",
                  background: isChosen ? (isCorrect ? "#EAF2ED" : "#FBEAE8") : "#FAF8F3",
                }}
              >
                {opt}
                {isChosen && isCorrect && <Check size={16} color="#1F4D3A" />}
              </button>
            );
          })}
        </div>
      </div>

      {answered === correctIndex && (
        <div className="rounded-2xl p-4 border" style={{ borderColor: l.accent, background: l.accentSoft }}>
          <p className="text-[12px] font-semibold uppercase tracking-wide mb-1" style={{ color: l.accent }}>
            Your turn
          </p>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: l.accent }}>
              <Mic size={18} color="white" />
            </div>
            <p className="text-[13px] text-[#22231F]">
              Say: <span className="font-display font-semibold">"{l.greet}."</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}