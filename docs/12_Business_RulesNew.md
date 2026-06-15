# 12. QUY TAC NGHIEP VU
# (Business Rules)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 11/05/2026

========================================================================

Giai thich:

  Quy tac nghiep vu (Business Rule) la cac rang buoc, dieu kien va
  logic ma he thong phai tuan thu. Chung xuat phat tu yeu cau kinh
  doanh, khong phai yeu cau ky thuat.

  Moi quy tac co:
  - Ma: BR-XX (Business Rule)
  - Ten: Mo ta ngan
  - Chi tiet: Noi dung day du
  - Ap dung cho: Module hoac tinh nang lien quan
  - Loai: Rang buoc (Constraint), Tinh toan (Computation),
          Suy dien (Inference), Hanh dong (Action Trigger)

========================================================================

## 1. QUY TAC XAC THUC VA BAO MAT
========================================================================

BR-01: QUY TAC MAT KHAU VA XAC THUC
  Loai     : Rang buoc
  Chi tiet : Voi Vendor/Gym Owner: Mat khau phai co it nhat 8 ky tu,
             bao gom 1 chu hoa, 1 chu thuong, 1 so.
             Voi Member moi (dang ky qua SĐT/Online): khong yeu cau mat 
             khau ban dau, he thong tu dong sinh MK 6 so gui qua SMS.
  Ap dung  : UC-01, Profile Settings
  Vi du    : "MyPass123" = hop le voi Vendor. "123456" = MK auto cua Member.

BR-02: QUY TAC OTP
  Loai     : Rang buoc
  Chi tiet : OTP co 6 chu so, sinh ngau nhien.
             OTP co hieu luc trong 5 phut ke tu khi gui.
             User duoc nhap toi da 3 lan. Sau 3 lan sai, khoa 15 phut.
             Moi OTP chi duoc dung 1 lan (da dung thi vo hieu hoa).
  Ap dung  : UC-02, UC-01 (Dang ky bang SDT)

BR-03: QUY TAC JWT TOKEN
  Loai     : Rang buoc
  Chi tiet : Access token het han sau 7 ngay.
             Refresh token het han sau 30 ngay.
             Token bi vo hieu hoa khi user doi mat khau hoac xoa tai khoan.
             Guest OTP chi nhan temporary token (het han 30 phut).
  Ap dung  : Toan bo he thong

BR-04: QUYEN CUA GUEST
  Loai     : Rang buoc
  Chi tiet : Guest (chua dang ky) CHI duoc:
             - Xem food listing va food detail.
             - Xem gear listing va gear detail (bao gom Lifecycle).
             - Them san pham vao gio hang.
             - Checkout bang OTP.
             Guest KHONG duoc:
             - Gym Tracking (tao session, log exercise).
             - Gamification (XP, badge, streak, ranking).
             - Social (post, follow).
             - Dang ban/cho thue gear.
             - Fitness Passport.
             - AI Food Suggestion.
             - FitCoin.
  Ap dung  : Toan bo he thong

========================================================================

## 2. QUY TAC FOOD ORDER
========================================================================

BR-05: DON HANG TOI THIEU
  Loai     : Rang buoc
  Chi tiet : Moi don hang phai co it nhat 1 san pham.
             Tong gia tri don (truoc phi giao hang) phai >= 30,000 VND.
  Ap dung  : UC-08 (Dat suat an & Checkout)

BR-06: PHI GIAO HANG
  Loai     : Tinh toan
  Chi tiet : Khoang cach duoi 5km: phi giao hang = 15,000 VND.
             Khoang cach 5km den 10km: phi giao hang = 25,000 VND.
             Khoang cach tren 10km: khong ho tro giao hang.
  Ap dung  : UC-08 (Dat suat an & Checkout)
  Ghi chu  : Trong MVP, khoang cach tinh bang tuyen tinh (khong dung
             Google Maps API). Co the dung gia tri co dinh cho demo.

BR-07: THOI HAN XAC NHAN DON
  Loai     : Hanh dong
  Chi tiet : Food Vendor phai xac nhan don trong 15 phut ke tu khi
             nhan duoc. Neu qua 15 phut khong xac nhan, he thong
             tu dong huy don va hoan tien cho user.
  Ap dung  : UC-11 (Quan tri cua hang)

