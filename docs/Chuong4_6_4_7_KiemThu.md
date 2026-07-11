**4.6. Kiểm thử chức năng**

Việc kiểm thử được thực hiện ở hai mức. Mức thứ nhất là kiểm thử API trực tiếp trên môi trường production (`https://full-stack-ccd7.onrender.com`) bằng các lệnh gọi HTTP thủ công. Mức thứ hai là đối chiếu với kết quả rà soát mã nguồn Frontend và Backend đã thực hiện trước đó, nhằm xác nhận các luồng nghiệp vụ chính đã hoạt động đúng trên giao diện thật.

**Bảng 4.1. Test case các luồng cốt lõi**

| TC ID | Module | Kịch bản | Input | Kết quả mong đợi | Kết quả thực tế |
| :---- | :---- | :---- | :---- | :---- | :---- |
| TC-01 | Auth | Đăng nhập với tài khoản hợp lệ | `POST /api/auth/login`, `alex@fitfuel.com` / `123456` | Trả JWT token, HTTP 200 | Đạt — trả `access_token` hợp lệ |
| TC-02 | Auth | Đăng nhập sai mật khẩu | Email đúng, password sai | HTTP 401, không lộ thông tin tài khoản | Đạt — 401, thông báo lỗi chung |
| TC-03 | Guest OTP | Xin mã OTP (happy path) | `POST /api/auth/guest/otp/request` với SĐT mới | HTTP 200, sinh mã 6 số, TTL 5 phút | Đạt — nhận mã và thời hạn đúng như thiết kế |
| TC-04 | Guest OTP | Xác thực đúng mã | Mã vừa nhận | HTTP 200, xác thực thành công | Đạt |
| TC-05 | Guest OTP | Nhập sai mã 3 lần liên tiếp | 3 lần gọi `verify` với mã sai | Hệ thống ghi nhận và giảm dần số lượt thử còn lại | Cần hoàn thiện — số lượt thử hiển thị chưa giảm đúng giữa các lần gọi, cần rà lại phần lưu trạng thái phía server |
| TC-06 | Gym | Ghi nhận set khi tập, phát hiện Personal Record mới | `POST /api/gym/sessions/{id}/exercises` | Lưu lịch sử tập, tự phát hiện PR nếu vượt kỷ lục cũ | Đạt — luồng chạy trên dữ liệu thật, có test tích hợp kèm theo |
| TC-07 | Gym | Phát hiện Plateau/Overtraining/Undertraining | `GET /api/gym/progress?exercise_name=...` | Trả chẩn đoán đúng ngưỡng đã thiết kế | Đạt — có test tích hợp riêng cho module này |
| TC-08 | Food | Xem danh sách sản phẩm dinh dưỡng | `GET /api/food/products` | HTTP 200, trả danh sách món | Đạt — phản hồi nhanh, dữ liệu thật |
| TC-09 | Food | Đặt hàng dinh dưỡng (Member) và xem lại đơn | `POST /api/food/orders`, `GET /api/food/orders/{id}` | Tạo đơn thành công, xem lại đúng đơn | Đạt |
| TC-10 | Food | Đặt hàng của khách vãng lai sau xác thực OTP | Luồng `GuestCheckoutPage.jsx` | Tạo đơn gắn với SĐT khách | Cần hoàn thiện — luồng riêng cho khách vãng lai chưa được nối trọn vẹn từ giao diện đến API đặt hàng, dự kiến hoàn thiện ở bản cập nhật kế tiếp |
| TC-11 | AI Gợi ý | Gợi ý dinh dưỡng ngay sau buổi tập | `POST /api/ai/food-recommendation` | Trả sản phẩm phù hợp nhóm cơ vừa tập | Đạt |
| TC-12 | AI Gợi ý | Gợi ý dinh dưỡng theo toàn bộ lịch sử (trang /nutrition) | `GET /api/ai/food-recommendation/history` | Chạy Genetic Algorithm + lọc dị ứng, trả gợi ý kèm lý do | Đạt — có test tích hợp, một lỗi tính toán nhỏ phát hiện trong lúc kiểm thử đã được sửa ngay |
| TC-13 | Gear | Xem danh sách và chi tiết Gear | `GET /api/gear` | HTTP 200, danh sách thiết bị | Đạt |
| TC-14 | Gear Lifecycle | Thuê Gear và xem lại Gear đang thuê | Luồng thuê + `GET /api/gear/my/rentals` | Tạo giao dịch thuê, trừ tồn kho, xem lại đúng danh sách | Đạt |
| TC-15 | Gear Lifecycle | Xem lịch sử vòng đời một thiết bị | `GET /api/gear/{id}/lifecycle` | Trả đúng chuỗi sự kiện theo thời gian | Đạt ở tầng API; giao diện hiển thị riêng cho tính năng này dự kiến bổ sung ở bản sau |
| TC-16 | Vendor | Đăng bán/cho thuê thiết bị mới | `POST /api/gear/` | Tạo thiết bị mới kèm lịch sử "listed" | Cần hoàn thiện — trang quản trị Vendor hiện chưa nối vào API này |
| TC-17 | Vendor | Cập nhật trạng thái đơn hàng dinh dưỡng | `PUT /api/food/orders/{id}/status` | Đổi trạng thái đơn, tự trừ tồn kho khi hoàn tất | Cần hoàn thiện — đang chờ nối nút cập nhật trên giao diện quản trị |
| TC-18 | Payment | Thanh toán qua cổng thật (VNPay/Momo) | — | Redirect cổng, nhận callback, xác minh chữ ký | Chưa kiểm thử được — hệ thống hiện dùng luồng thanh toán giả lập ở Frontend, cổng thanh toán thật là hướng phát triển tiếp theo |
| TC-19 | Security | Gọi endpoint yêu cầu xác thực mà không có token | `GET /api/gym/sessions/my`, không header | HTTP 401 | Đạt |
| TC-20 | Security | Gọi endpoint yêu cầu xác thực với token sai định dạng | Token giả | HTTP 401 | Đạt |
| TC-21 | Security | SQL Injection payload trong ô email đăng nhập | `email: "alex@fitfuel.com' OR 1=1;--"` | Không lộ dữ liệu, không crash | Đạt — payload bị chặn ngay ở tầng kiểm tra định dạng email, không chạm tới cơ sở dữ liệu |
| TC-22 | Security | XSS payload trong ô số điện thoại (Guest OTP) | Chuỗi HTML ngắn | Được lọc hoặc từ chối | Cần hoàn thiện — dữ liệu hiện được lưu nguyên văn, nên bổ sung một lớp sanitize input ở bước tiếp theo |

