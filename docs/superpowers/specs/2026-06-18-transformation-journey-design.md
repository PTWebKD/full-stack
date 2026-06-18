# Transformation Journey Engine — Design Spec

**Date:** 2026-06-18  
**Author:** PO/PM Strategy Session  
**Version:** 1.0  
**Status:** Approved

---

## 1. Problem Statement

FitFuel+ hiện phục vụ tốt nhu cầu của Gym Owner (quản lý membership, doanh thu, tài sản), nhưng còn yếu ở Member Experience. Có 2 nguyên nhân gốc rễ của member churn:

- **A) Mất động lực** — Member không biết phải làm gì mỗi ngày khi vào gym, dẫn đến lang thang và bỏ cuộc.
- **B) Không thấy kết quả** — Sau 3 tuần tập, member nhìn gương và nghĩ "mình vẫn y vậy" dù thực ra đã tiến bộ đáng kể.

**Giải pháp:** Xây dựng Transformation Journey Engine — một hệ thống 5 lớp kết nối goal-setting → daily program → progress tracking → milestone celebration → viral sharing.

---

## 2. Design Principles

1. **Zero empty state** — Ngay từ ngày đầu, member đã có hành trình rõ ràng. Không có màn hình trống.
2. **Progress is always visible** — Mỗi buổi tập đều để lại dấu ấn đo được.
3. **Celebrate small wins** — Không đợi đến mục tiêu lớn mới celebrate. Mỗi kỷ lục nhỏ đều được ghi nhận.

---

## 3. Architecture Overview

```
Layer 5: MILESTONE ENGINE
         Milestones → Celebration UX → Share Card → Viral Loop
              ↑
Layer 4: PROGRESS VISUALIZATION
         Body Metrics + Strength Progress + Goal % + PR Detection
              ↑
Layer 3: PROGRESSIVE OVERLOAD AI
         Post-workout analysis → Suggest weight increase → Store in EXERCISE_LOGS
              ↑
Layer 2: PROGRAM ENGINE
         Daily workout assignment → Editable suggestion → Log sets
              ↑
Layer 1: GOAL ENGINE
         Member sets goal → System matches program → Journey begins
              ↕
Connects to existing: Membership, Check-in, AI Care Queue (R7/R8/R9), PT Booking, UC-24 Nutrition AI
```

**Core Loop:**
```
Set Goal → Receive Program → Today's workout suggested → Member edits (optional) →
Accept & Start → Log sets/reps/weight → Complete →
[3 engines run in parallel]:
  1. Progressive Overload AI (suggest next weight)
  2. Nutrition Suggestion AI (popup 3 products)
  3. Milestone Check Engine (new record?)
→ View progress → Milestone celebration → Share card → Gym grows organically
```

---

## 4. Layer 1 — Goal Engine

### 4.1 Onboarding Flow (5 bước)

```
Step 1: Chọn loại mục tiêu
        [ Tăng cơ ] [ Giảm mỡ ] [ Duy trì ] [ Tăng sức mạnh ]

Step 2: Mục tiêu cụ thể (optional)
        "Giảm 5kg", "Bench 100kg", "Giữ dáng hiện tại"

Step 3: Số ngày tập/tuần
        [ 2 ngày ] [ 3 ngày ] [ 4 ngày ] [ 5 ngày ] [ 6 ngày ]

Step 4: Đánh giá trình độ
        → Tự đánh giá: Mới bắt đầu / Trung cấp / Nâng cao
        → Hoặc hệ thống auto-detect từ lịch sử check-in

Step 5: Hệ thống gợi ý 2–3 chương trình phù hợp
        → Member chọn → Journey bắt đầu
```

### 4.2 Database: TRANSFORMATION_GOALS

