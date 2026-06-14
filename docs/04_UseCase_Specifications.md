# 04. MÔ TẢ CHI TIẾT USE CASE
# (Use Case Specifications)

> Dự án: FitFuel+
> Môn học: Web Kinh Doanh
> Phiên bản: 2.1 (Đồng bộ hóa & Sửa lỗi UC numbering)

========================================================================

## GIẢI THÍCH CẤU TRÚC ĐẶC TẢ USE CASE:
- **Use Case ID**: Mã định danh duy nhất (theo danh sách 56 UC trong file 03_Actor_UseCase.md).
- **Tên Use Case**: Tên ngắn gọn, bắt đầu bằng động từ.
- **Actor**: Tác nhân chính thực hiện use case.
- **Mục tiêu**: Kết quả mong muốn đạt được.
- **Điều kiện tiền**: Điều kiện cần có trước khi bắt đầu.
- **Điều kiện sau**: Trạng thái hệ thống sau khi hoàn thành.
- **Luồng cơ bản (Basic Flow)**: Happy path - chuỗi các bước thông thường.
- **Luồng thay thế (Alternative Flow)**: Các nhánh rẽ hoặc điều kiện đặc biệt.
- **Luồng ngoại lệ (Exception Flow)**: Xử lý lỗi, thất bại.
- **Quy tắc nghiệp vụ**: Liên kết đến mã Business Rule (BR) áp dụng.

========================================================================

## 01 & 02: ĐĂNG KÝ TÀI KHOẢN MỚI & ĐĂNG NHẬP
========================================================================

  Use Case ID     : 01 & 02
  Tên             : Đăng ký tài khoản mới & Đăng nhập hệ thống
  Actor           : Khách hàng, Đối tác (Vendor / Gym Owner)
  Mục tiêu        : Người dùng tạo tài khoản mới hoặc đăng nhập hệ thống để sử dụng các tính năng cá nhân hóa.
  Điều kiện tiền  : Người dùng chưa đăng nhập hệ thống.
  Điều kiện sau   : Người dùng được xác thực thành công, nhận mã token JWT và được chuyển hướng về trang cá nhân.

  LUỒNG CƠ BẢN:
    B1. Người dùng truy cập trang Đăng nhập / Đăng ký.
    B2. Hệ thống hiển thị form yêu cầu nhập thông tin đăng nhập (Email / Mật khẩu).
    B3. Người dùng nhập email và mật khẩu rồi nhấn [Đăng nhập].
    B4. Hệ thống kiểm tra thông tin tài khoản trong database:
        - Mật khẩu khớp với hash lưu trữ (bcrypt).
        - Tài khoản đang ở trạng thái hoạt động (không bị khóa).
    B5. Hệ thống sinh mã Token JWT (thời hạn 7 ngày) chứa thông tin định danh và vai trò (role) của người dùng.
    B6. Hệ thống trả về token JWT và lưu trữ tại Client (localStorage / Cookie).
    B7. Hệ thống chuyển hướng người dùng đến trang cá nhân (Dashboard của Member, Portal của Vendor hoặc Admin Panel của Gym Owner).

  LUỒNG THAY THẾ (Đăng ký tài khoản mới):
    - Ở bước B2, người dùng chọn [Đăng ký tài khoản].
      1. Hệ thống hiển thị form nhập: Email, Mật khẩu, Xác nhận mật khẩu, và Tên hiển thị.
      2. Người dùng điền thông tin và nhấn [Đăng ký].
      3. Hệ thống validate: mật khẩu phải đạt độ mạnh quy định (BR-01), email chưa tồn tại.
      4. Hệ thống mã hóa mật khẩu, tạo bản ghi mới trong bảng USERS và khởi tạo Fitness Passport trống cho Member.
      5. Hệ thống tự động chuyển tiếp đến bước B5 để đăng nhập.

  LUỒNG NGOẠI LỆ:
    E1. Email hoặc mật khẩu không đúng:
        Hệ thống hiển thị lỗi: "Thông tin đăng nhập không hợp lệ. Vui lòng kiểm tra lại."
    E2. Tài khoản bị khóa:
        Hệ thống hiển thị: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ."

  QUY TẮC NGHIỆP VỤ:
    BR-01 (Độ mạnh mật khẩu), BR-02 (Cơ chế OTP SMS khi đăng ký bằng số điện thoại).

========================================================================

