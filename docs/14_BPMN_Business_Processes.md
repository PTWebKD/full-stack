# 14. MÔ HÌNH QUY TRÌNH NGHIỆP VỤ (BPMN)

> Dự án: FitFuel+
> Môn học: Web Kinh Doanh
> Ngày: 15/06/2026 (Tách 3.3.3 thành 3.3.3 Cho thuê Peer-to-Peer và 3.3.4 Mua bán Gym Owner)

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

## 3.3.3 — Quy trình cho thuê thiết bị Peer-to-Peer (Member ↔ Member)
*(Quy trình Gear Hub — Rental Marketplace)*

**1. Mô tả quy trình chi tiết**
Quy trình bắt đầu khi một Member có thiết bị cá nhân muốn cho thuê truy cập Gear Hub và chọn chức năng đăng thiết bị. Hệ thống xác nhận vai trò Member và chỉ hiển thị hình thức cho thuê, ẩn hoàn toàn tùy chọn bán. Member nhập thông tin thiết bị gồm tên, danh mục, đánh giá tình trạng từ 1 đến 5 sao, phí thuê theo ngày, mức đặt cọc yêu cầu và tải lên tối thiểu 2 ảnh thực tế. Sau khi xác nhận, hệ thống sinh Gear ID duy nhất, khởi tạo hồ sơ vòng đời với trạng thái đầu tiên là `listed` và niêm yết thiết bị công khai lên Gear Hub.

Ở phía người thuê, Member khác duyệt danh sách Gear Hub và lọc theo danh mục, giá hoặc tình trạng thiết bị. Khi quan tâm đến một thiết bị, Member truy cập trang chi tiết để xem mô tả, ảnh thực tế, điểm đánh giá và toàn bộ lịch sử vòng đời của thiết bị đó. Lịch sử vòng đời đảm bảo tính minh bạch về quá trình sử dụng trước đây, giúp Member đưa ra quyết định thuê có căn cứ.

Khi đã quyết định, Member chọn khoảng thời gian thuê và nhấn xác nhận. Hệ thống tính tổng phí thuê dựa trên số ngày và mức phí theo ngày, đồng thời xác định số tiền đặt cọc bắt buộc tối thiểu bằng 50% giá trị thiết bị. Hệ thống kiểm tra và từ chối nếu Member cố thuê chính thiết bị của mình. Sau khi Member hoàn tất thanh toán phí thuê và tiền cọc thông qua luồng thanh toán tại 3.3.5, hệ thống ghi nhận giao dịch, cập nhật trạng thái thiết bị thành `rented` và khóa thiết bị khỏi danh sách niêm yết trong suốt thời gian thuê.

Khi đến hạn trả, người thuê hoàn trả thiết bị và người cho thuê kiểm tra, xác nhận tình trạng. Nếu không phát sinh tranh chấp, hệ thống chuyển trạng thái giao dịch thành `completed`, hoàn trả toàn bộ tiền cọc cho người thuê, ghi nhận sự kiện `returned` vào hồ sơ vòng đời và tự động tái niêm yết thiết bị với trạng thái `relisted` để sẵn sàng cho lượt thuê tiếp theo.

**2. Quy tắc nghiệp vụ (Business Rules)**
* **BR-11B:** Chỉ Member mới được đăng thiết bị cho thuê Peer-to-Peer. Gym Owner không được tham gia luồng này. Member không được bán thiết bị.
* **BR-13:** Tiền đặt cọc bắt buộc tối thiểu bằng 50% giá trị thiết bị nhằm hạn chế rủi ro thất thoát hoặc hư hỏng trong quá trình sử dụng.
* **BR-11:** Thiết bị đăng cho thuê phải có tối thiểu 2 ảnh thực tế để đảm bảo độ tin cậy.
* **BR-12:** Mỗi thiết bị được gắn Gear ID duy nhất, bất biến xuyên suốt toàn bộ vòng đời, kể cả khi đổi tay nhiều lần.
* **BR-37:** Mọi thay đổi trạng thái đều tạo bản ghi vòng đời mới (`listed` → `rented` → `returned` → `relisted`). Lịch sử không được phép chỉnh sửa hoặc xóa.
* **BR-16 & BR-17:** Hệ thống thu phí dịch vụ trên mỗi giao dịch cho thuê theo chính sách vận hành của nền tảng.

