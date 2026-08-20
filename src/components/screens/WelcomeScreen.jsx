"use client";

import { signIn } from "next-auth/react";

export default function WelcomeScreen({ onSkip }) {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-8 text-center"
      style={{ background: "var(--canvas)" }}
    >
      <img src="/logo.svg" alt="Naija Lingo" className="w-20 h-20 mb-6" />

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