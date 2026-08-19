"use client";

import { LANGS } from "@/data/languages";

export default function LanguageSelector({ lang, onLangChange }) {
  return (
    <div className="flex items-center gap-2">
      {Object.keys(LANGS).map((key) => {
        const active = lang === key;
        return (
          <button
            key={key}
            onClick={() => onLangChange(key)}
            className="px-3 py-1.5 text-[10px] font-semibold uppercase transition-all duration-150 hover:opacity-80"
            style={{
              letterSpacing: "0.08em",
              color: active ? "var(--canvas)" : "var(--ink-soft)",
              background: active ? "var(--gold)" : "transparent",
              border: `1px solid ${active ? "var(--gold)" : "var(--border)"}`,
            }}
          >
            {LANGS[key].label}
          </button>
        );
      })}
    </div>
  );
}