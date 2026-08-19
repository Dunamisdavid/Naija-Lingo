"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square } from "lucide-react";
import { LANGS } from "@/data/languages";
import { useRecorder } from "@/hooks/useRecorder";
import ListenButton from "@/components/ListenButton";

function getRecordingDuration(phrase) {
  const wordCount = phrase.trim().split(/\s+/).length;
  const ms = 2500 + wordCount * 700;
  return Math.min(Math.max(ms, 3000), 10000);
}

export default function SpeakScreen({ lang }) {
  const l = LANGS[lang];
  const { recording, startRecording, stopRecording } = useRecorder();
  const [scoring, setScoring] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const autoStopTimer = useRef(null);
  const stoppedRef = useRef(false);

  const targetPhrase = l.greet;

  useEffect(() => {
    setResult(null);
    setError(null);
    setScoring(false);
    if (recording) stopRecording();
  }, [lang]);

  const submitRecording = async (blob) => {
    setScoring(true);
    const formData = new FormData();
    formData.append("audio", blob, "recording.webm");
    formData.append("expectedText", targetPhrase);
    formData.append("language", lang);

    try {
      const res = await fetch("/api/pronunciation", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Couldn't score that attempt — check your connection and try again.");
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
    setError(null);
    setResult(null);

    if (!recording) {
      try {
        stoppedRef.current = false;
        await startRecording();
        const duration = getRecordingDuration(targetPhrase);
        autoStopTimer.current = setTimeout(finishRecording, duration);
      } catch {
        setError("Microphone access is needed to practice speaking.");
      }
      return;
    }

    finishRecording();
  };

  return (
    <div className="px-6 pt-8 flex flex-col items-center text-center">
      <p className="text-[10px] font-semibold uppercase" style={{ color: "var(--ink-soft)", letterSpacing: "0.14em" }}>
        Your {l.label} companion
      </p>
      <h2 className="font-display text-[20px] mt-2 mb-10" style={{ color: "var(--ink)" }}>{l.tutor}</h2>

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
        <p className="text-[16px] font-display italic" style={{ color: "var(--ink)" }}>Say: "{targetPhrase}"</p>
        <ListenButton text={targetPhrase} language={lang} accent="var(--gold)" label="" />
      </div>

      {error && <p className="text-[13px]" style={{ color: "#B4483B" }}>{error}</p>}

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
        </div>
      )}
    </div>
  );
}