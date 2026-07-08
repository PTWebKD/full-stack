# 14. MÔ HÌNH QUY TRÌNH NGHIỆP VỤ BPMN

Tài liệu này mô tả các quy trình nghiệp vụ chính của hệ thống FitFuel+ theo hướng trải nghiệm người dùng trên web. Mỗi quy trình được trình bày theo ba phần: mô tả quy trình, quy tắc nghiệp vụ và tình huống ngoại lệ. Các bước kỹ thuật như thanh toán và xác thực OTP được tách thành quy trình dùng chung để tránh lặp lại trong từng luồng nghiệp vụ.

## 3.1. Sub-process: Xử lý thanh toán web checkout

### 3.1.1. Mô tả quy trình

Quy trình bắt đầu khi người dùng chọn mua một dịch vụ trên hệ thống FitFuel+ như gói membership, combo dinh dưỡng, bundle hoặc gói gia hạn. Tại màn hình checkout, hệ thống hiển thị đầy đủ thông tin giỏ hàng gồm tên dịch vụ, giá, ưu đãi, số FitCoin có thể sử dụng và tổng tiền cần thanh toán.

Người dùng chọn phương thức thanh toán. Nếu muốn sử dụng FitCoin, người dùng nhập số FitCoin cần áp dụng. Hệ thống kiểm tra điều kiện sử dụng FitCoin, tính lại tổng tiền và tạo giao dịch thanh toán ở trạng thái "Chờ thanh toán".

Nếu người dùng chọn thanh toán online, hệ thống chuyển thông tin sang cổng thanh toán. Sau khi cổng thanh toán xử lý giao dịch, kết quả được gửi ngược về FitFuel+ thông qua callback. Nếu thanh toán thành công, hệ thống cập nhật hóa đơn sang trạng thái "Đã thanh toán", kích hoạt dịch vụ tương ứng và hiển thị trang xác nhận cho người dùng.

Nếu người dùng chọn thanh toán tại quầy, hệ thống ghi nhận yêu cầu, hiển thị hướng dẫn thanh toán tại phòng tập và chỉ kích hoạt dịch vụ sau khi nhân viên xác nhận đã nhận tiền.

### 3.1.2. Quy tắc nghiệp vụ

a. Quy tắc về giỏ hàng và thanh toán:

Giỏ hàng phải hiển thị rõ từng thành phần: gói tập, sản phẩm dinh dưỡng, dịch vụ đi kèm, ưu đãi và tổng tiền cuối cùng.

Mỗi giao dịch thanh toán phải có mã giao dịch duy nhất để tránh cập nhật trùng khi cổng thanh toán gửi callback nhiều lần.

b. Quy tắc về FitCoin:

FitCoin chỉ được áp dụng cho người dùng đã đăng nhập và không được vượt quá giới hạn giảm giá do hệ thống cấu hình.

Khi thanh toán thất bại, số FitCoin đã tạm giữ phải được hoàn lại cho người dùng.

c. Quy tắc sau thanh toán:

Sau khi thanh toán thành công, hệ thống phải kích hoạt đúng dịch vụ đã mua, cập nhật hóa đơn và ghi nhận lịch sử giao dịch.

Đối với sản phẩm dinh dưỡng, hệ thống phải trừ tồn kho. Đối với dịch vụ có số lượng giới hạn như trial, booking hoặc thuê thiết bị, hệ thống phải trừ số lượng khả dụng tương ứng.

### 3.1.3. Tình huống ngoại lệ

a. Thanh toán thất bại:

Mô tả: Người dùng thanh toán không thành công do lỗi thẻ, ví điện tử, ngân hàng hoặc cổng thanh toán.

Xử lý: Hệ thống giữ dịch vụ ở trạng thái chưa kích hoạt, hiển thị thông báo lỗi và cho phép người dùng thử lại hoặc đổi phương thức thanh toán.

b. Callback thanh toán bị gửi lặp:

Mô tả: Cổng thanh toán gửi nhiều callback cho cùng một giao dịch.

Xử lý: Hệ thống kiểm tra mã giao dịch. Nếu giao dịch đã được xử lý thành công trước đó, hệ thống không cập nhật lặp và chỉ ghi log callback.

c. Sản phẩm hoặc slot hết trong lúc thanh toán:

Mô tả: Sản phẩm dinh dưỡng hoặc slot booking hết trước khi thanh toán hoàn tất.

Xử lý: Hệ thống thông báo cho người dùng, hoàn lại thanh toán nếu đã thu tiền và đề xuất sản phẩm hoặc slot thay thế.

## 3.2. Sub-process: Xác thực OTP Guest

### 3.2.1. Mô tả quy trình

Quy trình bắt đầu khi khách truy cập chưa có tài khoản muốn đặt gym tour, nhận Free Trial Pass hoặc thực hiện một thao tác nhẹ trên hệ thống. Người dùng nhập số điện thoại, sau đó hệ thống kiểm tra giới hạn gửi OTP trong ngày.

Nếu số điện thoại còn lượt yêu cầu OTP, hệ thống tạo mã OTP, lưu thông tin xác thực và gửi mã qua SMS. Người dùng nhập mã OTP lên giao diện web. Hệ thống kiểm tra mã có đúng và còn hiệu lực hay không.

Nếu OTP hợp lệ, hệ thống tạo phiên Guest tạm thời để người dùng tiếp tục đặt lịch hoặc hoàn tất luồng đăng ký. Nếu OTP không hợp lệ, hệ thống báo lỗi và cho phép nhập lại khi vẫn còn lượt thử.

### 3.2.2. Quy tắc nghiệp vụ

