# 09. BIEU DO LUONG DU LIEU
# (Data Flow Diagram - DFD)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 18/06/2026 (Cap nhat: Dinh huong lai Gym Management System — bo Vendor/Gear P2P)

========================================================================

Giai thich ky hieu DFD (theo chuan Yourdon & DeMarco):

  [ Ten ]       : External Entity (Thuc the ngoai)
  ( X.X Ten )   : Process (Tien trinh)
  = = D1: Ten = = : Data Store (Kho du lieu)
  ------->      : Data Flow (Luong du lieu)

Quy tac:
  - Moi process phai co it nhat 1 data flow vao va 1 data flow ra.
  - Data store khong tu gui du lieu cho data store khac (phai qua process).
  - External entity khong tuong tac truc tiep voi data store.
  - DFD Level 0 (Context Diagram): 1 process dai dien toan he thong.
  - DFD Level 1: tach process thanh nhieu process con.

========================================================================

## 1. DFD LEVEL 0 — CONTEXT DIAGRAM
========================================================================

Muc dich: The hien tong quan he thong voi tat ca external entity.

```
    [MEMBER]                                    [GYM OWNER / ADMIN]
       |  ^                                           |  ^
       |  |                                           |  |
 Thong tin|  Xac nhan,                   Thong tin  |  | Dashboard KPI,
 dang ky, |  thong bao,                  phong tap, |  | danh sach hoi vien,
 buoi tap,|  goi y, ket                 san pham,   |  | AI care queue,
 check-in,|  qua, lich su              cau hinh goi,|  | bao cao doanh thu,
 thanh    |                             tai san,    |  | thong ke
 toan     |                             locker      |  |
       |  |                                   |  |
       v  |                                   v  |
    +-----|--------------------------------------|-----+
    |     |                                     |     |
    |                                                 |
    |                    ( 0.0 )                      |
    |                FITFUEL+ GYM MANAGEMENT          |
    |                                                 |
    |     |                                     |     |
    +-----|--------------------------------------|-----+
          ^                                     ^
          |                                     |
    Ket qua thanh toan             Lenh quan ly,
    (callback/webhook)             duyet, xu ly
          |                                     |
    [PAYMENT GATEWAY]                       [TIMER / CRON JOB]
    (VNPay / MoMo sandbox)              (He thong dinh thoi tu dong)
```

External entities:
  1. MEMBER          : Hoi vien phong tap — nguoi dung chinh cua he thong.
  2. GYM OWNER/ADMIN : Chu/nhan su phong tap — quan tri va van hanh.
  3. PAYMENT GATEWAY : Cong thanh toan sandbox (VNPay/MoMo).
  4. TIMER           : Cron job tu dong chay dinh ky.

(Khong con Food Vendor hay Gear Seller — da bo khoi scope.)

========================================================================

## 2. DFD LEVEL 1 — CHI TIET CAC PROCESS CHINH
========================================================================

He thong FitFuel+ duoc chia thanh 11 process cap cao:

```
PROCESS:
  1.0  Quan ly Tai khoan
  2.0  Gym Tracking
  3.0  Membership Lifecycle
  4.0  Nutrition (Ban dinh duong noi bo)
  5.0  Gear Marketplace (Ban + Cho thue gear noi bo)
  6.0  Delivery (Giao hang & Quan ly don hang)
  7.0  PT / Lich tap
  8.0  Gamification & FitCoin
  9.0  AI Retention & Reporting
  10.0 Thanh toan
  11.0 Transformation Journey Engine

GHI CHU: Asset & Amenities (D6 cu) DA BO. Locker + Khan la do ca nhan, khong quan ly.

DATA STORES:
  D1 : USERS
  D2 : GYM_MEMBERSHIPS + MEMBERSHIP_PLANS + MEMBERSHIP_HISTORY
  D3 : WORKOUT_SESSIONS + EXERCISE_LOGS
  D4 : CHECK_INS
  D5 : NUTRITION_PRODUCTS + NUTRITION_ORDERS + NUTRITION_ORDER_ITEMS + INVENTORY
  D6 : GEAR_PRODUCTS + GEAR_RENTALS (Gear Marketplace)
  D7 : SHIPPING_ADDRESSES + FOOD_ORDERS(delivery fields) (Delivery)
  D8 : PT_TRAINERS + PT_BOOKINGS + PT_SESSIONS
  D9 : RECOMMENDATIONS + MEMBER_CARE_LOGS
  D10: INVOICES + FITCOIN_TRANSACTIONS
  D11: CHALLENGES + USER_CHALLENGES + BADGES
  D12: NOTIFICATIONS + SOCIAL_POSTS + FITNESS_PASSPORT
  D13: TRANSFORMATION_GOALS + WORKOUT_PROGRAMS + PROGRAM_DAYS +
       PROGRAM_EXERCISES + MEMBER_PROGRAMS + BODY_METRICS +
       PERSONAL_RECORDS + MILESTONE_ACHIEVEMENTS
```

