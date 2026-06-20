# 14. MÔ HÌNH QUY TRÌNH NGHIỆP VỤ (BPMN)

> Dự án: FitFuel+
> Môn học: Web Kinh Doanh
> Ngày: 18/06/2026

========================================================================

## TỔNG QUAN CẤU TRÚC

Tài liệu gồm **7 quy trình nghiệp vụ** nhóm thành 3 phân hệ, và **2 sub-process dùng chung**
được tái sử dụng bởi nhiều quy trình.

Phân hệ                    | Quy trình
---------------------------|------------------------------------------------------------
Sub-processes dùng chung   | SP-01 Thanh toán, SP-02 Xác thực OTP Guest
Phân hệ 1 — Hội viên       | 3.3.1 Check-in & Gym Tracking, 3.3.4 Membership Lifecycle, 3.3.6 Transformation Journey
Phân hệ 2 — Thương mại     | 3.3.2 Dinh dưỡng nội bộ, 3.3.3 Delivery (NEW), 3.3.7 Gear Marketplace
Phân hệ 3 — Vận hành       | 3.3.5 AI Retention & Care Queue

========================================================================
## SUB-PROCESSES DÙNG CHUNG
========================================================================

### SP-01 — Xử lý Thanh toán (có hỗ trợ FitCoin)
1. Mô tả quy trình chi tiết
Quy trình bắt đầu khi hệ thống phát sinh yêu cầu thanh toán cho một đơn hàng hoặc dịch vụ. Hệ thống tự động kiểm tra trạng thái đăng nhập của người dùng. Nếu là Hội viên (Member) và có số dư FitCoin, hệ thống hiển thị số dư hiện tại cùng mức giảm giá tối đa có thể áp dụng. Hội viên có quyền quyết định sử dụng FitCoin hoặc không. Khi Hội viên nhập số lượng FitCoin muốn dùng, hệ thống xác thực dữ liệu để đảm bảo giá trị quy đổi không vượt quá 50% tổng đơn hàng. Sau đó, số FitCoin này sẽ được tạm khóa trong cơ sở dữ liệu và hệ thống tính toán lại số tiền còn lại phải thanh toán.
Tiếp theo, đối với phần tiền còn lại, người dùng lựa chọn phương thức thanh toán như VNPay, MoMo hoặc tiền mặt. Đối với thanh toán trực tuyến, hệ thống chuyển hướng người dùng sang Cổng thanh toán (Payment Gateway) và chờ phản hồi (webhook callback). Nếu giao dịch thành công, hệ thống kiểm tra tính toàn vẹn (idempotency), cập nhật trạng thái hóa đơn thành "Đã thanh toán", ghi nhận số FitCoin đã dùng và xác nhận trừ FitCoin vĩnh viễn. Trong trường hợp thanh toán thất bại, hệ thống tự động hoàn trả số FitCoin đã tạm khóa và thông báo lỗi cho người dùng. Đối với thanh toán tiền mặt tại quầy, quy trình hoàn tất khi nhân viên xác nhận đã thu đủ tiền.

2. Quy tắc nghiệp vụ (Business Rules)
BR-30: FitCoin chỉ được áp dụng cho Hội viên đã đăng nhập và giá trị quy đổi không được vượt quá 50% tổng giá trị đơn hàng.
BR-38: Hệ thống phải kiểm tra tính độc nhất của giao dịch (idempotency) từ webhook để tránh tình trạng cập nhật hóa đơn nhiều lần cho cùng một giao dịch.

3. Tình huống ngoại lệ (Exception Handling)
Trong trường hợp thanh toán qua cổng trực tuyến bị lỗi hoặc người dùng hủy giao dịch giữa chừng, hệ thống sẽ tự động mở khóa toàn bộ số FitCoin đã tạm giữ để Hội viên có thể sử dụng cho các lần sau.
Nếu hệ thống không nhận được webhook callback từ Cổng thanh toán do lỗi mạng, quy trình sẽ chuyển sang trạng thái chờ và nhân viên có thể kiểm tra đối soát thủ công trên hệ thống quản trị để cập nhật trạng thái hóa đơn.

4. Sơ đồ BPMN (mô tả văn bản)

