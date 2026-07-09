# 03. TÁC NHÂN VÀ CÁC TRƯỜNG HỢP SỬ DỤNG (ACTORS & USE CASES)

**Dự án:** FitFuel+
**Môn học:** Web Kinh Doanh

---

## DANH SÁCH TÁC NHÂN (ACTORS)

| Tên | Phân loại | Mô tả |
|-----|-----------|-------|
| Guest (Khách vãng lai) | Chính | Người dùng chưa có tài khoản, truy cập website để tìm hiểu thông tin, đăng ký dùng thử hoặc mua hàng. |
| Member (Hội viên) | Chính | Người dùng đã đăng ký gói tập (Active/Frozen/Expired). Sử dụng các dịch vụ cốt lõi: tập luyện, dinh dưỡng, gear. |
| Gym Owner / Admin (Chủ phòng gym) | Chính | Quản trị viên duy nhất của hệ thống (mô hình Single-Tenant). Quản lý cấu hình, sản phẩm, chăm sóc hội viên, báo cáo kinh doanh. |
| Payment Gateway (Cổng thanh toán) | Phụ | Hệ thống bên thứ ba (Momo, VNPay) xác thực và xử lý giao dịch thanh toán. |

---

## DANH SÁCH 16 USE CASE & MỐI QUAN HỆ

```
A. HÀNH TRÌNH KHÁCH VÃNG LAI (GUEST JOURNEY):
UC-01 (Khám phá dịch vụ) → UC-02 (Đăng ký trải nghiệm) → UC-03 (Đăng ký Membership) → UC-16 (Thanh toán)

B. HÀNH TRÌNH HỘI VIÊN (MEMBER JOURNEY):
UC-04 (Quản lý hồ sơ) → UC-05 (Kế hoạch tập luyện) → UC-06 (Buổi tập) → UC-07 (Theo dõi tiến trình)
                          │                                  │
                          ├── UC-08 (Dinh dưỡng)              ├── UC-10 (Quản lý Membership)
                          └── UC-09 (Gear)                    └── UC-11 (Chia sẻ & Giới thiệu)

C. HÀNH TRÌNH QUẢN TRỊ (ADMIN JOURNEY):
UC-12 (Cấu hình phòng gym) → UC-13 (Quản lý sản phẩm) → UC-14 (Chăm sóc hội viên) → UC-15 (Báo cáo kinh doanh)

D. DÙNG CHUNG (SHARED):
UC-16 (Thanh toán) — được include bởi UC-03, UC-08, UC-09, UC-10
```

---

## A. HÀNH TRÌNH KHÁCH VÃNG LAI (GUEST JOURNEY)

### UC-01: Khám phá dịch vụ

| Mục | Nội dung |
|---|---|
| Use Case ID | UC-01 |
| Tên Use Case | Khám phá dịch vụ |
| Mục đích | Cho phép Guest xem các thông tin công khai về gói tập, lịch học, huấn luyện viên và cơ sở vật chất của phòng gym mà không cần đăng nhập. |
| Tác nhân chính | Guest |
| Tác nhân phụ | Không |
| Điều kiện tiên quyết | Guest có kết nối internet và truy cập thành công vào website của FitFuel+ (hỗ trợ hiển thị trên Desktop và trình duyệt thiết bị di động). |
| Điều kiện sau cùng | Cung cấp thông tin, không thay đổi dữ liệu hệ thống. |
| Tần suất sử dụng | Hàng ngày, liên tục. |
| Luồng chính | 1. Guest truy cập màn hình trang chủ hoặc mục khám phá.<br>2. Hệ thống nhận diện phiên truy cập công khai (không yêu cầu mã token xác thực).<br>3. Hệ thống tải và hiển thị danh sách 2 gói tập cốt lõi (Tháng/Năm), danh mục trang thiết bị, hồ sơ cá nhân của các Huấn luyện viên (PT) và lịch các lớp học Class trong tuần.<br>4. Guest thực hiện tìm kiếm hoặc sử dụng bộ lọc lịch học Class theo khung giờ hoặc theo tên PT.<br>5. Hệ thống hiển thị kết quả tương ứng lên giao diện cho người dùng. |
| Luồng thay thế | 4a. Không tìm thấy lịch học phù hợp với bộ lọc: Hệ thống hiển thị giao diện thông báo lịch trống và tự động hiển thị danh sách "Gợi ý các lớp học Class phổ biến nhất trong tuần này" để Guest tham khảo.<br>3b. Guest chọn xem chi tiết hồ sơ 1 PT: Hệ thống hiển thị trang chi tiết gồm chuyên môn, chứng chỉ, lịch dạy trong tuần.<br>3c. Guest muốn biết gói tập nào phù hợp với mục tiêu cá nhân: Hệ thống hiển thị công cụ "Gợi ý mục tiêu" (Goal Engine rút gọn), Guest trả lời nhanh 2-3 câu hỏi để nhận gợi ý gói phù hợp. |
| Trường hợp ngoại lệ | Lỗi kết nối cơ sở dữ liệu: Hệ thống không thể tải danh sách dịch vụ và hiển thị thông báo "Hệ thống đang bảo trì dữ liệu, vui lòng thử lại sau ít phút".<br>Không có dữ liệu lịch học nào được cấu hình: Hệ thống hiển thị khung trống kèm nút liên hệ hotline. |
| Yêu cầu đặc biệt | Tốc độ tải và hiển thị trang dữ liệu phải dưới 2 giây. Giao diện tối ưu hóa hiển thị linh hoạt (Responsive) trên cả điện thoại và máy tính. Hỗ trợ tối ưu SEO cho công cụ tìm kiếm. |
| Ghi chú khác | Hệ thống chạy mô hình Single-Tenant, toàn bộ thông tin hiển thị chỉ thuộc về duy nhất một cơ sở phòng tập vật lý này. Dữ liệu hiển thị được lấy từ dữ liệu Admin cấu hình ở UC-12 và UC-13. |
| Usecase liên quan | UC-02 (Đăng ký trải nghiệm), UC-12 (Cấu hình phòng gym), UC-13 (Quản lý sản phẩm) |

---

### UC-02: Đăng ký trải nghiệm (Free Trial / Gym Tour)

| Mục | Nội dung |
|---|---|
| Use Case ID | UC-02 |
| Tên Use Case | Đăng ký trải nghiệm |
| Mục đích | Cho phép Guest đăng ký dùng thử miễn phí 7 ngày (Free Trial), đặt lịch tham quan phòng gym (Gym Tour), hoặc mua hàng lẻ (Gear/Nutrition) thông qua xác thực số điện thoại bằng mã OTP mà không cần tạo tài khoản đầy đủ. |
| Tác nhân chính | Guest |
| Tác nhân phụ | Hệ thống gửi SMS (OTP Provider) |
| Điều kiện tiên quyết | Guest đã xem qua thông tin dịch vụ (UC-01) và có số điện thoại hợp lệ đang sử dụng để nhận mã OTP. |
| Điều kiện sau cùng | Tạo phiên Guest tạm thời (Guest Session) có hiệu lực 2 giờ; hoặc tạo bản ghi đặt lịch Gym Tour; hoặc kích hoạt gói Free Trial 7 ngày cho số điện thoại đó. |
| Tần suất sử dụng | Trung bình, vài chục lượt mỗi ngày. |
| Luồng chính | 1. Guest chọn loại hình muốn đăng ký: Free Trial, Gym Tour, hoặc Mua hàng.<br>2. Guest nhập thông tin cơ bản (Họ tên, Số điện thoại, thời gian mong muốn nếu là Gym Tour).<br>3. Hệ thống gửi mã OTP gồm 6 chữ số về số điện thoại vừa nhập.<br>4. Guest nhập mã OTP nhận được vào ô xác thực.<br>5. Hệ thống kiểm tra và xác thực mã OTP hợp lệ.<br>6. Hệ thống tạo phiên Guest Session hoặc bản ghi đặt lịch tương ứng và hiển thị thông báo thành công. |
| Luồng thay thế | 2a. Số điện thoại đã tồn tại tài khoản Member: Hệ thống nhận diện và tự động đăng nhập, chuyển Guest sang luồng của Member.<br>4a. Guest chọn gửi lại mã OTP: Hệ thống cho phép gửi lại sau 60 giây, tối đa 3 lần trong 10 phút.<br>3b. Gửi SMS thất bại (lỗi nhà mạng): Hệ thống đề xuất phương án gọi điện xác thực (Voice OTP) thay thế.<br>1c. Guest chọn Mua hàng lẻ (Gear/Nutrition) không cần Trial: Sau khi xác thực OTP, hệ thống chuyển thẳng sang luồng UC-08/UC-09 để chọn sản phẩm và thanh toán (UC-16).<br>2d. Khung giờ Gym Tour đã kín lịch: Hệ thống hiển thị các khung giờ trống gần nhất để Guest lựa chọn thay thế. |
| Trường hợp ngoại lệ | Số điện thoại không đúng định dạng: Hệ thống báo lỗi ngay tại ô nhập, không cho gửi OTP.<br>Số điện thoại đã sử dụng hết lượt Free Trial trước đó: Hệ thống từ chối và thông báo "Số điện thoại này đã từng sử dụng Free Trial, vui lòng đăng ký Membership để tiếp tục".<br>Nhập sai mã OTP quá 5 lần: Hệ thống khóa xác thực số điện thoại này trong 30 phút.<br>Phiên Guest Session hết hạn (quá 2 giờ không thao tác): Hệ thống yêu cầu xác thực lại OTP. |
| Yêu cầu đặc biệt | Mã OTP phải được gửi đi trong vòng dưới 3 giây. Nội dung SMS giới hạn dưới 160 ký tự. Biểu mẫu đăng ký phải tối ưu cho thao tác trên di động. |
| Ghi chú khác | Gói Free Trial có hiệu lực 7 ngày kể từ thời điểm đăng ký thành công. Quy tắc nghiệp vụ BR-OTP-01: Giới hạn tối đa 10 lượt gửi OTP cho mỗi số điện thoại trong 1 ngày để chống spam. |
| Usecase liên quan | UC-01 (Khám phá dịch vụ), UC-03 (Đăng ký Membership), UC-08 (Dinh dưỡng), UC-09 (Gear) |

