import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { success } from "zod";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, surname, phone, role } =
      await request.json();
    await prisma.admin.create({
      data: {
        email,
        password,
        name,
        surname,
        phone,
        role,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Admin created succesfully",
      },
      { status: 203 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Error Creating a new admin.",
        details: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
