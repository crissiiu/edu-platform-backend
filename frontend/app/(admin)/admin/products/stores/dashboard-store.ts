import { create } from "zustand";
import { ProductDto } from "../models/dashboard-models";

interface DashboardUIState {
  isModalOpen: boolean;
  selectedProduct: ProductDto | null;
  
  openCreateModal: () => void;
  openUpdateModal: (product: ProductDto) => void;
  closeModal: () => void;
}

/**
 * Zustand store to manage local product dashboard UI states (Modal visibility, active product selection)
 */
export const useDashboardStore = create<DashboardUIState>((set) => ({
  isModalOpen: false,
  selectedProduct: null,
  
  openCreateModal: () => set({ isModalOpen: true, selectedProduct: null }),
  openUpdateModal: (product) => set({ isModalOpen: true, selectedProduct: product }),
  closeModal: () => set({ isModalOpen: false, selectedProduct: null }),
}));

export default useDashboardStore;
