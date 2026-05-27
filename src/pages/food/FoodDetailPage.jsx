import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Zap, ShoppingCart, ChevronRight } from 'lucide-react';
import { getFoodById, mockFood } from '../../data/mockFood';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';

export default function FoodDetailPage() {
  const { id } = useParams();
  const item = getFoodById(id);
  const { addFood } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!item) return (
    <div className="min-h-screen flex items-center justify-center text-white/40">
      <div className="text-center">
        <p className="text-2xl mb-4">404</p>
        <Link to="/food" className="text-[#00d4ff] hover:underline">Back to Food Hub</Link>
      </div>
    </div>
  );

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addFood(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const related = mockFood.filter(f => f.id !== item.id && f.category === item.category).slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/food" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Food Hub
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="rounded-2xl overflow-hidden h-72 md:h-auto relative">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          {item.badge && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#003a5a] text-white text-xs font-bold">{item.badge}</span>
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-xs text-white/40 mb-1">{item.vendor}</p>
          <h1 className="text-2xl font-black text-white mb-2">{item.name}</h1>

          <div className="flex items-center gap-4 text-sm mb-4">
            <span className="flex items-center gap-1 text-yellow-400"><Star className="w-4 h-4 fill-yellow-400" />{item.rating} <span className="text-white/30">({item.reviews} reviews)</span></span>
            <span className="flex items-center gap-1 text-white/40"><Clock className="w-4 h-4" />{item.prepTime} min</span>
          </div>

          <p className="text-sm text-white/60 leading-relaxed mb-6">{item.description}</p>

          {/* Macros */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Calories', value: item.calories, unit: 'kcal', color: '#003a5a' },
              { label: 'Protein', value: item.protein, unit: 'g', color: '#00d4ff' },
              { label: 'Carbs', value: item.carbs, unit: 'g', color: '#f97316' },
              { label: 'Fat', value: item.fat, unit: 'g', color: '#a855f7' },
            ].map(m => (
              <div key={m.label} className="glass rounded-xl p-3 text-center border border-white/5">
                <p className="text-lg font-bold" style={{ color: m.color }}>{m.value}<span className="text-xs text-white/30">{m.unit}</span></p>
                <p className="text-xs text-white/40">{m.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {item.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-full glass border border-white/10 text-xs text-white/50">{tag}</span>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-auto">
            <p className="text-2xl font-black text-white">{item.price.toLocaleString('vi-VN')}đ</p>
            <div className="flex items-center gap-2 glass rounded-xl border border-white/10 px-3 py-1.5">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-white/50 hover:text-white w-6 h-6 flex items-center justify-center">−</button>
              <span className="text-white font-semibold w-6 text-center">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="text-white/50 hover:text-white w-6 h-6 flex items-center justify-center">+</button>
            </div>
            <button onClick={handleAdd} disabled={!item.inStock}
              className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${added ? 'bg-[#003a5a]/20 text-[#7dd3fc] border border-[#003a5a]/30' : 'bg-[#00d4ff] text-black hover:bg-[#00d4ff]/90'} disabled:opacity-40`}>
              <ShoppingCart className="w-4 h-4" />
              {!item.inStock ? 'Out of Stock' : added ? 'Added to Cart!' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4">More {item.category} Options</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map(r => (
              <Link key={r.id} to={`/food/${r.id}`} className="group glass rounded-xl overflow-hidden border border-white/5 hover:border-white/10 transition-all">
                <div className="relative h-32 overflow-hidden">
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 img-overlay" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-white mb-1">{r.name}</p>
                  <p className="text-xs text-[#00d4ff]">{r.price.toLocaleString('vi-VN')}đ</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
