import { Mic, BookOpen, Compass, Flame } from "lucide-react";
import GildedCard from "./GildedCard";

const items = [
  { icon: Mic, label: "Speak" },
  { icon: BookOpen, label: "Learn" },
  { icon: Compass, label: "Culture" },
  { icon: Flame, label: "Challenge" },
];

export default function PracticeGrid() {
  return (
    <div className="px-5 mt-5">
      <p className="text-[10px] font-semibold uppercase mb-2" style={{ color: "var(--ink-soft)", letterSpacing: "0.14em" }}>
        Today's practice
      </p>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => (
          <GildedCard key={i} className="px-4 py-4 flex items-center gap-2.5 transition-all duration-150 hover:-translate-y-0.5">
            <item.icon size={15} style={{ color: "var(--gold)" }} />
            <span className="text-[12px] font-semibold" style={{ color: "var(--ink)" }}>{item.label}</span>
          </GildedCard>
        ))}
      </div>
    </div>
  );
}