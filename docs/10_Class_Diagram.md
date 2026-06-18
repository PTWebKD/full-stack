# 10. BIEU DO LOP
# (Class Diagram)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 18/06/2026 (Cap nhat: Dinh huong lai Gym Management System — bo FoodProduct/GearItem)

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

## 1. NHOM NGUOI DUNG
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
| - role            : Role                   | // chi 'member' hoac 'gym_owner'
| - display_name    : string                 |
| - avatar_url      : string                 |
| - fitness_goal    : FitnessGoal            |
| - height_cm       : int                    |
| - weight_kg       : decimal                |
| - xp_total        : int                    |
| - current_level   : int                    |
| - current_streak  : int                    |
| - fitcoin_balance : decimal                |
| - tdee            : int                    |
| - is_active       : boolean                |
| - referred_by     : int                    |
| - created_at      : datetime               |
|=============================================|
| + register(data) : User                    |
| + login(email, password) : JWT             |
| + updateProfile(data) : void               |
| + changePassword(old, new) : void          |
| + calculateTDEE() : int                    |
| + earnXP(amount, source) : void            |
| + earnFitCoin(amount, source) : void       |
| + spendFitCoin(amount, source) : boolean   |
| + getPassport() : FitnessPassport          |
| + getMembership() : GymMembership          |
| + deleteAccount() : void                   |
+=============================================+
```

Quan he cua User:
  User  1 ---- 1    FitnessPassport   (Composition)
  User  1 ---- 0..1 GymMembership    (Aggregation)
  User  1 ---- 0..* WorkoutSession   (Aggregation)
  User  1 ---- 0..* NutritionOrder   (Aggregation)
  User  1 ---- 0..* AssetAssignment  (Aggregation)
  User  1 ---- 0..* PTBooking        (Aggregation)
  User  1 ---- 0..* Recommendation   (Aggregation)
  User  0..* ---- 0..* User          (Association: thong qua FOLLOWS)

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

========================================================================

## 2. NHOM MEMBERSHIP
========================================================================

------------------------------------------------------------------------
### 2.1. Lop MembershipPlan
------------------------------------------------------------------------

```
+=============================================+
|            MembershipPlan                   |
|=============================================|
| - plan_id          : int                   |
| - gym_id           : int                   | // luon = 1 (single-tenant)
| - plan_name        : string                | // 'Goi Thang' hoac 'Goi Nam'
| - price_monthly    : decimal               |
| - price_annual     : decimal               |
| - description      : string                |
| - includes_towel   : boolean               |
| - includes_locker  : boolean               |
| - includes_pt      : boolean               |
| - pt_sessions_per_month : int              |
| - is_active        : boolean               |
|=============================================|
| + create(data) : MembershipPlan            |
| + update(data) : void                      |
| + getAmenities() : AmenityList             |
| + compareWith(other) : PriceDiff           |
+=============================================+
```

------------------------------------------------------------------------
### 2.2. Lop GymMembership
------------------------------------------------------------------------

```
+=============================================+
|            GymMembership                   |
|=============================================|
| - membership_id  : int                     |
| - user_id        : int                     |
| - gym_id         : int                     | // luon = 1
| - plan_id        : int                     |
| - start_date     : date                    |
| - end_date       : date                    |
| - status         : MembershipStatus        |
| - auto_renew     : boolean                 |
| - created_at     : datetime                |
|=============================================|
| + register(user_id, plan_id) : GymMembership |
| + renew(duration) : MembershipHistory      |
| + upgrade(new_plan_id) : MembershipHistory  |
| + suspend(reason, days) : void             |
| + cancel() : void                          |
| + isActive() : boolean                     |
| + isExpiringSoon(days) : boolean           |
| + getDaysRemaining() : int                 |
| + getUpgradeCost(target_plan) : decimal    |
+=============================================+
```

GymMembership 1 ---- 1..* MembershipHistory  (Aggregation)

------------------------------------------------------------------------
### 2.3. Lop MembershipHistory
------------------------------------------------------------------------

```
+=============================================+
|           MembershipHistory                 |
|=============================================|
| - history_id    : int                      |
| - membership_id : int                      |
| - change_type   : ChangeType               |
| - old_plan_id   : int                      |
| - new_plan_id   : int                      |
| - old_end_date  : date                     |
| - new_end_date  : date                     |
| - changed_by    : int                      | // user_id cua actor
| - notes         : string                   |
| - created_at    : datetime                 |
|=============================================|
| + create(data) : MembershipHistory         |
+=============================================+
```

========================================================================

## 3. NHOM GYM TRACKING
========================================================================

------------------------------------------------------------------------
### 3.1. Lop WorkoutSession
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
| + create(user_id, date) : WorkoutSession   |
| + addExercise(data) : ExerciseLog          |
| + complete() : SessionResult               |
| + cancel() : void                          |
| + getTotalVolume() : decimal               |
| + getMuscleGroups() : MuscleGroup[]        |
+=============================================+

  WorkoutSession 1 ---- 1..* ExerciseLog  (Composition)
```

