"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Mic, Square, AlertCircle, ChevronRight, BookOpen } from "lucide-react";
import { LANGS } from "@/data/languages";
import { useRecorder } from "@/hooks/useRecorder";
import ListenButton from "@/components/ListenButton";
import GildedCard from "@/components/GildedCard";
import { pickReviewLesson } from "@/lib/spacedRepetition";

function getRecordingDuration(phrase) {
  const wordCount = phrase.trim().split(/\s+/).length;
  const ms = 2500 + wordCount * 700;
  return Math.min(Math.max(ms, 3000), 10000);
}

const PASS_THRESHOLD = 60;

export default function SpeakScreen({ lang }) {
  const l = LANGS[lang];
  const { data: session, status } = useSession();
  const { recording, startRecording, stopRecording } = useRecorder();

  const [lesson, setLesson] = useState(null);
  const [nothingToReview, setNothingToReview] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [scoring, setScoring] = useState(false);
  const [result, setResult] = useState(null);
  const [micError, setMicError] = useState(null);

  const autoStopTimer = useRef(null);
  const stoppedRef = useRef(false);

  const loadLesson = async () => {
    setLesson(null);
    setNothingToReview(false);
    setResult(null);
    setMicError(null);
    setLoadError(null);
    stoppedRef.current = false;

    try {
      const lessonsRes = await fetch(`/api/lessons?lang=${lang}`);
      if (!lessonsRes.ok) throw new Error("Request failed");
      const lessonsData = await lessonsRes.json();

      const progressRes = await fetch("/api/progress");
      const progressData = await progressRes.json();

      const picked = pickReviewLesson(lessonsData, progressData);
      if (!picked) {
        setNothingToReview(true);
        return;
      }
      setLesson(picked);
    } catch {
      setLoadError("We couldn't load your review. Check your connection and try again.");
    }
  };

  useEffect(() => {
    if (recording) stopRecording();
    if (status !== "loading" && session) loadLesson();
  }, [lang, session, status]);

  const saveProgress = async (lessonId, score) => {
    if (!session) return;
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, language: lang, score }),
      });
    } catch {
      // Non-critical
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
      setResult(data);
      saveProgress(lesson.id, data.score);
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
    setResult(null);

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
    loadLesson();
  };

  // Not signed in — review has nothing to work from without saved progress
  if (status !== "loading" && !session) {
    return (
      <div className="px-6 pt-16 flex flex-col items-center text-center">
        <BookOpen size={26} style={{ color: "var(--gold)" }} className="mb-3" />
        <p className="font-display text-[17px] mb-2" style={{ color: "var(--ink)" }}>
          Sign in to review
        </p>
        <p className="text-[13px]" style={{ color: "var(--ink-soft)" }}>
          Speak practice reviews phrases you've already learned. Sign in and complete a few lessons in Learn first.
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="px-5 pt-10 flex flex-col items-center text-center">
        <AlertCircle size={26} style={{ color: "#B4483B" }} className="mb-3" />
        <p className="text-[13px] mb-4" style={{ color: "var(--ink-soft)" }}>{loadError}</p>
        <button
          onClick={loadLesson}
          className="px-4 py-2 text-[12px] font-semibold uppercase transition-all hover:opacity-80"
          style={{ background: "var(--gold)", color: "var(--canvas)", letterSpacing: "0.08em" }}
        >
          Try again
        </button>
      </div>
    );
  }

  if (nothingToReview) {
    return (
      <div className="px-6 pt-16 flex flex-col items-center text-center">
        <BookOpen size={26} style={{ color: "var(--gold)" }} className="mb-3" />
        <p className="font-display text-[17px] mb-2" style={{ color: "var(--ink)" }}>
          Nothing to review yet
        </p>
        <p className="text-[13px]" style={{ color: "var(--ink-soft)" }}>
          Complete a lesson in Learn first — it'll show up here for review afterward.
        </p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="px-6 pt-10 flex flex-col items-center">
        <div className="w-32 h-32 rounded-full animate-pulse" style={{ background: "var(--border)" }} />
      </div>
    );
  }

  const passed = result && result.score >= PASS_THRESHOLD;

  return (
    <div className="px-6 pt-6 flex flex-col items-center text-center">
      <p className="text-[10px] font-semibold uppercase" style={{ color: "var(--ink-soft)", letterSpacing: "0.14em" }}>
        Review · {lesson.sceneLabel}
      </p>
      <h2 className="font-display text-[20px] mt-2 mb-8" style={{ color: "var(--ink)" }}>{l.tutor}</h2>

      <button
        onClick={handleMicTap}
        disabled={scoring}
        className="relative w-32 h-32 rounded-full flex items-center justify-center mb-6 disabled:opacity-50 transition-all duration-150 hover:scale-105 active:scale-95"
        style={{ border: "1px solid var(--gold)", boxShadow: "inset 0 0 20px rgba(184,147,90,0.1)" }}
      >
        {recording && (
          <span className="absolute inset-0 rounded-full animate-ping" style={{ background: "var(--gold)", opacity: 0.15 }} />
        )}
        {recording ? <Square size={26} style={{ color: "var(--gold)" }} /> : <Mic size={30} style={{ color: "var(--gold)" }} />}
      </button>

      <p className="text-[12px] mb-1" style={{ color: "var(--ink-soft)" }}>
        {recording ? "Listening… tap to stop" : scoring ? "Scoring…" : "Tap to speak"}
      </p>

      <div className="flex items-center gap-2 mb-8">
        <p className="text-[16px] font-display italic" style={{ color: "var(--ink)" }}>Say: "{lesson.phrase}"</p>
        <ListenButton text={lesson.phrase} language={lang} accent="var(--gold)" label="" />
      </div>

      {micError && <p className="text-[13px] mb-4" style={{ color: "#B4483B" }}>{micError}</p>}

      {result && (
        <div className="w-full space-y-4 text-left">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold uppercase" style={{ color: "var(--ink-soft)", letterSpacing: "0.1em" }}>
                Match accuracy
              </span>
              <span className="text-[12px] font-mono font-semibold" style={{ color: "var(--gold)" }}>{result.score}%</span>
            </div>
            <div className="w-full h-[1px]" style={{ background: "rgba(184,147,90,0.2)" }}>
              <div className="h-full" style={{ width: `${result.score}%`, background: "var(--gold)" }} />
            </div>
          </div>
          <div className="p-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-[10px] font-semibold uppercase mb-1" style={{ color: "var(--gold)", letterSpacing: "0.1em" }}>
              We heard
            </p>
            <p className="text-[14px] italic" style={{ color: "var(--ink)" }}>"{result.heard || "(nothing recognized)"}"</p>
          </div>

          <button
            onClick={handleNext}
            className="w-full py-3 text-[12px] font-semibold uppercase flex items-center justify-center gap-1 transition-all hover:opacity-90"
            style={{ background: "var(--gold)", color: "var(--canvas)", letterSpacing: "0.08em" }}
          >
            {passed ? "Next review" : "Try another"} <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}