export const mockAdminStats = {
  totalUsers: 1847,
  activeUsers: 1234,
  totalVendors: 28,
  totalSellers: 45,
  totalGymOwners: 12,
  monthlyRevenue: 284500000,
  revenueGrowth: 18.4,
  totalOrders: 3421,
  pendingDisputes: 7,
  activeAnnouncements: 3
};

export const mockAllUsers = [
  { id: 1, name: 'Alex Thunder', email: 'alex@fitfuel.com', role: 'member', status: 'active', joinedAt: '2024-01-15', plan: 'pro', revenue: 590000 },
  { id: 2, name: 'Sarah Kim', email: 'sarah@fitfuel.com', role: 'member', status: 'active', joinedAt: '2024-03-22', plan: 'basic', revenue: 190000 },
  { id: 3, name: 'Mike Forge', email: 'vendor@fitfuel.com', role: 'vendor', status: 'active', joinedAt: '2024-02-10', plan: 'vendor', revenue: 12400000 },
  { id: 4, name: 'Tony Reps', email: 'seller@fitfuel.com', role: 'gymOwner', status: 'active', joinedAt: '2024-04-01', plan: 'gym', revenue: 8900000 },
  { id: 5, name: 'Coach Dana', email: 'gym@fitfuel.com', role: 'gymOwner', status: 'active', joinedAt: '2023-12-01', plan: 'gym', revenue: 48500000 },
  { id: 7, name: 'Jake Power', email: 'jake@fitfuel.com', role: 'member', status: 'suspended', joinedAt: '2024-06-10', plan: 'basic', revenue: 190000 },
  { id: 8, name: 'Lisa Core', email: 'lisa@fitfuel.com', role: 'member', status: 'active', joinedAt: '2024-07-20', plan: 'pro', revenue: 590000 },
];

export const mockDisputes = [
  { id: 1, type: 'gear', orderId: 'GO-2025-018', buyer: 'Jake Power', seller: 'UnknownGear', item: 'Lifting Straps', issue: 'Item never arrived after 14 days', status: 'open', createdAt: '2025-05-15' },
  { id: 2, type: 'food', orderId: 'FO-2025-099', buyer: 'Lisa Core', seller: 'QuickBite', item: 'Protein Pack', issue: 'Wrong order received', status: 'investigating', createdAt: '2025-05-18' },
];

export const mockVendorApplications = [
  { id: 1, name: 'FitChef Pro', owner: 'Nguyen Van A', type: 'food', email: 'fitchef@email.com', appliedAt: '2025-05-19', status: 'pending', documents: ['license.pdf', 'menu.pdf'] },
  { id: 2, name: 'Power Equipment Co', owner: 'Tran Thi B', type: 'gear', email: 'powerequip@email.com', appliedAt: '2025-05-20', status: 'pending', documents: ['license.pdf'] },
];

export const mockRevenueChart = [
  { month: 'Dec 24', revenue: 185000000, users: 1340, orders: 2100 },
  { month: 'Jan 25', revenue: 195000000, users: 1420, orders: 2280 },
  { month: 'Feb 25', revenue: 210000000, users: 1510, orders: 2450 },
  { month: 'Mar 25', revenue: 225000000, users: 1620, orders: 2690 },
  { month: 'Apr 25', revenue: 240000000, users: 1730, orders: 2900 },
  { month: 'May 25', revenue: 284500000, users: 1847, orders: 3421 },
];
