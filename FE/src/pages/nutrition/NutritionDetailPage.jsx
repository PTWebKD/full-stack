import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, ShoppingBag, Clock } from 'lucide-react';
import { api } from '../../services/api';

export default function NutritionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    api.get(`/api/nutrition/products/${id}`)
      .then(data => setItem(data))
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePreOrder = async () => {
    try {
      await api.post('/api/nutrition/orders', { product_id: id, quantity: 1, order_type: 'pre_order' });
      setOrdered(true);
    } catch { /* ignore */ }
  };

  if (loading) return <div className="py-32 text-center text-white/30">Đang tải...</div>;
  if (!item) return <div className="py-32 text-center text-white/30">Không tìm thấy sản phẩm</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Quay lại
      </button>

      <div className="glass rounded-3xl overflow-hidden border border-white/10">
        {item.images?.[0] && (
          <div className="h-64 overflow-hidden">
            <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6">
          <h1 className="text-2xl font-black text-white mb-1">{item.name}</h1>
          <p className="text-white/50 text-sm mb-4">{item.description}</p>

          {/* Macro */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Calo', value: item.calories, unit: 'kcal', color: '#f97316' },
              { label: 'Protein', value: item.protein_g, unit: 'g', color: '#00d4ff' },
              { label: 'Carb', value: item.carbs_g, unit: 'g', color: '#a855f7' },
              { label: 'Fat', value: item.fat_g, unit: 'g', color: '#fbbf24' },
            ].map(m => (
              <div key={m.label} className="glass rounded-xl p-3 border border-white/5 text-center">
                <p className="text-lg font-bold" style={{ color: m.color }}>{m.value}<span className="text-xs font-normal text-white/40">{m.unit}</span></p>
                <p className="text-xs text-white/40 mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-black text-white">{(item.price || 0).toLocaleString('vi-VN')}đ</span>
            {item.stock_quantity <= 5 && item.stock_quantity > 0 && (
              <span className="text-xs text-orange-400 glass px-2 py-1 rounded-lg border border-orange-400/20">Còn {item.stock_quantity} suất</span>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={handlePreOrder} disabled={!item.is_available || ordered}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm bg-[#00d4ff] text-black hover:bg-[#00d4ff]/90 disabled:opacity-40 transition-all">
              <Clock className="w-4 h-4" />
              {ordered ? 'Đã đặt trước!' : 'Đặt trước sau buổi tập'}
            </button>
            <button disabled={!item.is_available}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm glass border border-white/10 text-white hover:border-[#00d4ff]/40 disabled:opacity-40 transition-all">
              <ShoppingBag className="w-4 h-4" /> Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
