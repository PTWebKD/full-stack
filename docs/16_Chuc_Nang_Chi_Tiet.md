# 16. MÔ TẢ CHI TIẾT CHỨC NĂNG (Functional Specification)

> Dự án: FitFuel+
> Mục đích: tài liệu lõi mô tả quy trình nghiệp vụ của từng chức năng — mỗi chức năng viết liền mạch, đầy đủ mọi nhánh rẽ và ngoại lệ trong cùng một quy trình — dùng làm căn cứ phát triển. Không đề cập chi tiết kỹ thuật (API, code, frontend/backend).

---

## PHẦN 1 — TÀI KHOẢN & XÁC THỰC

### 1.1. Đăng ký và đăng nhập tài khoản

**Mục đích:** Cho phép người dùng tạo tài khoản mới và truy cập lại hệ thống.

1. Người dùng mới nhập số điện thoại, mật khẩu, tên hiển thị để đăng ký.
2. Hệ thống kiểm tra số điện thoại chưa từng đăng ký; nếu đã tồn tại → báo lỗi, yêu cầu dùng số khác hoặc chuyển sang đăng nhập.
3. Mật khẩu được mã hoá, tài khoản được tạo với vai trò Hội viên.
4. Hệ thống tự động đăng nhập và chuyển vào trang tổng quan cá nhân.
5. Với người dùng đã có tài khoản: nhập số điện thoại + mật khẩu để đăng nhập.
6. Hệ thống đối chiếu thông tin; nếu sai → báo lỗi, cho thử lại; nếu đúng → mở phiên làm việc, tải hồ sơ cá nhân.
7. Điều hướng vào khu vực tương ứng vai trò: Hội viên → trang tổng quan cá nhân; Quản lý phòng gym → trang quản trị.

### 1.2. Xác thực OTP cho khách vãng lai

**Mục đích:** Cho người chưa có tài khoản xác minh danh tính tạm thời để mua hàng mà không cần đăng ký đầy đủ.

1. Khách nhập số điện thoại khi muốn mua hàng (Gear hoặc dinh dưỡng) mà chưa có tài khoản.
2. Hệ thống kiểm tra số lần yêu cầu mã trong ngày của số điện thoại này.
   - Đã vượt quá 3 lần/ngày → từ chối gửi mã, thông báo quay lại vào ngày hôm sau hoặc liên hệ nhân viên hỗ trợ.
   - Chưa vượt quá → tiếp tục bước 3.
3. Hệ thống sinh mã xác thực 6 chữ số, hiệu lực 10 phút, gửi qua tin nhắn.
4. Khách nhập mã nhận được; hệ thống đối chiếu mã và thời hạn.
   - Đúng và còn hiệu lực → xác nhận thành công, cấp phiên tạm thời (hiệu lực 2 giờ) để khách tiếp tục mua hàng.
   - Sai hoặc hết hạn → cho thử lại, tối đa 3 lần; quá số lần → tạm khoá chức năng xác thực của số điện thoại đó, yêu cầu thử lại sau.

## PHẦN 2 — HỒ SƠ & TƯƠNG TÁC CÁ NHÂN

### 2.1. Quản lý hồ sơ cá nhân

**Mục đích:** Cho người dùng xem và duy trì thông tin cá nhân, đồng thời tổng hợp thành tích tập luyện của mình.

1. Người dùng đăng nhập → hệ thống hiển thị đầy đủ dữ liệu tài khoản (tên, số điện thoại, vai trò, điểm kinh nghiệm, streak, số dư điểm thưởng) ngay trên trang tổng quan.
2. Người dùng mở trang hồ sơ, chỉnh sửa tên, ảnh đại diện, mục tiêu tập luyện, chiều cao, cân nặng, hoặc khai báo dị ứng thực phẩm (dùng để lọc gợi ý món ăn sau này) → xác nhận lưu → hệ thống cập nhật và hiển thị thông tin mới.
3. Người dùng mở trang Fitness Passport để xem tổng hợp thành tích: tổng số buổi tập đã hoàn thành, tổng khối lượng đã tập, streak dài nhất từng đạt, ảnh thay đổi cơ thể theo thời gian, và danh sách huy hiệu đã đạt được.

