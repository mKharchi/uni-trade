import { NotificationType } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const reporterId = Number(token.id);

    const { reason, description, productId } = await request.json();
    if (!reason) {
      return NextResponse.json(
        { success: false, message: "Reason is required" },
        { status: 400 }
      );
    }

    const report = await prisma.report.create({
      data: {
        reason,
        description,
        productId,
        reporterId,
      },
    });

    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    const admin = await prisma.admin.findFirst();
    const owner = await prisma.student.findFirst({where: {id:product?.ownerId}})
    await prisma.notification.createMany({
      data: [
        {
          title: "Product Reported",
          content: ` Your product ( ${product?.name} ) has been reported by a user `,
          type: NotificationType.report,
          studentId: product?.ownerId,
          link: `/my-products/${productId}`,
        },
        {
          title: "Product Reported",
          content: ` The product ( ${product?.name} ) of the user ${owner?.email} has been reported by a user `,
          type: NotificationType.report,
          adminId: admin?.id,
          link: `/reports/${productId}`,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "Product reported successfully",
      report,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error reporting product",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
