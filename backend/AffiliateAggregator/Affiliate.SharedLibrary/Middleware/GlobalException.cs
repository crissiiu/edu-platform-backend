using Affiliate.SharedLibrary.Logs;
using Affiliate.SharedLibrary.Responses;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.Json;

namespace Affiliate.SharedLibrary.Middleware
{
    public class GlobalException(RequestDelegate next)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            // Cấu hình các giá trị lỗi mặc định (Lỗi 500)
            string message = "Xin lỗi, đã có lỗi hệ thống xảy ra. Vui lòng thử lại sau!";
            int statusCode = (int)HttpStatusCode.InternalServerError;
            string title = "Error";

            try
            {
                await next(context);

                // Check nếu Response đã bắt đầu gửi về Client rồi thì bỏ qua không can thiệp nữa
                if (context.Response.HasStarted) return;

                // 1. Check lỗi Quá nhiều Request (429 Too Many Requests)
                if (context.Response.StatusCode == StatusCodes.Status429TooManyRequests)
                {
                    title = "Warning";
                    message = "Hệ thống ghi nhận quá nhiều yêu cầu từ bạn. Vui lòng chậm lại!";
                    statusCode = StatusCodes.Status429TooManyRequests;
                    await ModifyHeaderAsync(context, title, message, statusCode);
                }

                // 2. Check lỗi Chưa đăng nhập (401 Unauthorized)
                if (context.Response.StatusCode == StatusCodes.Status401Unauthorized)
                {
                    title = "Alert";
                    message = "Bạn không có quyền truy cập. Vui lòng đăng nhập!";
                    statusCode = StatusCodes.Status401Unauthorized;
                    await ModifyHeaderAsync(context, title, message, statusCode);
                }

                if (context.Response.StatusCode == StatusCodes.Status403Forbidden)
                {
                    title = "Out of Access";
                    message = "Tài khoản của bạn không được phép truy cập vào vùng này.";
                    statusCode = StatusCodes.Status403Forbidden;
                    await ModifyHeaderAsync(context, title, message, statusCode);
                }
            }
            catch (Exception ex)
            {
                // Ghi log lỗi gốc bằng công cụ Logs có sẵn của chúng ta
                LogException.LogToDebugger(ex, ex.Message);

                // Check nếu Response đã bắt đầu gửi về Client rồi thì bỏ qua
                if (context.Response.HasStarted) return;

                // 4. Check lỗi Quá thời gian phản hồi (408 Request Timeout)
                if (ex is TaskCanceledException || ex is TimeoutException)
                {
                    title = "Out of Time";
                    message = "Thời gian kết nối đến máy chủ quá hạn. Vui lòng thử lại!";
                    statusCode = StatusCodes.Status408RequestTimeout;
                }

                // Xuất thông báo an toàn ra cho Client (Sử dụng cấu trúc ProblemDetails chuẩn của Microsoft)
                await ModifyHeaderAsync(context, title, message, statusCode);
            }
        }
        private async Task ModifyHeaderAsync(HttpContext context, string title, string message, int statusCode)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            var problemDetails = new ProblemDetails
            {
                Detail = message,
                Status = statusCode,
                Title = title
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(problemDetails), CancellationToken.None);
        }
    }
}
