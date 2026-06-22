# 03. XÁC ĐỊNH TÁC NHÂN VÀ BIỂU ĐỒ USE CASE
# (Actor Identification & Use Case Diagram)

> Dự án: FitFuel+
> Môn học: Web Kinh Doanh
> Phiên bản: 3.0 (22/06/2026 — Sửa lỗi đồng nhất 64 UC IDs)

========================================================================

## 1. DANH SÁCH TÁC NHÂN (ACTOR)
========================================================================

### Actor 1: GUEST (Khách vãng lai)
- **Loại**: Chính (Primary)
- **Mô tả**: Người dùng chưa có tài khoản. Xác thực bằng SDT + OTP (6 số, TTL 10 phút) để mua dịch vụ tại quầy hoặc online. Có thể mua đồ ăn, gear, thực phẩm bổ sung — nhưng **KHÔNG** được thuê gear (phải có tài khoản Member).
- **Lưu ý kỹ thuật**: Guest KHÔNG phải là role trong database. Hệ thống lưu `guest_phone` trong NUTRITION_ORDERS và INVOICES (user_id = NULL). GEAR_RENTALS chỉ nhận user_id (Member only).
- **Tương tác**: Xác thực OTP, xem thông tin phòng tập & gói tập, mua food/gear/supplement tại quầy hoặc online, đăng ký thành viên (luồng mua Membership), xem Fitness Passport public (nếu public).

### Actor 2: MEMBER (Hội viên)
- **Loại**: Chính (Primary)
- **Mô tả**: Người đã đăng ký tài khoản và có gói tập (Membership) đang hoạt động trên hệ thống.
- **Tương tác**: Check-in phòng tập (QR), ghi nhận buổi tập (Workout Log), xem tiến trình cá nhân, xem và mua sản phẩm dinh dưỡng nội bộ, tích lũy XP/Streak/Badge, tham gia thử thách, gia hạn gói tập.

### Actor 3: GYM OWNER / ADMIN (Chủ phòng tập / Quản trị viên)
- **Loại**: Chính (Primary)
- **Mô tả**: Chủ/nhân sự quản lý phòng tập gym duy nhất của hệ thống (single-tenant — không phải chuỗi nhiều chi nhánh), đồng thời giữ vai trò quản trị hệ thống. Đây là **1 role duy nhất** trong hệ thống.
- **Lưu ý kỹ thuật**:
  - Database & Backend: role = `gym_owner` (snake_case)
  - Frontend (React): role = `gymOwner` (camelCase)
  - Gym Owner giữ quyền truy cập cả khu vực `/gym-owner/*` (quản lý phòng tập) lẫn `/admin/*` (quản trị hệ thống).
- **Tương tác**: Quản lý hội viên và gói tập (đăng ký, gia hạn, chuyển gói, bảo lưu), quản lý check-in, quản lý sản phẩm dinh dưỡng nội bộ và tồn kho, quản lý Gear Marketplace (catalog, bán, cho thuê, trả gear), xem AI care queue và thực hiện chăm sóc hội viên, xem dashboard KPI và báo cáo kinh doanh.

### Actor 4: TIMER (Hệ thống định thời)
- **Loại**: Phụ (Secondary / System Actor)
- **Mô tả**: Hệ thống tự động kích hoạt các tiến trình định kỳ theo thời gian thực.
- **Tương tác**: Tự động reset streak tập luyện của hội viên (nếu quá 2 ngày không tập), quét hội viên sắp hết hạn gói tập để đưa vào AI care queue, gửi nhắc nhở gia hạn tự động, cảnh báo tồn kho thấp.

### Actor 5: PAYMENT GATEWAY (Cổng thanh toán ngoại)
- **Loại**: Phụ (Secondary / System Actor)
- **Mô tả**: Cổng thanh toán trực tuyến MoMo hoặc VNPay (sandbox).
- **Tương tác**: Tiếp nhận yêu cầu thanh toán từ FitFuel+, xử lý giao dịch và trả về kết quả thành công/thất bại thông qua callback API.

========================================================================

## 1B. BẢNG ĐỐI CHIẾU TÊN ACTOR - ROLE - CODE
========================================================================

Actor trong tài liệu | role trong DB (snake_case) | role trong FE (camelCase) | Ghi chú
---------------------|---------------------------|--------------------------|----------------------------
GUEST                | (không có)                | (không có)               | user_id=NULL
MEMBER               | member                    | member                   | Hội viên có gói tập
GYM OWNER / ADMIN    | gym_owner                 | gymOwner                 | 1 role, quyền cao nhất
TIMER                | (system job)              | (không có)               | Cron job tự động
PAYMENT GATEWAY      | (external API)            | (không có)               | MoMo / VNPay sandbox

