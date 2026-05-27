import { TrendingUp, ShoppingBag, Star, Package, ArrowUp } from 'lucide-react';
import { mockFood } from '../../data/mockFood';

const stats = [
  { label: 'Today Revenue', value: '4,850,000đ', change: '+12%', icon: TrendingUp, color: '#003a5a' },
  { label: 'New Orders', value: '24', change: '+5', icon: ShoppingBag, color: '#00d4ff' },
  { label: 'Avg Rating', value: '4.8', change: '+0.1', icon: Star, color: '#fbbf24' },
  { label: 'Active Products', value: '12', change: '0', icon: Package, color: '#f97316' },
];

const recentOrders = [
  { id: 'FO-2025-099', item: 'Power Protein Bowl x2', total: 178000, status: 'preparing', time: '11:45' },
  { id: 'FO-2025-098', item: 'Pre-Workout Fuel x3', total: 195000, status: 'delivered', time: '10:20' },
  { id: 'FO-2025-097', item: 'Keto Warrior Plate x1', total: 95000, status: 'confirmed', time: '09:55' },
];

const statusColors = { preparing: 'text-orange-400 bg-orange-400/10', delivered: 'text-green-400 bg-green-400/10', confirmed: 'text-blue-400 bg-blue-400/10' };

export default function VendorDashboardPage() {
  const myProducts = mockFood.slice(0, 4);
  const fmt = (n) => n.toLocaleString('vi-VN');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="glass rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-white/40">{s.label}</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15` }}>
                <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-xl font-black text-white">{s.value}</p>
            <p className="text-xs text-[#7dd3fc] flex items-center gap-0.5 mt-1"><ArrowUp className="w-3 h-3" />{s.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h3 className="font-semibold text-white">Recent Orders</h3>
          </div>
          <div className="divide-y divide-white/5">
            {recentOrders.map(o => (
              <div key={o.id} className="flex items-center gap-4 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-white/50">{o.id}</p>
                  <p className="text-sm text-white truncate">{o.item}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[o.status]}`}>{o.status}</span>
                <p className="text-sm font-bold text-white shrink-0">{fmt(o.total)}đ</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h3 className="font-semibold text-white">Top Products</h3>
          </div>
          <div className="divide-y divide-white/5">
            {myProducts.map(p => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{p.name}</p>
                  <p className="text-xs text-white/40">{p.reviews} reviews · {p.rating}★</p>
                </div>
                <p className="text-sm font-bold text-[#00d4ff]">{fmt(p.price)}đ</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
