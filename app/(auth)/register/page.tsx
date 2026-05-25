// "use client";

// import React, { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { Loader2, X, Eye, EyeOff } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { ConfigProvider } from "antd";

// import { toast } from "sonner";
// import axiosInstance from "@/lib/config/axios.config";

// export default function RegisterPage() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [gender, setGender] = useState<"Male" | "Female" | "Other" | null>(null);
  
//   // पासवर्ड देखिने/लुक्ने स्टेट टगल
//   const [showPassword, setShowPassword] = useState(false);

//   const { control, handleSubmit, watch, formState: { errors } } = useForm({
//     defaultValues: {
//       fullName: "",
//       email: "",
//       mobileNumber: "",
//       password: "",
//       confirmPassword: "",
//       agreeTerms: false,
//     },
//   });

//   const passwordWatch = watch("password");

//  const onSubmit = async (data: any) => {
//     if (!gender) {
//       toast.error("Please select your gender");
//       return;
//     }
//     if (!data.agreeTerms) {
//       toast.error("You must agree to the Terms & Conditions");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const nameParts = data.fullName.trim().split(/\s+/); // स्पेसको आधारमा नाम छुट्याउने
//       const firstName = nameParts[0] || "";
//       const lastName = nameParts.slice(1).join(" ") || ""; // यदि ३ वटा नाम छ भने (जस्तै: Ram Prasad Shah), बाकी सबै Last Name मा जान्छ

//       // 🛠️ ब्याकएन्डको रियल Django मोडल अनुसार Payload तयार गरियो
//       const payload = {
//         username: data.mobileNumber, 
//         password: data.password,
//         email: data.email,
//         first_name: firstName,  // ✅ अब ब्याकइन्डमा खाली जाँदैन
//         last_name: lastName,    // ✅ अब ब्याकइन्डमा खाली जाँदैन
//         gender: gender,
//       };

//       await axiosInstance.post("/auth/register-editor/", payload);
      
//       toast.success(<strong>Registration Successful!</strong>, {
//         description: "Your account has been created instantly.",
//       });
//       router.push("/login");
//     } catch (exception: any) {
//       const apiErrors = exception.response?.data;
//       let errorMsg = "Registration failed. Try again.";
      
//       if (apiErrors && typeof apiErrors === "object") {
//         const firstKey = Object.keys(apiErrors)[0];
//         if (Array.isArray(apiErrors[firstKey])) {
//           errorMsg = `${firstKey}: ${apiErrors[firstKey][0]}`;
//         }
//       }

//       toast.error(<strong>Error !!</strong>, { description: errorMsg });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <ConfigProvider
//       theme={{
//         token: {
//           colorPrimary: "#F67F02",
//           borderRadius: 2,
//           controlHeight: 38,
//         },
//       }}
//     >
//       <div className="h-screen w-full flex items-center justify-center bg-gray-900/40 font-sans p-2 sm:p-4 overflow-hidden">
//         {/* Main Split Container */}
//         <div className="w-full max-w-[900px] h-[95vh] max-h-[620px] bg-white rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
          
//           {/* Close Button Top Right */}
//           <button 
//             type="button" 
//             onClick={() => router.back()} 
//             className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors z-10"
//           >
//             <X size={18} />
//           </button>

//           {/* LEFT SIDE: Brand Orange Banner */}
//           <div className="w-full md:w-[42%] bg-[#F67F02] p-8 flex flex-col justify-between text-white relative hidden md:flex">
//             <div>
//               <div className="flex items-center gap-1 text-xl font-bold tracking-tight mb-12">
//                 <span className="italic font-extrabold">Sabitri</span>Pay
//               </div>
              
//               <h2 className="text-2xl font-bold leading-tight mb-3">
//                 Simple & Fast Payment
//               </h2>
              
//               <p className="text-white/90 text-xs leading-relaxed max-w-[240px]">
//                 Way to recharge your mobile & make utility bill payments instantly via SabitriPay.
//               </p>
//             </div>

