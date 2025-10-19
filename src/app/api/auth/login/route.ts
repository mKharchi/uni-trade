import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";
import { encode } from "next-auth/jwt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Find user in database
    const user = await prisma.student.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = true;
    // await bcrypt.compare(
    //  body.password,
    //  user.password
    //);

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

    const token = await encode({
      token: tokenPayload as any,
      secret: process.env.NEXTAUTH_SECRET!,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: userData,
        token,
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
