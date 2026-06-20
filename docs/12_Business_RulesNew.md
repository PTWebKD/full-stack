# 12. QUY TAC NGHIEP VU
# (Business Rules)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 11/05/2026 (Cap nhat: 18/06/2026 — Dinh huong lai theo Product Owner)

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
  Chi tiet : Voi Gym Owner: Mat khau phai co it nhat 8 ky tu,
             bao gom 1 chu hoa, 1 chu thuong, 1 so.
             Voi Member moi (dang ky qua SĐT/Online): khong yeu cau mat
             khau ban dau, he thong tu dong sinh MK 6 so gui qua SMS.
  Ap dung  : UC-01, UC-02
  Vi du    : "MyPass123" = hop le voi Gym Owner. "123456" = MK auto cua Member.

BR-02: QUY TAC OTP
  Loai     : Rang buoc
  Chi tiet : OTP co 6 chu so, sinh ngau nhien.
             OTP co hieu luc trong 5 phut ke tu khi gui.
             User duoc nhap toi da 3 lan. Sau 3 lan sai, khoa 15 phut.
             Moi OTP chi duoc dung 1 lan (da dung thi vo hieu hoa).
  Ap dung  : UC-01 (Dang ky bang SDT), UC-02

BR-03: QUY TAC JWT TOKEN
  Loai     : Rang buoc
  Chi tiet : Access token het han sau 7 ngay.
             Refresh token het han sau 30 ngay.
             Token bi vo hieu hoa khi user doi mat khau hoac xoa tai khoan.
  Ap dung  : Toan bo he thong

BR-04: QUYEN CUA GUEST
  Loai     : Rang buoc
  Chi tiet : Guest (chua dang ky) CHI duoc:
             - Xem trang gioi thieu phong tap va goi tap.
             - Xem Fitness Passport public cua member.
             - Dang ky thanh vien (luong mua Membership Online).
             Guest KHONG duoc:
             - Check-in phong tap.
             - Xem/mua san pham dinh duong noi bo.
             - Gym Tracking (tao session, log exercise).
             - Gamification (XP, badge, streak, ranking).
             - FitCoin.
             - Fitness Passport ca nhan.
             - AI care queue (chi danh cho Gym Owner).
  Ap dung  : Toan bo he thong

BR-40: QUY TAC DANG KY MEMBER
  Loai     : Rang buoc
  Chi tiet : Member moi CHI CO THE dang ky tai khoan qua luong Mua Membership
             (Online 100% chi nhap SDT hoac Offline to Online quet QR POS).
             He thong khong ho tro tao tai khoan rieng le ma khong co goi tap.
             Trang /auth/register chi danh cho Gym Owner.
  Ap dung  : He thong Dang ky, Landing Page

========================================================================

## 2. QUY TAC MEMBERSHIP LIFECYCLE
========================================================================

BR-05: QUY TAC GOI TAP
  Loai     : Rang buoc
  Chi tiet : He thong chi co 2 thoi han goi tap, quyen loi giong nhau hoan toan:
             - Goi Thang (monthly): 1 thang, vao phong tap tu do, day du tien ich.
             - Goi Nam (annual): 12 thang, quyen loi y het Goi Thang.
             Gia Goi Nam = gia Goi Thang x 10 (tiet kiem tuong duong 2 thang).
             Khong co phan biet tier hay quyen loi theo goi — tat ca member deu
             co cung quyền truy cap phong tap va moi dich vu.
             KHONG co: Day Pass, Basic, Standard, Premium, PT Plus, Student.
  Ap dung  : UC-13, UC-14, UC-15

BR-06: QUY TAC GIA HAN GOI TAP
  Loai     : Rang buoc
  Chi tiet : Khi gia han, he thong tao ban ghi moi trong MEMBERSHIP_HISTORY.
             Ngay ket thuc moi = ngay ket thuc cu + thoi han goi moi.
             Neu goi da het han: ngay bat dau moi = ngay thanh toan.
             Hoi vien duoc gia han nhieu lan, lich su duoc giu nguyen.
  Ap dung  : UC-14