a. Quy tắc gửi OTP:

Mỗi số điện thoại chỉ được yêu cầu OTP tối đa 3 lần trong một ngày.

OTP có hiệu lực trong 10 phút kể từ thời điểm được gửi.

b. Quy tắc xác thực:

Người dùng chỉ được xác thực thành công khi nhập đúng OTP còn hạn.

Phiên Guest sau OTP chỉ dùng cho các thao tác nhẹ như đặt tour, đặt trial hoặc xem trạng thái booking, không thay thế tài khoản Member chính thức.

c. Quy tắc bảo mật:

Hệ thống phải ghi nhận số lần nhập sai OTP để hạn chế thử mã liên tục.

Thông tin OTP phải được lưu ở dạng an toàn, không hiển thị lại mã OTP cho người dùng hoặc nhân viên.

### 3.2.3. Tình huống ngoại lệ

a. Vượt giới hạn gửi OTP:

Mô tả: Một số điện thoại yêu cầu OTP quá số lần cho phép trong ngày.

Xử lý: Hệ thống từ chối gửi OTP mới và thông báo thời điểm có thể thử lại.

b. OTP hết hạn:

Mô tả: Người dùng nhập OTP sau khi mã đã quá thời gian hiệu lực.

Xử lý: Hệ thống báo mã hết hạn và cho phép gửi lại OTP nếu chưa vượt giới hạn trong ngày.

c. Gửi SMS thất bại:

Mô tả: SMS Gateway không gửi được OTP do lỗi nhà mạng hoặc dịch vụ.

Xử lý: Hệ thống thông báo lỗi, ghi log sự cố và cho phép người dùng thử lại sau một khoảng thời gian ngắn.

## 3.3.1. Quy trình khám phá dịch vụ, chọn mục tiêu và đặt trial/gym tour

### 3.3.1.1. Mô tả quy trình

Quy trình bắt đầu khi khách truy cập vào landing page của FitFuel+. Thay vì chỉ xem bảng giá, người dùng được dẫn qua một luồng khảo sát ngắn gồm mục tiêu tập luyện, mức kinh nghiệm, rào cản cá nhân, khung giờ mong muốn và mức độ sẵn sàng mua gói.

Sau khi người dùng hoàn tất khảo sát, hệ thống phân tích thông tin và hiển thị các lựa chọn phù hợp như đặt lịch tham quan phòng tập, nhận Free Trial Pass 7 ngày, xem khung giờ ít đông hoặc tham khảo gói membership được gợi ý.

Nếu người dùng muốn đặt tour hoặc nhận trial, hệ thống yêu cầu đăng nhập hoặc xác thực OTP nếu là Guest. Sau khi xác thực thành công, hệ thống kiểm tra slot còn trống, tạo booking hoặc kích hoạt trial, sau đó gửi thông báo xác nhận cho người dùng.

Nếu người dùng chưa sẵn sàng tiếp tục, hệ thống lưu thông tin lead ở trạng thái chưa hoàn tất để có thể nhắc lại trong giới hạn cho phép.

### 3.3.1.2. Quy tắc nghiệp vụ

a. Quy tắc về quyền truy cập:

Visitor được phép xem thông tin dịch vụ, khung giờ ít đông và gợi ý gói cơ bản mà không cần đăng nhập.

Để đặt gym tour hoặc nhận Free Trial Pass, người dùng phải đăng nhập hoặc xác thực OTP.

b. Quy tắc về gợi ý:

Gợi ý gói tập không được mặc định là gói đắt nhất, mà phải dựa trên mục tiêu, kinh nghiệm, rào cản và nhu cầu của người dùng.

Nếu người dùng chọn "chưa sẵn sàng mua", hệ thống phải đề xuất gym tour, Free Trial Pass hoặc quiet-hour booking thay vì kết thúc luồng.

c. Quy tắc về Free Trial Pass:

Free Trial Pass có giá 0 VND, hiệu lực 7 ngày từ ngày kích hoạt.

Mỗi số điện thoại hoặc email chỉ được nhận trial một lần. Người dùng đã từng có membership active hoặc đã từng dùng trial không được nhận lại trial.

### 3.3.1.3. Tình huống ngoại lệ

a. Slot booking đã đầy:

Mô tả: Slot được chọn hết chỗ trong lúc người dùng đang đặt lịch.

Xử lý: Hệ thống thông báo slot không còn khả dụng và hiển thị các slot thay thế gần nhất.

b. Xác thực OTP thất bại:

Mô tả: Người dùng nhập sai OTP hoặc OTP hết hạn.

Xử lý: Hệ thống giữ tạm thông tin booking trong session và cho phép người dùng xác thực lại nếu còn lượt.

c. Người dùng rời trang giữa chừng:

Mô tả: Người dùng đã nhập email hoặc số điện thoại nhưng chưa hoàn tất booking.

Xử lý: Hệ thống lưu lead ở trạng thái "Chưa hoàn tất" và gửi tối đa 2 lần nhắc trong 7 ngày. Sau 7 ngày không phản hồi, lead chuyển sang trạng thái "Không còn hiệu lực".

## 3.3.2. Quy trình đăng ký membership theo gói được cá nhân hóa

### 3.3.2.1. Mô tả quy trình

Quy trình bắt đầu khi người dùng mở trang Smart Plan Compare sau khi khám phá dịch vụ, hoàn tất trial hoặc chủ động muốn mua membership. Hệ thống đọc dữ liệu mục tiêu, lịch sử trial nếu có và hành vi quan tâm của người dùng để gợi ý gói membership phù hợp kèm lý do đề xuất.

