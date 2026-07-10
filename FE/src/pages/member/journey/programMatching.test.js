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
