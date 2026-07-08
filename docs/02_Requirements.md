# 02. YÊU CẦU HỆ THỐNG
# (System Requirements Specification)

> Dự án: FitFuel+  
> Môn học: Web Kinh Doanh  
> Cập nhật: 01/07/2026  
> Định hướng: Hệ thống quản lý phòng tập gym single-tenant, kết hợp theo dõi tập luyện, membership, bán hàng nội bộ, Gear Marketplace, Delivery và AI retention.

========================================================================

## 3.3. YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS)

### 3.3.1. Quản lý tài khoản

| Mã YC | Actor | Yêu cầu chức năng | Ưu tiên | Use case |
|---|---|---|---|---|
| FR-001 | Guest, Member | Hệ thống cho phép khách đăng ký tài khoản Member thông qua luồng mua gói tập, gồm luồng online và luồng tại quầy. Trang `/auth/register` chỉ dùng cho Gym Owner, không dùng để tạo Member rời. | Cao | UC-03 |
| FR-002 | Member, Gym Owner | Hệ thống cho phép người dùng đăng nhập bằng email hoặc số điện thoại và mật khẩu, cấp JWT token sau khi xác thực thành công. | Cao | UC-04 |
| FR-003 | Member | Hệ thống cho phép Member cập nhật hồ sơ cá nhân gồm họ tên, avatar, mục tiêu thể hình, chiều cao, cân nặng và dị ứng cá nhân. | Cao | UC-04 |
| FR-004 | Member | Hệ thống hiển thị Fitness Passport gồm tổng số buổi tập, tổng volume, longest streak, ảnh body transformation và badge đã đạt. | Cao | UC-04 |
| FR-005 | Member | Hệ thống cho phép Member cấu hình quyền riêng tư cho Fitness Passport và ảnh body. | Trung bình | UC-04 |

### 3.3.2. Gym Tracking và Check-in

| Mã YC | Actor | Yêu cầu chức năng | Ưu tiên | Use case |
|---|---|---|---|---|
| FR-006 | Member | Hệ thống cho phép Member check-in phòng tập bằng QR hoặc số điện thoại; hệ thống phải kiểm tra gói tập còn hiệu lực trước khi ghi nhận. | Cao | UC-06 |
| FR-007 | Member | Hệ thống cho phép tạo workout session mới với ngày tập, nhóm cơ chính và ghi chú tùy chọn. | Cao | UC-06 |
| FR-008 | Member | Hệ thống cho phép ghi nhận bài tập trong session, gồm tên bài, nhóm cơ, số set, reps và mức tạ. | Cao | UC-06 |
| FR-009 | Hệ thống | Hệ thống tự động kiểm tra và ghi nhận Personal Record sau mỗi buổi tập. | Cao | UC-06 |
| FR-010 | Member | Hệ thống cho phép xem lịch sử buổi tập, số bài tập, tổng volume và thời lượng từng session. | Cao | UC-07 |
| FR-011 | Member | Hệ thống hiển thị biểu đồ tiến trình theo từng bài tập và theo khoảng thời gian. | Trung bình | UC-07 |
| FR-012 | Hệ thống | Hệ thống gợi ý nhóm cơ nên tập dựa trên lịch sử 7 ngày gần nhất. | Trung bình | UC-05 |
| FR-013 | Member | Hệ thống hiển thị thống kê tổng hợp như tổng buổi tập, volume, streak, XP và level. | Trung bình | UC-07 |

### 3.3.3. Membership Lifecycle

