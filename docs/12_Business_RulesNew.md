# 12. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

> Dự án: FitFuel+
> Môn học: Web Kinh Doanh
> Ngày cập nhật: 08/07/2026 — Đồng bộ với Use Case mới (16 UC) và BPMN 3.3.x

========================================================================

### GIẢI THÍCH CHUNG:

Quy tắc nghiệp vụ (Business Rule - BR) là các ràng buộc, điều kiện và logic mà hệ thống phải tuân thủ để đáp ứng yêu cầu vận hành của phòng tập. Quy tắc nghiệp vụ xuất phát từ nghiệp vụ kinh doanh thực tế, không phải quyết định kỹ thuật đơn thuần.

Mỗi quy tắc nghiệp vụ bao gồm các thông tin:
*   **Mã số**: BR-XX (định danh duy nhất)
*   **Tên quy tắc**: Mô tả ngắn gọn nội dung quy tắc
*   **Loại quy tắc**:
    *   *Ràng buộc (Constraint)*: Bắt buộc tuân thủ, không được vi phạm.
    *   *Tính toán (Computation)*: Công thức toán học hoặc logic tính số liệu.
    *   *Suy diễn (Inference)*: Từ các điều kiện có sẵn để suy ra trạng thái mới.
    *   *Hành động (Action Trigger)*: Tự động kích hoạt hành động khi thỏa mãn điều kiện.
*   **Nội dung chi tiết**: Mô tả đầy đủ logic nghiệp vụ.
*   **Áp dụng cho**: Các ca sử dụng (Use Cases - UC) hoặc tính năng liên quan.

========================================================================

## 1. QUY TẮC XÁC THỰC VÀ BẢO MẬT
========================================================================

### BR-01: Quy tắc mật khẩu và xác thực
*   **Loại**: Ràng buộc
*   **Chi tiết**: 
    *   Đối với **Gym Owner** (Chủ phòng tập): Mật khẩu phải có độ dài tối thiểu 8 ký tự, bao gồm ít nhất 1 chữ in hoa, 1 chữ thường và 1 chữ số.
    *   Đối với **Member** mới (đăng ký qua số điện thoại trên Web App): Không yêu cầu nhập mật khẩu ban đầu. Hệ thống sẽ tự động tạo mật khẩu ngẫu nhiên gồm 6 chữ số và gửi qua tin nhắn SMS OTP sau khi xác thực thành công.
*   **Áp dụng**: UC-01, UC-03, UC-04
*   **Ví dụ**: Mật khẩu "MyPass123" là hợp lệ đối với Gym Owner. Mật khẩu "123456" là mật khẩu tự sinh của hội viên.

### BR-02: Quy tắc mã xác thực OTP
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Mã OTP bao gồm đúng 6 chữ số được tạo ngẫu nhiên.
    *   Mã OTP có thời hạn hiệu lực tối đa là 5 phút kể từ thời điểm gửi.
    *   Người dùng được nhập sai tối đa 3 lần liên tiếp. Nếu nhập sai quá 3 lần, hệ thống sẽ tạm khóa yêu cầu gửi OTP đến số điện thoại đó trong vòng 15 phút.
    *   Mỗi mã OTP chỉ được sử dụng đúng 1 lần (sẽ bị vô hiệu hóa ngay sau khi xác thực thành công hoặc khi hết hạn).
*   **Áp dụng**: UC-02

### BR-03: Quy tắc mã thông báo JWT (JWT Token)
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Access Token (mã truy cập) có thời hạn hiệu lực là 7 ngày.
    *   Refresh Token (mã làm mới) có thời hạn hiệu lực là 30 ngày.
    *   Tất cả các token hiện có của tài khoản sẽ lập tức bị vô hiệu hóa (revoke) khi người dùng thực hiện đổi mật khẩu hoặc xóa tài khoản.
*   **Áp dụng**: Toàn bộ hệ thống

### BR-04: Quyền hạn của khách vãng lai (Guest)
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Khách vãng lai (chưa đăng nhập tài khoản Member) CHỈ được phép:
        *   Xem trang giới thiệu phòng tập, bảng giá gói tập và các sản phẩm dinh dưỡng công khai.
        *   Xem trang cá nhân tập luyện công khai (Public Fitness Passport) của các hội viên khác qua link chia sẻ.
        *   Đăng ký tài khoản mới thông qua luồng mua gói tập (Membership Online).
    *   Khách vãng lai KHÔNG được phép thực hiện:
        *   Check-in vào phòng tập.
        *   Đặt mua các sản phẩm dinh dưỡng nội bộ.
        *   Sử dụng tính năng theo dõi tập luyện (Gym Tracking) như tạo buổi tập, lưu lịch sử tập.
        *   Tham gia các thử thách và nhận phần thưởng (Gamification, tích lũy XP, tăng hạng, streak).
        *   Sở hữu và sử dụng ví FitCoin.
        *   Xem Fitness Passport cá nhân hoặc truy cập vào AI Care Queue (AI Care Queue chỉ dành cho Gym Owner).
*   **Áp dụng**: Toàn bộ hệ thống

### BR-05: Quy tắc đăng ký tài khoản Member
*   **Loại**: Ràng buộc
*   **Chi tiết**: 
    *   Hội viên mới chỉ có thể đăng ký tài khoản thông qua luồng mua gói tập (Mua trực tuyến qua Web App hoặc quét mã QR thanh toán tại quầy lễ tân - Offline to Online).
    *   Hệ thống không hỗ trợ tạo tài khoản hội viên độc lập mà không đi kèm với việc đăng ký gói tập ban đầu.
    *   Trang đăng ký hệ thống `/auth/register` được bảo vệ nghiêm ngặt và chỉ dành riêng cho tài khoản quản trị của Gym Owner.
*   **Áp dụng**: UC-03, Nhóm 3.3.2

========================================================================

## 2. QUY TẮC VÒNG ĐỜI HỘI VIÊN (MEMBERSHIP LIFECYCLE)
========================================================================

### BR-06: Quy tắc gói tập (Membership Plans)
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Hệ thống chỉ cung cấp duy nhất 2 lựa chọn gói tập với quyền lợi hoàn toàn giống nhau, chỉ khác nhau về thời hạn sử dụng:
        *   **Gói Tháng (Monthly)**: Có thời hạn 1 tháng (30 ngày), cho phép hội viên vào tập tự do, sử dụng toàn bộ tiện ích của phòng tập.
        *   **Gói Năm (Annual)**: Có thời hạn 12 tháng (365 ngày), quyền lợi tương tự Gói Tháng.
    *   Chính sách giá ưu đãi: Giá Gói Năm được cấu hình bằng giá Gói Tháng nhân với 10 (tiết kiệm tương đương chi phí của 2 tháng tập).
    *   Hệ thống cam kết sự công bằng, không phân biệt thứ hạng thành viên hoặc chia phân khúc dịch vụ. KHÔNG tồn tại các gói phụ như: Day Pass, Basic, Standard, Premium, PT Plus, hay Student.
*   **Áp dụng**: UC-03, UC-10

### BR-07: Quy tắc gia hạn gói tập
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Khi hội viên tiến hành gia hạn gói tập, hệ thống sẽ tạo một bản ghi lịch sử mới trong bảng `MEMBERSHIP_HISTORY`.
    *   Nếu gói tập hiện tại vẫn còn hạn: Ngày kết thúc mới = Ngày kết thúc cũ + Thời hạn của gói tập mới mua.
    *   Nếu gói tập hiện tại đã hết hạn: Ngày bắt đầu mới = Ngày thanh toán giao dịch thành công. Ngày kết thúc mới = Ngày bắt đầu mới + Thời hạn gói tập mới.
    *   Hội viên được phép gia hạn nhiều lần liên tiếp, toàn bộ lịch sử giao dịch đều được lưu trữ đầy đủ.
*   **Áp dụng**: UC-10, Nhóm 3.3.7

### BR-08: Quy tắc nâng cấp gói tập (Upgrade)
*   **Loại**: Tính toán
*   **Chi tiết**:
    *   Hội viên đang dùng Gói Tháng được nâng cấp lên Gói Năm bất kỳ lúc nào. Chi phí chênh lệch cần thanh toán được tính theo nguyên tắc chia đều theo ngày sử dụng (Pro-rata):
        $$\text{Phí nâng cấp} = \frac{\text{Giá Gói Năm} - \text{Giá Gói Tháng}}{\text{Số ngày Gói Tháng (30 ngày)}} \times \text{Số ngày còn lại của Gói Tháng cũ}$$
    *   *Ví dụ*: Gói Tháng giá 399.000 VND còn hạn 15 ngày, hội viên muốn nâng cấp lên Gói Năm giá 3.990.000 VND. Chi phí cần thanh toán thêm là: `(3.990.000 - 399.000) / 30 * 15 = 1.795.500 VND`.
*   **Áp dụng**: UC-10, Nhóm 3.3.7

### BR-09: Quy tắc bảo lưu gói tập (Yêu cầu đặc biệt)
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Áp dụng khi hội viên cần bảo lưu dài hạn từ 31 đến 60 ngày vì lý do đặc biệt bất khả kháng (sức khỏe gặp chấn thương, thai sản, hoặc đi công tác xa lâu ngày).
    *   Hội viên cần thực hiện gửi yêu cầu kèm theo tài liệu minh chứng (giấy chứng nhận y tế, quyết định công tác) trực tiếp trên Web App.
    *   **Yêu cầu bảo lưu này bắt buộc phải được Admin (Gym Owner) phê duyệt** thủ công thì mới có hiệu lực.
    *   Sau khi được phê duyệt, gói tập sẽ tạm dừng kích hoạt và ngày hết hạn của gói tập sẽ được cộng thêm số ngày bảo lưu thực tế.
*   **Áp dụng**: UC-10, Nhóm 3.3.9

### BR-10: Quy tắc check-in phòng tập
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Người dùng chỉ có thể thực hiện check-in vào phòng tập khi sở hữu gói tập (Gói Tháng hoặc Gói Năm) còn hiệu lực, hoặc đang có booking **Free Trial Pass (Trải nghiệm thử 7 ngày)** còn trong hạn.
    *   Trong thời gian gói tập hoặc pass còn hoạt động, người dùng không bị giới hạn số lần check-in trong ngày.
    *   Hệ thống ghi nhận chính xác thời gian check-in của người dùng vào bảng `CHECK_INS` để làm cơ sở đánh giá độ chuyên cần cho AI Care Queue.
    *   Hệ thống không quản lý việc cho mượn khăn, tủ locker hay cấp phát tài sản khi check-in; hội viên tự chuẩn bị đồ dùng cá nhân.
*   **Áp dụng**: UC-01, UC-06, Nhóm 3.3.1