------------------------------------------------------------------------
### 3.2. Lop ExerciseLog
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
| + checkPR(user_id) : boolean               |
| + getVolume() : decimal                    |
+=============================================+

  Kieu du lieu phu:
  SetData = { reps: int, weight: decimal }
```

------------------------------------------------------------------------
### 3.3. Lop CheckIn
------------------------------------------------------------------------

```
+=============================================+
|                CheckIn                      |
|=============================================|
| - check_in_id   : int                      |
| - user_id       : int                      |
| - membership_id : int                      |
| - checked_in_at : datetime                 |
| - checked_out_at: datetime                 |
| - note          : string                   |
|=============================================|
| + create(user_id, membership_id) : CheckIn |
| + checkout(check_in_id) : void             |
| + validateMembership(user_id) : boolean    |
| + getDuration() : int                      |
+=============================================+
```

========================================================================

## 4. NHOM DINH DUONG (NOI BO)
========================================================================

------------------------------------------------------------------------
### 4.1. Lop NutritionProduct
------------------------------------------------------------------------

```
+=============================================+
|            NutritionProduct                 |
|=============================================|
| - product_id         : int                 |
| - gym_id             : int                 | // luon = 1, ban noi bo
| - name               : string              |
| - category           : NutritionCategory   |
| - description        : string              |
| - price              : decimal             |
| - calories           : int                 |
| - protein_g          : decimal             |
| - carb_g             : decimal             |
| - fat_g              : decimal             |
| - image_url          : string              |
| - is_available       : boolean             |
| - low_stock_threshold: int                 |
| - created_at         : datetime            |
|=============================================|
| + create(data) : NutritionProduct          |
| + update(data) : void                      |
| + toggleAvailability() : void              |
| + getMacroBreakdown() : MacroData          |
| + isLowStock() : boolean                   |
+=============================================+

  NutritionProduct 1 ---- 1 Inventory  (Composition)
```

------------------------------------------------------------------------
### 4.2. Lop Inventory
------------------------------------------------------------------------

```
+=============================================+
|                Inventory                    |
|=============================================|
| - inventory_id  : int                      |
| - product_id    : int                      |
| - qty_in_stock  : int                      |
| - qty_reserved  : int                      |
| - last_restocked: datetime                 |
| - updated_at    : datetime                 |
|=============================================|
| + deduct(qty) : boolean                    |
| + restock(qty) : void                      |
| + getAvailableQty() : int                  |
| + isLow(threshold) : boolean               |
+=============================================+
```

------------------------------------------------------------------------
### 4.3. Lop NutritionOrder
------------------------------------------------------------------------

```
+=============================================+
|            NutritionOrder                   |
|=============================================|
| - order_id      : int                      |
| - user_id       : int                      |
| - order_type    : OrderType                | // 'pos','preorder'
| - total_amount  : decimal                  |
| - fitcoin_used  : decimal                  |
| - status        : NutritionOrderStatus     |
| - served_by     : int                      | // staff user_id
| - created_at    : datetime                 |
|=============================================|
| + createPOS(member_id, items) : NutritionOrder |
| + createPreorder(member_id, items) : NutritionOrder |
| + updateStatus(status) : void              |
| + calculateTotal() : decimal               |
| + cancel() : boolean                       |
+=============================================+

  NutritionOrder 1 ---- 1..* NutritionOrderItem  (Composition)
