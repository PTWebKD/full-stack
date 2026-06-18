# 14. MÔ HÌNH QUY TRÌNH NGHIỆP VỤ (BPMN)

> Dự án: FitFuel+
> Môn học: Web Kinh Doanh
> Ngày: 18/06/2026 (Cập nhật: Định hướng lại Gym Management System — bỏ Food Vendor/Gear P2P, thêm Nutrition Nội bộ/Asset/Membership Lifecycle/AI Care Queue)

========================================================================

## 3.3.1 — Quy trình quản lý và đánh giá tiến độ tập luyện
*(Quy trình Gym Tracking, Check-in và Gamification)*

**1. Mô tả quy trình chi tiết**

Quy trình bắt đầu khi Hội viên (Member) đến phòng tập và thực hiện **Check-in**. Hệ thống quét mã QR của Member (hoặc nhân viên tìm kiếm thủ công), xác nhận gói tập còn hiệu lực và hiển thị quyền lợi tiện ích đi kèm (khăn, locker theo gói tập). Nhân viên tiến hành cấp phát tiện ích và hệ thống ghi nhận vào ASSET_ASSIGNMENTS.

Sau check-in, Member chọn **Tạo buổi tập mới**. Hệ thống phân tích lịch sử 7 ngày gần nhất để đề xuất nhóm cơ phù hợp (BR-32). Member xác nhận nhóm cơ và ghi chú tùy chọn, hệ thống tạo Workout Session với trạng thái "Active".

Trong quá trình tập, Member chọn bài tập từ thư viện và nhập thông tin từng Set (số lần lặp và mức tạ). Sau mỗi Set, hệ thống kiểm tra và đối chiếu với lịch sử để xác định có phá **Personal Record (PR)** không (BR-31). Nếu đạt PR mới, hệ thống cộng XP thưởng và hiển thị thông báo.

Khi Member kết thúc buổi tập, hệ thống tổng hợp dữ liệu, tính XP session, cập nhật Streak (BR-23), kiểm tra mốc thành tựu và hiển thị popup gợi ý dinh dưỡng phù hợp với nhóm cơ vừa tập (BR-15). Session chuyển sang trạng thái "Done" và cập nhật Fitness Passport.

**2. Quy tắc nghiệp vụ (Business Rules)**
- **BR-31:** PR = max(weight × reps) cho từng bài tập, độc lập với nhau.
- **BR-21:** XP: +50 cho mỗi buổi tập hoàn thành, +30 cho mỗi PR mới, +10 cho check-in QR.
- **BR-23 & BR-24:** Streak tăng khi có ít nhất 1 buổi tập hoàn thành trong ngày. Reset sau 2 ngày không tập.
- **BR-25:** Thưởng FitCoin khi đạt mốc streak (7/30/60/100/365 ngày).
- **BR-32:** Gợi ý nhóm cơ ít được tập nhất trong 7 ngày gần nhất.
- **BR-33:** Session chỉ được sửa/xóa trong vòng 24 giờ sau khi hoàn thành.
- **BR-09 (check-in):** Member chỉ được check-in khi gói tập còn hiệu lực.

**3. Tình huống ngoại lệ (Exception Handling)**
- **Gói tập hết hạn khi check-in:** Hệ thống thông báo hết hạn và chuyển đến trang gia hạn.
- **Dữ liệu nhập vượt ngưỡng:** Hệ thống cảnh báo nhưng vẫn lưu; loại khỏi tính PR.
- **Mất kết nối mạng:** Tạm giữ dữ liệu Session, đồng bộ khi khôi phục kết nối.

**4. Sơ đồ BPMN (mô tả văn bản)**

```
Pool: MEMBER
  [Start] -> [Check-in QR] -> {Gói tap con hieu luc?}
    Nhánh Không -> [Thong bao het han] -> [Chuyen trang gia han] -> [End]
    Nhánh Có -> [Xac nhan cap tien ich] -> [Tao buoi tap moi]
             -> [Chon bai tap + nhap set] -> {Dat PR moi?}
               Nhánh Có -> [Cong XP PR] -> [Them set hoac bai moi]
               Nhánh Không -> [Them set hoac bai moi]
             -> {Ket thuc buoi tap?}
               Nhánh Không -> [tiep tuc log]
               Nhánh Có -> [Tong hop XP, streak, cap nhat Fitness Passport]
                        -> [Popup goi y dinh duong] -> [End]

Pool: HE THONG FITFUEL+
  Nhan su kien check-in -> Xac nhan GYM_MEMBERSHIPS -> Ghi CHECK_INS
  Nhan su kien ket thuc session -> Ghi WORKOUT_SESSIONS + EXERCISE_LOGS
  Tinh XP -> Cap nhat USERS.xp_total + current_streak
  Kiem tra badge -> Unlock badge neu du dieu kien
  Tao AI recommendation (nutrition suggestion) -> Gui popup

Pool: TIMER (Actor phu)
  Hang ngay luc 00:05 -> Quet streak -> Reset streak neu can -> Gui notification
```

