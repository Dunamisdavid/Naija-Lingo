"use client";

import { useState, useEffect } from "react";
import { Heart, Share2, ArrowLeft, AlertCircle } from "lucide-react";
import { LANGS } from "@/data/languages";
import ListenButton from "@/components/ListenButton";
import GildedCard from "@/components/GildedCard";

const ALL_CATEGORIES = ["Proverbs", "Names", "Food", "Greetings", "Festivals", "Family", "History", "Stories"];

function CategoryDetail({ lang, category, onBack }) {
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setEntries(null);
    setError(null);
    fetch(`/api/culture?lang=${lang}&category=${category}`)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then(setEntries)
      .catch(() => setError("Couldn't load this content — check your connection and try again."));
  }, [lang, category]);

  return (
    <div className="px-5 pt-4 space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[12px] font-medium transition-opacity hover:opacity-70"
        style={{ color: "var(--ink-soft)" }}
      >
        <ArrowLeft size={14} /> Back to Culture
      </button>

      <h2 className="font-display text-[19px]" style={{ color: "var(--ink)" }}>{category}</h2>

      {error && (
        <div className="flex flex-col items-center text-center pt-6">
          <AlertCircle size={22} style={{ color: "#B4483B" }} className="mb-2" />
          <p className="text-[13px]" style={{ color: "var(--ink-soft)" }}>{error}</p>
        </div>
      )}

      {!entries && !error && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 w-full animate-pulse" style={{ background: "var(--border)" }} />
          ))}
        </div>
      )}

      {entries && entries.length === 0 && (
        <p className="text-[13px] pt-6 text-center" style={{ color: "var(--ink-soft)" }}>
          Nothing here yet — check back soon.
        </p>
      )}

      {entries?.map((entry) => (
        <GildedCard key={entry.id} className="p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="font-display text-[17px]" style={{ color: "var(--ink)" }}>{entry.title}</p>
            {entry.phrase && <ListenButton text={entry.phrase} language={lang} accent="var(--gold)" label="" />}
          </div>
          {entry.phrase && (
            <p className="text-[15px] font-display italic mb-2" style={{ color: "var(--gold)" }}>"{entry.phrase}"</p>
          )}
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>{entry.body}</p>
        </GildedCard>
      ))}
    </div>
  );
}

export default function CultureScreen({ lang }) {
  const l = LANGS[lang];
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [liveCategories, setLiveCategories] = useState([]);

  useEffect(() => {
    fetch(`/api/culture/categories?lang=${lang}`)
      .then((res) => res.json())
      .then(setLiveCategories);
  }, [lang]);
  
  if (selectedCategory) {
    return <CategoryDetail lang={lang} category={selectedCategory} onBack={() => setSelectedCategory(null)} />;
  }

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
        {ALL_CATEGORIES.map((c) => {
          const isLive = liveCategories.includes(c);
          return (
            <GildedCard
              key={c}
              onClick={() => isLive && setSelectedCategory(c)}
              className={`px-4 py-3.5 text-[12px] font-semibold transition-all duration-150 ${
                isLive ? "cursor-pointer hover:-translate-y-0.5" : "opacity-40"
              }`}
              style={{ color: "var(--ink)" }}
            >
              {c}
              {!isLive && (
                <span className="block text-[9px] font-normal mt-0.5" style={{ color: "var(--ink-soft)" }}>
                  Coming soon
                </span>
              )}
            </GildedCard>
          );
        })}
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