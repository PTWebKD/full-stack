# 14. MÔ HÌNH QUY TRÌNH NGHIỆP VỤ (BPMN)

> Dự án: FitFuel+
> Môn học: Web Kinh Doanh
> Ngày: 14/06/2026 (Cập nhật BR-11B: Gym Owner chỉ bán, Member chỉ cho thuê Peer-to-Peer)

========================================================================

## 3.3.1 — Quy trình quản lý và đánh giá tiến độ tập luyện
*(Quy trình Gym Tracking và Gamification)*

**1. Mô tả quy trình chi tiết**
Quy trình bắt đầu khi Hội viên (Member) truy cập ứng dụng và chọn chức năng “Tạo buổi tập mới”. Hệ thống tự động phân tích lịch sử tập luyện trong 7 ngày gần nhất nhằm đề xuất nhóm cơ phù hợp cho buổi tập hiện tại. Sau đó, Member nhập các thông tin cơ bản gồm ngày tập, nhóm cơ mục tiêu và ghi chú tùy chọn.

Sau khi xác nhận, hệ thống khởi tạo Workout Session với trạng thái “Active” và chuyển người dùng sang giao diện ghi nhận bài tập. Trong quá trình tập luyện, Member lựa chọn bài tập từ thư viện dữ liệu theo từng nhóm cơ và tiến hành nhập thông tin cho từng Set tập luyện gồm số lần lặp (Reps) và mức tạ (Weight).

Sau mỗi lần ghi nhận Set, hệ thống tự động thực hiện quy trình đánh giá thành tích tập luyện. Dữ liệu được kiểm tra nhằm phát hiện các giá trị bất thường trước khi đối chiếu với lịch sử tập luyện trước đó của Member. Nếu thành tích mới vượt qua kỷ lục cũ của bài tập tương ứng, hệ thống xác nhận Personal Record (PR), cộng thêm XP thưởng và hiển thị hiệu ứng chúc mừng ngay trên giao diện.

Member có thể tiếp tục thêm Set mới hoặc chuyển sang bài tập khác cho đến khi hoàn tất Workout Session. Khi người dùng chọn “Kết thúc buổi tập”, hệ thống tiến hành tổng hợp toàn bộ dữ liệu tập luyện, tính toán XP của Session, cập nhật chuỗi Streak hằng ngày và kiểm tra các mốc thành tựu đã đạt được.

Sau cùng, hệ thống kích hoạt quy trình AI Recommendation nhằm đề xuất các suất ăn dinh dưỡng phù hợp với nhu cầu phục hồi sau tập luyện. Workout Session được chuyển sang trạng thái “Done” và lưu vào Fitness Passport của Member.

**2. Quy tắc nghiệp vụ (Business Rules)**
* **BR-31:** Kỷ lục cá nhân (Personal Record) được tính độc lập cho từng bài tập dựa trên công thức:
  $$\text{PR} = \max(\text{weight} \times \text{reps})$$
  Nếu Set mới vượt giá trị PR hiện tại, hệ thống ghi nhận thành tích mới và kích hoạt thưởng thành tích tương ứng.
* **BR-18:** Member nhận XP dựa trên tổng khối lượng tập luyện, mức độ hoàn thành Session và thành tích PR đạt được trong buổi tập.
* **BR-20 & BR-21:** Streak tăng khi Member có ít nhất một hoạt động hợp lệ trong ngày như hoàn thành Workout Session hoặc phát sinh đơn hàng dinh dưỡng thành công. Nếu không ghi nhận hoạt động liên tiếp trong 2 ngày, hệ thống tự động reset Streak về 0.
* **BR-22:** Khi đạt các mốc Streak như 7 ngày, 30 ngày hoặc 100 ngày, hệ thống tự động mở khóa Badge, thưởng FitCoin và cập nhật hồ sơ thành tích cá nhân.
* **BR-32:** Hệ thống ưu tiên đề xuất nhóm cơ có tần suất tập thấp nhất trong 7 ngày gần nhất. Nếu nhiều nhóm cơ có cùng tần suất, hệ thống ưu tiên nhóm cơ có thời gian nghỉ lâu hơn.
* **BR-33:** Workout Session chỉ được phép chỉnh sửa hoặc xóa trong vòng 24 giờ kể từ khi hoàn tất. Sau thời gian này, dữ liệu bị khóa vĩnh viễn nhằm đảm bảo tính toàn vẹn của Fitness Passport.