### 2.2. Xem hồ sơ người khác và theo dõi

**Mục đích:** Kết nối cộng đồng giữa các hội viên.

1. Hội viên xem trang cá nhân công khai của một hội viên khác.
2. Bấm theo dõi (follow) người đó → hoạt động tập luyện của họ xuất hiện trên bảng tin cá nhân của mình.
3. Có thể bỏ theo dõi bất cứ lúc nào, hoạt động của người đó sẽ không còn xuất hiện trên bảng tin nữa.

## PHẦN 3 — GYM, GÓI TẬP & BUỔI TẬP LUYỆN

### 3.1. Quản lý vòng đời hội viên (đăng ký – gia hạn – chuyển gói – bảo lưu)

**Mục đích:** Quản lý toàn bộ vòng đời của một hội viên gắn với gói tập.

1. Khách hàng truy cập hệ thống, chọn Gói Tháng hoặc Gói Năm.
2. **Đăng ký trực tuyến:** nhập số điện thoại → thanh toán.
   - Thanh toán thất bại → thông báo lỗi, cho thử lại hoặc thoát.
   - Thanh toán thành công → hệ thống tự động tạo tài khoản Member, kích hoạt gói tập, lưu lịch sử đăng ký, gửi mật khẩu tạm thời qua tin nhắn.
3. **Đăng ký tại quầy:** nhân viên chọn gói trên hệ thống POS → hệ thống sinh mã QR thanh toán → khách quét mã, chuyển khoản.
   - Nhận được phản hồi thanh toán → kích hoạt tài khoản/gói tập tương tự bước 2.
   - Không nhận được phản hồi do sự cố mạng → nhân viên xác nhận thủ công sau khi kiểm tra biến động số dư thực tế.
4. Từ khi đã là hội viên, có thể thực hiện các thao tác sau bất cứ lúc nào:
   - **Gia hạn:** chọn gói, thanh toán → nếu gói còn hiệu lực, cộng dồn thời gian vào ngày hết hạn hiện tại; nếu đã hết hạn, tính từ thời điểm hiện tại → tạo bản ghi lịch sử mới → thưởng thêm điểm cho hội viên.
     - Thanh toán lỗi do sự cố mạng → giao dịch huỷ, gói giữ nguyên trạng thái cũ, hội viên thử lại sau.
   - **Chuyển gói (Tháng → Năm):** yêu cầu chuyển gói → hệ thống tính phí chênh lệch dựa trên số ngày chưa dùng hết của Gói Tháng.
     - Còn dưới 3 ngày mới hết hạn Gói Tháng → hệ thống khuyên đợi hết hạn thay vì đóng phí chuyển đổi.
     - Ngược lại → thanh toán phần chênh lệch → cập nhật gói tập mới, tạo bản ghi lịch sử mới.
   - **Bảo lưu:** gửi yêu cầu tạm ngưng (tối đa 1 lần/năm, không quá 60 ngày) → Quản lý phòng gym xem xét.
     - Được duyệt → gói tập chuyển trạng thái "Tạm ngưng"; khi quay lại kích hoạt, hệ thống cộng bù số ngày đã bảo lưu vào ngày hết hạn.
     - Bị từ chối → thông báo lý do cho hội viên.
5. Nếu gói tập còn dưới 7 ngày, hệ thống tự động đưa hội viên vào danh sách chăm sóc để nhân viên liên hệ nhắc gia hạn (xem mục 3.4).

### 3.2. Buổi tập luyện (tạo, ghi nhận, hoàn thành, kỷ lục cá nhân)

**Mục đích:** Ghi nhận và đánh giá quá trình tập luyện thực tế của hội viên.

1. Hội viên check-in tại phòng gym bằng mã QR cá nhân (làm cơ sở tính streak và xác nhận quyền sử dụng dịch vụ trong ngày) → nếu gói tập đã hết hiệu lực, hệ thống thông báo và chuyển sang trang gia hạn.
2. Hội viên bắt đầu một buổi tập mới, chọn bài tập theo từng nhóm cơ.
3. Với mỗi hiệp tập, nhập số lần lặp và mức tạ.
4. Hệ thống kiểm tra có phá kỷ lục cá nhân của bài tập đó không (khối lượng = mức tạ × số lần lặp so với kỷ lục cũ).
   - Phá kỷ lục → ghi nhận kỷ lục mới, thưởng điểm kinh nghiệm ngay trên giao diện.
   - Không → tiếp tục tập bình thường.
