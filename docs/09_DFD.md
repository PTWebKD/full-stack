# 09. BIEU DO LUONG DU LIEU
# (Data Flow Diagram - DFD)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 15/06/2026 (Cap nhat: Gear Seller -> Member (Gear Hub); BR-11B: Member=cho thue, GymOwner=ban; BR-40: /auth/register chi cho Vendor/GymOwner)

========================================================================

Giai thich ky hieu DFD (theo chuan Yourdon & DeMarco):

  [ Ten ]       : External Entity (Thuc the ngoai)
                  La nguoi hoac he thong ben ngoai tuong tac voi he thong.
                  Ve bang hinh chu nhat.

  ( X.X Ten )   : Process (Tien trinh)
                  La chuc nang xu ly du lieu trong he thong.
                  Ve bang hinh tron hoac hinh chu nhat bo tron.
                  X.X la so thu tu (0.0 cho context, 1.0, 2.0... cho level 1).

  = = D1: Ten = = : Data Store (Kho du lieu)
                  La noi luu tru du lieu (database, file).
                  Ve bang 2 duong ke song song.

  ------->      : Data Flow (Luong du lieu)
                  La du lieu di chuyen giua cac thanh phan.
                  Ve bang mui ten, ghi ten du lieu tren mui ten.

Quy tac:
  - Moi process phai co it nhat 1 data flow vao va 1 data flow ra.
  - Data store khong tu gui du lieu cho data store khac (phai qua process).
  - External entity khong tuong tac truc tiep voi data store.
  - DFD Level 0 (Context Diagram) chi co dung 1 process dai dien toan he thong.
  - DFD Level 1 tach process do thanh nhieu process con.

========================================================================

## 1. DFD LEVEL 0 — CONTEXT DIAGRAM
========================================================================

Muc dich: The hien tong quan he thong nhu 1 process duy nhat,
          voi tat ca external entity tuong tac voi no.

```
    [Guest/Member]                              [Food Vendor]
        |     ^                                     |     ^
        |     |                                     |     |
  Thong tin   |  Xac nhan,                   San pham,    |  Don hang,
  dang ky,    |  goi y,                      gia,         |  analytics,
  don hang,   |  ket qua,                    cap nhat     |  thong bao
  du lieu     |  thong ke                    san pham     |
  buoi tap,   |                                     |     |
  thanh toan  |                                     |     |
        |     |                                     |     |
        v     |                                     v     |
     +--------|-------------------------------------|-----|---------+
     |        |                                     |     |         |
     |                                                              |
     |                     ( 0.0 )                                  |
     |                     ( HE THONG FITFUEL+ )                    |
     |                                                              |
     |        |                                     |     |         |
     +--------|-------------------------------------|-----|---------+
        ^     |                                     ^     |
        |     |                                     |     |
  Gear listing|  Gear ID,                    Lenh     |  Bao cao
  cho thue    |  FitCoin,                    quan ly,  |  he thong,
  (Member)    |  thong bao                   duyet,    |  thong ke
        |     v                              xu ly     |
        |     |                                     |     v
  [Member (Gear Hub)]                            [Gym Owner]
                           |     ^
                           |     |
                     Thong bao,  |  Dashboard,
                     lich nghi,  |  analytics,
                     membership  |  danh sach
                     plans       |  member
                           |     |
                           v     |
```

Giai thich:
  - He thong FitFuel+ duoc the hien nhu 1 o tron duy nhat (Process 0.0).
  - Co 5 external entity tuong tac:
    (1) Guest/Member: nguoi dung cuoi cung.
    (2) Food Vendor: quan an dang ky ban.
    (3) Member (Gear Hub): nguoi dang thiet bi cho thue (BR-11B: chi Member moi cho thue).
    (4) Gym Owner: chu phong tap, dang thiet bi de ban (BR-11B: chi GymOwner moi ban).
  - Moi mui ten dai dien 1 luong du lieu (data flow) giua entity va he thong.

========================================================================

## 2. DFD LEVEL 1
========================================================================

Muc dich: Tach Process 0.0 thanh cac process con (sub-process),
          the hien cac data store ben trong he thong.

