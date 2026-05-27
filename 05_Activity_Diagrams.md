# 05. BIEU DO HOAT DONG
# (Activity Diagrams)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 11/05/2026

========================================================================

Giai thich ky hieu:

  [Bat dau]           : Diem khoi dau (hinh tron den)
  [Ket thuc]          : Diem ket thuc (hinh tron den vien trang)
  <Hanh dong>         : Mot buoc xu ly (hinh chu nhat bo tron)
  {Dieu kien?}        : Diem quyet dinh (hinh thoi)
  [Co] / [Khong]      : Nhanh dieu kien
  --- FORK ---        : Chia nhanh song song (thanh ngang dam)
  --- JOIN ---        : Hop nhanh song song (thanh ngang dam)
  --- SWIMLANE: X --- : Vung trach nhiem cua actor X

========================================================================

## ACTIVITY DIAGRAM 1: DAT FOOD (BAO GOM GUEST VA MEMBER)
========================================================================

Muc dich: Mo ta toan bo luong tu khi user xem food den khi nhan
          xac nhan dat hang thanh cong. Bao gom ca 2 truong hop
          Member checkout va Guest checkout.

```
[Bat dau]
    |
    v
<User truy cap trang Food Listing>
    |
    v
<He thong hien thi danh sach food>
    |
    v
{User muon loc/tim kiem?}
    |              |
  [Co]          [Khong]
    |              |
    v              |
<User chon bo loc  |
 (calo, macro,     |
  muc tieu, di ung)|
    |              |
    v              |
<He thong loc va   |
 hien thi ket qua> |
    |              |
    +------+-------+
           |
           v
<User nhan nut [+] tren card san pham>
    |
    v
{San pham con hang?}
    |              |
  [Co]          [Khong]
    |              |
    |              v
    |        <Hien thi "San pham tam het hang">
    |              |
    |              v
    |         [Ket thuc]
    |
    v
{San pham da co trong cart?}
    |              |
  [Co]          [Khong]
    |              |
    v              v
<Tang qty      <Them moi vao cart
 them 1>        voi qty = 1>
    |              |
    +------+-------+
           |
           v
<Hien thi thong bao "Da them vao gio hang">
    |
    v
<Cap nhat icon gio hang tren navbar>
    |
    v
{User tiep tuc mua?}
    |              |
  [Co]          [Khong]
    |              |
    v              v
<Quay lai      <User mo trang Cart>
 Food Listing>     |
    |              v
    |        {Can thay doi qty/size/option?}
    |              |              |
    |            [Co]          [Khong]
    |              |              |
    |              v              |
    |        <User thay doi       |
    |         truc tiep trong     |
    |         cart (khong roi     |
    |         trang)>             |
    |              |              |
    |              v              |
    |        <He thong tinh lai   |
    |         tong tien>          |
    |              |              |
    |              +------+-------+
    |                     |
    |                     v
    |              <User nhan [Thanh toan]>
    |                     |
    |                     v
    |              {User da dang nhap?}
    |                |              |
    |              [Co]          [Khong]
    |                |              |
    |                |              v
    |                |    --- NHANH GUEST OTP ---
    |                |              |
    |                |              v
    |                |    <Hien thi form "Nhap SDT">
    |                |              |
    |                |              v
    |                |    <User nhap SDT>
    |                |              |
    |                |              v
    |                |    <He thong gen OTP 6 so>
    |                |              |
    |                |              v
    |                |    <He thong gui OTP qua SMS>
    |                |              |
    |                |              v
    |                |    <Hien thi form nhap OTP>
    |                |              |
    |                |              v
    |                |    <User nhap OTP>
    |                |              |
    |                |              v
    |                |    {OTP dung?}
    |                |      |           |
    |                |    [Co]       [Khong]
    |                |      |           |
    |                |      |           v
    |                |      |    {Da nhap 3 lan?}
    |                |      |      |          |
    |                |      |   [Chua]     [Roi]
    |                |      |      |          |
    |                |      |      v          v
    |                |      |  <Quay lai  <Khoa 15 phut.
    |                |      |   nhap OTP>  Hien thi loi.>
    |                |      |                 |
    |                |      |                 v
    |                |      |           [Ket thuc]
    |                |      |
    |                |      v
    |                |  <Tao temp session cho Guest>
    |                |      |
    |                +------+
    |                       |
    |                       v
    |              <Hien thi form dia chi + gio giao>
    |                       |
    |                       v
    |              <User nhap dia chi>
    |                       |
    |                       v
    |              <User chon khung gio giao>
    |                       |
    |                       v
    |              <Hien thi tong tien + phi giao hang>
    |                       |
    |                       v
    |              {Chon phuong thuc thanh toan?}
    |                |          |           |
    |             [VNPay]    [Momo]    [FitCoin]
    |                |          |           |
    |                v          v           v
    |           <Chuyen    <Chuyen     {So du FitCoin
    |            den VNPay  den Momo    du khong?}
    |            sandbox>   sandbox>    |         |
    |                |          |     [Du]    [Thieu]
    |                |          |       |         |
    |                |          |       v         v
    |                |          |  <Tru       <Ket hop
    |                |          |  FitCoin>   FitCoin
    |                |          |       |     + tien>
    |                |          |       |         |
    |                +----+-----+---+---+---------+
    |                     |
    |                     v
    |              {Thanh toan thanh cong?}
    |                |              |
    |              [Co]          [Khong]
    |                |              |
    |                |              v
    |                |        <Hien thi "Thanh toan that bai">
    |                |              |
    |                |              v
    |                |        <Quay lai chon phuong thuc>
    |                |
    |                v
    |           --- FORK (Xu ly song song) ---
    |              |          |            |
    |              v          v            v
    |          <Tao don   <Gui thong   <Cong 20 XP
    |           hang       bao den      cho user
    |           (status=   Food         (neu la
    |           pending)>  Vendor>      Member)>
    |              |          |            |
    |           --- JOIN -------------------
    |                     |
    |                     v
    |              <Xoa gio hang>
    |                     |
    |                     v
    |              <Hien thi trang "Dat hang thanh cong">
    |                     |
    |                     v
    |              [Ket thuc]
    |
    +---- (vong lap mua tiep tuc)
```

