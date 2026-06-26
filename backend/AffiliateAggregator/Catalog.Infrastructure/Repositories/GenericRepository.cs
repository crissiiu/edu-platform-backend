using Affiliate.SharedLibrary.Interface;
using Affiliate.SharedLibrary.Logs;
using Affiliate.SharedLibrary.Responses;
using Catalog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Catalog.Infrastructure.Repositories
{
    public class GenericRepository<T>(CatalogDbContext context) : IGenericInterface<T> where T : class
    {
        public async Task<IEnumerable<T>> GetAllAsync()
        {
            try
            {
                return await context.Set<T>().AsNoTracking().ToListAsync();
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new Exception("Lỗi khi truy xuất dữ liệu");
            }
        }

        public async Task<T?> GetByIdAsync(Guid id)
        {
            try
            {
                return await context.Set<T>().FindAsync(id);
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new Exception("Lỗi khi truy xuất dữ liệu");
            }
        }

        public async Task<T?> GetByExpressionAsync(Expression<Func<T, bool>> expression)
        {
            try
            {
                return context.Set<T>().AsNoTracking().FirstOrDefault(expression);
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new Exception("Lỗi khi truy xuất dữ liệu");
            }
        }

        public async Task<Response> CreateAsync(T entity)
        {
            try
            {
                var currentEntity = (await context.Set<T>().AddAsync(entity)).Entity;
                await context.SaveChangesAsync();

                if (currentEntity is not null)
                {
                    return new Response(true, "Dữ liệu đã được thêm vào hệ thống thành công!");
                }
                else
                {
                    return new Response(false, "Đã xảy ra lỗi trong quá trình xử lý dữ liệu đầu ra.");
                }
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                return new Response(false, "Đã xảy ra lỗi khi thêm dữ liệu mới vào hệ thống");
            }
        }

        public async Task<Response> DeleteAsync(Guid id)
        {
            try
            {
                var entity = await context.Set<T>().FindAsync(id);
                if (entity is null)
                {
                    return new Response(false, "Không tìm thấy dữ liệu cần xoá");
                }
                context.Remove(entity);
                await context.SaveChangesAsync();
                return new Response(true, "Đã xoá dữ liệu ra khỏi hệ thống");
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                return new Response(false, "Đã xảy ra lỗi khi cập nhật dữ liệu vào hệ thống");
            }
        }

        public async Task<Response> UpdateAsync(T entity)
        {
            try
            {
                context.Set<T>().Update(entity);
                await context.SaveChangesAsync();
                return new Response(true, "Cập nhật dữ liệu thành công");
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                return new Response(false, "Đã xảy ra lỗi khi cập nhật dữ liệu vào hệ thống");
            }
        }
    }
}
