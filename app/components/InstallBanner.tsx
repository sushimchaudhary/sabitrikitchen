"use client";
import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // यदि एप पहिले नै standalone मोडमा खुल्ला छ भने ब्यानर नदेखाउने
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // ब्राउजरको आफ्नै डिफल्ट प्रम्प्टलाई रोक्ने
      e.preventDefault();
      // इभेन्टलाई स्टेटमा सेभ गर्ने ताकि पछि ट्रिगर गर्न सकियोस्
      setDeferredPrompt(e);
      // यदि युजरले यसअघि यो सेसनमा ब्यानर बन्द गरेको छैन भने मात्र देखाउने
      const isDismissed = sessionStorage.getItem("pwa_banner_dismissed");
      if (!isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // ब्राउजरको इन्स्टल प्रम्प्ट देखाउने
    deferredPrompt.prompt();

    // युजरको च्वाइस पर्खने
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // प्रम्प्ट प्रयोग भइसकेकोले क्लियर गर्ने
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // यो सेसनको लागि ब्यानर क्लोज गरेको सम्झिने
    sessionStorage.setItem("pwa_banner_dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="w-full bg-gradient-to-r from-[#f67f02] to-orange-500 text-white px-4 py-2.5 flex items-center justify-between shadow-md animate-in slide-in-from-top duration-300 sticky top-0 z-[9999]">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
          <Download className="w-4 h-4 text-white" />
        </div>
        <div>
          <h4 className="text-xs font-bold leading-tight">SabitriPay App</h4>
          <p className="text-[10px] text-white/90">Install for faster access & smart payments</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleInstallClick}
          className="bg-white text-[#f67f02] text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm active:scale-95 transition-transform"
        >
          Install
        </button>
        <button 
          onClick={handleDismiss}
          className="p-1 text-white/80 hover:text-white active:scale-90 transition-transform"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}