```
Pool: MEMBER / GUEST / STAFF (người khởi tạo)

  -- Buoc 1: Ap dung FitCoin (chi danh cho Member) --
  {user_id != NULL va co FitCoin?}
      Khong (Guest hoac khong co FitCoin) -> bo qua, remaining = amount
      Co -> [Hien thi: So du FitCoin hien tai]
         -> [Hien thi: Co the giam toi da X dong (BR-30: <= 50% don hang)]
         -> {Member muon ap dung FitCoin?}
               Khong -> remaining = amount
               Co -> [Member nhap so FitCoin muon dung]
                  -> [He thong validate: so FitCoin * don_gia <= 50% amount (BR-30)]
                  -> [Tru FitCoin khoi USERS.fitcoin_balance (tam khoa)]
                  -> remaining = amount - (fitcoin_used * don_gia_fitcoin)

  -- Buoc 2: Thanh toan phan con lai --
  {remaining > 0?}
      Co -> [Chon phuong thuc: VNPay / MoMo / Tien mat]
         -- Online (VNPay / MoMo): --
         -> [Redirect sang Payment Gateway] -> [Cho webhook callback]
         -> {Callback thanh cong?}
               That bai -> [HOAN TRA FitCoin da khoa] -> [Return: FAILED]
               Thanh cong -> (tiep tuc)
         -- Tien mat (tai quay): --
         -> [Nhan vien xac nhan thu tien] -> (tiep tuc)
      Khong (FitCoin cover 100% — khong the xay ra vi BR-30 gioi han 50%)
         -> (tiep tuc)
  -> [XAC NHAN tru FitCoin vinh vien] -> [Return: SUCCESS]

Pool: HE THONG FITFUEL+
  Nhan Return SUCCESS -> Kiem tra idempotency (BR-38)
  -> Tao / cap nhat INVOICES.status = 'paid'
  -> Ghi INVOICES.fitcoin_used = so FitCoin da dung
  -> [End]

  Nhan Return FAILED -> Hoan tra FitCoin da tam khoa -> [End]

Pool: PAYMENT GATEWAY (Actor phu — online only)
  Nhan yeu cau -> Xu ly giao dich -> Gui callback ket qua
```

### SP-02 — Xác thực OTP Guest (khách vãng lai)
1. Mô tả quy trình chi tiết
Quy trình xác thực bắt đầu khi Khách vãng lai (Guest) nhập số điện thoại để sử dụng các dịch vụ yêu cầu định danh cơ bản như mua hàng. Đầu tiên, hệ thống kiểm tra số lần yêu cầu OTP trong ngày của số điện thoại này. Nếu chưa vượt quá giới hạn cho phép, hệ thống sinh ra một mã OTP gồm 6 chữ số và gửi qua cổng tin nhắn SMS, đồng thời chuyển người dùng sang giao diện nhập mã xác thực.
Người dùng tiến hành nhập mã OTP nhận được. Hệ thống đối chiếu mã này với cơ sở dữ liệu. Nếu mã OTP chính xác và còn trong thời gian hiệu lực, hệ thống xác nhận thành công và tự động tạo một phiên làm việc (Session Token) tạm thời, cho phép Guest tiếp tục các thao tác tiếp theo. Nếu người dùng nhập sai, hệ thống cho phép thử lại tối đa 3 lần.

2. Quy tắc nghiệp vụ (Business Rules)
BR-47: Mỗi số điện thoại chỉ được yêu cầu gửi mã OTP tối đa 3 lần trong một ngày nhằm ngăn chặn hành vi spam.
BR-48: Mã OTP có hiệu lực trong vòng 10 phút kể từ khi khởi tạo, và Session Token sau khi xác thực thành công sẽ có thời hạn sử dụng trong 2 giờ.

3. Tình huống ngoại lệ (Exception Handling)
Nếu người dùng nhập sai OTP vượt quá 3 lần cho phép, hệ thống sẽ tạm khóa chức năng xác thực của số điện thoại đó và yêu cầu thử lại sau.
Trong trường hợp Guest yêu cầu OTP nhưng đã vượt quá giới hạn số lần gửi SMS trong ngày, hệ thống sẽ từ chối gửi mã và hiển thị thông báo yêu cầu quay lại vào ngày hôm sau hoặc liên hệ nhân viên hỗ trợ.

4. Sơ đồ BPMN (mô tả văn bản)

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