| Mã YC | Actor | Yêu cầu chức năng | Ưu tiên | Use case |
|---|---|---|---|---|
| FR-014 | Gym Owner | Hệ thống cho phép quản lý 2 loại gói tập: Gói Tháng và Gói Năm. Hai gói có quyền lợi giống nhau, chỉ khác thời hạn và giá. | Cao | UC-03, UC-12 |
| FR-015 | Gym Owner, Member | Hệ thống cho phép đăng ký gói tập cho hội viên tại quầy hoặc online. Sau khi thanh toán thành công, hệ thống tạo membership, hóa đơn và lịch sử gói. | Cao | UC-03, UC-12 |
| FR-016 | Member, Gym Owner | Hệ thống cho phép gia hạn gói tập và lưu toàn bộ lịch sử gia hạn vào `MEMBERSHIP_HISTORY`. | Cao | UC-10 |
| FR-017 | Member | Hệ thống cho phép chuyển từ Gói Tháng sang Gói Năm và tính phí chênh lệch theo số ngày còn lại. | Trung bình | UC-10 |
| FR-018 | Member, Gym Owner | Hệ thống hỗ trợ yêu cầu tạm ngưng/bảo lưu gói tập; Gym Owner duyệt và hệ thống cộng bù thời gian sau khi hết bảo lưu. | Trung bình | UC-10 |
| FR-019 | Gym Owner | Hệ thống hiển thị danh sách hội viên sắp hết hạn theo mốc 7/14/30 ngày. | Cao | UC-14 |
| FR-020 | Gym Owner | Hệ thống hiển thị danh sách hội viên lâu chưa check-in, mặc định từ 14 ngày trở lên. | Cao | UC-14 |
| FR-021 | Gym Owner | Hệ thống hiển thị lịch sử membership và hóa đơn của từng hội viên. | Cao | UC-14 |
| FR-022 | Gym Owner | Hệ thống cung cấp báo cáo membership gồm hội viên mới, gia hạn, doanh thu theo gói, tỷ lệ gia hạn và trạng thái active/expired/suspended. | Cao | UC-15 |

### 3.3.4. Nutrition - Bán dinh dưỡng nội bộ

| Mã YC | Actor | Yêu cầu chức năng | Ưu tiên | Use case |
|---|---|---|---|---|
| FR-023 | Gym Owner | Hệ thống cho phép quản lý sản phẩm dinh dưỡng nội bộ gồm tên, danh mục, giá, calo, macro, dị ứng, ảnh, trạng thái và tồn kho. | Cao | UC-13 |
| FR-024 | Gym Owner | Hệ thống hỗ trợ POS bán sản phẩm dinh dưỡng tại quầy cho Member hoặc Guest đã xác thực OTP. | Cao | UC-08, UC-13 |
| FR-025 | Member | Hệ thống cho phép Member đặt trước sản phẩm dinh dưỡng sau buổi tập và nhận tại quầy. | Trung bình | UC-08 |
| FR-026 | Gym Owner | Hệ thống cho phép tạo combo gói tập + dinh dưỡng hoặc combo nhiều sản phẩm dinh dưỡng. | Trung bình | UC-13 |
| FR-027 | Hệ thống | Sau khi Member hoàn thành buổi tập, hệ thống gợi ý tối đa 3 sản phẩm dinh dưỡng dựa trên nhóm cơ, mục tiêu, volume và lịch sử mua hàng. | Cao | UC-08 |
| FR-028 | Gym Owner | Hệ thống quản lý tồn kho dinh dưỡng, cảnh báo tồn kho thấp và báo cáo sản phẩm bán chạy. | Cao | UC-13 |
| FR-029 | Gym Owner | Hệ thống hiển thị báo cáo doanh thu dinh dưỡng theo ngày, tuần, tháng và sản phẩm. | Cao | UC-15 |

### 3.3.5. Gamification

| Mã YC | Actor | Yêu cầu chức năng | Ưu tiên | Use case |
|---|---|---|---|---|
| FR-030 | Member | Hệ thống hiển thị XP, level và lịch sử tăng điểm của Member. | Trung bình | UC-07 |
| FR-031 | Member | Hệ thống hiển thị badge đã mở khóa và badge chưa đạt. | Trung bình | UC-07 |
| FR-032 | Member | Hệ thống cho phép Member tham gia Weekly Challenge và theo dõi tiến độ hoàn thành. | Thấp | UC-07 |
| FR-033 | Member | Hệ thống hiển thị bảng xếp hạng theo XP, có lọc theo tuần/tháng/toàn hệ thống. | Trung bình | UC-07 |

### 3.3.6. Payment và FitCoin

| Mã YC | Actor | Yêu cầu chức năng | Ưu tiên | Use case |
|---|---|---|---|---|
| FR-034 | Hệ thống, Payment Gateway | Hệ thống xử lý thanh toán qua VNPay hoặc MoMo sandbox và nhận callback thành công/thất bại. | Cao | UC-16 |
| FR-035 | Member | Hệ thống cho phép Member gia hạn hoặc nâng cấp membership thông qua thanh toán online. | Cao | UC-10, UC-16 |
| FR-036 | Member | Hệ thống cho phép nạp tiền vào ví FitCoin theo tỷ giá 1 FitCoin = 1 VND. | Trung bình | UC-16 |
| FR-037 | Member | Hệ thống cho phép sử dụng FitCoin để mua dinh dưỡng hoặc gia hạn membership, tối đa 50% giá trị đơn hàng. | Cao | UC-16 |

