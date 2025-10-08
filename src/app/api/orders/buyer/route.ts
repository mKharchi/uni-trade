import { NotificationType } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";





export async function POST(request: NextRequest) {
  try {
    const taken = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const userId = Number(taken?.id);

    const { productId , deliveryAddress , quantity , totalPrice  } = await request.json();


    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({success: false, message: "product not found", details: "product not found" }, { status: 404 });
    }


    await prisma.notification.create({
      data: { title: "Order Placed", content: `You have placed an order for ${product.name}`, type:NotificationType.order , link: `/orders/`, studentId: userId },
    });

    const order = await prisma.order.create({
      data: { productId, deliveryAddress, quantity, totalPrice, buyerId: userId, sellerId: product.ownerId },
    });

    return NextResponse.json({success: true, message: "order added successfully", order }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({success: false, message: "error adding order", details: error.message }, { status: 500 });
  }
}


export async function GET(request: NextRequest) {
  try {
    const taken = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const userId = Number(taken?.id);

    const orders = await prisma.order.findMany({ where: { buyerId: userId } });
    
    return NextResponse.json({success: true,  orders }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({success: false, message: "error fetching orders", details: error.message }, { status: 500 });
  }
}