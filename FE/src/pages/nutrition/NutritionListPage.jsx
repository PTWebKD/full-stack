import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Zap, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../../services/api';

const CATEGORIES = ['Tất cả', 'High Protein', 'Keto', 'Vegan', 'Bulk', 'Cut', 'Pre-Workout', 'Recovery'];

export default function NutritionListPage() {
  const [category, setCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/nutrition/products')
      .then(data => setItems(Array.isArray(data) ? data : data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

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
          <p className="text-xs font-semibold text-[#00d4ff] uppercase tracking-widest mb-1">Fuel Hub</p>
          <h1 className="text-3xl font-black text-white mb-1">Dinh dưỡng nội bộ</h1>
          <p className="text-white/50 text-sm">Sản phẩm dinh dưỡng do phòng tập cung cấp trực tiếp</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5 glass rounded-2xl border border-white/10 p-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm sản phẩm..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00d4ff]/50"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${category === cat ? 'bg-[#00d4ff] text-black' : 'glass border border-white/10 text-white/60 hover:text-white'}`}>
              {cat}
            </button>
          ))}
        </div>

        {loading && <div className="py-16 text-center text-white/30">Đang tải...</div>}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, i) => (
              <motion.div key={item.product_id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.04 }}
                className="group glass rounded-2xl overflow-hidden border border-white/5 hover:border-[#00d4ff]/30 transition-all">
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
                    <h3 className="font-semibold text-white text-sm mb-1 hover:text-[#00d4ff] transition-colors">{item.name}</h3>
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-white/40 mb-3">
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-[#7dd3fc]" />{item.calories} kcal</span>
                    <span>{item.protein_g}g protein</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{(item.price || 0).toLocaleString('vi-VN')}đ</span>
                    <Link to={`/nutrition/${item.product_id}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#00d4ff] text-black hover:bg-[#00d4ff]/90 transition-all">
                      <ShoppingCart className="w-3 h-3" /> Xem
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-white/30">
            <Utensils className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Không tìm thấy sản phẩm nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
