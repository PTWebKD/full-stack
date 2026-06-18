# 13. BIEU DO TRANG THAI
# (State Diagrams)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 18/06/2026 (Cap nhat: Dinh huong lai Gym Management System — bo FoodOrder/GearRental)

========================================================================

Giai thich ky hieu:

  [*]               : Diem bat dau (Initial State)
  [(*)]             : Diem ket thuc (Final State)
  +============+    : Trang thai (State) - hinh chu nhat bo tron
  -- su kien -->    : Chuyen trang thai (Transition) - mui ten
                      Ghi tren mui ten: su_kien [dieu_kien] / hanh_dong
                      Trong do:
                        su_kien     = dieu gi xay ra de kich hoat
                        [dieu_kien] = dieu kien phai dung (guard)
                        / hanh_dong = viec he thong lam khi chuyen

  Quy tac doc:
  "Khi dang o trang thai A, neu su_kien xay ra (va dieu_kien dung),
   thi he thong thuc hien hanh_dong va chuyen sang trang thai B."

========================================================================

## STATE DIAGRAM 1: GYM_MEMBERSHIPS.STATUS
========================================================================

Muc dich: Mo ta vong doi day du cua mot goi tap hoi vien, tu dang ky
          cho den het han, bao gom tam ngung (bao luu) va nang cap.

Cac trang thai:
  ACTIVE      : Goi tap dang con hieu luc, co the check-in.
  EXPIRING    : Sap het han (<= 7 ngay), van con check-in duoc.
  SUSPENDED   : Dang bao luu (tam ngung), khong check-in duoc.
  EXPIRED     : Da het han, khong check-in duoc.
  CANCELLED   : Da huy hoan toan.

```
                         [*]
                          |
                          | Member mua goi tap + thanh toan thanh cong
                          | / Tao GYM_MEMBERSHIPS, ghi MEMBERSHIP_HISTORY
                          |   Tao INVOICES (status='paid')
                          v
                 +================+
                 |     ACTIVE     |
                 |----------------|
                 | - Duoc check-in|
                 | - Duoc dung    |
                 |   tien ich     |
                 |   theo goi     |
                 +================+
                  |    |    |    |
                  |    |    |    |
  [end_date      |    |    |    | Admin duyet
  - 7 ngay]      |    |    |    | bao luu
  / Tao          |    |    |    | [< 2 lan/nam - BR-08]
  renew_          |    |    |    | / Ghi MEMBERSHIP_
  reminder        |    |    |    |   HISTORY (suspension)
  RECOMMENDATIONS |    |    |    |
                  v    |    |    v
     +===========+     |    | +============+
     |  EXPIRING |     |    | | SUSPENDED  |
     |-----------|     |    | |------------|
     | - Van duoc|     |    | | - Khong    |
     |   check-in|     |    | |   duoc     |
     | - Nhan TB |     |    | |   check-in |
     |   nhac    |     |    | | - Thoi gian|
     |   nho     |     |    | |   bao luu  |
     |   moi ngay|     |    | |   khong    |
     +===========+     |    | |   tinh vao |
       |      |         |    | |   end_date |
       |      |         |    | +============+
  Member |      |  het    |    |      |
  gia    |      |  han    |    |      | Admin ket thuc
  han    |      |  [chua  |    |      | bao luu
  /      |      |  gia    |    |      | / Cong them
  cap    |      |  han]   |    |      |   so ngay bao luu
  nhat   |      |         |    |      |   vao end_date
  end_   |      |  / Tao  |    |      |
  date   |      |  expired|    |      |
         v      v  _alert  |    v      v
     +======+ +=======+   |  +======+ +=========+
     |ACTIVE| |EXPIRED|   |  |ACTIVE| |EXPIRED  |
     |(gia  | |-------|   |  |(phuc | |(bao luu |
     | han) | |- Khong|   |  | hoi) | |qua han) |
     +======+ |  duoc |   |  +======+ +=========+
              | check-|   |      |         |
              |  in   |   |      v         v
              |- Giu  |   |    [(*)]     [(*)]
              |  du   |   |
              |  lieu |   | Member/Admin huy goi
              +-------+   | / Ghi MEMBERSHIP_HISTORY
               |    |     |   (cancellation)
               |    |     |
  Member     |    |     v
  mua        |    | +============+
  goi        |    | | CANCELLED  |
  moi        |    | |------------|
  /          |    | | - Khong    |
  Tao        |    | |   duoc     |
  member-    |    | |   check-in |
  ship       |    | +============+
  moi        v    |       |
          +======+ |       v
          |ACTIVE|  |     [(*)]
          +(moi)+  |
          +======+  v
                  [(*)]
```

