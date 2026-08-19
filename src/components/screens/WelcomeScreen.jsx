"use client";

import { signIn } from "next-auth/react";

export default function WelcomeScreen({ onSkip }) {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-8 text-center"
      style={{ background: "var(--canvas)" }}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
        style={{ border: "1px solid var(--gold)", boxShadow: "inset 0 0 12px rgba(184,147,90,0.08)" }}
      >
        <span className="font-display text-[15px]" style={{ color: "var(--gold)", letterSpacing: "0.05em" }}>NL</span>
      </div>

      <p className="font-display text-[26px] mb-3" style={{ color: "var(--ink)" }}>Naija Lingo</p>
      <p className="text-[13px] leading-relaxed mb-10 max-w-[260px]" style={{ color: "var(--ink-soft)" }}>
        Yorùbá, Igbo and Hausa — through conversation, culture, and story.
      </p>

      <button
        onClick={() => signIn("google")}
        className="w-full max-w-[260px] py-3 text-[12px] font-semibold uppercase mb-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg"
        style={{ background: "var(--gold)", color: "var(--canvas)", letterSpacing: "0.1em" }}
      >
        Sign in with Google
      </button>
      <button
        onClick={onSkip}
        className="text-[12px] transition-opacity hover:opacity-70"
        style={{ color: "var(--ink-soft)" }}
      >
        Continue without an account
      </button>
    </div>
  );
}