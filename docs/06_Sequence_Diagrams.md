# 06. BIEU DO TRINH TU
# (Sequence Diagrams)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 18/06/2026 (Cap nhat: Dinh huong lai Gym Management System)

========================================================================

Giai thich ky hieu UML Sequence Diagram:

  Actor/Object:    Ten ben trong [ ] la ten participant
  Lifeline:        |  Duong ke dung tu moi participant
  Message:         ------> Duong ke gay
  Return:          <------ Duong ke gay (phan hoi)
  Self call:       /--\   /--/  Vong lap noi bo
  Alt/Opt/Loop:    [ alt ], [ opt ], [ loop ] Khung ky hieu
  Note:            // Ghi chu ben canh

========================================================================

## SEQUENCE DIAGRAM 1: MEMBER CHECK-IN BANG QR
========================================================================

Muc dich: Mo ta giao tiep giua cac thanh phan khi Member check-in tai
          phong tap de xac nhan goi tap va nhan cap phat tien ich.

Participants:
  [Member]  [FE (Browser)]  [BE (Express)]  [DB (MySQL)]  [Staff Terminal]

```
[Member]              [FE (Browser)]         [BE (Express)]            [DB (MySQL)]
   |                        |                      |                       |
   |-- Xuat trinh QR -----> |                      |                       |
   |   (hoac nhap SDT)      |                      |                       |
   |                        |                      |                       |
   |                        |-- POST /check-ins --> |                       |
   |                        |   {user_id or phone}  |                       |
   |                        |                      |-- SELECT * FROM ----> |
   |                        |                      |   USERS WHERE ...     |
   |                        |                      |                       |-- Return user
   |                        |                      |<---------------------- |
   |                        |                      |                       |
   |                        |                      |-- SELECT * FROM ----> |
   |                        |                      |   GYM_MEMBERSHIPS     |
   |                        |                      |   WHERE user_id=?     |
   |                        |                      |   AND status='active' |
   |                        |                      |   AND end_date>=NOW() |
   |                        |                      |                       |-- Return membership
   |                        |                      |<---------------------- |
   |                        |                      |                       |
   |   [ alt: goi tap hop le ]                     |                       |
   |                        |                      |                       |
   |                        |                      |-- INSERT CHECK_INS -> |
   |                        |                      |   (user_id,           |
   |                        |                      |    membership_id,     |
   |                        |                      |    checked_in_at)     |
   |                        |                      |                       |-- Return check_in_id
   |                        |                      |<---------------------- |
   |                        |                      |                       |
   |                        |                      |-- SELECT plan_name -> |
   |                        |                      |   FROM MEMBERSHIP_    |
   |                        |                      |   PLANS WHERE id=?    |
   |                        |                      |                       |-- Return plan
   |                        |                      |<---------------------- |
   |                        |                      |                       |
   |                        |<--- 200 OK ----------|                       |
   |                        |   {check_in_id,       |                       |
   |                        |    plan_name,         |                       |
   |                        |    amenities: []}     |                       |
   |                        |                      |                       |
   |<--- Hien thi xac nhan--|                      |                       |
   |     "Check-in thanh    |                      |                       |
   |      cong! Goi: ..."   |                      |                       |
   |                        |                      |                       |
   |   [ alt: goi tap het han ]                    |                       |
   |                        |                      |                       |
   |                        |<--- 403 Forbidden ---|                       |
   |                        |   {message: "Goi tap da het han",            |
   |                        |    renewal_url: "/membership"}               |
   |                        |                      |                       |
   |<--- Hien thi nut ------|                      |                       |
   |     "Gia han ngay"     |                      |                       |
   |                        |                      |                       |
   |                        |                      |-- UPDATE ------------> |
   |                        |                      |   USERS.current_streak |
   |                        |                      |   USERS.xp_total       |
   |                        |                      |   (+10 XP - BR-21)     |
   |                        |                      |                        |-- Return ok
   |                        |                      |<----------------------- |
   |                        |                      |                       |
   |   [Member Screen] <--- Hien thi check-in thanh cong + streak hien tai|
   |                                                                       |
```