```sql
CREATE TABLE TRANSFORMATION_GOALS (
  goal_id        INT          PRIMARY KEY AUTO_INCREMENT,
  user_id        INT          NOT NULL,
  goal_type      ENUM('muscle_gain','fat_loss','maintain','strength') NOT NULL,
  target_desc    VARCHAR(255),                          -- "Giảm 5kg", "Bench 100kg"
  target_value   DECIMAL(8,2),                         -- numeric target nếu có
  target_metric  ENUM('weight_kg','lift_kg','body_fat_pct'),
  deadline       DATE,
  status         ENUM('active','achieved','abandoned','expired') DEFAULT 'active',
  created_at     DATETIME     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);
```

---

## 5. Layer 2 — Program Engine

### 5.1 Program Structure

Mỗi chương trình được chia 4 phase (ví dụ: "12-Week Bulk 4x/tuần"):

| Phase | Tuần | Mục tiêu | Sets × Reps |
|---|---|---|---|
| Learn | 1–4 | Học kỹ thuật, build base | 3×8 |
| Build | 5–8 | Tăng volume | 4×8 |
| Peak | 9–11 | Tăng intensity | 4×5–6 (nặng hơn) |
| Deload | 12 | Phục hồi | 50% volume |

### 5.2 Editable Workout Suggestion (KEY UX)

Hệ thống GỢI Ý buổi tập hôm nay — không áp đặt. Member có thể chỉnh sửa trước khi bắt đầu:

```
Màn hình "Push Day A — Tuần 3, Ngày 2"
─────────────────────────────────────────────────
BÀI TẬP GỢI Ý                        [+ Thêm bài]
1. Bench Press           4 sets × 8–10 reps  ✏️ 🗑
2. Incline DB Press      3 sets × 10–12 reps ✏️ 🗑
3. Overhead Press        3 sets × 10–12 reps ✏️ 🗑
4. Tricep Pushdown       3 sets × 12–15 reps ✏️ 🗑

[Chỉnh sửa thêm...]     [✅ CHẤP NHẬN & BẮT ĐẦU]
```

Member có thể: thêm bài, bỏ bài, thay đổi sets/reps, đổi thứ tự. Tất cả customization được lưu vào `customization_log` JSON để hệ thống học trong Year 2.

### 5.3 Post-Workout Trigger Flow

```
Member nhấn [HOÀN THÀNH BUỔI TẬP]
    ↓
3 engine chạy SONG SONG:
    │
    ├── 1. Progressive Overload AI
    │       → Đọc EXERCISE_LOGS của buổi này
    │       → So với 2 buổi trước
    │       → Nếu actual_reps >= target_reps_max 2 lần liên tiếp
    │          → Ghi overload_suggestion vào EXERCISE_LOGS
    │          → Hiển thị: "Tăng lên 52.5kg buổi sau?"
    │
    ├── 2. AI Nutrition Suggestion (UC-24)
    │       → Đọc muscle groups từ EXERCISE_LOGS
    │       → Kết hợp: goal_type + workout volume + purchase history
    │       → Popup 3 gợi ý sản phẩm từ NUTRITION_PRODUCTS
    │
    └── 3. Milestone Check Engine
            → Kiểm tra 22 milestone trigger
            → Nếu có milestone mới → Celebrate UX
            → Award FitCoin + XP
            → Offer Share Card
```

### 5.4 Database: WORKOUT_PROGRAMS, PROGRAM_DAYS, PROGRAM_EXERCISES, MEMBER_PROGRAMS

