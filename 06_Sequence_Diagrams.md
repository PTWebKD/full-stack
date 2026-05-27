# 06. BIEU DO TUAN TU
# (Sequence Diagrams)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 11/05/2026

========================================================================

Giai thich ky hieu:

  Cot doc  : Moi cot dai dien 1 doi tuong (actor, component, database).
  ---->    : Thong diep dong bo (gui va doi phan hoi).
  <----    : Thong diep tra ve.
  ---->|   : Thong diep tu xu ly (doi tuong gui cho chinh no).
  [alt]    : Khoi lua chon (tuong duong if/else).
  [loop]   : Khoi lap (tuong duong vong for/while).
  [opt]    : Khoi tuy chon (chi thuc hien khi dieu kien dung).

  Cac doi tuong thuong gap:
  - Actor (nguoi dung)
  - UI (giao dien React)
  - API (server Node.js/Express)
  - DB (database)
  - Service (dich vu phu nhu OTP, Payment, Suggestion)

========================================================================

## SEQUENCE DIAGRAM 1: MEMBER DAT FOOD (HAPPY PATH)
========================================================================

Muc dich: Mo ta tuong tac giua cac thanh phan khi Member dat food,
          tu luc xem mon den khi nhan xac nhan.

```
  Member          UI (React)        API (Express)       Database          Vendor
    |                 |                   |                  |                |
    |                 |                   |                  |                |
    |--Truy cap       |                   |                  |                |
    |  /food--------->|                   |                  |                |
    |                 |                   |                  |                |
    |                 |--GET /api/foods-->|                  |                |
    |                 |                   |                  |                |
    |                 |                   |--SELECT * FROM   |                |
    |                 |                   |  food_products   |                |
    |                 |                   |  WHERE           |                |
    |                 |                   |  is_available    |                |
    |                 |                   |  = true--------->|                |
    |                 |                   |                  |                |
    |                 |                   |<--Danh sach food-|                |
    |                 |                   |                  |                |
    |                 |<--JSON food list--|                  |                |
    |                 |                   |                  |                |
    |<--Hien thi      |                   |                  |                |
    |   danh sach-----|                   |                  |                |
    |                 |                   |                  |                |
    |                 |                   |                  |                |
    |--Nhan [+]       |                   |                  |                |
    |  tren card----->|                   |                  |                |
    |                 |                   |                  |                |
    |                 |--addToCart()       |                  |                |
    |                 |  (luu vao React   |                  |                |
    |                 |   state hoac      |                  |                |
    |                 |   localStorage)-->|                  |                |
    |                 |                   |                  |                |
    |<--"Da them      |                   |                  |                |
    |   Mon A"--------|                   |                  |                |
    |                 |                   |                  |                |
    |<--Cap nhat icon |                   |                  |                |
    |   gio hang------|                   |                  |                |
    |                 |                   |                  |                |
    |                 |                   |                  |                |
    |   [loop] Them nhieu mon khac       |                  |                |
    |   |  (lap lai Nhan [+] o tren)     |                  |                |
    |   [end loop]                       |                  |                |
    |                 |                   |                  |                |
    |                 |                   |                  |                |
    |--Mo trang       |                   |                  |                |
    |  Cart---------->|                   |                  |                |
    |                 |                   |                  |                |
    |                 |--getCart()         |                  |                |
    |                 |  (doc tu state)-->|                  |                |
    |                 |                   |                  |                |
    |<--Hien thi cart |                   |                  |                |
    |   (ten, qty,    |                   |                  |                |
    |    gia, tong)---|                   |                  |                |
    |                 |                   |                  |                |
    |                 |                   |                  |                |
    |  [opt] User thay doi qty/size      |                  |                |
    |  |                |                 |                  |                |
    |  |--Thay doi      |                 |                  |                |
    |  |  qty/size----->|                 |                  |                |
    |  |                |--updateCart()   |                  |                |
    |  |                |  tinh lai tong->|                  |                |
    |  |<--Tong tien moi|                 |                  |                |
    |  [end opt]                         |                  |                |
    |                 |                   |                  |                |
    |                 |                   |                  |                |
    |--Nhan           |                   |                  |                |
    |  [Thanh toan]-->|                   |                  |                |
    |                 |                   |                  |                |
    |                 |--POST /api/orders |                  |                |
    |                 |  {items, address, |                  |                |
    |                 |   delivery_time,  |                  |                |
    |                 |   payment_method, |                  |                |
    |                 |   JWT token}----->|                  |                |
    |                 |                   |                  |                |
    |                 |                   |--Verify JWT----->|                |
    |                 |                   |                  |                |
    |                 |                   |--INSERT INTO     |                |
    |                 |                   |  food_orders     |                |
    |                 |                   |  (status=        |                |
    |                 |                   |   pending)------>|                |
    |                 |                   |                  |                |
    |                 |                   |<--order_id------|                |
    |                 |                   |                  |                |
    |                 |                   |--UPDATE users    |                |
    |                 |                   |  SET xp_total    |                |
    |                 |                   |  += 20----------->|                |
    |                 |                   |                  |                |
    |                 |                   |--Gui notification|                |
    |                 |                   |  "Don moi #123"----------------->|
    |                 |                   |                  |                |
    |                 |<--{success: true, |                  |                |
    |                 |    order_id}------|                  |                |
    |                 |                   |                  |                |
    |                 |--clearCart()       |                  |                |
    |                 |                   |                  |                |
    |<--"Dat hang     |                   |                  |                |
    |   thanh cong    |                   |                  |                |
    |   #123"---------|                   |                  |                |
```

