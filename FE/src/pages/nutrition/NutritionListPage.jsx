import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Zap, Utensils, CheckCircle, Brain, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = ['Tất cả', 'High Protein', 'Keto', 'Vegan', 'Bulk', 'Cut', 'Pre-Workout', 'Recovery'];

const MUSCLE_LABELS = {
  legs: 'chân', back: 'lưng', chest: 'ngực', shoulders: 'vai', arms: 'tay', core: 'bụng',
};

export default function NutritionListPage() {
  const { addFood } = useCart();
  const { user } = useAuth();
  const [category, setCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState(new Set()); // flash xanh tạm thời
  const [toast, setToast] = useState(null);
  const [reco, setReco] = useState(null);
  const [recoLoading, setRecoLoading] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  // Thêm vào giỏ hàng local (CartContext) — không gọi API
  const handleAdd = (item) => {
    addFood({
      id: item.product_id,
      name: item.name,
      price: parseFloat(item.price) || 0,
      vendor_id: item.vendor_id,
      image: item.images?.[0] || '',
    });
    // Flash trạng thái "Đã thêm" trong 1.5 giây
    setAddedIds(prev => {
      const next = new Set(prev);
      next.add(item.product_id);
      return next;
    });
    setTimeout(() => {
      setAddedIds(prev => {
        const next = new Set(prev);
        next.delete(item.product_id);
        return next;
      });
    }, 1500);
    showToast(`Đã thêm "${item.name}" vào giỏ!`);
  };


  useEffect(() => {
    api.get('/api/food/products')
      .then(data => setItems(Array.isArray(data) ? data : data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  // Gợi ý cá nhân hóa dựa trên TOÀN BỘ lịch sử tập luyện của Member — khác với popup
  // sau buổi tập (vốn chỉ dựa trên 1 session vừa hoàn thành).
  useEffect(() => {
    if (!user) return;
    setRecoLoading(true);
    api.get('/api/ai/food-recommendation/history')
      .then(data => setReco(data))
      .catch(() => setReco(null))
      .finally(() => setRecoLoading(false));
  }, [user]);

  const filtered = items.filter(f =>
    (category === 'Tất cả' || f.category === category) &&
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-56 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1400&h=400&fit=crop" alt="Dinh dưỡng" className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b2535]/90 via-[#152b3a]/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 max-w-5xl mx-auto">
          <p className="text-xs font-semibold text-[#FF5722] uppercase tracking-widest mb-1">Fuel Hub</p>
          <h1 className="text-3xl font-black text-white mb-1">Dinh dưỡng nội bộ</h1>
          <p className="text-white/80 text-sm">Sản phẩm dinh dưỡng do phòng tập cung cấp trực tiếp</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Gợi ý cá nhân hóa theo TOÀN BỘ lịch sử tập luyện của Member */}
        {user && recoLoading && (
          <div className="glass rounded-2xl border border-[#18181B]/10 p-5 mb-6 flex items-center gap-2 text-sm text-[#18181B]/60">
            <Brain className="w-4 h-4 text-[#FF5722] animate-pulse" /> AI đang phân tích lịch sử tập luyện của bạn...
          </div>
        )}
        {user && !recoLoading && reco && reco.mode !== 'best_seller' && reco.recommendations?.length > 0 && (
          <div className="glass rounded-2xl border border-[#FF5722]/20 overflow-hidden shadow-lg bg-white mb-6">
            <div className="px-5 py-4 border-b border-[#18181B]/10 flex items-center gap-2 bg-gradient-to-r from-orange-500/5 to-transparent">
              <Brain className="w-5 h-5 text-[#FF5722]" />
              <div>
                <h4 className="font-extrabold text-sm text-[#18181B]">Gợi ý dành cho bạn</h4>
                <p className="text-[10px] text-[#FF5722] font-black uppercase tracking-wider">
                  Dựa trên toàn bộ lịch sử tập luyện{reco.muscle_group ? ` — tập nhiều nhất: ${MUSCLE_LABELS[reco.muscle_group] || reco.muscle_group}` : ''}
                </p>
              </div>
            </div>
            <div className="p-5">
              <p className="text-xs text-[#18181B]/70 mb-4">{reco.reason}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {reco.recommendations.map(item => (
                  <div key={item.product_id} className="rounded-xl border border-[#18181B]/10 p-3 flex flex-col gap-2">
                    <Link to={`/nutrition/${item.product_id}`} className="block h-24 rounded-lg overflow-hidden bg-slate-100">
                      {item.images?.[0] && <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />}
                    </Link>
                    <p className="text-xs font-semibold text-[#18181B] line-clamp-1">{item.name}</p>
                    <p className="text-[10px] text-[#18181B]/50">{item.protein_g}g protein · {item.calories} kcal</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs font-bold text-[#18181B]">{(item.price || 0).toLocaleString('vi-VN')}đ</span>
                      <button
                        onClick={() => handleAdd(item)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-[#FF5722] text-white hover:bg-[#FF5722]/90 transition-all"
                      >
                        {addedIds.has(item.product_id) ? <CheckCircle className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                        {addedIds.has(item.product_id) ? 'Đã thêm' : 'Thêm'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5 glass rounded-2xl border border-[#18181B]/10 p-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#18181B]/40" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm sản phẩm..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-[#18181B]/10 text-sm text-[#18181B] placeholder-[#18181B]/40 focus:outline-none focus:border-[#FF5722]/50"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${category === cat ? 'bg-[#FF5722] text-white shadow-sm' : 'glass border border-[#18181B]/10 text-[#18181B]/60 hover:text-[#18181B]'}`}>
              {cat}
            </button>
          ))}
        </div>

        {loading && <div className="py-16 text-center text-[#18181B]/40">Đang tải...</div>}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, i) => (
              <motion.div key={item.product_id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.04 }}
                className="group glass rounded-2xl overflow-hidden border border-[#18181B]/10 hover:border-[#FF5722]/30 transition-all">
                <Link to={`/nutrition/${item.product_id}`} className="block relative h-40 overflow-hidden">
                  <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {!item.is_available && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-semibold">Hết hàng</span>
                    </div>
                  )}
                </Link>
                <div className="p-4">
                  <Link to={`/nutrition/${item.product_id}`}>
                    <h3 className="font-semibold text-[#18181B] text-sm mb-1 hover:text-[#FF5722] transition-colors">{item.name}</h3>
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-[#18181B]/60 mb-3">
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-[#FF5722]" />{item.calories} kcal</span>
                    <span>{item.protein_g}g protein</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#18181B]">{(item.price || 0).toLocaleString('vi-VN')}đ</span>
                    <button
                      onClick={() => handleAdd(item)}
                      disabled={!item.is_available}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-50
                        bg-[#FF5722] text-white hover:bg-[#FF5722]/90 shadow-sm shadow-[#FF5722]/20">
                      {addedIds.has(item.product_id)
                        ? <CheckCircle className="w-3 h-3" />
                        : <Plus className="w-3 h-3" />}
                      {addedIds.has(item.product_id) ? 'Đã thêm ✓' : 'Thêm'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-[#18181B]/40">
            <Utensils className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Không tìm thấy sản phẩm nào</p>
          </div>
        )}
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold bg-green-500 text-white">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {toast}
        </div>
      )}
    </div>
  );
}
