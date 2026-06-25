import { useState, useEffect } from 'react';
import { Truck } from 'lucide-react';
import { api } from '../../services/api';

export default function ShippingFeeDisplay({ subtotal, onFeeCalculated }) {
  const [shippingFee, setShippingFee] = useState(0);
  const [isFreeship, setIsFreeship] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateFee();
  }, [subtotal]);

  const calculateFee = async () => {
    try {
      const data = await api.get(`/api/delivery/shipping-fee?subtotal=${subtotal}`);
      setShippingFee(data.shipping_fee);
      setIsFreeship(data.is_freeship);
      onFeeCalculated?.({ shipping_fee: data.shipping_fee, total: data.total });
    } catch (error) {
      console.error('Failed to calculate shipping fee:', error);
      setShippingFee(0);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) => n.toLocaleString('vi-VN');
  const THRESHOLD = 200000;
  const remaining = Math.max(0, THRESHOLD - subtotal);

  return (
    <div className="space-y-2 p-3 rounded-lg bg-[#18181B]/5 border border-[#18181B]/10">
      <div className="flex items-center gap-2 text-sm">
        <Truck className="w-4 h-4 text-[#FF5722]" />
        <span className="font-bold text-[#18181B]">Phí giao hàng</span>
      </div>

      {loading ? (
        <p className="text-xs text-[#18181B]/60">Đang tính...</p>
      ) : (
        <>
          {isFreeship ? (
            <p className="text-sm font-bold text-green-500">Miễn phí giao hàng!</p>
          ) : (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-[#18181B]/60">Phí:</span>
                <span className="font-bold">{fmt(shippingFee)}đ</span>
              </div>
              {remaining > 0 && (
                <p className="text-xs text-[#18181B]/60">
                  Thêm {fmt(remaining)}đ nữa để miễn phí giao hàng
                </p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
