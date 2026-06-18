using Microsoft.AspNetCore.Http;
using System.Net;

namespace EdTech.SharedLibrary.Middleware
{
    public class ListenToOnlyApiGateway(RequestDelegate next)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            if (!context.Request.Headers.ContainsKey("X-Gateway-Header"))
            {
                context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync("{\"Message\": Truy cập bị từ chối! Bạn không thể gọi trực tiếp tới Service này mà không thông qua API Gateway.");
                return;
            }
            await next(context);
        }
    }
}