## 03: ĐĂNG NHẬP BẰNG OTP / ĐẶT HÀNG NHANH KHÔNG TÀI KHOẢN (GUEST CHECKOUT)
========================================================================

  Use Case ID     : 03
  Tên             : Đặt hàng nhanh không tài khoản (Guest Checkout qua OTP)
  Actor           : Khách vãng lai (Guest)
  Mục tiêu        : Cho phép khách mua suất ăn nhanh mà không cần tốn thời gian tạo tài khoản.
  Điều kiện tiền  : Giỏ hàng trực tuyến có ít nhất 1 sản phẩm đồ ăn. Guest chưa đăng nhập.
  Điều kiện sau   : Đơn hàng được khởi tạo thành công với thông tin số điện thoại của Guest.

  LUỒNG CƠ BẢN:
    B1. Guest nhấn nút [Thanh toán] trong trang Giỏ hàng (/cart).
    B2. Hệ thống phát hiện Guest chưa đăng nhập, hiển thị form: "Đặt hàng nhanh bằng số điện thoại".
    B3. Guest nhập số điện thoại Việt Nam hợp lệ.
    B4. Hệ thống kiểm tra và tự động gửi mã OTP 6 số qua dịch vụ SMS (BR-02).
    B5. Hệ thống hiển thị giao diện nhập mã OTP.
    B6. Guest nhập mã OTP nhận được.
    B7. Hệ thống xác thực mã OTP khớp và còn hiệu lực.
    B8. Hệ thống khởi tạo một phiên giao dịch tạm thời (Guest Session).
    B9. Guest nhập địa chỉ nhận hàng, chọn khung giờ giao và phương thức thanh toán tiền mặt/chuyển khoản.
    B10. Guest nhấn [Xác nhận đặt hàng].
    B11. Hệ thống tạo đơn hàng mới trong database (trạng thái pending, trường user_id = null, guest_phone = SDT của Guest).
    B12. Hệ thống gửi thông báo đơn hàng mới đến Food Vendor đối tác.
    B13. Hệ thống hiển thị trang hoàn tất giao dịch.

  LUỒNG THAY THẾ (Đồng bộ khi đăng ký sau):
    - Nếu sau này Guest đăng ký tài khoản Member bằng chính số điện thoại này, hệ thống sẽ tự động liên kết các đơn hàng cũ sang tài khoản mới.

  LUỒNG NGOẠI LỆ:
    E1. Nhập sai OTP quá 3 lần:
        Hệ thống hiển thị: "Bạn nhập sai OTP quá số lần quy định. Số điện thoại bị khóa giao dịch trong 15 phút."
    E2. OTP hết hạn (quá 5 phút):
        Hệ thống hiển thị lỗi và yêu cầu nhấn [Gửi lại mã OTP].

  QUY TẮC NGHIỆP VỤ:
    BR-02 (Quy định xác thực OTP: hết hạn sau 5 phút, khóa sau 3 lần sai).

========================================================================

## 08: GHI NHẬN BÀI TẬP (EXERCISE LOG / WORKOUT LOG)
========================================================================

  Use Case ID     : 08
  Tên             : Ghi nhận bài tập (Exercise Log / Workout Log)
  Actor           : Hội viên (Member)
  Mục tiêu        : Ghi lại chi tiết các bài tập, set tập (reps, weight) trong buổi tập để theo dõi tiến độ.
  Điều kiện tiền  : Hội viên đã đăng nhập và đã khởi tạo một buổi tập mới (Workout Session) qua 07.
  Điều kiện sau   : Dữ liệu set tập được lưu thành công, hệ thống tự động kiểm tra PR và tính toán Volume tập luyện.

  LUỒNG CƠ BẢN:
    B1. Trong giao diện Workout Session đang hoạt động, Hội viên nhấn nút [Thêm bài tập].
    B2. Hệ thống hiển thị thư viện bài tập phân nhóm theo cơ tác động chính (Chest, Back, Legs, Shoulders, Arms, Core).
    B3. Hội viên chọn một bài tập (VD: Bench Press).
    B4. Hệ thống hiển thị form nhập set tập với Set 1 mặc định.
    B5. Hội viên nhập số lần lặp (Reps) và mức tạ (Weight) cho Set 1.
    B6. Hội viên nhấn [+ Thêm set] để nhập thêm Set 2, Set 3...
    B7. Hội viên nhấn [Lưu bài tập].
    B8. Hệ thống tính toán chỉ số Volume (Tổng reps x weight) và 1RM cho từng set tập vừa nhập.
    B9. Hệ thống kiểm tra đối chiếu kết quả với lịch sử tập của bài Bench Press để xác định kỷ lục cá nhân (PR) mới.
    B10. Nếu đạt PR mới, hệ thống cập nhật flag `is_pr = true` và hiển thị hiệu ứng chúc mừng trên màn hình.
    B11. Hệ thống lưu toàn bộ log vào cơ sở dữ liệu và cộng điểm kinh nghiệm tích lũy (+30 XP) cho hội viên (BR-18).
    B12. Giao diện quay lại màn hình tổng quan buổi tập hiện tại.

  LUỒNG THAY THẾ (Tự tạo bài tập):
    - Ở bước B2, nếu không tìm thấy bài tập mong muốn, hội viên chọn [Tạo bài tập mới].
      1. Hội viên nhập tên bài tập tự chọn và chỉ định nhóm cơ tác động.
      2. Hệ thống lưu bài tập mới vào danh mục cá nhân và tiếp tục quay lại luồng chính ở bước B4.

  LUỒNG NGOẠI LỆ:
    E1. Dữ liệu nhập không hợp lệ (số reps âm hoặc chữ cái):
        Hệ thống báo đỏ trường nhập liệu và hiển thị: "Vui lòng nhập số nguyên dương hợp lệ."

  QUY TẮC NGHIỆP VỤ:
    BR-18 (Cơ chế tính điểm thưởng XP), BR-31 (Quy tắc phát hiện PR tự động), BR-33 (Khóa chỉnh sửa session quá 24 giờ).

