# **CHƯƠNG 5. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN**

## **5.1. Kết luận**

Sau quá trình triển khai, hệ thống FitFuel+ đã được đưa lên môi trường production, với toàn bộ nhóm yêu cầu chức năng được xếp ưu tiên Cao — bao gồm Authentication, Guest OTP checkout, Gym Tracking, Food Order và Vendor/Gym Portal — đều đã được hiện thực hóa và vận hành ổn định trong các kịch bản kiểm thử, không xuất hiện lỗi chặn luồng ở các nhánh nghiệp vụ chính.

Điểm đáng ghi nhận nhất về mặt kiến trúc nghiệp vụ là việc hệ thống đã khép được vòng lặp giá trị xuyên suốt ba module tưởng chừng độc lập: người dùng ghi nhận buổi tập bằng module Gym Tracking, hệ thống quy đổi nhóm cơ và mục tiêu vừa luyện tập thành gợi ý thực đơn theo cơ chế rule-based, và từ đó dẫn người dùng sang nhu cầu mua hoặc thuê thiết bị tại Gear Hub. Toàn bộ luồng liên thông này được giữ nhất quán nhờ Fitness Passport — thực thể dữ liệu trung tâm tổng hợp lịch sử tập luyện, chỉ số cơ thể và huy hiệu thành tích của từng người dùng. Bên cạnh đó, cơ chế quản lý vòng đời thiết bị (Gear Lifecycle) được thiết kế theo mô hình append-only: mỗi lượt chuyển nhượng hoặc cho thuê được ghi lại như một bản ghi mới thay vì ghi đè, qua đó minh bạch hóa toàn bộ lịch sử thiết bị mỗi khi truy vấn lại. Quy trình thanh toán dành cho khách chưa đăng ký cũng được tối giản xuống còn ba bước, giúp đơn giản hóa đáng kể trải nghiệm tại khâu thanh toán so với việc buộc phải tạo tài khoản trước khi mua hàng. Điểm nổi bật nhất mà FitFuel+ đã phát triển được là đây là một nền tảng kết hợp cả 3 mảng theo cách dữ liệu "nói chuyện" với nhau, thay vì tồn tại như các tính năng rời rạc.

Về các yêu cầu phi chức năng (NFR), hệ thống đã hiện thực đầy đủ các cơ chế bảo mật cơ bản theo đúng thiết kế ban đầu: mã hóa mật khẩu bằng bcrypt (cost factor mặc định 12), xác thực phiên đăng nhập qua JWT, cùng các lớp phòng vệ chống SQL Injection (thông qua ORM tham số hóa của SQLAlchemy) và XSS ở tầng hiển thị. Giao diện được xây dựng theo hướng responsive, hỗ trợ tốt từ độ rộng màn hình di động phổ biến trên các trình duyệt hiện đại, với quy trình checkout không vượt quá ba bước. Các chỉ số định lượng khác về thời gian tải trang và độ trễ phản hồi API chưa có báo cáo đo lường (benchmark/load-test) chính thức trong phạm vi đồ án, do đó chưa đưa vào đây làm số liệu đã đạt được.

Nhìn lại toàn bộ quá trình triển khai, có thể khẳng định FitFuel+ là một trong số rất ít sản phẩm tại thị trường Việt Nam kết hợp đồng thời ba mảng Gym Tracking, Food Order và Gear Hub theo cách dữ liệu giữa các mảng thực sự liên kết với nhau thông qua Fitness Passport, thay vì tồn tại như các ứng dụng rời rạc. Song song với đó, kiến trúc Back-office đa vai trò bao gồm Vendor Portal cho đối tác kinh doanh đồ ăn và Gym Owner Dashboard cho phòng tập cũng đã được hiện thực hóa, tạo nền tảng vận hành cho mô hình kinh doanh B2B song song với mô hình B2C hướng tới người dùng cuối.

## **5.2. Hạn chế của hệ thống**

### ***5.2.1. Thanh toán online mới ở mức mô phỏng giao diện, chưa tích hợp cổng thanh toán thật***

Các phương thức thanh toán online (MoMo, VNPay, thẻ) hiện mới được **mô phỏng hoàn toàn ở tầng Frontend** — hệ thống hiển thị mã QR minh họa và tự động chuyển sang trạng thái "thành công" sau một khoảng thời gian cố định, chứ chưa gọi đến bất kỳ API cổng thanh toán nào, kể cả ở môi trường sandbox/thử nghiệm. Lựa chọn này giúp minh họa đầy đủ luồng nghiệp vụ đặt hàng trong phạm vi đồ án, nhưng đồng nghĩa toàn bộ khâu xác thực giao dịch thật (webhook xác nhận thanh toán, đối soát, hoàn tiền) chưa được kiểm chứng trên hệ thống thật của MoMo/VNPay.

### ***5.2.2. Cơ chế gợi ý còn dừng ở mức rule-based, chưa ứng dụng Machine Learning***

