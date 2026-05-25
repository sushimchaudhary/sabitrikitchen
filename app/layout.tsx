import type { Metadata, Viewport } from "next";
import "./globals.css";

import PWARegister from "./components/PWARegister";
import InstallBanner from "./components/InstallBanner";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Sabitri Kitchen Masala",
  description: "Nepal's trusted digital payment & services platform",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SabitriPay",
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    title: "Sabitri Kitchen Masala",
    description: "Nepal's trusted digital payment & services platform",
  },
};

export const viewport: Viewport = {
  themeColor: "#f67f02",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SabitriPay" />

        {/* Google Sans CDN Imports */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />
        
        {/* Magic CSS to hide Web Nav/Footer inside standalone application window */}
        <style>{`
          @media (display-mode: standalone) {
            .web-only-nav, .web-only-footer, .pwa-install-banner {
              display: none !important;
            }
          }
        `}</style>
      </head>
      <body className="relative">
          <PWARegister />
          
          <InstallBanner />
          
          {children}
      </body>
    </html>
  );
}