// app/page.tsx or app/dashboard/page.tsx ko top layout setup ma temporary check thapnus:
"use client";
import MobileAppView from "@/app/components/MobileAppView";
import { useIsStandalone } from "@/app/hooks/useIsStandalone";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const isPWAStandalone = useIsStandalone();
  const [isMobileResponsive, setIsMobileResponsive] = useState(false);

  useEffect(() => {
    // Screen width check garera responsive state dynamic handle garna
    const checkSize = () => setIsMobileResponsive(window.innerWidth < 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // Check custom framework overlay setup
  // Standalone hoina bhane pani mobile screen width size low huda MobileAppView trigger hunchha
  if (isPWAStandalone || isMobileResponsive) {
    return <MobileAppView />;
  }

  return (
    <div className="p-8">
      <h1>Desktop Dashboard View Layout System</h1>
    </div>
  );
}