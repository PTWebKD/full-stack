import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, ShoppingBag, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function NutritionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordered, setOrdered] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg: string }

  useEffect(() => {
    api.get(`/api/food/products/${id}`)
      .then(data => setItem(data))
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [id]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handlePreOrder = async () => {
    if (!item || orderLoading) return;
    setOrderLoading(true);
    try {
      // Payload phải khớp đúng với backend OrderCreate schema
      await api.post('/api/food/orders', {
        items: [
          {
            product_id: item.product_id,
            qty: 1,
            price: item.price,
            name: item.name,
          }
        ],
        delivery_address: 'Tại phòng tập',   // địa chỉ mặc định cho đặt trước
        vendor_id: item.vendor_id,
        is_meal_prep: true,
        payment_method: 'cash',
      });
      setOrdered(true);
      showToast('success', 'Đặt trước thành công! Chúng tôi sẽ chuẩn bị sau buổi tập.');
    } catch (e) {
      const msg = e?.response?.data?.detail || e?.message || 'Đặt hàng thất bại, vui lòng thử lại.';
      showToast('error', msg);
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) return <div className="py-32 text-center text-[#18181B]/40">Đang tải...</div>;
  if (!item) return <div className="py-32 text-center text-[#18181B]/40">Không tìm thấy sản phẩm</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#18181B]/60 hover:text-[#18181B] text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Quay lại
      </button>

      <div className="glass rounded-3xl overflow-hidden border border-[#18181B]/10">
        {item.images?.[0] && (
          <div className="h-64 overflow-hidden">
            <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6">
          <h1 className="text-2xl font-black text-[#18181B] mb-1">{item.name}</h1>
          <p className="text-[#18181B]/60 text-sm mb-4">{item.description}</p>

          {/* Macro */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Calo', value: item.calories, unit: 'kcal', color: '#FF5722' },
              { label: 'Protein', value: item.protein_g, unit: 'g', color: '#3b82f6' },
              { label: 'Carb', value: item.carb_g, unit: 'g', color: '#a855f7' },
              { label: 'Fat', value: item.fat_g, unit: 'g', color: '#fbbf24' },
            ].map(m => (
              <div key={m.label} className="glass rounded-xl p-3 border border-[#18181B]/10 text-center">
                <p className="text-lg font-bold" style={{ color: m.color }}>{m.value}<span className="text-xs font-normal text-[#18181B]/60">{m.unit}</span></p>
                <p className="text-xs text-[#18181B]/60 mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-black text-[#18181B]">{(item.price || 0).toLocaleString('vi-VN')}đ</span>
            {item.stock_quantity <= 5 && item.stock_quantity > 0 && (
              <span className="text-xs text-orange-400 glass px-2 py-1 rounded-lg border border-orange-400/20">Còn {item.stock_quantity} suất</span>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={handlePreOrder} disabled={!item.is_available || ordered || orderLoading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm bg-[#FF5722] text-white hover:bg-[#FF5722]/90 disabled:opacity-40 transition-all shadow-md shadow-[#FF5722]/10">
              <Clock className="w-4 h-4" />
              {orderLoading ? 'Đang xử lý...' : ordered ? 'Đã đặt trước!' : 'Đặt trước sau buổi tập'}
            </button>
            <button disabled={!item.is_available}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm glass border border-[#18181B]/10 text-[#18181B] hover:border-[#FF5722]/40 disabled:opacity-40 transition-all">
              <ShoppingBag className="w-4 h-4" /> Mua ngay
            </button>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold transition-all
          ${toast.type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'}`}>
          {toast.type === 'success'
            ? <CheckCircle className="w-4 h-4 shrink-0" />
            : <AlertCircle className="w-4 h-4 shrink-0" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
