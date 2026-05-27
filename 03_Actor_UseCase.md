# 03. XAC DINH TAC NHAN VA BIEU DO USE CASE
# (Actor Identification & Use Case Diagram)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 11/05/2026

========================================================================

## 1. DANH SACH TAC NHAN (ACTOR)
========================================================================

Giai thich:
  - Actor la bat ky ai hoac bat ky he thong nao tuong tac voi he thong.
  - Actor chinh (Primary): Truc tiep su dung he thong.
  - Actor phu (Secondary): He thong ben ngoai hoac tu dong.

------------------------------------------------------------------------

Actor 1: GUEST
  Loai        : Chinh
  Mo ta       : Khach truy cap web chua dang ky tai khoan.
  Dac diem    : Khong co tai khoan, khong co Fitness Passport.
  Tuong tac   : Xem food/gear, them vao gio hang, checkout bang OTP.
  Khong duoc  : Gym tracking, gamification, social, dang ban gear.

Actor 2: MEMBER
  Loai        : Chinh
  Mo ta       : Nguoi dung da dang ky tai khoan tren he thong.
  Dac diem    : Co tai khoan, co Fitness Passport, co FitCoin.
  Tuong tac   : Tat ca chuc nang cua Guest va them:
                Gym tracking, food order voi AI, gear hub, gamification,
                social feed, FitCoin, Fitness Passport.

Actor 3: FOOD VENDOR
  Loai        : Chinh
  Mo ta       : Chu quan an healthy dang ky ban tren nen tang.
  Dac diem    : Co tai khoan vendor, co portal rieng.
  Tuong tac   : Dang san pham, quan ly don hang, xem analytics.
  Khong duoc  : Gym tracking, mua gear (phai dung tai khoan member).

Actor 4: GEAR SELLER / RENTER
  Loai        : Chinh
  Mo ta       : Nguoi dang ban hoac cho thue thiet bi gym tren he thong.
  Dac diem    : La Gym Owner (duoc Ban/Cho thue) hoac Member (chi duoc Cho thue).
  Tuong tac   : Dang ban/thue gear, quan ly listing, nhan FitCoin.
  Ghi chu     : Khong phai actor rieng biet, ma la vai tro phu khi Gym Owner hoac
                Member thuc hien chuc nang dang gear tren Gear Hub.

Actor 5: GYM OWNER
  Loai        : Chinh
  Mo ta       : Chu phong tap gym dang ky tai khoan Business, dong thoi la quan tri vien he thong FitFuel+.
  Dac diem    : Co dashboard quan ly rieng, co quyen cao nhat, truy cap moi phan.
  Tuong tac   : Quan ly member, gui thong bao, xem analytics,
                thiet lap membership plans. Duyet vendor, xu ly tranh chap,
                quan ly FitCoin, xem bao cao tong the.

Actor 6: TIMER (He thong dinh thoi)
  Loai        : Phu
  Mo ta       : Tac nhan tu dong kich hoat cac su kien dinh ky.
  Tuong tac   : Reset streak (neu 2 ngay khong hoat dong),
                Gia han subscription tu dong,
                Ket thuc challenge khi het deadline,
                Gui nhac nho tra gear.

Actor 8: PAYMENT GATEWAY (Cong thanh toan)
  Loai        : Phu
  Mo ta       : He thong thanh toan ben ngoai (VNPay/Momo sandbox).
  Tuong tac   : Nhan yeu cau thanh toan, xu ly, tra ve ket qua
                (thanh cong/that bai) qua callback URL.

========================================================================

## 2. USE CASE DIAGRAM TONG THE
========================================================================

Ghi chu ky hieu dung trong diagram:
  [Ten Actor]      : Hinh nguoi - tac nhan tuong tac voi he thong
  (UC-XX: Ten)     : Hinh oval  - mot chuc nang cua he thong
  -----            : Duong noi  - Actor su dung Use Case
  <<include>>      : Use case B LUON LUON duoc goi khi A chay
  <<extend>>       : Use case B CHI duoc goi KHI co dieu kien