---

### UC-03: Đăng ký Membership

| Mục | Nội dung |
|---|---|
| Use Case ID | UC-03 |
| Tên Use Case | Đăng ký Membership |
| Mục đích | Cho phép Visitor lựa chọn gói tập (Tháng hoặc Năm), tạo tài khoản chính thức, hoàn tất thanh toán để trở thành Member và được kích hoạt đầy đủ quyền lợi sử dụng dịch vụ. |
| Tác nhân chính | Guest/Visitor |
| Tác nhân phụ | Payment Gateway |
| Điều kiện tiên quyết | Visitor đã xem thông tin gói tập (UC-01) và có đầy đủ thông tin cá nhân hợp lệ (họ tên, số điện thoại, email) để tạo tài khoản. |
| Điều kiện sau cùng | Tài khoản Member được tạo với trạng thái Active, gói tập được kích hoạt đúng thời hạn, tài khoản được cộng điểm thưởng FitCoin chào mừng. |
| Tần suất sử dụng | Hàng ngày, đây là luồng chuyển đổi doanh thu chính. |
| Luồng chính | 1. Visitor chọn gói tập muốn đăng ký (Tháng hoặc Năm).<br>2. Visitor nhập thông tin cá nhân: họ tên, số điện thoại, email, mật khẩu.<br>3. Hệ thống hiển thị màn hình xác nhận đơn hàng (gói tập, giá tiền, mã giảm giá nếu có).<br>4. Visitor xác nhận và hệ thống chuyển sang luồng UC-16 (Thanh toán).<br>5. Sau khi thanh toán thành công, hệ thống tạo tài khoản Member chính thức, kích hoạt gói tập, gửi email/SMS xác nhận kèm hướng dẫn đăng nhập. |
| Luồng thay thế | 1a. Visitor đang có gói Free Trial: Hệ thống hiển thị cảnh báo và đề xuất giữ nguyên lịch sử dữ liệu tập luyện đã có trong thời gian Trial, chuyển tiếp sang tài khoản Member mới.<br>2b. Email đã tồn tại trong hệ thống: Hệ thống thông báo và đề xuất Visitor đăng nhập bằng tài khoản hiện có thay vì tạo mới.<br>3c. Visitor nhập mã giới thiệu (Referral code): Hệ thống kiểm tra hợp lệ và cộng thêm FitCoin thưởng cho cả hai bên sau khi thanh toán thành công.<br>4d. Visitor hủy ở bước xác nhận đơn hàng: Hệ thống lưu tài khoản ở trạng thái tạm (Pending) và tự động xóa nếu không hoàn tất thanh toán sau 24 giờ.<br>1e. Đăng ký ngoại tuyến tại quầy (Offline POS): Nhân viên quét mã QR của Visitor, nhập thông tin hộ và xác nhận thanh toán tiền mặt trực tiếp trên hệ thống Admin. |
| Trường hợp ngoại lệ | Số điện thoại hoặc email không hợp lệ: Hệ thống báo lỗi tại chỗ, không cho tiếp tục.<br>Tạo tài khoản thất bại do lỗi hệ thống: Hệ thống rollback giao dịch thanh toán (nếu đã thu tiền) và thông báo Visitor liên hệ hỗ trợ.<br>Gửi email xác nhận thất bại: Hệ thống vẫn kích hoạt tài khoản, ghi log lỗi để gửi lại sau.<br>Visitor đã có Membership đang Active: Hệ thống từ chối đăng ký mới và đề xuất sang UC-10 (gia hạn/nâng cấp). |
| Yêu cầu đặc biệt | Email xác nhận phải được gửi trong vòng dưới 2 phút. SMS chứa mật khẩu tạm thời phải gửi trong vòng dưới 1 phút. Biểu mẫu đăng ký phải responsive trên di động. Hỗ trợ quét mã QR cho luồng giới thiệu bạn bè. |
| Ghi chú khác | Việc nâng cấp từ gói Tháng lên gói Năm được miễn phí phần chênh lệch (tính theo số ngày còn lại). Email chào mừng kèm theo hướng dẫn sử dụng ứng dụng. Dữ liệu tập luyện trong thời gian Trial sẽ được giữ lại và gộp vào tài khoản Member. Quy tắc nghiệp vụ BR-REG-01: Hỗ trợ áp dụng mã giới thiệu ngay tại bước đăng ký. |
| Usecase liên quan | UC-02 (Đăng ký trải nghiệm), UC-16 (Thanh toán), UC-11 (Chia sẻ & Giới thiệu), UC-10 (Quản lý Membership) |

---

## B. HÀNH TRÌNH HỘI VIÊN (MEMBER JOURNEY)

### UC-04: Quản lý hồ sơ cá nhân

| Mục | Nội dung |
|---|---|
| Use Case ID | UC-04 |
| Tên Use Case | Quản lý hồ sơ cá nhân |
| Mục đích | Cho phép Member cập nhật thông tin cá nhân, chỉ số cơ thể (cân nặng, chiều cao, vòng eo,...) và thông tin sức khỏe (dị ứng, bệnh lý nền) để hệ thống sử dụng cho việc cá nhân hóa các đề xuất tập luyện và dinh dưỡng. |
| Tác nhân chính | Member |
| Tác nhân phụ | Không |
| Điều kiện tiên quyết | Member đã đăng nhập thành công vào hệ thống. |
| Điều kiện sau cùng | Thông tin hồ sơ được cập nhật và lưu lại trong hệ thống, lịch sử thay đổi được ghi log. |
| Tần suất sử dụng | Thường xuyên, đặc biệt vào đầu mỗi kỳ tập (cập nhật chỉ số cơ thể). |
| Luồng chính | 1. Member truy cập màn hình Hồ sơ cá nhân.<br>2. Hệ thống hiển thị 4 nhóm thông tin: Thông tin cơ bản, Chỉ số cơ thể, Sức khỏe & Dị ứng, Cài đặt tài khoản.<br>3. Member chỉnh sửa trường thông tin mong muốn.<br>4. Hệ thống kiểm tra tính hợp lệ của dữ liệu vừa nhập.<br>5. Member xác nhận lưu thay đổi.<br>6. Hệ thống lưu dữ liệu và ghi lại lịch sử thay đổi (audit log). |
| Luồng thay thế | 3a. Member tải lên ảnh đại diện: Hệ thống cho phép cắt và resize ảnh về kích thước chuẩn 300x300px trước khi lưu.<br>3b. Member khai báo dị ứng thực phẩm mới: Hệ thống lưu thông tin và tự động gửi thông báo cho PT phụ trách (nếu có) để lưu ý khi tư vấn.<br>3c. Member cập nhật chỉ số cơ thể định kỳ: Hệ thống hiển thị biểu đồ xu hướng thay đổi theo thời gian ngay sau khi lưu.<br>3d. Member đổi địa chỉ email: Hệ thống gửi link xác thực đến email mới, chỉ cập nhật sau khi Member xác nhận qua link.<br>3e. Member muốn đổi số điện thoại: Hệ thống từ chối tự đổi và yêu cầu liên hệ Admin xác minh trực tiếp. |
| Trường hợp ngoại lệ | Dữ liệu nhập không hợp lệ (VD: cân nặng âm): Hệ thống báo lỗi ngay tại ô nhập, không cho lưu.<br>Tải ảnh lên thất bại (quá dung lượng hoặc sai định dạng): Hệ thống thông báo lỗi cụ thể.<br>Lỗi kết nối cơ sở dữ liệu khi lưu: Hệ thống giữ nguyên dữ liệu cũ, thông báo thử lại sau.<br>Email mới đã được sử dụng bởi tài khoản khác: Hệ thống từ chối cập nhật. |
| Yêu cầu đặc biệt | Toàn bộ thay đổi phải được ghi log đầy đủ (tuân thủ nguyên tắc bảo mật dữ liệu tương tự GDPR). Ảnh đại diện giới hạn dưới 5MB, tự động resize về 300x300px. Giao diện responsive trên di động. |
| Ghi chú khác | Lịch sử thay đổi chỉ số cơ thể không bao giờ bị xóa, phục vụ biểu đồ xu hướng dài hạn. Thông tin sức khỏe được chia sẻ có kiểm soát với PT phụ trách. Quy tắc nghiệp vụ BR-PROFILE-01: Số điện thoại không thể tự thay đổi qua giao diện Member. |
| Usecase liên quan | UC-05 (Kế hoạch tập luyện), UC-07 (Theo dõi tiến trình), UC-08 (Dinh dưỡng) |

