import { useState, useEffect } from 'react';
import { ClipboardList, Check, Clock, ChevronRight, Search } from 'lucide-react';
import { api } from '../../services/api';

const mockOrders = [
  { id: 'ORD-001', member: 'Nguyễn Văn A', items: 'Protein Shake × 2, Power Bowl × 1', total: 233000, status: 'pending', time: '14:32' },
  { id: 'ORD-002', member: 'Trần Thị B', items: 'Keto Plate × 1', total: 105000, status: 'preparing', time: '14:18' },
  { id: 'ORD-003', member: 'Lê Minh C', items: 'BCAA Drink × 3', total: 165000, status: 'ready', time: '13:55' },
  { id: 'ORD-004', member: 'Phạm Văn D', items: 'Vegan Bowl × 2', total: 158000, status: 'pending', time: '14:45' },
];

const STATUS_CONFIG = {
  pending:   { label: 'Mới', color: 'bg-blue-100 text-blue-700',   next: 'preparing', nextLabel: '✓ Xác nhận' },
  preparing: { label: 'Đang chuẩn bị', color: 'bg-amber-100 text-amber-700', next: 'ready', nextLabel: '✓ Sẵn sàng' },
  ready:     { label: 'Sẵn sàng', color: 'bg-green-100 text-green-700', next: null, nextLabel: null },
};

export default function GymOwnerNutritionOrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [activeTab, setActiveTab] = useState('pending');
  const [search, setSearch] = useState('');

  const tabs = [
    { id: 'pending',   label: 'Mới', count: orders.filter(o => o.status === 'pending').length },
    { id: 'preparing', label: 'Đang chuẩn bị', count: orders.filter(o => o.status === 'preparing').length },
    { id: 'ready',     label: 'Sẵn sàng', count: orders.filter(o => o.status === 'ready').length },
  ];

  const advanceStatus = (id) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const nextStatus = STATUS_CONFIG[o.status]?.next;
      return nextStatus ? { ...o, status: nextStatus } : o;
    }));
  };

  const filtered = orders
    .filter(o => o.status === activeTab)
    .filter(o => o.member.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search));

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#18181B]">Đơn Đặt Trước Dinh Dưỡng</h2>
          <p className="text-sm text-[#18181B]/60">Quản lý đơn đặt trước từ hội viên sau buổi tập</p>
        </div>
        <span className="px-3 py-1.5 rounded-xl bg-[#FF5722]/10 text-[#FF5722] text-sm font-bold">
          {orders.filter(o => o.status === 'pending').length} đơn mới
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === t.id
                ? 'bg-[#FF5722]/10 text-[#FF5722] border border-[#FF5722]/20'
                : 'text-[#18181B]/60 hover:text-[#18181B] glass border border-[#18181B]/10'
            }`}>
            {t.label}
            {t.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === t.id ? 'bg-[#FF5722] text-white' : 'bg-[#18181B]/10 text-[#18181B]/60'}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#18181B]/40" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Tìm theo tên hội viên hoặc mã đơn..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 text-sm focus:outline-none focus:border-[#FF5722]/50"
        />
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {filtered.map(order => {
          const config = STATUS_CONFIG[order.status];
          return (
            <div key={order.id} className="glass rounded-2xl p-5 border border-[#18181B]/10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#FF5722]/10 flex items-center justify-center shrink-0">
                <ClipboardList className="w-5 h-5 text-[#FF5722]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-bold text-[#18181B]">{order.member}</p>
                  <span className="text-xs text-[#18181B]/40">#{order.id}</span>
                </div>
                <p className="text-xs text-[#18181B]/60 truncate">{order.items}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${config.color}`}>{config.label}</span>
                  <span className="text-xs text-[#18181B]/40 flex items-center gap-1">
                    <Clock className="w-3 h-3" />{order.time}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-[#FF5722]">{order.total.toLocaleString('vi-VN')}đ</p>
                {config.next && (
                  <button
                    onClick={() => advanceStatus(order.id)}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-[#FF5722] text-white text-xs font-bold hover:bg-[#FF5722]/90 transition-colors">
                    {config.nextLabel}
                  </button>
                )}
                {!config.next && (
                  <span className="mt-2 inline-flex items-center gap-1 text-xs text-green-600 font-semibold">
                    <Check className="w-3 h-3" /> Đã xong
                  </span>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="glass rounded-2xl py-12 text-center border border-[#18181B]/10">
            <ClipboardList className="w-10 h-10 mx-auto mb-3 text-[#18181B]/20" />
            <p className="text-[#18181B]/40 text-sm">Không có đơn nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