Module gợi ý thực đơn hiện vận hành theo mô hình rule-based, nghĩa là hệ thống định tuyến gợi ý dựa trên một tập luật tĩnh kết hợp thuật toán di truyền (Genetic Algorithm) để tối ưu tổ hợp món ăn, đối chiếu nhóm cơ hoặc mục tiêu tập luyện với một bảng mapping cố định trong cơ sở dữ liệu. Cách tiếp cận này cho thời gian phản hồi nhanh và đủ đáp ứng yêu cầu chức năng đã đặt ra, nhưng bản chất luật tĩnh khiến hệ thống chưa thể cá nhân hóa sâu theo hành vi và lịch sử tương tác riêng của từng người dùng. Hệ thống hiện chưa triển khai collaborative filtering (khai thác mẫu hành vi của cộng đồng người dùng tương tự) hay các mô hình học máy có giám sát cho các module gợi ý còn lại (phân loại gói tập, dự báo rời bỏ), nên độ chính xác và độ "thông minh" của gợi ý bị giới hạn ở biên của tập luật được lập trình sẵn.

### ***5.2.3. Xác thực OTP chưa kết nối SMS Gateway thật***

Đối với luồng Guest checkout, mã OTP hiện được **trả trực tiếp trong response của API** (phục vụ mục đích kiểm thử kỹ thuật trong giai đoạn phát triển), thay vì được gửi qua một SMS Gateway thương mại như Twilio hay eSMS. Lựa chọn này xuất phát từ ràng buộc ngân sách triển khai gần như bằng 0 của một đồ án môn học, vốn không cho phép duy trì chi phí vận hành cho dịch vụ gửi SMS có trả phí trên mỗi lượt gửi. Hạn chế này không ảnh hưởng đến logic nghiệp vụ của luồng OTP nhưng khiến trải nghiệm hiện tại chưa phản ánh đúng một sản phẩm sẵn sàng vận hành thương mại ở góc độ trải nghiệm người dùng thật — vì mã OTP đang ở vị trí lộ ra được (response API) thay vì chỉ người nhận SMS mới biết.

### ***5.2.4. Ràng buộc từ hạ tầng triển khai free-tier***

Do toàn bộ hạ tầng được triển khai trên các gói miễn phí, dịch vụ backend lưu trú trên **Render** (Web Service free-tier) gặp hiện tượng cold start: sau một khoảng thời gian không có lượt truy cập, dịch vụ bị đưa vào trạng thái ngủ và cần vài giây để khởi động lại khi nhận request đầu tiên. Đồng thời, cơ sở dữ liệu **PostgreSQL được cấp bởi Render ở gói free-tier** cũng không có cấu hình sao lưu phân tán (replication) hay backup tự động dài hạn, nghĩa là hệ thống hiện chưa có cơ chế dự phòng tự động trong trường hợp instance chính gặp sự cố. Vì thế hạ tầng này chỉ phù hợp cho giai đoạn phát triển và kiểm thử, nhưng chưa đáp ứng các tiêu chí về độ khả dụng cần thiết cho một hệ thống vận hành thương mại liên tục.

### ***5.2.5. Một số chức năng còn ở mức mock-up hoặc chưa được nối thật từ backend vào frontend***

Bên cạnh những hạn chế về thanh toán, OTP và hạ tầng, một số chức năng được mô tả trong thiết kế nghiệp vụ vẫn còn ở mức prototype, dữ liệu giả hoặc chưa được triển khai đầy đủ trên giao diện người dùng. Cụ thể, trang Weekly Challenge hiện tại vẫn đang render dữ liệu tĩnh trong frontend thay vì gọi các endpoint thực tế để đọc danh sách thử thách, trạng thái tham gia và tiến độ hoàn thành từ cơ sở dữ liệu. Tương tự, trang Ranking Board cũng đang dùng dữ liệu mock-up nội bộ thay vì lấy dữ liệu từ endpoint leaderboard đã có sẵn ở backend, nên bảng xếp hạng hiện chưa phản ánh đúng trạng thái thực của hệ thống. Ngoài ra, các luồng thông báo theo thời gian thực như cảnh báo PR mới, cập nhật trạng thái đơn hàng trên giao diện, do đó vẫn chưa xuất hiện dưới dạng trải nghiệm người dùng thực sự. Nhìn chung, đây là một trong những điểm cần cải thiện tiếp theo để đảm bảo rằng các chức năng đã được mô tả trong tài liệu thiết kế thực sự được “đưa lên” đầy đủ cả về mặt backend, database lẫn frontend thay vì chỉ tồn tại ở mức bản thảo.

## **5.3. Hướng phát triển tiếp theo**

### ***5.3.1. Chuyển đổi kiến trúc sang ứng dụng di động bản địa***

Hướng phát triển đầu tiên là xây dựng một ứng dụng di động bản địa bằng React Native, tái sử dụng trực tiếp tầng REST API hiện có của backend mà không cần tái cấu trúc tầng nghiệp vụ. Phiên bản native cho phép bổ sung các năng lực mà ứng dụng web không thể khai thác triệt để, bao gồm thông báo đẩy (push notification) để nhắc nhở lịch tập hoặc trạng thái đơn hàng, quét mã QR trực tiếp bằng camera native khi tính năng gắn mã định danh vật lý cho Gear Lifecycle được hoàn thiện, và chế độ ghi log buổi tập không cần mạng cho các khu vực gym có đường truyền mạng không ổn định.

