# CHƯƠNG 1. GIỚI THIỆU ĐỀ TÀI

## Mở đầu

Xu hướng sống khỏe (healthy lifestyle) đã tạo ra nhu cầu lớn cho ngành fitness tại Việt Nam. Hội viên gym ngày nay không chỉ cần theo dõi luyện tập mà còn muốn quản lý dinh dưỡng, dụng cụ, membership và xem tiến độ - toàn bộ trong một hệ thống duy nhất. Tuy nhiên, phần lớn các phòng gym vẫn dùng **Excel hoặc 4-5 app rời rạc**, khiến dữ liệu phân tán và khó quản lý.

**FitFuel+** được phát triển để giải quyết vấn đề này - một nền tảng quản lý phòng gym **toàn diện** tích hợp membership, luyện tập, dinh dưỡng, dụng cụ, gamification và AI Retention trong cùng một hệ thống. Đồ án được xây dựng theo hướng user-centric, kết hợp phân tích yêu cầu, thiết kế hệ thống và phát triển web hiện đại (React + FastAPI + PostgreSQL).

Thông qua dự án này, nhóm vận dụng các kiến thức về phân tích hệ thống, UX/UI, cơ sở dữ liệu và phát triển phần mềm vào giải quyết một bài toán quản lý thực tế, nâng cao khả năng làm việc nhóm và xây dựng sản phẩm chuyên nghiệp.

---

## Tóm tắt đồ án

FitFuel+ là hệ thống quản lý phòng gym **toàn diện**, được phát triển để số hóa các hoạt động vận hành của phòng tập. Hệ thống tích hợp:
- **Membership Lifecycle**: Quản lý đăng ký, gia hạn, nâng cấp gói tập
- **Gym Tracking**: Ghi nhận buổi tập, theo dõi tiến độ và thành tích
- **Nutrition Management**: Bán sản phẩm dinh dưỡng, quản lý tồn kho
- **Gear Rental**: Bán/cho thuê dụng cụ tập luyện
- **Gamification**: Điểm kinh nghiệm (XP), huy hiệu (Badge), streak, thử thách
- **AI Retention**: Cảnh báo hội viên sắp hết hạn, có nguy cơ rời bỏ
- **Dashboard KPI**: Báo cáo doanh thu, hội viên, hiệu suất theo thời gian thực

Thay vì phòng gym phải dùng nhiều công cụ rời rạc, FitFuel+ giúp **quản lý tập trung, khai thác dữ liệu hiệu quả và nâng cao trải nghiệm hội viên**.

---

## Câu chuyện thương hiệu

Anh Hùng quản lý một phòng gym quy mô vừa ở TP.HCM. Mỗi ngày anh dùng Excel để theo dõi hội viên, doanh thu, tồn kho - nhưng **dữ liệu nằm rải rác ở nhiều nơi**. Anh không biết:
- Hội viên nào sắp hết hạn gói tập
- Sản phẩm dinh dưỡng nào bán chạy nhất
- Hội viên nào có dấu hiệu rời bỏ
- Doanh thu thực tế đến từ đâu

Câu chuyện anh Hùng là **thực trạng của hàng ngàn phòng gym nhỏ và vừa tại Việt Nam**. FitFuel+ được xây dựng để giải quyết vấn đề này - tập trung hóa dữ liệu, tự động hóa cảnh báo, và hỗ trợ ra quyết định dựa trên dữ liệu.

---

## 1.1. Bối cảnh thực tế

### Thị trường Fitness Việt Nam

Nhu cầu tập gym tại Việt Nam tăng mạnh trong 5 năm qua, với thị trường phát triển bền vững:

**📊 Chart 1: Thị Trường Fitness Việt Nam 2020-2025 (Statista)**

| Năm | Giá Trị Thị Trường | Số Phòng Gym |
|---|---|---|
| 2020 | $400 triệu | ~600 |
| 2022 | ~$530 triệu | ~600-700 |
| 2023 | ~$610 triệu | ~600 |
| 2024 (dự báo) | ~$700 triệu | ~650 |
| 2025 (dự báo) | ~$800 triệu | ~700 |
| **Tốc độ tăng** | **14%/năm** | **Tăng chậm nhưng ổn định** |

*Nguồn: Statista, VIR, Ken Research (2025)*

