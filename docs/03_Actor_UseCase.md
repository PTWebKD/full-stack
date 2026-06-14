# 03. XÁC ĐỊNH TÁC NHÂN VÀ BIỂU ĐỒ USE CASE
# (Actor Identification & Use Case Diagram)

> Dự án: FitFuel+
> Môn học: Web Kinh Doanh
> Phiên bản: 2.1 (Đồng bộ role naming với code & database)

========================================================================

## 1. DANH SÁCH TÁC NHÂN (ACTOR)
========================================================================

### Actor 1: GUEST (Khách vãng lai)
- **Loại**: Chính (Primary)
- **Mô tả**: Người dùng truy cập website hệ thống nhưng chưa đăng ký tài khoản.
- **Lưu ý kỹ thuật**: Guest KHÔNG phải là role trong database (không có bản ghi trong bảng USERS). Hệ thống nhận diện Guest qua `user_id = NULL` trong đơn hàng và `guest_phone` cho OTP checkout.
- **Tương tác**: Xem thực đơn món ăn, tìm kiếm thiết bị, thêm vào giỏ hàng, và đặt hàng nhanh qua xác thực OTP điện thoại.

### Actor 2: MEMBER (Hội viên)
- **Loại**: Chính (Primary)
- **Mô tả**: Người dùng đã đăng ký tài khoản và mua gói tập (Membership) trên hệ thống.
- **Tương tác**: Sử dụng tất cả các chức năng của Guest và các tính năng nâng cao: Ghi nhận buổi tập (Workout Log), nhận gợi ý thực đơn sau tập từ AI, ký gửi/cho thuê thiết bị gym Peer-to-Peer (chỉ cho thuê, không được bán — BR-11B), tích lũy XP/Streak và tham gia thử thách.

### Actor 3: FOOD VENDOR (Đối tác ẩm thực)
- **Loại**: Chính (Primary)
- **Mô tả**: Chủ nhà hàng healthy hoặc nhà cung cấp đồ ăn đăng ký gian hàng trên nền tảng.
- **Tương tác**: Đăng tải thực đơn, xử lý đơn đặt hàng của khách hàng, xem thống kê doanh số.

### Actor 4: GYM OWNER / ADMIN (Chủ phòng tập / Quản trị viên)
- **Loại**: Chính (Primary)
- **Mô tả**: Chủ sở hữu chuỗi phòng tập gym đối tác, đồng thời giữ vai trò quản trị hệ thống. Đây là **1 role duy nhất** trong hệ thống, không tách thành 2 role riêng biệt.
- **Lưu ý kỹ thuật**: 
  - Database & Backend: role = `gym_owner` (snake_case)
  - Frontend (React): role = `gymOwner` (camelCase)
  - Gym Owner giữ quyền truy cập cả khu vực `/gym-owner/*` (quản lý phòng tập) lẫn `/admin/*` (quản trị hệ thống).
- **Tương tác**: Quản lý thông tin hội viên, duyệt bài đăng ký ký gửi thiết bị gym của hội viên, đăng bán thiết bị gym của riêng phòng tập (chỉ bán, không cho thuê — BR-11B), xử lý tranh chấp giao dịch gear và quản lý thiết lập hệ thống.

### Actor 5: TIMER (Hệ thống định thời)
- **Loại**: Phụ (Secondary / System Actor)
- **Mô tả**: Hệ thống tự động kích hoạt các tiến trình định kỳ theo thời gian thực.
- **Tương tác**: Tự động reset streak tập luyện của hội viên (nếu quá 2 ngày không tập), quét gia hạn tự động gói tập, tự động gửi nhắc nhở trả thiết bị thuê khi sắp đến hạn.

### Actor 6: PAYMENT GATEWAY (Cổng thanh toán ngoại)
- **Loại**: Phụ (Secondary / System Actor)
- **Mô tả**: Cổng thanh toán trực tuyến MoMo hoặc VNPay (sandbox).
- **Tương tác**: Tiếp nhận yêu cầu thanh toán giao dịch từ FitFuel+, xử lý giao dịch tiền mặt và trả về kết quả thành công/thất bại thông qua callback API để hệ thống cập nhật trạng thái đơn hàng.

========================================================================

## 1B. BẢNG ĐỐI CHIẾU TÊN ACTOR - ROLE - CODE
========================================================================