### BR-11: Cảnh báo gói tập sắp hết hạn
*   **Loại**: Hành động
*   **Chi tiết**:
    *   Hệ thống tự động quét mỗi ngày và đẩy hội viên vào danh sách AI Care Queue (hàng đợi chăm sóc của nhân viên) khi phát hiện gói tập sắp hết hạn theo các mốc:
        *   **Còn 7 ngày**: Đẩy vào Care Queue với độ ưu tiên **Cao (High)**.
        *   **Còn 3 ngày**: Đẩy vào Care Queue với độ ưu tiên **Rất cao (Critical)** + tự động gửi tin nhắn SMS nhắc nhở hội viên gia hạn.
        *   **Đã hết hạn từ 1 đến 3 ngày**: Đẩy vào Care Queue với độ ưu tiên **Rất cao (Critical)** để nhân viên gọi điện hỗ trợ.
        *   **Đã hết hạn quá 3 ngày**: Chuyển trạng thái tài khoản thành "Hết hạn, chưa gia hạn" (expired_unrenewed) và loại khỏi hàng đợi chăm sóc tự động.
*   **Áp dụng**: UC-14, Timer Actor

### BR-12: Cảnh báo hội viên không hoạt động (Inactive)
*   **Loại**: Hành động
*   **Chi tiết**:
    *   Hệ thống tự động ghi nhận hội viên vào AI Care Queue nhằm can thiệp sớm tránh khách hàng rời bỏ khi thỏa mãn một trong hai điều kiện:
        *   Đã quá 14 ngày liên tục hội viên không check-in phòng tập (trong khi gói tập vẫn còn hiệu lực).
        *   Đã quá 7 ngày liên tục hội viên không check-in + gói tập hiện tại đang còn hạn dưới 14 ngày.
*   **Áp dụng**: UC-14, Timer Actor

========================================================================

## 3. QUY TẮC NUTRITION (DINH DƯỠNG NỘI BỘ)
========================================================================

### BR-13: Quy tắc bán sản phẩm dinh dưỡng
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Chỉ có tài khoản của Gym Owner hoặc nhân viên phòng tập mới có quyền thực hiện bán sản phẩm dinh dưỡng tại quầy lễ tân.
    *   Tất cả sản phẩm dinh dưỡng là tài sản nội bộ của phòng tập, hệ thống không liên kết với các nhà cung cấp bên ngoài (no external vendors).
    *   Hội viên có thể đặt trước sản phẩm dinh dưỡng (Pre-order) thông qua ứng dụng để nhận và sử dụng ngay sau khi hoàn thành buổi tập.
    *   Hóa đơn mua sản phẩm dinh dưỡng (`NUTRITION_ORDERS`) bắt buộc phải được liên kết trực tiếp với mã hội viên (`member_id`).
*   **Áp dụng**: UC-08, UC-13, Nhóm 3.3.6

### BR-14: Quy tắc quản lý tồn kho dinh dưỡng
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Hệ thống tự động khấu trừ số lượng sản phẩm trong kho ngay khi giao dịch thanh toán mua hàng thành công.
    *   Khi số lượng tồn kho của một sản phẩm chạm hoặc thấp hơn ngưỡng cảnh báo (ngưỡng tối thiểu được cấu hình riêng cho từng sản phẩm), hệ thống sẽ:
        *   Hiển thị cảnh báo màu đỏ trực quan trên màn hình Dashboard của Gym Owner.
        *   Ghi nhận sản phẩm vào danh sách ưu tiên nhập hàng trong báo cáo kho.
    *   Khi số lượng tồn kho giảm về bằng 0, hệ thống tự động đổi trạng thái sản phẩm sang "Hết hàng" (out_of_stock) và ẩn sản phẩm khỏi danh mục đặt hàng của hội viên trên ứng dụng.
*   **Áp dụng**: UC-13, UC-08

### BR-15: Quy tắc combo sản phẩm dinh dưỡng
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Một combo dinh dưỡng bắt buộc phải chứa từ 2 sản phẩm đơn lẻ trở lên.
    *   Giá của combo luôn luôn phải nhỏ hơn hoặc bằng tổng giá bán lẻ của các sản phẩm thành phần cộng lại nhằm đảm bảo quyền lợi khuyến mại cho hội viên.
    *   Nếu có bất kỳ sản phẩm thành phần nào trong combo bị hết hàng (tồn kho = 0), combo đó sẽ tự động chuyển trạng thái ngừng kinh doanh (`is_available = false`) trên giao diện bán hàng.
*   **Áp dụng**: UC-13, UC-08

### BR-16: [ĐÃ TÍCH HỢP VÀO BR-47]
*   **Loại**: Suy diễn
*   **Chi tiết**: Quy tắc gợi ý dinh dưỡng sau tập dựa trên nhóm cơ đơn giản cũ đã được nâng cấp và tích hợp toàn diện vào quy tắc mới **BR-47** (AI Post-workout Nutrition Trigger) nhằm kết hợp nhiều tín hiệu thông minh hơn (nhóm cơ, mục tiêu cá nhân, cường độ tập luyện và thói quen mua hàng).
*   **Áp dụng**: Không áp dụng trực tiếp

========================================================================

## 4. QUY TẮC GEAR MARKETPLACE (TÀI SẢN CHO THUÊ VÀ BÁN)
========================================================================

### BR-17: Quy tắc sở hữu và đăng bán sản phẩm (B2C Only)
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Toàn bộ đồ tập, phụ kiện và thiết bị hỗ trợ tập luyện (Gear) trên Marketplace đều là tài sản thuộc quyền sở hữu của phòng tập FitFuel+. Hệ thống không hỗ trợ mô hình mua bán/cho thuê giữa các hội viên với nhau (Peer-to-Peer).
    *   Chỉ có Gym Owner mới có quyền tạo mới, chỉnh sửa hoặc đăng bán/cho thuê sản phẩm Gear (`gear_items`).
    *   Trường người sở hữu hiện tại (`current_owner_id`) và người bán (`seller_id`) trong bảng giao dịch thiết bị luôn luôn là ID của Gym Owner. Hội viên và khách vãng lai chỉ có quyền mua hoặc thuê sản phẩm.
*   **Áp dụng**: UC-13

### BR-18: Quy tắc thuê thiết bị tập luyện (Member Only)
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Chỉ những khách hàng đã đăng ký tài khoản Member và gói tập còn hiệu lực mới được phép thuê thiết bị tập luyện. Khách vãng lai (Guest) không được phép thuê thiết bị.
    *   Quy trình thuê thiết bị:
        1.  Member lựa chọn thiết bị có trạng thái `is_available = true` và loại giao dịch là cho thuê hoặc cả hai (`listing_type` thuộc 'rent' hoặc 'both').
        2.  Lựa chọn ngày bắt đầu thuê và ngày trả dự kiến (thời hạn thuê tối đa không vượt quá 7 ngày kể từ ngày bắt đầu).
        3.  Hệ thống tính toán phí thuê dựa theo đơn giá ngày: 
            $$\text{Phí thuê} = \text{Đơn giá thuê/ngày} \times \text{Số ngày thuê thực tế}$$
        4.  Member bắt buộc phải thanh toán trước 100% tiền đặt cọc (deposit_amount) của thiết bị cộng với phí thuê trước khi nhận bàn giao thiết bị vật lý.
        5.  Hệ thống tạo bản ghi giao dịch thiết bị ở trạng thái "Đang thuê" (`status = 'active'`) và tự động chuyển trạng thái thiết bị sang không sẵn sàng (`is_available = false`).
    *   Giới hạn: Mỗi hội viên được thuê tối đa 3 thiết bị cùng một lúc.
*   **Áp dụng**: UC-09, Nhóm 3.3.10

### BR-19: Quy tắc phí phạt quá hạn thuê và xử lý hư hỏng thiết bị
*   **Loại**: Ràng buộc & Tính toán
*   **Chi tiết**:
    *   Hệ thống chạy tác vụ tự động (Cron job) lúc 06:00 hằng ngày để quét các giao dịch thuê thiết bị đang hoạt động. Nếu ngày trả dự kiến nhỏ hơn ngày hiện tại, hệ thống sẽ gửi cảnh báo quá hạn đến tài khoản của hội viên và đẩy thông tin lên trang quản trị của Gym Owner.
    *   Khi hội viên trả thiết bị, Gym Owner kiểm tra tình trạng vật lý của thiết bị và xác nhận trên hệ thống. Số tiền đặt cọc được hoàn trả dựa trên các mức đánh giá hao mòn:
        *   **Tình trạng hoàn hảo (GOOD)**: Hoàn trả 100% tiền cọc cho hội viên.
        *   **Hư hỏng nhẹ (MINOR_DAMAGE)**: Khấu trừ 30% tiền đặt cọc để sửa chữa.
        *   **Hư hỏng nặng (MAJOR_DAMAGE)**: Khấu trừ 100% tiền đặt cọc + xuất hóa đơn yêu cầu bồi thường thêm nếu chi phí sửa chữa vượt quá tiền cọc.
        *   **Làm mất thiết bị (LOST)**: Khấu trừ 100% tiền đặt cọc + xuất hóa đơn đền bù theo giá trị thực tế của thiết bị. Thiết bị làm mất sẽ bị đánh dấu ngừng hoạt động vĩnh viễn trên hệ thống và không được bật lại trạng thái sẵn sàng.
*   **Áp dụng**: UC-09, UC-13, Nhóm 3.3.10

### BR-20: Quy tắc quản lý trạng thái sẵn sàng của thiết bị
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Mỗi mặt hàng thiết bị (`gear_item`) được coi là một vật thể vật lý đơn lẻ và có mã định danh duy nhất (không sử dụng số lượng tổng/số lượng khả dụng chung). Trạng thái của thiết bị được kiểm soát trực tiếp qua trường `is_available` (Kiểu dữ liệu Boolean):
        *   Thiết bị thuộc loại bán (`type = 'sale'`): Sau khi thanh toán thành công, `is_available` chuyển sang `false` vĩnh viễn.
        *   Thiết bị thuộc loại thuê (`type = 'rental'`): `is_available` chuyển sang `false` trong thời gian hội viên đang thuê, và tự động chuyển về `true` sau khi thiết bị được trả ở tình trạng có thể tái sử dụng.
    *   Hệ thống cấm tạo đơn mua hoặc thuê đối với các thiết bị đang có trạng thái `is_available = false`.
*   **Áp dụng**: UC-09, UC-13, Nhóm 3.3.10

### BR-21: Quy tắc miễn phí vận chuyển (Freeship Threshold)
*   **Loại**: Tính toán & Hiển thị
*   **Chi tiết**:
    *   Đơn hàng mua sắm sản phẩm (dinh dưỡng, phụ kiện tập) được áp dụng chính sách miễn phí vận chuyển khi tổng giá trị các sản phẩm trong giỏ hàng (trước khi cộng phí ship và trước khi áp dụng giảm giá bằng ví FitCoin) đạt từ **200.000 VND** trở lên.
    *   Nếu đơn hàng đủ điều kiện freeship: Phí vận chuyển hiển thị bằng 0.
    *   Nếu đơn hàng chưa đủ điều kiện: Phí vận chuyển được tính toán tự động thông qua việc gọi API thời gian thực của đối tác giao hàng (GHN hoặc Ahamove).
    *   Ngoại lệ: Chính sách miễn phí vận chuyển không áp dụng đối với các giao dịch mua gói tập, giao dịch thuê thiết bị, hoặc đơn hàng chọn hình thức nhận trực tiếp tại quầy (Pickup).
