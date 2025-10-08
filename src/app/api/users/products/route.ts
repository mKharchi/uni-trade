import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { calculatePoints } from "../../products/utils";
import { date } from "zod";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const userId = Number(token!.id); // safe because middleware ensures token

    const products = await prisma.product.findMany({ where: { ownerId: userId } });
    
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching user's products",
        details: error.message,
      },
      { status: 500 }
    );
  }
}



export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const userId = Number(token!.id); // safe due to middleware
    const userData = await prisma.student.findUnique({ where: { id: userId } });

    const { name, description, category, subcategory, price, is_exchangeable } = await request.json();

    // optional: still validate input
    if (!name || !category) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    await prisma.product.create({
      data: {
        name,
        description,
        category,
        subcategory,
        price,
        is_exchangeable,
        points: is_exchangeable ? calculatePoints(price , category) : 0,
        ownerId: userId,
        university: userData?.university as string,
      },
      select: {
        name: true,
        description: true,
        category: true,
        subcategory: true,
        price: true,
        university: true,
        is_exchangeable: true,
        ownerId: true,
      },
    });

    return NextResponse.json(
      { success: true, message: "Product added successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error adding product",
        details:  error.message ,
      },
      { status: 500 }
    );
  }
}


export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = Number(params.id);
    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, message: "Invalid product id" },
        { status: 400 }
      );
    }

    const data = await request.json();
    if (data.is_exchangeable) {
      data.points = calculatePoints(data.price, data.category);
    }
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data,
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error updating product",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = Number(params.id);
    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, message: "Invalid product id" },
        { status: 400 }
      );
    }

    const deleted = await prisma.product.delete({ where: { id: productId } });
    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting product",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}