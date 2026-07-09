export const mockAdminStats = {
  totalUsers: 1847,
  activeMembers: 1234,
  totalGymOwners: 12,
  monthlyRevenue: 284500000,
  revenueGrowth: 18.4,
  totalOrders: 3421,
  activeAnnouncements: 3
};

export const mockAllUsers = [
  { id: 1, name: 'Alex Thunder', email: 'alex@fitfuel.com', role: 'member', status: 'active', joinedAt: '2024-01-15', plan: 'yearly', revenue: 4800000 },
  { id: 2, name: 'Sarah Kim', email: 'sarah@fitfuel.com', role: 'member', status: 'active', joinedAt: '2024-03-22', plan: 'monthly', revenue: 559000 },
  { id: 3, name: 'Tony Reps', email: 'tony@fitfuel.com', role: 'member', status: 'active', joinedAt: '2024-04-01', plan: 'monthly', revenue: 559000 },
  { id: 4, name: 'Coach Dana', email: 'gym@fitfuel.com', role: 'gymOwner', status: 'active', joinedAt: '2023-12-01', plan: 'gym', revenue: 48500000 },
  { id: 5, name: 'Jake Power', email: 'jake@fitfuel.com', role: 'member', status: 'suspended', joinedAt: '2024-06-10', plan: 'monthly', revenue: 559000 },
  { id: 6, name: 'Lisa Core', email: 'lisa@fitfuel.com', role: 'member', status: 'active', joinedAt: '2024-07-20', plan: 'yearly', revenue: 4800000 },
];

export const mockRevenueChart = [
  { month: 'Thg 12 24', revenue: 185000000, members: 1340, orders: 2100 },
  { month: 'Thg 1 25', revenue: 195000000, members: 1420, orders: 2280 },
  { month: 'Thg 2 25', revenue: 210000000, members: 1510, orders: 2450 },
  { month: 'Thg 3 25', revenue: 225000000, members: 1620, orders: 2690 },
  { month: 'Thg 4 25', revenue: 240000000, members: 1730, orders: 2900 },
  { month: 'Thg 5 25', revenue: 284500000, members: 1847, orders: 3421 },
];
