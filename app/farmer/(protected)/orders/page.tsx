"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";

type OrderItem = {
  id: number;
  quantity: number | string;
  product: {
    name: string;
    pricePerKg: number | string;
  };
  order: {
    id: number;
    status: string;
    createdAt: string;
    user: {
      name: string;
      mobile: string;
    };
  };
};

export default function FarmerOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const res = await fetch("/api/farmer/orders");
      const data = await res.json();

      if (res.ok) {
        setOrders(data.orderItems);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F6F8F3] text-[#17221B]">
      <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8">

        <Link
          href="/farmer"
          className="mb-5 flex w-fit items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#1F7A4D]"
        >
          <ArrowLeft size={15} />
          Dashboard
        </Link>

        <div className="mb-7">
          <h1 className="text-3xl font-black">
            Farmer Orders
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Orders containing your produce.
          </p>
        </div>

        {loading ? (
          <div className="rounded-[26px] bg-white p-8 shadow-sm">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-gray-300 bg-white p-12 text-center">
            <Package
              size={40}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-4 text-lg font-black">
              No orders yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Orders containing your products will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((item) => {
              const quantity = Number(item.quantity);
              const price = Number(item.product.pricePerKg);
              const amount = quantity * price;

              return (
                <div
                  key={item.id}
                  className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-xs font-bold text-gray-400">
                        ORDER #{item.order.id}
                      </p>

                      <h2 className="mt-1 text-lg font-black">
                        {item.product.name}
                      </h2>

                      <p className="mt-1 text-xs text-gray-500">
                        {quantity} kg × ₹{price}/kg
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xl font-black">
                        ₹{amount.toLocaleString("en-IN")}
                      </p>

                      <span className="mt-2 inline-flex rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold text-green-700">
                        {item.order.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <p className="text-xs font-bold">
                      Customer: {item.order.user.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Mobile: {item.order.user.mobile}
                    </p>

                    <p className="mt-1 text-[10px] text-gray-400">
                      {new Date(
                        item.order.createdAt
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}