### 3.3.7. AI Retention và Reporting

| Mã YC | Actor | Yêu cầu chức năng | Ưu tiên | Use case |
|---|---|---|---|---|
| FR-038 | Gym Owner | Hệ thống hiển thị AI Care Queue gồm danh sách hội viên cần chăm sóc, lý do, mức ưu tiên và gợi ý hành động. | Cao | UC-14 |
| FR-039 | Gym Owner | Hệ thống cho phép ghi nhận kết quả chăm sóc hội viên như đã liên hệ, gia hạn thành công, từ chối hoặc không liên lạc được. | Cao | UC-14 |
| FR-040 | Hệ thống | Hệ thống tạo recommendation tự động theo các rule: sắp hết hạn, hết hạn, lâu chưa check-in, nên upsell gói, nên gợi ý dinh dưỡng hoặc gear. | Cao | UC-14 |
| FR-041 | Gym Owner | Hệ thống hiển thị gợi ý upsell/cross-sell dựa trên hành vi tập luyện, mua dinh dưỡng và mua/thue gear. | Trung bình | UC-14 |
| FR-042 | Gym Owner | Hệ thống hiển thị Dashboard KPI gồm doanh thu, hội viên, tồn kho, care queue và các chỉ số vận hành chính. | Cao | UC-15 |
| FR-043 | Gym Owner | Hệ thống cung cấp các báo cáo phân tích như hội viên sắp hết hạn, doanh thu theo dịch vụ, sản phẩm bán chạy và tỷ lệ xử lý recommendation. | Cao | UC-15 |

### 3.3.8. Quản trị hệ thống

| Mã YC | Actor | Yêu cầu chức năng | Ưu tiên | Use case |
|---|---|---|---|---|
| FR-044 | Gym Owner | Hệ thống cho phép quản lý thông tin phòng tập gồm tên, địa chỉ, số điện thoại, giờ mở cửa và logo. | Cao | UC-12 |
| FR-045 | Gym Owner | Hệ thống cho phép quản lý toàn bộ user, xem danh sách Member, tìm kiếm, lọc, khóa và mở khóa tài khoản. | Cao | UC-12 |
| FR-046 | Gym Owner | Hệ thống cho phép tạo và gửi thông báo đến toàn bộ hội viên hoặc nhóm hội viên cụ thể. | Trung bình | UC-12 |

### 3.3.9. Transformation Journey Engine

