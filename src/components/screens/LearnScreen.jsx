"use client";

import { useState, useEffect } from "react";
import { Mic, Check, AlertCircle } from "lucide-react";
import { LANGS } from "@/data/languages";
import ListenButton from "@/components/ListenButton";
import GildedCard from "@/components/GildedCard";

export default function LearnScreen({ lang }) {
  const l = LANGS[lang];
  const [lessons, setLessons] = useState(null);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState(null);
  const [answered, setAnswered] = useState(null);

  const loadLessons = () => {
    setLessons(null);
    setIndex(0);
    setError(null);
    setAnswered(null);

    fetch(`/api/lessons?lang=${lang}`)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => setLessons(data))
      .catch(() => setError("We couldn't load lessons. Check your connection and try again."));
  };

  useEffect(() => {
    loadLessons();
  }, [lang]);

  const lesson = lessons?.[index];

  const handleNext = () => {
    if (index < lessons.length - 1) {
      setIndex(index + 1);
      setAnswered(null);
    }
  };

  if (error) {
    return (
      <div className="px-5 pt-10 flex flex-col items-center text-center">
        <AlertCircle size={26} style={{ color: "#B4483B" }} className="mb-3" />
        <p className="text-[13px] mb-4" style={{ color: "var(--ink-soft)" }}>{error}</p>
        <button
          onClick={loadLessons}
          className="px-4 py-2 text-[12px] font-semibold uppercase transition-all hover:opacity-80"
          style={{ background: "var(--gold)", color: "var(--canvas)", letterSpacing: "0.08em" }}
        >
          Try again
        </button>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="px-5 pt-6 space-y-4">
        <div className="h-3 w-40 animate-pulse" style={{ background: "var(--border)" }} />
        <GildedCard className="p-5 space-y-4">
          <div className="h-4 w-full animate-pulse" style={{ background: "var(--border)" }} />
          <div className="h-14 w-full animate-pulse" style={{ background: "var(--border)" }} />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-11 w-full animate-pulse" style={{ background: "var(--border)" }} />
            ))}
          </div>
        </GildedCard>
      </div>
    );
  }

  return (
    <div className="px-5 pt-4 space-y-4">
      <p className="text-[10px] font-semibold uppercase" style={{ color: "var(--ink-soft)", letterSpacing: "0.14em" }}>
        {lesson.sceneLabel}
      </p>

      <GildedCard className="p-5 space-y-4">
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>{lesson.context}</p>

        <div
          className="px-4 py-3.5 flex items-center justify-between"
          style={{ background: "var(--canvas)", border: "1px solid var(--border)" }}
        >
          <p className="font-display text-[19px] italic" style={{ color: "var(--ink)" }}>"{lesson.phrase}"</p>
          <ListenButton text={lesson.phrase} language={lang} accent="var(--gold)" label="" />
        </div>

        <p className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>{lesson.question}</p>

        <div className="space-y-2">
          {lesson.options.map((opt, i) => {
            const isChosen = answered === i;
            const isCorrect = i === lesson.correctIndex;

            return (
              <button
                key={i}
                onClick={() => setAnswered(i)}
                className="w-full text-left px-4 py-3 text-[13px] font-medium flex items-center justify-between transition-all duration-150 hover:-translate-y-0.5"
                style={{
                  border: `1px solid ${isChosen ? (isCorrect ? "var(--emerald)" : "#B4483B") : "var(--border)"}`,
                  background: isChosen ? (isCorrect ? "rgba(27,59,47,0.08)" : "rgba(180,72,59,0.08)") : "var(--surface)",
                  color: "var(--ink)",
                }}
              >
                {opt}
                {isChosen && isCorrect && <Check size={16} style={{ color: "var(--emerald)" }} />}
              </button>
            );
          })}
        </div>
      </GildedCard>

      {answered === lesson.correctIndex && (
        <GildedCard className="p-4" style={{ background: "var(--emerald)" }}>
          <p className="text-[10px] font-semibold uppercase mb-1" style={{ color: "var(--gold)", letterSpacing: "0.14em" }}>
            Your turn
          </p>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ border: "1px solid var(--gold)" }}>
              <Mic size={18} style={{ color: "var(--gold)" }} />
            </div>
            <p className="text-[13px]" style={{ color: "var(--canvas)" }}>
              Say: <span className="font-display italic font-semibold">"{lesson.phrase}"</span>
            </p>
          </div>

          {index < lessons.length - 1 && (
            <button
              onClick={handleNext}
              className="w-full mt-4 py-3 text-[12px] font-semibold uppercase transition-all hover:opacity-90"
              style={{ background: "var(--gold)", color: "var(--emerald)", letterSpacing: "0.08em" }}
            >
              Next lesson
            </button>
          )}
        </GildedCard>
      )}
    </div>
  );
}