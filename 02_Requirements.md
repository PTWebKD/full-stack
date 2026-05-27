# 02. YEU CAU HE THONG
# (System Requirements Specification)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 11/05/2026

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
FR-001  | He thong cho phep dang ky bang email hoac SDT.        | Cao
        | Nguoi dung nhap: email/SDT, mat khau, ten hien thi.  |
        | He thong tao tai khoan va tra ve JWT token.           |
        |                                                       |
FR-002  | He thong cho phep dang nhap bang email + password.    | Cao
        | He thong xac thuc va tra ve JWT token (7 ngay).      |
        |                                                       |
FR-003  | He thong cho phep Guest checkout bang OTP.            | Cao
        | Guest nhap SDT -> He thong gui OTP 6 so (5 phut).    |
        | Guest nhap OTP dung -> duoc phep dat hang.            |
        | Toi da 3 lan nhap sai, sau do khoa 15 phut.          |
        |                                                       |
FR-004  | He thong cho phep merge tai khoan Guest vao Member.   | Trung binh
        | Khi Guest tao tai khoan sau, lich su mua hang (gan    |
        | voi SDT) duoc chuyen sang tai khoan moi.             |
        |                                                       |
FR-005  | He thong cho phep cap nhat thong tin ca nhan.         | Cao
        | Bao gom: ten, avatar, muc tieu (bulk/cut/maintain).  |
        |                                                       |
FR-006  | He thong hien thi Fitness Passport.                  | Cao
        | Bao gom: tong buoi tap, tong volume, longest streak, |
        | body photos, badge da unlock.                         |

------------------------------------------------------------------------
### 1.2. Module Gym Tracking
------------------------------------------------------------------------

ID      | Mo ta yeu cau                                         | Uu tien
--------|-------------------------------------------------------|--------
FR-007  | He thong cho phep tao workout session moi.            | Cao
        | User chon ngay, nhom co chinh, ghi chu (tuy chon).   |
        |                                                       |
FR-008  | He thong cho phep log exercise trong session.         | Cao
        | User chon bai tap tu danh sach (nhom theo nhom co).  |
        | User nhap tung set: so reps va weight (kg).          |
        | Ho tro them/xoa set dong (dynamic form).             |
        |                                                       |
FR-009  | He thong tu dong tinh Personal Record (PR).           | Cao
        | PR = gia tri weight x reps cao nhat cho moi bai tap. |
        | Khi dat PR moi, he thong danh dau is_pr = true.     |
        |                                                       |
FR-010  | He thong hien thi bieu do tien do (progress chart).  | Trung binh
        | Bieu do duong hien thi weight theo thoi gian cho     |
        | tung bai tap. Ho tro loc theo tuan/thang.            |
        |                                                       |
FR-011  | He thong hien thi lich su buoi tap.                  | Cao
        | Danh sach session theo ngay, hien thi: ngay, so      |
        | bai tap, tong volume, thoi luong.                    |
        |                                                       |
FR-012  | He thong goi y nhom co nen tap (Smart Suggestion).   | Trung binh
        | Dem tan suat tap moi nhom co trong 7 ngay gan nhat.  |
        | Nhom co it nhat duoc goi y cho buoi tiep theo.       |
        |                                                       |
FR-013  | He thong ho tro check-in bang QR tai phong tap.      | Thap
        | Phong tap co QR code. User scan = check-in.          |
        |                                                       |
FR-014  | He thong hien thi thong ke tong hop.                 | Trung binh
        | Tong buoi/thang, tong volume, streak hien tai.       |

------------------------------------------------------------------------
### 1.3. Module Food Order
------------------------------------------------------------------------

ID      | Mo ta yeu cau                                         | Uu tien
--------|-------------------------------------------------------|--------
FR-015  | He thong hien thi danh sach food voi filter.         | Cao
        | Loc theo: khoang calo, macro, muc tieu, di ung.     |
        | Tim kiem theo ten mon an.                             |
        |                                                       |
FR-016  | He thong hien thi chi tiet food.                     | Cao
        | Bao gom: ten, gia, anh, calo, protein, carb, fat,   |
        | nguyen lieu, thanh phan di ung, review.              |
        |                                                       |
FR-017  | He thong cho phep them vao gio hang TU TRANG CHU.    | Cao
        | Tren moi food card co nut [+].                       |
        | Nhan [+] = them vao cart voi qty = 1.                |
        | KHONG can navigate sang trang detail.                |
        | (Yeu cau dac biet theo ghi chu giang vien)           |
        |                                                       |