Người dùng có thể xem tất cả các gói, so sánh quyền lợi, thời hạn, giá, điều kiện sử dụng và chọn gói mong muốn. Nếu người dùng chưa có tài khoản, hệ thống yêu cầu đăng ký thông tin cơ bản và tạo tài khoản Member ở trạng thái "Chờ kích hoạt". Nếu người dùng đã có tài khoản, hệ thống yêu cầu xác nhận lại thông tin.

Sau khi chọn gói và đồng ý điều khoản sử dụng, người dùng tiến hành thanh toán qua sub-process checkout. Nếu thanh toán thành công, hệ thống kích hoạt membership, gắn lịch sử trial vào hồ sơ Member nếu có và gửi thông báo xác nhận.

### 3.3.2.2. Quy tắc nghiệp vụ

a. Quy tắc về gợi ý gói:

Hệ thống phải hiển thị lý do vì sao một gói được đề xuất cho người dùng.

Người dùng có quyền xem và chọn tất cả các gói, không bị khóa vào gói được gợi ý.

b. Quy tắc về tài khoản:

Nếu người dùng chưa có tài khoản, hệ thống phải tạo tài khoản Member trước khi thanh toán ở trạng thái "Chờ kích hoạt".

Người dùng phải thiết lập phương thức đăng nhập lâu dài như email và mật khẩu hoặc OAuth trước khi kết thúc luồng.

c. Quy tắc về điều khoản và kích hoạt:

Người dùng phải đồng ý điều khoản sử dụng và chính sách hội viên trước khi tài khoản chuyển sang trạng thái "Chờ kích hoạt".

Membership chỉ được kích hoạt sau khi thanh toán thành công.

### 3.3.2.3. Tình huống ngoại lệ

a. Thanh toán thất bại:

Mô tả: Người dùng đã tạo tài khoản nhưng thanh toán membership không thành công.

Xử lý: Hệ thống giữ tài khoản ở trạng thái "Chờ kích hoạt", không kích hoạt membership và cho phép người dùng thanh toán lại.

b. Email hoặc số điện thoại đã tồn tại:

Mô tả: Người dùng đăng ký bằng thông tin đã có trong hệ thống.

Xử lý: Hệ thống gợi ý đăng nhập hoặc liên kết với tài khoản cũ, không tạo tài khoản trùng.

c. Người dùng chưa sẵn sàng mua:

Mô tả: Người dùng xem gói nhưng chưa muốn thanh toán.

Xử lý: Hệ thống cho phép lưu gói quan tâm hoặc chuyển về luồng gym tour/trial.

## 3.3.3. Quy trình AI gợi ý bài tập và tạo danh sách tập cá nhân

### 3.3.3.1. Mô tả quy trình

Quy trình bắt đầu khi Member mới đăng ký hoặc Member hiện tại mở chức năng tạo danh sách tập cá nhân. Hệ thống yêu cầu người dùng cung cấp các thông tin cần thiết như mục tiêu tập luyện, số buổi có thể tập mỗi tuần, kinh nghiệm, thiết bị muốn dùng, giới hạn chấn thương và nhóm cơ ưu tiên.

Sau khi người dùng nhập thông tin, hệ thống sử dụng Recommendation Engine để tạo danh sách bài tập phù hợp. Danh sách này bao gồm bài tập, số hiệp, số lần lặp, mức độ khó và ghi chú kỹ thuật cơ bản.

Người dùng xem danh sách được đề xuất, có thể lưu, chỉnh sửa, thay thế bài tập hoặc bỏ qua. Khi người dùng lưu danh sách, hệ thống ghi nhận vào hồ sơ tập luyện để sử dụng cho các buổi tập sau.

### 3.3.3.2. Quy tắc nghiệp vụ

a. Quy tắc về dữ liệu đầu vào:

Người dùng phải cung cấp tối thiểu mục tiêu tập luyện, mức kinh nghiệm và số buổi tập dự kiến mỗi tuần.

Nếu người dùng khai báo chấn thương hoặc giới hạn vận động, hệ thống không được gợi ý bài tập có nguy cơ cao với khu vực đó.

b. Quy tắc về gợi ý bài tập:

Danh sách bài tập phải phù hợp với mức kinh nghiệm của người dùng, không gợi ý bài quá nặng cho người mới.

Hệ thống phải cho phép người dùng thay thế bài tập nếu không thích, không có thiết bị hoặc cảm thấy không phù hợp.

c. Quy tắc về lưu hồ sơ:

Chỉ danh sách được người dùng xác nhận lưu mới trở thành danh sách tập chính thức.

Mỗi lần người dùng chỉnh sửa hoặc lưu mới, hệ thống phải ghi nhận phiên bản để theo dõi thay đổi.

### 3.3.3.3. Tình huống ngoại lệ

a. Thiếu thông tin đầu vào:

Mô tả: Người dùng bỏ qua các thông tin quan trọng để tạo danh sách tập.

Xử lý: Hệ thống yêu cầu bổ sung thông tin bắt buộc trước khi tạo gợi ý.

b. Không đủ dữ liệu để cá nhân hóa:

Mô tả: Người dùng mới chưa có lịch sử tập luyện.

Xử lý: Hệ thống dùng mục tiêu ban đầu và mức kinh nghiệm để tạo danh sách cơ bản, sau đó cập nhật dần khi có dữ liệu tập thật.

c. Bài tập không phù hợp với thiết bị hiện có:

Mô tả: Bài tập được đề xuất cần thiết bị mà người dùng không muốn hoặc không thể sử dụng.

Xử lý: Hệ thống cho phép thay thế bằng bài tương đương theo cùng nhóm cơ và mức độ khó.

