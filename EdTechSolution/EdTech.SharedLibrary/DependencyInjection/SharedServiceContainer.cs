using EdTech.SharedLibrary.Middleware;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;

namespace EdTech.SharedLibrary.DependencyInjection
{
    public static class SharedServiceContainer
    {
        /// <summary>
        /// Đăng ký tập trung các cấu hình cốt lõi: kết nối Db, Serilog và JWT
        /// </summary>
        public static IServiceCollection AddSharedServices<TContext>(this IServiceCollection services, IConfiguration config, string fileName) where TContext : DbContext
        {
            // Cấu hình Serilog để tự động tạo file trong lỗi hàng ngày
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Information()
                .WriteTo.Console()
                .WriteTo.File(path: $"Logs/{fileName}-.txt", rollingInterval: RollingInterval.Day)
                .CreateLogger();

            // Cấu hình tự động kết nối Database cho DbContext truyền vào
            var connectionString = config.GetConnectionString("DefaultConnection");
            services.AddDbContext<TContext>(options => options.UseNpgsql(connectionString));

            // Tích hợp luôn cấu hình xác thưc JWT
            services.AddJWTAuthenticationScheme(config);

            return services;
        }

        public static IApplicationBuilder UserSharedPolicies(this ApplicationBuilder app)
        {
            // Bật lớp bắt lỗi toàn cục
            app.UseMiddleware<GlobalException>();

            // Chặn Gateway
            // Tạm thời comment để test
            //app.UseMiddleware<ListenToOnlyApiGateway>();

            return app;
        }
    }
}
