"use client";

import { useState, useEffect } from "react";
import { Mic, Check, AlertCircle } from "lucide-react";
import { LANGS } from "@/data/languages";
import ListenButton from "@/components/ListenButton";

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
        <AlertCircle size={28} className="text-[#B4483B] mb-3" />
        <p className="text-[13px] text-[#5C5648] mb-4">{error}</p>
        <button
          onClick={loadLessons}
          className="px-4 py-2 rounded-xl text-white text-[13px] font-semibold"
          style={{ background: l.accent }}
        >
          Try again
        </button>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="px-5 pt-6 space-y-4">
        <div className="h-4 w-40 rounded bg-[#EDE6D6] animate-pulse" />
        <div className="rounded-[22px] bg-white border border-[#EDE6D6] p-5 space-y-4">
          <div className="h-4 w-full rounded bg-[#EDE6D6] animate-pulse" />
          <div className="h-14 w-full rounded-2xl bg-[#EDE6D6] animate-pulse" />
          <div className="h-4 w-32 rounded bg-[#EDE6D6] animate-pulse" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-11 w-full rounded-xl bg-[#EDE6D6] animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-4 space-y-4">
      <p className="text-[12px] font-semibold uppercase tracking-wide text-[#8A8478]">
        {lesson.sceneLabel}
      </p>

      <div className="rounded-[22px] bg-white border border-[#EDE6D6] p-5 space-y-4">
        <p className="text-[13px] text-[#5C5648] leading-relaxed">{lesson.context}</p>

<div className="rounded-2xl px-4 py-3.5 flex items-center justify-between" style={{ background: l.accentSoft }}>
  <p className="font-display text-[20px] text-[#22231F]">"{lesson.phrase}."</p>
  <ListenButton text={lesson.phrase} language={lang} accent={l.accent} label="" />
</div>

        <p className="text-[13px] font-semibold text-[#22231F]">{lesson.question}</p>

        <div className="space-y-2">
          {lesson.options.map((opt, i) => {
            const isChosen = answered === i;
            const isCorrect = i === lesson.correctIndex;

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

            {answered === lesson.correctIndex && (
        <div className="rounded-2xl p-4 border" style={{ borderColor: l.accent, background: l.accentSoft }}>
          <p className="text-[12px] font-semibold uppercase tracking-wide mb-1" style={{ color: l.accent }}>
            Your turn
          </p>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: l.accent }}>
              <Mic size={18} color="white" />
            </div>
            <p className="text-[13px] text-[#22231F]">
              Say: <span className="font-display font-semibold">"{lesson.phrase}."</span>
            </p>
          </div>

          {index < lessons.length - 1 && (
            <button
              onClick={handleNext}
              className="w-full mt-4 py-3 rounded-xl text-white text-[13px] font-semibold"
              style={{ background: "#1F4D3A" }}
            >
              Next lesson
            </button>
          )}
        </div>
      )}
    </div>
  );
}