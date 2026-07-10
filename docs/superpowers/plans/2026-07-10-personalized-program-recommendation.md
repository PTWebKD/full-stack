# Personalized Program Recommendation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** After a member completes the "Goal Questionnaire" (AI Tư vấn) on the Thư viện chương trình page, the program list groups into "Đề xuất cho bạn" (goal-matched, ranked by fit) and "Chương trình khác" (the rest), and flags workout sessions that land on the member's stated injury area — instead of always showing one fixed, unordered list of `MOCK_PROGRAMS`.

**Architecture:** Extract the matching/scoring logic into a new pure JS module (`programMatching.js`) with no React/DOM dependencies, so it's testable with Node's built-in test runner. `JourneyProgramsPage.jsx` calls into this module to compute a profile from the existing onboarding answers, persists it to `localStorage`, and uses it to group/sort `MOCK_PROGRAMS` and render risk badges.

**Tech Stack:** React 19 (existing), Vite, `node:test` + `node:assert/strict` for the pure-logic unit tests (no test framework is currently installed in `FE/`, and none is needed for this).

---

## File Structure

- Create: `FE/src/pages/member/journey/programMatching.js` — pure functions: answer→key mapping, risk map, per-program scoring, grouping.
- Create: `FE/src/pages/member/journey/programMatching.test.js` — `node:test` unit tests for the above.
- Modify: `FE/src/pages/member/journey/JourneyProgramsPage.jsx` — load/save profile, group `MOCK_PROGRAMS`, render two sections, show risk badges on cards and in the detail modal.

---

### Task 1: Pure matching/scoring module

**Files:**
- Create: `FE/src/pages/member/journey/programMatching.js`
- Test: `FE/src/pages/member/journey/programMatching.test.js`

- [x] **Step 1: Write the failing test**

