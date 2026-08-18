import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const lessons = await prisma.lesson.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Failed to fetch lessons:", error);
    return NextResponse.json(
      { error: "Could not load lessons right now." },
      { status: 500 }
    );
  }
}