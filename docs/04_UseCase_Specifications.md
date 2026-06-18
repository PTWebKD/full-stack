# 04. MO TA CHI TIET USE CASE
# (Use Case Specifications)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Phien ban: 3.0 (Dinh huong lai Gym Management System — bo Vendor/Gear P2P)

========================================================================

## GIAI THICH CAU TRUC DAC TA USE CASE:
- **Use Case ID** : Ma dinh danh duy nhat (theo danh sach 62 UC trong file 03_Actor_UseCase.md).
- **Ten Use Case**: Ten ngan gon, bat dau bang dong tu.
- **Actor**       : Tac nhan chinh thuc hien use case.
- **Muc tieu**    : Ket qua mong muon dat duoc.
- **Dieu kien tien**: Dieu kien can co truoc khi bat dau.
- **Dieu kien sau**: Trang thai he thong sau khi hoan thanh.
- **Luong co ban**: Happy path.
- **Luong thay the**: Nhanh re hoac dieu kien dac biet.
- **Luong ngoai le**: Xu ly loi.
- **Quy tac nghiep vu**: Lien ket den ma BR ap dung.

Luu y: File nay mo ta chi tiet cho cac UC quan trong nhat. Cac UC
con lai duoc mo ta o muc do tong quat trong 03_Actor_UseCase.md.

========================================================================

## UC-01 & UC-02: DANG KY VA DANG NHAP
========================================================================

  Use Case ID     : 01 & 02
  Ten             : Dang ky tai khoan moi & Dang nhap he thong
  Actor           : Member, Gym Owner
  Muc tieu        : Nguoi dung tao tai khoan hoac dang nhap de su dung tinh nang ca nhan hoa.
  Dieu kien tien  : Nguoi dung chua dang nhap.
  Dieu kien sau   : Token JWT duoc cap, nguoi dung chuyen huong ve trang chu tuong ung voi role.

  LUU Y QUAN TRONG — LUONG DANG KY THEO ROLE:
    - MEMBER    : KHONG dang ky qua /auth/register thong thuong.
                  Tai khoan Member duoc tao tu dong trong luong mua Membership:
                  1) Online: Khach nhap SDT, chon goi, thanh toan -> TK tu dong tao.
                  2) Offline to Online: Admin POS tao QR -> Webhook -> SMS.
    - GYM OWNER : Dang ky qua /auth/register (email + mat khau).

  LUONG CO BAN (Dang nhap — ap dung moi role):
    B1. Nguoi dung truy cap /auth/login.
    B2. He thong hien thi form: Email / Mat khau.
    B3. Nguoi dung nhap va nhan [Dang nhap].
    B4. He thong kiem tra: mat khau khop bcrypt hash, tai khoan is_active = true.
    B5. He thong sinh JWT (7 ngay) chua user_id va role.
    B6. Luu token tai client (localStorage / HttpOnly Cookie).
    B7. Chuyen huong:
        - role = 'member'    -> /dashboard
        - role = 'gym_owner' -> /gym-owner/dashboard

  LUONG THAY THE A (Member dang ky Online 100%):
    A1. Khach truy cap /membership/register.
    A2. He thong hien thi form: SDT va chon goi tap.
    A3. Khach nhap SDT hop le va chon goi.
    A4. He thong redirect sang cong thanh toan (VNPay/MoMo).
    A5. Khach thanh toan thanh cong.
    A6. He thong tu dong tao USERS (role='member'), GYM_MEMBERSHIPS, INVOICES.
    A7. Gui SMS xac nhan + mat khau tam thoi.

  LUONG THAY THE B (Member dang ky Offline to Online — qua POS):
    B-1. Gym Owner chon goi tap va nhap SDT khach tren man hinh POS.
    B-2. He thong tao QR thanh toan co nhung san goi + ma don hang.
    B-3. Khach quet QR va chuyen khoan.
    B-4. Webhook nhan callback, tao USERS + GYM_MEMBERSHIPS + INVOICES tu dong.
    B-5. He thong bap SMS: "Dang ky thanh cong. Dang nhap bang SDT, mat khau: 123456".

  LUONG NGOAI LE:
    E1. Email hoac mat khau sai: "Thong tin dang nhap khong hop le."
    E2. Tai khoan bi khoa (is_active=false): "Tai khoan bi tam khoa. Lien he ho tro."
    E3. Thanh toan that bai khi dang ky: Khong tao tai khoan, hien thi loi.

  QUY TAC NGHIEP VU:
    BR-01 (Do manh mat khau), BR-02 (OTP SMS), BR-40 (Dang ky Member qua Membership)