//             <div className="flex gap-1.5 mt-4">
//               <span className="h-1 w-6 bg-white/40 rounded-full overflow-hidden">
//                 <span className="block h-full w-1/2 bg-white rounded-full"></span>
//               </span>
//               <span className="h-1 w-6 bg-white/30 rounded-full"></span>
//             </div>
//           </div>

//           {/* RIGHT SIDE: Form Layout */}
//           <div className="w-full md:w-[58%] p-6 md:p-8 flex flex-col justify-center overflow-y-auto">
//             <div className="mb-3">
//               <h1 className="text-xl font-bold text-gray-700">Registration</h1>
//               <p className="text-[11px] text-orange-500 font-medium mt-0.5">
//                 Register and Get your Free Mobile Account Instantly!
//               </p>
//             </div>

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
              
//               {/* Row 1: Full Name & Email */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <div>
//                   <label className="text-[11px] font-bold text-gray-600 block mb-0.5">Full Name</label>
//                   <Controller
//                     control={control}
//                     name="fullName"
//                     rules={{ required: "Full name is required" }}
//                     render={({ field }) => (
//                       <input
//                         placeholder="Enter full name"
//                         type="text"
//                         className="w-full border-gray-300 rounded border h-9 px-2.5 text-xs outline-none focus:border-[#F67F02]"
//                         {...field}
//                       />
//                     )}
//                   />
//                   {errors.fullName && (
//                     <p className="text-[10px] text-red-500 mt-0.5">{errors.fullName.message as string}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="text-[11px] font-bold text-gray-600 block mb-0.5">Email Address</label>
//                   <Controller
//                     control={control}
//                     name="email"
//                     rules={{ required: "Email address is required" }}
//                     render={({ field }) => (
//                       <input
//                         placeholder="eg.youremail@example.com"
//                         type="email"
//                         className="w-full border-gray-300 rounded border h-9 px-2.5 text-xs outline-none focus:border-[#F67F02]"
//                         {...field}
//                       />
//                     )}
//                   />
//                   {errors.email && (
//                     <p className="text-[10px] text-red-500 mt-0.5">{errors.email.message as string}</p>
//                   )}
//                 </div>
//               </div>

//               {/* Row 2: Mobile Number & Gender */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <div>
//                   <label className="text-[11px] font-bold text-gray-600 block mb-0.5">Mobile Number (Username)</label>
//                   <Controller
//                     control={control}
//                     name="mobileNumber"
//                     rules={{ required: "Mobile number is required" }}
//                     render={({ field }) => (
//                       <input
//                         placeholder="98########"
//                         type="text"
//                         className="w-full border-gray-300 rounded border h-9 px-2.5 text-xs outline-none focus:border-[#F67F02]"
//                         {...field}
//                       />
//                     )}
//                   />
//                   {errors.mobileNumber && (
//                     <p className="text-[10px] text-red-500 mt-0.5">{errors.mobileNumber.message as string}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="text-[11px] font-bold text-gray-600 block mb-0.5">Gender</label>
//                   <div className="grid grid-cols-3 gap-1.5">
//                     {(["Male", "Female", "Other"] as const).map((g) => (
//                       <button
//                         key={g}
//                         type="button"
//                         onClick={() => setGender(g)}
//                         className={`h-9 text-[11px] font-semibold rounded transition-all text-center border ${
//                           gender === g
//                             ? "bg-[#F67F02] text-white border-[#F67F02] shadow-inner"
//                             : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
//                         }`}
//                       >
//                         {g}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* 🔒 Row 3: Password & Confirm Password (थपिएको नयाँ फिल्डहरू) */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <div>
//                   <label className="text-[11px] font-bold text-gray-600 block mb-0.5">Password</label>
//                   <div className="relative">
//                     <Controller
//                       control={control}
//                       name="password"
//                       rules={{ 
//                         required: "Password is required",
//                         minLength: { value: 6, message: "Password must be at least 6 characters" }
//                       }}
//                       render={({ field }) => (
//                         <input
//                           placeholder="Enter password"
//                           type={showPassword ? "text" : "password"}
//                           className="w-full border-gray-300 rounded border h-9 px-2.5 pr-8 text-xs outline-none focus:border-[#F67F02]"
//                           {...field}
//                         />
//                       )}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
//                     >
//                       {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
//                     </button>
//                   </div>
//                   {errors.password && (
//                     <p className="text-[10px] text-red-500 mt-0.5">{errors.password.message as string}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="text-[11px] font-bold text-gray-600 block mb-0.5">Confirm Password</label>
//                   <Controller
//                     control={control}
//                     name="confirmPassword"
//                     rules={{ 
//                       required: "Please confirm your password",
//                       validate: (value) => value === passwordWatch || "Passwords do not match"
//                     }}
//                     render={({ field }) => (
//                       <input
//                         placeholder="Re-enter password"
//                         type="password"
//                         className="w-full border-gray-300 rounded border h-9 px-2.5 text-xs outline-none focus:border-[#F67F02]"
//                         {...field}
//                       />
//                     )}
//                   />
//                   {errors.confirmPassword && (
//                     <p className="text-[10px] text-red-500 mt-0.5">{errors.confirmPassword.message as string}</p>
//                   )}
//                 </div>
//               </div>

