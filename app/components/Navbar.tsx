"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Router control standard framework use garna
import { Search, User, Lock, Menu, X } from "lucide-react"; 

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter(); // Initialize router hook layer

  return (
    <>
      {/* 1. ONLY TOP NAVBAR IS STICKY NOW */}
      <nav className="bg-[#1e2227] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2 min-w-[120px] cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-8 h-8 rounded-full bg-[#f67f02] flex items-center justify-center font-bold text-white text-sm">SK</div>
            <span className="text-white font-bold text-lg hidden sm:block">Sabitri<span className="text-[#f67f02]">Kitchen</span></span>
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search services/merchant by tags (e.g. food)"
              className="w-full bg-[#2e3540] text-white placeholder-gray-400 text-sm rounded px-4 py-2 pl-9 outline-none focus:ring-1 focus:ring-[#f67f02]"
            />
            <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Auth (Desktop View) */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#2e3540] rounded px-3 py-2">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
              <input placeholder="Sabitri ID" className="bg-transparent text-sm text-white placeholder-gray-400 outline-none w-24" />
            </div>
            <div className="flex items-center gap-1 bg-[#2e3540] rounded px-3 py-2">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1v2z"/></svg>
              <input type="password" placeholder="Password" className="bg-transparent text-sm text-white placeholder-gray-400 outline-none w-20" />
            </div>
            <button 
              onClick={() => router.push("/login")} 
              className="bg-[#f67f02] hover:bg-[#d96e00] text-white text-sm font-semibold px-4 py-2 rounded transition"
            >
              Login
            </button>
            <button 
              onClick={() => router.push("/register")} // Redirect to Register form page layout
              className="border border-[#f67f02] text-[#f67f02] hover:bg-[#f67f02] hover:text-white text-sm font-semibold px-4 py-2 rounded transition"
            >
              Register
            </button>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden ml-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Forgot password links inside the sticky container */}
        <div className="hidden md:block text-right text-xs text-gray-400 pr-4 pb-1 max-w-7xl mx-auto">
          <a href="#" className="hover:text-[#f67f02]">Forgot Password?</a>
        </div>

        {/* Mobile menu content */}
        {menuOpen && (
          <div className="md:hidden bg-[#2e3540] px-4 py-3 flex flex-col gap-2">
            <input placeholder="Sabitri ID" className="bg-[#1e2227] text-white placeholder-gray-400 px-3 py-2 rounded outline-none text-sm" />
            <input type="password" placeholder="Password" className="bg-[#1e2227] text-white placeholder-gray-400 px-3 py-2 rounded outline-none text-sm" />
            <div className="flex gap-2">
              <button 
                onClick={() => { setMenuOpen(false); router.push("/login"); }} 
                className="flex-1 bg-[#f67f02] text-white py-2 rounded font-semibold text-sm"
              >
                Login
              </button>
              <button 
                onClick={() => { setMenuOpen(false); router.push("/register"); }} // Mobile layout route dispatcher
                className="flex-1 border border-[#f67f02] text-[#f67f02] py-2 rounded font-semibold text-sm"
              >
                Register
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* 2. SECONDARY NAV IS NOW COMPLETELY SEPARATE (No Sticky) */}
      <div className="bg-[#f67f02] w-full shadow-sm relative z-40">
        <div className="max-w-7xl mx-auto px-4 flex gap-6 py-2 text-sm font-semibold text-white overflow-x-auto scrollbar-none">
          {["Top Up", "Airlines", "Internet Bill", "Load Fund"].map((item) => (
            <a key={item} href="#" className="whitespace-nowrap hover:text-[#1e2227] transition-colors duration-150">{item}</a>
          ))}
        </div>
      </div>
    </>
  );
}