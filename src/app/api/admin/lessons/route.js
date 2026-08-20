import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    return null;
  }
  return session;
}

export async function GET(request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const language = searchParams.get("language") || "all";
  const status = searchParams.get("status") || "all";
  const skip = Number(searchParams.get("skip") || 0);
  const take = Number(searchParams.get("take") || 20);

  const where = {
    ...(language !== "all" && { language }),
    ...(status === "draft" && { published: false }),
    ...(status === "published" && { published: true }),
    ...(search && {
      OR: [
        { sceneLabel: { contains: search, mode: "insensitive" } },
        { phrase: { contains: search, mode: "insensitive" } },
        { context: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [lessons, total] = await Promise.all([
    prisma.lesson.findMany({ where, orderBy: [{ order: "asc" }, { createdAt: "desc" }], skip, take }),
    prisma.lesson.count({ where }),
  ]);

  return NextResponse.json({ lessons, total });
}

export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { language, sceneLabel, context, phrase, question, options, correctIndex, order } = await request.json();
  const lesson = await prisma.lesson.create({
    data: {
      language,
      sceneLabel,
      context,
      phrase,
      question,
      options,
      correctIndex: Number(correctIndex),
      order: Number(order) || 0,
      published: false,
    },
  });
  return NextResponse.json(lesson);
}

export async function PATCH(request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, ...fields } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  if (fields.correctIndex !== undefined) fields.correctIndex = Number(fields.correctIndex);
  if (fields.order !== undefined) fields.order = Number(fields.order);

  const lesson = await prisma.lesson.update({ where: { id }, data: fields });
  return NextResponse.json(lesson);
}

export async function DELETE(request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.lesson.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}