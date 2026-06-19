import { useState } from 'react';
import { Package, Clock, AlertCircle, Check, Search } from 'lucide-react';

const mockRentals = [
  { id: 'R001', member: 'Nguyễn Văn A', gear: 'Tạ Tay 5kg (cặp)', start: '2026-06-15', due: '2026-06-22', returned: null, fee: 105000, deposit: 200000, status: 'active' },
  { id: 'R002', member: 'Trần Thị B', gear: 'Thảm Yoga 6mm', start: '2026-06-16', due: '2026-06-19', returned: null, fee: 30000, deposit: 100000, status: 'overdue' },
  { id: 'R003', member: 'Lê Minh C', gear: 'Dây Nhảy Cao Cấp', start: '2026-06-10', due: '2026-06-17', returned: '2026-06-17', fee: 56000, deposit: 80000, status: 'returned' },
  { id: 'R004', member: 'Phạm Văn D', gear: 'Đai Lưng Squat', start: '2026-06-18', due: '2026-06-25', returned: null, fee: 140000, deposit: 200000, status: 'active' },
];

const STATUS_CONFIG = {
  active:   { label: 'Đang thuê',  color: 'bg-blue-100 text-blue-700' },
  overdue:  { label: 'Quá hạn',   color: 'bg-red-100 text-red-700' },
  returned: { label: 'Đã trả',    color: 'bg-green-100 text-green-700' },
};

export default function GymOwnerGearRentalsPage() {
  const [rentals, setRentals] = useState(mockRentals);
  const [activeTab, setActiveTab] = useState('active');
  const [search, setSearch] = useState('');

  const tabs = [
    { id: 'active',   label: 'Đang thuê', count: rentals.filter(r => r.status === 'active').length },
    { id: 'overdue',  label: 'Quá hạn',  count: rentals.filter(r => r.status === 'overdue').length },
    { id: 'returned', label: 'Lịch sử',  count: rentals.filter(r => r.status === 'returned').length },
  ];

  const confirmReturn = (id) => {
    setRentals(prev => prev.map(r =>
      r.id === id ? { ...r, status: 'returned', returned: new Date().toISOString().split('T')[0] } : r
    ));
  };

  const filtered = rentals
    .filter(r => r.status === activeTab)
    .filter(r => r.member.toLowerCase().includes(search.toLowerCase()) || r.gear.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-[#18181B]">Quản Lý Cho Thuê Gear</h2>
          <p className="text-sm text-[#18181B]/60">Theo dõi vòng đời thuê thiết bị</p>
        </div>
        {rentals.filter(r => r.status === 'overdue').length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span className="font-semibold">{rentals.filter(r => r.status === 'overdue').length} trường hợp quá hạn</span>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Đang thuê', value: rentals.filter(r => r.status === 'active').length, color: '#3b82f6' },
          { label: 'Quá hạn', value: rentals.filter(r => r.status === 'overdue').length, color: '#ef4444' },
          { label: 'Đặt cọc đang giữ', value: rentals.filter(r => r.status !== 'returned').reduce((s, r) => s + r.deposit, 0).toLocaleString('vi-VN') + 'đ', color: '#FF5722' },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-4 border border-[#18181B]/10">
            <p className="text-2xl font-black text-[#18181B]">{s.value}</p>
            <p className="text-xs text-[#18181B]/60 mt-1">{s.label}</p>
          </div>
        ))}
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
          placeholder="Tìm hội viên hoặc tên thiết bị..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 text-sm focus:outline-none focus:border-[#FF5722]/50"
        />
      </div>

      {/* Rentals list */}
      <div className="space-y-3">
        {filtered.map(r => {
          const cfg = STATUS_CONFIG[r.status];
          const isOverdue = r.status === 'overdue';
          return (
            <div key={r.id} className={`glass rounded-2xl p-5 border transition-all flex items-center gap-4 ${isOverdue ? 'border-red-200 bg-red-50/30' : 'border-[#18181B]/10'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isOverdue ? 'bg-red-100' : 'bg-[#FF5722]/10'}`}>
                <Package className={`w-5 h-5 ${isOverdue ? 'text-red-500' : 'text-[#FF5722]'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-bold text-[#18181B]">{r.member}</p>
                  <span className="text-xs text-[#18181B]/40">#{r.id}</span>
                </div>
                <p className="text-sm text-[#18181B]/70 mb-1">{r.gear}</p>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${cfg.color}`}>{cfg.label}</span>
                  <span className="text-xs text-[#18181B]/50 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {r.start} → {r.due}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-[#18181B]/60">Phí thuê</p>
                <p className="text-sm font-bold text-[#FF5722]">{r.fee.toLocaleString('vi-VN')}đ</p>
                <p className="text-xs text-[#18181B]/50">Cọc: {r.deposit.toLocaleString('vi-VN')}đ</p>
                {r.status !== 'returned' && (
                  <button
                    onClick={() => confirmReturn(r.id)}
                    className="mt-2 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FF5722] text-white text-xs font-bold hover:bg-[#FF5722]/90 transition-colors ml-auto">
                    <Check className="w-3 h-3" /> Xác nhận trả
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="glass rounded-2xl py-12 text-center border border-[#18181B]/10">
            <Package className="w-10 h-10 mx-auto mb-3 text-[#18181B]/20" />
            <p className="text-[#18181B]/40 text-sm">Không có dữ liệu</p>
          </div>
        )}
      </div>
    </div>
  );
}
