import { Users, TrendingUp, HeartHandshake, ArrowUp } from 'lucide-react';
import { mockAdminStats, mockRevenueChart } from '../../data/mockAdmin';

export default function AdminDashboardPage() {
  const s = mockAdminStats;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Tổng Hội Viên', value: s.totalUsers?.toLocaleString() ?? '—', icon: Users, color: '#003a5a', sub: `${s.activeMembers ?? '—'} active` },
          { label: 'Gym Owners', value: s.totalGymOwners ?? '—', icon: Users, color: '#a855f7', sub: 'phòng gym' },
          { label: 'Doanh Thu', value: `${((s.monthlyRevenue ?? 0) / 1000000).toFixed(0)}M`, icon: TrendingUp, color: '#f97316', sub: `+${s.revenueGrowth ?? 0}% tăng trưởng` },
          { label: 'Tổng Đơn Hàng', value: s.totalOrders?.toLocaleString() ?? '—', icon: HeartHandshake, color: '#00d4ff', sub: 'tháng này' },
        ].map(stat => (
          <div key={stat.label} className="glass rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-white/40">{stat.label}</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-2xl font-black text-white">{stat.value}</p>
            <p className="text-xs text-white/30 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="glass rounded-2xl p-5 border border-white/5">
        <h3 className="font-semibold text-white mb-4">Xu hướng Doanh thu</h3>
        <div className="flex items-end gap-3 h-32">
          {mockRevenueChart.map((d) => {
            const max = Math.max(...mockRevenueChart.map(x => x.revenue));
            const pct = (d.revenue / max) * 100;
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                <p className="text-xs text-white/20">{(d.revenue / 1000000).toFixed(0)}M</p>
                <div className="w-full rounded-t-lg bg-gradient-to-t from-[#003a5a]/30 to-[#003a5a]/60 hover:from-[#003a5a]/50 hover:to-[#003a5a] transition-all cursor-pointer" style={{ height: `${pct * 0.7}%` }} />
                <span className="text-xs text-white/30 text-center leading-tight">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div className="glass rounded-2xl p-5 border border-white/5">
        <h3 className="font-semibold text-white mb-3">Truy cập nhanh</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Quản lý Hội viên', href: '/gym-owner/members' },
            { label: 'AI Care Queue', href: '/gym-owner/care-queue' },
            { label: 'Phân tích', href: '/gym-owner/analytics' },
            { label: 'Báo cáo', href: '/admin/reports' },
          ].map(l => (
            <a key={l.label} href={l.href}
              className="px-4 py-2.5 rounded-xl glass border border-white/5 text-sm text-white/60 hover:text-white hover:border-white/20 transition-all text-center">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