========================================================================

## 2. DANH SÁCH 64 USE CASES CHI TIẾT THEO PHÂN HỆ
========================================================================

### Phân hệ 1: Quản lý tài khoản (Account Management) — 4 UC
*   **UC-01: Đăng ký tài khoản Member mới** *(Online: nhập SĐT → thanh toán / Offline to Online: POS QR → Webhook)*
*   **UC-02: Đăng nhập hệ thống** *(Email + Password, JWT token)*
*   **UC-03: Cập nhật thông tin cá nhân** *(Tên, avatar, mục tiêu, chiều cao, cân nặng, dị ứng)*
*   **UC-04: Xem Fitness Passport** *(Hồ sơ thể hình cá nhân)*

### Phân hệ 2: Gym Tracking & Check-in — 8 UC
*   **UC-05: Check-in phòng tập bằng mã QR** *(Hệ thống xác nhận gói tập và quyền lợi tự động)*
*   **UC-06: Tạo workout session**
*   **UC-07: Ghi nhận bài tập (Log Exercise)**
*   **UC-08: Kiểm tra và ghi nhận PR** *(Kỷ lục cá nhân)*
*   **UC-09: Xem lịch sử buổi tập**
*   **UC-10: Xem biểu đồ tiến trình** *(Progress Chart)*
*   **UC-11: Nhận gợi ý tập luyện từ AI** *(Rule-based, extend từ UC-06)*
*   **UC-12: Xem thống kê tổng hợp** *(Stats Dashboard)*

### Phân hệ 3: Membership Lifecycle — 8 UC
*   **UC-13: Tạo và đăng ký gói tập cho hội viên** *(Admin tại quầy hoặc Member tự đăng ký Online)*
*   **UC-14: Gia hạn gói tập** *(Lưu lịch sử gia hạn vào MEMBERSHIP_HISTORY)*
*   **UC-15: Nâng cấp / chuyển gói** *(Tính phí chênh lệch theo ngày)*
*   **UC-16: Tạm ngưng / bảo lưu gói tập**
*   **UC-17: Xem danh sách hội viên sắp hết hạn** *(Admin dashboard — 7/14/30 ngày)*
*   **UC-18: Xem danh sách hội viên lâu chưa check-in** *(Admin — ngưỡng 14 ngày)*
*   **UC-19: Xem lịch sử membership và hóa đơn**
*   **UC-20: Báo cáo membership** *(Hội viên mới, gia hạn, tỷ lệ, doanh thu theo gói)*

### Phân hệ 4: Nutrition (Bán dinh dưỡng nội bộ) — 7 UC
*   **UC-21: Gym Owner quản lý sản phẩm dinh dưỡng** *(Thêm, sửa, ẩn/hiện, cập nhật tồn kho)*
*   **UC-22: Nhân viên bán sản phẩm tại quầy (POS nội bộ)** *(Chọn sản phẩm, tạo hóa đơn gắn member)*
*   **UC-23: Member đặt trước sản phẩm sau buổi tập** *(AI gợi ý → member chọn → nhân viên chuẩn bị)*
*   **UC-24: Tạo combo dinh dưỡng + gói tập** *(Gym Owner tạo, member mua)*
*   **UC-25: Nhận gợi ý dinh dưỡng từ AI** *(Sau khi kết thúc session: gợi ý 3 sản phẩm phù hợp)*
*   **UC-26: Quản lý tồn kho dinh dưỡng** *(Cảnh báo tồn kho thấp, báo cáo sản phẩm bán chạy)*
*   **UC-27: Xem báo cáo doanh thu dinh dưỡng** *(Theo ngày/tuần/tháng, sản phẩm bán chạy)*

### Phân hệ 5: Asset & Amenities — ĐÃ BỎ
*(Locker và khăn là đồ cá nhân của member, không quản lý trong hệ thống. Chức năng cho thuê thiết bị được thay thế bởi Phân hệ 12 — Gear Marketplace. UC-28 đến UC-34 đã xóa.)*

### Phân hệ 6: PT / Lịch tập — ĐÃ BỎ
*(Không có PT role trong hệ thống. UC-35 đến UC-38 đã xóa.)*

### Phân hệ 7: Gamification — 4 UC
*   **UC-39: Xem XP và Level**
*   **UC-40: Xem Badge** *(Huy hiệu thành tựu)*
*   **UC-41: Tham gia thử thách tuần (Weekly Challenge)**
*   **UC-42: Xem bảng xếp hạng**

