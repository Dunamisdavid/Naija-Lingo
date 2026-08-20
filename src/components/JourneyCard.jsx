import ProgressBar from "./ProgressBar";
import GildedCard from "./GildedCard";

export default function JourneyCard({ onNavigate, progress }) {
  return (
    <GildedCard className="mx-5 mt-5 p-5">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px] font-semibold uppercase" style={{ color: "var(--ink-soft)", letterSpacing: "0.14em" }}>
          Your journey
        </p>
        <span className="text-[11px] font-semibold" style={{ color: "var(--gold)" }}>
          {progress.completed}/{progress.total} lessons
        </span>
      </div>
      <p className="font-display text-[15px] mb-3" style={{ color: "var(--ink)" }}>{progress.nextLabel}</p>
      <ProgressBar pct={progress.pct} />
      <button
        onClick={() => onNavigate("culture")}
        className="text-[11px] mt-2 transition-opacity hover:opacity-70"
        style={{ color: "var(--gold)" }}
      >
        Explore Culture →
      </button>
    </GildedCard>
  );
}