BR-08: QUY TAC HUY DON
  Loai     : Rang buoc
  Chi tiet : User chi co the huy don khi trang thai la:
             - "pending" (chua xac nhan): huy ngay, hoan tien 100%.
             - "confirmed" (da xac nhan): huy duoc, hoan tien 100%.
             Khong duoc huy khi trang thai la:
             - "preparing", "delivering", "delivered".
  Ap dung  : UC-08 (Dat suat an & Checkout), Orders page

BR-09: HOA HONG NEN TANG - FOOD
  Loai     : Tinh toan
  Chi tiet : FitFuel+ thu hoa hong 10% tren tong gia tri don hang
             (khong tinh phi giao hang).
             Vi du: Don 200,000 VND + phi ship 15,000 VND
             -> Hoa hong = 200,000 * 10% = 20,000 VND.
             -> Vendor nhan = 200,000 - 20,000 = 180,000 VND.
  Ap dung  : He thong thanh toan

BR-10: QUICK RE-ORDER
  Loai     : Rang buoc
  Chi tiet : Khi user nhan [Dat lai], he thong kiem tra tung mon:
             - Mon con hang (is_available = true): them vao cart.
             - Mon het hang: bo qua, thong bao cho user.
             Cart moi KHONG ghi de cart cu (them vao cart hien tai).
  Ap dung  : UC-09 (Dat lai don cu)

========================================================================

## 3. QUY TAC GEAR HUB
========================================================================

BR-11: SO LUONG ANH GEAR
  Loai     : Rang buoc
  Chi tiet : Moi gear phai co toi thieu 2 anh thuc te.
             Toi da 8 anh. Moi anh toi da 5MB.
             Anh dau tien la anh dai dien (thumbnail).
  Ap dung  : UC-13 (Dang ky ky gui thiet bi)

BR-11B: QUYEN DANG BAN VA CHO THUE GEAR
  Loai     : Rang buoc
  Chi tiet : Do day la web kinh doanh B2C/C2C:
             - Gym Owner: CHI duoc quyen dang thiet bi de BAN dut (khong duoc cho thue).
             - Member: CHI duoc quyen dang thiet bi de CHO THUE Peer-to-Peer (khong the ban).
  Ap dung  : UC-13 (Dang ky ky gui thiet bi)

BR-12: GEAR ID KHONG DOI
  Loai     : Rang buoc
  Chi tiet : Gear ID duoc he thong gen tu dong theo format:
             GEAR-{4 ky tu ngau nhien}-{4 so cuoi timestamp}
             Vi du: GEAR-K7X2-3841
             Sau khi tao, Gear ID KHONG THE thay doi hoac xoa.
             Gear ID theo thiet bi suot vong doi, bat ke doi tay bao nhieu lan.
  Ap dung  : UC-13 (Dang ky ky gui thiet bi), UC-13 (Dang ky ky gui thiet bi)

BR-13: TIEN COC CHO THUE
  Loai     : Rang buoc
  Chi tiet : Tien coc cho thue >= 50% gia tri thiet bi (sell_price).
             Neu thiet bi chi cho thue (khong co sell_price):
             coc >= 50% * (rent_price_day * 30).
             Tien coc duoc hoan tra khi tra gear dung han va dung tinh trang.
  Ap dung  : UC-14 (Giao dich thiet bi)

BR-14: THOI HAN TRA GEAR
  Loai     : Rang buoc
  Chi tiet : Nguoi thue phai tra gear trong vong 3 ngay sau khi het han thue.
             He thong gui nhac nho truoc 1 ngay het han.
             He thong gui nhac nho hang ngay khi qua han.
  Ap dung  : UC-14 (Giao dich thiet bi)

BR-15: PHI PHAT TRA TRE
  Loai     : Tinh toan
  Chi tiet : Moi ngay tra tre, phi phat = 10% gia thue/ngay.
             Vi du: gia thue = 20,000 VND/ngay. Tra tre 3 ngay.
             Phi phat = 20,000 * 10% * 3 = 6,000 VND.
             Phi phat tu dong tru tu tien coc.
             Neu phi phat > tien coc: khong hoan coc va user bi danh dau.
  Ap dung  : UC-14 (Giao dich thiet bi)

