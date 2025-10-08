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
    let notifications;
    if (taken?.role === "student") {    
     notifications = await prisma.notification.findMany({
      where: { studentId: userId },
    });
    } else {
       notifications = await prisma.notification.findMany({
        where: { adminId: userId },
      });
    }
    return NextResponse.json({success: true, message: "notifications fetched successfully", notifications }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "error fetching notifications",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