Bang tom tat chuyen trang thai:

Trang thai  | Su kien / Guard                           | Hanh dong                             | Trang thai moi
------------|-------------------------------------------|---------------------------------------|----------------
(bat dau)   | Mua goi + thanh toan OK                  | Tao GYM_MEMBERSHIPS, HISTORY, INVOICE | ACTIVE
ACTIVE      | Con <= 7 ngay het han                     | Tao RECOMMENDATIONS (renew_reminder)  | EXPIRING
ACTIVE      | Admin duyet bao luu [<2 lan/nam]          | Ghi HISTORY (suspension)              | SUSPENDED
ACTIVE      | Huy goi                                   | Ghi HISTORY (cancellation)            | CANCELLED
EXPIRING    | Member gia han + thanh toan OK            | Cap nhat end_date, ghi HISTORY        | ACTIVE
EXPIRING    | Het han [chua gia han]                    | Tao expired_alert NOTIFICATION        | EXPIRED
SUSPENDED   | Admin ket thuc bao luu                   | Cong ngay bao luu vao end_date        | ACTIVE (hoac EXPIRED)
EXPIRED     | Member mua goi moi                        | Tao GYM_MEMBERSHIPS moi               | ACTIVE (moi)
EXPIRED     | (khong hanh dong 30 ngay)                 | Xu ly chien luoc luu tru du lieu      | (ket thuc)
CANCELLED   | (trang thai cuoi)                         |                                       | (ket thuc)

Ghi chu: BR-07 (canh bao 7 ngay, 3 ngay), BR-08 (bao luu toi da 2 lan/nam)

========================================================================

## STATE DIAGRAM 2: ASSET_ASSIGNMENTS.STATUS
========================================================================

Muc dich: Mo ta vong doi cap phat tai san/tien ich cho member khi
          check-in, tu luc cap phat den khi tra lai hoac mat.

Cac trang thai:
  ACTIVE    : Dang cap phat cho Member, chua tra lai.
  RETURNED  : Da tra lai, tinh trang tot hoac bi mon.
  DAMAGED   : Tra lai nhung bi hong.
  LOST      : Khong tra lai (mat/that lac).

```
                    [*]
                     |
                     | Check-in hop le, goi tap co quyen loi tien ich
                     | / Ghi ASSET_ASSIGNMENTS, giam available_qty
                     v
            +================+
            |     ACTIVE     |
            |----------------|
            | Tai san/locker |
            | dang trong tay |
            | Member         |
            +================+
              |    |    |
              |    |    |
  Member tra  |    |    | Member tra lai
  lai binh    |    |    | bi hong
  thuong      |    |    | / Tinh phi phat
  / Tang       |    |    |   (BR-19)
  available_   |    |    |   Tao INVOICES
  qty          |    |    |
               |    |    v
               |    | +============+
               |    | |  DAMAGED   |
               |    | |------------|
               |    | | Ghi nhan   |
               |    | | phi phat.  |
               |    | | Tang       |
               |    | | available_ |
               |    | | qty.       |
               |    | +============+
               |    |       |
  Member       |    |       | Admin xac
  bao mat      v    v       | nhan xu ly
  (cuoi buoi)      +=======+     |
  / Tao         +========+ |RETURNED|     v
  ASSET_        |RETURNED| |  +    |   [(*)]
  PENALTIES     |(binh   | |(xuat  |
  (BR-20)       |thuong) | | phat) |
  Tao INVOICES  +========+ +=======+
                     |          |
                     v          v
                  [(*)]      [(*)]

               |
    Asset mat  |
               v
            +============+
            |    LOST    |
            |------------|
            | Ghi phi    |
            | phat mat   |
            | tai san.   |
            | Tao        |
            | INVOICES.  |
            | Danh dau   |
            | ASSETS.    |
            | condition  |
            | = 'lost'.  |
            +============+
                   |
                   v
                [(*)]
```

Bang tom tat:

Trang thai | Su kien                           | Hanh dong                              | Trang thai moi
-----------|-----------------------------------|----------------------------------------|----------------
(bat dau)  | Check-in + goi co quyen loi       | Ghi ASSIGNMENTS, giam available_qty    | ACTIVE
ACTIVE     | Member tra tai san - tinh trang tot| Tang available_qty                     | RETURNED
ACTIVE     | Member tra tai san - bi hong       | Tinh phi phat, tao INVOICES, PENALTIES | DAMAGED
ACTIVE     | Member bao mat tai san             | Tinh phi phat, tao INVOICES, PENALTIES | LOST
RETURNED   | (trang thai cuoi)                  |                                        | (ket thuc)
DAMAGED    | Admin xu ly xong                   |                                        | (ket thuc)
LOST       | (trang thai cuoi)                  |                                        | (ket thuc)

Quy tac: BR-17 (phi phat hong), BR-18 (cap phat locker), BR-19 (phi phat locker), BR-20 (bao tri)

========================================================================

## STATE DIAGRAM 3: RECOMMENDATIONS.STATUS
========================================================================

Muc dich: Mo ta vong doi cua mot de xuat AI trong care queue, tu luc
          tao tu dong cho den khi duoc xu ly hoac bi bo qua.

Cac trang thai:
  PENDING    : Recommendation moi tao, chua co nhan vien xu ly.
  HANDLED    : Nhan vien da xu ly va ghi ket qua.
  DISMISSED  : Gym Owner bo qua (khong can xu ly).

```
                    [*]
                     |
                     | TIMER daily quet, phat hien dieu kien
                     | [khong co pending rec trong 7 ngay]
                     | / INSERT RECOMMENDATIONS, xac dinh priority
                     v
            +================+
            |    PENDING     |
            |----------------|
            | Hien thi trong |
            | care queue.    |
            | Sap xep theo   |
            | priority       |
            | (HIGH truoc).  |
            +================+
                |          |
                |          |
  Nhan vien     |          | Gym Owner
  thuc hien +   |          | chon Dismiss
  ghi ket qua   |          | / Khong tao
  / Tao         |          |   MEMBER_CARE_
  MEMBER_CARE_  |          |   LOGS
  LOGS          |          |
  SET status=   |          |
  'handled'     |          |
  SET resolved_ |          |
  at = NOW()    |          |
                v          v
          +=========+ +==========+
          | HANDLED | | DISMISSED|
          |---------| |----------|
          | Ghi ket | | Khong    |
          | qua:    | | tao log. |
          | renewed | +=========+
          | declined|      |
          | unreach-|      v
          | able    |   [(*)]
          | other   |
          +=========+
               |
               v
           [(*)]

  [opt: Member gia han tu dong (payment callback)]
  / System tu dong SET status='handled'
    SET outcome='renewed'
    KHI payment callback cho membership invoice thanh cong
```

Bang tom tat:

Trang thai | Su kien                           | Hanh dong                             | Trang thai moi
-----------|-----------------------------------|---------------------------------------|----------------
(bat dau)  | Timer quet + dieu kien dung       | INSERT RECOMMENDATIONS                | PENDING
PENDING    | Nhan vien xu ly + ghi ket qua     | INSERT MEMBER_CARE_LOGS, resolved_at  | HANDLED
PENDING    | Member tu gia han (payment OK)     | Tu dong mark handled, outcome=renewed | HANDLED
PENDING    | Gym Owner dismiss                  | UPDATE status='dismissed'             | DISMISSED
HANDLED    | (trang thai cuoi)                  |                                       | (ket thuc)
DISMISSED  | (trang thai cuoi)                  |                                       | (ket thuc)

Quy tac: BR-35 (6 rules), BR-36 (ghi MEMBER_CARE_LOGS), khong trung lap 7 ngay

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
  / Tinh       |           |   khong tinh streak
  duration,    |           |
  cong 50 XP,  |           |
  streak +1,   |           |
  cap nhat     |           |
  Passport     |           |
               v           v
      +============+   +================+
      |    DONE    |   |   CANCELLED    |
      |------------|   |----------------|
      | entry /    |   | entry / Khong  |
      | Hien popup |   | thay doi XP,  |
      | goi y san  |   | streak,       |
      | pham dinh  |   | Passport.     |
      | duong.     |   +================+
      | Cap nhat   |          |
      | Fitness    |          v
      | Passport.  |       [(*)]
      +============+
             |
             v
           [(*)]
```

Bang tom tat:

Trang thai  | Su kien             | Hanh dong                              | Trang thai moi
------------|---------------------|----------------------------------------|----------------
(bat dau)   | User bat dau tap    | Tao session, bat dau timer             | ACTIVE
ACTIVE      | User ket thuc       | Tinh duration, +50 XP, streak+1, Passport update | DONE
ACTIVE      | User huy            | Khong cong XP, khong tinh streak       | CANCELLED
DONE        | (trang thai cuoi)   |                                        | (ket thuc)
CANCELLED   | (trang thai cuoi)   |                                        | (ket thuc)

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
                     | / Tao user_challenge, progress = khoi tao
                     v
            +================+
            |  IN_PROGRESS   |
            |----------------|
            | do / Moi khi   |
            | user thuc hien |
            | hanh dong lien |
            | quan, cap nhat |
            | progress.      |
            +================+
               |           |
               |           |
  User dat     |           | Deadline den
  du dieu kien |           | [progress chua du]
  / Cong XP    |           | / Khong thuong
  va FitCoin   |           |
               v           v
      +============+   +================+
      |  COMPLETED |   |     FAILED     |
      |------------|   |----------------|
      | Cong XP +  |   | Gui thong bao  |
      | FitCoin.   |   | "Khong hoan    |
      | Tao post   |   |  thanh".       |
      | milestone. |   +================+
      +============+          |
             |                v
             v             [(*)]
           [(*)]
```

Bang tom tat:

Trang thai  | Su kien              | Dieu kien           | Hanh dong                        | Trang thai moi
------------|----------------------|---------------------|----------------------------------|----------------
(bat dau)   | User tham gia        |                     | Tao user_challenge               | IN_PROGRESS
IN_PROGRESS | User hanh dong       | Dat du dieu kien    | Cong XP + FitCoin, gui TB        | COMPLETED
IN_PROGRESS | Deadline het         | Chua du dieu kien   | Gui TB that bai                  | FAILED
COMPLETED   | (trang thai cuoi)    |                     |                                  | (ket thuc)
FAILED      | (trang thai cuoi)    |                     |                                  | (ket thuc)

========================================================================

## STATE DIAGRAM 6: USER ACCOUNT STATUS
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
            | (hoac OTP).    |
            +================+
               |           |
               |           |
  User xac     |           | Khong xac minh
  minh thanh   |           | trong 24h
  cong         |           | / Tu dong vo hieu
               v           v
      +============+     [(*)]
      |   ACTIVE   |
      |------------|
      | Full       |
      | access.    |
      +============+
        |     |
        |     |
  Gym Owner |     | User nhan
  dinh  |     | [Xoa tai khoan]
  chi   |     | / Xoa data
  (vi   |     |   sau 30 ngay
  pham) |     |
        v     v
  +==========+ +================+
  |SUSPENDED | |    DELETED     |
  |----------| |----------------|
  | Khong    | | Vo hieu JWT.  |
  | dang     | | Xoa data sau  |
  | nhap     | | 30 ngay.      |
  | duoc.    | +================+
  +==========+        |
     |     |          v
     |     |        [(*)]
  Gym Owner|  Gym Owner
  mo   |  xoa
  khoa |  vinh vien
     |     |
     v     v
  +======+ +=========+
  |ACTIVE| | DELETED |
  +======+ +=========+
