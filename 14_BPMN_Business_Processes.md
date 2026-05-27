# 14. MÔ HÌNH QUY TRÌNH NGHIỆP VỤ (BPMN)

> Dự án: FitFuel+
> Môn học: Web Kinh Doanh
> Ngày: 24/05/2026

========================================================================

## 3.3.1 — Quy trình quản lý và đánh giá tiến độ tập luyện
*(Quy trình theo dõi Gym Tracking và Gamification)*

**1. Mô tả quy trình chi tiết**
Quy trình bắt đầu khi Hội viên (Member) truy cập ứng dụng và chọn "Tạo buổi tập mới". Hệ thống yêu cầu Member chọn ngày thực hiện, nhóm cơ chính làm mục tiêu và các ghi chú tùy chọn. Sau khi xác nhận, hệ thống khởi tạo một `workout_session` mới (trạng thái: Active) và chuyển sang giao diện ghi nhận bài tập (Log Exercise).

Tại đây, Member chọn các bài tập từ thư viện dữ liệu (được phân loại theo nhóm cơ). Với mỗi bài tập được chọn, Member tiến hành nhập liệu cho từng Set, bao gồm: số lần lặp lại (Reps) và trọng lượng tạ (Weight - kg). Giao diện được thiết kế dưới dạng form động (dynamic form), cho phép thêm hoặc xóa set ngay lập tức mà không cần tải lại trang.

Mỗi khi một set được lưu, hệ thống tự động chạy thuật toán đối chiếu Personal Record (PR). Hệ thống tính toán chỉ số `weight x reps` của set vừa nhập và so sánh với giá trị cao nhất từ trước đến nay của bài tập đó trong hồ sơ cá nhân. Nếu kỷ lục bị phá, hệ thống cập nhật `is_pr = true` cho set đó, phát hiệu ứng chúc mừng trên màn hình và cộng XP (Điểm kinh nghiệm) thưởng cho Member.

Khi Member nhấn "Kết thúc buổi tập", hệ thống thực hiện chuỗi tác vụ đóng gói:
* Lưu toàn bộ dữ liệu session (tính toán tổng volume tạ đã nâng, đếm tổng số bài tập, thời lượng phiên).
* Tính toán và cộng điểm XP tổng cho buổi tập dựa trên công thức quy đổi từ tổng volume.
* Cập nhật chuỗi ngày tập liên tục (Streak) nếu đây là hoạt động đầu tiên trong ngày.
* Tự động kích hoạt quy trình AI tư vấn dinh dưỡng (BPMN 3.3.2) và hiển thị Popup gợi ý đồ ăn.

**2. Quy tắc nghiệp vụ (Business Rules)**
* **BR-31:** Quy tắc tính Personal Record (PR): Kỷ lục cá nhân được tính độc lập cho từng bài tập. Công thức: `PR = max(weight x reps)` trong toàn bộ lịch sử. Một buổi tập có thể phá nhiều PR cùng lúc.
* **BR-18:** Bảng tính XP: Quy định mức điểm XP được thưởng khi hoàn thành bài tập và phá PR.
* **BR-20 & BR-21:** Quy tắc duy trì Streak: Streak tăng 1 khi Member có ít nhất 1 hoạt động trong ngày (tập gym hoặc đặt đơn hàng healthy). Hệ thống có timer chạy ngầm (cron job) vào lúc 23:59 mỗi ngày: nếu có 2 ngày liên tiếp không ghi nhận hoạt động, Streak tự động reset về 0.
* **BR-22:** Thưởng Streak Milestone: Đạt các mốc 7, 30, 100 ngày sẽ tự động unlock Badge và thưởng FitCoin.
* **BR-32:** Gợi ý nhóm cơ (Smart Suggestion): Khi Member tạo buổi tập mới, hệ thống tự động quét lịch sử 7 ngày gần nhất. Nhóm cơ có tần suất tập thấp nhất sẽ được đề xuất tập hôm nay. Nếu tần suất bằng nhau, ưu tiên nhóm cơ có khoảng thời gian nghỉ lâu nhất.
* **BR-33:** Khóa dữ liệu Gym Session: Dữ liệu buổi tập chỉ được phép chỉnh sửa hoặc xóa trong vòng 24 giờ kể từ khi kết thúc (status = Done). Sau 24 giờ, bản ghi bị khóa vĩnh viễn để đảm bảo tính toàn vẹn của Fitness Passport.

