"use client";

import { useState, useEffect } from "react";

export default function ProgressBar({ pct }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(pct), 100);
    return () => clearTimeout(timer);
  }, [pct]);

  return (
    <div className="w-full h-[1px]" style={{ background: "rgba(201,165,102,0.2)" }}>
      <div
        className="h-full transition-all duration-700 ease-out"
        style={{ width: `${width}%`, background: "var(--gold)" }}
      />
    </div>
  );
}