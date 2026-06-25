using Affiliate.SharedLibrary.Middleware;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;

namespace Affiliate.SharedLibrary.DependencyInjection
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddSharedServices<TDbContext>(
            this IServiceCollection services,
            IConfiguration config,
            string fileName) where TDbContext : DbContext
        {
            // 1. Cấu hình Serilog để ghi log dữ liệu
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Information()
                .WriteTo.Console()
                .WriteTo.File(path: $"Logs/{fileName}-.txt", rollingInterval: RollingInterval.Day)
                .CreateLogger();

            // 2. Cấu hình Database tập trung cho Entity Framework Core
            var connectionString = config.GetConnectionString("DefaultConnection");
            services.AddDbContext<TDbContext>(options =>
                options.UseNpgsql(connectionString, b => b.MigrationsAssembly(typeof(TDbContext).Assembly.FullName)));

            return services;
        }

        public static IApplicationBuilder UseSharedPolicies(this IApplicationBuilder app)
        {
            // Kích hoạt Middleware xử lý lỗi toàn cục
            app.UseMiddleware<GlobalException>();

            // Kích hoạt Middleware bảo mật Gateway (Bật lên khi đã cấu hình xong YARP Gateway ở tuần 3)
            // app.UseMiddleware<ListenToOnlyApiGateway>();

            return app;
        }
    }
}