| Mã YC | Actor | Yêu cầu chức năng | Ưu tiên | Use case |
|---|---|---|---|---|
| FR-047 | Member | Hệ thống cho phép Member tạo mục tiêu cá nhân qua wizard gồm mục tiêu, chỉ tiêu, số ngày tập/tuần, trình độ và lựa chọn chương trình. | Cao | UC-05 |
| FR-048 | Hệ thống | Hệ thống gợi ý 2-3 chương trình tập phù hợp dựa trên mục tiêu, trình độ và số ngày tập mỗi tuần. | Cao | UC-05 |
| FR-049 | Hệ thống | Hệ thống sinh buổi tập hôm nay sau khi Member chọn nhóm cơ, gồm bài tập, sets, reps và mức tạ gợi ý. | Cao | UC-05 |
| FR-050 | Member | Hệ thống cho phép Member chỉnh sửa buổi tập được gợi ý trước khi bắt đầu, gồm thêm/xóa bài, đổi sets/reps và thứ tự bài. | Cao | UC-05 |
| FR-051 | Member | Hệ thống cho phép Member thực hiện buổi tập theo chương trình và ghi nhận dữ liệu thực tế. | Cao | UC-06 |
| FR-052 | Hệ thống | Hệ thống tính Progressive Overload sau mỗi buổi tập và lưu gợi ý tăng/giữ/giảm tạ cho buổi sau. | Cao | UC-06 |
| FR-053 | Member | Hệ thống hiển thị Progress Dashboard 3 tab: Hành Trình, Sức Mạnh và Cơ Thể. | Cao | UC-07 |
| FR-054 | Member | Hệ thống cho phép cập nhật số đo cơ thể như cân nặng, vòng bụng, body fat và hiển thị xu hướng theo thời gian. | Trung bình | UC-04 |
| FR-055 | Hệ thống | Hệ thống kích hoạt Milestone Engine sau các hành động quan trọng, trao XP, FitCoin và thông báo cho Member. | Cao | UC-11 |
| FR-056 | Member | Hệ thống tạo Share Card cho milestone lớn để Member tải về hoặc chia sẻ. | Trung bình | UC-11 |
| FR-057A | Member | Hệ thống cung cấp mã giới thiệu (Referral Code) và link giới thiệu cá nhân để Member chia sẻ lên MXH hoặc gửi trực tiếp cho bạn bè. | Cao | UC-11 |
| FR-057B | Guest, Member | Khi Guest đăng ký tài khoản và mua gói Membership thành công qua link giới thiệu, hệ thống tự động cộng thưởng (VD: 1 tháng tập miễn phí) cho cả người giới thiệu và người được giới thiệu. | Cao | UC-03, UC-11 |
| FR-057C | Member | Hệ thống cung cấp giao diện (Dashboard) để Member theo dõi danh sách bạn bè đã mời thành công và phần thưởng đã nhận được. | Trung bình | UC-11 |
| FR-057 | Gym Owner | Hệ thống cho phép Gym Owner quản lý thư viện chương trình tập gồm tạo, sửa, ẩn/hiện, sao chép chương trình và cấu hình ngày/bài tập. | Cao | UC-12 |

### 3.3.10. Gear Marketplace và Guest OTP Checkout

| Mã YC | Actor | Yêu cầu chức năng | Ưu tiên | Use case |
|---|---|---|---|---|
| FR-058 | Guest | Hệ thống cho phép Guest/Visitor xác thực bằng số điện thoại và OTP 6 số để đăng ký tài khoản trải nghiệm (Free Trial / Gym Tour); session khách có hiệu lực 2 giờ. | Cao | UC-02 |
| FR-059 | Gym Owner | Hệ thống cho phép quản lý catalog gear gồm tên, mô tả, danh mục, giá bán, giá thuê/ngày, tiền cọc, số lượng và trạng thái bán/thuê. | Cao | UC-13 |
| FR-060 | Gym Owner, Member, Guest | Hệ thống cho phép bán gear tại quầy hoặc online, tạo hóa đơn `gear_sale` và trừ tồn kho. | Cao | UC-09, UC-13 |
| FR-061 | Member | Hệ thống cho phép Member thuê gear, chọn ngày bắt đầu/ngày trả, thanh toán tiền cọc và phí thuê trước khi nhận. Guest không được thuê gear. | Cao | UC-09 |
| FR-062 | Gym Owner | Hệ thống cho phép xác nhận trả gear, xử lý hoàn cọc, trừ cọc hoặc tạo hóa đơn bồi thường khi gear hỏng/mất. | Cao | UC-09, UC-13 |
| FR-063 | Member, Gym Owner | Hệ thống cho phép xem lịch sử mua và thuê gear theo từng người dùng hoặc toàn hệ thống. | Trung bình | UC-09, UC-13 |
| FR-064 | Hệ thống | Hệ thống tự động chuyển gear đang thuê sang trạng thái quá hạn và tính phí phạt khi quá ngày trả. | Cao | UC-09, UC-13 |
| FR-065 | Gym Owner | Hệ thống hiển thị báo cáo gear gồm doanh thu bán, doanh thu thuê, tiền cọc đang giữ, gear bán chạy, gear thuê nhiều và gear quá hạn. | Trung bình | UC-15 |


### 3.3.11. Delivery và quản lý đơn hàng

