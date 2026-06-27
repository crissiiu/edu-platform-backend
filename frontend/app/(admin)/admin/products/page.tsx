"use client";

import React, { useState } from "react";
import { Breadcrumb, Pagination } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { ProductTable } from "./components/ProductTable";
import { ProductModal } from "./components/ProductModal";
import { useDashboardStore } from "./stores/dashboard-store";
import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { Select } from "@/shared/components/select";
import {
  useGetProducts,
  useGetCategories,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "./hooks/use-dashboard-data";
import { CreateProductDto, UpdateProductDto } from "./models/dashboard-models";

/**
 * Admin Products Page.
 * Connects table list and filters dynamically with backend pagination and search logic.
 */
export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Zustand Store
  const openCreateModal = useDashboardStore((state) => state.openCreateModal);
  const selectedProduct = useDashboardStore((state) => state.selectedProduct);
  const closeModal = useDashboardStore((state) => state.closeModal);

  // React Query Hooks (Server-side paginated queries)
  const { data: paginatedData, isLoading: isProductsLoading, error: productsError } = useGetProducts(
    pageNumber,
    pageSize,
    selectedCategory,
    searchQuery
  );
  
  const { data: categories = [], isLoading: isCategoriesLoading, error: categoriesError } = useGetCategories();
  
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const isLoading = isProductsLoading || isCategoriesLoading;
  const error = productsError || categoriesError;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const products = paginatedData?.Items || [];
  const totalCount = paginatedData?.TotalCount || 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPageNumber(1); // Reset page number on search
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setPageNumber(1); // Reset page number on filter change
  };

  const handleSaveProduct = async (values: CreateProductDto | UpdateProductDto) => {
    if (selectedProduct) {
      await updateMutation.mutateAsync({
        id: selectedProduct.Id,
        data: values as UpdateProductDto,
      });
    } else {
      await createMutation.mutateAsync(values as CreateProductDto);
    }
    closeModal();
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { title: "Quản trị viên" },
          { title: "Quản lý sản phẩm" },
        ]}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">Danh sách sản phẩm</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý và đồng bộ trực tiếp các sản phẩm liên kết trên hệ thống</p>
        </div>
        
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 h-10 font-medium self-start sm:self-auto rounded-lg"
        >
          Thêm sản phẩm
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200/40 shadow-sm">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Tìm theo tên sản phẩm hoặc mã ID..."
          className="w-full sm:max-w-xs h-9 rounded-lg"
          value={searchQuery}
          onChange={handleSearchChange}
          allowClear
        />
        
        <Select
          defaultValue="all"
          className="w-full sm:w-48 h-9"
          onChange={handleCategoryChange}
          options={[
            { value: "all", label: "Tất cả danh mục" },
            ...categories.map((c) => ({ value: c.Id, label: c.Name })),
          ]}
          loading={isCategoriesLoading}
        />
      </div>

      {/* Error/Loading Handling & Data Table */}
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
          Không thể tải danh sách sản phẩm. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.
        </div>
      ) : (
        <>
          <ProductTable
            products={products}
            loading={isLoading || deleteMutation.isPending}
            onDelete={handleDeleteProduct}
            categories={categories}
          />
          
          {/* Server-side Pagination Controls */}
          {!isLoading && totalCount > 0 && (
            <div className="flex justify-end mt-4 bg-white p-3 rounded-xl border border-gray-150/40 shadow-sm">
              <Pagination
                current={pageNumber}
                pageSize={pageSize}
                total={totalCount}
                onChange={(page, size) => {
                  setPageNumber(page);
                  setPageSize(size);
                }}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}

      {/* Product Creation & Edit Modal */}
      <ProductModal
        confirmLoading={isSaving}
        onSave={handleSaveProduct}
        categories={categories}
      />
    </div>
  );
}
