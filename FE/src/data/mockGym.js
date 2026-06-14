export const muscleGroups = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Full Body', 'Cardio'];

export const mockExercises = [
  { id: 1, name: 'Barbell Bench Press', muscle: 'Chest', equipment: 'Barbell', level: 'Intermediate', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop' },
  { id: 2, name: 'Deadlift', muscle: 'Back', equipment: 'Barbell', level: 'Advanced', image: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=400&h=300&fit=crop' },
  { id: 3, name: 'Pull-ups', muscle: 'Back', equipment: 'Bodyweight', level: 'Intermediate', image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&h=300&fit=crop' },
  { id: 4, name: 'Squat', muscle: 'Legs', equipment: 'Barbell', level: 'Intermediate', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop' },
  { id: 5, name: 'Shoulder Press', muscle: 'Shoulders', equipment: 'Dumbbell', level: 'Beginner', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop' },
  { id: 6, name: 'Bicep Curl', muscle: 'Arms', equipment: 'Dumbbell', level: 'Beginner', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop' },
  { id: 7, name: 'Plank', muscle: 'Core', equipment: 'Bodyweight', level: 'Beginner', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
  { id: 8, name: 'Cable Row', muscle: 'Back', equipment: 'Cable', level: 'Beginner', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop' },
  { id: 9, name: 'Leg Press', muscle: 'Legs', equipment: 'Machine', level: 'Beginner', image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=300&fit=crop' },
  { id: 10, name: 'Tricep Dips', muscle: 'Arms', equipment: 'Bodyweight', level: 'Intermediate', image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=300&fit=crop' },
];

export const mockWorkoutHistory = [
  {
    id: 1,
    userId: 1,
    date: '2025-05-21',
    name: 'Upper Power',
    duration: 68,
    volume: 14200,
    exercises: [
      { exerciseId: 1, name: 'Barbell Bench Press', sets: [{ reps: 5, weight: 100 }, { reps: 5, weight: 102.5 }, { reps: 4, weight: 105 }] },
      { exerciseId: 2, name: 'Deadlift', sets: [{ reps: 3, weight: 160 }, { reps: 3, weight: 165 }, { reps: 2, weight: 170 }] },
      { exerciseId: 5, name: 'Shoulder Press', sets: [{ reps: 8, weight: 60 }, { reps: 8, weight: 62.5 }, { reps: 7, weight: 65 }] },
    ]
  },
  {
    id: 2,
    userId: 1,
    date: '2025-05-19',
    name: 'Lower Strength',
    duration: 75,
    volume: 18400,
    exercises: [
      { exerciseId: 4, name: 'Squat', sets: [{ reps: 5, weight: 130 }, { reps: 5, weight: 135 }, { reps: 4, weight: 140 }] },
      { exerciseId: 9, name: 'Leg Press', sets: [{ reps: 10, weight: 200 }, { reps: 10, weight: 210 }, { reps: 8, weight: 220 }] },
    ]
  },
  {
    id: 3,
    userId: 1,
    date: '2025-05-17',
    name: 'Pull Day',
    duration: 60,
    volume: 12100,
    exercises: [
      { exerciseId: 2, name: 'Deadlift', sets: [{ reps: 3, weight: 155 }, { reps: 3, weight: 160 }] },
      { exerciseId: 3, name: 'Pull-ups', sets: [{ reps: 10, weight: 0 }, { reps: 9, weight: 0 }, { reps: 8, weight: 0 }] },
      { exerciseId: 8, name: 'Cable Row', sets: [{ reps: 12, weight: 70 }, { reps: 12, weight: 72.5 }, { reps: 10, weight: 75 }] },
    ]
  },
];

export const mockPersonalRecords = [
  { exerciseId: 1, name: 'Bench Press', pr: 110, date: '2025-04-15', unit: 'kg' },
  { exerciseId: 2, name: 'Deadlift', pr: 185, date: '2025-03-28', unit: 'kg' },
  { exerciseId: 4, name: 'Squat', pr: 145, date: '2025-05-01', unit: 'kg' },
  { exerciseId: 5, name: 'Overhead Press', pr: 72.5, date: '2025-02-10', unit: 'kg' },
];

export const mockGymAnnouncements = [
  { id: 1, title: 'New Equipment Arrived!', body: 'We\'ve added 4 new Titan power racks. Slots fill fast — book via the app.', date: '2025-05-20', priority: 'high' },
  { id: 2, title: 'Maintenance: Sunday 6–8am', body: 'Cardio section will be closed for routine maintenance this Sunday morning.', date: '2025-05-18', priority: 'medium' },
  { id: 3, title: 'Coach Dana\'s Nutrition Workshop', body: 'Free workshop on May 30. Sign up via the Passport section.', date: '2025-05-16', priority: 'low' },
];

export const mockGymStats = {
  totalMembers: 342,
  activeToday: 78,
  checkedInThisWeek: 210,
  peakHour: '6:00 PM',
  avgSessionLength: '64 min',
  monthlyRevenue: 48500000,
  newMembersThisMonth: 28,
  churnRate: 3.2
};
