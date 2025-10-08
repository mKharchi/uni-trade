import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  try {
    const taken = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const userId = Number(taken?.id);

    const orders = await prisma.order.findMany({ where: { sellerId: userId } });

    return NextResponse.json({success: true, message: "orders fetched successfully", orders }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({success: false, message: "error fetching orders", details: error.message }, { status: 500 });
  }
}