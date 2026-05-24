"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfigProvider } from "antd";

import { toast } from "sonner";
import axiosInstance from "@/lib/config/axios.config";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [gender, setGender] = useState<"Male" | "Female" | "Other" | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      mobileNumber: "",
      agreeTerms: false,
    },
  });

  const onSubmit = async (data: any) => {
    if (!gender) {
      toast.error("Please select your gender");
      return;
    }
    if (!data.agreeTerms) {
      toast.error("You must agree to the Terms & Conditions");
      return;
    }

    setIsLoading(true);
    try {
      const payload = { ...data, gender };
      await axiosInstance.post("/auth/register-editor", payload);
      toast.success(<strong>Registration Successful!</strong>, {
        description: "Your account has been created instantly.",
      });
      router.push("/login");
    } catch (exception: any) {
      const errorMsg = exception.response?.data?.message || "Registration failed. Try again.";
      toast.error(<strong>Error !!</strong>, { description: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#F67F02",
          borderRadius: 2,
          controlHeight: 38,
        },
      }}
    >
      <div className="h-screen w-full flex items-center justify-center bg-gray-900/40 font-sans p-2 sm:p-4 overflow-hidden">
        {/* Main Split Container - Reduced height to fit completely inside viewport */}
        <div className="w-full max-w-[900px] h-[92vh] max-h-[540px] bg-white rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
          
          {/* Close Button Top Right */}
          <button 
            type="button" 
            onClick={() => router.back()} 
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
                Way to recharge your mobile & make utility bill payments instantly via SabitriPay.
              </p>
            </div>

            <div className="flex gap-1.5 mt-4">
              <span className="h-1 w-6 bg-white/40 rounded-full overflow-hidden">
                <span className="block h-full w-1/2 bg-white rounded-full"></span>
              </span>
              <span className="h-1 w-6 bg-white/30 rounded-full"></span>
            </div>
          </div>

          {/* RIGHT SIDE: Form Layout */}
          <div className="w-full md:w-[58%] p-6 md:p-8 flex flex-col justify-center overflow-y-auto md:overflow-hidden">
            <div className="mb-4">
              <h1 className="text-xl font-bold text-gray-700">Registration</h1>
              <p className="text-[11px] text-orange-500 font-medium mt-0.5">
                Register and Get your Free Mobile Account Instantly!
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
              
              {/* Row 1: Full Name & Email (Grid view to save massive vertical space) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-0.5">Full Name</label>
                  <Controller
                    control={control}
                    name="fullName"
                    rules={{ required: "Full name is required" }}
                    render={({ field }) => (
                      <input
                        placeholder="Enter full name"
                        type="text"
                        className="w-full border-gray-300 rounded border h-9 px-2.5 text-xs outline-none focus:border-[#F67F02]"
                        {...field}
                      />
                    )}
                  />
                  {errors.fullName && (
                    <p className="text-[10px] text-red-500 mt-0.5">{errors.fullName.message as string}</p>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-0.5">Email Address</label>
                  <Controller
                    control={control}
                    name="email"
                    rules={{ required: "Email address is required" }}
                    render={({ field }) => (
                      <input
                        placeholder="eg.youremail@example.com"
                        type="email"
                        className="w-full border-gray-300 rounded border h-9 px-2.5 text-xs outline-none focus:border-[#F67F02]"
                        {...field}
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-[10px] text-red-500 mt-0.5">{errors.email.message as string}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Mobile Number & Gender Group Component layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-0.5">Mobile Number</label>
                  <Controller
                    control={control}
                    name="mobileNumber"
                    rules={{ required: "Mobile number is required" }}
                    render={({ field }) => (
                      <input
                        placeholder="98########"
                        type="text"
                        className="w-full border-gray-300 rounded border h-9 px-2.5 text-xs outline-none focus:border-[#F67F02]"
                        {...field}
                      />
                    )}
                  />
                  {errors.mobileNumber && (
                    <p className="text-[10px] text-red-500 mt-0.5">{errors.mobileNumber.message as string}</p>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-0.5">Gender</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["Male", "Female", "Other"] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`h-9 text-[11px] font-semibold rounded transition-all text-center border ${
                          gender === g
                            ? "bg-gray-400 text-white border-gray-400 shadow-inner"
                            : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Promocode Button Compacted */}
              <div>
                <button
                  type="button"
                  className="border border-[#F67F02] text-[#F67F02] hover:bg-[#F67F02]/5 text-[11px] font-bold px-3 py-1.5 rounded transition"
                >
                  Have Promocode ?
                </button>
              </div>

              {/* Terms and Privacy Checkbox Component layout */}
              <div className="flex items-start gap-2 pt-0.5">
                <Controller
                  control={control}
                  name="agreeTerms"
                  render={({ field: { value, onChange, ...field } }) => (
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      {...field}
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                      className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 text-[#F67F02] focus:ring-[#F67F02]"
                    />
                  )}
                />
                <label htmlFor="agreeTerms" className="text-[10px] text-gray-500 leading-tight">
                  I agree to the <span className="text-[#F67F02] hover:underline cursor-pointer">Terms & Conditions</span> and <span className="text-[#F67F02] hover:underline cursor-pointer">Privacy Policy</span> of SabitriPay.
                </label>
              </div>

              {/* Captcha Simulation row layout optimized */}
              {/* <div className="border border-gray-200 rounded p-2 bg-gray-50 flex items-center justify-between max-w-[260px] h-12">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 border-gray-300 text-blue-600 rounded" id="recaptcha" />
                  <label htmlFor="recaptcha" className="text-[11px] font-medium text-gray-600">I'm not a robot</label>
                </div>
                <div className="flex flex-col items-center justify-center text-[8px] text-gray-400 leading-none">
                  <span className="text-sm">🔄</span>
                  <span>reCAPTCHA</span>
                </div>
              </div> */}

              {/* Form Action Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{ backgroundColor: "#F67F02" }}
                className="w-full h-9 text-xs font-bold shadow-md hover:opacity-90 text-white flex items-center justify-center gap-2 rounded transition-opacity"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create"
                )}
              </button>

              {/* Bottom Token Link */}
              <div className="text-center pt-0.5">
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="text-[10px] text-gray-400 hover:text-gray-600 font-bold tracking-wide"
                >
                  ALREADY HAVE TOKEN?
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </ConfigProvider>
  );
}