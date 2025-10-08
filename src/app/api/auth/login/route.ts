import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";
import { encode } from "next-auth/jwt";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    // Find user in database
    const user = await prisma.student.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Return user data (password excluded)
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      university: user.university,
      year: user.year,
      specialty: user.specialty,
      role: user.role,
    };

    // Create JWT for bearer auth in middleware
    const tokenPayload: Record<string, string> = {
      id: user.id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = await encode({ token: tokenPayload as any, secret: process.env.NEXTAUTH_SECRET! });

    return NextResponse.json(
      { 
        message: "Login successful",
        user: userData,
        token
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input data", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