```

Bang tom tat:

Trang thai  | Su kien                   | Hanh dong                         | Trang thai moi
------------|---------------------------|-----------------------------------|----------------
(bat dau)   | Dang ky                   | Tao tai khoan, gui email xac minh | UNVERIFIED
UNVERIFIED  | Xac minh thanh cong       | Kich hoat tai khoan               | ACTIVE
UNVERIFIED  | Khong xac minh trong 24h  | Vo hieu hoa                       | (ket thuc)
ACTIVE      | Gym Owner dinh chi        | Thong bao, khoa dang nhap         | SUSPENDED
ACTIVE      | User xoa tai khoan        | Vo hieu JWT, xoa data 30 ngay     | DELETED
SUSPENDED   | Gym Owner mo khoa         | Kich hoat lai                     | ACTIVE
SUSPENDED   | Gym Owner xoa             | Xoa vinh vien                     | DELETED

========================================================================

## STATE DIAGRAM 7: NUTRITION_ORDERS.STATUS
========================================================================

Muc dich: Mo ta cac trang thai cua mot don hang san pham dinh duong
          noi bo (ca POS lan pre-order).

Cac trang thai:
  PENDING    : Don pre-order da tao, cho nhan vien chuan bi.
  COMPLETED  : Don da hoan tat (POS = ngay completed; pre-order = da giao).
  CANCELLED  : Don bi huy (het hang, member huy truoc khi giao).

```
                    [*]
                     |
                     | Nhan vien tao don POS     -->  COMPLETED truc tiep
                     | Member dat pre-order      -->  PENDING truoc
                     |
         +-----------+-----------+
         |                       |
         | [order_type='pos']    | [order_type='preorder']
         |                       |
         v                       v
  +============+         +================+
  |  COMPLETED |         |    PENDING     |
  |  (ngay)    |         |----------------|
  |------------|         | Cho nhan vien  |
  | Inventory  |         | chuan bi va    |
  | da tru.    |         | giao san pham. |
  | Invoice    |         +================+
  | da tao.    |              |       |
  +============+              |       |
        |             Nhan vien|       | Member huy
        v             giao va  |       | hoac het
      [(*)]           xac      |       | hang
                      nhan     |       | / Hoan
                               v       v  tra ton kho
                         +=========+ +==========+
                         |COMPLETED| | CANCELLED |
                         |(preorder| |-----------|
                         |)        | | Hoan tra  |
                         +---------+ | Inventory.|
                               |     +==========+
                               v           |
                            [(*)]          v
                                        [(*)]
```

Bang tom tat:

Trang thai | Su kien                           | Hanh dong                         | Trang thai moi
-----------|-----------------------------------|-----------------------------------|----------------
(bat dau)  | POS sale                          | Tru Inventory, tao Invoice         | COMPLETED
(bat dau)  | Member pre-order                  | Tru qty_reserved                  | PENDING
PENDING    | Nhan vien giao + xac nhan         | Tru qty_in_stock, tao Invoice      | COMPLETED
PENDING    | Member huy / het hang             | Hoan tra qty_reserved              | CANCELLED
COMPLETED  | (trang thai cuoi)                 |                                    | (ket thuc)
CANCELLED  | (trang thai cuoi)                 |                                    | (ket thuc)

Quy tac: BR-12 (chi ban noi bo), BR-13 (ton kho canh bao)

========================================================================

## STATE DIAGRAM 6: MEMBER_PROGRAMS.STATUS
========================================================================

Muc dich: Mo ta vong doi cua mot chuong trinh tap ma member dang tham gia,
          tu luc bat dau cho den khi hoan thanh, bo cuoc, hoac tam dung.

Cac trang thai:
  ACTIVE     : Member dang tich cuc thuc hien chuong trinh.
  PAUSED     : Tam dung (member yeu cau hoac het hang goi tap).
  COMPLETED  : Hoan thanh 100% chuong trinh (completion_pct = 100).
  ABANDONED  : Bo cuoc (khong tap > 7 ngay -> trigger R7).

```
                    [*]
                     |
                     | Member chon chuong trinh + bat dau
                     | / Tao MEMBER_PROGRAMS, start_date = NOW()
                     v
           +==================+
           |     ACTIVE       |
           |------------------|
           | - Tap theo lich  |
           | - Nhan goi y     |
           |   hang ngay      |
           | - Theo doi %     |
           |   tien do        |
           +==================+
            |    |    |     |
            |    |    |     |
  Member    |    |    |     | > 7 ngay
  yeu cau   |    |    |     | khong tap
  tam dung  |    |    |     | / Tao R7 rec
            |    |    |     |
            v    |    |     v
  +=========+    |    | +==========+
  |  PAUSED |    |    | | ABANDONED|
  |---------|    |    | |----------|
  | - Khong |    |    | | - Tao    |
  |   nhan  |    |    | |   R7 rec |
  |   goi y |    |    | | - Staff  |
  |   hang  |    |    | |   care   |
  |   ngay  |    |    | |   queue  |
  +---------+    |    | +==========+
       |         |    |      |
  Member         |    |      v
  tiep tuc       |    |    [(*)]
       |         |    |
       v         |    | completion_pct = 100
     +======+    |    | / Tao R8 rec (upsell)
     |ACTIVE|    |    | / Award Milestone M42
     |(tiep)|    |    | / Celebrate UX
     +======+    |    |
                 |    v
  Member muon    | +===========+
  huy (explicit) | | COMPLETED |
  / ghi MEMBER_  | |-----------|
    PROGRAMS     | | - R8 rec  |
    abandoned    | | - Share   |
                 | |   Card    |
                 | |   offer   |
                 | +===========+
                 |      |
                 v      v
               [(*)]  [(*)]
