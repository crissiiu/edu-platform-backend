3. DETAILED IMPLEMENTATION BLUEPRINT
Hãy viết mã nguồn chi tiết, đầy đủ và tối ưu cho các file thành phần sau. Tuyệt đối không viết code giả (placeholder), không bỏ sót logic nghiệp vụ:

Lớp 3.1: Định nghĩa Typescript Interfaces (src/modules/dashboard/models/dashboard-models.ts)
Đồng bộ 100% các trường dữ liệu DTO từ Backend sang Frontend:

ProductDto (dành cho hiển thị): Id, Name, Slug, Description, ImageUrl, OriginalPrice, CurrentPrice, DiscountPercentage, SourcePlatform, AffiliateUrl, CategoryId.

CreateProductDto (dành cho POST): Bỏ Id, DiscountPercentage.

UpdateProductDto (dành cho PUT): Chứa Id và các trường chỉnh sửa giống Create.

Lớp 3.2: Tầng tương tác API (src/modules/dashboard/services/dashboard-service.ts)
Import apiService từ @/shared/services/api-service để thực hiện các cuộc gọi Axios bất đồng bộ:

getProducts() -> Trả về ProductDto[]

getProductById(id: string) -> Trả về ProductDto

createProduct(data: CreateProductDto) -> Trả về Response Object (Flag, Message)

updateProduct(id: string, data: UpdateProductDto) -> Trả về Response Object

deleteProduct(id: string) -> Trả về Response Object

Lớp 3.3: Tầng quản trị trạng thái bất đồng bộ (src/modules/dashboard/hooks/use-dashboard-data.ts)
Sử dụng TanStack React Query (@tanstack/react-query) để wrap các service thành hook:

useGetProducts: Fetch danh sách sản phẩm.

useCreateProduct, useUpdateProduct, useDeleteProduct: Sử dụng useMutation. Cấu hình cơ chế tự động làm tươi dữ liệu (queryClient.invalidateQueries({ queryKey: ['products'] })) ngay sau khi thêm, sửa hoặc xóa thành công. Hiển thị thông báo thành công bằng toast.success từ nội dung Message trả về của Backend.

Lớp 3.4: Quản lý trạng thái UI Client (src/modules/dashboard/stores/dashboard-store.ts)
Sử dụng Zustand để tạo một store quản trị UI nhẹ nhàng:

Quản lý trạng thái đóng/mở của Modal thêm mới/chỉnh sửa sản phẩm (isModalOpen: boolean).

Lưu vết sản phẩm hiện tại đang được chọn để tiến hành sửa đổi (selectedProduct: ProductDto | null).

Các hàm hành động: openCreateModal(), openUpdateModal(product), closeModal().

Lớp 3.5: Giao diện hiển thị lõi (src/modules/dashboard/components/...)
ProductTable Component: Sử dụng thành phần <Table> từ thư viện Ant Design, có phân trang, định dạng hiển thị tiền tệ VNĐ chuẩn chỉnh cho OriginalPrice và CurrentPrice. Render hình ảnh sản phẩm gọn gàng, hiển thị nhãn phần trăm giảm giá (DiscountPercentage) nổi bật bằng <Badge>. Có cột Thao tác gồm nút "Sửa" và nút "Xóa" (Xóa sử dụng cấu hình xác nhận <Popconfirm> của Antd).

ProductModal Component: Sử dụng <Modal> và <Form> của Ant Design để tạo cổng nhập liệu. Đấu nối trực tiếp dữ liệu với Zustand Store để tự động điền thông tin cũ vào Form khi ở chế độ chỉnh sửa. Tận dụng cơ chế Client-side Validation cơ bản của Form khớp với Data Annotations của Backend (bắt buộc nhập tên, định dạng URL ảnh/link).

Lớp 3.6: Tích hợp tổng thể & Routing Layer
Viết file src/modules/dashboard/index.tsx gom toàn bộ bảng dữ liệu, nút bấm "Thêm sản phẩm", và Modal nhập liệu vào một giao diện hoàn chỉnh bằng lưới layout TailwindCSS tiện dụng.

Export thực thể ra ngoài và nhúng vào file định tuyến Next.js App Router: src/app/admin/products/page.tsx khai báo chạy ở chế độ Client Component ('use client').

4. DESIGN & TECHNICAL STANDARDS
Styling: Sử dụng các thuộc tính tiện ích của TailwindCSS để bọc và tùy biến khoảng cách, căn chỉnh lề (flex, grid, spacing, layout padding) cho các khối Component của Ant Design, đảm bảo giao diện Dashboard Admin thoáng đãng, sang trọng, tinh tế.

TypeScript Strict Mode: Định kiểu rõ ràng cho tất cả các đối tượng Form, Event, Response. Tuyệt đối không lạm dụng kiểu any.

Error Handling Resiliency: Tận dụng triệt để bộ lọc lỗi Axios Interceptor dùng chung đã cài sẵn tại src/shared/services/api-service.ts. Bạn chỉ cần tập trung xử lý luồng dữ liệu sạch và bắn thông báo thành công.

Hãy tiến hành sinh mã nguồn toàn diện và tối ưu nhất cho toàn bộ cấu trúc mô-đun quản lý sản phẩm này!
"""