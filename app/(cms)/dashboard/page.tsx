"use client";

import MobileAppView from "@/app/components/MobileAppView";
import { useIsStandalone } from "@/app/hooks/useIsStandalone";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function DashboardPage() {
  const router = useRouter();
  const isPWAStandalone = useIsStandalone();
  
  const [isMobileResponsive, setIsMobileResponsive] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); 

  useEffect(() => {
    // 🛡️ १. अथेन्टिकेसन चेक गर्ने कडा फङ्सन
    const checkAuth = () => {
      const token = Cookies.get("auth_token"); 

      console.log("=== DASHBOARD AUTH CHECK ===");
      console.log("Token from Cookie:", token ? "Found ✅" : "NOT FOUND ❌");

      if (!token) {
        console.warn("No auth_token found. Redirecting to /login...");
        setIsAuthenticated(false);
        
        // ब्राउजरको हिस्ट्री नै क्लियर गरेर लगइनमा फाल्ने ताकि ब्याक गर्दा पनि नआओस्
        window.location.replace("/login");
        return false;
      }
      
      setIsAuthenticated(true);
      return true;
    };

    // एप खुल्ने बित्तिकै टोकन चेक गर्ने
    const hasToken = checkAuth();

    // 📱 २. टोकन छ भने मात्र स्क्रिन साइज ट्र्याक गर्ने
    if (hasToken) {
      const checkSize = () => setIsMobileResponsive(window.innerWidth < 768);
      checkSize();
      window.addEventListener("resize", checkSize);
      
      return () => window.removeEventListener("resize", checkSize);
    }
  }, [router]);

  // 🌟 ३. ब्याक बटन र बीएफक्यास (bfcache) को सुरक्षा (लगआउट पछि ब्याक गर्दा रोक्न)
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted || (typeof window !== "undefined" && window.performance && window.performance.navigation.type === 2)) {
        const token = Cookies.get("auth_token");
        if (!token) {
          window.location.replace("/login");
        }
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // 🔄 लोडिङ स्टेट: जबसम्म टोकन चेक हुँदैन, तबसम्म स्पिनर मात्र देखाउने
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-6 h-6 border-2 border-[#f67f02] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 🛑 मुख्य फिक्स: यदि युजर अथेन्टिकेटेड छैन (isAuthenticated === false) भने 
  // तलको कुनै पनि भ्यू (MobileAppView वा Desktop View) रेन्डर गर्नै नदिने
  if (isAuthenticated === false) {
    return null;
  }

  // ✅ टोकन १००% पक्का छ र मोबाइल स्क्रिन वा PWA हो भने मात्र भ्यू देखाउने
  if (isPWAStandalone || isMobileResponsive) {
    return <MobileAppView />;
  }

  // डेस्कटप भ्यू
  return (
    <div className="p-8">
      <h1 className="text-xl font-bold text-[#364a63]">Desktop Dashboard View Layout System</h1>
      <p className="text-sm text-gray-500 mt-1">Welcome back, Superadmin!</p>
    </div>
  );
}