========================================================================

## 3.3.2 — Quy trình bán sản phẩm dinh dưỡng nội bộ
*(Quy trình Nutrition — Ban tai quay POS va Dat truoc sau buoi tap)*

**1. Mô tả quy trình chi tiết**

Phòng tập trực tiếp quản lý và bán các sản phẩm dinh dưỡng (protein shake, nước điện giải, snack, meal combo) — **không có Vendor bên ngoài**. Quy trình có 2 luồng chính:

**Luồng A — Bán tại quầy (POS):**
Nhân viên mở màn hình POS, tìm kiếm Member (theo tên hoặc SĐT), chọn sản phẩm và số lượng. Hệ thống kiểm tra tồn kho, hiển thị tổng tiền. Nhân viên xác nhận và tạo NUTRITION_ORDERS với order_type = 'pos_sale'. Hệ thống cập nhật INVENTORY (trừ tồn kho), tạo INVOICES và cộng XP cho Member nếu có.

**Luồng B — Đặt trước sau buổi tập (Pre-order):**
Khi Member kết thúc buổi tập, hệ thống hiển thị popup gợi ý 3 sản phẩm phù hợp với nhóm cơ vừa tập (BR-15). Member chọn sản phẩm và đặt trước (NUTRITION_ORDERS với order_type = 'pre_order', status = 'pending'). Nhân viên nhận thông báo, chuẩn bị sản phẩm và chuyển sang trạng thái 'ready'. Member đến lấy hàng, nhân viên xác nhận và tạo hóa đơn.

**Luồng C — Cảnh báo tồn kho:**
Hệ thống tự động kiểm tra INVENTORY sau mỗi giao dịch. Nếu tồn kho <= low_stock_threshold, cảnh báo màu đỏ hiển thị trên dashboard Gym Owner và danh sách cảnh báo.

**2. Quy tắc nghiệp vụ**
- **BR-12:** Chỉ Gym Owner / nhân viên được bán sản phẩm. Không có vendor ngoài.
- **BR-13:** Cập nhật tồn kho sau mỗi giao dịch, cảnh báo khi tồn kho thấp.
- **BR-14:** Combo phải có ít nhất 2 thành phần, giá combo < tổng giá lẻ.
- **BR-15:** Gợi ý 3 sản phẩm theo nhóm cơ. Nếu < 3 sản phẩm phù hợp: bổ sung sản phẩm bán chạy nhất.
- **BR-30:** Tối đa 50% giá trị đơn được thanh toán bằng FitCoin.

**3. Tình huống ngoại lệ**
- **Sản phẩm hết hàng:** Hệ thống ẩn sản phẩm khỏi gợi ý, hiển thị thông báo "Hết hàng".
- **Đặt trước nhưng sản phẩm hết:** Nhân viên hủy pre-order, thông báo Member.
- **Thanh toán thất bại:** Giữ nguyên trạng thái INVENTORY, hủy đơn hàng.

**4. Sơ đồ BPMN (mô tả văn bản)**

```
Pool: GYM OWNER / NHÂN VIÊN
  -- Luong A: POS --
  [Start POS] -> [Tim kiem Member] -> [Chon san pham + so luong]
  -> {Ton kho du?}
    Nhánh Không -> [Thong bao het hang] -> [End]
    Nhánh Có -> [Xac nhan + tao don hang] -> [Thanh toan (tien/FitCoin)]
             -> [Xac nhan don thanh cong] -> [End]

  -- Luong B: Xu ly Pre-order --
  [Nhan thong bao pre-order moi] -> [Chuan bi san pham] -> [Chuyen trang thai = ready]
  -> [Member den lay hang] -> [Xac nhan nhan hang] -> [Tao hoa don] -> [End]

Pool: MEMBER
  -- Luong B: Dat truoc --
  [Ket thuc buoi tap] -> [Xem popup goi y dinh duong] -> {Dat truoc?}
    Nhánh Có -> [Chon san pham + xac nhan] -> [Cho san pham chuan bi] -> [Den lay hang] -> [End]
    Nhánh Không -> [End]

Pool: HE THONG FITFUEL+
  Nhan yeu cau ban hang -> Kiem tra ton kho -> Tao NUTRITION_ORDERS
  -> Cap nhat INVENTORY -> Tao INVOICES
  -> Kiem tra ton kho < nguong? -> Tao canh bao ton kho
  -> Gui thong bao pre-order cho nhân vien
```

========================================================================

