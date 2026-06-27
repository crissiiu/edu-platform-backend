import { apiService } from "@/shared/services/api-service";
import { ProductDto, CreateProductDto, UpdateProductDto, MutationResponse, CategoryDto, PaginatedResponse } from "../models/dashboard-models";

export const dashboardService = {
  /**
   * Fetch paginated and filtered products from Backend
   */
  getProducts: async (
    pageNumber = 1,
    pageSize = 12,
    categoryId?: string,
    search?: string
  ): Promise<PaginatedResponse<ProductDto>> => {
    return apiService.get<any, PaginatedResponse<ProductDto>>("/products", {
      params: { pageNumber, pageSize, categoryId, search }
    });
  },

  /**
   * Fetch all categories from Backend
   */
  getCategories: async (): Promise<CategoryDto[]> => {
    return apiService.get<any, CategoryDto[]>("/categories");
  },

  /**
   * Fetch single product by Id
   */
  getProductById: async (id: string): Promise<ProductDto> => {
    return apiService.get<any, ProductDto>(`/products/${id}`);
  },

  /**
   * Create a new product
   */
  createProduct: async (data: CreateProductDto): Promise<MutationResponse> => {
    return apiService.post<any, MutationResponse>("/products", data);
  },

  /**
   * Update an existing product
   */
  updateProduct: async (id: string, data: UpdateProductDto): Promise<MutationResponse> => {
    return apiService.put<any, MutationResponse>(`/products/${id}`, data);
  },

  /**
   * Delete a product by Id
   */
  deleteProduct: async (id: string): Promise<MutationResponse> => {
    return apiService.delete<any, MutationResponse>(`/products/${id}`);
  },
};

export default dashboardService;
