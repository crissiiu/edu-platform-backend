import toast from "react-hot-toast";

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

/**
 * Parses axios or generic error and returns a human-readable message string
 */
export const getErrorMessage = (error: any, defaultMessage = "Đã có lỗi xảy ra. Vui lòng thử lại sau.") => {
  if (!error) return defaultMessage;

  // If it's already a string, return it
  if (typeof error === "string") return error;

  // Handle Axios/Network response errors
  if (error.response) {
    const data = error.response.data as ApiErrorResponse;
    
    // Check if API returned a specific message or array of messages (e.g. NestJS validation errors)
    if (data) {
      if (Array.isArray(data.message)) {
        return data.message.join(", ");
      }
      if (typeof data.message === "string") {
        return data.message;
      }
      if (typeof data.error === "string") {
        return data.error;
      }
    }
  }

  // Handle request network errors (no response received)
  if (error.request) {
    return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
  }

  // Handle general Error instance
  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
};

/**
 * Display error toast automatically using react-hot-toast
 */
export const toastError = (error: any, defaultMessage?: string): string => {
  const message = getErrorMessage(error, defaultMessage);
  toast.error(message, {
    duration: 4000,
    position: "top-right",
  });
  return message;
};

export default getErrorMessage;
