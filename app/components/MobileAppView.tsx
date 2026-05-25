"use client";
import { useState, useEffect } from "react";
import {
  Wallet, ArrowDownToLine, ArrowUpFromLine, Building2, Globe,
  Smartphone, Zap, Droplets, Wifi, LandmarkIcon, AlertCircle,
  GraduationCap, ChevronRight, Plane, Globe2, Hotel, Bus,
  Film, Cable, CalendarDays, Shield, Home, FileText,
  HelpCircle, LayoutGrid, Search, Bell, Bot, QrCode,
  Eye, EyeOff, Star, Users2, LogOut, User, Settings
} from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const services = {
  utility: [
    { icon: Smartphone, label: "Topup\n& Data" },
    { icon: Zap, label: "Electricity" },
    { icon: Droplets, label: "Khanepani" },
    { icon: Wifi, label: "Internet" },
    { icon: LandmarkIcon, label: "Govt.\nPayment" },
    { icon: AlertCircle, label: "Traffic Fine\nPayment" },
    { icon: GraduationCap, label: "Education\nFee" },
  ],
  travel: [
    { icon: Plane, label: "Airlines" },
    { icon: Globe2, label: "Intl Airlines" },
    { icon: Hotel, label: "Hotels" },
    { icon: Bus, label: "Bus Ticket" },
    { icon: Film, label: "Movies" },
    { icon: Cable, label: "Cable Car" },
    { icon: CalendarDays, label: "Events" },
  ],
  insurance: [
    { icon: Shield, label: "Life\nInsurance" },
    { icon: Shield, label: "Health\nInsurance" },
    { icon: Shield, label: "Vehicle\nInsurance" },
    { icon: Shield, label: "Travel\nInsurance" },
  ],
};

