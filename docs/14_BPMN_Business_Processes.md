# 14. MÔ HÌNH QUY TRÌNH NGHIỆP VỤ (BPMN)

> Dự án: FitFuel+
> Môn học: Web Kinh Doanh
> Ngày: 01/07/2026

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
Tiếp theo, đối với phần tiền còn lại, người dùng lựa chọn phương thức thanh toán online (VNPay hoặc MoMo). Hệ thống chuyển hướng người dùng sang Cổng thanh toán (Payment Gateway) và chờ phản hồi (webhook callback). Nếu giao dịch thành công, hệ thống kiểm tra tính toàn vẹn (idempotency), cập nhật trạng thái hóa đơn thành "Đã thanh toán", ghi nhận số FitCoin đã dùng và xác nhận trừ FitCoin vĩnh viễn. Trong trường hợp thanh toán thất bại hoặc hệ thống không nhận được webhook callback trong thời gian chờ (timeout), hệ thống tự động hoàn trả số FitCoin đã tạm khóa và thông báo lỗi cho người dùng.

2. Quy tắc nghiệp vụ (Business Rules)
BR-30: FitCoin chỉ được áp dụng cho Hội viên đã đăng nhập và giá trị quy đổi không được vượt quá 50% tổng giá trị đơn hàng.
BR-38: Hệ thống phải kiểm tra tính độc nhất của giao dịch (idempotency) từ webhook để tránh tình trạng cập nhật hóa đơn nhiều lần cho cùng một giao dịch.

3. Tình huống ngoại lệ (Exception Handling)
Trong trường hợp thanh toán qua cổng trực tuyến bị lỗi hoặc người dùng hủy giao dịch giữa chừng, hệ thống sẽ tự động mở khóa toàn bộ số FitCoin đã tạm giữ để Hội viên có thể sử dụng cho các lần sau.
Nếu hệ thống không nhận được webhook callback từ Cổng thanh toán trong thời gian chờ (do lỗi mạng hoặc sự cố phía cổng thanh toán), giao dịch được xử lý như thanh toán thất bại (Return: FAILED) và FitCoin đã tạm khóa được hoàn trả tự động.



### SP-02 — Xác thực OTP Guest (khách vãng lai)
1. Mô tả quy trình chi tiết
Quy trình xác thực bắt đầu khi Khách vãng lai (Guest) nhập số điện thoại để sử dụng các dịch vụ yêu cầu định danh cơ bản như mua hàng. Đầu tiên, hệ thống kiểm tra số lần yêu cầu OTP trong ngày của số điện thoại này. Nếu chưa vượt quá giới hạn cho phép, hệ thống sinh ra một mã OTP gồm 6 chữ số và gửi qua cổng tin nhắn SMS, đồng thời chuyển người dùng sang giao diện nhập mã xác thực.
Người dùng tiến hành nhập mã OTP nhận được. Hệ thống đối chiếu mã này với cơ sở dữ liệu. Nếu mã OTP chính xác và còn trong thời gian hiệu lực, hệ thống xác nhận thành công và tự động tạo một phiên làm việc (Session Token) tạm thời, cho phép Guest tiếp tục các thao tác tiếp theo. Nếu người dùng nhập sai, hệ thống cho phép thử lại tối đa 3 lần.

2. Quy tắc nghiệp vụ (Business Rules)
BR-47: Mỗi số điện thoại chỉ được yêu cầu gửi mã OTP tối đa 3 lần trong một ngày nhằm ngăn chặn hành vi spam.
BR-48: Mã OTP có hiệu lực trong vòng 10 phút kể từ khi khởi tạo, và Session Token sau khi xác thực thành công sẽ có thời hạn sử dụng trong 2 giờ.
LƯU Ý PHÂN BIỆT: SP-02 chỉ áp dụng cho Guest checkout (BR-47, TTL = 10 phút). OTP đăng ký Member (UC-01) là quy trình riêng theo BR-02 (TTL = 5 phút, khóa 15 phút sau 3 lần sai) — không dùng SP-02.