*   **Áp dụng**: UC-08, UC-09

### BR-22: Quy tắc thanh toán bắt buộc đối với đơn hàng giao tận nơi
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Hội viên khi đặt đơn hàng giao tận nhà (Delivery) bắt buộc phải thực hiện thanh toán trực tuyến thành công 100% giá trị đơn hàng trước khi hệ thống chuyển thông tin sang bộ phận chuẩn bị hàng.
    *   Phương thức chấp nhận: VNPay, ví MoMo, hoặc thanh toán bằng ví FitCoin nội bộ (tối đa 50% tổng hóa đơn theo quy định BR-34).
    *   Hệ thống phòng tập không hỗ trợ hình thức giao hàng thu tiền hộ (COD).
*   **Áp dụng**: UC-16, UC-08, UC-09

### BR-23: Quy tắc quản lý trạng thái đơn hàng giao tận nơi
*   **Loại**: Ràng buộc & Hành động
*   **Chi tiết**:
    *   Đơn hàng giao tận nơi đi qua đúng trình tự 6 trạng thái cố định:
        $$\text{Chờ xử lý (pending)} \rightarrow \text{Đang chuẩn bị (preparing)} \rightarrow \text{Đã giao đối tác (shipped)} \rightarrow \text{Đang giao (delivering)} \rightarrow \text{Đã hoàn thành (done)} \text{ hoặc } \text{Đã hủy (cancelled)}$$
    *   Trạng thái đơn hàng chỉ có thể đi tiếp theo một chiều duy nhất, hệ thống tuyệt đối không hỗ trợ khôi phục (rollback) về trạng thái trước đó.
    *   Hệ thống tự động cập nhật các trạng thái giao hàng (`shipped`, `delivering`, `done`) thông qua Webhook phản hồi từ hệ thống của đơn vị vận chuyển.
    *   Mỗi khi đơn hàng chuyển đổi trạng thái, hệ thống sẽ tự động gửi thông báo (Notification) thời gian thực đến tài khoản của hội viên.
*   **Áp dụng**: UC-08, UC-09, UC-12

### BR-24: Quy tắc hủy đơn hàng mua sản phẩm
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Hội viên chỉ được phép tự hủy đơn hàng trực tuyến khi trạng thái đơn hàng đang là "Chờ xử lý" (pending) hoặc "Đang chuẩn bị hàng" (preparing).
    *   Ngay khi đơn hàng đã bàn giao cho đối tác vận chuyển (`status = 'shipped'`), nút hủy đơn trên ứng dụng sẽ bị khóa và hội viên không được phép hủy đơn.
    *   Khi giao dịch hủy đơn được chấp nhận, hệ thống sẽ:
        *   Tự động hoàn trả số tiền thanh toán về tài khoản thanh toán ban đầu của khách hàng.
        *   Hoàn trả số điểm FitCoin đã khấu trừ về ví của hội viên.
        *   Tự động cộng lại số lượng sản phẩm vào kho tồn khả dụng.
        *   Gửi thông báo xác nhận hủy đơn thành công đến thiết bị của hội viên.
*   **Áp dụng**: UC-08, UC-09, UC-16

========================================================================

## 5. QUY TẮC KHUYẾN KHÍCH TẬP LUYỆN (GAMIFICATION)
========================================================================

### BR-25: Bảng công thức tính điểm kinh nghiệm (XP)
*   **Loại**: Tính toán
*   **Chi tiết**: Điểm kinh nghiệm (XP) dùng để đánh giá mức độ tích cực tập luyện của hội viên và được cộng tự động theo bảng quy đổi sau:
    
    | Hành động của hội viên | Số điểm XP nhận được |
    | :--- | :--- |
    | Hoàn thành 1 buổi tập (Workout Session status = done) | **+50 XP** |
    | Thiết lập kỷ lục cá nhân mới (Personal Record) | **+30 XP** |
    | Check-in tại phòng tập qua mã QR thành công | **+10 XP** |
    | Hoàn thành 1 thử thách tuần (Weekly Challenge) | **+100 XP** |
    | Hoàn thành 1 thử thách tháng (Monthly Challenge) | **+200 XP** |
    | Thực hiện gia hạn thành công gói tập | **+50 XP** |
    | Giới thiệu bạn bè đăng ký thành công (Referral) | **+50 XP** (cộng cho cả 2 tài khoản) |
    | Chia sẻ cột mốc tập luyện (Milestone) lên bảng tin nội bộ | **+5 XP** |
*   **Áp dụng**: UC-06, UC-07, UC-11

### BR-26: Bảng phân cấp bậc thành viên (Level Up)
*   **Loại**: Tính toán
*   **Chi tiết**: Cấp độ (Level) của hội viên tự động tăng lên khi tổng số điểm kinh nghiệm tích lũy đạt được các mốc quy định:
    
    | Cấp độ | Số điểm XP tích lũy tối thiểu | Danh hiệu cấp bậc tương ứng |
    | :---: | :---: | :--- |
    | **1** | 0 XP | Người mới (Newbie) |
    | **2** | 200 XP | Bắt đầu (Starter) |
    | **3** | 500 XP | Thành viên thường trực (Regular) |
    | **4** | 1.000 XP | Thành viên bền bỉ (Committed) |
    | **5** | 2.000 XP | Thành viên tận tụy (Dedicated) |
    | **6** | 4.000 XP | Thành viên mạnh mẽ (Strong) |
    | **7** | 7.000 XP | Thành viên nâng cao (Advanced) |
    | **8** | 11.000 XP | Hội viên ưu tú (Elite) |
    | **9** | 16.000 XP | Nhà vô địch (Champion) |
    | **10** | 25.000 XP | Huyền thoại (Legend) |
*   **Áp dụng**: UC-06, UC-07, UC-11

### BR-27: Điều kiện ghi nhận chuỗi ngày đi tập liên tục (Streak)
*   **Loại**: Suy diễn
*   **Chi tiết**:
    *   Hệ thống ghi nhận chuỗi ngày tập luyện liên tục (Streak) cộng thêm 1 ngày khi và chỉ khi hội viên hoàn thành ít nhất 1 buổi tập (Workout Session chuyển trạng thái thành `done`) trong ngày.
    *   Chu kỳ ngày tập luyện được tính chính xác theo múi giờ địa phương từ 00:00 đến 23:59 hằng ngày.
    *   Mỗi ngày hệ thống chỉ ghi nhận streak tối đa 1 lần (hội viên tập từ 2 buổi trở lên trong ngày vẫn chỉ được tính là +1 ngày streak).
*   **Áp dụng**: UC-06

### BR-28: Quy tắc đặt lại chuỗi ngày đi tập (Reset Streak)
*   **Loại**: Hành động
*   **Chi tiết**:
    *   Chuỗi ngày đi tập liên tục (Streak) của hội viên sẽ bị đặt lại về bằng 0 nếu trong vòng 2 ngày dương lịch liên tiếp hệ thống không ghi nhận bất kỳ buổi tập nào được hoàn thành.
    *   Tác vụ tự động quét dữ liệu để cập nhật reset streak chạy định kỳ vào lúc 00:05 hằng ngày.
    *   Ngay khi streak bị đặt lại về 0, hệ thống sẽ gửi một thông báo nhắc nhở nhẹ nhàng động viên hội viên quay trở lại tập luyện.
*   **Áp dụng**: Timer Actor, UC-06

### BR-29: Phần thưởng khuyến khích đạt mốc tập luyện liên tục (Streak Milestone)
*   **Loại**: Hành động
*   **Chi tiết**: Khi hội viên duy trì tập luyện và đạt các mốc chuỗi ngày liên tục, hệ thống sẽ tự động gửi phần thưởng là tiền ảo FitCoin nội bộ và điểm XP tương ứng dựa theo bảng Milestone chi tiết (`BR-49`):
    *   **Streak đạt mốc 7 ngày (M10)**: Tặng ngay **+70 FitCoin** & **+300 XP**.
    *   **Streak đạt mốc 14 ngày (M11)**: Tặng ngay **+150 FitCoin** & **+600 XP**.
    *   **Streak đạt mốc 30 ngày (M12)**: Tặng ngay **+300 FitCoin** & **+1500 XP**.
    *   **Streak đạt mốc 60 ngày**: Tặng ngay **+500 FitCoin** & **+2000 XP**.
    *   **Streak đạt mốc 100 ngày**: Tặng ngay **+1000 FitCoin** & **+3000 XP**.
    *   **Streak đạt mốc 365 ngày**: Tặng ngay **+5000 FitCoin** & **+10000 XP**.
*   **Áp dụng**: UC-06, UC-11

========================================================================

## 6. QUY TẮC ĐỒNG TIỀN THÀNH VIÊN (FITCOIN)
========================================================================

### BR-30: Tỷ giá quy đổi FitCoin
*   **Loại**: Ràng buộc
*   **Chi tiết**: Tỷ giá quy đổi FitCoin sang tiền VND được ấn định cố định trong hệ thống là: `1 FitCoin = 1 VND`. Tỷ giá này không biến động và không chịu bất kỳ chi phí phát sinh nào khác.
*   **Áp dụng**: Toàn bộ hệ thống

### BR-31: Hạn chế pháp lý khi sử dụng FitCoin
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Đồng điểm thưởng FitCoin tích lũy tuyệt đối không được phép quy đổi ngược lại thành tiền mặt và không được rút ra khỏi hệ thống dưới mọi hình thức.
    *   FitCoin chỉ được sử dụng làm phương thức thanh toán nội bộ để mua sắm sản phẩm hoặc thanh toán gói dịch vụ của FitFuel+.
    *   Số dư ví FitCoin của hội viên không được phép nhỏ hơn 0 trong bất kỳ giao dịch nào.
*   **Áp dụng**: Toàn bộ hệ thống

### BR-32: Các nguồn tích lũy điểm thưởng FitCoin (Earn FitCoin)
*   **Loại**: Suy diễn
*   **Chi tiết**: Hội viên có thể tích lũy điểm thưởng FitCoin vào tài khoản từ các hoạt động:
    *   Đạt các cột mốc duy trì chuỗi ngày đi tập liên tục (Streak Milestone) theo quy định tại BR-29.
    *   Hoàn thành các thử thách tuần/tháng do phòng tập tổ chức (nhận số FitCoin tương ứng theo phần thưởng cấu hình của thử thách).
    *   Giới thiệu thành viên mới thành công (Referral): Nhận ngay **+50 FitCoin** cho mỗi lượt đăng ký gói đầu tiên thành công của người được giới thiệu.
    *   Thực hiện nạp tiền trực tiếp vào ví trên ứng dụng (Tỷ lệ quy đổi: `1 VND nạp = 1 FitCoin`).
    *   Gia hạn thành công gói tập: Thưởng ngay **+50 FitCoin** cho mỗi lần giao dịch gia hạn.