```
                              [Guest/Member]
                           /        |        \
                          /         |         \
            Thong tin    /    Don hang,  \     Du lieu
            dang ky,    /     thanh toan  \    buoi tap
            dang nhap  /          |        \
                      v           v         v

                (1.0 QUAN LY       (2.0 GYM         (3.0 FOOD
                 TAI KHOAN)          TRACKING)         ORDER)

                    |   ^             |   ^             |   ^
           Luu/Doc  |   |    Luu/Doc  |   |    Luu/Doc  |   |
           user     |   |    session, |   |    food,    |   |
                    v   |    log      v   |    order    v   |

              = D1: USERS =    = D2: WORKOUT_ =   = D4: FOOD_ =
                               = SESSIONS =       = PRODUCTS =
              = D10: FITNESS_= = D3: EXERCISE_ =  = D5: FOOD_ =
              = PASSPORT =     = LOGS =           = ORDERS =
```

Duoi day la chi tiet toan bo DFD Level 1 voi 7 process:

------------------------------------------------------------------------
### Process 1.0: QUAN LY TAI KHOAN
------------------------------------------------------------------------

```
                        [Guest/Member]
                            |       ^
               Thong tin    |       |  JWT token,
               dang ky/     |       |  thong tin user,
               dang nhap    |       |  Fitness Passport
                            v       |

                      (1.0 QUAN LY TAI KHOAN)
                      |       |           ^   ^
             Luu user |       | Doc user  |   | Doc/Ghi
                      v       v           |   | Passport
                = = D1: USERS = =         |   |
                                  = = D10: FITNESS_PASSPORT = =
```

Data flow vao:
  - Thong tin dang ky: email, password, display_name, role (tu Vendor/GymOwner - BR-40;
    Member KHONG dang ky qua /auth/register, tai khoan Member duoc tao tu checkout mua goi tap)
  - Thong tin dang nhap: email+password (Vendor/GymOwner) hoac phone+OTP (Member)
  - OTP request: phone number (tu Guest hoac Member)
  - Cap nhat profile: display_name, avatar, fitness_goal (tu Member)

Data flow ra:
  - JWT token (tra ve Guest/Member)
  - User profile (tra ve Guest/Member)
  - Fitness Passport data (tra ve Member)

Data store lien quan:
  - D1: USERS (doc va ghi)
  - D10: FITNESS_PASSPORT (doc va ghi)

------------------------------------------------------------------------
### Process 2.0: GYM TRACKING
------------------------------------------------------------------------

```
                        [Member]
                          |       ^
             Du lieu      |       |  Thong ke,
             buoi tap     |       |  progress chart,
             (ngay, bai   |       |  PR, goi y
             tap, set,    |       |  nhom co
             reps, weight)|       |
                          v       |

                     (2.0 GYM TRACKING)
                     |       |       ^       ^
            Luu      |       |       |       | Doc user
            session, |       | Doc   |       | (streak, XP)
            log      v       v       |       |
              = D2: WORKOUT_SESSIONS =       |
              = D3: EXERCISE_LOGS =          |
                                     = D1: USERS =
                                     = D10: FITNESS_PASSPORT =
```

Data flow vao:
  - Du lieu buoi tap: ngay, nhom co, ghi chu (tu Member)
  - Du lieu exercise: ten bai, reps, weight (tu Member)

Data flow ra:
  - Lich su buoi tap (tra ve Member)
  - Progress chart (tra ve Member)
  - Personal Record thong bao (tra ve Member)
  - Goi y nhom co (tra ve Member)
  - Thong ke tong hop (tra ve Member)

Data flow noi bo:
  - Doc/ghi D2: WORKOUT_SESSIONS
  - Doc/ghi D3: EXERCISE_LOGS
  - Doc/ghi D1: USERS (cap nhat XP, streak)
  - Doc/ghi D10: FITNESS_PASSPORT (cap nhat total_volume, total_sessions)

------------------------------------------------------------------------
### Process 3.0: FOOD ORDER
------------------------------------------------------------------------

