# 14. MÔ HÌNH QUY TRÌNH NGHIỆP VỤ (BPMN)

> Dự án: FitFuel+
> Môn học: Web Kinh Doanh
> Ngày: 18/06/2026

========================================================================

## TỔNG QUAN CẤU TRÚC

Tài liệu gồm **7 quy trình nghiệp vụ** nhóm thành 3 phân hệ, và **2 sub-process dùng chung**
được tái sử dụng bởi nhiều quy trình.

Ghi chú phương pháp:
- Các thao tác CRUD đơn giản (điền form, cập nhật 1 trường) KHÔNG vẽ BPMN — mô tả bằng Use Case.
- Luồng cron/thuật toán không có tương tác người dùng → vẽ bằng System Flowchart (sơ đồ thuật toán).
- Luồng có luân chuyển công việc giữa các bên → vẽ BPMN Pool.

Phân hệ                    | Quy trình
---------------------------|------------------------------------------------------------
Sub-processes dùng chung   | SP-01 Thanh toán, SP-02 Xác thực OTP Guest
Phân hệ 1 — Hội viên       | 3.3.1 Check-in & Gym Tracking, 3.3.4 Membership Lifecycle,
                           | 3.3.6 Transformation Journey
Phân hệ 2 — Thương mại     | 3.3.2 Dinh dưỡng nội bộ, 3.3.7 Gear Marketplace
Phân hệ 3 — Vận hành       | 3.3.5 AI Retention & Care Queue

========================================================================
## SUB-PROCESSES DÙNG CHUNG
========================================================================

## SP-01 — Xử lý Thanh toán
*(Tái sử dụng bởi: 3.3.2, 3.3.4, 3.3.7)*

Sub-process này đóng gói toàn bộ logic thanh toán. Các quy trình cha chỉ cần gọi
[Xử lý Thanh toán] và nhận kết quả SUCCESS / FAILED.

**Đầu vào:** amount, invoice_id, payment_method (vnpay / momo / cash)
**Đầu ra:** SUCCESS hoặc FAILED

```
Pool: MEMBER / GUEST / STAFF (người khởi tạo)
  [Chon phuong thuc: VNPay / MoMo / Tien mat]
  -- Thanh toan online (VNPay / MoMo): --
  -> [Redirect sang Payment Gateway] -> [Cho webhook callback]
  -> {Callback: thanh cong?}
      That bai -> [Log that bai] -> [Return: FAILED]
      Thanh cong -> (tiep tuc)
  -- Tien mat (tai quay): --
  -> [Nhan vien xac nhan thu tien] -> (tiep tuc)
  -> [Return: SUCCESS]

Pool: HE THONG FITFUEL+
  Nhan SUCCESS -> Kiem tra idempotency (BR-38, khong xu ly 2 lan cung invoice_id)
  -> Tao / cap nhat INVOICES.status = 'paid' -> [End]

Pool: PAYMENT GATEWAY (Actor phu — online only)
  Nhan yeu cau -> Xu ly giao dich -> Gui callback ket qua (thanh cong / that bai)
```

========================================================================

## SP-02 — Xác thực OTP Guest (khách vãng lai)
*(Tái sử dụng bởi: 3.3.7 Luồng A — Guest mua hàng)*

Sub-process này đóng gói toàn bộ logic bảo mật OTP. Quy trình cha gọi
[Xác thực OTP Guest] và nhận kết quả SUCCESS (kèm session_token) / BLOCKED / FAILED.

**Đầu vào:** phone_number
**Đầu ra:** SUCCESS + session_token (TTL 2h) | BLOCKED | FAILED

```
Pool: GUEST
  [Nhap SDT] -> {Da qua gioi han 3 lan/ngay?}
      Co -> [Hien thi thong bao "Da qua gioi han hom nay"] -> [Return: BLOCKED]
      Khong -> [Xem man hinh nhap OTP] -> [He thong gui SMS]
           -> [Nhap 6 so OTP] -> {OTP dung va chua het han (< 10 phut)?}
               Sai hoac het han -> {Con luot thu (< 3 lan)?}
                   Co -> [Hien thi loi, nut Gui lai] -> (quay lai nhap OTP)
                   Khong -> [Thong bao "Het luot thu"] -> [Return: FAILED]
               Dung -> [Return: SUCCESS + session_token]

Pool: HE THONG FITFUEL+
  Nhan yeu cau gui OTP -> Kiem tra so lan/ngay (BR-47)
  -> Sinh OTP 6 so, TTL = 10 phut -> Gui qua SMS gateway -> Luu OTP_VERIFICATIONS
  Nhan xac thuc thanh cong -> Tao session_token (TTL = 2 gio)
  -> Luu vao GUEST_SESSIONS (phone, token, expires_at)
```