---

### UC-05: Quản lý kế hoạch tập luyện

| Mục | Nội dung |
|---|---|
| Use Case ID | UC-05 |
| Tên Use Case | Quản lý kế hoạch tập luyện |
| Mục đích | Cho phép Member trả lời bộ câu hỏi xác định mục tiêu, nhận đề xuất chương trình tập luyện từ AI (Goal Engine), lựa chọn và tùy chỉnh chương trình theo nhu cầu cá nhân. |
| Tác nhân chính | Member |
| Tác nhân phụ | AI Goal Engine |
| Điều kiện tiên quyết | Member đã có hồ sơ cá nhân với chỉ số cơ thể cơ bản (UC-04). |
| Điều kiện sau cùng | Một kế hoạch tập luyện (Workout Plan) ở trạng thái Active được tạo và lưu cho Member. |
| Tần suất sử dụng | Trung bình, thường mỗi khi Member đổi mục tiêu tập luyện (vài tuần/lần). |
| Luồng chính | 1. Member bắt đầu quy trình tạo kế hoạch tập luyện mới.<br>2. Hệ thống hiển thị bộ 7 câu hỏi xác định mục tiêu (Goal Onboarding): mục tiêu chính, tần suất tập/tuần, thời gian mỗi buổi, kinh nghiệm, thiết bị sẵn có, chấn thương/hạn chế, sở thích bài tập.<br>3. Member trả lời đầy đủ các câu hỏi.<br>4. Hệ thống AI phân tích và đề xuất 3 chương trình tập luyện phù hợp nhất.<br>5. Member lựa chọn 1 trong 3 chương trình.<br>6. Hệ thống sinh chi tiết giáo án tập luyện (bài tập, số hiệp, số lần lặp cho từng buổi).<br>7. Member xem lại và tùy chỉnh (thêm/xóa/điều chỉnh bài tập) nếu muốn.<br>8. Member xác nhận lưu kế hoạch. |
| Luồng thay thế | 7a. Member không tùy chỉnh gì: Hệ thống lưu kế hoạch ngay theo đề xuất gốc của AI.<br>1b. Member đã có kế hoạch đang Active: Hệ thống lưu trữ (archive) kế hoạch cũ trước khi tạo kế hoạch mới.<br>3c. Member thoát giữa chừng khi đang trả lời câu hỏi: Hệ thống lưu tạm câu trả lời, cho phép tiếp tục lại sau.<br>3d. Member bỏ trống một số câu hỏi không bắt buộc: Hệ thống áp dụng bộ giáo án mặc định dành cho người mới bắt đầu (Beginner preset) cho phần thiếu dữ liệu. |
| Trường hợp ngoại lệ | AI xử lý quá thời gian chờ: Hệ thống tự động áp dụng bộ giáo án mẫu (preset) tương ứng với mục tiêu đã chọn.<br>Sinh giáo án chi tiết thất bại: Hệ thống cho phép Member thử lại thao tác.<br>Kế hoạch không có bài tập nào sau khi tùy chỉnh: Hệ thống không cho phép lưu, yêu cầu bổ sung ít nhất 1 bài tập. |
| Yêu cầu đặc biệt | Thời gian AI phản hồi đề xuất dưới 5 giây. Thời gian sinh giáo án chi tiết dưới 10 giây. Hỗ trợ lưu cache khi mất kết nối. Hỗ trợ xuất kế hoạch ra file PDF. |
| Ghi chú khác | Member được phép có nhiều kế hoạch (các kế hoạch cũ sẽ được lưu trữ, không xóa). Khi Member cập nhật chỉ số cơ thể mới (UC-04), hệ thống sẽ gợi ý điều chỉnh kế hoạch hiện tại. Kế hoạch có thể tùy chỉnh 100% theo ý Member. Quy tắc nghiệp vụ BR-PLAN-01: Chỉ có 1 kế hoạch ở trạng thái Active tại một thời điểm. BR-PLAN-02: Nếu Member không ghi nhận buổi tập nào trong 14 ngày liên tục, hệ thống gợi ý xem lại/điều chỉnh kế hoạch. |
| Usecase liên quan | UC-04 (Hồ sơ cá nhân), UC-06 (Buổi tập), UC-07 (Theo dõi tiến trình) |

---

### UC-06: Thực hiện buổi tập

| Mục | Nội dung |
|---|---|
| Use Case ID | UC-06 |
| Tên Use Case | Thực hiện buổi tập |
| Mục đích | Cho phép Member bắt đầu một buổi tập theo kế hoạch, ghi nhận số liệu từng bài tập (hiệp, số lần lặp, mức tạ, cảm nhận độ khó), và nhận tổng kết kết quả sau khi hoàn thành. |
| Tác nhân chính | Member |
| Tác nhân phụ | Không |
| Điều kiện tiên quyết | Member có gói Membership đang Active và có kế hoạch tập luyện Active (UC-05). |
| Điều kiện sau cùng | Buổi tập được ghi nhận đầy đủ vào lịch sử; các chỉ số Volume, Intensity, Streak được tính toán cập nhật; phát hiện kỷ lục cá nhân (PR) nếu có. |
| Tần suất sử dụng | Hàng ngày, đây là hành động lõi (core action) của Member. |
| Luồng chính | 1. Member check-in tại phòng gym hoặc bắt đầu buổi tập từ ứng dụng.<br>2. Hệ thống kiểm tra tình trạng Membership còn hiệu lực.<br>3. Member bắt đầu buổi tập theo bài tập trong kế hoạch.<br>4. Member ghi nhận từng hiệp (số lần lặp, mức tạ, mức độ gắng sức RPE) cho mỗi bài tập.<br>5. Hệ thống hiển thị đồng hồ đếm giờ nghỉ (rest timer) giữa các hiệp.<br>6. Member hoàn thành toàn bộ bài tập và xác nhận kết thúc buổi tập.<br>7. Hệ thống tính toán các chỉ số: tổng khối lượng (Volume), cường độ (Intensity), chuỗi ngày tập liên tục (Streak).<br>8. Hệ thống hiển thị màn hình tổng kết kèm thông điệp động viên. |
| Luồng thay thế | 4a. Member bỏ qua 1 bài tập: Hệ thống đánh dấu "Đã bỏ qua" và tiếp tục sang bài tiếp theo.<br>4b. Member thêm hiệp tập vượt kế hoạch: Hệ thống ghi nhận thêm và tính vào tổng khối lượng.<br>4c. Member thêm bài tập mới ngoài kế hoạch giữa buổi: Hệ thống cho phép thêm và ghi nhận như bài tập thông thường.<br>3d. Member xem video hướng dẫn động tác: Hệ thống phát video minh họa (30-60 giây) ngay trong màn hình tập.<br>3e. Member xem lại lịch sử 5 buổi tập gần nhất của cùng bài tập: Hệ thống hiển thị nhanh để Member so sánh mức tạ.<br>2f. Membership hết hạn giữa lúc đang tập: Hệ thống vẫn cho phép hoàn thành buổi tập hiện tại, sau đó chuyển hướng sang UC-10 để gia hạn. |
| Trường hợp ngoại lệ | Membership đã hết hạn trước khi bắt đầu: Hệ thống chặn không cho bắt đầu buổi tập mới, chuyển hướng sang UC-10.<br>Tạo bản ghi buổi tập thất bại do lỗi hệ thống: Dữ liệu được lưu tạm cục bộ (localStorage) để đồng bộ lại sau.<br>Dữ liệu bất thường (VD: mức tạ quá lớn so với lịch sử): Hệ thống cảnh báo và yêu cầu Member xác nhận lại trước khi lưu.<br>Mất kết nối mạng khi đang tập: Hệ thống lưu cache cục bộ, tự động đồng bộ khi có mạng trở lại.<br>AI phân tích chỉ số thất bại: Hệ thống vẫn lưu dữ liệu buổi tập, chỉ bỏ qua phần tính PR/Streak, sẽ tính bù sau. |
| Yêu cầu đặc biệt | Giao diện tối ưu cho di động (hỗ trợ cả xoay ngang/dọc màn hình). Đồng hồ đếm giờ nghỉ chính xác kèm âm báo. Hỗ trợ chế độ ngoại tuyến (offline mode). Video hướng dẫn tải dưới 2 giây hoặc được cache sẵn. Không giật lag khi nhập liệu liên tục. |
| Ghi chú khác | Mọi hiệp tập đều được ghi nhận, không bỏ sót. PR (Personal Record) được xác định là mức tạ tối đa cho 1 lần lặp hoặc theo công thức ước tính 1RM. Streak là số ngày tập liên tục (bị đứt chuỗi sẽ reset về 0). Lịch sử đầy đủ được xem chi tiết tại UC-07. Quy tắc nghiệp vụ BR-WORKOUT-01: Buổi tập phải kéo dài tối thiểu 15 phút mới được tính vào Streak. BR-WORKOUT-02: Dữ liệu buổi tập không bao giờ bị xóa (audit trail). |
| Usecase liên quan | UC-05 (Kế hoạch tập luyện), UC-07 (Theo dõi tiến trình), UC-10 (Quản lý Membership) |

