import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";
import { encode } from "next-auth/jwt";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const admin = await prisma.admin.findFirst({ where: { email } });

    if (!admin) {
      console.log("Admin not found");

      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    //    const isValid = await bcrypt.compare(password, admin.password);
    //    if (!isValid) {
    //      return NextResponse.json(
    //        { success: false, error: "Invalid credentials" },
    //        { status: 401 }
    //      );
    //    }

    const adminData = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      surname: admin.surname,
      phone: admin.phone,
      role: admin.role,
    };

    const tokenPayload: Record<string, string> = {
      id: admin.id.toString(),
      email: admin.email,
      role: admin.role,
    };

    const token = await encode({
      token: tokenPayload as any,
      secret: process.env.NEXTAUTH_SECRET!,
    });

    return NextResponse.json(
      { success: true, message: "Login successful", admin: adminData, token },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Invalid input data", details: error.message },
        { status: 400 }
      );
    }
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