Ranh gioi he thong (System Boundary) la khung chu nhat bao quanh
tat ca cac Use Case. Actor nam ben ngoai khung.

```
+============================================================================+
|                          HE THONG FITFUEL+                                 |
|                                                                            |
|  +------------------------------+    +-------------------------------+     |
|  | MODULE QUAN LY TAI KHOAN     |    | MODULE GYM TRACKING           |     |
|  |                              |    |                               |     |
|  | (UC-01: Dang ky tai khoan)   |    | (UC-07: Tao workout session)  |     |
|  |                              |    |                               |     |
|  | (UC-02: Dang nhap)           |    | (UC-08: Log exercise)         |     |
|  |                              |    |   |                           |     |
|  | (UC-03: Guest checkout OTP)  |    |   +--<<include>>--> (UC-09:   |     |
|  |                              |    |   |    Kiem tra PR)            |     |
|  | (UC-04: Merge Guest->Member) |    |                               |     |
|  |                              |    | (UC-10: Xem lich su tap)      |     |
|  | (UC-05: Cap nhat profile)    |    |                               |     |
|  |                              |    | (UC-11: Xem progress chart)   |     |
|  | (UC-06: Xem Fitness Passport)|    |                               |     |
|  +------------------------------+    | (UC-12: Goi y nhom co)        |     |
|                                      |                               |     |
|                                      | (UC-13: Check-in QR)          |     |
|                                      |                               |     |
|                                      | (UC-14: Xem thong ke)         |     |
|                                      +-------------------------------+     |
|                                                                            |
|  +------------------------------+    +-------------------------------+     |
|  | MODULE FOOD ORDER            |    | MODULE GEAR HUB               |     |
|  |                              |    |                               |     |
|  | (UC-15: Xem danh sach food)  |    | (UC-27: Xem danh sach gear)   |     |
|  |   |                          |    |                               |     |
|  |   +--<<include>>--> (UC-16:  |    | (UC-28: Xem Gear Lifecycle)   |     |
|  |       Loc theo macro/calo)   |    |                               |     |
|  |                              |    | (UC-29: Dat thue gear)        |     |
|  | (UC-17: Xem chi tiet food)   |    |   |                           |     |
|  |                              |    |   +--<<include>>--> (UC-30:   |     |
|  | (UC-18: Them vao gio hang)   |    |       Dat coc online)         |     |
|  |   |                          |    |                               |     |
|  |   +--<<extend>>--> (UC-19:   |    | (UC-31: Mua gear)             |     |
|  |       Them tu trang chu)     |    |   |                           |     |
|  |                              |    |   +--<<extend>>--> (UC-32:    |     |
|  | (UC-20: Thay doi trong cart) |    |       Dung FitCoin)           |     |
|  |                              |    |                               |     |
|  | (UC-21: Checkout)            |    | (UC-33: Dang ban/thue gear)   |     |
|  |   |                          |    |   |                           |     |
|  |   +--<<include>>--> (UC-22:  |    |   +--<<include>>--> (UC-34:   |     |
|  |   |    Chon phuong thuc TT)  |    |       Gen Gear ID + QR)      |     |
|  |   |                          |    |                               |     |
|  |   +--<<extend>>--> (UC-03:   |    | (UC-35: Scan QR Gear ID)      |     |
|  |   |    Guest OTP)            |    |                               |     |
|  |   |                          |    | (UC-36: Tra gear het han)     |     |
|  |   +--<<extend>>--> (UC-32:   |    |                               |     |
|  |       Dung FitCoin)          |    | (UC-37: Goi y gear tu AI)     |     |
|  |                              |    +-------------------------------+     |
|  | (UC-23: Dat lai don cu)      |                                          |
|  |                              |                                          |
|  | (UC-24: AI goi y food)       |    +-------------------------------+     |
|  |   |                          |    | MODULE GAMIFICATION           |     |
|  |   +--<<include>>--> (UC-25:  |    |                               |     |
|  |       Lay du lieu gym log)   |    | (UC-38: Xem XP va Level)      |     |
|  |                              |    |                               |     |
|  | (UC-26: Tinh TDEE)           |    | (UC-39: Xem Badge)            |     |
|  +------------------------------+    |                               |     |
|                                      | (UC-40: Tham gia Challenge)   |     |
|  +------------------------------+    |                               |     |
|  | MODULE PAYMENT & FITCOIN     |    | (UC-41: Xem Ranking Board)    |     |
|  |                              |    +-------------------------------+     |
|  | (UC-42: Thanh toan don hang) |                                          |
|  |                              |    +-------------------------------+     |
|  | (UC-43: Gia han membership)  |    | MODULE GYM OWNER & B2B            |     |
|  |                              |    |                               |     |
|  | (UC-44: Nap FitCoin)         |    | (UC-48: Vendor dang san pham) |     |
|  |                              |    |                               |     |
|  | (UC-45: Earn FitCoin)        |    | (UC-49: Vendor xu ly don)     |     |
|  |                              |    |                               |     |
|  | (UC-46: Spend FitCoin)       |    | (UC-50: Vendor xem analytics) |     |
|  |                              |    |                               |     |
|  | (UC-47: Xem lich su FitCoin) |    | (UC-51: Gym quan ly member)   |     |
|  +------------------------------+    |                               |     |
|                                      | (UC-52: Gym gui thong bao)    |     |
|  +------------------------------+    |                               |     |
|  | MODULE SOCIAL                |    | (UC-53: Gym Owner duyet vendor)   |     |
|  |                              |    |                               |     |
|  | (UC-54: Post milestone)      |    | (UC-54: Gym Owner xu ly tranh chap|     |
|  |                              |    +-------------------------------+     |
|  | (UC-55: Follow user)         |                                          |
|  |                              |                                          |
|  | (UC-56: Referral)            |                                          |
|  +------------------------------+                                          |
+============================================================================+


KET NOI ACTOR --> USE CASE:

  [Guest]       --> UC-03, UC-15, UC-16, UC-17, UC-18, UC-19,
                    UC-20, UC-21, UC-27, UC-28

  [Member]      --> Tat ca Use Case cua Guest va them:
                    UC-01, UC-02, UC-04 den UC-14 (Gym Tracking),
                    UC-23 den UC-26 (Food nang cao),
                    UC-29 den UC-37 (Gear Hub),
                    UC-38 den UC-41 (Gamification),
                    UC-42 den UC-47 (Payment/FitCoin),
                    UC-54 den UC-56 (Social)

  [Food Vendor] --> UC-48, UC-49, UC-50

  [Gear Seller] --> UC-33, UC-34, UC-35, UC-36

  [Gym Owner]   --> UC-51, UC-52

  [Gym Owner]       --> UC-53, UC-54 (Gym Owner)

  [Timer]       --> UC-36 (nhac tra gear), UC-40 (ket thuc challenge)

  [Payment GW]  --> UC-42 (xu ly thanh toan callback)
```

