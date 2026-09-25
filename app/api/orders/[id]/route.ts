import { auth } from "@/auth";
import { prisma } from "@/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await context.params;

    const orderId = Number(id);
    const userId = Number(session.user.id);

    if (
      !Number.isInteger(orderId) ||
      !Number.isInteger(userId)
    ) {
      return NextResponse.json(
        {
          error: "Invalid order or user ID",
        },
        {
          status: 400,
        }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
      },

      include: {
        items: {
          include: {
            product: {
              include: {
                farmer: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          error: "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      order,
    });
  } catch (error) {
    console.error("GET_ORDER_ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch order",
      },
      {
        status: 500,
      }
    );
  }
}