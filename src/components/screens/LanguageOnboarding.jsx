"use client";

import { LANGS } from "@/data/languages";

export default function LanguageOnboarding({ onSelect }) {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-8 text-center"
      style={{ background: "var(--canvas)" }}
    >
      <p className="text-[10px] font-semibold uppercase mb-2" style={{ color: "var(--gold)", letterSpacing: "0.14em" }}>
        Before we begin
      </p>
      <p className="font-display text-[22px] mb-10" style={{ color: "var(--ink)" }}>
        Which language do you want to focus on?
      </p>

      <div className="w-full max-w-[280px] space-y-3">
        {Object.keys(LANGS).map((key) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className="w-full py-4 text-[14px] font-semibold transition-all duration-150 hover:-translate-y-0.5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--ink)" }}
          >
            {LANGS[key].label}
          </button>
        ))}
      </div>

      <p className="text-[11px] mt-8 max-w-[240px]" style={{ color: "var(--ink-soft)" }}>
        You can explore all three anytime from Home or Culture — this just sets your main focus for lessons.
      </p>
    </div>
  );
}