========================================================================
## PHÂN HỆ 1 — HỘI VIÊN
========================================================================

## 3.3.1 — Quy trình quản lý và đánh giá tiến độ tập luyện
*(Check-in, Gym Tracking, Gamification)*

**1. Mô tả quy trình chi tiết**

Quy trình bắt đầu khi Member đến phòng tập và thực hiện **Check-in**. Hệ thống quét mã QR
của Member (hoặc nhân viên tìm kiếm thủ công), xác nhận gói tập còn hiệu lực
(Gói Tháng hoặc Gói Năm). Hệ thống ghi nhận vào CHECK_INS. Locker và khăn là đồ
cá nhân của member, không cấp phát qua hệ thống.

Sau check-in, Member chọn **Tạo buổi tập mới**. Hệ thống phân tích lịch sử 7 ngày
gần nhất để đề xuất nhóm cơ phù hợp (BR-32). Member xác nhận nhóm cơ và ghi chú
tùy chọn, hệ thống tạo Workout Session với trạng thái "Active".

Trong quá trình tập, Member chọn bài tập từ thư viện và nhập thông tin từng Set
(số lần lặp và mức tạ). Sau mỗi Set, hệ thống kiểm tra có phá **Personal Record (PR)**
không (BR-31). Nếu đạt PR mới, hệ thống cộng XP thưởng và hiển thị thông báo.

Khi Member kết thúc buổi tập, hệ thống tổng hợp dữ liệu, tính XP session, cập nhật
Streak (BR-23), kiểm tra mốc thành tựu và hiển thị popup gợi ý dinh dưỡng phù hợp
với nhóm cơ vừa tập (BR-15). Session chuyển sang trạng thái "Done".

**2. Quy tắc nghiệp vụ**
- **BR-09:** Member chỉ được check-in khi gói tập còn hiệu lực.
- **BR-31:** PR = max(weight × reps) cho từng bài tập, độc lập với nhau.
- **BR-21:** XP: +50/buổi hoàn thành, +30/PR mới, +10/check-in QR.
- **BR-23 & BR-24:** Streak tăng khi có ít nhất 1 buổi trong ngày. Reset sau 2 ngày không tập.
- **BR-25:** Thưởng FitCoin khi đạt mốc streak (7/30/60/100/365 ngày).
- **BR-32:** Gợi ý nhóm cơ ít được tập nhất trong 7 ngày gần nhất.
- **BR-33:** Session chỉ được sửa/xóa trong vòng 24 giờ sau khi hoàn thành.

**3. Tình huống ngoại lệ**
- **Gói tập hết hạn khi check-in:** Hệ thống thông báo và chuyển đến trang gia hạn.
- **Dữ liệu nhập vượt ngưỡng:** Cảnh báo nhưng vẫn lưu; loại khỏi tính PR.
- **Mất kết nối mạng:** Tạm giữ dữ liệu Session, đồng bộ khi khôi phục kết nối.

**4. Sơ đồ BPMN (mô tả văn bản)**

```
Pool: MEMBER
  [Start] -> [Check-in QR] -> {Goi tap con hieu luc?}
    Khong -> [Thong bao het han] -> [Chuyen trang gia han] -> [End]
    Co -> [Ghi CHECK_INS] -> [Tao buoi tap moi]
       -> [Chon bai tap + nhap set] -> {Dat PR moi?}
           Co -> [Cong XP PR] -> (them set hoac bai moi)
           Khong -> (them set hoac bai moi)
       -> {Ket thuc buoi tap?}
           Khong -> (tiep tuc log)
           Co -> [Tong hop XP, streak, cap nhat Fitness Passport]
              -> [Popup goi y dinh duong] -> [End]

Pool: HE THONG FITFUEL+
  Nhan su kien check-in -> Xac nhan GYM_MEMBERSHIPS -> Ghi CHECK_INS
  Nhan su kien ket thuc session -> Ghi WORKOUT_SESSIONS + EXERCISE_LOGS
  -> Tinh XP -> Cap nhat USERS.xp_total + current_streak
  -> Kiem tra badge -> Unlock badge neu du dieu kien
  -> Tao AI recommendation (nutrition suggestion) -> Gui popup

Pool: TIMER (Actor phu)
  Hang ngay 00:05 -> Quet streak -> Reset streak neu can -> Gui notification
```

========================================================================