## 3.3.4. Quy trình thực hiện buổi tập và lưu lịch sử tập

### 3.3.4.1. Mô tả quy trình

Quy trình bắt đầu khi Member chọn bắt đầu một buổi tập từ danh sách tập cá nhân. Hệ thống hiển thị các bài tập trong buổi, hướng dẫn cơ bản, số hiệp, số lần lặp và mức tạ gợi ý do **FitFuel AI Engine** tính toán từ trước (đề xuất tạ/rep tối ưu).

Trong quá trình tập, người dùng ghi nhận kết quả từng hiệp thực tế như mức tạ, số lần lặp, thời gian nghỉ và **đặc biệt là chỉ số RPE (mức độ nỗ lực tự đánh giá từ 1-10) cùng các ghi chú cảm nhận thể chất** (ví dụ: đau cơ, nhức khớp, tạ quá nhẹ). Khi hoàn tất buổi tập, người dùng xác nhận kết thúc. Hệ thống lưu toàn bộ dữ liệu này vào lịch sử tập luyện (bảng `SET_LOGS`, `WORKOUT_SESSIONS`), cập nhật tiến độ và kiểm tra xem có đạt personal record hoặc milestone mới hay không.

Sau khi lưu buổi tập, hệ thống hiển thị tóm tắt kết quả để người dùng xem lại. **Toàn bộ dữ liệu logs, RPE và ghi chú cảm nhận này sẽ được chuyển trực tiếp làm đầu vào để huấn luyện và chạy dự báo trên mô hình AI chuỗi thời gian (FitFuel AI Engine - Phân hệ RE-3)**.

### 3.3.4.2. Quy tắc nghiệp vụ

a. Quy tắc về ghi nhận buổi tập:

Một buổi tập chỉ được tính là hoàn thành khi người dùng xác nhận kết thúc hoặc đạt điều kiện tối thiểu do hệ thống quy định.

Người dùng có thể lưu nháp buổi tập nếu chưa hoàn thành toàn bộ bài.

b. Quy tắc về dữ liệu tiến độ:

Hệ thống phải lưu lịch sử chi tiết theo từng bài tập, từng hiệp, thời gian nghỉ, RPE và nội dung ghi chú cảm nhận để phục vụ phân tích sâu của mô hình AI.

Nếu người dùng đạt personal record, hệ thống phải ghi nhận riêng để hiển thị trên hồ sơ tiến độ.

c. Quy tắc về quyền chỉnh sửa:

Người dùng được chỉnh sửa buổi tập trong một khoảng thời gian nhất định sau khi lưu để sửa lỗi nhập liệu.

Các chỉnh sửa sau khi lưu phải được ghi nhận lịch sử thay đổi.

### 3.3.4.3. Tình huống ngoại lệ

a. Người dùng thoát giữa buổi tập:

Mô tả: Người dùng đóng trang hoặc mất kết nối khi đang ghi nhận buổi tập.

Xử lý: Hệ thống tự động lưu nháp dữ liệu đã nhập để người dùng tiếp tục hoặc hoàn tất sau.

b. Dữ liệu nhập bất thường:

Mô tả: Người dùng nhập mức tạ, số lần lặp hoặc thời lượng vượt ngưỡng hợp lý.

Xử lý: Hệ thống hiển thị cảnh báo xác nhận trước khi lưu, nhưng vẫn cho phép lưu nếu người dùng xác nhận.

c. Trùng buổi tập:

Mô tả: Người dùng vô tình tạo hai buổi tập cùng thời điểm.

Xử lý: Hệ thống cảnh báo khả năng trùng và cho phép gộp, xóa nháp hoặc tiếp tục lưu riêng.

## 3.3.5. Quy trình gợi ý bài tập nâng cao và cảnh báo plateau

### 3.3.5.1. Mô tả quy trình

Quy trình bắt đầu khi hệ thống phát hiện có đủ dữ liệu lịch sử tập luyện của Member hoặc khi Member mở trang Progress Dashboard. Hệ thống sẽ **gọi dịch vụ FitFuel AI Engine (Phân hệ RE-3 - Progress & Plateau Predictor)**. Dịch vụ AI chạy mô hình học máy **LSTM (Long Short-Term Memory)** kết hợp **Sentiment NLP** để phân tích chuỗi khối lượng tập luyện, completion rate và sắc thái cảm xúc từ ghi chú định tính.

Nếu AI phát hiện người dùng tiến bộ tốt, hệ thống hiển thị đề xuất nâng độ khó (tăng volume, đổi bài nâng cao). Nếu AI phát hiện dấu hiệu đứng tiến độ (PR không đổi dù tập đều) hoặc trạng thái quá tải (RPE cao liên tục kèm ghi chú chấn thương/đau mỏi gối), hệ thống phát ra cảnh báo **Plateau (Chững tạ) hoặc Overload/Injury Risk (Nguy cơ chấn thương)** cùng câu giải thích AI rõ ràng (XAI).

Người dùng có toàn quyền kiểm soát: chấp nhận gợi ý (hệ thống sẽ cập nhật lịch tập mới), chỉnh sửa cấu trúc gợi ý, lưu tạm thời (snooze) hoặc bỏ qua gợi ý.

### 3.3.5.2. Quy tắc nghiệp vụ

a. Quy tắc phát hiện plateau và quá tải bằng AI:

Cảnh báo chững tạ và đề xuất tăng tải chỉ được kích hoạt khi AI phân tích chuỗi dữ liệu tối thiểu $\ge 4$ buổi tập hoàn thành đầy đủ, tránh dự báo sai lệch.