*   **Áp dụng**: UC-06, UC-11, UC-10

### BR-33: Các nguồn tiêu dùng điểm thưởng FitCoin (Spend FitCoin)
*   **Loại**: Suy diễn
*   **Chi tiết**: Hội viên được phép sử dụng số dư ví FitCoin để thanh toán cho các nhu cầu:
    *   Đặt mua các sản phẩm dinh dưỡng, thực phẩm bổ sung, đồ uống tại quầy nước hoặc đặt trực tuyến.
    *   Thanh toán chi phí nâng cấp hoặc thực hiện gia hạn gói tập hội viên.
*   **Áp dụng**: UC-08, UC-09, UC-10

### BR-34: Giới hạn tỷ lệ thanh toán tối đa bằng FitCoin mỗi hóa đơn
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Để đảm bảo dòng tiền vận hành của phòng tập, hội viên chỉ được phép sử dụng điểm thưởng FitCoin để thanh toán tối đa **50% giá trị của hóa đơn mua sản phẩm** (dinh dưỡng, thiết bị tập luyện).
    *   Phần giá trị 50% còn lại bắt buộc phải thanh toán bằng tiền thực tế thông qua các cổng thanh toán trực tuyến tích hợp (VNPay, ví điện tử MoMo) hoặc thanh toán tiền mặt trực tiếp tại quầy.
    *   *Ví dụ*: Đơn hàng dinh dưỡng trị giá 200.000 VND. Hội viên được dùng tối đa 100.000 FitCoin, phần còn lại 100.000 VND bắt buộc thanh toán bằng tiền mặt hoặc thẻ ngân hàng.
*   **Áp dụng**: UC-16, UC-08, UC-09

========================================================================

## 7. QUY TẮC THEO DÕI TẬP LUYỆN (GYM TRACKING)
========================================================================

### BR-35: Quy tắc tính kỷ lục cá nhân mới (Personal Record - PR)
*   **Loại**: Tính toán
*   **Chi tiết**:
    *   Kỷ lục cá nhân (PR) được ghi nhận và theo dõi độc lập cho từng bài tập cụ thể trong cơ sở dữ liệu.
    *   Công thức tính PR dựa trên khối lượng tập tối đa một lần (Estimated One-Rep Max) hoặc theo mức tạ nặng nhất thực tế đã thực hiện thành công:
        $$\text{PR} = \max(\text{Khối lượng tạ} \times \text{Số lần lặp thực tế}) \text{ trong toàn bộ lịch sử tập}$$
    *   Hội viên có thể vượt và phá nhiều kỷ lục cá nhân PR khác nhau trong cùng một buổi tập.
*   **Áp dụng**: UC-06, Nhóm 3.3.4

### BR-36: Quy tắc gợi ý nhóm cơ tập luyện (Smart Muscle Suggestion)
*   **Loại**: Suy diễn
*   **Chi tiết**:
    *   Hệ thống tự động phân tích lịch sử tập luyện của hội viên trong vòng 7 ngày gần nhất.
    *   Nhóm cơ nào có tần suất tập luyện ít nhất hoặc chưa được tác động trong tuần sẽ được ưu tiên đề xuất làm nhóm cơ chính cho buổi tập ngày hôm nay.
    *   Trong trường hợp các nhóm cơ có tần suất tập luyện bằng nhau, hệ thống sẽ chọn nhóm cơ có thời gian nghỉ ngơi lâu nhất (phục hồi cơ bắp tốt nhất) để đề xuất.
*   **Áp dụng**: UC-05, UC-06

### BR-37: Quy tắc khóa dữ liệu buổi tập (Workout Session Lockdown)
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Hội viên chỉ được phép chỉnh sửa thông số buổi tập (thay đổi số set, reps, khối lượng tạ) hoặc xóa buổi tập đã lưu trong vòng **24 giờ** kể từ thời điểm bấm xác nhận hoàn thành buổi tập (`status = 'Done'`).
    *   Ngay khi hết thời gian 24 giờ, hệ thống sẽ thực hiện khóa vĩnh viễn bản ghi đó để bảo toàn tính trung thực của dữ liệu tiến trình tập luyện và tránh việc chỉnh sửa số liệu nhằm gian lận điểm thưởng XP.
*   **Áp dụng**: UC-06, Nhóm 3.3.4

### BR-38: Thuật toán giải quyết trùng lặp đề xuất nhóm cơ (Tie-Breaking)
*   **Loại**: Suy diễn
*   **Chi tiết**:
    *   Trong trường hợp phân tích lịch sử tập luyện cho ra kết quả nhiều nhóm cơ có số hiệp tập (set) bằng nhau trong tuần, công cụ gợi ý của hệ thống sẽ tự động lựa chọn nhóm cơ lớn hơn (nhóm cơ tiêu thụ nhiều năng lượng của cơ thể hơn) theo trình tự ưu tiên:
        $$\text{Cơ đùi/chân (Legs)} > \text{Cơ lưng (Back)} > \text{Cơ ngực (Chest)} > \text{Cơ vai (Shoulders)} > \text{Cơ tay (Arms)} > \text{Cơ bụng/lõi (Core)}$$
*   **Áp dụng**: UC-05, UC-06

========================================================================

## 8. QUY TẮC CẢNH BÁO VÀ CHĂM SÓC HỘI VIÊN (AI RETENTION)
========================================================================

### BR-39: Quy tắc tự động tạo đề xuất chăm sóc khách hàng (AI Recommendation Rules)
*   **Loại**: Suy diễn
*   **Chi tiết**: Hệ thống tự động phân tích các chỉ số vận hành và hành vi tập luyện của hội viên để tạo các đề xuất chăm sóc khách hàng trong bảng `RECOMMENDATIONS` theo các quy tắc sau:
    *   **Rule 1 (Sắp hết hạn)**: Nếu số ngày còn lại của gói tập (`membershipExpireIn`) $\le 7$ ngày $\rightarrow$ Tạo loại đề xuất "Sắp hết hạn gói tập, nhắc nhở gia hạn".
    *   **Rule 2 (Rời bỏ tập luyện)**: Nếu số ngày không check-in phòng tập (`daysSinceLastCheckin`) $\ge 14$ ngày $\rightarrow$ Tạo loại đề xuất "Nghỉ tập lâu ngày, cần liên hệ hỏi thăm".
    *   **Rule 3 (Hết hạn chưa gia hạn)**: Nếu gói tập đã hết hạn và số ngày trôi qua $\le 30$ ngày $\rightarrow$ Tạo loại đề xuất "Đã hết hạn dưới 1 tháng, mời quay lại".
    *   **Rule 4 (Tập luyện tích cực)**: Nếu số buổi tập trung bình trong tuần (`checkinPerWeek`) $\ge 4$ buổi và đang dùng Gói Tháng $\rightarrow$ Tạo loại đề xuất "Hội viên chăm chỉ, gợi ý chuyển đổi sang Gói Năm để tiết kiệm chi phí".
    *   **Rule 5 (Khách hàng thân thiết nước uống)**: Nếu hội viên mua sản phẩm nước uống/dinh dưỡng $\ge 3$ lần/tuần $\rightarrow$ Gợi ý bán gói combo dinh dưỡng tiết kiệm.
    *   **Rule 6 (Khách hàng thân thiết phụ kiện)**: Nếu hội viên thuê phụ kiện tập luyện $\ge 2$ lần/tháng $\rightarrow$ Đề xuất chuyển sang gói thuê dài hạn đi kèm.
    *   Mỗi bản ghi được tạo ra sẽ bao gồm phân loại đề xuất, độ ưu tiên xử lý (Cao/Trung bình/Thấp), hành động chăm sóc gợi ý cho nhân viên và trạng thái xử lý (`pending` - đang chờ, `handled` - đã xử lý, `dismissed` - bỏ qua).
*   **Áp dụng**: UC-14, Timer Actor

### BR-40: Quy tắc cập nhật trạng thái chăm sóc hội viên
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Nhân viên chăm sóc khách hàng sau khi liên hệ trực tiếp với hội viên bắt buộc phải cập nhật trạng thái xử lý của đề xuất trên Dashboard:
        *   `handled`: Đã liên lạc thành công, ghi chú kết quả phản hồi của khách hàng.
        *   `dismissed`: Bỏ qua đề xuất do khách hàng từ chối nhận cuộc gọi hoặc lý do khách quan khác (phải ghi rõ lý do bỏ qua).
    *   Để tránh làm phiền hội viên, hệ thống cấm tạo các đề xuất trùng lặp cùng phân loại đối với một hội viên trong vòng 7 ngày liên tục.
*   **Áp dụng**: UC-14

========================================================================

## 9. QUY TẮC BẢO MẬT VÀ KIẾN TRÚC HỆ THỐNG
========================================================================

### BR-41: Xác thực chữ ký webhook từ cổng thanh toán
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Mọi yêu cầu gọi lại (Callback/Webhook) trả kết quả giao dịch từ cổng thanh toán trực tuyến (VNPay, MoMo) về hệ thống bắt buộc phải đi qua bước đối chiếu chữ ký bảo mật (Checksum) bằng thuật toán mã hóa Hash HMAC-SHA512.
    *   Bất kỳ yêu cầu nào không khớp chữ ký bảo mật sẽ lập tức bị từ chối và ghi nhận vào nhật ký log bảo mật để ngăn chặn các cuộc tấn công giả mạo giao dịch.
*   **Áp dụng**: UC-16

### BR-42: Bảo đảm tính duy nhất của giao dịch thanh toán (Idempotency)
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Hệ thống chỉ xử lý ghi nhận giao dịch thanh toán thành công, cộng tiền vào ví FitCoin hoặc gia hạn gói tập **đúng một lần duy nhất** cho mỗi mã giao dịch (`Transaction ID`) gửi về từ cổng thanh toán.
    *   Nếu nhận được yêu cầu trùng mã giao dịch đã xử lý trước đó, hệ thống sẽ bỏ qua bước xử lý số dư/gói tập và chỉ trả về trạng thái phản hồi thành công trước đó để tránh lỗi cộng tiền lặp cho hóa đơn.
*   **Áp dụng**: UC-16

### BR-43: Kiến trúc hệ thống đơn sở hữu (Single-Tenant)
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Hệ thống FitFuel+ được thiết kế để phục vụ độc quyền cho duy nhất một phòng tập vật lý.
    *   Bảng quản lý thông tin phòng tập (`GYMS`) được ràng buộc chỉ chứa đúng 1 dòng dữ liệu duy nhất với mã định danh phòng tập `gym_id = 1`.
    *   Hệ thống không cung cấp chức năng đăng ký hoặc khởi tạo thêm phòng tập mới. Tất cả các tài khoản có phân quyền Gym Owner đều thực hiện quản trị chung một cơ sở phòng tập này.
