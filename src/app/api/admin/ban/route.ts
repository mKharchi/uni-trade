import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.bannedUsers.findMany();
    return NextResponse.json(
      {
        success: true,
        users,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Error fethcing banned users",
        details: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
