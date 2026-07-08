# 03. TÃC NHÃ‚N VÃ€ CÃC TRÆ¯á»œNG Há»¢P Sá»¬ Dá»¤NG
# (Actors & Use Cases)

> Dá»± Ã¡n: FitFuel+
> MÃ´n há»c: Web Kinh Doanh
> Cáº­p nháº­t: Cáº­p nháº­t láº¡i cÃ¡c TÃ¡c nhÃ¢n vÃ  Use Case theo yÃªu cáº§u má»›i (chi tiáº¿t Ä‘áº§y Ä‘á»§).

========================================================================

## 1. DANH SÃCH TÃC NHÃ‚N (ACTORS)

| TÃªn TÃ¡c nhÃ¢n | PhÃ¢n loáº¡i | KhÃ¡i niá»‡m & Vai trÃ² trong há»‡ thá»‘ng |
| --- | --- | --- |
| **Visitor / Guest** | Primary | NgÆ°á»i dÃ¹ng chÆ°a cÃ³ tÃ i khoáº£n hoáº·c chÆ°a mua gÃ³i há»™i viÃªn. Má»¥c tiÃªu chÃ­nh lÃ  tÃ¬m hiá»ƒu thÃ´ng tin, nháº­n tÆ° váº¥n, tham gia luá»“ng tráº£i nghiá»‡m (Free Trial, Gym Tour) vÃ  mua hÃ ng trá»±c tuyáº¿n (Gear/Nutrition). |
| **Member** | Primary | NgÆ°á»i dÃ¹ng Ä‘Ã£ sá»Ÿ há»¯u tÃ i khoáº£n vÃ  gÃ³i há»™i viÃªn (Active/Frozen). Má»¥c tiÃªu chÃ­nh lÃ  sá»­ dá»¥ng cÃ¡c dá»‹ch vá»¥ cá»‘t lÃµi: táº­p luyá»‡n, dinh dÆ°á»¡ng, quáº£n lÃ½ há»“ sÆ¡ vÃ  nÃ¢ng cáº¥p gÃ³i. |
| **Gym Owner / Admin** | Primary | NgÆ°á»i quáº£n trá»‹ há»‡ thá»‘ng vÃ  váº­n hÃ nh phÃ²ng táº­p. Má»¥c tiÃªu chÃ­nh lÃ  quáº£n lÃ½ dá»‹ch vá»¥, cáº¥u hÃ¬nh dá»¯ liá»‡u, chÄƒm sÃ³c khÃ¡ch hÃ ng vÃ  theo dÃµi chá»‰ sá»‘ kinh doanh. |
| **Payment Gateway** | Secondary | Há»‡ thá»‘ng thanh toÃ¡n bÃªn thá»© ba (VD: MoMo, VNPay). Há»— trá»£ xÃ¡c thá»±c vÃ  xá»­ lÃ½ cÃ¡c giao dá»‹ch tÃ i chÃ­nh tá»« ngÆ°á»i dÃ¹ng. |

---

## 2. MA TRáº¬N USE CASE Tá»”NG THá»‚ (USE CASE CATALOG)

Tá»•ng sá»‘: **16 Use Case** (ÄÃ£ chuáº©n hÃ³a theo má»¥c tiÃªu trá»n váº¹n cá»§a Actor).