Tuy nhiên, **phần lớn phòng gym vẫn quản lý thủ công** hoặc dùng giải pháp tạm bợ:
- 72% dùng Excel/sổ sách
- 18% dùng phần mềm cũ không còn được cập nhật
- 10% dùng hệ thống quản lý hiện đại

**Vấn đề chính**: Quy trình thủ công, dữ liệu phân tán, khó theo dõi vòng đời hội viên, mất khách hàng mà không biết nguyên nhân.

---

## 1.2. Đặt vấn đề

Phòng gym hiện nay gặp 4 vấn đề chính - nhiều trong số đó liên quan trực tiếp đến quản lý yếu kém:

**📊 Chart 2: Vấn Đề Quản Lý Phòng Gym Việt Nam (Từ Thực Tiễn & Báo Cáo Ngành)**

| Vấn Đề | Chỉ Số | Ảnh Hưởng |
|---|:---:|---|
| **Tỷ lệ gyms không lợi nhuận bền vững** | **91.2%** | Boutique fitness studios không đạt break-even, buộc phải đóng cửa (Glofox 2024) |
| **Mất hội viên & churn cao** | **35-45% gia hạn** | Không biết member nào sắp rời đi, phải theo dõi thủ công |
| **Doanh thu phụ trợ ít khai thác** | **Chỉ 15-20%** | Nutrition & Gear chỉ chiếm nhỏ, mặc dù tiềm năng lên đến 40% |
| **Không tự động hóa cảnh báo** | **100% thủ công** | Hội viên sắp hết hạn không được nhắc nhở, phụ thuộc vào nhân viên |
| **Dữ liệu rải rác, khó phân tích** | **72% dùng Excel** | Không biết member nào có nguy cơ churn, ai khả năng upsell |

*Nguồn: Glofox, VnData, Health & Fitness Association (2024-2025)*
*Thực tiễn: 91.2% gyms không lợi nhuận, các chain lớn như Fit24 phải đóng cửa*

---

## 1.3. Mục tiêu dự án

### Mục tiêu kinh doanh
- Giảm tỷ lệ mất hội viên từ ~40% xuống **25-30%** thông qua AI Retention
- Tăng doanh thu từ dịch vụ phụ trợ (nutrition + gear) từ **15%** lên **35-40%** tổng doanh thu
- Giảm thời gian check-in từ **~30 giây** xuống **<10 giây** bằng QR Code
- Hỗ trợ chủ gym ra quyết định dựa trên dữ liệu thay vì kinh nghiệm cá nhân

### Mục tiêu hệ thống
- Quản lý tập trung: Membership, luyện tập, dinh dưỡng, dụng cụ, báo cáo trong **1 nền tảng**
- Tự động hóa: Cảnh báo hội viên sắp hết hạn, có nguy cơ rời bỏ, cơ hội gia hạn
- Real-time dashboard: Theo dõi doanh thu, hội viên hoạt động, tồn kho theo thời gian thực
- Trải nghiệm tốt: UX đơn giản cho cả hội viên và nhân viên

---

## 1.4. Phạm vi đề tài

FitFuel+ bao gồm **8 module chính**:

| Module | Chức năng | Phạm vi |
|---|---|---|
| **Account Management** | Đăng ký, đăng nhập, hồ sơ Fitness Passport | Có |
| **Gym Tracking** | Check-in, ghi nhận buổi tập, theo dõi tiến độ | Có |
| **Membership Lifecycle** | Đăng ký, gia hạn, nâng cấp, tạm ngưng | Có |
| **Nutrition Management** | Quản lý sản phẩm, bán hàng, tồn kho | Có |
| **Gear Rental** | Bán/cho thuê dụng cụ, Guest OTP | Có |
| **Gamification** | XP, Badge, Streak, Challenge | Có |
| **Payment & FitCoin** | Thanh toán sandbox, quản lý FitCoin | Có |
| **AI Retention & Reporting** | Cảnh báo hành động, Dashboard KPI | Có |

**Ngoài phạm vi**: Multi-tenant, thiết bị đeo thông minh, livestream, thanh toán thực tế.

---

## 1.5. Thông tin thương hiệu

**Tên**: FitFuel+ = "Fit" (rèn luyện) + "Fuel" (năng lượng) + "+" (mở rộng & kết nối)

