# 01. PHÁT BIỂU BÀI TOÁN VÀ PHẠM VI HỆ THỐNG
# (Problem Statement & System Scope)

> Dự án: FitFuel+
> Môn học: Web Kinh Doanh
> Ngày: 09/07/2026 (Cập nhật: Phân rã AI & Chuẩn hóa Single-Tenant)

========================================================================

## 1. ĐẶT VẤN ĐỀ
========================================================================

### 1.1. Bối cảnh
Thị trường fitness tại Việt Nam tăng trưởng mạnh trong giai đoạn 2020-2026. Số lượng phòng tập gym tại các thành phố lớn tăng trung bình 15-20% mỗi năm. Tuy nhiên, phần lớn phòng tập còn vận hành theo kiểu thủ công — quản lý hội viên bằng excel, ghi chép sổ tay, không có công cụ theo dõi hay cảnh báo tự động. Chủ phòng tập chưa khai thác được dữ liệu sẵn có để giữ chân hội viên, tăng doanh thu phụ trợ và vận hành hiệu quả hơn.

### 1.2. Các vấn đề cụ thể

**Vấn đề 1: KHÓ QUẢN LÝ VÒNG ĐỜI HỘI VIÊN**
- Chủ phòng tập không biết hội viên nào sắp hết hạn, đã hết hạn, lâu chưa tập.
- Không có cảnh báo tự động để nhân viên liên hệ gia hạn kịp thời.
- Hội viên rời bỏ mà phòng tập không hay biết cho đến khi đã mất.
- Không có dữ liệu để biết gói nào bán chạy, gói nào cần điều chỉnh giá.

**Vấn đề 2: DOANH THU TỪ BÁN VÀ CHO THUÊ GEAR BỊ BỎ NGỎ**
- Phòng tập có sản phẩm gear (tạ, dây, găng tay, dụng cụ phụ trợ) nhưng bán không hệ thống.
- Không quản lý được số lượng gear cho thuê, đặt cọc, ngày trả, tình trạng gear.
- Khách vãng lai (chưa có tài khoản) không thể mua hàng tại quầy mà không đăng ký.
- Không có báo cáo doanh thu theo kênh: bán gear, cho thuê gear, đặt cọc đang giữ.

**Vấn đề 3: DOANH THU PHỤ TRỢ TỪ DINH DƯỠNG CHƯA ĐƯỢC TỐI ƯU**
- Sản phẩm dinh dưỡng (protein shake, nước điện giải, snack, meal combo) bán không có hệ thống.
- Không biết sản phẩm nào bán chạy, sản phẩm nào tồn kho, khung giờ nào bán nhiều nhất.
- Không thể tạo combo (gói tập + dinh dưỡng) để tăng doanh thu trên mỗi hội viên.
- Không có sự tư vấn dinh dưỡng cá nhân hóa dựa trên lịch sử tập luyện và dị ứng.

**Vấn đề 4: THIẾU ỨNG DỤNG AI ĐỂ HỖ TRỢ VẬN HÀNH VÀ CHĂM SÓC**
- Dữ liệu hội viên có nhưng nhân viên không biết cần hành động gì.
- Không có gợi ý "ai cần chăm sóc", "ai nên upsell gói", "ai có nguy cơ rời bỏ".
- Thiếu các tính năng tạo lộ trình tự động cho hội viên mới.

### 1.3. Đối tượng bị ảnh hưởng
- **Chủ phòng tập (Gym Owner)**: Cần hệ thống quản trị (Admin) toàn diện, báo cáo doanh thu và cảnh báo rủi ro rời bỏ.
- **Hội viên (Member)**: Cần xem quyền lợi, lịch trình tập AI, gợi ý dinh dưỡng cá nhân hóa và quản lý FitCoin.
- **Khách vãng lai (Guest)**: Cần công cụ khám phá, đăng ký gói hoặc mua sản phẩm nhanh bằng OTP.

========================================================================

## 2. GIẢI PHÁP ĐỀ XUẤT
========================================================================