## 3.3.3 — Quy trình quản lý tài sản và tiện ích phòng tập
*(Quy trình Asset & Amenities — Cấp phát, Thu hồi, Xử lý hư hỏng/mất mát)*

**1. Mô tả quy trình chi tiết**

**Luồng A — Cấp phát tiện ích khi check-in:**
Khi Member check-in thành công, hệ thống tra cứu gói tập và xác định quyền lợi (BR-16):
- Basic: không có tiện ích thêm.
- Standard: cấp 1 khăn.
- Premium: cấp khăn + locker tháng (nếu chưa có locker).
- PT Plus: cấp khăn + dụng cụ phụ trợ trong buổi tập.

Nhân viên xác nhận cấp phát vật lý và hệ thống tạo ASSET_ASSIGNMENTS với trạng thái "pending" (chờ trả).

**Luồng B — Thu hồi tài sản khi ra về:**
Khi Member chuẩn bị ra về, nhân viên kiểm tra và ghi nhận tình trạng tài sản trả lại:
- **Đã trả nguyên vẹn:** Cập nhật return_status = 'returned', tài sản về trạng thái "available".
- **Hư hỏng:** Tạo ASSET_PENALTIES với penalty_type = 'damage', tính phí theo danh mục. Thêm vào INVOICES của Member. Member thanh toán hoặc đưa vào nợ (phải trả trước lần check-in tiếp theo).
- **Mất mát:** Tạo ASSET_PENALTIES với penalty_type = 'loss', phí = 100% giá trị tài sản.

**Luồng C — Quản lý Locker:**
Gym Owner xem bản đồ locker (màu xanh = trống, đỏ = đang dùng, vàng = bảo trì). Nhân viên cấp locker cho Member gói Premium hoặc theo yêu cầu. Hệ thống tự động cảnh báo locker quá hạn. Khi Member không gia hạn, locker được thu hồi và trả về trạng thái "available".

**Luồng D — Bảo trì tài sản:**
Khi tài sản bị báo hỏng hoặc cần vệ sinh, Gym Owner đổi trạng thái sang "maintenance". Tài sản đang bảo trì không thể cấp phát. Sau khi hoàn thành, Gym Owner xác nhận và chuyển về "available".

**2. Quy tắc nghiệp vụ**
- **BR-16:** Quyền lợi tiện ích phụ thuộc gói tập (Day Pass/Basic/Standard/Premium/PT Plus).
- **BR-17:** Mỗi lần cấp phát = 1 bản ghi ASSET_ASSIGNMENTS. Nhân viên phải xác nhận.
- **BR-18:** Phí phạt = phí hong/phí mat trong danh mục ASSETS. Tự động tạo hóa đơn.
- **BR-19:** Locker buổi: thu hồi khi Member checkout. Locker tháng: thu hồi khi hết hạn gói Premium.
- **BR-20:** Tài sản trong trạng thái "maintenance" không được cấp phát.

**3. Tình huống ngoại lệ**
- **Hết khăn khi check-in:** Nhân viên ghi chú, giao khăn ngay khi có. Thông báo Gym Owner cần nhập thêm.
- **Tất cả locker đầy:** Thông báo cho Member, nhân viên ghi nhận vào danh sách chờ.
- **Member không đồng ý mức phí phạt:** Gym Owner xem xét và điều chỉnh thủ công.

**4. Sơ đồ BPMN (mô tả văn bản)**

```
Pool: MEMBER
  [Check-in] -> [Nhan tien ich] -> [Su dung phong tap] -> [Tra tai san khi ra]
  -> {Tinh trang tai san?}
    Nguyen ven -> [Ky nhan tra] -> [End]
    Hu hong/Mat -> [Xac nhan phi phat] -> {Dong y phi?}
      Co -> [Thanh toan phi phat] -> [End]
      Khong -> [Khieu nai Gym Owner] -> [Cho giai quyet] -> [End]

Pool: GYM OWNER / NHÂN VIÊN
  [Xem cap phat tien ich theo goi tap] -> [Cap phat vat ly] -> [Ghi nhan ASSET_ASSIGNMENTS]
  [Nhan tai san tra] -> [Kiem tra tinh trang] -> [Ghi nhan ket qua]
  -> {Can phat?} -> Tao ASSET_PENALTIES + INVOICES
  [Quan ly Locker] -> [Xem so do] -> [Cap/Thu hoi locker]
  [Bao tri tai san] -> [Doi trang thai maintenance] -> [Xac nhan hoan thanh] -> [Doi available]

Pool: HE THONG FITFUEL+
  Nhan check-in -> Doc goi tap -> Xac dinh quyen loi -> Hien thi tien ich can cap
  Nhan tra tai san -> Ghi return_status -> Tinh phi phat neu can -> Tao INVOICES
  Kiem tra locker qua han (hang ngay) -> Canh bao Gym Owner
```

