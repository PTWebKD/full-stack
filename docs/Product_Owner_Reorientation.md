ĐỊNH HƯỚNG ĐIỀU CHỈNH ĐỒ
ÁN
THEO TƯ DUY PRODUCT
OWNER
Dự án: FitFuel+
Môn học: Web Kinh Doanh
Ngày: 16/06/2026
Tập trung vào value, impact, quy trình kinh doanh và dữ liệu ra quyết định

FitFuel+ Product Owner Reorientation
Mục lục
1 Hướng tiếp cận chung 1
2 Cách thể hiện Value và Impact cho từng chức năng 1
3 Bảng Value – Impact theo module 2
4 Ưu tiên phát triển theo mức độ giá trị 3
4.1 MVP nên tập trung . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3
4.2 Phần mở rộng nếu còn thời gian . . . . . . . . . . . . . . . . . . . . . . . . 3
4.3 Nguyên tắc ưu tiên . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4
5 Cách làm đồ án nổi bật hơn 4
5.1 Không chỉ vẽ BPMN, mà phải trace được xuống database . . . . . . . . . . 4
5.2 Ma trận traceability nên có trong báo cáo . . . . . . . . . . . . . . . . . . 5
5.3 Nên thiết kế database theo hướng phục vụ quy trình kinh doanh . . . . . . 6
5.4 Ví dụ query cần có trong đồ án . . . . . . . . . . . . . . . . . . . . . . . . 6
5.4.1 Hội viên sắp hết hạn . . . . . . . . . . . . . . . . . . . . . . . . . . 6
5.4.2 Hội viên lâu chưa check-in . . . . . . . . . . . . . . . . . . . . . . . 6
5.4.3 Doanh thu theo loại dịch vụ . . . . . . . . . . . . . . . . . . . . . . 7
5.4.4 Tỷ lệ recommendation được xử lý . . . . . . . . . . . . . . . . . . . 7
5.4.5 Nutrition bán chạy . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
5.5 Figma nên thể hiện được luồng kinh doanh . . . . . . . . . . . . . . . . . . 7
5.6 Bộ deliverable nên nộp để nhìn chuyên nghiệp . . . . . . . . . . . . . . . . 8
6 Food / Nutrition 8
6.1 Nên đổi từ . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
6.2 Giá trị sản phẩm . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
6.3 Chức năng nên có . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
6.4 Nên bỏ/giảm . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
7 Thuê đồ / Asset & Amenities 10
7.1 Nên đổi từ . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
7.2 Giá trị sản phẩm . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
7.3 Chức năng nên có . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
7.4 Cách gắn với membership . . . . . . . . . . . . . . . . . . . . . . . . . . . 11
8 Membership 11
8.1 Nên đổi từ . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 11
8.2 Giá trị sản phẩm . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 11
i

FitFuel+ Product Owner Reorientation
8.3 Chức năng nên có . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 11
8.4 Ví dụ gói tập . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 12
9 AI Recommendation 12
9.1 Nên đổi từ . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 12
9.2 Giá trị sản phẩm . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 12
9.3 Nhóm gợi ý nên có . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 13
9.3.1 Gợi ý membership phù hợp . . . . . . . . . . . . . . . . . . . . . . 13
9.3.2 Gợi ý chăm sóc hội viên có nguy cơ rời bỏ . . . . . . . . . . . . . . 13
9.3.3 Gợi ý nutrition nội bộ . . . . . . . . . . . . . . . . . . . . . . . . . 14
9.3.4 Gợi ý upsell/cross-sell cho chủ gym . . . . . . . . . . . . . . . . . . 14
9.4 Cách làm vừa sức đồ án . . . . . . . . . . . . . . . . . . . . . . . . . . . . 14
9.4.1 Tầng 1: Rule-based recommendation . . . . . . . . . . . . . . . . . 14
9.4.2 Tầng 2: AI tạo nội dung tư vấn . . . . . . . . . . . . . . . . . . . . 15
10 Cấu trúc module đề xuất 15
10.1 Core chính . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 15
10.2 Dịch vụ phụ trợ . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 15
10.3 Quản trị . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 15
11 Cách trình bày với thầy 16
12 Kết luận 16
ii