Actor trong tài liệu | role trong DB (snake_case) | role trong FE (camelCase) | Ghi chú
---------------------|---------------------------|--------------------------|----------------------------
GUEST                | (không có)                | (không có)               | user_id=NULL, guest_phone
MEMBER               | member                    | member                   | Hội viên có gói tập
FOOD VENDOR          | vendor                    | vendor                   | Đối tác ẩm thực
GYM OWNER / ADMIN    | gym_owner                 | gymOwner                 | 1 role, quyền cao nhất
TIMER                | (system job)              | (không có)               | Cron job tự động
PAYMENT GATEWAY      | (external API)            | (không có)               | MoMo / VNPay sandbox

========================================================================

## 2. DANH SÁCH 56 USE CASES CHI TIẾT THEO PHÂN HỆ
========================================================================

### Phân hệ 1: Quản lý tài khoản (Account Management)
*   **01: Đăng ký tài khoản mới**
*   **02: Đăng nhập bằng email và mật khẩu**
*   **03: Đăng nhập bằng OTP (Guest OTP)**
*   **04: Hợp nhất tài khoản (Merge Guest to Member)**
*   **05: Cập nhật thông tin cá nhân**
*   **06: Xem Fitness Passport (Hồ sơ thể hình)**

### Phân hệ 2: Gym Tracking & Check-in
*   **07: Tạo workout session (Buổi tập mới)**
*   **08: Ghi nhận bài tập (Log Exercise)**
*   **09: Kiểm tra và ghi nhận kỷ lục cá nhân (PR)**
*   **10: Xem lịch sử buổi tập**
*   **11: Xem biểu đồ tiến trình (Progress Chart)**
*   **12: Gợi ý nhóm cơ nên tập (Smart Muscle Suggestion)**
*   **13: Check-in phòng tập bằng mã QR**
*   **14: Xem thống kê tổng hợp**

### Phân hệ 3: Ẩm thực sức khỏe (Food Order)
*   **15: Xem danh sách thực đơn healthy**
*   **16: Lọc món ăn theo calo/macro**
*   **17: Xem chi tiết món ăn**
*   **18: Thêm món ăn vào giỏ hàng**
*   **19: Thêm nhanh từ trang chủ**
*   **20: Thay đổi thuộc tính món ăn trong giỏ hàng**
*   **21: Thanh toán đơn hàng (Checkout)**
*   **22: Chọn phương thức thanh toán**
*   **23: Đặt lại đơn hàng nhanh (Quick Re-order)**
*   **24: Nhận gợi ý thực đơn từ AI**
*   **25: Truy xuất lịch sử buổi tập (cho gợi ý AI)**
*   **26: Tính chỉ số TDEE cá nhân**

### Phân hệ 4: Chợ thiết bị gym (Gear Hub)
*   **27: Xem danh sách thiết bị**
*   **28: Xem vòng đời thiết bị (Gear Lifecycle)**
*   **29: Đặt thuê thiết bị**
*   **30: Đặt cọc trực tuyến**
*   **31: Mua thiết bị**
*   **32: Thanh toán bằng FitCoin**
*   **33: Đăng ký niêm yết thiết bị** (Gym Owner: chỉ bán | Member: chỉ cho thuê)
*   **34: Tạo mã QR và ID thiết bị**
*   **35: Quét mã QR thiết bị**
*   **36: Trả thiết bị thuê khi hết hạn**
*   **37: Nhận gợi ý thiết bị từ AI**

### Phân hệ 5: Thi đua & Gamification
*   **38: Xem XP và Level**
*   **39: Xem Badge**
*   **40: Tham gia thử thách tuần (Weekly Challenge)**
*   **41: Xem bảng xếp hạng (Ranking Board)**

### Phân hệ 6: Thanh toán & Ví FitCoin
*   **42: Xử lý thanh toán đơn hàng (Sandbox)**
*   **43: Gia hạn membership**
*   **44: Nạp tiền vào ví FitCoin**
*   **45: Tích lũy FitCoin (Earn)**
*   **46: Tiêu dùng FitCoin (Spend)**
*   **47: Xem lịch sử giao dịch ví**

### Phân hệ 7: Quản trị B2B & Admin
*   **48: Vendor đăng sản phẩm mới**
*   **49: Vendor xử lý đơn hàng**
*   **50: Vendor xem báo cáo doanh số (Analytics)**
*   **51: Gym Owner quản lý hội viên**
*   **52: Gym Owner gửi thông báo khuyến mãi**
*   **53: Admin duyệt đối tác & xử lý tranh chấp**

### Phân hệ 8: Tương tác xã hội (Social Hub)
*   **54: Post thành tựu lên Feed**
*   **55: Follow người dùng khác**
*   **56: Nhận thưởng qua chương trình Referral**
