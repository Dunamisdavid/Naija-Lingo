import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/index.js";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const lessons = [
  // Yorùbá
  { language: "yo", order: 1, sceneLabel: "Greetings · Scene 1", context: "You arrive at your grandmother's house in the morning. She says —", phrase: "Ẹ káàárọ̀", question: "What does she mean?", options: ["Good morning", "Good afternoon", "Welcome", "How are you?"], correctIndex: 0 },
  { language: "yo", order: 2, sceneLabel: "Greetings · Scene 2", context: "You're leaving the market in the evening. The seller waves and says —", phrase: "Ẹ kú alẹ́", question: "What is she telling you?", options: ["See you tomorrow", "Good night", "Safe journey", "Good price"], correctIndex: 1 },
  { language: "yo", order: 3, sceneLabel: "Introductions · Scene 1", context: "A new neighbour asks your name. You reply —", phrase: "Orúkọ mi ni Tobi", question: "What are you telling them?", options: ["My name is Tobi", "I am from Lagos", "Nice to meet you", "I am fine"], correctIndex: 0 },

  // Igbo
  { language: "ig", order: 1, sceneLabel: "Greetings · Scene 1", context: "You arrive at your grandmother's house in the morning. She says —", phrase: "Ụtụtụ ọma", question: "What does she mean?", options: ["Good morning", "Good afternoon", "Welcome", "How are you?"], correctIndex: 0 },
  { language: "ig", order: 2, sceneLabel: "Greetings · Scene 2", context: "You're leaving the market in the evening. The seller waves and says —", phrase: "Ka chi fọọ", question: "What is she telling you?", options: ["See you tomorrow", "Good night", "Safe journey", "Good price"], correctIndex: 1 },
  { language: "ig", order: 3, sceneLabel: "Introductions · Scene 1", context: "A new neighbour asks your name. You reply —", phrase: "Aha m bụ Chidi", question: "What are you telling them?", options: ["My name is Chidi", "I am from Enugu", "Nice to meet you", "I am fine"], correctIndex: 0 },

  // Hausa
  { language: "ha", order: 1, sceneLabel: "Greetings · Scene 1", context: "You arrive at your grandmother's house in the morning. She says —", phrase: "Ina kwana", question: "What does she mean?", options: ["Good morning", "Good afternoon", "Welcome", "How are you?"], correctIndex: 0 },
  { language: "ha", order: 2, sceneLabel: "Greetings · Scene 2", context: "You're leaving the market in the evening. The seller waves and says —", phrase: "Sai anjima", question: "What is she telling you?", options: ["See you tomorrow", "Good night", "Safe journey", "Good price"], correctIndex: 0 },
  { language: "ha", order: 3, sceneLabel: "Introductions · Scene 1", context: "A new neighbour asks your name. You reply —", phrase: "Sunana Ladi", question: "What are you telling them?", options: ["My name is Ladi", "I am from Kano", "Nice to meet you", "I am fine"], correctIndex: 0 },
];

async function main() {
  await prisma.lesson.createMany({ data: lessons });
  console.log(`Seeded ${lessons.length} lessons ✓`);
}

main().finally(() => prisma.$disconnect());