"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";

// Mock Data: प्रत्येक बैंकको नाम र आफ्नो छुट्टै unique slug/URL थपियो
const PARTNER_BANKS = [
  { id: 1, name: "Nepal Finance Limited", slug: "nepal-finance" },
  { id: 2, name: "MITERI Development Bank", slug: "miteri-bank" },
  { id: 3, name: "Progressive Finance Limited", slug: "progressive-finance" },
  { id: 4, name: "Reliance Finance Limited", slug: "reliance-finance" },
  { id: 5, name: "Central Finance Limited", slug: "central-finance" },
  { id: 6, name: "Samriddhi Finance Company", slug: "samriddhi-finance" },
  { id: 7, name: "Siddhartha Bank", slug: "siddhartha-bank" },
  { id: 8, name: "Laxmi Sunrise Bank", slug: "laxmi-sunrise" },
];

export default function PartnerBanks() {
  // Infinite scroll लुपका लागि ३ गुणा डेटा
  const tripleBanks = [...PARTNER_BANKS, ...PARTNER_BANKS, ...PARTNER_BANKS];
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [draggedDistance, setDraggedDistance] = useState(0); // ड्रग गर्दा क्लिक रोक्नका लागि

  // Drag handles
  const startDragging = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setDraggedDistance(0);
    const pageX = "touches" in e ? e.touches[0].pageX : e.pageX;
    if (scrollContainerRef.current) {
      setStartX(pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeft(scrollContainerRef.current.scrollLeft);
    }
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const dragging = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const pageX = "touches" in e ? e.touches[0].pageX : e.pageX;
    const x = pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    
    // कति टाढा घिसारियो ट्र्याक गर्ने
    setDraggedDistance(Math.abs(walk));
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (draggedDistance > 5) {
      e.preventDefault();
    }
  };

  return (
    <div className="w-full bg-white py-8 px-18  shadow-md border border-gray-100 overflow-hidden mt-6 select-none">
      
      {/* Title Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-700 tracking-wide">
          Partner Banks
        </h3>
      </div>

      {/* Pure CSS Dynamic Marquee Logic */}
      <style jsx global>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .marquee-track-active {
          animation: marqueeScroll 30s linear infinite;
        }
        .marquee-track-paused {
          animation-play-state: paused;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Main Slider Window */}
      <div 
        ref={scrollContainerRef}
        onMouseDown={startDragging}
        onMouseUp={stopDragging}
        onMouseLeave={() => { stopDragging(); setIsHovered(false); }}
        onMouseMove={dragging}
        onTouchStart={startDragging}
        onTouchEnd={stopDragging}
        onTouchMove={dragging}
        onMouseEnter={() => setIsHovered(true)}
        className="relative w-full overflow-x-auto no-scrollbar flex cursor-grab active:cursor-grabbing"
      >
        
        {/* Rolling Track */}
        <div 
          className={`flex gap-4 shrink-0 px-4 items-center ${
            isHovered || isDragging ? "marquee-track-paused" : "marquee-track-active"
          }`}
        >
          {tripleBanks.map((bank, index) => (
            <Link
              key={`${bank.slug}-${index}`}
              href={`/banks/${bank.slug}`} 
              onClick={handleLinkClick}
              className="w-44 h-26 bg-white border border-gray-200/80 rounded-xl flex flex-col items-center justify-center p-4 shadow-sm hover:border-[#60b246] hover:shadow-md transition-all duration-200 text-center shrink-0 block"
            >
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-bold text-xs text-gray-400 mb-1 border border-gray-100">
                🏦
              </div>
              <span className="text-xs font-bold text-gray-600 line-clamp-2">
                {bank.name}
              </span>
            </Link>
          ))}
        </div>
        
      </div>
    </div>
  );
}