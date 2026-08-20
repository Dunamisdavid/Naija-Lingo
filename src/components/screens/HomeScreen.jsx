"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { LANGS } from "@/data/languages";
import { computeStreak } from "@/lib/streak";
import ContinueCard from "@/components/ContinueCard";
import PracticeGrid from "@/components/PracticeGrid";
import JourneyCard from "@/components/JourneyCard";
import ProverbCard from "@/components/ProverbCard";
import HomeHeader from "@/components/HomeHeader";

export default function HomeScreen({ lang, onNavigate }) {
  const l = LANGS[lang];
  const { data: session } = useSession();
  const [streak, setStreak] = useState(0);
  const [courseProgress, setCourseProgress] = useState({ pct: 0, nextLabel: "Greetings", completed: 0, total: 0 });

  useEffect(() => {
    fetch(`/api/units?lang=${lang}`)
      .then((res) => res.json())
      .then(async (units) => {
        if (!session) {
          const firstUnit = units[0];
          setCourseProgress({ pct: 0, nextLabel: firstUnit?.title || "Greetings", completed: 0, total: firstUnit?.lessons.length || 0 });
          return;
        }

        const progressRes = await fetch("/api/progress");
        const progress = await progressRes.json();
        setStreak(computeStreak(progress));

        const completedIds = new Set(progress.map((p) => p.lessonId));
        const currentUnit = units.find((u) => u.lessons.length > 0 && !u.lessons.every((l) => completedIds.has(l.id))) || units[units.length - 1];

        const total = currentUnit.lessons.length;
        const completed = currentUnit.lessons.filter((l) => completedIds.has(l.id)).length;

        setCourseProgress({
          pct: total ? Math.round((completed / total) * 100) : 0,
          nextLabel: currentUnit.title,
          completed,
          total,
        });
      });
  }, [session, lang]);

  return (
    <>
      <HomeHeader name={session?.user?.name?.split(" ")[0]} streak={streak} />
      <ContinueCard onNavigate={onNavigate} progress={courseProgress} />
      <PracticeGrid onNavigate={onNavigate} />
      <JourneyCard onNavigate={onNavigate} progress={courseProgress} />
      <ProverbCard proverb={l.proverb} accent={l.accent} accentSoft={l.accentSoft} />
    </>
  );
}