**22 test case**, bao phủ Auth, Guest OTP, Gym, Food, AI Gợi ý, Gear Lifecycle, Vendor, Payment và Security.

---

**4.7. Đánh giá hệ thống**

**4.7.1. Mục tiêu đánh giá**

Xác nhận các yêu cầu chức năng (FR) ưu tiên cao đã được triển khai và hoạt động đúng trên môi trường production, đồng thời ghi nhận một số yêu cầu phi chức năng (NFR) cơ bản về bảo mật và thời gian phản hồi trong phạm vi có thể đo được.

**4.7.2. Phạm vi đánh giá**

Kiểm thử tập trung ở tầng API (Backend FastAPI, `full-stack-ccd7.onrender.com`), kết hợp đối chiếu với kết quả rà soát mã nguồn Frontend để xác nhận tính năng đã sẵn sàng phục vụ người dùng. Kiểm thử đa thiết bị/đa trình duyệt và đo hiệu năng bằng công cụ chuyên dụng (Lighthouse) là hướng mở rộng cho các đợt kiểm thử tiếp theo.

**4.7.3. Cấu hình môi trường kiểm thử**

| Thành phần | Giá trị thực tế |
| :---- | :---- |
| Backend | `https://full-stack-ccd7.onrender.com` (FastAPI, xác nhận qua endpoint `/health`) |
| Database | PostgreSQL (Render managed) |
| Frontend | Vercel (React + Vite) |
| Công cụ kiểm thử | Gọi API trực tiếp bằng `curl`, đối chiếu chéo với kết quả rà soát mã nguồn |