========================================================================

## 3.3.4 — Quy trình vòng đời hội viên (Membership Lifecycle)
*(Đăng ký, Gia hạn, Nâng cấp, Bảo lưu)*

**1. Mô tả quy trình chi tiết**

**Luồng A — Đăng ký gói tập mới:**
- **Online 100%:** Khách truy cập trang landing, chọn gói tập. Hệ thống hiện duy nhất 1 ô nhập SĐT. Khách thanh toán qua VNPay/MoMo sandbox. Sau thanh toán thành công, hệ thống tự động tạo tài khoản Member (ghi USERS), tạo GYM_MEMBERSHIPS, ghi MEMBERSHIP_HISTORY (action='register'). SMS gửi SĐT với mật khẩu tạm thời.
- **Offline to Online (tại quầy):** Admin chọn gói tập trên POS, hệ thống sinh QR Code VietQR. Khách quét và chuyển khoản. Webhook nhận callback → tạo tài khoản Member → gửi SMS.

**Luồng B — Gia hạn gói tập:**
Nhân viên hoặc Member trực tiếp truy cập trang /membership, chọn gói gia hạn. Hệ thống tính ngày hết hạn mới = ngày hết hạn cũ + thời hạn gói mới (nếu còn hạn), hoặc = ngày hôm nay + thời hạn gói mới (nếu đã hết hạn). Sau thanh toán thành công, cập nhật GYM_MEMBERSHIPS.end_date, tạo MEMBERSHIP_HISTORY (action='renew'), thêm 50 FitCoin bonus cho Member. AI care queue tự động loại bỏ recommendation liên quan.

**Luồng C — Nâng cấp gói:**
Member chọn nâng cấp từ gói hiện tại lên gói cao hơn. Hệ thống tính phí chênh lệch theo ngày (BR-07). Member xác nhận và thanh toán. Cập nhật GYM_MEMBERSHIPS.plan_id, ghi MEMBERSHIP_HISTORY (action='upgrade').

**Luồng D — Bảo lưu:**
Member gửi yêu cầu bảo lưu (lý do: sức khỏe, công tác...). Gym Owner xem xét và duyệt/từ chối. Nếu duyệt: cập nhật GYM_MEMBERSHIPS.status='suspended', ghi số ngày bảo lưu. Khi hết bảo lưu hoặc Member kích hoạt lại: cộng thêm số ngày bảo lưu vào end_date, chuyển status='active'.

**2. Quy tắc nghiệp vụ**
- **BR-05 & BR-06:** Gia hạn tạo MEMBERSHIP_HISTORY entry mới, không ghi đè bản ghi cũ.
- **BR-07:** Phí nâng cấp = (giá gói mới - giá gói cũ) / số ngày gói cũ × số ngày còn lại.
- **BR-08:** Bảo lưu tối đa 1 lần/năm, tối đa 60 ngày, phải được Admin duyệt.
- **BR-40:** Member chỉ đăng ký qua luồng mua Membership (Online hoặc Offline to Online).
- **BR-10:** Hệ thống tự động thêm Member vào AI care queue khi <= 7 ngày hết hạn.
- **BR-30:** FitCoin bonus +50 sau mỗi lần gia hạn.

**3. Tình huống ngoại lệ**
- **Thanh toán thất bại:** Không tạo tài khoản, không kích hoạt gói. Cho thử lại.
- **Webhook không nhận được:** Retry tối đa 3 lần trong 10 phút. Admin xác nhận thủ công nếu vẫn thất bại.
- **Nâng cấp khi còn ít ngày (< 3 ngày):** Cảnh báo người dùng, gợi ý gia hạn thay vì nâng cấp để tiết kiệm hơn.

**4. Sơ đồ BPMN (mô tả văn bản)**