BR-07: QUY TAC NANG CAP GOI
  Loai     : Tinh toan
  Chi tiet : Phi nang cap = (gia goi moi - gia goi cu) / so ngay trong goi cu
             x so ngay con lai cua goi cu.
             Vi du: Goi Thang 399K/30 ngay, con 15 ngay, chuyen sang Goi Nam 3990K/365 ngay:
             Phi chenh = (3990K - 399K) / 30 x 15 = 1,795K (ap dung nguyen tac pro-rata).
  Ap dung  : UC-15

BR-08: QUY TAC BAO LUU GOI TAP
  Loai     : Rang buoc
  Chi tiet : Member duoc bao luu toi da 1 lan / nam.
             Thoi gian bao luu toi da: 60 ngay.
             Ly do bao luu: ly do suc khoe, cong tac, hoac ly do khac.
             Admin phai duyet yeu cau bao luu.
             Khi ket thuc bao luu, ngay het han duoc cong them so ngay bao luu.
  Ap dung  : UC-16

BR-09: QUY TAC CHECK-IN
  Loai     : Rang buoc
  Chi tiet : Member chi duoc check-in khi co goi tap (Goi Thang hoac Goi Nam) con hieu luc.
             Goi thang/nam: khong gioi han so luot check-in.
             He thong ghi nhan thoi gian check-in vao bang CHECK_INS.
             Khong co cap phat tai san hay tien ich khi check-in — member tu lo.
  Ap dung  : UC-05

BR-10: CANH BAO SAP HET HAN
  Loai     : Hanh dong
  Chi tiet : He thong tu dong chen hoi vien vao AI care queue khi:
             - Con 7 ngay het han: uu tien Cao.
             - Con 3 ngay het han: uu tien Rat cao + gui SMS nhac nho.
             - Da het han 1-3 ngay: uu tien Rat cao.
             - Da het han > 3 ngay: chuyen sang trang thai "het han, chua gia han".
  Ap dung  : UC-17, UC-47, Timer Actor

BR-11: CANH BAO KHONG ACTIVE
  Loai     : Hanh dong
  Chi tiet : He thong tu dong them hoi vien vao AI care queue khi:
             - 14 ngay chua check-in (goi tap van con hieu luc).
             - 7 ngay chua check-in + goi sap het han.
  Ap dung  : UC-18, UC-47, Timer Actor

========================================================================

## 3. QUY TAC NUTRITION (DINH DUONG NOI BO)
========================================================================

BR-12: QUY TAC BAN DINH DUONG
  Loai     : Rang buoc
  Chi tiet : Chi Gym Owner va nhan vien duoc ban san pham dinh duong.
             San pham dinh duong la tai san noi bo cua phong tap (khong co vendor ngoai).
             Member co the dat truoc san pham sau buoi tap.
             Hoa don dinh duong duoc gan voi membership cua member.
  Ap dung  : UC-22, UC-23

BR-13: QUY TAC TON KHO
  Loai     : Rang buoc
  Chi tiet : He thong tu dong cap nhat ton kho khi ban.
             Khi ton kho <= nguong canh bao (moi san pham co nguong rieng), he thong:
             - Hien canh bao mau do trong dashboard cua Gym Owner.
             - Them vao danh sach canh bao trong bao cao ton kho.
             San pham het hang (ton kho = 0): tu dong chuyen trang thai = 'out_of_stock'.
  Ap dung  : UC-26, FR-027

BR-14: QUY TAC COMBO DINH DUONG
  Loai     : Rang buoc
  Chi tiet : Combo phai co it nhat 2 thanh phan.
             Gia combo <= gia le tung thanh phan cong lai (phai co khuyen mai).
             Khi thanh phan trong combo het hang, combo tu dong an (is_available = false).
  Ap dung  : UC-24

