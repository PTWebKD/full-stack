import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, XCircle, RotateCcw } from 'lucide-react';
import { mockFoodOrders, mockGearOrders, orderStatuses } from '../../data/mockOrders';
import { useCart } from '../../context/CartContext';

const statusIcon = { delivered: CheckCircle, shipped: Truck, preparing: Clock, pending: Clock, cancelled: XCircle, confirmed: CheckCircle };

export default function OrdersPage() {
  const { addFood, addGear } = useCart();
  const [reordered, setReordered] = useState({});

  const allOrders = [
    ...mockFoodOrders.map(o => ({ ...o, orderType: 'food' })),
    ...mockGearOrders.map(o => ({ ...o, orderType: 'gear' })),
  ].sort((a, b) => new Date(b.orderedAt) - new Date(a.orderedAt));

  const fmt = (n) => n.toLocaleString('vi-VN');

  const handleReorder = (order) => {
    order.items.forEach(item => {
      for (let i = 0; i < item.qty; i++) {
        if (order.orderType === 'food') {
          addFood({ id: item.foodId || item.id, name: item.name, image: item.image, price: item.price });
        } else {
          addGear({ id: item.gearId || item.id, name: item.name, image: item.image, price: item.price });
        }
      }
    });
    setReordered(prev => ({ ...prev, [order.id]: true }));
    setTimeout(() => setReordered(prev => ({ ...prev, [order.id]: false })), 2000);
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <h2 className="text-lg font-bold text-white">My Orders</h2>

      <div className="space-y-3">
        {allOrders.map(order => {
          const s = orderStatuses[order.status];
          const Icon = statusIcon[order.status] || Clock;
          const canReorder = order.status === 'delivered' || order.status === 'cancelled';
          return (
            <div key={order.id} className="glass rounded-2xl border border-white/5 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-white/40" />
                  <span className="text-sm font-mono text-white/60">{order.id}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: order.orderType === 'food' ? 'rgba(0,212,255,0.1)' : 'rgba(249,115,22,0.1)', color: order.orderType === 'food' ? '#00d4ff' : '#f97316' }}>
                    {order.orderType}
                  </span>
                </div>
                <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${s?.bg} ${s?.color}`}>
                  <Icon className="w-3 h-3" />
                  {s?.label}
                </div>
              </div>
              <div className="px-5 py-3">
                <div className="space-y-2 mb-3">
                  {order.items.map(item => (
                    <div key={item.foodId || item.gearId} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      <p className="flex-1 text-sm text-white/70">{item.name} x{item.qty}</p>
                      <p className="text-sm font-medium text-white">{fmt(item.price * item.qty)}đ</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm border-t border-white/5 pt-3">
                  <span className="text-white/40">{new Date(order.orderedAt).toLocaleDateString('vi-VN')}</span>
                  <div className="flex items-center gap-3">
                    {order.trackingCode && (
                      <span className="text-xs text-white/30 font-mono">#{order.trackingCode}</span>
                    )}
                    <span className="font-bold text-white">{fmt(order.total)}đ</span>
                    {canReorder && (
                      <button onClick={() => handleReorder(order)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${reordered[order.id] ? 'bg-[#003a5a]/20 text-[#7dd3fc]' : 'bg-white/5 text-white/60 hover:bg-[#00d4ff]/10 hover:text-[#00d4ff] border border-white/10'}`}>
                        <RotateCcw className="w-3 h-3" />
                        {reordered[order.id] ? 'Đã thêm!' : 'Đặt lại'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {allOrders.length === 0 && (
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
