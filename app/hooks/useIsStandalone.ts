// hooks/useIsStandalone.ts
"use client";
import { useEffect, useState } from "react";

export function useIsStandalone() {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running as PWA Standalone
    const isStandalonePWA = window.matchMedia('(display-mode: standalone)').matches;
    
    // iOS Safari specific check for standalone mode
    const isIOSStandalone = (window.navigator as any).standalone === true;

    setIsStandalone(isStandalonePWA || isIOSStandalone);

    // Dynamic listener if mode changes (optional but safe)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches || isIOSStandalone);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isStandalone;
}