BR-15: GOI Y DINH DUONG (AI RULE-BASED)
  Loai     : Suy dien
  Chi tiet : Sau khi ket thuc workout session, he thong goi y 3 san pham dinh duong.
             Logic: nhom co vua tap -> uu tien macro -> loc san pham con hang.
             Bang mapping (nhom co -> uu tien macro):
             Nhom co     | Protein  | Carb     | Fat
             ------------|----------|----------|--------
             chest       | high     | medium   | low
             back        | high     | medium   | low
             legs        | high     | high     | low
             shoulders   | medium   | low      | low
             arms        | high     | low      | low
             core        | medium   | low      | low
             rest_day    | low      | low      | medium
             Neu ket qua < 3 san pham: bo sung bang san pham ban chay nhat.
  Ap dung  : UC-25, FR-027

========================================================================

## 4. QUY TAC GEAR MARKETPLACE (TAI SAN CHO BAN VA CHO THUE)
========================================================================

[Module Asset & Amenities cu (khan/locker/tai san noi bo) DA BO: locker va khan
la do ca nhan cua member, khong quan ly trong he thong. Cac quy tac lien quan
(BR-16 den BR-20 phien ban cu) da duoc thay the boi Gear Marketplace (BR-47 den BR-51
trong Section 11).]

Xem Section 11 — QUY TAC GEAR MARKETPLACE & GUEST OTP CHECKOUT.

========================================================================

## 5. QUY TAC GAMIFICATION
========================================================================

BR-21: BANG TINH XP
  Loai     : Tinh toan
  Chi tiet : XP duoc cong theo bang sau:
             Hanh dong                    | XP
             -----------------------------|----
             Hoan thanh 1 buoi tap        | +50
             Dat Personal Record moi      | +30
             Check-in phong tap (QR)      | +10
             Hoan thanh Weekly Challenge  | +100
             Hoan thanh Monthly Challenge | +200
             Gia han goi tap              | +50
             Moi ban (ca 2 ben nhan)      | +50
             Post milestone len Feed      | +5
  Ap dung  : Module Gamification

BR-22: BANG LEVEL
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

BR-23: DIEU KIEN TINH STREAK
  Loai     : Suy dien
  Chi tiet : Streak duoc cong +1 khi member hoan thanh it nhat 1 buoi tap
             trong ngay (workout session status = done).
             Streak tinh theo ngay lich (00:00 - 23:59).
             Moi ngay chi tinh streak 1 lan (du tap 2 buoi, van +1).
  Ap dung  : Module Gamification

BR-24: RESET STREAK
  Loai     : Hanh dong
  Chi tiet : Streak bi reset ve 0 khi 2 ngay lien tiep khong co buoi tap nao.
             Timer kiem tra moi ngay luc 00:05.
             Khi streak bi reset, gui notification nhac nho member.
  Ap dung  : Timer Actor, Module Gamification

BR-25: THUONG STREAK MILESTONE
  Loai     : Hanh dong
  Chi tiet : Khi streak dat moc, member duoc thuong FitCoin:
             Streak 7 ngay  : +50 FitCoin
             Streak 30 ngay : +200 FitCoin
             Streak 60 ngay : +500 FitCoin
             Streak 100 ngay: +1,000 FitCoin
             Streak 365 ngay: +5,000 FitCoin
  Ap dung  : Module Gamification

========================================================================

## 6. QUY TAC FITCOIN
========================================================================

BR-26: TY GIA FITCOIN
  Loai     : Rang buoc
  Chi tiet : 1 FitCoin = 1 VND. Ty gia co dinh, khong thay doi.
  Ap dung  : Toan bo he thong

BR-27: HAN CHE SU DUNG FITCOIN
  Loai     : Rang buoc
  Chi tiet : FitCoin KHONG duoc rut ra tien mat.
             FitCoin chi duoc su dung trong he thong FitFuel+.
             So du FitCoin khong duoc am (< 0).
  Ap dung  : Module FitCoin

BR-28: NGUON EARN FITCOIN
  Loai     : Suy dien
  Chi tiet : Member nhan FitCoin tu cac nguon:
             - Streak milestone (theo BR-25)
             - Hoan thanh challenge (theo reward cua challenge)
             - Gioi thieu ban (referral bonus: 50 FC moi lan)
             - Nap tien thanh FitCoin (1 VND = 1 FC)
             - Gia han goi tap (bonus: 50 FC moi lan gia han)
  Ap dung  : Module FitCoin