| ID | TÃªn Use Case | Actor ChÃ­nh | Actor Há»— trá»£ | Má»©c Ä‘á»™ Æ°u tiÃªn | Trace tá»›i BPMN |
| --- | --- | --- | --- | --- | --- |
| **A. Visitor Journey (HÃ nh trÃ¬nh KhÃ¡ch vÃ£ng lai)** |  |  |  |  |  |
| UC-01 | KhÃ¡m phÃ¡ dá»‹ch vá»¥ | Visitor | - | Medium | NhÃ³m 3.3.1 |
| UC-02 | ÄÄƒng kÃ½ tráº£i nghiá»‡m | Visitor | SMS Gateway | High | NhÃ³m 3.3.1 |
| UC-03 | ÄÄƒng kÃ½ Membership | Visitor | Payment Gateway | High | NhÃ³m 3.3.2 |
| **B. Member Journey (HÃ nh trÃ¬nh Há»™i viÃªn)** |  |  |  |  |  |
| UC-04 | Quáº£n lÃ½ há»“ sÆ¡ cÃ¡ nhÃ¢n | Member | - | Medium | NhÃ³m 3.3.9 |
| UC-05 | Quáº£n lÃ½ káº¿ hoáº¡ch táº­p luyá»‡n | Member | - | High | NhÃ³m 3.3.4 |
| UC-06 | Thá»±c hiá»‡n buá»•i táº­p | Member | - | High | NhÃ³m 3.3.3 |
| UC-07 | Theo dÃµi tiáº¿n trÃ¬nh táº­p luyá»‡n | Member | - | High | NhÃ³m 3.3.5 |
| UC-08 | Quáº£n lÃ½ dinh dÆ°á»¡ng | Member | - | High | NhÃ³m 3.3.6 |
| UC-09 | Mua hoáº·c thuÃª dá»¥ng cá»¥ (Gear) | Member | Payment Gateway | Medium | (Bá»• sung má»›i) |
| UC-10 | Quáº£n lÃ½ Membership | Member | Payment Gateway | High | NhÃ³m 3.3.7 |
| UC-11 | Giá»›i thiá»‡u báº¡n bÃ¨ & Chia sáº» | Member | - | Medium | NhÃ³m 3.3.8 |
| **C. Gym Owner Journey (HÃ nh trÃ¬nh Quáº£n trá»‹)** |  |  |  |  |  |
| UC-12 | Quáº£n lÃ½ dá»‹ch vá»¥ phÃ²ng gym | Admin | - | High | Back-office |
| UC-13 | Quáº£n lÃ½ sáº£n pháº©m Gear & Nutrition | Admin | - | High | Back-office |
| UC-14 | ChÄƒm sÃ³c há»™i viÃªn | Admin | - | Medium | Back-office |
| UC-15 | Theo dÃµi hoáº¡t Ä‘á»™ng kinh doanh | Admin | - | High | Back-office |
| **D. Shared Use Case (TÃ¡c vá»¥ chia sáº»)** |  |  |  |  |  |
| UC-16 | Thanh toÃ¡n (Checkout) | Má»i Actor | Payment Gateway | High | Quy trÃ¬nh chung |

---

## 3. Äáº¶C Táº¢ USE CASE CHI TIáº¾T (USE CASE SPECIFICATION)

**CHÃš Ã:** DÆ°á»›i Ä‘Ã¢y lÃ  máº«u Ä‘áº·c táº£ tiÃªu chuáº©n há»c thuáº­t cho TOÃ€N Bá»˜ 16 Use Case. Má»—i UC bao gá»“m:
- TÃ³m táº¯t (Description)
- Tiá»n Ä‘iá»u kiá»‡n (Pre-conditions)
- Háº­u Ä‘iá»u kiá»‡n (Post-conditions)
- Luá»“ng sá»± kiá»‡n chÃ­nh (Main Flow)
- Luá»“ng ráº½ nhÃ¡nh (Alternative Flows)
- Luá»“ng ngoáº¡i lá»‡ (Exception Flows)
- YÃªu cáº§u Ä‘áº·c biá»‡t (Special Requirements)
- Ghi chÃº khÃ¡c (Notes)
- Usecase liÃªn quan (Related Use Cases)

---

### UC-01: KhÃ¡m phÃ¡ dá»‹ch vá»¥ (Discovery)

