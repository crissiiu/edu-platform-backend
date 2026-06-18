using EdTech.SharedLibrary.Logs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.Json;

namespace EdTech.SharedLibrary.Middleware
{
    public class GlobalException(RequestDelegate next)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            // Cấu hình các giá trị mặc định cho lỗi hệ thống
            string message = "Hệ thống đang bận hoặc đang gặp sự cố bất ngờ. Vui lòng thử lại sau!";
            int statusCode = (int)HttpStatusCode.InternalServerError;
            string title = "Lỗi hệ thống";

            try
            {
                // Cho request đi tiếp vào các service phía sau (API, Auth, Rate Limiter...)
                await next(context);

                // BIỆN PHÁP AN TOÀN: Chỉ can thiệp nếu Header CHƯA được gửi về cho Client
                if (!context.Response.HasStarted)
                {
                    // Thay thế chuỗi IF bằng Switch-case để tăng hiệu năng và dễ đọc code
                    switch (context.Response.StatusCode)
                    {
                        case StatusCodes.Status429TooManyRequests:
                            await ModifyHeaderAsync(context, "Cảnh báo", "Quá nhiều yêu cầu truy cập cùng lúc. Vui lòng chậm lại!", StatusCodes.Status429TooManyRequests);
                            break;

                        case StatusCodes.Status401Unauthorized:
                            await ModifyHeaderAsync(context, "Thông báo", "Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn.", StatusCodes.Status401Unauthorized);
                            break;

                        case StatusCodes.Status403Forbidden:
                            await ModifyHeaderAsync(context, "Không thể truy cập", "Tài khoản của bạn không có quyền thực hiện chức năng này.", StatusCodes.Status403Forbidden);
                            break;
                    }
                }
            }
            catch (Exception ex)
            {
                // Ghi nhận lỗi gốc chi tiết vào Hệ thống Log (Console/File) để lập trình viên kiểm tra
                LogException.LogExceptions(ex, context);

                // Kiểm tra xem có phải lỗi quá thời gian chờ (Timeout) hay không
                if (ex is TaskCanceledException || ex is TimeoutException)
                {
                    title = "Hết thời gian chờ";
                    message = "Yêu cầu xử lý quá lâu và đã hết thời gian chờ từ hệ thống. Vui lòng thử lại.";
                    statusCode = (int)StatusCodes.Status408RequestTimeout;
                }

                // Gửi thông báo lỗi nhẹ nhàng, an toàn về cho học sinh/frontend
                await ModifyHeaderAsync(context, title, message, statusCode);
            }
        }

        private async Task ModifyHeaderAsync(HttpContext context, string title, string message, int statusCode)
        {
            // Kiểm tra lại một lần nữa xem có thể chỉnh sửa Response được không
            if (!context.Response.HasStarted)
            {
                // 1. SỬA LỖI CHÍ MẠNG: Phải gán mã lỗi vào HTTP Response chuẩn của Server
                context.Response.StatusCode = statusCode;
                context.Response.ContentType = "application/json";

                // 2. Tạo đối tượng ProblemDetails chuẩn RFC 7807
                var problemDetails = new ProblemDetails()
                {
                    Title = title,
                    Status = statusCode,
                    Detail = message,
                    Instance = context.Request.Path // Thêm đường dẫn API bị lỗi vào để Frontend dễ check
                };

                // 3. Convert sang JSON và trả về
                var jsonResult = JsonSerializer.Serialize(problemDetails);
                await context.Response.WriteAsync(jsonResult, CancellationToken.None);
            }
        }
    }
}