**3. Tình huống ngoại lệ (Exception Handling)**
* **Dữ liệu nhập vượt ngưỡng hợp lý:** Trong trường hợp Member nhập dữ liệu vượt ngưỡng hợp lý, hệ thống sẽ hiển thị cảnh báo xác nhận trước khi cho phép lưu dữ liệu. Các dữ liệu bất thường vẫn được lưu vào lịch sử tập luyện nhưng sẽ bị loại khỏi thuật toán tính PR nhằm tránh sai lệch thành tích cá nhân.
* **Mất kết nối mạng:** Nếu xảy ra mất kết nối mạng trong lúc ghi nhận Workout Session, hệ thống sẽ tạm thời bảo toàn tiến trình tập luyện và tự động đồng bộ dữ liệu khi kết nối được khôi phục. Điều này giúp Member không bị mất dữ liệu giữa chừng.
* **Phiên đăng nhập hết hạn:** Trong trường hợp phiên đăng nhập hết hạn khi đang tập luyện, dữ liệu của Workout Session vẫn được duy trì. Sau khi đăng nhập lại, Member có thể tiếp tục Session trước đó mà không cần nhập lại dữ liệu.

========================================================================

## 3.3.2 — Quy trình tư vấn và phân phối suất ăn dinh dưỡng
*(Quy trình AI Food Recommendation và Food Delivery)*

**1. Mô tả quy trình chi tiết**
Quy trình bắt đầu khi Member hoàn thành Workout Session. Hệ thống phát sinh sự kiện “Workout Completed” và tự động kích hoạt AI Recommendation Engine nhằm đề xuất các suất ăn phù hợp với nhu cầu phục hồi sau tập luyện. Trong trường hợp người dùng là Khách vãng lai (Guest) chưa đăng nhập, hoặc Member truy cập ứng dụng nhưng chưa có dữ liệu Workout Session trong ngày, hệ thống sẽ bỏ qua bước phân tích AI. Thay vào đó, hệ thống áp dụng cơ chế gợi ý mặc định, tự động truy xuất và hiển thị trực tiếp danh sách các suất ăn bán chạy nhất hoặc thực đơn được đánh giá cao để người dùng tự do khám phá và lựa chọn.

Đầu tiên, hệ thống phân tích dữ liệu Workout Session để xác định nhóm cơ chính được tập luyện và cường độ vận động của buổi tập. Đồng thời, hệ thống đối chiếu với hồ sơ cá nhân của Member bao gồm mục tiêu thể hình, lịch sử dinh dưỡng và các thông tin dị ứng thực phẩm đã được khai báo trước đó.

Sau quá trình phân tích, hệ thống hiển thị các suất ăn được đề xuất trực tiếp trên giao diện ứng dụng. Member có thể xem thông tin chi tiết của món ăn, thêm nhanh vào giỏ hàng hoặc tiếp tục khám phá thực đơn từ các Vendor khác nhau trên nền tảng.

Khi tiến hành đặt món, khách hàng thực hiện quy trình Checkout bao gồm xác nhận giỏ hàng, nhập thông tin giao nhận và lựa chọn phương thức thanh toán. Đối với Guest chưa có tài khoản, hệ thống yêu cầu xác thực số điện thoại trước khi hoàn tất đơn hàng.

Sau khi đơn hàng được tạo thành công, hệ thống gửi thông báo đến Vendor tương ứng để xác nhận đơn. Vendor tiến hành chuẩn bị món ăn và cập nhật trạng thái vận hành của đơn hàng theo từng giai đoạn gồm “Preparing”, “Delivering” và “Delivered”.