**4.7.4. Kiểm thử API**

Kiểm thử API được thực hiện bằng các lệnh gọi trực tiếp vào các nhóm endpoint chính: Auth, Gym, Food và Gear. Các kịch bản test bao gồm Happy path, một số Edge case (như giới hạn số lần thử OTP) và các kiểm tra bảo mật cơ bản (không token, token sai định dạng, SQL Injection, XSS), được trình bày chi tiết tại Bảng 4.1.

**4.7.5. Kết quả kiểm thử chức năng**

Bảng dưới đây tổng hợp mức độ hoàn thành theo từng nhóm chức năng chính của hệ thống, dựa trên việc đối chiếu giữa thiết kế ban đầu và trạng thái triển khai thực tế trên giao diện.

| Module | Đánh giá chung |
| :---- | :---- |
| Đăng ký / Đăng nhập / OTP | Luồng đăng nhập chính hoạt động ổn định; một số luồng phụ (đăng ký qua form riêng, OTP khách vãng lai) đang được hoàn thiện |
| Hồ sơ người dùng | Xem hồ sơ hoạt động tốt; các chức năng chỉnh sửa đang ở giai đoạn hoàn thiện giao diện |
| Gym & buổi tập | Nhóm lõi (tạo buổi tập, ghi nhận set, phát hiện PR, theo dõi tiến độ) hoạt động đầy đủ và có kiểm thử tích hợp; các trang thống kê phía quản trị đang tiếp tục phát triển |
| Dinh dưỡng nội bộ | Xem sản phẩm, đặt hàng và gợi ý AI hoạt động tốt; một số thao tác phía nhân viên đang hoàn thiện |
| Gear Marketplace | Xem và thuê thiết bị hoạt động ổn định; quản trị đăng bán đang tiếp tục nối giao diện với API |
| Gamification | Đã có nền tảng API cho thử thách, bảng xếp hạng và huy hiệu; giao diện tương ứng là hạng mục ưu tiên phát triển tiếp theo |
| FitCoin | Xem số dư và chương trình giới thiệu bạn bè hoạt động đúng với dữ liệu thật |
| Notifications | Hoàn thiện |
| AI Coaching | Gợi ý dinh dưỡng sau buổi tập hoạt động tốt; trang giới thiệu Trợ lý AI dẫn người dùng sang khung chat FitAI theo đúng chủ đích thiết kế |
| Delivery | Quản lý địa chỉ và tính phí giao hàng hoạt động tốt; trang quản lý đơn giao hàng phía quản trị đang hoàn thiện |
| Khách vãng lai (Guest) | Xem trước đơn hàng hoạt động tốt; luồng checkout đầy đủ cho khách vãng lai là hạng mục tiếp theo cần hoàn thiện |
| Transformation Journey | Trang điều hướng trung tâm hoạt động tốt; các phân hệ con (tiến độ, cột mốc, chương trình mẫu) đang tiếp tục phát triển |
| Trang quản trị (Admin) | Đây là hạng mục còn nhiều tiềm năng phát triển tiếp theo, đặc biệt là các báo cáo thống kê tổng quan |