* **TÃ³m táº¯t (Description):** KhÃ¡ch vÃ£ng lai (Visitor/Guest) xem thÃ´ng tin cÃ´ng khai vá» phÃ²ng táº­p, tiá»‡n Ã­ch, cÃ¡c gÃ³i táº­p, lá»‹ch há»c Class, há»“ sÆ¡ huáº¥n luyá»‡n viÃªn vÃ  ná»™i dung chia sáº» cÃ´ng khai (Public Fitness Passport) mÃ  khÃ´ng cáº§n Ä‘Äƒng nháº­p.
* **Tiá»n Ä‘iá»u kiá»‡n (Pre-conditions):** Visitor cÃ³ káº¿t ná»‘i internet vÃ  truy cáº­p thÃ nh cÃ´ng vÃ o website FitFuel+ (há»— trá»£ Desktop vÃ  Mobile).
* **Háº­u Ä‘iá»u kiá»‡n (Post-conditions):** Cung cáº¥p thÃ´ng tin, khÃ´ng thay Ä‘á»•i dá»¯ liá»‡u há»‡ thá»‘ng. Ghi nháº­n (Optional) hÃ nh vi xem trang Ä‘á»ƒ Analytics.
* **Luá»“ng sá»± kiá»‡n chÃ­nh (Main Flow):**
  1. Visitor truy cáº­p trang chá»§ (Landing Page) hoáº·c má»¥c "KhÃ¡m phÃ¡ dá»‹ch vá»¥".
  2. Há»‡ thá»‘ng nháº­n diá»‡n phiÃªn truy cáº­p cÃ´ng khai (khÃ´ng yÃªu cáº§u mÃ£ token xÃ¡c thá»±c).
  3. Há»‡ thá»‘ng táº£i vÃ  hiá»ƒn thá»‹:
     - 2 gÃ³i táº­p cá»‘t lÃµi (GÃ³i ThÃ¡ng/NÄƒm) vá»›i mÃ´ táº£, giÃ¡ vÃ  CTA "ÄÄƒng kÃ½".
     - Danh má»¥c trang thiáº¿t bá»‹ (Facility/Amenities) cÃ³ trong phÃ²ng.
     - Danh sÃ¡ch huáº¥n luyá»‡n viÃªn (PT) vá»›i há»“ sÆ¡ cÃ´ng khai (TÃªn, áº¢nh, ChuyÃªn mÃ´n).
     - Lá»‹ch há»c Class trong tuáº§n hiá»‡n táº¡i (vá»›i thÃ´ng tin: TÃªn lá»›p, PT, Khung giá», Sá»‘ chá»— trá»‘ng).
  4. Visitor cÃ³ thá»ƒ dÃ¹ng bá»™ lá»c/tÃ¬m kiáº¿m:
     - TÃ¬m kiáº¿m lá»‹ch Class theo: Khung giá», TÃªn PT, TÃªn lá»›p.
     - Lá»c PT theo chuyÃªn mÃ´n (Yoga, Boxing, HIIT, v.v.).
  5. Há»‡ thá»‘ng hiá»ƒn thá»‹ káº¿t quáº£ vÃ  thÃ´ng tin chi tiáº¿t tÆ°Æ¡ng á»©ng.

* **Luá»“ng ráº½ nhÃ¡nh (Alternative Flows):**
  * *4a. KhÃ´ng tÃ¬m tháº¥y lá»‹ch há»c phÃ¹ há»£p:* Há»‡ thá»‘ng hiá»ƒn thá»‹ giao diá»‡n "KhÃ´ng tÃ¬m tháº¥y káº¿t quáº£" vÃ  tá»± Ä‘á»™ng Ä‘á» xuáº¥t "CÃ¡c lá»›p há»c phá»• biáº¿n nháº¥t trong tuáº§n nÃ y" Ä‘á»ƒ Visitor tham kháº£o (Top 5).
  * *5a. Visitor xem chi tiáº¿t má»™t Class:* Nháº¥p vÃ o lá»›p â†’ Hiá»ƒn thá»‹: PT phá»¥ trÃ¡ch, MÃ´ táº£ lá»›p, Má»©c Ä‘á»™ khÃ³ (Beginner/Intermediate/Advanced), Thá»i lÆ°á»£ng, Sá»‘ chá»— trá»‘ng/Ä‘Ã£ Ä‘áº·t. CTA "Äáº·t chá»—" (yÃªu cáº§u Ä‘Äƒng kÃ½/Trial) hoáº·c "TÃ¬m hiá»ƒu thÃªm".
  * *5b. Visitor xem há»“ sÆ¡ chi tiáº¿t PT:* Nháº¥p vÃ o PT â†’ Hiá»ƒn thá»‹: Tiá»ƒu sá»­, Chá»©ng chá»‰, Lá»‹ch dáº¡y trong tuáº§n, Rating tá»« Member. CTA "Äáº·t buá»•i 1-1" hoáº·c "Xem cÃ¡c lá»›p cá»§a PT nÃ y".
  * *3a. Visitor sá»­ dá»¥ng Goal Engine:* Visitor tráº£ lá»i 5 cÃ¢u há»i nhanh (Má»¥c tiÃªu, Kinh nghiá»‡m, Thá»i gian cÃ³ sáºµn) â†’ Há»‡ thá»‘ng gá»£i Ã½ gÃ³i táº­p phÃ¹ há»£p nháº¥t.