```sql
CREATE TABLE WORKOUT_PROGRAMS (
  program_id      INT          PRIMARY KEY AUTO_INCREMENT,
  gym_id          INT          NOT NULL DEFAULT 1,
  name            VARCHAR(150) NOT NULL,
  goal_type       ENUM('muscle_gain','fat_loss','maintain','strength') NOT NULL,
  level           ENUM('beginner','intermediate','advanced') NOT NULL,
  duration_weeks  INT          NOT NULL,
  days_per_week   INT          NOT NULL,
  description     TEXT,
  is_active       BOOLEAN      DEFAULT TRUE
);

CREATE TABLE PROGRAM_DAYS (
  day_id          INT          PRIMARY KEY AUTO_INCREMENT,
  program_id      INT          NOT NULL,
  week_number     INT          NOT NULL,  -- 1–12
  day_number      INT          NOT NULL,  -- 1–7
  session_name    VARCHAR(100),           -- "Push Day A"
  muscle_focus    JSON,                   -- ["chest","shoulders","triceps"]
  is_rest_day     BOOLEAN      DEFAULT FALSE,
  FOREIGN KEY (program_id) REFERENCES WORKOUT_PROGRAMS(program_id)
);

CREATE TABLE PROGRAM_EXERCISES (
  exercise_id     INT          PRIMARY KEY AUTO_INCREMENT,
  day_id          INT          NOT NULL,
  exercise_name   VARCHAR(100) NOT NULL,
  muscle_group    ENUM('chest','back','shoulders','biceps','triceps',
                       'quads','hamstrings','glutes','calves','core') NOT NULL,
  target_sets     INT          NOT NULL,
  target_reps_min INT          NOT NULL,
  target_reps_max INT          NOT NULL,
  target_rpe      DECIMAL(3,1),           -- Rate of Perceived Exertion
  rest_seconds    INT          DEFAULT 90,
  order_in_day    INT          NOT NULL,
  notes           TEXT,
  FOREIGN KEY (day_id) REFERENCES PROGRAM_DAYS(day_id)
);

CREATE TABLE MEMBER_PROGRAMS (
  member_program_id INT        PRIMARY KEY AUTO_INCREMENT,
  user_id           INT        NOT NULL,
  program_id        INT        NOT NULL,
  goal_id           INT,
  start_date        DATE       NOT NULL,
  expected_end_date DATE       NOT NULL,
  current_week      INT        DEFAULT 1,
  status            ENUM('active','completed','abandoned','paused') DEFAULT 'active',
  completion_pct    DECIMAL(5,2) DEFAULT 0.00,
  created_at        DATETIME   DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)     REFERENCES USERS(user_id),
  FOREIGN KEY (program_id)  REFERENCES WORKOUT_PROGRAMS(program_id),
  FOREIGN KEY (goal_id)     REFERENCES TRANSFORMATION_GOALS(goal_id)
);
```

### 5.5 Enriched EXERCISE_LOGS Fields

Thêm vào bảng `EXERCISE_LOGS` hiện có:

```sql
ALTER TABLE EXERCISE_LOGS ADD COLUMN program_exercise_id INT NULL;  -- FK → PROGRAM_EXERCISES
ALTER TABLE EXERCISE_LOGS ADD COLUMN overload_suggestion  JSON NULL; -- {next_weight: 52.5, reason: "exceeded target 2x"}
```

Thêm vào `WORKOUT_SESSIONS` hoặc tạo bảng liên kết:

```sql
ALTER TABLE WORKOUT_SESSIONS ADD COLUMN member_program_id    INT  NULL;
ALTER TABLE WORKOUT_SESSIONS ADD COLUMN program_day_id       INT  NULL;
ALTER TABLE WORKOUT_SESSIONS ADD COLUMN customized_from_prog BOOLEAN DEFAULT FALSE;
ALTER TABLE WORKOUT_SESSIONS ADD COLUMN customization_log    JSON    NULL;
-- customization_log: {added: [{name, sets, reps}], removed: ["Tricep Pushdown"], modified: [{exercise_id, from_reps, to_reps}]}
```

---

## 6. Layer 3 — Progressive Overload AI

### 6.1 Logic