*   **Áp dụng**: Toàn bộ hệ thống

========================================================================

## 10. QUY TẮC CÔNG CỤ THEO DÕI HÀNH TRÌNH (TRANSFORMATION JOURNEY ENGINE)
========================================================================

### BR-44: Quy tắc gợi ý chương trình tập luyện (Goal-driven Programs Suggestion)
*   **Loại**: Suy diễn
*   **Chi tiết**:
    *   Sau khi hội viên hoàn tất khảo sát mục tiêu gồm 5 câu hỏi (Goal Onboarding), hệ thống sẽ tiến hành lọc danh sách chương trình tập luyện (`WORKOUT_PROGRAMS`) thỏa mãn đồng thời 3 tiêu chí:
        *   Khớp loại mục tiêu tập luyện (`goal_type`).
        *   Khớp cấp độ thể lực hiện tại (`fitness_level`).
        *   Khớp số ngày có thể đi tập mỗi tuần (`days_per_week`).
    *   Nếu kết quả lọc được ít hơn 2 chương trình, hệ thống tự động mở rộng điều kiện tìm kiếm bằng cách nới lỏng tiêu chí cấp độ thể lực (ví dụ: cấp độ Beginner có thể chuyển sang lọc cả Intermediate).
    *   Hệ thống hiển thị tối đa 3 chương trình gợi ý tốt nhất, sắp xếp thứ tự ưu tiên:
        1.  Khớp hoàn hảo cả 3 tiêu chí khảo sát.
        2.  Khớp 2 tiêu chí (sau khi đã nới lỏng cấp độ thể lực).
        3.  Chương trình tập luyện phổ biến nhất (có số lượng hội viên đang tham gia nhiều nhất).
    *   Khi hội viên bấm chọn một chương trình tập luyện, hệ thống sẽ kích hoạt chương trình đó (`status = 'active'`) trong lịch sử tập luyện. Một hội viên tại một thời điểm chỉ được phép sở hữu **duy nhất 1 chương trình tập luyện ở trạng thái kích hoạt**.
*   **Áp dụng**: UC-05, Nhóm 3.3.3

### BR-45: Quy tắc sinh lịch tập hằng ngày tự động (Daily Session Generation)
*   **Loại**: Suy diễn
*   **Chi tiết**:
    *   Khi hội viên chọn nhóm cơ muốn tập luyện trong ngày trên Web App, hệ thống sẽ ngay lập tức tự động sinh ra một giáo án buổi tập hoàn chỉnh bao gồm:
        *   Danh sách các bài tập phù hợp nhất cho nhóm cơ đã chọn từ chương trình tập luyện active.
        *   Số hiệp tập (Sets) và số lần lặp mục tiêu (Reps) tương ứng.
        *   Khối lượng tạ đề xuất dựa trên: Lịch sử khối lượng tập của buổi tập trước đó cộng thêm tỷ lệ mục tiêu thể lực của hội viên.
    *   Giáo án buổi tập được tạo ra chỉ mang tính chất đề xuất để giảm thời gian chuẩn bị của hội viên. Hội viên hoàn toàn có quyền chỉnh sửa giáo án trước khi bắt đầu (thêm/xóa bài tập, thay đổi số set/rep theo ý muốn cá nhân). Toàn bộ thao tác thay đổi này được lưu lại dưới dạng định dạng JSON trong bảng nhật ký chỉnh sửa (`customization_log`).
    *   Nếu hội viên chưa thực hiện thiết lập mục tiêu cá nhân, hệ thống sẽ tự động áp dụng giáo án mặc định ở cấp độ cơ bản (Beginner) dành cho nhóm cơ đã chọn.
*   **Áp dụng**: UC-05, Nhóm 3.3.3

### BR-46: Quy tắc đề xuất tăng/giảm khối lượng tạ thông minh (Progressive Overload AI)
*   **Loại**: Suy diễn & Hành động
*   **Chi tiết**: Ngay khi hội viên hoàn thành và nhấn lưu buổi tập, hệ thống sẽ phân tích kết quả tập luyện thực tế của từng bài tập để đưa ra đề xuất:
    *   **Điều kiện ĐỀ XUẤT TĂNG TẠ (Overload)**:
        *   Số lần lặp thực tế hoàn thành (`actual_reps`) $\ge$ số lần lặp mục tiêu tối đa (`target_reps_max`) ở tất cả các hiệp tập của cùng một bài tập trong **2 buổi tập liên tiếp** gần nhất.
        *   *Hành động*: Ghi nhận đề xuất tăng tạ vào nhật ký: `overload_suggestion = {next_weight: current_weight + 2.5kg, reason: "Đã vượt số rep mục tiêu 2 lần liên tiếp"}` và hiển thị lời khuyên tăng tạ trên màn hình tiến trình của hội viên.
    *   **Điều kiện ĐỀ XUẤT GIỮ NGUYÊN / GIẢM TẠ**:
        *   Số lần lặp thực tế hoàn thành (`actual_reps`) $<$ số lần lặp mục tiêu tối thiểu (`target_reps_min`) trong **2 buổi tập liên tiếp** $\rightarrow$ Gợi ý giữ nguyên mức tạ và tập trung cải thiện tư thế tập.
    *   **Điều kiện PHÁT HIỆN CHẠM NGƯỠNG (Stuck/Plateau)**:
        *   Số lần lặp thực tế hoàn thành liên tục thấp hơn mức mục tiêu tối thiểu trong **3 buổi tập liên tiếp** của cùng một bài tập.
        *   *Hành động*: Hệ thống tự động tạo một cảnh báo trạng thái chậm tiến trình (stuck_plateau) gửi vào danh sách chăm sóc của nhân viên với mức ưu tiên **Thấp (Low)** để nhân viên/PT tại phòng tập có thể chủ động ra hỗ trợ điều chỉnh kỹ thuật tập luyện trực tiếp cho hội viên.
*   **Áp dụng**: UC-06, UC-07, Nhóm 3.3.5

### BR-47: Quy tắc kích hoạt gợi ý sản phẩm dinh dưỡng sau tập (AI Nutrition Trigger)
*   **Loại**: Hành động
*   **Chi tiết**:
    *   Ngay khi trạng thái buổi tập của hội viên chuyển sang hoàn thành (`status = 'done'`), hệ thống lập tức kích hoạt bộ công cụ phân tích dinh dưỡng sử dụng 4 nguồn thông tin đầu vào:
        1.  Nhóm cơ chính vừa hoàn thành tập luyện trong ngày.
        2.  Mục tiêu cá nhân hiện tại của hội viên (`goal_type`).
        3.  Cường độ tập luyện thực tế (nếu tổng số set hoàn thành $> 15$ set tính là cường độ 'Cao', nếu $\le 8$ set tính là cường độ 'Thấp').
        4.  Lịch sử các sản phẩm dinh dưỡng hội viên thường đặt mua nhất (lấy top 3 từ lịch sử mua hàng).
    *   *Kết quả*: Hiển thị một cửa sổ gợi ý gồm tối đa 3 sản phẩm bổ sung dinh dưỡng phù hợp nhất hiện đang còn sẵn hàng trong kho (`is_available = true`).
    *   *Thứ tự ưu tiên gợi ý*: Ưu tiên các sản phẩm hội viên thích mua nhất thỏa mãn nhóm cơ vừa tập, tiếp theo đến các sản phẩm phù hợp nhất cho mục tiêu dài hạn. Để đảm bảo tính đa dạng, gợi ý sẽ không hiển thị lại các sản phẩm mà hội viên đã thực hiện mua trong ngày hôm đó.
*   **Áp dụng**: UC-06, UC-08, Nhóm 3.3.6

### BR-48: Quy tắc AI Care Queue mở rộng (Quy tắc R7, R8, R9)
*   **Loại**: Hành động
*   **Chi tiết**: Bổ sung thêm 3 quy tắc kích hoạt tự động vào hàng đợi chăm sóc khách hàng AI Care Queue nâng tổng số quy tắc từ 6 lên 9 quy tắc để theo dõi sát sao tiến trình Transformation Journey của hội viên:
    *   **Rule 7 (R7 - Bỏ bê chương trình tập)**: Hội viên đang có chương trình tập luyện kích hoạt (`status = 'active'`) nhưng không hoàn thành bất kỳ hiệp tập nào thuộc giáo án chương trình trong quá 7 ngày liên tiếp.
        *   *Hành động*: Tạo cảnh báo chăm sóc độ ưu tiên **Cao (High)**: "Hội viên bỏ dở lịch tập chương trình trên 7 ngày. Cần nhân viên liên hệ động viên."
    *   **Rule 8 (R8 - Hoàn thành mục tiêu)**: Trạng thái chương trình tập luyện của hội viên chuyển sang hoàn thành (`completion_pct = 100` và `status = 'completed'`).
        *   *Hành động*: Tạo đề xuất chăm sóc độ ưu tiên **Trung bình (Medium)**: "Hội viên đã xuất sắc hoàn thành giáo án chương trình tập. Liên hệ chúc mừng và tư vấn đề xuất chương trình nâng cao tiếp theo."
    *   **Rule 9 (R9 - Gặp khó khăn khi tập)**: Được kích hoạt tự động khi hội viên chạm điều kiện stuck_plateau của quy tắc BR-46.
        *   *Hành động*: Tạo đề xuất chăm sóc độ ưu tiên **Thấp (Low)**: "Hội viên gặp khó khăn lâu ngày ở bài tập [Tên bài]. Hỗ trợ PT tư vấn kỹ thuật."
    *   *Chống trùng lặp*: Áp dụng quy tắc BR-40, các cảnh báo chăm sóc này sẽ không tạo lặp lại đối với cùng một hội viên trong thời gian 7 ngày.
*   **Áp dụng**: UC-14, UC-07, Timer Actor