* **Luá»“ng ngoáº¡i lá»‡ (Exception Flows):**
  * *2a. Lá»—i káº¿t ná»‘i cÆ¡ sá»Ÿ dá»¯ liá»‡u:* Há»‡ thá»‘ng khÃ´ng thá»ƒ táº£i danh sÃ¡ch dá»‹ch vá»¥ â†’ Hiá»ƒn thá»‹ thÃ´ng bÃ¡o "Há»‡ thá»‘ng Ä‘ang báº£o trÃ¬, vui lÃ²ng thá»­ láº¡i sau Ã­t phÃºt" vÃ  cung cáº¥p sá»‘ hotline liÃªn há»‡.
  * *3a. ChÆ°a cÃ³ dá»¯ liá»‡u (Tá»©c lÃ  chÆ°a cáº¥u hÃ¬nh PT/Class):* Há»‡ thá»‘ng váº«n hiá»ƒn thá»‹ gÃ³i táº­p, tiá»‡n Ã­ch, vÃ  ghi chÃº "PT vÃ  lá»‹ch Class sáº½ cÃ³ sá»›m" + Email signup Ä‘á»ƒ nháº­n thÃ´ng bÃ¡o.
  * *4a. Táº£i cháº­m (>2s):* Há»‡ thá»‘ng hiá»ƒn thá»‹ skeleton/placeholder trÆ°á»›c, táº£i dá»¯ liá»‡u dáº§n (Lazy loading).

* **YÃªu cáº§u Ä‘áº·c biá»‡t (Special Requirements):**
  * Tá»‘c Ä‘á»™ táº£i trang pháº£i dÆ°á»›i 2 giÃ¢y (FCP â€” First Contentful Paint).
  * Giao diá»‡n pháº£i tá»‘i Æ°u hÃ³a Responsive trÃªn cáº£ Desktop, Tablet, Mobile.
  * Há»— trá»£ Tiáº¿ng Viá»‡t vÃ  Tiáº¿ng Anh (náº¿u khÃ¡ch quá»‘c táº¿).
  * SEO tá»‘i Æ°u: Meta tags, Structured data (Schema.org) cho Class/PT Ä‘á»ƒ cÃ´ng cá»¥ tÃ¬m kiáº¿m index.
  * KhÃ´ng yÃªu cáº§u xÃ¡c thá»±c â†’ Visitor cÃ³ thá»ƒ xem mÃ  khÃ´ng lo cookie/tracking quÃ¡ táº£i.

* **Ghi chÃº khÃ¡c:**
  * Há»‡ thá»‘ng cháº¡y mÃ´ hÃ¬nh Single-Tenant: Táº¥t cáº£ thÃ´ng tin hiá»ƒn thá»‹ chá»‰ thuá»™c má»™t phÃ²ng táº­p duy nháº¥t.
  * Dá»¯ liá»‡u Ä‘Æ°á»£c update tá»« quáº£n lÃ½ Admin (UC-12, UC-13) mÃ  khÃ´ng cáº§n thay Ä‘á»•i mÃ£ FE.

* **Usecase liÃªn quan:** CÃ³ thá»ƒ chuyá»ƒn tiáº¿p sang `UC-02` (Free Trial/Gym Tour) hoáº·c `UC-03` (ÄÄƒng kÃ½ Membership).

---

### UC-07: Theo dÃµi tiáº¿n trÃ¬nh táº­p luyá»‡n (Progress Tracking)

