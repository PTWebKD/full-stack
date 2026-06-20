import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, MapPin } from 'lucide-react';
import { api } from '../../services/api';

const DELIVERY_STATUSES = {
  pending: { label: 'Chờ xác nhận', color: 'text-yellow-400' },
  preparing: { label: 'Đang chuẩn bị', color: 'text-orange-400' },
  shipped: { label: 'Đã giao shipper', color: 'text-blue-400' },
  delivering: { label: 'Đang giao', color: 'text-purple-400' },
  done: { label: 'Đã giao', color: 'text-green-400' },
  cancelled: { label: 'Đã hủy', color: 'text-red-400' }
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await api.get(`/api/food/orders/${id}`);
      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-16 text-center text-[#18181B]/40">Đang tải...</div>;
  if (!order) return <div className="py-16 text-center text-red-500">Không tìm thấy đơn hàng</div>;

  const fmt = (n) => n.toLocaleString('vi-VN');
  const status = DELIVERY_STATUSES[order.status] || { label: order.status, color: 'text-[#18181B]/60' };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <button
        onClick={() => navigate('/orders')}
        className="flex items-center gap-2 text-[#18181B]/60 hover:text-[#18181B] transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </button>

      <div className="glass rounded-2xl p-5 border border-[#18181B]/10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#18181B]/60 font-mono">#{order.order_id}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${status.color}`}>
            {status.label}
          </span>
        </div>

        <div className="border-t border-[#18181B]/10 pt-4 space-y-3">
          <h3 className="font-bold text-[#18181B]">Sản phẩm</h3>
          {(order.items || []).map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>{item.name} x{item.qty || 1}</span>
              <span className="font-medium">{fmt((item.price || 0) * (item.qty || 1))}đ</span>
            </div>
          ))}
        </div>

        {order.delivery_type === 'delivery' && (
          <div className="border-t border-[#18181B]/10 pt-4 space-y-3">
            <h3 className="font-bold text-[#18181B] flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Địa chỉ giao hàng
            </h3>
            {order.address ? (
              <div className="text-sm text-[#18181B]/70 space-y-1">
                <p>{order.address.full_name}</p>
                <p>{order.address.phone}</p>
                <p>{order.address.address_line}, {order.address.ward}, {order.address.district}, {order.address.city}</p>
              </div>
            ) : (
              <p className="text-sm text-[#18181B]/70">{order.delivery_address}</p>
            )}
          </div>
        )}

        {order.tracking_code && (
          <div className="border-t border-[#18181B]/10 pt-4 space-y-3">
            <h3 className="font-bold text-[#18181B] flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Theo dõi giao hàng
            </h3>
            <div className="text-sm space-y-1">
              <p className="text-[#18181B]/60">Nhà vận chuyển: <span className="font-bold">{order.shipping_provider || 'GHN'}</span></p>
              <p className="text-[#18181B]/60">Mã vận đơn: <span className="font-mono font-bold">{order.tracking_code}</span></p>
            </div>
          </div>
        )}

        <div className="border-t border-[#18181B]/10 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#18181B]/60">Tổng sản phẩm:</span>
            <span className="font-bold">{fmt(order.subtotal)}</span>
          </div>
          {order.shipping_fee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[#18181B]/60">Phí giao hàng:</span>
              <span className="font-bold">{fmt(order.shipping_fee)}</span>
            </div>
          )}
          {order.fitcoin_used > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[#18181B]/60">FitCoin dùng:</span>
              <span className="font-bold text-[#FF5722]">-{fmt(order.fitcoin_used)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-[#18181B]/10 pt-2">
            <span className="font-bold text-[#18181B]">Tổng cộng:</span>
            <span className="font-bold text-lg text-[#18181B]">{fmt(order.total_amount)}</span>
          </div>
        </div>

        <div className="text-xs text-[#18181B]/40 text-right border-t border-[#18181B]/10 pt-4">
          {new Date(order.created_at).toLocaleString('vi-VN')}
        </div>
      </div>
    </div>
  );
}