========================================================================

## 3. USE CASE DIAGRAM CHI TIET THEO MODULE
========================================================================

------------------------------------------------------------------------
### 3.1. Module Food Order (chi tiet)
------------------------------------------------------------------------

```
                      +--------------------------------------------+
                      |           MODULE FOOD ORDER                |
                      |                                            |
                      |                                            |
[Guest] ----+-------- | --(UC-15: Xem danh sach food)              |
            |         |     |                                      |
            |         |     +--<<include>>-->(UC-16: Loc theo      |
            |         |                       macro/calo/muc tieu) |
            |         |                                            |
            +---------|--(UC-17: Xem chi tiet food)                |
            |         |                                            |
            +---------|--(UC-18: Them vao gio hang)                |
            |         |     |                                      |
            |         |     +--<<extend>>--->(UC-19: Them tu       |
            |         |                       trang chu)           |
            |         |                                            |
            +---------|--(UC-20: Thay doi thuoc tinh trong cart)   |
            |         |                                            |
            +---------|--(UC-21: Checkout)                         |
                      |     |                                      |
                      |     +--<<include>>-->(UC-22: Chon phuong   |
                      |     |                 thuc thanh toan)     |
                      |     |                                      |
[Guest] -------------|-     +--<<extend>>--->(UC-03: Guest OTP)    |
                      |     |                                      |
[Member] ---+---------|-    +--<<extend>>--->(UC-32: Dung FitCoin) |
            |         |                                            |
            +---------|--(UC-23: Dat lai don cu)                   |
            |         |                                            |
            +---------|--(UC-24: AI goi y food)                    |
            |         |     |                                      |
            |         |     +--<<include>>-->(UC-25: Lay du lieu   |
            |         |                       gym log hom nay)    |
            |         |                                            |
            +---------|--(UC-26: Tinh TDEE)                        |
            |         |                                            |
            +---------|--(Macro Dashboard)                         |
            |         |                                            |
            +---------|--(Review san pham)                         |
                      |                                            |
[Food Vendor]---------|--(UC-48: Dang san pham)                    |
            +---------|--(UC-49: Xu ly don hang)                   |
            +---------|--(UC-50: Xem analytics)                    |
                      +--------------------------------------------+
```

