import { mockFoodOrders, orderStatuses } from '../../data/mockOrders';

export default function VendorOrdersPage() {
  const fmt = (n) => n.toLocaleString('vi-VN');
  const orders = mockFoodOrders;

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <h2 className="text-lg font-bold text-white">Customer Orders ({orders.length})</h2>
      <div className="space-y-3">
        {orders.map(o => {
          const s = orderStatuses[o.status];
          return (
            <div key={o.id} className="glass rounded-2xl border border-white/5 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-mono text-white/50">{o.id}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${s?.bg} ${s?.color}`}>{s?.label}</span>
              </div>
              <div className="space-y-2 mb-3">
                {o.items.map(item => (
                  <div key={item.foodId} className="flex items-center gap-3 text-sm">
                    <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-cover" />
                    <span className="flex-1 text-white/70">{item.name} ×{item.qty}</span>
                    <span className="text-white">{fmt(item.price * item.qty)}đ</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm border-t border-white/5 pt-3">
                <span className="text-white/40">{o.deliveryAddress}</span>
                <span className="font-bold text-[#7dd3fc]">{fmt(o.total)}đ</span>
              </div>
              {o.status === 'preparing' && (
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2 rounded-xl bg-[#003a5a] text-white text-xs font-bold hover:bg-[#003a5a]/90 transition-colors">Mark as Ready</button>
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
