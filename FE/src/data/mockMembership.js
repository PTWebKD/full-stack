// ─── Mock Membership Data ───────────────────────────────────────────────────
// Chỉ 1 gói duy nhất, 2 chu kỳ thanh toán: tháng và năm
// Gói năm = 10 tháng giá (~16.7% discount, 2 tháng miễn phí)

export const MONTHLY_PRICE = 399000;
export const YEARLY_PRICE  = 3990000; // 399000 × 10

// Tất cả ưu đãi đều giống nhau giữa gói tháng & gói năm
export const MEMBER_BENEFITS = [
  { text: 'Vào gym 24/7 không giới hạn' },
  { text: 'Tủ đồ cá nhân + khóa thông minh' },
  { text: 'Tất cả lớp nhóm không giới hạn' },
  { text: 'Theo dõi workout & biểu đồ tiến độ' },
  { text: '2 buổi PT 1-1 / tháng' },
  { text: 'Tư vấn dinh dưỡng hàng tháng' },
  { text: 'AI FitBot không giới hạn' },
  { text: 'FitCoin rewards mọi hoạt động' },
];

export const PAYMENT_METHODS = [
  { id: 'momo',    label: 'MoMo',            color: '#a50064' },
  { id: 'vnpay',   label: 'VNPay',           color: '#005bac' },
  { id: 'zalopay', label: 'ZaloPay',         color: '#0068ff' },
  { id: 'cash',    label: 'Tiền mặt tại quầy', color: '#16a34a' },
];

// Mock: trạng thái gói hiện tại của member đã đăng nhập
export const MOCK_MEMBERSHIP = {
  billing: 'monthly',
  startDate: '2025-06-01',
  endDate: '2025-06-30',
  autoRenew: true,
  daysRemaining: 22,
};

export const YEARLY_MONTHS_FREE = 2;
export const YEARLY_DISCOUNT_PCT = Math.round(
  ((MONTHLY_PRICE * 12 - YEARLY_PRICE) / (MONTHLY_PRICE * 12)) * 100
); // ≈ 17
