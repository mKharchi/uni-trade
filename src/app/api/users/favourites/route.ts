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

    const favourites = await prisma.favourites.findMany({
      where: { userId: userId },
      include: { product: true },
    });

    return NextResponse.json({ success: true, favourites }, { status: 200 });
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
    const taken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const userId = Number(taken?.id);

    const { productId } = await request.json();

    const favourite = await prisma.favourites.create({
      data: { productId, userId },
    });

    return NextResponse.json(
      { success: true, message: "favourite added successfully", favourite },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const taken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const userId = Number(taken?.id);

    const { productId } = await request.json();

    const fav = await prisma.favourites.findFirst({
      where: { productId: Number(productId), userId },
    });

    if (!fav) {
      return NextResponse.json(
        { success: false, error: "Favourite not found" },
        { status: 404 }
      );
    }
    await prisma.favourites.delete({
      where: { id: fav.id, productId: Number(productId), userId },
    });

    return NextResponse.json(
      { success: true, message: "favourite deleted successfully", fav },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "error deleting Favourite",
      },
      { status: 500 }
    );
  }
}
