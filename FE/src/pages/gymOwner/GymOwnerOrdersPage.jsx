import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { api } from '../../services/api';

const ORDER_STATUSES = {
  pending:    { label: 'Chờ xác nhận', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  confirmed:  { label: 'Đã xác nhận',  color: 'text-blue-400',   bg: 'bg-blue-400/10' },
  preparing:  { label: 'Đang chuẩn bị', color: 'text-orange-400', bg: 'bg-orange-400/10' },
  delivering: { label: 'Đang giao',    color: 'text-purple-400', bg: 'bg-purple-400/10' },
  shipped:    { label: 'Đang giao',    color: 'text-blue-400',   bg: 'bg-blue-400/10' },
  done:       { label: 'Đã giao',      color: 'text-green-400',  bg: 'bg-green-400/10' },
  cancelled:  { label: 'Đã hủy',       color: 'text-red-400',    bg: 'bg-red-400/10' },
};

const statusIcon = { done: CheckCircle, shipped: Truck, preparing: Clock, pending: Clock, cancelled: XCircle, confirmed: CheckCircle };

export default function GymOwnerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await api.get('/api/delivery/orders');
      setOrders(data.items || data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/api/delivery/orders/${orderId}`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const fmt = (n) => n.toLocaleString('vi-VN');

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (loading) return (
    <div className="py-16 text-center text-[#18181B]/40">Đang tải...</div>
  );

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <h2 className="text-lg font-bold text-[#18181B]">Quản lý đơn hàng giao</h2>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'pending', 'preparing', 'shipped', 'done', 'cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              filter === s
                ? 'bg-[#FF5722] text-white'
                : 'bg-[#18181B]/5 text-[#18181B]/70 hover:bg-[#18181B]/10'
            }`}
          >
            {s === 'all' ? 'Tất cả' : ORDER_STATUSES[s]?.label || s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-[#18181B]/40">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Không có đơn hàng</p>
          </div>
        ) : (
          filteredOrders.map(order => {
            const s = ORDER_STATUSES[order.status];
            const Icon = statusIcon[order.status] || Clock;
            return (
              <div key={order.order_id} className="glass rounded-2xl border border-[#18181B]/10 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#18181B]/10">
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-[#18181B]/60" />
                    <span className="text-sm font-mono text-[#18181B]/60">{order.order_id}</span>
                    {order.delivery_type === 'delivery' && (
                      <span className="text-xs flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FF5722]/10 text-[#FF5722]">
                        <Truck className="w-3 h-3" />
                        Giao hàng
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${s?.bg || 'bg-white'} ${s?.color || 'text-[#18181B]/60'}`}>
                      <Icon className="w-3 h-3" />
                      {s?.label || order.status}
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                      className="px-2 py-1 text-xs rounded-lg bg-[#18181B]/5 border border-[#18181B]/10 text-[#18181B] font-bold cursor-pointer hover:bg-[#18181B]/10"
                    >
                      <option value="pending">Chờ xác nhận</option>
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="preparing">Đang chuẩn bị</option>
                      <option value="shipped">Đã giao shipper</option>
                      <option value="done">Đã giao</option>
                      <option value="cancelled">Hủy</option>
                    </select>
                  </div>
                </div>

                <div className="px-5 py-3">
                  <div className="space-y-2 mb-3">
                    {(order.items || []).map((item, idx) => (
                      <div key={item.foodId || item.product_id || idx} className="flex items-center gap-3">
                        {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />}
                        <p className="flex-1 text-sm text-[#18181B]/80">{item.name} x{item.qty || 1}</p>
                        <p className="text-sm font-medium text-[#18181B]">{fmt((item.price || 0) * (item.qty || 1))}đ</p>
                      </div>
                    ))}
                  </div>

                  {order.delivery_type === 'delivery' && order.address && (
                    <div className="text-xs text-[#18181B]/60 mb-3 p-2 rounded-lg bg-[#18181B]/5">
                      <p className="font-bold">{order.address.full_name} • {order.address.phone}</p>
                      <p>{order.address.address_line}, {order.address.ward}, {order.address.district}, {order.address.city}</p>
                    </div>
                  )}

                  {order.tracking_code && (
                    <div className="text-xs text-[#18181B]/60 mb-3 p-2 rounded-lg bg-[#18181B]/5">
                      <p>Mã vận đơn: <span className="font-mono font-bold">{order.tracking_code}</span></p>
                      <p>Nhà vận chuyển: <span className="font-bold">{order.shipping_provider || 'GHN'}</span></p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm border-t border-[#18181B]/10 pt-3">
                    <span className="text-[#18181B]/60">{new Date(order.created_at).toLocaleDateString('vi-VN')}</span>
                    <div className="flex items-center gap-3">
                      {order.delivery_type === 'delivery' && order.shipping_fee > 0 && (
                        <span className="text-xs text-[#18181B]/60">Phí giao: {fmt(order.shipping_fee)}đ</span>
                      )}
                      <span className="font-bold text-[#18181B]">{fmt(order.total_amount || 0)}đ</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
