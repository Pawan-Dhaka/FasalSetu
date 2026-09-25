import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/db";

async function getFarmerId() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const farmerId = Number(session.user.id);

  if (!Number.isInteger(farmerId)) {
    return null;
  }

  const farmer = await prisma.user.findUnique({
    where: {
      id: farmerId,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!farmer || farmer.role !== "FARMER") {
    return null;
  }

  return farmer.id;
}

// GET - Farmer ke products
export async function GET() {
  try {
    const farmerId = await getFarmerId();

    if (!farmerId) {
      return NextResponse.json(
        { error: "Unauthorized or farmer access required" },
        { status: 401 }
      );
    }

    const products = await prisma.product.findMany({
      where: {
        farmerId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      products,
    });
  } catch (error) {
    console.error("FARMER_PRODUCTS_GET_ERROR:", error);

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

// POST - Farmer naya product add karega
export async function POST(req: Request) {
  try {
    const farmerId = await getFarmerId();

    if (!farmerId) {
      return NextResponse.json(
        {
          error: "Unauthorized or farmer access required",
        },
        {
          status: 401,
        }
      );
    }

    const body = await req.json();

    const {
      name,
      category,
      quality,
      quantity,
      pricePerKg,
    } = body;

    if (
      !name ||
      !category ||
      quantity === undefined ||
      pricePerKg === undefined
    ) {
      return NextResponse.json(
        {
          error:
            "Name, category, quantity and price are required",
        },
        {
          status: 400,
        }
      );
    }

    const productName = String(name).trim();
    const productCategory = String(category).trim();
    const productQuality = quality
      ? String(quality).trim()
      : null;

    const parsedQuantity = Number(quantity);
    const parsedPrice = Number(pricePerKg);

    if (!productName) {
      return NextResponse.json(
        {
          error: "Product name is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!productCategory) {
      return NextResponse.json(
        {
          error: "Product category is required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isFinite(parsedQuantity) ||
      parsedQuantity <= 0
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

    if (
      !Number.isFinite(parsedPrice) ||
      parsedPrice <= 0
    ) {
      return NextResponse.json(
        {
          error: "Price must be greater than 0",
        },
        {
          status: 400,
        }
      );
    }

    const product = await prisma.product.create({
      data: {
        farmerId,
        name: productName,
        category: productCategory,
        quality: productQuality,
        quantity: parsedQuantity,
        pricePerKg: parsedPrice,
      },
    });

    return NextResponse.json(
      {
        message: "Product added successfully",
        product,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("FARMER_PRODUCTS_POST_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to add product",
      },
      {
        status: 500,
      }
    );
  }
}