BR-29: NGUON SPEND FITCOIN
  Loai     : Suy dien
  Chi tiet : Member tieu FitCoin cho:
             - Mua san pham dinh duong noi bo
             - Gia han / nang cap goi tap
  Ap dung  : Module FitCoin

BR-30: GIOI HAN SU DUNG FITCOIN MOI DON
  Loai     : Rang buoc
  Chi tiet : Toi da su dung 50% gia tri don hang bang FitCoin.
             Phan con lai phai thanh toan bang tien that (VNPay/Momo).
             Vi du: Don 200,000 VND. Toi da dung 100,000 FitCoin.
  Ap dung  : UC-46

========================================================================

## 7. QUY TAC GYM TRACKING
========================================================================

BR-31: QUY TAC TINH PERSONAL RECORD (PR)
  Loai     : Tinh toan
  Chi tiet : Ky luc ca nhan duoc tinh doc lap cho tung bai tap.
             Cong thuc: PR = max(weight x reps) trong toan bo lich su.
             Mot buoi tap co the pha nhieu PR cung luc.
  Ap dung  : UC-08

BR-32: GOI Y NHOM CO (SMART SUGGESTION)
  Loai     : Suy dien
  Chi tiet : He thong tu dong quet lich su 7 ngay gan nhat.
             Nhom co co tan suat tap thap nhat se duoc de xuat tap hom nay.
             Neu tan suat bang nhau, uu tien nhom co co thoi gian nghi lau nhat.
  Ap dung  : UC-11

BR-33: KHOA DU LIEU GYM SESSION
  Loai     : Rang buoc
  Chi tiet : Du lieu buoi tap chi duoc phep chinh sua hoac xoa trong
             vong 24 gio ke tu khi ket thuc (status = Done).
             Sau 24 gio, ban ghi bi khoa vinh vien.
  Ap dung  : UC-07

BR-34: THUAT TOAN TIE-BREAKING NHOM CO
  Loai     : Suy dien
  Chi tiet : Neu buoi tap co nhieu nhom co co so set bang nhau,
             he thong uu tien cac nhom co lon tieu hao nhieu nang luong:
             Legs > Back > Chest > Shoulders > Arms > Core.
  Ap dung  : UC-11, SuggestionEngine

========================================================================

## 8. QUY TAC AI RETENTION
========================================================================

BR-35: BANG RECOMMENDATION RULE
  Loai     : Suy dien
  Chi tiet : He thong tao recommendation tu dong theo cac rule:
             Rule 1: membershipExpireIn <= 7 -> "Sap het han, nhac gia han"
             Rule 2: daysSinceLastCheckin >= 14 -> "Lau chua tap, lien he lai"
             Rule 3: membershipExpired && daysSinceExpiry <= 30 -> "Da het han, mo cua gia han"
             Rule 4: checkinPerWeek >= 4 && plan = 'Goi Thang' -> "Tap nhieu, goi y chuyen Goi Nam"
             Rule 5: buyNutrition >= 3x/week -> "Hay mua dinh duong, goi y combo dinh duong"
             Rule 6: buyGear >= 2x/month -> "Hay mua gear, goi y thue dai han"
             Moi rule tao 1 ban ghi trong RECOMMENDATIONS voi:
             - recommendation_type
             - priority (high/medium/low)
             - suggested_action
             - status (pending/handled/dismissed)
  Ap dung  : UC-47, UC-48, UC-49, Timer Actor

BR-36: QUY TAC XU LY RECOMMENDATION
  Loai     : Rang buoc
  Chi tiet : Nhan vien phai cap nhat trang thai recommendation sau khi xu ly:
             - handled: Da lien he, ket qua ghi chu cu the.
             - dismissed: Khong xu ly, ghi ly do.
             Recommendation cua cung 1 nguoi khong bi tao trung lap trong 7 ngay.
  Ap dung  : UC-48

========================================================================

## 9. QUY TAC HE THONG KHAC
========================================================================