Khi đơn hàng hoàn tất, hệ thống tự động cập nhật dữ liệu dinh dưỡng vào Macro Dashboard của Member nhằm hỗ trợ theo dõi lượng Protein, Carb và Fat tiêu thụ trong ngày.

**2. Quy tắc nghiệp vụ (Business Rules)**
* **BR-29B:** Đối với các phiên truy cập không có dữ liệu tập luyện làm cơ sở phân tích (Guest hoặc Member chưa tập), hệ thống mặc định áp dụng cơ chế gợi ý đại trà. Giao diện ưu tiên hiển thị danh sách "Best Seller" được tính toán dựa trên tổng lượt giao dịch thành công trên nền tảng, đảm bảo người dùng luôn nhận được đề xuất món ăn ngay lập tức.
* **BR-28 & BR-29:** Hệ thống sử dụng cơ chế Mapping giữa nhóm cơ tập luyện và định hướng Macro ưu tiên nhằm đề xuất các suất ăn phù hợp với nhu cầu phục hồi và phát triển cơ bắp.
* **BR-30:** Hệ thống luôn hiển thị đúng 3 món ăn đề xuất. Trong trường hợp số lượng món phù hợp không đủ, hệ thống ưu tiên bổ sung các món có Rating cao hơn.
* **BR-34:** Nếu Workout Session có nhiều nhóm cơ với khối lượng tập luyện tương đương nhau, hệ thống ưu tiên theo thứ tự: Legs → Back → Chest → Shoulders → Arms → Core.
* **BR-35:** Một giỏ hàng chỉ được chứa sản phẩm từ một Vendor duy nhất nhằm đảm bảo tính đồng nhất trong quy trình vận chuyển và giao nhận.
* **BR-36:** Đơn hàng của Guest được liên kết với số điện thoại đã xác thực. Khi Guest tạo tài khoản Member bằng cùng số điện thoại, hệ thống tự động đồng bộ lịch sử đơn hàng vào Fitness Passport.
* **BR-10:** Chức năng Quick Re-order cho phép Member đặt lại toàn bộ món ăn từ một đơn hàng cũ chỉ với một thao tác.

**3. Tình huống ngoại lệ (Exception Handling)**
* **Không tìm thấy món ăn phù hợp:** Trong trường hợp hệ thống không tìm được món ăn phù hợp với điều kiện dinh dưỡng của Member, hệ thống sẽ tự động nới lỏng tiêu chí đề xuất nhằm ưu tiên hiển thị các món ăn an toàn và phù hợp hơn. Nếu vẫn không có kết quả phù hợp, hệ thống hiển thị thông báo để người dùng tự khám phá thực đơn.
* **Vendor hết nguyên liệu:** Nếu Vendor không đủ nguyên liệu để hoàn thành đơn hàng sau khi đã xác nhận, Vendor có thể chủ động đề xuất món thay thế hoặc thực hiện hủy đơn theo yêu cầu của khách hàng. Trong trường hợp đơn hàng bị hủy, hệ thống tự động thực hiện hoàn tiền theo chính sách vận hành của nền tảng.

========================================================================

## 3.3.3 — Quy trình ký gửi, cho thuê và giao dịch thiết bị Gym
*(Quy trình Gear Hub Lifecycle)*

**1. Mô tả quy trình chi tiết**
Quy trình bắt đầu khi người dùng truy cập Gear Hub và lựa chọn chức năng đăng thiết bị lên hệ thống. Dựa trên vai trò tài khoản, hệ thống phân quyền hình thức giao dịch phù hợp cho từng nhóm người dùng.

Gym Owner chỉ được đăng thiết bị dưới hình thức “Bán đứt” (không cho thuê). Member cá nhân chỉ được đăng thiết bị dưới hình thức “Cho thuê” nhằm phục vụ mô hình chia sẻ thiết bị Peer-to-Peer (không được bán).

Người đăng cung cấp các thông tin cơ bản gồm tên thiết bị, danh mục, giá bán hoặc phí thuê, tình trạng thiết bị và hình ảnh thực tế. Sau khi xác nhận, hệ thống tiến hành định danh thiết bị, khởi tạo hồ sơ vòng đời Gear và niêm yết thiết bị trên Gear Marketplace.

