
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { encode } from "next-auth/jwt";

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    
    // Check if user already exists
    const existingUser = await prisma.student.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success:false,
          error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);
    
    // Create new user
    const newUser = await prisma.student.create({
      data: {
        email: body.email,
        password: hashedPassword,
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        university: body.university,
        year: body.year,
        specialty: body.specialty,
        role: "student",
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        university: true,
        year: true,
        specialty: true,
        role: true,
        createdAt: true,
      },
    });

    // Create JWT for bearer auth in middleware
    const tokenPayload: Record<string, any| undefined> = {
      id: newUser.id.toString(),
      email: newUser.email,
      role: newUser.role,
    };

    const token = await encode({ token: tokenPayload as any, secret: process.env.NEXTAUTH_SECRET! });

    return NextResponse.json(
      {
        success:true,
        message: "User registered successfully",
        token
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Handle validation errors
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        {
          success:false, 
           error: "Invalid input data", details: error.message },
        { status: 400 }
      );
    }

    // Handle Prisma errors
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { 
          success:false,
          error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Generic server error
    return NextResponse.json(
      { success:false, error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}