---

### UC-07: Theo dõi tiến trình tập luyện

| Mục | Nội dung |
|---|---|
| Use Case ID | UC-07 |
| Tên Use Case | Theo dõi tiến trình tập luyện |
| Mục đích | Cho phép Member xem các số liệu phân tích về tần suất, khối lượng tập, sức mạnh, xu hướng cân nặng, và nhận cảnh báo/đề xuất từ AI khi phát hiện tình trạng chững lại (Plateau), tập quá sức (Overtraining) hoặc tập chưa đủ (Undertraining). |
| Tác nhân chính | Member |
| Tác nhân phụ | AI Analytics Engine |
| Điều kiện tiên quyết | Member đã có ít nhất 3 buổi tập được ghi nhận (UC-06). |
| Điều kiện sau cùng | Không thay đổi dữ liệu hệ thống, chỉ hiển thị thông tin (read-only), trừ khi Member chọn áp dụng đề xuất điều chỉnh kế hoạch. |
| Tần suất sử dụng | Thường xuyên, vài lần mỗi tuần. |
| Luồng chính | 1. Member truy cập màn hình Theo dõi tiến trình.<br>2. Hệ thống hiển thị Tab 1 - Tổng quan: các chỉ số KPI (số buổi tập/tuần, tổng khối lượng), bản đồ nhiệt (heatmap) ngày tập, biểu đồ tấn tạ theo thời gian.<br>3. Member chuyển sang Tab 2 - Chi tiết bài tập: chọn 1 bài tập cụ thể để xem biểu đồ xu hướng mức tạ/số lần lặp theo thời gian.<br>4. Hệ thống AI phân tích dữ liệu và phát hiện các dấu hiệu bất thường (nếu có).<br>5. Member chuyển sang Tab 3 - Đề xuất: xem các khuyến nghị điều chỉnh kế hoạch từ AI. |
| Luồng thay thế | 3a. Member xem chi tiết 1 bài tập cụ thể: Hệ thống hiển thị biểu đồ 90 ngày gần nhất và lịch sử 20 lần gần nhất.<br>2b. Member so sánh 2 khoảng thời gian: Hệ thống hiển thị song song 2 giai đoạn để đối chiếu.<br>5c. Member nhận được cảnh báo Overtraining: Member có thể chọn "Áp dụng đề xuất" (giảm tần suất) hoặc "Bỏ qua".<br>5d. Member nhận được cảnh báo Undertraining: Tương tự, Member chọn áp dụng hoặc bỏ qua đề xuất tăng cường độ.<br>2e. Member xuất báo cáo tiến trình ra PDF: Hệ thống tạo file PDF tổng hợp các biểu đồ và chỉ số. |
| Trường hợp ngoại lệ | Chưa đủ 3 buổi tập: Hệ thống hiển thị thông báo cần thêm dữ liệu kèm liên kết nhanh đến UC-06.<br>AI phân tích thất bại: Hệ thống vẫn hiển thị các biểu đồ cơ bản, chỉ ẩn Tab 3 (Đề xuất).<br>Lỗi tải biểu đồ: Hệ thống hiển thị khung chờ (placeholder) và cho phép tải lại. |
| Yêu cầu đặc biệt | Biểu đồ hiển thị mượt mà (sử dụng thư viện D3/Recharts). Thời gian tải dưới 3 giây kể cả với dữ liệu 1 năm. Giao diện responsive, hỗ trợ chế độ tối (dark mode). Có chú thích (tooltip) chi tiết trên biểu đồ. |
| Ghi chú khác | Plateau được xác định khi không có PR mới trong 28 ngày liên tục. Overtraining được xác định khi tập từ 6 ngày/tuần trở lên hoặc mức RPE trung bình trên 8.5/10 trong 2 tuần liên tiếp. Dữ liệu phân tích được cache và làm mới mỗi 24 giờ. |
| Usecase liên quan | UC-06 (Buổi tập), UC-05 (Kế hoạch tập luyện) |

---

### UC-08: Quản lý dinh dưỡng

| Mục | Nội dung |
|---|---|
| Use Case ID | UC-08 |
| Tên Use Case | Quản lý dinh dưỡng |
| Mục đích | Cho phép Member xem các sản phẩm dinh dưỡng, nhận gợi ý combo sau buổi tập hoặc tự duyệt cửa hàng, thêm vào giỏ hàng, thanh toán (có thể dùng FitCoin) và nhận hàng tại quầy. |
| Tác nhân chính | Member (Guest cũng có thể mua qua OTP) |
| Tác nhân phụ | Payment Gateway, Gym Owner/Admin (chuẩn bị đơn hàng) |
| Điều kiện tiên quyết | Member đã đăng nhập; hoặc Guest đã xác thực OTP (UC-02). |
| Điều kiện sau cùng | Đơn hàng được tạo thành công và ở trạng thái chờ nhận tại quầy. |
| Tần suất sử dụng | Trung bình, thường sau mỗi buổi tập hoặc khi cần bổ sung dinh dưỡng. |
| Luồng chính | 1. Sau khi hoàn thành buổi tập (UC-06), hệ thống hiển thị popup gợi ý 3 combo dinh dưỡng phù hợp; hoặc Member tự vào mục Cửa hàng.<br>2. Member duyệt danh sách sản phẩm, xem chi tiết thông tin dinh dưỡng.<br>3. Member thêm sản phẩm vào giỏ hàng.<br>4. Member xem lại giỏ hàng và chọn thanh toán.<br>5. Hệ thống chuyển sang luồng UC-16 (Thanh toán).<br>6. Sau khi thanh toán thành công, hệ thống tạo đơn hàng và thông báo cho Admin chuẩn bị.<br>7. Member đến quầy nhận hàng. |
| Luồng thay thế | 1a. Guest mua hàng không phải Member: Guest xác thực qua OTP (UC-02), không được sử dụng FitCoin để thanh toán.<br>2b. Sản phẩm hết hàng: Hệ thống vô hiệu hóa nút mua và cho phép đăng ký nhận thông báo khi có hàng trở lại.<br>4c. Member sử dụng điểm FitCoin để thanh toán: Hệ thống cho phép quy đổi tối đa 50% giá trị đơn hàng, tự động tính lại số tiền cần thanh toán còn lại.<br>3d. Sản phẩm có chứa thành phần Member bị dị ứng (theo hồ sơ UC-04): Hệ thống hiển thị cảnh báo màu đỏ, yêu cầu Member xác nhận vẫn muốn mua hoặc hủy. |
| Trường hợp ngoại lệ | Không có sản phẩm nào để hiển thị: Hệ thống hiển thị thông báo cửa hàng đang cập nhật.<br>Thanh toán thất bại: Giỏ hàng được giữ nguyên, Member có thể thử lại.<br>Tạo đơn hàng thất bại sau khi thanh toán: Hệ thống lưu tạm giỏ hàng, ghi log để xử lý thủ công.<br>Quá thời hạn nhận hàng 1 giờ: Đơn hàng tự động hủy và hoàn tiền. |
| Yêu cầu đặc biệt | Danh sách sản phẩm tải dưới 2 giây dù có nhiều sản phẩm. Combo gợi ý được sinh ra bởi AI dựa trên buổi tập vừa hoàn thành. Cảnh báo dị ứng phải rõ ràng, dễ nhận biết. Giỏ hàng được cache khi mất kết nối. |
| Ghi chú khác | FitCoin chỉ được dùng thanh toán tối đa 50% giá trị đơn hàng. Đơn hàng phải được nhận trong vòng 1 giờ, quá hạn sẽ tự động hủy và hoàn tiền. Danh mục sản phẩm được Admin cấu hình tại UC-13. Quy tắc nghiệp vụ BR-NUTRITION-01: Hệ thống luôn kiểm tra thông tin dị ứng của Member trước khi hiển thị cảnh báo. |
| Usecase liên quan | UC-06 (Buổi tập), UC-13 (Quản lý sản phẩm), UC-16 (Thanh toán) |