```
FOR each exercise after session completion:

  IF actual_reps >= target_reps_max FOR 2 consecutive sessions:
    → SUGGEST: increase weight by 2.5kg next session
    → Store in EXERCISE_LOGS.overload_suggestion
    → Show UI prompt: "Bạn đã đạt max rep 2 buổi liên tiếp.
                       Tuần sau thử 52.5kg nhé? 💪"

  ELSE IF actual_reps < target_reps_min FOR 2 consecutive sessions:
    → SUGGEST: maintain weight, focus on technique
    → Show UI: "Giữ nguyên 50kg, tập trung kỹ thuật buổi này."

    IF actual_reps < target_reps_min FOR 3 consecutive sessions:
      → CREATE recommendation: type='technique_issue_upsell_pt'
      → Trigger: R9 in AI Care Queue (priority=LOW)
      → Message: "Bạn đang gặp khó với bài này. 1 buổi PT có thể giúp?"
```

### 6.2 Enriched Nutrition Suggestion — 4 Signals

Sau khi tích hợp với Transformation Journey, UC-24 AI Nutrition Suggestion sử dụng 4 tín hiệu thay vì 1:

| Signal | Nguồn dữ liệu | Tác động |
|---|---|---|
| Nhóm cơ tập hôm nay | EXERCISE_LOGS | Protein cho nhóm cơ đã tập |
| Goal type của member | TRANSFORMATION_GOALS | muscle_gain → carb+protein cao; fat_loss → low calorie |
| Cường độ buổi tập | Tổng sets × reps | Volume > 15 sets → thêm carb phục hồi |
| Lịch sử mua của member | NUTRITION_ORDERS | Hay mua gì → ưu tiên hiển thị đầu |

---

## 7. Layer 4 — Progress Visualization

### 7.1 Dashboard — 3 Tab

**Tab 1: Hành Trình**
- Progress bar chương trình hiện tại (% tuần hoàn thành)
- Lịch tháng với ✓ = tập, ─ = nghỉ
- Streak hiện tại 🔥

**Tab 2: Sức Mạnh**
- Line chart từng bài tập chính (Bench, Squat, Deadlift, OHP)
- So sánh Tuần 1 vs Hôm nay
- % tăng trưởng tính tự động

**Tab 3: Cơ Thể**
- Line chart cân nặng theo thời gian
- Các số đo (vòng bụng, body fat % nếu có nhập)
- Nút [Cập nhật số đo hôm nay]

### 7.2 Smart Reminder cho Body Metrics

Sau 14 ngày không cập nhật cân nặng → push notification:
> "Bạn đã tập được 8 buổi rồi — cùng xem cơ thể phản hồi thế nào nhé?"

### 7.3 Database: BODY_METRICS, PERSONAL_RECORDS

```sql
CREATE TABLE BODY_METRICS (
  metric_id       INT          PRIMARY KEY AUTO_INCREMENT,
  user_id         INT          NOT NULL,
  recorded_at     DATETIME     NOT NULL,
  weight_kg       DECIMAL(5,2),
  body_fat_pct    DECIMAL(4,1),
  muscle_mass_kg  DECIMAL(5,2),
  waist_cm        DECIMAL(5,1),
  chest_cm        DECIMAL(5,1),
  arm_cm          DECIMAL(5,1),
  thigh_cm        DECIMAL(5,1),
  notes           TEXT,
  FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);

CREATE TABLE PERSONAL_RECORDS (
  pr_id           INT          PRIMARY KEY AUTO_INCREMENT,
  user_id         INT          NOT NULL,
  exercise_name   VARCHAR(100) NOT NULL,
  pr_type         ENUM('max_weight','max_reps','max_volume') NOT NULL,
  pr_value        DECIMAL(8,2) NOT NULL,
  previous_value  DECIMAL(8,2),
  improvement_pct DECIMAL(5,2),
  achieved_at     DATETIME     NOT NULL,
  session_id      INT,                     -- FK → WORKOUT_SESSIONS
  FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);
```

---

## 8. Layer 5 — Milestone Engine

### 8.1 22 Milestone Triggers

