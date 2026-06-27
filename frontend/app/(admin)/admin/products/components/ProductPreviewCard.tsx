"use client";

import React, { useState, useEffect } from "react";
import { Tag, Badge, Space, Button, Image } from "antd";
import { ShoppingCartOutlined, ZoomInOutlined } from "@ant-design/icons";
import { ProductDto, CategoryDto } from "../models/dashboard-models";
import { formatCurrency } from "@/shared/utils/number-formatter";

interface ProductPreviewCardProps {
  product: ProductDto;
  categories: CategoryDto[];
  isAdmin?: boolean;
}

/**
 * Reusable Product Detail Card for previewing products.
 * Displays image gallery with thumbnail previews and Antd zoom functionality, detailed prices, tags, and description.
 * Hides "Buy now" action buttons for admin role.
 */
export const ProductPreviewCard: React.FC<ProductPreviewCardProps> = ({
  product,
  categories,
  isAdmin = false,
}) => {
  const allImages = [product.ImageUrl, ...(product.SecondaryImages || [])].filter(Boolean);
  const [activeImage, setActiveImage] = useState(allImages[0] || "");

  // Update active image when product changes (e.g. previewing different products)
  useEffect(() => {
    const images = [product.ImageUrl, ...(product.SecondaryImages || [])].filter(Boolean);
    setActiveImage(images[0] || "");
  }, [product]);

  const foundCategory = categories.find((c) => c.Id === product.CategoryId);

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
    <div className="flex flex-col md:flex-row gap-6 p-2">
      {/* Image Gallery Column */}
      <div className="w-full md:w-1/2 flex flex-col items-center gap-4">
        {/* Main Preview Image with Ant Design Zoom */}
        <div className="relative w-full h-80 rounded-xl overflow-hidden border border-gray-150/70 bg-gray-50 flex items-center justify-center group shadow-sm transition-all duration-300">
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src={activeImage}
              alt={product.Name}
              className="max-w-full max-h-full object-contain p-2"
              preview={{
                cover: (
                  <div className="text-white flex items-center gap-2 text-sm font-medium">
                    <ZoomInOutlined /> Bấm để phóng to
                  </div>
                ),
              }}
            />
          </div>
          {product.DiscountPercentage > 0 && (
            <Badge.Ribbon
              text={`-${product.DiscountPercentage}%`}
              color="red"
              className="absolute top-0 right-0 font-bold"
            />
          )}
        </div>

        {/* Thumbnails List */}
        {allImages.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center w-full max-h-24 overflow-y-auto py-1">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onMouseEnter={() => setActiveImage(img)}
                onClick={() => setActiveImage(img)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 bg-white flex items-center justify-center p-1 transition-all duration-150 ${
                  activeImage === img ? "border-amber-500 shadow-sm" : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <img src={img} alt={`thumbnail-${idx}`} className="max-w-full max-h-full object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info Column */}
      <div className="w-full md:w-1/2 flex flex-col justify-between gap-4">
        <div className="space-y-3">
          {/* Platform & Category Tags */}
          <Space>
            <Tag color={getSourcePlatformColor(product.SourcePlatform)} className="font-semibold uppercase px-2 py-0.5">
              {product.SourcePlatform}
            </Tag>
            {foundCategory && (
              <Tag color="purple" className="px-2 py-0.5 font-medium">
                {foundCategory.Name}
              </Tag>
            )}
          </Space>

          {/* Product Name */}
          <h2 className="text-xl font-bold text-gray-900 leading-tight tracking-tight mt-1">
            {product.Name}
          </h2>

          {/* Prices block */}
          <div className="bg-gray-50/70 p-3 rounded-lg border border-gray-100 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400">Giá gốc</div>
              <div className="text-sm text-gray-400 line-through font-medium">
                {formatCurrency(product.OriginalPrice)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-amber-600 font-semibold">Giá tiếp thị liên kết</div>
              <div className="text-xl font-extrabold text-amber-600">
                {formatCurrency(product.CurrentPrice)}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Mô tả sản phẩm</span>
            <div className="text-sm text-gray-600 bg-white border border-gray-100/50 p-3 rounded-lg max-h-40 overflow-y-auto leading-relaxed shadow-inner">
              {product.Description || <span className="text-gray-400 italic">Không có mô tả chi tiết.</span>}
            </div>
          </div>
        </div>

        {/* Affiliate Action Button (Customers only) */}
        {!isAdmin && (
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            href={product.AffiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 border-none h-11 w-full text-base font-semibold rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.98] transition-all mt-4"
          >
            Mua ngay tại {product.SourcePlatform}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductPreviewCard;
