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
        <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-[#EDE6D6] flex items-center justify-around py-3 px-4">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className="flex flex-col items-center gap-1 transition-transform active:scale-90"
                >
                    <tab.icon
                        size={tab.id === "speak" ? 22 : 19}
                        className={activeTab === tab.id ? "text-[#C1622D]" : "text-[#B5AE9E]"}
                    />
                </button>
            ))}
        </div>
    );
}