### Phân hệ 8: Payment & FitCoin — 4 UC
*   **UC-43: Xử lý thanh toán qua cổng** *(Điểm giao tiếp duy nhất với PAYMENT GATEWAY)*
*   **UC-44: Gia hạn / nâng cấp membership** *(<<include>> UC-43)*
*   **UC-45: Nạp tiền vào ví FitCoin** *(<<include>> UC-43)*
*   **UC-46: Tiêu dùng FitCoin** *(Mua dinh dưỡng, gia hạn membership — tối đa 50% đơn hàng)*

### Phân hệ 9: AI Retention & Reporting — 5 UC
*   **UC-47: Xem AI care queue** *(Danh sách hội viên cần chăm sóc, lý do, gợi ý hành động)*
*   **UC-48: Ghi nhận kết quả chăm sóc hội viên** *(Nhan vien log: da lien he, ket qua, ghi chu)*
*   **UC-49: Xem gợi ý upsell / cross-sell** *(Gym Owner: ai nên upsell gói/dinh dưỡng)*
*   **UC-50: Xem Dashboard KPI** *(Doanh thu, hội viên, tồn kho gear/dinh dưỡng, care queue — real-time)*
*   **UC-51: Xem báo cáo phân tích** *(SQL queries chuẩn: gia hạn, churn, sản phẩm bán chạy)*

### Phân hệ 10: Quản trị hệ thống (Admin) — 3 UC
*   **UC-52: Quản lý thông tin phòng tập** *(Tên, địa chỉ, logo, giờ mở cửa — single-tenant)*
*   **UC-53: Quản lý tất cả user** *(Danh sách member, xem, khóa, mở khóa)*
*   **UC-54: Gửi thông báo hệ thống** *(Toàn bộ hoặc nhóm hội viên)*

### Phân hệ 11: Transformation Journey Engine — 8 UC
*   **UC-55: Tạo mục tiêu cá nhân (Goal Onboarding)** *(5 bước: chọn mục tiêu → nhập chỉ tiêu → ngày tập/tuần → trình độ → chọn chương trình)*
*   **UC-56: Chọn và bắt đầu chương trình tập** *(Member chọn 1 trong 2–3 gợi ý, tạo MEMBER_PROGRAMS)*
*   **UC-57: Xem và chỉnh sửa buổi tập được gợi ý** *(Hệ thống gợi ý từ chương trình → member thêm/bỏ/sửa bài → chấp nhận)*
*   **UC-58: Thực hiện buổi tập theo chương trình** *(Log sets/reps/weight trong buổi tập; sau khi hoàn thành kích hoạt 3 engine)*
*   **UC-59: Xem Progress Dashboard 3 tab** *(Hành Trình, Sức Mạnh, Cơ Thể — charts + stats)*
*   **UC-60: Cập nhật số đo cơ thể** *(Member nhập cân nặng, vòng bụng, body fat% → lưu BODY_METRICS)*
*   **UC-61: Nhận và chia sẻ Milestone** *(Milestone Engine tự động; celebrate UX + FitCoin + tạo Share Card)*
*   **UC-62: Gym Owner quản lý thư viện chương trình** *(Tạo / sửa / ẩn chương trình, cấu hình PROGRAM_DAYS + PROGRAM_EXERCISES)*

### Phân hệ 12: Gear Marketplace & Guest OTP Checkout — 7 UC
*   **UC-63: Guest xác thực OTP** *(Nhập SĐT → nhận SMS OTP 6 số → session 2 giờ để mua food/gear/supplement)*
*   **UC-64: Gym Owner quản lý catalog gear** *(Thêm/sửa/ẩn gear: tên, giá bán, giá thuê/ngày, đặt cọc, tồn kho)*
*   **UC-65: Bán gear tại quầy hoặc online** *(Staff/Member/Guest chọn gear → tạo INVOICES gear_sale → trừ qty)*
*   **UC-66: Member đặt thuê gear** *(Member chọn gear, ngày trả, thanh toán đặt cọc + phí trước → GEAR_RENTALS)*
*   **UC-67: Trả gear + xử lý đặt cọc** *(Staff xác nhận tình trạng → hoàn cọc (nguyên vẹn) / trừ cọc (hư/mất))*
*   **UC-68: Xem lịch sử mua/thuê gear** *(Member xem lịch sử; Gym Owner xem toàn bộ)*
*   **UC-69: Báo cáo gear** *(Gym Owner: doanh thu bán, thuê, đặt cọc đang giữ, quá hạn)*