------------------------------------------------------------------------
### 2.1. Process 1.0 — Quan ly Tai khoan
------------------------------------------------------------------------

```
  [MEMBER] -------SDT/mat khau------> ( 1.0 Quan ly Tai khoan )
     ^                                            |
     |                                            |
  Token, thong tin ca nhan              Ghi/doc du lieu user
     |                                            |
     +------------------------------------------  v
                                       == D1: USERS ==
                                       == D11: FITNESS_PASSPORT ==

  [GYM OWNER] ---Email/mat khau------> ( 1.0 )
```

Quy trinh:
  1.1 Dang ky Member (Online: SDT -> thanh toan -> tao TK tu dong)
  1.2 Dang ky Member (Offline to Online: Admin POS -> QR -> Webhook -> SMS)
  1.3 Dang nhap (tat ca role: email + password -> JWT token)
  1.4 Cap nhat thong tin ca nhan (ten, avatar, muc tieu, chieu cao, can nang)
  1.5 Xem Fitness Passport (tong hop huy hieu, streak, stats)

------------------------------------------------------------------------
### 2.2. Process 2.0 — Gym Tracking
------------------------------------------------------------------------

```
  [MEMBER] -----Tao session, log bai tap----> ( 2.0 Gym Tracking )
     ^                                                   |
     |                                                   |
  Lich su, PR, goi y nhom co             Ghi du lieu buoi tap
  AI nutrition suggestion                                |
     |                                                   v
     +-------------------------------------------  == D3: WORKOUT_SESSIONS / EXERCISE_LOGS ==
                                                   == D4: CHECK_INS ==
                                                   (Ket noi: D11 FITNESS_PASSPORT cap nhat)
```

Quy trinh:
  2.1 Tao workout session (chon ngay, nhom co)
  2.2 Log exercise trong session (bai tap, set/rep/weight)
  2.3 Tinh Personal Record (so sanh voi lich su cua bai tap do)
  2.4 Check-in bang QR (xac nhan goi tap -> ghi CHECK_INS -> goi y cap tien ich)
  2.5 Xem lich su, bieu do tien do, stats

------------------------------------------------------------------------
### 2.3. Process 3.0 — Membership Lifecycle
------------------------------------------------------------------------

```
  [MEMBER] -------Yeu cau dang ky/gia han-----> ( 3.0 Membership Lifecycle )
     ^                                                         |
     |                                                         |
  Trang thai goi, ngay het han, quyen loi         Ghi va doc membership
     |                                                         |
     +-------------------------------------------------------- v
                                                   == D2: GYM_MEMBERSHIPS / PLANS / HISTORY ==
                                                   == D9: INVOICES ==

  [GYM OWNER] ---Tao, duyet bao luu, nang cap---> ( 3.0 )
     ^                                                         |
     |                                                         |
  Danh sach sap het han, bao cao gia han           Chuyen sang AI queue
     |                                                         v
     +-------------------------------------------------------- == D8: RECOMMENDATIONS ==
```

Quy trinh:
  3.1 Dang ky goi tap moi (tao GYM_MEMBERSHIPS, MEMBERSHIP_HISTORY)
  3.2 Gia han goi tap (tao MEMBERSHIP_HISTORY entry moi, cap nhat end_date)
  3.3 Nang cap / chuyen goi (tinh phi chenh lech theo ngay)
  3.4 Tam ngung / bao luu (admin duyet, cong them ngay vao end_date)
  3.5 Bao cao membership (hoi vien moi/gia han/ty le/doanh thu)

------------------------------------------------------------------------
### 2.4. Process 4.0 — Nutrition (Ban dinh duong noi bo)
------------------------------------------------------------------------