### BR-49: Quy tắc động cơ ghi nhận cột mốc (Milestone Engine - 22 Cột mốc)
*   **Loại**: Hành động
*   **Chi tiết**:
    *   Mỗi khi có một hành động kỹ thuật được ghi nhận thành công trên hệ thống (Check-in, Hoàn thành buổi tập, Thiết lập PR mới, Cập nhật số đo cơ thể mới, Đăng ký chương trình tập mới, hoặc Thanh toán hóa đơn sản phẩm dinh dưỡng), công cụ Milestone Engine sẽ chạy kiểm tra 22 điều kiện cột mốc để trao thưởng điểm kinh nghiệm XP và FitCoin tương ứng theo bảng dưới đây:
        
        | Mã số cột mốc | Điều kiện kỹ thuật kích hoạt phần thưởng | Số FitCoin thưởng | Số điểm XP thưởng |
        | :---: | :--- | :---: | :---: |
        | **M01** | Hoàn thành buổi tập đầu tiên thành công | 50 | 200 |
        | **M02** | Hoàn thành đầy đủ số buổi tập trong tuần đầu tiên | 100 | 500 |
        | **M03** | Thiết lập mục tiêu tập luyện + Kích hoạt chương trình tập đầu tiên | 50 | 100 |
        | **M10** | Đạt chuỗi đi tập liên tục (Streak) 7 ngày | 70 | 300 |
        | **M11** | Đạt chuỗi đi tập liên tục (Streak) 14 ngày | 150 | 600 |
        | **M12** | Đạt chuỗi đi tập liên tục (Streak) 30 ngày | 300 | 1500 |
        | **M20** | Thiết lập kỷ lục cá nhân (PR) mới cho bài tập bất kỳ | 30 | 150 |
        | **M21** | Tăng 10% tổng khối lượng tạ bài tập chính so với tuần đầu tiên | 100 | 400 |
        | **M22** | Tăng 25% tổng khối lượng tạ bài tập chính so với tuần đầu tiên | 200 | 800 |
        | **M30** | Đạt mốc hoàn thành 25% mục tiêu tiến trình của chương trình tập | 50 | 200 |
        | **M31** | Đạt mốc hoàn thành 50% mục tiêu tiến trình của chương trình tập | 100 | 500 |
        | **M32** | Hoàn thành 100% mục tiêu chương trình tập (CELEBRATION MAX) | 500 | 2000 |
        | **M40** | Hoàn thành đầy đủ giáo án tập luyện của tuần thứ nhất | 20 | 100 |
        | **M41** | Hoàn thành đầy đủ giáo án tập luyện của tháng thứ nhất | 150 | 600 |
        | **M42** | Hoàn thành trọn vẹn toàn bộ 12 tuần của chương trình (CELEBRATION MAX) | 500 | 2000 |
        | **M50** | Đặt mua sản phẩm dinh dưỡng sau buổi tập đủ 5 lần | 50 | 200 |
        | **M51** | Thực hiện đặt trước sản phẩm dinh dưỡng (Pre-order) đủ 10 lần | 100 | 400 |
        | **M60** | Cập nhật đầy đủ chỉ số số đo cơ thể đều đặn trong 4 tuần liên tục | 80 | 300 |
        | **M61** | Giảm thành công 3% lượng mỡ cơ thể (Body Fat) dựa theo số đo cập nhật | 200 | 800 |
        | **M70** | Tạo và chia sẻ câu chuyện tiến trình (Share Card) đầu tiên lên mạng xã hội | 100 | 300 |
        | **M71** | Có bạn bè đăng ký sử dụng dịch vụ thành công qua link giới thiệu cá nhân | 500 | 1000 |
        | **M80** | Duy trì tài khoản hội viên và đồng hành cùng phòng tập tròn 1 năm | 300 | 1200 |
    *   *Lưu ý*: Cột mốc ngày streak bị đứt do nghỉ tập quá hạn (ví dụ mốc M13) tuyệt đối không được hiển thị hoặc gửi thông báo chia buồn nhằm tránh tạo tâm lý tiêu cực cho hội viên.
    *   Mỗi cột mốc phần thưởng chỉ được trao duy nhất một lần trong suốt vòng đời tài khoản của hội viên.
    *   Đối với các cột mốc đặc biệt lớn (M32, M42 - Celebration Max), ứng dụng sẽ kích hoạt hiệu ứng chúc mừng tràn màn hình và hiển thị gợi ý chia sẻ lên bảng tin để nhận thêm điểm thưởng.
*   **Áp dụng**: UC-11, Nhóm 3.3.8

========================================================================

## 11. QUY TẮC MUA SẮM CHƯA ĐĂNG KÝ VÀ XÁC THỰC GUEST OTP
========================================================================

### BR-50: Quy tắc xác thực khách vãng lai mua hàng bằng OTP nhanh
*   **Loại**: Ràng buộc & Hành động
*   **Chi tiết**:
    *   Khách vãng lai muốn thực hiện mua sản phẩm tại cửa hàng hoặc đặt hàng qua Web App bắt buộc phải xác thực số điện thoại qua luồng OTP nhanh:
        1.  Khách hàng nhập số điện thoại cá nhân $\rightarrow$ Hệ thống tự động gửi tin nhắn SMS chứa mã OTP gồm 6 chữ số ngẫu nhiên.
        2.  Mã OTP xác thực nhanh này có thời hạn hiệu lực tối đa là 10 phút kể từ thời điểm gửi.
        3.  Giới hạn tần suất: Mỗi số điện thoại được yêu cầu gửi mã OTP tối đa 3 lần trong vòng 24 giờ.
        4.  Sau khi xác thực thành công, hệ thống cấp một mã định danh phiên tạm thời (`session_token`) có hiệu lực hoạt động trong 2 giờ.
        5.  Mã phiên này cho phép khách hàng tạo hóa đơn mua sản phẩm (`INVOICES`) với trường thông tin hội viên để trống (`user_id = NULL`) và lưu số điện thoại giao dịch vào trường `guest_phone`.
        6.  Khách hàng mua hàng nhanh theo luồng này không có tài khoản hội viên chính thức nên thông tin không được tích lũy điểm kinh nghiệm XP, không có ví FitCoin và không được ghi nhận lịch sử vào các chương trình ưu đãi.
        7.  Nếu số điện thoại khách hàng nhập trùng khớp với một tài khoản hội viên đã tồn tại trên hệ thống, Web App sẽ ngăn luồng OTP nhanh và hiển thị cửa sổ yêu cầu đăng nhập tài khoản.
*   **Áp dụng**: UC-02, UC-09, Nhóm 3.3.1

### BR-51: Giới hạn giá trị giao dịch đối với khách hàng chưa đăng ký
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Trong phạm vi thời gian hiệu lực 2 giờ của phiên giao dịch nhanh bằng OTP, khách hàng vãng lai phải tuân thủ các giới hạn:
        *   Tổng giá trị tất cả hóa đơn mua sản phẩm thanh toán thành công không vượt quá **5.000.000 VND** trong vòng 24 giờ trên cùng một số điện thoại xác thực.
        *   Tạo tối đa không quá 3 đơn đặt hàng sản phẩm trong một phiên giao dịch.
        *   Chỉ được đặt mua các sản phẩm dinh dưỡng bổ sung hoặc đồ tập có sẵn $\rightarrow$ Tuyệt đối không được phép sử dụng dịch vụ thuê thiết bị tập luyện (Gear Rental).
        *   Giao dịch thanh toán bắt buộc phải sử dụng các cổng thanh toán trực tuyến hoặc trả tiền mặt trực tiếp tại quầy; khách hàng vãng lai không được áp dụng giảm giá bằng điểm FitCoin.
*   **Áp dụng**: UC-02, UC-09, Nhóm 3.3.1

========================================================================

## 12. QUY TẮC NGHIỆP VỤ HÀNH TRÌNH KHÁCH HÀNG (USER JOURNEY)
========================================================================

### BR-52: Cho phép khách vãng lai xem gợi ý tập luyện cơ bản
*   **Loại**: Ràng buộc
*   **Chi tiết**: Khách vãng lai khi truy cập Landing Page của FitFuel+ được phép xem các thông tin gợi ý về khung giờ phòng tập ít đông đúc nhất trong ngày và xem gợi ý gói tập phù hợp dựa theo khảo sát nhanh mà không bắt buộc phải đăng nhập hoặc đăng ký tài khoản trước.
*   **Áp dụng**: UC-01, Nhóm 3.3.1

### BR-53: Yêu cầu xác thực thông tin khi đăng ký trải nghiệm thực tế
*   **Loại**: Ràng buộc
*   **Chi tiết**: Để thực hiện đặt lịch tham quan phòng tập (Gym Tour) hoặc kích hoạt gói trải nghiệm tập thử miễn phí (Free Trial Pass), người dùng bắt buộc phải thực hiện đăng nhập tài khoản hội viên hoặc đi qua bước xác thực số điện thoại qua OTP (Quy trình xác thực nhanh SP-02).
*   **Áp dụng**: UC-02, Nhóm 3.3.1

### BR-54: Nguyên tắc gợi ý gói tập trung thực của Goal Engine
*   **Loại**: Ràng buộc
*   **Chi tiết**: Công cụ gợi ý gói tập tự động tuyệt đối không được mặc định đề xuất gói tập có giá tiền cao nhất cho người dùng. Đề xuất hiển thị phải dựa trên việc phân tích mục tiêu tập luyện thực tế, khả năng ngân sách và rào cản tập luyện do người dùng tự khai báo trong khảo sát.
*   **Áp dụng**: UC-01, Nhóm 3.3.1

### BR-55: Đề xuất trải nghiệm miễn phí khi khách hàng chưa sẵn sàng mua gói
*   **Loại**: Hành động
*   **Chi tiết**: Nếu khách hàng hoàn thành khảo sát và bấm chọn trạng thái "Chưa sẵn sàng mua gói tập ngay hôm nay", Web App tuyệt đối không được đóng luồng trải nghiệm. Hệ thống phải lập tức chuyển sang hiển thị đề xuất đăng ký một buổi tham quan phòng tập hướng dẫn (Gym Tour) hoặc kích hoạt dùng thử Free Trial Pass 7 ngày hoàn toàn miễn phí.
*   **Áp dụng**: UC-02, Nhóm 3.3.1

### BR-56: Bắt buộc giải thích lý do đề xuất gói tập
*   **Loại**: Ràng buộc
*   **Chi tiết**: Trên trang so sánh gói tập thông minh (Smart Plan Compare), ứng dụng phải hiển thị một câu tóm tắt giải thích rõ ràng lý do khoa học vì sao gói tập đó được đề xuất riêng cho mục tiêu và thể trạng của hội viên.
*   **Áp dụng**: UC-03, Nhóm 3.3.2

### BR-57: Quyền tự do lựa chọn gói tập của hội viên
*   **Loại**: Ràng buộc
*   **Chi tiết**: Mặc dù hệ thống đưa ra các gói tập tối ưu được đề xuất bởi AI, hội viên luôn luôn có quyền truy cập xem chi tiết và đăng ký mua bất kỳ gói tập nào khác có trên hệ thống mà không bị giới hạn hay ép buộc mua gói được đề xuất.
*   **Áp dụng**: UC-03, Nhóm 3.3.2

### BR-58: Tự động kế thừa lịch sử dùng thử khi đăng ký tài khoản chính thức
*   **Loại**: Hành động
*   **Chi tiết**: Khi khách hàng quyết định nâng cấp lên gói tập chính thức sau thời gian tập thử, toàn bộ dữ liệu lịch sử các buổi tập, chỉ số cơ thể và kết quả tập luyện thu thập được trong thời gian dùng thử (Trial History) phải được tự động liên kết và chuyển giao đầy đủ vào hồ sơ hội viên chính thức của họ.
*   **Áp dụng**: UC-03, Nhóm 3.3.2