```

========================================================================

## 5. NHOM TAI SAN & TIEN ICH
========================================================================

------------------------------------------------------------------------
### 5.1. Lop Asset
------------------------------------------------------------------------

```
+=============================================+
|                  Asset                      |
|=============================================|
| - asset_id      : int                      |
| - gym_id        : int                      |
| - asset_type    : string                   | // 'towel','mat','dumbbell'...
| - name          : string                   |
| - total_qty     : int                      |
| - available_qty : int                      |
| - condition     : AssetCondition           |
| - qr_code       : string                   |
| - is_active     : boolean                  |
| - purchase_date : date                     |
| - notes         : string                   |
|=============================================|
| + create(data) : Asset                     |
| + assign(user_id, check_in_id) : AssetAssignment |
| + returnAsset(assignment_id, condition) : void |
| + markMaintenance() : void                 |
| + getOccupancyRate() : decimal             |
+=============================================+
```

------------------------------------------------------------------------
### 5.2. Lop Locker
------------------------------------------------------------------------

```
+=============================================+
|                  Locker                     |
|=============================================|
| - locker_id     : int                      |
| - gym_id        : int                      |
| - locker_number : string                   |
| - locker_type   : LockerType               | // 'daily','monthly'
| - status        : LockerStatus             |
| - assigned_to   : int                      | // user_id
| - expires_at    : date                     |
| - notes         : string                   |
|=============================================|
| + assign(user_id, type) : Locker           |
| + release() : void                         |
| + extendMonth() : void                     |
| + isExpired() : boolean                    |
| + getOccupancyRate() : decimal             |
+=============================================+
```

------------------------------------------------------------------------
### 5.3. Lop AssetAssignment
------------------------------------------------------------------------

```
+=============================================+
|            AssetAssignment                  |
|=============================================|
| - assignment_id  : int                     |
| - asset_id       : int                     | // nullable
| - locker_id      : int                     | // nullable
| - user_id        : int                     |
| - check_in_id    : int                     |
| - assigned_at    : datetime                |
| - returned_at    : datetime                |
| - return_condition: ReturnCondition        |
| - status         : AssignmentStatus        |
|=============================================|
| + create(data) : AssetAssignment           |
| + recordReturn(condition) : void           |
| + createPenalty(type, amount) : AssetPenalty |
| + isOverdue() : boolean                    |
+=============================================+

  AssetAssignment 1 ---- 0..1 AssetPenalty  (Aggregation)
```

========================================================================

## 6. NHOM PT / HUAN LUYEN VIEN
========================================================================

------------------------------------------------------------------------
### 6.1. Lop PTTrainer
------------------------------------------------------------------------

```
+=============================================+
|               PTTrainer                     |
|=============================================|
| - trainer_id    : int                      |
| - user_id       : int                      | // TK user cua HLV
| - speciality    : string[]                 |
| - bio           : string                   |
| - hourly_rate   : decimal                  |
| - is_active     : boolean                  |
|=============================================|
| + create(data) : PTTrainer                 |
| + getSchedule(week) : PTBooking[]          |
| + getAvailableSlots(date) : TimeSlot[]     |
+=============================================+
```

------------------------------------------------------------------------
### 6.2. Lop PTBooking
------------------------------------------------------------------------

```
+=============================================+
|               PTBooking                     |
|=============================================|
| - booking_id    : int                      |
| - member_id     : int                      |
| - trainer_id    : int                      |
| - scheduled_at  : datetime                 |
| - duration_min  : int                      |
| - status        : BookingStatus            |
| - notes         : string                   |
| - created_at    : datetime                 |
|=============================================|
| + create(member_id, trainer_id, time) : PTBooking |
| + cancel() : void                          |
| + confirm() : void                         |
| + complete(session_data) : PTSession       |
+=============================================+

  PTBooking 1 ---- 0..1 PTSession  (Aggregation)
```

========================================================================

## 7. NHOM AI RETENTION
========================================================================

------------------------------------------------------------------------
### 7.1. Lop Recommendation
------------------------------------------------------------------------

```
+=============================================+
|             Recommendation                  |
|=============================================|
| - rec_id        : int                      |
| - user_id       : int                      |
| - rec_type      : RecommendationType       |
| - priority      : Priority                 |
| - suggestion_text: string                  |
| - status        : RecStatus                |
| - resolved_at   : datetime                 |
| - created_at    : datetime                 |
|=============================================|
| + create(user_id, type) : Recommendation   |
| + handle(outcome, notes) : MemberCareLog   |
| + dismiss() : void                         |
| + isDuplicate(user_id, type) : boolean     |
+=============================================+

  Recommendation 1 ---- 0..* MemberCareLog  (Aggregation)
```

------------------------------------------------------------------------
### 7.2. Lop MemberCareLog
------------------------------------------------------------------------

```
+=============================================+
|             MemberCareLog                   |
|=============================================|
| - log_id        : int                      |
| - rec_id        : int                      |
| - handled_by    : int                      | // staff user_id
| - outcome       : Outcome                  |
| - notes         : string                   |
| - handled_at    : datetime                 |
|=============================================|
| + create(rec_id, staff_id, data) : MemberCareLog |
+=============================================+
```

========================================================================

## 8. NHOM GAMIFICATION
========================================================================

------------------------------------------------------------------------
### 8.1. Lop Challenge
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
| + getLeaderboard() : RankEntry[]           |
+=============================================+

  Challenge 1 ---- 0..* UserChallenge  (Aggregation)
```

========================================================================

## 9. UTILITY CLASSES
========================================================================

```
+=============================================+
|        AIRetentionEngine                   |
|=============================================|
|  (Khong co thuoc tinh - Utility class)     |
|=============================================|
| + scanAllMembers() : void                   |
| + checkRenewReminder(user) : boolean        |
| + checkInactiveAlert(user) : boolean        |
| + checkUpsellPlan(user) : boolean           |
| + checkUpsellPT(user) : boolean             |
| + checkUpsellNutrition(user) : boolean      |
| + hasPendingRec(user_id, type) : boolean    |
| + createRecommendation(data) : void         |
| + suggestNutrition(muscle_groups) : NutritionProduct[] |
+=============================================+

+=============================================+
|         GamificationService                |
|=============================================|
|  (Khong co thuoc tinh - Utility class)     |
|=============================================|
| + calculateXP(action, data) : int          |
| + checkLevelUp(user) : boolean             |
| + checkBadgeUnlock(user) : Badge[]         |
| + updateStreak(user) : int                 |
| + resetStreak(user) : void                 |
| + getRanking(filter) : RankEntry[]         |
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
| + validateSpend(user, amount) : boolean    |
+=============================================+

+=============================================+
|           PaymentService                    |
|=============================================|
|  (Khong co thuoc tinh - Utility class)     |
|=============================================|
| + createInvoice(data) : Invoice            |
| + initiatePayment(invoice_id, method) : string | // return redirect_url
| + processCallback(payload) : boolean       |
| + verifyHMAC(payload, secret) : boolean    |
| + refund(invoice_id, amount) : void        |
+=============================================+
```

========================================================================

## 9A. NHOM TRANSFORMATION JOURNEY ENGINE
========================================================================

------------------------------------------------------------------------
### 9A.1. Lop TransformationGoal
------------------------------------------------------------------------

```
+=============================================+
|           TransformationGoal               |
|=============================================|
| - goal_id       : int                      |
| - user_id       : int                      |
| - goal_type     : GoalType                 |
| - target_desc   : string                   |
| - target_value  : decimal                  |
| - target_metric : TargetMetric             |
| - deadline      : date                     |
| - status        : GoalStatus               |
| - created_at    : datetime                 |
|=============================================|
| + create(user_id, data) : TransformationGoal |
| + achieve() : void                         |
| + abandon() : void                         |
| + getProgress() : decimal                  |
| + isActive() : boolean                     |
+=============================================+
```

------------------------------------------------------------------------
### 9A.2. Lop WorkoutProgram
------------------------------------------------------------------------

```
+=============================================+
|             WorkoutProgram                  |
|=============================================|
| - program_id    : int                      |
| - gym_id        : int                      | // luon = 1
| - name          : string                   |
| - goal_type     : GoalType                 |
| - level         : FitnessLevel             |
| - duration_weeks: int                      |
| - days_per_week : int                      |
| - description   : string                   |
| - is_active     : boolean                  |
|=============================================|
| + create(data) : WorkoutProgram            |
| + getDayPlan(week, day) : ProgramDay       |
| + matchesGoal(goal) : boolean              |
| + getActiveMemberCount() : int             |
+=============================================+

  WorkoutProgram 1 ---- 1..* ProgramDay  (Composition)
```

------------------------------------------------------------------------
### 9A.3. Lop ProgramDay
------------------------------------------------------------------------

```
+=============================================+
|               ProgramDay                   |
|=============================================|
| - day_id        : int                      |
| - program_id    : int                      |
| - week_number   : int                      |
| - day_number    : int                      |
| - session_name  : string                   |
| - muscle_focus  : MuscleGroup[]            |
| - is_rest_day   : boolean                  |
|=============================================|
| + getExercises() : ProgramExercise[]       |
| + getTotalSets() : int                     |
| + getEstimatedMinutes() : int              |
+=============================================+

  ProgramDay 1 ---- 1..* ProgramExercise  (Composition)
```