```
  [GYM OWNER] --Quan ly san pham, ton kho----> ( 4.0 Nutrition )
     ^                                                   |
     |                                                   |
  Bao cao ton kho, san pham ban chay         Ghi du lieu san pham / don hang
     |                                                   v
  [MEMBER] ---Dat truoc / mua san pham------> == D5: NUTRITION_PRODUCTS / ORDERS / INVENTORY ==
     ^
     |
  Hoa don, trang thai don, goi y san pham
```

Quy trinh:
  4.1 Quan ly san pham (Gym Owner: them, sua, cap nhat ton kho)
  4.2 POS ban tai quay (nhan vien chon SP + member -> tao NUTRITION_ORDERS)
  4.3 Dat truoc san pham (member chon SP sau buoi tap -> trang thai pending)
  4.4 Goi y san pham (AI rule: nhom co -> uu tien macro -> loc SP con hang)
  4.5 Bao cao ton kho va doanh thu nutrition

------------------------------------------------------------------------
### 2.5. Process 5.0 — Asset & Amenities
------------------------------------------------------------------------

```
  [GYM OWNER] ---Quan ly tai san, locker----> ( 5.0 Asset & Amenities )
     ^                                                   |
     |                                                   |
  Bao cao tai san, locker occupancy         Ghi cap phat / thu hoi / phi phat
     |                                                   v
  [MEMBER] ---Check-in (nhan tien ich)------> == D6: ASSETS / LOCKERS / ASSIGNMENTS / PENALTIES ==
     ^                                                   |
     |                                                   v
  Xac nhan cap phat / phi phat             == D9: INVOICES (phi phat) ==
```

Quy trinh:
  5.1 Cap phat tien ich khi check-in (tu dong theo goi tap)
  5.2 Quan ly locker (buoi / thang, kiem tra het han)
  5.3 Ghi nhan tra tai san (da tra / hong / mat)
  5.4 Tinh phi phat -> ASSET_PENALTIES -> INVOICES
  5.5 Bao cao tai san (dang dung, that lac, bao tri, occupancy)

------------------------------------------------------------------------
### 2.6. Process 6.0 — PT / Lich tap
------------------------------------------------------------------------

```
  [MEMBER] ----Dat buoi PT, xem ket qua----> ( 6.0 PT / Lich tap )
     ^                                                  |
     |                                                  |
  Lich buoi PT, ket qua, nhan xet HLV       Ghi du lieu PT
     |                                                  v
  [GYM OWNER] ---Quan ly HLV, lich-----> == D7: PT_TRAINERS / BOOKINGS / SESSIONS ==
```

Quy trinh:
  6.1 Quan ly HLV (them, cap nhat lich, gia)
  6.2 Dat buoi PT (kiem tra lich trong, tao PT_BOOKINGS)
  6.3 Ghi ket qua buoi tap (HLV ghi PT_SESSIONS)
  6.4 Xem lich PT ca nhan (member) va tong lich (admin)

------------------------------------------------------------------------
### 2.7. Process 7.0 — Gamification & FitCoin
------------------------------------------------------------------------

```
  [MEMBER] ---Hanh dong (tap, check-in, gia han)---> ( 7.0 Gamification )
     ^                                                           |
     |                                                           |
  XP, level, badge, streak, FitCoin             Cap nhat XP, FitCoin, badge
  thong bao streak reset                                         v
     |                             == D10: CHALLENGES / USER_CHALLENGES / BADGES ==
     |                             == D9: FITCOIN_TRANSACTIONS ==
     |                             == D11: SOCIAL_POSTS / NOTIFICATIONS ==
     +----------------------------------------------------^
  [TIMER] ---Kiem tra streak hang ngay (00:05)---> ( 7.0 )
```

------------------------------------------------------------------------
### 2.8. Process 8.0 — AI Retention & Reporting
------------------------------------------------------------------------

```
  [TIMER] ---Quet dinh ky (daily)---> ( 8.0 AI Retention )
                                                 |
                                                 |
  Quet cac dieu kien:                 Tao/cap nhat RECOMMENDATIONS
  - Goi sap het han <= 7 ngay         Tao NOTIFICATIONS nhac nho
  - Chua check-in >= 14 ngay                     v
  - Goi da het han 1-3 ngay           == D8: RECOMMENDATIONS ==
                                                 |
  [GYM OWNER] ---Xem care queue-----> ( 8.0 )   v
       ^                                         |
       |                              Xu ly recommendation
  Danh sach can cham soc             Ghi MEMBER_CARE_LOGS
  Dashboard KPI                                  |
  Bao cao phan tich                              v
       |                              == D8: MEMBER_CARE_LOGS ==
       +-------------------------------------^        +-> D2 (thong ke membership)
                                                      +-> D5 (thong ke nutrition)
                                                      +-> D6 (thong ke asset)
                                                      +-> D7 (thong ke PT)
```