//               {/* Promocode Button */}
//               <div>
//                 <button
//                   type="button"
//                   className="border border-[#F67F02] text-[#F67F02] hover:bg-[#F67F02]/5 text-[11px] font-bold px-3 py-1.5 rounded transition"
//                 >
//                   Have Promocode ?
//                 </button>
//               </div>

//               {/* Terms and Privacy Checkbox */}
//               <div className="flex items-start gap-2 pt-0.5">
//                 <Controller
//                   control={control}
//                   name="agreeTerms"
//                   render={({ field: { value, onChange, ...field } }) => (
//                     <input
//                       type="checkbox"
//                       id="agreeTerms"
//                       {...field}
//                       checked={value}
//                       onChange={(e) => onChange(e.target.checked)}
//                       className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 text-[#F67F02] focus:ring-[#F67F02]"
//                     />
//                   )}
//                 />
//                 <label htmlFor="agreeTerms" className="text-[10px] text-gray-500 leading-tight">
//                   I agree to the <span className="text-[#F67F02] hover:underline cursor-pointer">Terms & Conditions</span> and <span className="text-[#F67F02] hover:underline cursor-pointer">Privacy Policy</span> of SabitriPay.
//                 </label>
//               </div>

//               {/* Form Action Submit Button */}
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full h-9 text-xs font-bold shadow-md hover:opacity-90 text-white flex items-center justify-center gap-2 rounded transition-opacity bg-[#F67F02]"
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 size={14} className="animate-spin" />
//                     Creating Account...
//                   </>
//                 ) : (
//                   "Create"
//                 )}
//               </button>

//               {/* Bottom Token Link */}
//               <div className="text-center pt-0.5">
//                 <button
//                   type="button"
//                   onClick={() => router.push("/login")}
//                   className="text-[10px] text-gray-400 hover:text-gray-600 font-bold tracking-wide"
//                 >
//                   ALREADY HAVE AN ACCOUNT? LOGIN
//                 </button>
//               </div>

//             </form>
//           </div>

//         </div>
//       </div>
//     </ConfigProvider>
//   );
// }








"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Loader2, X, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfigProvider } from "antd";

import { toast } from "sonner";
import axiosInstance from "@/lib/config/axios.config";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 📝 केबल आवश्यक ५ वटा डिफल्ट भ्यालुहरू मात्र
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      username: "",
      password: "",
      agreeTerms: false, // यो भ्यालिडेशनको लागि मात्र राखिएको हो
    },
  });

  const onSubmit = async (data: any) => {
    if (!data.agreeTerms) {
      toast.error("You must agree to the Terms & Conditions");
      return;
    }

    setIsLoading(true);
    try {
      // 🚀 तपाईँले खोज्नुभएका ५ वटा सफा फिल्डहरू मात्र API मा जानेछन्
      const payload = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        username: data.username,
        password: data.password,
      };

      await axiosInstance.post("/auth/register-editor/", payload);
      
      toast.success(<strong>Registration Successful!</strong>, {
        description: "Your account has been created instantly.",
      });
      router.push("/login");
    } catch (exception: any) {
      const apiErrors = exception.response?.data;
      let errorMsg = "Registration failed. Try again.";
      
      if (apiErrors && typeof apiErrors === "object") {
        const firstKey = Object.keys(apiErrors)[0];
        if (Array.isArray(apiErrors[firstKey])) {
          errorMsg = `${firstKey}: ${apiErrors[firstKey][0]}`;
        }
      }

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
        {/* Main Container */}
        <div className="w-full max-w-[900px] h-[95vh] max-h-[580px] bg-white rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
          
          {/* Close Button */}
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
          <div className="w-full md:w-[58%] p-6 md:p-8 flex flex-col justify-center overflow-y-auto">
            <div className="mb-4">
              <h1 className="text-xl font-bold text-gray-700">Registration</h1>
              <p className="text-[11px] text-orange-500 font-medium mt-0.5">
                Register and Get your Free Mobile Account Instantly!
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              
              {/* Row 1: First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-0.5">First Name</label>
                  <Controller
                    control={control}
                    name="first_name"
                    rules={{ required: "First name is required" }}
                    render={({ field }) => (
                      <input
                        placeholder="First name"
                        type="text"
                        className="w-full border-gray-300 rounded border h-9 px-2.5 text-xs outline-none focus:border-[#F67F02]"
                        {...field}
                      />
                    )}
                  />
                  {errors.first_name && (
                    <p className="text-[10px] text-red-500 mt-0.5">{errors.first_name.message as string}</p>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-0.5">Last Name</label>
                  <Controller
                    control={control}
                    name="last_name"
                    rules={{ required: "Last name is required" }}
                    render={({ field }) => (
                      <input
                        placeholder="Last name"
                        type="text"
                        className="w-full border-gray-300 rounded border h-9 px-2.5 text-xs outline-none focus:border-[#F67F02]"
                        {...field}
                      />
                    )}
                  />
                  {errors.last_name && (
                    <p className="text-[10px] text-red-500 mt-0.5">{errors.last_name.message as string}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Email & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-0.5">Email Address</label>
                  <Controller
                    control={control}
                    name="email"
                    rules={{ required: "Email address is required" }}
                    render={({ field }) => (
                      <input
                        placeholder="eg.name@example.com"
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

                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-0.5">Username</label>
                  <Controller
                    control={control}
                    name="username"
                    rules={{ required: "Username is required" }}
                    render={({ field }) => (
                      <input
                        placeholder="Choose username"
                        type="text"
                        className="w-full border-gray-300 rounded border h-9 px-2.5 text-xs outline-none focus:border-[#F67F02]"
                        {...field}
                      />
                    )}
                  />
                  {errors.username && (
                    <p className="text-[10px] text-red-500 mt-0.5">{errors.username.message as string}</p>
                  )}
                </div>
              </div>

              {/* Row 3: Password */}
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-0.5">Password</label>
                <div className="relative">
                  <Controller
                    control={control}
                    name="password"
                    rules={{ 
                      required: "Password is required",
                      minLength: { value: 6, message: "Password must be at least 6 characters" }
                    }}
                    render={({ field }) => (
                      <input
                        placeholder="Enter password"
                        type={showPassword ? "text" : "password"}
                        className="w-full border-gray-300 rounded border h-9 px-2.5 pr-8 text-xs outline-none focus:border-[#F67F02]"
                        {...field}
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[10px] text-red-500 mt-0.5">{errors.password.message as string}</p>
                )}
              </div>

              {/* Promocode Button */}
              <div>
                <button
                  type="button"
                  className="border border-[#F67F02] text-[#F67F02] hover:bg-[#F67F02]/5 text-[11px] font-bold px-3 py-1.5 rounded transition"
                >
                  Have Promocode ?
                </button>
              </div>

              {/* Terms and Privacy Checkbox */}
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

              {/* Form Action Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-9 text-xs font-bold shadow-md hover:opacity-90 text-white flex items-center justify-center gap-2 rounded transition-opacity bg-[#F67F02]"
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

              {/* Bottom Login Link */}
              <div className="text-center pt-0.5">
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="text-[10px] text-gray-400 hover:text-gray-600 font-bold tracking-wide"
                >
                  ALREADY HAVE AN ACCOUNT? LOGIN
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </ConfigProvider>
  );
}