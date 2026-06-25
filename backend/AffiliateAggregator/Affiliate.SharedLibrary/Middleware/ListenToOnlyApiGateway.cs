using Affiliate.SharedLibrary.Responses;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Affiliate.SharedLibrary.Middleware
{
    public class ListenToOnlyApiGateway(RequestDelegate next)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            // Kiểm tra xem request có chứa Header bí mật từ Gateway bắn qua không
            if (!context.Request.Headers.ContainsKey("X-Api-Gateway"))
            {
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.Forbidden;

                var response = new Response(false, "Không có quyền truy cập trực tiếp. Yêu cầu đi qua API Gateway.");
                var json = JsonSerializer.Serialize(response);

                await context.Response.WriteAsync(json);
                return;
            }

            await next(context);
        }
    }
}