========================================================================

## UC-09: CHECK-IN PHONG TAP
========================================================================

  Use Case ID     : 09
  Ten             : Check-in phong tap bang QR
  Actor           : Hoi vien (Member)
  Muc tieu        : Xac nhan vao phong tap, kiem tra goi tap con hieu luc, ghi nhan check-in.
  Dieu kien tien  : Member da dang ky goi tap. Member den phong tap.
  Dieu kien sau   : Mot ban ghi CHECK_INS duoc tao. Streak va XP duoc cap nhat.

  LUONG CO BAN:
    B1. Member qua quay le tan, nhan vien quet QR code cua Member (hoac nhap SDT).
    B2. He thong tim USERS theo QR/SDT.
    B3. He thong kiem tra GYM_MEMBERSHIPS: status='active' AND end_date >= NOW().
    B4. Goi tap hop le: He thong ghi ban ghi CHECK_INS moi.
    B5. He thong cap nhat streak, cong XP check-in (+10 XP theo BR-21).
    B6. Hien thi man hinh xac nhan: "Check-in thanh cong! Goi: [plan_name], con [X] ngay."

  LUONG THAY THE:
    A. Goi tap het han:
       -> He thong hien thi "Goi tap da het han ngay [end_date]."
       -> Hien thi nut [Gia han ngay] -> redirect /membership.
    B. Chua check-in hom nay nhung da check-in qua:
       -> Cho phep check-in binh thuong (moi ngay toi da 1 lan - BR-09).
    C. Da check-in hom nay roi:
       -> He thong thong bao "Ban da check-in hom nay roi."

  LUONG NGOAI LE:
    E1. Khong tim thay Member: "Khong tim thay tai khoan."
    E2. Goi tap bi tam ngung (SUSPENDED): "Goi tap dang bao luu den [date]."

  QUY TAC NGHIEP VU:
    BR-09 (check-in moi ngay toi da 1 lan), BR-21 (XP earn), BR-23 (streak)

========================================================================

## UC-13: DANG KY GOI TAP MOI
========================================================================

  Use Case ID     : 13
  Ten             : Dang ky goi tap moi
  Actor           : Hoi vien (Member)
  Muc tieu        : Member chon va mua goi tap de su dung phong tap va cac dich vu kem theo.
  Dieu kien tien  : Member chua co goi tap active hoac goi tap hien tai da het han.
  Dieu kien sau   : GYM_MEMBERSHIPS moi duoc tao voi status='active'. MEMBERSHIP_HISTORY ghi nhan. INVOICES tao voi status='paid'.

  LUONG CO BAN:
    B1. Member truy cap /membership.
    B2. He thong hien thi 2 goi tap:
        - Goi Thang: 1 thang, 399,000 VND.
        - Goi Nam: 12 thang, 3,990,000 VND (tiet kiem tuong duong 2 thang).
    B3. Member chon Goi Thang hoac Goi Nam.
    B4. He thong hien thi tom tat: ten goi, gia, ngay bat dau, ngay het han, FitCoin bonus.
    B5. Member chon phuong thuc thanh toan (VNPay / MoMo).
    B6. He thong tao INVOICES (status='pending') va redirect sang cong thanh toan.
    B7. Thanh toan thanh cong, he thong nhan callback.
    B8. He thong kiem tra idempotency (BR-38).
    B9. He thong tao GYM_MEMBERSHIPS (status='active', end_date tinh tu hom nay + thoi han).
    B10. He thong ghi MEMBERSHIP_HISTORY (change_type='register').
    B11. Cap nhat INVOICES.status = 'paid'.
    B12. Gui thong bao xac nhan (NOTIFICATIONS): "Dang ky thanh cong! Goi: [name], het han: [date]."
    B13. Cong FitCoin bonus theo goi (BR-28).

  LUONG THAY THE:
    A. Member da co goi tap active -> redirect sang trang Gia han.

  LUONG NGOAI LE:
    E1. Thanh toan that bai: Khong tao GYM_MEMBERSHIPS. Hien thi loi, cho thu lai.
    E2. Callback trung lap (double-click): Kiem tra idempotency, bo qua lan 2.

  QUY TAC NGHIEP VU:
    BR-05 (cac loai goi tap), BR-28 (FitCoin earn khi gia han), BR-38 (idempotency)

