using Affiliate.SharedLibrary.Responses;
using System.Linq.Expressions;

namespace Affiliate.SharedLibrary.Interface
{
    public interface IGenericInterface<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(Guid id);
        Task<Response> CreateAsync(T entity);
        Task<Response> UpdateAsync(T entity);
        Task<Response> DeleteAsync(Guid id);
        Task<T?> GetByExpressionAsync(Expression<Func<T, bool>> expression);
    }
}