## 3.3.4 — Quy trình vòng đời hội viên (Membership Lifecycle)
*(Đăng ký, Gia hạn, Chuyển gói Tháng ↔ Năm, Bảo lưu)*

**1. Mô tả quy trình chi tiết**

**Gói tập:** Chỉ có 2 loại — **Gói Tháng** (1 tháng) và **Gói Năm** (12 tháng). Cả hai cho
quyền lợi y hệt nhau. Gói Năm tiết kiệm tương đương 2 tháng.

**Luồng A — Đăng ký gói tập mới:**
- **Online 100%:** Khách truy cập trang landing, chọn Gói Tháng hoặc Gói Năm, nhập SĐT,
  thanh toán qua [SP-01]. Sau khi SUCCESS: hệ thống tự động tạo tài khoản Member (ghi USERS),
  tạo GYM_MEMBERSHIPS, ghi MEMBERSHIP_HISTORY (action='register'). SMS gửi mật khẩu tạm thời.
- **Offline to Online (tại quầy):** Admin chọn gói trên POS, hệ thống sinh QR Code VietQR.
  Khách quét và chuyển khoản. Webhook nhận callback → tạo tài khoản Member → gửi SMS.

**Luồng B — Gia hạn gói tập:**
Nhân viên hoặc Member truy cập /membership, chọn gia hạn (Tháng hoặc Năm), thanh toán
qua [SP-01]. Hệ thống tính ngày hết hạn mới = end_date cũ + thời hạn mới (nếu còn hạn)
hoặc = NOW() + thời hạn mới (nếu đã hết). Cập nhật GYM_MEMBERSHIPS.end_date,
ghi MEMBERSHIP_HISTORY (action='renew'), cộng 50 FitCoin bonus (BR-30).

**Luồng C — Chuyển gói (Tháng → Năm):**
Member chọn "Chuyển sang Gói Năm". Hệ thống tính phí chênh lệch theo ngày còn lại
của Gói Tháng (BR-07). Member xác nhận, thanh toán qua [SP-01]. Cập nhật plan_id,
ghi MEMBERSHIP_HISTORY (action='upgrade').

**Luồng D — Bảo lưu:**
Member gửi yêu cầu bảo lưu. Gym Owner xem xét và duyệt/từ chối. Nếu duyệt:
GYM_MEMBERSHIPS.status = 'suspended'. Khi Member kích hoạt lại: cộng số ngày bảo lưu
vào end_date, chuyển status = 'active'.

**2. Quy tắc nghiệp vụ**
- **BR-05 & BR-06:** Gia hạn tạo MEMBERSHIP_HISTORY entry mới, không ghi đè bản ghi cũ.
- **BR-07:** Phí chuyển gói = (giá Gói Năm - giá Gói Tháng) / 30 × số ngày còn lại.
- **BR-08:** Bảo lưu tối đa 1 lần/năm, tối đa 60 ngày, phải được Admin duyệt.
- **BR-10:** Hệ thống tự động thêm Member vào AI care queue khi <= 7 ngày hết hạn.
- **BR-30:** FitCoin bonus +50 sau mỗi lần gia hạn.
- **BR-40:** Member chỉ đăng ký qua luồng mua Membership (Online hoặc Offline to Online).

**3. Tình huống ngoại lệ**
- **Thanh toán thất bại (SP-01 FAILED):** Không tạo tài khoản, không kích hoạt gói. Cho thử lại.
- **Webhook không nhận được:** Retry tối đa 3 lần trong 10 phút. Admin xác nhận thủ công.
- **Chuyển gói khi còn < 3 ngày:** Cảnh báo, gợi ý gia hạn thay vì chuyển gói để tiết kiệm hơn.

**4. Sơ đồ BPMN (mô tả văn bản)**

