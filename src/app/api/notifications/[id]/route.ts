import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, params: { id: number }) {
  try {
    await prisma.notification.update({
      where: { id: params.id },
      data: { isRead: true },
    });
    return NextResponse.json(
      { success: true, message: "notification updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "error fetching notification",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, params: { id: number }) {
  try {
    await prisma.notification.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: "notification deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "error deleting notification", details: error.message }, { status: 500 });
  }
}