Create `FE/src/pages/member/journey/programMatching.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildProfile,
  scoreProgram,
  riskySessionCount,
  groupPrograms,
} from './programMatching.js';

const sampleProgram = {
  program_id: 1,
  name: 'Test muscle gain beginner',
  goal_type: 'muscle_gain',
  level: 'beginner',
  schedule: [
    { day: 1, muscle_group: 'chest' },
    { day: 2, muscle_group: 'back_shoulders' },
    { day: 3, muscle_group: 'legs' },
  ],
};

test('buildProfile maps Vietnamese answers to system keys', () => {
  const profile = buildProfile({
    goal: 'Tăng cơ bắp',
    experience: 'Mới bắt đầu',
    daysPerWeek: '2-3 ngày',
    duration: '45 - 60 phút (Tiêu chuẩn)',
    health: 'knee',
  });
  assert.deepEqual(profile, {
    goal: 'muscle_gain',
    level: 'beginner',
    days: 2.5,
    healthIds: ['knee'],
  });
});

test('buildProfile handles multiple health ids and empty health', () => {
  const withMultiple = buildProfile({
    goal: 'Tăng cơ bắp',
    experience: 'Mới bắt đầu',
    daysPerWeek: '4 ngày',
    duration: '',
    health: 'back,knee',
  });
  assert.deepEqual(withMultiple.healthIds, ['back', 'knee']);

  const withNone = buildProfile({
    goal: 'Tăng cơ bắp',
    experience: 'Mới bắt đầu',
    daysPerWeek: '4 ngày',
    duration: '',
    health: '',
  });
  assert.deepEqual(withNone.healthIds, []);
});

test('scoreProgram gives max score for exact goal+level+days match with no risk', () => {
  const profile = { goal: 'muscle_gain', level: 'beginner', days: 3, healthIds: [] };
  // goal match (+3) + level match (+2) + days diff 0 (+2) - 0 risky = 7
  assert.equal(scoreProgram(sampleProgram, profile), 7);
});

test('scoreProgram gives partial credit for adjacent level and near days', () => {
  const profile = { goal: 'muscle_gain', level: 'intermediate', days: 4, healthIds: [] };
  // goal match (+3) + adjacent level (+1) + days diff 1 (+1) - 0 risky = 5
  assert.equal(scoreProgram(sampleProgram, profile), 5);
});

test('scoreProgram penalizes sessions that land on the user injury area', () => {
  const profile = { goal: 'muscle_gain', level: 'beginner', days: 3, healthIds: ['knee'] };
  // 'legs' session is risky for knee -> riskySessionCount = 1
  // goal match (+3) + level match (+2) + days diff 0 (+2) - 1 risky = 6
  assert.equal(scoreProgram(sampleProgram, profile), 6);
});

test('riskySessionCount counts sessions matching risky muscle groups for multiple issues', () => {
  const profile = { goal: 'muscle_gain', level: 'beginner', days: 3, healthIds: ['back', 'knee'] };
  // back -> back_shoulders, legs; knee -> legs => risky groups {back_shoulders, legs}
  // sessions: chest(no), back_shoulders(yes), legs(yes) => 2
  assert.equal(riskySessionCount(sampleProgram, profile), 2);
});

test('riskySessionCount is 0 when no health issues selected', () => {
  const profile = { goal: 'muscle_gain', level: 'beginner', days: 3, healthIds: [] };
  assert.equal(riskySessionCount(sampleProgram, profile), 0);
});

test('groupPrograms returns ungrouped result when profile has no goal', () => {
  const result = groupPrograms([sampleProgram], { goal: null, level: null, days: null, healthIds: [] });
  assert.deepEqual(result, { recommended: [], others: [], isGrouped: false });
});

test('groupPrograms splits by goal match and sorts each group by score descending', () => {
  const otherGoalProgram = { ...sampleProgram, program_id: 2, goal_type: 'fat_loss' };
  const lowerScoreSameGoal = {
    ...sampleProgram,
    program_id: 3,
    level: 'advanced', // not adjacent to 'beginner' -> +0 instead of +2
  };
  const profile = { goal: 'muscle_gain', level: 'beginner', days: 3, healthIds: [] };
  const result = groupPrograms([otherGoalProgram, lowerScoreSameGoal, sampleProgram], profile);
  assert.equal(result.isGrouped, true);
  assert.deepEqual(result.recommended.map(p => p.program_id), [1, 3]);
  assert.deepEqual(result.others.map(p => p.program_id), [2]);
});
```

- [x] **Step 2: Run test to verify it fails**