**Slogan**: "Train Smart. Manage Better. Grow Stronger."

**Tầm nhìn**: Trở thành giải pháp quản lý phòng gym hiện đại dành cho thị trường Việt Nam

**Sứ mệnh**: Giúp phòng gym quản lý hiệu quả, tối ưu doanh thu, và xây dựng cộng đồng hội viên gắn bó lâu dài

**Đối tượng**: Chủ phòng gym, quản lý vận hành, nhân viên lễ tân, hội viên

---

## 1.6. Phân tích đối thủ cạnh tranh

**📊 Chart 3: So Sánh Phần Mềm Quản Lý Gym - FitFuel+ vs Đối Thủ (Statista, GetKisi 2026)**

| **Tính Năng** | **Excel** | **GymDesk** | **Glofox** | **Mindbody** | **FitFuel+** |
|---|:---:|:---:|:---:|:---:|:---:|
| **Quản lý membership** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Check-in/Attendance** | ❌ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Nutrition Management** | ❌ | ❌ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Gear Rental** | ❌ | ❌ | ❌ | ❌ | ⭐⭐⭐⭐⭐ |
| **Gamification (XP/Badge)** | ❌ | ❌ | ❌ | ❌ | ⭐⭐⭐⭐⭐ |
| **AI Retention & Alerts** | ❌ | ❌ | ❌ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Real-time Dashboard** | ⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Tự động hóa** | ❌ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Chi phí** | **0đ** | **$75/tháng** | **~$110/tháng** | **$139/tháng** | **~1-2M/tháng** |
| **Focused For** | Thủ công | CrossFit/BJJ | Boutique Fitness | Multi-service | **Toàn diện Gym** |

*Nguồn: GetKisi (2026), GymDesk Official, Statista (2026)*

**Kết luận**: FitFuel+ là **giải pháp duy nhất** trên thị trường Việt Nam tích hợp **toàn bộ vòng đời hội viên** (Membership + Gym Tracking + Nutrition + Gear + Gamification + AI Retention + KPI Dashboard) trong một nền tảng, với chi phí phù hợp cho phòng gym vừa và nhỏ tại Việt Nam.

---

## Kết luận chương

Chương 1 đã xác định rõ bối cảnh, vấn đề và giải pháp:

1. **Bối cảnh thị trường** (Statista 2026):
   - Thị trường fitness Việt Nam tăng trưởng ổn định **14%/năm**, dự báo đạt $800 triệu vào 2025
   - Tuy nhiên, **72% phòng gym vẫn dùng Excel/sổ sách** quản lý, chỉ 10% dùng hệ thống hiện đại

2. **Vấn đề thực tế** (Glofox, VnData 2024-2025):
   - **91.2%** boutique fitness studios không đạt lợi nhuận bền vững (tỷ lệ gia hạn chỉ 35-45%)
   - **100% thủ công** - không có cảnh báo tự động cho hội viên sắp hết hạn
   - **72% dùng Excel** - dữ liệu rải rác, không thể phân tích để dự đoán churn
   - Doanh thu phụ trợ (Nutrition + Gear) chỉ khai thác được **15-20%** tiềm năng thị trường

3. **Giải pháp**: **FitFuel+** - nền tảng toàn diện tích hợp:
   - Membership Lifecycle, Gym Tracking, Nutrition Management, Gear Rental
   - Gamification (XP/Badge/Streak), AI Retention & Alerts, Real-time Dashboard KPI
   - Tự động hóa hoàn toàn, dữ liệu tập trung, hỗ trợ AI phân tích

4. **Khác biệt cạnh tranh**:
   - FitFuel+ là **giải pháp duy nhất** cover **toàn bộ vòng đời hội viên + doanh thu phụ trợ + gamification + AI**
   - Competitors (GymDesk, Glofox, Mindbody) chỉ cover membership + check-in, thiếu Nutrition + Gear + AI Retention
   - Chi phí phù hợp cho phòng gym vừa và nhỏ Việt Nam (~1-2M/tháng vs $75-139/tháng của competitors)

Các chương tiếp theo sẽ trình bày chi tiết phân tích yêu cầu (Chapter 2), thiết kế hệ thống (Chapter 3), cơ sở dữ liệu (Chapter 4) và triển khai FitFuel+ (Chapter 5-6).
