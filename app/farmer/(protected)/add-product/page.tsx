"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  ImagePlus,
  PackagePlus,
  Save,
  Sprout,
} from "lucide-react";

const categories = [
  "Vegetables",
  "Fruits",
  "Grains",
  "Pulses",
  "Spices",
  "Other",
];

const qualities = [
  "Grade A",
  "Grade B",
  "Organic",
  "Standard",
];

export default function AddProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quality, setQuality] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pricePerKg, setPricePerKg] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter product name.");
      return;
    }

    if (!category) {
      setError("Please select a category.");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }

    if (!pricePerKg || Number(pricePerKg) <= 0) {
      setError("Please enter a valid price per kg.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/farmer/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          category,
          quality: quality || null,
          quantity: Number(quantity),
          pricePerKg: Number(pricePerKg),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to add product"
        );
      }

      setSuccess("Product added successfully!");

      setTimeout(() => {
        router.push("/farmer/products");
        router.refresh();
      }, 700);
    } catch (err) {
      console.error("ADD_PRODUCT_ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F6F8F3] text-[#17221B]">
      <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8">

        {/* Back */}
        <Link
          href="/farmer"
          className="mb-6 flex w-fit items-center gap-2 text-xs font-bold text-gray-500 transition hover:text-[#1F7A4D]"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F5EC] text-[#1F7A4D]">
              <PackagePlus size={23} />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Add Produce
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Add your fresh produce to FasalSetu marketplace.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-7 lg:grid-cols-[1fr_360px]"
        >
          {/* LEFT */}
          <section className="rounded-[26px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF6EE] text-[#1F7A4D]">
                  <Sprout size={19} />
                </div>

                <div>
                  <h2 className="text-lg font-black">
                    Product Details
                  </h2>

                  <p className="text-xs text-gray-500">
                    Enter the details of your produce.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">

              {/* Product Name */}
              <div>
                <label className="mb-2 block text-xs font-bold text-gray-700">
                  Product Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="e.g. Fresh Tomatoes"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-300 focus:border-[#1F7A4D] focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Category + Quality */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-xs font-bold text-gray-700">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1F7A4D] focus:ring-2 focus:ring-green-100"
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-gray-700">
                    Quality
                  </label>

                  <select
                    value={quality}
                    onChange={(e) =>
                      setQuality(e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1F7A4D] focus:ring-2 focus:ring-green-100"
                  >
                    <option value="">
                      Select quality
                    </option>

                    {qualities.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Quantity + Price */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-xs font-bold text-gray-700">
                    Available Quantity
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(e.target.value)
                      }
                      placeholder="e.g. 100"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-14 text-sm outline-none transition placeholder:text-gray-300 focus:border-[#1F7A4D] focus:ring-2 focus:ring-green-100"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                      KG
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-gray-700">
                    Price per KG
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={pricePerKg}
                      onChange={(e) =>
                        setPricePerKg(e.target.value)
                      }
                      placeholder="e.g. 32"
                      className="w-full rounded-xl border border-gray-200 py-3 pl-9 pr-4 text-sm outline-none transition placeholder:text-gray-300 focus:border-[#1F7A4D] focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>

              </div>

              {/* Messages */}
              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-xs font-semibold text-green-700">
                  {success}
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">

                <Link
                  href="/farmer"
                  className="flex items-center justify-center rounded-xl border border-gray-200 px-6 py-3 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#1F7A4D] px-7 py-3 text-xs font-bold text-white shadow-lg shadow-green-900/10 transition hover:bg-[#17633E] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={16} />

                  {loading
                    ? "Adding Product..."
                    : "Add Product"}
                </button>

              </div>
            </div>
          </section>

          {/* RIGHT */}
          <aside className="space-y-6">

            {/* Image */}
            <section className="rounded-[26px] border border-gray-200 bg-white p-6 shadow-sm">

              <h3 className="text-sm font-black">
                Product Image
              </h3>

              <p className="mt-1 text-[10px] leading-5 text-gray-500">
                Add an image so consumers can easily identify
                your produce.
              </p>

              <label className="mt-5 flex min-h-[210px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-[#FAFBF8] px-5 text-center transition hover:border-[#1F7A4D] hover:bg-green-50">

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setImage(
                      e.target.files?.[0] || null
                    )
                  }
                />

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#1F7A4D] shadow-sm">
                  <ImagePlus size={21} />
                </div>

                <p className="mt-4 text-xs font-black">
                  {image
                    ? image.name
                    : "Upload product image"}
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  JPG, PNG or WEBP
                </p>
              </label>

              <p className="mt-3 text-[10px] leading-5 text-gray-400">
                Image storage will be connected separately.
                Product creation does not depend on the image.
              </p>
            </section>

            {/* Preview */}
            <section className="rounded-[26px] border border-gray-200 bg-white p-6 shadow-sm">

              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-black">
                  Preview
                </h3>

                <PackagePlus
                  size={17}
                  className="text-[#1F7A4D]"
                />
              </div>

              <div className="rounded-2xl bg-[#FAFBF8] p-4">

                <div className="flex h-20 items-center justify-center rounded-2xl bg-white text-4xl shadow-sm">
                  🌱
                </div>

                <p className="mt-4 text-sm font-black">
                  {name || "Product Name"}
                </p>

                <p className="mt-1 text-[10px] text-gray-500">
                  {category || "Category"}
                </p>

                <div className="mt-4 flex items-end justify-between">

                  <div>
                    <p className="text-[9px] text-gray-400">
                      Price
                    </p>

                    <p className="text-base font-black text-[#1F7A4D]">
                      ₹{pricePerKg || "0"}
                      <span className="ml-1 text-[9px] font-medium text-gray-400">
                        /kg
                      </span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] text-gray-400">
                      Available
                    </p>

                    <p className="text-xs font-black">
                      {quantity || "0"} kg
                    </p>
                  </div>

                </div>

                {quality && (
                  <div className="mt-4 inline-flex rounded-full bg-green-100 px-3 py-1 text-[9px] font-bold text-green-700">
                    {quality}
                  </div>
                )}

              </div>
            </section>

          </aside>
        </form>
      </div>
    </main>
  );
}