5. Hội viên tiếp tục thêm hiệp/bài tập khác cho tới khi kết thúc buổi tập.
6. Kết thúc buổi tập → hệ thống tổng hợp toàn bộ dữ liệu, tính điểm kinh nghiệm của buổi tập.
7. Cập nhật chuỗi ngày tập liên tục (streak): tăng nếu có hoạt động hợp lệ trong ngày (tối đa 1 lần/ngày); nếu không có hoạt động liên tiếp 2 ngày, hệ thống tự reset streak về 0.
8. Kiểm tra các mốc streak quan trọng (7/30/100 ngày) → nếu đạt, mở khoá huy hiệu và thưởng điểm.
9. Hệ thống gợi ý món ăn phục hồi phù hợp với buổi tập vừa hoàn thành.
10. Hội viên có thể xem lại lịch sử buổi tập và bảng kỷ lục cá nhân (mức tạ/số lần lặp cao nhất từng đạt cho mỗi bài) bất cứ lúc nào.

### 3.3. Transformation Journey — hành trình chuyển đổi bằng AI

**Mục đích:** Cung cấp một lộ trình tập luyện dài hạn được AI cá nhân hoá, có mục tiêu và theo dõi tiến độ rõ ràng.

1. **Thiết lập mục tiêu (chỉ thực hiện lần đầu):** hội viên chọn loại mục tiêu (tăng cơ/giảm mỡ/duy trì/tăng sức mạnh), nhập chỉ tiêu và thời hạn, chọn số buổi tập mỗi tuần, chọn trình độ.
2. Hệ thống gợi ý 2-3 chương trình phù hợp; hội viên chọn một chương trình để theo, hoặc chọn thẳng một **chương trình mẫu** có sẵn theo mục tiêu (tăng cơ/giảm mỡ/tăng sức bền...) thay vì để hệ thống tự soạn riêng.
3. **Luồng tập theo ngày:** hội viên chọn nhóm cơ muốn tập hôm nay (Chân/Ngực/Lưng-Vai/Toàn thân), hoặc để hệ thống tự chọn theo lịch trình chương trình đang theo.
4. Hệ thống dựa trên mục tiêu, trình độ và lịch sử tập gần nhất để tự soạn buổi tập hoàn chỉnh (bài tập, số hiệp/số lần lặp, mức tạ đề xuất).
5. Hội viên xem trước, có thể tuỳ chỉnh (thêm/bớt bài tập, đổi mức tạ) trước khi bắt đầu.
6. Tập và ghi nhận kết quả thực tế cho từng hiệp (như mục 3.2).
7. Hoàn thành buổi tập — hệ thống đồng thời thực hiện 3 việc song song:
   - Phân tích cường độ để gợi ý tăng/giữ mức tạ cho buổi sau (nguyên tắc tăng tiến dần — nếu đạt/vượt mục tiêu 2 buổi liên tiếp thì gợi ý tăng thêm tạ).
   - Đề xuất ngay sản phẩm dinh dưỡng phù hợp phục vụ phục hồi.
   - Kiểm tra có đạt cột mốc thành tựu mới không (trong tổng số các mốc đã thiết lập).
8. Cập nhật phần trăm hoàn thành của chương trình đang theo.
9. Nếu đạt cột mốc mới:
   - Đã từng nhận thưởng cho cột mốc đó trước đây → chỉ hiển thị thông báo, không cộng thêm phần thưởng (tránh gian lận).
   - Chưa từng nhận và là cột mốc lớn (ví dụ hoàn thành 100% chương trình) → hiển thị hiệu ứng chúc mừng đặc biệt, cho phép tạo thẻ chia sẻ thành tích (ảnh trước/sau + chỉ số) lên mạng xã hội.
   - Chưa từng nhận và là cột mốc nhỏ → thông báo nhỏ, cộng thưởng bình thường.
