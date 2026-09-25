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

    const farmer = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        address: true,
        village: true,
        city: true,
        state: true,
        pincode: true,
        latitude: true,
        longitude: true,
      },
    });

    if (!farmer) {
      return NextResponse.json(
        { error: "Farmer not found" },
        { status: 404 }
      );
    }

    if (farmer.role !== "FARMER") {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      farmer,
    });
  } catch (error) {
    console.error("FARMER_PROFILE_GET_ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = Number(session.user.id);

    const currentUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });

    if (!currentUser || currentUser.role !== "FARMER") {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const {
      address,
      village,
      city,
      state,
      pincode,
      latitude,
      longitude,
    } = body;

    const farmer = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        address: address || null,
        village: village || null,
        city: city || null,
        state: state || null,
        pincode: pincode || null,
        latitude:
          latitude !== null && latitude !== undefined
            ? Number(latitude)
            : null,
        longitude:
          longitude !== null && longitude !== undefined
            ? Number(longitude)
            : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        address: true,
        village: true,
        city: true,
        state: true,
        pincode: true,
        latitude: true,
        longitude: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      farmer,
    });
  } catch (error) {
    console.error("FARMER_PROFILE_PUT_ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}