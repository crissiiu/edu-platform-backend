"use client";

import React, { useEffect } from "react";
import { Modal } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDashboardStore } from "../stores/dashboard-store";
import { CreateProductDto, UpdateProductDto, CategoryDto, productSchema } from "../models/dashboard-models";
import { Form, FormItem } from "@/shared/components/form";
import { Input, TextArea, InputNumber } from "@/shared/components/input";
import { Select } from "@/shared/components/select";
import { Button } from "@/shared/components/button";
import { zodRule } from "@/shared/utils/zod-validator";

interface ProductModalProps {
  confirmLoading: boolean;
  onSave: (values: CreateProductDto | UpdateProductDto) => void;
  categories: CategoryDto[];
}

/**
 * Custom Modal & Form for Product creation and updating.
 * Integrates reusable custom UI primitives and validates fields using Zod schemas.
 * Uses dynamic Form.List fields for manageable multiple secondary images.
 * Description textarea grows dynamically with content.
 */
export const ProductModal: React.FC<ProductModalProps> = ({ confirmLoading, onSave, categories }) => {
  const [form] = Form.useForm();
  
  const isModalOpen = useDashboardStore((state) => state.isModalOpen);
  const selectedProduct = useDashboardStore((state) => state.selectedProduct);
  const closeModal = useDashboardStore((state) => state.closeModal);
  
  const isEditMode = !!selectedProduct;

  // Auto-fill values when modal opens in edit mode
  useEffect(() => {
    if (isModalOpen) {
      if (isEditMode && selectedProduct) {
        form.setFieldsValue({
          Name: selectedProduct.Name,
          Slug: selectedProduct.Slug,
          Description: selectedProduct.Description,
          ImageUrl: selectedProduct.ImageUrl,
          OriginalPrice: selectedProduct.OriginalPrice,
          CurrentPrice: selectedProduct.CurrentPrice,
          SourcePlatform: selectedProduct.SourcePlatform,
          RawProductUrl: selectedProduct.RawProductUrl,
          AffiliateUrl: selectedProduct.AffiliateUrl,
          CategoryId: selectedProduct.CategoryId,
          SecondaryImages: selectedProduct.SecondaryImages || [],
        });
      } else {
        form.resetFields();
      }
    }
  }, [isModalOpen, isEditMode, selectedProduct, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // Filter out any blank inputs in secondary images
        const secondaryImagesArray = (values.SecondaryImages || [])
          .map((url: string) => url?.trim())
          .filter(Boolean);

        const mappedValues = {
          ...values,
          SecondaryImages: secondaryImagesArray,
        };

        if (isEditMode && selectedProduct) {
          onSave({
            ...mappedValues,
            Id: selectedProduct.Id, // Attach ID for updates
          } as UpdateProductDto);
        } else {
          onSave(mappedValues as CreateProductDto);
        }
      })
      .catch((info) => {
        console.warn("Lỗi kiểm tra biểu mẫu nhập liệu:", info);
      });
  };

  const platforms = ["Shopee", "Lazada", "Tiki", "Amazon", "Others"];

  return (
    <Modal
      open={isModalOpen}
      title={isEditMode ? "Chỉnh sửa sản phẩm liên kết" : "Thêm sản phẩm liên kết mới"}
      okText={isEditMode ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy bỏ"
      onCancel={closeModal}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        name="productForm"
        initialValues={{ SourcePlatform: "Shopee", SecondaryImages: [] }}
        className="mt-4"
      >
        <FormItem
          name="Name"
          label="Tên sản phẩm"
          rules={[zodRule(productSchema, "Name")]}
        >
          <Input placeholder="Nhập tên sản phẩm..." />
        </FormItem>

        <div className="grid grid-cols-2 gap-4">
          <FormItem
            name="Slug"
            label="Slug (Đường dẫn thân thiện)"
            rules={[zodRule(productSchema, "Slug")]}
          >
            <Input placeholder="vi-du-ten-san-pham" />
          </FormItem>

          <FormItem
            name="CategoryId"
            label="Danh mục"
            rules={[zodRule(productSchema, "CategoryId")]}
          >
            <Select placeholder="Chọn danh mục">
              {categories.map((cat) => (
                <Select.Option key={cat.Id} value={cat.Id}>
                  {cat.Name}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
        </div>

        <FormItem
          name="Description"
          label="Mô tả sản phẩm"
          rules={[zodRule(productSchema, "Description")]}
        >
          <TextArea
            autoSize={{ minRows: 3, maxRows: 10 }}
            placeholder="Mô tả ngắn gọn về sản phẩm..."
          />
        </FormItem>

        <div className="grid grid-cols-2 gap-4">
          <FormItem
            name="SourcePlatform"
            label="Nền tảng tiếp thị"
            rules={[zodRule(productSchema, "SourcePlatform")]}
          >
            <Select placeholder="Chọn nền tảng">
              {platforms.map((plat) => (
                <Select.Option key={plat} value={plat}>
                  {plat}
                </Select.Option>
              ))}
            </Select>
          </FormItem>

          <FormItem
            name="ImageUrl"
            label="Đường dẫn ảnh chính (URL)"
            rules={[zodRule(productSchema, "ImageUrl")]}
          >
            <Input placeholder="https://..." />
          </FormItem>
        </div>

        {/* Dynamic Secondary Images (Form.List) */}
        <div className="mb-4">
          <span className="text-xs font-semibold text-gray-500 block mb-2 uppercase tracking-wide">
            Đường dẫn các ảnh phụ
          </span>
          <Form.List name="SecondaryImages">
            {(fields, { add, remove }) => (
              <div className="space-y-2 bg-gray-50/50 p-3 rounded-xl border border-gray-150/40">
                {fields.map((field, index) => (
                  <div key={field.key} className="flex gap-2 items-center">
                    <FormItem
                      {...field}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Vui lòng nhập URL hoặc xóa ô này.",
                        },
                        {
                          type: "url",
                          message: "Đường dẫn ảnh phụ không đúng định dạng URL!",
                        },
                      ]}
                      noStyle
                    >
                      <Input placeholder={`Ảnh phụ #${index + 1} URL...`} />
                    </FormItem>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(field.name)}
                      className="hover:bg-red-50 rounded-lg flex items-center justify-center h-10 w-10 text-gray-400 hover:text-red-650"
                    />
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  className="h-10 text-gray-500 hover:text-indigo-600 hover:border-indigo-500 rounded-lg border-dashed font-semibold w-full"
                >
                  Thêm đường dẫn ảnh phụ
                </Button>
              </div>
            )}
          </Form.List>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormItem
            name="OriginalPrice"
            label="Giá gốc (VND)"
            rules={[zodRule(productSchema, "OriginalPrice")]}
          >
            <InputNumber
              className="w-full"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
              parser={(value) => {
                const parsed = value!.replace(/\$\s?|(\.*)/g, "");
                return parsed ? Number(parsed) : 0;
              }}
              placeholder="Nhập giá gốc..."
            />
          </FormItem>

          <FormItem
            name="CurrentPrice"
            label="Giá bán hiện tại (VND)"
            rules={[
              zodRule(productSchema, "CurrentPrice"),
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value === undefined || value === null || getFieldValue("OriginalPrice") >= value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Giá hiện tại phải nhỏ hơn hoặc bằng giá gốc!"));
                },
              }),
            ]}
          >
            <InputNumber
              className="w-full"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
              parser={(value) => {
                const parsed = value!.replace(/\$\s?|(\.*)/g, "");
                return parsed ? Number(parsed) : 0;
              }}
              placeholder="Nhập giá bán..."
            />
          </FormItem>
        </div>

        <FormItem
          name="RawProductUrl"
          label="Đường dẫn gốc sản phẩm (URL)"
          rules={[zodRule(productSchema, "RawProductUrl")]}
        >
          <Input placeholder="https://shopee.vn/... (Link gốc chưa chứa mã tiếp thị)" />
        </FormItem>

        <FormItem
          name="AffiliateUrl"
          label="Đường dẫn tiếp thị liên kết (Affiliate URL)"
          rules={[zodRule(productSchema, "AffiliateUrl")]}
        >
          <Input placeholder="https://shopee.vn/..." />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default ProductModal;