FitFuel+ Product Owner Reorientation
1 Hướng tiếp cận chung
Thay vì xây dựng hệ thống theo kiểu copy các quy trình riêng lẻ như food vendor, thuê đồ,
member tự mua gói, hệ thống nên tập trung vào bài toán vận hành thật củachủ phòng
gym.
Mục tiêu sản phẩm:
•Giúp chủ gym quản lý hội viên, gói tập, check-in và doanh thu.
•Giúp nhân viên vận hành các nghiệp vụ tại quầy nhanh hơn.
•Giúp HLV/PT chăm sóc hội viên tốt hơn.
•Tăng doanh thu phụ trợ từ dinh dưỡng, locker, tiện ích và PT.
•Giữ chân hội viên thông qua nhắc hạn, chăm sóc lại và gợi ý dịch vụ phù hợp.
Hệ thống không nên mô phỏng marketplace. Các chức năng food, thuê đồ, membership và
AI recommend nên được gắn lại thành một hệ sinh thái vận hành nội bộ của phòng gym.
2 Cách thể hiện Value và Impact cho từng chức năng
Khimôtảmộtchứcnăng,khôngnênchỉviếttheodạng“hệthốngchophépthêm/sửa/xóa”.
Nên trình bày theo logic product:
1.Vấn đề hiện tại: Chủ gym/nhân viên/hội viên đang gặp khó khăn gì?
2.Giải pháp của hệ thống: Chức năng này giải quyết vấn đề đó như thế nào?
3.Value: Ai nhận được giá trị? Giá trị là tiết kiệm thời gian, tăng doanh thu, giảm
thất thoát, giữ chân hội viên hay cải thiện trải nghiệm?
4.Impact: Nếu triển khai chức năng này, hoạt động kinh doanh/vận hành thay đổi
ra sao?
5.Chỉ số đo lường: Có thể đo bằng số liệu nào để chứng minh chức năng có ích?
Ví dụ cách viết tốt hơn:
Không chỉ viết “quản lý gói tập”, mà nên viết “quản lý vòng đời membership
giúp chủ gym theo dõi hội viên sắp hết hạn, chủ động nhắc gia hạn, từ đó tăng
tỷ lệ gia hạn và giảm số hội viên rời bỏ”.
1

FitFuel+ Product Owner Reorientation
3 Bảng Value – Impact theo module
Module Vấn đề cần
giải quyết
Value tạo ra Impact kỳ
vọng
Chỉ số có thể
đo
Membership Chủ gym khó
theo dõi hội viên
còn hạn, sắp hết
hạn, lâu chưa
tập
Quản lý vòng
đời hội viên từ
đăng ký, gia hạn,
nâng cấp đến
bảo lưu
Tăng tỷ lệ gia
hạn, giảm hội
viên rời bỏ, hỗ
trợ bán gói phù
hợp hơn
Tỷ lệ gia hạn,
số hội viên
sắp hết hạn
được chăm sóc,
doanh thu theo
gói
Check-in Nhân viên mất
thời gian kiểm
tra quyền vào
phòng và quyền
lợi đi kèm
Tự động kiểm
tra trạng thái
membership và
quyền lợi
Giảm lỗi vận
hành, tăng tốc
độ phục vụ tại
quầy
Thời gian
check-in trung
bình, số lượt
check-in bị
từ chối, số lỗi
quyền lợi
Nutrition Food nếu làm
như vendor sẽ
rời rạc, không
phục vụ bài toán
gym
Biến sản phẩm
dinh dưỡng
thành dịch vụ
phụ trợ do gym
quản lý
Tăng doanh thu
phụ trợ, cá nhân
hóa sản phẩm
theo mục tiêu
tập luyện
Doanh thu
nutrition, sản
phẩm bán chạy,
tỷ lệ mua kèm
sau check-in
Asset &
Amenities
Khó kiểm soát
khăn, locker,
thảm, đai lưng;
dễ thất lạc/hư
hỏng
Quản lý cấp
phát, thu hồi,
vệ sinh, hư hỏng
và phí phạt
Giảm thất thoát
tài sản, tăng
hiệu quả vận
hành và tạo
thêm doanh thu
tiện ích
Tỷ lệ tài sản
thất lạc, locker
sử dụng, phí
phạt, doanh
thu tiện ích
PT/Lịch tập HLV khó theo
dõi lịch, hội viên
khó duy trì tiến
độ
Gắn lịch PT
với mục tiêu,
membership và
lịch sử tập
Tăng sử dụng
dịch vụ PT,
cải thiện trải
nghiệm hội viên
Số buổi PT
được đặt, tỷ
lệ hoàn thành
buổi tập, doanh
thu PT
2

