import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/index.js";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const entries = [
  // Yorùbá — Proverbs
  { language: "yo", category: "Proverbs", title: "On patience and time", body: "An elder does not stand by while a newborn's head bends wrong — someone experienced should always be there to guide.", phrase: "Àgbà kì í wà lọ́jà, kí orí ọmọ tuntun wọ́." },
  { language: "yo", category: "Proverbs", title: "On unity", body: "One finger cannot pick up a stone — real strength comes from working together.", phrase: "Ìka ẹyọ kò lè gbé okuta." },
  // Yorùbá — Names
  { language: "yo", category: "Names", title: "Adéọlá", body: "Means \"the crown has wealth\" — traditionally given to children born into families of standing or as a hopeful blessing." },
  { language: "yo", category: "Names", title: "Ifáolúwa", body: "Means \"Ifá belongs to God\" — a name reflecting the Yorùbá Ifá divination tradition alongside faith." },
  // Yorùbá — Greetings
  { language: "yo", category: "Greetings", title: "Morning", body: "Used any time before noon, to family, elders, or strangers alike.", phrase: "Ẹ káàárọ̀" },
  { language: "yo", category: "Greetings", title: "Evening", body: "Said as day turns to night — a warm way to close out the day with someone.", phrase: "Ẹ kú alẹ́" },

  // Igbo — Proverbs
  { language: "ig", category: "Proverbs", title: "On sharing", body: "One person does not eat a rat alone — success and resources are meant to be shared.", phrase: "Otu onye adịghị eri oke." },
  { language: "ig", category: "Proverbs", title: "On cooperation", body: "A single broom straw cannot sweep a floor — real work needs many hands together.", phrase: "Otu ahịhịa azụzụ adịghị azụ ala." },
  // Igbo — Names
  { language: "ig", category: "Names", title: "Chiamaka", body: "Means \"God is beautiful\" — one of the most widely used Igbo names, given regardless of gender." },
  { language: "ig", category: "Names", title: "Nnamdi", body: "Means \"my father is alive\" — often given when a child is born resembling or in memory of a father figure." },
  // Igbo — Greetings
  { language: "ig", category: "Greetings", title: "Morning", body: "The standard morning greeting, used warmly among family and neighbours.", phrase: "Ụtụtụ ọma" },
  { language: "ig", category: "Greetings", title: "Farewell", body: "Said when parting ways, wishing the other person well until the next meeting.", phrase: "Ka chi fọọ" },

  // Hausa — Proverbs
  { language: "ha", category: "Proverbs", title: "On cooperation", body: "One hand cannot lift a load — cooperation gets things done that individuals cannot.", phrase: "Hannu ɗaya bai ɗauke jinka ba." },
  { language: "ha", category: "Proverbs", title: "On patience", body: "Slow and steady catches the bird — haste often costs more than it saves.", phrase: "A hankalce ake kama tsuntsu." },
  // Hausa — Names
  { language: "ha", category: "Names", title: "Amina", body: "Means \"trustworthy\" or \"faithful\" — historically linked to Queen Amina of Zazzau, a celebrated Hausa warrior leader." },
  { language: "ha", category: "Names", title: "Ibrahim", body: "The Hausa/Islamic form of Abraham — one of the most common names across Northern Nigeria." },
  // Hausa — Greetings
  { language: "ha", category: "Greetings", title: "Morning", body: "A common morning greeting exchanged between neighbours and family.", phrase: "Ina kwana" },
  { language: "ha", category: "Greetings", title: "Farewell", body: "Said when parting, meaning roughly \"until later.\"", phrase: "Sai anjima" },
];

async function main() {
  await prisma.cultureEntry.createMany({ data: entries });
  console.log(`Seeded ${entries.length} culture entries ✓`);
}

main().finally(() => prisma.$disconnect());