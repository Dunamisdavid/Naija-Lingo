"use client";

import { Home, BookOpen, Mic, Compass, User } from "lucide-react";

const tabs = [
  { id: "home", icon: Home },
  { id: "learn", icon: BookOpen },
  { id: "speak", icon: Mic },
  { id: "culture", icon: Compass },
  { id: "profile", icon: User },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto flex justify-center pb-6 pt-3">
      <div
        className="flex items-center gap-5 px-5 py-3 rounded-full"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "0 8px 24px -8px rgba(0,0,0,0.25)",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="transition-all duration-150 hover:opacity-70 active:scale-90"
          >
            <tab.icon
              size={tab.id === "speak" ? 20 : 17}
              color={activeTab === tab.id ? "var(--gold)" : "var(--ink-soft)"}
              strokeWidth={activeTab === tab.id ? 2.2 : 1.7}
            />
          </button>
        ))}
      </div>
    </div>
  );
}