### BR-59: Yêu cầu thiết lập phương thức đăng nhập bảo mật lâu dài
*   **Loại**: Ràng buộc
*   **Chi tiết**: Phiên đăng nhập nhanh qua SMS OTP chỉ được coi là giải pháp tạm thời để đăng ký dịch vụ nhanh. Khi chuyển sang tài khoản hội viên chính thức, người dùng bắt buộc phải thực hiện thiết lập tài khoản bảo mật lâu dài bằng cách cung cấp địa chỉ Email đi kèm mật khẩu cá nhân hoặc liên kết tài khoản định danh mạng xã hội (OAuth: Google, Facebook).
*   **Áp dụng**: UC-03, UC-04, Nhóm 3.3.2

### BR-60: Bắt buộc đồng ý điều khoản sử dụng dịch vụ
*   **Loại**: Ràng buộc
*   **Chi tiết**: Người dùng mới bắt buộc phải tích chọn hộp kiểm "Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật của FitFuel+" trước khi hệ thống chấp nhận lưu hồ sơ và tạo tài khoản ở trạng thái chờ kích hoạt (`pending_activation`).
*   **Áp dụng**: UC-03, Nhóm 3.3.2

### BR-61: Giải thích lý do lựa chọn danh sách bài tập đề xuất
*   **Loại**: Ràng buộc
*   **Chi tiết**: Trong tính năng lập lịch tập bằng AI (AI Workout Onboarding), hệ thống bắt buộc phải hiển thị chú thích giải thích lý do vì sao một số bài tập cụ thể được đưa vào danh sách đề xuất (ví dụ: "Bài tập này được chọn vì phù hợp với trình độ mới bắt đầu của bạn và tập trung vào nhóm cơ ngực theo yêu cầu").
*   **Áp dụng**: UC-05, Nhóm 3.3.3

### BR-62: Quyền chỉnh sửa giáo án tập luyện của hội viên
*   **Loại**: Ràng buộc
*   **Chi tiết**: Hội viên có toàn quyền thực hiện thêm bài tập mới, xóa bớt bài tập không muốn tập hoặc thay đổi thứ tự thực hiện các bài tập trong giáo án do AI gợi ý trước khi bấm nút lưu danh sách bài tập chính thức.
*   **Áp dụng**: UC-05, Nhóm 3.3.3

### BR-63: Quản lý lịch sử thay đổi giáo án tập luyện qua phiên bản (Versioning)
*   **Loại**: Ràng buộc
*   **Chi tiết**: Mỗi khi hội viên thực hiện thay đổi và lưu lại danh sách giáo án tập luyện cá nhân, hệ thống phải lưu bản ghi mới dưới dạng một phiên bản mới (ví dụ: Version 1.0, Version 1.1) thay vì ghi đè lên dữ liệu cũ, nhằm theo dõi lịch sử điều chỉnh giáo án tập luyện qua từng thời kỳ.
*   **Áp dụng**: UC-05, UC-07, Nhóm 3.3.3

### BR-64: Sử dụng giáo án mặc định khi thiếu dữ liệu phân tích
*   **Loại**: Suy diễn
*   **Chi tiết**: Trong trường hợp hội viên mới chưa thực hiện khảo sát thể trạng hoặc hệ thống chưa thu thập đủ dữ liệu tập luyện để đưa ra gợi ý cá nhân hóa, AI Workout Onboarding sẽ tự động cung cấp bộ giáo án tập luyện cơ bản được xây dựng sẵn (Preset) dựa trên mục tiêu chung duy nhất mà hội viên đã chọn.
*   **Áp dụng**: UC-05, Nhóm 3.3.3

### BR-65: Yêu cầu quyền hội viên hoạt động khi khởi tạo buổi tập
*   **Loại**: Ràng buộc
*   **Chi tiết**: Hệ thống chỉ cho phép khởi tạo một buổi tập mới (Workout Session) khi tài khoản người dùng đang sở hữu gói tập (Gói Tháng, Gói Năm) còn trong thời hạn sử dụng, hoặc đang trong thời gian hiệu lực của gói tập thử Free Trial Pass.
*   **Áp dụng**: UC-06, Nhóm 3.3.4

### BR-66: Kiểm tra và cảnh báo dữ liệu nhập bất thường
*   **Loại**: Hành động
*   **Chi tiết**: Khi hội viên ghi nhận kết quả tập luyện, hệ thống phải thực hiện kiểm tra so sánh với lịch sử. Nếu phát hiện các chỉ số nhập vào có sự bất thường quá lớn (ví dụ: Khối lượng tạ tăng đột biến gấp 5 lần so với buổi tập trước đó), hệ thống phải hiển thị cửa sổ xác nhận yêu cầu hội viên kiểm tra lại số liệu trước khi lưu vào bảng kỷ lục cá nhân PR để tránh làm nhiễu dữ liệu.
*   **Áp dụng**: UC-06, Nhóm 3.3.4

### BR-67: Tạo yêu cầu chăm sóc hội viên mới sau buổi tập đầu tiên
*   **Loại**: Hành động
*   **Chi tiết**: 
    *   Ngay khi hội viên hoàn thành buổi tập đầu tiên trên ứng dụng (kể cả buổi tập trong thời gian dùng thử Free Trial), hệ thống sẽ tự động tạo một yêu cầu chăm sóc khách hàng mới trong bảng `CARE_FOLLOWUPS`.
    *   Yêu cầu này giao cho nhân viên bộ phận CSKH liên hệ trực tiếp qua điện thoại hoặc gửi tin nhắn hỏi thăm, hỗ trợ hội viên trong vòng 24 đến 48 giờ kể từ khi hoàn thành buổi tập đầu tiên. 
    *   Hệ thống không đầu tư phát triển luồng chăm sóc tự động hàng loạt cho các hội viên đã nghỉ tập quá lâu, do hiệu quả chuyển đổi thực tế cực kỳ thấp; thay vào đó tập trung tối đa nguồn lực hỗ trợ hội viên mới trong tuần đầu tiên.
*   **Áp dụng**: UC-06, UC-14, Nhóm 3.3.4

### BR-68: [ĐÃ LOẠI BỎ]
*   **Chi tiết**: Quy tắc liên quan đến nhận diện khách vãng lai mua Day-pass qua số điện thoại đã được loại bỏ hoàn toàn khỏi hệ thống do phòng tập ngừng cung cấp dịch vụ gói tập theo ngày Day-pass có phí để giảm ma sát giao dịch trực tuyến ban đầu cho khách hàng mới.

### BR-69: Điều kiện kích hoạt cảnh báo chậm tiến trình tập luyện (Plateau Alert)
*   **Loại**: Ràng buộc
*   **Chi tiết**: Cảnh báo chậm tiến trình (Plateau Alert) chỉ được phép kích hoạt khi hệ thống thu thập đủ dữ liệu tập luyện tối thiểu của bài tập đó trong vòng 4 tuần liên tục, nhằm đảm bảo thuật toán AI phân tích xu hướng tiến bộ có đủ số liệu thống kê chuẩn xác và tránh đưa ra cảnh báo sai lệch.
*   **Áp dụng**: Không áp dụng

### BR-70: Tạm ngừng đề xuất tăng tạ đối với hội viên thường xuyên bỏ buổi
*   **Loại**: Ràng buộc
*   **Chi tiết**: Hệ thống tự động khóa tính năng đề xuất tăng độ khó bài tập hoặc tăng khối lượng tạ tập luyện đối với các hội viên có tỷ lệ hoàn thành số buổi tập mục tiêu trong tháng đạt dưới 60%, nhằm đảm bảo an toàn thể chất cho hội viên và tránh các chấn thương đáng tiếc xảy ra do tập luyện quá tải.
*   **Áp dụng**: UC-07, Nhóm 3.3.5

### BR-71: Quyền lựa chọn xử lý cảnh báo tiến trình của hội viên
*   **Loại**: Ràng buộc
*   **Chi tiết**: Khi nhận được cảnh báo chạm ngưỡng tiến trình (Plateau Alert), hội viên có toàn quyền lựa chọn: Bấm đồng ý áp dụng phương án điều chỉnh giáo án đề xuất của AI, lựa chọn bỏ qua cảnh báo (Dismiss), hoặc chọn tính năng tạm ẩn và hiển thị nhắc lại sau 7 ngày.
*   **Áp dụng**: UC-07, Nhóm 3.3.5

### BR-72: Lưu trữ giáo án điều chỉnh tiến trình thành phiên bản mới
*   **Loại**: Ràng buộc
*   **Chi tiết**: Mọi giao dịch điều chỉnh danh sách bài tập hoặc giảm mức tạ tập luyện nhằm khắc phục tình trạng chậm tiến trình (Plateau) sau khi được hội viên bấm xác nhận đồng ý phải được lưu trữ thành một phiên bản giáo án mới trên hệ thống để phục vụ việc đối chiếu hiệu quả tập luyện sau này.
*   **Áp dụng**: UC-07, Nhóm 3.3.5

### BR-73: Thuật toán gợi ý thực đơn ăn uống cá nhân hóa (Meal Suggestion)
*   **Loại**: Suy diễn
*   **Chi tiết**: Thực đơn ăn uống gợi ý cho hội viên hằng ngày phải được tính toán tự động dựa trên sự kết hợp của: Mục tiêu hình thể dài hạn (`goal_type`), dữ liệu tiêu hao calo thực tế từ buổi tập vừa hoàn thành trong ngày, danh sách các chất dị ứng thực phẩm do hội viên khai báo, và số lượng thực phẩm bổ sung/nguyên liệu hiện còn sẵn sàng phục vụ tại quầy bar dinh dưỡng của phòng tập.
*   **Áp dụng**: UC-08, Nhóm 3.3.6

### BR-74: Loại bỏ các sản phẩm hết hàng khỏi danh sách gợi ý bữa ăn
*   **Loại**: Ràng buộc
*   **Chi tiết**: Hệ thống cấm hiển thị gợi ý hoặc đề xuất các món ăn/thực phẩm bổ sung hiện đang có số lượng tồn kho bằng 0 trong bảng kho hàng. Trong trường hợp món ăn đề xuất bị hết nguyên liệu, thuật toán gợi ý phải tự động tìm kiếm và đề xuất một sản phẩm thay thế có hàm lượng dinh dưỡng đa lượng (Macronutrients: Protein, Carb, Fat) tương đương để giới thiệu cho hội viên.
*   **Áp dụng**: UC-08, Nhóm 3.3.6