```
Pool: MEMBER / KHÁCH
  -- Luong A: Dang ky Online --
  [Chon goi tap] -> [Nhap SDT] -> [Thanh toan] -> {Thanh cong?}
    Khong -> [Thong bao that bai] -> [Thu lai hoac thoat] -> [End]
    Co -> [Hoan thanh dang ky] -> [Nhan SMS mat khau] -> [Dang nhap] -> [End]

  -- Luong B: Gia han --
  [Vao trang /membership] -> [Chon goi gia han] -> [Xac nhan + thanh toan]
  -> [Nhan xac nhan gia han + FitCoin bonus] -> [End]

  -- Luong D: Bao luu --
  [Gui yeu cau bao luu] -> [Cho Admin duyet] -> {Duoc duyet?}
    Co -> [Goi tap tam ngung, cong ngay khi kich hoat lai] -> [End]
    Khong -> [Nhan thong bao tu choi] -> [End]

Pool: GYM OWNER / NHÂN VIÊN
  -- Luong A: Offline to Online --
  [Chon goi tren POS] -> [He thong sinh QR] -> [Khach quet + chuyen khoan]
  -> [Nhan callback] -> [Kiem tra va xac nhan] -> [End]

  -- Luong D: Duyet bao luu --
  [Nhan yeu cau bao luu] -> {Hop le?}
    Co -> [Duyet bao luu] -> [Cap nhat status = suspended] -> [End]
    Khong -> [Tu choi + ghi ly do] -> [End]

Pool: HE THONG FITFUEL+
  Nhan thanh toan thanh cong -> Kiem tra idempotency (BR-38)
  -> Tao USERS (neu chua co) -> Tao GYM_MEMBERSHIPS
  -> Ghi MEMBERSHIP_HISTORY (action='register') -> Tao INVOICES
  -> Gui SMS mat khau tam thoi -> Them 50 FitCoin (khi gia han)

Pool: PAYMENT GATEWAY (Actor phu)
  Nhan yeu cau -> Xu ly giao dich -> Gui callback ket qua
```

========================================================================

## 3.3.5 — Quy trình AI chăm sóc hội viên (AI Retention & Care Queue)
*(Quy trình Rule-based Recommendation, Care Queue, Upsell)*

**1. Mô tả quy trình chi tiết**

**Luồng A — Tạo Recommendation tự động (Timer):**
Hệ thống chạy cron job hằng ngày (lúc 06:00). Timer quét toàn bộ hội viên đang active và áp dụng 6 rule (BR-35):
- Rule 1: Gói sắp hết hạn <= 7 ngày → "renew_reminder", priority HIGH.
- Rule 2: Chưa check-in >= 14 ngày (gói còn hạn) → "inactive_alert", priority MEDIUM.
- Rule 3: Gói hết hạn 1-3 ngày → "renew_reminder", priority HIGH.
- Rule 4: Gói hết hạn > 3 ngày, chưa gia hạn → "renew_reminder", priority HIGH.
- Rule 5: Check-in >= 4 lần/tuần + gói Basic → "upsell_plan", priority MEDIUM.
- Rule 6: Hay mua dinh dưỡng (>= 3 lần/tuần) → "upsell_nutrition", priority LOW.

Mỗi rule tạo 1 bản ghi RECOMMENDATIONS. Nếu đã có bản ghi pending cho Member đó trong 7 ngày gần nhất → không tạo trùng.

**Luồng B — Nhân viên xử lý Care Queue:**
Gym Owner/nhân viên truy cập trang /gym-owner/care-queue. Hệ thống hiển thị danh sách Member cần chăm sóc, sắp xếp theo priority (HIGH trước). Mỗi dòng: tên Member, lý do, gợi ý hành động cụ thể.

Nhân viên thực hiện hành động (gọi điện, gửi tin nhắn, mời đến quầy...) và nhấn **[Ghi nhận kết quả]**. Hệ thống mở form ghi nhận: hành động đã làm, kết quả (renewed/declined/unreachable/other), ghi chú thêm. Sau khi ghi nhận, RECOMMENDATIONS.status = 'handled', MEMBER_CARE_LOGS được tạo, RECOMMENDATIONS.resolved_at = NOW().

**Luồng C — Gợi ý Upsell theo hành vi:**
AI phân tích hành vi Member định kỳ:
- Tập đều (>= 4 buổi/tuần) nhưng chưa dùng PT → gợi ý "Thử buổi PT đầu tiên".
- Hay dùng locker nhưng gói không kèm locker → gợi ý "Nâng cấp Premium".
- Hay mua protein → gợi ý "Combo dinh dưỡng tháng".

Gợi ý hiển thị trong dashboard Gym Owner kèm danh sách Member cụ thể.

**2. Quy tắc nghiệp vụ**
- **BR-35:** 6 rule tạo recommendation, không tạo trùng trong 7 ngày.
- **BR-36:** Nhân viên phải ghi nhận kết quả sau khi xử lý (handled/dismissed).
- **BR-10:** Gói <= 7 ngày → HIGH priority. <= 3 ngày → SMS tự động.
- **BR-11:** Chưa check-in >= 14 ngày → MEDIUM priority.

**3. Tình huống ngoại lệ**
- **Member không thể liên hệ được:** Ghi nhận result = 'unreachable', recommendation chuyển sang 'handled'. Hệ thống tạo lại recommendation sau 3 ngày nếu tình trạng vẫn còn.
- **Member đã tự gia hạn online:** Recommendation tự động chuyển sang 'handled' khi hệ thống phát hiện GYM_MEMBERSHIPS được gia hạn.