========================================================================

## UC-14: GIA HAN GOI TAP
========================================================================

  Use Case ID     : 14
  Ten             : Gia han goi tap
  Actor           : Hoi vien (Member)
  Muc tieu        : Member keo dai thoi han su dung goi tap hien tai.
  Dieu kien tien  : Member co goi tap (active hoac expiring hoac expired <= 30 ngay).
  Dieu kien sau   : GYM_MEMBERSHIPS.end_date duoc cap nhat. MEMBERSHIP_HISTORY ghi renewal.

  LUONG CO BAN:
    B1. Member truy cap /membership, nhan [Gia han].
    B2. He thong hien thi goi hien tai + ngay het han + option gia han (1/3/12 thang).
    B3. Member chon thoi han gia han va xem ngay het han moi.
    B4. Member chon phuong thuc thanh toan, xac nhan.
    B5. Luong thanh toan giong UC-13 (B6 den B8).
    B6. He thong cap nhat GYM_MEMBERSHIPS.end_date (cong them thoi han moi).
    B7. Ghi MEMBERSHIP_HISTORY (change_type='renewal').
    B8. Tu dong resolve RECOMMENDATIONS.type='renew_reminder' cua Member nay.
    B9. Cong +50 FitCoin bonus gia han (BR-28).
    B10. Gui thong bao "Gia han thanh cong! Het han moi: [date]."

  QUY TAC NGHIEP VU:
    BR-06 (gia han ghi HISTORY), BR-28 (+50 FC), BR-38 (idempotency)

========================================================================

## UC-15: NANG CAP GOI TAP
========================================================================

  Use Case ID     : 15
  Ten             : Chuyen goi (Thang -> Nam)
  Actor           : Hoi vien (Member)
  Muc tieu        : Chuyen tu Goi Thang sang Goi Nam, chi tra phan chenh lech ngay con lai.
  Dieu kien tien  : Member dang co Goi Thang active.
  Dieu kien sau   : GYM_MEMBERSHIPS.plan_id duoc cap nhat sang Goi Nam. MEMBERSHIP_HISTORY ghi upgrade.

  LUONG CO BAN:
    B1. Member truy cap /membership, nhan [Chuyen sang Goi Nam].
    B2. He thong tinh va hien thi phi cong them:
        - Phi = (gia Goi Nam - gia Goi Thang) / 30 * so ngay con lai cua Goi Thang.
    B3. Member xem phi va xac nhan.
    B4. Thanh toan phi cong them (co the dung FitCoin toi da 50% - BR-30).
    B5. He thong cap nhat GYM_MEMBERSHIPS.plan_id sang Goi Nam.
    B6. Ghi MEMBERSHIP_HISTORY (change_type='upgrade').
    B7. Ngay het han khong thay doi (giu nguyen end_date cu).

  LUONG NGOAI LE:
    E1. Member dang dung Goi Nam roi: "Ban da dang dung Goi Nam."
    E2. Con < 3 ngay trong Goi Thang: Hien thi canh bao, goi y gia han thay vi chuyen goi.

  QUY TAC NGHIEP VU:
    BR-07 (cong thuc phi chenh lech ngay con lai), BR-30 (FitCoin toi da 50%)

========================================================================

