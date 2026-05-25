"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import axiosInstance from "@/lib/config/axios.config";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Inputs State Management
  const [sabitriId, setSabitriId] = useState("");
  const [password, setPassword] = useState("");

  // Validation Check
  const isFormValid = sabitriId.trim() !== "" && password.trim() !== "";

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    try {
      Cookies.remove("auth_token");
      Cookies.remove("user_info");

      const payload = {
        username: sabitriId,
        password: password,
      };

      // १. लगिन रिक्वेस्ट
      const response = await axiosInstance.post("/auth/login/", payload);
      
      const token = response.data?.access; 
      const userData = response.data?.user; 

      if (!token) {
        throw new Error("Access token not found in response.");
      }

      // २. कुकिजमा access token सेभ गर्ने
      Cookies.set("auth_token", token, { expires: 1, sameSite: "strict" });
      
      // 🌟 थपिएको परिवर्तन: ब्याकइन्डले दिएको user अब्जेक्टलाई JSON string बनाएर कुकीमा सेभ गर्ने
      if (userData) {
        Cookies.set("user_info", JSON.stringify(userData), { expires: 1, sameSite: "strict" });
      }

      if (response.data?.refresh) {
        Cookies.set("refresh_token", response.data.refresh, { expires: 7, sameSite: "strict" });
      }

      // ३. हेडर अपडेट
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // ४. टोस्ट म्यासेज
      const username = userData?.username || "User";
      toast.success(<strong>Welcome Back!</strong>, {
        description: `Logged in successfully as ${username}.`,
      });

      // इनपुटहरू सफा गर्ने
      setSabitriId("");
      setPassword("");
      setMenuOpen(false);

      // ५. ड्यासबोर्डमा रिडाइरेक्ट र फ्रेस डेटा लोड
      router.push("/dashboard");
      router.refresh();
      
    } catch (exception: any) {
      const errorMsg = exception.response?.data?.message || "Invalid credentials. Try again.";
      toast.error(<strong>Login Failed !!</strong>, { description: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full flex flex-col">
      {/* 1. TOP NAVBAR */}
      <nav className="bg-[#1e2227] text-white shadow-lg w-full">
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

          {/* Auth (Desktop View Form Integration) */}
          <form onSubmit={handleInlineLogin} className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#2e3540] rounded px-3 py-2">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
              <input 
                placeholder="Sabitri ID" 
                value={sabitriId}
                onChange={(e) => setSabitriId(e.target.value)}
                className="bg-transparent text-sm text-white placeholder-gray-400 outline-none w-24" 
              />
            </div>
            
            <div className="flex items-center gap-1 bg-[#2e3540] rounded px-3 py-2">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1v2z"/>
              </svg>
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-sm text-white placeholder-gray-400 outline-none w-20" 
              />
            </div>

            <button 
              type="submit"
              disabled={!isFormValid || isLoading} 
              className={`text-white text-sm font-semibold px-4 py-2 rounded transition flex items-center gap-1.5 h-[38px] ${
                isFormValid && !isLoading
                  ? "bg-[#f67f02] hover:bg-[#d96e00] cursor-pointer" 
                  : "bg-[#f67f02] text-white opacity-40 cursor-not-allowed"
              }`}
            >
              {isLoading && <Loader2 size={14} className="animate-spin" />}
              Login
            </button>

            <button 
              type="button"
              onClick={() => router.push("/register")} 
              className="border border-[#f67f02] text-[#f67f02] hover:bg-[#f67f02] hover:text-white text-sm font-semibold px-4 py-2 rounded transition h-[38px]"
            >
              Register
            </button>
          </form>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden ml-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Forgot password links */}
        <div className="hidden md:block text-right text-xs text-gray-400 pr-4 pb-1 max-w-7xl mx-auto">
          <button 
            type="button" 
            onClick={() => router.push("/forgot-password")} 
            className="hover:text-[#f67f02] transition-colors"
          >
            Forgot Password?
          </button>
        </div>

        {/* Mobile menu content */}
        {menuOpen && (
          <div className="md:hidden bg-[#2e3540] px-4 py-3 flex flex-col gap-2">
            <input 
              placeholder="Sabitri ID" 
              value={sabitriId}
              onChange={(e) => setSabitriId(e.target.value)}
              className="bg-[#1e2227] text-white placeholder-gray-400 px-3 py-2 rounded outline-none text-sm" 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#1e2227] text-white placeholder-gray-400 px-3 py-2 rounded outline-none text-sm" 
            />
            <div className="flex gap-2 mt-1">
              <button 
                type="button"
                disabled={!isFormValid || isLoading}
                onClick={handleInlineLogin} 
                className={`flex-grow py-2 rounded font-semibold text-sm flex items-center justify-center gap-2 ${
                  isFormValid && !isLoading
                    ? "bg-[#f67f02] text-white" 
                    : "bg-[#f67f02] text-white opacity-50 cursor-not-allowed"
                }`}
              >
                {isLoading && <Loader2 size={14} className="animate-spin" />}
                Login
              </button>
              <button 
                type="button"
                onClick={() => { setMenuOpen(false); router.push("/register"); }} 
                className="flex-grow border border-[#f67f02] text-[#f67f02] py-2 rounded font-semibold text-sm"
              >
                Register
              </button>
            </div>
            <button 
              type="button"
              onClick={() => { setMenuOpen(false); router.push("/forgot-password"); }}
              className="text-left text-xs text-gray-400 hover:text-[#f67f02] mt-1 self-start"
            >
              Forgot Password?
            </button>
          </div>
        )}
      </nav>

      
    </div>
  );
}