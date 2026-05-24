import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = "http://localhost:9000/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});


// axiosInstance.interceptors.request.use((config) => {
//   const token = Cookies.get("auth_token");
//   if
// })

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth_token");
    

    const url = config.url?.toLowerCase() || "";
    const isAuthRoute = url.includes("/login") || url.includes("/register");

    if (token && !isAuthRoute) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      
      delete config.headers["Authorization"];
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);


export const publicAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;