---

### UC-09: Mua hoặc thuê dụng cụ (Gear)

| Mục | Nội dung |
|---|---|
| Use Case ID | UC-09 |
| Tên Use Case | Mua hoặc thuê dụng cụ |
| Mục đích | Cho phép Member thuê trang thiết bị tập luyện (tạ tay, đai lưng,...) theo ngày kèm tiền cọc, hoặc mua đứt các phụ kiện; đảm bảo dụng cụ được hoàn trả đúng tình trạng và hoàn cọc tương ứng. |
| Tác nhân chính | Member (Guest chỉ được mua, không được thuê) |
| Tác nhân phụ | Payment Gateway, Gym Owner/Admin (bàn giao/kiểm tra hoàn trả) |
| Điều kiện tiên quyết | Member có gói Membership đang Active để thuê dụng cụ; hoặc Guest đã xác thực OTP để mua hàng. |
| Điều kiện sau cùng | Đơn thuê/mua được tạo thành công; tiền cọc bị giữ (khóa) cho đến khi hoàn trả và kiểm tra tình trạng dụng cụ. |
| Tần suất sử dụng | Thấp đến trung bình, vài lượt mỗi ngày. |
| Luồng chính | 1. Member vào mục Cửa hàng > Dụng cụ, duyệt danh sách sản phẩm.<br>2. Member xem chi tiết sản phẩm (mô tả, giá thuê/mua, mức cọc).<br>3. Member chọn hình thức Thuê (nhập số ngày, hệ thống tính tổng tiền cọc + phí thuê) hoặc Mua (nhập số lượng).<br>4. Hệ thống chuyển sang luồng UC-16 (Thanh toán).<br>5. Sau khi thanh toán, đơn hàng chờ Admin bàn giao (nếu Thuê) hoặc sẵn sàng nhận (nếu Mua).<br>6. Member nhận dụng cụ và sử dụng.<br>7. Đến hạn, Member trả dụng cụ, Admin kiểm tra tình trạng.<br>8. Hệ thống hoàn cọc (toàn phần/một phần/không hoàn) tùy theo tình trạng dụng cụ. |
| Luồng thay thế | 3a. Member thuê quá 7 ngày: Hệ thống giới hạn tối đa 7 ngày mỗi lượt thuê, Member có thể tạo đơn thuê mới sau khi kết thúc.<br>1b. Guest mua dụng cụ: Guest xác thực OTP (UC-02), chỉ được mua, không được thuê.<br>7c. Member gia hạn thời gian thuê trước khi hết hạn: Hệ thống tính thêm phí thuê và cập nhật ngày hết hạn mới (tối đa 2 lần gia hạn).<br>7d. Member trả dụng cụ sớm hơn dự kiến: Hệ thống hoàn lại phần phí thuê chưa sử dụng theo chính sách.<br>3e. Member thuê tạ tay kèm gợi ý mua thêm đai lưng: Hệ thống đề xuất combo kèm ưu đãi giảm giá 10%. |
| Trường hợp ngoại lệ | Sản phẩm hết hàng: Vô hiệu hóa nút thuê/mua, cho đăng ký nhận thông báo.<br>Thanh toán thất bại: Đơn không được tạo, Member thử lại.<br>Quá thời gian xác nhận 2 giờ không thanh toán: Đơn tự động hủy.<br>Dụng cụ bị mất hoặc hư hỏng nặng khi trả: Không hoàn cọc, có thể áp dụng phạt bổ sung theo chính sách. |
| Yêu cầu đặc biệt | Giao diện marketplace responsive. Tính tiền cọc chính xác tuyệt đối. Hiển thị đồng hồ đếm ngược thời hạn thuê. Admin có bảng điều khiển riêng theo dõi các đơn đang thuê và cảnh báo sắp đến hạn. |
| Ghi chú khác | Tiền cọc bằng 100% giá trị dụng cụ (mất/hỏng nặng sẽ không hoàn cọc). Phí thuê tính theo ngày. Mỗi Member chỉ được thuê tối đa 3 thiết bị cùng lúc, tối đa 2 lần gia hạn. Mức độ hư hỏng: nhẹ (hoàn cọc đầy đủ) / trung bình (trừ 30-50%) / nặng hoặc mất (không hoàn + có thể phạt thêm). Quy tắc nghiệp vụ BR-18: Giới hạn tối đa 3 thiết bị thuê cùng lúc trên mỗi Member. BR-GEAR-02: Lịch sử thuê được lưu vĩnh viễn phục vụ kiểm toán. |
| Usecase liên quan | UC-13 (Quản lý sản phẩm), UC-16 (Thanh toán), UC-02 (Đăng ký trải nghiệm) |

---

### UC-10: Quản lý Membership

| Mục | Nội dung |
|---|---|
| Use Case ID | UC-10 |
| Tên Use Case | Quản lý Membership |
| Mục đích | Cho phép Member gia hạn, nâng cấp gói tập, tạm ngưng (đóng băng) hoặc hủy gói Membership hiện tại của mình. |
| Tác nhân chính | Member |
| Tác nhân phụ | Payment Gateway |
| Điều kiện tiên quyết | Member đã có tài khoản với ít nhất 1 gói Membership từng được kích hoạt. |
| Điều kiện sau cùng | Trạng thái gói Membership được cập nhật (gia hạn/nâng cấp/đóng băng/hủy) và được ghi lại vào lịch sử. |
| Tần suất sử dụng | Trung bình, chủ yếu vào thời điểm gần hết hạn gói. |
| Luồng chính | 1. Member truy cập mục Tài khoản > Membership của tôi.<br>2. Hệ thống hiển thị thông tin gói hiện tại (loại gói, ngày hết hạn, trạng thái).<br>3. Member chọn hành động: Gia hạn, Nâng cấp, Đóng băng, hoặc Hủy.<br>4. Đối với Gia hạn/Nâng cấp: hệ thống tính số tiền cần thanh toán và chuyển sang UC-16.<br>5. Đối với Đóng băng: Member chọn số ngày tạm ngưng, hệ thống tự động gia hạn ngày hết hạn tương ứng (không cần Admin duyệt).<br>6. Đối với Hủy: hệ thống hiển thị cảnh báo hậu quả, Member xác nhận.<br>7. Hệ thống cập nhật trạng thái Membership và gửi thông báo xác nhận. |
| Luồng thay thế | 2a. Gói đã hết hạn: Hệ thống làm nổi bật nút Gia hạn ngay trên đầu trang.<br>2b. Gói sắp hết hạn trong vòng dưới 7 ngày: Hệ thống hiển thị trạng thái cảnh báo màu vàng kèm gợi ý gia hạn sớm.<br>2c. Gói đang ở trạng thái Đóng băng: Hệ thống hiển thị tùy chọn Hủy đóng băng (kích hoạt lại sớm) hoặc Gia hạn thêm.<br>4d. Member có mã giới thiệu chưa sử dụng: Hệ thống tự động áp dụng ưu đãi sau khi gia hạn thành công. |
| Trường hợp ngoại lệ | Thanh toán thất bại: Trạng thái gói giữ nguyên như cũ.<br>Lỗi tính toán số tiền chênh lệch khi nâng cấp: Hệ thống từ chối thao tác, yêu cầu thử lại.<br>Member yêu cầu đóng băng quá 30 ngày: Hệ thống từ chối, thông báo giới hạn tối đa.<br>Hủy gói thất bại do lỗi hệ thống: Trạng thái gói được giữ nguyên. |
| Yêu cầu đặc biệt | Hiển thị rõ ràng ngày hết hạn (kèm đếm ngược khi dưới 7 ngày). Tính toán số tiền chênh lệch khi nâng cấp phải chính xác tuyệt đối. Giao diện responsive. Tự động nhắc gia hạn trước 7 ngày. Lưu đầy đủ lịch sử thao tác. |
| Ghi chú khác | Gói Tháng: 559.000đ/30 ngày. Gói Năm: 4.800.000đ/365 ngày (tiết kiệm 50%). Nâng cấp lên gói Năm được cộng 200 FitCoin (so với 50 FitCoin của gói Tháng). Đóng băng tối đa 60 ngày/năm, thời gian đóng băng không tính vào thời hạn sử dụng. Hủy gói vẫn giữ lại dữ liệu Member (tuân thủ nguyên tắc bảo mật dữ liệu). Quy tắc nghiệp vụ BR-MEMBER-01: Gói hết hạn quá 90 ngày có thể bị xóa theo chính sách lưu trữ. BR-MEMBER-02: FitCoin được cộng tự động theo cấu hình của Admin. |
| Usecase liên quan | UC-03 (Đăng ký Membership), UC-16 (Thanh toán), UC-11 (Chia sẻ & Giới thiệu) |

