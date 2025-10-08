import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  try {
    const students = await prisma.student.findMany({
      include: {
        products: true,
      },
    });
    return NextResponse.json({
      success: true,
      students,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "error fetching users",
        details: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