Giai thich cac quan he:
  - UC-15 <<include>> UC-16: Khi xem danh sach, LUON hien thi bo loc.
  - UC-18 <<extend>> UC-19: Them tu trang chu la MO RONG, khong bat buoc
    phai tu trang chu moi them duoc (co the tu trang detail).
  - UC-21 <<extend>> UC-03: Guest OTP chi chay KHI user chua dang nhap.
  - UC-21 <<extend>> UC-32: Dung FitCoin chi chay KHI user chon FitCoin.
  - UC-24 <<include>> UC-25: AI goi y LUON CAN doc gym log de hoat dong.

------------------------------------------------------------------------
### 3.2. Module Gear Hub (chi tiet)
------------------------------------------------------------------------

```
                      +--------------------------------------------+
                      |           MODULE GEAR HUB                  |
                      |                                            |
[Guest] ----+---------|--(UC-27: Xem danh sach gear)               |
            |         |     |                                      |
            |         |     +--<<include>>-->(Loc theo loai/gia/   |
            |         |                       condition)           |
            |         |                                            |
            +---------|--(UC-28: Xem Gear Lifecycle)               |
                      |                                            |
[Member] ---+---------|--(UC-29: Dat thue gear)                    |
            |         |     |                                      |
            |         |     +--<<include>>-->(UC-30: Dat coc)      |
            |         |     |                                      |
            |         |     +--<<include>>-->(Chon thoi han thue)  |
            |         |                                            |
            +---------|--(UC-31: Mua gear)                         |
            |         |     |                                      |
            |         |     +--<<extend>>--->(UC-32: Dung FitCoin) |
            |         |                                            |
            +---------|--(UC-33: Dang ban/cho thue gear)           |
            |         |     |                                      |
            |         |     +--<<include>>-->(UC-34: Gen Gear ID   |
            |         |     |                 va QR Code)          |
            |         |     |                                      |
            |         |     +--<<include>>-->(Nhap condition +     |
            |         |                       anh + ghi chu)      |
            |         |                                            |
            +---------|--(UC-35: Scan QR Gear ID)                  |
            |         |                                            |
            +---------|--(UC-36: Tra gear khi het han)             |
            |         |     |                                      |
            |         |     +--<<include>>-->(Cap nhat Lifecycle)  |
            |         |                                            |
            +---------|--(UC-37: Goi y gear tu AI)                 |
            |         |     |                                      |
            |         |     +--<<include>>-->(Phan tich gym log)   |
                      |                                            |
[Gym Owner] -------------|--(Duyet listing moi)                        |
            +---------|--(Xu ly tranh chap gear)                   |
                      +--------------------------------------------+
```

Giai thich cac quan he:
  - UC-29 <<include>> UC-30: Dat thue LUON CAN dat coc.
  - UC-33 <<include>> UC-34: Dang gear LUON gen Gear ID tu dong.
  - UC-36 <<include>> Cap nhat Lifecycle: Khi tra gear, LUON tao entry moi
    trong Gear Lifecycle voi action = "returned".
  - UC-31 <<extend>> UC-32: FitCoin la tuy chon, khong bat buoc.

========================================================================
KET THUC FILE 03
========================================================================
