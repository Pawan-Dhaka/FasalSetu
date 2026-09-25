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

    const userId = Number(session.user.id);

    if (!Number.isInteger(userId)) {
      return NextResponse.json(
        { error: "Invalid user session" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.role !== "FARMER") {
      return NextResponse.json(
        { error: "Only farmers can access farmer orders" },
        { status: 403 }
      );
    }

    const orderItems = await prisma.orderItem.findMany({
      where: {
        product: {
          farmerId: userId,
        },
      },

      include: {
        product: {
          select: {
            id: true,
            name: true,
            category: true,
            pricePerKg: true,
            farmerId: true,
          },
        },

        order: {
          select: {
            id: true,
            status: true,
            totalAmount: true,
            address: true,
            createdAt: true,
            updatedAt: true,

            user: {
              select: {
                id: true,
                name: true,
                mobile: true,
                email: true,
              },
            },

            items: {
              select: {
                id: true,
                productId: true,
                quantity: true,
                pricePerKg: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      orderItems,
      count: orderItems.length,
    });
  } catch (error) {
    console.error("FARMER_ORDERS_GET_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load farmer orders",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   CREATE ORDER
   ========================================================= */

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = Number(session.user.id);

    if (!Number.isInteger(userId)) {
      return NextResponse.json(
        { error: "Invalid user session" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        role: true,
        address: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.role !== "CONSUMER") {
      return NextResponse.json(
        { error: "Only consumers can place orders" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const address =
      typeof body.address === "string"
        ? body.address.trim()
        : "";

    if (!address) {
      return NextResponse.json(
        { error: "Delivery address is required" },
        { status: 400 }
      );
    }

    /*
      Get user's cart with products.

      We fetch the current product price and stock
      directly from the database.
    */

    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },

      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty" },
        { status: 400 }
      );
    }

    /*
      Validate stock before creating the order.
    */

    for (const item of cart.items) {
      if (Number(item.quantity) <= 0) {
        return NextResponse.json(
          {
            error: `Invalid quantity for ${item.product.name}`,
          },
          { status: 400 }
        );
      }

      if (
        Number(item.quantity) >
        Number(item.product.quantity)
      ) {
        return NextResponse.json(
          {
            error: `Only ${Number(
              item.product.quantity
            )} kg of ${item.product.name} is available`,
          },
          { status: 400 }
        );
      }
    }

    /*
      Calculate subtotal from database prices.
    */

    let subtotal = 0;

    for (const item of cart.items) {
      subtotal +=
        Number(item.product.pricePerKg) *
        Number(item.quantity);
    }

    const deliveryFee = 20;
    const totalAmount = subtotal + deliveryFee;

    /*
      Create Order + OrderItems + update stock
      + clear cart in one transaction.
    */

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId,
          status: "PENDING",
          totalAmount,
          address,

          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              pricePerKg: item.product.pricePerKg,
            })),
          },
        },

        include: {
          items: true,
        },
      });

      /*
        Reduce product stock after order creation.
      */

      for (const item of cart.items) {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      /*
        Empty the cart.
      */

      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return createdOrder;
    });

    return NextResponse.json(
      {
        message: "Order placed successfully",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_ORDER_ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to place order",
      },
      {
        status: 500,
      }
    );
  }
}