BR-16: HOA HONG BAN GEAR
  Loai     : Tinh toan
  Chi tiet : FitFuel+ thu hoa hong 7% tren gia ban gear.
             Vi du: Gear ban 500,000 VND.
             Hoa hong = 500,000 * 7% = 35,000 VND.
             Seller nhan = 465,000 VND (tien hoac FitCoin).
  Ap dung  : UC-14 (Giao dich thiet bi)

BR-17: HOA HONG THUE GEAR
  Loai     : Tinh toan
  Chi tiet : FitFuel+ thu hoa hong 15% tren phi thue.
             Vi du: Thue 7 ngay, phi = 100,000 VND.
             Hoa hong = 100,000 * 15% = 15,000 VND.
             Seller nhan = 85,000 VND.
  Ap dung  : UC-14 (Giao dich thiet bi)

========================================================================

## 4. QUY TAC GAMIFICATION
========================================================================

BR-18: BANG TINH XP
  Loai     : Tinh toan
  Chi tiet : XP duoc cong theo bang sau:
             Hanh dong                    | XP
             -----------------------------|----
             Hoan thanh 1 buoi tap        | +50
             Dat Personal Record moi      | +30
             Dat 1 don food               | +20
             Hoan thanh Weekly Challenge   | +100
             Hoan thanh Monthly Challenge  | +200
             Ban gear thanh cong          | +80
             Moi ban (ca 2 ben nhan)      | +50
             Check-in QR tai phong tap    | +10
             Post milestone len Feed      | +5
  Ap dung  : UC-16 (Xem XP, Level & Huy hieu)

BR-19: BANG LEVEL
  Loai     : Tinh toan
  Chi tiet : Level up khi tong XP dat moc:
             Level  | XP can thiet | Ten level
             -------|--------------|----------
             1      | 0            | Newbie
             2      | 200          | Starter
             3      | 500          | Regular
             4      | 1,000        | Committed
             5      | 2,000        | Dedicated
             6      | 4,000        | Strong
             7      | 7,000        | Advanced
             8      | 11,000       | Elite
             9      | 16,000       | Champion
             10     | 25,000       | Legend
  Ap dung  : Module Gamification

BR-20: DIEU KIEN TINH STREAK
  Loai     : Suy dien
  Chi tiet : Streak duoc cong +1 khi user thuc hien IT NHAT 1 trong cac
             hanh dong sau trong ngay:
             - Hoan thanh 1 buoi tap (workout session status = done).
             - Dat 1 don food healthy.
             Streak tinh theo ngay lich (00:00 - 23:59).
             Moi ngay chi tinh streak 1 lan (du tap 2 buoi, van +1).
  Ap dung  : UC-16 (Xem XP, Level & Huy hieu)

BR-21: RESET STREAK
  Loai     : Hanh dong
  Chi tiet : Streak bi reset ve 0 khi 2 ngay lien tiep khong co
             bat ky hoat dong nao (khong tap, khong dat food).
             Timer kiem tra moi ngay luc 00:05 (cho du lieu ngay truoc
             duoc ghi nhan xong).
             Khi streak bi reset, gui notification nhac nho user.
  Ap dung  : Timer Actor, Module Gamification

BR-22: THUONG STREAK MILESTONE
  Loai     : Hanh dong
  Chi tiet : Khi streak dat moc, user duoc thuong FitCoin:
             Streak 7 ngay  : +50 FitCoin
             Streak 30 ngay : +200 FitCoin
             Streak 60 ngay : +500 FitCoin
             Streak 100 ngay: +1,000 FitCoin
             Streak 365 ngay: +5,000 FitCoin
             Dong thoi, he thong tu tao post milestone len Social Feed.
  Ap dung  : Module Gamification, Module Social

========================================================================

## 5. QUY TAC FITCOIN
========================================================================

BR-23: TY GIA FITCOIN
  Loai     : Rang buoc
  Chi tiet : 1 FitCoin = 1 VND. Ty gia co dinh, khong thay doi.
  Ap dung  : Toan bo he thong

