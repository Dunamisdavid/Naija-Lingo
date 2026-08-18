import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/index.js";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.lesson.createMany({
    data: [
      {
        sceneLabel: "Greetings · Scene 3",
        context: "You're visiting your grandmother. She looks up and says —",
        phraseKey: "greet",
        question: "What does she mean?",
        options: ["Good morning", "Good afternoon", "Welcome", "How are you?"],
        correctIndex: 0,
      },
      {
        sceneLabel: "Greetings · Scene 4",
        context: "You're leaving the market. The seller waves and says —",
        phraseKey: "greet",
        question: "What is she telling you?",
        options: ["See you tomorrow", "Thank you", "Safe journey", "Good price"],
        correctIndex: 2,
      },
    ],
  });
  console.log("Seeded lessons ✓");
}

main().finally(() => prisma.$disconnect());