Quy trinh:
  8.1 Quet va tao recommendation (rule-based, hang ngay)
  8.2 Hien thi AI care queue (danh sach, uu tien, goi y hanh dong)
  8.3 Ghi nhan xu ly cua nhan vien (MEMBER_CARE_LOGS)
  8.4 Dashboard KPI tong hop
  8.5 Bao cao phan tich (doanh thu, gia han, ton kho, locker)

------------------------------------------------------------------------
### 2.9. Process 9.0 — Thanh toan
------------------------------------------------------------------------

```
  [MEMBER] ---Thanh toan (membership/nutrition/PT)---> ( 9.0 Thanh toan )
                                                               |
                                                               | Gui yeu cau thanh toan
                                                               v
  [PAYMENT GATEWAY] <---- Yeu cau thanh toan ---------- ( 9.0 )
        |                                                      ^
        |                                                      |
  Callback (thanh cong/that bai)                Xu ly callback
        |                                              |
        +-----------> ( 9.0 Thanh toan ) -------> Ghi INVOICES
                                          -------> Cap nhat FITCOIN
                                          -------> Cap nhat GYM_MEMBERSHIPS
```

Quy trinh:
  9.1 Tao hoa don (INVOICES) cho giao dich
  9.2 Gui yeu cau den Payment Gateway (VNPay/MoMo sandbox)
  9.3 Nhan callback, xac thuc HMAC chu ky
  9.4 Cap nhat trang thai hoa don (paid/failed)
  9.5 Cong FitCoin neu co khuyen mai / bonus

------------------------------------------------------------------------
### 2.10. Process 10.0 — Transformation Journey Engine
------------------------------------------------------------------------

```
  [MEMBER] ---Tao muc tieu, chon CT----> ( 10.0 Transformation Journey )
     ^                                                    |
     |                                                    |
  Goi y CT, buoi tap hang ngay,          Ghi va doc du lieu hanh trinh
  overload suggestion, milestone,                         |
  progress stats, share card                              v
     |                              == D12: TRANSFORMATION_GOALS / PROGRAMS / LOGS ==
     |
     |     [Sau hoan thanh buoi tap]
     |          |
     +----------v---> ( 4.0 Nutrition ) -- D5 (AI goi y dinh duong post-workout)
     |          |
     |          +---> ( 7.0 Gamification ) -- D9 (award FitCoin/XP milestone)
     |          |
     |          +---> ( 8.0 AI Retention ) -- D8 (R7/R8/R9 care queue)
     |
  [GYM OWNER] ---Tao / quan ly CT----> ( 10.0 )
     ^                                        |
     |                                        |
  Analytics: Transformation Rate,   Cau hinh thu vien chuong trinh
  Share Cards Generated                       v
     |                              == D12: WORKOUT_PROGRAMS / DAYS / EXERCISES ==
```

Quy trinh:
  10.1 Goal Onboarding (5 buoc -> tao TRANSFORMATION_GOALS)
  10.2 Program Matching (loc + goi y -> tao MEMBER_PROGRAMS)
  10.3 Daily Workout Suggestion (PROGRAM_DAY phu hop hom nay)
  10.4 Editable Session Execution (member chinh sua -> tap -> log -> done)
  10.5 Progressive Overload AI (so sanh 2 buoi lien tiep -> goi y tang ta)
  10.6 Post-Workout Nutrition Trigger (4 tin hieu -> popup 3 SP)
  10.7 Progress Dashboard (3 tab: Hanh Trinh / Suc Manh / Co The)
  10.8 Milestone Engine (22 dieu kien -> award -> celebrate)
  10.9 Share Card Generation (Celebration MAX -> generate anh -> viral loop)
  10.10 Program Library Management (Gym Owner: CRUD chuong trinh)

Ket noi voi cac process khac:
  -> Process 4.0: Post-workout nutrition trigger (BR-44)
  -> Process 7.0: FitCoin + XP tu milestone (BR-46)
  -> Process 8.0: R7 / R8 / R9 recommendation triggers (BR-45)
  -> Process 2.0: WORKOUT_SESSIONS.member_program_id ket noi lap

========================================================================
KET THUC FILE 09
========================================================================
