"use client";

import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Heart,
  Leaf,
  MapPin,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  farmer: string;
  location: string;
  price: number;
  oldPrice?: number;
  unit: string;
  rating: number;
  reviews: number;
  distance: string;
  emoji: string;
  badge?: string;
  organic?: boolean;
};

const products: Product[] = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    category: "Vegetables",
    farmer: "Ramesh Kumar",
    location: "Jaipur",
    price: 32,
    oldPrice: 38,
    unit: "kg",
    rating: 4.8,
    reviews: 124,
    distance: "12 km",
    emoji: "🍅",
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Farm Potatoes",
    category: "Vegetables",
    farmer: "Sita Devi",
    location: "Sanganer",
    price: 25,
    oldPrice: 30,
    unit: "kg",
    rating: 4.9,
    reviews: 86,
    distance: "16 km",
    emoji: "🥔",
    badge: "Fresh Today",
  },
  {
    id: 3,
    name: "Red Onions",
    category: "Vegetables",
    farmer: "Mohan Lal",
    location: "Chomu",
    price: 28,
    unit: "kg",
    rating: 4.7,
    reviews: 72,
    distance: "21 km",
    emoji: "🧅",
    organic: true,
  },
  {
    id: 4,
    name: "Fresh Carrots",
    category: "Vegetables",
    farmer: "Anita Sharma",
    location: "Amer",
    price: 40,
    oldPrice: 46,
    unit: "kg",
    rating: 4.8,
    reviews: 61,
    distance: "18 km",
    emoji: "🥕",
    badge: "Popular",
  },
  {
    id: 5,
    name: "Green Capsicum",
    category: "Vegetables",
    farmer: "Rakesh Singh",
    location: "Kukas",
    price: 48,
    unit: "kg",
    rating: 4.6,
    reviews: 48,
    distance: "25 km",
    emoji: "🫑",
  },
  {
    id: 6,
    name: "Farm Spinach",
    category: "Leafy Greens",
    farmer: "Kamla Devi",
    location: "Jaipur",
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
    id: 7,
    name: "Fresh Mangoes",
    category: "Fruits",
    farmer: "Vijay Meena",
    location: "Dausa",
    price: 85,
    oldPrice: 100,
    unit: "kg",
    rating: 4.8,
    reviews: 117,
    distance: "32 km",
    emoji: "🥭",
    badge: "Seasonal",
  },
  {
    id: 8,
    name: "Fresh Cauliflower",
    category: "Vegetables",
    farmer: "Rajendra Gurjar",
    location: "Bagru",
    price: 35,
    unit: "kg",
    rating: 4.7,
    reviews: 55,
    distance: "24 km",
    emoji: "🥦",
  },
];

const categories = [
  { name: "All", emoji: "🌱" },
  { name: "Vegetables", emoji: "🥕" },
  { name: "Fruits", emoji: "🍎" },
  { name: "Leafy Greens", emoji: "🥬" },
  { name: "Dairy", emoji: "🥛" },
  { name: "Grains", emoji: "🌾" },
];