FitFuel+ Product Owner Reorientation
Module Vấn đề cần
giải quyết
Value tạo ra Impact kỳ
vọng
Chỉ số có thể
đo
AI
Recommendation
Nhân viên chỉ
xem dữ liệu
nhưng chưa biết
nên hành động
gì
Gợi ý hội viên
cần chăm sóc,
gói nên upsell,
sản phẩm nên đề
xuất
Tăng retention,
tăng doanh
thu gia
hạn/PT/nutrition,
giảm bỏ sót hội
viên rủi ro
Số gợi ý được
xử lý, tỷ lệ
chuyển đổi gia
hạn, tỷ lệ hội
viên quay lại
Báo cáo Chủ gym có dữ
liệu rời rạc, khó
ra quyết định
Tổng hợp doanh
thu, hội viên,
tồn kho, tài sản,
hiệu quả dịch vụ
Ra quyết định
nhanh hơn về
khuyến mãi,
nhập hàng, chăm
sóc hội viên
Doanh thu theo
module, số hội
viên active, tồn
kho thấp, dịch
vụ bán chạy
4 Ưu tiên phát triển theo mức độ giá trị
Không phải chức năng nào cũng quan trọng như nhau. Nên chia thành MVP và phần mở
rộng để thể hiện tư duy product.
4.1 MVP nên tập trung
•Quản lý hội viên và membership.
•Check-in và kiểm tra quyền lợi.
•Gia hạn, nâng cấp, bảo lưu gói tập.
•Nutrition nội bộ ở mức bán tại quầy và quản lý tồn kho.
•Asset & Amenities ở mức cấp phát/thu hồi khăn, locker, dụng cụ phụ trợ.
•AI recommendation rule-based cho nhắc hạn, lâu chưa tập, gợi ý upsell.
•Báo cáo doanh thu và hội viên cơ bản.
4.2 Phần mở rộng nếu còn thời gian
•Đặt trước nutrition sau buổi tập.
•Combo động theo hành vi hội viên.
3

FitFuel+ Product Owner Reorientation
•AI tạo nội dung tư vấn tự nhiên cho nhân viên.
•Phân tích nguy cơ rời bỏ nâng cao.
•Báo cáo hiệu quả chiến dịch chăm sóc hội viên.
4.3 Nguyên tắc ưu tiên
Ưu tiên các chức năng có tác động trực tiếp đến:
•Doanh thu: gia hạn, upsell PT, bán nutrition, bán tiện ích.
•Retention: nhắc hạn, chăm sóc hội viên lâu chưa tập, gợi ý gói phù hợp.
•Vận hành: check-in nhanh, quản lý tài sản, tồn kho, locker.
•Trải nghiệm hội viên: quyền lợi rõ ràng, nhận dịch vụ nhanh, được tư vấn đúng
nhu cầu.
5 Cách làm đồ án nổi bật hơn
Nếu không cần code full toàn bộ hệ thống, đồ án vẫn có thể làm rất mạnh bằng cách chứng
minh được mối liên hệ giữa:
Impact→Business Process→UI/Figma→Database→Query/Report→
Decision
Nghĩa là mỗi chức năng không chỉ có màn hình và BPMN, mà phải chứng minh được:
•Quy trình này tạo ra dữ liệu gì?
•Dữ liệu đó được lưu ở bảng nào?
•Khi cần báo cáo/ra quyết định thì query ra sao?
•Chỉ số nào chứng minh quy trình có impact?
•Chủ gym sẽ dùng kết quả đó để hành động gì?
5.1 Không chỉ vẽ BPMN, mà phải trace được xuống database
Ví dụ quy trìnhGia hạn membership:
•BPMN thể hiện nhân viên kiểm tra hội viên, chọn gói, thanh toán, kích hoạt ngày
hết hạn mới.
4

