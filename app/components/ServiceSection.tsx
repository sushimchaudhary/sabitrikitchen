import React from "react";

interface ServiceItem {
  name: string;
  badge?: string;
  badgeColor?: string;
  logo?: React.ReactNode;
}

interface ServiceSectionProps {
  title: string;
  items: ServiceItem[];
}

function ServiceCard({ item }: { item: ServiceItem }) {
  const badgeColors: Record<string, string> = {
    "Request QR": "bg-[#f67f02] text-white",
    "eSpeaker Request": "bg-[#f67f02] text-white",
    "IELTS": "bg-[#f67f02] text-white",
    "Up to 50% Cashback": "bg-[#f67f02] text-white",
    "Meroshare": "bg-[#f67f02] text-white",
    "10% Discount": "bg-[#f67f02] text-white",
    "10% Cashback": "bg-[#f67f02] text-white",
    "3% Discount": "bg-[#f67f02] text-white",
    "Voting": "bg-[#f67f02] text-white",
    "Food Delivery": "bg-orange-400 text-white",
    "Electronic": "bg-blue-500 text-white",
    "Web Hosting": "bg-purple-500 text-white",
    "eCommerce": "bg-teal-500 text-white",
    "Dairy Products": "bg-yellow-600 text-white",
  };

  const badgeClass = item.badge ? (badgeColors[item.badge] || "bg-gray-400 text-white") : "";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-[#f67f02] transition-all duration-200 flex flex-col items-center p-4 min-w-[150px] relative group cursor-pointer">
      {item.badge && (
        <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded ${badgeClass}`}>
          {item.badge}
        </span>
      )}
      <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mt-4 mb-3 overflow-hidden border border-gray-100">
        {item.logo}
      </div>
      <p className="text-center text-sm font-medium text-gray-700 leading-snug mb-2">{item.name}</p>
      <a href="#" className="text-[#f67f02] text-sm font-semibold hover:underline">View Details</a>
    </div>
  );
}

export default function ServiceSection({ title, items }: ServiceSectionProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-800">{title}</h2>
        <a href="#" className="text-sm text-[#f67f02] hover:underline font-medium bg-orange-50 px-3 py-1 rounded">View more</a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {items.map((item, i) => (
          <ServiceCard key={i} item={item} />
        ))}
      </div>
    </section>
  );
}