========================================================================

## SEQUENCE DIAGRAM 2: GUEST CHECKOUT BANG OTP
========================================================================

Muc dich: Mo ta tuong tac khi Guest chua dang nhap nhung muon
          dat hang, su dung OTP de xac thuc.

```
  Guest           UI (React)        API (Express)       OTP Service      Database
    |                 |                   |                  |                |
    |--Nhan           |                   |                  |                |
    |  [Thanh toan]-->|                   |                  |                |
    |                 |                   |                  |                |
    |                 |--Kiem tra: co JWT  |                  |                |
    |                 |  trong header?    |                  |                |
    |                 |  => KHONG         |                  |                |
    |                 |                   |                  |                |
    |<--Hien thi form |                   |                  |                |
    |   "Nhap SDT     |                   |                  |                |
    |    de dat hang"-|                   |                  |                |
    |                 |                   |                  |                |
    |--Nhap SDT       |                   |                  |                |
    |  0912345678---->|                   |                  |                |
    |                 |                   |                  |                |
    |                 |--POST /api/auth/  |                  |                |
    |                 |  send-otp         |                  |                |
    |                 |  {phone:          |                  |                |
    |                 |   0912345678}---->|                  |                |
    |                 |                   |                  |                |
    |                 |                   |--Validate SDT    |                |
    |                 |                   |  (format VN)---->|                |
    |                 |                   |                  |                |
    |                 |                   |--Gen OTP:        |                |
    |                 |                   |  847291          |                |
    |                 |                   |  (het han 5p)--->|                |
    |                 |                   |                  |                |
    |                 |                   |--Luu OTP vao     |                |
    |                 |                   |  cache (Redis    |                |
    |                 |                   |  hoac memory)--->|                |
    |                 |                   |                  |                |
    |                 |                   |--Gui SMS-------->|                |
    |                 |                   |                  |                |
    |                 |                   |<--SMS sent OK----|                |
    |                 |                   |                  |                |
    |                 |<--{success: true, |                  |                |
    |                 |   "Da gui OTP"}---|                  |                |
    |                 |                   |                  |                |
    |<--Hien thi form |                   |                  |                |
    |   nhap OTP------|                   |                  |                |
    |                 |                   |                  |                |
    |--Nhap OTP       |                   |                  |                |
    |  847291-------->|                   |                  |                |
    |                 |                   |                  |                |
    |                 |--POST /api/auth/  |                  |                |
    |                 |  verify-otp       |                  |                |
    |                 |  {phone, otp}---->|                  |                |
    |                 |                   |                  |                |
    |                 |                   |--So sanh OTP---->|                |
    |                 |                   |  voi cache       |                |
    |                 |                   |                  |                |
    |                 |                   |  [alt] OTP dung va chua het han  |
    |                 |                   |  |                |               |
    |                 |                   |  |--Gen temp_token|               |
    |                 |                   |  |  (JWT 30 phut) |               |
    |                 |                   |  |                |               |
    |                 |                   |  [alt] OTP sai                   |
    |                 |                   |  |--Tang bo dem   |               |
    |                 |                   |  |  attempt += 1  |               |
    |                 |                   |  |                |               |
    |                 |                   |  |  [alt] attempt >= 3            |
    |                 |                   |  |  |--Khoa 15p   |               |
    |                 |                   |  |  [end alt]     |               |
    |                 |                   |  [end alt]        |               |
    |                 |                   |                  |                |
    |                 |<--{temp_token}----|                  |                |
    |                 |                   |                  |                |
    |                 |                   |                  |                |
    |                 |   (Tiep tuc checkout voi temp_token) |                |
    |                 |                   |                  |                |
    |                 |--POST /api/orders |                  |                |
    |                 |  {items, address, |                  |                |
    |                 |   temp_token,     |                  |                |
    |                 |   guest_phone}-->|                  |                |
    |                 |                   |                  |                |
    |                 |                   |--Verify temp_token               |
    |                 |                   |                  |                |
    |                 |                   |--INSERT INTO     |                |
    |                 |                   |  food_orders     |                |
    |                 |                   |  (user_id=NULL,  |                |
    |                 |                   |   guest_phone=   |                |
    |                 |                   |   0912345678,    |                |
    |                 |                   |   status=        |                |
    |                 |                   |   pending)------>|                |
    |                 |                   |                  |                |
    |                 |                   |<--order_id------|                |
    |                 |                   |                  |                |
    |                 |<--{success,       |                  |                |
    |                 |    order_id}------|                  |                |
    |                 |                   |                  |                |
    |<--"Dat hang     |                   |                  |                |
    |   thanh cong"---|                   |                  |                |
```