**3. Tình huống ngoại lệ (Exception Handling)**
* **Tranh chấp tình trạng thiết bị khi hoàn trả:** Nếu người cho thuê phát hiện thiết bị bị hư hỏng khi nhận lại, họ có thể gửi khiếu nại kèm hình ảnh xác thực trong vòng 24 giờ sau khi nhận. Admin hệ thống tham gia kiểm tra, đối chiếu với ảnh tình trạng ban đầu trong vòng đời và đưa ra quyết định giữ cọc toàn phần, một phần hoặc hoàn cọc đầy đủ.
* **Trả thiết bị quá hạn:** Hệ thống tự động phát hiện khi GearTransaction quá ngày hết hạn mà chưa được xác nhận hoàn trả. Hệ thống áp dụng phí phạt theo ngày trễ, trừ trực tiếp vào tiền cọc. Nếu vi phạm nghiêm trọng, tài khoản người thuê bị hạn chế quyền thuê tiếp theo.
* **Người thuê hủy đặt thuê trước khi nhận hàng:** Tùy chính sách vận hành, tiền cọc có thể bị giữ lại một phần để bù đắp cho người cho thuê đã khóa thiết bị trong thời gian đó.

========================================================================

## 3.3.4 — Quy trình mua bán thiết bị qua Gym Owner
*(Quy trình Gear Hub — Sales Marketplace)*

**1. Mô tả quy trình chi tiết**
Quy trình bắt đầu khi Gym Owner truy cập Gear Hub và chọn chức năng “Đăng bán”. Hệ thống xác nhận vai trò và chỉ hiển thị hình thức “Bán đứt” — tùy chọn cho thuê bị ẩn hoàn toàn theo BR-11B. Gym Owner nhập thông tin sản phẩm gồm tên thiết bị, danh mục, giá bán, số lượng tồn kho và tải lên tối thiểu 2 ảnh thực tế (BR-11). Sau khi xác nhận, hệ thống sinh Gear ID duy nhất (BR-12), khởi tạo hồ sơ vòng đời với trạng thái `listed` và niêm yết thiết bị công khai trên Gear Hub.

Member duyệt danh sách Gear Hub, lọc theo danh mục, giá hoặc tên sản phẩm. Thiết bị từ Gym Owner hiển thị badge “Gym Owner · Chỉ bán” để phân biệt rõ với listing cho thuê từ Member. Member truy cập trang chi tiết sản phẩm để xem mô tả đầy đủ, thông số kỹ thuật, ảnh thực tế và mã QR định danh thiết bị. Trang chi tiết cũng cung cấp nút “Xem lịch sử” để truy xuất Gear Lifecycle, đảm bảo tính minh bạch trước khi quyết định mua.

Khi quyết định mua, Member chọn số lượng và nhấn “Add to Cart”. Hệ thống kiểm tra tồn kho tức thời; nếu đủ hàng, sản phẩm được thêm vào Gear Cart. Member tiến hành Checkout: xác nhận giỏ hàng, chọn có sử dụng FitCoin để giảm giá không (tối đa 50% giá trị đơn — BR-27), xem hóa đơn cuối và chọn phương thức thanh toán. Toàn bộ luồng thanh toán được xử lý thông qua quy trình 3.3.5.

Sau khi Payment Gateway phản hồi thành công, hệ thống xác nhận đơn hàng, trừ số lượng tồn kho của Gym Owner, ghi nhận sự kiện `sold` vào Gear Lifecycle và chuyển quyền sở hữu logic sang Member. Nếu tồn kho về 0, hệ thống tự động đánh dấu thiết bị là “Hết hàng” và ẩn khỏi danh sách niêm yết. Gym Owner nhận thông báo và có thể cập nhật lại tồn kho để tái niêm yết.

