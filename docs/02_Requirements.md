# 02. YEU CAU HE THONG
# (System Requirements Specification)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 11/05/2026 (Cap nhat: 22/06/2026 — Sua loi dong nhat + Chapter 1 du lieu)

========================================================================

## 1. YEU CAU CHUC NANG (Functional Requirements)
========================================================================

Giai thich cot "Do uu tien":
  Cao     = Bat buoc co trong san pham cuoi cung (MVP).
  Trung binh = Nen co, nhung co the cat neu thieu thoi gian.
  Thap    = Bo sung them neu con thoi gian.

------------------------------------------------------------------------
### 1.1. Module Quan ly tai khoan
------------------------------------------------------------------------

ID      | Mo ta yeu cau                                         | Uu tien
--------|-------------------------------------------------------|--------
FR-001  | He thong cho phep tao tai khoan hoi vien (Member).    | Cao
        | 2 luong: Online (khach nhap SDT -> thanh toan -> auto)|
        | hoac Offline to Online (admin POS -> QR -> Webhook).  |
        | Trang /auth/register chi danh cho Gym Owner.          |
FR-002  | He thong cho phep dang nhap bang email + password.    | Cao
        | Xac thuc JWT token (7 ngay).                          |
FR-003  | He thong cho phep cap nhat thong tin ca nhan.         | Cao
        | Bao gom: ten, avatar, muc tieu (bulk/cut/maintain),  |
        | chieu cao, can nang, di ung ca nhan.                  |
FR-004  | He thong hien thi Fitness Passport.                   | Cao
        | Bao gom: tong buoi tap, tong volume, longest streak, |
        | body photos, badge da unlock.                         |
FR-005  | He thong ho tro merge tai khoan Guest vao Member.     | Trung binh
        | Khi guest co SDT khop voi member moi: dong bo lich su.|

------------------------------------------------------------------------
### 1.2. Module Gym Tracking
------------------------------------------------------------------------

ID      | Mo ta yeu cau                                         | Uu tien
--------|-------------------------------------------------------|--------
FR-006  | He thong cho phep tao workout session moi.            | Cao
        | Chon ngay, nhom co chinh, ghi chu (tuy chon).        |
FR-007  | He thong cho phep log exercise trong session.         | Cao
        | Chon bai tap tu danh sach (nhom theo nhom co).       |
        | Nhap tung set: so reps va weight (kg).               |
        | Ho tro them/xoa set dong (dynamic form).             |
FR-008  | He thong tu dong tinh Personal Record (PR).           | Cao
        | PR = weight x reps cao nhat cho moi bai tap.         |
        | Khi dat PR moi, he thong danh dau is_pr = true.     |
FR-009  | He thong hien thi bieu do tien do (progress chart).  | Trung binh
        | Bieu do duong hien thi weight theo thoi gian.        |
        | Ho tro loc theo tuan/thang.                          |
FR-010  | He thong hien thi lich su buoi tap.                  | Cao
        | Danh sach session theo ngay, hien thi so bai tap,   |
        | tong volume, thoi luong.                             |
FR-011  | He thong goi y nhom co nen tap (Smart Suggestion).   | Trung binh
        | Nhom co it nhat trong 7 ngay duoc goi y tiep theo.  |
FR-012  | He thong ho tro check-in bang QR tai phong tap.      | Cao
        | Phong tap co QR code. Member scan = check-in.        |
        | He thong tu dong xac nhan goi tap va quyen loi.      |
FR-013  | He thong hien thi thong ke tong hop.                 | Trung binh
        | Tong buoi/thang, tong volume, streak hien tai.       |

------------------------------------------------------------------------
### 1.3. Module Membership Lifecycle
------------------------------------------------------------------------

ID      | Mo ta yeu cau                                         | Uu tien
--------|-------------------------------------------------------|--------
FR-014  | He thong quan ly loai goi tap.                       | Cao
        | Chi co 2 loai: Goi Thang (1 thang) va Goi Nam (12 thang).|
        | Ca hai cho quyen loi giong nhau: vao phong, tap tu do.|
        | Gym Owner co the thay doi gia qua MEMBERSHIP_PLANS.  |
