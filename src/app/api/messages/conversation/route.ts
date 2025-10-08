// src/app/api/messages/conversation/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = Number(token.id);

  const url = new URL(req.url);
  const convId = url.searchParams.get("conversationId");
  if (!convId) return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: Number(convId) },
      include: { participants: { select: { id: true } } },
    });
    if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (!conversation.participants.some((p) => p.id === userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: Number(convId) },
      include: { sender: { select: { id: true, firstName: true, lastName: true, avatar: true } }, seenBy: { select: { id: true } } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const senderId = Number(token.id);

  try {
    const { conversationId, content, attachments = [] } = await req.json();
    if (!conversationId || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // verify conversation exists and sender is participant
    const conversation = await prisma.conversation.findUnique({
      where: { id: Number(conversationId) },
      include: { participants: { select: { id: true } } },
    });
    if (!conversation) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

    if (!conversation.participants.some((p) => p.id === senderId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // create message
    const message = await prisma.message.create({
      data: {
        content,
        attachments: attachments.map(String),
        conversation: { connect: { id: Number(conversationId) } },
        sender: { connect: { id: senderId } },
      },
      include: { sender: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
    });

    // update conversation lastMessageId & updatedAt
    await prisma.conversation.update({
      where: { id: Number(conversationId) },
      data: { lastMessageId: message.id },
    });

    // (Optional) push to realtime pub/sub here (Pusher / Ably / Socket.io)
    return NextResponse.json(message, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
