"use client";

import MobileAppView from "@/app/components/MobileAppView";
import { useIsStandalone } from "@/app/hooks/useIsStandalone";
import { useState, useEffect, useLayoutEffect } from "react"; 
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function DashboardPage() {
  const router = useRouter();
  const isPWAStandalone = useIsStandalone();
  
  const [isMobileResponsive, setIsMobileResponsive] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); 

  // 🌟 म्याजिक फिक्स: स्क्रिन रेन्डर हुनु अगाडि नै टोकन चेक गर्ने (Flicker रोक्न)
  useLayoutEffect(() => {
    const token = Cookies.get("auth_token");
    if (!token) {
      setIsAuthenticated(false);
      window.location.href = "/login"; // Immediate Hard Redirect
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get("auth_token");
    if (!token) return;

    // 📱 स्क्रिन साइज चेकिङ लजिक
    const checkSize = () => setIsMobileResponsive(window.innerWidth < 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    
    return () => window.removeEventListener("resize", checkSize);
  }, [isAuthenticated]);

  // बीएफक्यास (bfcache) र ब्याक बटन सुरक्षा
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

  // जबसम्म टोकन पक्का हुँदैन, स्क्रिनमा केही पनि देखाउन नदिने
  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-6 h-6 border-2 border-[#f67f02] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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