## UC-16: TAM NGUNG / BAO LUU GOI TAP
========================================================================

  Use Case ID     : 16
  Ten             : Tam ngung / Bao luu goi tap
  Actor           : Hoi vien (Member) dang ky, Gym Owner duyet
  Muc tieu        : Member tam ngung goi tap vi ly do ca nhan, thoi gian bao luu khong tinh vao han dung.
  Dieu kien tien  : Member co goi tap active. Chua bao luu qua 2 lan trong nam.
  Dieu kien sau   : GYM_MEMBERSHIPS.status = 'suspended'. Ngay ket thuc bao luu, he thong cong them ngay vao end_date.

  LUONG CO BAN:
    B1. Member gui yeu cau bao luu qua /membership hoac trc tiep tai quay.
    B2. Nhan vien kiem tra dieu kien: chua bao luu qua 2 lan trong nam (BR-08).
    B3. Nhan vien nhap so ngay bao luu (toi da 30 ngay/lan - BR-08).
    B4. Gym Owner xac nhan, he thong cap nhat GYM_MEMBERSHIPS.status = 'suspended'.
    B5. Ghi MEMBERSHIP_HISTORY (change_type='suspension').
    B6. Gui thong bao Member: "Goi tap da bao luu tu [start] den [end]."
    B7. Khi het thoi gian bao luu, he thong tu dong doi status = 'active', cong them so ngay bao luu vao end_date.

  LUONG NGOAI LE:
    E1. Da bao luu 2 lan trong nam: "Da dat gioi han bao luu trong nam (2 lan)."

  QUY TAC NGHIEP VU:
    BR-08 (gioi han bao luu 2 lan/nam, toi da 30 ngay/lan)

========================================================================

## UC-21: QUAN LY SAN PHAM DINH DUONG (GYM OWNER)
========================================================================

  Use Case ID     : 21
  Ten             : Quan ly san pham dinh duong noi bo
  Actor           : Gym Owner
  Muc tieu        : Them moi, chinh sua, cap nhat ton kho cho cac san pham dinh duong cua phong tap.
  Dieu kien tien  : Gym Owner da dang nhap.
  Dieu kien sau   : San pham duoc luu trong NUTRITION_PRODUCTS kem ton kho trong INVENTORY.

  LUONG CO BAN (Them moi san pham):
    B1. Gym Owner truy cap /gym-owner/nutrition/products.
    B2. Nhan nut [Them san pham].
    B3. Nhap thong tin: ten, danh muc, gia, calo, protein, carb, fat, anh.
    B4. Dat nguong canh bao ton kho (low_stock_threshold).
    B5. Nhap so luong ton kho ban dau.
    B6. Luu -> He thong tao NUTRITION_PRODUCTS + INVENTORY.

  LUONG THAY THE (Cap nhat ton kho):
    A1. Chon san pham hien co, nhan [Nhap hang].
    A2. Nhap so luong nhap them.
    A3. He thong cap nhat INVENTORY.qty_in_stock.
    A4. Cap nhat INVENTORY.last_restocked = NOW().

  LUONG NGOAI LE:
    E1. Ton kho nhap am: "So luong khong hop le."

  QUY TAC NGHIEP VU:
    BR-12 (ban noi bo), BR-13 (nguong canh bao ton kho)

========================================================================

## UC-22: BAN HANG DINH DUONG TAN QUY (POS)
========================================================================

  Use Case ID     : 22
  Ten             : Ban hang dinh duong tai quay (POS)
  Actor           : Gym Owner / Nhan vien
  Muc tieu        : Xu ly giao dich ban san pham dinh duong cho Member tai quay tiep tan.
  Dieu kien tien  : Nhan vien da dang nhap. Member hien dien tai phong tap.
  Dieu kien sau   : NUTRITION_ORDERS duoc tao voi status='completed'. INVENTORY giam so luong. INVOICES tao.

  LUONG CO BAN:
    B1. Nhan vien truy cap /gym-owner/nutrition/pos.
    B2. He thong hien thi danh sach san pham con hang (qty > 0).
    B3. Tim kiem Member theo SDT hoac ten.
    B4. Chon san pham, nhap so luong, he thong tinh tong tien.
    B5. [Tuy chon] Nhap so FitCoin muon dung (toi da 50% tong tien - BR-30).
    B6. Xac nhan don hang.
    B7. Chon phuong thuc thanh toan (tien mat / VNPay / FitCoin).
    B8. He thong ghi NUTRITION_ORDERS (order_type='pos', status='completed').
    B9. He thong ghi NUTRITION_ORDER_ITEMS cho tung san pham.
    B10. He thong giam INVENTORY.qty_in_stock tuong ung.
    B11. He thong tao INVOICES (service_type='nutrition').
    B12. In/hien thi bien lai xac nhan.

  LUONG THAY THE:
    A. San pham het hang trong khi dang tao don:
       -> He thong hien thi canh bao, ngan khong cho them vao don.
    B. Ton kho chuong len <= low_stock_threshold sau giao dich:
       -> He thong tu dong tao NOTIFICATIONS canh bao ton kho thap cho Gym Owner.

  LUONG NGOAI LE:
    E1. Member khong ton tai: "Khong tim thay hoi vien."

  QUY TAC NGHIEP VU:
    BR-12 (chi ban noi bo), BR-13 (ton kho + canh bao), BR-30 (gioi han FitCoin 50%)

