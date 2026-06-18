using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace EdTech.SharedLibrary.DependencyInjection
{
    public static class JWTAuthenticationScheme
    {
        /// <summary>
        /// Hàm mở rộng cấu hình nhanh dịch vụ xác thực JWT Token cho các microservice
        /// </summary>
        /// <param name="services"></param>
        /// <param name="config"></param>
        /// <returns></returns>
        public static IServiceCollection AddJWTAuthenticationScheme(this IServiceCollection services, IConfiguration config)
        {
            // Lấy cấu hình khoá bí mật tự appsetting.json của service gọi nó
            var key = Encoding.UTF8.GetBytes(config["Jwt:Key"]!);

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = config["Jwt:Issuer"],
                    ValidAudience = config["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                };
            });

            return services;
        }
    }
}