Mọi cảnh báo của AI phải đi kèm giải thích nguyên nhân rõ ràng (ví dụ: khớp tạ chững lại, cơ thể thiếu thời gian phục hồi dựa trên NLP cảm xúc).

b. Quy tắc an toàn thể chất (AI Guardrails):

Gợi ý tăng tải của AI không được phép vượt quá 10% so với Personal Record hiện tại đối với các bài tập Compound.

Nếu AI phát hiện từ khóa chấn thương/đau nhức tiêu cực (`"đau khớp"`, `"nhói"`, `"chấn thương"`) từ log buổi tập ở 3.3.4, hệ thống bắt buộc phải gợi ý chu kỳ Deload (giảm tải 30%) hoặc phục hồi tích cực thay vì nâng độ khó.

c. Quy tắc quyền kiểm soát của người dùng:

Người dùng có quyền chấp nhận, chỉnh sửa hoặc bỏ qua gợi ý của AI.

Hệ thống không tự động thay đổi danh sách tập chính thức nếu người dùng chưa xác nhận.

### 3.3.5.3. Tình huống ngoại lệ

a. Chưa đủ dữ liệu tập luyện:

Mô tả: Member mới hoặc tập chưa đủ số buổi tối thiểu để mô hình LSTM chạy phân tích.

Xử lý: Hệ thống chưa hiển thị cảnh báo plateau, chỉ hiển thị trạng thái "Đang thu thập dữ liệu tập luyện để cá nhân hóa bằng AI" và gợi ý ghi log đều đặn.

b. Dữ liệu không ổn định:

Mô tả: Người dùng ghi log ngắt quãng nhiều buổi hoặc nhập dữ liệu bất thường.

Xử lý: AI giảm mức độ chắc chắn (Confidence Score) của gợi ý, hiển thị thông báo đề xuất người dùng ghi log chính xác hơn và hiển thị gợi ý theo preset mặc định thay vì mô hình cá nhân hóa.

c. Người dùng bỏ qua cảnh báo:

Mô tả: Người dùng không muốn thay đổi lịch tập dù hệ thống cảnh báo chững tạ.

Xử lý: Hệ thống ghi nhận sự kiện `Dismissed` vào bảng `RECOMMENDATION_EVENTS` để điều chỉnh trọng số mô hình AI, ẩn cảnh báo và chỉ nhắc lại sau một chu kỳ tập luyện mới.

## 3.3.6. Quy trình tạo meal list/combo dinh dưỡng theo lịch sử tập

### 3.3.6.1. Mô tả quy trình

Quy trình bắt đầu khi Member mở Meal Planner hoặc khi hệ thống đề xuất dinh dưỡng sau một giai đoạn tập luyện. Trước khi tạo meal list đầu tiên, hệ thống yêu cầu người dùng khai báo mục tiêu dinh dưỡng, dị ứng, giới hạn ăn uống và sở thích cơ bản.

Sau đó, hệ thống đọc dữ liệu mục tiêu, lịch sử tập luyện, sản phẩm hiện có, tag dinh dưỡng và tồn kho để tạo meal list hoặc combo phù hợp. Gợi ý có thể phục vụ các mục tiêu như tăng cơ, giảm mỡ, duy trì năng lượng hoặc phục hồi sau tập.

Người dùng xem danh sách món ăn/sản phẩm được đề xuất kèm lý do, sau đó có thể lưu meal plan, thêm vào giỏ hàng hoặc bỏ qua. Nếu người dùng checkout, hệ thống chuyển sang sub-process thanh toán và cập nhật tồn kho sau khi thanh toán thành công.

### 3.3.6.2. Quy tắc nghiệp vụ

a. Quy tắc về dị ứng và giới hạn ăn uống:

Người dùng phải khai báo dị ứng hoặc xác nhận không có dị ứng trước khi nhận meal list đầu tiên.

Hệ thống không được đề xuất sản phẩm chứa thành phần mà người dùng đã khai báo dị ứng hoặc cần tránh.

b. Quy tắc về gợi ý dinh dưỡng:

Meal list phải dựa trên mục tiêu, lịch sử tập luyện và dữ liệu sản phẩm hiện có.

Nếu chưa đủ dữ liệu tập luyện, hệ thống dùng mục tiêu ban đầu để tạo meal list cơ bản.

c. Quy tắc về tồn kho và thanh toán:

Chỉ sản phẩm còn hàng mới được đưa vào giỏ hàng.

Sau khi thanh toán thành công, hệ thống phải trừ tồn kho và ghi nhận đơn hàng.

### 3.3.6.3. Tình huống ngoại lệ

a. Sản phẩm hết hàng:

Mô tả: Một sản phẩm trong meal list không còn tồn kho.

Xử lý: Hệ thống thay thế bằng sản phẩm cùng nhóm macro hoặc thông báo không thể thêm vào giỏ hàng.

b. Người dùng chưa khai báo dị ứng:

Mô tả: Người dùng mở Meal Planner lần đầu nhưng chưa cung cấp thông tin dị ứng.

Xử lý: Hệ thống yêu cầu khai báo nhanh trước khi hiển thị gợi ý.

c. Dữ liệu tập luyện chưa đủ:

Mô tả: Người dùng chưa có lịch sử tập hoặc lịch sử quá ít.

Xử lý: Hệ thống tạo gợi ý cơ bản theo mục tiêu ban đầu và cập nhật lại khi có thêm dữ liệu.

## 3.3.7. Quy trình gia hạn/nâng cấp gói theo hành vi tập

### 3.3.7.1. Mô tả quy trình

