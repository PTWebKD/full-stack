import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Star, Package, ArrowUp } from 'lucide-react';
import { api } from '../../services/api';

const statusColors = {
  preparing: 'text-orange-400 bg-orange-400/10',
  delivered: 'text-green-400 bg-green-400/10',
  confirmed: 'text-blue-400 bg-blue-400/10',
  pending: 'text-yellow-400 bg-yellow-400/10',
  delivering: 'text-purple-400 bg-purple-400/10',
  cancelled: 'text-red-400 bg-red-400/10',
};

export default function VendorDashboardPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const fmt = (n) => Number(n || 0).toLocaleString('vi-VN');

  useEffect(() => {
    Promise.all([
      api.get('/api/food/vendor/products').catch(() => []),
      api.get('/api/food/vendor/orders').catch(() => []),
    ]).then(([prods, ords]) => {
      setProducts(Array.isArray(prods) ? prods : []);
      setOrders(Array.isArray(ords) ? ords : []);
    }).finally(() => setLoading(false));
  }, []);

  const revenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((s, o) => s + Number(o.total_amount || 0), 0);
  const newOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
  const avgRating = products.length
    ? (products.reduce((s, p) => s + Number(p.avg_rating || 0), 0) / products.length).toFixed(1)
    : '—';

  const stats = [
    { label: 'Doanh thu giao hàng', value: revenue > 0 ? `${fmt(revenue)}đ` : '—', icon: TrendingUp, color: '#003a5a' },
    { label: 'Đơn chờ xử lý', value: newOrders, icon: ShoppingBag, color: '#00d4ff' },
    { label: 'Điểm đánh giá TB', value: avgRating, icon: Star, color: '#fbbf24' },
    { label: 'Sản phẩm', value: products.length, icon: Package, color: '#f97316' },
  ];

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
            <p className="text-xs text-[#7dd3fc] flex items-center gap-0.5 mt-1"><ArrowUp className="w-3 h-3" />Live</p>
          </div>
        ))}
      </div>

      {loading && <div className="py-4 text-center text-white/30">Đang tải...</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h3 className="font-semibold text-white">Recent Orders</h3>
          </div>
          <div className="divide-y divide-white/5">
            {orders.slice(0, 3).map(o => (
              <div key={o.order_id} className="flex items-center gap-4 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-white/50">#{o.order_id}</p>
                  <p className="text-sm text-white truncate">
                    {o.items?.[0]?.name}{o.items?.length > 1 ? ` +${o.items.length - 1}` : ''}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[o.status] || 'text-white/40 bg-white/5'}`}>{o.status}</span>
                <p className="text-sm font-bold text-white shrink-0">{fmt(Number(o.total_amount || 0))}đ</p>
              </div>
            ))}
            {orders.length === 0 && !loading && (
              <p className="px-5 py-6 text-sm text-white/30 text-center">Chưa có đơn hàng</p>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h3 className="font-semibold text-white">Top Products</h3>
          </div>
          <div className="divide-y divide-white/5">
            {products.slice(0, 4).map(p => (
              <div key={p.product_id} className="flex items-center gap-3 px-5 py-3">
                <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{p.name}</p>
                  <p className="text-xs text-white/40">{p.total_reviews} reviews · {p.avg_rating}★</p>
                </div>
                <p className="text-sm font-bold text-[#00d4ff]">{fmt(Number(p.price || 0))}đ</p>
              </div>
            ))}
            {products.length === 0 && !loading && (
              <p className="px-5 py-6 text-sm text-white/30 text-center">Chưa có sản phẩm</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