FR-018  | He thong cho phep THAY DOI THUOC TINH TRONG CART.    | Cao
        | Trong trang cart, user co the thay doi:              |
        | - So luong (qty)                                     |
        | - Size (neu co)                                      |
        | - Topping/option (neu co)                            |
        | KHONG can quay lai trang detail de thay doi.         |
        | (Yeu cau dac biet theo ghi chu giang vien)           |
        |                                                       |
FR-019  | He thong ho tro checkout cho Member.                 | Cao
        | Buoc 1: Xac nhan gio hang.                           |
        | Buoc 2: Nhap dia chi + chon gio giao.               |
        | Buoc 3: Chon thanh toan va xac nhan.                |
        | (Toi da 3 buoc de hoan tat)                          |
        |                                                       |
FR-020  | He thong ho tro checkout cho Guest (OTP).            | Cao
        | Guest nhap SDT -> nhan OTP -> xac thuc -> checkout.  |
        | Don hang luu voi guest_phone, khong co user_id.      |
        |                                                       |
FR-021  | He thong cho phep dat lai don cu (Quick Re-order).   | Trung binh
        | Tab "Dat lai" hien thi don da dat truoc do.          |
        | 1 nut bam de them toan bo don cu vao cart.           |
        | (Yeu cau dac biet theo ghi chu giang vien)           |
        |                                                       |
FR-022  | He thong goi y food dua tren buoi tap (AI rule).    | Cao
        | Sau khi ket thuc buoi tap, popup hien thi 3 mon     |
        | phu hop voi nhom co vua tap.                         |
        | Logic: muscle_group -> macro priority -> filter food.|
        |                                                       |
FR-023  | He thong tinh TDEE ca nhan.                          | Trung binh
        | Nhap: gioi tinh, tuoi, chieu cao, can nang,          |
        | muc do van dong. Tra ve: TDEE (kcal/ngay).          |
        |                                                       |
FR-024  | He thong hien thi Macro Dashboard hang ngay.         | Trung binh
        | Hien thi: calo/protein/carb/fat da nap vs muc tieu. |
        | Bieu do vong tron hoac thanh ngang.                  |
        |                                                       |
FR-025  | He thong cho phep danh gia food kem anh.             | Thap
        | User cho diem 1-5 sao, viet nhan xet, upload anh.   |
        |                                                       |
FR-026  | He thong ho tro goi Meal Prep tuan/thang.            | Thap
        | User chon goi co san hoac tu chon mon theo ngay.     |
        | He thong tu tao don hang dinh ky.                    |

------------------------------------------------------------------------
### 1.4. Module Gear Hub
------------------------------------------------------------------------

ID      | Mo ta yeu cau                                         | Uu tien
--------|-------------------------------------------------------|--------
FR-027  | He thong hien thi danh sach gear.                    | Cao
        | Loc theo: danh muc, gia, tinh trang, hinh thuc      |
        | (ban/thue).                                           |
        |                                                       |
FR-028  | He thong hien thi Gear Lifecycle.                    | Cao
        | Timeline doc hien thi toan bo lich su cua gear:     |
        | - Ngay dang ban, ai dang, tinh trang, anh, ghi chu  |
        | - Ngay ban/cho thue, ai mua/thue                     |
        | - Ngay ban lai, tinh trang moi                       |
        | Moi entry la 1 dong trong bang GEAR_LIFECYCLE.       |
        |                                                       |
FR-029  | He thong cho phep dat thue gear.                     | Cao
        | User chon thoi han (ngay hoac tuan).                 |
        | He thong tinh phi thue + tien coc.                   |
        | User thanh toan (tien hoac FitCoin).                 |
        |                                                       |
FR-030  | He thong cho phep mua gear.                          | Cao
        | Checkout tuong tu food nhung cho gear.               |
        | Sau khi mua, current_owner_id chuyen sang buyer.    |
        | GEAR_LIFECYCLE them entry moi (action = sold).       |
        |                                                       |
FR-031  | He thong cho phep dang ban/cho thue gear.            | Trung binh
        | Form nhap: ten, danh muc, gia, tinh trang (1-5),    |
        | ghi chu, anh (toi thieu 2, toi da 8).               |
        | He thong gen Gear ID duy nhat va QR code.            |
        |                                                       |
FR-032  | He thong gen QR code cho moi Gear ID.                | Trung binh
        | QR chua link den trang detail cua gear do.           |
        | Scan QR = xem thong tin + Lifecycle.                 |
        |                                                       |