------------------------------------------------------------------------
### 9A.4. Lop MemberProgram
------------------------------------------------------------------------

```
+=============================================+
|              MemberProgram                  |
|=============================================|
| - member_program_id : int                  |
| - user_id           : int                  |
| - program_id        : int                  |
| - goal_id           : int                  |
| - start_date        : date                 |
| - expected_end_date : date                 |
| - current_week      : int                  |
| - status            : MemberProgramStatus  |
| - completion_pct    : decimal              |
| - created_at        : datetime             |
|=============================================|
| + start(user_id, program_id, goal_id) : MemberProgram |
| + getTodayPlan() : ProgramDay              |
| + advanceWeek() : void                     |
| + updateCompletion() : void                |
| + pause() : void                           |
| + abandon() : void                         |
| + complete() : void                        |
+=============================================+
```

------------------------------------------------------------------------
### 9A.5. Lop BodyMetrics
------------------------------------------------------------------------

```
+=============================================+
|               BodyMetrics                   |
|=============================================|
| - metric_id     : int                      |
| - user_id       : int                      |
| - recorded_at   : datetime                 |
| - weight_kg     : decimal                  |
| - body_fat_pct  : decimal                  |
| - waist_cm      : decimal                  |
| - chest_cm      : decimal                  |
| - arm_cm        : decimal                  |
|=============================================|
| + record(user_id, data) : BodyMetrics      |
| + getTrend(user_id, metric, weeks) : decimal[] |
| + getChange(from, to) : MetricDelta        |
+=============================================+
```

------------------------------------------------------------------------
### 9A.6. Lop PersonalRecord
------------------------------------------------------------------------

```
+=============================================+
|              PersonalRecord                 |
|=============================================|
| - pr_id          : int                     |
| - user_id        : int                     |
| - exercise_name  : string                  |
| - pr_type        : PRType                  |
| - pr_value       : decimal                 |
| - previous_value : decimal                 |
| - improvement_pct: decimal                 |
| - achieved_at    : datetime                |
| - session_id     : int                     |
|=============================================|
| + checkAndCreate(log) : PersonalRecord|null |
| + getByExercise(user, exercise) : PersonalRecord[] |
| + getImprovementSince(user, weeks) : decimal |
+=============================================+
```

------------------------------------------------------------------------
### 9A.7. Lop MilestoneAchievement
------------------------------------------------------------------------

```
+=============================================+
|           MilestoneAchievement              |
|=============================================|
| - achievement_id : int                     |
| - user_id        : int                     |
| - milestone_code : string                  |
| - milestone_data : JSON                    |
| - fitcoin_awarded: int                     |
| - xp_awarded     : int                     |
| - share_card_url : string                  |
| - is_shared      : boolean                 |
| - achieved_at    : datetime                |
|=============================================|
| + award(user_id, code, data) : MilestoneAchievement |
| + generateShareCard() : string             |
| + markShared() : void                      |
| + hasEarned(user_id, code) : boolean       |
+=============================================+
```

------------------------------------------------------------------------
### 9A.8. Lop TransformationJourneyEngine (Utility)
------------------------------------------------------------------------

```
+=============================================+
|      TransformationJourneyEngine            |
|=============================================|
|  (Khong co thuoc tinh - Utility class)     |
|=============================================|
| + matchPrograms(goal) : WorkoutProgram[]   |
| + getTodayWorkout(user_id) : ProgramDay    |
| + checkProgressiveOverload(log) : JSON     |
| + checkMilestones(user_id, event) : MilestoneAchievement[] |
| + triggerNutritionSuggestion(session) : NutritionProduct[] |
| + getProgressStats(user_id) : ProgressStats |
| + checkR7R8R9(user_id) : Recommendation[]  |
+=============================================+
```

Quan he lop Transformation Journey:
  User              1 ---- 0..* TransformationGoal   (Aggregation)
  User              1 ---- 0..* MemberProgram         (Aggregation)
  User              1 ---- 0..* BodyMetrics           (Aggregation)
  User              1 ---- 0..* PersonalRecord        (Aggregation)
  User              1 ---- 0..* MilestoneAchievement  (Aggregation)
  WorkoutProgram    1 ---- 1..* ProgramDay            (Composition)
  ProgramDay        1 ---- 1..* ProgramExercise       (Composition)
  MemberProgram     1 ---- 1    WorkoutProgram        (Association)
  MemberProgram     0..1 ---- 1 TransformationGoal    (Association)
  WorkoutSession    0..1 ---- 1 ProgramDay            (Association)
  ExerciseLog       0..1 ---- 1 ProgramExercise       (Association)
  User           Dependency    TransformationJourneyEngine (su dung)

