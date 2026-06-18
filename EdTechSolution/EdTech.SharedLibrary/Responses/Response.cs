namespace EdTech.SharedLibrary.Responses
{
    /// <summary>
    /// Cấu trúc phản hồi chuẩn hoá cho toàn bộ hệ thống        
    /// </summary>
    /// <param name="Flag">Trả về True nếu thành công, phản hồi False nếu thất bại</param>
    /// <param name="Message">Thông báo chi tiết về cho Client hiển thị</param>
    public record Response(bool Flag, bool Message);
}
