export default function GildedCard({ children, className = "", style = {}, onClick }) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(0,0,0,0.25)",
        ...style,
      }}
      onClick={onClick}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }}
      />
      {children}
    </div>
  );
}