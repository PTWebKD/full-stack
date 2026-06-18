# 05. BIEU DO HOAT DONG
# (Activity Diagrams)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 18/06/2026 (Cap nhat: Dinh huong lai Gym Management System)

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

## ACTIVITY DIAGRAM 1: CHECK-IN VA CAP PHAT TIEN ICH
========================================================================

Muc dich: Mo ta luong tu luc Member den phong tap, check-in, duoc xac
          nhan goi tap va cap phat tien ich cho den khi vao phong tap.

```
[Bat dau]
    |
    v
--- SWIMLANE: MEMBER ---
<Member den phong tap, xuat trinh QR hoac SDT>
    |
    v
--- SWIMLANE: HE THONG ---
<He thong tim kiem Member>
    |
    v
{Member ton tai?}
    |              |
  [Khong]        [Co]
    |              |
    v              v
<Thong bao     <Kiem tra GYM_MEMBERSHIPS>
 khong tim       |
 thay member>    v
    |          {Goi tap con hieu luc?}
    |              |              |
    |            [Co]          [Khong]
    |              |              |
    |              v              v
    |          <Ghi nhan      <Hien thi thong bao
    |           CHECK_INS>     "Goi tap da het han">
    |              |              |
    |              v              v
    |          <Cap nhat streak  <Chuyen den trang
    |           + cong XP        gia han goi tap>
    |           (+10 XP)              |
    |           (BR-21)>         [Ket thuc]
    |              |
    v              v
<Hien thi man  <Member vao phong tap>
 hinh xac nhan      |
 check-in thanh     v
 cong>          [Ket thuc]
    |
    v
[Ket thuc]
```

Quy tac nghiep vu lien quan: BR-09 (check-in toi da 1 lan/ngay), BR-21 (XP earn), BR-23 (streak)

========================================================================

## ACTIVITY DIAGRAM 2: GIA HAN GOI TAP (MEMBER TU GIA HAN ONLINE)
========================================================================

Muc dich: Mo ta luong tu luc Member muon gia han goi tap cho den khi
          goi tap duoc kich hoat va FitCoin bonus duoc cong.

```
[Bat dau]
    |
    v
--- SWIMLANE: MEMBER ---
<Truy cap trang /membership>
    |
    v
<He thong hien thi goi hien tai + ngay het han>
    |
    v
{Member chon gia han?}
    |              |
  [Khong]        [Co]
    |              |
    v              v
[Ket thuc]    <Chon goi gia han (thang/nam)>
                   |
                   v
              <Xem tom tat: goi moi, gia,
               ngay het han moi, FitCoin bonus>
                   |
                   v
              {Xac nhan?}
                   |              |
                 [Co]          [Khong]
                   |              |
                   v              v
              <Chon phuong     [Huy] -> [Ket thuc]
               thuc thanh toan>
                   |
                   v
--- SWIMLANE: PAYMENT GATEWAY ---
<Xu ly giao dich thanh toan>
    |
    v
{Thanh toan thanh cong?}
    |              |
  [Co]          [Khong]
    |              |
    v              v
<Gui callback  <Thong bao that bai>
 thanh cong>       |
    |              v
    |         {Thu lai?}
    |              |              |
    |            [Co]          [Khong]
    |              |              |
    |         [Quay lai]      [Ket thuc]
    |         thanh toan
    |
    v
--- SWIMLANE: HE THONG ---
<Kiem tra idempotency (BR-38)>
    |
    v
<Cap nhat GYM_MEMBERSHIPS.end_date>
    |
    v
--- FORK ---
    |                       |                    |
    v                       v                    v
<Ghi MEMBERSHIP_HISTORY>  <Tao INVOICES>   <+50 FitCoin bonus>
    |                       |                    |
    v                       v                    v
--- JOIN ---
    |
    v
<Gui notification
 xac nhan gia han
 + ngay het han moi>
    |
    v
<Tu dong resolve RECOMMENDATIONS
 'renew_reminder' cua Member nay>
    |
    v
[Ket thuc]
```

Quy tac nghiep vu: BR-06 (gia han ghi MEMBERSHIP_HISTORY), BR-38 (idempotency),
                   BR-28 (FitCoin earn - +50 khi gia han)

========================================================================

## ACTIVITY DIAGRAM 3: BAN SAN PHAM DINH DUONG NOI BO (POS)
========================================================================

Muc dich: Mo ta luong ban hang tai quay cua nhan vien cho Member.

