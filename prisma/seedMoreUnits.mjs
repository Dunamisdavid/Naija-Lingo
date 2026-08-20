import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/index.js";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const draftLessons = [
  // ---- Introductions (additional scenes) ----
  { language: "yo", unitTitle: "Introductions", order: 2, sceneLabel: "Introductions · Scene 2", context: "A new neighbour wants to know where you're from. You reply —", phrase: "Mo wá láti Èkó.", question: "What is he telling them?", options: ["I come from Lagos", "I am fine", "Nice to meet you", "What is your name"], correctIndex: 0 },
  { language: "yo", unitTitle: "Introductions", order: 3, sceneLabel: "Introductions · Scene 3", context: "After exchanging names, she smiles and says —", phrase: "Inú mi dùn láti pàdé ẹ.", question: "What does she mean?", options: ["Nice to meet you", "See you later", "Thank you", "I am busy"], correctIndex: 0 },

  { language: "ig", unitTitle: "Introductions", order: 2, sceneLabel: "Introductions · Scene 2", context: "A new friend asks where you're from. You reply —", phrase: "Esi m na Enugwu.", question: "What are you telling them?", options: ["I am from Enugu", "I am fine", "Nice to meet you", "What is your name"], correctIndex: 0 },
  { language: "ig", unitTitle: "Introductions", order: 3, sceneLabel: "Introductions · Scene 3", context: "After exchanging names, she smiles and says —", phrase: "Obi dị m ụtọ ịzute gị.", question: "What does she mean?", options: ["Nice to meet you", "See you later", "Thank you", "I am busy"], correctIndex: 0 },

  { language: "ha", unitTitle: "Introductions", order: 2, sceneLabel: "Introductions · Scene 2", context: "A new neighbour wants to know where you're from. You reply —", phrase: "Na fito daga Kano.", question: "What are you telling them?", options: ["I come from Kano", "I am fine", "Nice to meet you", "What is your name"], correctIndex: 0 },
  { language: "ha", unitTitle: "Introductions", order: 3, sceneLabel: "Introductions · Scene 3", context: "After exchanging names, she smiles and says —", phrase: "Na yi murnar saduwa da ke.", question: "What does she mean?", options: ["Nice to meet you", "See you later", "Thank you", "I am busy"], correctIndex: 0 },

  // ---- Family ----
  { language: "yo", unitTitle: "Family", order: 1, sceneLabel: "Family · Scene 1", context: "Visiting relatives, someone points to a woman across the room.", phrase: "Ìyá mi ni èyí.", question: "Who is he talking about?", options: ["My mother", "My sister", "My friend", "My teacher"], correctIndex: 0 },
  { language: "yo", unitTitle: "Family", order: 2, sceneLabel: "Family · Scene 2", context: "You hear footsteps outside, and someone announces —", phrase: "Bàbá ń bọ̀.", question: "What are they saying?", options: ["Father is coming", "Mother is coming", "Brother is coming", "Sister is coming"], correctIndex: 0 },

  { language: "ig", unitTitle: "Family", order: 1, sceneLabel: "Family · Scene 1", context: "Visiting relatives, someone points to a woman across the room.", phrase: "Nne m bụ onye a.", question: "Who is he talking about?", options: ["My mother", "My sister", "My friend", "My teacher"], correctIndex: 0 },
  { language: "ig", unitTitle: "Family", order: 2, sceneLabel: "Family · Scene 2", context: "You hear footsteps outside, and someone announces —", phrase: "Nna m na-abịa.", question: "What are they saying?", options: ["Father is coming", "Mother is coming", "Brother is coming", "Sister is coming"], correctIndex: 0 },

  { language: "ha", unitTitle: "Family", order: 1, sceneLabel: "Family · Scene 1", context: "Visiting relatives, someone points to a woman across the room.", phrase: "Wannan uwata ce.", question: "Who is he talking about?", options: ["My mother", "My sister", "My friend", "My teacher"], correctIndex: 0 },
  { language: "ha", unitTitle: "Family", order: 2, sceneLabel: "Family · Scene 2", context: "You hear footsteps outside, and someone announces —", phrase: "Baba yana zuwa.", question: "What are they saying?", options: ["Father is coming", "Mother is coming", "Brother is coming", "Sister is coming"], correctIndex: 0 },

  // ---- Food ----
  { language: "yo", unitTitle: "Food", order: 1, sceneLabel: "Food · Scene 1", context: "Your host looks at you kindly and asks —", phrase: "Ṣé o fẹ́ jẹun?", question: "What is she asking?", options: ["Do you want to eat?", "Do you want to sleep?", "Are you leaving?", "Do you want money?"], correctIndex: 0 },
  { language: "yo", unitTitle: "Food", order: 2, sceneLabel: "Food · Scene 2", context: "After tasting the soup, your friend says —", phrase: "Oúnjẹ yìí dùn gan-an.", question: "What are they saying about the food?", options: ["This food is very delicious", "This food is very spicy", "This food is cold", "This food is ready"], correctIndex: 0 },

  { language: "ig", unitTitle: "Food", order: 1, sceneLabel: "Food · Scene 1", context: "Your host looks at you kindly and asks —", phrase: "Ị chọrọ iri nri?", question: "What is she asking?", options: ["Do you want to eat?", "Do you want to sleep?", "Are you leaving?", "Do you want money?"], correctIndex: 0 },
  { language: "ig", unitTitle: "Food", order: 2, sceneLabel: "Food · Scene 2", context: "After tasting the soup, your friend says —", phrase: "Nri a dị ezigbo ụtọ.", question: "What are they saying about the food?", options: ["This food is very delicious", "This food is very spicy", "This food is cold", "This food is ready"], correctIndex: 0 },

  { language: "ha", unitTitle: "Food", order: 1, sceneLabel: "Food · Scene 1", context: "Your host looks at you kindly and asks —", phrase: "Kana son cin abinci?", question: "What is she asking?", options: ["Do you want to eat?", "Do you want to sleep?", "Are you leaving?", "Do you want money?"], correctIndex: 0 },
  { language: "ha", unitTitle: "Food", order: 2, sceneLabel: "Food · Scene 2", context: "After tasting the soup, your friend says —", phrase: "Wannan abincin yana da daɗi sosai.", question: "What are they saying about the food?", options: ["This food is very delicious", "This food is very spicy", "This food is cold", "This food is ready"], correctIndex: 0 },
];

async function main() {
  let created = 0;
  let skippedNoUnit = 0;

  for (const item of draftLessons) {
    const unit = await prisma.unit.findFirst({
      where: { language: item.language, title: item.unitTitle },
    });

    if (!unit) {
      console.log(`No unit found for ${item.unitTitle} (${item.language}) — skipping "${item.sceneLabel}"`);
      skippedNoUnit++;
      continue;
    }

    await prisma.lesson.create({
      data: {
        language: item.language,
        sceneLabel: item.sceneLabel,
        context: item.context,
        phrase: item.phrase,
        question: item.question,
        options: item.options,
        correctIndex: item.correctIndex,
        order: item.order,
        unitId: unit.id,
        published: false, // draft — review in /admin before publishing
      },
    });
    created++;
  }

  console.log(`\nCreated ${created} draft lessons (unpublished).`);
  if (skippedNoUnit > 0) console.log(`Skipped ${skippedNoUnit} — no matching unit found.`);
  console.log("\n⚠️  NEEDS NATIVE SPEAKER REVIEW before publishing — go to /admin, check each entry under Lessons (status: Draft), and publish only what's verified accurate.");
}

main().finally(() => prisma.$disconnect());