```
        [Guest/Member]                              [Food Vendor]
            |       ^                                   |       ^
  Chon food,|       | Xac nhan,                 San pham|       | Don hang,
  dat hang, |       | goi y food,               gia, anh|       | thong bao
  re-order  |       | macro dashboard                   |       |
            v       |                                   v       |

                        (3.0 FOOD ORDER)
                       /       |       \
              Luu/Doc /   Luu/Doc|  Doc  \ Doc gym log
                     v        v  |       v  (tu 2.0)
         = D4: FOOD_ =  = D5: FOOD_ =  = D2: WORKOUT_ =
         = PRODUCTS =   = ORDERS =     = SESSIONS =
                                        = D3: EXERCISE_ =
                                        = LOGS =
```

Data flow vao:
  - Chon food, filter (tu Guest/Member)
  - Don hang: items, address, delivery_time (tu Guest/Member)
  - San pham moi: name, price, macro, images (tu Food Vendor)
  - Gym log hom nay (tu D2, D3 - phuc vu AI Suggestion)

Data flow ra:
  - Danh sach food, chi tiet food (tra ve Guest/Member)
  - AI Food Suggestion: 3 mon goi y (tra ve Member)
  - Macro Dashboard: calo/protein/carb/fat hom nay (tra ve Member)
  - Xac nhan don hang (tra ve Guest/Member)
  - Don hang moi + thong bao (tra ve Food Vendor)
  - Analytics: doanh thu, top mon (tra ve Food Vendor)

Data store lien quan:
  - D4: FOOD_PRODUCTS (doc va ghi)
  - D5: FOOD_ORDERS (doc va ghi)
  - D2, D3: doc tu Gym Tracking (phuc vu AI Suggestion)
  - D1: USERS (cap nhat XP khi dat hang)
  - D11: FITCOIN_TRANSACTIONS (ghi khi dung FitCoin)

------------------------------------------------------------------------
### Process 4.0: GEAR HUB
------------------------------------------------------------------------

```
   [Member (cho thue)]       [Gym Owner (ban)]
          |     ^                  |     ^
  Dang    |     | Gear ID,  Dang   |     | Gear ID,
  cho     |     | QR code, ban     |     | QR code,
  thue,   |     | lifecycle thiet  |     | xac nhan
  thue,   |     | FitCoin  bi      |     | ban hang
  tra     |     |                  |     |
  gear    v     |                  v     |
          +-----+---------+---------+----+
                          |
                          v
                    (4.0 GEAR HUB)
                   /      |      \
          Luu/Doc/   Luu/Doc| Luu/Doc\
                 v       v  |        v
        = D6: GEAR_ = D7: GEAR_ = D8: GEAR_ =
        = ITEMS =    = LIFECYCLE = = TRANSACTIONS =
```

Data flow vao:
  - Thong tin gear cho thue: ten, category, gia thue/ngay, condition, anh (tu Member - BR-11B)
  - Thong tin gear ban: ten, category, gia ban, ton kho, anh (tu Gym Owner - BR-11B)
  - Yeu cau thue gear: gear_id, ngay thue/tra, tien dat coc (tu Member)
  - Yeu cau mua gear: gear_id, so luong, payment_method (tu Member)
  - Yeu cau tra gear: gear_id, condition moi (tu Member)

Data flow ra:
  - Gear ID + QR Code (tra ve Member hoac Gym Owner sau khi dang)
  - Danh sach gear, chi tiet + Lifecycle (tra ve Member)
  - Xac nhan giao dich thue/mua (tra ve Member)
  - FitCoin cho Member cho thue (gui den D1 va D11)

------------------------------------------------------------------------
### Process 5.0: GAMIFICATION
------------------------------------------------------------------------

```
                        [Member]
                          |       ^
             Hanh dong    |       | XP, level,
             (tu 2.0,     |       | badge,
             3.0, 4.0)    |       | ranking,
                          |       | streak
                          v       |

                    (5.0 GAMIFICATION)
                     |      |       ^
            Doc/Ghi  |      | Doc   |
            user XP  |      |       |
                     v      v       |
              = D1: USERS =         |
              = D9: CHALLENGES =    |
              = D12: BADGES =       |
              = D13: USER_CHALLENGES =
```