3. Tình huống ngoại lệ (Exception Handling)
Nếu người dùng nhập sai OTP vượt quá 3 lần cho phép, hệ thống sẽ tạm khóa chức năng xác thực của số điện thoại đó và yêu cầu thử lại sau.
Trong trường hợp Guest yêu cầu OTP nhưng đã vượt quá giới hạn số lần gửi SMS trong ngày, hệ thống sẽ từ chối gửi mã và hiển thị thông báo yêu cầu quay lại vào ngày hôm sau hoặc liên hệ nhân viên hỗ trợ.


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
BR-21: Member nhận XP dựa trên tổng khối lượng tập luyện, mức độ hoàn thành Session và thành tích PR đạt được trong buổi tập.
BR-23 & BR-24: Streak tăng khi Member có ít nhất một hoạt động hợp lệ trong ngày như hoàn thành Workout Session hoặc phát sinh đơn hàng dinh dưỡng thành công. Nếu không ghi nhận hoạt động liên tiếp trong 2 ngày, hệ thống tự động reset Streak về 0 (Timer kiểm tra lúc 00:05).
BR-25: Khi đạt các mốc Streak như 7 ngày, 30 ngày hoặc 100 ngày, hệ thống tự động mở khóa Badge, thưởng FitCoin và cập nhật hồ sơ thành tích cá nhân.
BR-32: Hệ thống ưu tiên đề xuất nhóm cơ có tần suất tập thấp nhất trong 7 ngày gần nhất. Nếu nhiều nhóm cơ có cùng tần suất, hệ thống ưu tiên nhóm cơ có thời gian nghỉ lâu hơn.
BR-33: Workout Session chỉ được phép chỉnh sửa hoặc xóa trong vòng 24 giờ kể từ khi hoàn tất. Sau thời gian này, dữ liệu bị khóa vĩnh viễn nhằm đảm bảo tính toàn vẹn của Fitness Passport.

3. Tình huống ngoại lệ (Exception Handling)
Trong trường hợp Member nhập dữ liệu vượt ngưỡng hợp lý, hệ thống sẽ hiển thị cảnh báo xác nhận trước khi cho phép lưu dữ liệu. Các dữ liệu bất thường vẫn được lưu vào lịch sử tập luyện nhưng sẽ bị loại khỏi thuật toán tính PR nhằm tránh sai lệch thành tích cá nhân.
Nếu xảy ra mất kết nối mạng trong lúc ghi nhận Workout Session, hệ thống sẽ tạm thời bảo toàn tiến trình tập luyện và tự động đồng bộ dữ liệu khi kết nối được khôi phục. Điều này giúp Member không bị mất dữ liệu giữa chừng.
Trong trường hợp phiên đăng nhập hết hạn khi đang tập luyện, dữ liệu của Workout Session vẫn được duy trì. Sau khi đăng nhập lại, Member có thể tiếp tục Session trước đó mà không cần nhập lại dữ liệu.



### 3.3.4 — Quy trình vòng đời hội viên (Membership Lifecycle)
1. Mô tả quy trình chi tiết
Quy trình quản lý vòng đời hội viên bao gồm các hoạt động đăng ký mới, gia hạn, chuyển đổi gói tập và bảo lưu. Đối với luồng đăng ký trực tuyến, khách hàng truy cập hệ thống, lựa chọn Gói Tháng hoặc Gói Năm, nhập số điện thoại và tiến hành thanh toán. Sau khi giao dịch thành công, hệ thống tự động khởi tạo tài khoản Member, kích hoạt gói tập, lưu trữ lịch sử đăng ký và gửi mật khẩu tạm thời qua SMS.
Khi Hội viên có nhu cầu gia hạn, họ thao tác trên hệ thống để chọn gói và thanh toán. Hệ thống sẽ tính toán ngày hết hạn mới bằng cách cộng dồn thời gian vào ngày hết hạn hiện tại (nếu gói còn hiệu lực) hoặc tính từ thời điểm hiện tại (nếu gói đã hết hạn), đồng thời thưởng thêm FitCoin để tri contemplation ân.
Nếu Hội viên đang sử dụng Gói Tháng và muốn nâng cấp sang Gói Năm, hệ thống tự động tính toán khoản phí chênh lệch dựa trên số ngày chưa sử dụng của Gói Tháng. Sau khi Hội viên thanh toán khoản phí này, hệ thống cập nhật gói tập mới.
Trong trường hợp Hội viên cần tạm ngưng tập luyện, họ gửi yêu cầu bảo lưu qua hệ thống. Quản lý phòng tập (Gym Owner) sẽ xem xét và phê duyệt. Nếu được duyệt, trạng thái gói tập sẽ chuyển sang "Tạm ngưng". Khi Hội viên quay lại kích hoạt, hệ thống sẽ cộng bù số ngày đã bảo lưu vào ngày hết hạn của gói tập.