Người mua hoặc người thuê có thể truy cập trang chi tiết để xem thông tin thiết bị, lịch sử sử dụng và trạng thái vòng đời trước khi tiến hành giao dịch.

Nếu giao dịch thuộc hình thức mua bán, hệ thống thực hiện quy trình thanh toán và chuyển quyền sở hữu thiết bị sang người mua mới. Đồng thời, hệ thống cập nhật trạng thái vòng đời thiết bị nhằm ghi nhận giao dịch đã hoàn tất.

Nếu giao dịch thuộc hình thức cho thuê, hệ thống giữ tiền đặt cọc và ghi nhận thời gian thuê tương ứng. Sau khi thiết bị được hoàn trả thành công và không phát sinh tranh chấp, hệ thống tiến hành hoàn cọc và cập nhật trạng thái vòng đời mới cho thiết bị.

**2. Quy tắc nghiệp vụ (Business Rules)**
* **BR-11B:** Gym Owner chỉ được đăng thiết bị dưới hình thức Bán đứt (không cho thuê). Member cá nhân chỉ được đăng thiết bị dưới hình thức Cho thuê Peer-to-Peer (không được bán).
* **BR-37:** Mọi thay đổi trạng thái của thiết bị đều phải tạo bản ghi vòng đời mới. Hệ thống không cho phép chỉnh sửa hoặc xóa lịch sử nhằm đảm bảo tính minh bạch và khả năng truy vết.
* **BR-11:** Thiết bị đăng tải bắt buộc phải có tối thiểu 2 hình ảnh thực tế để đảm bảo độ tin cậy của thông tin sản phẩm.
* **BR-12:** Mỗi thiết bị được gắn với một mã định danh duy nhất xuyên suốt toàn bộ vòng đời sử dụng, kể cả khi thay đổi chủ sở hữu.
* **BR-13:** Thiết bị cho thuê bắt buộc phải có tiền đặt cọc nhằm hạn chế rủi ro thất thoát hoặc hư hỏng trong quá trình sử dụng.
* **BR-16 & BR-17:** Hệ thống thu phí dịch vụ trên mỗi giao dịch mua bán hoặc cho thuê theo chính sách vận hành của nền tảng.

**3. Tình huống ngoại lệ (Exception Handling)**
* **Tranh chấp tình trạng thiết bị:** Trong trường hợp phát sinh tranh chấp về tình trạng thiết bị sau khi nhận hàng, người thuê có quyền gửi khiếu nại kèm hình ảnh xác thực trong khoảng thời gian quy định. Admin hệ thống sẽ tham gia kiểm tra và đưa ra quyết định xử lý phù hợp.
* **Trả thiết bị quá hạn:** Nếu người thuê trả thiết bị quá thời hạn cho phép, hệ thống tự động áp dụng cơ chế phạt dựa trên chính sách vận hành. Tùy theo mức độ vi phạm, hệ thống có thể trừ tiền cọc, hạn chế quyền thuê hoặc khóa tính năng giao dịch của tài khoản vi phạm.

========================================================================

## 3.3.4 — Quy trình thanh toán và đối soát đa kênh
*(Quy trình Payment Gateway và FitCoin Economy)*
> *(Cập nhật: 14/06/2026 — Sửa luồng FitCoin: khách chọn dùng FitCoin trước → tính hóa đơn → chọn phương thức thanh toán)*

**1. Mô tả quy trình chi tiết**
Quy trình thanh toán được kích hoạt khi người dùng thực hiện các giao dịch phát sinh chi phí trên nền tảng như đặt suất ăn dinh dưỡng, giao dịch Gear hoặc gia hạn Membership.