========================================================================

## UC-23: DAT TRUOC SAN PHAM DINH DUONG (MEMBER)
========================================================================

  Use Case ID     : 23
  Ten             : Dat truoc san pham dinh duong (pre-order)
  Actor           : Hoi vien (Member)
  Muc tieu        : Member dat truoc san pham sau buoi tap, nhan hang tai quay.
  Dieu kien tien  : Member da dang nhap. San pham con hang.
  Dieu kien sau   : NUTRITION_ORDERS (order_type='preorder', status='pending') duoc tao. INVENTORY.qty_reserved tang.

  LUONG CO BAN:
    B1. Sau khi ket thuc buoi tap, he thong hien thi goi y san pham dinh duong (UC-24 AI suggestion).
    B2. Member chon san pham, nhap so luong.
    B3. He thong kiem tra ton kho va tang qty_reserved.
    B4. Member xac nhan va thanh toan truoc (VNPay/FitCoin).
    B5. He thong tao NUTRITION_ORDERS (status='pending').
    B6. He thong tao INVOICES.
    B7. Gui NOTIFICATIONS: "Dat truoc thanh cong! Den quay nhan hang sau buoi tap."
    B8. Nhan vien thay thong bao, chuan bi hang.
    B9. Khi giao hang: nhan vien xac nhan 'completed', he thong tru qty_in_stock.

  QUY TAC NGHIEP VU:
    BR-12 (chi ban noi bo), BR-13 (ton kho)

========================================================================

## UC-24: AI GOI Y SAN PHAM DINH DUONG SAU TAP
========================================================================

  Use Case ID     : 24
  Ten             : AI goi y san pham dinh duong sau buoi tap
  Actor           : Hoi vien (Member)
  Muc tieu        : Goi y san pham dinh duong phu hop voi nhom co vua tap, uu tien macro can thiet.
  Dieu kien tien  : Member vua hoan thanh Workout Session (status='done') co exercise logs.
  Dieu kien sau   : He thong hien thi toi da 3 san pham goi y. Member co the dat truoc.

  LUONG CO BAN:
    B1. Member nhan [Hoan thanh buoi tap].
    B2. He thong xac dinh nhom co chiem volume lon nhat trong buoi tap hom nay.
    B3. He thong anh xa nhom co -> macro uu tien:
        - Chest/Back/Legs -> Protein cao, Carb trung binh, Fat thap
        - Arms/Shoulders  -> Protein trung binh, Carb cao
        - Core            -> Carb thap, Fat thap
    B4. He thong query NUTRITION_PRODUCTS loc theo: is_available=true, qty>0, sap xep macro.
    B5. He thong lay 3 san pham phu hop nhat.
    B6. Hien thi Carousel: ten SP, calo, protein, carb, fat, gia.
    B7. Member co the nhan [Dat truoc] -> vao UC-23.

  LUONG THAY THE:
    A. Khong du 3 san pham dat dieu kien uu tien:
       -> He thong mo rong filter, lay san pham calo gan nhat.

  QUY TAC NGHIEP VU:
    BR-14 (logic goi y dinh duong)

========================================================================

## UC-28: QUAN LY TAI SAN VA TIEN ICH (GYM OWNER) — DA BO
========================================================================

  *(Module Asset & Amenities da bi loai bo khoi he thong FitFuel+.
  Locker va khan la do ca nhan cua member, khong quan ly trong he thong.
  Cho thue thiet bi duoc thay the boi UC-66 — Gear Marketplace.
  UC-28 va UC-29 da xoa. Cac BR-16 den BR-20 da xoa.)*

========================================================================

## UC-29: QUAN LY LOCKER (GYM OWNER) — DA BO
========================================================================

  *(Xem ghi chu tai UC-28. UC nay da xoa cung voi toan bo Module Asset & Amenities.)*

========================================================================

