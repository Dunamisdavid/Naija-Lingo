"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import BottomNav from "@/components/BottomNav";
import LanguageSelector from "@/components/LanguageSelector";
import WelcomeScreen from "@/components/screens/WelcomeScreen";
import HomeScreen from "@/components/screens/HomeScreen";
import LearnScreen from "@/components/screens/LearnScreen";
import SpeakScreen from "@/components/screens/SpeakScreen";
import CultureScreen from "@/components/screens/CultureScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";
import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon } from "lucide-react";
import LanguageOnboarding from "@/components/screens/LanguageOnboarding";
import { LANGS } from "@/data/languages";

export default function Home() {
  const { status } = useSession();
  const [activeTab, setActiveTab] = useState("home");
  const [lang, setLang] = useState("yo");
  const [showWelcome, setShowWelcome] = useState(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated") {
      localStorage.setItem("nl_visited", "true");
      setShowWelcome(false);
      return;
    }

    const seen = localStorage.getItem("nl_visited");
    setShowWelcome(!seen);
  }, [status]);

  const [langChosen, setLangChosen] = useState(null);

  useEffect(() => {
    const savedLang = localStorage.getItem("nl_primary_lang");
    if (savedLang) {
      setLang(savedLang);
      setLangChosen(true);
    } else {
      setLangChosen(false);
    }
  }, []);

  const chooseLanguage = (key) => {
    setLang(key);
    localStorage.setItem("nl_primary_lang", key);
    setLangChosen(true);
  };

  const dismissWelcome = () => {
    localStorage.setItem("nl_visited", "true");
    setShowWelcome(false);
  };

  if (showWelcome === null) {
    return <div className="min-h-screen bg-[#FAF3E7]" />;
  }

  if (showWelcome) {
    return <WelcomeScreen onSkip={dismissWelcome} />;
  }

  if (langChosen === null) {
    return <div className="min-h-screen" style={{ background: "var(--canvas)" }} />;
  }

  if (langChosen === false) {
    return <LanguageOnboarding onSelect={chooseLanguage} />;
  }

  return (
    <main className="min-h-screen w-full max-w-[430px] mx-auto pb-24 overflow-x-hidden" style={{ background: "var(--canvas)" }}>
      <div className="flex items-center px-5 pt-4">
          {(activeTab === "home" || activeTab === "culture") ? (
            <LanguageSelector lang={lang} onLangChange={setLang} />
          ) : (
            <p className="text-[10px] font-semibold uppercase" style={{ color: "var(--ink-soft)", letterSpacing: "0.14em" }}>
              Learning {LANGS[lang].label}
            </p>
          )}
          <button
            onClick={toggleTheme}
            className="ml-auto p-2 rounded-full transition-opacity hover:opacity-70"
            style={{ color: "var(--gold)" }}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
      </div>

      <div key={activeTab} className="screen-enter">
        {activeTab === "home" && <HomeScreen lang={lang} onNavigate={setActiveTab} />}
        {activeTab === "learn" && <LearnScreen lang={lang} />}
        {activeTab === "speak" && <SpeakScreen lang={lang} />}
        {activeTab === "culture" && <CultureScreen lang={lang} />}
        {activeTab === "profile" && <ProfileScreen lang={lang} onLangChange={setLang} />}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  );
}