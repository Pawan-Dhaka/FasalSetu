import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/db";

async function getConsumerId() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const userId = Number(session.user.id);

  if (!Number.isInteger(userId)) {
    return null;
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

  if (!user || user.role !== "CONSUMER") {
    return null;
  }

  return user.id;
}

/* =========================================================
   GET CART
========================================================= */

export async function GET() {
  try {
    const userId = await getConsumerId();

    if (!userId) {
      return NextResponse.json(
        {
          error: "Consumer authentication required",
        },
        {
          status: 401,
        }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            product: {
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
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({
        cart: null,
        items: [],
        count: 0,
        total: 0,
      });
    }

    const total = cart.items.reduce((sum, item) => {
      return (
        sum +
        Number(item.quantity) *
          Number(item.product.pricePerKg)
      );
    }, 0);

    const count = cart.items.reduce((sum, item) => {
      return sum + Number(item.quantity);
    }, 0);

    return NextResponse.json({
      cart,
      items: cart.items,
      count,
      total,
    });
  } catch (error) {
    console.error("CART_GET_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load cart",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   ADD TO CART
========================================================= */

export async function POST(req: Request) {
  try {
    const userId = await getConsumerId();

    if (!userId) {
      return NextResponse.json(
        {
          error: "Please login as a consumer",
        },
        {
          status: 401,
        }
      );
    }

    const body = await req.json();

    const productId = Number(body.productId);

    const requestedQuantity =
      body.quantity === undefined
        ? 1
        : Number(body.quantity);

    if (!Number.isInteger(productId)) {
      return NextResponse.json(
        {
          error: "Invalid product",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isFinite(requestedQuantity) ||
      requestedQuantity <= 0
    ) {
      return NextResponse.json(
        {
          error: "Quantity must be greater than 0",
        },
        {
          status: 400,
        }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        name: true,
        quantity: true,
        pricePerKg: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          error: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    const availableQuantity = Number(product.quantity);

    if (availableQuantity <= 0) {
      return NextResponse.json(
        {
          error: "Product is out of stock",
        },
        {
          status: 400,
        }
      );
    }

    const cart = await prisma.cart.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
      },
    });

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    const newQuantity = existingItem
      ? Number(existingItem.quantity) + requestedQuantity
      : requestedQuantity;

    if (newQuantity > availableQuantity) {
      return NextResponse.json(
        {
          error: `Only ${availableQuantity} kg available`,
        },
        {
          status: 400,
        }
      );
    }

    const cartItem = existingItem
      ? await prisma.cartItem.update({
          where: {
            id: existingItem.id,
          },
          data: {
            quantity: newQuantity,
          },
          include: {
            product: true,
          },
        })
      : await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity: requestedQuantity,
          },
          include: {
            product: true,
          },
        });

    return NextResponse.json(
      {
        message: existingItem
          ? "Cart quantity updated"
          : "Product added to cart",
        item: cartItem,
      },
      {
        status: existingItem ? 200 : 201,
      }
    );
  } catch (error) {
    console.error("CART_POST_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to add product to cart",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   UPDATE CART ITEM
========================================================= */

export async function PUT(req: Request) {
  try {
    const userId = await getConsumerId();

    if (!userId) {
      return NextResponse.json(
        {
          error: "Consumer authentication required",
        },
        {
          status: 401,
        }
      );
    }

    const body = await req.json();

    const itemId = Number(body.itemId);
    const quantity = Number(body.quantity);

    if (!Number.isInteger(itemId)) {
      return NextResponse.json(
        {
          error: "Invalid cart item",
        },
        {
          status: 400,
        }
      );
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      return NextResponse.json(
        {
          error: "Quantity must be greater than 0",
        },
        {
          status: 400,
        }
      );
    }

    const item = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId,
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

    if (quantity > Number(item.product.quantity)) {
      return NextResponse.json(
        {
          error: `Only ${item.product.quantity} kg available`,
        },
        {
          status: 400,
        }
      );
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        id: itemId,
      },
      data: {
        quantity,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json({
      message: "Cart updated",
      item: updatedItem,
    });
  } catch (error) {
    console.error("CART_PUT_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to update cart",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   DELETE CART ITEM
========================================================= */

export async function DELETE(req: Request) {
  try {
    const userId = await getConsumerId();

    if (!userId) {
      return NextResponse.json(
        {
          error: "Consumer authentication required",
        },
        {
          status: 401,
        }
      );
    }

    const { searchParams } = new URL(req.url);

    const itemId = Number(
      searchParams.get("itemId")
    );

    if (!Number.isInteger(itemId)) {
      return NextResponse.json(
        {
          error: "Invalid cart item",
        },
        {
          status: 400,
        }
      );
    }

    const item = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId,
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
        id: itemId,
      },
    });

    return NextResponse.json({
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error("CART_DELETE_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to remove cart item",
      },
      {
        status: 500,
      }
    );
  }
}