## UC-35: QUAN LY HUAN LUYEN VIEN (GYM OWNER)
========================================================================

  Use Case ID     : 35
  Ten             : Quan ly danh sach HLV (PT Trainer)
  Actor           : Gym Owner
  Muc tieu        : Them moi, chinh sua lich va thong tin cua HLV trong phong tap.
  Dieu kien tien  : Gym Owner da dang nhap.
  Dieu kien sau   : PT_TRAINERS duoc cap nhat.

  LUONG CO BAN (Them HLV moi):
    B1. Truy cap /gym-owner/pt/trainers.
    B2. Nhan [Them HLV].
    B3. Nhap thong tin: ten, chuyen mon (speciality[]), gia/buoi, lich trong tuan, tieu su.
    B4. Luu -> He thong tao PT_TRAINERS.

  QUY TAC NGHIEP VU:
    khong co BR dac biet cho HLV trong scope hien tai

========================================================================

## UC-36: DAT LICH PT (MEMBER)
========================================================================

  Use Case ID     : 36
  Ten             : Dat lich tap voi HLV (PT Booking)
  Actor           : Hoi vien (Member)
  Muc tieu        : Chon HLV va khung gio trong, dat lich tap ca nhan.
  Dieu kien tien  : Member co goi tap active voi includes_pt = true (PT Plus).
  Dieu kien sau   : PT_BOOKINGS duoc tao voi status='pending'. INVOICES tao neu co phi.

  LUONG CO BAN:
    B1. Member truy cap /pt/trainers.
    B2. Chon HLV, xem lich trong.
    B3. Chon khung gio trong.
    B4. Xac nhan dat lich.
    B5. He thong kiem tra goi PT Plus con buoi trong thang.
    B6. He thong tao PT_BOOKINGS (status='pending').
    B7. Gui NOTIFICATIONS cho ca Member va HLV.

  LUONG THAY THE:
    A. Goi khong bao gom PT: He thong tinh phi, xu ly thanh toan truoc khi tao booking.

  QUY TAC NGHIEP VU:
    BR-05 (goi PT Plus bao gom PT sessions/thang)

========================================================================

## UC-47: XEM AI CARE QUEUE (GYM OWNER)
========================================================================

  Use Case ID     : 47
  Ten             : Xem va xu ly AI Care Queue
  Actor           : Gym Owner / Nhan vien
  Muc tieu        : Xem danh sach Member can cham soc va xu ly tung truong hop.
  Dieu kien tien  : Co RECOMMENDATIONS.status='pending'. Gym Owner da dang nhap.
  Dieu kien sau   : MEMBER_CARE_LOGS duoc ghi. RECOMMENDATIONS.status cap nhat.

  LUONG CO BAN:
    B1. Gym Owner truy cap /gym-owner/care-queue.
    B2. He thong hien thi danh sach tu RECOMMENDATIONS JOIN USERS:
        - Loc: status='pending'
        - Sap xep: priority DESC (HIGH -> MEDIUM -> LOW)
        - Hien thi: ten Member, SDT, ly do, goi y hanh dong.
    B3. Gym Owner chon 1 dong, xem chi tiet 360-profile Member.
    B4. Gym Owner thuc hien: goi dien, gui tin, moi den truc tiep...
    B5. Gym Owner nhan [Ghi nhan ket qua].
    B6. Chon ket qua: renewed / declined / unreachable / other.
    B7. Nhap ghi chu chi tiet.
    B8. Xac nhan -> He thong ghi MEMBER_CARE_LOGS.
    B9. He thong cap nhat RECOMMENDATIONS.status = 'handled', resolved_at = NOW().
    B10. Member bi an khoi hang doi.

  LUONG THAY THE:
    A. Bo qua (Dismiss): Chon [Khong can xu ly] -> RECOMMENDATIONS.status = 'dismissed'.

  QUY TAC NGHIEP VU:
    BR-35 (6 rules tao recommendation), BR-36 (ghi nhan xu ly)

========================================================================

