using Affiliate.SharedLibrary.Logs;
using Affiliate.SharedLibrary.Responses;
using Microsoft.AspNetCore.Http;
using System.Net;
using System.Text.Json;

namespace Affiliate.SharedLibrary.Middleware
{
    public class GlobalException(RequestDelegate next)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                // Ghi log lỗi ngầm bằng công cụ ở lớp Logs
                LogException.LogToDebugger(ex, ex.Message);

                // Trả về cấu trúc JSON chuẩn cho Frontend thay vì quăng lỗi màn hình vàng/màn hình xanh
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var response = new Response(false, "Đã có lỗi hệ thống xảy ra. Vui lòng thử lại sau!");
                var json = JsonSerializer.Serialize(response);

                await context.Response.WriteAsync(json);
            }
        }
    }
}
