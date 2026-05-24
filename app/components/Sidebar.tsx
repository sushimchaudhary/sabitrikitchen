"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const categories = [
  { name: "Topup & Recharge", slug: "topup-recharge" },
  { name: "Electricity & Water", slug: "electricity-water" },
  { name: "TV Payment", slug: "tv-payment" },
  { name: "Bus Ticket/Tours and Travels", slug: "tours-travels" },
  { name: "Education Payment", slug: "education-payment" },
  { name: "DOFE/Insurance Payment", slug: "insurance-payment" },
  { name: "Financial Services", slug: "financial-services" },
  { name: "Movies & Entertainment", slug: "movies-entertainment" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 bg-white shadow-sm rounded-md overflow-hidden self-start">
      {categories.map((cat) => {
        const categoryPath = `/category/${cat.slug}`;
        const isActive = pathname === categoryPath;

        return (
          <Link
            key={cat.slug}
            href={categoryPath}
            className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left border-b border-gray-100 hover:bg-orange-50 hover:text-[#f67f02] transition-colors group ${
              isActive
                ? "bg-orange-50 text-[#f67f02] font-semibold border-l-4 border-l-[#f67f02]"
                : "text-gray-700"
            }`}
          >
            <span>{cat.name}</span>
            
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-200 ease-in-out ${
                isActive 
                  ? "translate-x-1 text-[#f67f02]" 
                  : "text-gray-400 group-hover:text-[#f67f02] group-hover:translate-x-1"
              }`}
            />
          </Link>
        );
      })}
    </aside>
  );
}