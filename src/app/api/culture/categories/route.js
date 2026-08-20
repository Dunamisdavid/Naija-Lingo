import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang");

  if (!lang) {
    return NextResponse.json({ error: "Missing lang" }, { status: 400 });
  }

  try {
    const entries = await prisma.cultureEntry.findMany({
      where: { language: lang, published: true },
      select: { category: true },
      distinct: ["category"],
    });
    const liveCategories = entries.map((e) => e.category);
    return NextResponse.json(liveCategories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json({ error: "Could not load categories" }, { status: 500 });
  }
}