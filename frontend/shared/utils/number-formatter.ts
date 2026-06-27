/**
 * Utility for formatting numbers and currencies (specifically VND)
 */

/**
 * Format a number as VND currency (e.g. 1500000 -> 1.500.000 ₫)
 */
export const formatCurrency = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) return "0 ₫";
  
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "0 ₫";
  
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numValue);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `${numValue.toLocaleString("vi-VN")} ₫`;
  }
};

/**
 * Format standard number with thousand separators (e.g. 1000000 -> 1.000.000)
 */
export const formatNumber = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) return "0";
  
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "0";
  
  try {
    return new Intl.NumberFormat("vi-VN").format(numValue);
  } catch (error) {
    console.error("Error formatting number:", error);
    return numValue.toLocaleString("vi-VN");
  }
};

/**
 * Format percentage (e.g. 0.125 -> 12.5% or 12 -> 12%)
 * @param value value to format
 * @param isDecimal if true, treats 0.12 as 12%. If false, treats 12 as 12%.
 */
export const formatPercent = (
  value: number | string | null | undefined,
  isDecimal = false
): string => {
  if (value === null || value === undefined) return "0%";
  
  let numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "0%";
  
  if (isDecimal) {
    numValue = numValue * 100;
  }
  
  return `${parseFloat(numValue.toFixed(2))}%`;
};