Quy tac nghiep vu: BR-09 (check-in toi da 1 lan/ngay), BR-21 (XP earn), BR-23 (streak)

========================================================================

## SEQUENCE DIAGRAM 2: GIA HAN GOI TAP ONLINE (CO THANH TOAN)
========================================================================

Muc dich: Mo ta luong du lieu day du khi Member gia han goi tap, bao gom
          xu ly thanh toan va cap nhat he thong.

Participants:
  [Member]  [FE]  [BE]  [DB]  [VNPay/MoMo]  [Notification Service]

```
[Member]        [FE]              [BE]              [DB]          [VNPay/MoMo]  [Notify]
   |             |                 |                  |                  |           |
   |-- /membership ->|             |                  |                  |           |
   |             |                 |                  |                  |           |
   |             |-- GET /membership/current --> |    |                  |           |
   |             |                 |-- SELECT ------> |                  |           |
   |             |                 |   GYM_MEMBERSHIPS|                  |           |
   |             |                 |   MEMBERSHIP_PLANS|                 |           |
   |             |                 |<-- Return -------|                  |           |
   |             |<-- 200 {plan, end_date, options} --|                  |           |
   |<-- Hien thi |                 |                  |                  |           |
   |    thong tin goi + option gia han               |                  |           |
   |             |                 |                  |                  |           |
   |-- Chon goi + phuong tien ->   |                  |                  |           |
   |             |-- POST /membership/renew ----> |   |                  |           |
   |             |   {plan_id, duration, method}   |   |                  |           |
   |             |                 |                  |                  |           |
   |             |                 |-- INSERT INVOICES -> |              |           |
   |             |                 |   status='pending'  |              |           |
   |             |                 |<-- Return invoice_id -|             |           |
   |             |                 |                  |                  |           |
   |             |                 |-- Tao redirect URL -> |             |           |
   |             |<-- 200 {payment_url, invoice_id} -|  |               |           |
   |             |                 |                  |                  |           |
   |-- Redirect den VNPay -------->|                  |                  |           |
   |             |                 |                  |                  |           |
   |                      [Nguoi dung thanh toan tren VNPay]            |           |
   |             |                 |                  |                  |           |
   |             |                 |                  |        Callback POST         |
   |             |                 |<-- /payment/callback (HMAC signed) -|           |
   |             |                 |                  |                  |           |
   |             |                 |-- Xac thuc HMAC--|                  |           |
   |             |                 |   signature      |                  |           |
   |             |                 |                  |                  |           |
   |   [ alt: thanh toan thanh cong ]                |                  |           |
   |             |                 |                  |                  |           |
   |             |                 |-- UPDATE GYM_MEMBERSHIPS ---------->|           |
   |             |                 |   SET end_date = end_date + duration|           |
   |             |                 |   SET status='active'               |           |
   |             |                 |<-- Return OK ----|                  |           |
   |             |                 |                  |                  |           |
   |             |                 |-- INSERT MEMBERSHIP_HISTORY -> |   |           |
   |             |                 |   (change_type='renewal')       |   |           |
   |             |                 |<-- OK ------------|                  |           |
   |             |                 |                  |                  |           |
   |             |                 |-- UPDATE INVOICES SET status='paid' |           |
   |             |                 |<-- OK ------------|                  |           |
   |             |                 |                  |                  |           |
   |             |                 |-- +50 FitCoin (FITCOIN_TRANSACTIONS) -> |       |
   |             |                 |<-- OK ------------|                  |           |
   |             |                 |                  |                  |           |
   |             |                 |-- Resolve RECOMMENDATIONS --------> |           |
   |             |                 |   WHERE user_id=? AND               |           |
   |             |                 |   type='renew_reminder'             |           |
   |             |                 |<-- OK ------------|                  |           |
   |             |                 |                  |                  |           |
   |             |                 |-- INSERT NOTIFICATIONS -----------> |   -- Push |
   |             |                 |   "Gia han thanh cong! Het han: ..." |           |
   |             |<-- 200 {success, new_end_date} ----|                  |           |
   |<-- Hien thi "Gia han thanh cong!" ->             |                  |           |
   |             |                 |                  |                  |           |
   |   [ alt: thanh toan that bai ]                  |                  |           |
   |             |                 |                  |                  |           |
   |             |                 |-- UPDATE INVOICES SET status='failed' -> |      |
   |             |<-- 400 {error: "Thanh toan khong thanh cong"} --------|           |
   |<-- Hien thi thong bao loi + nut thu lai -------->|                  |           |
   |             |                 |                  |                  |           |
```

