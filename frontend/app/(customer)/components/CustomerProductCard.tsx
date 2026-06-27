"use client";

import React from "react";
import { Tag } from "antd";
import { StarFilled, ShoppingCartOutlined, FireOutlined } from "@ant-design/icons";
import { ProductDto } from "@/app/(admin)/admin/products/models/dashboard-models";
import { formatCurrency } from "@/shared/utils/number-formatter";

interface CustomerProductCardProps {
  product: ProductDto;
  onClick: () => void;
}

/**
 * Creator-style Product card with highly visual Pinterest/Beacons layout,
 * featuring playful Gen Z emoji tags, big rounded margins, and instant CTA buttons.
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

  const getInfluencerBadge = (id: string) => {
    const charCodeSum = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return charCodeSum % 2 === 0 ? "🔥 Rẻ Hủy Diệt" : "💖 Cực Phẩm Đáng Mua";
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-amber-350 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between h-[390px] group"
    >
      {/* Product Image Backdrop Area */}
      <div className="relative w-full h-[200px] bg-gray-50/40 flex items-center justify-center overflow-hidden border-b border-gray-100">
        <img
          src={product.ImageUrl}
          alt={product.Name}
          className="max-w-full max-h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top-left reviewer recommended badge */}
        <div className="absolute top-3 left-3 bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <StarFilled />
          <span>Editor's Pick</span>
        </div>

        {/* Gold Discount badge top-right */}
        {product.DiscountPercentage > 0 && (
          <div className="absolute top-0 right-0 bg-gradient-to-bl from-amber-500 to-yellow-400 text-white text-xs font-black px-3.5 py-2 rounded-bl-2xl shadow-sm">
            -{product.DiscountPercentage}%
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3 bg-white">
        <div className="space-y-1">
          {/* Curation tag & Platform badge */}
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-amber-600 flex items-center gap-0.5 tracking-wide">
              {getInfluencerBadge(product.Id)}
            </span>
            <Tag color={getSourcePlatformColor(product.SourcePlatform)} className="text-[9px] font-black uppercase px-1.5 py-0 border-none m-0 shadow-sm">
              {product.SourcePlatform}
            </Tag>
          </div>

          {/* Product Name (Clamped to 2 lines) */}
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors pt-0.5">
            {product.Name}
          </h3>
        </div>

        {/* Price display & Gold Direct Link CTA Button */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between pt-1.5 border-t border-gray-100/50">
            <div className="flex flex-col">
              {product.OriginalPrice > product.CurrentPrice && (
                <span className="text-[10px] text-gray-400 line-through">
                  {formatCurrency(product.OriginalPrice)}
                </span>
              )}
              <span className="text-lg font-black text-amber-600 leading-none">
                {formatCurrency(product.CurrentPrice)}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-bold flex items-center gap-0.5">
              <FireOutlined className="text-red-500" />
              <span>Đã check ✓</span>
            </span>
          </div>

          {/* Direct Affiliate Redirect Button (Pill-shaped gold gradient) */}
          <a
            href={product.AffiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full h-10 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white text-xs font-black rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.98]"
          >
            <ShoppingCartOutlined className="text-sm" />
            <span>MÚC NGAY ↗</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CustomerProductCard;
