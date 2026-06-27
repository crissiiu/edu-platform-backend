"use client";

import React from "react";
import { CategoryDto } from "@/app/(admin)/admin/products/models/dashboard-models";

interface CategoryFiltersProps {
  categories: CategoryDto[];
  selectedCategory: string;
  onCategoryChange: (id: string) => void;
}

/**
 * Modern minimalist category chips bar with subtle gold styling.
 */
export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
      <button
        type="button"
        onClick={() => onCategoryChange("all")}
        className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
          selectedCategory === "all"
            ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/15"
            : "bg-white text-gray-500 border-gray-200 hover:border-amber-350 hover:text-amber-600"
        }`}
      >
        Tất cả
      </button>
      {categories.map((cat) => (
        <button
          key={cat.Id}
          type="button"
          onClick={() => onCategoryChange(cat.Id)}
          className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
            selectedCategory === cat.Id
              ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/15"
              : "bg-white text-gray-500 border-gray-200 hover:border-amber-350 hover:text-amber-600"
          }`}
        >
          {cat.Name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilters;
