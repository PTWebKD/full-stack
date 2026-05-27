import { Users, Package, TrendingUp, ShieldAlert, ArrowUp } from 'lucide-react';
import { mockAdminStats, mockRevenueChart, mockDisputes } from '../../data/mockAdmin';

const fmt = (n) => n.toLocaleString('vi-VN');

export default function AdminDashboardPage() {
  const s = mockAdminStats;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Users', value: s.totalUsers.toLocaleString(), icon: Users, color: '#003a5a', sub: `${s.activeUsers} active` },
          { label: 'Vendors', value: s.totalVendors + s.totalSellers, icon: Package, color: '#00d4ff', sub: `${s.totalVendors} food · ${s.totalSellers} gear` },
          { label: 'Monthly Revenue', value: `${(s.monthlyRevenue / 1000000).toFixed(0)}M`, icon: TrendingUp, color: '#f97316', sub: `+${s.revenueGrowth}% growth` },
          { label: 'Open Disputes', value: s.pendingDisputes, icon: ShieldAlert, color: '#ef4444', sub: 'needs attention' },
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
        <h3 className="font-semibold text-white mb-4">Revenue Trend</h3>
        <div className="flex items-end gap-3 h-32">
          {mockRevenueChart.map((d, i) => {
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

      {/* Recent Disputes */}
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <h3 className="font-semibold text-white">Open Disputes</h3>
        </div>
        <div className="divide-y divide-white/5">
          {mockDisputes.map(d => (
            <div key={d.id} className="flex items-start gap-4 px-5 py-4">
              <span className={`text-xs px-2 py-0.5 rounded-full mt-0.5 capitalize ${d.status === 'open' ? 'bg-red-400/10 text-red-400' : 'bg-yellow-400/10 text-yellow-400'}`}>{d.status}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{d.issue}</p>
                <p className="text-xs text-white/40 mt-0.5">{d.buyer} → {d.seller} · {d.item}</p>
                <p className="text-xs text-white/20">{d.orderId} · {d.createdAt}</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg glass border border-white/10 text-xs text-white/60 hover:text-white transition-colors shrink-0">Review</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
