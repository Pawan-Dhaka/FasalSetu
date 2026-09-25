"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  ChevronRight,
  IndianRupee,
  MapPin,
  Package,
  Plus,
  ShoppingBag,
  Sprout,
  TrendingUp,
  Truck,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  pricePerKg: number | string;
  quantity: number | string;
};

type OrderItem = {
  id: number;
  quantity: number | string;
  order: {
    id: number;
    status: string;
    createdAt: string;
    user: {
      id: number;
      name: string;
      mobile: string;
    };
  };
  product: {
    id: number;
    name: string;
    pricePerKg: number | string;
  };
};

type Farmer = {
  name: string;
  city: string | null;
  state: string | null;
};

export default function FarmerDashboard() {
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const [profileRes, productsRes, ordersRes] =
        await Promise.all([
          fetch("/api/farmer/profile"),
          fetch("/api/farmer/products"),
          fetch("/api/farmer/orders"),
        ]);

      const profileData = await profileRes.json();
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();

      if (profileRes.ok) {
        setFarmer({
          name: profileData.farmer.name,
          city: profileData.farmer.city,
          state: profileData.farmer.state,
        });
      }

      if (productsRes.ok) {
        setProducts(productsData.products);
      }

      if (ordersRes.ok) {
        setOrderItems(ordersData.orderItems);
      }
    } catch (error) {
      console.error("DASHBOARD_ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  const totalEarnings = useMemo(() => {
    return orderItems.reduce((total, item) => {
      const quantity = Number(item.quantity);
      const price = Number(item.product.pricePerKg);

      return total + quantity * price;
    }, 0);
  }, [orderItems]);

  const activeOrders = useMemo(() => {
    const activeStatuses = [
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
    ];

    return orderItems.filter((item) =>
      activeStatuses.includes(item.order.status)
    ).length;
  }, [orderItems]);

  const completedOrders = useMemo(() => {
    return orderItems.filter(
      (item) => item.order.status === "DELIVERED"
    ).length;
  }, [orderItems]);

  const lowStockProducts = useMemo(() => {
    return products.filter((product) => {
      return Number(product.quantity) < 20;
    }).length;
  }, [products]);

  const location =
    farmer?.city && farmer?.state
      ? `${farmer.city}, ${farmer.state}`
      : farmer?.city || farmer?.state || "Location not added";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F6F8F3] text-[#17221B]">
        <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
          <div className="rounded-[26px] bg-white p-8 shadow-sm">
            Loading dashboard...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F8F3] text-[#17221B]">
      <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">

        <section className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <Link
              href="/farmer/profile"
              className="mb-2 flex w-fit items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#1F7A4D]"
            >
              <MapPin size={15} />
              {location}
            </Link>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Good morning, {farmer?.name || "Farmer"} 👋
            </h2>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Here&apos;s how your farm is performing today.
            </p>
          </div>

          <Link
            href="/farmer/add-product"
            className="flex w-fit items-center gap-2 rounded-xl bg-[#1F7A4D] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-900/15 transition hover:-translate-y-0.5 hover:bg-[#17633E]"
          >
            <Plus size={18} />
            Add Produce
          </Link>
        </section>

        <section className="relative mb-7 overflow-hidden rounded-[28px] bg-[#173D2A] p-6 text-white shadow-xl shadow-green-950/10 sm:p-8">
          <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-green-300/10 blur-2xl" />
          <div className="absolute -bottom-40 right-40 h-72 w-72 rounded-full bg-yellow-300/5 blur-3xl" />

          <div className="relative grid gap-7 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-green-200">
                <TrendingUp size={14} />
                Direct selling impact
              </div>

              <h3 className="max-w-xl text-2xl font-black leading-tight sm:text-3xl">
                You&apos;re keeping more of what you earn.
              </h3>

              <a
                href="#recent-od"
                className="mt-5 flex items-center gap-2 text-sm font-bold text-white transition hover:text-green-200"
              >
                View earnings report
                <ArrowUpRight size={16} />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div />

              <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-5">
                <p className="text-xs text-green-100/60">
                  Total sales
                </p>

                <p className="mt-2 flex text-2xl font-black">
                  ₹{totalEarnings.toLocaleString("en-IN")}
                  <span className="flex items-center text-green-300">
                    <ArrowUpRight size={30} />
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<Wallet size={21} />}
            label="Total earnings"
            value={`₹${totalEarnings.toLocaleString("en-IN")}`}
            change=""
            description="From current orders"
            type="green"
          />

          <StatCard
            icon={<ShoppingBag size={21} />}
            label="Active orders"
            value={String(activeOrders)}
            change=""
            description="Pending to shipped"
            type="yellow"
          />

          <StatCard
            icon={<Package size={21} />}
            label="Produce listed"
            value={String(products.length)}
            change={String(lowStockProducts)}
            description="low stock items"
            type="blue"
          />

          <StatCard
            icon={<Truck size={21} />}
            label="Completed orders"
            value={String(completedOrders)}
            change=""
            description="Delivered orders"
            type="purple"
          />
        </section>

        <div className="grid gap-7 xl:grid-cols-[1.45fr_1fr]">

          <section className="rounded-[26px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black">
                  Your produce
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Products currently available to consumers
                </p>
              </div>

              <Link
                href="/farmer/products"
                className="text-xs font-bold text-[#1F7A4D] hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {products.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
                  <Package
                    size={30}
                    className="mx-auto text-gray-300"
                  />

                  <p className="mt-3 text-sm font-bold text-gray-500">
                    No products listed yet
                  </p>

                  <Link
                    href="/farmer/add-product"
                    className="mt-3 inline-block text-xs font-bold text-[#1F7A4D]"
                  >
                    Add your first product
                  </Link>
                </div>
              ) : (
                products.map((product) => {
                  const quantity = Number(product.quantity);

                  const percentage =
                    quantity > 0
                      ? Math.min(
                          Math.round((quantity / 100) * 100),
                          100
                        )
                      : 0;

                  return (
                    <div
                      key={product.id}
                      className="group rounded-2xl border border-gray-100 bg-[#FAFBF8] p-4 transition hover:border-green-100 hover:bg-[#F7FAF7]"
                    >
                      <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                          🌱
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                            <div>
                              <h4 className="text-sm font-black">
                                {product.name}
                              </h4>

                              <p className="mt-0.5 text-[11px] text-gray-500">
                                {product.category}
                              </p>
                            </div>

                            <p className="text-base font-black text-[#1F7A4D]">
                              ₹{Number(product.pricePerKg)}
                              <span className="text-[10px] font-medium text-gray-400">
                                /kg
                              </span>
                            </p>
                          </div>

                          <div className="mt-3">
                            <div className="mb-1.5 flex justify-between text-[10px] font-medium">
                              <span className="text-gray-500">
                                {quantity} kg available
                              </span>

                              <span
                                className={
                                  quantity < 20
                                    ? "font-bold text-orange-600"
                                    : "text-gray-500"
                                }
                              >
                                {quantity < 20
                                  ? "Low stock"
                                  : "In stock"}
                              </span>
                            </div>

                            <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                              <div
                                className={`h-full rounded-full ${
                                  quantity < 20
                                    ? "bg-orange-400"
                                    : "bg-[#1F7A4D]"
                                }`}
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <Link
                          href={`/farmer/products`}
                          aria-label={`View ${product.name}`}
                          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-400 transition hover:border-green-200 hover:text-[#1F7A4D] sm:flex"
                        >
                          <ChevronRight size={17} />
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <Link
              href="/farmer/add-product"
              className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 py-3 text-xs font-bold text-gray-500 transition hover:border-green-300 hover:bg-green-50 hover:text-[#1F7A4D]"
            >
              <Plus size={16} />
              Add another product
            </Link>
          </section>

          <section className="rounded-[26px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black">
                    Market prices
                  </h3>

                  <span className="rounded-full bg-gray-100 px-2 py-1 text-[9px] font-bold text-gray-500">
                    DEMO
                  </span>
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Market comparison
                </p>
              </div>

              <TrendingUp
                size={20}
                className="text-[#1F7A4D]"
              />
            </div>

            <div className="space-y-2">
              <MarketRow
                emoji="🍅"
                name="Tomato"
                market="₹30/kg"
                yourPrice="₹32/kg"
                trend="+5.2%"
                positive
              />

              <MarketRow
                emoji="🥔"
                name="Potato"
                market="₹24/kg"
                yourPrice="₹25/kg"
                trend="+2.8%"
                positive
              />

              <MarketRow
                emoji="🧅"
                name="Onion"
                market="₹29/kg"
                yourPrice="₹28/kg"
                trend="-3.1%"
                positive={false}
              />

              <MarketRow
                emoji="🥕"
                name="Carrot"
                market="₹38/kg"
                yourPrice="₹40/kg"
                trend="+7.4%"
                positive
              />
            </div>

            <div className="mt-5 rounded-2xl bg-[#F4F8F2] p-4">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#DCEEDF] text-[#1F7A4D]">
                  <Sprout size={17} />
                </div>

                <div>
                  <p className="text-xs font-black">
                    Pricing suggestion
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-gray-500">
                    Connect a real market-price source here
                    before showing this as live data.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section
          className="mt-7 rounded-[26px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
          id="recent-od"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black">
                Recent orders
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Orders from consumers
              </p>
            </div>

            <Link
              href="/farmer/orders"
              className="flex items-center gap-1 text-xs font-bold text-[#1F7A4D]"
            >
              View all
              <ChevronRight size={14} />
            </Link>
          </div>

          {orderItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
              <ShoppingBag
                size={30}
                className="mx-auto text-gray-300"
              />

              <p className="mt-3 text-sm font-bold text-gray-500">
                No orders yet
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400">
                      <th className="pb-3 font-bold">Order</th>
                      <th className="pb-3 font-bold">Customer</th>
                      <th className="pb-3 font-bold">Items</th>
                      <th className="pb-3 font-bold">Amount</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold">Time</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orderItems.slice(0, 10).map((item) => {
                      const amount =
                        Number(item.quantity) *
                        Number(item.product.pricePerKg);

                      return (
                        <tr
                          key={item.id}
                          className="border-b border-gray-50 last:border-0"
                        >
                          <td className="py-4 text-xs font-black">
                            #{item.order.id}
                          </td>

                          <td className="py-4 text-xs font-semibold">
                            {item.order.user.name}
                          </td>

                          <td className="max-w-[240px] py-4 text-xs text-gray-500">
                            {Number(item.quantity)} kg{" "}
                            {item.product.name}
                          </td>

                          <td className="py-4 text-sm font-black">
                            ₹{amount.toLocaleString("en-IN")}
                          </td>

                          <td className="py-4">
                            <OrderStatus
                              status={item.order.status}
                            />
                          </td>

                          <td className="py-4 text-[11px] text-gray-400">
                            {formatDate(item.order.createdAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 md:hidden">
                {orderItems.slice(0, 10).map((item) => {
                  const amount =
                    Number(item.quantity) *
                    Number(item.product.pricePerKg);

                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-gray-100 bg-[#FAFBF8] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-black">
                          #{item.order.id}
                        </p>

                        <p className="text-sm font-black">
                          ₹{amount.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <p className="mt-2 text-xs font-semibold">
                        {item.order.user.name}
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-gray-500">
                        {Number(item.quantity)} kg{" "}
                        {item.product.name}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <OrderStatus
                          status={item.order.status}
                        />

                        <span className="text-[10px] text-gray-400">
                          {formatDate(item.order.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>

        <section className="mt-7">
          <h3 className="mb-4 text-sm font-black">
            Quick actions
          </h3>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <QuickAction
              href="/farmer/add-product"
              icon={<Plus size={20} />}
              title="List new produce"
              description="Add products for consumers"
            />

            <QuickAction
              href="/farmer/orders"
              icon={<Package size={20} />}
              title="Manage orders"
              description="View and update orders"
            />

            <QuickAction
              href="#recent-od"
              icon={<IndianRupee size={20} />}
              title="View earnings"
              description="Track your farm income"
            />

            <QuickAction
              href="/farmer/profile"
              icon={<Sprout size={20} />}
              title="Farm profile"
              description="Update your farm details"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  change,
  description,
  type,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  change: string;
  description: string;
  type: "green" | "yellow" | "blue" | "purple";
}) {
  const styles = {
    green: "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <div className="rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles[type]}`}
        >
          {icon}
        </div>

        {change && (
          <span className="text-[10px] font-bold text-green-600">
            {change}
          </span>
        )}
      </div>

      <p className="mt-5 text-xs font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black tracking-tight">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-gray-400">
        {description}
      </p>
    </div>
  );
}

function MarketRow({
  emoji,
  name,
  market,
  yourPrice,
  trend,
  positive,
}: {
  emoji: string;
  name: string;
  market: string;
  yourPrice: string;
  trend: string;
  positive: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl p-3 transition hover:bg-gray-50">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-xl">
        {emoji}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-black">
          {name}
        </p>

        <p className="mt-0.5 text-[10px] text-gray-400">
          Market: {market}
        </p>
      </div>

      <div className="text-right">
        <p className="text-xs font-black">
          {yourPrice}
        </p>

        <p
          className={`mt-0.5 text-[9px] font-bold ${
            positive
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {trend}
        </p>
      </div>
    </div>
  );
}

function OrderStatus({
  status,
}: {
  status: string;
}) {
  const styles: Record<string, string> = {
    PENDING: "bg-blue-50 text-blue-700",
    CONFIRMED: "bg-blue-50 text-blue-700",
    PROCESSING: "bg-yellow-50 text-yellow-700",
    SHIPPED: "bg-orange-50 text-orange-700",
    DELIVERED: "bg-green-50 text-green-700",
    CANCELLED: "bg-red-50 text-red-700",
  };

  const labels: Record<string, string> = {
    PENDING: "Order placed",
    CONFIRMED: "Confirmed",
    PROCESSING: "Processing",
    SHIPPED: "Ready / Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold ${
        styles[status] || "bg-gray-50 text-gray-600"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status] || status}
    </span>
  );
}

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF6EE] text-[#1F7A4D] transition group-hover:bg-[#1F7A4D] group-hover:text-white">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-black">
          {title}
        </p>

        <p className="mt-1 text-[10px] text-gray-500">
          {description}
        </p>
      </div>

      <ChevronRight
        size={16}
        className="text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-[#1F7A4D]"
      />
    </Link>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}