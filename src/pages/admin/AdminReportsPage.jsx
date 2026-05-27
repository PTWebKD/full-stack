import { mockRevenueChart, mockAdminStats } from '../../data/mockAdmin';
import { TrendingUp, Users, ShoppingBag, Package } from 'lucide-react';

const fmt = (n) => n.toLocaleString('vi-VN');

export default function AdminReportsPage() {
  const latest = mockRevenueChart[mockRevenueChart.length - 1];
  const prev = mockRevenueChart[mockRevenueChart.length - 2];
  const growth = (((latest.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-lg font-bold text-white">Platform Reports</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Revenue (May)', value: `${(latest.revenue / 1000000).toFixed(0)}M`, sub: `+${growth}% vs Apr`, icon: TrendingUp, color: '#003a5a' },
          { label: 'Total Users', value: latest.users.toLocaleString(), sub: 'registered members', icon: Users, color: '#00d4ff' },
          { label: 'Total Orders', value: latest.orders.toLocaleString(), sub: 'food + gear combined', icon: ShoppingBag, color: '#f97316' },
          { label: 'Active Vendors', value: mockAdminStats.totalVendors + mockAdminStats.totalSellers, sub: `${mockAdminStats.totalVendors} food · ${mockAdminStats.totalSellers} gear`, icon: Package, color: '#a855f7' },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-white/40">{s.label}</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15` }}>
                <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-xs text-white/30 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-5 border border-white/5">
        <h3 className="font-semibold text-white mb-4">6-Month Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-white/30 uppercase tracking-wider">
                <th className="text-left py-2 pr-4">Month</th>
                <th className="text-right py-2 pr-4">Revenue</th>
                <th className="text-right py-2 pr-4">Users</th>
                <th className="text-right py-2">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockRevenueChart.slice().reverse().map(row => (
                <tr key={row.month} className="text-white/70">
                  <td className="py-3 pr-4 font-medium text-white">{row.month}</td>
                  <td className="py-3 pr-4 text-right text-[#7dd3fc]">{(row.revenue / 1000000).toFixed(0)}M đ</td>
                  <td className="py-3 pr-4 text-right">{row.users.toLocaleString()}</td>
                  <td className="py-3 text-right">{row.orders.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