========================================================================

## ACTIVITY DIAGRAM 2: GYM SESSION + AI FOOD SUGGESTION
========================================================================

Muc dich: Mo ta luong tu khi user bat dau buoi tap, log exercise,
          ket thuc, va nhan goi y food tu AI.

```
[Bat dau]
    |
    v
<User nhan [Bat dau buoi tap]>
    |
    v
<He thong tao workout session moi (status = active)>
    |
    v
<Hien thi trang session voi form log exercise>
    |
    v
<User nhan [Them bai tap]>
    |
    v
<He thong hien thi danh sach exercise (nhom theo muscle_group)>
    |
    v
{Bai tap co trong danh sach?}
    |              |
  [Co]          [Khong]
    |              |
    |              v
    |        <User nhan [Tao bai tap moi]>
    |              |
    |              v
    |        <User nhap ten + chon muscle_group>
    |              |
    |              v
    |        <He thong luu bai tap moi>
    |              |
    +------+-------+
           |
           v
<User chon exercise (vd: Bench Press)>
    |
    v
<He thong hien thi form nhap set>
    |
    v
+---> <User nhap: Reps = [__], Weight = [__] kg>
|         |
|         v
|    {Them set nua?}
|      |         |
|    [Co]     [Khong]
|      |         |
|      v         |
|  <He thong     |
|   them dong    |
|   set moi>     |
|      |         |
+------+         |
                 v
<User nhan [Luu bai tap]>
    |
    v
<He thong validate: reps > 0, weight >= 0>
    |
    v
<He thong luu vao EXERCISE_LOGS>
    |
    v
<He thong tinh max(weight * reps) cua bai nay>
    |
    v
{Lon hon PR hien tai?}
    |              |
  [Co]          [Khong]
    |              |
    v              |
<Danh dau         |
 is_pr = true>    |
    |              |
    v              |
<Hien thi         |
 "PR moi!">       |
    |              |
    v              |
<Cong 30 XP>      |
    |              |
    +------+-------+
           |
           v
{Them bai tap khac?}
    |              |
  [Co]          [Khong]
    |              |
    v              |
<Quay lai         |
 [Them bai tap]>  |
    |              |
    +------+-------+
           |
           v
<User nhan [Ket thuc buoi tap]>
    |
    v
--- FORK (Song song) --------------------------------
    |              |              |              |
    v              v              v              v
<Luu session  <Cong 50 XP   <Cap nhat      <Cap nhat
 status=done>  cho user>     streak +1>     Passport:
    |              |              |         total_volume,
    |              |              |         total_sessions>
    |              |              |              |
--- JOIN ---------------------------------------------
    |
    v
<He thong doc muscle_group chinh cua session>
    |
    v
<SuggestionEngine: muscle_group -> macro priority>
    |
    v
    Vi du: chest -> {protein: high, carb: medium, fat: low}
    |
    v
<Query database: SELECT * FROM FOOD_PRODUCTS
                 WHERE is_available = true
                 ORDER BY protein_g DESC
                 LIMIT 3>
    |
    v
{Ket qua co du 3 mon?}
    |              |
  [Du]          [Thieu]
    |              |
    |              v
    |        <Bo sung bang mon
    |         co avg_rating cao nhat>
    |              |
    +------+-------+
           |
           v
<Hien thi popup goi y:
 "Vua tap [nhom co] xong? Day la 3 mon goi y!"
 [Mon 1] [Mon 2] [Mon 3]
 [Dat ca 3] [Bo qua]>
    |
    v
{User chon gi?}
    |              |
  [Dat ngay]    [Bo qua]
    |              |
    v              v
<Them mon da   <Dong popup>
 chon vao cart>    |
    |              v
    v         [Ket thuc]
<Chuyen den
 trang Cart>
    |
    v
[Ket thuc]
```