BR-37: BAO MAT CALLBACK THANH TOAN (WEBHOOK)
  Loai     : Rang buoc
  Chi tiet : Moi request tra ve tu cong thanh toan bat buoc phai vuot
             qua buoc doi chieu chu ky (HMAC). Sai chu ky se bi tu choi.
  Ap dung  : UC-43

BR-38: TINH NGUYEN TU (IDEMPOTENCY) CUA GIAO DICH
  Loai     : Rang buoc
  Chi tiet : He thong chi xu ly cong tien/chuyen trang thai dung 1 lan
             duy nhat cho moi Transaction ID de tranh loi nhan doi don.
  Ap dung  : UC-43

BR-39: DOC QUYEN SINGLE-TENANT
  Loai     : Rang buoc
  Chi tiet : He thong chi phuc vu DUY NHAT 1 phong tap.
             Bang GYMS chi co duy nhat 1 dong du lieu (gym_id = 1).
             Khong co chuc nang tao them phong tap moi.
             Tat ca user role=gym_owner deu quan ly cung 1 gym.
  Ap dung  : Toan bo he thong

========================================================================

## 10. QUY TAC TRANSFORMATION JOURNEY ENGINE
========================================================================

BR-41: QUY TAC GOI Y CHUONG TRINH (GOAL ENGINE)
  Loai     : Suy dien
  Chi tiet : Sau khi member hoan thanh 5 buoc Goal Onboarding,
             he thong loc WORKOUT_PROGRAMS theo 3 dieu kien:
             goal_type khop + level khop + days_per_week khop.
             Neu < 2 ket qua: no rang tinh tren level (beginner = intermediate).
             He thong goi y toi da 3 chuong trinh, sap xep:
             (1) Khop hoan toan 3 dieu kien
             (2) Khop 2 dieu kien (no rang level)
             (3) Pho bien nhat (theo so member_programs)
             Member chon 1 -> tao MEMBER_PROGRAMS (status='active').
             1 member chi co DUY NHAT 1 MEMBER_PROGRAMS voi status='active'.
  Ap dung  : UC-55, UC-56, FR-053, FR-054

BR-42: QUY TAC SINH BUOI TAP TU DONG (DAILY SESSION GENERATION)
  Loai     : Suy dien
  Chi tiet : Member chon nhom co muon tap hom nay (1 thao tac duy nhat).
             He thong NGAY LAP TUC generate 1 buoi tap hoan chinh:
             - Danh sach bai tap phu hop voi nhom co da chon
             - Sets x Reps muc tieu
             - Muc ta de xuat dua tren: lich su buoi tap truoc + goal_type
               + fitness_level cua member (neu da thiet lap)
             Buoi tap sinh ra chi la GOI Y — member co the:
             - Dung nguyen va bat dau ngay (truong hop pho bien nhat).
             - Chinh sua: them/xoa/doi sets-reps (tuy chon truoc khi bat dau).
             Moi thay doi duoc ghi vao customization_log (JSON).
             Neu member chua thiet lap muc tieu: sinh buoi tap
             o muc beginner voi nhom co da chon.
  Ap dung  : UC-57, FR-056, FR-057

BR-43: QUY TAC PROGRESSIVE OVERLOAD AI
  Loai     : Suy dien + Hanh dong
  Chi tiet : Sau khi member bam "Hoan thanh buoi tap", he thong chay:
             DIEU KIEN TANG TA:
             - actual_reps >= target_reps_max cho CUNG 1 bai tap
               trong 2 buoi lien tiep co program_exercise_id
             -> GHI: EXERCISE_LOGS.overload_suggestion =
                     {next_weight: current_weight + 2.5, reason: "exceeded target 2x"}
             -> HIEN THI: "Buoi sau tang len X.Xkg nhe?" trong Progress Dashboard.
             DIEU KIEN GIAM / GIU:
             - actual_reps < target_reps_min trong 2 buoi lien tiep
             -> GHI: suggestion = {maintain, reason: "below target"}
             - actual_reps < target_reps_min trong 3 buoi lien tiep
             -> TAO: RECOMMENDATIONS loai 'stuck_plateau', priority=LOW
             -> NOI DUNG: "Member dang kho voi [ten bai]. Lien he de ho tro them."
  Ap dung  : UC-58, FR-058, BR-35 (mo rong R9)

