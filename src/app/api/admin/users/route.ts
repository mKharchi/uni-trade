import { prisma } from "@/lib/prisma";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import { deflate } from "zlib";

export async function GET(request: NextRequest) {
  try {
    const students = await prisma.student.findMany({include:{
      reports:true
    }});
    const admins = await prisma.admin.findMany();

    return NextResponse.json(
      {
        success: true,
        users: { students, admins },
    },
      {
        status: 200,
      }
    );
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