========================================================================

## 21: ĐẶT SUẤT ĂN & THANH TOÁN ĐƠN HÀNG
========================================================================

  Use Case ID     : 21
  Tên             : Đặt suất ăn & Thanh toán đơn hàng
  Actor           : Khách hàng (Guest, Member)
  Mục tiêu        : Tiến hành đặt và thanh toán các món ăn healthy đang có trong giỏ hàng.
  Điều kiện tiền  : Giỏ hàng trực tuyến có ít nhất 1 sản phẩm đồ ăn hợp lệ.
  Điều kiện sau   : Đơn hàng được lưu ở trạng thái chờ xử lý (pending), cập nhật số dư ví FitCoin (nếu dùng).

  LUỒNG CƠ BẢN (Đối với Member):
    B1. Người dùng truy cập trang Giỏ hàng và nhấn nút [Thanh toán].
    B2. Hệ thống hiển thị giao diện Checkout chứa thông tin tóm tắt giỏ hàng và tổng tiền.
    B3. Người dùng nhập địa chỉ giao hàng và số điện thoại liên hệ.
    B4. Người dùng chọn phương thức thanh toán: Ví FitCoin.
    B5. Hệ thống kiểm tra số dư ví FitCoin của người dùng.
    B6. Số dư đủ thanh toán, hệ thống thực hiện trừ số dư ví trực tiếp và tạo đơn hàng.
    B7. Hệ thống xóa các món ăn đã mua khỏi giỏ hàng.
    B8. Hệ thống gửi thông tin đơn hàng đến đối tác ẩm thực (Vendor) và hiển thị thông báo đặt hàng thành công.

  LUỒNG THAY THẾ (Thanh toán kết hợp FitCoin và Tiền mặt/Thẻ):
    - Ở bước B4, nếu người dùng muốn dùng FitCoin để giảm giá:
      1. Người dùng nhập số lượng FitCoin muốn tiêu dùng.
      2. Hệ thống kiểm tra quy tắc tiêu dùng FitCoin (BR-27): số tiền khấu trừ bằng FitCoin không được vượt quá 50% tổng giá trị hóa đơn.
      3. Hệ thống tính lại số tiền còn lại cần thanh toán bằng tiền mặt/chuyển khoản.
      4. Người dùng thực hiện thanh toán phần còn lại qua cổng VNPay/MoMo.
      5. Giao dịch thành công, tiếp tục từ bước B7.

  LUỒNG NGOẠI LỆ:
    E1. Giao dịch cổng thanh toán thất bại (mất kết nối hoặc khách hàng hủy thanh toán):
        Hệ thống hiển thị lỗi: "Thanh toán thất bại. Vui lòng thực hiện lại giao dịch." và không tạo đơn hàng.

  QUY TẮC NGHIỆP VỤ:
    BR-23 (Tỷ giá FitCoin: 1 FC = 1 VNĐ), BR-27 (Giới hạn thanh toán tối đa 50% hóa đơn bằng FitCoin).

========================================================================