**4. Sơ đồ BPMN (mô tả văn bản)**

```
Pool: TIMER
  [Start: Hang ngay 06:00] -> [Quet tat ca member active]
  -> [Ap dung 6 rule (BR-35)] -> {Co recommendation moi?}
    Khong -> [End]
    Co -> [Tao RECOMMENDATIONS (neu chua co trong 7 ngay)] -> [End]

Pool: HE THONG FITFUEL+
  Nhan su kien gia han -> Tim RECOMMENDATIONS pending -> Doi status = 'handled' (tu dong)
  Nhan su kien check-in -> Cap nhat last_checkin -> Co the resolve 'inactive_alert'

Pool: GYM OWNER / NHÂN VIÊN
  [Vao care queue] -> [Xem danh sach uu tien cao truoc]
  -> [Chon 1 recommendation] -> [Thuc hien hanh dong]
  -> [Bam Ghi nhan ket qua] -> [Nhap ket qua + ghi chu]
  -> [Luu MEMBER_CARE_LOGS] -> [Recommendation -> status=handled] -> [End]

Pool: MEMBER (Passive)
  [Nhan thong bao nhac gia han (SMS/in-app)] -> {Tu gia han?}
    Co -> [Gia han online] -> [Recommendation tu dong dong] -> [End]
    Khong -> [Cho nhan vien lien he]
```

========================================================================

## 3.3.6 — Quy trình Transformation Journey Engine
*(Goal Setting → Program Execution → Progress & Milestone)*

**1. Mô tả quy trình chi tiết**

Quy trình bắt đầu khi **Member** (hội viên có gói tập active) muốn có hành trình tập luyện có định hướng. Member thực hiện **Goal Onboarding** gồm 5 bước: chọn loại mục tiêu (muscle_gain / fat_loss / maintain / strength), nhập chỉ tiêu cụ thể (tùy chọn), chọn số ngày/tuần, tự đánh giá trình độ, và chọn 1 trong 2–3 chương trình hệ thống gợi ý. Hệ thống tạo TRANSFORMATION_GOALS và MEMBER_PROGRAMS.

Mỗi ngày khi Member truy cập, hệ thống xác định **PROGRAM_DAY** phù hợp (dựa trên ngày kể từ start_date và days_per_week) và hiển thị buổi tập được gợi ý. Member có thể **chỉnh sửa** danh sách bài tập (thêm, bỏ, đổi sets/reps) trước khi bấm "Chấp nhận & Bắt đầu". Mọi chỉnh sửa được lưu vào customization_log.

Trong buổi tập, Member log từng set (số reps thực tế và mức tạ). Khi bấm **"Hoàn thành buổi tập"**, 3 engine chạy song song:
1. **Progressive Overload AI**: So sánh actual_reps với target 2 buổi gần nhất → gợi ý tăng/giữ tạ.
2. **AI Nutrition Suggestion**: Đọc 4 tín hiệu (nhóm cơ + goal + volume + lịch sử mua) → popup 3 gợi ý sản phẩm.
3. **Milestone Engine**: Kiểm tra 22 điều kiện → award FitCoin + XP → tạo MILESTONE_ACHIEVEMENTS.

Khi đạt **Milestone lớn** (M32: goal 100% hoặc M42: full program), hệ thống hiển thị Celebration UX và mời tạo **Share Card** với logo gym + stats trước/sau. Member chia sẻ lên mạng xã hội → tạo organic marketing cho gym (viral loop).

**Gym Owner** có thể xem AI Care Queue để xử lý R7 (member bỏ chương trình), R8 (member hoàn thành → upsell), R9 (member stuck bài → gợi ý PT).

**2. Quy tắc nghiệp vụ (Business Rules)**
- **BR-41:** Hệ thống lọc WORKOUT_PROGRAMS theo goal_type + level + days_per_week khi gợi ý.
- **BR-42:** Gợi ý buổi tập là tham khảo, member có thể chỉnh sửa tự do trước khi bắt đầu.
- **BR-43:** Progressive Overload: actual_reps >= target_max 2 lần liên tiếp → gợi ý +2.5kg.
- **BR-44:** Post-workout nutrition trigger với 4 tín hiệu thay vì 1 (mở rộng BR-15).
- **BR-45:** R7/R8/R9 triggers trong AI Care Queue.
- **BR-46:** 22 milestone với FitCoin + XP reward; M32 và M42 kích hoạt Celebration MAX.

**3. Tình huống ngoại lệ (Exception Handling)**
- **Không có chương trình phù hợp:** Nới rộng tiêu chí tìm kiếm (bỏ điều kiện level), hoặc gợi ý tạo buổi tập tự do.
- **Member bỏ chương trình > 7 ngày:** R7 trigger → staff chăm sóc. Không tự động xóa chương trình.
- **Không có sản phẩm dinh dưỡng trong kho:** Popup nutrition không hiển thị; không lỗi.
- **Milestone đã nhận trước đó:** Không trao lại (hasEarned check trước khi award).