**2. Quy tắc nghiệp vụ (Business Rules)**
* **BR-11B:** Chỉ Gym Owner mới được đăng thiết bị để bán. Member không được tham gia luồng này với tư cách người bán.
* **BR-11:** Thiết bị đăng bán phải có tối thiểu 2 ảnh thực tế để đảm bảo độ tin cậy thông tin sản phẩm.
* **BR-12:** Mỗi thiết bị được gắn Gear ID duy nhất, bất biến xuyên suốt toàn bộ vòng đời.
* **BR-37:** Sự kiện `sold` được ghi vào Gear Lifecycle ngay khi giao dịch hoàn tất. Lịch sử không thể chỉnh sửa hoặc xóa.
* **BR-27:** Member được phép dùng FitCoin để thanh toán tối đa 50% giá trị đơn hàng gear.
* **BR-16 & BR-17:** Hệ thống thu phí dịch vụ trên mỗi giao dịch mua bán theo chính sách vận hành của nền tảng.

**3. Tình huống ngoại lệ (Exception Handling)**
* **Hết hàng khi Checkout:** Nếu tồn kho vừa về 0 ngay trong lúc Member đang thanh toán (race condition), hệ thống hủy giao dịch, hoàn lại FitCoin đã tạm giữ (nếu có), thông báo “Sản phẩm vừa hết hàng” và đề xuất các sản phẩm tương tự.
* **Tranh chấp sau khi nhận hàng:** Nếu Member phát hiện sản phẩm không đúng mô tả sau khi nhận, Member có thể gửi khiếu nại kèm hình ảnh trong vòng 48 giờ. Admin xem xét đối chiếu với ảnh đăng ban đầu của Gym Owner và đưa ra quyết định hoàn tiền toàn phần, một phần hoặc từ chối.
* **Gym Owner xóa listing khi đang có đơn hàng chờ xử lý:** Hệ thống chặn xóa listing khi còn đơn hàng ở trạng thái `pending`. Gym Owner phải xử lý hoặc hủy tất cả đơn tồn đọng trước khi gỡ thiết bị.

========================================================================

## 3.3.5 — Quy trình thanh toán và đối soát đa kênh
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

## 3.3.6a — Quy trình Mua gói tập Online 100% (Khách tự mua ở nhà)
*(Membership Onboarding — Luồng Online | Actors: Khách hàng · Hệ thống FitFuel+ · Payment Gateway)*

**1. Mô tả quy trình chi tiết**
Quy trình bắt đầu khi khách hàng truy cập trang chủ FitFuel+ và chọn gói tập muốn đăng ký (Tháng hoặc Năm). Hệ thống hiển thị màn hình nhập thông tin tối giản với chỉ một ô duy nhất là số điện thoại, tuyệt đối không yêu cầu Email hay Mật khẩu ở bước này nhằm loại bỏ mọi ma sát trong quá trình đăng ký.

Sau khi khách hàng nhập số điện thoại và xác nhận, hệ thống kiểm tra xem số điện thoại đó đã tồn tại trong cơ sở dữ liệu chưa. Nếu đã có tài khoản Member đang hoạt động, hệ thống chuyển sang luồng gia hạn Membership thay vì tạo tài khoản mới. Nếu số điện thoại chưa tồn tại hoặc đang ở trạng thái chờ thanh toán, hệ thống tạo bản ghi đơn hàng ở trạng thái `pending_payment` và chuyển hướng khách hàng sang cổng thanh toán.

Khách hàng thực hiện thanh toán trên giao diện của Payment Gateway thông qua một trong các phương thức được hỗ trợ gồm MoMo, VNPay QR hoặc Apple Pay. Sau khi giao dịch hoàn tất, Payment Gateway gửi callback về endpoint của FitFuel+. Hệ thống xác thực chữ ký HMAC của callback, kiểm tra tính duy nhất của giao dịch để tránh xử lý trùng lặp, sau đó tạo tài khoản Member với số điện thoại làm định danh chính, sinh mật khẩu ngẫu nhiên 6 số, kích hoạt gói tập theo chu kỳ đã chọn và khởi tạo Fitness Passport trống. Ngay lập tức, hệ thống gửi SMS đến số điện thoại của khách với nội dung xác nhận kích hoạt và mật khẩu tạm thời.

