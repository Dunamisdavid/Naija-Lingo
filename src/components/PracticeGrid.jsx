import { Mic, BookOpen, Compass, Flame } from "lucide-react";
import GildedCard from "./GildedCard";

const items = [
  { icon: Mic, label: "Speak", tab: "speak" },
  { icon: BookOpen, label: "Learn", tab: "learn" },
  { icon: Compass, label: "Culture", tab: "culture" },
  { icon: Flame, label: "Challenge", tab: null },
];

export default function PracticeGrid({ onNavigate }) {
  return (
    <div className="px-5 mt-5">
      <p className="text-[10px] font-semibold uppercase mb-2" style={{ color: "var(--ink-soft)", letterSpacing: "0.14em" }}>
        Today's practice
      </p>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => (
          <GildedCard
            key={i}
            onClick={() => item.tab && onNavigate(item.tab)}
            className={`px-4 py-4 flex items-center gap-2.5 transition-all duration-150 hover:-translate-y-0.5 ${item.tab ? "cursor-pointer" : "opacity-50"}`}
          >
            <item.icon size={15} style={{ color: "var(--gold)" }} />
            <span className="text-[12px] font-semibold" style={{ color: "var(--ink)" }}>{item.label}</span>
          </GildedCard>
        ))}
      </div>
    </div>
  );
}