FR-015  | He thong cho phep dang ky goi tap cho hoi vien.      | Cao
        | Admin/Nhan vien nhap thong tin, chon goi, thanh toan.|
        | Hoi vien tu dang ky Online (nhap SDT, thanh toan).  |
FR-016  | He thong ho tro gia han goi tap va luu lich su.      | Cao
        | Moi gia han tao ban ghi moi trong MEMBERSHIP_HISTORY.|
        | He thong tu dong cap nhat ngay ket thuc moi.         |
FR-017  | He thong ho tro chuyen goi (Thang -> Nam).           | Trung binh
        | Tinh phi chenh lech theo so ngay con lai cua goi Thang.|
FR-018  | He thong ho tro tam ngung / bao luu goi tap.         | Trung binh
        | Member xin bao luu, admin duyet, cong them thoi gian.|
FR-019  | He thong hien thi danh sach hoi vien sap het han.    | Cao
        | Loc: 7 ngay / 14 ngay / 30 ngay con lai.            |
        | Hien thi trong AI care queue voi goi y hanh dong.   |
FR-020  | He thong hien thi danh sach hoi vien lau chua check-in.| Cao
        | Nguong: 14 ngay khong check-in.                      |
        | Hien thi trong AI care queue.                        |
FR-021  | He thong bao cao membership.                         | Cao
        | Hoi vien moi / gia han theo thang. Doanh thu theo goi.|
        | Ty le gia han. So hoi vien active / het han / bao luu.|

------------------------------------------------------------------------
### 1.4. Module Nutrition (Ban dinh duong noi bo)
------------------------------------------------------------------------

ID      | Mo ta yeu cau                                         | Uu tien
--------|-------------------------------------------------------|--------
FR-022  | He thong cho phep chu phong tap quan ly san pham.    | Cao
        | Ten, gia, calo, macro (protein/carb/fat), ton kho.   |
        | Trang thai: con hang / het hang / ngung kinh doanh. |
FR-023  | He thong cho phep nhan vien ban tai quay (POS).      | Cao
        | Chon san pham, so luong -> tao hoa don cho member.  |
        | Hoa don lien ket voi membership hien tai cua member. |
FR-024  | He thong cho phep member dat truoc san pham.         | Trung binh
        | Sau buoi tap: goi y san pham phu hop, member dat truoc.|
        | Nhan vien chuan bi, member den nhan va thanh toan.   |
FR-025  | He thong tao combo (goi tap + dinh duong).           | Trung binh
        | Vi du: Goi Nam + Protein combo. Tinh gia tron goi. |
FR-026  | He thong quan ly ton kho dinh duong.                 | Cao
        | Canh bao ton kho thap. Bao cao san pham ban chay.   |
        | Bao cao doanh thu nutrition theo ngay/tuan/thang.    |
FR-027  | He thong goi y dinh duong dua tren buoi tap.         | Trung binh
        | Sau ket thuc session: popup goi y 3 san pham phu hop.|
        | Logic: nhom co -> uu tien macro -> loc san pham con hang.|

------------------------------------------------------------------------
### 1.5. Module Asset & Amenities — DA BO
------------------------------------------------------------------------

[Module nay da duoc loai bo. Locker va khan la do ca nhan cua member, khong
quan ly trong he thong. Cac chuc nang lien quan (cho thue dung cu, quan ly
ton kho) duoc thay the boi Module Gear Marketplace (Section 1.12).

FR-028 den FR-032 da bi xoa.]

------------------------------------------------------------------------
### 1.6. Module PT / Lich tap — DA BO
------------------------------------------------------------------------

[Module nay da duoc loai bo. Khong co PT role trong he thong.
FR-033, FR-034, FR-035 da bi xoa.]

------------------------------------------------------------------------
### 1.7. Module Gamification
------------------------------------------------------------------------

ID      | Mo ta yeu cau                                         | Uu tien
--------|-------------------------------------------------------|--------
FR-036  | He thong tinh XP va tu dong nang level.              | Trung binh
        | XP cong theo hanh dong (tap gym, check-in, gia han). |
        | Level up khi dat moc XP.                             |
FR-037  | He thong unlock badge khi dat milestone.             | Trung binh
        | Vi du: "100 buoi tap", "30 ngay streak", "Dat PR".  |
