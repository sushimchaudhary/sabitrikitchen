"use client";

import MobileAppView from "@/app/components/MobileAppView";
import { useIsStandalone } from "@/app/hooks/useIsStandalone";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // 🌟 js-cookie इम्पोर्ट गरियो

export default function DashboardPage() {
  const router = useRouter();
  const isPWAStandalone = useIsStandalone();
  
  const [isMobileResponsive, setIsMobileResponsive] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); 

  useEffect(() => {
    // 🔐 १. टोकन चेकिङ र अथेन्टिकेसन लजिक (लगिन पेजसँग म्याच गराइएको)
    const token = Cookies.get("auth_token"); 

    console.log("=== DASHBOARD AUTH CHECK ===");
    console.log("Token from Cookie:", token ? "Found ✅" : "NOT FOUND ❌");

    if (!token) {
      // टोकन छैन भने कन्सोलमा म्यासेज फाल्ने र लगइनमा रिडाइरेक्ट गर्ने
      console.warn("No auth_token found in cookies. Redirecting to /login...");
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

  // जबसम्म टोकन चेक भएर सकिँदैन, तबसम्म लोडर देखाउने
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-6 h-6 border-2 border-[#f67f02] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // यदि लगइन भएको छैन भने केही पनि रेन्डर नगर्ने
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