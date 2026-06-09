import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, XCircle, RotateCcw } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';

const ORDER_STATUSES = {
  pending:   { label: 'Chờ xác nhận', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  confirmed: { label: 'Đã xác nhận',  color: 'text-blue-400',   bg: 'bg-blue-400/10' },
  preparing: { label: 'Đang chuẩn bị', color: 'text-orange-400', bg: 'bg-orange-400/10' },
  delivering:{ label: 'Đang giao',    color: 'text-purple-400', bg: 'bg-purple-400/10' },
  shipped:   { label: 'Đang giao',    color: 'text-cyan-400',   bg: 'bg-cyan-400/10' },
  delivered: { label: 'Đã giao',      color: 'text-green-400',  bg: 'bg-green-400/10' },
  cancelled: { label: 'Đã hủy',       color: 'text-red-400',    bg: 'bg-red-400/10' },
};

const statusIcon = { delivered: CheckCircle, shipped: Truck, preparing: Clock, pending: Clock, cancelled: XCircle, confirmed: CheckCircle };

export default function OrdersPage() {
  const { addFood, addGear } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reordered, setReordered] = useState({});

  useEffect(() => {
    api.get('/api/food/orders')
      .then(data => setOrders(data.items || data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n) => n.toLocaleString('vi-VN');

  const handleReorder = (order) => {
    if (order.items) {
      order.items.forEach(item => {
        for (let i = 0; i < (item.qty || 1); i++) {
          addFood({ id: item.foodId || item.product_id || item.id, name: item.name, image: item.image, price: item.price });
        }
      });
    }
    setReordered(prev => ({ ...prev, [order.order_id]: true }));
    setTimeout(() => setReordered(prev => ({ ...prev, [order.order_id]: false })), 2000);
  };

  if (loading) return (
    <div className="py-16 text-center text-white/30">Đang tải...</div>
  );

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <h2 className="text-lg font-bold text-white">My Orders</h2>

      <div className="space-y-3">
        {orders.map(order => {
          const s = ORDER_STATUSES[order.status];
          const Icon = statusIcon[order.status] || Clock;
          const canReorder = order.status === 'delivered' || order.status === 'cancelled';
          return (
            <div key={order.order_id} className="glass rounded-2xl border border-white/5 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-white/40" />
                  <span className="text-sm font-mono text-white/60">{order.order_id}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}>
                    food
                  </span>
                </div>
                <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${s?.bg || 'bg-white/5'} ${s?.color || 'text-white/40'}`}>
                  <Icon className="w-3 h-3" />
                  {s?.label || order.status}
                </div>
              </div>
              <div className="px-5 py-3">
                <div className="space-y-2 mb-3">
                  {(order.items || []).map((item, idx) => (
                    <div key={item.foodId || item.product_id || idx} className="flex items-center gap-3">
                      {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />}
                      <p className="flex-1 text-sm text-white/70">{item.name} x{item.qty || 1}</p>
                      <p className="text-sm font-medium text-white">{fmt((item.price || 0) * (item.qty || 1))}đ</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm border-t border-white/5 pt-3">
                  <span className="text-white/40">{new Date(order.created_at).toLocaleDateString('vi-VN')}</span>
                  <div className="flex items-center gap-3">
                    {order.trackingCode && (
                      <span className="text-xs text-white/30 font-mono">#{order.trackingCode}</span>
                    )}
                    <span className="font-bold text-white">{fmt(order.total_amount || 0)}đ</span>
                    {canReorder && (
                      <button onClick={() => handleReorder(order)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${reordered[order.order_id] ? 'bg-[#003a5a]/20 text-[#7dd3fc]' : 'bg-white/5 text-white/60 hover:bg-[#00d4ff]/10 hover:text-[#00d4ff] border border-white/10'}`}>
                        <RotateCcw className="w-3 h-3" />
                        {reordered[order.order_id] ? 'Đã thêm!' : 'Đặt lại'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-16 text-white/30">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No orders yet</p>
          <div className="flex gap-3 justify-center mt-6">
            <Link to="/food" className="px-4 py-2 rounded-xl bg-[#00d4ff] text-black text-sm font-bold">Browse Food</Link>
            <Link to="/gear" className="px-4 py-2 rounded-xl bg-[#f97316] text-white text-sm font-bold">Browse Gear</Link>
          </div>
        </div>
      )}
    </div>
  );
}
