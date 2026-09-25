"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Order = {
  id: string;
  status: string;
  total: string | number;
  createdAt: string;

  items: {
    id: string;
    quantity: number;
    price: string | number;

    product: {
      name: string;
      emoji?: string | null;
    };
  }[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch("/api/orders");

        if (!response.ok) {
          throw new Error("Failed to load orders");
        }

        const data = await response.json();

        setOrders(data.orders);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F8F3] p-6">
        Loading orders...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F8F3]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
        <h1 className="text-3xl font-black">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white p-10 text-center">
            <p className="font-bold">
              No orders yet.
            </p>

            <Link
              href="/consumer"
              className="mt-4 inline-block text-sm font-bold text-[#1F7A4D]"
            >
              Start shopping →
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block rounded-2xl border border-gray-200 bg-white p-5 hover:border-green-200"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-400">
                      Order #{order.id.slice(-8)}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-700">
                    {order.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {item.product.emoji}{" "}
                        {item.product.name} ×{" "}
                        {item.quantity}
                      </span>

                      <span className="font-bold">
                        ₹
                        {(
                          Number(item.price) *
                          item.quantity
                        ).toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="font-bold">
                      Total
                    </span>

                    <span className="font-black text-[#1F7A4D]">
                      ₹{Number(order.total).toFixed(0)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}