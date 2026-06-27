import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Tắt tự động refetch khi focus lại cửa sổ trình duyệt
      retry: 1,                    // Thử lại tối đa 1 lần nếu request thất bại
      staleTime: 3 * 60 * 1000,    // Dữ liệu coi là mới trong 3 phút (3 minutes cache stale time)
      gcTime: 5 * 60 * 1000,       // Thời gian lưu trữ cache trong bộ nhớ (Garbage Collection: 5 minutes)
    },
    mutations: {
      // Có thể cấu hình xử lý lỗi chung cho mutation ở đây nếu cần thiết
    },
  },
});

export default queryClient;
