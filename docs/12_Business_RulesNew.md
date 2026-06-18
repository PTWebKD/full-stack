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
             - Dat buoi PT.
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
  Chi tiet : He thong ho tro 6 loai goi tap:
             - Day Pass: 1 ngay, vao phong tap
             - Basic: 1 thang / 12 thang, chi vao phong tap
             - Standard: 1 thang / 12 thang, vao phong + khan mien phi
             - Premium: 1 thang / 12 thang, vao phong + khan + locker thang
             - PT Plus: goi PT (4/8/12 buoi), vao phong + buoi PT + meal plan
             - Student: giam gia, gioi han khung gio off-peak
             Gia hang nam = gia thang x 10 (tiet kiem 2 thang).
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
             Vi du: Basic 300K/30 ngay, con 15 ngay, nang len Premium 600K/30 ngay:
             Phi chenh = (600K - 300K) / 30 x 15 = 150K.
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
  Chi tiet : Member chi duoc check-in khi co goi tap con hieu luc.
             Moi goi Day Pass: 1 luot check-in duy nhat.
             Goi thang/nam: khong gioi han so luot (tru goi Student: gioi han khung gio).
             He thong tu dong xuat hien quyen loi (khan, locker) khi check-in.
             Ghi nhan thoi gian check-in vao bang CHECK_INS.
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

## 4. QUY TAC ASSET & AMENITIES (TAI SAN VA TIEN ICH)
========================================================================

BR-16: QUYEN LOI TIEN ICH THEO GOI TAP
  Loai     : Suy dien
  Chi tiet : Moi goi tap co kem quyen loi tien ich khac nhau:
             - Day Pass : Khong co quyen loi tien ich.
             - Basic    : Chi vao phong tap, khong co quyen loi tien ich.
             - Standard : Duoc cap 1 khan mien phi moi buoi.
             - Premium  : Duoc cap khan mien phi + locker thang mien phi.
             - PT Plus  : Duoc cap khan + dung cu phu tro trong buoi tap.
             He thong tu dong xac nhan quyen loi khi member check-in.
  Ap dung  : UC-30, UC-05

BR-17: CAP PHAT TAI SAN
  Loai     : Rang buoc
  Chi tiet : Nhan vien (Gym Owner) phai xac nhan viec cap phat tai san.
             He thong ghi nhan: thoi gian cap, tai san ID, member ID, tinh trang luc cap.
             Moi lan cap phat tao 1 ban ghi trong ASSET_ASSIGNMENTS.
  Ap dung  : UC-30

BR-18: TRA TAI SAN VA PHI PHAT
  Loai     : Tinh toan
  Chi tiet : Nhan vien ghi nhan tinh trang khi tra:
             - Da tra nguyen ven: hoan tat, khong phi.
             - Bi hong: phi sua chua theo danh muc (do Gym Owner dinh nghia).
             - Bi mat: phi mat = 100% gia tri tai san.
             Phi phat duoc tu dong them vao hoa don cua member.
             Hoa don phai duoc thanh toan truoc khi member check-in lan tiep theo.
  Ap dung  : UC-31, UC-32

BR-19: QUAN LY LOCKER
  Loai     : Rang buoc
  Chi tiet : Moi locker co ma duy nhat, tinh trang (trong/dang dung/bao tri).
             Cap locker theo buoi: het sau khi member out (ra khoi phong tap).
             Cap locker theo thang: het sau 30 ngay hoac het han goi Premium.
             Canh bao: locker qua han ma chua tra, locker bao tri qua lau.
  Ap dung  : UC-29, UC-30

BR-20: BAO TRI TAI SAN
  Loai     : Hanh dong
  Chi tiet : Tai san bi bao cao hong/mat duoc chuyen sang tinh trang "can xu ly".
             Tai san trong trang thai "can xu ly" khong the cap phat.
             Gym Owner can xac nhan hoan thanh bao tri de chuyen trang thai ve "san sang".
  Ap dung  : UC-33

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
             Hoan thanh buoi PT           | +40
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
             - Dat buoi PT (neu Gym Owner cho phep)
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
             Rule 4: checkinPerWeek >= 4 && plan = 'Basic' -> "Tap nhieu, goi y Premium"
             Rule 5: buyNutrition >= 3x/week -> "Hay mua dinh duong, goi y combo"
             Rule 6: usesLocker && plan != 'Premium' -> "Hay dung locker, goi y Premium"
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

BR-42: QUY TAC BUOI TAP GAN VOI CHUONG TRINH (PROGRAM SESSION LINKING)
  Loai     : Rang buoc
  Chi tiet : Khi member co MEMBER_PROGRAMS.status = 'active':
             He thong tu dong goi y PROGRAM_DAY phu hop voi ngay hien tai.
             Logic: ngay = (NOW() - start_date).days % days_per_week + 1.
             Goi y nay chi la THAM KHAO — member co the:
             - Chap nhan nguyen (customized_from_prog = false).
             - Chinh sua: them/xoa/doi sets-reps (customized_from_prog = true).
             - Bo qua: bat dau buoi tap tu do (member_program_id = null).
             Moi thay doi duoc ghi vao customization_log (JSON).
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
             -> TAO: RECOMMENDATIONS loai 'technique_issue_upsell_pt', priority=LOW
             -> NOI DUNG: "Member dang kho voi [ten bai]. Goi y 1 buoi PT."
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
             Rule 9 (R9): Da duoc tao qua BR-43 (technique_issue_upsell_pt)
                          -> priority = LOW
                          -> suggested_action = "Member stuck bai [X]. Goi y 1 buoi PT."
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
KET THUC FILE 12
========================================================================
