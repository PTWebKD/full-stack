# 10. BIEU DO LOP
# (Class Diagram)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 11/05/2026

========================================================================

Giai thich ky hieu:

  +===============+
  |  Ten Lop      |    Phan 1: Ten lop (Class name)
  |===============|
  | - thuoc_tinh  |    Phan 2: Thuoc tinh (Attributes)
  |===============|
  | + phuong_thuc |    Phan 3: Phuong thuc (Methods)
  +===============+

  Ky hieu pham vi truy cap (Access Modifier):
    +   public    : Truy cap tu bat ky dau.
    -   private   : Chi truy cap trong chinh lop do.
    #   protected : Truy cap trong lop va lop con.

  Ky hieu quan he:
    -------->     : Association (Lien ket). A biet den B.
    - - - - ->    : Dependency (Phu thuoc). A su dung B.
    =========>    : Generalization (Ke thua). A ke thua B.
    <>------->    : Aggregation (Gom nhom). A chua B, B ton tai doc lap.
    <*>------>    : Composition (Hop thanh). A chua B, B khong ton tai
                    doc lap khi A bi xoa.

  So boi (Multiplicity):
    1             : Dung 1.
    0..1          : Khong hoac 1.
    0..*          : Khong hoac nhieu (tuong duong *).
    1..*          : 1 hoac nhieu.

========================================================================

## 1. CLASS DIAGRAM CHINH
========================================================================

------------------------------------------------------------------------
### 1.1. Lop User
------------------------------------------------------------------------

```
+=============================================+
|                   User                      |
|=============================================|
| - user_id         : int                    |
| - email           : string                 |
| - phone           : string                 |
| - password_hash   : string                 |
| - role            : Role                   |
| - display_name    : string                 |
| - avatar_url      : string                 |
| - fitness_goal    : FitnessGoal            |
| - xp_total        : int                    |
| - current_level   : int                    |
| - current_streak  : int                    |
| - fitcoin_balance : decimal                |
| - tdee            : int                    |
| - referred_by     : int                    |
| - created_at      : datetime               |
|=============================================|
| + register(email, password, name) : User   |
| + login(email, password) : JWT             |
| + loginOTP(phone, otp) : JWT               |
| + updateProfile(data) : void               |
| + changePassword(old, new) : void          |
| + calculateTDEE(data) : int                |
| + earnXP(amount, source) : void            |
| + earnFitCoin(amount, source) : void       |
| + spendFitCoin(amount, source) : boolean   |
| + getPassport() : FitnessPassport          |
| + deleteAccount() : void                   |
+=============================================+
```

Quan he cua User:
  User  1 ---- 1    FitnessPassport    (Composition: xoa user = xoa passport)
  User  1 ---- 0..* WorkoutSession     (Aggregation: user co nhieu session)
  User  1 ---- 0..* FoodOrder          (Association)
  User  1 ---- 0..* GearItem           (Association: voi vai tro owner)
  User  1 ---- 0..* FoodProduct        (Association: voi vai tro vendor)
  User  0..* ---- 0..* User            (Association: thong qua FOLLOWS)

------------------------------------------------------------------------
### 1.2. Lop FitnessPassport
------------------------------------------------------------------------

```
+=============================================+
|            FitnessPassport                  |
|=============================================|
| - passport_id      : int                   |
| - user_id          : int                   |
| - total_sessions   : int                   |
| - total_volume     : decimal               |
| - longest_streak   : int                   |
| - body_weight_log  : JSON                  |
| - body_photos      : JSON                  |
| - milestone_badges : JSON                  |
| - is_public        : boolean               |
| - created_at       : datetime              |
|=============================================|
| + updateStats(session) : void              |
| + addBodyWeight(date, kg) : void           |
| + addBodyPhoto(date, url) : void           |
| + unlockBadge(badge_id) : void             |
| + getTimeline() : TimelineEntry[]          |
| + togglePublic() : void                    |
+=============================================+
```

------------------------------------------------------------------------
### 1.3. Lop WorkoutSession
------------------------------------------------------------------------

```
+=============================================+
|            WorkoutSession                   |
|=============================================|
| - session_id   : int                       |
| - user_id      : int                       |
| - gym_id       : int                       |
| - date         : date                      |
| - duration_min : int                       |
| - status       : SessionStatus             |
| - notes        : string                    |
| - created_at   : datetime                  |
|=============================================|
| + create(user_id, date, notes) : Session   |
| + addExercise(exercise_data) : ExerciseLog |
| + complete() : SessionResult               |
| + cancel() : void                          |
| + getDuration() : int                      |
| + getTotalVolume() : decimal               |
| + getMuscleGroups() : MuscleGroup[]        |
+=============================================+

  WorkoutSession 1 ---- 1..* ExerciseLog  (Composition)
```

