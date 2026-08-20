import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang");
  const category = searchParams.get("category");

  if (!lang || !category) {
    return NextResponse.json({ error: "Missing lang or category" }, { status: 400 });
  }

  try {
    const entries = await prisma.cultureEntry.findMany({
        where: { language: lang, category, published: true },
        orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(entries);
  } catch (error) {
    console.error("Failed to fetch culture entries:", error);
    return NextResponse.json({ error: "Could not load content" }, { status: 500 });
  }
}