function ServiceGrid({ items }: { items: { icon: React.ElementType; label: string }[] }) {
  const visible = items.slice(0, 7);
  return (
    <div className="grid grid-cols-4 gap-y-5 gap-x-2 px-1">
      {visible.map((s, i) => {
        const Icon = s.icon;
        return (
          <button key={i} className="flex flex-col items-center gap-1.5 group">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center group-active:bg-orange-50 group-active:border-[#f67f02] transition-colors">
              <Icon className="w-6 h-6 text-gray-600 group-active:text-[#f67f02]" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] text-gray-600 text-center leading-tight whitespace-pre-line font-medium">{s.label}</span>
          </button>
        );
      })}
      <button className="flex flex-col items-center gap-1.5 group">
        <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center group-active:bg-[#f67f02] transition-colors">
          <ChevronRight className="w-5 h-5 text-[#f67f02]" strokeWidth={2} />
        </div>
        <span className="text-[10px] text-gray-400 text-center leading-tight font-medium">More</span>
      </button>
    </div>
  );
}

export default function MobileAppView() {
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const router = useRouter();

  const [user, setUser] = useState<{
    id: number;
    username: string;
    email: string;
    first_name: string;
    is_staff: boolean;
    is_superuser: boolean;
  } | null>(null);

  useEffect(() => {
    const userInfoRaw = Cookies.get("user_info");
    if (userInfoRaw) {
      try {
        const parsedUser = JSON.parse(userInfoRaw);
        setUser(parsedUser);
      } catch (err) {
        console.error("Error parsing user context:", err);
      }
    }
  }, []);

  const isSuperAdmin = user?.is_superuser === true;
  const displayName = user?.username || "Guest User";

  const getInitials = (name: string) => {
    const cleaned = name.trim();
    if (!cleaned) return "GU";
    return cleaned.slice(0, 2).toUpperCase();
  };

  // 🌟 Logout फङ्सन (यसले सबै कुकिज हटाएर लगिनमा फर्काउँछ)
  const handleLogout = () => {
    Cookies.remove("auth_token");
    Cookies.remove("user_info");
    Cookies.remove("refresh_token");
    
    toast.success("Logged Out", {
      description: "You have been safely logged out.",
    });

    // सफा रिडाइरेक्ट सुनिश्चित गर्न विन्डो रिफ्रेससहित रिडाइरेक्ट
    window.location.href = "/login";
  };

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col overflow-hidden relative">
      
      {/* Mobile App Header */}
      <div className="bg-[#f67f02] px-4 pt-6 pb-4 shrink-0 z-10 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/40">
              <span className="text-white font-bold text-sm">
                {getInitials(displayName)}
              </span>
            </div>
            <div>
              <div className="text-white/70 text-[10px] flex items-center gap-1">
                Welcome back 
                {isSuperAdmin && (
                  <span className="bg-red-600 text-white font-extrabold px-1 rounded text-[8px]">
                    Admin Panel
                  </span>
                )}
              </div>
              <h2 className="text-white font-bold text-base leading-tight">
                Hi, {displayName}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><Search className="w-4 h-4 text-white" /></button>
            <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center relative">
              <Bell className="w-4 h-4 text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border border-white text-[7px] text-white flex items-center justify-center font-bold">3</span>
            </button>
            <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><Bot className="w-4 h-4 text-white" /></button>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center"><Wallet className="w-5 h-5 text-[#f67f02]" /></div>
              <div>
                <p className="text-gray-400 text-[10px]">NPR</p>
                <p className="text-gray-800 font-bold text-base">{balanceVisible ? "12,450.00" : "XXXX.XX"}</p>
                <p className="text-gray-400 text-[10px]">Balance</p>
              </div>
            </div>
            <button onClick={() => setBalanceVisible(!balanceVisible)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              {balanceVisible ? <Eye className="w-4 h-4 text-gray-500" /> : <EyeOff className="w-4 h-4 text-gray-500" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center"><Star className="w-5 h-5 text-[#f67f02]" /></div>
              <div>
                <p className="text-gray-800 font-bold text-base">XXXX.XX</p>
                <p className="text-gray-400 text-[10px]">Reward Points</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#f67f02]" />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-gray-100">
            {[
              { icon: ArrowDownToLine, label: "Load\nMoney" },
              { icon: ArrowUpFromLine, label: "Send\nMoney" },
              { icon: Building2, label: "Bank\nTransfer" },
              { icon: Globe, label: "Remittance" },
            ].map((a, i) => (
              <button key={i} className="flex flex-col items-center gap-1 group">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center group-active:bg-[#f67f02] transition-colors">
                  <a.icon className="w-5 h-5 text-[#f67f02] group-active:text-white" strokeWidth={1.5} />
                </div>
                <span className="text-[9px] text-gray-500 text-center leading-tight whitespace-pre-line font-medium">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 pb-24 z-0">
        
        {/* 🌟 यदि "more" ट्याब एक्टिभ छ भने "More Menu" देखाउने, नत्र डिफल्ट होमपेज देखाउने */}
        {activeTab === "more" ? (
          <div className="p-4 space-y-4 animate-in fade-in duration-200">
            <h3 className="font-bold text-gray-800 text-base mb-2 px-1">More Options</h3>
            
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              {/* Profile Option */}
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 active:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center"><User className="w-5 h-5 text-[#f67f02]" /></div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-800">My Profile</p>
                    <p className="text-[10px] text-gray-400">View your account details</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              {/* Settings Option */}
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 active:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center"><Settings className="w-5 h-5 text-gray-600" /></div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-800">Settings</p>
                    <p className="text-[10px] text-gray-400">Security and app settings</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              {/* 🛑 LOGOUT BUTTON */}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 hover:bg-red-50 active:bg-red-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                    <LogOut className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-red-600">Logout</p>
                    <p className="text-[10px] text-red-400">Sign out from SabitriPay</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        ) : (
          /* 🏠 डिफल्ट होम स्क्रिनको कन्टेन्ट (utility, travel, insurance, admin panel) */
          <div className="space-y-3 p-3">
            {isSuperAdmin && (
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-2xl p-4 shadow-sm">
                <h3 className="font-extrabold text-red-700 text-xs tracking-wider uppercase mb-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                  Administrative Control Panel
                </h3>
                <div className="grid grid-cols-4 gap-y-5 gap-x-2 px-1">
                  <button 
                    onClick={() => router.push("/admin/users")} 
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white border border-red-200 shadow-sm flex items-center justify-center group-active:bg-red-600 group-active:text-white transition-colors">
                      <Users2 className="w-6 h-6 text-red-600 group-active:text-white" strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] text-gray-800 text-center font-bold leading-tight whitespace-pre-line">
                      Manage\nUsers
                    </span>
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 text-sm mb-4">Utility & Bill Payments</h3>
              <ServiceGrid items={services.utility} />
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 text-sm mb-4">Travels & Ticketing</h3>
              <ServiceGrid items={services.travel} />
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 text-sm mb-4">Insurance</h3>
              <div className="grid grid-cols-4 gap-y-5 gap-x-2 px-1">
                {services.insurance.map((s, i) => {
                  const Icon = s.icon;
                  const colors = ["bg-green-50 text-green-600", "bg-blue-50 text-blue-600", "bg-purple-50 text-purple-600", "bg-red-50 text-red-600"];
                  return (
                    <button key={i} className="flex flex-col items-center gap-1.5 group">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-gray-100 ${colors[i].split(' ')[0]}`}>
                        <Icon className={`w-6 h-6 ${colors[i].split(' ')[1]}`} strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] text-gray-600 text-center leading-tight whitespace-pre-line font-medium">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 pb-5 pt-2 flex items-center justify-around z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {[
          { id: "home", icon: Home, label: "Home" },
          { id: "statement", icon: FileText, label: "Statement" },
          { id: "qr", icon: QrCode, label: "" },
          { id: "support", icon: HelpCircle, label: "Support" },
          { id: "more", icon: LayoutGrid, label: "More" },
        ].map((tab) => {
          const Icon = tab.icon;
          if (tab.id === "qr") {
            return (
              <button key={tab.id} className="-mt-8 w-16 h-16 rounded-full bg-[#f67f02] flex items-center justify-center shadow-lg shadow-orange-300 border-4 border-white active:scale-95 transition-transform">
                <QrCode className="w-7 h-7 text-white" />
              </button>
            );
          }
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="flex flex-col items-center gap-0.5 px-2 py-1 min-w-[50px] active:scale-95 transition-transform">
              <Icon className={`w-6 h-6 ${isActive ? "text-[#f67f02]" : "text-gray-400"}`} strokeWidth={isActive ? 2 : 1.5} />
              <span className={`text-[10px] font-medium ${isActive ? "text-[#f67f02]" : "text-gray-400"}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}