========================================================================

## SEQUENCE DIAGRAM 3: AI FOOD SUGGESTION SAU BUOI TAP
========================================================================

Muc dich: Mo ta luong xu ly khi Member ket thuc buoi tap va he thong
          tu dong goi y 3 mon an phu hop.

```
  Member          UI (React)        API (Express)       Suggestion        Database
                                                        Engine
    |                 |                   |                  |                |
    |--Nhan [Ket thuc |                   |                  |                |
    |  buoi tap]----->|                   |                  |                |
    |                 |                   |                  |                |
    |                 |--POST /api/       |                  |                |
    |                 |  sessions/:id/    |                  |                |
    |                 |  complete-------->|                  |                |
    |                 |                   |                  |                |
    |                 |                   |--UPDATE sessions |                |
    |                 |                   |  SET status=done,|                |
    |                 |                   |  duration=       |                |
    |                 |                   |  tinh tu start-->|                |
    |                 |                   |                  |                |
    |                 |                   |--UPDATE users    |                |
    |                 |                   |  SET xp += 50,   |                |
    |                 |                   |  streak += 1---->|                |
    |                 |                   |                  |                |
    |                 |                   |--UPDATE fitness_ |                |
    |                 |                   |  passport       |                |
    |                 |                   |  (total_sessions,|                |
    |                 |                   |   total_volume)->|                |
    |                 |                   |                  |                |
    |                 |                   |                  |                |
    |                 |                   |--SELECT          |                |
    |                 |                   |  muscle_group    |                |
    |                 |                   |  FROM exercise_  |                |
    |                 |                   |  logs WHERE      |                |
    |                 |                   |  session_id      |                |
    |                 |                   |  = :id---------->|                |
    |                 |                   |                  |                |
    |                 |                   |<--muscle_groups: |                |
    |                 |                   |   [chest, arms]--|                |
    |                 |                   |                  |                |
    |                 |                   |--Goi suggest()   |                |
    |                 |                   |  {muscles:       |                |
    |                 |                   |   [chest, arms]}>|                |
    |                 |                   |                  |                |
    |                 |                   |           Xu ly trong Engine:    |
    |                 |                   |           1. Lay nhom co chinh   |
    |                 |                   |              = chest (nhieu nhat)|
    |                 |                   |           2. Tra bang mapping:   |
    |                 |                   |              chest -> protein    |
    |                 |                   |              = high, carb =     |
    |                 |                   |              medium, fat = low  |
    |                 |                   |           3. Tao query:         |
    |                 |                   |                  |                |
    |                 |                   |                  |--SELECT *     |
    |                 |                   |                  |  FROM food_   |
    |                 |                   |                  |  products     |
    |                 |                   |                  |  WHERE        |
    |                 |                   |                  |  is_available |
    |                 |                   |                  |  = true       |
    |                 |                   |                  |  ORDER BY     |
    |                 |                   |                  |  protein_g    |
    |                 |                   |                  |  DESC         |
    |                 |                   |                  |  LIMIT 3----->|
    |                 |                   |                  |               |
    |                 |                   |                  |<--3 foods----|
    |                 |                   |                  |               |
    |                 |                   |<--suggestions:   |               |
    |                 |                   |   [{name, price, |               |
    |                 |                   |     calories,    |               |
    |                 |                   |     protein_g,   |               |
    |                 |                   |     image}       |               |
    |                 |                   |    x 3]----------|               |
    |                 |                   |                  |               |
    |                 |<--{session_stats, |                  |               |
    |                 |   suggestions}----|                  |               |
    |                 |                   |                  |               |
    |<--Hien thi:     |                   |                  |               |
    |   "XP +50"      |                   |                  |               |
    |   "Streak: 12"  |                   |                  |               |
    |   Popup goi y:  |                   |                  |               |
    |   "Vua tap nguc!|                   |                  |               |
    |    3 mon goi y:"|                   |                  |               |
    |   [Mon 1][Mon 2]|                   |                  |               |
    |   [Mon 3]       |                   |                  |               |
    |   [Dat ngay]    |                   |                  |               |
    |   [Bo qua]------|                   |                  |               |
    |                 |                   |                  |               |
    |                 |                   |                  |               |
    |  [alt] User nhan [Dat ngay]        |                  |               |
    |  |                |                 |                  |               |
    |  |--Nhan          |                 |                  |               |
    |  |  [Dat ngay]--->|                 |                  |               |
    |  |                |--addToCart()    |                  |               |
    |  |                |  (3 mon)       |                  |               |
    |  |                |--redirect      |                  |               |
    |  |                |  /cart         |                  |               |
    |  |<--Chuyen sang  |                 |                  |               |
    |  |   trang Cart---|                 |                  |               |
    |  |                |                 |                  |               |
    |  [alt] User nhan [Bo qua]          |                  |               |
    |  |                |                 |                  |               |
    |  |--Nhan          |                 |                  |               |
    |  |  [Bo qua]----->|                 |                  |               |
    |  |                |--Dong popup    |                  |               |
    |  |<--O lai trang  |                 |                  |               |
    |  |   session------|                 |                  |               |
    |  [end alt]                         |                  |               |
```

