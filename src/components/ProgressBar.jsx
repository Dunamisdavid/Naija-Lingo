export default function ProgressBar({ pct }) {
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden bg-white/20">
      <div
        className="h-full rounded-full bg-[#D4A24C] transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}