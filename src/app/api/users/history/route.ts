import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const taken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const userId = Number(taken?.id);

    const history = await prisma.history.findMany({
      where: { id:userId },
      include: { product: true },
    });

    return NextResponse.json({ success: true, history }, { status: 200 });
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
    const taken = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const userId = Number(taken?.id);

    const { productId , action } = await request.json();

    const history = await prisma.history.create({

      data: { productId, userId , action },
    });

    return NextResponse.json({success: true, message: "history added successfully", history }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({success: false, message: "error adding history", details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const taken = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const userId = Number(taken?.id);

    const { id , productId  } = await request.json();

    const history = await prisma.history.findUnique({
      where: { id: Number(id),  productId:Number(productId), userId },
    });

    if (!history) {
      return NextResponse.json({success: false, message: "history not found", details: "history not found" }, { status: 404 });
    }
    await prisma.history.delete({
      where: { id: Number(id),  productId:Number(productId), userId },
    });

    return NextResponse.json({success: true, message: "history deleted successfully", history }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({success: false, message: "error deleting history", details: error.message }, { status: 500 });
  }
}