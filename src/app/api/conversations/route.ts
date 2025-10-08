// src/app/api/conversations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = Number(token.id);

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: { some: { id: userId } },
      },
      include: {
        participants: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true,
          },
        },
        lastMessage: {
          select: { id: true, content: true, createdAt: true, senderId: true },
        },
        product: { select: { id: true, name: true, images: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(conversations);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const senderId = Number(token.id);

  try {
    const body = await req.json();
    const {
      receiverId,
      participantIds,
      type = "direct",
      productId,
    }: {
      receiverId?: number;
      participantIds?: number[];
      type?: "direct" | "exchange";
      productId?: number | null;
    } = body;

    // Build participant id array
    let participants: number[] = [];
    if (participantIds && participantIds.length > 0) {
      participants = Array.from(new Set(participantIds.map(Number)));
    } else if (receiverId) {
      participants = [Number(receiverId)];
    } else {
      return NextResponse.json(
        { error: "No participants provided" },
        { status: 400 }
      );
    }

    // ensure sender included
    if (!participants.includes(senderId)) participants.push(senderId);

    // If direct between two users try to reuse existing conversation between the same users (and same product if provided)
    if (participants.length === 2) {
      const [a, b] = participants;
      const existing = await prisma.conversation.findFirst({
        where: {
          AND: [
            { participants: { some: { id: a } } },
            { participants: { some: { id: b } } },
            productId ? { productId } : {},
            { type },
          ],
        },
        include: { participants: true, lastMessage: true, product: true },
      });

      if (existing) return NextResponse.json(existing);
    }

    // create conversation
    const createData: any = {
      type,
      participants: {
        connect: participants.map((id) => ({ id })),
      },
    };
    if (productId) createData.product = { connect: { id: Number(productId) } };

    const conversation = await prisma.conversation.create({
      data: createData,
      include: { participants: true, product: true, lastMessage: true },
    });

    return NextResponse.json(conversation, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