---

### UC-11: Giới thiệu bạn bè & Chia sẻ

| Mục | Nội dung |
|---|---|
| Use Case ID | UC-11 |
| Tên Use Case | Giới thiệu bạn bè & Chia sẻ |
| Mục đích | Cho phép Member chia sẻ thành tích cá nhân (streak, giảm cân, kỷ lục PR) lên mạng xã hội kèm mã giới thiệu, nhận thưởng FitCoin và ưu đãi khi bạn bè đăng ký thành công qua mã giới thiệu đó. |
| Tác nhân chính | Member |
| Tác nhân phụ | Không |
| Điều kiện tiên quyết | Member đạt được một cột mốc thành tích (Milestone) được hệ thống ghi nhận. |
| Điều kiện sau cùng | Mã giới thiệu được tạo; nếu bạn bè đăng ký thành công qua mã, cả hai bên được cộng thưởng. |
| Tần suất sử dụng | Thấp, phụ thuộc vào tần suất đạt Milestone. |
| Luồng chính | 1. Member đạt một Milestone (VD: chuỗi 7 ngày tập liên tục, giảm 5kg, đạt PR mới).<br>2. Hệ thống hiển thị thông báo popup chúc mừng kèm nút Chia sẻ.<br>3. Member nhấn Chia sẻ, hệ thống tạo thẻ hình ảnh thành tích (ẩn các thông tin nhạy cảm như số điện thoại, email).<br>4. Member chọn nền tảng chia sẻ (Facebook, Zalo, WhatsApp, SMS, hoặc sao chép liên kết).<br>5. Hệ thống sinh mã giới thiệu (Referral code) có hiệu lực 90 ngày kèm theo liên kết chia sẻ.<br>6. Bạn bè nhấn vào liên kết và đăng ký Membership (UC-03) sử dụng mã giới thiệu.<br>7. Hệ thống ghi nhận giao dịch giới thiệu thành công.<br>8. Hệ thống cộng thưởng +1 tháng sử dụng và FitCoin cho cả Member giới thiệu và bạn bè được giới thiệu. |
| Luồng thay thế | 1a. Member đạt Milestone khác: Mỗi loại Milestone có mẫu thẻ chia sẻ riêng phù hợp với thành tích.<br>3b. Member tải ảnh thẻ thành tích về máy: Hệ thống xuất file ảnh để lưu hoặc đăng thủ công.<br>4c. Member sao chép liên kết thủ công: Hệ thống copy link vào clipboard.<br>1d. Member tự nhập mã giới thiệu của người khác khi đăng ký (UC-03): Hệ thống ghi nhận và xử lý thưởng tương tự.<br>2e. Member chia sẻ nhiều lần: Mỗi lần chia sẻ tạo một mã giới thiệu mới độc lập. |
| Trường hợp ngoại lệ | Tạo mã giới thiệu thất bại: Hệ thống thông báo lỗi, cho phép thử lại.<br>Bạn bè không hoàn tất đăng ký: Mã giới thiệu tự động hết hiệu lực sau 90 ngày, không phát sinh thưởng.<br>Người dùng mã giới thiệu đã từng là Member trước đó: Hệ thống từ chối áp dụng thưởng cho trường hợp này. |
| Yêu cầu đặc biệt | Thẻ chia sẻ phải rõ ràng, hấp dẫn thị giác. Các nút chia sẻ mạng xã hội hoạt động ổn định. Theo dõi (tracking) mã giới thiệu phải chính xác. Giao diện responsive trên di động. |
| Ghi chú khác | Mỗi Milestone tạo ra một mã giới thiệu riêng biệt. Mã hết hiệu lực sau 90 ngày. Thưởng chỉ được cộng một lần cho mỗi người bạn được giới thiệu. Cả hai bên (người giới thiệu và người được giới thiệu) đều nhận +1 tháng sử dụng và FitCoin. Quy tắc nghiệp vụ BR-REFERRAL-01: Bạn bè phải là người đăng ký lần đầu thông qua mã giới thiệu. BR-REFERRAL-02: Thưởng cho người giới thiệu và người được giới thiệu được ghi nhận tách biệt. |
| Usecase liên quan | UC-03 (Đăng ký Membership), UC-10 (Quản lý Membership), UC-06 (Buổi tập), UC-07 (Theo dõi tiến trình) |

---

## C. HÀNH TRÌNH QUẢN TRỊ (ADMIN JOURNEY)

### UC-12: Cấu hình phòng gym

| Mục | Nội dung |
|---|---|
| Use Case ID | UC-12 |
| Tên Use Case | Cấu hình phòng gym |
| Mục đích | Cho phép Gym Owner/Admin cấu hình thông tin cơ bản của phòng gym (tên, logo, giờ hoạt động, địa chỉ, hotline), quản lý danh sách người dùng (khóa/mở khóa tài khoản), và gửi thông báo hàng loạt. |
| Tác nhân chính | Gym Owner/Admin |
| Tác nhân phụ | Không |
| Điều kiện tiên quyết | Admin đã đăng nhập vào khu vực quản trị (Back-office) với quyền quản trị viên. |
| Điều kiện sau cùng | Thông tin cấu hình được cập nhật và áp dụng ngay trên các trang hiển thị công khai (UC-01); trạng thái tài khoản người dùng được cập nhật. |
| Tần suất sử dụng | Thấp, chủ yếu khi cần thay đổi thông tin hoặc xử lý sự cố người dùng. |
| Luồng chính | 1. Admin truy cập khu vực Back-office.<br>2. Admin chọn Tab Thông tin phòng gym: chỉnh sửa tên, logo, giờ hoạt động, địa chỉ, hotline và lưu.<br>3. Hoặc Admin chọn Tab Quản lý người dùng: tìm kiếm/lọc danh sách, chọn một người dùng để xem chi tiết.<br>4. Admin thực hiện hành động: Khóa tài khoản (nhập lý do), Mở khóa, hoặc Gửi thông báo riêng.<br>5. Hoặc Admin chọn Tab Thông báo hàng loạt: chọn nhóm đối tượng (Tất cả/Member/Trial/Đã hết hạn), soạn nội dung và gửi.<br>6. Hệ thống lưu thay đổi và áp dụng ngay lập tức. |
| Luồng thay thế | 2a. Admin tải logo mới: Hệ thống cho phép cắt/resize ảnh trước khi lưu.<br>2b. Admin cấu hình giờ hoạt động 24/7 hoặc theo khung giờ cụ thể: Hệ thống cảnh báo nếu có Member check-in ngoài khung giờ đã cấu hình.<br>5c. Admin gửi thông báo hàng loạt theo mẫu có sẵn: Hệ thống tự động điền các trường thông tin (tên Member, ngày hết hạn) vào mẫu.<br>3d. Admin xem chi tiết 1 người dùng: Hệ thống hiển thị lịch sử giao dịch, lịch sử tập luyện, trạng thái Membership. |
| Trường hợp ngoại lệ | Tải ảnh logo thất bại: Hệ thống thông báo lỗi định dạng/dung lượng.<br>Lưu cấu hình thất bại: Hệ thống giữ nguyên cấu hình cũ, thông báo lỗi.<br>Gửi thông báo hàng loạt thất bại một phần: Hệ thống ghi log các trường hợp gửi lỗi để gửi lại sau. |
| Yêu cầu đặc biệt | Giao diện quản trị responsive. Danh sách người dùng phải phân trang và tải nhanh dù có nhiều bản ghi. Log gửi thông báo phải đầy đủ, có thể tra cứu lại. |
| Ghi chú khác | Hệ thống chỉ có duy nhất 1 Admin (chính là Gym Owner) theo mô hình Single-Tenant, không có vai trò Admin phụ. Thông tin cấu hình tại đây ảnh hưởng trực tiếp đến nội dung hiển thị ở UC-01. Quy tắc nghiệp vụ BR-ADMIN-01: Admin không thể tự khóa chính tài khoản của mình. |
| Usecase liên quan | UC-01 (Khám phá dịch vụ), UC-14 (Chăm sóc hội viên) |