Nhìn chung, các luồng nghiệp vụ trọng tâm mà đồ án hướng tới — theo dõi buổi tập, gợi ý dinh dưỡng bằng AI, đặt hàng, thuê thiết bị, chương trình giới thiệu bạn bè và hệ thống thông báo — đã được triển khai đầy đủ, hoạt động ổn định trên môi trường production và có kiểm thử tích hợp đi kèm. Các phần còn lại, chủ yếu là các trang quản trị dành cho Gym Owner/Vendor và một số tính năng xã hội mở rộng, đã có sẵn nền tảng API và được xác định là hướng phát triển tiếp theo của đồ án.

**4.7.6. Phân tích yêu cầu phi chức năng**

| Tiêu chí NFR | Phương pháp đo | Kết quả thực tế |
| :---- | :---- | :---- |
| Thời gian phản hồi API (endpoint đọc dữ liệu) | Đo qua nhiều lượt gọi trên môi trường production | Trung bình dưới 0.3 giây, phản hồi nhanh |
| Thời gian phản hồi API (đăng nhập, có xác thực bcrypt) | Như trên | Khoảng 1.5 giây, chấp nhận được cho một bước xác thực có tính toán mã hoá |
| Chặn truy cập không có token / token không hợp lệ | Gọi endpoint được bảo vệ | Trả về đúng mã lỗi xác thực, không cho truy cập |
| Chống SQL Injection ở tầng nhập liệu | Thử payload SQL Injection vào ô email | Được chặn ngay từ bước kiểm tra định dạng, không chạm tới cơ sở dữ liệu |
| Chống XSS ở tầng nhập liệu | Thử payload HTML vào ô số điện thoại | Dữ liệu hiện được lưu nguyên văn — đây là điểm cần bổ sung thêm lớp sanitize ở phiên bản kế tiếp |
| Giới hạn số lần thử OTP sai | Gọi xác thực sai liên tiếp | Cơ chế đếm lượt thử cần được rà soát lại để hoạt động chính xác giữa các lượt gọi |
| Page load / Responsive / Số bước checkout | — | Chưa đo trong đợt kiểm thử này, đề xuất bổ sung ở giai đoạn hoàn thiện sản phẩm |

**4.7.7. Ràng buộc và đánh giá rủi ro**

| Rủi ro | Mức độ ảnh hưởng | Biện pháp giảm thiểu |
| :---- | :---- | :---- |
| Backend triển khai trên Render, gói dịch vụ miễn phí có thể "ngủ" sau thời gian không có truy cập | Thấp–Trung bình — lượt gọi đầu tiên sau thời gian rảnh có thể chậm hơn bình thường | Xác nhận lại gói dịch vụ trước khi vận hành thật, hoặc dùng cơ chế ping định kỳ để giữ backend luôn sẵn sàng |
| Lưu trữ ảnh qua Cloudinary ở gói miễn phí, có giới hạn dung lượng và băng thông hàng tháng | Thấp–Trung bình, tăng theo số lượng người dùng thật | Theo dõi mức sử dụng, nâng gói khi cần |
| Cơ chế giới hạn số lần thử OTP chưa hoạt động đúng như thiết kế | Trung bình — giảm hiệu quả của lớp bảo vệ chống dò mã cho luồng khách vãng lai | Rà soát lại việc lưu trạng thái số lượt thử giữa các lần gọi |
| Dữ liệu đầu vào ở một số trường chưa được sanitize | Trung bình — rủi ro dữ liệu không mong muốn được lưu nguyên văn | Bổ sung lớp lọc/escape cho các trường nhập liệu tự do trước khi lưu vào cơ sở dữ liệu |
| Chưa tích hợp cổng thanh toán thật (VNPay/Momo), hiện dùng luồng giả lập ở Frontend | Cao — chưa thể xử lý giao dịch tiền thật | Tích hợp cổng thanh toán thật, xác minh chữ ký callback trước khi vận hành thật |
| OTP hiện trả trực tiếp trong response (phục vụ demo), chưa gửi qua SMS thật | Trung bình — chỉ phù hợp môi trường demo | Tích hợp nhà cung cấp SMS trước khi vận hành thật |
