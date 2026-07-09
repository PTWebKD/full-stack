import os

with open('d:\\doanWEDKD\\docs\\03_Actor_UseCase.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_content = """

### UC-01: Khám phá dịch vụ (Discovery)
* **Tóm tắt (Description):** Khách vãng lai xem thông tin về phòng tập, tiện ích, các gói tập và nội dung chia sẻ công khai (Public Fitness Passport).
* **Tiền điều kiện (Pre-conditions):** Truy cập Landing Page.
* **Hậu điều kiện (Post-conditions):** Cung cấp thông tin, không thay đổi dữ liệu hệ thống.
* **Luồng sự kiện chính (Main Flow):**
  1. Visitor truy cập trang chủ FitFuel+.
  2. Visitor xem thông tin tiện ích, bảng giá, hoặc dùng công cụ tư vấn chọn gói (Goal Engine).
  3. Hệ thống gợi ý gói tập phù hợp (Tháng/Năm) hoặc mời đăng ký Gym Tour (UC-02).
* **Luồng rẽ nhánh:** Không.
* **Usecase liên quan:** Có thể chuyển tiếp sang UC-02 hoặc UC-03.

### UC-03: Đăng ký Membership
* **Tóm tắt (Description):** Visitor chọn gói tập và tạo tài khoản chính thức trên hệ thống thông qua việc thanh toán.
* **Tiền điều kiện (Pre-conditions):** Visitor chưa có tài khoản hoặc đang là khách dùng thử.
* **Hậu điều kiện (Post-conditions):** Bảng `USERS`, `GYM_MEMBERSHIPS` và `INVOICES` được tạo. Quyền Member được cấp.
* **Luồng sự kiện chính (Main Flow):**
  1. Visitor chọn gói tập (Gói Tháng/Năm) và nhấp "Đăng ký ngay".
  2. Visitor điền thông tin cá nhân (SĐT, Họ Tên, Email).
  3. Hệ thống hiển thị tổng tiền và chuyển qua Cổng thanh toán (UC-16).
  4. Visitor thanh toán thành công.
  5. Hệ thống tạo tài khoản `Member`, kích hoạt gói tập, cấp điểm FitCoin thưởng đầu tiên.
  6. Gửi SMS thông báo mật khẩu đăng nhập tạm thời.
* **Luồng rẽ nhánh (Alternative Flows):**
  * *3a. Đăng ký qua POS (Offline to Online):* Admin quét QR tại quầy, hệ thống tự sinh hóa đơn và yêu cầu Visitor thanh toán qua Momo/VNPay. Hệ thống vẫn tự động tạo tài khoản như trên.
* **Usecase liên quan:** `<<include>> UC-16`.

### UC-04: Quản lý hồ sơ cá nhân
* **Tóm tắt (Description):** Hội viên cập nhật các thông tin cá nhân, chỉ số cơ thể, hình đại diện, và sở thích dinh dưỡng (dị ứng).
* **Tiền điều kiện (Pre-conditions):** Đã đăng nhập với quyền Member.
* **Hậu điều kiện (Post-conditions):** Cập nhật dữ liệu vào bảng `USERS` và `BODY_METRICS`.
* **Luồng sự kiện chính (Main Flow):**
  1. Member truy cập "Hồ sơ của tôi".
  2. Member chỉnh sửa tên, ảnh đại diện, hoặc nhập chỉ số cân nặng, lượng mỡ cơ thể mới.
  3. Bấm "Lưu thay đổi".
  4. Hệ thống kiểm tra hợp lệ, lưu vào cơ sở dữ liệu và hiển thị thông báo thành công.
* **Luồng rẽ nhánh:**
  * *2a. Khai báo dị ứng:* Member nhập thông tin dị ứng, hệ thống lưu để phục vụ UC-08 (gợi ý bữa ăn).

### UC-05: Quản lý kế hoạch tập luyện
* **Tóm tắt (Description):** Member thực hiện khảo sát mục tiêu (Goal Onboarding), nhận giáo án AI gợi ý và tùy chỉnh danh sách bài tập.
* **Tiền điều kiện (Pre-conditions):** Member đã đăng nhập và có Membership hợp lệ.
* **Hậu điều kiện (Post-conditions):** `MEMBER_PROGRAMS` được lưu trạng thái "Active".
* **Luồng sự kiện chính (Main Flow):**
  1. Member hoàn thành 5 câu hỏi mục tiêu cá nhân.
  2. AI phân tích và trả về tối đa 3 chương trình tập luyện tương thích nhất.
  3. Member chọn 1 chương trình.
  4. AI sinh giáo án chi tiết từng ngày (bài tập, số sets, reps, tạ).
  5. Member có thể chỉnh sửa giáo án (thêm/xóa bài) và bấm "Lưu kế hoạch".
* **Luồng rẽ nhánh:**
  * *4a. Thiếu dữ liệu:* Hệ thống áp dụng chương trình tập cơ bản (Preset Beginner).

### UC-07: Theo dõi tiến trình tập luyện
* **Tóm tắt (Description):** Cho phép Member xem biểu đồ trực quan về quá trình tập, lịch sử nâng tạ, các kỷ lục PR và nhận cảnh báo chững tạ.
* **Tiền điều kiện (Pre-conditions):** Có dữ liệu lịch sử tập.
* **Hậu điều kiện (Post-conditions):** Read-only.
* **Luồng sự kiện chính (Main Flow):**
  1. Member vào tab "Tiến trình".
  2. Hệ thống hiển thị biểu đồ tần suất tập luyện, cân nặng, sức mạnh của các bài tập chính.
  3. Nếu hệ thống phát hiện chững tạ (Stuck/Plateau), hiển thị cảnh báo đỏ và gợi ý điều chỉnh giáo án (Deload tạ).
  4. Member bấm đồng ý áp dụng gợi ý để tự động giảm nhẹ giáo án tuần tiếp theo.

### UC-08: Quản lý dinh dưỡng
* **Tóm tắt (Description):** Member xem gợi ý thực đơn, đặt mua sản phẩm dinh dưỡng nội bộ hoặc đặt hàng combo.
* **Tiền điều kiện (Pre-conditions):** Đã đăng nhập.
* **Hậu điều kiện (Post-conditions):** Cập nhật `NUTRITION_ORDERS` và trừ tồn kho.
* **Luồng sự kiện chính (Main Flow):**
  1. (Tự động) Sau khi xong buổi tập, hệ thống popup 3 gợi ý dinh dưỡng (dựa trên nhóm cơ vừa tập).
  2. Member thêm sản phẩm vào giỏ hàng.
  3. Tiến hành thanh toán (UC-16). Có thể dùng tối đa 50% FitCoin.
  4. Đơn hàng được tạo, Admin chuẩn bị đồ uống tại quầy.
  5. Member nhận đồ uống và hệ thống đánh dấu hoàn thành.
* **Luồng rẽ nhánh:**
  * *1a. Chủ động mua:* Member tự vào cửa hàng (Store) chọn sản phẩm và thanh toán.

### UC-09: Mua hoặc thuê dụng cụ (Gear)
* **Tóm tắt (Description):** Member thuê các thiết bị tập luyện nâng cao (đai, bao tay) hoặc mua phụ kiện.
* **Tiền điều kiện (Pre-conditions):** Member (chỉ Member mới được thuê).
* **Hậu điều kiện (Post-conditions):** Tạo `GEAR_RENTALS` hoặc hoá đơn bán (Sale). `is_available` thiết bị thành false.
* **Luồng sự kiện chính (Main Flow):**
  1. Member duyệt danh sách dụng cụ (Gear Marketplace).
  2. Chọn dụng cụ (Loại: Thuê), chọn số ngày (tối đa 7).
  3. Thanh toán trước 100% cọc + phí thuê (UC-16).
  4. Nhận bàn giao thiết bị từ Admin tại quầy.
  5. Hết ngày thuê, trả thiết bị, Admin kiểm tra hư hỏng và hoàn cọc tương ứng.
* **Luồng rẽ nhánh:** 
  * *5a. Hư hỏng/Mất:* Admin ghi nhận khấu trừ cọc hoặc phạt thêm tiền.

### UC-10: Quản lý Membership
* **Tóm tắt (Description):** Member thực hiện gia hạn, nâng cấp lên gói năm hoặc tạm bảo lưu gói tập.
* **Tiền điều kiện (Pre-conditions):** Có gói tập.
* **Hậu điều kiện (Post-conditions):** `MEMBERSHIP_HISTORY` ghi nhận, `GYM_MEMBERSHIPS` cập nhật ngày.
* **Luồng sự kiện chính (Main Flow):**
  1. Member vào "Gói tập của tôi".
  2. Chọn "Gia hạn gói" hoặc "Nâng cấp gói Năm".
  3. Thanh toán khoản phí.
  4. Hệ thống cập nhật `end_date` (hoặc đổi ID gói tập) và tặng thưởng FitCoin.
* **Luồng rẽ nhánh:**
  * *2a. Tự bảo lưu (Freeze):* Member chọn "Bảo lưu", nhập số ngày (tối đa 30), hệ thống tự động dời ngày hết hạn mà không cần Admin duyệt.

### UC-11: Giới thiệu bạn bè & Chia sẻ
* **Tóm tắt (Description):** Chia sẻ cột mốc tập luyện lên MXH hoặc gửi link giới thiệu lấy mã thưởng.
* **Tiền điều kiện (Pre-conditions):** Member đạt cột mốc (Milestone).
* **Hậu điều kiện (Post-conditions):** Sinh mã Referral, trao thưởng FitCoin/Gói tập miễn phí.
* **Luồng sự kiện chính (Main Flow):**
  1. Member đạt Milestone 7 ngày streak.
  2. Bấm "Chia sẻ thành tựu", hệ thống render Share Card (ẩn thông tin nhạy cảm).
  3. Kèm link Referral gửi cho bạn bè.
  4. Bạn bè click link, mua gói tập thành công.
  5. Hệ thống ghi nhận Referral thành công, tự động cộng 1 tháng gói tập cho cả hai.

### UC-12: Quản lý dịch vụ phòng gym
* **Tóm tắt (Description):** Admin cấu hình tổng quan phòng tập và quản trị Users.
* **Tiền điều kiện (Pre-conditions):** Quyền Admin / Gym Owner.
* **Hậu điều kiện (Post-conditions):** Hệ thống cập nhật thông số.
* **Luồng sự kiện chính (Main Flow):**
  1. Admin cấu hình thông tin Gym, giờ mở cửa.
  2. Admin xem danh sách toàn bộ Users, có thể khóa (ban) hoặc mở khóa tài khoản hội viên vi phạm.
  3. Gửi thông báo đẩy (Notifications) cho toàn bộ phòng tập.

### UC-13: Quản lý sản phẩm Gear & Nutrition
* **Tóm tắt (Description):** Admin quản lý danh mục bán hàng, cảnh báo tồn kho và trạng thái sẵn sàng của thiết bị.
* **Tiền điều kiện (Pre-conditions):** Quyền Admin.
* **Hậu điều kiện (Post-conditions):** Bảng `GEAR_PRODUCTS`, `NUTRITION_PRODUCTS`, `INVENTORY` cập nhật.
* **Luồng sự kiện chính (Main Flow):**
  1. Admin thêm mới 1 sản phẩm dinh dưỡng (cấu hình macro, giá) hoặc 1 thiết bị Gear (giá trị cọc, phí thuê).
  2. Nhập số lượng tồn kho (Đối với Nutrition) hoặc quét mã định danh vật lý (Đối với Gear).
  3. Hệ thống cảnh báo đỏ khi Nutrition dưới ngưỡng tồn kho (Low_stock) hoặc quản lý trạng thái Đang cho thuê của Gear.

### UC-14: Chăm sóc hội viên
* **Tóm tắt (Description):** Admin tiếp nhận danh sách hội viên cần chăm sóc (AI Care Queue) và ghi nhận nhật ký hỗ trợ.
* **Tiền điều kiện (Pre-conditions):** Quyền Admin.
* **Hậu điều kiện (Post-conditions):** Bảng `MEMBER_CARE_LOGS` cập nhật, `RECOMMENDATIONS` đóng trạng thái.
* **Luồng sự kiện chính (Main Flow):**
  1. Admin mở AI Care Queue xem danh sách sắp hết hạn hoặc lâu không đi tập.
  2. Phân loại theo mức độ ưu tiên (High/Medium/Low).
  3. Admin gọi điện tư vấn.
  4. Admin cập nhật trạng thái "Đã xử lý" (Thành công/Bỏ qua/Không bắt máy) và nhập ghi chú.
  5. Hội viên biến mất khỏi hàng đợi.

### UC-15: Theo dõi hoạt động kinh doanh
* **Tóm tắt (Description):** Admin xem báo cáo tổng quan (Dashboard) về doanh thu, tỉ lệ giữ chân, số lượt check-in.
* **Tiền điều kiện (Pre-conditions):** Quyền Admin.
* **Hậu điều kiện (Post-conditions):** Read-only (phát sinh SQL aggregates).
* **Luồng sự kiện chính (Main Flow):**
  1. Admin truy cập Dashboard Doanh thu.
  2. Xem biểu đồ doanh thu Nutrition vs Membership vs Gear.
  3. Xem thống kê Tỷ lệ duy trì (Retention Rate) và Churn Rate.
  4. Xuất file báo cáo cuối tháng.

========================================================================
KẾT THÚC FILE 03
========================================================================
"""

target = "========================================================================\nKẾT THÚC FILE 03\n========================================================================"
content = content.replace(target, new_content)

with open('d:\\doanWEDKD\\docs\\03_Actor_UseCase.md', 'w', encoding='utf-8') as f:
    f.write(content)