BR-24: HAN CHE SU DUNG FITCOIN
  Loai     : Rang buoc
  Chi tiet : FitCoin KHONG duoc rut ra tien mat.
             FitCoin chi duoc su dung trong he thong FitFuel+.
             So du FitCoin khong duoc am (< 0).
  Ap dung  : Module FitCoin

BR-25: NGUON EARN FITCOIN
  Loai     : Suy dien
  Chi tiet : User nhan FitCoin tu cac nguon:
             - Ban gear thanh cong (so tien ban - hoa hong)
             - Streak milestone (theo BR-22)
             - Hoan thanh challenge (theo reward cua challenge)
             - Gioi thieu ban (referral bonus: 50 FC moi lan)
             - Nap tien thanh FitCoin (1 VND = 1 FC)
  Ap dung  : Module FitCoin

BR-26: NGUON SPEND FITCOIN
  Loai     : Suy dien
  Chi tiet : User tieu FitCoin cho:
             - Mua food (thanh toan 1 phan hoac toan bo)
             - Thue gear (thanh toan 1 phan hoac toan bo)
             - Mua gear (thanh toan 1 phan hoac toan bo)
             - Gia han membership phong tap
  Ap dung  : Module FitCoin

BR-27: GIOI HAN SU DUNG FITCOIN MOI DON
  Loai     : Rang buoc
  Chi tiet : Toi da su dung 50% gia tri don hang bang FitCoin.
             Phan con lai phai thanh toan bang tien that (VNPay/Momo).
             Vi du: Don 200,000 VND. Toi da dung 100,000 FitCoin.
             Phan con lai 100,000 VND phai tra bang tien.
  Ap dung  : UC-08 (Dat suat an & Checkout), UC-14 (Giao dich thiet bi), UC-14 (Giao dich thiet bi)

========================================================================

## 6. QUY TAC AI SUGGESTION (RULE-BASED)
========================================================================

BR-28: BANG MAPPING MUSCLE GROUP -> MACRO PRIORITY
  Loai     : Suy dien
  Chi tiet : Moi nhom co duoc map den muc do uu tien cua tung macro:
             Nhom co     | Protein  | Carb     | Fat
             ------------|----------|----------|--------
             chest       | high     | medium   | low
             back        | high     | medium   | low
             legs        | high     | high     | low
             shoulders   | medium   | low      | low
             arms        | high     | low      | low
             core        | medium   | low      | low
             rest_day    | low      | low      | medium
  Ap dung  : UC-10 (AI goi y thuc don)

BR-29: CACH SORT THEO PRIORITY
  Loai     : Tinh toan
  Chi tiet : Muc do priority duoc chuyen thanh cach sort:
             - "high"   = ORDER BY truong_do DESC (giam dan, uu tien cao)
             - "medium" = khong sort theo truong nay (trung tinh)
             - "low"    = ORDER BY truong_do ASC (tang dan, uu tien thap)
             Uu tien sort: protein truoc, roi carb, roi fat.
  Ap dung  : SuggestionEngine

BR-30: SO LUONG GOI Y
  Loai     : Rang buoc
  Chi tiet : He thong LUON tra ve dung 3 mon goi y.
             Neu ket qua query < 3 mon phu hop:
             bo sung bang mon co avg_rating cao nhat
             (bat ke macro co khop hay khong).
             Neu database khong co mon nao: hien thi thong bao
             "Chua co mon an phu hop" va nut [Xem tat ca].
  Ap dung  : UC-10 (AI goi y thuc don), SuggestionEngine

========================================================================

## 7. QUY TAC GYM TRACKING
========================================================================

BR-31: QUY TAC TINH PERSONAL RECORD (PR)
  Loai     : Tinh toan
  Chi tiet : Ky luc ca nhan duoc tinh doc lap cho tung bai tap.
             Cong thuc: PR = max(weight x reps) trong toan bo lich su.
             Mot buoi tap co the pha nhieu PR cung luc.
  Ap dung  : UC-05 (Ghi nhan buoi tap)