**3. Tình huống ngoại lệ (Exception Handling)**
* **Mất kết nối mạng giữa chừng:** Khi Member đang nhập set mà bị rớt mạng, hệ thống tự động lưu dữ liệu tạm thời vào `localStorage` của trình duyệt. Khi có lại kết nối, hệ thống tự động đồng bộ (sync) dữ liệu chưa lưu lên server. Thậm chí nếu phiên đăng nhập hết hạn (JWT expired), sau khi đăng nhập lại, dữ liệu tạm này vẫn được khôi phục nguyên vẹn.
* **Nhập số liệu bất thường (Outliers):** Nếu Member vô tình nhập `weight` vượt ngưỡng 300kg hoặc `reps` vượt 200, hệ thống cảnh báo (Warning) và yêu cầu xác nhận lần 2 trước khi lưu. Dữ liệu này dù được lưu nhưng sẽ bị bỏ qua trong thuật toán tính PR để tránh sai lệch dữ liệu hệ thống.

========================================================================

## 3.3.2 — Quy trình tư vấn và phân phối suất ăn dinh dưỡng
*(Quy trình chuỗi cung ứng Food Order và AI Recommendation)*

**1. Mô tả quy trình chi tiết**
*Luồng Tư vấn AI (Push Method):*
Ngay khi Member nhấn "Kết thúc buổi tập", hệ thống chạy ngầm module AI Rule-based. Đầu tiên, hệ thống phân tích session vừa xong để tìm ra "Nhóm cơ chính" (nhóm cơ có số set tập nhiều nhất). Tiếp theo, hệ thống tra cứu bảng ánh xạ để lấy ra tỷ lệ Macro tối ưu (VD: Tập Ngực/Chest -> Yêu cầu Protein High, Carb Medium, Fat Low).

Sau đó, hệ thống chạy truy vấn lọc qua 4 bước: (1) Loại trừ món chứa thành phần Member bị dị ứng; (2) Lọc theo mục tiêu Bulk/Cut/Maintain; (3) Sắp xếp theo ưu tiên Macro đã tra cứu; (4) Xếp hạng theo Rating của Vendor. Top 3 món hoàn hảo nhất sẽ hiển thị dạng Popup ngay trên màn hình Gym Tracking. Member có thể "Thêm vào giỏ" chỉ bằng 1 lượt chạm (1-tap).

*Luồng Đặt hàng và Phân phối (Pull Method):*
Khách hàng (Guest hoặc Member) truy cập danh mục Food, thêm sản phẩm vào giỏ hàng và tiến hành Checkout 3 bước:
1. Xác nhận giỏ (cho phép thay đổi số lượng, topping trực tiếp không cần load trang).
2. Cung cấp thông tin giao nhận (Địa chỉ, khung giờ giao). *Lưu ý: Khách Guest không có tài khoản phải nhập SĐT và xác thực qua SMS OTP tại bước này.*
3. Chọn phương thức thanh toán và chốt đơn.

Khi đơn hàng tạo thành công, hệ thống chuyển đơn đến Food Vendor Portal. Vendor nhận thông báo, tiến hành xem xét và nhấn "Xác nhận". Đơn hàng chuyển sang trạng thái "Đang chuẩn bị" -> "Đang giao" -> "Đã giao". Khi hoàn tất, hệ thống tự động phân tích Macro của món ăn và cộng dồn vào Macro Dashboard trong ngày của Member.

**2. Quy tắc nghiệp vụ (Business Rules)**
* **BR-28 & BR-29:** Bảng Mapping Muscle Group -> Macro Priority và Cách Sort theo Priority: Điều hướng cốt lõi cho thuật toán AI.
* **BR-30:** Số lượng gợi ý: Hệ thống luôn trả về đúng 3 món. Nếu thiếu sẽ bù món có rating cao nhất.
* **BR-34:** Thuật toán Tie-breaking nhóm cơ: Nếu buổi tập có nhiều nhóm cơ có số set bằng nhau (VD: Fullbody), hệ thống ưu tiên các nhóm cơ lớn tiêu hao nhiều năng lượng theo thứ tự: Legs > Back > Chest > Shoulders > Arms > Core.
* **BR-35:** Độc quyền Vendor trong Giỏ hàng: Để đảm bảo quy trình vận chuyển, một giỏ hàng (Cart) chỉ được chứa sản phẩm từ một Vendor duy nhất. Nếu cố tình thêm món từ Vendor khác, hệ thống sẽ cảnh báo và yêu cầu reset giỏ hàng cũ.
* **BR-36:** Merge tài khoản khách vãng lai (Guest): Dữ liệu giỏ hàng và đơn hàng của Guest được gắn với số điện thoại. Khi Guest quyết định tạo tài khoản Member bằng chính SĐT này, toàn bộ lịch sử đơn hàng sẽ được tự động đồng bộ (merge) vào Fitness Passport mới.
* **BR-10:** Quick Re-order: Nút "Đặt lại" cho phép Member thêm toàn bộ món ăn của một đơn hàng cũ vào giỏ hiện tại.

