using EdTech.SharedLibrary.Responses;
using System.Linq.Expressions;

namespace EdTech.SharedLibrary.Interface
{
    /// <summary>
    /// Interface mẫu generic repository dùng chung cho các tác vụ CRUD cơ bản của mọi serive
    /// </summary>
    public interface IGenericInterface<T> where T: class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync();
        Task<Response> CreateAsync();
        Task<Response> UpdateAsync();
        Task<Response> DeleteAsync();

        //Hàm tìm kiếm nâng cao bằng biểu thức Lamda (Expression)
        Task<T?> GetByExpressionAsync(Expression<Func<T, bool>> expression);
    }
}
