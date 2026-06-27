import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard-service";
import { CreateProductDto, UpdateProductDto, ProductDto, CategoryDto, PaginatedResponse } from "../models/dashboard-models";
import toast from "react-hot-toast";

/**
 * Hook to fetch paginated and filtered products list
 */
export const useGetProducts = (
  pageNumber = 1,
  pageSize = 12,
  categoryId?: string,
  search?: string
) => {
  return useQuery<PaginatedResponse<ProductDto>>({
    queryKey: ["products", pageNumber, pageSize, categoryId, search],
    queryFn: () => dashboardService.getProducts(pageNumber, pageSize, categoryId, search),
  });
};

/**
 * Hook to fetch categories list
 */
export const useGetCategories = () => {
  return useQuery<CategoryDto[]>({
    queryKey: ["categories"],
    queryFn: dashboardService.getCategories,
  });
};

/**
 * Hook to create a new product
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDto) => dashboardService.createProduct(data),
    onSuccess: (response) => {
      if (response.Flag) {
        // Invalidate and refetch products queries
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success(response.Message || "Thêm sản phẩm thành công!");
      } else {
        toast.error(response.Message || "Thêm sản phẩm thất bại.");
      }
    },
  });
};

/**
 * Hook to update an existing product
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      dashboardService.updateProduct(id, data),
    onSuccess: (response) => {
      if (response.Flag) {
        // Invalidate and refetch products queries
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success(response.Message || "Cập nhật sản phẩm thành công!");
      } else {
        toast.error(response.Message || "Cập nhật sản phẩm thất bại.");
      }
    },
  });
};

/**
 * Hook to delete a product
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dashboardService.deleteProduct(id),
    onSuccess: (response) => {
      if (response.Flag) {
        // Invalidate and refetch products queries
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success(response.Message || "Xóa sản phẩm thành công!");
      } else {
        toast.error(response.Message || "Xóa sản phẩm thất bại.");
      }
    },
  });
};

export default useGetProducts;
