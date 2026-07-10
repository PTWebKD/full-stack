# Personalized Program Recommendation — Design

## Problem

`JourneyProgramsPage.jsx` (Thư viện chương trình) shows a "Goal Questionnaire" (AI Tư vấn) onboarding flow with 5 steps (goal, experience, days/week, session duration, health/injury). After completing it, the answers are discarded — `MOCK_PROGRAMS` is always rendered as one fixed, unordered list for every user. This is not personalized.

## Scope

Client-side only (mock data, no backend). Reuses the existing 5 onboarding answers already collected in `onboardingAnswers` state. No new questions, no new backend calls.

## Design

### 1. Mapping answers → system keys

```js
const GOAL_MAP = {
  'Giảm mỡ & Săn chắc': 'fat_loss',
  'Tăng cơ bắp': 'muscle_gain',
  'Tăng sức mạnh': 'strength',
  'Duy trì vóc dáng': 'maintain',
};
const LEVEL_MAP = {
  'Mới bắt đầu': 'beginner',
  'Trung bình': 'intermediate',
  'Nâng cao': 'advanced',
};
const DAYS_MAP = {
  '2-3 ngày': 2.5,
  '4 ngày': 4,
  '5 ngày': 5,
  '6 ngày': 6,
};
```

`health` is already stored as a comma-joined string of ids (`none`, `back`, `knee`, `shoulder`, `cardio`), multi-select.

### 2. Risk map (injury → risky `muscle_group`)

```js
const RISK_MAP = {
  back: ['back_shoulders', 'legs'],
  knee: ['legs'],
  shoulder: ['back_shoulders', 'chest'],
  cardio: ['full_body'],
};
```

`none` maps to no risky groups.

### 3. Match score per program

For a given user profile `{ goal, level, days, healthIds }` and program `p`:

```
diff = Math.abs(p.schedule.length - days)

score =
  (p.goal_type === goal ? 3 : 0)
  + (p.level === level ? 2 : isAdjacentLevel(p.level, level) ? 1 : 0)
  + (diff === 0 ? 2 : diff <= 1 ? 1 : 0)
  - riskyCount(p, healthIds)
```

Where `isAdjacentLevel` treats beginner↔intermediate and intermediate↔advanced as adjacent (1 level apart), beginner↔advanced as not adjacent (0).

`riskyCount(p, healthIds)` = number of sessions in `p.schedule` whose `muscle_group` appears in the union of risky groups for the user's selected health ids.

### 4. List grouping

- Compute profile once (from `onboardingAnswers` right after finishing the questionnaire, or from persisted `fitfuel_goal_profile` on load).
- If no profile exists yet (user never completed the questionnaire), render `MOCK_PROGRAMS` as today — flat, unsorted, no grouping.
- If a profile exists:
  - **Đề xuất cho bạn**: programs where `goal_type === profile.goal`, sorted by score descending.
  - **Chương trình khác**: the remaining programs, sorted by score descending.
  - Both groups are rendered with the existing card component; the second group gets a visual de-emphasis (slightly reduced opacity, e.g. `opacity-70`) and its own heading.

### 5. Risk warnings (UI only, no removal/hiding)

- **Program card**: if `riskyCount(p, healthIds) > 0`, show a small red badge "⚠️ Có buổi cần lưu ý" next to the existing goal/level/duration tags.
- **Detail modal schedule list**: each session (`selectedProg.schedule` item) whose `muscle_group` is in the user's risky-group union gets:
  - a red inline label "⚠️ Cân nhắc chấn thương" next to the session title
  - a small helper line under the description: "Trao đổi với PT để điều chỉnh bài tập phù hợp"
- Sessions are never removed or hidden — the workout structure stays intact.

### 6. Persistence

- On completing the questionnaire (existing "HOÀN TẤT & NHẬN LỘ TRÌNH" button handler), in addition to the current `fitfuel_goal_onboarded` flag, save the derived profile:
  ```js
  localStorage.setItem('fitfuel_goal_profile', JSON.stringify({ goal, level, days, healthIds }));
  ```
- On mount, read `fitfuel_goal_profile` (if present) to drive grouping/scoring for the current render, independent of whether the onboarding modal is open.
- Re-running the questionnaire (via the "AI Tư vấn" button) and completing it again overwrites the stored profile and re-sorts the list.

### 7. Out of scope

- No exclusion of whole programs from view (per decision, everything stays visible, just grouped/sorted).
- No dynamic generation of new schedules — matching only ranks/filters existing `MOCK_PROGRAMS`.
- No backend/API changes — this is pure client-side derived state from existing mock data and localStorage.

## Testing

- Manual verification in browser: complete questionnaire with a few different answer combinations (e.g. muscle_gain/beginner/2-3 ngày/none, fat_loss/advanced/6 ngày/knee) and confirm grouping, ordering, and risk badges behave as expected on the list and inside the detail modal.