## 23: ĐẶT LẠI ĐƠN HÀNG NHANH (QUICK RE-ORDER)
========================================================================

  Use Case ID     : 23
  Tên             : Đặt lại đơn hàng nhanh (Quick Re-order)
  Actor           : Hội viên (Member)
  Mục tiêu        : Giúp hội viên đặt lại chính xác thực đơn của đơn hàng cũ chỉ với 1 lượt bấm.
  Điều kiện tiền  : Hội viên đã đăng nhập và có ít nhất 1 đơn hàng cũ ở trạng thái hoàn thành.
  Điều kiện sau   : Toàn bộ món ăn trong đơn hàng cũ còn hàng được thêm vào giỏ hàng hiện tại.

  LUỒNG CƠ BẢN:
    B1. Hội viên truy cập trang Lịch sử mua hàng (/orders).
    B2. Hệ thống hiển thị danh sách các đơn hàng đã mua trong quá khứ.
    B3. Tại mỗi đơn hàng cũ, hệ thống hiển thị nút [Đặt lại đơn này].
    B4. Hội viên nhấn vào nút [Đặt lại đơn này] tại đơn hàng mong muốn.
    B5. Hệ thống kiểm tra trạng thái khả dụng của từng món ăn trong đơn hàng cũ đó.
    B6. Hệ thống thêm các món ăn còn hàng (status = available) vào giỏ hàng hiện tại với đúng số lượng ban đầu.
    B7. Hệ thống hiển thị thông báo: "Đã thêm các món ăn từ đơn cũ vào giỏ hàng thành công!"
    B8. Hệ thống tự động chuyển hướng hội viên sang màn hình Giỏ hàng để tiến hành checkout.

  LUỒNG THAY THẾ (Có món ăn tạm hết hàng):
    - Ở bước B5, nếu phát hiện có món ăn trong đơn cũ đã ngừng bán hoặc hết hàng:
      1. Hệ thống bỏ qua món ăn bị hết hàng và chỉ thêm các món còn lại vào giỏ hàng.
      2. Hệ thống hiển thị thông báo chi tiết: "Đã thêm các món có sẵn. Lưu ý: Món [Tên món] đã tạm hết hàng và không được thêm."
      3. Tiếp tục bước B8.

  LUỒNG NGOẠI LỆ:
    E1. Tất cả món ăn trong đơn hàng cũ đều ngừng kinh doanh:
        Hệ thống thông báo lỗi: "Không thể đặt lại đơn hàng này do tất cả các món ăn đều đã dừng bán." và giữ nguyên màn hình lịch sử đơn hàng.

========================================================================

## 24: AI GỢI Ý THỰC ĐƠN SAU TẬP
========================================================================

  Use Case ID     : 24
  Tên             : AI gợi ý thực đơn sau tập
  Actor           : Hội viên (Member)
  Mục tiêu        : Tự động đưa ra thực đơn dinh dưỡng tối ưu dựa trên kết quả nhóm cơ vừa tập hôm nay.
  Điều kiện tiền  : Hội viên vừa hoàn thành và lưu 1 workout session trong ngày.
  Điều kiện sau   : Hiển thị đúng 3 món ăn gợi ý trên màn hình, hội viên có thể bấm thêm nhanh vào giỏ hàng.

  LUỒNG CƠ BẢN:
    B1. Hội viên hoàn thành workout session và nhấn nút [Hoàn thành buổi tập].
    B2. Hệ thống xác định nhóm cơ tập luyện chính của buổi tập hôm nay (nhóm cơ chiếm volume lớn nhất).
    B3. Hệ thống gọi SuggestionEngine phân tích biểu đồ dinh dưỡng mục tiêu tương ứng với nhóm cơ đó (BR-28):
        - Tập cơ Ngực/Lưng/Đùi -> Cần protein cao (high), carb trung bình (medium), fat thấp (low).
    B4. Hệ thống thực hiện câu lệnh query lọc món ăn từ kho dữ liệu ẩm thực, sắp xếp theo thứ tự ưu tiên macro tương ứng (BR-29).
    B5. Hệ thống lấy ra chính xác 3 món ăn healthy phù hợp nhất (BR-30).
    B6. Hệ thống hiển thị bảng đề xuất món ăn ngay trên giao diện tổng hợp buổi tập dưới dạng Carousel hoặc popup.
    B7. Hội viên xem thông số dinh dưỡng của 3 món ăn và nhấn [Thêm tất cả vào giỏ] hoặc [Thêm món này].
    B8. Hệ thống cập nhật giỏ hàng và chuyển hướng hội viên sang trang checkout.

  LUỒNG THAY THẾ (Nới lỏng ràng buộc dinh dưỡng):
    - Ở bước B4, nếu kho dữ liệu không có đủ món ăn đạt chính xác bộ lọc macro:
      1. Hệ thống áp dụng quy tắc nới lỏng (BR-29B): chuyển đổi mức ưu tiên sang các nhóm cơ phụ hoặc các tiêu chí calo gần đúng.
      2. Đảm bảo hệ thống luôn tìm và hiển thị đủ 3 món gợi ý có sẵn.

  QUY TẮC NGHIỆP VỤ:
    BR-28 (Mapping nhóm cơ tập luyện -> phân bổ macro), BR-29 (Thuật toán sắp xếp macro), BR-29B (Nới lỏng ràng buộc), BR-30 (Quy tắc hiển thị đúng 3 món).