---

### UC-13: Quản lý sản phẩm (Gear & Dinh dưỡng)

| Mục | Nội dung |
|---|---|
| Use Case ID | UC-13 |
| Tên Use Case | Quản lý sản phẩm Gear & Dinh dưỡng |
| Mục đích | Cho phép Admin thêm/sửa/xóa sản phẩm dinh dưỡng và dụng cụ, quản lý giá bán, mức tiền cọc (đối với Gear), tồn kho và nhận cảnh báo khi hàng sắp hết. |
| Tác nhân chính | Gym Owner/Admin |
| Tác nhân phụ | Không |
| Điều kiện tiên quyết | Admin đã đăng nhập vào khu vực quản trị. |
| Điều kiện sau cùng | Danh mục sản phẩm và tồn kho được cập nhật, phản ánh ngay trên cửa hàng hiển thị cho Member (UC-08, UC-09). |
| Tần suất sử dụng | Trung bình, khi nhập hàng mới hoặc kiểm kê định kỳ. |
| Luồng chính | 1. Admin truy cập Back-office > Quản lý sản phẩm.<br>2. Admin chọn Tab Dinh dưỡng hoặc Tab Gear.<br>3. Admin chọn Thêm sản phẩm mới: nhập tên, loại, thương hiệu, hình ảnh, thông tin dinh dưỡng/thông số kỹ thuật, giá bán (và tiền cọc/phí thuê nếu là Gear), số lượng tồn kho.<br>4. Hệ thống lưu sản phẩm và hiển thị ngay trên cửa hàng.<br>5. Admin chuyển sang Tab Tồn kho để theo dõi số lượng và các cảnh báo hàng sắp hết. |
| Luồng thay thế | 3a. Admin chỉnh sửa sản phẩm đã có: Hệ thống hiển thị lại form với dữ liệu hiện tại để chỉnh sửa.<br>3b. Admin quét mã vạch để tạo Gear mới: Hệ thống dùng camera quét và tự động điền mã sản phẩm.<br>3c. Admin xóa sản phẩm: Hệ thống thực hiện xóa mềm (ẩn khỏi cửa hàng nhưng giữ dữ liệu lịch sử).<br>5d. Tồn kho xuống dưới ngưỡng cấu hình: Hệ thống tự động gửi email cảnh báo cho Admin. |
| Trường hợp ngoại lệ | Tải ảnh sản phẩm thất bại: Hệ thống báo lỗi định dạng/dung lượng.<br>Lưu sản phẩm thất bại: Hệ thống thông báo lỗi và giữ nguyên dữ liệu cũ. |
| Yêu cầu đặc biệt | Danh sách sản phẩm tải nhanh (có phân trang). Ảnh sản phẩm tự động resize và tối ưu dung lượng. Quản lý tồn kho phải chính xác theo thời gian thực. Cảnh báo hàng sắp hết gửi qua email. |
| Ghi chú khác | Admin tự cấu hình ngưỡng cảnh báo hàng sắp hết (VD: dưới 5 sản phẩm). Xóa mềm giúp Member không còn thấy sản phẩm nhưng dữ liệu lịch sử giao dịch vẫn được giữ nguyên. Dụng cụ (Gear) được theo dõi qua mã vạch/QR phục vụ kiểm toán thuê trả. Quy tắc nghiệp vụ BR-PRODUCT-01: Cần kiểm tra hình ảnh trước khi công bố sản phẩm. BR-PRODUCT-02: Giá bán phải lớn hơn tiền cọc (nếu sản phẩm có cả hai). |
| Usecase liên quan | UC-08 (Dinh dưỡng), UC-09 (Gear) |

---

### UC-14: Chăm sóc hội viên

| Mục | Nội dung |
|---|---|
| Use Case ID | UC-14 |
| Tên Use Case | Chăm sóc hội viên |
| Mục đích | Cho phép Admin truy cập danh sách hàng đợi chăm sóc (AI Care Queue) gồm các Member có nguy cơ rời bỏ (sắp hết hạn hoặc lâu không hoạt động), ưu tiên xử lý, liên hệ tư vấn và ghi nhận kết quả. |
| Tác nhân chính | Gym Owner/Admin |
| Tác nhân phụ | AI Care Engine |
| Điều kiện tiên quyết | Admin đã đăng nhập vào khu vực quản trị; hệ thống AI đã xác định được danh sách Member có nguy cơ rời bỏ. |
| Điều kiện sau cùng | Kết quả liên hệ/tư vấn được ghi nhận; Member được đưa ra khỏi hàng đợi sau khi xử lý xong. |
| Tần suất sử dụng | Hàng ngày, là công việc thường quy của Admin. |
| Luồng chính | 1. Admin truy cập Back-office > Hàng đợi chăm sóc.<br>2. Hệ thống hiển thị danh sách Member kèm lý do và mức độ ưu tiên (Cao/Trung bình/Thấp).<br>3. Admin chọn một Member trong danh sách.<br>4. Admin thực hiện liên hệ: gọi điện, gửi SMS/Email theo mẫu, hoặc bỏ qua.<br>5. Admin ghi nhận kết quả liên hệ (Thành công/Bỏ qua/Không nghe máy/Không liên hệ được) kèm ghi chú.<br>6. Hệ thống lưu kết quả và đưa Member ra khỏi hàng đợi. |
| Luồng thay thế | 3a. Admin xem chi tiết hồ sơ Member: Hệ thống hiển thị thông tin cá nhân, lịch sử tập luyện, trạng thái Membership.<br>4b. Admin gửi SMS/Email theo mẫu có sẵn: Hệ thống tự động điền nội dung dựa theo lý do Member vào hàng đợi. |
| Trường hợp ngoại lệ | Hàng đợi trống: Hệ thống hiển thị thông báo "Không có hội viên nào cần chăm sóc hôm nay".<br>Gọi điện thất bại (số sai, không liên lạc được): Hệ thống ghi nhận trạng thái tương ứng.<br>Lỗi tải dữ liệu Member: Hệ thống thông báo lỗi, cho phép thử lại. |
| Yêu cầu đặc biệt | Hàng đợi phải tải nhanh. Mẫu SMS/Email có sẵn và có thể tùy chỉnh. Ghi log chi tiết phục vụ theo dõi (audit trail). Giao diện thân thiện trên di động. |
| Ghi chú khác | AI xác định Member có nguy cơ rời bỏ hàng ngày (VD: sắp hết hạn dưới 7 ngày = ưu tiên Cao; dưới 14 ngày = Trung bình). Ghi chú tư vấn được lưu lại để phục vụ theo dõi lần sau. Quy tắc nghiệp vụ BR-CARE-01: Chỉ Admin mới được truy cập hàng đợi chăm sóc. |
| Usecase liên quan | UC-10 (Quản lý Membership), UC-12 (Cấu hình phòng gym) |

---

### UC-15: Theo dõi hoạt động kinh doanh