**Bước 1 — Áp dụng FitCoin (tùy chọn):** Tại màn hình Checkout, trước khi hiển thị hóa đơn cuối cùng, hệ thống kiểm tra số dư ví FitCoin của khách hàng và hiển thị tùy chọn "Dùng FitCoin để giảm giá". Khách hàng chủ động chọn áp dụng hoặc bỏ qua. Nếu chọn áp dụng, hệ thống tính toán số FitCoin được khấu trừ (tối đa 50% giá trị đơn hàng theo BR-27), tạm giữ số FitCoin tương ứng và cập nhật lại hóa đơn với số tiền thực tế còn lại cần thanh toán.

**Bước 2 — Xác nhận hóa đơn:** Hệ thống hiển thị hóa đơn đã tính toán đầy đủ gồm giá gốc, số FitCoin được khấu trừ (nếu có) và số tiền thực cần thanh toán qua cổng thanh toán.

**Bước 3 — Chọn phương thức thanh toán:** Sau khi xác nhận hóa đơn, khách hàng chọn phương thức thanh toán cho phần tiền còn lại (VNPay / Momo Sandbox). Hệ thống chuyển người dùng đến cổng thanh toán tương ứng để xác nhận giao dịch. Sau khi Payment Gateway phản hồi thành công, hệ thống xác nhận trừ FitCoin đã tạm giữ (nếu có), ghi nhận lịch sử biến động FitCoin, cập nhật trạng thái đơn hàng và ghi nhận lịch sử giao dịch tài chính.

Trong quá trình sử dụng hệ thống, người dùng có thể tích lũy thêm FitCoin thông qua các hoạt động như duy trì Streak, hoàn thành Challenge, giới thiệu bạn bè hoặc nhận Cashback từ giao dịch.

Khi toàn bộ quy trình hoàn tất, hệ thống hoàn thành đối soát đơn hàng và cập nhật trạng thái thanh toán.

**2. Quy tắc nghiệp vụ (Business Rules)**
* **BR-38:** Mọi phản hồi thanh toán từ Payment Gateway đều phải trải qua bước xác thực bảo mật trước khi được chấp nhận và cập nhật trạng thái giao dịch.
* **BR-39:** Hệ thống đảm bảo mỗi Transaction chỉ được xử lý thành công một lần duy nhất nhằm tránh phát sinh lỗi cộng tiền hoặc cập nhật trạng thái trùng lặp.
* **BR-23 & BR-24:** FitCoin có tỷ lệ quy đổi cố định và chỉ được sử dụng trong hệ sinh thái FitFuel+. Người dùng không được phép quy đổi FitCoin thành tiền mặt hoặc sử dụng vượt quá số dư hiện có.
* **BR-25 & BR-26:** Mọi hoạt động Earn và Spend FitCoin đều được ghi nhận vào lịch sử giao dịch nhằm đảm bảo khả năng kiểm tra và đối soát.
* **BR-27:** Người dùng chỉ được phép sử dụng tối đa 50% giá trị đơn hàng bằng FitCoin trong một giao dịch.

**3. Tình huống ngoại lệ (Exception Handling)**
* **Hủy giao dịch do hết hạn thanh toán:** Trong trường hợp người dùng khởi tạo giao dịch nhưng không hoàn tất thanh toán trong khoảng thời gian quy định, hệ thống tự động hủy giao dịch và hoàn lại số FitCoin đã tạm giữ nếu có phát sinh thanh toán kết hợp.
* **Hủy đơn hàng sau thanh toán thành công:** Nếu đơn hàng bị hủy sau khi đã thanh toán thành công, hệ thống thực hiện quy trình hoàn tiền theo chính sách vận hành của nền tảng. Trạng thái hoàn tiền được cập nhật liên tục để người dùng theo dõi tiến trình xử lý giao dịch.

========================================================================

## 3.3.5 — Quy trình Đăng ký tài khoản và Mua gói tập (Membership Onboarding)
*(Quy trình thu hút người dùng mới và chuyển đổi doanh thu)*

**1. Mô tả quy trình chi tiết**
Quy trình bắt đầu khi Khách hàng (Guest) truy cập trang chủ FitFuel+, tiến hành tham khảo thông tin và cuộn xuống bảng giá (Pricing Section). Khách hàng lựa chọn một trong hai chu kỳ thanh toán: Gói Tháng hoặc Gói Năm, sau đó nhấn nút "Đăng ký ngay".