========================================================================

## SEQUENCE DIAGRAM 4: DANG BAN GEAR + GEN GEAR ID
========================================================================

Muc dich: Mo ta tuong tac khi Member dang thiet bi gym len Gear Hub.

```
  Member          UI (React)        API (Express)       QR Service       Database
    |                 |                   |                  |                |
    |--Truy cap       |                   |                  |                |
    |  /gear/sell---->|                   |                  |                |
    |                 |                   |                  |                |
    |<--Hien thi form |                   |                  |                |
    |   dang ban------|                   |                  |                |
    |                 |                   |                  |                |
    |--Nhap thong tin:|                   |                  |                |
    |  ten, danh muc, |                   |                  |                |
    |  gia, condition,|                   |                  |                |
    |  ghi chu,       |                   |                  |                |
    |  upload anh---->|                   |                  |                |
    |                 |                   |                  |                |
    |                 |--Client-side      |                  |                |
    |                 |  validate:        |                  |                |
    |                 |  ten != rong,     |                  |                |
    |                 |  gia > 0,         |                  |                |
    |                 |  anh >= 2-------->|                  |                |
    |                 |                   |                  |                |
    |--Nhan           |                   |                  |                |
    |  [Dang ban]---->|                   |                  |                |
    |                 |                   |                  |                |
    |                 |--Upload anh       |                  |                |
    |                 |  (Cloudinary/     |                  |                |
    |                 |   Firebase)------>|                  |                |
    |                 |                   |                  |                |
    |                 |<--image_urls------|                  |                |
    |                 |                   |                  |                |
    |                 |--POST /api/gear   |                  |                |
    |                 |  {name, category, |                  |                |
    |                 |   price, condition|                  |                |
    |                 |   notes, images,  |                  |                |
    |                 |   listing_type}-->|                  |                |
    |                 |                   |                  |                |
    |                 |                   |--Server-side     |                |
    |                 |                   |  validate------->|                |
    |                 |                   |                  |                |
    |                 |                   |--Gen Gear ID:    |                |
    |                 |                   |  random(4) +     |                |
    |                 |                   |  timestamp(4)    |                |
    |                 |                   |  = GEAR-K7X2-    |                |
    |                 |                   |  3841             |                |
    |                 |                   |                  |                |
    |                 |                   |--Gen QR Code---->|                |
    |                 |                   |  (url: /gear/    |                |
    |                 |                   |   GEAR-K7X2-3841)|                |
    |                 |                   |                  |                |
    |                 |                   |<--qr_image_url---|                |
    |                 |                   |                  |                |
    |                 |                   |--INSERT INTO     |                |
    |                 |                   |  gear_items----->|                |
    |                 |                   |                  |                |
    |                 |                   |--INSERT INTO     |                |
    |                 |                   |  gear_lifecycle  |                |
    |                 |                   |  (action=listed, |                |
    |                 |                   |   owner=user,    |                |
    |                 |                   |   condition,     |                |
    |                 |                   |   notes,         |                |
    |                 |                   |   photos)------->|                |
    |                 |                   |                  |                |
    |                 |                   |<--OK------------|                |
    |                 |                   |                  |                |
    |                 |<--{gear_id,       |                  |                |
    |                 |    qr_url}--------|                  |                |
    |                 |                   |                  |                |
    |<--"Dang thanh   |                   |                  |                |
    |   cong!         |                   |                  |                |
    |   Ma: GEAR-K7X2-|                   |                  |                |
    |   3841"         |                   |                  |                |
    |   [Hinh QR Code]|                   |                  |                |
    |   [Luu QR]------|                   |                  |                |
```