```
Pool: MEMBER / KHACH
  -- Luong A: Dang ky Online --
  [Chon Goi Thang hoac Goi Nam] -> [Nhap SDT]
  -> [Thanh toan — goi SP-01] -> {SP-01 ket qua?}
      FAILED -> [Thong bao that bai] -> [Thu lai hoac thoat] -> [End]
      SUCCESS -> [Hoan thanh dang ky] -> [Nhan SMS mat khau] -> [Dang nhap] -> [End]

  -- Luong B: Gia han --
  [Vao trang /membership] -> [Chon Goi Thang hoac Goi Nam]
  -> [Thanh toan — goi SP-01] -> SUCCESS
  -> [Nhan xac nhan gia han + FitCoin bonus] -> [End]

  -- Luong C: Chuyen goi (Thang -> Nam) --
  [Chon "Chuyen sang Goi Nam"] -> [Xem phi cong them]
  -> [Thanh toan — goi SP-01] -> SUCCESS
  -> [Nhan xac nhan doi goi] -> [End]

  -- Luong D: Bao luu --
  [Gui yeu cau bao luu] -> [Cho Admin duyet] -> {Duoc duyet?}
      Co -> [Goi tap tam ngung, cong ngay khi kich hoat lai] -> [End]
      Khong -> [Nhan thong bao tu choi] -> [End]

Pool: GYM OWNER / NHAN VIEN
  -- Luong A: Offline to Online --
  [Chon goi tren POS] -> [He thong sinh QR VietQR]
  -> [Khach quet + chuyen khoan] -> [Nhan callback] -> [Xac nhan] -> [End]

  -- Luong D: Duyet bao luu --
  [Nhan yeu cau bao luu] -> {Hop le?}
      Co -> [Duyet] -> [Cap nhat status = suspended] -> [End]
      Khong -> [Tu choi + ghi ly do] -> [End]

Pool: HE THONG FITFUEL+
  Nhan SP-01 SUCCESS -> Kiem tra idempotency (BR-38)
  -> Tao USERS (neu chua co) -> Tao GYM_MEMBERSHIPS
  -> Ghi MEMBERSHIP_HISTORY -> Tao INVOICES
  -> Gui SMS mat khau tam thoi -> Them 50 FitCoin (khi gia han)

Pool: PAYMENT GATEWAY (Actor phu)
  Nhan yeu cau -> Xu ly giao dich -> Gui callback ket qua
```

========================================================================

## 3.3.6 — Quy trình Transformation Journey Engine
*(Chọn nhóm cơ → Sinh lịch tập → Tập → Progressive Overload + Milestone)*

**1. Mô tả quy trình chi tiết**

**Luồng chính — Tập theo ngày (tối thiểu thao tác):**
Member mở /journey và chỉ cần **chọn nhóm cơ muốn tập hôm nay**
(Chân / Ngực / Lưng + Vai / Toàn thân / Tự chọn). Hệ thống lập tức **sinh ra 1 buổi tập
hoàn chỉnh** gồm danh sách bài tập, sets × reps mục tiêu và mức tạ đề xuất dựa trên
lịch sử tập của member (goal_type + level + hiệu suất buổi trước). Member xem kết quả
và có thể **chỉnh sửa tùy ý** (thêm bài, bỏ bài, đổi sets/reps) — đây là bước tùy chọn,
không bắt buộc. Nhấn **"Bắt đầu"** là vào ngay buổi tập.

Trong buổi tập, Member log từng set (reps thực tế + tạ thực tế). Khi bấm
**"Hoàn thành buổi tập"**, 3 engine chạy song song:
1. **Progressive Overload AI**: So sánh actual_reps với target 2 buổi gần nhất → gợi ý tăng/giữ tạ.
2. **AI Nutrition Suggestion**: Đọc 4 tín hiệu (nhóm cơ + goal + volume + lịch sử mua) → popup 3 gợi ý.
3. **Milestone Engine**: Kiểm tra 22 điều kiện → award FitCoin + XP → tạo MILESTONE_ACHIEVEMENTS.

Khi đạt **Milestone lớn** (M32: goal 100% hoặc M42: full program), hệ thống hiển thị
Celebration UX và mời tạo **Share Card** với logo gym + stats trước/sau. Member chia sẻ
lên mạng xã hội → viral loop tạo organic marketing cho gym.

**Gym Owner** có thể xem AI Care Queue để xử lý R7 (bỏ chương trình), R8 (hoàn thành
→ upsell), R9 (member stuck bài → gợi ý PT).

**2. Quy tắc nghiệp vụ**
- **BR-41:** Hệ thống lọc WORKOUT_PROGRAMS theo goal_type + level + days_per_week khi gợi ý.
- **BR-42:** Member chọn nhóm cơ (1 thao tác) → hệ thống generate ngay buổi tập hoàn chỉnh.
  Kết quả là gợi ý — member có thể dùng nguyên hoặc chỉnh sửa trước khi bắt đầu.
- **BR-43:** Progressive Overload: actual_reps >= target_max 2 lần liên tiếp → gợi ý +2.5kg.
- **BR-44:** Post-workout nutrition trigger với 4 tín hiệu (nhóm cơ + goal + volume + lịch sử mua).
- **BR-45:** R7/R8/R9 triggers trong AI Care Queue.
- **BR-46:** 22 milestone với FitCoin + XP reward; M32 và M42 kích hoạt Celebration MAX.