FitFuel+ Product Owner Reorientation
•Database phải có bảng lưu lịch sử membership, hóa đơn, thanh toán.
•Query phải trả lời được: tháng này có bao nhiêu hội viên gia hạn, doanh thu gia
hạn bao nhiêu, gói nào được gia hạn nhiều nhất.
•Impact: tăng tỷ lệ gia hạn và giảm hội viên rời bỏ.
Ví dụ quy trìnhAI chăm sóc hội viên rủi ro:
•BPMNthểhiệnhệthốngquéthộiviênsắphếthạn/lâuchưatập,tạorecommendation,
nhân viên liên hệ, ghi nhận kết quả.
•Database phải có dữ liệu check-in, membership, recommendation, lịch sử chăm sóc.
•Query phải trả lời được: bao nhiêu gợi ý đã được xử lý, bao nhiêu hội viên quay
lại/gia hạn sau khi được chăm sóc.
•Impact: tăng retention và biến dữ liệu thành hành động chăm sóc cụ thể.
5.2 Ma trận traceability nên có trong báo cáo
Quy trình BPMN Màn hình
Figma
Bảng dữ liệu
chính
Query/Báo cáo Impact
Đăng ký
membership
BP-01 Màn hình tạo hội
viên, chọn gói,
thanh toán
Members,
Memberships,
MembershipPlans,
Invoices, Payments
Hội viên mới theo
tháng, doanh thu
gói mới
Tăng chuyển
đổi khách mới
thành hội viên
Gia hạn/nâng
cấp/bảo lưu
BP-02 Màn hình chi tiết
hội viên, gia hạn,
nâng cấp, bảo
lưu
Memberships,
MembershipHistory,
Invoices, Payments
Tỷ lệ gia hạn,
doanh thu gia
hạn, số lượt nâng
cấp
Tăng retention
và doanh thu
recurring
Check-in và
quyền lợi
BP-03 Màn hình check-
in, trạng thái
quyền lợi
CheckIns,
Memberships,
BenefitUsages
Số lượt check-in,
check-in bị từ
chối, tần suất tập
Giảm lỗi vận
hành, theo dõi
mức độ active
Bán nutrition
nội bộ
BP-04 POS nutrition,
tồn kho, combo
Products, Inventory,
Orders, OrderItems
Doanh thu
nutrition, sản
phẩm bán chạy,
tồn kho thấp
Tăng doanh thu
phụ trợ
Cấp phát tiện
ích/tài sản
BP-05 Cấp khăn/locker,
trả đồ, báo hỏng
Assets,
AssetAssignments,
Lockers, Penalties
Tài sản đang
dùng, thất lạc,
locker occupancy
Giảm thất
thoát, tối ưu
tiện ích
AI chăm sóc rủi
ro
BP-06 Danh sách hội
viên cần chăm
sóc, chi tiết gợi ý
Recommendations,
MemberCareLogs,
CheckIns,
Memberships
Tỷ lệ xử lý gợi ý,
tỷ lệ quay lại, tỷ
lệ gia hạn
Giữ chân hội
viên
5

