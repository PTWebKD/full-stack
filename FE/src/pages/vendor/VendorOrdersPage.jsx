import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const ORDER_STATUSES = {
  pending:    { label: 'Chờ xác nhận', bg: 'bg-yellow-400/10', color: 'text-yellow-400' },
  confirmed:  { label: 'Đã xác nhận',  bg: 'bg-blue-400/10',   color: 'text-blue-400' },
  preparing:  { label: 'Đang chuẩn bị',bg: 'bg-orange-400/10', color: 'text-orange-400' },
  delivering: { label: 'Đang giao',    bg: 'bg-purple-400/10', color: 'text-purple-400' },
  delivered:  { label: 'Đã giao',      bg: 'bg-green-400/10',  color: 'text-green-400' },
  cancelled:  { label: 'Đã huỷ',       bg: 'bg-red-400/10',    color: 'text-red-400' },
};

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const fmt = (n) => Number(n || 0).toLocaleString('vi-VN');

  useEffect(() => {
    api.get('/api/food/vendor/orders')
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const updated = await api.put(`/api/food/orders/${orderId}/status?status=${newStatus}`, {});
      setOrders(prev => prev.map(o => o.order_id === orderId ? updated : o));
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <h2 className="text-lg font-bold text-white">Customer Orders ({orders.length})</h2>
      {loading && <div className="py-8 text-center text-white/30">Đang tải...</div>}
      <div className="space-y-3">
        {orders.map(o => {
          const s = ORDER_STATUSES[o.status];
          return (
            <div key={o.order_id} className="glass rounded-2xl border border-white/5 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-mono text-white/50">#{o.order_id}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${s?.bg} ${s?.color}`}>{s?.label || o.status}</span>
              </div>
              <div className="space-y-2 mb-3">
                {(o.items || []).map((item, idx) => (
                  <div key={item.product_id || idx} className="flex items-center gap-3 text-sm">
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0 text-white/20 text-xs">IMG</div>
                    <span className="flex-1 text-white/70">{item.name} ×{item.qty}</span>
                    <span className="text-white">{fmt(Number(item.price) * item.qty)}đ</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm border-t border-white/5 pt-3">
                <span className="text-white/40">{o.delivery_address}</span>
                <span className="font-bold text-[#7dd3fc]">{fmt(o.total_amount)}đ</span>
              </div>
              {o.status === 'preparing' && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => updateStatus(o.order_id, 'delivering')} className="flex-1 py-2 rounded-xl bg-[#003a5a] text-white text-xs font-bold hover:bg-[#003a5a]/90 transition-colors">Mark as Ready</button>
                  <button className="flex-1 py-2 rounded-xl glass border border-white/10 text-white text-xs font-medium hover:bg-white/5">Cancel</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
