"use client";

import MobileAppView from "@/app/components/MobileAppView";
import { useIsStandalone } from "@/app/hooks/useIsStandalone";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const isPWAStandalone = useIsStandalone();
  
  const [isMobileResponsive, setIsMobileResponsive] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Loading state handle gर्न null राखिएको

  useEffect(() => {
    // 🔐 १. टोकन चेकिङ र अथेन्टिकेसन लजिक
    // (यदि तपाईँ टोकन cookies वा अरू कतै राख्नुहुन्छ भने त्यही अनुसार `localStorage.getItem` लाई रिप्लेस गर्नुहोला)
    const token = localStorage.getItem("access"); 

    if (!token) {
      // टोकन छैन भने सिधै लगइन पेजमा पठाउने
      setIsAuthenticated(false);
      router.replace("/login"); 
      return;
    }

    // टोकन छ भने मात्र ड्यासबोर्ड एक्सेस दिने
    setIsAuthenticated(true);

    // 📱 २. स्क्रीन साइज चेकिङ लजिक
    const checkSize = () => setIsMobileResponsive(window.innerWidth < 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    
    return () => window.removeEventListener("resize", checkSize);
  }, [router]);

  // जबसम्म टोकन चेक भएर सकिँदैन, तबसम्म ब्ल्यांक वा एउटा सामान्य लोडर देखाउने
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-6 h-6 border-2 border-[#f67f02] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // यदि लगइन भएको छैन भने केही पनि रेन्डर नगर्ने (रिडाइरेक्ट हुन्जेल सुरक्षित राख्न)
  if (!isAuthenticated) return null;

  // लगइन छ र मोबाइल स्क्रिन वा PWA हो भने मात्र MobileAppView खोल्ने
  if (isPWAStandalone || isMobileResponsive) {
    return <MobileAppView />;
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold text-[#364a63]">Desktop Dashboard View Layout System</h1>
      <p className="text-sm text-gray-500 mt-1">Welcome back, Superadmin!</p>
    </div>
  );
}