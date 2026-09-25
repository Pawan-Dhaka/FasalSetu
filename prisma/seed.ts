import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting database seed...");

  const passwordHash = await bcrypt.hash("123456", 10);

  const farmer = await prisma.user.upsert({
    where: {
      email: "farmer@test.com",
    },
    update: {},
    create: {
      name: "Test Farmer",
      email: "farmer@test.com",
      passwordHash,
      role: "FARMER",
    },
  });

  const consumer = await prisma.user.upsert({
    where: {
      email: "consumer@test.com",
    },
    update: {},
    create: {
      name: "Test Consumer",
      email: "consumer@test.com",
      passwordHash,
      role: "CONSUMER",
    },
  });

  console.log("👨‍🌾 Farmer:", farmer.email);
  console.log("🛒 Consumer:", consumer.email);

  const products = [
    {
      name: "Fresh Tomatoes",
      category: "Vegetables",
      price: 32,
      oldPrice: 38,
      unit: "kg",
      rating: 4.8,
      reviews: 124,
      distance: "12 km",
      emoji: "🍅",
      badge: "Best Seller",
      organic: false,
    },
    {
      name: "Farm Potatoes",
      category: "Vegetables",
      price: 25,
      oldPrice: 30,
      unit: "kg",
      rating: 4.9,
      reviews: 86,
      distance: "16 km",
      emoji: "🥔",
      badge: "Fresh Today",
      organic: false,
    },
    {
      name: "Red Onions",
      category: "Vegetables",
      price: 28,
      unit: "kg",
      rating: 4.7,
      reviews: 72,
      distance: "21 km",
      emoji: "🧅",
      organic: true,
    },
    {
      name: "Fresh Carrots",
      category: "Vegetables",
      price: 40,
      oldPrice: 46,
      unit: "kg",
      rating: 4.8,
      reviews: 61,
      distance: "18 km",
      emoji: "🥕",
      badge: "Popular",
      organic: false,
    },
    {
      name: "Green Capsicum",
      category: "Vegetables",
      price: 48,
      unit: "kg",
      rating: 4.6,
      reviews: 48,
      distance: "25 km",
      emoji: "🫑",
      organic: false,
    },
    {
      name: "Farm Spinach",
      category: "Leafy Greens",
      price: 22,
      unit: "bunch",
      rating: 4.9,
      reviews: 93,
      distance: "9 km",
      emoji: "🥬",
      badge: "Picked Today",
      organic: true,
    },
    {
      name: "Fresh Mangoes",
      category: "Fruits",
      price: 85,
      oldPrice: 100,
      unit: "kg",
      rating: 4.8,
      reviews: 117,
      distance: "32 km",
      emoji: "🥭",
      badge: "Seasonal",
      organic: false,
    },
    {
      name: "Fresh Cauliflower",
      category: "Vegetables",
      price: 35,
      unit: "kg",
      rating: 4.7,
      reviews: 55,
      distance: "24 km",
      emoji: "🥦",
      organic: false,
    },
  ];

  await prisma.product.deleteMany();

  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        farmerId: farmer.id,
        stock: 100,
      },
    });
  }

  console.log(`🥬 Created ${products.length} products`);
  console.log("✅ Seed completed!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });