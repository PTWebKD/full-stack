import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Package, CheckCircle, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';

const STATUS_MAP = {
  pending:   { label: 'Đang chờ',     color: 'text-yellow-400',  bg: 'bg-yellow-400/10 border-yellow-400/20' },
  preparing: { label: 'Đang chuẩn bị', color: 'text-blue-400',   bg: 'bg-blue-400/10 border-blue-400/20' },
  ready:     { label: 'Sẵn sàng',     color: 'text-green-400',   bg: 'bg-green-400/10 border-green-400/20' },
  completed: { label: 'Đã nhận',      color: 'text-[#18181B]/60',    bg: 'bg-white border-[#18181B]/10' },
  cancelled: { label: 'Đã hủy',       color: 'text-red-400',     bg: 'bg-red-400/10 border-red-400/20' },
};

export default function NutritionOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('active');

  useEffect(() => {
    api.get('/api/food/orders')
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const active = orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status));
  const history = orders.filter(o => ['completed', 'cancelled'].includes(o.status));
  const displayed = tab === 'active' ? active : history;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-5 h-5 text-[#FF5722]" />
        <h1 className="text-xl font-bold text-[#18181B]">Đơn đặt trước dinh dưỡng</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[['active', 'Đang xử lý'], ['history', 'Lịch sử']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${tab === key ? 'bg-[#FF5722] text-white shadow-sm' : 'glass border border-[#18181B]/10 text-[#18181B]/60 hover:text-[#18181B]'}`}>
            {label} {key === 'active' && active.length > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-black/20 text-xs">{active.length}</span>}
          </button>
        ))}
      </div>

      {loading && <div className="py-16 text-center text-[#18181B]/40">Đang tải...</div>}

      {!loading && displayed.length === 0 && (
        <div className="py-16 text-center text-[#18181B]/40">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>{tab === 'active' ? 'Không có đơn nào đang xử lý' : 'Chưa có lịch sử đặt hàng'}</p>
          <Link to="/nutrition" className="mt-4 inline-block text-[#FF5722] text-sm hover:underline">Xem sản phẩm dinh dưỡng</Link>
        </div>
      )}

      <div className="space-y-3">
        {displayed.map(order => {
          const st = STATUS_MAP[order.status] || STATUS_MAP.pending;
          return (
            <div key={order.order_id} className={`glass rounded-2xl p-4 border ${st.bg} transition-all`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-[#18181B] text-sm">{order.product_name}</p>
                  <p className="text-xs text-[#18181B]/60 mt-0.5">SL: {order.quantity} • {(order.total_price || 0).toLocaleString('vi-VN')}đ</p>
                  <p className="text-xs text-[#18181B]/40 mt-1">{new Date(order.created_at).toLocaleString('vi-VN')}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${st.bg} ${st.color}`}>{st.label}</span>
              </div>
              {order.status === 'ready' && (
                <div className="mt-3 flex items-center gap-2 p-2 rounded-xl bg-green-400/10 border border-green-400/20">
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  <p className="text-xs text-green-300">Sản phẩm đã sẵn sàng — vui lòng ra quầy nhận hàng!</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
