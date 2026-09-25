"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Leaf,
  ShoppingBasket,
  Sprout,
  Truck,
  ShieldCheck,
  IndianRupee,
  Users,
} from "lucide-react";


export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState<
    "farmer" | "consumer" | null
  >(null);

  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F8F2] text-[#17221B]">
      <section className="relative px-6 pb-20 md:px-12 md:pt-16 lg:px-20">

        <img
          className="mx-auto -mt-24 h-72"
          src="/fasal.png"
          alt=""
        />

        <div className="relative mx-auto ">
          {/* Status Badge */}
          <div className="mb-7 flex justify-center">
            <div className="flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-xs font-semibold text-[#1F7A4D] shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <p>Connecting farmers directly with families</p>
            </div>
          </div>

          {/* Hero Content */}
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-5xl font-black leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              From the {" "}
              <span className="text-[#1F7A4D]">farm</span>
              <br />
              directly to your{" "}
              <span className="relative inline-block">
                 family.

                <svg
                  className="absolute -bottom-3 left-0 w-full"
                  viewBox="0 0 300 20"
                  fill="none"
                >
                  <path
                    d="M4 14C80 3 180 3 296 12"
                    stroke="#E6A92E"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              A fair marketplace that connects farmers directly with
              consumers - reducing unnecessary middlemen, improving farmer
              income, and giving families fresher produce at fair prices.
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-5xl">
            <p className="mb-5 text-center text-sm font-bold uppercase tracking-[0.18em] text-gray-500">
              How will you use FasalSetu?
            </p>

            <div className="grid gap-5 md:grid-cols-2">

              <button
                onClick={() => setSelectedRole("farmer")}
                className={`group relative overflow-hidden rounded-[28px] border p-7 text-left transition-all duration-300 md:p-9 ${selectedRole === "farmer"
                    ? "border-[#1F7A4D] bg-[#EAF6EE] "
                    : "border-gray-200 bg-white hover:-translate-y-1 hover:border-green-300 hover:shadow-xl"
                  }`}
              >
                
                

                <div className="relative">
                  
                  <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1F7A4D] text-white shadow-lg shadow-green-900/20">
                    <Sprout size={28} />
                  </div>

                  {/* Title */}
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-2xl font-black">
                      I’m a Farmer
                    </h3>

                    {selectedRole === "farmer" && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F7A4D] text-white">
                        ✓
                      </div>
                    )}
                  </div>

                  
                  <p className="max-w-sm text-sm leading-6 text-gray-600">
                    Sell your produce directly to customers and earn more from
                    every harvest.
                  </p>

                  
                  <div className="mt-7 flex flex-wrap gap-2">
                    <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-[#1F7A4D]">
                      Better prices
                    </span>

                    <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-[#1F7A4D]">
                      Direct customers
                    </span>
                  </div>

                  {/* CTA */}
                  <div className="mt-8 flex items-center gap-2 text-sm font-bold text-[#1F7A4D]">
                    Continue as Farmer

                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedRole("consumer")}
                className={`group relative overflow-hidden rounded-[28px] border p-7 text-left transition-all duration-300 md:p-9 ${selectedRole === "consumer"
                    ? "border-[#E6A92E] bg-[#FFF8E7] shadow-xl shadow-yellow-900/10"
                    : "border-gray-200 bg-white hover:-translate-y-1 hover:border-yellow-300 hover:shadow-xl"
                  }`}
              >
                

                <div className="relative">

                  <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6A92E] text-white shadow-lg shadow-yellow-900/20">
                    <ShoppingBasket size={28} />
                  </div>


                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-2xl font-black">
                      I’m a Consumer
                    </h3>

                    {selectedRole === "consumer" && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E6A92E] text-white">
                        ✓
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="max-w-sm text-sm leading-6 text-gray-600">
                    Buy fresh produce directly from local farmers at
                    transparent and fair prices.
                  </p>

                  {/* Tags */}
                  <div className="mt-7 flex flex-wrap gap-2">
                    <span className="rounded-full bg-yellow-50 px-3 py-1.5 text-xs font-semibold text-yellow-700">
                      Farm fresh
                    </span>

                    <span className="rounded-full bg-yellow-50 px-3 py-1.5 text-xs font-semibold text-yellow-700">
                      Fair prices
                    </span>
                  </div>

                  <div className="mt-8 flex items-center gap-2 text-sm font-bold text-yellow-700">
                    <p>Continue as Consumer</p>

                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </button>
            </div>


            <div className="mt-6 flex justify-center">
              {selectedRole && (
                <Link
                  href={
                    selectedRole === "farmer"
                      ? "/farmer"
                      : "/consumer"
                  }
                  className="flex w-full max-w-md items-center justify-center gap-3 rounded-2xl bg-[#17221B] px-6 py-4 text-sm font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-[#25362B]"
                >
                  Continue as{" "}
                  {selectedRole === "farmer" ? "Farmer" : "Consumer"}

                  <ArrowRight size={18} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>


      <section
        id="how-it-works"
        className="border-y border-gray-200 bg-white px-6 py-20 md:px-12 lg:px-20"
      >
        <div className="mx-auto max-w-7xl">
          
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1F7A4D]">
              AI Powered : Simple & transparent
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              A shorter journey from farm to table.
            </h2>

            <p className="mt-4 text-gray-600">
              We reduce unnecessary layers between the people who grow food
              and the people who eat it.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Sprout size={24} />}
              title="Farmer lists produce"
              description="Farmers list their available produce, quantity and expected price."
            />

            <FeatureCard
              icon={<Users size={24} />}
              title="Consumer buys directly"
              description="Customers discover fresh produce from farmers near them."
            />

            <FeatureCard
              icon={<Truck size={24} />}
              title="Produce gets delivered"
              description="Local logistics moves the produce from farm to family."
            />
          </div>
        </div>
      </section>


      <section
        id="impact"
        className="bg-[#17221B] px-6 py-20 text-white md:px-12 lg:px-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            {/* Impact Text */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-300">
                Why FasalSetu?
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
                Better for farmers.
                <br />
                Fairer for families.
              </h2>

              <p className="mt-6 max-w-lg leading-7 text-gray-300">
                Traditional supply chains can involve multiple intermediaries.
                FasalSetu brings farmers and consumers closer together while
                making the flow of money transparent.
              </p>
            </div>

            {/* Impact Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <ImpactCard
                icon={<IndianRupee size={22} />}
                value="More"
                title="Farmer earnings"
                description="A greater share of the consumer's payment can reach the farmer."
              />

              <ImpactCard
                icon={<ShieldCheck size={22} />}
                value="Fair"
                title="Price transparency"
                description="Consumers can understand where their money goes."
              />

              <ImpactCard
                icon={<Leaf size={22} />}
                value="Fresh"
                title="Farm produce"
                description="Shorter supply chains can mean fresher produce."
              />

              <ImpactCard
                icon={<Users size={22} />}
                value="Direct"
                title="Farmer connection"
                description="Consumers can know who grows their food."
              />
            </div>
          </div>
        </div>
      </section>

      
    </main>
  );
}



function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-3xl border border-gray-200 bg-[#FAFBF7] p-7 transition hover:-translate-y-1 hover:border-green-200 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF6EE] text-[#1F7A4D]">
          {icon}
        </div>

        
      </div>

      <h3 className="mt-6 text-xl font-black">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-gray-600">
        {description}
      </p>
    </div>
  );
}

function ImpactCard({
  icon,
  value,
  title,
  description,
}: {
  icon: React.ReactNode;
  value: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 transition hover:bg-white/[0.08]">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-green-300">
        {icon}
      </div>

      <p className="mt-6 text-2xl font-black">
        {value}
      </p>

      <h3 className="mt-1 font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-5 text-gray-400">
        {description}
      </p>
    </div>
  );
}