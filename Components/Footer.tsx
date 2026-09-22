import React from 'react'
import { Leaf } from 'lucide-react'

export const Footer = () => {
  return (
    <>
    <div className=""><footer className="bg-[#101712] px-2 py-4 text-gray-400 md:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm sm:flex-row">
          <div className="flex items-center gap-2 font-semibold text-white">
            <Leaf size={17} />
            FasalSetu
          </div>

          <p>
            © {new Date().getFullYear()} FasalSetu. From farm to family.
          </p>
        </div>
      </footer></div>
    </>
  )
}
