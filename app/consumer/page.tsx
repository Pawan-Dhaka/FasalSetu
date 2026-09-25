"use client";

import Link from "next/link";
import {
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
  X,
  Minus,
  Plus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Farmer = {
  id: number;
  name: string;
  mobile: string;
  address: string | null;
  village: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
};

type DBProduct = {
  id: number;
  name: string;
  category: string;
  quality: string | null;
  quantity: string | number;
  pricePerKg: string | number;
  createdAt: string;
  farmer: Farmer;
};

type Product = {
  id: number;
  name: string;
  category: string;
  quality: string | null;
  farmer: string;
  farmerId: number;
  location: string;
  price: number;
  quantity: number;
  emoji: string;
  organic: boolean;
  badge?: string;
};

const categories = [
  { name: "All", emoji: "🌱" },
  { name: "Vegetables", emoji: "🥕" },
  { name: "Fruits", emoji: "🍎" },
  { name: "Leafy Greens", emoji: "🥬" },
  { name: "Dairy", emoji: "🥛" },
  { name: "Grains", emoji: "🌾" },
  { name: "Pulses", emoji: "🫘" },
  { name: "Spices", emoji: "🌶️" },
  { name: "Other", emoji: "📦" },
];

function getEmoji(name: string, category: string) {
  const text = `${name} ${category}`.toLowerCase();

  if (text.includes("tomato")) return "🍅";
  if (text.includes("potato")) return "🥔";
  if (text.includes("onion")) return "🧅";
  if (text.includes("carrot")) return "🥕";
  if (text.includes("capsicum")) return "🫑";
  if (text.includes("spinach")) return "🥬";
  if (text.includes("mango")) return "🥭";
  if (text.includes("banana")) return "🍌";
  if (text.includes("apple")) return "🍎";
  if (text.includes("cauliflower")) return "🥦";
  if (text.includes("milk")) return "🥛";
  if (text.includes("wheat")) return "🌾";
  if (text.includes("rice")) return "🌾";
  if (text.includes("dal")) return "🫘";
  if (text.includes("pulse")) return "🫘";
  if (text.includes("chilli")) return "🌶️";
  if (text.includes("pepper")) return "🌶️";

  const categoryText = category.toLowerCase();

  if (categoryText.includes("vegetable")) return "🥕";
  if (categoryText.includes("fruit")) return "🍎";
  if (categoryText.includes("leaf")) return "🥬";
  if (categoryText.includes("dairy")) return "🥛";
  if (categoryText.includes("grain")) return "🌾";
  if (categoryText.includes("pulse")) return "🫘";
  if (categoryText.includes("spice")) return "🌶️";

  return "🌱";
}

function getLocation(farmer: Farmer) {
  return (
    farmer.city ||
    farmer.village ||
    farmer.state ||
    "Local Farm"
  );
}

function mapProduct(product: DBProduct): Product {
  const quantity = Number(product.quantity);

  const organic =
    product.quality?.toLowerCase() === "organic";

  const createdAt = new Date(product.createdAt);

  const ageInHours =
    (Date.now() - createdAt.getTime()) /
    (1000 * 60 * 60);

  let badge: string | undefined;

  if (ageInHours < 24) {
    badge = "Fresh Today";
  } else if (quantity < 20) {
    badge = "Limited Stock";
  }

  return {
    id: product.id,
    name: product.name,
    category: product.category,
    quality: product.quality,
    farmer: product.farmer.name,
    farmerId: product.farmer.id,
    location: getLocation(product.farmer),
    price: Number(product.pricePerKg),
    quantity,
    emoji: getEmoji(product.name, product.category),
    organic,
    badge,
  };
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Recommended");

  const [favorites, setFavorites] = useState<number[]>([]);
  const [cartQuantities, setCartQuantities] =
    useState<Record<number, number>>({});

  const [cartCount, setCartCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] =
    useState<number | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showFilters, setShowFilters] =
    useState(false);

  const [organicOnly, setOrganicOnly] =
    useState(false);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/products", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load products"
        );
      }

      const mapped = (data.products || []).map(
        (product: DBProduct) => mapProduct(product)
      );

      setProducts(mapped);
    } catch (error) {
      console.error("LOAD_PRODUCTS_ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadCart() {
    try {
      const response = await fetch("/api/cart", {
        cache: "no-store",
      });

      if (!response.ok) {
        setCartCount(0);
        setCartQuantities({});
        return;
      }

      const data = await response.json();

      setCartCount(Number(data.count || 0));

      const quantities: Record<number, number> = {};

      for (const item of data.items || []) {
        quantities[item.productId] = Number(
          item.quantity
        );
      }

      setCartQuantities(quantities);
    } catch (error) {
      console.error("LOAD_CART_ERROR:", error);
    }
  }

  useEffect(() => {
    loadProducts();
    loadCart();

    const saved = localStorage.getItem(
      "fasalsetu-favorites"
    );

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      } catch {
        localStorage.removeItem(
          "fasalsetu-favorites"
        );
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "fasalsetu-favorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        category === "All" ||
        product.category === category;

      const text = search.toLowerCase().trim();

      const matchesSearch =
        !text ||
        product.name.toLowerCase().includes(text) ||
        product.farmer.toLowerCase().includes(text) ||
        product.category.toLowerCase().includes(text) ||
        product.location.toLowerCase().includes(text);

      const matchesOrganic =
        !organicOnly || product.organic;

      return (
        matchesCategory &&
        matchesSearch &&
        matchesOrganic
      );
    });

    if (sort === "Price: Low to High") {
      result = [...result].sort(
        (a, b) => a.price - b.price
      );
    }

    if (sort === "Price: High to Low") {
      result = [...result].sort(
        (a, b) => b.price - a.price
      );
    }

    if (sort === "Stock") {
      result = [...result].sort(
        (a, b) => b.quantity - a.quantity
      );
    }

    return result;
  }, [
    products,
    category,
    search,
    sort,
    organicOnly,
  ]);

  function toggleFavorite(id: number) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  async function addToCart(product: Product) {
    try {
      setCartLoading(product.id);
      setError("");
      setSuccess("");

      const currentQuantity =
        cartQuantities[product.id] || 0;

      if (currentQuantity >= product.quantity) {
        throw new Error(
          `Only ${product.quantity} kg available`
        );
      }

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/consumer/login";
          return;
        }

        throw new Error(
          data.error || "Failed to add product"
        );
      }

      await loadCart();

      setSuccess(`${product.name} added to cart`);

      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (error) {
      console.error("ADD_TO_CART_ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to add product"
      );

      setTimeout(() => {
        setError("");
      }, 2500);
    } finally {
      setCartLoading(null);
    }
  }

  async function updateQuantity(
    product: Product,
    change: number
  ) {
    const current =
      cartQuantities[product.id] || 0;

    const next = current + change;

    if (next < 0) return;

    try {
      setCartLoading(product.id);
      setError("");

      if (next === 0 && current > 0) {
        const cartResponse = await fetch("/api/cart", {
          cache: "no-store",
        });

        const cartData =
          await cartResponse.json();

        const item = (cartData.items || []).find(
          (item: { productId: number }) =>
            item.productId === product.id
        );

        if (item) {
          const response = await fetch(
            `/api/cart?itemId=${item.id}`,
            {
              method: "DELETE",
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.error ||
                "Failed to remove item"
            );
          }
        }

        await loadCart();
        return;
      }

      if (next > product.quantity) {
        throw new Error(
          `Only ${product.quantity} kg available`
        );
      }

      if (current === 0 && next > 0) {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product.id,
            quantity: next,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to add product"
          );
        }
      } else {
        const cartResponse = await fetch(
          "/api/cart",
          {
            cache: "no-store",
          }
        );

        const cartData =
          await cartResponse.json();

        const item = (cartData.items || []).find(
          (item: { productId: number }) =>
            item.productId === product.id
        );

        if (!item) {
          throw new Error(
            "Cart item not found"
          );
        }

        const response = await fetch("/api/cart", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itemId: item.id,
            quantity: next,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to update cart"
          );
        }
      }

      await loadCart();
    } catch (error) {
      console.error(
        "UPDATE_CART_QUANTITY_ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update cart"
      );

      setTimeout(() => {
        setError("");
      }, 2500);
    } finally {
      setCartLoading(null);
    }
  }

  function clearFilters() {
    setSearch("");
    setCategory("All");
    setOrganicOnly(false);
    setSort("Recommended");
  }

  return (
    <main className="min-h-screen bg-[#F7F8F3] text-[#17221B]">

      <div className="mx-auto max-w-[1500px] px-4 pb-16 sm:px-8 lg:px-10">

        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="relative mt-5 overflow-hidden rounded-[25px] bg-[#EAF4E9] px-5 py-7 sm:rounded-[30px] sm:px-10 lg:px-12 lg:py-10">

          <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-green-300/20 blur-3xl" />

          <div className="absolute -bottom-32 right-72 h-64 w-64 rounded-full bg-yellow-200/30 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_0.7fr]">

            <div>

              <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-green-200 bg-white/70 px-3 py-1.5 text-xs font-bold text-[#1F7A4D]">
                <Leaf size={13} />
                Direct from local farmers
              </div>

              <h1 className="max-w-2xl text-3xl font-black leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
                Fresh food.
                <br />

                <span className="text-[#1F7A4D]">
                  Fair prices.
                </span>{" "}
                Real farmers.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
                Shop fresh produce directly
                from farmers and discover
                quality food at transparent
                prices.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">

                <div className="rounded-xl bg-white px-3 py-2 text-xs font-bold shadow-sm">
                  🌱 Farm fresh
                </div>

                <div className="rounded-xl bg-white px-3 py-2 text-xs font-bold shadow-sm">
                  💰 Fair pricing
                </div>

                <div className="rounded-xl bg-white px-3 py-2 text-xs font-bold shadow-sm">
                  🤝 Support farmers
                </div>

              </div>

            </div>

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

              

            </div>

          </div>
        </section>

        {/* =====================================================
            SEARCH
        ====================================================== */}

        <section className="mt-6">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search vegetables, fruits, farmers..."
              className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-11 pr-11 text-sm font-medium outline-none transition placeholder:text-gray-400 focus:border-[#1F7A4D] focus:ring-2 focus:ring-green-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={17} />
              </button>
            )}

          </div>

        </section>

        {/* =====================================================
            CATEGORY
        ====================================================== */}

        <section className="mt-7">

          <div className="mb-4 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-black">
                Shop by category
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Find exactly what you need
              </p>
            </div>

          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">

            {categories.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() =>
                  setCategory(item.name)
                }
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

        {/* =====================================================
            TRUST
        ====================================================== */}

        <section className="mt-5 grid gap-3 sm:grid-cols-3">

          <TrustItem
            icon="🌱"
            title="Direct from farmers"
            text="Buy closer to the source"
          />

          <TrustItem
            icon="💰"
            title="Transparent prices"
            text="Clear price per kilogram"
          />

          <TrustItem
            icon="🚚"
            title="Local produce"
            text="Fresh products from nearby farms"
          />

        </section>

        {/* =====================================================
            PRODUCTS
        ====================================================== */}

        <section className="mt-10">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1F7A4D]">
                Marketplace
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                Fresh from the farm
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {loading
                  ? "Finding fresh produce..."
                  : `${filteredProducts.length} products available`}
              </p>

            </div>

            <div className="flex gap-2">

              <button
                type="button"
                onClick={() =>
                  setShowFilters((value) => !value)
                }
                className={`flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-xs font-bold transition ${
                  showFilters
                    ? "border-[#1F7A4D] text-[#1F7A4D]"
                    : "border-gray-200 text-gray-600 hover:border-green-200"
                }`}
              >
                <SlidersHorizontal size={15} />
                Filters
              </button>

              <div className="relative">

                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value)
                  }
                  className="appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-9 text-xs font-bold text-gray-600 outline-none"
                >
                  <option>Recommended</option>

                  <option>
                    Price: Low to High
                  </option>

                  <option>
                    Price: High to Low
                  </option>

                  <option>Stock</option>
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

              </div>

            </div>

          </div>

          {showFilters && (
            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <div className="flex flex-wrap items-center gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setOrganicOnly((value) => !value)
                  }
                  className={`rounded-xl px-4 py-2 text-xs font-bold ${
                    organicOnly
                      ? "bg-[#1F7A4D] text-white"
                      : "border border-gray-200 text-gray-600"
                  }`}
                >
                  🌱 Organic
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSort("Price: Low to High")
                  }
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:border-green-200"
                >
                  Lowest price
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSort("Price: High to Low")
                  }
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:border-green-200"
                >
                  Highest price
                </button>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-xl bg-gray-50 px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100"
                >
                  Clear filters
                </button>

              </div>
            </div>
          )}

          {error && (
            <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-red-100 bg-red-50 px-5 py-4">

              <p className="text-xs font-bold text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  loadProducts();
                  loadCart();
                }}
                className="rounded-lg bg-white px-3 py-2 text-[10px] font-bold text-red-600"
              >
                Retry
              </button>

            </div>
          )}

          {success && (
            <div className="mt-5 rounded-2xl border border-green-100 bg-green-50 px-5 py-4">
              <p className="text-xs font-bold text-green-700">
                ✓ {success}
              </p>
            </div>
          )}

          {loading ? (

            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">

              {Array.from({ length: 8 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-[390px] animate-pulse rounded-2xl border border-gray-200 bg-white sm:rounded-[24px]"
                  />
                )
              )}

            </div>

          ) : filteredProducts.length > 0 ? (

            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">

              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  favorite={favorites.includes(
                    product.id
                  )}
                  quantity={
                    cartQuantities[product.id] || 0
                  }
                  loading={
                    cartLoading === product.id
                  }
                  onFavorite={() =>
                    toggleFavorite(product.id)
                  }
                  onAdd={() =>
                    addToCart(product)
                  }
                  onIncrease={() =>
                    updateQuantity(product, 1)
                  }
                  onDecrease={() =>
                    updateQuantity(product, -1)
                  }
                />
              ))}

            </div>

          ) : (

            <div className="mt-6 rounded-[28px] border border-dashed border-gray-300 bg-white py-20 text-center">

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
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-[#1F7A4D] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#17633E]"
              >
                Clear filters
              </button>

            </div>
          )}

        </section>

        {/* =====================================================
            BOTTOM INFO
        ====================================================== */}

        <section className="mt-12 overflow-hidden rounded-[28px] border border-green-100 bg-white">

          <div className="grid lg:grid-cols-2">

            <div className="bg-[#173D2A] p-7 text-white sm:p-9">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                💰
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-green-300">
                FasalSetu
              </p>

              <h2 className="mt-2 max-w-md text-2xl font-black leading-tight sm:text-3xl">
                Better connections between
                farmers and consumers.
              </h2>

              <p className="mt-4 max-w-md text-sm leading-6 text-green-100/70">
                Discover produce directly from
                farmers with clear pricing and
                available stock.
              </p>

            </div>

            <div className="p-7 sm:p-9">

              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Marketplace benefits
              </p>

              <div className="mt-5 space-y-4">

                <Benefit
                  icon="🌱"
                  title="Fresh produce"
                  text="Products listed directly by farmers"
                />

                <Benefit
                  icon="💰"
                  title="Clear pricing"
                  text="See the actual price per kg"
                />

                <Benefit
                  icon="🤝"
                  title="Direct connection"
                  text="Know who is growing your food"
                />

              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <section className="py-14 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF6EE] text-[#1F7A4D]">
            <Leaf size={23} />
          </div>

          <h2 className="mt-4 text-2xl font-black">
            Good food starts with good connections.
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500">
            Buy directly from farmers, enjoy
            fresher produce, and help build a
            fairer food supply chain.
          </p>

        </section>

      </div>

      {/* =====================================================
          FLOATING CART
      ====================================================== */}

      {cartCount > 0 && (
        <div className="fixed bottom-5 right-4 z-50 sm:bottom-6 sm:right-6">

          <Link
            href="/cart"
            className="group flex min-w-[250px] items-center gap-3 rounded-2xl bg-[#173D2A] p-3 text-white shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:bg-[#1F7A4D] sm:min-w-[290px] sm:p-4"
          >

            {/* CART ICON */}

            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">

              <ShoppingCart
                size={23}
                className="text-white"
              />

              <span className="absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#A8D96C] px-1.5 text-[10px] font-black text-[#173D2A] shadow-lg">
                {cartCount}
              </span>

            </div>

            {/* CART INFO */}

            <div className="min-w-0 flex-1">

              <p className="text-[10px] font-bold uppercase tracking-wider text-green-200">
                Your Cart
              </p>

              <p className="mt-0.5 text-sm font-black sm:text-base">
                {cartCount === 1
                  ? "1 item in cart"
                  : `${cartCount} items in cart`}
              </p>

              <p className="mt-0.5 text-[9px] text-green-100/60">
                Click to view your cart
              </p>

            </div>

            {/* ARROW */}

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#173D2A] transition group-hover:translate-x-0.5">

              <ChevronRight size={18} />

            </div>

          </Link>

        </div>
      )}

    </main>
  );
}

