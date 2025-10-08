import { NotificationType } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, params: { id: number }) {
  try {
    const { status } = await request.json();
    const taken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const userId = Number(taken?.id);
    const order = await prisma.order.update({
      where: { id: params.id, sellerId: userId },
      data: { status },
    });

    const product = await prisma.product.findFirst({
      where: { id: order.productId },
    });
    await prisma.notification.create({
      data: {
        title: "Order Updated",
        content: `Your order of ${product?.name} is now ${status}`,
        type: NotificationType.order_update,
        studentId: order.buyerId,
        link: "/my-orders",
      },
    });

    return NextResponse.json(
      { success: true, message: "order updated successfully", order },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "error updating order",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, params: { id: number }) {
  try {
    const taken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const userId = Number(taken?.id);
    const order = await prisma.order.delete({
      where: { id: params.id, sellerId: userId },
    });
    if (!order) {
      return NextResponse.json(
        { success: false, message: "order not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, message: "order deleted successfully", order },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "error deleting order",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
