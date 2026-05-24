// app/page.tsx
"use client";

import HeroBanner from "../components/HeroBanner";
import MobileAppView from "../components/MobileAppView";
import PartnerBanks from "../components/PatnerBank";
import ServiceSection from "../components/ServiceSection";
import Sidebar from "../components/Sidebar";
import { useIsStandalone } from "../hooks/useIsStandalone";


const IconBox = ({ text, bg }: { text: string; bg: string }) => (
  <div className={`w-full h-full ${bg} flex items-center justify-center text-white font-bold text-xs text-center p-1 rounded-full`}>
    {text}
  </div>
);

// Preserved registries
const featuredServices = [
  { name: "Business QR Request", badge: "Request QR", logo: <div className="grid grid-cols-4 gap-0.5 w-10 h-10">{Array.from({length:16}).map((_,i)=><div key={i} className={`rounded-sm ${[0,1,2,4,6,8,10,12,13,14,15,5].includes(i)?"bg-gray-800":"bg-white"}`}/>)}</div> },
  { name: "eSpeaker Request", badge: "eSpeaker Request", logo: <div className="text-2xl">🔊</div> },
  { name: "IELTS Registration", badge: "IELTS", logo: <div className="text-xs font-bold text-blue-800 bg-blue-100 w-full h-full flex items-center justify-center rounded-full">IELTS</div> },
  { name: "Alfa Health Care & Diagnostic Center", badge: "Up to 50% Cashback", logo: <IconBox text="Alfa" bg="bg-green-500" /> },
  { name: "Naasa Securities Company Limited", badge: "Meroshare", logo: <IconBox text="NSC" bg="bg-indigo-600" /> },
];
const merchantSpotlight = [
  { name: "Colour Nepal", badge: "10% Discount", logo: <IconBox text="CN" bg="bg-gray-800" /> },
  { name: "Eglines Store", badge: "10% Discount", logo: <IconBox text="E" bg="bg-orange-500" /> },
  { name: "Tsarmoire Online Store Pvt. Ltd.", badge: "10% Cashback", logo: <IconBox text="T'S" bg="bg-gray-600" /> },
  { name: "Aasa Luxe", badge: "10% Discount", logo: <IconBox text="AL" bg="bg-black" /> },
  { name: "Oometo Partners Private Limited", badge: "3% Discount", logo: <IconBox text="O" bg="bg-red-500" /> },
];
const votingEvents = [
  { name: "MR & MISS JUNIOR AND SENIOR IDOL 2026 (SEASON-3)", badge: "Voting", logo: <IconBox text="IDOL" bg="bg-yellow-600" /> },
  { name: "MR & MISS SEE ICON 2026 (SEASON-13)", badge: "Voting", logo: <IconBox text="SEE ICON" bg="bg-gray-800" /> },
  { name: "KIDS RUNWAY FASHION SHOW 2026", badge: "Voting", logo: <IconBox text="KID" bg="bg-red-600" /> },
  { name: "KIDS SUPER MODEL DOLAKHA 2026", badge: "Voting", logo: <IconBox text="KSM" bg="bg-yellow-800" /> },
  { name: "SEE SUPER MODEL 2026 (DOLAKHA)", badge: "Voting", logo: <IconBox text="SCM" bg="bg-black" /> },
];
const insurance = [
  { name: "eSewa Care", badge: "", logo: <IconBox text="eC" bg="bg-[#f67f02]" /> },
  { name: "Nepal Life Insurance", badge: "", logo: <IconBox text="NL" bg="bg-blue-700" /> },
  { name: "National Life Insurance", badge: "", logo: <IconBox text="NatL" bg="bg-blue-900" /> },
  { name: "MetLife", badge: "", logo: <IconBox text="Met" bg="bg-teal-600" /> },
  { name: "Asian Life Insurance", badge: "", logo: <IconBox text="AL" bg="bg-purple-700" /> },
];
const antivirus = [
  { name: "Kaspersky Antivirus", badge: "10% Cashback", logo: <IconBox text="K" bg="bg-green-700" /> },
  { name: "eset Antivirus", badge: "10% Cashback", logo: <IconBox text="eset" bg="bg-blue-600" /> },
  { name: "Bitdefender", badge: "10% Cash Back", logo: <IconBox text="B" bg="bg-red-600" /> },
  { name: "MSecurity", badge: "10% Cashback", logo: <IconBox text="M" bg="bg-gray-700" /> },
  { name: "Dr. Web Antivirus", badge: "10% Cashback", logo: <IconBox text="Dr.WEB" bg="bg-green-600" /> },
];
const ecommerce = [
  { name: "Bhoj Deal", badge: "Food Delivery", logo: <IconBox text="BD" bg="bg-orange-500" /> },
  { name: "Ultima Lifestyle", badge: "Electronic", logo: <IconBox text="UL" bg="bg-gray-900" /> },
  { name: "AGM Web Hosting", badge: "Web Hosting", logo: <IconBox text="AGM" bg="bg-purple-600" /> },
  { name: "MaxBass", badge: "eCommerce", logo: <IconBox text="MB" bg="bg-gray-700" /> },
  { name: "Cowmandu", badge: "Dairy Products", logo: <IconBox text="COW" bg="bg-yellow-600" /> },
];

export default function Home() {
  const isPWAStandalone = useIsStandalone();

  // 1. Conditional Rendering for PWA Application Mode
  if (isPWAStandalone) {
    return <MobileAppView />;
  }

  // 2. Normal Web Browser Layout (Desktop Site view)
  return (
    <div className="min-h-screen bg-[#f5f5f5] w-full">
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <Sidebar />
          <div className="flex-1 min-w-0 w-full rounded-lg overflow-hidden shadow-sm">
            <HeroBanner />
          </div>
        </div>

        <div className="space-y-6 w-full">
          <ServiceSection title="Featured Services" items={featuredServices} />
          <ServiceSection title="Merchant Spotlight" items={merchantSpotlight} />
          <ServiceSection title="Voting & Events" items={votingEvents} />
          <ServiceSection title="Insurance" items={insurance} />
          <ServiceSection title="Antivirus" items={antivirus} />
          <ServiceSection title="eCommerce" items={ecommerce} />
        </div>

      

        <PartnerBanks/>
      </main>
    </div>
  );
}