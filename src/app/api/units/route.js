import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "yo";

  try {
    const units = await prisma.unit.findMany({
      where: { language: lang },
      orderBy: { order: "asc" },
      include: { lessons: { where: { published: true }, select: { id: true } } },
    });
    return NextResponse.json(units);
  } catch (error) {
    console.error("Failed to fetch units:", error);
    return NextResponse.json({ error: "Could not load units" }, { status: 500 });
  }
}