```

Bang tom tat:
Trang thai | Su kien                              | Hanh dong                    | Trang thai moi
-----------|--------------------------------------|------------------------------|---------------
(bat dau)  | Member chon CT + bat dau             | Tao MEMBER_PROGRAMS          | ACTIVE
ACTIVE     | > 7 ngay khong tap                   | Tao R7 recommendation        | ABANDONED
ACTIVE     | completion_pct dat 100%               | Tao R8 rec + M42 milestone   | COMPLETED
ACTIVE     | Member yeu cau tam dung               | Ghi log                      | PAUSED
PAUSED     | Member tiep tuc                       | cap nhat status              | ACTIVE
ABANDONED  | (trang thai cuoi)                     |                              | (ket thuc)
COMPLETED  | (trang thai cuoi)                     |                              | (ket thuc)

Quy tac: BR-41 (tao), BR-45 (R7/R8), BR-46 (milestone M42)

========================================================================

## STATE DIAGRAM 7: TRANSFORMATION_GOALS.STATUS
========================================================================

Muc dich: Mo ta vong doi cua muc tieu ca nhan, tu luc tao cho den khi
          dat duoc, bo cuoc, hoac het han.

Cac trang thai:
  ACTIVE   : Muc tieu dang duoc theo duoi, co MEMBER_PROGRAMS active kem.
  ACHIEVED : Da dat duoc muc tieu (target_value dat duoc hoac member xac nhan).
  ABANDONED: Member bo cuoc muc tieu.
  EXPIRED  : Het han deadline ma chua dat duoc.

```
                    [*]
                     |
                     | Member hoan thanh Goal Onboarding
                     | / Tao TRANSFORMATION_GOALS
                     v
           +==================+
           |     ACTIVE       |
           |------------------|
           | - Theo doi       |
           |   tien do        |
           | - Hien thi       |
           |   M30/M31        |
           |   milestone      |
           +==================+
            |      |      |
            |      |      |
  Member xac|      |      | Deadline
  nhan dat  |      |      | da qua
  muc tieu  |      |      | [target chua dat]
  (explicit)|      |      |
            v      |      v
  +=========+      |  +=========+
  | ACHIEVED|      |  | EXPIRED |
  |---------|      |  |---------|
  | - Award |      |  | - Push  |
  |   M32   |      |  |   noti  |
  |   mile  |      |  | - Goi y |
  |   stone |      |  |   tao   |
  | - Goi y |      |  |   goal  |
  |   goal  |      |  |   moi   |
  |   moi   |      |  +---------+
  +---------+      |       |
       |           |       v
       v           v     [(*)]
     [(*)]    +==========+
              | ABANDONED|
              |----------|
              | Khong co |
              | hanh dong|
              | he thong |
              +==========+
                   |
                   v
                 [(*)]
```

Quy tac: BR-41 (tao goal), BR-46 (milestone M30/M31/M32)

========================================================================
KET THUC FILE 13
========================================================================
