# Mây Học Đường

Website cửa hàng học đường với giao diện tiếng Việt, danh mục sản phẩm, tìm kiếm, lọc, giỏ hàng và biểu mẫu đặt hàng.

## Xem website

Sau khi bật GitHub Pages trong **Settings → Pages**, chọn **Deploy from a branch**, nhánh `main`, thư mục `/(root)` rồi nhấn **Save**.

Đường dẫn website:
`https://nguyenhoangthienphuc871-source.github.io/may-hoc-duong/`

## Tính năng đặt hàng và email

Biểu mẫu đặt hàng nằm trong giỏ hàng. Khi được kết nối với API, website gửi thông tin đơn đến máy chủ. Máy chủ kiểm tra dữ liệu, tự tính giá theo danh mục phía máy chủ, lưu đơn vào PostgreSQL rồi gửi email thông báo đến địa chỉ cửa hàng được cấu hình bằng biến `ORDER_EMAIL_TO`.

Email thông báo gồm mã đơn, thông tin khách, hình thức nhận hàng, danh sách sản phẩm, tổng tiền và ghi chú.

## Cần hoàn tất trước khi nhận đơn thật

GitHub Pages chỉ lưu trữ giao diện tĩnh, không chạy được `server.js`. Vì vậy, chức năng đặt hàng và email **chưa hoạt động cho đến khi hoàn tất các bước sau**:

1. Triển khai `server.js` lên dịch vụ hỗ trợ Node.js (ví dụ Render hoặc Railway).
2. Tạo cơ sở dữ liệu PostgreSQL và chạy nội dung `schema.sql`.
3. Cấu hình các biến môi trường theo `.env.example` trên dịch vụ máy chủ.
4. Với Gmail, bật xác minh 2 bước và tạo Google App Password. Không dùng mật khẩu Gmail thường.
5. Đặt `window.MAY_API_URL` trong `index.html` thành địa chỉ API đã triển khai.
6. Kiểm tra API, gửi thử một đơn và xác nhận email đến hộp thư cửa hàng.

Các biến môi trường chứa mật khẩu và thông tin kết nối chỉ được nhập trong phần cài đặt bảo mật của dịch vụ máy chủ. Không đăng chúng lên GitHub hoặc gửi qua tin nhắn.

## Lưu ý

- Khi chưa cấu hình API, website sẽ báo rõ đơn chưa được gửi.
- Khi máy chủ lưu được đơn nhưng email gặp lỗi, đơn vẫn được giữ trong cơ sở dữ liệu và website thông báo email chưa gửi được.
- Giá sản phẩm cần được chủ cửa hàng xác nhận trước khi kinh doanh.
- Không hỗ trợ học sinh tự đăng tài sản hoặc thực hiện giao dịch cầm đồ trực tuyến.