Hệ thống lập tức hiển thị một Checkout Modal trực tiếp (không chuyển trang) ngay trên màn hình. Tại bước 1 (Account), khách hàng điền các thông tin cơ bản: Họ và tên, Email, và Mật khẩu. Hệ thống tiến hành xác thực dữ liệu ngay tại client (kiểm tra định dạng email, độ mạnh mật khẩu tối thiểu 6 ký tự). Nếu hợp lệ, hệ thống sẽ lưu tạm thông tin và chuyển tiếp sang bước 2.

Tại bước 2 (Payment), khách hàng xác nhận lại tổng tiền và chọn phương thức thanh toán (VNPay / Momo Sandbox). Khi khách hàng nhấn "Thanh toán", hệ thống backend kiểm tra xem Email này đã tồn tại trong database chưa:
* Nếu đã tồn tại: Hệ thống chặn lại và báo lỗi "Email đã được sử dụng".
* Nếu chưa: Hệ thống tạo tài khoản mới ở trạng thái `pending_payment` và khởi tạo một giao dịch thanh toán qua cổng VNPay/Momo, đồng thời điều hướng trình duyệt của khách hàng đến cổng thanh toán.

Tại cổng thanh toán, khách hàng dùng ứng dụng ngân hàng hoặc ví điện tử để quét mã QR và hoàn tất giao dịch. Cổng thanh toán sau đó sẽ gọi Webhook trả kết quả ngầm về cho hệ thống FitFuel+.

Sau khi hệ thống kiểm tra chữ ký Webhook hợp lệ và giao dịch thành công:
1. Đổi trạng thái tài khoản thành `Active`.
2. Tạo hồ sơ Fitness Passport trống (0 XP, Level 1) cho thành viên mới.
3. Cập nhật ngày hết hạn Membership (cộng thêm 1 tháng hoặc 1 năm tùy gói).

Hệ thống điều hướng trình duyệt của khách hàng tới trang "Thành công", hiển thị hiệu ứng chúc mừng và cấp nút "Vào Dashboard" để họ bắt đầu sử dụng dịch vụ.

**2. Quy tắc nghiệp vụ (Business Rules)**
* **BR-01:** Quy tắc xác thực tài khoản: Email phải đúng định dạng và chưa từng đăng ký. Mật khẩu tuân thủ yêu cầu độ dài.
* **BR-40:** Member mới chỉ được tạo qua luồng mua gói tập này (Checkout Modal). Trang `/auth/register` từ chối các đăng ký không phải của Vendor/Gym Owner.
* **BR-41:** Gói tập chỉ có 2 chu kỳ: Tháng và Năm. Gói Năm được giảm giá (tương đương 10 tháng).
* **BR-38 & BR-39:** Mọi phản hồi từ cổng thanh toán phải được kiểm tra chữ ký (HMAC) và chỉ xử lý cấp gói tập đúng 1 lần (Idempotency) dù có gọi callback nhiều lần.

**3. Tình huống ngoại lệ (Exception Handling)**
* **Hủy thanh toán giữa chừng:** Khách hàng đến cổng VNPay nhưng nhấn nút "Hủy và quay lại". Cổng thanh toán điều hướng khách hàng lại trang web với mã lỗi hủy. Hệ thống vẫn giữ lại tài khoản ở dạng `pending_payment`. Khách hàng có thể thử thanh toán lại. Nếu quá 1 ngày không thanh toán, một cron job sẽ dọn dẹp các tài khoản rác này.
* **Mất kết nối mạng:** Nếu khách hàng thanh toán xong nhưng rớt mạng chưa kịp thấy màn hình thành công, hệ thống backend qua Webhook vẫn nhận được kết quả và đã kích hoạt tài khoản. Khách hàng chỉ cần tải lại trang chủ và đăng nhập bằng email/mật khẩu vừa tạo là có thể vào Dashboard bình thường.

========================================================================
KẾT THÚC FILE 14
========================================================================
