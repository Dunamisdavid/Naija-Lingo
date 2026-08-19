import { Heart, Share2 } from "lucide-react";
import { LANGS } from "@/data/languages";
import ListenButton from "@/components/ListenButton";
import GildedCard from "@/components/GildedCard";

const categories = ["Proverbs", "Names", "Food", "Greetings", "Festivals", "Family", "History", "Stories"];

export default function CultureScreen({ lang }) {
  const l = LANGS[lang];

  return (
    <div className="px-5 pt-4 space-y-4">
      <h2 className="font-display text-[19px]" style={{ color: "var(--ink)" }}>Discover {l.label} Culture</h2>

      <GildedCard className="p-6" style={{ background: "var(--emerald)" }}>
        <p className="text-[10px] font-semibold uppercase mb-2" style={{ color: "var(--gold)", letterSpacing: "0.14em" }}>
          Today's proverb
        </p>
        <p className="font-display text-[17px] italic leading-snug mb-3" style={{ color: "var(--canvas)" }}>
          "{l.proverb}"
        </p>
        <p className="text-[12px] leading-relaxed mb-4" style={{ color: "var(--ink-soft)" }}>{l.proverbMeaning}</p>
        <div className="flex items-center gap-4">
          <ListenButton text={l.proverb} language={lang} accent="var(--gold)" label="Listen" />
          <button className="flex items-center gap-1.5 text-[12px] transition-opacity hover:opacity-70" style={{ color: "var(--canvas)" }}>
            <Heart size={13} /> Save
          </button>
          <button className="flex items-center gap-1.5 text-[12px] transition-opacity hover:opacity-70" style={{ color: "var(--canvas)" }}>
            <Share2 size={13} /> Share
          </button>
        </div>
      </GildedCard>

      <div className="grid grid-cols-2 gap-3">
        {categories.map((c) => (
          <GildedCard
            key={c}
            className="px-4 py-3.5 text-[12px] font-semibold cursor-pointer transition-all duration-150 hover:-translate-y-0.5"
            style={{ color: "var(--ink)" }}
          >
            {c}
          </GildedCard>
        ))}
      </div>

      <GildedCard className="p-4 mb-8">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-semibold uppercase" style={{ color: "var(--gold)", letterSpacing: "0.14em" }}>
            Word of the day
          </p>
          <ListenButton text={l.word} language={lang} accent="var(--gold)" label="" />
        </div>
        <p className="font-display text-[22px]" style={{ color: "var(--ink)" }}>{l.word}</p>
        <p className="text-[12px] mb-2" style={{ color: "var(--ink-soft)" }}>{l.wordMeaning}</p>
        <p className="text-[12px] italic" style={{ color: "var(--ink-soft)" }}>{l.wordEx}</p>
      </GildedCard>
    </div>
  );
}