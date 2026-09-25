"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

type CartItem = {
  id: number;
  quantity: number;

  product: {
    id: number;
    name: string;
    pricePerKg: string | number;
    category?: string;
    quality?: string | null;
    farmer: {
      name: string;
    };
  };
};

type Cart = {
  id: number;
  items: CartItem[];
  count?: number;
  total?: string | number;
};

function getEmoji(name: string, category?: string) {
  const text = `${name} ${category ?? ""}`.toLowerCase();

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

  if (text.includes("vegetable")) return "🥕";
  if (text.includes("fruit")) return "🍎";
  if (text.includes("leaf")) return "🥬";
  if (text.includes("dairy")) return "🥛";
  if (text.includes("grain")) return "🌾";
  if (text.includes("pulse")) return "🫘";
  if (text.includes("spice")) return "🌶️";

  return "🌱";
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function loadCart() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/cart", {
        cache: "no-store",
      });

      const data = await response.json();

      if (response.status === 401) {
        window.location.href = "/consumer/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load cart"
        );
      }

      setCart(data);
    } catch (error) {
      console.error("LOAD_CART_ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load cart"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function updateQuantity(
    itemId: number,
    quantity: number
  ) {
    if (quantity < 1) {
      await removeItem(itemId);
      return;
    }

    try {
      setUpdating(itemId);
      setError("");

      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          quantity,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        window.location.href = "/consumer/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update quantity"
        );
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
          : "Failed to update quantity"
      );
    } finally {
      setUpdating(null);
    }
  }

  async function removeItem(itemId: number) {
    try {
      setUpdating(itemId);
      setError("");

      const response = await fetch(
        `/api/cart?itemId=${itemId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        window.location.href = "/consumer/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to remove item"
        );
      }

      await loadCart();
    } catch (error) {
      console.error("REMOVE_CART_ITEM_ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to remove item"
      );
    } finally {
      setUpdating(null);
    }
  }

  const subtotal =
    cart?.items.reduce(
      (total, item) =>
        total +
        Number(item.product.pricePerKg) *
          Number(item.quantity),
      0
    ) ?? 0;

  const deliveryFee = subtotal > 0 ? 20 : 0;
  const total = subtotal + deliveryFee;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F8F3] p-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-gray-500">
            Loading cart...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F8F3] pb-16">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        <Link
          href="/consumer"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#1F7A4D]"
        >
          <ArrowLeft size={16} />
          Continue shopping
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-black">
            Your Cart
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review your fresh produce before checkout.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {!cart || cart.items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-12 text-center">
            <ShoppingCart
              size={48}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-4 text-xl font-black">
              Your cart is empty
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Add some fresh produce from local farmers.
            </p>

            <Link
              href="/consumer"
              className="mt-6 inline-flex rounded-xl bg-[#1F7A4D] px-5 py-3 text-sm font-bold text-white"
            >
              Shop now
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_350px]">
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5"
                >
                  <div className="flex gap-4">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#F2F5EC] text-4xl">
                      {getEmoji(
                        item.product.name,
                        item.product.category
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-3">
                        <div>
                          <h2 className="font-black">
                            {item.product.name}
                          </h2>

                          <p className="mt-1 text-xs text-gray-500">
                            From {item.product.farmer.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            ₹
                            {Number(
                              item.product.pricePerKg
                            )}{" "}
                            / kg
                          </p>
                        </div>

                        <p className="font-black text-[#1F7A4D]">
                          ₹
                          {(
                            Number(
                              item.product.pricePerKg
                            ) *
                            Number(item.quantity)
                          ).toFixed(0)}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center rounded-xl border border-gray-200">
                          <button
                            type="button"
                            disabled={
                              updating === item.id
                            }
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Number(item.quantity) - 1
                              )
                            }
                            className="p-2 text-gray-500 hover:text-[#1F7A4D] disabled:opacity-50"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="min-w-12 text-center text-sm font-black">
                            {Number(item.quantity)} kg
                          </span>

                          <button
                            type="button"
                            disabled={
                              updating === item.id
                            }
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Number(item.quantity) + 1
                              )
                            }
                            className="p-2 text-gray-500 hover:text-[#1F7A4D] disabled:opacity-50"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          type="button"
                          disabled={
                            updating === item.id
                          }
                          onClick={() =>
                            removeItem(item.id)
                          }
                          className="flex items-center gap-1 text-xs font-bold text-red-500 disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-black">
                Order Summary
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-bold">
                    ₹{subtotal.toFixed(0)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Delivery
                  </span>

                  <span className="font-bold">
                    ₹{deliveryFee}
                  </span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-black">
                      Total
                    </span>

                    <span className="text-lg font-black text-[#1F7A4D]">
                      ₹{total.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#1F7A4D] py-3 text-sm font-black text-white hover:bg-[#17633E]"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}