Run (from `FE/`):
```bash
node --test src/pages/member/journey/programMatching.test.js
```
Expected: FAIL — `Cannot find module './programMatching.js'` (the module doesn't exist yet).

- [x] **Step 3: Write the implementation**

Create `FE/src/pages/member/journey/programMatching.js`:

```js
export const GOAL_MAP = {
  'Giảm mỡ & Săn chắc': 'fat_loss',
  'Tăng cơ bắp': 'muscle_gain',
  'Tăng sức mạnh': 'strength',
  'Duy trì vóc dáng': 'maintain',
};

export const LEVEL_MAP = {
  'Mới bắt đầu': 'beginner',
  'Trung bình': 'intermediate',
  'Nâng cao': 'advanced',
};

export const DAYS_MAP = {
  '2-3 ngày': 2.5,
  '4 ngày': 4,
  '5 ngày': 5,
  '6 ngày': 6,
};

export const RISK_MAP = {
  back: ['back_shoulders', 'legs'],
  knee: ['legs'],
  shoulder: ['back_shoulders', 'chest'],
  cardio: ['full_body'],
};

const LEVEL_ORDER = ['beginner', 'intermediate', 'advanced'];

export function buildProfile(onboardingAnswers) {
  const { goal, experience, daysPerWeek, health } = onboardingAnswers;
  const healthIds = health ? health.split(',').filter(Boolean) : [];
  return {
    goal: GOAL_MAP[goal] || null,
    level: LEVEL_MAP[experience] || null,
    days: DAYS_MAP[daysPerWeek] ?? null,
    healthIds,
  };
}

export function riskyGroupsForProfile(profile) {
  const groups = new Set();
  for (const id of profile.healthIds) {
    const risky = RISK_MAP[id];
    if (risky) risky.forEach(g => groups.add(g));
  }
  return groups;
}

export function riskySessionCount(program, profile) {
  const riskyGroups = riskyGroupsForProfile(profile);
  if (riskyGroups.size === 0) return 0;
  return program.schedule.filter(s => riskyGroups.has(s.muscle_group)).length;
}

function levelDistance(levelA, levelB) {
  const idxA = LEVEL_ORDER.indexOf(levelA);
  const idxB = LEVEL_ORDER.indexOf(levelB);
  if (idxA === -1 || idxB === -1) return null;
  return Math.abs(idxA - idxB);
}

export function scoreProgram(program, profile) {
  let score = 0;

  if (profile.goal && program.goal_type === profile.goal) score += 3;

  const levelDist = levelDistance(program.level, profile.level);
  if (levelDist === 0) score += 2;
  else if (levelDist === 1) score += 1;

  if (profile.days != null) {
    const diff = Math.abs(program.schedule.length - profile.days);
    if (diff === 0) score += 2;
    else if (diff <= 1) score += 1;
  }

  score -= riskySessionCount(program, profile);
  return score;
}

export function groupPrograms(programs, profile) {
  if (!profile || !profile.goal) {
    return { recommended: [], others: [], isGrouped: false };
  }
  const byScoreDesc = (a, b) => scoreProgram(b, profile) - scoreProgram(a, profile);
  const recommended = programs
    .filter(p => p.goal_type === profile.goal)
    .sort(byScoreDesc);
  const others = programs
    .filter(p => p.goal_type !== profile.goal)
    .sort(byScoreDesc);
  return { recommended, others, isGrouped: true };
}
```

- [x] **Step 4: Run test to verify it passes**

Run (from `FE/`):
```bash
node --test src/pages/member/journey/programMatching.test.js
```
Expected: PASS — all 9 tests green, `# pass 9`, `# fail 0`.

- [x] **Step 5: Commit**

```bash
git add FE/src/pages/member/journey/programMatching.js FE/src/pages/member/journey/programMatching.test.js
git commit -m "feat: add pure scoring module for personalized program recommendations"
```

---

### Task 2: Wire profile persistence into JourneyProgramsPage

**Files:**
- Modify: `FE/src/pages/member/journey/JourneyProgramsPage.jsx`

- [x] **Step 1: Add imports**

At the top of `JourneyProgramsPage.jsx`, change:

```js
import { useState, useEffect } from 'react';
```

to:

```js
import { useState, useEffect, useMemo } from 'react';
```

Add a new import line right after the existing `lucide-react` import (line 3):

```js
import { buildProfile, riskyGroupsForProfile, riskySessionCount, groupPrograms } from './programMatching';
```

- [x] **Step 2: Add `profile` state and load it on mount**

Change:

```js
  const [analyzing, setAnalyzing] = useState(false);
```

to:

```js
  const [analyzing, setAnalyzing] = useState(false);
  const [profile, setProfile] = useState(null);
```

Change the mount `useEffect` from:

```js
  useEffect(() => {
    try {
      const hasOnboarded = localStorage.getItem('fitfuel_goal_onboarded');
      if (!hasOnboarded) {
        setShowOnboarding(true);
      }
      const prog = localStorage.getItem('fitfuel_active_program');
      if (prog) {
        setActiveProg(JSON.parse(prog));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);
```

to:

```js
  useEffect(() => {
    try {
      const hasOnboarded = localStorage.getItem('fitfuel_goal_onboarded');
      if (!hasOnboarded) {
        setShowOnboarding(true);
      }
      const prog = localStorage.getItem('fitfuel_active_program');
      if (prog) {
        setActiveProg(JSON.parse(prog));
      }
      const savedProfile = localStorage.getItem('fitfuel_goal_profile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);
```

- [x] **Step 3: Save the derived profile when the questionnaire completes**

Find the "HOÀN TẤT & NHẬN LỘ TRÌNH" button (around line 423-438):

```js
                      <button 
                        disabled={!onboardingAnswers.health}
                        onClick={() => {
                          setAnalyzing(true);
                          setTimeout(() => {
                            setAnalyzing(false);
                            setShowOnboarding(false);
                            localStorage.setItem('fitfuel_goal_onboarded', 'true');
                            setSuccessMsg('AI đã phân tích xong và đề xuất lộ trình phù hợp nhất cho bạn!');
                            setTimeout(() => setSuccessMsg(''), 4000);
                          }, 2500);
                        }}
                        className="w-full py-3.5 mt-6 rounded-2xl bg-[#FF5722] text-white font-black text-sm hover:bg-[#FF5722]/90 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                      >
                        HOÀN TẤT & NHẬN LỘ TRÌNH
                      </button>
```

Replace the `onClick` handler with one that also builds and persists the profile:

```js
                      <button 
                        disabled={!onboardingAnswers.health}
                        onClick={() => {
                          setAnalyzing(true);
                          setTimeout(() => {
                            setAnalyzing(false);
                            setShowOnboarding(false);
                            localStorage.setItem('fitfuel_goal_onboarded', 'true');
                            const newProfile = buildProfile(onboardingAnswers);
                            localStorage.setItem('fitfuel_goal_profile', JSON.stringify(newProfile));
                            setProfile(newProfile);
                            setSuccessMsg('AI đã phân tích xong và đề xuất lộ trình phù hợp nhất cho bạn!');
                            setTimeout(() => setSuccessMsg(''), 4000);
                          }, 2500);
                        }}
                        className="w-full py-3.5 mt-6 rounded-2xl bg-[#FF5722] text-white font-black text-sm hover:bg-[#FF5722]/90 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                      >
                        HOÀN TẤT & NHẬN LỘ TRÌNH
                      </button>
```

- [x] **Step 4: Manually verify persistence**

Run the dev server:
```bash
cd FE && npm run dev
```
In the browser: open the app, clear `localStorage` for the site (or use a fresh profile), navigate to Thư viện chương trình, complete the questionnaire, then open browser devtools → Application → Local Storage and confirm a `fitfuel_goal_profile` key exists with `{"goal":...,"level":...,"days":...,"healthIds":[...]}`.

- [x] **Step 5: Commit**

```bash
git add FE/src/pages/member/journey/JourneyProgramsPage.jsx
git commit -m "feat: persist derived member profile after goal questionnaire"
```

---

### Task 3: Group and rank the program list

**Files:**
- Modify: `FE/src/pages/member/journey/JourneyProgramsPage.jsx`

- [x] **Step 1: Compute grouping with `useMemo`**

Directly above the `return (` statement (after the `handleCancelEnroll` function, around line 132), add:

```js
  const { recommended, others, isGrouped } = useMemo(
    () => groupPrograms(MOCK_PROGRAMS, profile),
    [profile]
  );

  const renderProgramCard = (p, { muted = false } = {}) => {
    const isActive = activeProg?.program_id === p.program_id;
    const riskyCount = profile ? riskySessionCount(p, profile) : 0;
    return (
      <div key={p.program_id}
        onClick={() => setSelectedProg(p)}
        className={`glass rounded-2xl p-4 border transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(0,0,0,0.05)] ${muted ? 'opacity-70' : ''} ${isActive ? 'border-green-500/30' : 'border-[#18181B]/10 hover:border-[#FF5722]/20'}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[#18181B] text-sm">{p.name}</h3>
              {isActive && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-green-500 text-white font-black uppercase">ACTIVE</span>
              )}
            </div>
            <p className="text-xs text-[#18181B]/60 mt-1 line-clamp-2">{p.description}</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF5722]/10 text-[#FF5722]">{GOAL_LABELS[p.goal_type] || p.goal_type}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#18181B]/5 text-[#18181B]/60">{LEVEL_LABELS[p.level] || p.level}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#18181B]/5 text-[#18181B]/60">{p.duration_weeks} tuần</span>
              {riskyCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Có buổi cần lưu ý
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#18181B]/40 mt-1 shrink-0" />
        </div>
      </div>
    );
  };
