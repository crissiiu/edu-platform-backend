/**
 * Utility for safe localStorage access in Next.js (SSR friendly)
 */
export const storage = {
  /**
   * Set a value in localStorage
   */
  set: (key: string, value: any): void => {
    if (typeof window === "undefined") return;
    try {
      const serializedValue = typeof value === "string" ? value : JSON.stringify(value);
      window.localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error("Error setting localStorage key:", key, error);
    }
  },

  /**
   * Get a value from localStorage
   */
  get: <T>(key: string, fallback: T | null = null): T | null => {
    if (typeof window === "undefined") return fallback;
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return fallback;
      
      // Try to parse as JSON, if it fails, return the raw string
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as unknown as T;
      }
    } catch (error) {
      console.error("Error reading localStorage key:", key, error);
      return fallback;
    }
  },

  /**
   * Remove a value from localStorage
   */
  remove: (key: string): void => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing localStorage key:", key, error);
    }
  },

  /**
   * Clear all localStorage
   */
  clear: (): void => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
};

export default storage;