/* ===============================================================
   PRODUCT CARD
================================================================ */

function ProductCard({
  product,
  favorite,
  quantity,
  loading,
  onFavorite,
  onAdd,
  onIncrease,
  onDecrease,
}: {
  product: Product;
  favorite: boolean;
  quantity: number;
  loading: boolean;
  onFavorite: () => void;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  const inCart = quantity > 0;

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-100 hover:shadow-xl sm:rounded-[24px]">

      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-[#F2F5EC] sm:h-52">

        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/60" />

        <div className="absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-green-100/50" />

        {product.badge && (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-white px-2 py-1 text-[7px] font-black text-[#1F7A4D] shadow-sm sm:left-4 sm:top-4 sm:px-2.5 sm:py-1.5 sm:text-[9px]">
            {product.badge}
          </span>
        )}

        {product.organic && (
          <span className="absolute bottom-2 left-2 z-10 flex items-center gap-1 rounded-full bg-[#173D2A] px-2 py-1 text-[7px] font-bold text-white sm:bottom-4 sm:left-4 sm:px-2.5 sm:py-1.5 sm:text-[9px]">
            <Leaf size={9} />
            Organic
          </span>
        )}

        <button
          type="button"
          onClick={onFavorite}
          className={`absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105 sm:right-4 sm:top-4 sm:h-9 sm:w-9 ${
            favorite
              ? "text-red-500"
              : "text-gray-400 hover:text-red-400"
          }`}
        >
          <Heart
            size={14}
            fill={
              favorite ? "currentColor" : "none"
            }
            className="sm:h-[17px] sm:w-[17px]"
          />
        </button>

        <span className="relative z-10 text-[62px] drop-shadow-sm transition duration-500 group-hover:scale-110 sm:text-[95px]">
          {product.emoji}
        </span>

      </div>

      <div className="p-3 sm:p-5">

        <div className="flex items-start justify-between gap-2">

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
              ₹
              {product.price.toLocaleString(
                "en-IN"
              )}
            </p>

            <p className="text-[7px] text-gray-400 sm:text-[9px]">
              / kg
            </p>

          </div>

        </div>

        <Link
          href={`/farmer-profile/${product.farmerId}`}
          className="mt-3 flex min-w-0 items-center gap-1.5 rounded-xl transition hover:bg-gray-50 sm:mt-4 sm:gap-2"
        >

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#DDEFE3] text-xs sm:h-8 sm:w-8 sm:text-sm">
            👨‍🌾
          </div>

          <div className="min-w-0 flex-1">

            <p className="truncate text-[10px] font-bold text-gray-700 sm:text-xs">
              {product.farmer}
            </p>

            <p className="flex items-center gap-1 truncate text-[7px] text-gray-400 sm:text-[9px]">
              <MapPin size={8} />
              {product.location}
            </p>

          </div>

          <ChevronRight
            size={12}
            className="shrink-0 text-gray-300"
          />

        </Link>

        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">

          <div className="flex items-center gap-1">

            <Star
              size={11}
              className="text-gray-300"
            />

            <span className="text-[8px] font-bold text-gray-400 sm:text-[9px]">
              New
            </span>

          </div>

          <div className="flex items-center gap-1 text-[7px] font-bold text-gray-400 sm:text-[9px]">

            <Truck
              size={11}
              className="text-[#1F7A4D]"
            />

            {product.quantity} kg available

          </div>

        </div>

        <Link
          href={`/marketplace/${product.id}`}
          className="mt-3 flex h-9 w-full items-center justify-center rounded-xl border border-gray-200 text-[9px] font-bold text-gray-600 transition hover:border-[#1F7A4D] hover:bg-green-50 hover:text-[#1F7A4D] sm:h-10 sm:text-xs"
        >
          View product details
        </Link>

        {!inCart ? (

          <button
            type="button"
            onClick={onAdd}
            disabled={loading}
            className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#1F7A4D] text-[9px] font-black text-white shadow-md shadow-green-900/10 transition hover:bg-[#17633E] disabled:cursor-not-allowed disabled:opacity-60 sm:h-11 sm:text-xs"
          >
            {loading ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart size={15} />
                Add to Cart
              </>
            )}
          </button>

        ) : (

          <div className="mt-2 rounded-xl bg-[#EAF4E9] p-1.5">

            <div className="flex items-center justify-between">

              <button
                type="button"
                onClick={onDecrease}
                disabled={loading}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#1F7A4D] shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
              >
                <Minus size={14} />
              </button>

              <div className="text-center">

                <p className="text-[8px] font-bold uppercase tracking-wide text-[#1F7A4D]">
                  In Cart
                </p>

                <p className="text-sm font-black text-[#173D2A]">
                  {quantity} kg
                </p>

              </div>

              <button
                type="button"
                onClick={onIncrease}
                disabled={
                  loading ||
                  quantity >= product.quantity
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1F7A4D] text-white shadow-sm transition hover:bg-[#17633E] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={14} />
              </button>

            </div>

          </div>

        )}

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
   BENEFIT
================================================================ */

function Benefit({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[#F7F9F5] p-4">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
        {icon}
      </div>

      <div>

        <p className="text-xs font-black">
          {title}
        </p>

        <p className="mt-1 text-[10px] text-gray-500">
          {text}
        </p>

      </div>

    </div>
  );
}