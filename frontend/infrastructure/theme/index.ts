import type { ThemeConfig } from "antd";

export const antdTheme: ThemeConfig = {
  token: {
    // Colors
    colorPrimary: "#4f46e5", // Indigo 600 - Màu chủ đạo hiện đại, cao cấp
    colorSuccess: "#10b981", // Emerald 500
    colorWarning: "#f59e0b", // Amber 500
    colorError: "#ef4444",   // Red 500
    colorInfo: "#3b82f6",    // Blue 500
    
    // Typography
    fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    fontSize: 14,
    
    // Layout & Borders
    borderRadius: 8, // Góc bo mềm mại, hiện đại
    
    // Control heights
    controlHeight: 36,
  },
  components: {
    Button: {
      controlHeight: 38,
      borderRadius: 8,
      fontWeight: 500,
      boxShadow: "none",
    },
    Input: {
      controlHeight: 38,
      borderRadius: 8,
    },
    Select: {
      controlHeight: 38,
      borderRadius: 8,
    },
    Card: {
      borderRadius: 12,
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
    },
    Table: {
      borderRadius: 8,
    },
  },
};

export default antdTheme;
