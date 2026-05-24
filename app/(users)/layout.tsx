import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="web-only-nav">
        <Navbar />
      </div>

      {children}

      <div className="web-only-footer">
        <Footer />
      </div>
    </div>
  );
}
