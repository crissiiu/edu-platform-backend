"use client";

import React from "react";

/**
 * Pulse skeleton mimicking an Admin table view.
 */
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white border border-gray-200/50 rounded-xl overflow-hidden shadow-md animate-pulse">
      {/* Header row */}
      <div className="h-12 bg-gray-50 border-b border-gray-150 flex items-center px-6 gap-4">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/12"></div>
        <div className="h-4 bg-gray-200 rounded w-1/12"></div>
        <div className="h-4 bg-gray-200 rounded w-1/12"></div>
        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        <div className="h-4 bg-gray-200 rounded w-1/12 ml-auto"></div>
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="h-20 border-b border-gray-100 flex items-center px-6 gap-4">
          <div className="flex items-center gap-3 w-1/3">
            <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
            <div className="flex flex-col gap-2 w-2/3">
              <div className="h-4 bg-gray-200 rounded w-11/12"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/12"></div>
          <div className="h-4 bg-gray-200 rounded w-1/12"></div>
          <div className="h-4 bg-gray-200 rounded w-1/12"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-8 bg-gray-200 rounded w-1/12 ml-auto"></div>
        </div>
      ))}
    </div>
  );
};

/**
 * Pulse skeleton mimicking Shopee style product card grid.
 */
export const GridSkeleton: React.FC<{ items?: number }> = ({ items = 12 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: items }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl border border-gray-200/50 shadow-sm overflow-hidden flex flex-col h-[320px] animate-pulse"
        >
          <div className="w-full h-[180px] bg-gray-200"></div>
          <div className="p-3 flex-1 flex flex-col gap-2 justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-11/12"></div>
              <div className="h-4 bg-gray-200 rounded w-8/12"></div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="h-4 bg-gray-200 rounded w-5/12"></div>
              <div className="h-3 bg-gray-200 rounded w-3/12"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-full mt-2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;
