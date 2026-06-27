"use client";

import React from "react";
import { Layout } from "antd";

const { Content } = Layout;

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Shared layout for all auth routes (login, register, forgot).
 * Implements a modern gradient background and glassmorphism container card.
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Layout className="min-h-screen bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 flex items-center justify-center p-4">
      {/* Background decoration circles */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl -z-10 animate-pulse duration-10000" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl -z-10 animate-pulse duration-8000" />
      
      <Content className="w-full max-w-[420px] bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 p-8 md:p-10 flex flex-col relative overflow-hidden">
        {/* Subtle top border line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        
        <div className="flex justify-center mb-6">
          <span className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-600/30">
            A
          </span>
        </div>
        {children}
      </Content>
    </Layout>
  );
}
