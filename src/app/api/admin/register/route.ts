import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { encode } from "next-auth/jwt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const adminRegisterSchema = z.object({
      email: z.email({ message: "Invalid email address" }),
      password: z.string().min(8, "Password must be at least 8 characters"),
      name: z.string().min(1, "Name is required"),
      surname: z.string().min(1, "Surname is required"),
      phone: z.string().optional(),
      // role is intentionally NOT accepted from client
    });

    const payload = adminRegisterSchema.parse(body);

    const existingAdmin = await prisma.admin.findUnique({
      where: { email: payload.email },
    });
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(payload.password, saltRounds);

    const newAdmin = await prisma.admin.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        name: payload.name,
        surname: payload.surname,
        phone: payload.phone,
        role: "admin", // enforce default role
      },
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    const tokenPayload: Record<string, string> = {
      id: newAdmin.id.toString(),
      email: newAdmin.email,
      role: newAdmin.role,
    };

    const token = await encode({ token: tokenPayload as any, secret: process.env.NEXTAUTH_SECRET! });

    return NextResponse.json(
      { success: true, message: "Admin added successfully", admin: newAdmin, token },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Invalid input data", details: error.message },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