```
[Bat dau]
    |
    v
--- SWIMLANE: NHAN VIEN ---
<Mo man hinh POS /gym-owner/nutrition/pos>
    |
    v
<Tim kiem Member (SDT/ten)>
    |
    v
{Tim thay Member?}
    |              |
  [Co]          [Khong]
    |              |
    v              v
<Chon san pham> <Thong bao khong tim thay>
    |              |
    v              v
<Nhap so luong> [Ket thuc]
    |
    v
--- SWIMLANE: HE THONG ---
<Kiem tra ton kho INVENTORY>
    |
    v
{Ton kho du?}
    |              |
  [Co]          [Khong]
    |              |
    v              v
<Tinh tong tien>  <Hien thi canh bao
    |              het hang>
    v              |
--- SWIMLANE: NHAN VIEN ---
<Xac nhan don hang voi Member>
    |
    v
{Member muon dung FitCoin?}
    |              |
  [Co]          [Khong]
    |              |
    v              |
<Nhap so FitCoin   |
 muon dung         |
 (toi da 50%)>     |
    |              |
    +------+-------+
           |
           v
<Xac nhan tong tien cuoi cung>
    |
    v
<Thanh toan (tien mat/VNPay/FitCoin)>
    |
    v
--- SWIMLANE: HE THONG ---
<Tao NUTRITION_ORDERS + NUTRITION_ORDER_ITEMS>
    |
    v
<Tru INVENTORY (cap nhat ton kho)>
    |
    v
<Tao INVOICES>
    |
    v
{Ton kho <= low_stock_threshold?}
    |              |
  [Co]          [Khong]
    |              |
    v              v
<Tao canh bao     |
 ton kho thap     |
 cho Gym Owner>   |
    |              |
    +------+-------+
           |
           v
<Hien thi xac nhan dat hang thanh cong>
    |
    v
[Ket thuc]
```

Quy tac nghiep vu: BR-12 (quyen ban), BR-13 (ton kho + canh bao), BR-30 (gioi han FitCoin)

========================================================================

## ACTIVITY DIAGRAM 4: QUAN LY AI CARE QUEUE
========================================================================

Muc dich: Mo ta luong tu dong tao recommendation va viec xu ly cua nhan vien.

```
[Bat dau: Timer hang ngay 06:00]
    |
    v
--- SWIMLANE: HE THONG (TIMER) ---
<Quet tat ca Member voi goi tap active>
    |
    v
[Loop: Moi Member]
    |
    v
--- FORK ---
    |                           |                          |
    v                           v                          v
{Goi tap het han     {Chua check-in       {Tap deu >=4
 trong 7 ngay?}       >= 14 ngay?}         buoi/tuan va
    |                           |           con goi Basic?}
    v                           v                          v
{Co: renew_reminder} {Co: inactive_alert} {Co: upsell_plan}
--- JOIN ---
    |
    v
{Da co rec pending
 trong 7 ngay?}
    |              |
  [Co]          [Khong]
    |              |
    v              v
[Bo qua -      <Tao RECOMMENDATIONS
 tranh trung    moi voi priority
 lap]           phu hop>
    |              |
    +------+-------+
           |
           v
[End Loop]
    |
    v
<Gui NOTIFICATIONS nhac nho cho Member
 co goi sap het han <= 3 ngay>
    |
    v
--- SWIMLANE: GYM OWNER / NHAN VIEN ---
<Truy cap /gym-owner/care-queue>
    |
    v
<Xem danh sach Member can cham soc
 (sap xep theo priority: HIGH truoc)>
    |
    v
<Chon 1 Member, xem ly do va goi y hanh dong>
    |
    v
<Thuc hien hanh dong: goi dien, nhan tin...>
    |
    v
<Bam [Ghi nhan ket qua]>
    |
    v
<Chon ket qua: renewed/declined/unreachable/other
 Nhap ghi chu chi tiet>
    |
    v
<Xac nhan luu>
    |
    v
--- SWIMLANE: HE THONG ---
<Tao MEMBER_CARE_LOGS>
    |
    v
<Cap nhat RECOMMENDATIONS.status = 'handled'>
    |
    v
<Cap nhat RECOMMENDATIONS.resolved_at = NOW()>
    |
    v
[Ket thuc]
```

Quy tac nghiep vu: BR-35 (6 recommendation rules), BR-36 (ghi nhan xu ly)

========================================================================

## ACTIVITY DIAGRAM 5: THUC HIEN BUOI TAP THEO CHUONG TRINH (PROGRAM SESSION)
========================================================================

Muc dich: Mo ta luong tu luc he thong goi y buoi tap hang ngay,
          member chinh sua + chap nhan + tap + hoan thanh + 3 engine chay song song.

