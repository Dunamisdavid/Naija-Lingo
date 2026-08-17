import { Play, Heart, Share2 } from "lucide-react";
import { LANGS } from "@/data/languages";

const categories = ["Proverbs", "Names", "Food", "Greetings", "Festivals", "Family", "History", "Stories"];

export default function CultureScreen({ lang }) {
  const l = LANGS[lang];

  return (
    <div className="px-5 pt-4 space-y-4">
      <h2 className="font-display text-[19px] text-[#22231F]">Discover {l.label} Culture</h2>

      <div className="rounded-[22px] p-5 bg-[#22231F]">
        <p className="text-[11px] uppercase tracking-wide font-semibold mb-2" style={{ color: l.accent }}>
          Today's proverb
        </p>
        <p className="font-display text-[18px] text-white leading-snug mb-3">"{l.proverb}"</p>
        <p className="text-[12px] text-[#C9C4B6] leading-relaxed mb-4">{l.proverbMeaning}</p>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-[12px] text-white/90"><Play size={13} /> Listen</button>
          <button className="flex items-center gap-1.5 text-[12px] text-white/90"><Heart size={13} /> Save</button>
          <button className="flex items-center gap-1.5 text-[12px] text-white/90"><Share2 size={13} /> Share</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {categories.map((c) => (
          <div key={c} className="rounded-xl bg-white border border-[#EDE6D6] px-4 py-3.5 text-[13px] font-semibold text-[#22231F]">
            {c}
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-4 mb-8" style={{ background: l.accentSoft }}>
        <p className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: l.accent }}>
          Word of the day
        </p>
        <p className="font-display text-[22px] text-[#22231F]">{l.word}</p>
        <p className="text-[12px] text-[#5C5648] mb-2">{l.wordMeaning}</p>
        <p className="text-[12px] text-[#5C5648] italic">{l.wordEx}</p>
      </div>
    </div>
  );
}