2. Quy tắc nghiệp vụ (Business Rules)
BR-05 & BR-06: Mỗi lần gia hạn hoặc chuyển gói, hệ thống phải tạo một bản ghi mới trong lịch sử hội viên thay vì ghi đè lên dữ liệu cũ.
BR-07: Phí chuyển từ Gói Tháng sang Gói Năm được tính bằng cách lấy chênh lệch giá hai gói chia cho 30 ngày, sau đó nhân với số ngày còn lại của Gói Tháng.
BR-08: Hội viên chỉ được phép bảo lưu tối đa 1 lần trong năm, thời gian bảo lưu không quá 60 ngày và bắt buộc phải có sự phê duyệt từ Quản lý.
BR-10: Khi gói tập của Hội viên còn dưới 7 ngày, hệ thống tự động đưa vào danh sách chăm sóc (Care Queue) để nhân viên liên hệ nhắc nhở.
BR-28: Mỗi lần gia hạn thành công, Hội viên được thưởng thêm 50 FitCoin vào tài khoản.

3. Tình huống ngoại lệ (Exception Handling)
Trong quá trình chuyển đổi gói tập, nếu thời gian còn lại của Gói Tháng dưới 3 ngày, hệ thống sẽ hiển thị cảnh báo và gợi ý Hội viên nên đợi hết hạn để đăng ký gói mới thay vì đóng phí chuyển đổi nhằm tối ưu chi phí.
Nếu quá trình thanh toán gia hạn bị lỗi do sự cố mạng, giao dịch sẽ bị hủy, gói tập giữ nguyên trạng thái cũ và người dùng có thể thực hiện lại thao tác sau.


