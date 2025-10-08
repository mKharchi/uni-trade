import { encode, getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // 1. Not logged in
    return NextResponse.json({ success: true, user: token });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "error fetching user information",
      detail: error.message,
    });
  }
}
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Get current user token
    const userInfo = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!userInfo?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - no user ID" },
        { status: 401 }
      );
    }

    const userId = parseInt(userInfo.id as string, 10);

    // Remove forbidden fields from the request body
    const { id, iat, exp, jti, ...safeData } = body;

    // Update student info
    const updated_user = await prisma.student.update({
      where: { id: userId },
      data: safeData,
    });

    // Build new token payload
    const tokenPayload = {
      id: updated_user.id.toString(),
      email: updated_user.email,
      role: updated_user.role,
    };

    // Encode new JWT
    const token = await encode({
      token: tokenPayload,
      secret: process.env.NEXTAUTH_SECRET!,
    });

    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully",
        token,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Error updating user",
        details: error.message,
      },
      { status: 500 }
    );
  }
}



export async function DELETE(request: NextRequest) {
  try {

    // Get current user token
    const userInfo = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!userInfo?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - no user ID" },
        { status: 401 }
      );
    }

    const userId = parseInt(userInfo.id as string, 10);

    // Remove forbidden fields from the request body

    // Update student info
    const updated_user = await prisma.student.delete({
      where: { id: userId }
    });

    // Build new token payload
    
    

    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Error deleting user",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
