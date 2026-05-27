export const mockUsers = [
  {
    id: 1,
    name: 'Alex Thunder',
    email: 'alex@fitfuel.com',
    password: '123456',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&h=150&fit=crop&crop=face',
    level: 'Elite',
    points: 4820,
    streak: 14,
    joinedAt: '2024-01-15',
    plan: 'pro',
    stats: { workouts: 127, calories: 48200, prs: 23, followers: 342 }
  },
  {
    id: 2,
    name: 'Sarah Kim',
    email: 'sarah@fitfuel.com',
    password: '123456',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face',
    level: 'Champion',
    points: 2310,
    streak: 7,
    joinedAt: '2024-03-22',
    plan: 'basic',
    stats: { workouts: 64, calories: 21500, prs: 9, followers: 128 }
  },
  {
    id: 3,
    name: 'Mike Forge',
    email: 'vendor@fitfuel.com',
    password: '123456',
    role: 'vendor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    businessName: 'Clean Fuel Kitchen',
    plan: 'vendor'
  },
  {
    id: 4,
    name: 'Tony Reps',
    email: 'seller@fitfuel.com',
    password: '123456',
    role: 'gymOwner',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face',
    gymName: 'Iron Gear Co.',
    plan: 'gym'
  },
  {
    id: 5,
    name: 'Coach Dana',
    email: 'gym@fitfuel.com',
    password: '123456',
    role: 'gymOwner',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    gymName: 'Apex Performance Gym',
    plan: 'gym'
  },
  {
    id: 6,
    name: 'Admin Rex',
    email: 'admin@fitfuel.com',
    password: '123456',
    role: 'gymOwner',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    gymName: 'Rex Power Gym',
    plan: 'gym'
  }
];

export const getMockUser = (email, password) =>
  mockUsers.find(u => u.email === email && u.password === password) || null;
