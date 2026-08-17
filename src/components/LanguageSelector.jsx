"use client";

import { LANGS } from "@/data/languages";

export default function LanguageSelector({ lang, onLangChange }) {
  return (
    <div className="px-5 pt-1 pb-2 flex items-center gap-2">
      {Object.keys(LANGS).map((key) => {
        const active = lang === key;
        return (
          <button
            key={key}
            onClick={() => onLangChange(key)}
            className="px-3 py-1.5 rounded-full text-[12px] font-semibold border"
            style={{
              borderColor: active ? LANGS[key].accent : "#EDE6D6",
              background: active ? LANGS[key].accent : "white",
              color: active ? "white" : "#8A8478",
            }}
          >
            {LANGS[key].label}
          </button>
        );
      })}
    </div>
  );
}