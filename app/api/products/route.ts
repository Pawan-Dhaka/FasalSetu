import { NextResponse } from "next/server";
import { prisma } from "@/db";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        quantity: {
          gt: 0,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            mobile: true,
            address: true,
            village: true,
            city: true,
            state: true,
            pincode: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    });

    return NextResponse.json({
      products,
      count: products.length,
    });
  } catch (error) {
    console.error("PRODUCTS_GET_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load products",
      },
      {
        status: 500,
      }
    );
  }
}