3.3. MÔ HÌNH QUY TRÌNH NGHIỆP VỤ BPMN
### 3.3.1 — Quy trình quản lý và đánh giá tiến độ tập luyện (Quy trình Gym Tracking và Gamification)
1. Mô tả quy trình chi tiết
Quy trình bắt đầu khi Hội viên (Member) truy cập ứng dụng và chọn chức năng “Tạo buổi tập mới”. Hệ thống tự động phân tích lịch sử tập luyện trong 7 ngày gần nhất nhằm đề xuất nhóm cơ phù hợp cho buổi tập hiện tại. Sau đó, Member nhập các thông tin cơ bản gồm ngày tập, nhóm cơ mục tiêu và ghi chú tùy chọn.
Sau khi xác nhận, hệ thống khởi tạo Workout Session với trạng thái “Active” và chuyển người dùng sang giao diện ghi nhận bài tập. Trong quá trình tập luyện, Member lựa chọn bài tập từ thư viện dữ liệu theo từng nhóm cơ và tiến hành nhập thông tin cho từng Set tập luyện gồm số lần lặp (Reps) và mức tạ (Weight).
Sau mỗi lần ghi nhận Set, hệ thống tự động thực hiện quy trình đánh giá thành tích tập luyện. Dữ liệu được kiểm tra nhằm phát hiện các giá trị bất thường trước khi đối chiếu với lịch sử tập luyện trước đó của Member. Nếu thành tích mới vượt qua kỷ lục cũ của bài tập tương ứng, hệ thống xác nhận Personal Record (PR), cộng thêm XP thưởng và hiển thị hiệu ứng chúc mừng ngay trên giao diện.
Member có thể tiếp tục thêm Set mới hoặc chuyển sang bài tập khác cho đến khi hoàn tất Workout Session. Khi người dùng chọn “Kết thúc buổi tập”, hệ thống tiến hành tổng hợp toàn bộ dữ liệu tập luyện, tính toán XP của Session, cập nhật chuỗi Streak hằng ngày và kiểm tra các mốc thành tựu đã đạt được.
Sau cùng, hệ thống kích hoạt quy trình AI Recommendation nhằm đề xuất các suất ăn dinh dưỡng phù hợp với nhu cầu phục hồi sau tập luyện. Workout Session được chuyển sang trạng thái “Done” và lưu vào Fitness Passport của Member.

2. Quy tắc nghiệp vụ (Business Rules)
BR-31: Kỷ lục cá nhân (Personal Record) được tính độc lập cho từng bài tập dựa trên công thức: PR = max(weight × reps)
Nếu Set mới vượt giá trị PR hiện tại, hệ thống ghi nhận thành tích mới và kích hoạt thưởng thành tích tương ứng.
BR-18: Member nhận XP dựa trên tổng khối lượng tập luyện, mức độ hoàn thành Session và thành tích PR đạt được trong buổi tập.
BR-20 & BR-21: Streak tăng khi Member có ít nhất một hoạt động hợp lệ trong ngày như hoàn thành Workout Session hoặc phát sinh đơn hàng dinh dưỡng thành công. Nếu không ghi nhận hoạt động liên tiếp trong 2 ngày, hệ thống tự động reset Streak về 0.
BR-22: Khi đạt các mốc Streak như 7 ngày, 30 ngày hoặc 100 ngày, hệ thống tự động mở khóa Badge, thưởng FitCoin và cập nhật hồ sơ thành tích cá nhân.
BR-32: Hệ thống ưu tiên đề xuất nhóm cơ có tần suất tập thấp nhất trong 7 ngày gần nhất. Nếu nhiều nhóm cơ có cùng tần suất, hệ thống ưu tiên nhóm cơ có thời gian nghỉ lâu hơn.
BR-33: Workout Session chỉ được phép chỉnh sửa hoặc xóa trong vòng 24 giờ kể từ khi hoàn tất. Sau thời gian này, dữ liệu bị khóa vĩnh viễn nhằm đảm bảo tính toàn vẹn của Fitness Passport.

