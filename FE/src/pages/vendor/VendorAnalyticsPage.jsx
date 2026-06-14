import { TrendingUp, Package, ShoppingCart, Star, ArrowUp, ArrowDown } from 'lucide-react';

const monthlyRevenue = [12400000, 15600000, 18200000, 14800000, 21000000, 24500000];
const monthLabels = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];

const topProducts = [
  { name: 'Whey Protein Isolate 2kg', sold: 142, revenue: 156200000, rating: 4.9, trend: 'up', change: 18 },
  { name: 'Creatine Monohydrate 300g', sold: 98, revenue: 39200000, rating: 4.7, trend: 'up', change: 12 },
  { name: 'BCAA 2:1:1 Powder 500g', sold: 76, revenue: 45600000, rating: 4.6, trend: 'down', change: -3 },
  { name: 'Pre-Workout Energy Blast', sold: 64, revenue: 44800000, rating: 4.8, trend: 'up', change: 22 },
];

const orderFunnel = [
  { label: 'Views', value: 3420, pct: 100 },
  { label: 'Cart adds', value: 684, pct: 20 },
  { label: 'Checkout', value: 342, pct: 10 },
  { label: 'Purchased', value: 287, pct: 8.4 },
  { label: 'Reviewed', value: 103, pct: 3 },
];

const fmt = (n) => n.toLocaleString('vi-VN');

function BarChart({ data, labels, color }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-2 h-28">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs text-white/30">{(v / 1000000).toFixed(1)}M</span>
          <div className="w-full rounded-t" style={{ height: `${(v / max) * 80}px`, background: i === data.length - 1 ? color : `${color}40` }} />
          <span className="text-xs text-white/30">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function VendorAnalyticsPage() {
  const totalRevenue = monthlyRevenue.reduce((a, b) => a + b, 0);
  const thisMonth = monthlyRevenue[monthlyRevenue.length - 1];
  const lastMonth = monthlyRevenue[monthlyRevenue.length - 2];
  const growth = (((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1);

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-[#00d4ff]" />
        <h2 className="text-lg font-bold text-white">Analytics</h2>
        <span className="text-xs text-white/30 ml-auto">Last 6 months</span>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Doanh thu tháng này', value: `${(thisMonth / 1000000).toFixed(1)}M`, sub: `+${growth}% vs tháng trước`, color: '#00d4ff', up: true },
          { label: 'Tổng đơn hàng', value: '380', sub: '+14% vs tháng trước', color: '#003a5a', up: true },
          { label: 'Sản phẩm active', value: '12', sub: '2 chờ duyệt', color: '#a855f7', up: null },
          { label: 'Rating TB', value: '4.8', sub: '320 đánh giá', color: '#fbbf24', up: true },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-4 border border-white/5">
            <p className="text-xs text-white/40 mb-2">{s.label}</p>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className={`text-xs mt-1 flex items-center gap-1 ${s.up === true ? 'text-[#7dd3fc]' : s.up === false ? 'text-red-400' : 'text-white/40'}`}>
              {s.up !== null && (s.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
              {s.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="glass rounded-2xl p-5 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white text-sm">Doanh thu 6 tháng</h3>
          <span className="text-sm font-bold text-[#00d4ff]">Tổng: {(totalRevenue / 1000000).toFixed(1)}M đ</span>
        </div>
        <BarChart data={monthlyRevenue} labels={monthLabels} color="#00d4ff" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top products */}
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
            <Package className="w-4 h-4 text-white/40" />
            <h3 className="font-semibold text-white text-sm">Top Products</h3>
          </div>
          <div className="divide-y divide-white/5">
            {topProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3 gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 truncate">{p.name}</p>
                  <div className="flex items-center gap-2 text-xs text-white/30 mt-0.5">
                    <span>{p.sold} sold</span>
                    <span className="flex items-center gap-0.5 text-yellow-400"><Star className="w-3 h-3 fill-yellow-400" />{p.rating}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-[#00d4ff]">{fmt(p.revenue)}đ</p>
                  <p className={`text-xs flex items-center gap-0.5 justify-end ${p.trend === 'up' ? 'text-[#7dd3fc]' : 'text-red-400'}`}>
                    {p.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {Math.abs(p.change)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion funnel */}
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-white/40" />
            <h3 className="font-semibold text-white text-sm">Conversion Funnel</h3>
          </div>
          <div className="px-5 py-4 space-y-3">
            {orderFunnel.map((step, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/70">{step.label}</span>
                  <span className="text-white font-semibold">{step.value.toLocaleString()} <span className="text-white/30">({step.pct}%)</span></span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-[#00d4ff] transition-all" style={{ width: `${step.pct}%`, opacity: 1 - i * 0.12 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
