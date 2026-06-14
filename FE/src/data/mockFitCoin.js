export const mockFitCoinBalance = 2450;

export const mockFitCoinHistory = [
  { id: 1, type: 'earn', source: 'Streak 14 ngày', amount: 140, date: '2025-05-22', icon: '🔥' },
  { id: 2, type: 'spend', source: 'Mua Power Protein Bowl', amount: -89, date: '2025-05-21', icon: '🍱' },
  { id: 3, type: 'earn', source: 'Hoàn thành session workout', amount: 20, date: '2025-05-21', icon: '💪' },
  { id: 4, type: 'earn', source: 'Bán Resistance Bands', amount: 280, date: '2025-05-18', icon: '🏷️' },
  { id: 5, type: 'spend', source: 'Thuê Massage Gun', amount: -120, date: '2025-05-16', icon: '🛒' },
  { id: 6, type: 'earn', source: 'Badge "100 Workouts"', amount: 200, date: '2024-12-28', icon: '🏆' },
  { id: 7, type: 'earn', source: 'Đặt hàng thực phẩm lần đầu', amount: 50, date: '2025-01-10', icon: '🎉' },
  { id: 8, type: 'earn', source: 'Giới thiệu bạn bè', amount: 100, date: '2025-02-14', icon: '👥' },
  { id: 9, type: 'spend', source: 'Keto Warrior Plate x2', amount: -190, date: '2025-03-01', icon: '🍱' },
  { id: 10, type: 'earn', source: 'Personal Record mới', amount: 30, date: '2025-05-01', icon: '⚡' },
];

export const fitCoinRules = [
  { action: 'Hoàn thành buổi tập', earn: '+20 FC', icon: '💪' },
  { action: 'Streak mỗi ngày', earn: '+10 FC', icon: '🔥' },
  { action: 'Đặt hàng thực phẩm', earn: '+5% giá trị', icon: '🍱' },
  { action: 'Bán gear thành công', earn: '+2% giá trị', icon: '🏷️' },
  { action: 'Đạt Personal Record', earn: '+30 FC', icon: '⚡' },
  { action: 'Unlock badge', earn: '+50–200 FC', icon: '🏆' },
];