3. Tình huống ngoại lệ (Exception Handling)
Trong trường hợp Member nhập dữ liệu vượt ngưỡng hợp lý, hệ thống sẽ hiển thị cảnh báo xác nhận trước khi cho phép lưu dữ liệu. Các dữ liệu bất thường vẫn được lưu vào lịch sử tập luyện nhưng sẽ bị loại khỏi thuật toán tính PR nhằm tránh sai lệch thành tích cá nhân.
Nếu xảy ra mất kết nối mạng trong lúc ghi nhận Workout Session, hệ thống sẽ tạm thời bảo toàn tiến trình tập luyện và tự động đồng bộ dữ liệu khi kết nối được khôi phục. Điều này giúp Member không bị mất dữ liệu giữa chừng.
Trong trường hợp phiên đăng nhập hết hạn khi đang tập luyện, dữ liệu của Workout Session vẫn được duy trì. Sau khi đăng nhập lại, Member có thể tiếp tục Session trước đó mà không cần nhập lại dữ liệu.

4. Sơ đồ BPMN (mô tả văn bản)

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

### 3.3.4 — Quy trình vòng đời hội viên (Membership Lifecycle)
1. Mô tả quy trình chi tiết
Quy trình quản lý vòng đời hội viên bao gồm các hoạt động đăng ký mới, gia hạn, chuyển đổi gói tập và bảo lưu. Đối với luồng đăng ký trực tuyến, khách hàng truy cập hệ thống, lựa chọn Gói Tháng hoặc Gói Năm, nhập số điện thoại và tiến hành thanh toán. Sau khi giao dịch thành công, hệ thống tự động khởi tạo tài khoản Member, kích hoạt gói tập, lưu trữ lịch sử đăng ký và gửi mật khẩu tạm thời qua SMS. Trong trường hợp đăng ký tại quầy, nhân viên thao tác trên hệ thống POS để sinh mã QR thanh toán, khách hàng quét mã và khi hệ thống nhận được phản hồi thanh toán, quy trình kích hoạt tài khoản diễn ra tương tự.
Khi Hội viên có nhu cầu gia hạn, họ thao tác trên hệ thống để chọn gói và thanh toán. Hệ thống sẽ tính toán ngày hết hạn mới bằng cách cộng dồn thời gian vào ngày hết hạn hiện tại (nếu gói còn hiệu lực) hoặc tính từ thời điểm hiện tại (nếu gói đã hết hạn), đồng thời thưởng thêm FitCoin để tri contemplation ân.
Nếu Hội viên đang sử dụng Gói Tháng và muốn nâng cấp sang Gói Năm, hệ thống tự động tính toán khoản phí chênh lệch dựa trên số ngày chưa sử dụng của Gói Tháng. Sau khi Hội viên thanh toán khoản phí này, hệ thống cập nhật gói tập mới.
Trong trường hợp Hội viên cần tạm ngưng tập luyện, họ gửi yêu cầu bảo lưu qua hệ thống. Quản lý phòng tập (Gym Owner) sẽ xem xét và phê duyệt. Nếu được duyệt, trạng thái gói tập sẽ chuyển sang "Tạm ngưng". Khi Hội viên quay lại kích hoạt, hệ thống sẽ cộng bù số ngày đã bảo lưu vào ngày hết hạn của gói tập.

2. Quy tắc nghiệp vụ (Business Rules)
BR-05 & BR-06: Mỗi lần gia hạn hoặc chuyển gói, hệ thống phải tạo một bản ghi mới trong lịch sử hội viên thay vì ghi đè lên dữ liệu cũ.
BR-07: Phí chuyển từ Gói Tháng sang Gói Năm được tính bằng cách lấy chênh lệch giá hai gói chia cho 30 ngày, sau đó nhân với số ngày còn lại của Gói Tháng.
BR-08: Hội viên chỉ được phép bảo lưu tối đa 1 lần trong năm, thời gian bảo lưu không quá 60 ngày và bắt buộc phải có sự phê duyệt từ Quản lý.
BR-10: Khi gói tập của Hội viên còn dưới 7 ngày, hệ thống tự động đưa vào danh sách chăm sóc (Care Queue) để nhân viên liên hệ nhắc nhở.
BR-30: Mỗi lần gia hạn thành công, Hội viên được thưởng thêm 50 FitCoin vào tài khoản.

