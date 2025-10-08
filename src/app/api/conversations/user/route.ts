// src/app/api/conversations/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  // optional: allow admins to fetch other's convos; normal users should fetch their own via /conversations
  const token = await getToken({ req });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const idParam = url.searchParams.get("id");
  if (!idParam) return NextResponse.json({ error: "Missing id query" }, { status: 400 });

  const userId = Number(idParam);

  try {
    const conversations = await prisma.conversation.findMany({
      where: { participants: { some: { id: userId } } },
      include: {
        participants: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        lastMessage: { select: { id: true, content: true, createdAt: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(conversations);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
