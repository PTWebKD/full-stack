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
