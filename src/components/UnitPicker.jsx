"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ChevronRight, Lock } from "lucide-react";
import GildedCard from "@/components/GildedCard";

export default function UnitPicker({ lang, onSelectUnit }) {
  const { data: session } = useSession();
  const [units, setUnits] = useState(null);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    fetch(`/api/units?lang=${lang}`).then((res) => res.json()).then(setUnits);
    if (session) {
      fetch("/api/progress").then((res) => res.json()).then(setProgress);
    } else {
      setProgress([]);
    }
  }, [lang, session]);

  if (!units) {
    return (
      <div className="px-5 pt-6 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 w-full animate-pulse" style={{ background: "var(--border)" }} />
        ))}
      </div>
    );
  }

  const completedIds = new Set(progress.map((p) => p.lessonId));

  return (
    <div className="px-5 pt-4 space-y-3">
      <p className="text-[10px] font-semibold uppercase mb-1" style={{ color: "var(--ink-soft)", letterSpacing: "0.14em" }}>
        Choose a unit
      </p>
      {units.map((unit, i) => {
        const total = unit.lessons.length;
        const completed = unit.lessons.filter((l) => completedIds.has(l.id)).length;
        const prevUnit = units[i - 1];
        const prevComplete = !prevUnit || prevUnit.lessons.length === 0 || prevUnit.lessons.every((l) => completedIds.has(l.id));
        const isLocked = total === 0 || (i > 0 && !prevComplete);

        return (
          <GildedCard
            key={unit.id}
            onClick={() => !isLocked && onSelectUnit(unit)}
            className={`p-4 flex items-center justify-between transition-all duration-150 ${
              isLocked ? "opacity-40" : "cursor-pointer hover:-translate-y-0.5"
            }`}
          >
            <div>
              <p className="font-display text-[16px]" style={{ color: "var(--ink)" }}>{unit.title}</p>
              <p className="text-[11px]" style={{ color: "var(--ink-soft)" }}>
                {total === 0 ? "Coming soon" : `${completed}/${total} complete`}
              </p>
            </div>
            {isLocked ? (
              <Lock size={16} style={{ color: "var(--ink-soft)" }} />
            ) : (
              <ChevronRight size={16} style={{ color: "var(--gold)" }} />
            )}
          </GildedCard>
        );
      })}
    </div>
  );
}