Cuối cùng, khách hàng được chuyển về Thank You Page với thông báo thành công. Trang này cũng cung cấp tùy chọn cập nhật thông tin cơ thể như chiều cao, cân nặng và mục tiêu thể hình để AI có thể cá nhân hóa gợi ý ngay từ đầu. Bước cập nhật hồ sơ này hoàn toàn tùy chọn, khách hàng có thể bỏ qua và truy cập Dashboard trực tiếp.

**2. Quy tắc nghiệp vụ (Business Rules)**
* **BR-40:** Tài khoản Member chỉ được tạo thông qua luồng mua gói tập này. Trang `/auth/register` từ chối mọi yêu cầu đăng ký không phải từ Vendor hoặc Gym Owner.
* **BR-41:** Hệ thống chỉ cung cấp 2 chu kỳ gói tập là Tháng và Năm. Gói Năm tương đương 10 tháng, tiết kiệm 2 tháng so với mua lẻ từng tháng.
* **BR-01:** Mật khẩu ban đầu của Member được hệ thống tự sinh ngẫu nhiên 6 chữ số và gửi qua SMS ngay sau khi tài khoản được tạo thành công.
* **BR-38:** Mọi callback từ Payment Gateway đều phải được xác thực chữ ký HMAC trước khi hệ thống tiến hành bất kỳ thao tác nào.
* **BR-39:** Mỗi đơn hàng Membership chỉ được kích hoạt đúng một lần dù Payment Gateway gọi callback nhiều lần.

**3. Tình huống ngoại lệ (Exception Handling)**
* **Khách hủy thanh toán giữa chừng:** Khách nhấn hủy trên cổng thanh toán, Payment Gateway redirect về FitFuel+ kèm mã lỗi hủy. Hệ thống giữ nguyên bản ghi `pending_payment` để khách có thể quay lại thử thanh toán lại. Nếu sau 24 giờ vẫn không có giao dịch thành công, cron job tự động dọn dẹp các bản ghi treo này.
* **Khách thanh toán xong nhưng rớt mạng trước khi thấy Thank You Page:** Hệ thống backend đã nhận và xử lý callback từ Payment Gateway độc lập với trình duyệt của khách. Tài khoản đã được kích hoạt và SMS đã được gửi đi. Khách chỉ cần tải lại trang và đăng nhập bằng số điện thoại cùng mật khẩu nhận qua SMS là có thể vào Dashboard bình thường.
* **Số điện thoại đã có tài khoản Member đang hoạt động:** Hệ thống không tạo tài khoản mới mà tự động chuyển sang luồng gia hạn Membership, tránh tạo tài khoản trùng lặp.
* **Khách không nhận được SMS sau khi thanh toán:** Khách hàng có thể yêu cầu gửi lại SMS hoặc liên hệ Admin để được đặt lại mật khẩu thủ công thông qua trang quên mật khẩu.

========================================================================

## 3.3.6b — Quy trình Mua gói tập Offline to Online (Tại quầy lễ tân)
*(Membership Onboarding — Luồng Offline | Actors: Khách hàng · Admin/Gym Owner · Ngân hàng · Hệ thống FitFuel+)*

**1. Mô tả quy trình chi tiết**
Quy trình bắt đầu khi khách hàng đến trực tiếp tại quầy lễ tân và yêu cầu mua gói tập. Admin truy cập màn hình POS của FitFuel+, chọn gói tập phù hợp theo yêu cầu của khách. Hệ thống tức thì sinh mã VietQR hoặc MoMo động, nhúng sẵn số tiền chính xác và mã đơn hàng định danh vào trong mã QR, đồng thời hiển thị lên màn hình POS tại quầy. Đơn hàng tương ứng được tạo ở trạng thái `pending_payment`.

Khách hàng mở ứng dụng ngân hàng trên điện thoại cá nhân, quét mã QR đang hiển thị trên màn hình POS. Ứng dụng ngân hàng tự động điền sẵn số tiền và nội dung chuyển khoản từ thông tin đã nhúng trong mã QR. Khách xác nhận và thực hiện chuyển khoản. Phía ngân hàng xử lý giao dịch và khi tiền về thành công, ngân hàng bắn Webhook thông báo về endpoint của FitFuel+.

