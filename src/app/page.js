"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import LanguageSelector from "@/components/LanguageSelector";
import HomeScreen from "@/components/screens/HomeScreen";
import LearnScreen from "@/components/screens/LearnScreen";
import SpeakScreen from "@/components/screens/SpeakScreen";
import CultureScreen from "@/components/screens/CultureScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [lang, setLang] = useState("yo");

  return (
    <main className="min-h-screen w-full max-w-[430px] mx-auto bg-[#FAF3E7] pb-20 overflow-x-hidden">
      <LanguageSelector lang={lang} onLangChange={setLang} />

      {activeTab === "home" && <HomeScreen lang={lang} />}
      {activeTab === "learn" && <LearnScreen lang={lang} />}
      {activeTab === "speak" && <SpeakScreen lang={lang} />}
      {activeTab === "culture" && <CultureScreen lang={lang} />}
      {activeTab === "profile" && <ProfileScreen lang={lang} />}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  );
}