========================================================================

## SEQUENCE DIAGRAM 5: VENDOR XU LY DON HANG
========================================================================

Muc dich: Mo ta tuong tac khi Vendor nhan va xu ly don hang.

```
  Vendor          Vendor Portal     API (Express)       Database          Member
    |                 |                   |                  |                |
    |                 |                   |                  |                |
    |                 |<--Notification:   |                  |                |
    |                 |  "Don hang moi    |                  |                |
    |<--Thong bao-----|  #123"------------|                  |                |
    |                 |                   |                  |                |
    |--Mo Vendor      |                   |                  |                |
    |  Portal-------->|                   |                  |                |
    |                 |                   |                  |                |
    |                 |--GET /api/vendor/ |                  |                |
    |                 |  orders?status=   |                  |                |
    |                 |  pending--------->|                  |                |
    |                 |                   |                  |                |
    |                 |                   |--SELECT * FROM   |                |
    |                 |                   |  food_orders     |                |
    |                 |                   |  WHERE vendor_id |                |
    |                 |                   |  = :id AND       |                |
    |                 |                   |  status =        |                |
    |                 |                   |  pending-------->|                |
    |                 |                   |                  |                |
    |                 |                   |<--orders list----|                |
    |                 |                   |                  |                |
    |                 |<--Danh sach don---|                  |                |
    |                 |                   |                  |                |
    |<--Hien thi:     |                   |                  |                |
    |  Don #123       |                   |                  |                |
    |  Mon A x2       |                   |                  |                |
    |  Mon B x1       |                   |                  |                |
    |  Dia chi: ...   |                   |                  |                |
    |  Gio giao: 12h  |                   |                  |                |
    |  [Xac nhan]     |                   |                  |                |
    |  [Tu choi]------|                   |                  |                |
    |                 |                   |                  |                |
    |                 |                   |                  |                |
    |--Nhan           |                   |                  |                |
    |  [Xac nhan]---->|                   |                  |                |
    |                 |                   |                  |                |
    |                 |--PUT /api/vendor/ |                  |                |
    |                 |  orders/123       |                  |                |
    |                 |  {status:         |                  |                |
    |                 |   confirmed}----->|                  |                |
    |                 |                   |                  |                |
    |                 |                   |--UPDATE          |                |
    |                 |                   |  food_orders SET |                |
    |                 |                   |  status =        |                |
    |                 |                   |  confirmed------>|                |
    |                 |                   |                  |                |
    |                 |                   |--Gui notification|                |
    |                 |                   |  "Don #123 da    |                |
    |                 |                   |  duoc xac nhan"----------------->|
    |                 |                   |                  |                |
    |                 |<--{success}-------|                  |                |
    |                 |                   |                  |                |
    |<--"Da xac nhan  |                   |                  |                |
    |   don #123"-----|                   |                  |                |
    |                 |                   |                  |                |
    |                 |                   |                  |                |
    |   (Vendor chuan bi mon, sau do     |                  |                |
    |    cap nhat status = preparing,    |                  |                |
    |    roi delivering, roi delivered   |                  |                |
    |    theo cung luong tuong tu)       |                  |                |
```

========================================================================
KET THUC FILE 06
========================================================================