FR-038  | He thong theo doi streak.                            | Trung binh
        | Dem so ngay lien tiep co buoi tap.                   |
        | Reset neu 2 ngay lien tiep khong tap.                |
FR-039  | He thong tao Weekly Challenge.                        | Thap
        | Challenge tuan. Hoan thanh = nhan XP + FitCoin.     |
FR-040  | He thong hien thi Ranking Board.                     | Trung binh
        | Top member theo XP. Loc theo thoi gian.             |

------------------------------------------------------------------------
### 1.8. Module Payment va FitCoin
------------------------------------------------------------------------

ID      | Mo ta yeu cau                                         | Uu tien
--------|-------------------------------------------------------|--------
FR-041  | He thong xu ly thanh toan (sandbox).                 | Cao
        | Tich hop VNPay hoac Momo sandbox.                    |
        | Xu ly callback thanh toan thanh cong/that bai.       |
FR-042  | He thong quan ly FitCoin.                            | Cao
        | Earn: streak milestone, challenge, referral, gia han.|
        | Spend: mua dinh duong, gia han membership.           |
        | Ty gia: 1 FitCoin = 1 VND.                          |
FR-043  | He thong cho phep mua/gia han membership.            | Cao
        | Online 100%: khach nhap SDT -> thanh toan -> auto.  |
        | Offline to Online: Admin POS -> QR -> Webhook -> SMS.|

------------------------------------------------------------------------
### 1.9. Module AI Retention & Reporting
------------------------------------------------------------------------

ID      | Mo ta yeu cau                                         | Uu tien
--------|-------------------------------------------------------|--------
FR-044  | He thong AI care queue cho nhan vien.                | Cao
        | Danh sach hoi vien can cham soc, kep voi ly do:     |
        | "Sap het han (5 ngay)", "14 ngay chua check-in",    |
        | "Goi het han, chua gia han 3 ngay".                 |
        | Goi y hanh dong cu the cho nhan vien.               |
FR-045  | He thong goi y upsell theo hanh vi hoi vien.         | Trung binh
        | "Tap 4+ buoi/tuan -> goi y chuyen sang Goi Nam".   |
        | "Hay mua dinh duong -> goi y combo dinh duong".     |
        | "Hay thue gear -> goi y thue dai han, tiet kiem".   |
FR-046  | He thong dashboard KPI cho chu phong tap.            | Cao
        | Doanh thu: tong, theo module (membership/nutrition/ |
        | gear). Hoi vien: active, sap het han, moi, roi bo.  |
        | Ton kho: san pham dinh duong va gear sap het.       |
FR-047  | He thong bao cao co the tra loi cac cau hoi kinh doanh.| Cao
        | Hoi vien nao sap het han 7 ngay toi?                |
        | Goi nao tao doanh thu cao nhat thang nay?           |
        | San pham dinh duong nao ban chay nhat khung gio 17-20h?|
        | Bao nhieu recommendation da duoc xu ly / chuyen doi? |
FR-048  | He thong gui notification tu dong.                   | Trung binh
        | Loai: sap het han goi tap, streak reminder,         |
        | nhac gia han, canh bao ton kho thap, gear qua han tra. |

------------------------------------------------------------------------
### 1.10. Module Quan tri (Gym Owner Admin)
------------------------------------------------------------------------

ID      | Mo ta yeu cau                                         | Uu tien
--------|-------------------------------------------------------|--------
FR-049  | Gym Owner quan ly thong tin phong tap.               | Cao
        | Ten, dia chi, dien thoai, gio mo cua, logo.         |
FR-050  | Gym Owner quan ly member (xem, khoa, mo khoa).       | Cao
        | Danh sach member, tim kiem, loc theo goi tap.        |
FR-051  | Gym Owner gui thong bao toan he thong.               | Trung binh
        | Tao va gui thong bao den toan bo hoac nhom hoi vien. |
FR-052  | Gym Owner xem analytics tong hop.                    | Cao
        | Bieu do tang truong hoi vien, doanh thu.             |

------------------------------------------------------------------------
### 1.11. Module Transformation Journey Engine
------------------------------------------------------------------------