| Mục | Nội dung |
|---|---|
| Use Case ID | UC-15 |
| Tên Use Case | Theo dõi hoạt động kinh doanh |
| Mục đích | Cho phép Admin xem báo cáo tổng quan (doanh thu, tỷ lệ giữ chân, tỷ lệ rời bỏ, lượt check-in hàng ngày, PT nổi bật,...) và xuất báo cáo định kỳ. |
| Tác nhân chính | Gym Owner/Admin |
| Tác nhân phụ | Không |
| Điều kiện tiên quyết | Admin đã đăng nhập vào khu vực quản trị; hệ thống đã có đủ dữ liệu giao dịch/hoạt động để tổng hợp. |
| Điều kiện sau cùng | Không thay đổi dữ liệu hệ thống, chỉ hiển thị/xuất báo cáo. |
| Tần suất sử dụng | Thường xuyên, hàng tuần/hàng tháng để ra quyết định kinh doanh. |
| Luồng chính | 1. Admin truy cập Back-office > Báo cáo kinh doanh.<br>2. Hệ thống hiển thị các thẻ chỉ số KPI: Doanh thu (tháng/năm), Số hội viên đang hoạt động, Lượt check-in, Tỷ lệ giữ chân, Tỷ lệ rời bỏ.<br>3. Hệ thống hiển thị các biểu đồ: Doanh thu theo loại hình, Xu hướng giữ chân/rời bỏ (12 tháng), Check-in hàng ngày, Top 10 PT xuất sắc, Tăng trưởng hội viên mới.<br>4. Admin lọc theo khoảng thời gian (Tuần/Tháng/Quý/Năm).<br>5. Admin chọn xuất báo cáo (PDF hoặc Excel). |
| Luồng thay thế | 4a. Admin nhấn vào 1 biểu đồ để xem chi tiết (drill-down): Hệ thống hiển thị dữ liệu chi tiết hơn theo lựa chọn.<br>4b. Admin so sánh 2 khoảng thời gian: Hệ thống hiển thị song song kèm phần trăm thay đổi. |
| Trường hợp ngoại lệ | Dữ liệu đang được tổng hợp: Hệ thống hiển thị trạng thái "Đang tải dữ liệu".<br>Lỗi hiển thị biểu đồ: Hệ thống thông báo lỗi và cho phép tải lại. |
| Yêu cầu đặc biệt | Thời gian tải dưới 5 giây (dữ liệu tổng hợp được cache sẵn). Biểu đồ hiển thị mượt mà. Xuất PDF/Excel chính xác với dữ liệu hiển thị. Giao diện thân thiện trên di động. |
| Ghi chú khác | Tỷ lệ giữ chân = (Số hội viên đang hoạt động / Tổng số hội viên từng đăng ký) × 100%. Tỷ lệ rời bỏ = (Số hội viên hủy trong tháng / Tổng số hội viên trong tháng) × 100%. Dữ liệu được làm mới 1 lần mỗi đêm. Admin có thể tự cấu hình mục tiêu KPI (VD: "Mục tiêu tỷ lệ giữ chân 85%"). Quy tắc nghiệp vụ BR-ANALYTICS-01: Chỉ Admin được xem báo cáo, không chia sẻ cho vai trò khác. |
| Usecase liên quan | UC-14 (Chăm sóc hội viên), UC-16 (Thanh toán) |

---

## D. USE CASE DÙNG CHUNG (SHARED)

### UC-16: Thanh toán

| Mục | Nội dung |
|---|---|
| Use Case ID | UC-16 |
| Tên Use Case | Thanh toán |
| Mục đích | Xử lý thanh toán cho các giao dịch Membership, Gear, Dinh dưỡng và các dịch vụ khác; xác nhận đơn hàng, chọn phương thức thanh toán, chuyển hướng đến Cổng thanh toán, xác thực kết quả trả về và kích hoạt dịch vụ tương ứng. |
| Tác nhân chính | Guest/Visitor/Member (tùy ngữ cảnh) |
| Tác nhân phụ | Payment Gateway (Momo, VNPay), Gym Owner/Admin (xác nhận thanh toán tiền mặt) |
| Điều kiện tiên quyết | Đã có một đơn hàng/yêu cầu dịch vụ hợp lệ được khởi tạo từ UC-03, UC-08, UC-09 hoặc UC-10. |
| Điều kiện sau cùng | Giao dịch được ghi nhận thành công vào hệ thống; dịch vụ/đơn hàng tương ứng được kích hoạt; hóa đơn điện tử được gửi cho khách hàng. |
| Tần suất sử dụng | Hàng ngày, rất thường xuyên (là điểm chung cho mọi giao dịch có phát sinh tiền). |
| Luồng chính | 1. Hệ thống hiển thị màn hình thanh toán một trang duy nhất (One-page Checkout) tích hợp tất cả các phần: Thông tin giao nhận, Giỏ sản phẩm, và Phương thức thanh toán.<br>2. Người dùng có thể kiểm tra và trực tiếp chỉnh sửa thông tin người nhận (Họ tên, số điện thoại, địa chỉ) ngay trên trang.<br>3. Nếu là Member, hệ thống hiển thị và cho phép chọn/sử dụng FitCoin trực tiếp (khấu trừ tối đa 50% giá trị đơn).<br>4. Người dùng chọn phương thức thanh toán (Momo, VNPay, Thẻ, hoặc COD).<br>5. Người dùng nhấn nút đặt hàng để thanh toán và xác nhận đơn hàng trong cùng một trang.<br>6. Nếu tác nhân là Guest chọn hình thức COD/Thanh toán tại quầy: Hệ thống kích hoạt hiển thị Pop-up hướng dẫn quy trình thanh toán trực tiếp tại quầy FitFuel+.<br>7. Hệ thống tiến hành lưu đơn hàng, gửi SMS xác nhận đến số điện thoại người nhận trong tiến trình ngầm, đồng thời hiển thị Pop-up thông báo đặt hàng thành công trực quan trên giao diện web (thay thế cho thông báo alert của trình duyệt). |
| Luồng thay thế | 1a. Người dùng áp dụng mã giảm giá: Hệ thống kiểm tra hợp lệ và tính lại số tiền giảm.<br>2b. Người dùng đổi phương thức thanh toán: Hệ thống quay lại bước chọn phương thức.<br>3c. Người dùng sử dụng FitCoin: Bật/tắt tùy chọn, nhập số điểm muốn dùng (tối đa 50%), hệ thống tính lại tổng tiền.<br>5d. Thanh toán ngoại tuyến tại quầy: Admin quét mã QR của khách và xác nhận thanh toán ngay trên hệ thống.<br>6e. Guest xem hướng dẫn tại quầy: Pop-up hướng dẫn hiển thị chi tiết các bước và mã hướng dẫn thanh toán tại lễ tân. |
| Trường hợp ngoại lệ | Mã giảm giá không hợp lệ hoặc đã hết hạn: Hệ thống từ chối áp dụng.<br>Cổng thanh toán quá thời gian phản hồi: Hệ thống chạy tiến trình nền kiểm tra lại kết quả giao dịch mỗi 5 phút.<br>Số tiền không khớp giữa hệ thống và Cổng thanh toán: Hệ thống ghi log lỗi và yêu cầu Admin xử lý thủ công.<br>Giao dịch trùng lặp: Hệ thống kiểm tra mã giao dịch (transaction_id) và bỏ qua nếu đã tồn tại. |
| Yêu cầu đặc biệt | Tích hợp Cổng thanh toán ổn định (Momo, VNPay). Xác thực callback webhook (kiểm tra chữ ký số). Thời gian chờ tối đa 30 giây. Email biên lai chuyên nghiệp. Hỗ trợ thanh toán tốt trên trình duyệt di động. Tuân thủ tiêu chuẩn bảo mật PCI (không lưu trực tiếp thông tin thẻ, sử dụng tokenization). |
| Ghi chú khác | Momo/VNPay thường trả kết quả callback trong 1-2 phút. Thanh toán tiền mặt do Admin xác nhận thủ công. FitCoin chỉ được dùng tối đa 50% giá trị đơn theo chính sách. Mã giảm giá có thời hạn sử dụng và giới hạn số lần dùng. Lịch sử thanh toán được bảo mật, chỉ chủ tài khoản và Admin được xem. Quy tắc nghiệp vụ BR-PAYMENT-01: Từ chối giao dịch nếu số tiền nhỏ hơn hoặc bằng 0. BR-PAYMENT-02: Bỏ qua giao dịch trùng lặp trong vòng 30 giây. BR-PAYMENT-03: Callback từ Cổng thanh toán phải được ký số/mã hóa để xác thực nguồn gốc. |
| Usecase liên quan | UC-03 (Đăng ký Membership), UC-08 (Dinh dưỡng), UC-09 (Gear), UC-10 (Quản lý Membership) |

---

## TỔNG KẾT

Toàn bộ 16 Use Case đã được đặc tả chi tiết theo đúng cấu trúc chuẩn: Use Case ID, Tên, Mục đích, Tác nhân chính/phụ, Điều kiện tiên quyết/sau cùng, Tần suất sử dụng, Luồng chính, Luồng thay thế, Trường hợp ngoại lệ, Yêu cầu đặc biệt, Ghi chú khác, và Usecase liên quan.

- **A. Hành trình Khách vãng lai:** UC-01 → UC-02 → UC-03 → UC-16
- **B. Hành trình Hội viên:** UC-04 → UC-05 → UC-06 → UC-07, kèm UC-08/UC-09/UC-10/UC-11
- **C. Hành trình Quản trị:** UC-12 → UC-13 → UC-14 → UC-15
- **D. Dùng chung:** UC-16 (mọi luồng có phát sinh thanh toán đều đi qua UC-16)
