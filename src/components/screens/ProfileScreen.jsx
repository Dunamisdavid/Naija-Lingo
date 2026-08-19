"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { LANGS } from "@/data/languages";
import GildedCard from "@/components/GildedCard";

export default function ProfileScreen({ lang }) {
  const l = LANGS[lang];
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="px-5 pt-6">
        <div className="h-6 w-32 animate-pulse" style={{ background: "var(--border)" }} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="px-5 pt-10 flex flex-col items-center text-center">
        <p className="font-display text-[19px] mb-2" style={{ color: "var(--ink)" }}>Save your progress</p>
        <p className="text-[13px] mb-6" style={{ color: "var(--ink-soft)" }}>
          Sign in to keep your streak, words learned, and lessons across devices.
        </p>
        <button
          onClick={() => signIn("google")}
          className="px-5 py-3 text-[12px] font-semibold uppercase transition-all hover:opacity-90"
          style={{ background: "var(--gold)", color: "var(--canvas)", letterSpacing: "0.08em" }}
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 space-y-4">
      <div className="flex items-center gap-3">
        {session.user.image && (
          <img src={session.user.image} alt="" className="w-12 h-12 rounded-full" style={{ border: "1px solid var(--gold)" }} />
        )}
        <div>
          <h2 className="font-display text-[19px]" style={{ color: "var(--ink)" }}>{session.user.name}</h2>
          <p className="text-[13px]" style={{ color: "var(--ink-soft)" }}>{l.label} · Level 8</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <GildedCard className="p-4">
          <p className="text-[10px] font-semibold uppercase mb-1" style={{ color: "var(--ink-soft)", letterSpacing: "0.1em" }}>
            Words learned
          </p>
          <p className="font-display text-[22px]" style={{ color: "var(--ink)" }}>482</p>
        </GildedCard>
        <GildedCard className="p-4">
          <p className="text-[10px] font-semibold uppercase mb-1" style={{ color: "var(--ink-soft)", letterSpacing: "0.1em" }}>
            Streak
          </p>
          <p className="font-display text-[22px]" style={{ color: "var(--ink)" }}>14 days</p>
        </GildedCard>
      </div>

      <GildedCard className="p-4" style={{ background: "var(--emerald)" }}>
        <p className="text-[10px] font-semibold uppercase mb-2" style={{ color: "var(--gold)", letterSpacing: "0.14em" }}>
          Focus today
        </p>
        <p className="text-[13px]" style={{ color: "var(--canvas)" }}>
          Let's work on pronunciation — you're at 73%, up from 61% last week.
        </p>
      </GildedCard>

      <button
        onClick={() => signOut()}
        className="text-[13px] font-medium pt-2 transition-opacity hover:opacity-70"
        style={{ color: "#B4483B" }}
      >
        Sign out
      </button>
    </div>
  );
}