BR-44: QUY TAC KICH HOAT AI DINH DUONG SAU TAP (POST-WORKOUT NUTRITION TRIGGER)
  Loai     : Hanh dong
  Chi tiet : Sau khi WORKOUT_SESSIONS.status chuyen sang 'done',
             he thong chay AI Nutrition Suggestion voi 4 tin hieu:
             Tin hieu 1: Nhom co chinh da tap hom nay
                         (aggregate tu EXERCISE_LOGS.muscle_group)
             Tin hieu 2: goal_type cua TRANSFORMATION_GOALS active hien tai
                         (null -> dung logic nhom co don thuan, nhu BR-15 cu)
             Tin hieu 3: Cuong do buoi tap
                         (tong sets trong buoi > 15 = 'high', <= 8 = 'low')
             Tin hieu 4: San pham member hay mua nhat (top 3 tu NUTRITION_ORDERS)
             Ket qua: popup 3 san pham tu NUTRITION_PRODUCTS con hang (is_available=true).
             Uu tien: tin hieu 4 (hay mua) + tin hieu 1 (nhom co) + tin hieu 2 (muc tieu).
             Goi y khong lap lai san pham da mua trong ngay hom do.
  Ap dung  : UC-58, FR-064, BR-15 (mo rong)

BR-45: QUY TAC AI CARE QUEUE MO RONG (R7, R8, R9)
  Loai     : Hanh dong
  Chi tiet : Mo rong BR-35 (6 rule -> 9 rule), them 3 rule moi:
             Rule 7 (R7): member_programs.status = 'active'
                          VA buoi tap cuoi tu chuong trinh > 7 ngay
                          -> recommendation_type = 'inactive_program'
                          -> priority = HIGH
                          -> suggested_action = "Member bo chuong trinh 7+ ngay. Goi check-in."
             Rule 8 (R8): member_programs.completion_pct = 100
                          VA member_programs.status chuyen sang 'completed'
                          -> recommendation_type = 'goal_achieved_upsell'
                          -> priority = MEDIUM
                          -> suggested_action = "Member hoan thanh CT! Goi y CT tiep theo."
             Rule 9 (R9): Da duoc tao qua BR-43 (stuck_plateau)
                          -> priority = LOW
                          -> suggested_action = "Member stuck bai [X]. Lien he de ho tro them."
             Quy tac chong trung lap (BR-36): cung loai rec khong tao lai trong 7 ngay.
  Ap dung  : UC-47, UC-58, BR-35, BR-36, Timer Actor

BR-46: QUY TAC MILESTONE ENGINE (22 MILESTONE)
  Loai     : Hanh dong
  Chi tiet : Sau moi hanh dong ky thuat (check-in, hoan thanh session, dat PR,
             cap nhat so do, chon chuong trinh, mua nutrition):
             He thong kiem tra 22 dieu kien milestone theo bang:
             Ma    | Dieu kien kich hoat                     | FitCoin | XP
             ------|------------------------------------------|---------|-----
             M01   | Buoi tap dau tien hoan thanh             | 50      | 200
             M02   | Tuan dau tien: du buoi theo lich          | 100     | 500
             M03   | Tao muc tieu + bat dau chuong trinh      | 50      | 100
             M10   | Streak check-in 7 ngay lien tiep         | 70      | 300
             M11   | Streak check-in 14 ngay lien tiep        | 150     | 600
             M12   | Streak check-in 30 ngay lien tiep        | 300     | 1500
             M20   | PR moi bat ky bai tap                    | 30      | 150
             M21   | Tang 10% suc manh so voi tuan 1          | 100     | 400
             M22   | Tang 25% suc manh so voi tuan 1          | 200     | 800
             M30   | 25% tien do muc tieu                     | 50      | 200
             M31   | 50% tien do muc tieu                     | 100     | 500
             M32   | 100% muc tieu dat duoc (CELEBRATION MAX) | 500     | 2000
             M40   | Hoan thanh 1 tuan chuong trinh           | 20      | 100
             M41   | Hoan thanh 4 tuan (1 thang)              | 150     | 600
             M42   | Hoan thanh 12 tuan (full program)        | 500     | 2000
             M50   | Mua nutrition sau tap 5 lan              | 50      | 200
             M51   | Dat pre-order 10 lan                     | 100     | 400
             M60   | Cap nhat so do 4 tuan lien tiep           | 80      | 300
             M61   | Giam duoc 3% body fat                    | 200     | 800
             M70   | Tao Share Card dau tien                  | 100     | 300
             M71   | Ban be dang ky qua link (Year 2)         | 500     | 1000
             M80   | La member 1 nam                          | 300     | 1200
             LUU Y: M13 (streak bi pha) KHONG tao milestone — tranh shame member.
             Moi milestone chi duoc trao 1 LAN duy nhat cho moi member.
             CELEBRATION MAX (M32, M42): hien thi man hinh an mung + offer Share Card.
  Ap dung  : UC-61, FR-062, FR-063, Module Gamification (mo rong)

