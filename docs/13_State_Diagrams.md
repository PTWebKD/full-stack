# 13. BIEU DO TRANG THAI
# (State Diagrams)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 15/06/2026

========================================================================

Giai thich ky hieu:

  [*]               : Diem bat dau (Initial State)
  [(*)]             : Diem ket thuc (Final State)
  +============+    : Trang thai (State) - hinh chu nhat bo tron
  -- su kien -->    : Chuyen trang thai (Transition) - mui ten
                      Ghi tren mui ten: su_kien [dieu_kien] / hanh_dong
                      Trong do:
                        su_kien   = dieu gi xay ra de kich hoat
                        [dieu_kien] = dieu kien phai dung (guard)
                        / hanh_dong = viec he thong lam khi chuyen

  Quy tac doc:
  "Khi dang o trang thai A, neu su_kien xay ra (va dieu_kien dung),
   thi he thong thuc hien hanh_dong va chuyen sang trang thai B."

========================================================================

## STATE DIAGRAM 1: FOOD ORDER STATUS
========================================================================

Muc dich: Mo ta cac trang thai cua 1 don hang food tu khi duoc
          tao cho den khi hoan tat hoac bi huy.

Cac trang thai:
  PENDING     : Don moi tao, cho vendor xac nhan.
  CONFIRMED   : Vendor da xac nhan, chuan bi bat dau.
  PREPARING   : Vendor dang chuan bi mon an.
  DELIVERING  : Mon an dang duoc giao.
  DELIVERED   : Da giao thanh cong.
  CANCELLED   : Don bi huy.

```
                            [*]
                             |
                             | User dat hang thanh cong
                             | / Tao don, gui thong bao Vendor
                             v
                    +================+
                    |    PENDING     |
                    |----------------|
                    | entry / Gui    |
                    | thong bao den  |
                    | Food Vendor    |
                    +================+
                       |         |
                       |         |
    Vendor nhan        |         |  [1] User nhan [Huy don]
    [Xac nhan]         |         |      / Hoan tien 100%
    / Gui thong bao    |         |
    cho user           |         |  [2] Qua 15 phut khong xac nhan
                       |         |      / Tu dong huy, hoan tien
                       v         v
              +================+    +================+
              |   CONFIRMED   |--->|   CANCELLED    |
              |----------------|    |----------------|
              | entry / Gui    |    | entry / Hoan   |
              | "Don da duoc   |    | tien (neu da   |
              |  xac nhan"     |    | thanh toan).   |
              +================+    | Cap nhat       |
                       |            | FitCoin (neu   |
                       |            | da tru).       |
    Vendor nhan        |            +================+
    [Chuan bi xong]    |                    |
    / Cap nhat status  |                    v
                       |               [(*)]
                       v
              +================+
              |   PREPARING   |
              |----------------|
              | entry / Gui    |
              | "Dang chuan    |
              |  bi mon an"    |
              +================+
                       |
                       |
    Vendor nhan        |
    [Dang giao]        |
    / Cap nhat status  |
                       v
              +================+
              |  DELIVERING   |
              |----------------|
              | entry / Gui    |
              | "Don dang      |
              |  duoc giao"    |
              +================+
                       |
                       |
    User xac nhan      |
    da nhan hang       |
    HOAC Vendor xac    |
    nhan da giao       |
    / Cap nhat Macro   |
      Dashboard        |
                       v
              +================+
              |   DELIVERED   |
              |----------------|
              | entry / Cap    |
              | nhat macro     |
              | dashboard cua  |
              | user (cong     |
              | calo/protein/  |
              | carb/fat cua   |
              | don hang).     |
              | Cong 20 XP.   |
              +================+
                       |
                       v
                     [(*)]
```

Bang tom tat chuyen trang thai:

Trang thai hien tai | Su kien                      | Dieu kien            | Hanh dong                    | Trang thai moi
--------------------|------------------------------|----------------------|------------------------------|----------------
(bat dau)           | User dat hang                |                      | Tao don, gui TB Vendor       | PENDING
PENDING             | Vendor xac nhan              |                      | Gui TB user                  | CONFIRMED
PENDING             | User huy don                 |                      | Hoan tien 100%               | CANCELLED
PENDING             | Qua 15 phut                  | Vendor khong xac nhan| Tu dong huy, hoan tien       | CANCELLED
CONFIRMED           | Vendor bat dau chuan bi      |                      | Cap nhat status              | PREPARING
CONFIRMED           | User huy don                 |                      | Hoan tien 100%               | CANCELLED
PREPARING           | Vendor chuan bi xong         |                      | Gui TB user                  | DELIVERING
DELIVERING          | User/Vendor xac nhan giao    |                      | Cap nhat macro, cong 20 XP   | DELIVERED
DELIVERED           | (trang thai cuoi)            |                      |                              | (ket thuc)
CANCELLED           | (trang thai cuoi)            |                      |                              | (ket thuc)

Ghi chu:
  - PREPARING va DELIVERING khong the huy (mon da lam/dang giao).
  - DELIVERED va CANCELLED la trang thai ket thuc (Final State).

========================================================================

## STATE DIAGRAM 2: MEMBERSHIP STATUS
========================================================================

Muc dich: Mo ta cac trang thai cua membership (goi tap) cua user
          tai 1 phong tap.

Cac trang thai:
  ACTIVE      : Membership dang con hieu luc.
  EXPIRING    : Sap het han (con 3 ngay).
  EXPIRED     : Da het han, chua gia han.
  CANCELLED   : User tu huy.

```
                            [*]
                             |
                             | User mua goi tap
                             | / Tao membership, start_date = hom nay,
                             |   end_date = start_date + duration
                             v
                    +================+
                    |     ACTIVE     |
                    |----------------|
                    | entry / User   |
                    | duoc check-in  |
                    | tai phong tap  |
                    +================+
                     |       |       |
                     |       |       |
       [end_date -   |       |       | User nhan
       3 ngay]       |       |       | [Huy membership]
       / Gui nhac    |       |       | / Hoan tien pro-rata
       nho gia han   |       |       |   (theo ngay con lai)
                     |       |       |
                     v       |       v
            +============+   |   +================+
            |  EXPIRING  |   |   |   CANCELLED    |
            |------------|   |   |----------------|
            | entry / Gui|   |   | entry / Vo     |
            | email nhac |   |   | hieu hoa       |
            | nho hang   |   |   | quyen check-in |
            | ngay       |   |   +================+
            +============+        |
                     |            v
                     |          [(*)]
    [auto_renew =    |
     true va co      |
     phuong thuc TT] |
     / Tu dong       |
     thanh toan,     |
     reset end_date  |
         |           |
         |           | end_date qua
         |           | [auto_renew = false
         |           |  HOAC thanh toan that bai]
         |           | / Gui thong bao het han
         v           v
    +============+   +================+
    |   ACTIVE   |   |    EXPIRED     |
    | (gia han)  |   |----------------|
    +============+   | entry / Vo     |
                     | hieu hoa       |
                     | quyen check-in.|
                     | Giu du lieu    |
                     | 30 ngay.       |
                     +================+
                      |            |
                      |            |
       User mua       |            | Qua 30 ngay
       goi moi        |            | khong gia han
       / Tao          |            | / Xoa khoi danh
       membership     |            |   sach gym
       moi            |            |
                      v            v
                +============+   [(*)]
                |   ACTIVE   |
                +============+
```

Bang tom tat:

Trang thai hien tai | Su kien                   | Dieu kien                | Hanh dong                    | Trang thai moi
--------------------|---------------------------|--------------------------|------------------------------|----------------
(bat dau)           | User mua goi              |                          | Tao membership               | ACTIVE
ACTIVE              | Con 3 ngay het han         |                          | Gui nhac nho                 | EXPIRING
ACTIVE              | User huy                   |                          | Hoan tien pro-rata           | CANCELLED
EXPIRING            | Den ngay het han           | auto_renew=true, TT OK   | Tu dong gia han              | ACTIVE
EXPIRING            | Den ngay het han           | auto_renew=false hoac TT fail | Gui TB het han        | EXPIRED
EXPIRED             | User mua goi moi           |                          | Tao membership moi           | ACTIVE
EXPIRED             | Qua 30 ngay                | Khong gia han            | Xoa khoi DS gym              | (ket thuc)
CANCELLED           | (trang thai cuoi)          |                          |                              | (ket thuc)

========================================================================

## STATE DIAGRAM 3: GEAR ITEM STATUS
========================================================================

Muc dich: Mo ta cac trang thai cua 1 thiet bi gym trong Gear Hub,
          bao gom vong doi qua nhieu chu nhan.

Cac trang thai:
  LISTED      : Dang hien thi tren listing, cho nguoi mua hoac thue.
                Gym Owner listing -> chi co the chuyen sang SOLD.
                Member listing    -> chi co the chuyen sang RENTED.
  SOLD        : Da ban cho Member mua. Chi xay ra voi Gym Owner listing.
  RENTED      : Dang duoc thue boi Member khac. Chi xay ra voi Member listing.
  RETURNED    : Da tra lai sau khi het han thue. Gear ve tay Member cho thue.
  RELISTED    : Chu cu dang lai. Luon la listing_type='rent' (vi chu cu la Member).
  REMOVED     : Chu go khoi listing (khong ban/thue nua).

```
                            [*]
                             |
                             | Actor dang thiet bi (BR-11B):
                             | GymOwner -> listing_type='sell'
                             | Member   -> listing_type='rent'
                             | / Gen Gear ID, QR Code.
                             |   Tao Lifecycle entry #1 (listed).
                             v
                    +================+
                    |    LISTED      |
                    |----------------|
                    | entry / Hien   |
                    | thi tren       |
                    | listing.       |
                    | is_available   |
                    | = true.        |
                    +================+
                     |       |       |
                     |       |       |
    [listing='sell'] |       |       | Seller nhan
    Member nhan      |       |       | [Go listing]
    [Mua ngay]       |       |       | / Danh dau
    / Chuyen owner,  |       |       |   is_available
    tao Lifecycle    |       |       |   = false
    (sold), cong     |       |       |
    FitCoin seller   |       |       |
                     |       |       |
                     v       |       v
            +============+   |   +================+
            |    SOLD    |   |   |    REMOVED      |
            |------------|   |   |----------------|
            | entry /    |   |   | entry / Khong  |
            | owner =    |   |   | hien thi tren  |
            | buyer.     |   |   | listing.       |
            | is_available   |   +================+
            | = false.   |   |        |
            | Lifecycle  |   |        v
            | entry      |   |      [(*)]
            | (sold).    |   |
            +============+   |
                  |          |
                  |          | [listing='rent']
                  |          | Member khac nhan [Thue]
                  |          | / Tao Lifecycle (rented).
                  |          |   Thu tien thue + coc.
                  |          |
       Buyer muon |          v
       ban lai    |   +================+
       / Cap nhat |   |    RENTED      |
       condition, |   |----------------|
       Lifecycle  |   | entry / owner  |
       (relisted) |   | van la seller. |
                  |   | is_available   |
                  |   | = false.       |
                  |   | Lifecycle      |
                  |   | (rented).      |
                  |   +================+
                  |          |
                  |          |
                  |          | Renter tra gear
                  |          | [dung han HOAC tre]
                  |          | / Kiem tra tinh trang.
                  |          |   Tinh phi phat (neu tre).
                  |          |   Hoan coc (tru phi phat).
                  |          |   Lifecycle (returned).
                  |          |
                  |          v
                  |   +================+
                  |   |   RETURNED     |
                  |   |----------------|
                  |   | entry / owner  |
                  |   | van la seller  |
                  |   | ban dau.       |
                  |   | Gear ve tay    |
                  |   | seller.        |
                  |   +================+
                  |     |           |
                  |     |           |
                  |     | Seller    | Seller
                  |     | dang      | khong
                  |     | lai       | dang lai
                  |     |           |
                  v     v           v
           +================+    [(*)]
           |   RELISTED     |
           |----------------|
           | entry / Cap    |
           | nhat condition |
           | moi. Anh moi. |
           | Lifecycle      |
           | (relisted).    |
           | is_available   |
           | = true.        |
           +================+
              |       |
              |       |
   (Lap lai   |       | Seller go listing
   nhu LISTED:|       |
   co the ban |       v
   hoac thue) |    +================+
              |    |    REMOVED      |
              |    +================+
              |           |
              v           v
         (tiep tuc     [(*)]
          vong doi)
```

Bang tom tat:

Trang thai hien tai | Su kien / Guard                        | Hanh dong                                | Trang thai moi
--------------------|----------------------------------------|------------------------------------------|----------------
(bat dau)           | GymOwner dang ban [listing='sell']     | Gen Gear ID, QR, Lifecycle (listed)      | LISTED
(bat dau)           | Member dang cho thue [listing='rent']  | Gen Gear ID, QR, Lifecycle (listed)      | LISTED
LISTED              | [listing='sell'] Member mua            | Chuyen owner, Lifecycle (sold), FitCoin  | SOLD
LISTED              | [listing='rent'] Member khac thue      | Lifecycle (rented), thu tien + coc       | RENTED
LISTED              | Seller go listing                      | is_available = false                     | REMOVED
SOLD                | Member mua lai muon cho thue           | listing='rent', Lifecycle (relisted)     | RELISTED
RENTED              | Renter tra gear                        | Kiem tra, hoan coc, Lifecycle (returned) | RETURNED
RETURNED            | Member chu cu dang cho thue lai        | listing='rent', Lifecycle (relisted)     | RELISTED
RETURNED            | Member chu cu khong dang lai           |                                          | (ket thuc)
RELISTED            | (tuong tu LISTED, luon listing='rent') | Member khac thue hoac go listing         | RENTED/REMOVED
REMOVED             | (trang thai cuoi)                      |                                          | (ket thuc)

Ghi chu dac biet:
  - Gear ID KHONG DOI qua tat ca trang thai (BR-12).
  - Moi lan chuyen trang thai = 1 entry moi trong GEAR_LIFECYCLE.
  - SOLD chi xay ra khi Gym Owner listing (listing_type='sell') duoc mua.
  - RENTED chi xay ra khi Member listing (listing_type='rent') duoc thue.
  - Sau khi SOLD: neu Member mua muon cho nguoi khac su dung, chi co the dang
    listing_type='rent' (vi Member khong duoc ban - BR-11B).
  - Day la "vong tron" co the lap lai vo han.

========================================================================

## STATE DIAGRAM 4: WORKOUT SESSION STATUS
========================================================================

Muc dich: Mo ta cac trang thai cua 1 buoi tap.

Cac trang thai:
  ACTIVE      : Buoi tap dang dien ra, user dang log exercise.
  DONE        : Buoi tap da hoan tat binh thuong.
  CANCELLED   : User huy buoi tap (khong tinh XP, khong tinh streak).

```
                    [*]
                     |
                     | User nhan [Bat dau buoi tap]
                     | / Tao session, status = active,
                     |   bat dau dem thoi gian
                     v
            +================+
            |     ACTIVE     |
            |----------------|
            | entry / Hien   |
            | thi form log   |
            | exercise.      |
            | Timer chay.    |
            |                |
            | do / User them |
            | bai tap, nhap  |
            | set, kiem tra  |
            | PR.            |
            +================+
               |           |
               |           |
  User nhan    |           | User nhan
  [Ket thuc    |           | [Huy buoi tap]
   buoi tap]   |           | / Khong cong XP,
  / Tinh       |           |   khong tinh streak,
  duration,    |           |   xoa exercise logs
  cong 50 XP,  |           |   (hoac giu de tham khao)
  streak +1,   |           |
  cap nhat     |           |
  Passport     |           |
               v           v
      +============+   +================+
      |    DONE    |   |   CANCELLED    |
      |------------|   |----------------|
      | entry /    |   | entry / Khong  |
      | Hien popup |   | thay doi XP,  |
      | AI Food    |   | streak,       |
      | Suggestion.|   | Passport.     |
      | Cap nhat   |   +================+
      | Fitness    |          |
      | Passport.  |          v
      +============+       [(*)]
             |
             v
           [(*)]
```

Bang tom tat:

Trang thai hien tai | Su kien             | Hanh dong                              | Trang thai moi
--------------------|---------------------|----------------------------------------|----------------
(bat dau)           | User bat dau tap    | Tao session, bat dau timer             | ACTIVE
ACTIVE              | User ket thuc       | Tinh duration, +50 XP, streak+1, AI   | DONE
ACTIVE              | User huy            | Khong cong XP, khong tinh streak       | CANCELLED
DONE                | (trang thai cuoi)   |                                        | (ket thuc)
CANCELLED           | (trang thai cuoi)   |                                        | (ket thuc)

========================================================================

## STATE DIAGRAM 5: CHALLENGE STATUS (CUA MOI USER)
========================================================================

Muc dich: Mo ta cac trang thai tham gia challenge cua 1 user cu the
          (bang USER_CHALLENGES).

Cac trang thai:
  IN_PROGRESS : User dang thuc hien challenge, chua hoan tat.
  COMPLETED   : User da hoan tat tat ca dieu kien.
  FAILED      : Challenge het han ma user chua hoan tat.

```
                    [*]
                     |
                     | User nhan [Tham gia]
                     | / Tao user_challenge,
                     |   status = in_progress,
                     |   progress = khoi tao
                     v
            +================+
            |  IN_PROGRESS   |
            |----------------|
            | entry / Hien   |
            | thi progress   |
            | bar.           |
            |                |
            | do / Moi khi   |
            | user thuc hien |
            | hanh dong lien |
            | quan, he thong |
            | cap nhat       |
            | progress.      |
            +================+
               |           |
               |           |
  User dat     |           | Deadline den
  du dieu kien |           | [progress chua du]
  / Cong XP    |           | / Khong thuong XP,
  va FitCoin   |           |   khong thuong FitCoin
  (theo        |           |
  challenge    |           |
  reward)      |           |
               v           v
      +============+   +================+
      |  COMPLETED |   |     FAILED     |
      |------------|   |----------------|
      | entry /    |   | entry / Gui    |
      | Gui thong  |   | thong bao      |
      | bao chuc   |   | "Khong hoan    |
      | mung.      |   |  thanh".       |
      | Cong XP va |   | De xuat:       |
      | FitCoin.   |   | "Tham gia      |
      | Tu tao post|   |  challenge     |
      | milestone  |   |  tiep theo".   |
      | (neu la    |   +================+
      | challenge  |          |
      | lon).      |          v
      +============+       [(*)]
             |
             v
           [(*)]
```

Bang tom tat:

Trang thai hien tai | Su kien              | Dieu kien           | Hanh dong                        | Trang thai moi
--------------------|----------------------|---------------------|----------------------------------|----------------
(bat dau)           | User tham gia        |                     | Tao user_challenge               | IN_PROGRESS
IN_PROGRESS         | User hanh dong       | Dat du dieu kien    | Cong XP + FitCoin, gui TB        | COMPLETED
IN_PROGRESS         | Deadline het         | Chua du dieu kien   | Gui TB that bai                  | FAILED
COMPLETED           | (trang thai cuoi)    |                     |                                  | (ket thuc)
FAILED              | (trang thai cuoi)    |                     |                                  | (ket thuc)

Vi du cu the:
  Challenge: "Tap 5 buoi trong tuan" (weekly)
  - User tham gia ngay thu 2.
  - Thu 3: tap 1 buoi -> progress = {"sessions_done": 1}
  - Thu 4: tap 1 buoi -> progress = {"sessions_done": 2}
  - Thu 5: tap 1 buoi -> progress = {"sessions_done": 3}
  - Thu 6: tap 1 buoi -> progress = {"sessions_done": 4}
  - Thu 7: tap 1 buoi -> progress = {"sessions_done": 5}
    => Dat du dieu kien (5/5) -> COMPLETED -> +100 XP, +50 FC

========================================================================

## STATE DIAGRAM 6: GEAR RENTAL STATUS
========================================================================

Muc dich: Mo ta cac trang thai cua 1 giao dich cho thue gear
          (bang GEAR_TRANSACTIONS, type = rental).

Cac trang thai:
  PENDING     : Renter dat thue, cho xu ly thanh toan.
  ACTIVE      : Dang thue, gear dang trong tay renter.
  OVERDUE     : Qua ngay tra, chua tra lai.
  COMPLETED   : Tra dung han, hoan coc.
  DISPUTED    : Co tranh chap (gear hong, khong tra...).