FitFuel+ Product Owner Reorientation
Quy trình BPMN Màn hình
Figma
Bảng dữ liệu
chính
Query/Báo cáo Impact
AI upsell/cross-
sell
BP-07 Gợi ý
gói/PT/nutrition
phù hợp
Recommendations,
Orders,
Memberships,
PTBookings
Tỷ lệ chấp nhận
gợi ý, doanh thu
upsell
Tăng doanh thu
trên mỗi hội
viên
5.3 Nên thiết kế database theo hướng phục vụ quy trình kinh
doanh
Database không chỉ để lưu form. Database nên chứng minh được các câu hỏi kinh doanh:
•Hội viên nào sắp hết hạn trong 7 ngày tới?
•Hội viên nào đã 14 ngày chưa check-in?
•Gói nào tạo doanh thu cao nhất?
•Bao nhiêu hội viên đã nâng cấp từ Basic lên Premium?
•Sản phẩm nutrition nào bán chạy sau khung giờ 18:00?
•Locker nào đang trống, locker nào đang dùng?
•Tài sản nào bị mất/hỏng nhiều nhất?
•Recommendation nào tạo ra gia hạn hoặc đơn hàng thật?
5.4 Ví dụ query cần có trong đồ án
5.4.1 Hội viên sắp hết hạn
SELECTm.member_id, m.full_name, ms.end_date, mp.plan_name
FROMMemberships ms
JOINMembers mONm.member_id = ms.member_id
JOINMembershipPlans mpONmp.plan_id = ms.plan_id
WHEREms.status = ’active’
ANDms.end_dateBETWEEN CURRENT_DATE
AND CURRENT_DATE+INTERVAL’7 days’;
5.4.2 Hội viên lâu chưa check-in
SELECTm.member_id, m.full_name,MAX(c.checkin_time)ASlast_checkin
FROMMembers m
LEFT JOINCheckIns cONc.member_id = m.member_id
6

FitFuel+ Product Owner Reorientation
GROUP BYm.member_id, m.full_name
HAVING MAX(c.checkin_time) <CURRENT_DATE-INTERVAL’14 days’
OR MAX(c.checkin_time) ISNULL;
5.4.3 Doanh thu theo loại dịch vụ
SELECTservice_type,SUM(total_amount)ASrevenue
FROMInvoices
WHEREpayment_status = ’paid’
GROUP BYservice_type
ORDER BYrevenueDESC;
5.4.4 Tỷ lệ recommendation được xử lý
SELECTrecommendation_type,
COUNT(*)AStotal_recommendations,
SUM(CASE WHENstatus = ’handled’THEN1ELSE0END)AShandled_count,
ROUND(
SUM(CASE WHENstatus = ’handled’THEN1ELSE0END)
* 100.0 /COUNT(*),
2
)AShandled_rate
FROMRecommendations
GROUP BYrecommendation_type;
5.4.5 Nutrition bán chạy
SELECTp.product_name,
SUM(oi.quantity)AStotal_sold,
SUM(oi.line_total)ASrevenue
FROMOrderItems oi
JOINProducts pONp.product_id = oi.product_id
JOINOrders oONo.order_id = oi.order_id
WHEREo.status = ’paid’
GROUP BYp.product_name
ORDER BYtotal_soldDESC;
5.5 Figma nên thể hiện được luồng kinh doanh
Frontend/Figma không nên chỉ là các màn CRUD riêng lẻ. Nên có các màn hình theo
workflow:
7

FitFuel+ Product Owner Reorientation
•Dashboard cho chủ gym: doanh thu, hội viên active, hội viên sắp hết hạn, nutrition
bán chạy, locker occupancy.
•Member profile 360: thông tin hội viên, membership hiện tại, lịch sử check-in, hóa
đơn, nutrition, tiện ích, recommendation.
•Màn hình check-in tại quầy: quét/tìm member, trạng thái gói, quyền lợi, cấp
khăn/locker.
•POS nội bộ: bán membership, nutrition, combo, tiện ích trong cùng hóa đơn.
•AI care queue: danh sách hội viên cần chăm sóc, lý do, hành động đề xuất, kết quả
liên hệ.
•Inventory/asset operation: tồn kho nutrition, tài sản đang dùng, tài sản cần vệ
sinh/bảo trì.
5.6 Bộ deliverable nên nộp để nhìn chuyên nghiệp
•Problem statement theo góc nhìn chủ gym.
•Persona: chủ gym, nhân viên lễ tân, HLV/PT, hội viên.
•Value proposition cho từng module.
•BPMN cho các quy trình tạo impact.
•ERD/database schema gắn với BPMN.
•Data dictionary cho các bảng chính.
•SQL query/report chứng minh dữ liệu có thể ra quyết định.
•Figma prototype thể hiện workflow chính.
•Dashboard KPI.
•Ma trận traceability: Process→Screen→Table→Query→KPI→Impact.
Nếu làm được theo hướng này, đồ án sẽ không cần code full vẫn có chiều sâu vì chứng
minh được tư duy sản phẩm, tư duy dữ liệu và tư duy vận hành.
6 Food / Nutrition
8