ID      | Mo ta yeu cau                                         | Uu tien
--------|-------------------------------------------------------|--------
FR-053  | He thong cho phep member tao muc tieu ca nhan.        | Cao
        | 5 buoc: (1) Chon loai muc tieu (muscle_gain / fat_loss|
        | / maintain / strength), (2) Nhap chi tieu cu the    |
        | (tuy chon), (3) Chon so ngay tap / tuan, (4) Danh   |
        | gia trinh do (beginner / intermediate / advanced),   |
        | (5) Chon chuong trinh trong 2-3 goi y.               |
FR-054  | He thong goi y 2-3 chuong trinh phu hop voi muc tieu.| Cao
        | Dua tren: goal_type, level, days_per_week.           |
        | Member chon 1 -> tao MEMBER_PROGRAMS.                |
FR-055  | Gym Owner quan ly thu vien chuong trinh tap.          | Cao
        | Tao / sua / tat / sao chep chuong trinh.             |
        | Moi CT: ten, goal_type, level, so tuan, so ngay/tuan.|
        | Cau truc theo 4 phase: Learn / Build / Peak / Deload.|
        | Moi ngay: danh sach bai tap + sets/reps muc tieu.    |
FR-056  | Member chon nhom co muon tap hom nay -> He thong tu     | Cao
        | dong sinh 1 buoi tap hoan chinh san sang bat dau.    |
        | Member chi can 1 thao tac: chon nhom co (Chan / Nguc |
        | / Lung + Vai / Toan than / Tu chon...).               |
        | He thong generate: danh sach bai tap, sets x reps    |
        | muc tieu, muc ta de xuat (dua tren lich su buoi tap  |
        | truoc + goal_type + level cua member).                |
FR-057  | Member co the chinh sua buoi tap vua duoc sinh truoc  | Cao
        | khi bat dau: them bai, xoa bai, doi sets/reps, doi   |
        | thu tu. Chinh sua la tuy chon — mac dinh la dung nguyen.|
        | Luu customization_log (JSON) de phan tich xu huong.  |
FR-058  | He thong tinh Progressive Overload sau moi buoi tap.  | Cao
        | NEU actual_reps >= target_reps_max 2 lan lien tiep:  |
        | goi y tang 2.5kg buoi sau, luu overload_suggestion.  |
        | NEU actual_reps < target_reps_min 3 lan lien tiep:   |
        | tao RECOMMENDATIONS loai technique_issue_upsell_pt.  |
FR-059  | He thong hien thi Progress Dashboard 3 tab.          | Cao
        | Tab 1: Hanh Trinh — % CT hoan thanh, lich thang, streak.|
        | Tab 2: Suc Manh — line chart tung bai, % tang cuong do.|
        | Tab 3: Co The — bieu do can nang, so do (neu nhap).  |
FR-060  | He thong theo doi so do co the theo thoi gian.        | Trung binh
        | Member tu nhap: can nang, vong bung, body fat%.      |
        | Hien thi bieu do xu huong tung chi so.               |
        | Smart reminder: 14 ngay chua cap nhat -> notification.|
FR-061  | He thong phat hien va ghi nhan PR tu dong.           | Cao
        | Sau moi buoi tap: kiem tra co PR moi cho tung bai.   |
        | Luu vao PERSONAL_RECORDS voi % tang so voi PR truoc. |
        | Hien thi badge xac nhan ky luc ngay trong buoi tap.  |
FR-062  | He thong kich hoat Milestone Engine sau buoi tap.     | Cao
        | Kiem tra 22 dieu kien milestone sau moi buoi tap.    |
        | Award FitCoin + XP theo bang quy dinh.               |
        | Tao MILESTONE_ACHIEVEMENTS + push notification.      |
FR-063  | He thong tao Share Card khi milestone lon dat duoc.   | Trung binh
        | Milestone lon: M32 (100% goal) va M42 (full 12 tuan).|
        | Card: truoc/sau stats, logo gym, ten member, hashtag.|
        | Member co the tai ve va chia se len mang xa hoi.     |
FR-064  | He thong kich hoat AI goi y dinh duong voi 4 tin hieu.| Cao
        | Kich hoat ngay sau khi member bam "Hoan thanh buoi tap".|
        | 4 tin hieu: nhom co tap + goal_type + volume buoi nay |
        | + lich su mua cua member.                            |
        | Hien thi popup 3 san pham goi y tu NUTRITION_PRODUCTS.|