========================================================================

## ACTIVITY DIAGRAM 3: GEAR LIFECYCLE (DANG BAN -> MUA -> BAN LAI)
========================================================================

Muc dich: Mo ta toan bo vong doi cua 1 thiet bi gym tu khi duoc
          dang ban lan dau cho den khi qua tay nhieu nguoi.
          Day la tinh nang doc dao nhat cua FitFuel+.

```
--- SWIMLANE: SELLER A (Chu ban dau tien) ---

[Bat dau]
    |
    v
<Seller A truy cap /gear/sell>
    |
    v
<Seller A nhap thong tin gear:
 ten, danh muc, gia, tinh trang (4/5),
 ghi chu, upload 3 anh>
    |
    v
<Seller A nhan [Dang ban]>
    |
    v
<He thong validate du lieu>
    |
    v
{Du lieu hop le?}
    |              |
  [Co]          [Khong]
    |              |
    |              v
    |        <Hien thi loi cu the>
    |              |
    |              v
    |        <Quay lai form>
    |
    v
<He thong gen Gear ID: GEAR-K7X2-3841>
    |
    v
<He thong gen QR Code>
    |
    v
<He thong tao GEAR_ITEMS:
 gear_id = GEAR-K7X2-3841
 current_owner_id = Seller A
 condition_rating = 4
 is_available = true>
    |
    v
<He thong tao GEAR_LIFECYCLE entry #1:
 action = "listed"
 owner_id = Seller A
 condition_at_time = 4
 notes = "Con moi, chi su dung 2 thang"
 photos = [3 URLs]>
    |
    v
<Gear xuat hien tren listing>
    |
    v

--- SWIMLANE: BUYER B ---

<Buyer B tim thay gear tren listing>
    |
    v
<Buyer B nhan vao xem chi tiet>
    |
    v
<He thong hien thi thong tin gear + Gear Lifecycle>
    |
    v
    Buyer B thay:
    Lifecycle Entry #1:
    | Ngay      | Hanh dong | Chu nhan  | Tinh trang | Ghi chu            |
    |-----------|-----------|-----------|------------|--------------------|
    | 01/05/2026| Dang ban  | Seller A  | 4/5        | Con moi, 2 thang   |
    |
    v
{Buyer B muon thue hay mua?}
    |              |
  [Thue]        [Mua]
    |              |
    v              v
<Chon thoi    <Nhan [Mua ngay]>
 han thue>         |
    |              v
    v         <Chon thanh toan
<He thong      (tien hoac FitCoin)>
 tinh: phi         |
 thue + coc>       v
    |         <Xu ly thanh toan>
    v              |
<Xu ly thanh       |
 toan (coc         |
 + phi thue)>      |
    |              |
    +------+-------+
           |
           v
<He thong tao GEAR_LIFECYCLE entry #2:
 action = "sold" (hoac "rented")
 owner_id = Buyer B
 condition_at_time = 4
 notes = "Mua tu Seller A">
    |
    v
<He thong cap nhat GEAR_ITEMS:
 current_owner_id = Buyer B
 is_available = false>
    |
    v
<Seller A nhan FitCoin/tien>
    |
    v
<Buyer B nhan gear>
    |
    v

--- SWIMLANE: BUYER B (6 thang sau, muon ban lai) ---

<Buyer B truy cap /gear/sell>
    |
    v
<He thong tu dong dien san Gear ID cu: GEAR-K7X2-3841>
    |
    v
<Buyer B nhap:
 tinh trang moi (3/5), ghi chu moi, anh moi>
    |
    v
<He thong tao GEAR_LIFECYCLE entry #3:
 action = "relisted"
 owner_id = Buyer B
 condition_at_time = 3
 notes = "Da su dung 6 thang, con tot"
 photos = [2 anh moi]>
    |
    v
<He thong cap nhat GEAR_ITEMS:
 condition_rating = 3
 is_available = true>
    |
    v
<Gear xuat hien lai tren listing>
    |
    v

--- SWIMLANE: BUYER C ---

<Buyer C tim thay gear>
    |
    v
<Buyer C xem chi tiet + Gear Lifecycle>
    |
    v
    Buyer C thay TOAN BO lich su:
    | Ngay      | Hanh dong | Chu nhan  | Tinh trang | Ghi chu            |
    |-----------|-----------|-----------|------------|--------------------|
    | 01/05/2026| Dang ban  | Seller A  | 4/5        | Con moi, 2 thang   |
    | 05/05/2026| Da ban    | Buyer B   | 4/5        | Mua tu Seller A    |
    | 01/11/2026| Ban lai   | Buyer B   | 3/5        | Da dung 6 thang    |
    |
    v
<Buyer C quyet dinh mua (tin tuong vi co full history)>
    |
    v
<He thong tao GEAR_LIFECYCLE entry #4:
 action = "sold"
 owner_id = Buyer C>
    |
    v
<Buyer B nhan FitCoin>
    |
    v
[Ket thuc]
```