### 2.1. Mô tả giải pháp
FitFuel+ là hệ thống quản lý phòng tập gym toàn diện (Single-tenant Gym Management System), tập trung vào bài toán vận hành thực của chủ phòng tập và tối ưu hóa trải nghiệm hội viên thông qua Trí tuệ Nhân tạo (AI). Hệ sinh thái kết hợp 4 trụ cột cốt lõi:

**Trụ cột 1 — Quản lý vòng đời hội viên (Membership Lifecycle):**
- Đăng ký, gia hạn, nâng cấp, bảo lưu gói tập.
- Theo dõi trạng thái hội viên, lịch sử thay đổi chỉ số cơ thể.

**Trụ cột 2 — Vận hành nội bộ (Nutrition & Gear Marketplace):**
- Bán sản phẩm dinh dưỡng nội bộ (chỉ áp dụng nhận tại quầy - Pickup).
- Bán và cho thuê thiết bị tập luyện (Gear) với hệ thống tính tiền cọc.
- Khách vãng lai mua hàng nhanh bằng OTP không cần tạo tài khoản.

**Trụ cột 3 — Trí tuệ nhân tạo (FitFuel AI Engine):**
- AI Goal Engine: Đề xuất lộ trình tập luyện dựa trên mục tiêu, kinh nghiệm và tình trạng sức khỏe.
- AI Nutrition Optimizer: Tự động loại bỏ thành phần dị ứng, đề xuất bữa ăn phục hồi ngay sau khi tập (sử dụng thuật toán Di truyền).
- AI Care Queue: Phân tích mô hình học máy chuỗi thời gian để cảnh báo nguy cơ rời bỏ (Churn prediction) và tự động lên lịch chăm sóc.

**Trụ cột 4 — Động lực học & Gamification:**
- Tích lũy điểm thưởng FitCoin, hoàn thành cột mốc (Milestones), giới thiệu bạn bè (Referral).

### 2.2. Giá trị cốt lõi
- **Dữ liệu thành hành động:** Chuyển hóa dữ liệu thô thành AI Care Queue, báo cho Gym Owner biết cần gọi ai, tư vấn gì.
- **Membership là xương sống:** Mọi giao dịch, điểm FitCoin, lịch sử tập đều gắn liền với gói hội viên.
- **Vận hành nhanh tại quầy:** Mọi luồng mua hàng và nhận hàng đều được tối ưu hóa cho mô hình Pick-up tại phòng tập, không tốn chi phí logistics.
- **Cá nhân hóa tối đa:** Gợi ý dinh dưỡng AI tự động loại trừ các món gây dị ứng, đảm bảo an toàn tuyệt đối cho hội viên.

### 2.3. Tại sao không dùng các giải pháp hiện có?
- Excel / Sheets: Không cảnh báo tự động, không AI, dễ sai sót.
- Mindbody / Gymdesk: Phần mềm nước ngoài, phí cao, quá dư thừa tính năng phức tạp.
- Các app ăn kiêng riêng lẻ: Rời rạc, không liên kết trực tiếp với lịch sử tập luyện tại gym.
=> FitFuel+ là giải pháp tích hợp tất cả-trong-một cho 1 phòng tập duy nhất (Single-tenant), ứng dụng AI thực tiễn để tăng doanh thu và giữ chân khách hàng.

========================================================================

## 3. MỤC TIÊU HỆ THỐNG
========================================================================

### 3.1. Mục tiêu chính
- **MT-01**: Quản lý vòng đời membership đầy đủ (đăng ký, gia hạn, nâng cấp, bảo lưu).
- **MT-02**: Hệ thống gợi ý lịch tập luyện cá nhân hóa từ AI (AI Goal Engine).
- **MT-03**: Cửa hàng bán sản phẩm dinh dưỡng nội bộ, gợi ý AI tự động loại bỏ chất gây dị ứng.
- **MT-04**: Quản lý bán và cho thuê gear (tạ, dây, găng tay) kèm tiền cọc và theo dõi ngày trả.
- **MT-05**: Ứng dụng AI Care Queue cảnh báo nguy cơ rời bỏ, lên danh sách chăm sóc tự động.
- **MT-06**: Hệ thống Dashboard KPI cho Gym Owner (doanh thu, tỷ lệ giữ chân, tồn kho).
- **MT-07**: Tích hợp Gamification (FitCoin, Huy hiệu, Giới thiệu bạn bè) để tăng tương tác.