3. Tình huống ngoại lệ (Exception Handling)
Trong quá trình chuyển đổi gói tập, nếu thời gian còn lại của Gói Tháng dưới 3 ngày, hệ thống sẽ hiển thị cảnh báo và gợi ý Hội viên nên đợi hết hạn để đăng ký gói mới thay vì đóng phí chuyển đổi nhằm tối ưu chi phí.
Nếu quá trình thanh toán gia hạn bị lỗi do sự cố mạng, giao dịch sẽ bị hủy, gói tập giữ nguyên trạng thái cũ và người dùng có thể thực hiện lại thao tác sau.
Trong trường hợp hệ thống không nhận được thông báo phản hồi từ ngân hàng (webhook) khi khách hàng thanh toán tại quầy, nhân viên có quyền xác nhận giao dịch thủ công trên hệ thống sau khi đã kiểm tra biến động số dư thực tế.

4. Sơ đồ BPMN (mô tả văn bản)

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

### 3.3.6 — Quy trình Transformation Journey Engine
1. Mô tả quy trình chi tiết
Quy trình bắt đầu khi Hội viên truy cập tính năng Journey và lựa chọn nhóm cơ muốn tập luyện trong ngày (Chân, Ngực, Lưng - Vai, hoặc Toàn thân). Ngay lập tức, hệ thống kích hoạt engine AI để tự động tạo ra một buổi tập hoàn chỉnh bao gồm danh sách các bài tập, số lượt (Sets/Reps) và mức tạ đề xuất dựa trên mục tiêu, trình độ và lịch sử tập luyện gần nhất của Hội viên. Hội viên có thể xem trước và tùy chỉnh lại chương trình như thêm, bớt bài tập hoặc thay đổi mức tạ trước khi bấm nút "Bắt đầu".
Trong suốt buổi tập, Hội viên ghi nhận kết quả thực tế cho từng Set. Khi chọn "Hoàn thành buổi tập", hệ thống đồng thời kích hoạt ba tiến trình xử lý ngầm. Tiến trình thứ nhất phân tích cường độ tập luyện để đưa ra gợi ý tăng hoặc giữ nguyên mức tạ cho buổi sau theo nguyên tắc Progressive Overload. Tiến trình thứ hai thu thập các tín hiệu về nhóm cơ và mục tiêu để đề xuất ngay 3 sản phẩm dinh dưỡng phù hợp phục vụ việc phục hồi. Tiến trình thứ ba kiểm tra toàn bộ dữ liệu để xét duyệt các cột mốc thành tựu (Milestone).
Nếu Hội viên đạt được các cột mốc quan trọng như hoàn thành 100% chương trình, hệ thống sẽ hiển thị giao diện chúc mừng rực rỡ và cung cấp tính năng tạo Share Card chứa hình ảnh trước/sau và chỉ số cá nhân. Hội viên có thể chia sẻ thẻ này lên mạng xã hội. Đối với phía vận hành, dữ liệu từ tiến trình này cũng giúp Quản lý nhận diện các Hội viên đang bị chững lại hoặc bỏ tập để kịp thời chăm sóc.

2. Quy tắc nghiệp vụ (Business Rules)
BR-41: Hệ thống tự động lọc thư viện bài tập dựa trên mục tiêu, trình độ và số buổi tập trong tuần của Hội viên để đưa ra gợi ý chính xác.
BR-43: Theo nguyên lý Progressive Overload, nếu Hội viên đạt hoặc vượt số Reps mục tiêu trong 2 buổi liên tiếp đối với cùng một bài tập, hệ thống sẽ tự động gợi ý tăng thêm 2.5kg cho lần tập kế tiếp.
BR-44: Hệ thống gợi ý dinh dưỡng dựa trên 4 yếu tố: nhóm cơ vừa tập, mục tiêu cá nhân, cường độ (Volume) và lịch sử mua hàng trước đó.
BR-46: Hệ thống thiết lập 22 cột mốc thành tựu tương ứng với phần thưởng FitCoin và XP. Các cột mốc lớn (M32, M42) sẽ kích hoạt hiệu ứng chúc mừng đặc biệt.