**3. Tình huống ngoại lệ**
- **Không có bài tập phù hợp cho nhóm cơ:** Nới rộng tiêu chí, hoặc gợi ý bài cơ bản nhất.
- **Member bỏ tập > 7 ngày:** R7 trigger → staff chăm sóc. Không tự động xóa dữ liệu.
- **Không có sản phẩm dinh dưỡng trong kho:** Popup nutrition không hiển thị; không lỗi.
- **Milestone đã nhận trước đó:** Không trao lại (hasEarned check trước khi award).

**4. Sơ đồ BPMN (mô tả văn bản)**

```
Pool: MEMBER
  -- Luong chinh: Tap theo ngay --
  [Mo /journey] -> [CHON NHOM CO HOM NAY]
    (Chan / Nguc / Lung + Vai / Toan than / Tu chon)
  -> [He thong sinh buoi tap hoan chinh]
  -> {Muon chinh sua? (tuy chon)}
      Co -> [Them / Bo / Sua bai tap] -> [Luu customization_log]
      Khong -> (tiep tuc)
  -> [Bam BAT DAU]
  -> [Log tung set: reps thuc te + ta thuc te]
  -> [Bam HOAN THANH BUOI TAP]
  -> [Xem goi y tang ta (overload suggestion)]
  -> [Xem popup goi y dinh duong] -> {Muon dat truoc?}
      Co -> [Tao NUTRITION_ORDERS pre-order] -> (tiep tuc)
      Khong -> (tiep tuc)
  -> {Co milestone moi?}
      Co -> {La Milestone lon (M32/M42)?}
              Co -> [Celebration UX] -> {Muon tao Share Card?}
                      Co -> [Generate Share Card] -> [Chia se len mang xa hoi] -> [End]
                      Khong -> [End]
              Khong -> [Notification nho] -> [End]
      Khong -> [End]

Pool: HE THONG FITFUEL+
  Nhan event "hoan thanh buoi tap"
  -> [FORK: Chay 3 engine song song]
      -> [Progressive Overload AI: ghi overload_suggestion]
      -> [Nutrition AI: chon 3 SP tu 4 tin hieu]
      -> [Milestone Engine: kiem tra 22 dieu kien, award FitCoin + XP]
  [JOIN] -> Cap nhat MEMBER_PROGRAMS.completion_pct
  -> {completion_pct = 100?}
      Co -> Chuyen status = 'completed' -> Tao R8 recommendation -> [End]
      Khong -> [End]

Pool: GYM OWNER
  [Vao care queue] -> [Xem R7 / R8 / R9]
  -> {Loai rec?}
      R7 -> [Goi dien check-in member bo tap] -> [Ghi ket qua] -> [End]
      R8 -> [Goi y buoi tap / CT tiep theo] -> [Ghi ket qua] -> [End]
      R9 -> [Goi y dat buoi PT cho member stuck] -> [Ghi ket qua] -> [End]
```

========================================================================
## PHÂN HỆ 2 — THƯƠNG MẠI NỘI BỘ
========================================================================

## 3.3.2 — Quy trình bán sản phẩm dinh dưỡng nội bộ
*(Nutrition — Bán tại quầy POS và Đặt trước sau buổi tập)*

**1. Mô tả quy trình chi tiết**

Phòng tập trực tiếp quản lý và bán các sản phẩm dinh dưỡng (protein shake, nước điện giải,
snack, meal combo) — **không có Vendor bên ngoài**. Quy trình có 2 luồng chính:

**Luồng A — Bán tại quầy (POS):**
Nhân viên mở màn hình POS, tìm kiếm Member (theo tên hoặc SĐT), chọn sản phẩm và số lượng.
Hệ thống kiểm tra tồn kho. Nhân viên xác nhận và tạo NUTRITION_ORDERS (order_type = 'pos_sale'),
thanh toán qua [SP-01]. Hệ thống cập nhật INVENTORY, tạo INVOICES, cộng XP cho Member nếu có.

**Luồng B — Đặt trước sau buổi tập (Pre-order):**
Khi Member kết thúc buổi tập, hệ thống hiển thị popup gợi ý 3 sản phẩm phù hợp với nhóm cơ
vừa tập (BR-15). Member chọn và đặt trước (NUTRITION_ORDERS, order_type = 'pre_order',
status = 'pending'). Nhân viên nhận thông báo, chuẩn bị và chuyển sang 'ready'.
Member đến lấy, nhân viên xác nhận và thanh toán qua [SP-01].

