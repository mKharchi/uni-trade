import { encode, getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Add token validation
    if (!token?.id || !token?.role) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user =
      token.role === "admin"
        ? await prisma.admin.findUnique({
            where: { id: Number(token.id) },
            select: {
              id: true,
              email: true,
              role: true,
              blockedUsers: true,
              name: true,
              phone: true,
              surname: true,
              notifications: true,
            },
          })
        : await prisma.student.findUnique({
            where: { id: Number(token.id) },
            select: {
              id: true,
              email: true,
              firstName:true,
              avatar:true,
              conversations:true,
              exchangesAsked:true,
              exchangesOwned:true,
              history:true,
              lastName:true,
              notifications:true,

              ordersBought:true,
              ordersSold:true,
              phone:true,
              products:true,
              reports:true,
              seenMessages:true,
              sentMessages:true,
              specialty:true,
              university:true,
              year:true,
              updatedAt:true,
              createdAt:true
              


              // Add other safe fields
            },
          });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("GET /api/user error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const userInfo = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!userInfo?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const updated_user =
      userInfo.role === "admin"
        ? await prisma.admin.update({
            where: { id: Number(userInfo?.id) },
            data: body,
          })
        : await prisma.student.update({
            where: { id: Number(userInfo?.id) },
            data: body,
          });

    // Generate new token
    const tokenPayload = {
      id: updated_user.id.toString(),
      email: updated_user.email,
      role: updated_user.role,
    };

    const token = await encode({
      token: tokenPayload,
      secret: process.env.NEXTAUTH_SECRET!,
    });

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      token,
      user: updated_user,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userInfo = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!userInfo?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = parseInt(userInfo.id as string, 10);

    // Consider soft delete instead of hard delete
    await prisma.student.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE /api/user error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error deleting user",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
