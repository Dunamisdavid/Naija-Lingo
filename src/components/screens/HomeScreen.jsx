import { LANGS } from "@/data/languages";
import ContinueCard from "@/components/ContinueCard";
import PracticeGrid from "@/components/PracticeGrid";
import JourneyCard from "@/components/JourneyCard";
import ProverbCard from "@/components/ProverbCard";
import HomeHeader from "@/components/HomeHeader";

export default function HomeScreen({ lang }) {
  const l = LANGS[lang];

  return (
    <>
      <HomeHeader />
      <ContinueCard />
      <PracticeGrid />
      <JourneyCard />
      <ProverbCard proverb={l.proverb} accent={l.accent} accentSoft={l.accentSoft} />
    </>
  );
}