Quy trình bắt đầu khi Member mở trang Membership hoặc khi hệ thống phát hiện gói tập sắp hết hạn. Hệ thống phân tích hành vi tập luyện của người dùng như tần suất check-in, số buổi tập đã hoàn thành, khung giờ thường sử dụng, quyền lợi đã dùng nhiều và mục tiêu đang theo đuổi.

Dựa trên dữ liệu này, hệ thống hiển thị đề xuất gia hạn hoặc nâng cấp gói kèm lý do cụ thể. Người dùng có thể chọn gia hạn gói hiện tại, nâng cấp lên gói khác, chọn gói ngắn hạn hơn hoặc tạm dừng nếu chưa sẵn sàng.

Nếu người dùng chọn gia hạn hoặc nâng cấp, hệ thống chuyển sang checkout. Khi thanh toán thành công, membership được cập nhật ngày hết hạn hoặc quyền lợi mới. Nếu người dùng chọn tạm dừng, hệ thống lưu yêu cầu và tạo nhắc quay lại phù hợp.

### 3.3.7.2. Quy tắc nghiệp vụ

a. Quy tắc về nhắc gia hạn:

Nhắc gia hạn phải đi kèm lý do hữu ích cho người dùng, không chỉ thông báo sắp hết hạn.

Người dùng có thể tắt hoặc hoãn nhắc gia hạn trong một khoảng thời gian nhất định.

b. Quy tắc về đề xuất nâng cấp:

Hệ thống không được đề xuất upsell premium nếu người dùng ít sử dụng quyền lợi premium.

Đề xuất phải dựa trên hành vi tập thật, không chỉ dựa trên mục tiêu doanh thu.

c. Quy tắc về cập nhật membership:

Nếu gia hạn thành công, ngày hết hạn phải được cộng dồn theo quy tắc của gói.

Nếu nâng cấp thành công, hệ thống phải cập nhật quyền lợi mới và ghi nhận lịch sử thay đổi gói.

### 3.3.7.3. Tình huống ngoại lệ

a. Thanh toán thất bại:

Mô tả: Người dùng chọn gia hạn hoặc nâng cấp nhưng thanh toán không thành công.

Xử lý: Hệ thống không cập nhật membership, hiển thị lỗi và cho phép thử lại.

b. Người dùng chọn tạm dừng:

Mô tả: Người dùng chưa muốn tiếp tục sử dụng gói.

Xử lý: Hệ thống lưu yêu cầu tạm dừng hoặc comeback reminder thay vì tạo checkout.

c. Membership đang ở trạng thái đặc biệt:

Mô tả: Gói hiện tại đang bị bảo lưu, tạm khóa hoặc đã lên lịch hủy.

Xử lý: Hệ thống hiển thị quy tắc riêng cho trạng thái đó và không áp dụng luồng gia hạn thông thường nếu không phù hợp.

## 3.3.8. Quy trình referral và chia sẻ milestone

### 3.3.8.1. Mô tả quy trình

Quy trình bắt đầu khi Member đạt một milestone trong quá trình tập luyện như hoàn thành số buổi tập, giữ streak, đạt personal record hoặc hoàn thành một chương trình. Hệ thống tạo milestone card hoặc progress story để người dùng có thể xem lại và chia sẻ.

Milestone card được thiết kế theo hướng bảo vệ riêng tư. Mặc định hệ thống không hiển thị các thông tin nhạy cảm như cân nặng, ảnh cơ thể hoặc số đo cá nhân. Người dùng có thể chọn chia sẻ milestone hoặc tạo referral link để mời bạn bè.

Khi người được mời truy cập referral link, hệ thống mở landing page cá nhân hóa theo nguồn giới thiệu. Người được mời có thể đặt gym tour, nhận trial hoặc đăng ký membership. Nếu người được mời thanh toán thành công dịch vụ đầu tiên trong thời hạn quy định, hệ thống ghi nhận referral thành công và cộng 1 tháng membership miễn phí cho cả người giới thiệu và người được giới thiệu.

### 3.3.8.2. Quy tắc nghiệp vụ

a. Quy tắc về milestone:

Milestone card mặc định không hiển thị thông tin nhạy cảm như cân nặng, ảnh cơ thể hoặc số đo.

Người dùng có quyền đặt milestone ở chế độ riêng tư. Khi milestone ở chế độ riêng tư, hệ thống không cho chia sẻ công khai.

b. Quy tắc về referral:

Một người được giới thiệu chỉ được gắn với một nguồn referral chính.

Referral chỉ có hiệu lực trong 30 ngày kể từ khi người được mời mở link.

c. Quy tắc về phần thưởng:

Phần thưởng 1 tháng membership miễn phí cho cả hai bên chỉ được kích hoạt khi người được giới thiệu thanh toán thành công membership hoặc combo đầu tiên trong thời hạn 30 ngày.

Nếu hệ thống phát hiện hành vi lạm dụng referral, phần thưởng phải được tạm khóa để kiểm tra.

### 3.3.8.3. Tình huống ngoại lệ

a. Referral link hết hạn:

Mô tả: Người được mời mở link sau thời hạn 30 ngày.

Xử lý: Hệ thống hiển thị landing page thông thường và không ghi nhận phần thưởng referral.

b. Người được mời đã có tài khoản:

Mô tả: Người được mời đã là Member hoặc đã tồn tại trong hệ thống.

Xử lý: Hệ thống không tạo referral trùng và thông báo điều kiện nhận thưởng không hợp lệ nếu cần.

c. Phát hiện referral abuse:

Mô tả: Hệ thống phát hiện dấu hiệu tự giới thiệu, tạo tài khoản ảo hoặc giao dịch bất thường.