export default function MarketplacePage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(2);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [sort, setSort] = useState("Recommended");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        product.name.toLowerCase().includes(searchText) ||
        product.farmer.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });

    if (sort === "Price: Low to High") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "Price: High to Low") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    if (sort === "Rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [category, search, sort]);

  function toggleFavorite(id: number) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function clearSearch() {
    setSearch("");
    setCategory("All");
  }

  return (
    <main className="min-h-screen bg-[#F7F8F3] pb-20 text-[#17221B] sm:pb-0">


      <div className="mx-auto max-w-[1500px] px-4  sm:px-8 lg:px-10">

        {/* HERO */}

        <section className="relative overflow-hidden rounded-[25px] bg-[#EAF4E9] px-5 py-7 sm:rounded-[30px] sm:px-10 lg:px-12 lg:py-10">

          <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-green-300/20 blur-3xl" />

          <div className="absolute -bottom-32 right-72 h-64 w-64 rounded-full bg-yellow-200/30 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_0.7fr]">

            <div>

              <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-green-200 bg-white/70 px-3 py-1.5 text-xs font-bold text-[#1F7A4D]">
                <Leaf size={13} />
                Direct from local farmers
              </div>

              <h2 className="max-w-2xl text-3xl font-black leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
                Fresh food.
                <br />
                <span className="text-[#1F7A4D]">Fair prices.</span>{" "}
                Real farmers.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
                Shop fresh produce directly from farmers around Jaipur.
                Know where your food comes from and help farmers earn more.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">

                <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold shadow-sm">
                  <span>🌱</span>
                  Farm fresh
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold shadow-sm">
                  <span>💰</span>
                  Fair pricing
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold shadow-sm">
                  <span>🤝</span>
                  Support farmers
                </div>

              </div>
            </div>

            {/* Hero visual */}

            <div className="relative hidden min-h-[230px] lg:block">

              <div className="absolute right-5 top-2 text-[100px]">
                🥕
              </div>

              <div className="absolute bottom-0 right-36 text-[80px]">
                🍅
              </div>

              <div className="absolute right-0 top-28 text-[70px]">
                🥬
              </div>

              <div className="absolute bottom-3 left-10 text-[65px]">
                🥔
              </div>

              <div className="absolute bottom-4 left-20 flex items-center gap-3 rounded-2xl border border-white bg-white/90 p-3 shadow-xl backdrop-blur">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DDEFE3] text-lg">
                  👨‍🌾
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                    Today&apos;s produce
                  </p>

                  <p className="text-xs font-black">
                    From local farms
                  </p>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* CATEGORY NAV */}

        <section className="mt-7">

          <div className="mb-4 flex items-center justify-between">

            <div>
              <h3 className="text-lg font-black">
                Shop by category
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Fresh produce from farmers near you
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCategory("All")}
              className="hidden text-xs font-bold text-[#1F7A4D] sm:block"
            >
              View all
            </button>

          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">

            {categories.map((item) => (
              <button
                type="button"
                key={item.name}
                onClick={() => setCategory(item.name)}
                className={`flex min-w-fit items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-bold transition ${
                  category === item.name
                    ? "border-[#1F7A4D] bg-[#1F7A4D] text-white shadow-md shadow-green-900/10"
                    : "border-gray-200 bg-white text-gray-600 hover:border-green-200 hover:text-[#1F7A4D]"
                }`}
              >
                <span className="text-lg">
                  {item.emoji}
                </span>

                {item.name}
              </button>
            ))}

          </div>
        </section>

        {/* TRUST STRIP */}

        <section className="mt-5 grid gap-3 sm:grid-cols-3">

          <TrustItem
            icon="🌱"
            title="Direct from farmers"
            text="Fewer unnecessary intermediaries"
          />

          <TrustItem
            icon="💰"
            title="Transparent prices"
            text="Know where your money goes"
          />

          <TrustItem
            icon="🚚"
            title="Local delivery"
            text="Fresh produce delivered to you"
          />

        </section>

        {/* PRODUCTS */}

        <section className="mt-10">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1F7A4D]">
                Recommended for you
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                Fresh from the farm
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {filteredProducts.length} products available near you
              </p>

            </div>

            <div className="flex gap-2">

              <button
                type="button"
                onClick={() => setShowFilters((value) => !value)}
                className={`flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-xs font-bold transition ${
                  showFilters
                    ? "border-[#1F7A4D] text-[#1F7A4D]"
                    : "border-gray-200 text-gray-600 hover:border-green-200 hover:text-[#1F7A4D]"
                }`}
              >
                <SlidersHorizontal size={15} />
                Filters
              </button>

              <div className="relative">

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-9 text-xs font-bold text-gray-600 outline-none hover:border-green-200"
                >
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

              </div>
            </div>
          </div>

          {/* FILTER PANEL */}

          {showFilters && (
            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <div className="flex flex-wrap gap-3">

                <button
                  type="button"
                  className="rounded-xl bg-green-50 px-4 py-2 text-xs font-bold text-green-700"
                >
                  Within 10 km
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600"
                >
                  Organic
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600"
                >
                  Available today
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600"
                >
                  Top rated
                </button>

              </div>
            </div>
          )}

          {/* =====================================================
              PRODUCT GRID

              IMPORTANT:
              grid-cols-2 = ALWAYS 2 PRODUCTS ON MOBILE
          ====================================================== */}

          {filteredProducts.length > 0 ? (

            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">

              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  favorite={favorites.includes(product.id)}
                  onFavorite={() => toggleFavorite(product.id)}
                  onAdd={() => setCartCount((count) => count + 1)}
                />
              ))}

            </div>

          ) : (

            <div className="mt-6 rounded-3xl border border-dashed border-gray-300 bg-white py-20 text-center">

              <div className="text-5xl">
                🔎
              </div>

              <h3 className="mt-4 text-lg font-black">
                No produce found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Try another search or category.
              </p>

              <button
                type="button"
                onClick={clearSearch}
                className="mt-5 rounded-xl bg-[#1F7A4D] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#17633E]"
              >
                Clear search
              </button>

            </div>
          )}

        </section>

        {/* PRICE TRANSPARENCY */}

        <section className="mt-12 overflow-hidden rounded-[28px] border border-green-100 bg-white">

          <div className="grid lg:grid-cols-2">

            <div className="bg-[#173D2A] p-7 text-white sm:p-9">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                💰
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-green-300">
                Our promise
              </p>

              <h2 className="mt-2 max-w-md text-2xl font-black leading-tight sm:text-3xl">
                Know exactly where your money goes.
              </h2>

              <p className="mt-4 max-w-md text-sm leading-6 text-green-100/70">
                Every product shows a transparent price breakdown so you can
                see how your purchase supports the farmer.
              </p>

              <button
                type="button"
                className="mt-6 flex items-center gap-2 text-xs font-bold text-white hover:text-green-200"
              >
                Learn about our pricing
                <ArrowRight size={15} />
              </button>

            </div>

            <div className="p-7 sm:p-9">

              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Example
              </p>

              <div className="mt-4 flex items-end justify-between gap-4">

                <div>
                  <p className="text-2xl font-black">
                    Fresh Tomatoes
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    1 kg • Direct from Ramesh&apos;s farm
                  </p>
                </div>

                <p className="text-2xl font-black text-[#1F7A4D]">
                  ₹32
                </p>

              </div>

              <div className="mt-6 space-y-4">

                <PriceLine
                  label="Farmer"
                  value="₹27"
                  percentage="84%"
                  width="84%"
                />

                <PriceLine
                  label="Local logistics"
                  value="₹3"
                  percentage="9%"
                  width="9%"
                />

                <PriceLine
                  label="Platform"
                  value="₹2"
                  percentage="7%"
                  width="7%"
                />

              </div>

              <div className="mt-6 rounded-xl bg-green-50 p-3 text-center text-xs font-bold text-green-700">
                🌱 More of your payment reaches the farmer
              </div>

            </div>

          </div>
        </section>

        {/* FOOTER CTA */}

        <section className="py-14 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF6EE] text-[#1F7A4D]">
            <Leaf size={23} />
          </div>

          <h2 className="mt-4 text-2xl font-black">
            Good food starts with good connections.
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500">
            Buy directly from farmers, enjoy fresher produce, and help build a
            fairer food supply chain.
          </p>

        </section>

      </div>

      {/* MOBILE BOTTOM NAV */}

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 px-5 py-3 backdrop-blur-xl sm:hidden">

        <div className="flex items-center justify-around">

          <Link
            href="/consumer"
            className="flex flex-col items-center gap-1 text-[#1F7A4D]"
          >
            <Leaf size={19} />
            <span className="text-[9px] font-bold">
              Home
            </span>
          </Link>

          <button
            type="button"
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <Heart size={19} />
            <span className="text-[9px] font-bold">
              Saved
            </span>
          </button>

          <button
            type="button"
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <ShoppingCart size={19} />
            <span className="text-[9px] font-bold">
              Cart
            </span>
          </button>

          <Link
            href="/profile"
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <UserRound size={19} />
            <span className="text-[9px] font-bold">
              Profile
            </span>
          </Link>

        </div>
      </div>

    </main>
  );
}

