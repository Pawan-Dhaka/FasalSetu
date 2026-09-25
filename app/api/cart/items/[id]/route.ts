import { auth } from "@/auth";
import { prisma } from "@/db";
import { NextResponse } from "next/server";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: Context) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const body = await request.json();
    const quantity = Number(body.quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        {
          error: "Invalid quantity",
        },
        {
          status: 400,
        }
      );
    }

    const item = await prisma.cartItem.findFirst({
      where: {
        id,
        cart: {
          userId: session.user.id,
        },
      },

      include: {
        product: true,
      },
    });

    if (!item) {
      return NextResponse.json(
        {
          error: "Cart item not found",
        },
        {
          status: 404,
        }
      );
    }

    if (quantity > item.product.stock) {
      return NextResponse.json(
        {
          error: `Only ${item.product.stock} items available`,
        },
        {
          status: 400,
        }
      );
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        id,
      },

      data: {
        quantity,
      },

      include: {
        product: true,
      },
    });

    return NextResponse.json({
      success: true,
      item: updatedItem,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to update cart item",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request,
  context: Context
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const item = await prisma.cartItem.findFirst({
      where: {
        id,
        cart: {
          userId: session.user.id,
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        {
          error: "Cart item not found",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.cartItem.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to remove item",
      },
      {
        status: 500,
      }
    );
  }
}