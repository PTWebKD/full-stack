import sys, re

# Read FitFuel_System_Analysis.md
with open('FitFuel_System_Analysis.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Insert BPMN
bpmn_text = """### 3.3. MÔ HÌNH QUY TRÌNH NGHIỆP VỤ BPMN

#### 3.3.1 — Quy trình quản lý và đánh giá tiến độ tập luyện (Quy trình Gym Tracking và Gamification)
**1. Mô tả quy trình chi tiết**
Quy trình bắt đầu khi Hội viên (Member) truy cập ứng dụng và chọn chức năng “Tạo buổi tập mới”. Hệ thống tự động phân tích lịch sử tập luyện trong 7 ngày gần nhất nhằm đề xuất nhóm cơ phù hợp cho buổi tập hiện tại. Sau đó, Member nhập các thông tin cơ bản gồm ngày tập, nhóm cơ mục tiêu và ghi chú tùy chọn.
Sau khi xác nhận, hệ thống khởi tạo Workout Session với trạng thái “Active” và chuyển người dùng sang giao diện ghi nhận bài tập. Trong quá trình tập luyện, Member lựa chọn bài tập từ thư viện dữ liệu theo từng nhóm cơ và tiến hành nhập thông tin cho từng Set tập luyện gồm số lần lặp (Reps) và mức tạ (Weight).
Sau mỗi lần ghi nhận Set, hệ thống tự động thực hiện quy trình đánh giá thành tích tập luyện. Dữ liệu được kiểm tra nhằm phát hiện các giá trị bất thường trước khi đối chiếu với lịch sử tập luyện trước đó của Member. Nếu thành tích mới vượt qua kỷ lục cũ của bài tập tương ứng, hệ thống xác nhận Personal Record (PR), cộng thêm XP thưởng và hiển thị hiệu ứng chúc mừng ngay trên giao diện.
Member có thể tiếp tục thêm Set mới hoặc chuyển sang bài tập khác cho đến khi hoàn tất Workout Session. Khi người dùng chọn “Kết thúc buổi tập”, hệ thống tiến hành tổng hợp toàn bộ dữ liệu tập luyện, tính toán XP của Session, cập nhật chuỗi Streak hằng ngày và kiểm tra các mốc thành tựu đã đạt được.
Sau cùng, hệ thống kích hoạt quy trình AI Recommendation nhằm đề xuất các suất ăn dinh dưỡng phù hợp với nhu cầu phục hồi sau tập luyện. Workout Session được chuyển sang trạng thái “Done” và lưu vào Fitness Passport của Member.

**2. Quy tắc nghiệp vụ (Business Rules)**
- **BR-31:** Kỷ lục cá nhân (Personal Record) được tính độc lập cho từng bài tập dựa trên công thức: PR = max(weight × reps). Nếu Set mới vượt giá trị PR hiện tại, hệ thống ghi nhận thành tích mới và kích hoạt thưởng thành tích tương ứng.
- **BR-18:** Member nhận XP dựa trên tổng khối lượng tập luyện, mức độ hoàn thành Session và thành tích PR đạt được trong buổi tập.
- **BR-20 & BR-21:** Streak tăng khi Member có ít nhất một hoạt động hợp lệ trong ngày như hoàn thành Workout Session hoặc phát sinh đơn hàng dinh dưỡng thành công. Nếu không ghi nhận hoạt động liên tiếp trong 2 ngày, hệ thống tự động reset Streak về 0.
- **BR-22:** Khi đạt các mốc Streak như 7 ngày, 30 ngày hoặc 100 ngày, hệ thống tự động mở khóa Badge, thưởng FitCoin và cập nhật hồ sơ thành tích cá nhân.
- **BR-32:** Hệ thống ưu tiên đề xuất nhóm cơ có tần suất tập thấp nhất trong 7 ngày gần nhất. Nếu nhiều nhóm cơ có cùng tần suất, hệ thống ưu tiên nhóm cơ có thời gian nghỉ lâu hơn.
- **BR-33:** Workout Session chỉ được phép chỉnh sửa hoặc xóa trong vòng 24 giờ kể từ khi hoàn tất. Sau thời gian này, dữ liệu bị khóa vĩnh viễn nhằm đảm bảo tính toàn vẹn của Fitness Passport.

**3. Tình huống ngoại lệ (Exception Handling)**
- Trong trường hợp Member nhập dữ liệu vượt ngưỡng hợp lý, hệ thống sẽ hiển thị cảnh báo xác nhận trước khi cho phép lưu dữ liệu. Các dữ liệu bất thường vẫn được lưu vào lịch sử tập luyện nhưng sẽ bị loại khỏi thuật toán tính PR nhằm tránh sai lệch thành tích cá nhân.
- Nếu xảy ra mất kết nối mạng trong lúc ghi nhận Workout Session, hệ thống sẽ tạm thời bảo toàn tiến trình tập luyện và tự động đồng bộ dữ liệu khi kết nối được khôi phục. Điều này giúp Member không bị mất dữ liệu giữa chừng.
- Trong trường hợp phiên đăng nhập hết hạn khi đang tập luyện, dữ liệu của Workout Session vẫn được duy trì. Sau khi đăng nhập lại, Member có thể tiếp tục Session trước đó mà không cần nhập lại dữ liệu.

#### 3.3.2 — Quy trình tư vấn và phân phối suất ăn dinh dưỡng (Quy trình AI Food Recommendation và Food Delivery)
**1. Mô tả quy trình chi tiết**
Quy trình bắt đầu khi Member hoàn thành Workout Session. Hệ thống phát sinh sự kiện “Workout Completed” và tự động kích hoạt AI Recommendation Engine nhằm đề xuất các suất ăn phù hợp với nhu cầu phục hồi sau tập luyện.
Đầu tiên, hệ thống phân tích dữ liệu Workout Session để xác định nhóm cơ chính được tập luyện và cường độ vận động của buổi tập. Đồng thời, hệ thống đối chiếu với hồ sơ cá nhân của Member bao gồm mục tiêu thể hình, lịch sử dinh dưỡng và các thông tin dị ứng thực phẩm đã được khai báo trước đó.
Sau quá trình phân tích, hệ thống hiển thị các suất ăn được đề xuất trực tiếp trên giao diện ứng dụng. Member có thể xem thông tin chi tiết của món ăn, thêm nhanh vào giỏ hàng hoặc tiếp tục khám phá thực đơn từ các Vendor khác nhau trên nền tảng.
Khi tiến hành đặt món, khách hàng thực hiện quy trình Checkout bao gồm xác nhận giỏ hàng, nhập thông tin giao nhận và lựa chọn phương thức thanh toán. Đối với Guest chưa có tài khoản, hệ thống yêu cầu xác thực số điện thoại trước khi hoàn tất đơn hàng.
Sau khi đơn hàng được tạo thành công, hệ thống gửi thông báo đến Vendor tương ứng để xác nhận đơn. Vendor tiến hành chuẩn bị món ăn và cập nhật trạng thái vận hành của đơn hàng theo từng giai đoạn gồm “Preparing”, “Delivering” và “Delivered”.
Khi đơn hàng hoàn tất, hệ thống tự động cập nhật dữ liệu dinh dưỡng vào Macro Dashboard của Member nhằm hỗ trợ theo dõi lượng Protein, Carb và Fat tiêu thụ trong ngày.

**2. Quy tắc nghiệp vụ (Business Rules)**
- **BR-28 & BR-29:** Hệ thống sử dụng cơ chế Mapping giữa nhóm cơ tập luyện và định hướng Macro ưu tiên nhằm đề xuất các suất ăn phù hợp với nhu cầu phục hồi và phát triển cơ bắp.
- **BR-30:** Hệ thống luôn hiển thị đúng 3 món ăn đề xuất. Trong trường hợp số lượng món phù hợp không đủ, hệ thống ưu tiên bổ sung các món có Rating cao hơn.
- **BR-34:** Nếu Workout Session có nhiều nhóm cơ với khối lượng tập luyện tương đương nhau, hệ thống ưu tiên theo thứ tự: Legs → Back → Chest → Shoulders → Arms → Core.
- **BR-35:** Một giỏ hàng chỉ được chứa sản phẩm từ một Vendor duy nhất nhằm đảm bảo tính đồng nhất trong quy trình vận chuyển và giao nhận.
- **BR-36:** Đơn hàng của Guest được liên kết với số điện thoại đã xác thực. Khi Guest tạo tài khoản Member bằng cùng số điện thoại, hệ thống tự động đồng bộ lịch sử đơn hàng vào Fitness Passport.
- **BR-10:** Chức năng Quick Re-order cho phép Member đặt lại toàn bộ món ăn từ một đơn hàng cũ chỉ với một thao tác.

**3. Tình huống ngoại lệ (Exception Handling)**
- Trong trường hợp hệ thống không tìm được món ăn phù hợp với điều kiện dinh dưỡng của Member, hệ thống sẽ tự động nới lỏng tiêu chí đề xuất nhằm ưu tiên hiển thị các món ăn an toàn và phù hợp hơn. Nếu vẫn không có kết quả phù hợp, hệ thống hiển thị thông báo để người dùng tự khám phá thực đơn.
- Nếu Vendor không đủ nguyên liệu để hoàn thành đơn hàng sau khi đã xác nhận, Vendor có thể chủ động đề xuất món thay thế hoặc thực hiện hủy đơn theo yêu cầu của khách hàng. Trong trường hợp đơn hàng bị hủy, hệ thống tự động thực hiện hoàn tiền theo chính sách vận hành của nền tảng.

#### 3.3.3 — Quy trình ký gửi, cho thuê và giao dịch thiết bị Gym (Quy trình Gear Hub Lifecycle)
**1. Mô tả quy trình chi tiết**
Quy trình bắt đầu khi người dùng truy cập Gear Hub và lựa chọn chức năng đăng thiết bị lên hệ thống. Dựa trên vai trò tài khoản, hệ thống phân quyền hình thức giao dịch phù hợp cho từng nhóm người dùng.
Đối với Gym Owner, hệ thống cho phép lựa chọn cả hai hình thức “Bán” hoặc “Cho thuê” thiết bị. Trong khi đó, Member cá nhân chỉ được phép tham gia dưới hình thức “Cho thuê” nhằm phục vụ mô hình chia sẻ thiết bị Peer-to-Peer.
Người đăng cung cấp các thông tin cơ bản gồm tên thiết bị, danh mục, giá bán hoặc phí thuê, tình trạng thiết bị và hình ảnh thực tế. Sau khi xác nhận, hệ thống tiến hành định danh thiết bị, khởi tạo hồ sơ vòng đời Gear và niêm yết thiết bị trên Gear Marketplace.
Người mua hoặc người thuê có thể truy cập trang chi tiết để xem thông tin thiết bị, lịch sử sử dụng và trạng thái vòng đời trước khi tiến hành giao dịch.
Nếu giao dịch thuộc hình thức mua bán, hệ thống thực hiện quy trình thanh toán và chuyển quyền sở hữu thiết bị sang người mua mới. Đồng thời, hệ thống cập nhật trạng thái vòng đời thiết bị nhằm ghi nhận giao dịch đã hoàn tất.
Nếu giao dịch thuộc hình thức cho thuê, hệ thống giữ tiền đặt cọc và ghi nhận thời gian thuê tương ứng. Sau khi thiết bị được hoàn trả thành công và không phát sinh tranh chấp, hệ thống tiến hành hoàn cọc và cập nhật trạng thái vòng đời mới cho thiết bị.

**2. Quy tắc nghiệp vụ (Business Rules)**
- **BR-11B:** Gym Owner được phép thực hiện cả hai hình thức Bán và Cho thuê thiết bị, trong khi Member cá nhân chỉ được phép tham gia hình thức Cho thuê.
- **BR-37:** Mọi thay đổi trạng thái của thiết bị đều phải tạo bản ghi vòng đời mới. Hệ thống không cho phép chỉnh sửa hoặc xóa lịch sử nhằm đảm bảo tính minh bạch và khả năng truy vết.
- **BR-11:** Thiết bị đăng tải bắt buộc phải có tối thiểu 2 hình ảnh thực tế để đảm bảo độ tin cậy của thông tin sản phẩm.
- **BR-12:** Mỗi thiết bị được gắn với một mã định danh duy nhất xuyên suốt toàn bộ vòng đời sử dụng, kể cả khi thay đổi chủ sở hữu.
- **BR-13:** Thiết bị cho thuê bắt buộc phải có tiền đặt cọc nhằm hạn chế rủi ro thất thoát hoặc hư hỏng trong quá trình sử dụng.
- **BR-16 & BR-17:** Hệ thống thu phí dịch vụ trên mỗi giao dịch mua bán hoặc cho thuê theo chính sách vận hành của nền tảng.

**3. Tình huống ngoại lệ (Exception Handling)**
- Trong trường hợp phát sinh tranh chấp về tình trạng thiết bị sau khi nhận hàng, người thuê có quyền gửi khiếu nại kèm hình ảnh xác thực trong khoảng thời gian quy định. Admin hệ thống sẽ tham gia kiểm tra và đưa ra quyết định xử lý phù hợp.
- Nếu người thuê trả thiết bị quá thời hạn cho phép, hệ thống tự động áp dụng cơ chế phạt dựa trên chính sách vận hành. Tùy theo mức độ vi phạm, hệ thống có thể trừ tiền cọc, hạn chế quyền thuê hoặc khóa tính năng giao dịch của tài khoản vi phạm.

#### 3.3.4 — Quy trình thanh toán và đối soát đa kênh (Quy trình Payment Gateway và FitCoin Economy)
**1. Mô tả quy trình chi tiết**
Quy trình thanh toán được kích hoạt khi người dùng thực hiện các giao dịch phát sinh chi phí trên nền tảng như đặt suất ăn dinh dưỡng, giao dịch Gear hoặc gia hạn Membership.
Tại bước Checkout, khách hàng lựa chọn phương thức thanh toán phù hợp bao gồm thanh toán qua cổng Payment Gateway hoặc sử dụng FitCoin. Hệ thống cho phép áp dụng hình thức thanh toán kết hợp giữa FitCoin và tiền thật nhằm tăng tính linh hoạt cho người dùng.
Đối với giao dịch qua Payment Gateway, hệ thống chuyển người dùng đến cổng thanh toán tương ứng để xác nhận giao dịch. Sau khi thanh toán hoàn tất, hệ thống nhận kết quả phản hồi và cập nhật trạng thái giao dịch trên nền tảng.
Đối với thanh toán bằng FitCoin, hệ thống kiểm tra số dư ví trước khi thực hiện khấu trừ. Sau khi giao dịch thành công, hệ thống ghi nhận lịch sử biến động FitCoin và cập nhật trạng thái đơn hàng tương ứng.
Trong quá trình sử dụng hệ thống, người dùng có thể nhận thêm FitCoin thông qua các hoạt động như duy trì Streak, hoàn thành Challenge, giới thiệu bạn bè hoặc nhận Cashback từ giao dịch.
Khi giao dịch hoàn tất, hệ thống cập nhật trạng thái thanh toán, ghi nhận lịch sử giao dịch tài chính và hoàn tất quy trình đối soát đơn hàng.

**2. Quy tắc nghiệp vụ (Business Rules)**
- **BR-38:** Mọi phản hồi thanh toán từ Payment Gateway đều phải trải qua bước xác thực bảo mật trước khi được chấp nhận và cập nhật trạng thái giao dịch.
- **BR-39:** Hệ thống đảm bảo mỗi Transaction chỉ được xử lý thành công một lần duy nhất nhằm tránh phát sinh lỗi cộng tiền hoặc cập nhật trạng thái trùng lặp.
- **BR-23 & BR-24:** FitCoin có tỷ lệ quy đổi cố định và chỉ được sử dụng trong hệ sinh thái FitFuel+. Người dùng không được phép quy đổi FitCoin thành tiền mặt hoặc sử dụng vượt quá số dư hiện có.
- **BR-25 & BR-26:** Mọi hoạt động Earn và Spend FitCoin đều được ghi nhận vào lịch sử giao dịch nhằm đảm bảo khả năng kiểm tra và đối soát.
- **BR-27:** Người dùng chỉ được phép sử dụng tối đa 50% giá trị đơn hàng bằng FitCoin trong một giao dịch.

**3. Tình huống ngoại lệ (Exception Handling)**
- Trong trường hợp người dùng khởi tạo giao dịch nhưng không hoàn tất thanh toán trong khoảng thời gian quy định, hệ thống tự động hủy giao dịch và hoàn lại số FitCoin đã tạm giữ nếu có phát sinh thanh toán kết hợp.
- Nếu đơn hàng bị hủy sau khi đã thanh toán thành công, hệ thống thực hiện quy trình hoàn tiền theo chính sách vận hành. Trạng thái hoàn tiền được cập nhật liên tục để người dùng theo dõi tiến trình xử lý giao dịch.
"""

if '## 4. XAC DINH ACTOR' in content:
    content = content.replace('## 4. XAC DINH ACTOR', bpmn_text + '\n\n---\n\n## 4. XAC DINH ACTOR')
else:
    print('Could not find section 4')
    sys.exit(1)

# Now read the business rules from 12_Business_RulesNew.md
with open('12_Business_RulesNew.md', 'r', encoding='utf-8') as f:
    br_content = f.read()

# Extract the relevant parts (from ## 1. to the end, before the KET THUC marker)
match = re.search(r'## 1\. QUY TAC XAC THUC VA BAO MAT(.*?)={72}\s*KET THUC FILE 12', br_content, re.DOTALL)
if match:
    rules = match.group(1)
    # Replace ## X. with ### 14.X.
    rules = re.sub(r'## (\d)\. (.*?)\n={72}', lambda m: f'### 14.{m.group(1)} {m.group(2)}', rules)
    
    new_br_section = f'## 14. BUSINESS RULES (Quy tac nghiep vu)\n\n### 14.1 QUY TAC XAC THUC VA BAO MAT' + rules + '\n---\n\n> HET TAI LIEU PHAN TICH THIET KE HE THONG\n> Moi thay doi can duoc cap nhat va ghi log tai day.\n'
    
    # Replace section 14 in FitFuel_System_Analysis.md
    if '## 14. BUSINESS RULES' in content:
        content = re.sub(r'## 14\. BUSINESS RULES.*', new_br_section, content, flags=re.DOTALL)
    else:
        print('Could not find section 14')
        sys.exit(1)
else:
    print('Could not parse rules')
    sys.exit(1)

with open('FitFuel_System_Analysis.md', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated FitFuel_System_Analysis.md successfully!')
