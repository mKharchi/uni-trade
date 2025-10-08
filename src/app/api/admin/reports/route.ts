import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const reports = await prisma.report.findMany();
    return NextResponse.json(
      {
        success: true,
        reports,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Error fetching reports",
        details: error.message,
      },
      {
        status: 500,
      }
    );
  }
}