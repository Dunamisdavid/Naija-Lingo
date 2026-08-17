import { LANGS } from "@/data/languages";

export default function ProfileScreen({ lang }) {
  const l = LANGS[lang];

  return (
    <div className="px-5 pt-6 space-y-4">
      <h2 className="font-display text-[19px] text-[#22231F]">Tobi</h2>
      <p className="text-[13px] text-[#8A8478]">{l.label} · Level 8</p>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white border border-[#EDE6D6] p-4">
          <p className="text-[11px] text-[#8A8478] uppercase tracking-wide mb-1">
            Words learned
          </p>
          <p className="font-display text-[22px] text-[#22231F]">482</p>
        </div>
        <div className="rounded-2xl bg-white border border-[#EDE6D6] p-4">
          <p className="text-[11px] text-[#8A8478] uppercase tracking-wide mb-1">
            Streak
          </p>
          <p className="font-display text-[22px] text-[#22231F]">14 days</p>
        </div>
      </div>

      <div className="rounded-2xl p-4 bg-[#F1DDD0]">
        <p className="text-[11px] font-semibold uppercase tracking-wide mb-2 text-[#C1622D]">
          Focus today
        </p>
        <p className="text-[13px] text-[#22231F]">
          Let's work on pronunciation — you're at 73%, up from 61% last week.
        </p>
      </div>
    </div>
  );
}