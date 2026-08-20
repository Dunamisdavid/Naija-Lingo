"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Mic, Square, Check, AlertCircle, ChevronRight, Sparkles } from "lucide-react";
import { LANGS } from "@/data/languages";
import ListenButton from "@/components/ListenButton";
import GildedCard from "@/components/GildedCard";
import UnitPicker from "@/components/UnitPicker";
import { pickNextLesson } from "@/lib/spacedRepetition";
import { useRecorder } from "@/hooks/useRecorder";

const PASS_THRESHOLD = 60;

function getRecordingDuration(phrase) {
  const wordCount = phrase.trim().split(/\s+/).length;
  const ms = 2500 + wordCount * 700;
  return Math.min(Math.max(ms, 3000), 10000);
}

export default function LearnScreen({ lang }) {
  const l = LANGS[lang];
  const { data: session } = useSession();
  const { recording, startRecording, stopRecording } = useRecorder();

  const [unit, setUnit] = useState(null);
  const [lessons, setLessons] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState(null);

  // "present" (first-time teaching) -> "recognize" (multiple choice) -> "produce" (speak it)
  const [stage, setStage] = useState("present");
  const [answered, setAnswered] = useState(null);

  const [scoring, setScoring] = useState(false);
  const [speakResult, setSpeakResult] = useState(null);
  const [micError, setMicError] = useState(null);

  // Tracks completed lessons in-memory for guests who aren't signed in,
  // so a session without an account can still progress through a unit.
  const [guestCompleted, setGuestCompleted] = useState(new Set());

  const autoStopTimer = useRef(null);
  const stoppedRef = useRef(false);

  const loadLessons = async () => {
    setLessons(null);
    setLesson(null);
    setError(null);
    setAnswered(null);
    setStage("present");
    setSpeakResult(null);
    setMicError(null);

    try {
      const lessonsRes = await fetch(`/api/lessons?lang=${lang}&unitId=${unit.id}`);
      if (!lessonsRes.ok) throw new Error("Request failed");
      const lessonsData = await lessonsRes.json();
      setLessons(lessonsData);

      let picked;
      let hasSeenBefore = false;

      if (session) {
        const progressRes = await fetch("/api/progress");
        const progressData = await progressRes.json();
        picked = pickNextLesson(lessonsData, progressData);
        hasSeenBefore = picked ? progressData.some((p) => p.lessonId === picked.id) : false;
      } else {
        picked = lessonsData.find((les) => !guestCompleted.has(les.id)) || null;
        hasSeenBefore = false;
      }

      setLesson(picked);
      setStage(hasSeenBefore ? "recognize" : "present");
    } catch {
      setError("We couldn't load lessons. Check your connection and try again.");
    }
  };

  useEffect(() => {
    if (unit) loadLessons();
  }, [lang, session, unit]);

  useEffect(() => {
    setUnit(null);
    setGuestCompleted(new Set());
  }, [lang]);

  if (!unit) {
    return <UnitPicker lang={lang} onSelectUnit={setUnit} />;
  }

  const saveProgress = async (lessonId, score) => {
    if (!session) return;
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, language: lang, score: score ?? null }),
      });
    } catch {
      // Non-critical
    }
  };

  const handleCorrectAnswer = (i) => {
    setAnswered(i);
    if (i === lesson.correctIndex) {
      setStage("produce");
    }
  };

  const submitRecording = async (blob) => {
    setScoring(true);
    const formData = new FormData();
    formData.append("audio", blob, "recording.webm");
    formData.append("expectedText", lesson.phrase);
    formData.append("language", lang);

    try {
      const res = await fetch("/api/pronunciation", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setSpeakResult(data);

      if (data.score >= PASS_THRESHOLD) {
        if (session) {
          saveProgress(lesson.id, data.score);
        } else {
          setGuestCompleted((prev) => new Set(prev).add(lesson.id));
        }
      }
    } catch {
      setMicError("Couldn't score that attempt — check your connection and try again.");
    } finally {
      setScoring(false);
    }
  };

  const finishRecording = async () => {
    if (stoppedRef.current) return;
    stoppedRef.current = true;
    clearTimeout(autoStopTimer.current);
    const blob = await stopRecording();
    await submitRecording(blob);
  };

  const handleMicTap = async () => {
    setMicError(null);
    setSpeakResult(null);

    if (!recording) {
      try {
        stoppedRef.current = false;
        await startRecording();
        const duration = getRecordingDuration(lesson.phrase);
        autoStopTimer.current = setTimeout(finishRecording, duration);
      } catch {
        setMicError("Microphone access is needed to practice speaking.");
      }
      return;
    }
    finishRecording();
  };

  const handleNext = () => {
    loadLessons();
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

  // Genuinely still loading (lessons haven't come back yet)
  if (lessons === null) {
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

  // Lessons loaded, but genuinely nothing left to serve (guest finished the whole unit)
  if (!lesson && lessons.length > 0 && !session) {
    return (
      <div className="px-6 pt-16 flex flex-col items-center text-center">
        <p className="font-display text-[17px] mb-2" style={{ color: "var(--ink)" }}>
          Nice work — you've tried every phrase in this unit!
        </p>
        <p className="text-[13px]" style={{ color: "var(--ink-soft)" }}>
          Sign in to save your progress and keep going with spaced review.
        </p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="px-6 pt-16 flex flex-col items-center">
        <div className="w-32 h-32 rounded-full animate-pulse" style={{ background: "var(--border)" }} />
      </div>
    );
  }

  const passed = speakResult && speakResult.score >= PASS_THRESHOLD;
  const correctAnswerText = lesson.options[lesson.correctIndex];

  const stageLabel = { present: "New phrase", recognize: "Step 1: Recognize", produce: "Step 2: Speak it" }[stage];

  return (
    <div className="px-5 pt-4 space-y-4">
      <button
        onClick={() => setUnit(null)}
        className="text-[11px] transition-opacity hover:opacity-70"
        style={{ color: "var(--gold)" }}
      >
        ← Back to units
      </button>

      <p className="text-[10px] font-semibold uppercase" style={{ color: "var(--ink-soft)", letterSpacing: "0.14em" }}>
        {lesson.sceneLabel} · {stageLabel}
      </p>

      {stage === "present" && (
        <GildedCard className="p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Sparkles size={14} style={{ color: "var(--gold)" }} />
            <p className="text-[11px] font-semibold uppercase" style={{ color: "var(--gold)", letterSpacing: "0.1em" }}>
              First time seeing this phrase
            </p>
          </div>

          <p className="text-[13px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>{lesson.context}</p>

          <div
            className="px-4 py-4 flex items-center justify-between"
            style={{ background: "var(--canvas)", border: "1px solid var(--border)" }}
          >
            <p className="font-display text-[21px] italic" style={{ color: "var(--ink)" }}>"{lesson.phrase}"</p>
            <ListenButton text={lesson.phrase} language={lang} accent="var(--gold)" label="" />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase mb-1" style={{ color: "var(--ink-soft)", letterSpacing: "0.1em" }}>
              Means
            </p>
            <p className="text-[15px] font-medium" style={{ color: "var(--ink)" }}>{correctAnswerText}</p>
          </div>

          <p className="text-[12px]" style={{ color: "var(--ink-soft)" }}>
            Listen a couple of times, then tap below when you're ready to try recognizing it yourself.
          </p>

          <button
            onClick={() => setStage("recognize")}
            className="w-full py-3 text-[12px] font-semibold uppercase transition-all hover:opacity-90"
            style={{ background: "var(--gold)", color: "var(--canvas)", letterSpacing: "0.08em" }}
          >
            Got it — quiz me
          </button>
        </GildedCard>
      )}

      {stage === "recognize" && (
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
                  onClick={() => handleCorrectAnswer(i)}
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
      )}

      {stage === "produce" && (
        <GildedCard className="p-6 flex flex-col items-center text-center" style={{ background: "var(--emerald)" }}>
          <p className="text-[10px] font-semibold uppercase mb-1" style={{ color: "var(--gold)", letterSpacing: "0.14em" }}>
            Now say it yourself
          </p>
          <div className="flex items-center gap-2 mb-6">
            <p className="text-[16px] font-display italic" style={{ color: "var(--canvas)" }}>"{lesson.phrase}"</p>
            <ListenButton text={lesson.phrase} language={lang} accent="var(--gold)" label="" />
          </div>

          <button
            onClick={handleMicTap}
            disabled={scoring}
            className="relative w-24 h-24 rounded-full flex items-center justify-center mb-4 disabled:opacity-50 transition-all duration-150 hover:scale-105 active:scale-95"
            style={{ border: "1px solid var(--gold)", boxShadow: "inset 0 0 16px rgba(184,147,90,0.15)" }}
          >
            {recording && (
              <span className="absolute inset-0 rounded-full animate-ping" style={{ background: "var(--gold)", opacity: 0.2 }} />
            )}
            {recording ? <Square size={22} style={{ color: "var(--gold)" }} /> : <Mic size={26} style={{ color: "var(--gold)" }} />}
          </button>

          <p className="text-[12px] mb-2" style={{ color: "var(--ink-soft)" }}>
            {recording ? "Listening… tap to stop" : scoring ? "Scoring…" : "Tap to speak"}
          </p>

          {micError && <p className="text-[13px] mb-3" style={{ color: "#f5a89a" }}>{micError}</p>}

          {speakResult && (
            <div className="w-full space-y-3 text-left mt-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold uppercase" style={{ color: "var(--gold)", letterSpacing: "0.1em" }}>
                    Match accuracy
                  </span>
                  <span className="text-[12px] font-mono font-semibold" style={{ color: "var(--gold)" }}>{speakResult.score}%</span>
                </div>
                <div className="w-full h-[1px]" style={{ background: "rgba(184,147,90,0.25)" }}>
                  <div className="h-full" style={{ width: `${speakResult.score}%`, background: "var(--gold)" }} />
                </div>
              </div>
              <p className="text-[13px] italic" style={{ color: "var(--canvas)" }}>
                We heard: "{speakResult.heard || "(nothing recognized)"}"
              </p>

              {passed ? (
                <button
                  onClick={handleNext}
                  className="w-full mt-2 py-3 text-[12px] font-semibold uppercase flex items-center justify-center gap-1 transition-all hover:opacity-90"
                  style={{ background: "var(--gold)", color: "var(--emerald)", letterSpacing: "0.08em" }}
                >
                  Next lesson <ChevronRight size={14} />
                </button>
              ) : (
                <p className="text-[12px] text-center" style={{ color: "var(--ink-soft)" }}>
                  Try again to move on — aim for {PASS_THRESHOLD}%+
                </p>
              )}
            </div>
          )}
        </GildedCard>
      )}
    </div>
  );
}