========================================================================

## ACTIVITY DIAGRAM 4: FOOD VENDOR XU LY DON HANG
========================================================================

Muc dich: Mo ta luong xu ly don hang tu phia Food Vendor.

```
[Bat dau]
    |
    v
<He thong gui thong bao "Don hang moi" den Vendor>
    |
    v
<Vendor mo Vendor Portal>
    |
    v
<Vendor xem chi tiet don hang:
 danh sach mon, so luong, dia chi, gio giao>
    |
    v
{Vendor xac nhan don?}
    |              |
  [Co]          [Khong]
    |              |
    |              v
    |        <Vendor nhan [Tu choi]>
    |              |
    |              v
    |        <He thong cap nhat status = cancelled>
    |              |
    |              v
    |        <He thong thong bao user "Don bi tu choi">
    |              |
    |              v
    |        <He thong hoan tien cho user>
    |              |
    |              v
    |        [Ket thuc]
    |
    v
<Vendor nhan [Xac nhan]>
    |
    v
<He thong cap nhat status = confirmed>
    |
    v
<He thong thong bao user "Don da duoc xac nhan">
    |
    v
<Vendor chuan bi mon an>
    |
    v
<Vendor nhan [Dang chuan bi xong]>
    |
    v
<He thong cap nhat status = preparing>
    |
    v
<Vendor giao cho shipper>
    |
    v
<Vendor nhan [Dang giao]>
    |
    v
<He thong cap nhat status = delivering>
    |
    v
<User nhan hang>
    |
    v
<He thong cap nhat status = delivered>
    |
    v
<He thong cap nhat Macro Dashboard cua user:
 cong them calo/protein/carb/fat cua don hang>
    |
    v
[Ket thuc]
```

========================================================================

## ACTIVITY DIAGRAM 5: DANG KY TAI KHOAN
========================================================================

Muc dich: Mo ta luong dang ky tai khoan tu dau den cuoi.

```
[Bat dau]
    |
    v
<User truy cap /auth/register>
    |
    v
<He thong hien thi form dang ky>
    |
    v
{Dang ky bang gi?}
    |              |
  [Email]       [SDT]
    |              |
    v              v
<User nhap:    <User nhap SDT>
 email,            |
 mat khau,         v
 xac nhan MK,  <He thong gui OTP>
 ten hien thi>     |
    |              v
    |          <User nhap OTP>
    |              |
    |              v
    |          {OTP dung?}
    |            |       |
    |          [Co]   [Khong]
    |            |       |
    |            |       v
    |            |   {3 lan?}
    |            |    |      |
    |            |  [Chua] [Roi]
    |            |    |      |
    |            |    v      v
    |            | <Thu   <Hien loi>
    |            |  lai>     |
    |            |           v
    |            |      [Ket thuc]
    |            |
    +------+-----+
           |
           v
<He thong validate:
 - Email dung format va chua ton tai
 - Mat khau >= 8 ky tu, chu hoa + thuong + so
 - Xac nhan mat khau khop
 - Ten khong rong>
    |
    v
{Hop le?}
    |              |
  [Co]          [Khong]
    |              |
    |              v
    |        <Hien thi loi cu the>
    |              |
    |              v
    |        <Quay lai form>
    |
    v
<He thong hash mat khau (bcrypt, 10 rounds)>
    |
    v
<He thong tao ban ghi USERS:
 role = member
 xp_total = 0
 current_level = 1
 current_streak = 0
 fitcoin_balance = 0>
    |
    v
<He thong tao FITNESS_PASSPORT (rong)>
    |
    v
<He thong gen JWT token (7 ngay)>
    |
    v
<Chuyen huong den Dashboard>
    |
    v
[Ket thuc]
```

========================================================================
KET THUC FILE 05
========================================================================