Hệ thống tiếp nhận Webhook, xác thực chữ ký để đảm bảo tính hợp lệ của thông báo, kiểm tra idempotency để tránh xử lý trùng lặp, sau đó trích xuất thông tin khách hàng từ nội dung chuyển khoản bao gồm số điện thoại hoặc tên chủ tài khoản ngân hàng. Hệ thống tạo tài khoản Member mới với số điện thoại làm định danh chính, sinh mật khẩu ngẫu nhiên 6 số, kích hoạt gói tập theo chu kỳ Admin đã chọn và khởi tạo Fitness Passport trống. Ngay sau đó, hệ thống tự động gửi SMS đến số điện thoại của khách với thông tin đăng nhập và mật khẩu tạm thời.

Đồng thời, màn hình POS tại quầy tự động cập nhật trạng thái đơn hàng từ `pending_payment` sang `active` và hiển thị xác nhận thanh toán thành công. Admin thông báo cho khách rằng tài khoản đã được kích hoạt và hướng dẫn khách kiểm tra SMS để lấy thông tin đăng nhập.

**2. Quy tắc nghiệp vụ (Business Rules)**
* **BR-40:** Tài khoản Member chỉ được tạo sau khi Webhook xác nhận tiền đã về thành công. Hệ thống không tạo tài khoản trước khi nhận được xác nhận từ ngân hàng.
* **BR-41:** Gói tập chỉ có 2 chu kỳ là Tháng và Năm. Admin là người chọn gói trên POS theo yêu cầu của khách, không để khách tự thao tác tại quầy nhằm tránh nhầm lẫn.
* **BR-01:** Mật khẩu tạm thời 6 số được sinh ngẫu nhiên và gửi qua SMS ngay sau khi tài khoản được tạo thành công.
* **BR-38:** Webhook từ ngân hàng phải được xác thực chữ ký trước khi hệ thống thực hiện bất kỳ thao tác nào liên quan đến tài khoản hoặc gói tập.
* **BR-39:** Mỗi mã đơn hàng chỉ được xử lý kích hoạt gói tập đúng một lần dù Webhook được ngân hàng gửi lại nhiều lần.

**3. Tình huống ngoại lệ (Exception Handling)**
* **Webhook không về dù khách đã chuyển khoản thành công:** Khách cho Admin xem màn hình xác nhận chuyển khoản trên điện thoại. Admin tra cứu đơn hàng theo mã trên POS và thực hiện kích hoạt tài khoản thủ công. Giao dịch được ghi nhận với nguồn `manual_verify` để phục vụ đối soát về sau.
* **Khách không nhận được SMS sau khi giao dịch thành công:** Admin kiểm tra lại số điện thoại đã được trích xuất từ nội dung chuyển khoản có chính xác không. Nếu sai số, Admin cập nhật lại số điện thoại đúng và yêu cầu hệ thống gửi lại SMS. Nếu số đúng mà vẫn không nhận được, Admin cung cấp trực tiếp thông tin đăng nhập cho khách tại quầy.
* **Khách chuyển khoản sai số tiền:** Webhook về nhưng số tiền không khớp với mã đơn hàng. Hệ thống không kích hoạt gói tập, đánh dấu đơn hàng là `payment_mismatch` và hiển thị cảnh báo trên màn hình POS. Admin liên hệ khách để xử lý hoàn tiền hoặc bổ sung phần còn thiếu tùy từng trường hợp cụ thể.
* **Mất kết nối internet tại quầy khi đang hiển thị mã QR:** Mã QR đã được sinh và hiển thị sẵn trên màn hình nên khách vẫn có thể quét và chuyển khoản bình thường vì thông tin đã được nhúng trực tiếp vào mã. Tuy nhiên, màn hình POS sẽ không nhận được xác nhận Webhook cho đến khi kết nối internet được khôi phục. Admin ghi lại số điện thoại của khách để hệ thống tự động kích hoạt tài khoản ngay khi online trở lại.

========================================================================
KẾT THÚC FILE 14
========================================================================
