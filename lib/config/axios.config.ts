import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: "https://test.edifynepal.com/api", // तपाईँको ब्याकइन्ड बेस URL
});

// रिक्वेस्ट पठाउनु अघि टोकन इन्जेक्ट गर्ने इन्टरसेप्टर
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;