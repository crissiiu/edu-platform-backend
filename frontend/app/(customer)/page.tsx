"use client";

import React, { useState, useEffect } from "react";
import { Empty, Input } from "antd";
import { SearchOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { useGetProducts, useGetCategories } from "@/app/(admin)/admin/products/hooks/use-dashboard-data";
import { ProductDto } from "@/app/(admin)/admin/products/models/dashboard-models";
import { StoreHeader } from "./components/StoreHeader";
import { CategoryFilters } from "./components/CategoryFilters";
import { CustomerProductCard } from "./components/CustomerProductCard";
import { CustomerDetailModal } from "./components/CustomerDetailModal";
import { GridSkeleton } from "@/shared/components/skeleton";

/**
 * Customer Storefront Home Page.
 * Implements Creator Gold-White layout theme, load-more pagination,
 * and passes matching database items for Shopee Autocomplete recommendations.
 */
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [productsList, setProductsList] = useState<ProductDto[]>([]);
  const pageSize = 8; // 8 items fits perfectly for KOLS link-board columns

  // Reset page number and clear list when search query or category filters change
  useEffect(() => {
    setPageNumber(1);
  }, [searchQuery, selectedCategory]);

  // Query paginated items based on active page number
  const { data: paginatedData, isFetching: isProductsFetching, isLoading: isProductsLoading } = useGetProducts(
    pageNumber,
    pageSize,
    selectedCategory,
    searchQuery
  );

  // Fetch all categories for filter chips
  const { data: categories = [], isLoading: isCategoriesLoading } = useGetCategories();

  // Load a large list of products to serve as search dropdown suggestions
  const { data: suggestionsData } = useGetProducts(1, 100);
  const productsForSuggestions = suggestionsData?.Items || [];

  const isLoading = isProductsLoading || isCategoriesLoading;
  const isFetchingNext = isProductsFetching && pageNumber > 1;

  // Append new page items to cumulative list safely
  useEffect(() => {
    if (paginatedData) {
      if (pageNumber === 1) {
        setProductsList(paginatedData.Items);
      } else {
        setProductsList((prev) => {
          const existingIds = new Set(prev.map((p) => p.Id));
          const newItems = paginatedData.Items.filter((p) => !existingIds.has(p.Id));
          return [...prev, ...newItems];
        });
      }
    }
  }, [paginatedData, pageNumber]);

  const totalCount = paginatedData?.TotalCount || 0;
  const hasMore = productsList.length < totalCount;

  const handleLoadMore = () => {
    if (hasMore && !isProductsFetching) {
      setPageNumber((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col antialiased">
      {/* Autocomplete-supported Search Header */}
      <StoreHeader
        onSearchSubmit={setSearchQuery}
        productsListForSuggestions={productsForSuggestions}
      />

      {/* Modern KOLS / Influencer Bio Banner */}
      <section className="bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-white py-14 px-4 border-b border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-4">
          {/* Pulsing Avatar Frame */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 animate-ping opacity-25"></div>
            <div className="relative w-20 h-20 rounded-full border-4 border-white bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl font-black">DH</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm">
                ⚡ Tech Curator
              </span>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm">
                💸 Săn Deal Cực Rẻ
              </span>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm">
                ✨ Đã Đánh Giá
              </span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">KÊNH DEAL TUYỂN CHỌN CỦA DH</h1>
            <p className="text-gray-500 max-w-md mx-auto text-xs font-semibold leading-relaxed">
              Nơi mình tổng hợp mọi sản phẩm ngon-bổ-rẻ mà mình đã dùng thử, review và săn mã giảm giá trực tiếp từ Shopee, Lazada. Mua qua link dưới để có giá cực hời nha! 👇
            </p>
          </div>
        </div>
      </section>

      {/* Main content grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Mobile Search input */}
        <div className="sm:hidden">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Tìm kiếm sản phẩm..."
            className="rounded-xl bg-gray-50 border-gray-200 h-10 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
          />
        </div>

        {/* Minimal Category Chips Filters */}
        <CategoryFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Product Cards Grid Area */}
        {isLoading && pageNumber === 1 ? (
          <GridSkeleton items={8} />
        ) : productsList.length === 0 ? (
          <div className="py-20 flex items-center justify-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <Empty description="Chưa có deal sản phẩm nào được đề xuất" />
          </div>
        ) : (
          <>
            {/* Creator link-board 4-column layout grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productsList.map((product) => (
                <CustomerProductCard
                  key={product.Id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-8">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isProductsFetching}
                  className="px-8 py-3 bg-white hover:bg-amber-500 hover:text-white text-amber-600 border-2 border-amber-400 hover:border-amber-500 font-bold rounded-xl shadow-md shadow-amber-500/5 transition-all duration-200 active:scale-95 disabled:opacity-50"
                >
                  {isFetchingNext ? "Đang tải thêm..." : "Xem thêm sản phẩm"}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Customer Product Detail View Modal */}
      <CustomerDetailModal
        product={selectedProduct}
        categories={categories}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-150/70 py-6 mt-12 text-center text-xs text-gray-400 font-semibold">
        <p>© 2026 Deal Hub - Affiliate Aggregator Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