Xử lý: Hệ thống tạm khóa phần thưởng, ghi nhận trạng thái cần kiểm tra và thông báo cho quản trị viên.

## 3.3.9. Quy trình tự quản lý membership

### 3.3.9.1. Mô tả quy trình

Quy trình bắt đầu khi Member mở trang "Quản lý Membership". Tại đây, người dùng có thể xem trạng thái gói, ngày bắt đầu, ngày hết hạn, lịch sử hóa đơn, lịch sử thay đổi membership và các thao tác tự phục vụ như tạm dừng hoặc hủy gói.

Nếu người dùng chỉ muốn xem hóa đơn, hệ thống hiển thị danh sách hóa đơn và chi tiết giao dịch tương ứng. Nếu người dùng muốn tạm dừng membership, hệ thống yêu cầu chọn số ngày tạm dừng, kiểm tra hạn mức còn lại trong năm và yêu cầu xác nhận. Nếu hợp lệ, hệ thống chuyển membership sang trạng thái "Tạm dừng" và cộng thêm số ngày tương ứng vào ngày hết hạn.

Nếu người dùng muốn hủy membership, hệ thống yêu cầu chọn lý do hủy và xác nhận lại. Sau khi xác nhận, hệ thống đặt trạng thái "Đã lên lịch hủy" và gói sẽ hết hiệu lực vào cuối chu kỳ đã thanh toán, trừ trường hợp thuộc chính sách hoàn tiền riêng.

### 3.3.9.2. Quy tắc nghiệp vụ

a. Quy tắc về quyền xem thông tin:

Member có quyền xem toàn bộ lịch sử hóa đơn và lịch sử membership của chính mình bất kỳ lúc nào.

Thông tin hóa đơn phải thể hiện rõ số tiền, ngày thanh toán, phương thức thanh toán và trạng thái.

b. Quy tắc về tạm dừng membership:

Số ngày tạm dừng tối đa được giới hạn theo cấu hình mỗi năm, ví dụ 30 ngày/năm.

Thời gian tạm dừng được cộng thêm vào ngày hết hạn và không tính phí trong thời gian tạm dừng.

c. Quy tắc về hủy membership:

Hủy membership có hiệu lực vào cuối chu kỳ đã thanh toán, trừ trường hợp thuộc chính sách hoàn tiền.

Mọi thao tác tạm dừng hoặc hủy phải yêu cầu người dùng xác nhận lại để tránh thao tác nhầm.

### 3.3.9.3. Tình huống ngoại lệ

a. Hết hạn mức tạm dừng:

Mô tả: Member đã dùng hết số ngày tạm dừng trong năm.

Xử lý: Hệ thống từ chối yêu cầu tạm dừng và gợi ý phương án khác như đổi gói ngắn hạn hơn hoặc liên hệ hỗ trợ.

b. Hủy nhầm membership:

Mô tả: Member xác nhận hủy nhưng muốn khôi phục trong thời gian cho phép.

Xử lý: Hệ thống cho phép khôi phục membership trong số ngày cấu hình trước khi hồ sơ bị đóng hoàn toàn.

c. Member đang có buổi tập active:

Mô tả: Người dùng đang có workout session chưa kết thúc khi thực hiện hủy.

Xử lý: Hệ thống không chặn hủy nhưng cảnh báo rằng dữ liệu tiến độ và quyền lợi sau khi hủy có thể bị giới hạn.

## 3.3.10. Quy trình mua và thuê gear tại phòng tập

### 3.3.10.1. Mô tả quy trình

Quy trình bắt đầu khi Khách hàng (Member hoặc Guest) mở khu vực Gear trên web app hoặc chọn thêm gear trong quá trình check-in/checkout. Hệ thống hiển thị danh sách các sản phẩm và thiết bị hỗ trợ tập luyện như găng tay, đai lưng, khăn tập, bình nước, dây kéo, phụ kiện phục hồi hoặc các thiết bị có thể thuê tại phòng tập.

Người dùng chọn loại gear mong muốn. Nếu chọn mua, hệ thống hiển thị giá bán, số lượng còn lại, mô tả sản phẩm và chính sách đổi trả. Người dùng thêm sản phẩm vào giỏ hàng, xác nhận đơn và thanh toán qua sub-process checkout. Sau khi thanh toán thành công, hệ thống tạo đơn hàng, trừ tồn kho và gửi thông báo xác nhận cho người dùng.

Nếu người dùng muốn thuê gear, hệ thống sẽ kiểm tra phân quyền (chỉ Member mới được thuê, Guest sẽ bị từ chối). Nếu hợp lệ, hệ thống hiển thị số lượng thiết bị đang khả dụng, thời gian thuê, phí thuê, tiền cọc nếu có và quy định sử dụng. Người dùng chọn thiết bị và thời gian thuê, sau đó thanh toán phí thuê hoặc đặt cọc theo yêu cầu. Khi đến phòng tập, nhân viên xác nhận bàn giao thiết bị cho người dùng và cập nhật trạng thái thuê sang "Đang sử dụng".

Khi người dùng trả gear, nhân viên kiểm tra tình trạng thiết bị. Nếu thiết bị còn nguyên vẹn, hệ thống ghi nhận hoàn tất lượt thuê và hoàn cọc nếu có. Nếu thiết bị hư hỏng, mất hoặc trả trễ, hệ thống ghi nhận phí phạt, khấu trừ tiền cọc hoặc yêu cầu thanh toán thêm. Sau mỗi lượt thuê, thiết bị phải được chuyển sang trạng thái "Chờ vệ sinh/kiểm tra" trước khi cho thuê lại.