**Luồng C — Cảnh báo tồn kho (System):**
Hệ thống tự động kiểm tra INVENTORY sau mỗi giao dịch. Nếu tồn kho <= low_stock_threshold,
cảnh báo hiển thị trên dashboard Gym Owner.

**2. Quy tắc nghiệp vụ**
- **BR-12:** Chỉ Gym Owner / nhân viên được bán sản phẩm. Không có vendor ngoài.
- **BR-13:** Cập nhật tồn kho sau mỗi giao dịch, cảnh báo khi tồn kho thấp.
- **BR-14:** Combo phải có ít nhất 2 thành phần, giá combo < tổng giá lẻ.
- **BR-15:** Gợi ý 3 sản phẩm theo nhóm cơ. Nếu < 3 sản phẩm phù hợp: bổ sung sản phẩm bán chạy.
- **BR-30:** Tối đa 50% giá trị đơn được thanh toán bằng FitCoin.

**3. Tình huống ngoại lệ**
- **Sản phẩm hết hàng:** Hệ thống ẩn sản phẩm khỏi gợi ý, hiển thị thông báo "Hết hàng".
- **Đặt trước nhưng sản phẩm hết:** Nhân viên hủy pre-order, thông báo Member.
- **SP-01 FAILED:** Giữ nguyên INVENTORY, hủy đơn hàng.

**4. Sơ đồ BPMN (mô tả văn bản)**

```
Pool: GYM OWNER / NHAN VIEN
  -- Luong A: POS --
  [Start POS] -> [Tim kiem Member] -> [Chon san pham + so luong]
  -> {Ton kho du?}
      Khong -> [Thong bao het hang] -> [End]
      Co -> [Xac nhan don] -> [Thanh toan — goi SP-01]
        -> SUCCESS -> [Hoan tat ban hang] -> [End]

  -- Luong B: Xu ly Pre-order --
  [Nhan thong bao pre-order moi] -> [Chuan bi san pham]
  -> [Chuyen trang thai = ready] -> [Member den lay hang]
  -> [Xac nhan nhan hang] -> [Thanh toan — goi SP-01] -> SUCCESS -> [End]

Pool: MEMBER
  -- Luong B: Dat truoc --
  [Ket thuc buoi tap] -> [Xem popup goi y dinh duong] -> {Dat truoc?}
      Co -> [Chon san pham + xac nhan] -> [Cho san pham chuan bi]
        -> [Den lay hang] -> [End]
      Khong -> [End]

Pool: HE THONG FITFUEL+
  Nhan yeu cau ban hang -> Kiem tra ton kho -> Tao NUTRITION_ORDERS
  Nhan SP-01 SUCCESS -> Cap nhat INVENTORY -> Tao INVOICES
  -> {Ton kho <= nguong?} -> Co: [Tao canh bao ton kho cho Gym Owner]
  Nhan pre-order moi -> Gui thong bao cho nhan vien
```

========================================================================

## 3.3.7 — Quy trình Gear Marketplace
*(Guest mua hàng | Member thuê gear → Trả gear)*

**1. Mô tả quy trình chi tiết**

**Luồng A — Guest mua hàng:**
Khách vãng lai duyệt /gear hoặc /nutrition và chọn mua. Vì chưa có tài khoản, hệ thống
gọi **[SP-02 — Xác thực OTP Guest]**. Sau khi SP-02 trả SUCCESS (kèm session_token),
Guest tiếp tục chọn phương thức thanh toán và gọi **[SP-01 — Thanh toán]**.
INVOICES được tạo với user_id = NULL, guest_phone = SDT đã xác thực.
Hệ thống trừ tồn kho và xác nhận đơn.

**Luồng B — Member thuê gear:**
Member (đã đăng nhập) vào /gear, chọn gear is_for_rental = true, chọn ngày bắt đầu và
ngày trả (tối đa +7 ngày). Hệ thống tính tổng = deposit + rental_fee. Member thanh toán
qua [SP-01] → GEAR_RENTALS.status = 'active', qty_available giảm 1.
Nếu đến due_date chưa trả: daily cron đổi sang 'overdue', cộng late_fee 50,000 VND/ngày.

**Luồng C — Trả gear và xử lý đặt cọc:**
Member đến quầy trả gear. Staff kiểm tra tình trạng và ghi nhận:
(a) Nguyên vẹn → hoàn 100% cọc, status = 'returned'.
(b) Hư nhẹ → trừ 30% cọc.
(c) Hư nặng → trừ 100% cọc + tạo INVOICES bồi thường.
(d) Mất → trừ 100% cọc + INVOICES theo giá trị gear.
qty_available += 1 (nếu không mất).

