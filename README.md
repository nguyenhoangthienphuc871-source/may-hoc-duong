# Mây Học Đường

Website giới thiệu cửa hàng học đường, danh mục sản phẩm và dịch vụ.

## Chạy thử
Mở trực tiếp tệp `index.html` bằng trình duyệt hoặc bật GitHub Pages để có đường dẫn công khai.

## Xuất bản bằng GitHub Pages
1. Mở **Settings** của repository.
2. Chọn **Pages** ở thanh bên.
3. Trong **Build and deployment**, chọn **Deploy from a branch**.
4. Chọn nhánh **main**, thư mục **/(root)** rồi nhấn **Save**.
5. Chờ GitHub hoàn tất triển khai. Đường dẫn thường có dạng:
   `https://nguyenhoangthienphuc871-source.github.io/may-hoc-duong/`

## Tình trạng hiện tại
Đây là bản giao diện tĩnh để xem trước. Tìm kiếm, lọc sản phẩm và giỏ hàng chạy trong trình duyệt; giỏ hàng không lưu trên máy chủ. Website **chưa** có đăng ký/đăng nhập, cơ sở dữ liệu, quản trị, lưu đơn hàng, gửi email hoặc thanh toán thật. Không dùng bản này để nhận đơn hay thu tiền.

Các mức giá đang hiển thị theo danh sách ban đầu và cần được chủ cửa hàng xác nhận trước khi bán. Sản phẩm đồ cũ và dịch vụ chưa có giá chưa được tự đặt giá.

## Lưu ý an toàn
Không hỗ trợ giao dịch cầm đồ trực tuyến dành cho học sinh/vị thành niên. Nội dung liên quan chỉ được tiếp nhận dưới dạng yêu cầu tư vấn để người lớn có thẩm quyền xem xét.


## Đặt hàng và thông báo email

Đã thêm biểu mẫu đặt hàng vào giỏ hàng và API Node.js. API xác thực dữ liệu, tự tính giá theo danh mục phía máy chủ, kiểm tra điều kiện mua vở 96 trang, lưu đơn vào PostgreSQL rồi mới gửi email đến `nguyenhoangthienphuc871@gmail.com`. Nếu email lỗi, đơn đã lưu vẫn được giữ và API trả về trạng thái email chưa gửi.

### Cần cấu hình trước khi sử dụng thật

GitHub Pages chỉ chạy giao diện tĩnh, không chạy Node.js. Cần triển khai `server.js` trên dịch vụ hỗ trợ Node.js, tạo PostgreSQL và chạy `schema.sql`. Cấu hình các biến trong `.env.example` tại máy chủ. Với Gmail, bật xác minh 2 bước và tạo Google App Password; không dùng mật khẩu Gmail thường và không đưa bí mật lên GitHub.

Cuối cùng, đặt `window.MAY_API_URL` thành URL máy chủ API trong `index.html`. Khi chưa cấu hình API, biểu mẫu sẽ báo rõ rằng đơn chưa được gửi. Mã nguồn đã được thêm vào repository nhưng backend/email chưa được triển khai và kiểm thử thực tế.
