import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/index.js";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const UNIT_TITLES = [
  "Greetings",
  "Introductions",
  "Family",
  "Food",
  "Market",
  "Home",
  "Work",
  "Travel",
  "Relationships",
  "Everyday Conversation",
];

async function main() {
  for (const language of ["yo", "ig", "ha"]) {
    for (let i = 0; i < UNIT_TITLES.length; i++) {
      const existing = await prisma.unit.findFirst({ where: { language, title: UNIT_TITLES[i] } });
      if (!existing) {
        await prisma.unit.create({ data: { language, title: UNIT_TITLES[i], order: i } });
      }
    }
  }
  console.log("Units created ✓");

  const lessons = await prisma.lesson.findMany({ where: { unitId: null } });
  for (const lesson of lessons) {
    const prefix = lesson.sceneLabel.split("·")[0].trim();
    const unit = await prisma.unit.findFirst({ where: { language: lesson.language, title: prefix } });
    if (unit) {
      await prisma.lesson.update({ where: { id: lesson.id }, data: { unitId: unit.id } });
    } else {
      console.log(`No matching unit for "${lesson.sceneLabel}" (${lesson.language}) — left ungrouped`);
    }
  }
  console.log("Backfilled existing lessons ✓");
}

main().finally(() => prisma.$disconnect());