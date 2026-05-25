"use client";
import { useState, useEffect } from "react";
import {
  Wallet, ArrowDownToLine, ArrowUpFromLine, Building2, Globe,
  Smartphone, Zap, Droplets, Wifi, LandmarkIcon, AlertCircle,
  GraduationCap, ChevronRight, Plane, Globe2, Hotel, Bus,
  Film, Cable, CalendarDays, Shield, Home, FileText,
  UserCheck, LayoutGrid, Search, Bell, Bot, QrCode,
  Eye, EyeOff, Star, Users2, LogOut, User, Settings, Upload, CheckCircle2, Clock, XCircle,
  MessageSquare, Calendar, Trash2, Save, AlertTriangle
} from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/config/axios.config";

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
            <div className="w-14 h-14 rounded bg-gray-50 border border-gray-100 flex items-center justify-center group-active:bg-orange-50 group-active:border-[#f67f02] transition-colors">
              <Icon className="w-6 h-6 text-gray-600 group-active:text-[#f67f02]" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] text-gray-600 text-center leading-tight whitespace-pre-line font-medium">{s.label}</span>
          </button>
        );
      })}
      <button className="flex flex-col items-center gap-1.5 group">
        <div className="w-14 h-14 rounded bg-orange-50 border border-orange-200 flex items-center justify-center group-active:bg-[#f67f02] transition-colors">
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
  
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // 🛡️ KYC States
  const [kycStatus, setKycStatus] = useState<"NOT_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED">("NOT_SUBMITTED");
  const [kycData, setKycData] = useState({
    id: null as number | null,
    fullName: "",
    permanentAddress: "",
    currentAddress: "",
    documentName: "",
    adminRemarks: "",
    createdAt: "",
    updatedAt: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // 🍞 Custom Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); // 3 सेकेन्ड पछि आफैं हराउने
  };

  const fetchKycStatus = async () => {
    try {
      const res = await axiosInstance.get("/auth/kyc/");

      if (res.status === 200 && Array.isArray(res.data) && res.data.length > 0) {
        const data = res.data[0]; 
        setKycStatus(data.status); 
        setKycData({
          id: data.id || null,
          fullName: data.full_name || "",
          permanentAddress: data.permanent_address || "",
          currentAddress: data.current_address || "",
          documentName: data.document ? data.document.split('/').pop() : "",
          adminRemarks: data.admin_remarks || "",
          createdAt: data.created_at || "",
          updatedAt: data.updated_at || ""
        });
      } else if (res.status === 200 && res.data && !Array.isArray(res.data)) {
        const data = res.data;
        setKycStatus(data.status);
        setKycData({
          id: data.id || null,
          fullName: data.full_name || "",
          permanentAddress: data.permanent_address || "",
          currentAddress: data.current_address || "",
          documentName: data.document ? data.document.split('/').pop() : "",
          adminRemarks: data.admin_remarks || "",
          createdAt: data.created_at || "",
          updatedAt: data.updated_at || ""
        });
      }
    } catch (error) {
      console.error("Error fetching KYC status:", error);
    } finally {
      setHasCheckedAuth(true);
    }
  };

  useEffect(() => {
    const token = Cookies.get("auth_token");
    const userInfoRaw = Cookies.get("user_info");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (userInfoRaw) {
      try {
        const parsedUser = JSON.parse(userInfoRaw);
        setUser(parsedUser);
      } catch (err) {
        console.error("Error parsing user context:", err);
      }
    }

    fetchKycStatus();
  }, []);

  if (!hasCheckedAuth || !Cookies.get("auth_token")) {
    return (
      <div className="w-full h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#f67f02] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogout = () => {
    Cookies.remove("auth_token");
    Cookies.remove("user_info");
    Cookies.remove("refresh_token");
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("/login");
  };

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file && kycStatus === "NOT_SUBMITTED") {
      showToast("Please upload an identity document.", "error");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("full_name", kycData.fullName);
    formData.append("permanent_address", kycData.permanentAddress);
    formData.append("current_address", kycData.currentAddress);
    if (file) formData.append("document", file); 

    try {
      const res = await axiosInstance.post("/auth/kyc/", formData);

      if (res.status === 200 || res.status === 201) {
        setKycStatus(res.data.status || "PENDING");
        fetchKycStatus(); // ताजा डेटा तान्न
        showToast("KYC Submitted Successfully!", "success");
      }
    } catch (err: any) {
      console.error("Error submitting KYC:", err);
      showToast("Submission failed. Try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔄 स्थिति परिवर्तन (Dropdown Update) गर्ने फङ्सन
  const handleStatusChange = async (newStatus: "PENDING" | "APPROVED" | "REJECTED") => {
    setIsUpdating(true);
    try {
      // यदि ब्याकेन्डमा PATCH/PUT अनुरोध पठाउनु पर्ने भएमा:
      const res = await axiosInstance.patch(`/auth/kyc/`, { status: newStatus });
      
      if (res.status === 200) {
        setKycStatus(newStatus);
        setKycData(prev => ({ ...prev, updatedAt: new Date().toISOString() }));
        showToast(`Status updated to ${newStatus} successfully!`, "success");
      }
    } catch (err) {
      console.error("Status update error:", err);
      // यदि युजरको रोल अनुसार API फरक छ भने फ्रन्टइन्ड स्टेट मात्र पनि अपडेट गराउन सकिन्छ:
      setKycStatus(newStatus);
      showToast(`Frontend status updated to ${newStatus}`, "info");
    } finally {
      setIsUpdating(false);
    }
  };

  // 🗑️ KYC डेटा डिलिट गर्ने फङ्सन
  const handleKycDelete = async () => {
    if (!confirm("Are you sure you want to delete this KYC application?")) return;

    try {
      // ब्याकेन्डमा DELETE अनुरोध पठाउने लजिक
      // await axiosInstance.delete(`/auth/kyc/`);
      
      // स्टेट रिसेट गर्ने
      setKycStatus("NOT_SUBMITTED");
      setKycData({
        id: null,
        fullName: "",
        permanentAddress: "",
        currentAddress: "",
        documentName: "",
        adminRemarks: "",
        createdAt: "",
        updatedAt: ""
      });
      showToast("KYC Record Deleted Successfully!", "success");
    } catch (err) {
      console.error("Error deleting KYC:", err);
      showToast("Failed to delete record.", "error");
    }
  };

  // 📅 मिति Format गर्ने सामान्य हेल्पर
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isSuperAdmin = user?.is_superuser === true;
  const displayName = user?.first_name || "Guest User";

  const getInitials = (name: string) => {
    const cleaned = name.trim();
    if (!cleaned) return "GU";
    return cleaned.slice(0, 2).toUpperCase();
  };

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col overflow-hidden relative">
      
      {/* 🍞 Dynamic Toast Component */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded shadow-lg flex items-center gap-2 text-xs font-bold transition-all duration-300 animate-bounce ${
          toast.type === "success" ? "bg-green-600 text-white" :
          toast.type === "error" ? "bg-red-600 text-white" : "bg-blue-600 text-white"
        }`}>
          {toast.type === "success" && <CheckCircle2 className="w-4 h-4" />}
          {toast.type === "error" && <XCircle className="w-4 h-4" />}
          {toast.type === "info" && <AlertCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

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
              <div className="w-9 h-9 rounded bg-orange-50 flex items-center justify-center"><Wallet className="w-5 h-5 text-[#f67f02]" /></div>
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
              <div className="w-9 h-9 rounded bg-orange-50 flex items-center justify-center"><Star className="w-5 h-5 text-[#f67f02]" /></div>
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
                <div className="w-10 h-10 rounded bg-orange-50 flex items-center justify-center group-active:bg-[#f67f02] transition-colors">
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
        
        {/* MORE TAB */}
        {activeTab === "more" && (
          <div className="p-4 space-y-4 animate-in fade-in duration-200">
            <h3 className="font-bold text-gray-800 text-base mb-2 px-1">More Options</h3>
            <div className="bg-white rounded shadow-sm overflow-hidden border border-gray-100">
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 active:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-orange-50 flex items-center justify-center"><User className="w-5 h-5 text-[#f67f02]" /></div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-800">My Profile</p>
                    <p className="text-[10px] text-gray-400">View your account details</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 active:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-gray-50 flex items-center justify-center"><Settings className="w-5 h-5 text-gray-600" /></div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-800">Settings</p>
                    <p className="text-[10px] text-gray-400">Security and app settings</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 hover:bg-red-50 active:bg-red-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
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
        )}

        {/* 📑 Dynamic KYC Tab System */}
       {activeTab === "kyc" && (
  <div className="p-4 space-y-4 animate-in fade-in duration-200">
    <h3 className="font-bold text-gray-800 text-base px-1">KYC Verification</h3>
    
    {kycStatus === "NOT_SUBMITTED" ? (
      /* 📝 FORM STATE */
      <form onSubmit={handleKycSubmit} className="bg-white rounded p-5 shadow-sm border border-gray-100 space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Full Name</label>
          <input 
            type="text" required
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#f67f02] text-gray-800"
            placeholder="Enter your official full name"
            value={kycData.fullName}
            onChange={(e) => setKycData({...kycData, fullName: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Permanent Address</label>
          <textarea 
            rows={2} required
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#f67f02] text-gray-800 animate-none resize-none"
            placeholder="District, Municipality, Ward No."
            value={kycData.permanentAddress}
            onChange={(e) => setKycData({...kycData, permanentAddress: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Current Address</label>
          <textarea 
            rows={2} required
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#f67f02] text-gray-800 animate-none resize-none"
            placeholder="Current staying address details"
            value={kycData.currentAddress}
            onChange={(e) => setKycData({...kycData, currentAddress: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Identity Document (Citizenship/Passport)</label>
          <div className="border-2 border-dashed border-gray-200 rounded p-4 flex flex-col items-center justify-center bg-gray-50 relative active:bg-orange-50/30 transition-colors">
            <input 
              type="file" required={kycStatus === "NOT_SUBMITTED"}
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setKycData({...kycData, documentName: file.name});
              }}
            />
            <Upload className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-[11px] text-gray-500 font-medium truncate max-w-full px-2">
              {kycData.documentName || "Click to upload document"}
            </span>
          </div>
        </div>

        <button 
          type="submit" disabled={isSubmitting}
          className="w-full bg-[#f67f02] text-white py-2.5 rounded-lg font-bold text-xs shadow-md shadow-orange-200 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : "Submit KYC Data"}
        </button>
      </form>
    ) : (
      /* 👁️ VIEW STATE */
      <div className="bg-white rounded p-5 shadow-sm border border-gray-100 space-y-4 relative">
        
        {/* Status Indicator Bar */}
        <div className={`p-3 rounded flex items-center gap-2.5 border ${
          kycStatus === "PENDING" ? "bg-amber-50/60 border-amber-100 text-amber-700" :
          kycStatus === "APPROVED" ? "bg-emerald-50/60 border-emerald-100 text-emerald-700" :
          "bg-rose-50/60 border-rose-100 text-rose-700"
        }`}>
          {kycStatus === "PENDING" && <Clock className="w-5 h-5 shrink-0 animate-pulse text-amber-600" />}
          {kycStatus === "APPROVED" && <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />}
          {kycStatus === "REJECTED" && <XCircle className="w-5 h-5 shrink-0 text-rose-600" />}
          
          <div className="flex-1">
            <h4 className="text-xs font-bold">
              Current Status: {kycStatus}
            </h4>
            <p className="text-[10px] opacity-80 leading-tight mt-0.5">
              {kycStatus === "PENDING" && "Your documents are under review by the administrator."}
              {kycStatus === "APPROVED" && "Congratulations! Your digital wallet account is verified."}
              {kycStatus === "REJECTED" && "Verification failed. Please recheck information and try again."}
            </p>
          </div>
        </div>

        {/* एडमिन रिमार्क बक्स */}
        {kycData.adminRemarks && (
          <div className={`p-3 rounded border flex flex-col gap-1 ${
            kycStatus === "REJECTED" 
              ? "bg-rose-50/30 border-rose-100 text-rose-900" 
              : "bg-gray-50 border-gray-100 text-gray-700"
          }`}>
            <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide uppercase opacity-70">
              <MessageSquare className="w-3.5 h-3.5" />
              Admin Remarks
            </div>
            <p className="text-xs italic font-medium pl-5 text-gray-600">
              "{kycData.adminRemarks}"
            </p>
          </div>
        )}

        {/* Submitted Content Details */}
        <div className="space-y-3 pt-1">
          <div className="border-b border-gray-100 pb-2">
            <span className="text-[10px] text-gray-400 block">Full Name</span>
            <span className="text-xs font-bold text-gray-800">{kycData.fullName || "N/A"}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 border-b border-gray-100 pb-2">
            <div>
              <span className="text-[10px] text-gray-400 block">Permanent Address</span>
              <span className="text-xs font-medium text-gray-700">{kycData.permanentAddress || "N/A"}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block">Current Address</span>
              <span className="text-xs font-medium text-gray-700">{kycData.currentAddress || "N/A"}</span>
            </div>
          </div>

          {/* 🖼️ थपिएको: Premium Document Image Preview Section */}
          <div className="pt-1">
            <span className="text-[10px] text-gray-400 block mb-1.5">Submitted Identity Document</span>
            <div className="relative border border-gray-200 rounded bg-slate-50 overflow-hidden group h-44 flex flex-col items-center justify-center">
              {/* यदि स्टेटमा पुरा URL नभएर केवल फाइल नेम मात्र छ भने `http://test.edifynepal.com/media/kyc_documents/` सँग जोड्न सक्नुहुन्छ */}
              {kycData.documentName ? (
                <>
                  <img
                    src={
                      kycData.documentName.startsWith("http") 
                        ? kycData.documentName 
                        : `http://test.edifynepal.com/media/kyc_documents/${kycData.documentName}`
                    }
                    alt="KYC Document Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      // इमेज लोड नभएमा वा ब्रोकेन लिंक भएमा फलब्याक व्यवस्था
                      (e.target as HTMLImageElement).src = "https://placehold.co/600x400/f8fafc/94a3b8?text=Document+Artifact";
                    }}
                  />
                  {/* Hover Open View Overlay */}
                  <a
                    href={
                      kycData.documentName.startsWith("http") 
                        ? kycData.documentName 
                        : `http://test.edifynepal.com/media/kyc_documents/${kycData.documentName}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-1.5 text-white text-xs font-bold"
                  >
                    <Eye size={14} /> View Full Screen
                  </a>
                </>
              ) : (
                <div className="text-center p-4">
                  <FileText className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                  <p className="text-[11px] text-gray-400 font-medium">No image artifact attached</p>
                </div>
              )}
            </div>
          </div>

          {/* 📅 Created At र Updated At मितिहरू */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-gray-50/70 p-2 rounded-lg border border-gray-100">
              <span className="text-[9px] text-gray-400 flex items-center gap-1 mb-0.5">
                <Calendar className="w-3 h-3 text-gray-400" /> Submitted Date
              </span>
              <span className="text-[10px] font-bold text-gray-700 block">
                {formatDate(kycData.createdAt)}
              </span>
            </div>
            <div className="bg-gray-50/70 p-2 rounded-lg border border-gray-100">
              <span className="text-[9px] text-gray-400 flex items-center gap-1 mb-0.5">
                <Calendar className="w-3 h-3 text-gray-400" /> Approved Date
              </span>
              <span className="text-[10px] font-bold text-gray-700 block">
                {formatDate(kycData.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Retry Button if REJECTED */}
        {kycStatus === "REJECTED" && (
          <button 
            onClick={() => setKycStatus("NOT_SUBMITTED")}
            className="w-full mt-2 bg-gray-900 text-white py-2.5 rounded-lg text-xs font-bold active:scale-[0.99] transition-all"
          >
            Re-submit New KYC Form
          </button>
        )}
      </div>
    )}
  </div>
)}

        {/* HOME TAB */}
        {activeTab === "home" && (
          <div className="space-y-3 p-3">
            {isSuperAdmin && (
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded p-4 shadow-sm">
                <h3 className="font-extrabold text-red-700 text-xs tracking-wider uppercase mb-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                  Administrative Control Panel
                </h3>
                <div className="grid grid-cols-4 gap-y-5 gap-x-2 px-1">
                  <button onClick={() => router.push("/admin/users")} className="flex flex-col items-center gap-1.5 group">
                    <div className="w-14 h-14 rounded bg-white border border-red-200 shadow-sm flex items-center justify-center group-active:bg-red-600 group-active:text-white transition-colors">
                      <Users2 className="w-6 h-6 text-red-600 group-active:text-white" strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] text-gray-800 text-center font-bold leading-tight whitespace-pre-line">Manage\nUsers</span>
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 text-sm mb-4">Utility & Bill Payments</h3>
              <ServiceGrid items={services.utility} />
            </div>
            
            <div className="bg-white rounded p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 text-sm mb-4">Travels & Ticketing</h3>
              <ServiceGrid items={services.travel} />
            </div>

            <div className="bg-white rounded p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 text-sm mb-4">Insurance</h3>
              <div className="grid grid-cols-4 gap-y-5 gap-x-2 px-1">
                {services.insurance.map((s, i) => {
                  const Icon = s.icon;
                  const colors = ["bg-green-50 text-green-600", "bg-blue-50 text-blue-600", "bg-purple-50 text-purple-600", "bg-red-50 text-red-600"];
                  return (
                    <button key={i} className="flex flex-col items-center gap-1.5 group">
                      <div className={`w-14 h-14 rounded flex items-center justify-center border border-gray-100 ${colors[i].split(' ')[0]}`}>
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
          { 
            id: "kyc", 
            icon: UserCheck, 
            label: kycStatus === "NOT_SUBMITTED" ? "KYC" : "View KYC" 
          },
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