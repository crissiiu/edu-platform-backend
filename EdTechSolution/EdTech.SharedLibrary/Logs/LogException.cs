using Microsoft.AspNetCore.Http;
using Serilog;

namespace EdTech.SharedLibrary.Logs
{
    public static class LogException
    {
        /// <summary>
        /// Hàm tiện ích hỗ trợ ghi log cấu trúc thông qua Serilog xuống Console và File
        /// </summary>
        public static void LogExceptions(Exception ex, HttpContext context)
        {
            Log.Error(ex, 
                $"============== [EDTECH ERROR LOG] ==============\n" +
                $"Thời gian: {DateTime.UtcNow}\n" +
                $"Đường dẫn API: {context.Request.Path}\n" +
                $"Phương thức: {context.Request.Method}\n" +
                $"Thông điệp lỗi: {ex.Message}\n" +
                "================================================"
            );
        }
    }
}
