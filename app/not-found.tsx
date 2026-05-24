"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#1e2227] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute top-[-80px] left-[-80px] w-80 h-80 rounded-full bg-[#f67f02] opacity-10 blur-3xl animate-pulse" />
      <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 rounded-full bg-[#f67f02] opacity-5 blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-[-120px] w-64 h-64 rounded-full bg-[#f67f02] opacity-5 blur-2xl" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(#f67f02 1px, transparent 1px), linear-gradient(90deg, #f67f02 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-lg">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-12 group">
          <div className="w-10 h-10 rounded-full bg-[#f67f02] flex items-center justify-center font-bold text-white text-base group-hover:scale-110 transition-transform">
            SK
          </div>
          <span className="text-white font-bold text-xl">
            Sabitri<span className="text-[#f67f02]">Kitchen</span>
          </span>
        </Link>

        {/* 404 big number */}
        <div className="relative mb-6">
          <p
            className="text-[160px] sm:text-[200px] font-extrabold leading-none select-none"
            style={{
              WebkitTextStroke: "2px #f67f02",
              color: "transparent",
              letterSpacing: "-8px",
            }}
          >
            404
          </p>
          {/* Floating chili emoji */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className="text-6xl sm:text-7xl"
              style={{
                animation: "float 3s ease-in-out infinite",
              }}
            >
              🌶️
            </span>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-white text-2xl sm:text-3xl font-bold mb-3">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mb-2">
          The page you&apos;re looking for has gone missing
          {".".repeat(dots)}
        </p>
        <p className="text-gray-500 text-xs mb-10">
          It might have been moved, deleted, or never existed.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-[#f67f02] hover:bg-[#d96e00] text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#f67f02]/25 hover:scale-105 text-sm"
          >
            ← Go Back Home
          </Link>
          <Link
            href="/#featured"
            className="border border-[#f67f02] text-[#f67f02] hover:bg-[#f67f02] hover:text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 text-sm"
          >
            Browse Services
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-gray-500 text-xs mb-4 uppercase tracking-widest">
            Quick Links
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {["Top Up", "Airlines", "Internet Bill", "Insurance", "Load Fund"].map(
              (link) => (
                <a
                  key={link}
                  href="#"
                  className="text-xs text-gray-400 hover:text-[#f67f02] transition-colors border border-gray-700 hover:border-[#f67f02] px-3 py-1.5 rounded-full"
                >
                  {link}
                </a>
              )
            )}
          </div>
        </div>
      </div>

      {/* Bottom credit */}
      <p className="absolute bottom-4 text-gray-600 text-xs">
        © 2009-2026 Sabitri Kitchen Masala
      </p>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
