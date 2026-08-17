import { ChevronRight } from "lucide-react";
import ProgressBar from "./ProgressBar";

export default function ContinueCard() {
  return (
    <div className="mx-5 mt-5 rounded-[22px] p-5 relative overflow-hidden bg-[#1F4D3A]">
      <p className="text-[11px] tracking-wide uppercase text-[#BFE0CE] font-medium">
        Continue speaking
      </p>
      <h3 className="font-display text-white text-[19px] mt-1">Greetings</h3>

      <div className="mt-3 mb-2">
        <ProgressBar pct={72} />
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-[12px] text-[#BFE0CE]">72% complete</span>
        <button className="flex items-center gap-1 text-white text-[13px] font-semibold">
          Continue <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}