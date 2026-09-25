"use client";

import React from "react";
import Link from "next/link";
import { Leaf, LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export const Navbar = () => {
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  return (
    <div className="bg-[#F7F8F2] text-[#17221B]">
      <nav className="relative z-20 flex items-center justify-between px-6 py-2 md:px-12 lg:px-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F7A4D] text-white shadow-lg shadow-green-900/10">
            <Leaf size={22} />
          </div>

          <div>
            <img
              className="h-14"
              src="/fasal1.png"
              alt="FasalSetu"
            />
          </div>
        </Link>

        {/* Right Side */}
        <div className="hidden items-center gap-3 md:flex">
          {status === "loading" ? (
            <div className="h-10 w-24 animate-pulse rounded-full bg-gray-200" />
          ) : session?.user ? (
            <>
              {/* User */}
              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E4F1E9] text-[#1F7A4D]">
                  <User size={16} />
                </div>

                <span className="max-w-[150px] truncate text-sm font-semibold text-[#17221B]">
                  {session.user.name || session.user.email}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            /* Sign In */
            <Link
              href="/farmer/login"
              className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:border-[#1F7A4D] hover:text-[#1F7A4D]"
            >
              Farmer Login
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};