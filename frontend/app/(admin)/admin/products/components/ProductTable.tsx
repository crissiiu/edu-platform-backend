"use client";

import React, { useState } from "react";
import { Table, Tag, Space, Button, Popconfirm, Avatar, Badge, Modal } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { ProductDto, CategoryDto } from "../models/dashboard-models";
import { useDashboardStore } from "../stores/dashboard-store";
import { formatCurrency } from "@/shared/utils/number-formatter";
import { ProductPreviewCard } from "./ProductPreviewCard";
import { TableSkeleton } from "@/shared/components/skeleton";

interface ProductTableProps {
  products: ProductDto[];
  loading: boolean;
  onDelete: (id: string) => void;
  categories: CategoryDto[];
}

/**
 * Ant Design Table for listing products in Admin view.
 * Action column only contains the affiliate link.
 * Clicking a row opens a details Modal with Delete/Edit actions and no Close button at the bottom.
 * Renders TableSkeleton when in loading state.
 */
export const ProductTable: React.FC<ProductTableProps> = ({ products, loading, onDelete, categories }) => {
  const openUpdateModal = useDashboardStore((state) => state.openUpdateModal);
  const [previewProduct, setPreviewProduct] = useState<ProductDto | null>(null);

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

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "Name",
      key: "Name",
      render: (text: string, record: ProductDto) => (
        <Space size="middle">
          <Badge count={record.DiscountPercentage > 0 ? `${record.DiscountPercentage}%` : 0} color="#ff4d4f" offset={[-2, 45]}>
            <Avatar
              shape="square"
              size={56}
              src={record.ImageUrl}
              alt={text}
              className="border border-gray-100 shadow-sm rounded-lg"
            />
          </Badge>
          <div className="flex flex-col max-w-[240px]">
            <span className="font-semibold text-gray-800 line-clamp-2 leading-tight">{text}</span>
            <span className="text-xs text-gray-400 mt-1">ID: {record.Id}</span>
          </div>
        </Space>
      ),
    },
    {
      title: "Nền tảng",
      dataIndex: "SourcePlatform",
      key: "SourcePlatform",
      render: (platform: string) => (
        <Tag color={getSourcePlatformColor(platform)} className="font-medium uppercase">
          {platform}
        </Tag>
      ),
    },
    {
      title: "Giá gốc",
      dataIndex: "OriginalPrice",
      key: "OriginalPrice",
      render: (price: number) => (
        <span className="text-gray-400 line-through text-xs block">{formatCurrency(price)}</span>
      ),
    },
    {
      title: "Giá hiện tại",
      dataIndex: "CurrentPrice",
      key: "CurrentPrice",
      render: (price: number) => (
        <span className="font-bold text-indigo-600 text-sm">{formatCurrency(price)}</span>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "CategoryId",
      key: "CategoryId",
      render: (catId: string) => {
        const found = categories.find((c) => c.Id === catId);
        return <Tag color="default">{found ? found.Name : catId}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center" as const,
      render: (_: any, record: ProductDto) => (
        <Button
          type="text"
          icon={<LinkOutlined />}
          href={record.AffiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-gray-400 hover:text-indigo-600"
          title="Xem liên kết tiếp thị"
        />
      ),
    },
  ];

  // Render TableSkeleton during load states
  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={products.map((p) => ({ ...p, key: p.Id }))}
        onRow={(record) => ({
          onClick: () => setPreviewProduct(record),
        })}
        rowClassName={() => "cursor-pointer hover:bg-indigo-50/10 transition-colors"}
        className="shadow-md rounded-xl overflow-hidden border border-gray-200/50 bg-white"
        pagination={false}
      />

      {/* Product Detail Preview & Deletion Modal */}
      <Modal
        open={!!previewProduct}
        title={<span className="text-lg font-bold text-gray-800">Chi tiết sản phẩm liên kết</span>}
        onCancel={() => setPreviewProduct(null)}
        footer={[
          <Popconfirm
            key="delete"
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống?"
            onConfirm={() => {
              if (previewProduct) {
                onDelete(previewProduct.Id);
                setPreviewProduct(null);
              }
            }}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="primary" danger className="rounded-lg font-medium">
              Xóa sản phẩm
            </Button>
          </Popconfirm>,
          <Button
            key="edit"
            className="rounded-lg hover:border-amber-500 hover:text-amber-500 font-medium"
            onClick={() => {
              if (previewProduct) {
                openUpdateModal(previewProduct);
                setPreviewProduct(null);
              }
            }}
          >
            Chỉnh sửa
          </Button>,
        ]}
        width={750}
        destroyOnHidden
      >
        <div className="py-4 border-t border-gray-100 mt-4">
          {previewProduct && (
            <ProductPreviewCard product={previewProduct} categories={categories} isAdmin={true} />
          )}
        </div>
      </Modal>
    </>
  );
};

export default ProductTable;