------------------------------------------------------------------------
### 1.12. Module Gear Marketplace & Guest OTP Checkout
------------------------------------------------------------------------

ID      | Mo ta yeu cau                                         | Uu tien
--------|-------------------------------------------------------|--------
FR-065  | He thong ho tro Guest xac thuc bang SDT + OTP.        | Cao
        | Guest nhap SDT -> he thong gui SMS OTP 6 so.         |
        | OTP het han sau 10 phut. Toi da 3 lan/ngay/so.       |
        | Sau xac thuc: guest co session 2 gio de mua/thue.    |
FR-066  | Gym Owner quan ly catalog gear noi bo.                | Cao
        | Them / sua / an gear: ten, mo ta, category.          |
        | Gia ban (NULL neu khong ban), gia thue/ngay (NULL).  |
        | Tien dat coc, so luong, is_for_sale, is_for_rental.  |
FR-067  | He thong cho phep ban gear tai quay.                  | Cao
        | Staff tim member (SDT/ten) hoac nhap guest_phone.    |
        | Chon gear + so luong -> tao INVOICES (gear_sale).    |
        | Tru qty_available ngay lap tuc.                      |
FR-068  | He thong cho phep MEMBER (dang nhap) thue gear.       | Cao
        | Khach vang lai (Guest) KHONG duoc thue gear.         |
        | Chon gear, ngay bat dau, ngay tra (toi da +7 ngay).  |
        | Tinh phi: rental_fee = price_rental * so_ngay.       |
        | Phai thanh toan dat coc + rental_fee truoc khi nhan. |
        | Ghi GEAR_RENTALS.status = 'active'.                  |
FR-069  | He thong theo doi vong doi thue gear.                 | Cao
        | Staff xac nhan tra: cap nhat actual_return_date,     |
        | doi status -> 'returned'. Hoan coc neu nguyen ven.   |
        | Neu hu hong / mat: tru coc, tao INVOICES boi thuong. |
FR-070  | He thong tu dong xu ly gear qua han.                  | Cao
        | Daily cron: quet GEAR_RENTALS.status='active'        |
        | va due_date < NOW(). Doi sang 'overdue'.             |
        | Tinh late_fee += 50,000 VND/ngay qua han.           |
        | Tao NOTIFICATIONS canh bao cho Guest/Member va staff.|
FR-071  | He thong hien thi bao cao gear cho Gym Owner.        | Trung binh
        | Doanh thu ban gear, doanh thu thue gear theo thang.  |
        | Dat coc dang giu, so luong dang thue, qua han.       |
        | Gear ban chay, gear thue nhieu nhat.                 |

------------------------------------------------------------------------
### 1.13. Module Delivery & Quan ly Don hang
------------------------------------------------------------------------

ID      | Mo ta yeu cau                                         | Uu tien
--------|-------------------------------------------------------|--------
FR-072  | Member quan ly dia chi giao hang ca nhan.             | Cao
        | Them / sua / xoa dia chi. Dat 1 dia chi lam mac dinh.|
        | Truong: ho ten nguoi nhan, SDT, duong, phuong/xa,   |
        | quan/huyen, thanh pho.                               |
FR-073  | Member chon hinh thuc nhan khi dat don.              | Cao
        | 2 lua chon: [Lay tai quay] hoac [Giao hang].        |
        | Neu chon Giao hang: bat buoc nhap/chon dia chi.     |
        | Ap dung cho: don dinh duong, mua gear (khong thue). |
FR-074  | He thong tinh phi giao hang real-time qua API.       | Cao
        | Tich hop GHN hoac Ahamove de tinh phi van chuyen.   |
        | Input: dia chi nhan + tong kien hang -> tra phi ship.|
        | Hien thi phi ship ro rang truoc khi member xac nhan.|
FR-075  | Mien phi giao hang cho don hang >= 200,000 VND.      | Cao
        | Tinh tren tong san pham (chua tinh phi ship).       |
        | Neu don >= 200k: phi_ship = 0, hien "Mien phi ship".|
        | Neu don < 200k: phi_ship = ket qua tu GHN/Ahamove.  |
