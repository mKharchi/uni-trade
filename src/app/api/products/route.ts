import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json({success: true, products }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({success: false, message: "error fetching products", details: error.message }, { status: 500 });
  }
}
