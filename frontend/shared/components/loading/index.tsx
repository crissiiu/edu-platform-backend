"use client";

import React from "react";

/**
 * Modern Spinner component with active ring animations.
 */
export const Spinner: React.FC<{ size?: "sm" | "md" | "lg"; className?: string }> = ({
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-t-indigo-600 border-r-transparent border-b-indigo-600 border-l-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${sizeClasses[size]} ${className}`}
      role="status"
    />
  );
};

/**
 * Full-page glassmorphic Loading screen.
 */
export const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-md transition-all duration-300">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" className="text-indigo-600" />
        <span className="text-sm font-semibold text-gray-500 tracking-wide animate-pulse">
          Đang tải dữ liệu...
        </span>
      </div>
    </div>
  );
};

export default PageLoader;
