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
    // 🛡️ १. कडा अथेन्टिकेसन चेकर फङ्सन
    const checkAuth = () => {
      const token = Cookies.get("auth_token"); 

      console.log("=== DASHBOARD AUTH CHECK ===");
      console.log("Token from Cookie:", token ? "Found ✅" : "NOT FOUND ❌");

      if (!token) {
        console.warn("No auth_token found. Redirecting to /login...");
        setIsAuthenticated(false);
        router.replace("/login"); 
        
        // 🌟 यदि ब्याक गरेर आएको विन्डो हो भने कडा रिडाइरेक्ट सुनिश्चित गर्न विन्डो नै ओभरराइड गरिदिने
        window.location.href = "/login";
        return false;
      }
      
      setIsAuthenticated(true);
      return true;
    };

    // पहिलो पटक पेज लोड हुँदा चेक गर्ने
    const hasToken = checkAuth();

    // 📱 २. स्क्रिन साइज चेकिङ लजिक (टोकन छ भने मात्र सेट गर्ने)
    if (hasToken) {
      const checkSize = () => setIsMobileResponsive(window.innerWidth < 768);
      checkSize();
      window.addEventListener("resize", checkSize);
      
      return () => window.removeEventListener("resize", checkSize);
    }
  }, [router]);

  // 🌟 ३. म्याजिक लजिक: मोबाइलको BACK BUTTON र ब्राउजर क्यास (bfcache) ह्यान्डलर
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      // यदि पेज ब्राउजरको मेमोरी/क्यास (Back Button थिचेर) बाट लोड भएको हो भने
      if (event.persisted || (typeof window !== "undefined" && window.performance && window.performance.navigation.type === 2)) {
        const token = Cookies.get("auth_token");
        if (!token) {
          console.log("Back button cache detected without token. Redirecting...");
          window.location.replace("/login");
        }
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

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