Data flow vao:
  - Su kien tu cac module khac:
    Hoan thanh buoi tap (tu 2.0) -> +50 XP
    Dat food (tu 3.0) -> +20 XP
    Ban gear (tu 4.0) -> +80 XP
  - Tham gia challenge: user_id, challenge_id (tu Member)

Data flow ra:
  - XP hien tai, level (tra ve Member)
  - Danh sach badge da unlock (tra ve Member)
  - Ranking board (tra ve Member)
  - Thong bao level up, badge unlock (tra ve Member)

------------------------------------------------------------------------
### Process 6.0: PAYMENT & FITCOIN
------------------------------------------------------------------------

```
  [Guest/Member]                         [Payment Gateway]
       |       ^                              |       ^
  Thanh toan,  | Xac nhan,            Callback|       | Yeu cau
  nap FitCoin  | so du FitCoin        ket qua |       | thanh toan
       |       |                              |       |
       v       |                              v       |

                    (6.0 PAYMENT & FITCOIN)
                     |              ^
            Luu/Doc  |              | Doc
            giao dich|              | balance
                     v              |
              = D11: FITCOIN_TRANSACTIONS =
              = D1: USERS (fitcoin_balance) =
              = D5: FOOD_ORDERS (status) =
```

Data flow vao:
  - Yeu cau thanh toan: order_id, amount, method (tu Guest/Member)
  - Callback thanh toan: transaction_result (tu Payment Gateway)
  - Yeu cau nap FitCoin: amount (tu Member)
  - FitCoin earn event (tu 4.0, 5.0)

Data flow ra:
  - Yeu cau thanh toan (gui den Payment Gateway)
  - Xac nhan thanh toan (tra ve Guest/Member)
  - So du FitCoin hien tai (tra ve Member)
  - Lich su FitCoin (tra ve Member)

------------------------------------------------------------------------
### Process 7.0: GYM OWNER & B2B
------------------------------------------------------------------------

```
                                             [Gym Owner]
     |       ^                              |       ^
  Duyet,     | Bao cao,             Thong bao|       | Dashboard,
  xu ly      | thong ke             lich nghi |       | danh sach
  tranh chap | he thong             membership|       | member
     |       |                      plans     |       |
     v       |                              v       |

                      (7.0 GYM OWNER & B2B)
                           |       ^
                  Doc/Ghi  |       | Doc
                  tat ca   |       | tat ca
                           v       |
                    = Tat ca Data Store =
```

Data flow vao:
  - Lenh duyet vendor/gym-owner (tu Gym Owner)
  - Xu ly tranh chap (tu Gym Owner)
  - Thong bao gui member (tu Gym Owner)
  - Membership plans (tu Gym Owner)

Data flow ra:
  - Bao cao tong the he thong (tra ve Gym Owner)
  - Dashboard analytics (tra ve Gym Owner)
  - Danh sach member (tra ve Gym Owner)

========================================================================

## 3. TONG HOP DATA STORE
========================================================================

Ma     | Ten                    | Mo ta                              | Process lien quan
-------|------------------------|------------------------------------|-------------------
D1     | USERS                  | Thong tin nguoi dung               | 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0
D2     | WORKOUT_SESSIONS       | Buoi tap                           | 2.0, 3.0 (AI)
D3     | EXERCISE_LOGS          | Chi tiet bai tap                   | 2.0, 3.0 (AI)
D4     | FOOD_PRODUCTS          | San pham do an                     | 3.0
D5     | FOOD_ORDERS            | Don hang food                      | 3.0, 6.0
D6     | GEAR_ITEMS             | Thiet bi gym                       | 4.0
D7     | GEAR_LIFECYCLE         | Lich su thiet bi                   | 4.0
D8     | GEAR_TRANSACTIONS      | Giao dich gear                     | 4.0, 6.0
D9     | CHALLENGES             | Thu thach                          | 5.0
D10    | FITNESS_PASSPORT       | Ho so the hinh                     | 1.0, 2.0
D11    | FITCOIN_TRANSACTIONS   | Giao dich FitCoin                  | 6.0
D12    | BADGES                 | Huy hieu                           | 5.0
D13    | USER_CHALLENGES        | Tien do challenge                  | 5.0

========================================================================
KET THUC FILE 09
========================================================================