**2. Quy tắc nghiệp vụ**
- **BR-47 & BR-48:** Xem chi tiết tại SP-02. Guest không được thuê gear.
- **BR-49:** Thuê gear chỉ dành cho Member; tối đa 7 ngày/lần, tối đa 3 gear cùng lúc.
- **BR-50:** Phí quá hạn 50,000 VND/ngày; quá 14 ngày → status 'lost', xử lý thủ công.
- **BR-51:** qty_available cập nhật realtime; cảnh báo khi <= 1.

**3. Tình huống ngoại lệ**
- **SP-02 BLOCKED hoặc FAILED:** Hệ thống dừng checkout, hiển thị lý do, cho phép thử lại.
- **Gear hết hàng khi đang thanh toán:** Thông báo hết hàng, rollback giỏ hàng.
- **Member trả quá hạn, không liên lạc được:** Gym Owner đổi status = 'lost' thủ công, tạo INVOICES.
- **Guest muốn thuê gear:** Hệ thống hiển thị "Chức năng thuê gear chỉ dành cho Hội viên"
  kèm link đăng ký membership.

**4. Sơ đồ BPMN (mô tả văn bản)**

```
Pool: GUEST
  [Duyet catalog gear/nutrition] -> [Chon san pham, them gio hang]
  -> [Checkout]
  -> [Goi SP-02: Xac thuc OTP Guest] -> {SP-02 ket qua?}
      BLOCKED / FAILED -> [Hien thi thong bao] -> [End]
      SUCCESS -> [Goi SP-01: Thanh toan] -> {SP-01 ket qua?}
          FAILED -> [Thong bao that bai] -> [End]
          SUCCESS -> [Hien thi xac nhan don hang] -> [End]

Pool: MEMBER
  -- Luong B: Thue gear --
  [Vao /gear] -> [Chon gear (is_for_rental=true)]
  -> [Chon ngay bat dau + ngay tra] -> [He thong tinh: deposit + rental_fee]
  -> [Xac nhan] -> [Goi SP-01: Thanh toan] -> {SP-01 ket qua?}
      FAILED -> [Huy] -> [End]
      SUCCESS -> [Ghi GEAR_RENTALS.status='active'] -> [qty_available -= 1]
             -> [Nhan xac nhan thue] -> [End]

Pool: HE THONG FITFUEL+
  Nhan SP-01 SUCCESS (ban gear) -> Tao INVOICES (gear_sale) -> Tru qty_available
  -> {qty_available <= 1?} -> Co: [Tao canh bao ton kho cho Gym Owner]
  [Daily cron 06:00 — quet GEAR_RENTALS] ->
    [Tim status='active' va due_date < TODAY]
    -> [Doi status = 'overdue', += 50k late_fee/ngay]
    -> [Tao NOTIFICATIONS cho Member va Gym Owner]
    -> {Qua han >= 14 ngay?} -> Co: [Doi status = 'lost'] -> [Thong bao Gym Owner]

Pool: GYM OWNER / STAFF
  [Member den quay tra gear]
  -> [Tim GEAR_RENTALS theo member + gear_id]
  -> [Kiem tra tinh trang gear]
  -> {Tinh trang?}
      Nguyen ven -> [Hoan 100% coc] -> [status='returned', qty+=1] -> [End]
      Hu nhe    -> [Tru 30% coc]  -> [status='returned', qty+=1] -> [End]
      Hu nang   -> [Tru 100% coc] -> [Tao INVOICES boi thuong]
                -> [status='returned', qty+=1] -> [End]
      Mat       -> [Tru 100% coc] -> [Tao INVOICES theo gia tri gear]
                -> [status='lost', qty KHONG tang] -> [End]
```

========================================================================
## PHÂN HỆ 3 — VẬN HÀNH
========================================================================

## 3.3.5 — Quy trình AI Retention & Care Queue
*(Nhân viên xử lý care queue — tương tác với hội viên cần chăm sóc)*

**Lưu ý phương pháp:** Luồng tạo recommendation tự động (cron 06:00) là thuật toán
chạy ngầm, KHÔNG có tương tác người dùng → trình bày bằng **System Flowchart** dưới đây.
Sơ đồ BPMN chỉ mô tả từ điểm nhân viên mở care queue (tương tác nghiệp vụ thực sự).

---

**SYSTEM FLOWCHART — Cron tạo Recommendation (06:00 hằng ngày)**

