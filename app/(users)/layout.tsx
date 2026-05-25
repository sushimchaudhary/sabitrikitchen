import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen w-full relative">
      
      {/* Navbar Wrapper */}
      {/* <div className="w-full z-50"> */}
        <Navbar />
      {/* </div> */}

      {/* Main Page Content */}
      <main className="flex-grow w-full">
        {children}
      </main>

      {/* Footer System: सधैँ र सबै डिभाइसमा देखिने */}
      <div className="w-full mt-auto">
        <Footer />
      </div>
      
    </div>
  );
}