**4. Sơ đồ BPMN (mô tả văn bản)**

```
Pool: MEMBER
  [Start] -> [Goal Onboarding 5 buoc] -> [Chon chuong trinh]
  -> [Tao TRANSFORMATION_GOALS + MEMBER_PROGRAMS]
  -> [Hang ngay: Xem goi y buoi tap]
  -> {Muon chinh sua?}
      Co -> [Them/Bo/Sua bai tap] -> [Luu customization_log]
      Khong -> (tiep tuc)
  -> [Bam Chap nhan & Bat dau] -> [Log tung set trong buoi tap]
  -> [Bam Hoan thanh buoi tap]
  -> [Xem goi y tang ta (overload suggestion)]
  -> [Xem popup goi y dinh duong] -> {Muon dat truoc?}
      Co -> [Tao NUTRITION_ORDERS (pre-order)] -> [tiep tuc]
      Khong -> (tiep tuc)
  -> {Co milestone moi?}
      Co -> {La Milestone lon (M32/M42)?}
              Co -> [Celebration UX] -> {Muon tao Share Card?}
                      Co -> [Generate Share Card] -> [Chia se len mang xa hoi] -> [End]
                      Khong -> [End]
              Khong -> [Notification nho] -> [End]
      Khong -> [End]

Pool: HE THONG
  [Nhan event "hoan thanh buoi tap"] ->
  [FORK: Chay 3 engine song song]
    -> [Progressive Overload AI: ghi overload_suggestion]
    -> [Nutrition AI: chon 3 SP tu 4 tin hieu]
    -> [Milestone Engine: kiem tra 22 dieu kien, award FitCoin + XP]
  [JOIN] -> [Cap nhat MEMBER_PROGRAMS.completion_pct]
  -> {completion_pct = 100?}
      Co -> [Chuyen MEMBER_PROGRAMS.status = 'completed'] -> [Tao R8 rec] -> [End]
      Khong -> [End]

Pool: GYM OWNER
  [Vao care queue] -> [Xem R7 / R8 / R9 recommendations]
  -> {Loai rec?}
      R7 -> [Goi dien check-in member bo chuong trinh] -> [Ghi ket qua] -> [End]
      R8 -> [Goi y chuong trinh tiep theo cho member] -> [Ghi ket qua] -> [End]
      R9 -> [Goi y dat buoi PT cho member stuck] -> [Ghi ket qua] -> [End]
```

========================================================================

## 3.3.7 — Quy trình Gear Marketplace & Guest OTP Checkout
*(Guest OTP → Mua gear/food/supplement | Member → Thuê gear → Trả gear)*

**1. Mô tả quy trình chi tiết**

Quy trình có 3 luồng chính dựa trên loại người dùng và loại giao dịch.

**Luồng A — Guest mua hàng qua OTP:**
Khách vãng lai truy cập /gear hoặc /nutrition, duyệt sản phẩm và chọn mua. Vì chưa có tài khoản, hệ thống chuyển sang màn xác thực OTP: Guest nhập SDT, hệ thống gửi SMS OTP 6 số (TTL 10 phút). Sau khi xác thực thành công, hệ thống cấp session_token 2 giờ và Guest tiếp tục thanh toán. INVOICES được tạo với user_id = NULL và guest_phone = SDT đã xác thực. Hệ thống trừ tồn kho và xác nhận đơn hàng.

**Luồng B — Member thuê gear:**
Member (đã đăng nhập) vào /gear, chọn gear is_for_rental = true, chọn ngày bắt đầu và ngày trả (tối đa +7 ngày). Hệ thống tính tổng chi phí = deposit + rental_fee. Member thanh toán → GEAR_RENTALS.status = 'active', qty_available giảm 1. Nếu đến ngày due_date mà chưa trả: daily cron đổi sang 'overdue', cộng late_fee 50,000 VND/ngày và gửi thông báo.

**Luồng C — Trả gear và xử lý đặt cọc:**
Member đến quầy trả gear. Staff kiểm tra tình trạng và ghi nhận: (a) Nguyên vẹn → hoàn 100% cọc, status = 'returned'. (b) Hư nhẹ → trừ 30% cọc. (c) Hư nặng → trừ 100% cọc + tạo INVOICES bồi thường thêm. (d) Mất → trừ 100% cọc + tạo INVOICES theo giá trị gear. Hệ thống cập nhật actual_return_date, qty_available += 1 (nếu không mất).