FR-033  | He thong goi y gear dua tren gym log.                | Thap
        | Phan tich gym log: user tap nhom co nao nhung chua  |
        | co gear phu hop -> goi y thue/mua.                   |

------------------------------------------------------------------------
### 1.5. Module Gamification
------------------------------------------------------------------------

ID      | Mo ta yeu cau                                         | Uu tien
--------|-------------------------------------------------------|--------
FR-034  | He thong tinh XP va tu dong nang level.              | Trung binh
        | XP cong theo hanh dong (tap gym, dat food, ban gear).|
        | Level up khi dat moc XP (xem Business Rules).       |
        |                                                       |
FR-035  | He thong unlock badge khi dat milestone.             | Trung binh
        | Vd: "100 buoi tap", "30 ngay streak", "Dat PR".     |
        | Badge hien thi tren Fitness Passport.                |
        |                                                       |
FR-036  | He thong theo doi streak.                            | Trung binh
        | Dem so ngay lien tiep co hoat dong (tap hoac dat an).|
        | Reset neu 2 ngay lien tiep khong hoat dong.          |
        |                                                       |
FR-037  | He thong tao Weekly Challenge.                       | Thap
        | Challenge tuan: "Tap 5 buoi", "Nap 150g protein/ngay|
        | trong 7 ngay". Hoan thanh = nhan XP + FitCoin.      |
        |                                                       |
FR-038  | He thong hien thi Ranking Board.                     | Trung binh
        | Top user theo XP. Loc theo phong tap, thoi gian.    |

------------------------------------------------------------------------
### 1.6. Module Payment va FitCoin
------------------------------------------------------------------------

ID      | Mo ta yeu cau                                         | Uu tien
--------|-------------------------------------------------------|--------
FR-039  | He thong xu ly thanh toan (sandbox).                 | Cao
        | Tich hop VNPay hoac Momo sandbox.                    |
        | Xu ly callback thanh toan thanh cong/that bai.       |
        |                                                       |
FR-040  | He thong quan ly FitCoin.                            | Cao
        | Earn: ban gear, streak milestone, challenge, referral.|
        | Spend: mua food, thue gear, gia han membership.     |
        | Ty gia: 1 FitCoin = 1 VND.                           |
        |                                                       |
FR-041  | He thong cho phep gia han membership online.         | Trung binh
        | User chon goi tap, thanh toan, membership tu dong    |
        | gia han.                                              |

------------------------------------------------------------------------
### 1.7. Module Social
------------------------------------------------------------------------

ID      | Mo ta yeu cau                                         | Uu tien
--------|-------------------------------------------------------|--------
FR-042  | He thong cho phep post milestone len Feed.           | Thap
        | Tu dong tao post khi: dat PR, unlock badge, streak.  |
        |                                                       |
FR-043  | He thong cho phep follow user khac.                  | Thap
        | Xem Fitness Passport public cua nguoi duoc follow.   |
        |                                                       |
FR-044  | He thong ho tro Referral Program.                    | Thap
        | Moi ban dang ky: ca 2 nhan FitCoin bonus.            |

------------------------------------------------------------------------
### 1.8. Module Gym Owner va B2B
------------------------------------------------------------------------

ID      | Mo ta yeu cau                                         | Uu tien
--------|-------------------------------------------------------|--------
FR-045  | Food Vendor dang ky va quan ly san pham.             | Cao
        | Dang san pham: ten, gia, calo, macro, anh.           |
        | Nhan va xu ly don hang.                               |
        |                                                       |
FR-046  | Food Vendor xem analytics.                           | Trung binh
        | Doanh thu, top mon ban chay, so luot review.         |
        |                                                       |
FR-047  | Gym Owner quan ly member va gui thong bao.           | Trung binh
        | Danh sach member, thong bao lich nghi/khuyen mai.    |
        |                                                       |
FR-048  | Gym Owner duyet vendor/gym-owner moi.                    | Trung binh
        | Xem ho so, chap nhan hoac tu choi.                   |
        |                                                       |
FR-049  | Gym Owner xu ly tranh chap.                              | Trung binh
        | Xem khieu nai, ra quyet dinh, hoan tien neu can.    |
        |                                                       |
FR-050  | He thong gui notification.                           | Trung binh
        | Loai: streak reminder, order update, khuyen mai,     |
        | gear return reminder, challenge deadline.            |

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
