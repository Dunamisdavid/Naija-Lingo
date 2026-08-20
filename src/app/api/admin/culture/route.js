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
  const category = searchParams.get("category") || "all";
  const status = searchParams.get("status") || "all";
  const skip = Number(searchParams.get("skip") || 0);
  const take = Number(searchParams.get("take") || 20);

  const where = {
    ...(language !== "all" && { language }),
    ...(category !== "all" && { category }),
    ...(status === "draft" && { published: false }),
    ...(status === "published" && { published: true }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { body: { contains: search, mode: "insensitive" } },
        { phrase: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [entries, total] = await Promise.all([
    prisma.cultureEntry.findMany({ where, orderBy: { createdAt: "desc" }, skip, take }),
    prisma.cultureEntry.count({ where }),
  ]);

  return NextResponse.json({ entries, total });
}

export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { language, category, title, body, phrase } = await request.json();
  const entry = await prisma.cultureEntry.create({
    data: { language, category, title, body, phrase: phrase || null, published: false },
  });
  return NextResponse.json(entry);
}

export async function PATCH(request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, ...fields } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const entry = await prisma.cultureEntry.update({ where: { id }, data: fields });
  return NextResponse.json(entry);
}

export async function DELETE(request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.cultureEntry.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}