3. Tình huống ngoại lệ (Exception Handling)
Nếu hệ thống không tìm thấy bài tập nào khớp hoàn toàn với tiêu chí cá nhân của Hội viên, AI sẽ tự động nới lỏng điều kiện và đề xuất các bài tập cơ bản nhất thuộc nhóm cơ đó để đảm bảo buổi tập không bị gián đoạn.
Trong trường hợp Hội viên đạt một cột mốc nhưng đã từng nhận thưởng cho cột mốc đó trước đây, hệ thống chỉ hiển thị thông báo chúc mừng mà không cộng thêm phần thưởng để tránh gian lận.
Nếu kho hàng không còn sản phẩm dinh dưỡng nào phù hợp với nhóm cơ vừa tập, hệ thống sẽ tự động bỏ qua tiến trình gợi ý dinh dưỡng mà không báo lỗi, cho phép quy trình kết thúc bình thường.

4. Sơ đồ BPMN (mô tả văn bản)

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

### 3.3.2 — Quy trình bán sản phẩm dinh dưỡng nội bộ
1. Mô tả quy trình chi tiết
Quy trình bán hàng dinh dưỡng do phòng tập trực tiếp vận hành được chia thành hai luồng chính. Đối với hình thức bán tại quầy, nhân viên mở hệ thống POS, tìm kiếm thông tin Hội viên theo tên hoặc số điện thoại, sau đó chọn sản phẩm và số lượng tương ứng. Hệ thống tự động kiểm tra số lượng tồn kho theo thời gian thực. Nếu hàng hóa đáp ứng đủ, nhân viên xác nhận đơn hàng và tiến hành quy trình thanh toán. Sau khi thanh toán thành công, hệ thống trừ tồn kho, khởi tạo hóa đơn và cộng điểm kinh nghiệm (XP) cho Hội viên.
Đối với hình thức đặt trước (Pre-order), ngay sau khi Hội viên hoàn thành buổi tập trên ứng dụng, hệ thống hiển thị một khung gợi ý gồm các sản phẩm dinh dưỡng tối ưu cho quá trình phục hồi cơ bắp. Hội viên tiến hành chọn món và xác nhận đặt trước. Thông báo ngay lập tức được gửi đến màn hình của nhân viên pha chế tại quầy. Nhân viên tiến hành chuẩn bị sản phẩm và cập nhật trạng thái đơn hàng thành "Sẵn sàng". Khi Hội viên ra quầy lấy hàng, nhân viên xác nhận bàn giao và thực hiện thanh toán để hoàn tất quy trình.
Song song với các hoạt động trên, hệ thống luôn chạy ngầm một trình giám sát kho hàng. Bất cứ khi nào giao dịch hoàn tất, hệ thống sẽ kiểm tra mức tồn kho; nếu số lượng giảm xuống dưới ngưỡng an toàn, một cảnh báo sẽ được đẩy lên bảng điều khiển của Quản lý để kịp thời nhập hàng.

2. Quy tắc nghiệp vụ (Business Rules)
BR-12: Toàn bộ sản phẩm dinh dưỡng được bán và quản lý trực tiếp bởi phòng tập, không có sự tham gia của đối tác cung cấp bên ngoài (Vendor).
BR-14: Đối với các Combo dinh dưỡng, hệ thống bắt buộc phải có ít nhất 2 sản phẩm thành phần và tổng giá bán của Combo phải luôn thấp hơn tổng giá bán lẻ của các thành phần cộng lại.
BR-15: Hệ thống luôn ưu tiên gợi ý 3 sản phẩm phù hợp nhất với nhóm cơ vừa tập. Nếu không đủ 3 sản phẩm khớp tiêu chí, hệ thống sẽ tự động lấy thêm các sản phẩm bán chạy nhất để lấp đầy danh sách gợi ý.
BR-30: Hội viên được phép sử dụng FitCoin để thanh toán tối đa 50% giá trị đơn hàng dinh dưỡng.

3. Tình huống ngoại lệ (Exception Handling)
Nếu sản phẩm Hội viên muốn đặt trước đã hết hàng trong kho, hệ thống sẽ tự động ẩn sản phẩm đó khỏi danh sách gợi ý trên ứng dụng và hiển thị nhãn "Hết hàng".
Trường hợp Hội viên đã đặt trước nhưng sản phẩm thực tế tại quầy bị lỗi hoặc không đủ, nhân viên sẽ tiến hành hủy đơn hàng trên hệ thống và trực tiếp xin lỗi, đề xuất sản phẩm thay thế khi Hội viên đến nhận.
Nếu quá trình thanh toán tại quầy gặp sự cố hoặc thất bại, hệ thống sẽ tự động hủy đơn, giữ nguyên số lượng tồn kho và không ghi nhận hóa đơn.

