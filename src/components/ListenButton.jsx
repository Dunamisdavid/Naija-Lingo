"use client";

import { useState } from "react";
import { Play, Loader2 } from "lucide-react";

export default function ListenButton({ text, language, accent = "#C1622D", label = "Listen" }) {
  const [loading, setLoading] = useState(false);

  const handlePlay = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language }),
      });
      if (!res.ok) throw new Error("Request failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      audio.onended = () => URL.revokeObjectURL(url);
    } catch {
      alert("Couldn't play audio right now — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePlay}
      disabled={loading}
      className="flex items-center gap-1.5 text-[12px] font-medium disabled:opacity-50 transition-all duration-150 hover:opacity-70"
      style={{ color: accent }}
    >
      {loading ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
      {label}
    </button>
  );
}