**2. Quy tắc nghiệp vụ (Business Rules)**
- **BR-47:** Guest OTP: 6 số, TTL 10 phút, tối đa 3 lần/ngày/số điện thoại; session 2 giờ sau xác thực.
- **BR-48:** Giới hạn mua của Guest: tối đa 5,000,000 VND/24 giờ/SDT; tối đa 3 đơn/session; KHÔNG thuê gear.
- **BR-49:** Thuê gear chỉ dành cho Member; tối đa 7 ngày/lần, gia hạn 1 lần; tối đa 3 gear cùng lúc.
- **BR-50:** Phí quá hạn 50,000 VND/ngày; quá 14 ngày → status 'lost', xử lý thủ công.
- **BR-51:** qty_available cập nhật realtime khi bán, thuê, trả; cảnh báo khi <= 1.

**3. Tình huống ngoại lệ (Exception Handling)**
- **OTP quá hạn hoặc sai:** Hệ thống thông báo, cho phép gửi lại (tối đa 3 lần/ngày).
- **Gear hết hàng khi Guest/Member đang thanh toán:** Hiển thị thông báo hết hàng, rollback giỏ hàng.
- **Member trả gear quá hạn và không liên lạc được:** Gym Owner đổi status = 'lost' thủ công, tạo INVOICES.
- **Guest muốn thuê gear:** Hệ thống hiển thị thông báo "Chức năng thuê gear chỉ dành cho Hội viên", kèm link đăng ký membership.

**4. Sơ đồ BPMN (mô tả văn bản)**

```
Pool: GUEST
  [Start] -> [Duyet catalog gear/nutrition]
  -> [Chon san pham, them gio hang]
  -> [Checkout] -> {Da xac thuc OTP chua?}
      Chua -> [Nhap SDT] -> [Nhan OTP SMS]
              -> {OTP dung?}
                  Sai/Het han -> [Gui lai OTP] -> (lap lai, toi da 3 lan)
                  Dung -> [Tao session_token (TTL 2 gio)] -> (tiep tuc)
      Da co session -> (tiep tuc)
  -> [Chon phuong thuc thanh toan] -> [Thanh toan VNPay/MoMo/tien mat]
  -> {Thanh toan thanh cong?}
      That bai -> [Thong bao that bai] -> [End]
      Thanh cong -> [Hien thi xac nhan don hang] -> [End]

Pool: MEMBER (Mua hoac Thue gear)
  [Start] -> [Duyet /gear] -> {Mua hay Thue?}
    Mua -> [Chon gear, so luong] -> [Thanh toan] -> [End (giong Guest nhung dung user_id)]
    Thue -> [Chon gear, chon ngay bat dau, ngay tra]
         -> [He thong tinh: deposit + rental_fee]
         -> [Xac nhan va thanh toan]
         -> {Thanh toan OK?}
             OK -> [Ghi GEAR_RENTALS.status='active'] -> [qty_available -= 1]
                -> [Nhan thong bao xac nhan thue] -> [End]
             Khong -> [Huy] -> [End]

Pool: HE THONG
  [Sau thanh toan thanh cong (ban)] ->
    [Tao INVOICES (gear_sale)] -> [Tru qty_available] -> [Gui xac nhan email/SMS]
    -> {qty_available <= 1?} -> Co: [Tao NOTIFICATIONS canh bao ton kho cho Gym Owner]
  [Daily cron 06:00 — quet GEAR_RENTALS] ->
    [Tim status='active' va due_date < TODAY]
    -> [Doi status = 'overdue', tinh late_fee += 50k/ngay]
    -> [Tao NOTIFICATIONS cho Member va Gym Owner]
    -> {Qua han >= 14 ngay?} -> Co: [Doi status = 'lost'] -> [Thong bao Gym Owner xu ly thu cong]

Pool: GYM OWNER / STAFF
  [Member den quy tra gear]
  -> [Tim GEAR_RENTALS theo member + gear]
  -> [Kiem tra tinh trang gear]
  -> {Tinh trang?}
      Nguyen ven -> [Hoan 100% coc] -> [status = 'returned', qty += 1] -> [End]
      Hu nhe   -> [Tru 30% coc] -> [status = 'returned', qty += 1] -> [End]
      Hu nang  -> [Tru 100% coc] -> [Tao INVOICES boi thuong them]
               -> [status = 'returned', qty += 1] -> [End]
      Mat      -> [Tru 100% coc] -> [Tao INVOICES theo gia tri gear]
               -> [status = 'lost', qty KHONG tang] -> [End]
  [Quan ly catalog gear: them/sua/an gear trong /gym-owner/gear/products]
  [Xem bao cao: doanh thu ban + thue + dat coc dang giu trong /gym-owner/gear/analytics]
```

========================================================================
KẾT THÚC FILE 14
========================================================================