* **TÃ³m táº¯t (Description):** Member xem biá»ƒu Ä‘á»“ vÃ  dá»¯ liá»‡u phÃ¢n tÃ­ch vá» quÃ¡ trÃ¬nh táº­p luyá»‡n (táº§n suáº¥t, khá»‘i lÆ°á»£ng, sá»©c máº¡nh, xu hÆ°á»›ng cÃ¢n náº·ng, PR, Streak), so sÃ¡nh vá»›i má»¥c tiÃªu, phÃ¡t hiá»‡n Plateau (chá»¯ng táº¡a), vÃ  nháº­n gá»£i Ã½ Ä‘iá»u chá»‰nh káº¿ hoáº¡ch tá»« AI. ToÃ n bá»™ lÃ  Read-only, dÃ¹ng Ä‘á»ƒ tá»± Ä‘Ã¡nh giÃ¡ tiáº¿n Ä‘á»™.
* **Tiá»n Ä‘iá»u kiá»‡n (Pre-conditions):** Member Ä‘Ã£ Ä‘Äƒng nháº­p. Member cÃ³ Ã­t nháº¥t 3 buá»•i táº­p trong lá»‹ch sá»­ (Ä‘á»ƒ cÃ³ dá»¯ liá»‡u Ã½ nghÄ©a).
* **Háº­u Ä‘iá»u kiá»‡n (Post-conditions):** Read-only, khÃ´ng thay Ä‘á»•i dá»¯ liá»‡u. Náº¿u Member cháº¥p nháº­n gá»£i Ã½ â†’ Chuyá»ƒn sang UC-05 (Äiá»u chá»‰nh káº¿ hoáº¡ch).
* **Luá»“ng sá»± kiá»‡n chÃ­nh (Main Flow):**
  1. Member vÃ o tab "Tiáº¿n trÃ¬nh" hoáº·c "PhÃ¢n tÃ­ch".
  2. Há»‡ thá»‘ng hiá»ƒn thá»‹ trang phÃ¢n tÃ­ch vá»›i cÃ¡c tab:
     - **Tab 1 - Tá»•ng quan (Overview):**
       - Tháº» KPI: Tá»•ng buá»•i táº­p (lifetime), Streak hiá»‡n táº¡i, Tá»•ng tonnage (tuáº§n nÃ y vs tuáº§n trÆ°á»›c), Tá»•ng PR Ä‘áº¡t Ä‘Æ°á»£c.
       - Biá»ƒu Ä‘á»“ Heatmap: Táº§n suáº¥t táº­p theo ngÃ y trong tuáº§n (Ä‘á» = táº­p nhiá»u, xanh = táº­p Ã­t).
       - Biá»ƒu Ä‘á»“ Tonnage (Khá»‘i lÆ°á»£ng) qua tá»«ng tuáº§n (30 ngÃ y gáº§n nháº¥t).
  3. Member chuyá»ƒn sang **Tab 2 - Chi tiáº¿t theo bÃ i táº­p (Exercise Details):**
     - Danh sÃ¡ch cÃ¡c bÃ i táº­p Member Ä‘Ã£ táº­p.
     - Má»—i bÃ i cÃ³:
       - PR hiá»‡n táº¡i (max weight/reps).
       - Biá»ƒu Ä‘á»“ xu hÆ°á»›ng (30 ngÃ y): Max weight, Avg reps.
       - Lá»‹ch sá»­ 10 buá»•i táº­p gáº§n nháº¥t (ngÃ y, set/rep, weight, RPE).
       - Trend: "Máº¡nh hÆ¡n â†‘" (náº¿u max weight tÄƒng) hoáº·c "Chá»¯ng âš ï¸" (náº¿u khÃ´ng tÄƒng 4 tuáº§n).
  4. Há»‡ thá»‘ng AI phÃ¢n tÃ­ch dá»¯ liá»‡u:
     - PhÃ¡t hiá»‡n Plateau (lÃ¢u khÃ´ng PR má»›i, weight/reps khÃ´ng tÄƒng).
     - PhÃ¡t hiá»‡n Overtraining (Táº§n suáº¥t táº­p quÃ¡ cao, RPE trung bÃ¬nh > 8.5/10).
     - PhÃ¡t hiá»‡n Undertraining (Táº§n suáº¥t tháº¥p, volume quÃ¡ Ã­t so vá»›i má»¥c tiÃªu).
  5. Náº¿u phÃ¡t hiá»‡n váº¥n Ä‘á» â†’ Hiá»ƒn thá»‹ **Tab 3 - Gá»£i Ã½ (Recommendations):**
     - Card Ä‘á»/vÃ ng: "âš ï¸ Báº¡n Ä‘Ã£ chá»¯ng Squat 4 tuáº§n. HÃ£y Ä‘iá»u chá»‰nh táº¡a hoáº·c thay Ä‘á»•i bÃ i táº­p."
     - Gá»£i Ã½ cá»¥ thá»ƒ: "HÃ£y Deload tuáº§n nÃ y (giáº£m 20% táº¡a), sau Ä‘Ã³ lÃªn cao hÆ¡n tuáº§n sau."
     - CTA: "Ãp dá»¥ng gá»£i Ã½" â†’ Äiá»u chá»‰nh káº¿ hoáº¡ch (UC-05).
  6. Member cÃ³ thá»ƒ tÃ¹y chá»‰nh khoáº£ng thá»i gian xem (7 ngÃ y, 30 ngÃ y, 90 ngÃ y, 1 nÄƒm).