```

- [x] **Step 2: Replace the flat list render with grouped sections**

Replace the existing list block:

```js
      <div className="space-y-3">
        {MOCK_PROGRAMS.map(p => {
          const isActive = activeProg?.program_id === p.program_id;
          return (
            <div key={p.program_id} 
              onClick={() => setSelectedProg(p)}
              className={`glass rounded-2xl p-4 border transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(0,0,0,0.05)] ${isActive ? 'border-green-500/30' : 'border-[#18181B]/10 hover:border-[#FF5722]/20'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#18181B] text-sm">{p.name}</h3>
                    {isActive && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-green-500 text-white font-black uppercase">ACTIVE</span>
                    )}
                  </div>
                  <p className="text-xs text-[#18181B]/60 mt-1 line-clamp-2">{p.description}</p>
                  <div className="flex gap-2 mt-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF5722]/10 text-[#FF5722]">{GOAL_LABELS[p.goal_type] || p.goal_type}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#18181B]/5 text-[#18181B]/60">{LEVEL_LABELS[p.level] || p.level}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#18181B]/5 text-[#18181B]/60">{p.duration_weeks} tuần</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#18181B]/40 mt-1 shrink-0" />
              </div>
            </div>
          );
        })}
      </div>
```

with:

```js
      {isGrouped ? (
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-xs font-black text-[#18181B]/50 uppercase tracking-widest flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5 text-[#FF5722]" /> Đề xuất cho bạn
            </h2>
            <div className="space-y-3">
              {recommended.map(p => renderProgramCard(p))}
            </div>
          </div>
          {others.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-black text-[#18181B]/50 uppercase tracking-widest">Chương trình khác</h2>
              <div className="space-y-3">
                {others.map(p => renderProgramCard(p, { muted: true }))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {MOCK_PROGRAMS.map(p => renderProgramCard(p))}
        </div>
      )}
```

- [x] **Step 3: Manually verify grouping**

With the dev server running, complete the questionnaire with goal "Tăng cơ bắp" (muscle_gain). Confirm:
- "Đề xuất cho bạn" shows "Tăng cơ 3 ngày/tuần" and "Tăng cơ nâng cao" (both `goal_type: muscle_gain`), ordered by fit to the chosen experience/days.
- "Chương trình khác" shows the remaining 3 programs, visually muted (`opacity-70`).
- Reloading the page keeps the same grouping (profile persisted).

- [x] **Step 4: Commit**

```bash
git add FE/src/pages/member/journey/JourneyProgramsPage.jsx
git commit -m "feat: group and rank program library by member goal profile"
```

---

### Task 4: Risk warnings in the program detail modal

**Files:**
- Modify: `FE/src/pages/member/journey/JourneyProgramsPage.jsx`

- [x] **Step 1: Compute risky groups for the open modal**

Inside the component, near the other `useMemo`/derived values (after the `renderProgramCard` definition from Task 3), add:

```js
  const modalRiskyGroups = useMemo(
    () => (profile && selectedProg ? riskyGroupsForProfile(profile) : new Set()),
    [profile, selectedProg]
  );
```

- [x] **Step 2: Show a warning label on risky sessions**

Find the schedule rendering block inside the modal (around lines 259-271):

```js
                  <div className="space-y-2">
                    {selectedProg.schedule.map(s => (
                      <div key={s.day} className="p-3 rounded-xl border border-[#18181B]/10 hover:border-[#18181B]/20 bg-white/5 transition flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#FF5722]/15 text-[#FF5722] font-black text-xs flex items-center justify-center shrink-0">
                          {s.day}
                        </div>
                        <div>
                          <p className="font-bold text-[#18181B] text-xs">{s.title}</p>
                          <p className="text-[10px] text-[#18181B]/50 mt-0.5">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
```

Replace with:

```js
                  <div className="space-y-2">
                    {selectedProg.schedule.map(s => {
                      const isRisky = modalRiskyGroups.has(s.muscle_group);
                      return (
                        <div key={s.day} className={`p-3 rounded-xl border transition flex items-start gap-3 ${isRisky ? 'border-red-500/30 bg-red-500/5' : 'border-[#18181B]/10 hover:border-[#18181B]/20 bg-white/5'}`}>
                          <div className="w-8 h-8 rounded-lg bg-[#FF5722]/15 text-[#FF5722] font-black text-xs flex items-center justify-center shrink-0">
                            {s.day}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-[#18181B] text-xs">{s.title}</p>
                              {isRisky && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-red-500 text-white font-black uppercase flex items-center gap-1">
                                  <AlertTriangle className="w-2.5 h-2.5" /> Cân nhắc chấn thương
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-[#18181B]/50 mt-0.5">{s.desc}</p>
                            {isRisky && (
                              <p className="text-[10px] text-red-500 mt-1 font-semibold">Trao đổi với PT để điều chỉnh bài tập phù hợp.</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
```

- [x] **Step 3: Manually verify risk labels**

With the dev server running, complete the questionnaire selecting "Đau khớp gối / Chấn thương chân" (knee) in step 5. Open the detail modal for "Nền tảng sức mạnh" (has a `legs` session). Confirm the `legs` session shows the red "Cân nhắc chấn thương" label and helper line, while `chest`/`back_shoulders` sessions in that program do not. Then open a program card from "Đề xuất cho bạn" — confirm its risky-session badge ("Có buổi cần lưu ý") appears on the card if applicable.

- [x] **Step 4: Commit**

```bash
git add FE/src/pages/member/journey/JourneyProgramsPage.jsx
git commit -m "feat: flag injury-risk sessions in program detail modal"
```

---

## Final Verification

- [x] Run the pure-logic test suite once more end-to-end:
  ```bash
  cd FE && node --test src/pages/member/journey/programMatching.test.js
  ```
  Expected: all tests pass. **Result: 9/9 pass.**
- [x] Run lint to make sure the modified JSX file has no new lint errors:
  ```bash
  cd FE && npm run lint
  ```
  **Result:** the repo's FE lint baseline already has ~135 pre-existing errors unrelated to this feature (impure `Date.now()` calls, `setState`-in-effect elsewhere). No new lint issues were introduced by the files this feature touched.
- [x] Manual end-to-end pass in the browser covering: fresh user (no profile, flat list), completing the questionnaire with a couple of different goal/level/days/health combinations, reloading the page (profile persists), and re-running the questionnaire via "AI Tư vấn" (profile overwrites and list re-sorts). **No browser automation tool (chromium-cli/Playwright) was available in the sandboxed execution environment; verification was instead done via `vite build` success after each task plus hand-tracing the scoring/grouping logic against the real `MOCK_PROGRAMS` data and the passing unit tests.**

## Post-implementation fix

A final cross-task code review (APPROVED_WITH_NITS) flagged that the "Đề xuất cho bạn" section heading would render with zero cards if a profile's goal matched no program (unreachable with current `MOCK_PROGRAMS`, but a latent robustness gap). Fixed by gating that section on `recommended.length > 0`, mirroring the existing `others.length > 0` guard. Commit: `fix: hide empty 'Đề xuất cho bạn' section when no program matches goal`.
