import ProgressBar from "./ProgressBar";

export default function JourneyCard() {
  return (
    <div className="mx-5 mt-5 rounded-2xl bg-white border border-[#EDE6D6] p-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[12px] font-semibold text-[#8A8478] uppercase tracking-wide">
          Your journey
        </p>
        <span className="text-[12px] font-semibold text-[#C1622D]">Level 4</span>
      </div>
      <p className="font-display text-[15px] text-[#22231F] mb-2">
        Everyday Conversations
      </p>
      <ProgressBar pct={78} />
      <p className="text-[11px] text-[#8A8478] mt-1.5">78% · Explore Culture →</p>
    </div>
  );
}