------------------------------------------------------------------------
### 1.4. Lop ExerciseLog
------------------------------------------------------------------------

```
+=============================================+
|              ExerciseLog                    |
|=============================================|
| - log_id        : int                      |
| - session_id    : int                      |
| - exercise_name : string                   |
| - muscle_group  : MuscleGroup              |
| - sets          : SetData[]                |
| - is_pr         : boolean                  |
| - notes         : string                   |
| - created_at    : datetime                 |
|=============================================|
| + addSet(reps, weight) : void              |
| + removeSet(index) : void                  |
| + updateSet(index, reps, weight) : void    |
| + checkPR(user_id) : boolean               |
| + getVolume() : decimal                    |
| + getMaxWeight() : decimal                 |
+=============================================+

  Kieu du lieu phu:
  SetData = { reps: int, weight: decimal }
```

------------------------------------------------------------------------
### 1.5. Lop FoodProduct
------------------------------------------------------------------------

```
+=============================================+
|              FoodProduct                    |
|=============================================|
| - product_id    : int                      |
| - vendor_id     : int                      |
| - name          : string                   |
| - description   : string                   |
| - price         : decimal                  |
| - calories      : int                      |
| - protein_g     : decimal                  |
| - carb_g        : decimal                  |
| - fat_g         : decimal                  |
| - ingredients   : string[]                 |
| - allergens     : string[]                 |
| - images        : string[]                 |
| - is_available  : boolean                  |
| - avg_rating    : decimal                  |
| - total_reviews : int                      |
| - created_at    : datetime                 |
|=============================================|
| + create(vendor_id, data) : FoodProduct    |
| + update(data) : void                      |
| + getMacroBreakdown() : MacroData          |
| + toggleAvailability() : void              |
| + getReviews() : FoodReview[]              |
| + updateRating() : void                    |
+=============================================+

  FoodProduct 1 ---- 0..* FoodReview  (Aggregation)
```

------------------------------------------------------------------------
### 1.6. Lop FoodOrder
------------------------------------------------------------------------

```
+=============================================+
|               FoodOrder                     |
|=============================================|
| - order_id        : int                    |
| - user_id         : int                    |
| - guest_phone     : string                 |
| - vendor_id       : int                    |
| - items           : OrderItem[]            |
| - total_amount    : decimal                |
| - fitcoin_used    : decimal                |
| - delivery_address: string                 |
| - delivery_time   : string                 |
| - status          : OrderStatus            |
| - payment_method  : string                 |
| - is_meal_prep    : boolean                |
| - created_at      : datetime               |
|=============================================|
| + create(data) : FoodOrder                 |
| + updateStatus(status) : void              |
| + calculateTotal() : decimal               |
| + cancel() : boolean                       |
| + reorder() : FoodOrder                    |
| + isGuestOrder() : boolean                 |
+=============================================+

  Kieu du lieu phu:
  OrderItem = { product_id: int, qty: int, size: string, price: decimal }
```

------------------------------------------------------------------------
### 1.7. Lop GearItem
------------------------------------------------------------------------

```
+=============================================+
|                GearItem                     |
|=============================================|
| - gear_id          : string                |
| - current_owner_id : int                   |
| - category         : GearCategory          |
| - name             : string                |
| - description      : string                |
| - condition_rating : int                   |
| - condition_notes  : string                |
| - images           : string[]              |
| - listing_type     : ListingType           |
| - sell_price       : decimal               |
| - rent_price_day   : decimal               |
| - rent_price_week  : decimal               |
| - deposit_amount   : decimal               |
| - qr_code_url      : string               |
| - is_available     : boolean               |
| - created_at       : datetime              |
|=============================================|
| + create(data) : GearItem                  |
| + generateGearId() : string                |
| + generateQRCode() : string                |
| + getLifecycle() : GearLifecycleEntry[]    |
| + transferOwnership(new_owner) : void      |
| + updateCondition(rating, notes) : void    |
| + markUnavailable() : void                 |
+=============================================+

  GearItem 1 ---- 1..* GearLifecycleEntry  (Composition)
  GearItem 1 ---- 0..* GearTransaction     (Aggregation)
```

------------------------------------------------------------------------
### 1.8. Lop GearLifecycleEntry
------------------------------------------------------------------------

```
+=============================================+
|          GearLifecycleEntry                 |
|=============================================|
| - lifecycle_id     : int                   |
| - gear_id          : string                |
| - owner_id         : int                   |
| - action           : GearAction            |
| - condition_at_time: int                   |
| - notes            : string                |
| - photos           : string[]              |
| - timestamp        : datetime              |
|=============================================|
| + create(gear_id, owner, action, data) :   |
|   GearLifecycleEntry                       |
+=============================================+
```

------------------------------------------------------------------------
### 1.9. Lop Challenge
------------------------------------------------------------------------