Quy tac nghiep vu: BR-06 (ghi MEMBERSHIP_HISTORY), BR-38 (idempotency), BR-28 (+50 FitCoin)

========================================================================

## SEQUENCE DIAGRAM 3: BAN HANG DINH DUONG (POS)
========================================================================

Muc dich: Mo ta luong nhan vien su dung POS de ban san pham cho Member.

Participants:
  [Staff (Gym Owner)]  [POS Terminal (FE)]  [BE]  [DB]

```
[Staff]          [POS Terminal]            [BE]              [DB]
   |                   |                    |                  |
   |-- Mo POS -------> |                    |                  |
   |                   |-- GET /nutrition/products ----------> |
   |                   |    (loc: con hang) |-- SELECT ------> |
   |                   |                    |   WHERE qty > 0  |
   |                   |                    |<-- Return list ---|
   |                   |<-- 200 [products]  |                  |
   |                   |                    |                  |
   |-- Tim kiem member -> |                 |                  |
   |                   |-- GET /members/search?q=SDT -------> |
   |                   |                    |-- SELECT USERS ->|
   |                   |                    |<-- Return member -|
   |                   |<-- 200 {member}    |                  |
   |<-- Hien thi ten member + goi tap ----->|                  |
   |                   |                    |                  |
   |-- Chon SP + SL --> |                   |                  |
   |                   |-- POST /nutrition/check-stock --> |   |
   |                   |   {product_id, qty}|               |   |
   |                   |                    |-- SELECT qty FROM INVENTORY -> |
   |                   |                    |<-- Return qty ----|
   |   [ alt: du hang ]|                    |                  |
   |                   |<-- 200 {available: true, total_price}  |
   |<-- Hien thi tong tien ----------------->|                  |
   |                   |                    |                  |
   |   [ opt: dung FitCoin ]               |                  |
   |-- Nhap so FitCoin -> |                 |                  |
   |                   |<-- Hien thi gia sau giam (max 50%) ---|
   |                   |                    |                  |
   |-- Xac nhan don --> |                   |                  |
   |                   |-- POST /nutrition/orders -----------> |
   |                   |   {member_id,      |-- INSERT ------> |
   |                   |    items: [...],   |   NUTRITION_ORDERS|
   |                   |    fitcoin_used}   |   NUTRITION_ORDER_ITEMS
   |                   |                    |<-- Return order_id|
   |                   |                    |                  |
   |                   |                    |-- UPDATE INVENTORY -> |
   |                   |                    |   SET qty = qty - x  |
   |                   |                    |<-- OK ------------|
   |                   |                    |                  |
   |                   |                    |-- INSERT INVOICES -> |
   |                   |                    |   service_type='nutrition'|
   |                   |                    |<-- OK ------------|
   |                   |                    |                  |
   |                   |   [ opt: ton kho <= low_stock_threshold ]
   |                   |                    |-- INSERT NOTIFICATIONS -> |
   |                   |                    |   (canh bao ton kho thap) |
   |                   |                    |<-- OK ------------|
   |                   |                    |                  |
   |                   |<-- 200 {order_id, receipt} ---------|
   |<-- Hien thi hoa don xac nhan ----------|                  |
   |                   |                    |                  |
   |   [ alt: het hang ]|                   |                  |
   |                   |<-- 400 {error: "San pham het hang"}  |
   |<-- Hien thi canh bao ------------------>|                  |
   |                   |                    |                  |
```

Quy tac nghiep vu: BR-12 (chi ban noi bo), BR-13 (ton kho canh bao), BR-30 (FitCoin toi da 50%)

========================================================================

## SEQUENCE DIAGRAM 4: AI RECOMMENDATION TAO VA XU LY
========================================================================