10. Hội viên có thể xem lại tiến độ chương trình và toàn bộ cột mốc đã đạt/chưa đạt bất cứ lúc nào ở trang trung tâm Hành trình.

Ngoại lệ: nếu hệ thống không tìm thấy bài tập nào khớp hoàn toàn tiêu chí cá nhân, AI tự nới lỏng điều kiện và đề xuất bài tập cơ bản nhất thuộc nhóm cơ đó để buổi tập không bị gián đoạn.

### 3.4. Chăm sóc và giữ chân hội viên (Care Queue)

**Mục đích:** Chủ động phát hiện hội viên có nguy cơ rời bỏ và can thiệp kịp thời.

1. Vào một giờ cố định mỗi ngày, hệ thống tự động rà soát toàn bộ hội viên đang có gói tập kích hoạt.
2. Đánh giá theo 6 tiêu chí: sắp hết hạn trong 7 ngày, đã quá hạn 1-3 ngày hoặc trên 3 ngày, không check-in quá 14 ngày, tần suất tập cao đang dùng Gói Tháng (gợi ý nâng cấp), mua dinh dưỡng thường xuyên (gợi ý sản phẩm mới).
3. Sinh chỉ thị chăm sóc với mức ưu tiên Cao/Trung bình/Thấp tương ứng — không tạo trùng lặp cho cùng một hội viên trong vòng 7 ngày.
4. Nhân viên mở màn hình chăm sóc, xem danh sách được sắp theo mức ưu tiên từ cao xuống thấp.
5. Chọn một hội viên, xem lý do cần chăm sóc và kịch bản hành động gợi ý sẵn.
6. Liên hệ hội viên (gọi điện, nhắn tin, hoặc gặp trực tiếp).
7. Bắt buộc ghi nhận kết quả sau khi liên hệ (đã gia hạn, từ chối, không nghe máy, khác...).
   - Không liên lạc được → chỉ thị tạm đóng, hệ thống tự tạo lại yêu cầu mới sau 3 ngày.
   - Có kết quả cụ thể → lưu nhật ký chăm sóc, chuyển trạng thái chỉ thị sang "Đã xử lý".
8. Nếu hội viên tự gia hạn hoặc tự quay lại tập trước khi được nhân viên xử lý → hệ thống tự nhận diện thay đổi và tự động đóng chỉ thị liên quan, khoá nút ghi nhận để nhân viên biết bỏ qua.

### 3.5. Thông báo của phòng gym

**Mục đích:** Truyền thông nội bộ từ quản lý tới hội viên.

1. Quản lý phòng gym soạn tin thông báo (sự kiện, bảo trì, khuyến mãi).
2. Đăng tin → hội viên thấy ngay trên trang tổng quan và trang chủ.
3. Quản lý có thể gỡ bỏ thông báo cũ khi không còn cần thiết.

### 3.6. Quản trị vận hành phòng gym (dành cho Quản lý)

**Mục đích:** Cho quản lý phòng gym nắm tình hình vận hành và quản lý hội viên trực tiếp.

1. Quản lý mở trang tổng quan để xem các chỉ số: doanh thu theo thời gian, số hội viên đang hoạt động, xu hướng tăng trưởng.
2. Mở danh sách hội viên đang quản lý, chọn một người để xem chi tiết: lịch sử tập luyện, gói tập đang dùng, lịch sử mua hàng.
3. Xem biểu đồ tiến độ tập luyện (đường tiến bộ mức tạ/khối lượng theo thời gian) cho một hội viên hoặc bài tập cụ thể khi cần tư vấn.

## PHẦN 4 — THƯƠNG MẠI NỘI BỘ

### 4.1. Mua bán sản phẩm dinh dưỡng

**Mục đích:** Cho hội viên/khách vãng lai mua đồ ăn/thực phẩm tại phòng gym, cả tại quầy lẫn đặt trước.