```
+=============================================+
|               Challenge                     |
|=============================================|
| - challenge_id   : int                     |
| - title          : string                  |
| - description    : string                  |
| - type           : ChallengeType           |
| - criteria       : JSON                    |
| - reward_xp      : int                     |
| - reward_fitcoin : decimal                 |
| - start_date     : date                    |
| - end_date       : date                    |
| - is_active      : boolean                 |
|=============================================|
| + create(data) : Challenge                 |
| + join(user_id) : UserChallenge            |
| + updateProgress(user_id, data) : void     |
| + checkCompletion(user_id) : boolean       |
| + getParticipants() : User[]               |
| + getLeaderboard() : RankEntry[]           |
+=============================================+

  Challenge 1 ---- 0..* UserChallenge  (Aggregation)
```

========================================================================

## 2. UTILITY CLASSES (KHONG CO STATE, CHI CO METHOD)
========================================================================

```
+=============================================+
|         SuggestionEngine                    |
|=============================================|
|  (Khong co thuoc tinh - Utility class)     |
|=============================================|
| + suggestFood(muscle_groups) : FoodProduct[]|
| + suggestGear(gym_logs) : GearItem[]       |
| + suggestWorkout(frequency) : MuscleGroup[]|
| + getMacroPriority(muscle) : MacroPriority |
+=============================================+

+=============================================+
|         GamificationService                 |
|=============================================|
|  (Khong co thuoc tinh - Utility class)     |
|=============================================|
| + calculateXP(action, data) : int          |
| + checkLevelUp(user) : boolean             |
| + checkBadgeUnlock(user) : Badge[]         |
| + updateStreak(user) : int                 |
| + resetStreak(user) : void                 |
| + getRanking(filter) : RankEntry[]         |
| + getXPForLevel(level) : int               |
+=============================================+

+=============================================+
|            FitCoinService                   |
|=============================================|
|  (Khong co thuoc tinh - Utility class)     |
|=============================================|
| + earn(user, amount, source) : Transaction |
| + spend(user, amount, source) : boolean    |
| + deposit(user, amount) : Transaction      |
| + refund(user, amount, source) : Transaction|
| + getBalance(user) : decimal               |
| + getHistory(user) : Transaction[]         |
| + validateSpend(user, amount) : boolean    |
+=============================================+

+=============================================+
|            OTPService                       |
|=============================================|
|  (Khong co thuoc tinh - Utility class)     |
|=============================================|
| + generateOTP(phone) : string              |
| + sendSMS(phone, otp) : boolean            |
| + verifyOTP(phone, otp) : boolean          |
| + isLocked(phone) : boolean                |
+=============================================+
```

========================================================================

## 3. ENUM DEFINITIONS
========================================================================

```
ENUM Role:
  guest, member, vendor, gym_owner, gym_owner

ENUM FitnessGoal:
  bulk, cut, maintain

ENUM MuscleGroup:
  chest, back, legs, shoulders, arms, core

ENUM SessionStatus:
  active, done, cancelled

ENUM OrderStatus:
  pending, confirmed, preparing, delivering, delivered, cancelled

ENUM GearCategory:
  resistance_band, dumbbell, belt, gloves, mat, machine_mini, other

ENUM GearAction:
  listed, sold, rented, returned, relisted

ENUM ListingType:
  sell, rent, both

ENUM ChallengeType:
  weekly, monthly, special

ENUM FitCoinTxnType:
  earn, spend, deposit, refund

ENUM FitCoinSource:
  gear_sale, challenge, referral, streak, deposit,
  food_order, gear_rental, membership
```

========================================================================

## 4. TONG HOP QUAN HE GIUA CAC LOP
========================================================================

Lop A                | Quan he       | Lop B                | Boi so
---------------------|---------------|----------------------|-----------
User                 | Composition   | FitnessPassport      | 1 -- 1
User                 | Aggregation   | WorkoutSession       | 1 -- 0..*
User                 | Association   | FoodOrder            | 1 -- 0..*
User                 | Association   | FoodProduct          | 1 -- 0..*
User                 | Association   | GearItem             | 1 -- 0..*
User                 | Association   | User (FOLLOWS)       | 0..* -- 0..*
WorkoutSession       | Composition   | ExerciseLog          | 1 -- 1..*
FoodProduct          | Aggregation   | FoodReview           | 1 -- 0..*
GearItem             | Composition   | GearLifecycleEntry   | 1 -- 1..*
GearItem             | Aggregation   | GearTransaction      | 1 -- 0..*
Challenge            | Aggregation   | UserChallenge        | 1 -- 0..*
User                 | Dependency    | SuggestionEngine     | (su dung)
User                 | Dependency    | GamificationService  | (su dung)
User                 | Dependency    | FitCoinService       | (su dung)
FoodOrder            | Dependency    | OTPService           | (Guest checkout)

========================================================================
KET THUC FILE 10
========================================================================