Muc dich: Mo ta luong timer tu dong tao RECOMMENDATIONS va cach nhan vien
          xu ly cham soc Member.

Participants:
  [TIMER (Cron)]  [BE]  [DB]  [Gym Owner FE]  [Notification Service]

```
[TIMER]              [BE]                  [DB]              [Owner FE]     [Notify]
   |                  |                     |                    |               |
   | 06:00 trigger    |                     |                    |               |
   |-- Chay job ----> |                     |                    |               |
   |                  |                     |                    |               |
   |                  |-- SELECT * FROM --> |                    |               |
   |                  |   GYM_MEMBERSHIPS   |                    |               |
   |                  |   WHERE status='active'                  |               |
   |                  |<-- Return all members |                  |               |
   |                  |                     |                    |               |
   |                  |  [ loop: moi member ]                   |               |
   |                  |                     |                    |               |
   |                  |-- Check dieu kien 1: het han <= 7 ngay -> |             |
   |                  |-- Check dieu kien 2: inactive >= 14 ngay -> |           |
   |                  |-- Check dieu kien 3: upsell eligible -> |               |
   |                  |<-- Return boolean flags -|              |               |
   |                  |                     |                    |               |
   |                  |  [ opt: co dieu kien dung ]             |               |
   |                  |                     |                    |               |
   |                  |-- Kiem tra trung lap: SELECT FROM ----> |               |
   |                  |   RECOMMENDATIONS WHERE user_id=?        |               |
   |                  |   AND type=? AND created_at >= NOW()-7d  |               |
   |                  |<-- Return count -----|                   |               |
   |                  |                     |                    |               |
   |                  |  [ alt: chua co recommendation trong 7 ngay ]           |
   |                  |                     |                    |               |
   |                  |-- INSERT RECOMMENDATIONS ----> |         |               |
   |                  |   (user_id, type,   |          |         |               |
   |                  |    priority,        |          |         |               |
   |                  |    status='pending',|          |         |               |
   |                  |    suggestion_text) |          |         |               |
   |                  |<-- Return rec_id ---|          |         |               |
   |                  |                     |          |         |               |
   |                  |  [ opt: het han <= 3 ngay: gui thong bao cho member ]   |
   |                  |-- INSERT NOTIFICATIONS -> |    |         |               |
   |                  |<-- OK --------------|      |    |         |               |
   |                  |                     |          |         |-- Push notif ->|
   |                  |                     |          |         |               |
   |  [ end loop ]    |                     |          |         |               |
   |                  |                     |          |         |               |
   | --- Nhan vien mo care queue ---        |                    |               |
   |                  |                     |                    |               |
   |                  |<-- GET /care-queue ----------------------|               |
   |                  |-- SELECT RECOMMENDATIONS -> |            |               |
   |                  |   JOIN USERS WHERE status='pending'      |               |
   |                  |   ORDER BY priority DESC                 |               |
   |                  |<-- Return list ------|                   |               |
   |                  |-- 200 [{rec, member_name, reason, action_hint}] ------> |
   |                  |                     |                    |               |
   |                  |     <-- Staff chon 1 member + ghi ket qua               |
   |                  |<-- POST /care-queue/:rec_id/handle ------->             |
   |                  |   {outcome:'renewed', notes:'Da goi dien, member dong y'}
   |                  |                     |                    |               |
   |                  |-- INSERT MEMBER_CARE_LOGS ---> |         |               |
   |                  |<-- OK --------------|          |         |               |
   |                  |                     |          |         |               |
   |                  |-- UPDATE RECOMMENDATIONS ----> |         |               |
   |                  |   SET status='handled',        |         |               |
   |                  |   resolved_at=NOW()            |         |               |
   |                  |<-- OK --------------|          |         |               |
   |                  |-- 200 {success} --------------------------->             |
   |                  |                     |                    |               |
   |                  |                     |   <-- Hien thi "Da ghi nhan" ---> |
   |                  |                     |                    |               |
```

Quy tac nghiep vu: BR-35 (6 rules), BR-36 (ghi MEMBER_CARE_LOGS), khong tao trung lap trong 7 ngay

========================================================================
KET THUC FILE 06
========================================================================