| Code | Category | Trigger | FitCoin | XP |
|---|---|---|---|---|
| M01 | First Time | Hoàn thành buổi tập đầu tiên | 50 | 200 |
| M02 | First Time | Hoàn thành tuần đầu tiên đầy đủ | 100 | 500 |
| M03 | First Time | Đặt mục tiêu + bắt đầu chương trình | 50 | 100 |
| M10 | Streak | Check-in 7 ngày liên tiếp | 70 | 300 |
| M11 | Streak | Check-in 14 ngày liên tiếp | 150 | 600 |
| M12 | Streak | Check-in 30 ngày liên tiếp | 300 | 1500 |
| M20 | Strength PR | PR bất kỳ bài tập | 30 | 150 |
| M21 | Strength PR | Tăng 10% sức mạnh so với tuần 1 | 100 | 400 |
| M22 | Strength PR | Tăng 25% sức mạnh | 200 | 800 |
| M30 | Goal Progress | 25% tiến độ goal | 50 | 200 |
| M31 | Goal Progress | 50% tiến độ goal | 100 | 500 |
| M32 | Goal Progress | **100% goal đạt được** | 500 | 2000 |
| M40 | Program | Hoàn thành 1 tuần chương trình | 20 | 100 |
| M41 | Program | Hoàn thành 4 tuần (1 tháng) | 150 | 600 |
| M42 | Program | **Hoàn thành 12 tuần (full program)** | 500 | 2000 |
| M50 | Nutrition | Mua nutrition sau tập 5 lần | 50 | 200 |
| M51 | Nutrition | Đặt pre-order 10 lần | 100 | 400 |
| M60 | Body | Cập nhật số đo 4 tuần liên tiếp | 80 | 300 |
| M61 | Body | Giảm được 3% body fat | 200 | 800 |
| M70 | Social | Tạo share card đầu tiên | 100 | 300 |
| M71 | Social | Bạn bè đăng ký qua link của bạn (Year 2) | 500 | 1000 |
| M80 | Loyalty | Là member 1 năm | 300 | 1200 |

> **Note:** M13 (streak bị phá vỡ) KHÔNG trigger celebration. Im lặng — tránh shame member.

### 8.2 Celebration UX (M32, M42 — Maximum)

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│             🎉  CHÚC MỪNG!  🎉                      │
│                                                      │
│           Nguyễn Văn A đã hoàn thành                 │
│           "12-Week Bulk Program"                     │
│                                                      │
│     TRƯỚC                SAU                         │
│     72.0 kg    →         75.5 kg  (+3.5kg)           │
│     Bench: 40kg →        65kg     (+62.5%)           │
│     Streak: 84 ngày liên tiếp                        │
│                                                      │
│     + 500 FitCoin    + 2000 XP    🏆 "Transformer"  │
│                                                      │
│   [📸 TẠO SHARE CARD]      [Tiếp tục hành trình]    │
└──────────────────────────────────────────────────────┘
```

### 8.3 Share Card — Viral Loop

Share Card được generate tự động với branding của gym:

```
┌──────────────────────────────────────────────┐
│  [LOGO GYM]              FitFuel+            │
│                                              │
│  💪 TRANSFORMATION COMPLETE                  │
│                                              │
│       Nguyễn Văn A                           │
│       12-Week Bulk · 84 ngày                 │
│                                              │
│  ┌──────────┐      ┌──────────┐              │
│  │  TRƯỚC   │  →   │   SAU    │              │
│  │  72kg    │      │  75.5kg  │              │
│  │ Bench40kg│      │ Bench65kg│              │
│  └──────────┘      └──────────┘              │
│                                              │
│  "Hành trình 84 ngày thay đổi cuộc đời"      │
│                                              │
│  #FitFuel #GymLife #Transformation           │
└──────────────────────────────────────────────┘
```

**Viral Loop mechanism:**
```
Member share → Bạn bè thấy → Hỏi "Gym nào?" → Đến đăng ký
     ↓
Gym nhận FREE marketing với brand đính kèm mỗi share
     ↓
Member mới → Bắt đầu Transformation Journey của họ
     ↓
