"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react"; 

export default function HeroBanner() {
  const [showSupport, setShowSupport] = useState(false);

  return (
    <div className="relative w-full">
      {/* Dynamic Banner Section */}
      <div className="relative w-full rounded-lg overflow-hidden shadow-sm group z-10">
        <Link href="#" className="block w-full">
          <div className="relative w-full aspect-[18/6.7] min-h-[180px]">
            <Image
              src="/hero.webp"
              alt="Hero Banner"
              fill
              className="object-cover"
              priority
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
          </div>
        </Link>
      </div>

      {/* ==========================================
          ESEWA FLOATING STICKY SUPPORT COMPONENT
         ========================================== */}
      <div 
        onMouseEnter={() => setShowSupport(true)}
        onMouseLeave={() => setShowSupport(false)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-end"
      >
        
        {/* Support Card Popup Wrapper (Handles the sliding action) */}
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out flex items-center ${
            showSupport ? "w-[288px] opacity-100 pr-1" : "w-0 opacity-0"
          }`}
        >
          {/* Main Card */}
          <div className="bg-white rounded-l-xl shadow-lg p-3 w-72 relative">
            
            {/* Right side arrow pointer matching eSewa UI */}
            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-t border-r border-gray-100" />

            {/* Toll Free Content */}
            <div className="text-center select-none">
              <h4 className="text-[#F67F02] font-bold text-sm tracking-wide border-b border-gray-100 pb-2 mb-3">
                Toll Free Number
              </h4>
              <div className="space-y-1 my-3 text-sm font-semibold text-gray-700">
                <p className="flex justify-between px-2 whitespace-nowrap">
                  <span className="text-gray-400">NTC:</span>
                  <a href="tel:16600102121" className="hover:text-[#F67F02] transition">1660-01-02121</a>
                </p>
                <p className="flex justify-between px-2 whitespace-nowrap">
                  <span className="text-gray-400">Ncell:</span>
                  <a href="tel:18102102121" className="hover:text-[#F67F02] transition">1810-21-02121</a>
                </p>
              </div>

              {/* Hotline Content */}
              <h4 className="text-[#F67F02] font-bold text-sm tracking-wide border-b border-gray-100 pb-2 mt-3 mb-1">
                Hotline Number
              </h4>
              <div className="text-center py-1 whitespace-nowrap">
                <a href="tel:015970121" className="text-base font-bold text-gray-800 hover:text-[#F67F02] transition tracking-wide">
                  01-5970121
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Green Sticky Trigger Button */}
        <div
          className="bg-[#F67F02] text-white p-2.5 rounded-l-md shadow-md flex items-center justify-center z-10 cursor-pointer"
        >
          <Phone className={`w-5 h-5 fill-current transition-transform duration-300 ${showSupport ? "scale-110" : ""}`} />
        </div>
      </div>

    </div>
  );
}