FR-076  | Don giao hang bat buoc thanh toan online khi dat.    | Cao
        | Cho phep: VNPay, MoMo, FitCoin (max 50% per BR-30). |
        | Khong ho tro COD — phai thanh toan truoc khi ship.  |
FR-077  | Gym Owner xac nhan, chuan bi va tao don ship.        | Cao
        | Sau khi nhan don moi: Staff kiem tra ton kho.       |
        | Xac nhan don -> he thong tao don ship qua GHN/Ahamove|
        | -> lay ma van don (tracking_code) -> cap nhat don.  |
FR-078  | He thong theo doi va cap nhat trang thai don hang.   | Cao
        | Cac trang thai: Cho xac nhan -> Dang chuan bi ->    |
        | Da giao shipper -> Dang giao -> Da nhan / Da huy.  |
        | Webhook tu GHN/Ahamove tu dong cap nhat trang thai. |
FR-079  | Member nhan notification khi don hang thay doi TT.   | Cao
        | Push/notification tai web khi: don duoc xac nhan,  |
        | shipper lay hang, don dang giao, don da giao.       |
FR-080  | Member / Admin co the huy don truoc khi shipper lay. | Trung binh
        | Chi huy duoc khi status = 'Cho xac nhan' hoac      |
        | 'Dang chuan bi'. Sau khi shipper lay: khong huy duoc.|
        | Huy don -> hoan tien + mo khoa FitCoin (neu co).    |

========================================================================

## 2. YEU CAU PHI CHUC NANG (Non-functional Requirements)
========================================================================

------------------------------------------------------------------------
### 2.1. Hieu nang (Performance)
------------------------------------------------------------------------

ID      | Mo ta                                           | Chi so do
--------|--------------------------------------------------|------------
NF-001  | Thoi gian load trang                            | Duoi 2 giay
NF-002  | Thoi gian response API                          | Duoi 500ms
NF-003  | He thong chiu duoc dong thoi                    | 100 user

------------------------------------------------------------------------
### 2.2. Bao mat (Security)
------------------------------------------------------------------------

ID      | Mo ta                                           | Chi tiet
--------|--------------------------------------------------|------------
NF-004  | Ma hoa mat khau                                 | bcrypt, 10 rounds
NF-005  | Truyen du lieu                                  | HTTPS (SSL/TLS)
NF-006  | Xac thuc                                        | JWT token, 7 ngay
NF-007  | Chong tan cong                                  | SQL injection, XSS, CSRF
NF-008  | Validate du lieu dau vao                        | Ca client va server

------------------------------------------------------------------------
### 2.3. Kha dung (Usability)
------------------------------------------------------------------------

ID      | Mo ta                                           | Chi tiet
--------|--------------------------------------------------|------------
NF-009  | Responsive design                               | 375px (mobile) tro len
NF-010  | Tuong thich trinh duyet                         | Chrome, Firefox, Safari, Edge
NF-011  | So buoc checkout toi da                         | 3 buoc
NF-012  | Font size toi thieu                             | 14px
NF-013  | Contrast ratio                                  | >= 4.5:1
NF-014  | Target nut bam tren mobile                      | Toi thieu 44x44px

------------------------------------------------------------------------
### 2.4. Tin cay va du lieu (Reliability & Data)
------------------------------------------------------------------------

ID      | Mo ta                                           | Chi tiet
--------|--------------------------------------------------|------------
NF-015  | Backup database                                 | Hang ngay
NF-016  | Uptime muc tieu                                 | 99% (cho do an)
NF-017  | Xu ly loi                                       | Thong bao than thien, khong lo stack trace

------------------------------------------------------------------------
### 2.5. Quyen rieng tu (Privacy)
------------------------------------------------------------------------

ID      | Mo ta                                           | Chi tiet
--------|--------------------------------------------------|------------
NF-018  | User co quyen an Fitness Passport               | Toggle public/private
NF-019  | User co quyen an body photo                     | Toggle tung anh
NF-020  | User co quyen xoa tai khoan                     | Xoa toan bo du lieu

========================================================================
KET THUC FILE 02
========================================================================
