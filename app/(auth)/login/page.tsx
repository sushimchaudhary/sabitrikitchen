"use client"

import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Loader2, X, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfigProvider } from "antd";
import { toast } from "sonner";
import Cookies from "js-cookie";
import axiosInstance from "@/lib/config/axios.config";

// १. Form Data को लागि स्ट्रिक्ट Type Interface थपिएको
interface LoginFormInputs {
  sabitriId: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // २. useForm मा Type Interface एप्लाई गरिएको
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    defaultValues: {
      sabitriId: "",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
  const token = Cookies.get("auth_token");
  if (token) {
    router.replace("/dashboard");
  }
}, [router]);

 const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // १. पुराना कुकिज सफा गर्ने
      Cookies.remove("auth_token");
      Cookies.remove("user_info"); 
      Cookies.remove("refresh_token");

      const payload = {
        username: data.sabitriId,
        password: data.password,
      };

      // २. लगिन रिक्वेस्ट
      const response = await axiosInstance.post("/auth/login/", payload);
      
      const token = response.data?.access; 
      const userData = response.data?.user; 

      if (!token) {
        throw new Error("Access token not found in response.");
      }

      // ३. कुकिजमा डेटा सेभ गर्ने (SameSite 'lax' वा 'strict' राख्ने तर ड्यासबोर्ड रिडाइरेक्टका लागि lax बढी सुरक्षित मानिन्छ)
      Cookies.set("auth_token", token, { expires: 1, sameSite: "lax" });
      
      if (userData) {
        Cookies.set("user_info", JSON.stringify(userData), { expires: 1, sameSite: "lax" });
      }

      if (response.data?.refresh) {
        Cookies.set("refresh_token", response.data.refresh, { expires: 7, sameSite: "lax" });
      }

      // ४. हेडर अपडेट
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // ५. सफल टोस्ट म्यासेज
      const username = userData?.username || "User";
      toast.success(<strong>Welcome Back!</strong>, {
        description: `Logged in successfully as ${username}.`,
      });

      // 🌟 ६. ड्यासबोर्डमा हार्ड रिडाइरेक्ट (यसले कुकी मिस हुने समस्या सतप्रतिशत हटाउँछ)
      window.location.href = "/dashboard";
      
    } catch (exception: any) {
      const errorMsg = exception.response?.data?.message || "Invalid credentials. Try again.";
      toast.error(<strong>Login Failed !!</strong>, { description: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#F67F02",
          borderRadius: 6,
          controlHeight: 38,
        },
      }}
    >
      <div className="h-screen w-full flex items-center justify-center bg-gray-900/40 font-sans p-2 sm:p-4 overflow-hidden">
        {/* Main Split Container */}
        <div className="w-full max-w-[900px] h-[90vh] max-h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
          
          {/* Close Button */}
          <button 
            type="button" 
            onClick={() => router.push("/login")} 
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X size={18} />
          </button>

          {/* LEFT SIDE: Brand Orange Banner */}
          <div className="w-full md:w-[42%] bg-[#F67F02] p-8 flex flex-col justify-between text-white relative hidden md:flex">
            <div>
              <div className="flex items-center gap-1 text-xl font-bold tracking-tight mb-12">
                <span className="italic font-extrabold">Sabitri</span>Pay
              </div>
              
              <h2 className="text-2xl font-bold leading-tight mb-3">
                Simple & Fast Payment
              </h2>
              
              <p className="text-white/90 text-xs leading-relaxed max-w-[240px]">
                Sign in to manage your wallets, top-up bills, and handle transactions instantly.
              </p>
            </div>

            <div className="flex gap-1.5 mt-4">
              <span className="h-1 w-6 bg-white/40 rounded-full overflow-hidden">
                <span className="block h-full w-1/2 bg-white rounded-full"></span>
              </span>
              <span className="h-1 w-6 bg-white/30 rounded-full"></span>
            </div>
          </div>

          {/* RIGHT SIDE: Login Form Layout */}
          <div className="w-full md:w-[58%] p-6 md:p-10 flex flex-col justify-center">
            <div className="mb-5">
              <h1 className="text-xl font-bold text-gray-700">Welcome Back</h1>
              <p className="text-[11px] text-orange-500 font-medium mt-0.5">
                Login to access your SabitriPay Secure Wallet!
              </p>
            </div>

            {/* ४. handleSubmit भित्र सिधै onSubmit पास गरियो */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              
              {/* Sabitri ID / Mobile field */}
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">Sabitri ID / Mobile Number</label>
                <Controller
                  control={control}
                  name="sabitriId"
                  rules={{ required: "Sabitri ID or mobile number is required" }}
                  render={({ field }) => (
                    <input
                      placeholder="Enter Sabitri ID or 98########"
                      type="text"
                      className="w-full border-gray-300 rounded border h-9.5 px-3 text-xs outline-none focus:border-[#F67F02]"
                      {...field}
                    />
                  )}
                />
                {errors.sabitriId && (
                  <p className="text-[10px] text-red-500 mt-0.5">{errors.sabitriId.message}</p>
                )}
              </div>

              {/* Password field with Eye Toggle Icon */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-gray-600 block">Password</label>
                  <button 
                    type="button"
                    onClick={() => router.push("/forgot-password")}
                    className="text-[10px] text-[#F67F02] hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Controller
                    control={control}
                    name="password"
                    rules={{ required: "Password is required" }}
                    render={({ field }) => (
                      <input
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
                        className="w-full border-gray-300 rounded border h-9.5 pl-3 pr-9 text-xs outline-none focus:border-[#F67F02]"
                        {...field}
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[10px] text-red-500 mt-0.5">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-2 pt-0.5">
                <Controller
                  control={control}
                  name="rememberMe"
                  render={({ field: { value, onChange, ...field } }) => (
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-[#F67F02] focus:ring-[#F67F02]"
                      {...field}
                    />
                  )}
                />
                <label htmlFor="rememberMe" className="text-[11px] text-gray-500 font-medium select-none cursor-pointer">
                  Keep me logged in
                </label>
              </div>

              {/* Form Action Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{ backgroundColor: "#F67F02" }}
                className="w-full h-9.5 mt-2 text-xs font-bold shadow-md hover:opacity-90 text-white flex items-center justify-center gap-2 rounded transition-opacity"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Verifying Credentials...
                  </>
                ) : (
                  "Login"
                )}
              </button>

              {/* Redirect Action to Register Form */}
              <div className="text-center pt-2 border-t border-gray-100 mt-4">
                <p className="text-[11px] text-gray-400">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/register")}
                    className="text-[#F67F02] font-bold hover:underline"
                  >
                    CREATE ACCOUNT
                  </button>
                </p>
              </div>

            </form>
          </div>

        </div>
      </div>
    </ConfigProvider>
  );
}