========================================================================

## 33: ĐĂNG KÝ KÝ GỬI THIẾT BỊ GYM
========================================================================

  Use Case ID     : 33
  Tên             : Đăng ký ký gửi thiết bị gym
  Actor           : Hội viên (Member), Chủ phòng tập (Gym Owner)
  Mục tiêu        : Đăng tải thiết bị gym lên Gear Hub. Member chỉ được đăng cho thuê Peer-to-Peer; Gym Owner chỉ được đăng bán đứt (BR-11B).
  Điều kiện tiền  : Người dùng đã đăng nhập tài khoản.
  Điều kiện sau   : Thiết bị được đăng ký thành công, sinh mã QR định danh duy nhất và chuyển sang trạng thái chờ duyệt.

  LUỒNG CƠ BẢN (Đối với Hội viên):
    B1. Hội viên truy cập Gear Hub và nhấn nút [Ký gửi thiết bị].
    B2. Hệ thống hiển thị form điền thông tin đăng ký ký gửi.
    B3. Hội viên nhập thông tin thiết bị: Tên thiết bị, chọn danh mục phân loại, đánh giá tình trạng sử dụng (1-5 sao), giá thuê mong muốn, số tiền đặt cọc (bắt buộc >= 50% giá trị thiết bị theo BR-13) và upload ít nhất 2 ảnh thực tế (BR-11).
    B4. Hệ thống kiểm tra vai trò người dùng (Member) và ẩn tùy chọn "Đăng bán" (Member chỉ được cho thuê - BR-11B).
    B5. Hội viên nhấn nút [Đăng ký ký gửi].
    B6. Hệ thống tự động sinh ID định danh duy nhất cho thiết bị (Gear ID).
    B7. Hệ thống tự động tạo mã QR Code chứa link thông tin chi tiết thiết bị phục vụ việc quét nhận/trả gear thực tế.
    B8. Thiết bị được tạo ở trạng thái `pending_approval` và tạo một bản ghi trạng thái đầu tiên trong Gear Lifecycle (action = "listed").
    B9. Hệ thống gửi yêu cầu duyệt tin đăng kèm mã QR vừa tạo tới trang quản trị của Chủ phòng tập.

  LUỒNG THAY THẾ (Đối với Chủ phòng tập):
    - Ở bước B4, hệ thống phát hiện vai trò là Gym Owner:
      1. Hệ thống chỉ hiển thị hình thức "Bán đứt" (Gym Owner không được đăng cho thuê — BR-11B).
      2. Gym Owner điền thông tin giá bán và hoàn tất. Tin đăng của Gym Owner được tự động phê duyệt hiển thị ngay lập tức không cần chờ duyệt.

  LUỒNG NGOẠI LỆ:
    E1. Upload thiếu ảnh hoặc ảnh quá lớn (>5MB):
        Hệ thống báo lỗi và yêu cầu chọn lại ảnh phù hợp.
    E2. Số tiền đặt cọc thấp hơn 50% giá trị thiết bị:
        Hệ thống hiển thị lỗi cảnh báo: "Yêu cầu số tiền đặt cọc tối thiểu phải đạt 50% giá trị gốc của thiết bị để phòng tránh rủi ro."

  QUY TẮC NGHIỆP VỤ:
    BR-11 (Yêu cầu hình ảnh tối thiểu), BR-11B (Quy định phân quyền đăng thiết bị theo role), BR-13 (Ràng buộc giá trị đặt cọc).

========================================================================
KẾT THÚC TÀI LIỆU
========================================================================
