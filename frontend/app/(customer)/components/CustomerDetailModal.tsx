"use client";

import React from "react";
import { Modal } from "antd";
import { ProductDto, CategoryDto } from "@/app/(admin)/admin/products/models/dashboard-models";
import { ProductPreviewCard } from "@/app/(admin)/admin/products/components/ProductPreviewCard";

interface CustomerDetailModalProps {
  product: ProductDto | null;
  categories: CategoryDto[];
  onClose: () => void;
}

/**
 * Minimalist details modal for customer view, removing footer action buttons
 * and utilizing the built-in top-right X for closing.
 */
export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  product,
  categories,
  onClose,
}) => {
  return (
    <Modal
      open={!!product}
      title={<span className="text-lg font-bold text-gray-800">Chi tiết ưu đãi đặc biệt</span>}
      onCancel={onClose}
      footer={null}
      width={750}
      destroyOnHidden
    >
      <div className="py-4 border-t border-gray-100 mt-4">
        {product && (
          <ProductPreviewCard
            product={product}
            categories={categories}
            isAdmin={false} // Shows the CTA Buy Now button
          />
        )}
      </div>
    </Modal>
  );
};

export default CustomerDetailModal;