### 3.3.10.2. Quy tắc nghiệp vụ

a. Quy tắc về mua gear:

Cho phép cả Member và Guest thực hiện mua hàng (Guest cần xác thực OTP).

Chỉ các sản phẩm còn tồn kho mới được phép thêm vào giỏ hàng.

Sau khi thanh toán thành công, hệ thống phải tạo đơn hàng, trừ tồn kho và ghi nhận hóa đơn tương ứng.

Nếu sản phẩm áp dụng chính sách đổi trả, hệ thống phải hiển thị rõ thời hạn và điều kiện đổi trả trước khi người dùng thanh toán.

b. Quy tắc về thuê gear:

Chỉ áp dụng cho Member. Guest bị hệ thống chặn quyền thuê.

Chỉ thiết bị ở trạng thái "Sẵn sàng cho thuê" mới được hiển thị là khả dụng.

Mỗi lượt thuê phải ghi nhận người thuê, loại thiết bị, thời gian thuê, phí thuê, tiền cọc nếu có, thời điểm bàn giao và thời điểm trả dự kiến.

Thiết bị sau khi được trả không được chuyển ngay sang trạng thái sẵn sàng, mà phải qua bước kiểm tra tình trạng và vệ sinh/khử khuẩn.

c. Quy tắc về tiền cọc và phí phạt:

Tiền cọc được hoàn lại khi người dùng trả thiết bị đúng hạn và thiết bị không bị hư hỏng.

Nếu thiết bị bị hư hỏng, mất hoặc trả quá hạn, hệ thống được phép khấu trừ tiền cọc hoặc tạo khoản phí bổ sung theo quy định.

Mọi khoản phí phạt phải có lý do rõ ràng và được ghi nhận vào lịch sử giao dịch của người dùng.

### 3.3.10.3. Tình huống ngoại lệ

a. Gear hết hàng hoặc hết thiết bị cho thuê:

Mô tả: Người dùng chọn mua hoặc thuê gear nhưng sản phẩm/thiết bị đã hết trong lúc thao tác.

Xử lý: Hệ thống thông báo không còn khả dụng, không cho thanh toán và gợi ý sản phẩm hoặc khung thời gian thay thế nếu có.

b. Người dùng trả gear trễ:

Mô tả: Người dùng không trả thiết bị đúng thời gian đã đăng ký.

Xử lý: Hệ thống gửi nhắc nhở cho người dùng, ghi nhận trạng thái quá hạn và tính phí trễ hạn theo quy định nếu quá thời gian cho phép.

c. Gear bị hư hỏng hoặc mất:

Mô tả: Nhân viên kiểm tra và phát hiện thiết bị bị hư hỏng, thiếu phụ kiện hoặc không được trả lại.

Xử lý: Hệ thống ghi nhận biên bản kiểm tra, khấu trừ tiền cọc hoặc tạo khoản phí bồi thường. Thiết bị được chuyển sang trạng thái "Cần sửa chữa", "Không khả dụng" hoặc "Mất" tùy tình trạng.

d. Người dùng hủy yêu cầu thuê:

Mô tả: Người dùng đã đặt thuê gear nhưng muốn hủy trước thời điểm nhận thiết bị.

Xử lý: Hệ thống kiểm tra chính sách hủy. Nếu còn trong thời gian cho phép, hệ thống hủy lượt thuê và hoàn phí/cọc nếu đã thanh toán. Nếu quá hạn hủy miễn phí, hệ thống áp dụng phí hủy theo quy định.

## 3.4. Ghi chú về dữ liệu và KPI theo quy trình

Các quy trình trên tạo ra và sử dụng các nhóm dữ liệu chính gồm: `LEADS`, `GOAL_PROFILES`, `TRIAL_BOOKINGS`, `GYM_TOUR_BOOKINGS`, `GYM_MEMBERSHIPS`, `MEMBERSHIP_HISTORY`, `PAYMENT_TRANSACTIONS`, `INVOICES`, `MEMBER_WORKOUT_LISTS`, `WORKOUT_SESSIONS`, `SET_LOGS`, `PERSONAL_RECORDS`, `MEAL_PLANS`, `ORDERS`, `REFERRALS`, `REFERRAL_REWARDS`, `REWARD_LEDGER`, `GEAR_PRODUCTS`, `GEAR_INVENTORY`, `GEAR_RENTALS` và `GEAR_RETURN_INSPECTIONS`.

Các KPI chính cần theo dõi gồm: tỷ lệ visitor chuyển thành booking, tỷ lệ trial chuyển thành Member, tỷ lệ lưu danh sách tập, tỷ lệ hoàn thành buổi tập, tỷ lệ chấp nhận gợi ý nâng cao, tỷ lệ lưu meal plan, tỷ lệ gia hạn, tỷ lệ nâng cấp, tỷ lệ chuyển đổi referral, tỷ lệ tự phục vụ khi tạm dừng hoặc hủy membership, doanh thu gear, tỷ lệ thuê gear, tỷ lệ trả gear đúng hạn và tỷ lệ thiết bị hư hỏng sau thuê.

## 3.5. Kết luận

File 14 tập trung mô tả các quy trình nghiệp vụ của FitFuel+ theo góc nhìn người dùng cuối. Các quy trình không chỉ phục vụ quản lý nội bộ mà còn thể hiện hành trình đầy đủ từ khám phá dịch vụ, đăng ký, bắt đầu tập, ghi nhận tiến độ, cá nhân hóa dinh dưỡng, gia hạn, giới thiệu bạn bè, tự quản lý membership và mua/thuê gear phục vụ quá trình tập luyện.