## UC-48: TAO AI RECOMMENDATION TU DONG (TIMER)
========================================================================

  Use Case ID     : 48
  Ten             : Tao de xuat AI cham soc hoi vien (Timer job)
  Actor           : TIMER (Cron Job — he thong)
  Muc tieu        : Tu dong quet dieu kien va tao RECOMMENDATIONS moi hang ngay.
  Dieu kien tien  : Timer chay hang ngay luc 06:00.
  Dieu kien sau   : RECOMMENDATIONS moi duoc tao cho Member thoa dieu kien. NOTIFICATIONS gui den Member sap het han.

  LUONG CO BAN:
    B1. Cron job chay luc 06:00 hang ngay.
    B2. Query tat ca GYM_MEMBERSHIPS co status IN ('active', 'expiring').
    B3. Voi moi Member, kiem tra 6 dieu kien (BR-35):
        - R1: Goi het han trong 7 ngay -> renew_reminder, priority=HIGH
        - R2: Goi het han va chua gia han 1-3 ngay -> renew_reminder, priority=HIGH
        - R3: Chua check-in >= 14 ngay -> inactive_alert, priority=MEDIUM
        - R4: Tap deu >= 4 buoi/tuan lien tuc 3 tuan, dang goi Basic -> upsell_plan, priority=LOW
        - R5: Chua dat lich PT khi co goi PT -> upsell_pt, priority=LOW
        - R6: Chua mua dinh duong >= 14 ngay -> upsell_nutrition, priority=LOW
    B4. Voi moi dieu kien dung:
        - Kiem tra RECOMMENDATIONS: chua co pending cung type trong 7 ngay.
        - Neu chua co: INSERT RECOMMENDATIONS moi.
    B5. Doi voi Member co goi het han trong <= 3 ngay:
        - INSERT NOTIFICATIONS nhac nho den Member.

  QUY TAC NGHIEP VU:
    BR-35 (6 dieu kien tao rec), BR-36 (ghi nhan xu ly), khong tao trung lap trong 7 ngay

========================================================================

## UC-50: DASHBOARD KPI (GYM OWNER)
========================================================================

  Use Case ID     : 50
  Ten             : Xem Dashboard KPI va Bao cao kinh doanh
  Actor           : Gym Owner
  Muc tieu        : Hien thi tong hop cac chi so van hanh phong tap theo thoi gian thuc.
  Dieu kien tien  : Gym Owner da dang nhap.
  Dieu kien sau   : Khong thay doi du lieu, chi doc.

  LUONG CO BAN:
    B1. Gym Owner truy cap /gym-owner/reports.
    B2. He thong tinh toan va hien thi cac KPI:

    KPI 1: Hoi vien sap het han trong 7 ngay
    ---
    SELECT u.display_name, u.phone, gm.end_date,
           DATEDIFF(gm.end_date, NOW()) AS days_left
    FROM GYM_MEMBERSHIPS gm
    JOIN USERS u ON u.user_id = gm.user_id
    WHERE gm.status = 'active'
      AND gm.end_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 7 DAY)
    ORDER BY days_left ASC;

    KPI 2: Doanh thu theo dich vu (thang nay)
    ---
    SELECT service_type,
           SUM(total_amount) AS revenue,
           COUNT(*) AS transactions
    FROM INVOICES
    WHERE status = 'paid'
      AND YEAR(paid_at) = YEAR(NOW())
      AND MONTH(paid_at) = MONTH(NOW())
    GROUP BY service_type;

    KPI 3: San pham dinh duong ban chay nhat
    ---
    SELECT np.name, SUM(noi.qty) AS total_sold
    FROM NUTRITION_ORDER_ITEMS noi
    JOIN NUTRITION_PRODUCTS np ON np.product_id = noi.product_id
    JOIN NUTRITION_ORDERS no2 ON no2.order_id = noi.order_id
    WHERE no2.status = 'completed'
      AND MONTH(no2.created_at) = MONTH(NOW())
    GROUP BY np.product_id
    ORDER BY total_sold DESC
    LIMIT 5;

    KPI 4: Ty le chuyen doi recommendation
    ---
    SELECT rec_type,
           COUNT(*) AS total,
           SUM(CASE WHEN status='handled' AND outcome='renewed' THEN 1 ELSE 0 END) AS converted
    FROM RECOMMENDATIONS r
    LEFT JOIN MEMBER_CARE_LOGS mcl ON mcl.rec_id = r.rec_id
    GROUP BY rec_type;

    B3. Gym Owner co the chon khoang thoi gian (tuan / thang / quy / nam).
    B4. Gym Owner co the xuat bao cao ra CSV.

  QUY TAC NGHIEP VU:
    khong co BR rieng, cac SQL duoc chay read-only

========================================================================
KET THUC FILE 04
========================================================================