FitFuel+ Product Owner Reorientation
6.1 Nên đổi từ
Food vendor / marketplace food
thành:
Quản lý bán sản phẩm dinh dưỡng nội bộ của phòng gym
Food không nên là bên thứ ba. Chủ gym sẽ quản lý các sản phẩm như protein shake, nước
điện giải, snack healthy, meal prep, combo sau tập.
6.2 Giá trị sản phẩm
•Tăng doanh thu phụ trợ cho phòng gym.
•Hỗ trợ hội viên theo mục tiêu tập luyện: tăng cơ, giảm cân, giữ dáng.
•Gắn nutrition với membership, PT và lịch sử check-in.
•Giúp chủ gym quản lý tồn kho và sản phẩm bán chạy.
6.3 Chức năng nên có
•Chủ gym quản lý sản phẩm dinh dưỡng, giá bán, tồn kho, trạng thái còn/hết hàng.
•Nhân viên bán sản phẩm tại quầy.
•Hội viên đặt trước sản phẩm để nhận sau buổi tập.
•Tạo combo: gói tập + protein, PT + meal plan, Premium + nutrition.
•Báo cáo doanh thu theo sản phẩm, combo, ngày/tháng.
•Cảnh báo tồn kho thấp hoặc sản phẩm bán chậm.
6.4 Nên bỏ/giảm
•Food vendor.
•Duyệt cửa hàng bên ngoài.
•Giao hàng như ShopeeFood/GrabFood.
•Quy trình food tách rời khỏi phòng gym.
9

FitFuel+ Product Owner Reorientation
7 Thuê đồ / Asset & Amenities
7.1 Nên đổi từ
Thuê đồ
thành:
Quản lý tài sản và tiện ích phòng gym
Trong phòng gym, hội viên có thể được cấp phát hoặc sử dụng các tiện ích như khăn tập,
locker, thảm yoga, đai lưng, găng tay, dây kéo lưng. Trọng tâm không phải là member tự
thuê đồ, mà là chủ gym và nhân viên quản lý cấp phát, thu hồi, vệ sinh, hư hỏng và phí
phạt.
7.2 Giá trị sản phẩm
•Biết tài sản đang ở đâu, ai đang sử dụng.
•Quản lý locker trống/đang dùng/bảo trì.
•Giảm thất lạc và hư hỏng tài sản.
•Tính phí dịch vụ hoặc phí phạt khi cần.
•Gắn quyền lợi tiện ích với từng loại membership.
7.3 Chức năng nên có
•Quản lý danh mục tài sản: khăn, locker, thảm, đai lưng, găng tay.
•Gắn mã tài sản, tình trạng, phí thuê, phí mất/hỏng.
•Nhân viên cấp phát tiện ích khi member check-in.
•Nhân viên ghi nhận trả đồ: đã trả, chưa trả, hư hỏng, mất, cần vệ sinh.
•Quản lý locker theo buổi hoặc theo tháng.
•Tính phí phạt vào hóa đơn hội viên nếu mất/hỏng/chưa trả.
•Báo cáo tài sản đang sử dụng, tài sản hư hỏng, locker còn trống, doanh thu tiện
ích.
10