### Phân hệ 13: Delivery & Quản lý đơn hàng — 6 UC
*   **UC-70: Quản lý địa chỉ giao hàng** *(Member: thêm/sửa/xóa/đặt mặc định địa chỉ giao hàng)*
*   **UC-71: Chọn hình thức nhận hàng** *(Member: lựa chọn Lấy tại quầy vs Giao hàng tại checkout)*
*   **UC-72: Tính phí giao hàng real-time** *(Hệ thống tính phí dựa trên giá trị đơn; mien phí khi ≥ 200,000 VND)*
*   **UC-73: Xác nhận & chuẩn bị đơn giao hàng** *(Gym Owner: xác nhận đơn → trạng thái preparing)*
*   **UC-74: Theo dõi trạng thái đơn hàng** *(Member xem: pending → preparing → shipped → delivering → done/cancelled)*
*   **UC-75: Hủy đơn hàng** *(Member: hủy khi status=pending/preparing; hoàn tiền + unlock FitCoin)*

========================================================================

## 3. MA TRẬN TRACEABILITY: UC → MODULE → BẢNG DỮ LIỆU
========================================================================

Use Case          | Module               | Bảng dữ liệu chính                                    | Impact
------------------|----------------------|-------------------------------------------------------|--------
UC-13 Đăng ký gói | Membership           | USERS, GYM_MEMBERSHIPS, MEMBERSHIP_PLANS              | Tăng hội viên mới
UC-14 Gia hạn     | Membership           | GYM_MEMBERSHIPS, MEMBERSHIP_HISTORY, INVOICES         | Tăng retention
UC-05 Check-in    | Check-in             | CHECK_INS, GYM_MEMBERSHIPS, USERS                     | Giảm lỗi vận hành
UC-22 POS bán     | Nutrition            | NUTRITION_PRODUCTS, ORDERS, ORDER_ITEMS, INVENTORY    | Tăng doanh thu phụ trợ
UC-66 Gear Rental | Gear Marketplace     | GEAR_RENTALS, GEAR_PRODUCTS, USERS                    | Tăng doanh thu gear
UC-47 Care queue  | AI                   | RECOMMENDATIONS, CHECK_INS, GYM_MEMBERSHIPS           | Giữ chân hội viên
UC-50 Dashboard   | Reporting            | All tables (aggregated)                               | Ra quyết định nhanh hơn
UC-55 Tạo goal    | Transformation       | TRANSFORMATION_GOALS, MEMBER_PROGRAMS                 | Xóa bỏ confusion ngày 1
UC-57 Sửa gợi ý   | Transformation       | WORKOUT_SESSIONS, PROGRAM_DAYS, PROGRAM_EXERCISES     | Tăng buổi tập hoàn thành
UC-58 Hoàn thành  | Transformation       | EXERCISE_LOGS, PERSONAL_RECORDS, MILESTONE_ACHIEVEMENTS| Giảm churn dài hạn
UC-61 Milestone   | Transformation       | MILESTONE_ACHIEVEMENTS, FITCOIN_TRANSACTIONS          | Viral loop + retention
UC-62 Quản lý CT  | Transformation (GO)  | WORKOUT_PROGRAMS, PROGRAM_DAYS, PROGRAM_EXERCISES     | Kiểm soát chất lượng
UC-63 Guest OTP   | Gear & Guest         | INVOICES (guest_phone), NUTRITION_ORDERS              | Mở rộng khách hàng
UC-65 Bán gear    | Gear & Guest         | GEAR_PRODUCTS, INVOICES                               | Tăng doanh thu bán gear
UC-66 Thuê gear   | Gear (Member only)   | GEAR_RENTALS, GEAR_PRODUCTS, INVOICES                 | Doanh thu thuê thiết bị
UC-67 Trả gear    | Gear                 | GEAR_RENTALS, INVOICES (bồi thường)                   | Bảo vệ tài sản gym
UC-69 Báo cáo gear| Gear (GO)            | GEAR_PRODUCTS, GEAR_RENTALS, INVOICES                 | Ra quyết định nhập hàng
UC-70 Quản lý địa chỉ | Delivery         | SHIPPING_ADDRESSES, USERS                             | Hỗ trợ giao hàng
UC-71 Chọn hình thức | Delivery         | FOOD_ORDERS, SHIPPING_ADDRESSES, INVOICES             | Tăng doanh thu giao hàng
UC-72 Tính phí giao | Delivery          | FOOD_ORDERS, SHIPPING_ADDRESSES                       | Minh bạch chi phí
UC-73 Xác nhận đơn | Delivery (GO)      | FOOD_ORDERS, INVOICES, SHIPPING_ADDRESSES             | Kiểm soát thực hiện
UC-74 Theo dõi đơn | Delivery            | FOOD_ORDERS, NOTIFICATIONS                            | Theo dõi trong thời gian thực
UC-75 Hủy đơn     | Delivery            | FOOD_ORDERS, INVOICES, FITCOIN_TRANSACTIONS           | Linh hoạt giao dịch

========================================================================
KẾT THÚC FILE 03
========================================================================
