import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AppState {
  accessToken: string | null;
  userInfo: UserInfo | null;
  sidebarCollapsed: boolean;
  themeMode: "light" | "dark";
  
  setAuth: (token: string, user: UserInfo) => void;
  clearAuth: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setThemeMode: (mode: "light" | "dark") => void;
}

// Helper to ensure safe window.localStorage check for SSR
const safeStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(name);
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(name, value);
  },
  removeItem: (name: string): void => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(name);
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      accessToken: null,
      userInfo: null,
      sidebarCollapsed: false,
      themeMode: "light",
      
      setAuth: (token, user) => set({ accessToken: token, userInfo: user }),
      clearAuth: () => set({ accessToken: null, userInfo: null }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setThemeMode: (mode) => set({ themeMode: mode }),
    }),
    {
      name: "affiliate-aggregator-app-store",
      storage: createJSONStorage(() => safeStorage),
    }
  )
);

/**
 * Custom hook to safely use Zustand persisted state in Next.js SSR.
 * Usage: const userInfo = useAppStoreHydrated(state => state.userInfo);
 */
import { useState, useEffect } from "react";

export function useAppStoreHydrated<U>(selector: (state: AppState) => U): U | undefined {
  const result = useAppStore(selector);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? result : undefined;
}

export default useAppStore;
