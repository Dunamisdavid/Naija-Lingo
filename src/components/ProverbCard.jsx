export default function ProverbCard({ proverb, accent }) {
  return (
    <div className="mx-5 mt-5 mb-8 px-1">
      <p className="text-[10px] font-semibold uppercase" style={{ color: "var(--gold)", letterSpacing: "0.14em" }}>
        Proverb of the day
      </p>
      <p className="font-display text-[16px] mt-2 italic leading-snug" style={{ color: "var(--ink)" }}>
        "{proverb}"
      </p>
    </div>
  );
}