### BR-75: Cho phép lưu trữ thực đơn ăn uống để tham khảo
*   **Loại**: Ràng buộc
*   **Chi tiết**: Hội viên có quyền tự do xây dựng và bấm lưu danh sách thực đơn ăn uống gợi ý (Meal Plan) vào bộ sưu tập cá nhân trên ứng dụng để tham khảo tự chế biến tại nhà mà không bắt buộc phải tiến hành thanh toán đặt mua nguyên liệu/nước uống tại phòng tập.
*   **Áp dụng**: UC-08, Nhóm 3.3.6

### BR-76: Yêu cầu hiển thị đầy đủ thông tin dinh dưỡng của combo bữa ăn
*   **Loại**: Ràng buộc
*   **Chi tiết**: Tất cả các combo dinh dưỡng gợi ý hiển thị trên giao diện Meal Planner bắt buộc phải đi kèm thông tin chi tiết về: Tổng hàm lượng Calo, hàm lượng dinh dưỡng chi tiết (số gam Protein, Carbohydrates, Lipids), danh sách đầy đủ nguyên liệu thành phần và tổng chi phí thanh toán sau khi đã áp dụng giảm giá combo.
*   **Áp dụng**: UC-08, Nhóm 3.3.6

### BR-77: Bắt buộc khai báo dị ứng thực phẩm trước khi nhận gợi ý dinh dưỡng
*   **Loại**: Ràng buộc
*   **Chi tiết**: Trước khi hệ thống hiển thị danh sách gợi ý bữa ăn dinh dưỡng đầu tiên trên ứng dụng, hội viên bắt buộc phải thực hiện hoàn thành bảng khảo sát ngắn về dị ứng thực phẩm (ví dụ: Dị ứng với các loại hạt, dị ứng sữa đường Lactose) và các giới hạn ăn uống cá nhân (ví dụ: Ăn chay, ăn kiêng Gluten) để đảm bảo an toàn tuyệt đối cho sức khỏe của hội viên.
*   **Áp dụng**: UC-08, Nhóm 3.3.6

### BR-78: Gửi thông báo nhắc nhở gia hạn kèm theo giá trị tiến trình tập luyện
*   **Loại**: Ràng buộc
*   **Chi tiết**: Các thông báo tự động nhắc nhở gia hạn gói tập gửi đến thiết bị của hội viên tuyệt đối không được sử dụng nội dung giục giã mua hàng đơn điệu. Thông báo gửi đi bắt buộc phải tích hợp kèm báo cáo tiến trình tập luyện tích cực của hội viên trong chu kỳ vừa qua (ví dụ: "Bạn đã hoàn thành xuất sắc 12 buổi tập và tích lũy được 600 XP trong tháng này! Hãy tiếp tục duy trì gói tập để không bỏ lỡ đà tiến bộ nhé!").
*   **Áp dụng**: UC-10, Nhóm 3.3.7

### BR-79: Không tự động gợi ý nâng cấp gói tập đối với hội viên ít đi tập
*   **Loại**: Ràng buộc
*   **Chi tiết**: Hệ thống tuyệt đối không thực hiện gửi đề xuất gợi ý nâng cấp từ Gói Tháng lên Gói Năm trong các thông báo nhắc gia hạn đối với những hội viên có tần suất đến phòng tập thực tế quá thấp (đạt dưới 2 buổi đi tập/tuần trong vòng 4 tuần gần nhất), nhằm tránh gây cảm giác phiền hà và trải nghiệm bị ép buộc mua hàng đối với hội viên.
*   **Áp dụng**: UC-10, Nhóm 3.3.7

### BR-80: Quyền tạm thời tắt thông báo nhắc nhở gia hạn gói tập
*   **Loại**: Ràng buộc
*   **Chi tiết**: Hội viên có quyền truy cập vào phần cài đặt thông báo để lựa chọn tạm tắt tính năng nhắc nhở gia hạn gói tập trong các khoảng thời gian tùy chọn (ví dụ: Tắt nhắc nhở trong vòng 7 ngày, 14 ngày hoặc 30 ngày) khi họ có kế hoạch nghỉ tập tạm thời.
*   **Áp dụng**: UC-10, Nhóm 3.3.7

### BR-81: Bảo vệ quyền riêng tư cá nhân khi chia sẻ thành tích tập luyện (Milestone Sharing)
*   **Loại**: Ràng buộc
*   **Chi tiết**: Mẫu thẻ thành tích chia sẻ (Milestone Share Card) được tạo ra tự động để hội viên đăng tải lên mạng xã hội mặc định sẽ ẩn toàn bộ các thông số chỉ số nhạy cảm cá nhân như: Cân nặng hiện tại, hình ảnh đo quét cơ thể chi tiết hoặc số đo các vòng, nhằm bảo vệ quyền riêng tư tuyệt đối cho hội viên. Thẻ chia sẻ chỉ tập trung hiển thị các thông số tích cực về thành tích chung như: Số ngày streak liên tục đạt được, tổng số buổi tập đã hoàn thành, hoặc danh hiệu cấp độ vừa đạt được.
*   **Áp dụng**: UC-11, Nhóm 3.3.8

### BR-82: Cơ chế phần thưởng giới thiệu song phương và thời hạn kích hoạt (Double-sided Referral Reward & Window)
*   **Loại**: Ràng buộc & Tính toán
*   **Chi tiết**:
    *   **Phần thưởng song phương**: Khi chương trình giới thiệu thành công, cả người giới thiệu (Referrer) và người được giới thiệu (Friend) đều được tặng **1 tháng membership miễn phí** (cộng trực tiếp vào ngày hết hạn gói tập hiện tại của Member, hoặc áp dụng làm tháng đầu tiên miễn phí cho Friend).
    *   **Điều kiện & Thời hạn**: Phần thưởng chỉ được kích hoạt khi người được giới thiệu hoàn tất thanh toán hóa đơn mua gói tập chính thức đầu tiên (Gói Tháng hoặc Gói Năm) trong vòng tối đa **30 ngày** kể từ thời điểm nhấp mở liên kết giới thiệu (Referral Link) cá nhân.
    *   **Hết hạn**: Nếu Friend thanh toán từ ngày thứ 31 trở đi, liên kết giới thiệu sẽ chuyển sang trạng thái hết hiệu lực (`expired`), cả hai bên đều không nhận được thưởng 1 tháng miễn phí.
*   **Áp dụng**: UC-11, Nhóm 3.3.8

### BR-83: Giới hạn duy nhất nguồn gốc giới thiệu thành viên
*   **Loại**: Ràng buộc
*   **Chi tiết**: Để tránh các tranh chấp về quyền lợi giới thiệu và gian lận hệ thống, một số điện thoại thành viên mới đăng ký chỉ được liên kết duy nhất với một nguồn tài khoản giới thiệu chính (nguồn liên kết được ghi nhận dựa trên mã cookie của đường link giới thiệu được mở đầu tiên khi khách hàng đăng ký tài khoản).
*   **Áp dụng**: UC-11, Nhóm 3.3.8

### BR-84: Cơ chế tự động khóa tài khoản khi phát hiện gian lận giới thiệu (Referral Abuse)
*   **Loại**: Hành động
*   **Chi tiết**: Hệ thống tự động theo dõi tần suất đăng ký. Nếu phát hiện một tài khoản hội viên có số lượng bạn bè đăng ký thành công tăng đột biến bất thường (ví dụ: Vượt quá 10 tài khoản mới đăng ký cùng một địa chỉ IP hoặc cùng một thiết bị trong vòng 1 giờ), hệ thống sẽ lập tức tạm khóa tính năng nhận thưởng Referral của tài khoản đó và gửi thông tin yêu cầu bộ phận quản trị rà soát xác minh thủ công.
*   **Áp dụng**: UC-11, UC-12, Nhóm 3.3.8

### BR-85: Quyền truy cập lịch sử giao dịch cá nhân của hội viên
*   **Loại**: Ràng buộc
*   **Chi tiết**: Hội viên có toàn quyền truy cập để tra cứu và xuất thông tin chi tiết về toàn bộ lịch sử các hóa đơn thanh toán (`INVOICES`), lịch sử gia hạn gói tập (`MEMBERSHIP_HISTORY`), và chi tiết các giao dịch tích lũy/tiêu dùng FitCoin của tài khoản mình bất kỳ lúc nào trực tiếp trên giao diện ứng dụng.
*   **Áp dụng**: UC-10, Nhóm 3.3.9

### BR-86: Quy tắc tự bảo lưu gói tập nhanh (Self-service Freeze)
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Khác với luồng bảo lưu đặc biệt cần phê duyệt BR-09, hội viên được phép thực hiện tự đóng băng gói tập của mình trực tiếp trên ứng dụng mà **không cần thông qua bước phê duyệt của Admin**.
    *   Giới hạn sử dụng: Hội viên được tự đóng băng gói tập cộng dồn tối đa không quá **30 ngày** trong một năm dương lịch.
    *   Mỗi lần thực hiện tự đóng băng gói tập phải cách nhau tối thiểu là 30 ngày hoạt động liên tục.
    *   Thời gian đóng băng thực tế sẽ được tự động tính toán và cộng nối tiếp vào ngày hết hạn (`end_date`) của gói tập hiện tại ngay khi hội viên bấm xác nhận.
*   **Áp dụng**: UC-10, Nhóm 3.3.9

### BR-87: Quy tắc hủy kích hoạt gói tập hội viên (Cancellation)
*   **Loại**: Ràng buộc
*   **Chi tiết**:
    *   Hội viên có quyền yêu cầu hủy gói tập hiện tại bất kỳ lúc nào trực tiếp trên ứng dụng.
    *   Khi bấm xác nhận hủy, gói tập của hội viên vẫn giữ nguyên hiệu lực sử dụng cho đến ngày kết thúc chu kỳ đã thanh toán hiện tại (`end_date`). Gói tập sẽ tự động chuyển sang trạng thái hủy hoạt động và không tự động gia hạn khi hết chu kỳ.
    *   Phòng tập tuyệt đối không thực hiện hoàn lại tiền mặt đối với khoảng thời gian chưa sử dụng còn lại của gói tập sau khi hủy, trừ trường hợp có chính sách phê duyệt hoàn tiền đặc biệt của Gym Owner.
*   **Áp dụng**: UC-10, Nhóm 3.3.9

### BR-88: Yêu cầu hộp thoại xác nhận đối với các tác vụ thay đổi gói tập
*   **Loại**: Ràng buộc
*   **Chi tiết**: Để tránh việc hội viên bấm nhầm gây ảnh hưởng đến thời hạn gói tập, mọi thao tác yêu cầu tự bảo lưu (Freeze) hoặc hủy gói tập (Cancel) trên ứng dụng bắt buộc phải hiển thị một hộp thoại cảnh báo xác nhận yêu cầu người dùng đọc kỹ thông tin và bấm chọn xác nhận lại một lần nữa trước khi gửi yêu cầu xử lý về máy chủ.
*   **Áp dụng**: UC-10, Nhóm 3.3.9

========================================================================
## KẾT THÚC BẢNG QUY TẮC NGHIỆP VỤ FITFUEL+
========================================================================