FitFuel+ Product Owner Reorientation
7.4 Cách gắn với membership
•Basic: chỉ vào phòng tập.
•Standard: có khăn miễn phí.
•Premium: có khăn + locker tháng.
•PT Plus: có dụng cụ phụ trợ trong buổi tập.
8 Membership
8.1 Nên đổi từ
Đăng ký membership
thành:
Quản lý vòng đời hội viên và gói tập
Membership nên là xương sống của hệ thống, không chỉ là form đăng ký gói. Các nghiệp
vụ food, locker, PT, check-in và AI recommend đều nên xoay quanh membership.
8.2 Giá trị sản phẩm
•Giúp chủ gym tạo và quản lý các loại gói tập.
•Giúp nhân viên đăng ký, gia hạn, nâng cấp, tạm ngưng gói cho hội viên.
•Theo dõi hội viên sắp hết hạn, đã hết hạn, lâu chưa tập.
•Tăng tỷ lệ gia hạn và giữ chân hội viên.
8.3 Chức năng nên có
•Quản lý loại gói tập: tên gói, thời hạn, giá, quyền lợi, số lượt check-in nếu có.
•Đăng ký hội viên tại quầy: thông tin cá nhân, mục tiêu tập luyện, gói tập, ngày
bắt đầu/kết thúc, thanh toán.
•Gia hạn gói và lưu lịch sử gia hạn.
•Nâng cấp/chuyển gói, ví dụ Basic sang Premium.
•Tạm ngưng/bảo lưu membership.
11

FitFuel+ Product Owner Reorientation
•Kiểm tra quyền lợi khi check-in.
•Danh sách hội viên sắp hết hạn, hết hạn, lâu chưa check-in.
•Báo cáo hội viên mới, hội viên gia hạn, tỷ lệ rời bỏ, doanh thu theo gói.
8.4 Ví dụ gói tập
•Day Pass: dùng trong 1 ngày.
•Basic: vào phòng tập.
•Standard: vào phòng + khăn.
•Premium: vào phòng + locker + nutrition combo.
•PT Plus: vào phòng + 12 buổi PT + meal plan.
•Student: giảm giá, giới hạn khung giờ.
9 AI Recommendation
9.1 Nên đổi từ
AI recommend cho member
thành:
AI hỗ trợ chăm sóc hội viên, retention và upsell
AI không nên chỉ gợi ý chung chung cho member. AI nên hỗ trợ chủ gym, nhân viên và
HLV ra quyết định: ai cần chăm sóc, nên gợi ý gói nào, nên upsell dịch vụ nào, hội viên
nào có nguy cơ rời bỏ.
9.2 Giá trị sản phẩm
•Giữ chân hội viên.
•Tăng doanh thu từ gia hạn, PT, nutrition và tiện ích.
•Cá nhân hóa chăm sóc hội viên.
•Giúp nhân viên có hành động cụ thể thay vì chỉ xem báo cáo.
12

FitFuel+ Product Owner Reorientation
9.3 Nhóm gợi ý nên có
9.3.1 Gợi ý membership phù hợp
Dựa trên:
•Mục tiêu tập luyện: tăng cơ, giảm cân, giữ dáng.
•Tần suất check-in.
•Ngân sách.
•Nhu cầu PT, locker, khăn, nutrition.
•Lịch rảnh của hội viên.
Ví dụ:
•Hội viên tập 4–5 buổi/tuần, mục tiêu tăng cơ→gợi ý Premium + PT + protein
combo.
•Hội viên chỉ tập cuối tuần→gợi ý gói lượt hoặc off-peak.
9.3.2 Gợi ý chăm sóc hội viên có nguy cơ rời bỏ
Dựa trên:
•Lâu chưa check-in.
•Gói sắp hết hạn.
•Tần suất tập giảm.
•Chưa gia hạn sau khi hết hạn.
•Ít sử dụng dịch vụ đã mua.
Hành động gợi ý:
•Gọi điện nhắc lịch tập.
•Gửi ưu đãi gia hạn.
•Mời đo chỉ số cơ thể.
•Gợi ý chuyển sang gói phù hợp hơn.
13

