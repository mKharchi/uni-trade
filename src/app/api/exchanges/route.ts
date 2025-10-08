import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../notifications/route";
import { NotificationType } from "@/generated/prisma";
import { success } from "zod";

export async function POST(request: NextRequest) {
  try {
    const { requestedProductId, ownerProductId } = await request.json();
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const requesterId = Number(token?.id);
    if (!requestedProductId || !ownerProductId) {
      throw new Error("Both products are needed to make an exchange");
    }

    const requestedProduct = await prisma.product.findUnique({
      where: { id: requestedProductId },
    });
    if (!requestedProduct) {
      return NextResponse.json(
        {
          success: false,
          error: "Error fethcing requested product",
          details: "Cannot find requested prodcut",
        },
        { status: 404 }
      );
    }

    const ownerProduct = await prisma.product.findUnique({
      where: { id: ownerProductId },
    });
    if (!ownerProduct) {
      return NextResponse.json(
        {
          success: false,
          error: "Error fethcing owner product",
          details: "Cannot find owner prodcut",
        },
        { status: 404 }
      );
    }

    if (!ownerProduct.is_exchangeable || !requestedProduct.is_exchangeable) {
      throw new Error("Both products must be exchangeable.");
    }

    const exchange = await prisma.exchange.create({
      data: {
        ownerId: ownerProduct.ownerId,
        ownerProductId,
        requestedProductId,
        requesterId,
      },
    });

    await prisma.notification.create({
      data: {
        title: "An Exchange was requested",
        content: `a user requested to exchange your product ${ownerProduct.name} with his ${requestedProduct.name}`,
        type: NotificationType.exchange_request,
        studentId: ownerProduct.ownerId,
        link: "/exchanges",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Exchange requested sccesfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Error requesting exchange.",
        details: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const userId = Number(token?.id);

    const exchanges = await prisma.exchange.findMany({
      where: {
        OR: [{ requesterId: userId }, { ownerId: userId }],
      },
      include: {
        ownerProduct: true,
        requestedProduct: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        exchanges,
      },
      { status: 200 }
    );
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