========================================================================

## 11. QUY TAC GEAR MARKETPLACE & GUEST OTP CHECKOUT
========================================================================

BR-47: QUY TAC GUEST OTP XAC THUC
  Loai     : Rang buoc + Hanh dong
  Chi tiet : Guest muon mua food/gear/supplement phai xac thuc SDT:
             (1) Nhap SDT -> he thong gui SMS OTP 6 so ngau nhien.
             (2) OTP het han sau 10 phut ke tu luc gui.
             (3) Toi da 3 lan gui OTP / ngay / cung 1 so dien thoai.
             (4) Sau xac thuc thanh cong: cap session_token tam thoi (TTL 2 gio).
             (5) Session_token cho phep tao INVOICES voi user_id = NULL va guest_phone = SDT.
             (6) Guest KHONG co tai khoan: khong luu thong tin cua khau, khong tich XP.
             (7) Neu SDT khop voi USERS (da co tai khoan): nhac dang nhap thay vi OTP.
  Ap dung  : UC-63, FR-065, checkout flow

BR-48: QUY TAC GIOI HAN MUA HANG CHUA XAC THUC
  Loai     : Rang buoc
  Chi tiet : Moi session guest (2 gio):
             - Tong gia tri INVOICES toi da 5,000,000 VND / 24 gio / SDT.
             - Toi da 3 don hang trong 1 session.
             - Chi mua food/gear/supplement — KHONG thue gear.
             - Payment bat buoc qua cong (VNPay/MoMo) hoac tien mat tai quay;
               KHONG duoc dung FitCoin (chi co member moi co FitCoin).
  Ap dung  : UC-63, UC-65, FR-065

BR-49: QUY TAC THUE GEAR (MEMBER ONLY)
  Loai     : Rang buoc
  Chi tiet : Chi MEMBER (co tai khoan dang nhap) moi duoc thue gear.
             Guest KHONG the thue gear.
             Quy trinh thue:
             (1) Member chon GEAR_PRODUCTS.is_for_rental = true, qty_available > 0.
             (2) Chon ngay bat dau, ngay tra (toi da start_date + 7 ngay).
             (3) Tinh phi: rental_fee = price_rental_per_day * (due_date - start_date).
             (4) Phai thanh toan deposit_amount + rental_fee truoc khi nhan gear.
             (5) Ghi GEAR_RENTALS.status = 'active', giam GEAR_PRODUCTS.qty_available -= 1.
             Gia han: toi da 1 lan, them toi da 7 ngay (trong khi gear con san sang).
             Gioi han: 1 member toi da 3 gear dang thue cung luc.
  Ap dung  : UC-66, FR-068

