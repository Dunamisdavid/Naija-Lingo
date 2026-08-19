import { ChevronRight } from "lucide-react";
import ProgressBar from "./ProgressBar";
import GildedCard from "./GildedCard";

export default function ContinueCard() {
  return (
    <GildedCard className="mx-5 mt-5 p-6" style={{ background: "var(--emerald)" }}>
      <p className="text-[10px] font-semibold uppercase" style={{ color: "var(--gold)", letterSpacing: "0.14em" }}>
        Continue speaking
      </p>
      <h3 className="font-display text-[20px] mt-2" style={{ color: "var(--canvas)" }}>Greetings</h3>

      <div className="mt-4 mb-1">
        <ProgressBar pct={72} />
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-[11px]" style={{ color: "var(--ink-soft)" }}>72% complete</span>
        <button
          className="flex items-center gap-1 text-[12px] font-semibold transition-all duration-150 hover:-translate-y-0.5"
          style={{ color: "var(--gold)" }}
        >
          Continue <ChevronRight size={13} />
        </button>
      </div>
    </GildedCard>
  );
}