4. Sơ đồ BPMN (mô tả văn bản)

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

### 3.3.7 — Quy trình Gear Marketplace
1. Mô tả quy trình chi tiết
Quy trình mua bán và cho thuê dụng cụ tập luyện (Gear) được thiết kế riêng biệt cho Khách vãng lai và Hội viên. Khi Khách vãng lai muốn mua sản phẩm, họ chọn hàng và tiến hành thanh toán. Do chưa có tài khoản, hệ thống sẽ kích hoạt quy trình Xác thực OTP để lấy số điện thoại định danh. Sau khi xác thực thành công, hệ thống tạo hóa đơn mua hàng gắn với số điện thoại này, cập nhật số lượng tồn kho và hoàn tất giao dịch bán đứt.
Đối với dịch vụ cho thuê dụng cụ, tính năng này chỉ mở dành riêng cho Hội viên. Hội viên truy cập vào danh mục sản phẩm cho thuê, chọn dụng cụ và nhập khoảng thời gian mượn (tối đa 7 ngày). Hệ thống tự động tính toán tổng chi phí bao gồm tiền đặt cọc và phí thuê theo ngày. Sau khi Hội viên thanh toán thành công, trạng thái dụng cụ chuyển sang "Đang cho thuê" và tồn kho giảm đi tương ứng. Nếu quá thời hạn mà Hội viên chưa trả đồ, hệ thống chạy tự động mỗi ngày sẽ chuyển trạng thái sang "Quá hạn" và cộng dồn phí phạt nộp trễ vào hệ thống.
Khi Hội viên mang dụng cụ đến quầy hoàn trả, nhân viên sẽ tiếp nhận và kiểm tra tình trạng vật lý của sản phẩm. Dựa trên mức độ nguyên vẹn, hư hỏng nhẹ, hư hỏng nặng hoặc mất mát, nhân viên chọn phương án tương ứng trên hệ thống. Hệ thống sẽ tự động tính toán số tiền cọc được hoàn lại, tạo hóa đơn bồi thường nếu cần thiết, và cập nhật lại trạng thái cũng như số lượng tồn kho của dụng cụ.

2. Quy tắc nghiệp vụ (Business Rules)
BR-47 & BR-48: Khách vãng lai bắt buộc phải xác thực số điện thoại qua OTP trước khi mua hàng, và chức năng thuê dụng cụ bị khóa hoàn toàn đối với nhóm đối tượng này.
BR-49: Hội viên chỉ được phép thuê dụng cụ tối đa 7 ngày cho mỗi lần giao dịch và không được thuê quá 3 dụng cụ cùng một thời điểm.
BR-50: Nếu trả dụng cụ trễ hạn, Hội viên sẽ bị tính phí phạt 50.000 VNĐ cho mỗi ngày. Nếu quá hạn 14 ngày, hệ thống đánh dấu dụng cụ là "Bị mất" và yêu cầu nhân viên xử lý thủ công.
BR-51: Số lượng dụng cụ sẵn sàng cho mượn phải được cập nhật theo thời gian thực; nếu số lượng giảm xuống mức 1, hệ thống sẽ phát cảnh báo.

3. Tình huống ngoại lệ (Exception Handling)
Trong lúc Khách vãng lai thực hiện xác thực OTP, nếu số lần thử vượt quá quy định, hệ thống sẽ chặn tiến trình thanh toán, giữ nguyên giỏ hàng và yêu cầu liên hệ hỗ trợ.
Nếu một dụng cụ được Hội viên chọn thuê nhưng lại bị người khác đặt mua/thuê thành công ngay trước đó (hết hàng tại thời điểm thanh toán), hệ thống sẽ thông báo lỗi hết hàng và yêu cầu Hội viên cập nhật lại giỏ hàng.
Trường hợp Hội viên làm mất dụng cụ hoặc quá hạn trả quá lâu không liên lạc được, Quản lý sẽ can thiệp đổi trạng thái dụng cụ thành "Bị mất" trên hệ thống và tự động tạo một hóa đơn yêu cầu bồi thường 100% giá trị sản phẩm.

4. Sơ đồ BPMN (mô tả văn bản)

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