/* ===============================================================
   PRODUCT CARD
================================================================ */

function ProductCard({
  product,
  favorite,
  onFavorite,
  onAdd,
}: {
  product: Product;
  favorite: boolean;
  onFavorite: () => void;
  onAdd: () => void;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-100 hover:shadow-xl sm:rounded-[24px]">

      {/* Product Visual */}

      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-[#F2F5EC] sm:h-52">

        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/60" />

        <div className="absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-green-100/50" />

        {product.badge && (
          <span className="absolute left-2 top-2 z-10 max-w-[75%] truncate rounded-full bg-white px-2 py-1 text-[7px] font-black text-[#1F7A4D] shadow-sm sm:left-4 sm:top-4 sm:px-2.5 sm:py-1.5 sm:text-[9px]">
            {product.badge}
          </span>
        )}

        {product.organic && (
          <span className="absolute bottom-2 left-2 z-10 flex items-center gap-1 rounded-full bg-[#173D2A] px-2 py-1 text-[7px] font-bold text-white sm:bottom-4 sm:left-4 sm:px-2.5 sm:py-1.5 sm:text-[9px]">
            <Leaf size={9} />
            Organic
          </span>
        )}

        {/* Favorite */}

        <button
          type="button"
          onClick={onFavorite}
          className={`absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105 sm:right-4 sm:top-4 sm:h-9 sm:w-9 ${
            favorite
              ? "text-red-500"
              : "text-gray-400 hover:text-red-400"
          }`}
          aria-label={
            favorite
              ? `Remove ${product.name} from favorites`
              : `Add ${product.name} to favorites`
          }
        >
          <Heart
            size={14}
            fill={favorite ? "currentColor" : "none"}
            className="sm:h-[17px] sm:w-[17px]"
          />
        </button>

        {/* Product Emoji */}

        <span className="relative z-10 text-[62px] drop-shadow-sm transition duration-500 group-hover:scale-110 sm:text-[95px]">
          {product.emoji}
        </span>

      </div>

      {/* Product Info */}

      <div className="p-3 sm:p-5">

        {/* Name + Price */}

        <div className="flex items-start justify-between gap-1.5">

          <div className="min-w-0">

            <p className="text-[7px] font-bold uppercase tracking-wider text-gray-400 sm:text-[9px]">
              {product.category}
            </p>

            <h3 className="mt-0.5 truncate text-[12px] font-black sm:mt-1 sm:text-base">
              {product.name}
            </h3>

          </div>

          <div className="shrink-0 text-right">

            <p className="text-sm font-black text-[#1F7A4D] sm:text-lg">
              ₹{product.price}
            </p>

            {product.oldPrice && (
              <p className="text-[8px] text-gray-400 line-through sm:text-[10px]">
                ₹{product.oldPrice}
              </p>
            )}

          </div>
        </div>

        {/* Farmer */}

        <Link
          href={`/farmer-profile/${product.id}`}
          className="mt-3 flex min-w-0 items-center gap-1.5 rounded-xl transition hover:bg-gray-50 sm:mt-4 sm:gap-2"
        >

          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#DDEFE3] text-[11px] sm:h-8 sm:w-8 sm:text-sm">
            👨‍🌾
          </div>

          <div className="min-w-0 flex-1">

            <p className="truncate text-[15px] font-bold text-gray-700 sm:text-[20px]">
              {product.farmer}
            </p>

            <p className="flex items-center gap-0.5 truncate text-[7px] text-gray-400 sm:gap-1 sm:text-[20px]">
              <MapPin size={7} />
              {product.location} • {product.distance}
            </p>

          </div>

          <ChevronRight
            size={12}
            className="shrink-0 text-gray-300 sm:h-[14px] sm:w-[14px]"
          />

        </Link>

        {/* Rating */}

        <div className="mt-3 flex items-center justify-between sm:mt-4">

          <div className="flex items-center gap-0.5">

            <Star
              size={10}
              className="fill-[#E6A92E] text-[#E6A92E] sm:h-[13px] sm:w-[13px]"
            />

            <span className="text-[8px] font-black sm:text-[10px]">
              {product.rating}
            </span>

            <span className="text-[7px] text-gray-400 sm:text-[9px]">
              ({product.reviews})
            </span>

          </div>

          <span className="text-[7px] font-medium text-gray-400 sm:text-[9px]">
            per {product.unit}
          </span>

        </div>

        {/* CTA */}

        <div className="mt-3 flex gap-1.5 sm:mt-4 sm:gap-2">

          <Link
            href={`/marketplace/${product.id}`}
            className="flex h-8 min-w-0 flex-1 items-center justify-center rounded-lg border border-gray-200 px-1 text-[8px] font-bold text-gray-600 transition hover:border-[#1F7A4D] hover:bg-green-50 hover:text-[#1F7A4D] sm:h-10 sm:rounded-xl sm:px-3 sm:text-xs"
          >
            <span className="truncate">
              View details
            </span>
          </Link>

          <button
            type="button"
            onClick={onAdd}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1F7A4D] text-white transition hover:bg-[#17633E] sm:h-10 sm:w-10 sm:rounded-xl"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart
              size={13}
              className="sm:h-4 sm:w-4"
            />
          </button>

        </div>

      </div>
    </article>
  );
}

/* ===============================================================
   TRUST ITEM
================================================================ */

function TrustItem({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3F7EF] text-lg">
        {icon}
      </div>

      <div>

        <p className="text-xs font-black">
          {title}
        </p>

        <p className="mt-0.5 text-[10px] text-gray-500">
          {text}
        </p>

      </div>
    </div>
  );
}

/* ===============================================================
   PRICE LINE
================================================================ */

function PriceLine({
  label,
  value,
  percentage,
  width,
}: {
  label: string;
  value: string;
  percentage: string;
  width: string;
}) {
  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <div>

          <span className="text-xs font-bold">
            {label}
          </span>

          <span className="ml-2 text-[10px] text-gray-400">
            {percentage}
          </span>

        </div>

        <span className="text-xs font-black">
          {value}
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-gray-100">

        <div
          className="h-full rounded-full bg-[#1F7A4D]"
          style={{ width }}
        />

      </div>

    </div>
  );
}