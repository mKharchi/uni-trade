// src/app/api/conversations/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = Number(token.id);
  const conversationId = Number(params.id);

  try {
    const convo = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        lastMessage: { include: { sender: { select: { id: true, firstName: true, lastName: true } } } },
        product: { select: { id: true, name: true, images: true } },
      },
    });

    if (!convo) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

    // ensure the requesting user is a participant
    const isParticipant = convo.participants.some((p) => p.id === userId);
    if (!isParticipant) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    return NextResponse.json(convo);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
