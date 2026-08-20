import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/index.js";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const entries = [
  // ---- Food ----
  { language: "yo", category: "Food", title: "Ìyán (Pounded Yam)", body: "A staple made from boiled yam pounded into a smooth, stretchy dough, traditionally eaten with a rich soup like egusi or ẹ̀fọ́ rírò.", phrase: "Ìyán" },
  { language: "yo", category: "Food", title: "Ẹ̀fọ́ Rírò", body: "A vegetable soup made with leafy greens, blended with palm oil, peppers, and assorted meat or fish — commonly eaten with pounded yam or rice.", phrase: "Ẹ̀fọ́ Rírò" },
  { language: "ig", category: "Food", title: "Ofe Nsala (White Soup)", body: "A light, peppery soup traditionally made without palm oil, often prepared with catfish and yam as a thickener — associated with celebrations and honoring guests.", phrase: "Ofe Nsala" },
  { language: "ig", category: "Food", title: "Ji (Yam)", body: "Yam holds deep cultural significance among the Igbo, celebrated yearly at the New Yam Festival (Iri Ji) to honor the harvest.", phrase: "Ji" },
  { language: "ha", category: "Food", title: "Tuwo Shinkafa", body: "A soft rice-based swallow, commonly paired with soups like miyan kuka (baobab leaf soup) — a staple across Northern Nigeria.", phrase: "Tuwo Shinkafa" },
  { language: "ha", category: "Food", title: "Suya", body: "Spiced, skewered grilled meat seasoned with a peanut-based spice blend called yaji — a beloved street food enjoyed nationwide, with deep roots in Hausa culinary tradition.", phrase: "Suya" },

  // ---- Festivals ----
  { language: "yo", category: "Festivals", title: "Ọ̀ṣun Òṣogbo Festival", body: "An annual festival honoring the river goddess Ọ̀ṣun, held in Osun State — recognized by UNESCO as a World Heritage event, drawing devotees and visitors from around the world.", phrase: null },
  { language: "yo", category: "Festivals", title: "Ẹ̀yọ́ Festival", body: "A Lagos Island masquerade festival featuring white-robed figures, held to honor deceased kings or chiefs, blending spectacle with deep ancestral reverence.", phrase: null },
  { language: "ig", category: "Festivals", title: "Iri Ji (New Yam Festival)", body: "A harvest celebration held across Igboland to give thanks for the year's yam harvest, marked by feasting, masquerades, and traditional dances.", phrase: null },
  { language: "ig", category: "Festivals", title: "Mmanwu Festival", body: "A masquerade festival where elaborately costumed spirits (mmanwu) are believed to represent ancestors, performing for the community with music and dance.", phrase: null },
  { language: "ha", category: "Festivals", title: "Durbar Festival", body: "A grand horseback procession held during Eid celebrations in cities like Kano and Katsina, featuring colorfully dressed horsemen paying homage to the Emir.", phrase: null },
  { language: "ha", category: "Festivals", title: "Argungu Fishing Festival", body: "An annual fishing competition in Kebbi State drawing thousands of participants into the river, blending sport, culture, and community celebration.", phrase: null },

  // ---- History ----
  { language: "yo", category: "History", title: "The Ọ̀yọ́ Empire", body: "One of the most powerful West African states from the 17th to early 19th century, known for its cavalry-based military and sophisticated political structure centered on the Aláàfin.", phrase: null },
  { language: "yo", category: "History", title: "Ifá Divination System", body: "A centuries-old spiritual and philosophical system of divination, recognized by UNESCO as Intangible Cultural Heritage, central to traditional Yorùbá worldview.", phrase: null },
  { language: "ig", category: "History", title: "Nri Kingdom", body: "Considered one of the oldest Igbo kingdoms, Nri was a spiritual and ritual center rather than a militarized state, influential in shaping early Igbo religious and political life.", phrase: null },
  { language: "ig", category: "History", title: "Igbo Republicanism", body: "Unlike many neighboring societies, much of pre-colonial Igbo political life was organized around decentralized, village-based councils rather than centralized kingship.", phrase: null },
  { language: "ha", category: "History", title: "The Sokoto Caliphate", body: "Founded in 1804 by Usman dan Fodio, it became one of the largest states in Africa in the 19th century, deeply shaping Hausa-Fulani political and Islamic scholarly tradition.", phrase: null },
  { language: "ha", category: "History", title: "Hausa City-States", body: "Before the Caliphate, independent Hausa city-states like Kano, Katsina, and Zaria flourished as centers of trade, scholarship, and craftsmanship along trans-Saharan routes.", phrase: null },

  // ---- Stories ----
  { language: "yo", category: "Stories", title: "Ìjàpá the Tortoise", body: "A trickster figure in countless Yorùbá folktales, Ìjàpá uses cunning rather than strength to outwit bigger animals — stories about him often teach lessons about the consequences of greed and deceit.", phrase: null },
  { language: "yo", category: "Stories", title: "Why the Sky is Far Away", body: "A traditional tale explaining why the sky, once close enough to touch and eat from, moved far from the earth after people grew wasteful and disrespectful.", phrase: null },
  { language: "ig", category: "Stories", title: "The Tortoise and the Birds", body: "A widely told Igbo folktale about a tortoise who tricks the birds into lending him feathers to attend a feast in the sky, only to be left stranded after his greed is exposed.", phrase: null },
  { language: "ig", category: "Stories", title: "Why the Moon and Sun Live in the Sky", body: "A folktale explaining the separation of the sun and moon, often used to teach about jealousy and the value of humility.", phrase: null },
  { language: "ha", category: "Stories", title: "Gizo the Spider", body: "A cunning trickster figure common in Hausa oral tradition — his stories often highlight cleverness winning over brute strength, with moral lessons woven throughout.", phrase: null },
  { language: "ha", category: "Stories", title: "The Hunter and the Talking Skull", body: "A cautionary Hausa folktale about a hunter who ignores a warning from a talking skull about the dangers of boastfulness, learning the lesson too late.", phrase: null },
];

async function main() {
  await prisma.cultureEntry.createMany({
    data: entries.map((e) => ({ ...e, published: false })),
  });
  console.log(`Created ${entries.length} draft culture entries (unpublished).`);
  console.log("\n⚠️  History and Festivals especially need fact-checking — dates, names, and details drafted from general knowledge, not verified against authoritative sources.");
}

main().finally(() => prisma.$disconnect());