```
                    [*]
                     |
                     | Renter nhan [Thue]
                     | / Tao transaction, status = pending
                     v
            +================+
            |    PENDING     |
            |----------------|
            | entry / Cho    |
            | thanh toan     |
            | tien thue +    |
            | tien coc.      |
            +================+
               |           |
               |           |
  Thanh toan   |           | Thanh toan that bai
  thanh cong   |           | hoac user huy
  / Tru tien   |           | / Huy giao dich
  renter.      |           |
  Gui gear cho |           |
  renter.      |           |
               v           v
      +============+     [(*)]
      |   ACTIVE   |
      |------------|
      | entry /    |
      | Gear dang  |
      | trong tay  |
      | renter.    |
      | He thong   |
      | gui nhac   |
      | truoc 1    |
      | ngay het   |
      | han.       |
      +============+
        |     |       |
        |     |       |
  Renter|     | Qua   | Co tranh chap
  tra   |     | rental_| (gear hong,
  gear  |     | end    | mat...)
  dung  |     | 3 ngay | / Tao dispute
  han   |     |        |   ticket
        |     |        |
        v     v        v
  +==========+ +============+ +================+
  |COMPLETED | | OVERDUE    | |   DISPUTED     |
  |----------| |------------| |----------------|
  | entry /  | | entry /    | | entry / Gym Owner  |
  | Kiem tra | | Gui nhac   | | xem xet.       |
  | tinh     | | nho hang   | | Dong bang coc  |
  | trang.   | | ngay. Tinh | | hoac hoan tra. |
  | Hoan coc | | phi phat   | +================+
  | (tru phi | | 10%/ngay   |        |
  | phat neu | | tu coc.    |        v
  | co).     | +============+      [(*)]
  | Lifecycle| |     |
  | entry    | |     |
  | (returned| | Renter tra gear
  | ).       | | (muon)
  +==========+ | / Tinh phi phat,
       |       |   hoan coc con lai
       v       v
     [(*)]  +==========+
            |COMPLETED |
            | (tre)    |
            +==========+
                 |
                 v
               [(*)]
```

Bang tom tat:

Trang thai hien tai | Su kien              | Hanh dong                              | Trang thai moi
--------------------|----------------------|----------------------------------------|----------------
(bat dau)           | Renter dat thue      | Tao transaction                        | PENDING
PENDING             | Thanh toan OK        | Tru tien, gui gear                     | ACTIVE
PENDING             | Thanh toan fail/huy  | Huy giao dich                          | (ket thuc)
ACTIVE              | Renter tra dung han  | Kiem tra, hoan coc, Lifecycle          | COMPLETED
ACTIVE              | Qua han 3 ngay       | Gui nhac nho, tinh phi phat           | OVERDUE
ACTIVE              | Tranh chap           | Tao dispute ticket                     | DISPUTED
OVERDUE             | Renter tra (muon)    | Tinh phi phat, hoan coc con lai       | COMPLETED
DISPUTED            | Gym Owner ra quyet dinh  | Dong bang coc hoac hoan tra           | (ket thuc)
COMPLETED           | (trang thai cuoi)    |                                        | (ket thuc)

========================================================================

## STATE DIAGRAM 7: USER ACCOUNT STATUS
========================================================================

Muc dich: Mo ta cac trang thai cua tai khoan nguoi dung.

Cac trang thai:
  UNVERIFIED  : Moi dang ky, chua xac minh email/SDT.
  ACTIVE      : Tai khoan hoat dong binh thuong.
  SUSPENDED   : Bi tam dinh chi boi Gym Owner (vi pham quy dinh).
  DELETED     : User tu xoa tai khoan.

```
                    [*]
                     |
                     | User nhan [Dang ky]
                     | / Tao tai khoan
                     v
            +================+
            |  UNVERIFIED    |
            |----------------|
            | entry / Gui    |
            | email xac minh |
            | (hoac OTP neu  |
            | dang ky SDT).  |
            +================+
               |           |
               |           |
  User xac     |           | Khong xac minh
  minh thanh   |           | trong 24h
  cong (click  |           | / Tu dong xoa
  link hoac    |           |
  nhap OTP)    |           |
               v           v
      +============+     [(*)]
      |   ACTIVE   |
      |------------|
      | entry /    |
      | Full       |
      | access.    |
      +============+
        |     |
        |     |
  Gym Owner |     | User nhan
  dinh  |     | [Xoa tai khoan]
  chi   |     | / Xoa toan bo du lieu
  (vi   |     |   sau 30 ngay
  pham) |     |
        v     v
  +==========+ +================+
  |SUSPENDED | |    DELETED     |
  |----------| |----------------|
  | entry /  | | entry / Vo     |
  | Thong bao| | hieu hoa JWT.  |
  | user ly  | | Xoa data sau   |
  | do. Khong| | 30 ngay.       |
  | dang nhap| +================+
  | duoc.    |        |
  +==========+        v
     |     |        [(*)]
     |     |
  Gym Owner|  Gym Owner
  mo   |  xoa
  khoa |  vinh vien
     |     |
     v     v
  +======+ +=========+
  |ACTIVE| | DELETED |
  +======+ +=========+
```

========================================================================
KET THUC FILE 13
========================================================================