BR-32: GOI Y NHOM CO (SMART SUGGESTION)
  Loai     : Suy dien
  Chi tiet : He thong tu dong quet lich su 7 ngay gan nhat.
             Nhom co co tan suat tap thap nhat se duoc de xuat tap hom nay.
             Neu tan suat bang nhau, uu tien nhom co co thoi gian nghi lau nhat.
  Ap dung  : UC-05 (Ghi nhan buoi tap)

BR-33: KHOA DU LIEU GYM SESSION
  Loai     : Rang buoc
  Chi tiet : Du lieu buoi tap chi duoc phep chinh sua hoac xoa trong
             vong 24 gio ke tu khi ket thuc (status = Done).
             Sau 24 gio, ban ghi bi khoa vinh vien.
  Ap dung  : UC-05 (Ghi nhan buoi tap)

========================================================================

## 8. QUY TAC HE THONG KHAC
========================================================================

BR-34: THUAT TOAN TIE-BREAKING NHOM CO
  Loai     : Suy dien
  Chi tiet : Neu buoi tap co nhieu nhom co co so set bang nhau (VD: Fullbody),
             he thong uu tien cac nhom co lon tieu hao nhieu nang luong
             theo thu tu: Legs > Back > Chest > Shoulders > Arms > Core.
  Ap dung  : SuggestionEngine

BR-35: DOC QUYEN VENDOR TRONG GIO HANG
  Loai     : Rang buoc
  Chi tiet : De dam bao quy trinh van chuyen, mot gio hang (Cart) chi duoc
             chua san pham tu mot Food Vendor duy nhat.
  Ap dung  : UC-08 (Dat suat an & Checkout)

BR-36: MERGE TAI KHOAN GUEST
  Loai     : Hanh dong
  Chi tiet : Du lieu gio hang va don hang cua Guest duoc gan voi SDT.
             Khi Guest tao tai khoan Member bang dung SDT do, he thong
             tu dong dong bo (merge) toan bo lich su vao tai khoan moi.
  Ap dung  : UC-01 (Dang ky & Dang nhap)

BR-37: QUY TAC BAT BIEN VONG DOI (APPEND-ONLY)
  Loai     : Rang buoc
  Chi tiet : Bang GEAR_LIFECYCLE hoat dong theo co che chi-duoc-them.
             Moi thay doi trang thai deu phai tao ban ghi moi.
             Tuyet doi cam thao tac UPDATE/DELETE tren cac ban ghi cu.
  Ap dung  : Toan bo Module Gear Hub

BR-38: BAO MAT CALLBACK THANH TOAN (WEBHOOK)
  Loai     : Rang buoc
  Chi tiet : Moi request tra ve tu cong thanh toan bat buoc phai vuot
             qua buoc doi chieu chu ky (HMAC). Sai chu ky se bi tu choi.
  Ap dung  : UC-19 (Quan ly & Giao dich FitCoin)

BR-39: TINH NGUYEN TU (IDEMPOTENCY) CUA GIAO DICH
  Loai     : Rang buoc
  Chi tiet : He thong chi xu ly cong tien/chuyen trang thai dung 1 lan
             duy nhat cho moi Transaction ID tu cong thanh toan de
             tranh loi nhan doi don do mang bi delay.
  Ap dung  : UC-19 (Quan ly & Giao dich FitCoin)

BR-40: QUY TAC DANG KY MEMBER
  Loai     : Rang buoc
  Chi tiet : Member moi CHI CO THE dang ky tai khoan qua luong Mua Membership
             (Online 100% chi nhap SDT hoac Offline to Online quet QR POS). 
             He thong khong ho tro tao tai khoan rieng le ma khong co goi tap. 
             Trang /auth/register chi danh cho Vendor va Gym Owner.
  Ap dung  : He thong Dang ky, Landing Page

BR-41: QUY TAC GOI TAP (MEMBERSHIP)
  Loai     : Rang buoc
  Chi tiet : He thong chi co 1 hang thanh vien duy nhat voi 2 chu ky thanh toan:
             - Goi Thang
             - Goi Nam (Bang 10 thang, tiet kiem 2 thang)
             Tat ca cac uu dai (Vao gym, AI, PT, etc.) deu giong het nhau.
  Ap dung  : Checkout Modal, He thong thanh toan

========================================================================
KET THUC FILE 12
========================================================================
