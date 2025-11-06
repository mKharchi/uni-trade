import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const userId = Number(token?.id);

    const history = await prisma.history.findMany({
      where: { userId: userId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      { success: true, history: history },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "error fetching history",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const userId = Number(token?.id);

    // Debug logs
    console.log("Token:", token);
    console.log("UserId:", userId);
    console.log("UserId type:", typeof userId);
    console.log("Is NaN?", isNaN(userId));

    const body = await request.json();
    const { productId, action } = body;

    // Debug logs
    console.log("Body:", body);
    console.log("ProductId:", productId);
    console.log("Action:", action);

    // Validation
    if (!userId || isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: "Invalid user ID" },
        { status: 401 }
      );
    }

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    const history = await prisma.history.create({
      data: {
        productId: Number(productId),
        action,
        userId,
      },
    });

    return NextResponse.json(
      { success: true, message: "history added successfully", history },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Full error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const userId = Number(token?.id);

    const { id } = await request.json();

    const history = await prisma.history.findUnique({
      where: { id: Number(id) },
    });

    if (!history) {
      return NextResponse.json(
        {
          success: false,
          message: "history not found",
        },
        { status: 404 }
      );
    }

    if (history.userId !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 403 }
      );
    }

    await prisma.history.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { success: true, message: "history deleted successfully", history },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "error deleting history",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
