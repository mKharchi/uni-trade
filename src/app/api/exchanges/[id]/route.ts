import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../products/route";
import { success } from "zod";
import { NotificationType } from "@/generated/prisma";

export async function PUT(request: NextRequest, params: { id: number }) {
  try {
    const { id } = params;
    const { status } = await request.json();
    const exchange = await prisma.exchange.findUnique({
      where: { id },
      include: { ownerProduct: true, requestedProduct: true },
    });
    if (!exchange) {
      return NextResponse.json(
        {
          success: false,
          error: "Error updating exchange status",
          details: "Exchange cannot be found",
        },
        {
          status: 404,
        }
      );
    }
    const ownerProduct = await prisma.exchange.update({
      where: { id },
      data: { status },
    });

    await prisma.notification.createMany({
      data: [
        {
          title: "Update on Exchange",
          content: `the exhange between products ${exchange.ownerProduct} and ${exchange.requestedProduct} was updated`,
          type: NotificationType.exchange_update,
          studentId: exchange.requesterId,
          link: "/exchanges",
        },
        {
          title: "Update on Exchange",
          content: `the exhange between products ${exchange.ownerProduct} and ${exchange.requestedProduct} was updated`,
          type: NotificationType.exchange_update,
          studentId: exchange.ownerId,
          link: "/exchanges",
        },
      ],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Error fetching user's exchanges.",
        details: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