Vòng lặp tiếp tục
```

### 8.4 Database: MILESTONE_ACHIEVEMENTS

```sql
CREATE TABLE MILESTONE_ACHIEVEMENTS (
  achievement_id  INT          PRIMARY KEY AUTO_INCREMENT,
  user_id         INT          NOT NULL,
  milestone_code  VARCHAR(10)  NOT NULL,   -- 'M20', 'M42', etc.
  milestone_data  JSON,                    -- {exercise: "Bench Press", value: 65}
  fitcoin_awarded INT          DEFAULT 0,
  xp_awarded      INT          DEFAULT 0,
  share_card_url  VARCHAR(500),            -- generated image URL
  is_shared       BOOLEAN      DEFAULT FALSE,
  achieved_at     DATETIME     NOT NULL,
  notified_at     DATETIME,
  FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);
```

---

## 9. AI Care Queue — 3 New Triggers

Extends existing BR-35 (6 rules → 9 rules):

| Code | Trigger Condition | Type | Priority |
|---|---|---|---|
| R7 | member_programs.status = 'active' AND last session > 7 days ago | `inactive_program` | HIGH |
| R8 | member_programs.status = 'completed' (100%) | `goal_achieved_upsell` | MEDIUM |
| R9 | Same exercise: actual_reps < target_reps_min for 3 consecutive sessions | `technique_issue_upsell_pt` | LOW |

**R7 message (to staff):** "Nguyễn Văn A bỏ chương trình 10 ngày — gọi check-in."  
**R8 message (to staff):** "Trần Thị B vừa hoàn thành 12-Week Bulk — gợi ý chương trình tiếp theo."  
**R9 message (to staff):** "Lê Văn C stuck với Bench Press 3 buổi liên tiếp — gợi ý 1 buổi PT."

---

## 10. Complete Database Summary

### New Tables (8 bảng)

| Bảng | Mục đích |
|---|---|
| `TRANSFORMATION_GOALS` | Mục tiêu của từng member |
| `WORKOUT_PROGRAMS` | Thư viện chương trình (Gym Owner quản lý) |
| `PROGRAM_DAYS` | Cấu trúc từng ngày trong chương trình |
| `PROGRAM_EXERCISES` | Bài tập + targets cho từng ngày |
| `MEMBER_PROGRAMS` | Member đang chạy chương trình nào |
| `BODY_METRICS` | Số đo cơ thể theo thời gian |
| `PERSONAL_RECORDS` | Kỷ lục cá nhân từng bài tập |
| `MILESTONE_ACHIEVEMENTS` | Milestone đã đạt + share status |

### Modified Existing Tables

| Bảng | Thêm fields |
|---|---|
| `WORKOUT_SESSIONS` | `member_program_id`, `program_day_id`, `customized_from_prog`, `customization_log` |
| `EXERCISE_LOGS` | `program_exercise_id`, `overload_suggestion` |

---

## 11. Product Roadmap 3 Năm

### Year 1 (2026) — FOUNDATION: "Biết làm gì mỗi ngày"

| Q | Deliverables |
|---|---|
| Q1 | Goal Engine (5-step), Program Library (10 programs), Daily Workout (editable), Exercise Log, Post-workout Nutrition Trigger |
| Q2 | Progress Dashboard (3 tab), Body Metrics tracking, PR Detection, Milestone Engine (22 triggers), Share Card |
| Q3 | AI Care Queue R7/R8/R9, Program Management cho Gym Owner, Member Progress View cho PT |
| Q4 | KPI mới (Transformation Rate, Share Cards Generated), Polish & Performance |

**Success metrics Year 1:**

| Metric | Baseline | Target |
|---|---|---|
| % member tạo Transformation Goal | 0% | 60% |
| % member hoàn thành tuần 1 | ~30% | 65% |
| % member log ≥ 3 buổi/tuần | ~25% | 50% |
| Retention tháng 3 | ~40% | 65% |

### Year 2 (2027) — ADAPTATION: "Hệ thống hiểu tôi"

**3 breakthrough features:**

1. **Adaptive Program Engine** — Học từ customization patterns của member. Sau 4 lần member bỏ "Tricep Pushdown", system tự gợi ý bài thay thế. Mỗi member dần có chương trình khác nhau dù cùng xuất phát điểm.

2. **Full-Day Nutrition Planning** — Từ gợi ý sau tập (reactive) → planner toàn ngày (proactive). Tích hợp với pre-order, Gym Owner bán nutrition nhiều hơn.

3. **PT Data Integration** — Khi member đặt PT, PT thấy toàn bộ lịch sử: chương trình đang chạy, bài nào stuck, PR, customization patterns → buổi PT hiệu quả hơn.

**Success metrics Year 2:** Retention tháng 6: 72%, Revenue dinh dưỡng +85%, PT booking từ R9 đạt 25% conversion.

### Year 3 (2028) — PREDICTION: "AI đọc được tương lai"

**3 breakthrough features:**

1. **Churn Prediction Engine** — Phân tích 12 signal (tần suất check-in, thời gian buổi tập, tỉ lệ hoàn thành program, milestone cuối, nutrition orders, streak, customization tăng, share card, membership countdown, cancel history, plateau, PT booking) → Churn Risk Score 0–100. Phát hiện nguy cơ trước 2 tuần.

2. **AI Program Generator** — Không còn chọn từ thư viện cố định. AI tạo chương trình 12 tuần hoàn toàn cá nhân hóa dựa trên goal, lịch sử tập, injury/limitation, thiết bị gym. Điều chỉnh lại sau mỗi 4 tuần dựa trên kết quả thực.

3. **Wearable Integration** — Kết nối Apple Watch, Garmin, Xiaomi Band. Heart rate, sleep quality, daily steps, recovery score → Progressive Overload AI chính xác hơn: gợi ý tăng tạ đúng lúc, không quá sớm gây injury.

**Success metric Year 3:** Retention tháng 12: 80%.

### Tổng quan tiến hóa AI

| Year | AI Type | Khả năng | Member Experience |
|---|---|---|---|
| 2026 | Rule-based (deterministic) | "Nếu X thì Y" | "Gym có app hướng dẫn" |
| 2027 | Pattern recognition (learning) | Học từ data thực | "App nhớ tôi như PT riêng" |
| 2028 | Predictive (proactive) | Biết trước chưa xảy ra | "App biết tôi hơn tôi biết mình" |

---

## 12. Gym Owner Value

Transformation Journey Engine không chỉ giữ member — nó tạo ra giá trị kinh doanh trực tiếp:

| Feature | Gym Owner hưởng lợi |
|---|---|
| Post-workout Nutrition Trigger | Tăng impulse purchase dinh dưỡng sau mỗi buổi tập |
| R8 Goal Achieved trigger | Tự động upsell chương trình mới khi member hoàn thành |
| R9 Technique Issue trigger | Tự động upsell PT khi member stuck |
| Share Card viral loop | Free marketing với gym brand trên mạng xã hội |
| Transformation Rate KPI | Đo lường hiệu quả chương trình, dùng để marketing |
| PT Data View | PT làm việc hiệu quả hơn → member hài lòng hơn |

**2 KPI mới cho Dashboard:**
- **Transformation Rate:** % member hoàn thành ít nhất 1 chương trình 12 tuần (benchmark ngành ~12%, mục tiêu FitFuel+ 35%+)
- **Share Cards Generated:** Số share card tạo trong tháng × estimated reach 200–500 người/card = organic marketing value

---

## 13. Out of Scope (MVP Year 1)

- Wearable integration (Year 3)
- AI-generated custom programs (Year 3)
- Community features / leaderboard (Year 2)
- Referral tracking từ share card (Year 2)
- Video form check / technique AI (Year 3+)
- Multi-tenant / multi-gym support (không nằm trong FitFuel+ scope)
