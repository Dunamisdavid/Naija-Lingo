import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { computeNextReview } from "@/lib/spacedRepetition";

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { lessonId, language, score } = await request.json();
  if (!lessonId || !language) {
    return NextResponse.json({ error: "Missing lessonId or language" }, { status: 400 });
  }

  const nextReviewAt = computeNextReview(score);

  try {
    const progress = await prisma.progress.upsert({
      where: { userId_lessonId: { userId: session.user.id, lessonId } },
      update: { score, completedAt: new Date(), nextReviewAt },
      create: { userId: session.user.id, lessonId, language, score, nextReviewAt },
    });
    return NextResponse.json(progress);
  } catch (error) {
    console.error("Failed to save progress:", error);
    return NextResponse.json({ error: "Could not save progress" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    const progress = await prisma.progress.findMany({
      where: { userId: session.user.id },
    });
    return NextResponse.json(progress);
  } catch (error) {
    console.error("Failed to fetch progress:", error);
    return NextResponse.json({ error: "Could not load progress" }, { status: 500 });
  }
}