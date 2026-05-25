import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // FIX: Min-height component standard layout framework applied
    <div className="flex flex-col min-h-screen w-full relative">
      
      {/* Navbar Container Wrapper Layer */}
      <div className="web-only-nav w-full z-50">
        <Navbar />
      </div>
      

      {/* Main Page dynamic dynamic components inject target context layout */}
      <main className="flex-grow w-full">
        {children}
      </main>

      {/* Footer System wrapper framework positioning element */}
      <div className="web-only-footer w-full mt-auto">
        <Footer />
      </div>
      
    </div>
  );
}