BR-50: QUY TAC PHI PHAT QUA HAN VA TINH TRANG XAU
  Loai     : Rang buoc + Tinh toan
  Chi tiet : Daily cron (06:00) quet GEAR_RENTALS.status = 'active':
             NEU due_date < CURRENT_DATE:
               -> Doi status = 'overdue'
               -> late_fee += 50,000 VND x so_ngay_qua_han
               -> Tao NOTIFICATIONS canh bao cho member va Gym Owner
             NEU status = 'overdue' va qua han >= 14 ngay:
               -> Doi status = 'lost'
               -> invoice: tinh phi = deposit_amount da mat + bat buoc boi thuong
               -> Gym Owner xu ly thu cong
             Khi staff xac nhan tra (status = 'active' hoac 'overdue'):
               GOOD: hoan coc 100%, dong lai GEAR_RENTALS.
               MINOR_DAMAGE: tru 30% coc.
               MAJOR_DAMAGE: tru 100% coc + tao invoice boi thuong them.
               LOST: tru 100% coc + tao invoice boi thuong theo gia tri gear.
  Ap dung  : UC-67, FR-069, FR-070

BR-51: QUY TAC QUAN LY TON KHO GEAR
  Loai     : Rang buoc + Tinh toan
  Chi tiet : GEAR_PRODUCTS.qty_available phan anh so luong thuc te san sang:
             - Ban gear: qty_available -= so_luong (khong co ngay tra, la ban vinh vien).
             - Thue gear: qty_available -= 1 khi 'active'.
             - Tra gear: qty_available += 1 khi status = 'returned' (neu khong mat/hu nang).
             - qty_available luon nam trong [0, qty_total].
             KHONG cho phep thue neu qty_available = 0.
             CANH BAO: neu qty_available <= 1 -> tao NOTIFICATIONS cho Gym Owner.
  Ap dung  : UC-64, UC-65, UC-66, FR-066, FR-067

========================================================================

BR-52: QUY TAC MIEN PHI GIAO HANG (FREESHIP THRESHOLD)
  Loai     : Tinh toan + Hien thi
  Chi tiet : Don hang du dieu kien mien phi giao hang khi:
             tong_san_pham (truoc phi ship va truoc FitCoin) >= 200,000 VND.
             Neu du: shipping_fee = 0, hien "Mien phi giao hang".
             Neu chua du: shipping_fee = ket qua tu GHN/Ahamove API (real-time).
             Phi ship hien thi ro rang TRUOC khi member xac nhan don.
  Ngoai le : Khong ap dung cho don lay tai quay (pickup), don membership, thue gear.
  Ap dung  : FR-074, FR-075, checkout flow

BR-53: QUY TAC THANH TOAN BAT BUOC CHO DON DELIVERY
  Loai     : Rang buoc
  Chi tiet : Don hang chon "Giao hang" bat buoc thanh toan online truoc khi
             he thong xac nhan va chuan bi giao.
             Chap nhan: VNPay, MoMo, FitCoin (max 50% tong don theo BR-30).
             KHONG ho tro COD — phai thanh toan truoc khi ship.
  Ap dung  : FR-076, SP-01 (thanh toan)

BR-54: QUY TAC TRANG THAI DON HANG DELIVERY
  Loai     : Hanh dong + Rang buoc
  Chi tiet : Don delivery di qua 6 trang thai theo thu tu:
             pending -> preparing -> shipped -> delivering -> done / cancelled.
             Chi di mot chieu — khong rollback trang thai.
             Webhook tu GHN/Ahamove tu dong cap nhat shipped/delivering/done.
             Member nhan NOTIFICATIONS moi khi trang thai thay doi.
  Ap dung  : FR-077, FR-078, FR-079, /orders/:id

BR-55: QUY TAC HUY DON HANG
  Loai     : Rang buoc
  Chi tiet : Co the huy khi status = 'pending' hoac 'preparing'.
             Sau status = 'shipped': KHONG the huy.
             Khi huy: hoan tien ve phuong thuc goc + mo khoa FitCoin tam giu +
             cap nhat lai qty_available + gui NOTIFICATIONS cho member.
  Ap dung  : FR-080, SP-01 (hoan tien), /orders/:id, /gym-owner/orders

========================================================================
KET THUC FILE 12
========================================================================
