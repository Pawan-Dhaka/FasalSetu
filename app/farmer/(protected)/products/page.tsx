"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Package,
  Plus,
  RefreshCw,
  Sprout,
  Trash2,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  category: string;
  quality: string | null;
  quantity: string | number;
  pricePerKg: string | number;
  createdAt: string;
};

function formatNumber(value: string | number) {
  return Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

export default function FarmerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/farmer/products", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load products"
        );
      }

      setProducts(data.products || []);
    } catch (err) {
      console.error("LOAD_PRODUCTS_ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-[#F6F8F3] text-[#17221B]">
      <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <Link
              href="/farmer"
              className="mb-4 flex w-fit items-center gap-2 text-xs font-bold text-gray-500 transition hover:text-[#1F7A4D]"
            >
              <ArrowLeft size={15} />
              Back to dashboard
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F5EC] text-[#1F7A4D]">
                <Package size={23} />
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight">
                  Your Products
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage the produce you have listed on FasalSetu.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadProducts}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs font-bold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <Link
              href="/farmer/add-product"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#1F7A4D] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-green-900/10 transition hover:bg-[#17633E]"
            >
              <Plus size={16} />
              Add Produce
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4">
            <p className="text-sm font-bold text-red-600">
              {error}
            </p>

            <button
              onClick={loadProducts}
              className="mt-2 text-xs font-bold text-red-700 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-[26px] border border-gray-200 bg-white"
              />
            ))}
          </div>
        ) : products.length === 0 ? (

          /* Empty State */
          <section className="rounded-[28px] border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF6EE] text-[#1F7A4D]">
              <Sprout size={28} />
            </div>

            <h2 className="mt-5 text-xl font-black">
              No products yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              You haven't listed any produce yet. Add your first
              product and start selling directly to consumers.
            </p>

            <Link
              href="/farmer/add-product"
              className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-xl bg-[#1F7A4D] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#17633E]"
            >
              <Plus size={16} />
              Add Your First Product
            </Link>
          </section>

        ) : (

          /* Products */
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {products.map((product) => {
              const quantity = Number(product.quantity);
              const price = Number(product.pricePerKg);

              const lowStock =
                quantity > 0 && quantity < 20;

              return (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* Image placeholder */}
                  <div className="relative flex h-44 items-center justify-center bg-[#F2F7F1]">

                    <span className="text-6xl">
                      🌱
                    </span>

                    <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-gray-600 shadow-sm">
                      {product.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-black">
                          {product.name}
                        </h2>

                        {product.quality && (
                          <p className="mt-1 text-[10px] font-semibold text-gray-400">
                            {product.quality}
                          </p>
                        )}
                      </div>

                      {lowStock && (
                        <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[9px] font-bold text-orange-600">
                          Low stock
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="mt-5 grid grid-cols-2 gap-3">

                      <div className="rounded-xl bg-[#F7F9F6] p-3">
                        <p className="text-[9px] font-medium text-gray-400">
                          Available
                        </p>

                        <p className="mt-1 text-sm font-black">
                          {formatNumber(quantity)} kg
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#F7F9F6] p-3">
                        <p className="text-[9px] font-medium text-gray-400">
                          Price / kg
                        </p>

                        <p className="mt-1 text-sm font-black text-[#1F7A4D]">
                          ₹{formatNumber(price)}
                        </p>
                      </div>

                    </div>

                    {/* Actions */}
                    <div className="mt-5 grid grid-cols-2 gap-3">

                      <button
                        disabled
                        className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-3 text-[10px] font-bold text-gray-400"
                        title="Edit will be added next"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>

                      <button
                        disabled
                        className="flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-3 text-[10px] font-bold text-red-300"
                        title="Delete will be added next"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>

                    </div>

                  </div>
                </article>
              );
            })}

          </div>
        )}

        {/* Bottom info */}
        {!loading && products.length > 0 && (
          <div className="mt-7 rounded-2xl border border-green-100 bg-green-50 px-5 py-4">
            <p className="text-xs font-semibold text-green-800">
              You currently have{" "}
              <span className="font-black">
                {products.length}
              </span>{" "}
              {products.length === 1
                ? "product"
                : "products"}{" "}
              listed on FasalSetu.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}