```
[CRON START 06:00]
    |
    v
[Lay danh sach USERS co GYM_MEMBERSHIPS.status = 'active']
    |
    v
[FOR EACH member] -----> [Het danh sach] --> [CRON END]
    |
    v
[Lay end_date, last_checkin, plan_id, purchase_history]
    |
    +-- [Rule 1: end_date <= 7 ngay?] -------> Co: type='renew_reminder', priority=HIGH
    +-- [Rule 2: chua check-in >= 14 ngay?] -> Co: type='inactive_alert',  priority=MEDIUM
    +-- [Rule 3: end_date qua 1-3 ngay?] ----> Co: type='renew_reminder', priority=HIGH
    +-- [Rule 4: end_date qua > 3 ngay?] ----> Co: type='renew_reminder', priority=HIGH
    +-- [Rule 5: check-in >= 4/tuan + Goi Thang?]  -> Co: type='upsell_plan', priority=MEDIUM
    +-- [Rule 6: mua nutrition >= 3 lan/tuan?] ---> Co: type='upsell_nutrition', priority=LOW
    |
    v
[Voi moi recommendation can tao:
 Da co ban ghi pending trong 7 ngay gan nhat?]
    Co -------> [Bo qua, khong tao trung lap]
    Khong ----> [INSERT RECOMMENDATIONS (member_id, type, priority, status='pending')]
```

---

**1. Mô tả quy trình BPMN chi tiết (bắt đầu từ Luồng B)**

**Luồng B — Nhân viên xử lý Care Queue:**
Gym Owner / nhân viên truy cập /gym-owner/care-queue. Hệ thống hiển thị danh sách Member
cần chăm sóc, sắp xếp theo priority (HIGH trước). Mỗi dòng: tên Member, lý do, gợi ý
hành động cụ thể. Nhân viên thực hiện hành động (gọi điện, nhắn tin, mời đến quầy)
và nhấn **[Ghi nhận kết quả]**. Hệ thống lưu MEMBER_CARE_LOGS,
RECOMMENDATIONS.status = 'handled', resolved_at = NOW().

**Luồng C — Member tự xử lý (passive):**
Member nhận SMS/in-app notification nhắc gia hạn. Nếu tự gia hạn online → hệ thống tự động
đóng recommendation liên quan. Nhân viên không cần gọi thêm.

**2. Quy tắc nghiệp vụ**
- **BR-35:** 6 rule tạo recommendation, không tạo trùng trong 7 ngày (xem System Flowchart).
- **BR-36:** Nhân viên phải ghi nhận kết quả sau khi xử lý (handled/dismissed).
- **BR-10:** Gói <= 7 ngày → HIGH priority. <= 3 ngày → SMS tự động.
- **BR-11:** Chưa check-in >= 14 ngày → MEDIUM priority.

**3. Tình huống ngoại lệ**
- **Member không liên lạc được:** Ghi result = 'unreachable'. Hệ thống tạo lại sau 3 ngày.
- **Member đã tự gia hạn online:** Recommendation tự động đóng khi phát hiện GYM_MEMBERSHIPS
  được gia hạn.

**4. Sơ đồ BPMN (mô tả văn bản)**

```
Pool: GYM OWNER / NHAN VIEN
  [Vao /gym-owner/care-queue]
  -> [Xem danh sach uu tien cao truoc (HIGH -> MEDIUM -> LOW)]
  -> [Chon 1 recommendation can xu ly]
  -> [Doc thong tin: ten member, ly do, goi y hanh dong]
  -> [Thuc hien hanh dong: goi dien / nhan tin / moi den quay]
  -> [Bam Ghi nhan ket qua]
  -> [Nhap: hanh dong da lam, ket qua (renewed/declined/unreachable/other), ghi chu]
  -> [Luu MEMBER_CARE_LOGS] -> [RECOMMENDATIONS.status = 'handled'] -> [End]

Pool: MEMBER (Passive)
  [Nhan SMS / in-app: nhac gia han hoac canh bao khong hoat dong]
  -> {Tu xu ly?}
      Co -> [Gia han / check-in] -> [Recommendation tu dong dong] -> [End]
      Khong -> [Cho nhan vien lien he]

Pool: HE THONG FITFUEL+
  Nhan su kien gia han -> Tim RECOMMENDATIONS pending cua member
  -> Chuyen status = 'handled' (tu dong, khong can nhan vien)
  Nhan su kien check-in -> Cap nhat last_checkin
  -> {Co 'inactive_alert' pending?} -> Co: Chuyen status = 'handled'
```

========================================================================
KẾT THÚC FILE 14
========================================================================
