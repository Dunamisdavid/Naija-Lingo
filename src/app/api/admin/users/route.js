import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { computeStreak } from "@/lib/streak";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const users = await prisma.user.findMany({
      include: { progress: true },
      orderBy: { createdAt: "desc" },
    });

    const enriched = users.map((u) => {
      const scored = u.progress.filter((p) => p.score !== null);
      const avgScore = scored.length
        ? Math.round(scored.reduce((sum, p) => sum + p.score, 0) / scored.length)
        : null;

      const byLanguage = { yo: 0, ig: 0, ha: 0 };
      u.progress.forEach((p) => {
        if (byLanguage[p.language] !== undefined) byLanguage[p.language]++;
      });

      const lastActive = u.progress.length
        ? new Date(Math.max(...u.progress.map((p) => new Date(p.completedAt))))
        : null;

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        image: u.image,
        createdAt: u.createdAt,
        totalCompleted: u.progress.length,
        avgScore,
        streak: computeStreak(u.progress),
        byLanguage,
        lastActive,
      };
    });

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Could not load users" }, { status: 500 });
  }
}