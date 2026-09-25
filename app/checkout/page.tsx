"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  id: number;
  quantity: number;

  product: {
    id: number;
    name: string;
    category: string;
    quality: string | null;
    pricePerKg: string | number;
  };
};

type Cart = {
  id: number;
  items: CartItem[];
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

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<Cart | null>(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCart() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/cart", {
          cache: "no-store",
        });

        const data = await response.json();

        if (response.status === 401) {
          router.push("/consumer/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load cart"
          );
        }

        if (!data || !data.items?.length) {
          router.push("/cart");
          return;
        }

        setCart(data);
      } catch (error) {
        console.error("LOAD_CHECKOUT_CART_ERROR:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load cart"
        );
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, [router]);

  const subtotal =
    cart?.items.reduce(
      (sum, item) =>
        sum +
        Number(item.product.pricePerKg) *
          Number(item.quantity),
      0
    ) ?? 0;

  const deliveryFee = subtotal > 0 ? 20 : 0;

  const total = subtotal + deliveryFee;

  async function placeOrder() {
    if (!address.trim()) {
      setError("Please enter your delivery address.");
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: address.trim(),
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        router.push("/consumer/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to place order"
        );
      }

      if (!data.order?.id) {
        throw new Error(
          "Order was created but order ID was not returned."
        );
      }

      router.push(`/orders/${data.order.id}`);
    } catch (error) {
      console.error("PLACE_ORDER_ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while placing the order."
      );
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F8F3] p-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-gray-500">
            Loading checkout...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F8F3]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#1F7A4D]"
        >
          <ArrowLeft size={16} />
          Back to cart
        </Link>

        <h1 className="mt-6 text-3xl font-black">
          Checkout
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Enter your delivery details and place your order.
        </p>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_350px]">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-black">
              Delivery Address
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Where should we deliver your fresh produce?
            </p>

            <textarea
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              placeholder="Enter your full delivery address..."
              rows={5}
              className="mt-4 w-full resize-none rounded-xl border border-gray-200 p-4 text-sm outline-none transition focus:border-[#1F7A4D] focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div className="h-fit rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-black">
              Order Summary
            </h2>

            <div className="mt-4 space-y-4">
              {cart?.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 text-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F2F5EC] text-xl">
                    {getEmoji(
                      item.product.name,
                      item.product.category
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2">
                      <span className="font-bold">
                        {item.product.name}
                      </span>

                      <span className="font-bold">
                        ₹
                        {(
                          Number(
                            item.product.pricePerKg
                          ) *
                          Number(item.quantity)
                        ).toFixed(0)}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                      {Number(item.quantity)} kg × ₹
                      {Number(
                        item.product.pricePerKg
                      )}
                      /kg
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 border-t pt-4 text-sm">
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

              <div className="flex justify-between border-t pt-3">
                <span className="font-black">
                  Total
                </span>

                <span className="text-lg font-black text-[#1F7A4D]">
                  ₹{total.toFixed(0)}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={placingOrder}
              onClick={placeOrder}
              className="mt-6 w-full rounded-xl bg-[#1F7A4D] py-3 text-sm font-black text-white transition hover:bg-[#17633E] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {placingOrder
                ? "Placing order..."
                : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}