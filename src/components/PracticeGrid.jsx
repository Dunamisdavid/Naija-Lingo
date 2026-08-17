import { Mic, BookOpen, Compass, Flame } from "lucide-react";

const items = [
  { icon: Mic, label: "Speak" },
  { icon: BookOpen, label: "Learn" },
  { icon: Compass, label: "Culture" },
  { icon: Flame, label: "Challenge" },
];

export default function PracticeGrid() {
  return (
    <div className="px-5 mt-5">
      <p className="text-[13px] font-semibold text-[#8A8478] mb-2 tracking-wide uppercase">
        Today's practice
      </p>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white border border-[#EDE6D6] px-4 py-3.5 flex items-center gap-2.5 shadow-sm"
          >
            <item.icon size={17} className="text-[#C1622D]" />
            <span className="text-[13px] font-semibold text-[#22231F]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}