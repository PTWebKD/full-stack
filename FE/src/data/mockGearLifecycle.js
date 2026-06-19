export const mockGearLifecycles = {
  1: [
    { id: 1, action: 'listed', actor: 'Iron Gear Co.', date: '2024-01-10', note: 'Barbell mới 100%, full box', condition: 5, price: 3200000, image: null },
    { id: 2, action: 'sold', actor: 'Alex Thunder', date: '2024-01-18', note: 'Đã giao hàng, người mua xác nhận tốt', condition: 5, price: 3200000, image: null },
    { id: 3, action: 'resold', actor: 'Alex Thunder → SportZone HCM', date: '2024-10-05', note: 'Bán lại sau 9 tháng dùng, còn rất tốt', condition: 4, price: 2600000, image: null },
    { id: 4, action: 'listed', actor: 'SportZone HCM', date: '2024-11-20', note: 'Đăng bán lại, đang dùng tại phòng gym', condition: 4, price: 2800000, image: null },
  ],
  3: [
    { id: 1, action: 'listed', actor: 'NutriForce', date: '2025-01-05', note: 'Sản phẩm mới, HSD 12/2026', condition: 5, price: 1100000, image: null },
    { id: 2, action: 'sold', actor: 'Sarah Kim', date: '2025-01-12', note: 'Đã mua 2 hộp', condition: 5, price: 950000, image: null },
  ],
  7: [
    { id: 1, action: 'listed', actor: 'RecoverRight', date: '2024-08-15', note: 'Hàng mới về, bảo hành 1 năm', condition: 5, price: 1500000 },
    { id: 2, action: 'rented', actor: 'Jake Power', date: '2024-09-01', note: 'Thuê 7 ngày', condition: 5, deposit: 300000, rentPrice: 150000 },
    { id: 3, action: 'returned', actor: 'Jake Power', date: '2024-09-08', note: 'Trả đúng hạn, máy còn tốt', condition: 5 },
    { id: 4, action: 'rented', actor: 'Mike D.', date: '2024-10-15', note: 'Thuê 14 ngày', condition: 5, deposit: 300000, rentPrice: 270000 },
    { id: 5, action: 'returned', actor: 'Mike D.', date: '2024-10-29', note: 'Trả trễ 1 ngày, trừ phí', condition: 4 },
    { id: 6, action: 'listed', actor: 'RecoverRight', date: '2025-01-10', note: 'Cho thuê lại sau bảo dưỡng', condition: 4, price: 1200000 },
  ],
};

export const actionConfig = {
  listed: { label: 'Đăng bán/thuê', color: '#FF5722', bg: 'bg-[#FF5722]/10 border-[#FF5722]/20', icon: '📋' },
  sold: { label: 'Đã bán', color: '#3b82f6', bg: 'bg-[#3b82f6]/10 border-[#3b82f6]/20', icon: '✅' },
  rented: { label: 'Cho thuê', color: '#FF5722', bg: 'bg-[#FF5722]/10 border-[#FF5722]/20', icon: '🔑' },
  returned: { label: 'Đã trả', color: '#a855f7', bg: 'bg-[#a855f7]/10 border-[#a855f7]/20', icon: '↩️' },
  resold: { label: 'Bán lại', color: '#fbbf24', bg: 'bg-[#fbbf24]/10 border-[#fbbf24]/20', icon: '🔄' },
};