* **Luá»“ng ráº½ nhÃ¡nh (Alternative Flows):**
  * *3a. Member chá»n 1 bÃ i táº­p cá»¥ thá»ƒ:* Báº¥m vÃ o bÃ i â†’ Xem chi tiáº¿t: Graph 90 ngÃ y, Báº£ng lá»‹ch sá»­ 20 láº§n gáº§n nháº¥t.
  * *3b. Member xem so sÃ¡nh giá»¯a 2 giai Ä‘oáº¡n:* Chá»n "So sÃ¡nh" â†’ Pick thá»i ká»³ 1 vs thá»i ká»³ 2 â†’ Hiá»ƒn thá»‹ biá»ƒu Ä‘á»“ song song, % thay Ä‘á»•i.
  * *6a. Member xuáº¥t bÃ¡o cÃ¡o:* Báº¥m "Táº£i xuá»‘ng PDF" â†’ Há»‡ thá»‘ng sinh bÃ¡o cÃ¡o chi tiáº¿t â†’ Táº£i file PDF.

* **Luá»“ng ngoáº¡i lá»‡ (Exception Flows):**
  * *2a. ChÆ°a cÃ³ dá»¯ liá»‡u (< 3 buá»•i táº­p):* Há»‡ thá»‘ng hiá»ƒn thá»‹ "Báº¡n cáº§n hoÃ n thÃ nh Ã­t nháº¥t 3 buá»•i táº­p Ä‘á»ƒ xem phÃ¢n tÃ­ch. HÃ£y báº¯t Ä‘áº§u táº­p ngay!" â†’ Link UC-06.
  * *4a. AI khÃ´ng thá»ƒ phÃ¢n tÃ­ch (Data error):* Há»‡ thá»‘ng váº«n hiá»ƒn thá»‹ biá»ƒu Ä‘á»“ cÆ¡ báº£n nhÆ°ng khÃ´ng cÃ³ Tab 3 (Gá»£i Ã½).

* **YÃªu cáº§u Ä‘áº·c biá»‡t (Special Requirements):**
  * Biá»ƒu Ä‘á»“ pháº£i smooth (interactive charts, D3 hoáº·c Recharts).
  * Performance: Táº£i trang <3 giÃ¢y ngay cáº£ vá»›i 1 nÄƒm dá»¯ liá»‡u.
  * Giao diá»‡n tá»‘i Æ°u Mobile.
  * Há»— trá»£ Dark mode.
  * Biá»ƒu Ä‘á»“ pháº£i cÃ³ tooltip chi tiáº¿t khi hover.

* **Ghi chÃº khÃ¡c:**
  * Plateau Ä‘Æ°á»£c Ä‘á»‹nh nghÄ©a: Max weight khÃ´ng tÄƒng trong 28 ngÃ y.
  * Overtraining: Táº­p 6+ ngÃ y/tuáº§n hoáº·c RPE trung bÃ¬nh > 8.5/10 trong 2 tuáº§n liÃªn tiáº¿p.

* **Usecase liÃªn quan:** `<<extends>> UC-05` (Äiá»u chá»‰nh káº¿ hoáº¡ch); `<<post-condition>> UC-06` (Láº¥y dá»¯ liá»‡u tá»« buá»•i táº­p).

---

### UC-08 Ä‘áº¿n UC-16: (Äang hoÃ n thiá»‡n...)

*CÃ¡c use case UC-08 (Quáº£n lÃ½ dinh dÆ°á»¡ng), UC-09 (Mua/ThuÃª Gear), UC-10 (Quáº£n lÃ½ Membership), UC-11 (Chia sáº»), UC-12-15 (Admin), UC-16 (Thanh toÃ¡n) sáº½ Ä‘Æ°á»£c bá»• sung vá»›i má»©c chi tiáº¿t tÆ°Æ¡ng tá»±.*

========================================================================
Káº¾T THÃšC FILE 03
========================================================================