| Mã YC | Actor | Yêu cầu chức năng | Ưu tiên | Use case |
|---|---|---|---|---|
| FR-066 | Member | Hệ thống cho phép Member thêm, sửa, xóa và đặt mặc định địa chỉ giao hàng. | Cao | UC-08, UC-09 |
| FR-067 | Member, Guest | Hệ thống cho phép chọn hình thức nhận hàng: lấy tại quầy hoặc giao hàng. Nếu chọn giao hàng, người dùng phải cung cấp địa chỉ nhận. | Cao | UC-08, UC-09 |
| FR-068 | Hệ thống | Hệ thống tính phí giao hàng real-time, miễn phí giao hàng cho đơn từ 200.000 VND trở lên. | Cao | UC-08, UC-09 |
| FR-069 | Hệ thống | Đơn giao hàng bắt buộc thanh toán online trước khi xác nhận; không hỗ trợ COD. | Cao | UC-08, UC-09 |
| FR-070 | Gym Owner | Hệ thống cho phép Gym Owner xác nhận đơn, chuyển trạng thái sang đang chuẩn bị và tạo đơn vận chuyển qua GHN/Ahamove hoặc mock provider. | Cao | UC-13 |
| FR-071 | Member, Guest | Hệ thống cho phép theo dõi trạng thái đơn hàng theo luồng: chờ xác nhận, đang chuẩn bị, đã giao shipper, đang giao, đã nhận hoặc đã hủy. | Cao | UC-08, UC-09 |
| FR-072 | Hệ thống | Hệ thống gửi notification khi trạng thái đơn hàng thay đổi. | Trung bình | UC-08, UC-09 |
| FR-073 | Member, Gym Owner | Hệ thống cho phép hủy đơn trước khi shipper lấy hàng và xử lý hoàn tiền/mở khóa FitCoin theo quy tắc nghiệp vụ. | Trung bình | UC-08, UC-09 |

## 3.4. YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS)

### 3.4.1. Hiệu năng

| Mã YC | Mô tả | Chỉ số |
|---|---|---|
| NFR-001 | Thời gian tải trang chính | Dưới 2 giây trong điều kiện mạng ổn định |
| NFR-002 | Thời gian phản hồi API phổ biến | Dưới 500ms với dữ liệu mẫu của đồ án |
| NFR-003 | Khả năng phục vụ đồng thời | Tối thiểu 100 người dùng đồng thời |

### 3.4.2. Bảo mật

| Mã YC | Mô tả | Chỉ số |
|---|---|---|
| NFR-004 | Mật khẩu được mã hóa | bcrypt, tối thiểu 10 rounds |
| NFR-005 | Truyền dữ liệu an toàn | HTTPS/TLS khi triển khai |
| NFR-006 | Xác thực phiên đăng nhập | JWT token, thời hạn 7 ngày |
| NFR-007 | Chống tấn công phổ biến | Có validate input, chống SQL injection, XSS và CSRF |
| NFR-008 | Bảo vệ callback thanh toán | Kiểm tra chữ ký/HMAC và idempotency |

### 3.4.3. Khả dụng và trải nghiệm người dùng

| Mã YC | Mô tả | Chỉ số |
|---|---|---|
| NFR-009 | Giao diện responsive | Hỗ trợ từ màn hình mobile 375px trở lên |
| NFR-010 | Tương thích trình duyệt | Chrome, Edge, Firefox, Safari phiên bản phổ biến |
| NFR-011 | Checkout ngắn gọn | Tối đa 3 bước chính |
| NFR-012 | Khả năng đọc | Font chữ tối thiểu 14px, contrast tối thiểu 4.5:1 |
| NFR-013 | Tương tác mobile | Vùng chạm nút tối thiểu 44x44px |

### 3.4.4. Tin cậy và dữ liệu

| Mã YC | Mô tả | Chỉ số |
|---|---|---|
| NFR-014 | Sao lưu dữ liệu | Backup hằng ngày khi triển khai thật |
| NFR-015 | Xử lý lỗi | Thông báo lỗi thân thiện, không hiển thị stack trace cho người dùng |
| NFR-016 | Tính toàn vẹn giao dịch | Thanh toán, tạo hóa đơn, trừ kho và cộng FitCoin phải xử lý nhất quán |

### 3.4.5. Quyền riêng tư

| Mã YC | Mô tả | Chỉ số |
|---|---|---|
| NFR-017 | Quyền riêng tư Fitness Passport | Member có thể bật/tắt public Passport |
| NFR-018 | Quyền riêng tư ảnh body | Member có thể ẩn ảnh body transformation |
| NFR-019 | Xóa tài khoản | Member có quyền yêu cầu xóa hoặc vô hiệu hóa tài khoản theo chính sách hệ thống |

========================================================================
KẾT THÚC FILE 02
========================================================================
