"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Order = {
  id: number;
  status: string;
  totalAmount: string | number;
  address?: string | null;
  createdAt: string;

  items: {
    id: number;
    quantity: string | number;
    pricePerKg: string | number;

    product: {
      name: string;
      category: string;
      quality?: string | null;

      farmer: {
        name: string;
      };
    };
  }[];
};

export default function OrderDetailPage() {
  const params = useParams();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const response = await fetch(
          `/api/orders/${params.id}`
        );

        if (!response.ok) {
          setLoading(false);
          return;
        }

        const data = await response.json();

        setOrder(data.order);
      } catch (error) {
        console.error("LOAD_ORDER_ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F8F3] p-6">
        Loading order...
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#F7F8F3] p-6">
        Order not found.
      </main>
    );
  }

  const subtotal = order.items.reduce(
    (sum, item) =>
      sum +
      Number(item.pricePerKg) *
        Number(item.quantity),
    0
  );

  const total = Number(order.totalAmount);

  const deliveryFee = Math.max(
    0,
    total - subtotal
  );

  return (
    <main className="min-h-screen bg-[#F7F8F3]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500"
        >
          <ArrowLeft size={16} />
          My Orders
        </Link>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400">
              Order #{order.id}
            </p>

            <h1 className="mt-1 text-3xl font-black">
              Order Details
            </h1>
          </div>

          <span className="rounded-full bg-green-50 px-4 py-2 text-xs font-black text-[#1F7A4D]">
            {order.status}
          </span>
        </div>

        {/* Items */}
        <div className="mt-8 grid gap-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="font-black">
              Items
            </h2>

            <div className="mt-4 space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F2F5EC] text-2xl">
                      🥬
                    </div>

                    <div>
                      <p className="font-bold">
                        {item.product.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {Number(item.quantity)} kg × ₹
                        {Number(
                          item.pricePerKg
                        ).toFixed(0)}{" "}
                        · {item.product.farmer.name}
                      </p>

                      {item.product.quality && (
                        <p className="mt-1 text-[11px] text-gray-400">
                          Quality:{" "}
                          {item.product.quality}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="font-black">
                    ₹
                    {(
                      Number(item.pricePerKg) *
                      Number(item.quantity)
                    ).toFixed(0)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="font-black">
              Delivery Address
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              {order.address || "No address provided"}
            </p>
          </div>

          {/* Payment Summary */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="font-black">
              Payment Summary
            </h2>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Subtotal
                </span>

                <span>
                  ₹{subtotal.toFixed(0)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Delivery
                </span>

                <span>
                  ₹{deliveryFee.toFixed(0)}
                </span>
              </div>

              <div className="flex justify-between border-t pt-3">
                <span className="font-black">
                  Total
                </span>

                <span className="font-black text-[#1F7A4D]">
                  ₹{total.toFixed(0)}
                </span>
              </div>
            </div>
          </div>

          {/* Success */}
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-green-50 p-4 text-sm font-bold text-[#1F7A4D]">
            <CheckCircle2 size={18} />
            Order placed successfully
          </div>
        </div>
      </div>
    </main>
  );
}