import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "yo";
  const unitId = searchParams.get("unitId");

  try {
    const lessons = await prisma.lesson.findMany({
      where: {
        language: lang,
        published: true,
        ...(unitId && { unitId }),
      },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Failed to fetch lessons:", error);
    return NextResponse.json({ error: "Could not load lessons right now." }, { status: 500 });
  }
}