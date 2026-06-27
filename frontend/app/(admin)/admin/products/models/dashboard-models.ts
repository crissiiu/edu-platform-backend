import { z } from "zod";

export interface ProductDto {
  Id: string;
  Name: string;
  Slug: string;
  Description: string;
  ImageUrl: string;
  OriginalPrice: number;
  CurrentPrice: number;
  DiscountPercentage: number;
  SourcePlatform: string;
  RawProductUrl: string;
  AffiliateUrl: string;
  CategoryId: string;
  SecondaryImages: string[];
}

export interface CreateProductDto {
  Name: string;
  Slug: string;
  Description: string;
  ImageUrl: string;
  OriginalPrice: number;
  CurrentPrice: number;
  SourcePlatform: string;
  RawProductUrl: string;
  AffiliateUrl: string;
  CategoryId: string;
  SecondaryImages: string[];
}

export interface UpdateProductDto {
  Id: string;
  Name: string;
  Slug: string;
  Description: string;
  ImageUrl: string;
  OriginalPrice: number;
  CurrentPrice: number;
  SourcePlatform: string;
  RawProductUrl: string;
  AffiliateUrl: string;
  CategoryId: string;
  SecondaryImages: string[];
}

export interface MutationResponse {
  Flag: boolean;
  Message: string;
}

export interface CategoryDto {
  Id: string;
  Name: string;
  Slug: string;
}

export interface PaginatedResponse<T> {
  Items: T[];
  PageNumber: number;
  PageSize: number;
  TotalCount: number;
  TotalPages: number;
}

/**
 * Zod validation schema synchronized with Backend data annotations
 */
export const productSchema = z.object({
  Name: z.string({ message: "Tên sản phẩm không được để trống." })
    .min(10, "Tên sản phẩm phải từ 10 đến 250 ký tự.")
    .max(250, "Tên sản phẩm phải từ 10 đến 250 ký tự."),
  Slug: z.string({ message: "Đường dẫn không được để trống." })
    .max(250, "Đường dẫn không được vượt quá 250 ký tự.")
    .regex(/^[a-z0-8-]+$/, "Slug chỉ được chứa chữ cái viết thường, số và dấu gạch ngang (chuẩn SEO)."),
  Description: z.string({ message: "Mô tả sản phẩm không được để trống." })
    .min(1, "Mô tả sản phẩm không được để trống.")
    .max(2000, "Mô tả không được vượt quá 2000 ký tự."),
  ImageUrl: z.string({ message: "Hình ảnh sản phẩm bắt buộc phải có." })
    .url("Đường dẫn hình ảnh không đúng định dạng URL."),
  OriginalPrice: z.number({ message: "Giá gốc không được để trống." })
    .min(0, "Giá gốc phải lớn hơn hoặc bằng 0."),
  CurrentPrice: z.number({ message: "Giá bán hiện tại không được để trống." })
    .min(0, "Giá bán phải lớn hơn hoặc bằng 0."),
  SourcePlatform: z.string({ message: "Nguồn sàn thương mại bắt buộc phải chọn." })
    .max(50, "Tên sàn không được vượt quá 50 ký tự."),
  RawProductUrl: z.string({ message: "Link sản phẩm gốc bắt buộc phải có." })
    .url("Đường dẫn sản phẩm gốc không đúng định dạng URL."),
  AffiliateUrl: z.string({ message: "Link kiếm tiền Affiliate bắt buộc phải có." })
    .url("Đường dẫn tiếp thị không đúng định dạng URL."),
  CategoryId: z.string({ message: "Danh mục sản phẩm không được để trống." }),
  SecondaryImages: z.array(z.string().url("Mỗi đường dẫn ảnh phụ phải đúng định dạng URL.")).optional().default([])
});
