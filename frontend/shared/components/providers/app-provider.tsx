"use client";

import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { antdTheme } from "@/infrastructure/theme";
import { queryClient } from "@/shared/services/query-client";

interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * Global AppProvider wrapping all necessary contexts for SSR compatibility in Next.js 16.
 * Integrated with Ant Design Registry, custom theme settings, React Query and Hot Toasts.
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <AntdRegistry>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={antdTheme}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#333",
                color: "#fff",
                borderRadius: "8px",
              },
            }}
          />
        </ConfigProvider>
      </QueryClientProvider>
    </AntdRegistry>
  );
};

export default AppProvider;
