"use client";

import React from "react";
import { Tag } from "antd";
import { ProductDto } from "@/app/(admin)/admin/products/models/dashboard-models";
import { formatCurrency } from "@/shared/utils/number-formatter";

interface CustomerProductCardProps {
  product: ProductDto;
  onClick: () => void;
}

/**
 * Shopee-style product card for the Customer Storefront.
 * Features an aspect-square image area, discount ribbon, two-line clamped title,
 * and Shopee orange styled price values.
 */
export const CustomerProductCard: React.FC<CustomerProductCardProps> = ({ product, onClick }) => {
  const getSourcePlatformColor = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case "shopee":
        return "orange";
      case "lazada":
        return "blue";
      case "tiki":
        return "cyan";
      default:
        return "purple";
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-orange-200 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-[340px] group"
    >
      {/* Product Image Area */}
      <div className="relative w-full h-[180px] bg-gray-50 flex items-center justify-center overflow-hidden">
        <img
          src={product.ImageUrl}
          alt={product.Name}
          className="max-w-full max-h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Discount Ribbon Tag */}
        {product.DiscountPercentage > 0 && (
          <div className="absolute top-0 right-0 bg-red-500 text-white text-[11px] font-extrabold px-2 py-1 rounded-bl-lg shadow-sm">
            -{product.DiscountPercentage}%
          </div>
        )}
      </div>

      {/* Product Details Area */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          {/* Platform Tag */}
          <div className="flex items-center justify-between">
            <Tag color={getSourcePlatformColor(product.SourcePlatform)} className="text-[10px] font-bold uppercase px-1.5 py-0">
              {product.SourcePlatform}
            </Tag>
          </div>

          {/* Product Name (Clamped to 2 lines) */}
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors pt-1">
            {product.Name}
          </h3>
        </div>

        {/* Pricing & Footer Area */}
        <div className="mt-2 pt-2 border-t border-gray-50">
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.OriginalPrice > product.CurrentPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatCurrency(product.OriginalPrice)}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-base font-extrabold text-orange-600">
              {formatCurrency(product.CurrentPrice)}
            </span>
            <span className="text-[11px] text-gray-400 italic">Đã bán 9.9k+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProductCard;