**3. Tình huống ngoại lệ (Exception Handling)**
* **Không tìm thấy món ăn phù hợp sau khi lọc AI:** Do điều kiện lọc (dị ứng + macro) quá khắt khe khiến Database trả về 0 kết quả, hệ thống tự động nới lỏng bộ lọc (bỏ qua điều kiện macro, chỉ giữ lại điều kiện dị ứng). Nếu vẫn không có, hệ thống hủy hiển thị popup và hiện thông báo inline "Chưa có món phù hợp, vui lòng tự khám phá thực đơn".
* **Vendor thông báo hết nguyên liệu sau khi nhận đơn:** Vendor liên hệ trực tiếp người dùng qua Chat/SĐT để đề xuất món thay thế. Nếu người dùng không đồng ý và muốn hủy đơn, Vendor thao tác hủy trên hệ thống. Hệ thống lập tức hoàn 100% tiền.

========================================================================

## 3.3.3 — Quy trình ký gửi, cho thuê và bán thiết bị (Gear Hub Lifecycle)
*(Phân luồng B2C cho Gym Owner và C2C cho Member)*

**1. Mô tả quy trình chi tiết**
*Luồng Ký gửi và Định danh thiết bị:*
Khi người dùng muốn đưa thiết bị lên sàn Gear Hub, hệ thống sẽ phân nhánh quy trình dựa trên Role (Vai trò):
* Đối với Gym Owner (Tài khoản Doanh nghiệp): Được chọn cả 2 hình thức là "Bán đứt" (Sale) hoặc "Cho thuê" (Rent).
* Đối với Member (Tài khoản Cá nhân): Chỉ được phép chọn hình thức "Cho thuê" (Rent) để chia sẻ theo dạng Peer-to-Peer.

Người đăng (Seller) nhập tên, danh mục, giá/tiền cọc, và tự đánh giá tình trạng thiết bị (1-5 sao). Sau khi Submit, hệ thống chạy 4 tác vụ ngầm liên hoàn:
1. Stream toàn bộ hình ảnh lên Cloudinary (không lưu ở server gốc).
2. Sinh mã `Gear ID` duy nhất định danh (VD: GEAR-X8A2-1923).
3. Sử dụng thư viện Node.js sinh mã `QR Code` nhúng đường link truy cập của Gear ID đó, tải QR lên Cloudinary.
4. Khởi tạo bản ghi đầu tiên trong bảng `GEAR_LIFECYCLE` (Trạng thái: "Listed").
Thiết bị lập tức lên sàn giao dịch kèm QR Code.

*Luồng Chuyển quyền sở hữu (Mua/Thuê):*
Người mua truy cập sản phẩm, hệ thống hiển thị toàn bộ trục thời gian (Timeline) lịch sử vòng đời thiết bị. Họ quyết định Mua hoặc Thuê và tiến hành thanh toán.
* Nếu Mua (Chỉ thiết bị của Gym Owner): Giao dịch thành công, hệ thống chuyển trường `current_owner_id` sang người mua mới. Ghi nhận Lifecycle entry mới (Trạng thái: "Sold"). Người bán cũ nhận được tiền.
* Nếu Thuê: Hệ thống thu tiền phí thuê + tiền đặt cọc (escrow). Ghi nhận Lifecycle (Trạng thái: "Rented"). Khi đến hạn trả, nếu không có tranh chấp, hệ thống ghi nhận Lifecycle ("Returned") và giải ngân tiền cọc.

**2. Quy tắc nghiệp vụ (Business Rules)**
* **BR-11B:** Quyền đăng bán và cho thuê Gear: Giới hạn Gym Owner được Bán/Thuê, trong khi Member chỉ được Thuê.
* **BR-37:** Quy tắc Bất biến vòng đời (Append-only Lifecycle): Bảng `GEAR_LIFECYCLE` hoạt động theo cơ chế chỉ-được-thêm. Mọi thay đổi trạng thái đều phải tạo bản ghi mới. Tuyệt đối cấm thao tác UPDATE/DELETE trên các bản ghi lịch sử cũ nhằm đảm bảo tính minh bạch 100%.
* **BR-11:** Số lượng ảnh Gear: Bắt buộc tối thiểu 2 ảnh thực tế (tối đa 5MB).
* **BR-12:** Gear ID không đổi: Mã định danh đi theo thiết bị trong suốt vòng đời, không thay đổi dù đổi tay người dùng.
* **BR-13:** Tiền cọc cho thuê: Bắt buộc tối thiểu bằng 50% giá trị thiết bị (hoặc tính theo công thức đối với thiết bị chỉ thuê).
* **BR-16 & BR-17:** Cấu trúc biểu phí: Gym Owner hệ thống thu phí nền tảng 7% trên tổng giá trị giao dịch Bán, và 15% trên phí Thuê thiết bị.

