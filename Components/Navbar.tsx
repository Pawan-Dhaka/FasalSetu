import React from 'react'
import Link from 'next/link'
import {Leaf} from "lucide-react";

export const Navbar = () => {
  return (
    <>
    <div className="bg-[#F7F8F2] text-[#17221B] ">
    <nav className="relative z-20 flex items-center justify-between px-6 py-2 md:px-12 lg:px-20">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F7A4D] text-white shadow-lg shadow-green-900/10">
            <Leaf size={22} />
          </div>

          <div>
            <img className="h-14 " src="/fasal1.png" alt="" />
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
        {/* <a
        href="#how-it-works"
        className="text-sm font-medium text-gray-600 transition hover:text-[#1F7A4D]"
        >
        How it works
        </a>

        <a
        href="#impact"
        className="text-sm font-medium text-gray-600 transition hover:text-[#1F7A4D]"
        >
        Our Impact
        </a> */}

          <button className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:border-[#1F7A4D]">
            Sign In
          </button>
        </div>
      </nav>
    </div>
    </>
    
  )
}
