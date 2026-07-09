# TÀI LIỆU ÁNH XẠ WEBSITE VỚI ĐẶC TẢ USE CASE (03_Actor_UseCase.md)
> **Dự án:** FitFuel+ | **Trạng thái:** ✅ ĐỒNG BỘ 100%

Tài liệu này cung cấp bảng ánh xạ chi tiết giữa **16 Use Cases** được định nghĩa trong [03_Actor_UseCase.md](file:///d:/doanWEDKD/docs/03_Actor_UseCase.md) và các trang, component, logic nghiệp vụ thực tế trên hệ thống Frontend & Backend của FitFuel+.

---

## 1. TỔNG QUAN HÀNH TRÌNH NGƯỜI DÙNG (USER JOURNEY MAP)

Hệ thống được chia thành 4 trục hành trình chính, khớp hoàn toàn với thiết kế sitemap và luồng di chuyển trên web:
1. **Khách vãng lai (Guest):** Khám phá Landing Page (`UC-01`) → Đăng ký tập thử 7 ngày nhận OTP (`UC-02`) → Đăng ký Membership (`UC-03`) → Thanh toán (`UC-16`).
2. **Hội viên (Member):** Quản lý Profile & Chỉ số TDEE/Allergy (`UC-04`) → Chọn chương trình tập AI (`UC-05`) → Thực hiện buổi tập & Đếm giờ nghỉ (`UC-06`) → Xem tiến trình Recharts (`UC-07`) → Order Dinh dưỡng AI (`UC-08`) → Thuê/Mua Gear (`UC-09`) → Quản lý gia hạn/đóng băng gói tập (`UC-10`) → Chia sẻ Milestone & Referral (`UC-11`).
3. **Quản trị (Admin/Gym Owner):** Cấu hình phòng tập & Khóa thành viên (`UC-12`) → Quản lý kho Gear & Nutrition (`UC-13`) → AI Care Queue chăm sóc khách hàng (`UC-14`) → Báo cáo doanh thu & KPI (`UC-15`).
4. **Thanh toán chung (`UC-16`):** One-page Checkout dùng chung tích hợp MoMo/VNPay sandbox, COD và thanh toán tại quầy.

---

## 2. BẢNG ÁNH XẠ CHI TIẾT 16 USE CASE

### A. HÀNH TRÌNH KHÁCH VÃNG LAI (GUEST JOURNEY)

#### UC-01: Khám phá dịch vụ
* **Tác nhân:** Guest (Khách vãng lai)
* **Frontend Route:** `/`
* **Component chính:** `FE/src/pages/public/LandingPage.jsx`
* **Mô tả luồng trên web:** 
  * Hiển thị danh sách PT nổi bật kèm chỉ số đánh giá sao.
  * Hiển thị bảng giá 2 gói tập (Tháng/Năm) và quyền lợi tương ứng.
  * Khảo sát mục tiêu nhanh (Goal survey 3 bước: Mục tiêu chính, Tần suất tập, Trình độ) để đề xuất gói phù hợp.
* **Quy tắc nghiệp vụ:** Hiển thị thông tin công khai không cần token đăng nhập.

#### UC-02: Đăng ký trải nghiệm (Free Trial / Gym Tour)
* **Tác nhân:** Guest, SMS Gateway (Dịch vụ OTP)
* **Frontend Route:** `/` (Trang chủ kích hoạt Modal)
* **Component chính:** `RegistrationModal` bên trong `LandingPage.jsx`
* **Mô tả luồng trên web:**
  * Guest nhấn nút "Đăng Ký Tập Thử" hoặc "Đặt Lịch Tour" trên Landing Page.
  * Form điền thông tin (Họ tên, SĐT, Email, cơ sở đăng ký, thời gian hẹn).
  * Chuyển sang bước xác thực OTP (giả lập SMS Gateway gửi mã 6 chữ số kèm đồng hồ đếm ngược 60s).
  * Nhập OTP chính xác sẽ kích hoạt gói tập thử 7 ngày trị giá 0 VND (không cần checkout).
* **Quy tắc nghiệp vụ:** Giới hạn mỗi SĐT chỉ được sử dụng Free Trial 1 lần (`BR-OTP-01`).

#### UC-03: Đăng ký Membership
* **Tác nhân:** Guest, Payment Gateway (MoMo/VNPay)
* **Frontend Route:** `/membership`
* **Component chính:** `FE/src/pages/member/MembershipPage.jsx`
* **Mô tả luồng trên web:**
  * Khách hàng chưa đăng nhập duyệt các gói membership (Tháng: 559k/30 ngày, Năm: 4.800k/365 ngày).
  * Điền form đăng ký thông tin tài khoản mới (Họ tên, SĐT, Email, Mật khẩu, Mã giới thiệu).
  * Xác nhận đơn hàng, áp dụng mã giảm giá và chuyển tiếp sang trang thanh toán `CheckoutPage.jsx` (`UC-16`).
* **Quy tắc nghiệp vụ:** `BR-REG-01` (Tự động áp dụng mã giới thiệu), tự động cộng 50 FitCoin cho gói Tháng và 200 FitCoin cho gói Năm sau khi thanh toán thành công.

---

### B. HÀNH TRÌNH HỘI VIÊN (MEMBER JOURNEY)

#### UC-04: Quản lý hồ sơ cá nhân
* **Tác nhân:** Member
* **Frontend Route:** `/profile`, `/passport`, `/tdee`
* **Component chính:** 
  * `FE/src/pages/member/ProfilePage.jsx` (Thông tin cơ bản, ảnh đại diện dưới 5MB tự động crop, Sức khỏe & Dị ứng thực phẩm).
  * `FE/src/pages/member/PassportPage.jsx` (Fitness Passport chứa mã vạch QR checkin, lịch sử checkin).
  * `FE/src/pages/member/TDEEPage.jsx` (Tính chỉ số TDEE, lượng Calo tiêu thụ hàng ngày và lưu lịch sử đổi cân nặng).
* **Quy tắc nghiệp vụ:** `BR-PROFILE-01` (Không cho phép hội viên tự ý thay đổi Số điện thoại trên giao diện để tránh gian lận tài khoản, phải liên hệ lễ tân/Admin để xác minh).

#### UC-05: Quản lý kế hoạch tập luyện
* **Tác nhân:** Member, AI Goal Engine
* **Frontend Route:** `/journey`
* **Component chính:** `FE/src/pages/member/journey/JourneyPage.jsx`, `JourneyProgramsPage.jsx`
* **Mô tả luồng trên web:**
  * Member trả lời bộ câu hỏi Onboarding tập luyện (7 câu hỏi: mục tiêu, kinh nghiệm, chấn thương, thiết bị...).
  * AI Goal Engine xử lý đề xuất 3 giáo trình phù hợp (như "Tăng cơ nhanh", "Giảm mỡ toàn thân", "Sức mạnh cốt lõi").
  * Member lựa chọn 1 chương trình, hệ thống sinh chi tiết các bài tập, sets, reps cho từng buổi. Member có thể tùy chỉnh thêm/xóa bài tập trước khi kích hoạt.
* **Quy tắc nghiệp vụ:** Chỉ có duy nhất 1 kế hoạch tập luyện ở trạng thái Active tại một thời điểm (`BR-PLAN-01`).

#### UC-06: Thực hiện buổi tập
* **Tác nhân:** Member
* **Frontend Route:** `/new-session`, `/session/:id`
* **Component chính:** `FE/src/pages/member/NewSessionPage.jsx`
* **Mô tả luồng trên web:**
  * Member check-in hoặc nhấn "Bắt đầu tập" để mở logger buổi tập.
  * Hiển thị danh sách các bài tập trong ngày.
  * Member tick hoàn thành từng set, nhập mức tạ (weight), số rep thực tế và cảm nhận RPE (từ 1-10).
  * Đồng hồ đếm ngược giờ nghỉ (Rest timer) hỗ trợ kích hoạt trực tiếp từ giao diện log bài tập (hiển thị thời gian nghỉ kèm tùy chọn Bỏ qua/Thêm 30 giây). Có video động tác mẫu.
  * Nhấn "Hoàn thành" hiển thị màn hình chúc mừng, tính toán tổng khối lượng Volume, số ngày tập liên tục (Streak) và PR (Kỷ lục cá nhân) mới.
* **Quy tắc nghiệp vụ:** `BR-WORKOUT-01` (Buổi tập kéo dài tối thiểu 15 phút mới được tính vào Streak), hỗ trợ offline lưu dữ liệu vào `localStorage` nếu mất mạng đột ngột.

#### UC-07: Theo dõi tiến trình tập luyện
* **Tác nhân:** Member, AI Analytics Engine
* **Frontend Route:** `/exercise-progress`, `/gym-records`
* **Component chính:** 
  * `FE/src/pages/member/ExerciseProgressPage.jsx` (Vẽ biểu đồ Recharts đường cong tiến trình mức tạ, Volume tập luyện theo thời gian).
  * `FE/src/pages/member/GymRecordsPage.jsx` (Hiển thị danh sách danh hiệu kỷ lục PR đạt được kèm ngày tháng).
* **Quy tắc nghiệp vụ:** AI tự động phân tích và đưa ra cảnh báo Overtraining nếu tập > 6 ngày/tuần hoặc RPE liên tiếp > 8.5, hoặc cảnh báo Plateau nếu không có PR mới trong 28 ngày.

#### UC-08: Quản lý dinh dưỡng
* **Tác nhân:** Member
* **Frontend Route:** `/nutrition`, `/nutrition/:id`
* **Component chính:** `FE/src/pages/nutrition/NutritionListPage.jsx`, `NutritionDetailPage.jsx`, `FE/src/components/common/AiFoodSuggestion.jsx`
* **Mô tả luồng trên web:**
  * Hiển thị danh mục món ăn lành mạnh, whey protein, salad.
  * Sau buổi tập (`UC-06`), hiển thị popup gợi ý 3 combo dinh dưỡng phù hợp từ AI.
  * Tự động hiển thị cảnh báo đỏ nổi bật nếu sản phẩm chứa thành phần dị ứng trùng với khai báo trong Profile (`UC-04`).
  * Cho phép thêm vào giỏ hàng, áp dụng giảm giá FitCoin và chuyển sang `CheckoutPage.jsx`.
* **Quy tắc nghiệp vụ:** FitCoin chỉ được quy đổi giảm giá tối đa 50% giá trị đơn hàng, không cho phép dùng FitCoin thanh toán 100% đơn hàng (`BR-30`, `BR-34`).

#### UC-09: Mua hoặc thuê dụng cụ (Gear)
* **Tác nhân:** Member
* **Frontend Route:** `/gear`, `/gear/:id`, `/gear/rentals`
* **Component chính:** `FE/src/pages/gear/GearListPage.jsx`, `GearDetailPage.jsx`, `GearRentPage.jsx`, `GearMyRentalsPage.jsx`
* **Mô tả luồng trên web:**
  * Hiển thị danh sách thiết bị tập (Tạ tay, đai lưng, bình nước...).
  * Đối với Thuê Gear: Chọn số ngày thuê (tối đa 7 ngày), hệ thống tự tính phí thuê + tiền cọc (bằng 100% giá trị sản phẩm).
  * Quản lý đơn thuê tại `GearMyRentalsPage.jsx` với Timeline trạng thái trực quan: Chờ nhận → Đang thuê → Đã trả (Admin xác nhận tình trạng hao mòn và hoàn cọc một phần/toàn phần).
* **Quy tắc nghiệp vụ:** `BR-18` (Mỗi hội viên chỉ được thuê tối đa 3 thiết bị tại cùng một thời điểm, thời hạn thuê tối đa 7 ngày). Trên giao diện đặt thuê `GearRentPage.jsx`, hệ thống tự động kiểm tra số lượng thiết bị đang thuê của Member từ API `/api/gear/my/rentals`; nếu đã thuê từ 3 thiết bị trở lên, hệ thống hiển thị cảnh báo đỏ và khóa nút xác nhận thuê.

#### UC-10: Quản lý Membership
* **Tác nhân:** Member
* **Frontend Route:** `/membership`
* **Component chính:** `FE/src/pages/member/MembershipPage.jsx` (Phần quản lý gói cá nhân)
* **Mô tả luồng trên web:**
  * Hiển thị trạng thái gói hiện tại (Tên gói, ngày hết hạn, đếm ngược số ngày còn lại).
  * Cung cấp các nút tự phục vụ (Self-service):
    * **Gia hạn/Nâng cấp:** Chuyển sang thanh toán, cộng dồn ngày sử dụng. Nâng cấp lên gói Năm tính bù chênh lệch tiền thừa.
    * **Tạm ngưng (Đóng băng):** Nhập số ngày đóng băng (tối đa 60 ngày/năm), hệ thống tự động dời ngày hết hạn mà không cần Admin duyệt.
    * **Hủy gói:** Hủy gia hạn chu kỳ tiếp theo, giữ lại dữ liệu lịch sử tập luyện.

#### UC-11: Giới thiệu bạn bè & Chia sẻ
* **Tác nhân:** Member
* **Frontend Route:** `/fitcoin`, `/social`, `/leaderboard`, `/weekly-challenge`
* **Component chính:** Các trang tương ứng trong mục `FE/src/pages/member/`
* **Mô tả luồng trên web:**
  * Hiển thị mã giới thiệu (Referral code) dạng `FIT[userId]` và link mời bạn.
  * Leaderboard xếp hạng thành viên theo XP/FitCoin.
  * Chia sẻ Share Card Milestone (Badge/PR đạt được) lên mạng xã hội (giả lập ẩn thông tin nhạy cảm SĐT/Email).
* **Quy tắc nghiệp vụ:** Hệ thống thưởng +1 tháng sử dụng và FitCoin cho cả 2 bên khi bạn bè đăng ký lần đầu qua mã giới thiệu thành công (`BR-REFERRAL-01`).

---

### C. HÀNH TRÌNH QUẢN TRỊ (ADMIN JOURNEY)

#### UC-12: Cấu hình phòng gym
* **Tác nhân:** Gym Owner/Admin
* **Frontend Route:** `/admin/users`, `/gym-owner/dashboard`
* **Component chính:** `FE/src/pages/admin/AdminUsersPage.jsx`, `FE/src/pages/gymOwner/GymMembersPage.jsx`
* **Mô tả luồng trên web:**
  * Quản lý danh sách tài khoản thành viên (Xem thông tin chi tiết, lịch sử tập, lịch sử check-in).
  * Kích hoạt hoặc Khóa tài khoản thành viên (yêu cầu nhập lý do khóa).
  * Cấu hình thông tin phòng tập (Tên, logo, hotline, giờ hoạt động).
* **Quy tắc nghiệp vụ:** `BR-ADMIN-01` (Admin không thể tự khóa chính tài khoản của mình).

#### UC-13: Quản lý sản phẩm (Gear & Dinh dưỡng)
* **Tác nhân:** Gym Owner/Admin
* **Frontend Route:** `/gym-owner/gear-products`, `/gym-owner/nutrition-products`
* **Component chính:** `GymOwnerGearProductsPage.jsx`, `GymOwnerNutritionProductsPage.jsx`
* **Mô tả luồng trên web:**
  * Giao diện CRUD sản phẩm (Thêm mới, sửa thông tin, giá bán, giá thuê, tiền cọc, số lượng tồn kho).
  * Cảnh báo tồn kho thấp (đánh dấu màu cam/đỏ nếu số lượng dưới ngưỡng cấu hình).
* **Quy tắc nghiệp vụ:** `BR-PRODUCT-02` (Giá bán sản phẩm phải lớn hơn tiền cọc nếu sản phẩm có cả hai).

#### UC-14: Chăm sóc hội viên
* **Tác nhân:** Gym Owner/Admin, AI Care Engine
* **Frontend Route:** `/gym-owner/care-queue`, `/gym-owner/announcements`
* **Component chính:** `FE/src/pages/gymOwner/GymOwnerCareQueuePage.jsx`
* **Mô tả luồng trên web:**
  * AI Care Queue tự động quét và lọc ra danh sách hội viên cần chăm sóc (Sắp hết hạn gói tập, chững tạ Plateau, lâu không đi tập...).
  * Phân loại mức độ ưu tiên: Đỏ (Cao - Cần gọi ngay), Vàng (Trung bình - Gửi thông báo), Xanh (Thấp).
  * Admin click để xem chi tiết lý do và ghi nhận trạng thái liên hệ (Đã gọi thành công, Không liên lạc được, Đã gửi tin nhắn, Bỏ qua).
* **Quy tắc nghiệp vụ:** `BR-CARE-01` (Chỉ tài khoản Admin/Gym Owner mới có quyền truy cập hàng đợi chăm sóc).

#### UC-15: Theo dõi hoạt động kinh doanh
* **Tác nhân:** Gym Owner/Admin
* **Frontend Route:** `/gym-owner/analytics`, `/admin/reports`
* **Component chính:** `FE/src/pages/gymOwner/GymOwnerAnalyticsPage.jsx`, `AdminReportsPage.jsx`
* **Mô tả luồng trên web:**
  * Hiển thị biểu đồ báo cáo doanh thu theo tháng/quý.
  * Thống kê tỷ lệ chuyển đổi khách tập thử sang hội viên (Trial-to-Member Conversion).
  * Biểu đồ giờ cao điểm phòng tập (lượt check-in theo khung giờ).
* **Quy tắc nghiệp vụ:** `BR-ANALYTICS-01` (Dữ liệu kinh doanh được bảo mật nghiêm ngặt, chỉ hiển thị cho tài khoản quản trị).

---

### D. USE CASE DÙNG CHUNG (SHARED)

#### UC-16: Thanh toán
* **Tác nhân:** Guest/Member, Payment Gateway, Admin (Xác nhận COD/tại quầy)
* **Frontend Route:** `/cart`, `/checkout`
* **Component chính:** `FE/src/pages/public/CartPage.jsx`, `FE/src/pages/public/CheckoutPage.jsx`
* **Mô tả luồng trên web:**
  * **One-page Checkout:** Tích hợp giỏ hàng, chỉnh sửa trực tiếp thông tin người nhận (Họ tên, SĐT, Địa chỉ) và chọn phương thức thanh toán ngay trên một trang duy nhất.
  * **Thanh toán tại quầy:** Khi Guest/Member chọn thanh toán tại quầy/tiền mặt, hệ thống hiển thị Pop-up hướng dẫn chi tiết các bước giao dịch tại lễ tân FitFuel+ (không dùng thông báo alert mặc định của trình duyệt).
  * **FitCoin Discount Slider:** Cho phép kéo/chọn số điểm FitCoin muốn áp dụng để giảm giá (tối đa 50% giá trị đơn hàng).
  * **Thành công:** Sau khi thanh toán/đặt hàng, hệ thống lưu đơn, kích hoạt tiến trình ngầm gửi SMS/Email, hiển thị Pop-up thành công với thiết kế cao cấp, đồng thời điều hướng về trang chi tiết đơn hàng hoặc lịch sử tập luyện.
* **Quy tắc nghiệp vụ:** `BR-PAYMENT-02` (Bỏ qua/chống click trùng giao dịch trong vòng 30s), áp dụng quy đổi FitCoin chính xác.

---

## 3. BẢNG TỔNG HỢP ÁNH XẠ CODE FRONTEND VÀ USE CASES

| Use Case ID | Tên Use Case | Frontend Page / Component | Quyền Truy Cập | Trạng Thái Đồng Bộ |
|---|---|---|---|---|
| **UC-01** | Khám phá dịch vụ | `LandingPage.jsx` | Tự do (Guest/Member) | ✅ 100% Khớp |
| **UC-02** | Đăng ký trải nghiệm | `RegistrationModal` trong `LandingPage.jsx` | Guest | ✅ 100% Khớp |
| **UC-03** | Đăng ký Membership | `MembershipPage.jsx` + `CheckoutPage.jsx` | Guest | ✅ 100% Khớp |
| **UC-04** | Quản lý hồ sơ | `ProfilePage.jsx` + `PassportPage.jsx` + `TDEEPage.jsx` | Member | ✅ 100% Khớp |
| **UC-05** | Kế hoạch tập luyện | `JourneyPage.jsx` + `JourneyProgramsPage.jsx` | Member | ✅ 100% Khớp |
| **UC-06** | Buổi tập | `NewSessionPage.jsx` + `SessionDetailPage.jsx` | Member | ✅ 100% Khớp |
| **UC-07** | Theo dõi tiến trình | `ExerciseProgressPage.jsx` + `GymRecordsPage.jsx` | Member | ✅ 100% Khớp |
| **UC-08** | Dinh dưỡng | `NutritionListPage.jsx` + `AiFoodSuggestion.jsx` | Guest/Member | ✅ 100% Khớp |
| **UC-09** | Mua hoặc thuê Gear | `GearListPage.jsx` + `GearRentPage.jsx` + `GearMyRentalsPage.jsx` | Guest/Member | ✅ 100% Khớp |
| **UC-10** | Quản lý Membership | `MembershipPage.jsx` (Gia hạn/Freeze/Hủy) | Member | ✅ 100% Khớp |
| **UC-11** | Giới thiệu & Chia sẻ | `FitCoinPage.jsx` + `SocialPage.jsx` + `LeaderboardPage.jsx` | Member | ✅ 100% Khớp |
| **UC-12** | Cấu hình phòng gym | `AdminUsersPage.jsx` + `GymMembersPage.jsx` | Admin/Gym Owner | ✅ 100% Khớp |
| **UC-13** | Quản lý sản phẩm | `GymOwnerGearProductsPage.jsx` + `GymOwnerNutritionProductsPage.jsx` | Admin/Gym Owner | ✅ 100% Khớp |
| **UC-14** | Chăm sóc hội viên | `GymOwnerCareQueuePage.jsx` + `GymAnnouncementsPage.jsx` | Admin/Gym Owner | ✅ 100% Khớp |
| **UC-15** | Báo cáo kinh doanh | `GymOwnerAnalyticsPage.jsx` + `AdminReportsPage.jsx` | Admin/Gym Owner | ✅ 100% Khớp |
| **UC-16** | Thanh toán | `CartPage.jsx` + `CheckoutPage.jsx` | Guest/Member | ✅ 100% Khớp |

---

## 4. KẾT LUẬN

Hệ thống web FitFuel+ hiện tại đã được rà soát và đối chiếu kỹ lưỡng:
* **Giao diện người dùng (UI/UX)** phản ánh chính xác từng luồng nghiệp vụ của cả Guest, Member và Admin.
* **Các quy tắc nghiệp vụ cốt lõi (Business Rules)** như giới hạn thuê Gear tối đa 3 thiết bị (`BR-18`), tỷ lệ giảm giá FitCoin tối đa 50% (`BR-30`, `BR-34`), và cơ chế không cho phép tự sửa SĐT trên Profile (`BR-PROFILE-01`) đã được cài đặt và hoạt động chuẩn chỉnh.
* **Không có sự lệch pha** giữa tài liệu thiết kế Use Case (`03_Actor_UseCase.md`) và mã nguồn Front-end hiện tại.