**3. Tình huống ngoại lệ (Exception Handling)**
* **Trùng lặp Gear ID (Collision):** Xác suất cực kỳ thấp, nhưng nếu Gear ID ngẫu nhiên bị trùng với database, hệ thống bắt được lỗi ràng buộc UNIQUE và kích hoạt vòng lặp tự động sinh mã mới (retry tối đa 5 lần) trước khi báo lỗi cho người dùng.
* **Tranh chấp tình trạng thiết bị:** Người nhận hàng nếu thấy tình trạng thiết bị kém hơn 2 bậc so với khai báo, họ có quyền nhấn "Khiếu nại" trong vòng 24h kèm ảnh chụp. Gym Owner sẽ can thiệp phân xử, quyết định hoàn tiền (một phần/toàn phần) và đánh gậy vi phạm cho người bán.
* **BR-15:** Phí phạt trả trễ: Quá 1 ngày: Hệ thống tự trừ phạt 10% phí thuê/ngày trực tiếp vào tiền cọc. Quá 3 ngày: Gym Owner gửi cảnh báo. Quá 7 ngày: Tịch thu toàn bộ tiền cọc, khóa vĩnh viễn tính năng thuê mượn của tài khoản vi phạm.

========================================================================

## 3.3.4 — Quy trình thanh toán và đối soát đa kênh
*(Quy trình vận hành dòng tiền và FitCoin Economy)*

**1. Mô tả quy trình chi tiết**
Quy trình này vận hành bên dưới mọi giao dịch phát sinh chi phí (Mua Food, Thuê/Mua Gear, Gia hạn Membership).

*Luồng thanh toán tiền thật (VNPay/Momo Sandbox):*
Khi chọn cổng thanh toán, hệ thống khởi tạo URL thanh toán có đính kèm chữ ký bảo mật (HMAC-SHA512) và điều hướng khách hàng sang cổng. Sau khi khách thanh toán xong, cổng gọi API Webhook/Callback trả kết quả về hệ thống FitFuel+. Hệ thống kiểm tra chữ ký, nếu hợp lệ thì cập nhật trạng thái đơn thành "Đã thanh toán" và xuất thông báo.

*Luồng lưu thông FitCoin:* 
* Earn (Tạo FitCoin): Người dùng nhận FitCoin khi mời bạn bè thành công, hoàn thành Challenge, đạt Streak Milestone, hoặc nhận Cashback.
* Spend (Tiêu FitCoin): Khi thanh toán, hệ thống truy xuất số dư. Tỷ giá quy đổi cố định 1 FitCoin = 1 VNĐ. Khách hàng có thể thanh toán toàn phần bằng FitCoin, hoặc thanh toán bán phần (Trừ cạn FitCoin, phần chênh lệch yêu cầu trả qua VNPay).

**2. Quy tắc nghiệp vụ (Business Rules)**
* **BR-38:** Bảo mật Callback (Webhook Security): Mọi request trả về từ cổng thanh toán bắt buộc phải vượt qua bước giải mã và đối chiếu chữ ký HMAC. Request sai chữ ký sẽ bị từ chối lập tức.
* **BR-39:** Tính nguyên tử (Idempotency) của giao dịch: Nếu cổng thanh toán gặp lỗi mạng và gửi callback thành công nhiều lần cho cùng 1 Transaction ID, hệ thống chỉ xử lý cộng tiền/chuyển trạng thái đúng 1 lần duy nhất, tránh lỗi nhân đôi đơn.
* **BR-23 & BR-24:** Tỷ giá và Hạn chế sử dụng: 1 FitCoin = 1 VND, không được rút ra tiền mặt và không được phép âm.
* **BR-25 & BR-26:** Nguồn Earn và Spend FitCoin: Được quản lý chặt chẽ và ghi log đầy đủ.
* **BR-27:** Giới hạn sử dụng FitCoin mỗi đơn: Tối đa sử dụng 50% giá trị đơn hàng bằng FitCoin.

**3. Tình huống ngoại lệ (Exception Handling)**
* **Thanh toán Timeout:** Giao dịch được tạo nhưng khách hàng không hoàn tất thanh toán trên cổng VNPay. Sau 15 phút, hệ thống chạy cron job tự động chuyển đơn sang trạng thái "Hủy". Nếu trước đó khách có dùng FitCoin thanh toán bán phần, hệ thống tự động Refund lượng FitCoin đó về ví.
* **Hoàn tiền qua Cổng thanh toán (Gateway Refund):** Trong trường hợp cần hoàn tiền thật (ví dụ: Vendor hủy đơn), hệ thống gọi API Refund của VNPay/Momo. Khách hàng sẽ nhận được thông báo trạng thái "Đang hoàn tiền", thời gian chờ từ 3-7 ngày.

========================================================================
KẾT THÚC FILE 14
========================================================================