FitFuel+ Product Owner Reorientation
•Mời dùng thử PT.
9.3.3 Gợi ý nutrition nội bộ
Dựa trên:
•Mục tiêu tập luyện.
•Lịch sử mua hàng.
•Thời điểm check-in.
•Loại buổi tập.
•Sản phẩm còn tồn kho.
Ví dụ:
•Sau buổi tập nặng→gợi ý protein shake.
•Mục tiêu giảm cân→gợi ý meal low-calorie.
•Sản phẩm tồn kho cao→gợi ý combo khuyến mãi.
9.3.4 Gợi ý upsell/cross-sell cho chủ gym
Ví dụ:
•Hội viên sắp hết hạn và tập đều→gợi ý gia hạn 6 tháng.
•Hội viên tập đều nhưng chưa dùng PT→gợi ý tư vấn PT.
•Hội viên hay dùng locker→gợi ý Premium.
•Hội viên hay mua protein→gợi ý monthly nutrition combo.
9.4 Cách làm vừa sức đồ án
Nên chia AI recommend thành 2 tầng:
9.4.1 Tầng 1: Rule-based recommendation
Đây là lớp logic chính, dễ giải thích và dễ chấm điểm.
Ví dụ rule:
•NếudaysSinceLastCheckin > 14→cần chăm sóc lại.
14

FitFuel+ Product Owner Reorientation
•NếumembershipExpireIn <= 7→nhắc gia hạn.
•Nếugoal = muscle_gain→gợi ý protein hoặc PT sức mạnh.
•Nếugoal = weight_loss→gợi ý cardio plan hoặc meal low-calorie.
•NếucheckinPerWeek >= 4→gợi ý gói dài hạn/Premium.
•NếuusesLocker = true→gợi ý gói có locker.
9.4.2 Tầng 2: AI tạo nội dung tư vấn
Sau khi rule chọn được đề xuất, AI có thể tạo câu giải thích hoặc tin nhắn cho nhân viên
gửi hội viên.
Ví dụ:
Chào anh Minh, em thấy gói tập của anh còn 5 ngày và anh đang duy trì tập
4 buổi/tuần. Bên em có gói gia hạn 6 tháng kèm combo protein tiết kiệm hơn,
anh có muốn em tư vấn thêm không ạ?
10 Cấu trúc module đề xuất
10.1 Core chính
•Quản lý hội viên.
•Quản lý gói tập/membership.
•Check-in.
•PT/lịch tập.
10.2 Dịch vụ phụ trợ
•Nutrition Sales: bán sản phẩm dinh dưỡng nội bộ.
•Asset & Amenities: locker, khăn, thảm, đai lưng, dụng cụ phụ trợ.
•Combo/upsell: gói tập + PT + nutrition + tiện ích.
10.3 Quản trị
•Quản lý nhân viên.
15

FitFuel+ Product Owner Reorientation
•Hóa đơn/thanh toán.
•Báo cáo doanh thu.
•Báo cáo hội viên.
•Báo cáo tồn kho và tài sản.
•AI recommendation cho retention và upsell.
11 Cách trình bày với thầy
Có thể nói ngắn gọn:
Em sẽ điều chỉnh hệ thống theo hướng chủ gym là trung tâm vận hành. Food
không còn là food vendor mà là module bán sản phẩm dinh dưỡng nội bộ. Thuê
đồ được đổi thành quản lý tài sản và tiện ích phòng gym. Đăng ký membership
được mở rộng thành quản lý vòng đời hội viên và gói tập. AI recommend sẽ hỗ
trợ nhân viên/chủ gym chăm sóc hội viên, nhắc gia hạn, gợi ý PT, nutrition và
upsell dịch vụ phù hợp.
12 Kết luận
Hướng điều chỉnh mới giúp đồ án rõ tính product hơn:
•Không copy quy trình marketplace.
•Tập trung vào vận hành thật của phòng gym.
•Lấy chủ gym, nhân viên và hội viên làm trung tâm.
•Mỗi module đều có giá trị kinh doanh rõ ràng.
•AI recommend có vai trò thực tế: retention, upsell và cá nhân hóa chăm sóc.
16