1. Khách hàng duyệt danh mục sản phẩm, xem giá, lượng calo, thành phần dinh dưỡng.
2. Quản lý phòng gym quản lý danh mục: thêm sản phẩm mới, sửa giá/mô tả, tạm ẩn sản phẩm hết nguyên liệu.
3. **Bán tại quầy:** nhân viên chọn sản phẩm/combo, chọn khách hàng (hội viên hoặc khách vãng lai đã xác thực OTP) → hệ thống kiểm tra tồn kho.
   - Hết hàng → thông báo, dừng lại.
   - Còn hàng → thanh toán → thành công thì cập nhật tồn kho, ghi nhận đơn hàng, tạo hoá đơn.
4. **Đặt trước (Pre-order):** sau khi hội viên hoàn thành buổi tập, hệ thống gợi ý 3 sản phẩm phù hợp → hội viên chọn sản phẩm, thanh toán trực tuyến → đơn tạo ở trạng thái chờ chuẩn bị → nhân viên chuẩn bị xong, chuyển sang sẵn sàng nhận → hội viên đến quầy nhận, nhân viên xác nhận đã giao → hệ thống tự trừ tồn kho.
   - Sản phẩm thực tế hết hàng khi khách đến nhận → nhân viên huỷ đơn, hệ thống tự hoàn tiền/điểm thưởng đã thanh toán.
5. **Khách vãng lai đặt hàng:** người chưa có tài khoản xác thực OTP trước, sau đó đặt hàng như bình thường — đơn được gắn với số điện thoại đã xác thực thay vì tài khoản.
6. Sau khi dùng sản phẩm, khách hàng có thể chấm điểm và viết nhận xét để người khác tham khảo.

### 4.2. Mua bán và cho thuê dụng cụ tập luyện (Gear Marketplace)

**Mục đích:** Tạo chợ trao đổi thiết bị tập luyện giữa phòng gym và hội viên.

1. Người dùng duyệt danh mục Gear, xem hình ảnh, tình trạng, giá bán/giá thuê.
2. Người sở hữu dụng cụ (phòng gym hoặc hội viên) đăng bán/cho thuê: nhập thông tin, giá, hình ảnh thực tế → đăng tin lên chợ; có thể sửa hoặc gỡ tin bất cứ lúc nào.
3. **Mua dụng cụ:** người mua chọn sản phẩm, thanh toán.
   - Là khách vãng lai → xác thực số điện thoại trước (vì chưa có tài khoản).
   - Thanh toán thành công → tạo hoá đơn, cập nhật tồn kho, hoàn tất giao dịch bán đứt.
4. **Thuê dụng cụ (chỉ hội viên):** chọn dụng cụ cho thuê, chọn ngày bắt đầu và ngày trả (tối đa 7 ngày/lần, không quá 3 dụng cụ cùng lúc) → hệ thống tính tổng chi phí gồm cọc + phí thuê theo ngày → thanh toán → thành công thì chuyển trạng thái "đang cho thuê", trừ tồn kho.
   - Quá hạn chưa trả → mỗi ngày hệ thống tự chuyển trạng thái "quá hạn", cộng dồn phí phạt.
   - Quá hạn 14 ngày → đánh dấu "bị mất", chuyển nhân viên xử lý thủ công.
5. **Trả dụng cụ:** hội viên mang đến quầy, nhân viên kiểm tra tình trạng vật lý, chọn mức độ (nguyên vẹn/hư nhẹ/hư nặng/mất) → hệ thống tính cọc hoàn lại tương ứng (toàn bộ/một phần/không hoàn), tạo hoá đơn bồi thường nếu cần, cập nhật trạng thái và tồn kho.
6. Người cho thuê (phòng gym/hội viên) theo dõi danh sách đơn thuê đang hoạt động, xử lý các trường hợp trả trễ hoặc hư hỏng khi cần.

### 4.3. Giao hàng tận nơi

**Mục đích:** Cho phép hội viên nhận hàng dinh dưỡng tại địa chỉ cá nhân thay vì đến quầy.

