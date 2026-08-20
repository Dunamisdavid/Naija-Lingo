import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/index.js";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const lessons = await prisma.lesson.updateMany({ data: { published: true } });
  const culture = await prisma.cultureEntry.updateMany({ data: { published: true } });
  console.log(`Published ${lessons.count} lessons, ${culture.count} culture entries ✓`);
}

main().finally(() => prisma.$disconnect());