```
[Bat dau]
    |
    v
--- SWIMLANE: MEMBER ---
<Truy cap /journey hoac /gym/new-session>
    |
    v
--- SWIMLANE: HE THONG ---
{Member co MEMBER_PROGRAMS active?}
    |              |
  [Co]          [Khong]
    |              |
    v              v
<Lay PROGRAM_DAY   <Hien thi form tao buoi
 phu hop hom nay>   tap tu do (luong cu)>
    |                       |
    v                       v
<Hien thi goi y buoi tap: [Tap tu do - khong co goi y]
 - Ten buoi (Push Day A)
 - Danh sach bai tap
 - Sets x Reps muc tieu>
    |
    v
--- SWIMLANE: MEMBER ---
{Member muon chinh sua?}
    |              |
  [Co]          [Khong]
    |              |
    v              v
<Chinh sua:        |
 + Them bai        |
 - Xoa bai         |
 doi Sets/Reps>    |
    |              |
    +------+-------+
           |
           v
<Bam [CHAP NHAN & BAT DAU]>
    |
    v
--- SWIMLANE: HE THONG ---
<Tao WORKOUT_SESSIONS (status='active')>
<Luu customized_from_prog + customization_log>
    |
    v
--- SWIMLANE: MEMBER ---
<Thuc hien buoi tap>
<Log tung set: bai tap, reps thuc te, weight>
    |
    v
<Bam [HOAN THANH BUOI TAP]>
    |
    v
--- SWIMLANE: HE THONG ---
<Cap nhat WORKOUT_SESSIONS.status = 'done'>
<Ghi tat ca EXERCISE_LOGS>
    |
    v
--- FORK ---
    |                           |                       |
    v                           v                       v
[ENGINE 1]              [ENGINE 2]              [ENGINE 3]
<Progressive Overload AI> <Nutrition Suggestion AI> <Milestone Engine>
<So sanh actual vs         <4 tin hieu: nhom co +   <Kiem tra 22 dieu
 target 2 buoi gan nhat>    goal + volume + lich su>  kien milestone>
<Ghi overload_suggestion>  <Popup 3 san pham goi y> <Award FitCoin + XP>
--- JOIN ---
    |
    v
{Co milestone moi?}
    |              |
  [Co]          [Khong]
    |              |
    v              v
<Hien thi        |
 Celebration UX> |
 (nho hoac lon)  |
    |              |
    +------+-------+
           |
           v
<Hien thi ket qua buoi tap:
 - So set da hoan thanh
 - PR moi (neu co)
 - Goi y tang ta (neu co)
 - Tien do chuong trinh cap nhat>
    |
    v
[Ket thuc]
```

Quy tac nghiep vu: BR-42 (session linking), BR-43 (progressive overload),
                   BR-44 (nutrition trigger), BR-46 (milestone engine)

========================================================================

## ACTIVITY DIAGRAM 6: MILESTONE CELEBRATION VA SHARE CARD
========================================================================

Muc dich: Mo ta luong tu khi dat milestone lon (M32 goal 100% / M42
          chuong trinh 12 tuan) den khi member tao va chia se Share Card.

```
[Bat dau: Milestone M32 hoac M42 duoc kich hoat]
    |
    v
--- SWIMLANE: HE THONG ---
<Tao MILESTONE_ACHIEVEMENTS>
<Award FitCoin 500 + XP 2000>
<Tinh truoc/sau stats:
 - Can nang: BODY_METRICS dau vs cuoi
 - Suc manh: PERSONAL_RECORDS dau vs cuoi
 - Thoi gian: start_date den hom nay>
    |
    v
--- SWIMLANE: MEMBER ---
<Man hinh Celebration hien ra:
 CHUC MUNG! + stats truoc/sau
 FitCoin + XP thuong
 [TAO SHARE CARD] [Tiep tuc hanh trinh]>
    |
    v
{Member muon tao Share Card?}
    |              |
  [Co]          [Khong]
    |              |
    v              v
--- SWIMLANE: HE THONG ---
<Generate anh Share Card:
 - Logo phong tap
 - Ten member
 - Stats truoc / sau
 - Hashtag #FitFuel>
    |
    v
--- SWIMLANE: MEMBER ---
<Tai ve / Chia se len mang xa hoi>
    |
    v
--- SWIMLANE: HE THONG ---
<Cap nhat MILESTONE_ACHIEVEMENTS.is_shared = true>
    |
    v
<Tao FITCOIN_TRANSACTIONS:
 source='milestone_reward'>
    |
    v
--- SWIMLANE: GYM OWNER ---
<Analytics: "Share Cards Generated" +1>
<Theo doi: organic reach, member moi
 tu viral loop>
    |
    v
[Ket thuc]
```

Quy tac nghiep vu: BR-46 (Milestone Engine), BR-21 (XP), BR-28 (FitCoin earn)

========================================================================
KET THUC FILE 05
========================================================================