1. Hội viên lưu sẵn một hoặc nhiều địa chỉ nhận hàng để dùng lại về sau; có thể thêm, sửa, xoá bất cứ lúc nào.
2. Khi đặt hàng chọn hình thức "Giao hàng", hệ thống tự tính phí vận chuyển dựa trên giá trị đơn — miễn phí nếu đơn đủ lớn, ngược lại áp phí chuẩn (không áp dụng khi mua gói tập hoặc thuê Gear).
3. Bắt buộc thanh toán trực tuyến trước, không hỗ trợ thanh toán khi nhận hàng.
4. Thanh toán thành công → quản lý phòng gym chuẩn bị sản phẩm → bàn giao cho đơn vị vận chuyển bên thứ ba xử lý phần vận chuyển vật lý.
5. Hệ thống theo dõi và cập nhật trạng thái đơn hàng (đang chuẩn bị → đang giao → đã giao) dựa trên phản hồi từ đơn vị vận chuyển, không quản lý chi tiết bên trong quy trình vận chuyển của họ.
6. Hội viên chỉ được huỷ đơn khi còn ở trạng thái đang chuẩn bị hoặc chưa bàn giao cho đơn vị vận chuyển.
7. Nếu việc giao hàng gặp sự cố (thất lạc, giao thất bại) → đơn chuyển sang trạng thái huỷ, tiền hoàn tự động.

## PHẦN 5 — ĐỘNG LỰC & GẮN KẾT

### 5.1. Gamification (thử thách, bảng xếp hạng, huy hiệu)

**Mục đích:** Tạo động lực tập luyện đều đặn thông qua thi đua và phần thưởng.

1. Hệ thống đưa ra các thử thách ngắn hạn (ví dụ: tập đủ 4 buổi trong tuần); hội viên tham gia một thử thách.
2. Hệ thống tự động cập nhật tiến độ thử thách dựa trên hoạt động thực tế (buổi tập, đơn hàng...).
3. Đạt đủ tiêu chí → thử thách đánh dấu hoàn thành, hội viên nhận thưởng điểm kinh nghiệm và điểm thưởng.
4. Song song, hệ thống so sánh thành tích (điểm kinh nghiệm, chuỗi ngày tập) giữa các hội viên và hiển thị bảng xếp hạng.
5. Khi hội viên đạt một mốc thành tích (streak, kỷ lục cá nhân, hoàn thành thử thách...), hệ thống kiểm tra điều kiện và cấp huy hiệu tương ứng nếu đủ tiêu chí.
   - Chưa từng nhận huy hiệu này → cấp mới, ghi lại thời điểm đạt được.
   - Đã từng nhận rồi → không cấp lại (tránh gian lận).
6. Hội viên xem được cả huy hiệu đã mở khoá và chưa đạt để biết mục tiêu tiếp theo.

### 5.2. Quản lý điểm thưởng FitCoin

**Mục đích:** Vận hành hệ thống điểm thưởng nội bộ dùng để giảm giá khi mua hàng.

1. Hội viên tự động nhận điểm thưởng khi hoàn thành buổi tập, đạt mốc streak, hoặc gia hạn gói tập thành công.
2. Hội viên xem số dư hiện có và lịch sử các lần kiếm/tiêu điểm, phân loại theo nguồn gốc (streak, thử thách, giới thiệu bạn bè, nạp thêm, thưởng gia hạn).
3. Khi thanh toán bất kỳ đơn hàng nào, hội viên có thể chọn dùng điểm thưởng để giảm giá, tối đa không vượt quá 50% tổng giá trị đơn.
4. Số điểm dùng được tạm khoá trong lúc chờ thanh toán phần còn lại hoàn tất.
   - Thanh toán thành công → trừ điểm vĩnh viễn.
   - Thanh toán thất bại hoặc huỷ giữa chừng → điểm được hoàn trả lại ngay để dùng cho lần sau.

### 5.3. Mạng xã hội nội bộ

**Mục đích:** Kết nối cộng đồng hội viên qua việc chia sẻ thành tích.

1. Hội viên đăng bài chia sẻ thành tích tập luyện (ảnh trước/sau, số liệu buổi tập, huy hiệu vừa đạt...) lên bảng tin.
2. Hội viên khác xem bảng tin hoạt động của những người mình theo dõi, thả tim các bài viết mình thích.
3. Tác giả có thể xoá bài đăng của chính mình bất cứ lúc nào.