### ***5.3.2. Tích hợp thiết bị đeo***

Hệ thống dự kiến kết nối trực tiếp với Apple Health và Google Fit API để tự động đồng bộ hóa chỉ số sinh trắc học và lịch sử vận động của người dùng từ các thiết bị đeo thông minh. Việc này giúp giảm tối đa các thao tác nhập liệu thủ công ở module Gym Tracking, đồng thời làm tăng độ chính xác và tính liên tục của dữ liệu đầu vào cho module gợi ý.

### ***5.3.3. Nâng cấp mô hình trí tuệ nhân tạo cho module gợi ý***

Để giải quyết hạn chế mới chỉ dừng lại ở mức rule-based, hướng phát triển tiếp theo là thay thế tập luật tĩnh hiện tại bằng một mô hình khuyến nghị lai (hybrid recommendation model), kết hợp giữa collaborative filtering — khai thác lịch sử tương tác của cộng đồng người dùng có hành vi tương đồng — và content-based filtering — khai thác hồ sơ macro cá nhân của từng người dùng. Cách kết hợp này đặc biệt phù hợp để xử lý bài toán cold start, vốn là điểm yếu cố hữu của collaborative filtering thuần túy khi áp dụng cho người dùng mới chưa có lịch sử tương tác. Đây cũng là bước đệm để hiện thực hóa các module hiện mới ở dạng thiết kế (phân loại gói tập theo hồ sơ khách hàng, dự báo rời bỏ/nâng cấp) bằng các mô hình học máy có giám sát khi hệ thống tích lũy đủ dữ liệu tương tác thật.

### ***5.3.4. Chuẩn hóa hạ tầng triển khai production***

Nhằm khắc phục trực tiếp các giới hạn về cold start và độ khả dụng, hướng đi tiếp theo là ảo hóa toàn bộ backend bằng Docker và điều phối bằng Kubernetes, qua đó hệ thống có thể scale theo tải thực tế thay vì phụ thuộc vào một instance Render free-tier duy nhất. Song song với đó, cơ sở dữ liệu sẽ được di chuyển sang một cụm quản lý tập trung có cơ chế replication, ví dụ AWS RDS, để đảm bảo khả năng phục hồi khi xảy ra sự cố; tầng frontend sẽ được phân phối qua một mạng phân phối nội dung (Global CDN) để giảm độ trễ truy cập theo vùng địa lý. Việc chuẩn hóa hạ tầng ở mức này cũng là điều kiện tiên quyết để cổng thanh toán VNPay/MoMo có thể chuyển từ mức mô phỏng hiện tại sang tích hợp thật (bắt đầu từ sandbox rồi tiến tới xử lý giao dịch thật), đồng thời tạo dư địa ngân sách vận hành để tích hợp một SMS Gateway thương mại cho luồng OTP.

### ***5.3.5. Hoàn thiện hệ thống Gamification***

Phần backend của các thử thách hàng tuần (Weekly Challenge) đã được xây dựng đầy đủ (bảng CHALLENGES/USER_CHALLENGES và các API tương ứng), nhưng giao diện frontend hiện tại (`WeeklyChallengePage.jsx`) vẫn đang hiển thị dữ liệu tĩnh và **chưa kết nối tới các API này** — đây là phần việc còn lại để người dùng có thể theo dõi và tham gia thử thách dựa trên dữ liệu thật. Tương tự, Ranking Board là bảng xếp hạng thành viên theo điểm XP cũng cần được nâng cấp để cập nhật theo thời gian thực, thay vì làm mới theo chu kỳ cố định như hiện tại, nhằm tăng tính cạnh tranh và gắn kết giữa người dùng. Bên cạnh đó, nền kinh tế điểm thưởng FitCoin cần được tối ưu hóa theo hướng chống lạm phát, tức kiểm soát tốc độ phát sinh điểm từ các hoạt động trong hệ thống so với tốc độ tiêu dùng điểm tại Gear Hub, để đảm bảo giá trị của FitCoin được duy trì ổn định theo thời gian.

### ***5.3.6. Bổ sung các tính năng thời gian thực***

Cuối cùng, hệ thống dự kiến tích hợp Socket.io để xử lý các thông báo theo thời gian thực bao gồm thông báo ngay khi hệ thống phát hiện một PR (Personal Record) mới và cập nhật trạng thái đơn hàng. Việc tích hợp này nhằm thay thế cho cơ chế polling hoặc làm mới thủ công hiện tại. Đồng thời, WebRTC sẽ được tích hợp để hỗ trợ gọi video trực tuyến giữa người dùng và Huấn luyện viên cá nhân, mở rộng vai trò của Fitness Passport từ một hồ sơ dữ liệu thuần túy thành một điểm chạm trực tiếp giữa người dùng và dịch vụ huấn luyện trong hệ sinh thái FitFuel+.