========================================================================

## 10. ENUM DEFINITIONS
========================================================================

```
ENUM Role:
  member, gym_owner
  // Luu y: KHONG con 'vendor', 'guest'

ENUM FitnessGoal:
  bulk, cut, maintain
  // Dung cho USERS.fitness_goal (thong tin chung)

ENUM GoalType:
  muscle_gain, fat_loss, maintain, strength
  // Dung cho TRANSFORMATION_GOALS.goal_type (muc tieu cu the)

ENUM FitnessLevel:
  beginner, intermediate, advanced

ENUM GoalStatus:
  active, achieved, abandoned, expired

ENUM MemberProgramStatus:
  active, completed, abandoned, paused

ENUM PRType:
  max_weight, max_reps, max_volume

ENUM TargetMetric:
  weight_kg, lift_kg, body_fat_pct

ENUM MuscleGroup:
  chest, back, legs, shoulders, arms, core

ENUM SessionStatus:
  active, done, cancelled

ENUM MembershipStatus:
  active, expiring, suspended, expired, cancelled

ENUM ChangeType:
  register, renewal, upgrade, downgrade, suspension, reinstate, cancel

ENUM NutritionCategory:
  protein_supplement, meal, snack, beverage

ENUM NutritionOrderStatus:
  pending, completed, cancelled

ENUM OrderType:
  pos, preorder

ENUM AssetCondition:
  good, worn, damaged, lost

ENUM LockerType:
  daily, monthly

ENUM LockerStatus:
  available, occupied, maintenance

ENUM AssignmentStatus:
  active, returned, damaged, lost

ENUM ReturnCondition:
  good, worn, damaged, lost

ENUM BookingStatus:
  pending, confirmed, completed, cancelled, no_show

ENUM RecommendationType:
  renew_reminder, inactive_alert, upsell_plan, upsell_pt, upsell_nutrition,
  inactive_program, goal_achieved_upsell, technique_issue_upsell_pt

ENUM Priority:
  high, medium, low

ENUM RecStatus:
  pending, handled, dismissed

ENUM Outcome:
  renewed, declined, unreachable, other

ENUM ChallengeType:
  weekly, monthly, special

ENUM FitCoinTxnType:
  earn, spend, deposit, refund

ENUM FitCoinSource:
  challenge, referral, streak, deposit, membership, nutrition
```

========================================================================

## 11. TONG HOP QUAN HE GIUA CAC LOP
========================================================================

Lop A                | Quan he       | Lop B                 | Boi so
---------------------+---------------+-----------------------+-----------
User                 | Composition   | FitnessPassport       | 1 -- 1
User                 | Aggregation   | GymMembership         | 1 -- 0..1
User                 | Aggregation   | WorkoutSession        | 1 -- 0..*
User                 | Aggregation   | NutritionOrder        | 1 -- 0..*
User                 | Aggregation   | AssetAssignment       | 1 -- 0..*
User                 | Aggregation   | PTBooking             | 1 -- 0..*
User                 | Aggregation   | Recommendation        | 1 -- 0..*
User                 | Association   | User (FOLLOWS)        | 0..* -- 0..*
GymMembership        | Association   | MembershipPlan        | 1 -- 1
GymMembership        | Aggregation   | MembershipHistory     | 1 -- 1..*
GymMembership        | Aggregation   | CheckIn               | 1 -- 0..*
WorkoutSession       | Composition   | ExerciseLog           | 1 -- 1..*
NutritionProduct     | Composition   | Inventory             | 1 -- 1
NutritionOrder       | Composition   | NutritionOrderItem    | 1 -- 1..*
PTTrainer            | Aggregation   | PTBooking             | 1 -- 0..*
PTBooking            | Aggregation   | PTSession             | 1 -- 0..1
AssetAssignment      | Aggregation   | AssetPenalty          | 1 -- 0..1
Recommendation       | Aggregation   | MemberCareLog         | 1 -- 0..*
Challenge            | Aggregation   | UserChallenge         | 1 -- 0..*
User                 | Dependency    | AIRetentionEngine     | (su dung)
User                 | Dependency    | GamificationService   | (su dung)
User                 | Dependency    | FitCoinService        | (su dung)
GymMembership        | Dependency    | PaymentService        | (su dung)

========================================================================
KET THUC FILE 10
========================================================================
