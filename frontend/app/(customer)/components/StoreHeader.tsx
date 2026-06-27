"use client";

import React, { useState } from "react";
import { AutoComplete, Input } from "antd";
import { SearchOutlined, SafetyCertificateOutlined, SettingOutlined } from "@ant-design/icons";
import Link from "next/link";
import { ProductDto } from "@/app/(admin)/admin/products/models/dashboard-models";

interface StoreHeaderProps {
  onSearchSubmit: (query: string) => void;
  productsListForSuggestions: ProductDto[];
}

/**
 * Gold-White header for Customer storefront.
 * Implements Shopee-style search: types suggestions instantly, but filters feed only on Enter, selection, or button click.
 */
export const StoreHeader: React.FC<StoreHeaderProps> = ({
  onSearchSubmit,
  productsListForSuggestions,
}) => {
  const [tempQuery, setTempQuery] = useState("");

  // Generate up to 5 matching search recommendations based on query
  const options = tempQuery
    ? productsListForSuggestions
        .filter((p) => p.Name?.toLowerCase().includes(tempQuery.toLowerCase()))
        .slice(0, 5)
        .map((p) => ({
          value: p.Name,
          label: (
            <div className="flex items-center justify-between py-1 text-xs text-gray-700 hover:text-amber-605 transition-colors">
              <span className="truncate max-w-[300px] font-medium">{p.Name}</span>
              <span className="text-[9px] text-gray-450 font-bold uppercase ml-2 bg-gray-100 px-1.5 py-0.5 rounded">
                {p.SourcePlatform}
              </span>
            </div>
          ),
        }))
    : [];

  const handleSelect = (value: string) => {
    setTempQuery(value);
    onSearchSubmit(value);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchSubmit(tempQuery);
    }
  };

  const handleClear = () => {
    setTempQuery("");
    onSearchSubmit("");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md shadow-amber-500/10 transition-transform group-hover:scale-105">
            <SafetyCertificateOutlined className="text-white text-xl" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent leading-none">
              DEAL HUB
            </span>
            <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mt-0.5">
              Creator Aggregator
            </span>
          </div>
        </Link>

        {/* Shopee-style Autocomplete Search bar */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="flex w-full items-center">
            <AutoComplete
              options={options}
              onSelect={handleSelect}
              value={tempQuery}
              onChange={(val) => setTempQuery(val)}
              className="w-full"
              popupClassName="rounded-xl border border-gray-100 shadow-xl"
            >
              <Input
                placeholder="Tìm sản phẩm hot, thương hiệu..."
                className="rounded-l-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border-gray-200 hover:border-amber-300 focus:border-amber-500 h-10 transition-all shadow-inner text-sm"
                onKeyDown={handleSearchKeyPress}
                allowClear={{
                  clearIcon: (
                    <span onClick={handleClear} className="text-gray-400 cursor-pointer text-xs">✕</span>
                  )
                }}
              />
            </AutoComplete>
            <button
              onClick={() => onSearchSubmit(tempQuery)}
              className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white font-bold h-10 px-5 rounded-r-full shadow-md shadow-amber-500/10 transition-all flex items-center justify-center active:scale-[0.98]"
            >
              <SearchOutlined className="text-base" />
            </button>
          </div>
        </div>

        {/* Admin Section Redirect */}
        <Link href="/admin/products">
          <button
            type="button"
            className="flex items-center gap-1.5 px-4 h-10 border border-gray-200 hover:border-amber-400 hover:text-amber-600 rounded-full font-semibold text-gray-600 transition-all active:scale-95 text-sm bg-white"
          >
            <SettingOutlined />
            <span>Quản trị</span>
          </button>
        </Link>
      </div>
    </header>
  );
};

export default StoreHeader;
