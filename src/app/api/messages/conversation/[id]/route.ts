// src/app/api/messages/conversation/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = Number(token.id);
  const conversationId = Number(params.id);

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: { select: { id: true } } },
    });
    if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (!conversation.participants.some((p) => p.id === userId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: { sender: { select: { id: true, firstName: true, lastName: true, avatar: true } }, seenBy: { select: { id: true } } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
