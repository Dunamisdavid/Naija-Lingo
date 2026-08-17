import { Flame } from "lucide-react";

export default function HomeHeader() {
  return (
    <div className="flex items-center justify-between pt-4 px-5">
      <div>
        <p className="text-[13px] text-[#8A8478]">Good evening</p>
        <h1 className="font-display text-[22px] leading-tight text-[#22231F]">
          Tobi 👋🏽
        </h1>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1DDD0]">
        <Flame size={14} className="text-[#C1622D]" />
        <span className="text-[12px] font-semibold text-[#C1622D]">7</span>
      </div>
    </div>
  );
}