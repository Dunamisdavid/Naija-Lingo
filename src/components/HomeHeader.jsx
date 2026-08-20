import { Flame } from "lucide-react";

export default function HomeHeader({ name, streak }) {
  return (
    <div className="flex items-center justify-between pt-4 px-5">
      <div>
        <p className="text-[10px] font-semibold uppercase" style={{ color: "var(--ink-soft)", letterSpacing: "0.14em" }}>
          Good evening
        </p>
        <h1 className="font-display text-[24px] leading-tight mt-1" style={{ color: "var(--ink)" }}>
          {name || "there"}
        </h1>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ border: "1px solid var(--gold)44" }}>
        <Flame size={12} style={{ color: "var(--gold)" }} />
        <span className="text-[11px] font-semibold" style={{ color: "var(--gold)" }}>{streak}</span>
      </div>
    </div>
  );
}