## PHẦN 6 — HỖ TRỢ NGƯỜI DÙNG

### 6.1. Thông báo hệ thống

**Mục đích:** Chủ động báo cho người dùng biết các sự kiện quan trọng liên quan tới họ.

1. Hệ thống tự động phát sinh thông báo khi có sự kiện liên quan (nhắc gia hạn sắp hết hạn, cảnh báo tồn kho thấp cho quản lý, xác nhận đơn hàng, kết quả giao dịch...).
2. Người dùng xem danh sách thông báo bất cứ lúc nào.
3. Đánh dấu một thông báo cụ thể là đã đọc, hoặc đánh dấu toàn bộ đã đọc cùng lúc.

### 6.2. AI Coaching (gợi ý dinh dưỡng và trợ lý)

**Mục đích:** Hỗ trợ hội viên bằng trí tuệ nhân tạo trong quá trình tập luyện và ăn uống.

1. Sau mỗi buổi tập, hệ thống phân tích nhóm cơ vừa tập, mục tiêu cá nhân, cường độ buổi tập và lịch sử mua hàng để đề xuất các món ăn phù hợp giúp phục hồi.
2. Hội viên có thể mở khung trò chuyện hỗ trợ bất cứ lúc nào để đặt câu hỏi hoặc được hướng dẫn thao tác trong ứng dụng.

## PHẦN 7 — KHÁCH VÃNG LAI

### 7.1. Mua hàng và tra cứu dành cho khách vãng lai

**Mục đích:** Cho người chưa có tài khoản vẫn mua được hàng.

1. Khách chưa có tài khoản duyệt và chọn hàng (dinh dưỡng hoặc Gear bán đứt — không được thuê Gear).
2. Xem trước đơn hàng và tổng tiền trước khi tiến hành.
3. Xác thực số điện thoại bằng mã OTP (xem quy trình 1.2).
   - Xác thực thất bại (quá số lần thử) → chặn tiến trình thanh toán, giữ nguyên giỏ hàng, yêu cầu liên hệ hỗ trợ.
   - Xác thực thành công → tiếp tục.
4. Hoàn tất thanh toán trực tuyến — không cần đăng ký tài khoản đầy đủ.
5. Về sau, nhân viên có thể tra cứu lại thông tin và lịch sử mua hàng của khách theo số điện thoại đã xác thực khi cần hỗ trợ.

## PHẦN 8 — QUẢN TRỊ HỆ THỐNG

### 8.1. Quản trị tổng thể (dành cho chủ hệ thống/Quản lý cấp cao)

**Mục đích:** Theo dõi và quản lý toàn bộ hệ thống ở tầm vĩ mô.

1. Xem trang tổng quan kinh doanh: doanh thu theo thời gian, số hội viên đang hoạt động, xu hướng tăng trưởng.
2. Xem và quản lý toàn bộ tài khoản trong hệ thống, lọc theo vai trò và trạng thái hoạt động.
3. Chọn khoảng thời gian để xuất báo cáo doanh thu, phân tách theo từng nguồn thu (gói tập, dinh dưỡng, Gear...).

## PHẦN 9 — TRANG CÔNG KHAI

### 9.1. Duyệt, giỏ hàng và thanh toán

**Mục đích:** Trải nghiệm mua sắm chung cho mọi loại khách hàng trên trang công khai.

1. Người dùng (đã hoặc chưa đăng nhập) truy cập trang chủ, xem giới thiệu tổng quan về phòng gym và dịch vụ.
2. Nếu đã đăng nhập → trang chủ hiển thị thêm thông báo mới nhất và gói tập hiện tại.
3. Thêm sản phẩm từ nhiều nơi trong ứng dụng (dinh dưỡng, Gear) vào giỏ hàng chung.
4. Mở giỏ hàng để xem lại, điều chỉnh số lượng hoặc xoá bớt sản phẩm.
5. Chuyển sang thanh toán: xem lại giỏ hàng lần cuối, áp dụng điểm thưởng nếu muốn giảm giá, chọn địa chỉ giao hàng nếu cần giao tận nơi.
6. Xác nhận và hoàn tất đơn hàng.