### 3.3.5 — Quy trình AI Retention & Care Queue
1. Mô tả quy trình chi tiết
Quy trình chăm sóc và giữ chân Hội viên là sự kết hợp giữa thuật toán tự động và thao tác vận hành của nhân viên. Vào lúc 06:00 sáng mỗi ngày, hệ thống chạy ngầm một thuật toán rà soát toàn bộ danh sách Hội viên đang có gói tập kích hoạt. Hệ thống đánh giá dựa trên ngày hết hạn, tần suất check-in và lịch sử mua hàng để tự động sinh ra các chỉ thị chăm sóc (Recommendation). Ví dụ, nếu gói tập sắp hết hạn trong 7 ngày hoặc Hội viên vắng mặt trên 14 ngày, hệ thống sẽ tạo một yêu cầu chăm sóc với mức độ ưu tiên Cao (High) hoặc Trung bình (Medium) nhằm nhắc nhở gia hạn hoặc hỏi thăm tình hình. Các chỉ thị này được lưu vào cơ sở dữ liệu và phân bổ vào hàng đợi chăm sóc (Care Queue).
Tiếp nối tiến trình tự động, Quản lý hoặc nhân viên đăng nhập vào giao diện Care Queue. Hệ thống hiển thị danh sách công việc cần xử lý được sắp xếp nghiêm ngặt theo mức độ ưu tiên từ cao xuống thấp. Khi chọn một Hội viên, nhân viên có thể xem được lý do cần chăm sóc cùng các kịch bản hành động được gợi ý sẵn. Nhân viên tiến hành gọi điện, nhắn tin hoặc trao đổi trực tiếp với Hội viên. Sau khi hoàn tất, nhân viên bắt buộc phải bấm "Ghi nhận kết quả" và nhập nội dung tương tác (ví dụ: đã gia hạn, từ chối, không nghe máy). Hệ thống sẽ lưu lại nhật ký chăm sóc và chuyển trạng thái của chỉ thị sang "Đã xử lý".
Bên cạnh đó, quy trình cũng hỗ trợ luồng xử lý tự động từ phía Hội viên. Nếu Hội viên nhận được tin nhắn nhắc nhở và tự động gia hạn qua ứng dụng trực tuyến, hoặc tự động đi tập lại, hệ thống sẽ nhận diện sự thay đổi trạng thái này và tự động đóng các chỉ thị chăm sóc liên quan mà không cần nhân viên phải thao tác.

2. Quy tắc nghiệp vụ (Business Rules)
BR-35: Hệ thống có 6 quy tắc đánh giá để sinh chỉ thị chăm sóc, và cam kết không tạo ra các chỉ thị trùng lặp cho cùng một Hội viên trong vòng 7 ngày để tránh spam.
BR-36: Nhân viên vận hành bắt buộc phải nhập kết quả tương tác sau khi tiếp cận Hội viên để hệ thống có dữ liệu theo dõi hiệu quả.
BR-10: Các trường hợp gói tập còn dưới 7 ngày sẽ được xếp vào mức độ ưu tiên Cao. Riêng dưới 3 ngày, hệ thống tự động gửi thêm SMS nhắc nhở trực tiếp.
BR-11: Hội viên không phát sinh lượt check-in nào trong vòng 14 ngày liên tiếp sẽ được gán mức độ ưu tiên Trung bình để nhân viên gọi điện hỏi thăm.

3. Tình huống ngoại lệ (Exception Handling)
Trong quá trình xử lý Care Queue, nếu nhân viên không thể liên lạc được với Hội viên sau nhiều lần gọi điện, họ sẽ chọn kết quả "Không liên lạc được". Hệ thống sẽ tạm đóng chỉ thị này và tự động tạo lại một yêu cầu mới sau 3 ngày.
Nếu Hội viên tự gia hạn thành công qua web ngay trong lúc nhân viên đang mở màn hình Care Queue chuẩn bị gọi điện, hệ thống sẽ khóa nút "Ghi nhận" của dòng đó và tự động cập nhật trạng thái "Đã xử lý" kèm thông báo báo hiệu Hội viên đã tự thao tác để nhân viên bỏ qua.

4. Sơ đồ BPMN (mô tả văn bản)

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

**BPMN Workflow — Nhân viên xử lý Care Queue**

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
