
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";
export async function POST(
  request: NextRequest,
  context: { params: { userId: string } }
) {
  try {
    const userId = Number(context.params.userId);
    const user = await prisma.student.findFirst({
      where: { id: userId },
      include: {
        reports: true,
      },
    });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Cnnot find user",
        },
        {
          status: 404,
        }
      );
    }
    if (!user?.reports || user.reports.length < 3) {
      throw new Error("User must have at least three reports.");
    }

    // add the user auth information to the banned users db
    const { email, firstName, lastName, phone } = user;
    await prisma.bannedUsers.create({
      data: {
        email,
        firstName,
        lastName,
        phone,
      },
    });

    // remove the student from the users db
    await prisma.student.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: "User banned succesfully.",
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Error banning the user",
        details: err.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: { userId: string } }
) {
  try {
    const id = Number(context.params.userId);
    const user = await prisma.student.findFirst({
      where: { id },
      include: {
        reports: true,
      },
    });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Cnnot find user",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json({
        success:true , 
        user
    })


  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Error banning the user",
        details: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