```

### 3.3.6 — Quy trình Transformation Journey Engine
1. Mô tả quy trình chi tiết
Đối với Hội viên chưa từng thiết lập mục tiêu, hệ thống yêu cầu thực hiện luồng Goal Onboarding gồm 4 bước: (B1) chọn mục tiêu tập luyện (tăng cơ/giảm mỡ/duy trì/tăng sức mạnh), (B2) nhập chỉ tiêu cụ thể và deadline, (B3) chọn số buổi tập mỗi tuần (2-5 ngày), (B4) chọn trình độ (mới bắt đầu/trung bình/nâng cao). Dựa trên các thông tin này, hệ thống AI gợi ý 2-3 chương trình tập phù hợp (BR-41); Hội viên chọn 1 chương trình để bắt đầu, hệ thống tạo mục tiêu và chương trình tương ứng.
Ở mỗi lần truy cập tính năng Journey sau đó, nếu Hội viên đã có lịch tập theo chương trình đã chọn, hệ thống hiển thị gợi ý buổi tập theo lịch (Tuần X, Buổi Y) và cho phép chọn "Tập theo chương trình" (hệ thống tự động chọn nhóm cơ theo lịch) hoặc chuyển sang tự chọn nhóm cơ. Nếu chưa có lịch tập hoặc muốn tập tự do, Hội viên tự chọn nhóm cơ muốn tập trong ngày (Chân, Ngực, Lưng - Vai, Toàn thân, hoặc Tự chọn bài tập). Ngay lập tức, hệ thống kích hoạt engine AI để tự động tạo ra một buổi tập hoàn chỉnh bao gồm danh sách các bài tập, số lượt (Sets/Reps) và mức tạ đề xuất dựa trên mục tiêu, trình độ và lịch sử tập luyện gần nhất của Hội viên. Hội viên có thể xem trước và tùy chỉnh lại chương trình như thêm, bớt bài tập hoặc thay đổi mức tạ trước khi bấm nút "Bắt đầu".
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



========================================================================
## PHÂN HỆ 2 — THƯƠNG MẠI
========================================================================

### 3.3.2 — Quy trình đặt hàng và bán Dinh dưỡng nội bộ
1. Mô tả quy trình chi tiết
Quy trình quản lý dinh dưỡng nội bộ bao gồm Member đặt trước (Pre-order) sau khi hoàn thành buổi tập và Guest tự đặt hàng online. Sau khi Member hoàn tất buổi tập, hệ thống chạy AI gợi ý 3 sản phẩm phù hợp. Member chọn sản phẩm, thanh toán online (gọi SP-01). Đối với Guest, hệ thống yêu cầu xác thực OTP (SP-02) trước khi thanh toán. Sau khi thanh toán thành công, hệ thống tạo đơn NUTRITION_ORDERS trạng thái "pending" để GymOwner chuẩn bị (qua giao diện quản lý trên web). Khi chuẩn bị xong, GymOwner chuyển trạng thái sang "ready"; sau khi khách nhận hàng, GymOwner chuyển trạng thái thành "done" và hệ thống tự động trừ tồn kho.

2. Quy tắc nghiệp vụ (Business Rules)
BR-12: Chỉ Gym Owner được quản lý bán dinh dưỡng; sản phẩm dinh dưỡng là tài sản nội bộ.
BR-13: Hệ thống tự động cập nhật tồn kho khi bán. Khi tồn kho dưới ngưỡng low_stock_threshold, hệ thống hiện cảnh báo đỏ trên dashboard.
BR-14: Combo dinh dưỡng phải có ít nhất 2 thành phần và có chiết khấu. Khi thành phần hết hàng, combo tự động ẩn (is_available = false).
BR-15 & BR-44: Hệ thống tự động gợi ý 3 sản phẩm dinh dưỡng sau buổi tập dựa trên 4 tín hiệu.

3. Tình huống ngoại lệ (Exception Handling)
Trong trường hợp Member đặt trước nhưng sản phẩm thực tế bị hết hàng, GymOwner hủy đơn và hệ thống tự động hoàn trả FitCoin/tiền đã thanh toán.
Nếu hệ thống gợi ý nhưng không còn sản phẩm nào phù hợp còn hàng, hệ thống tự động bỏ qua gợi ý.


### 3.3.3 — Quy trình Delivery & Quản lý đơn hàng
1. Mô tả quy trình chi tiết (Mô hình Hộp đen / Giả định)
* **Giả định hệ thống:** Quy trình vận chuyển vật lý (nhận hàng, đóng gói, vận chuyển trên đường) được xử lý hoàn toàn bởi đơn vị vận chuyển thứ 3 (GHN/Ahamove). Do đó, sơ đồ BPMN của FitFuel+ chỉ tập trung vào việc quản lý trạng thái đơn hàng trên Web Application và gọi luồng của bên thứ 3 dưới dạng một Hộp đen (Collapsed Subprocess có ký hiệu `+`).
* **Luồng đi:** Khi Hội viên chọn hình thức "Giao hàng" và thanh toán online thành công, Gym Owner tiến hành chuẩn bị đơn hàng. Sau khi chuẩn bị xong, Gym Owner kích hoạt Subprocess "Quy trình giao hàng bên thứ 3 (GHN/Ahamove)". Hệ thống chỉ chờ tín hiệu Webhook phản hồi từ Subprocess này để tự động cập nhật trạng thái tương ứng (shipped -> delivering -> done) mà không quản lý chi tiết luồng chạy bên trong của họ.

2. Quy tắc nghiệp vụ (Business Rules)
BR-52: Miễn phí ship khi tổng đơn (trước phí ship và FitCoin) >= 200,000 VND. Phí chuẩn: 25,000 VND. Không áp dụng cho Pickup, Membership, thuê Gear.
BR-53: Đơn Delivery bắt buộc thanh toán online (VNPay/MoMo/FitCoin tối đa 50% theo BR-30). Không COD.
BR-54: Trạng thái một chiều: pending -> preparing -> [Subprocess vận chuyển] -> done / cancelled. Webhook GHN/Ahamove tự động cập nhật từ 'shipped' trở đi.
BR-55: Chỉ được phép hủy đơn tự động khi trạng thái ở web là 'pending' hoặc 'preparing'.

3. Tình huống ngoại lệ (Exception Handling)
Nếu Subprocess giao hàng bên thứ 3 bị gián đoạn hoặc thất bại (lỗi giao hàng, thất lạc), hệ thống nhận Webhook báo lỗi hoặc Gym Owner can thiệp thủ công chuyển trạng thái về "cancelled" và kích hoạt hoàn tiền tự động.


### 3.3.7 — Quy trình Gear Marketplace
1. Mô tả quy trình chi tiết
Gear là tài sản của phòng gym (mô hình B2C — không còn hình thức Member tự đăng dụng cụ cá nhân cho người khác thuê): chỉ Gym Owner được tạo listing (bán, cho thuê, hoặc cả hai); Khách vãng lai và Hội viên chỉ đóng vai trò người mua/thuê. Khi Khách vãng lai muốn mua sản phẩm, họ chọn hàng và tiến hành thanh toán. Do chưa có tài khoản, hệ thống sẽ kích hoạt quy trình Xác thực OTP để lấy số điện thoại định danh. Sau khi xác thực thành công, hệ thống tạo hóa đơn mua hàng gắn với số điện thoại này, cập nhật tình trạng sẵn có (is_available) và hoàn tất giao dịch bán đứt.
Đối với dịch vụ cho thuê dụng cụ, tính năng này chỉ mở dành riêng cho Hội viên. Hội viên truy cập vào danh mục sản phẩm cho thuê, chọn dụng cụ và nhập khoảng thời gian mượn (tối đa 7 ngày). Hệ thống tự động tính toán tổng chi phí bao gồm tiền đặt cọc và phí thuê theo ngày. Sau khi Hội viên thanh toán thành công, trạng thái dụng cụ chuyển sang "Đang cho thuê" (is_available = false). Nếu quá thời hạn mà Hội viên chưa trả đồ, hệ thống chạy tự động mỗi ngày sẽ gửi cảnh báo quá hạn cho Hội viên và Gym Owner.

2. Quy tắc nghiệp vụ (Business Rules)
BR-11B: Gear là tài sản của phòng gym (B2C only) — chỉ Gym Owner được tạo listing; Member/Guest không được tự đăng gear của mình.
BR-47 & BR-48: Khách vãng lai bắt buộc phải xác thực số điện thoại qua OTP trước khi mua hàng, và chức năng thuê dụng cụ bị khóa hoàn toàn đối với nhóm đối tượng này.
BR-49: Hội viên chỉ được phép thuê dụng cụ tối đa 7 ngày cho mỗi lần giao dịch và không được thuê quá 3 dụng cụ cùng một thời điểm.
BR-50: Nếu trả dụng cụ trễ hạn, Hội viên sẽ bị tính phí phạt 50.000 VNĐ mỗi ngày quá hạn. Khi Hội viên trả dụng cụ, Gym Owner chọn tình trạng tương ứng (nguyên vẹn/hư nhẹ/hư nặng/mất) trên hệ thống quản lý; hệ thống tự động tính số cọc hoàn lại (100%/70%/0%) và tạo hóa đơn bồi thường nếu cần.
BR-51: Tình trạng sẵn có của từng dụng cụ (is_available) phải được cập nhật theo thời gian thực; khi một dụng cụ chuyển sang không sẵn có, hệ thống phát cảnh báo cho Gym Owner.

3. Tình huống ngoại lệ (Exception Handling)
Trong lúc Khách vãng lai thực hiện xác thực OTP, nếu số lần thử vượt quá quy định, hệ thống sẽ chặn tiến trình thanh toán, giữ nguyên giỏ hàng và yêu cầu liên hệ hỗ trợ.
Nếu một dụng cụ được Hội viên chọn thuê nhưng lại bị người khác đặt mua/thuê thành công ngay trước đó (hết hàng tại thời điểm thanh toán), hệ thống sẽ thông báo lỗi hết hàng và yêu cầu Hội viên cập nhật lại giỏ hàng.


========================================================================
## PHÂN HỆ 3 — VẬN HÀNH
========================================================================

### 3.3.5 — Quy trình AI Retention & Care Queue
1. Mô tả quy trình chi tiết
Quy trình chăm sóc và giữ chân Hội viên là sự kết hợp giữa thuật toán tự động và thao tác vận hành của nhân viên. Vào lúc 06:00 sáng mỗi ngày, hệ thống chạy ngầm một thuật toán rà soát toàn bộ danh sách Hội viên đang có gói tập kích hoạt. Hệ thống đánh giá dựa trên ngày hết hạn, tần suất check-in và lịch sử mua hàng để tự động sinh ra các chỉ thị chăm sóc (Recommendation). Ví dụ, nếu gói tập sắp hết hạn trong 7 ngày hoặc Hội viên vắng mặt trên 14 ngày, hệ thống sẽ tạo một yêu cầu chăm sóc với mức độ ưu tiên Cao (High) hoặc Trung bình (Medium) nhằm nhắc nhở gia hạn hoặc hỏi thăm tình hình. Các chỉ thị này được lưu vào cơ sở dữ liệu và phân bổ vào hàng đợi chăm sóc (Care Queue).
Tiếp nối tiến trình tự động, Quản lý hoặc nhân viên đăng nhập vào giao diện Care Queue. Hệ thống hiển thị danh sách công việc cần xử lý được sắp xếp nghiêm ngặt theo mức độ ưu tiên từ cao xuống thấp. Khi chọn một Hội viên, nhân viên có thể xem được lý do cần chăm sóc cùng các kịch bản hành động được gợi ý sẵn. Nhân viên gửi tin nhắn/email nhắc nhở cho Hội viên qua hệ thống. Sau khi hoàn tất, nhân viên bắt buộc phải bấm "Ghi nhận kết quả" và nhập nội dung tương tác (ví dụ: đã gia hạn, từ chối, không phản hồi). Hệ thống sẽ lưu lại nhật ký chăm sóc và chuyển trạng thái của chỉ thị sang "Đã xử lý".
Bên cạnh đó, quy trình cũng hỗ trợ luồng xử lý tự động từ phía Hội viên. Nếu Hội viên nhận được tin nhắn nhắc nhở và tự động gia hạn qua ứng dụng trực tuyến, hoặc tự động đi tập lại, hệ thống sẽ nhận diện sự thay đổi trạng thái này và tự động đóng các chỉ thị chăm sóc liên quan mà không cần nhân viên phải thao tác.

2. Quy tắc nghiệp vụ (Business Rules)
BR-35: Hệ thống có 6 quy tắc đánh giá để sinh chỉ thị chăm sóc, và cam kết không tạo ra các chỉ thị trùng lặp cho cùng một Hội viên trong vòng 7 ngày để tránh spam.
BR-36: Nhân viên vận hành bắt buộc phải nhập kết quả tương tác sau khi tiếp cận Hội viên để hệ thống có dữ liệu theo dõi hiệu quả.
BR-10: Các trường hợp gói tập còn dưới 7 ngày sẽ được xếp vào mức độ ưu tiên Cao. Riêng dưới 3 ngày, hệ thống tự động gửi thêm SMS nhắc nhở trực tiếp.
BR-11: Hội viên không phát sinh lượt check-in nào trong vòng 14 ngày liên tiếp sẽ được gán mức độ ưu tiên Trung bình để nhân viên gửi tin nhắn/email hỏi thăm qua hệ thống.

3. Tình huống ngoại lệ (Exception Handling)
Trong quá trình xử lý Care Queue, nếu Hội viên không phản hồi tin nhắn/email nhắc nhở, nhân viên sẽ chọn kết quả "Không liên lạc được". Hệ thống sẽ tạm đóng chỉ thị này và tự động tạo lại một yêu cầu mới sau 3 ngày.
Nếu Hội viên tự gia hạn thành công qua web ngay trong lúc nhân viên đang mở màn hình Care Queue chuẩn bị gửi tin nhắn nhắc nhở, hệ thống sẽ khóa nút "Ghi nhận" của dòng đó và tự động cập nhật trạng thái "Đã xử lý" kèm thông báo báo hiệu Hội viên đã tự thao tác để nhân viên bỏ qua.


