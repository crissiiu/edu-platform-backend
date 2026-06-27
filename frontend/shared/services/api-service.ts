import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { useAppStore } from "@/shared/stores/app-store";
import { toastError } from "@/shared/utils/error-handler";

// Extend Axios request configuration interface to support custom properties
declare module "axios" {
  export interface AxiosRequestConfig {
    skipErrorToast?: boolean;
    skipAuthHeader?: boolean;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const apiService: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Attach bearer token if available
apiService.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Option to skip authorization header if needed
    if (config.skipAuthHeader) return config;

    const token = useAppStore.getState().accessToken;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle success and error centrally
apiService.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return the core data payload
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig;
    
    // Handle 401 Unauthorized (Token expired / invalid)
    if (error.response?.status === 401) {
      // Clear authentication state
      useAppStore.getState().clearAuth();
      
      // Redirect to login page in client environment
      if (typeof window !== "undefined") {
        const isLoginPage = window.location.pathname === "/login";
        if (!isLoginPage) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        }
      }
    }

    // Trigger global error toast unless explicitly opted out
    if (!originalRequest?.skipErrorToast) {
      toastError(error);
    }

    return Promise.reject(error);
  }
);

export default apiService;
