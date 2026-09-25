import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const farmerId = Number(session.user.id);

    const farmer = await prisma.user.findUnique({
      where: {
        id: farmerId,
      },
      select: {
        role: true,
      },
    });

    if (!farmer || farmer.role !== "FARMER") {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const orderItems = await prisma.orderItem.findMany({
      where: {
        product: {
          farmerId,
        },
      },
      include: {
        order: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                mobile: true,
              },
            },
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            pricePerKg: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      orderItems,
    });
  } catch (error) {
    console.error("FARMER_ORDERS_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load orders" },
      { status: 500 }
    );
  }
}