### 3.2. Mục tiêu đo lường được
- Luồng mua hàng OTP cho Guest hoàn thành dưới 2 phút.
- Thuật toán gợi ý dinh dưỡng (Nutrition Optimizer) trả kết quả dưới 2 giây.
- 100% món ăn chứa thành phần dị ứng đã khai báo phải bị loại bỏ khỏi danh sách gợi ý.
- Tốc độ tải trang hiển thị (LCP) dưới 2.5 giây.

========================================================================

## 4. PHẠM VI HỆ THỐNG
========================================================================

### 4.1. Trong phạm vi (In Scope)

- **MODULE 1 — Quản lý tài khoản:** Khai báo thông tin, thiết lập hồ sơ dị ứng, bảo mật thông tin.
- **MODULE 2 — Kế hoạch tập luyện (Journey):** Thiết lập mục tiêu, chọn chương trình từ thư viện AI, đánh giá RPE (cảm nhận thể chất) sau tập.
- **MODULE 3 — Membership Lifecycle:** Đăng ký, gia hạn, nâng cấp, bảo lưu gói tập, tích hợp mã giới thiệu (Referral).
- **MODULE 4 — Cửa hàng Dinh dưỡng (Nutrition):** Đề xuất bữa ăn phục hồi AI, mua sắm bằng FitCoin, nhận hàng tại quầy (Pickup).
- **MODULE 5 — Cửa hàng Thiết bị (Gear):** Bán lẻ và cho thuê thiết bị tập, thanh toán bằng FitCoin hoặc Online, quản lý tiền cọc, nhận trả tại quầy.
- **MODULE 6 — Gamification & FitCoin:** Hệ thống nhiệm vụ, cột mốc thành tựu (Milestones), tiêu/tích lũy FitCoin.
- **MODULE 7 — Admin & AI Care:** Quản lý doanh thu (Dashboard), Cấu hình phòng tập, Quản lý kho sản phẩm, Hàng đợi chăm sóc khách hàng (AI Care Queue).

### 4.2. Ngoài phạm vi (Out of Scope)
- Không tích hợp Food Vendor bên ngoài (chỉ bán sản phẩm nội bộ của phòng tập).
- Không có hệ thống Logistics/Giao hàng tận nơi (Toàn bộ là Nhận tại quầy).
- Không hỗ trợ thị trường trao đổi thiết bị (P2P) giữa các hội viên.
- Không tích hợp thiết bị đeo tay (Apple Watch, Garmin).
- Không có Chat thời gian thực (Real-time chat) giữa các User.
- Không quản lý chuỗi nhiều phòng tập (Chỉ hỗ trợ 1 cơ sở duy nhất - Single Tenant).

========================================================================

## 5. CÁC GIẢ ĐỊNH VÀ RÀNG BUỘC
========================================================================

### 5.1. Giả định (Assumptions)
- **GĐ-01**: User truy cập hệ thống qua trình duyệt Web hiện đại (Hỗ trợ tốt cho Mobile & Desktop).
- **GĐ-02**: Hệ thống thanh toán trực tuyến chạy trên môi trường Sandbox (VNPay/Momo).
- **GĐ-03**: Hệ thống vận hành theo quy mô 1 phòng tập duy nhất.
- **GĐ-04**: Gym Owner là người trực tiếp xử lý các yêu cầu duyệt bảo lưu hoặc chăm sóc hội viên (không phân chia role Lễ tân/PT trên hệ thống).
- **GĐ-05**: Mô hình AI sử dụng APIs giả lập (Mocking) hoặc các hàm phân tích độc lập (Heuristics) chạy trực tiếp trên Server để mô phỏng thực tế.

### 5.2. Ràng buộc (Constraints)
- **RB-01**: Thời gian phát triển: 6 tuần.
- **RB-02**: Đội ngũ: 5 thành viên.
- **RB-03**: Công nghệ: React.js (Frontend), Node.js (Backend), MySQL/PostgreSQL (Database).
- **RB-04**: Hosting miễn phí hoặc chi phí thấp (Vercel, Render).

========================================================================
KẾT THÚC FILE 01
========================================================================
