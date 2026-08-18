"use client";

import { useState, useEffect } from "react";

export default function ProgressBar({ pct }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(pct), 100);
    return () => clearTimeout(timer);
  }, [pct]);

  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden bg-white/20">
      <div
        className="h-full rounded-full bg-[#D4A24C] transition-all duration-700 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}