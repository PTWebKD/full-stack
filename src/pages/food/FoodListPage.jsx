import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, ShoppingCart, Zap, Clock, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockFood, foodCategories } from '../../data/mockFood';
import { useCart } from '../../context/CartContext';

export default function FoodListPage() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [added, setAdded] = useState({});
  const { addFood } = useCart();

  const filtered = mockFood
    .filter(f => (category === 'All' || f.category === category) && f.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'price_asc' ? a.price - b.price : sortBy === 'price_desc' ? b.price - a.price : sortBy === 'rating' ? b.rating - a.rating : b.reviews - a.reviews);

  const handleAdd = (item) => {
    addFood(item);
    setAdded(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [item.id]: false })), 1200);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-64 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1400&h=500&fit=crop" alt="Food Hub" className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#152b3a]/88 via-[#0b2535]/62 to-transparent" />
        <div className="absolute inset-0 cinematic-grid opacity-30" />
        <div className="absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-[#00d4ff]/20 blur-3xl" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-[#00d4ff] uppercase tracking-widest mb-2">Fuel Hub</p>
          <h1 className="text-4xl font-black text-white mb-1 glow-text-neon">Performance Nutrition</h1>
          <p className="text-white/50 text-sm">Macro-tracked meals from certified fitness chefs</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 glass rounded-2xl border border-white/10 p-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search meals..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-white/10 text-sm text-white placeholder-white/20 focus-glow focus:border-[#00d4ff]/50"
            />
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-xl glass border border-white/10 text-sm text-white bg-transparent focus:outline-none">
            <option value="popular" className="bg-[#0d1117]">Most Popular</option>
            <option value="rating" className="bg-[#0d1117]">Highest Rated</option>
            <option value="price_asc" className="bg-[#0d1117]">Price: Low to High</option>
            <option value="price_desc" className="bg-[#0d1117]">Price: High to Low</option>
          </select>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {foodCategories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all btn-cinematic ${category === cat ? 'bg-[#00d4ff] text-black shadow-[0_0_28px_rgba(0,212,255,0.22)]' : 'glass border border-white/10 text-white/60 hover:text-white'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: Math.min(i * 0.035, 0.22), ease: [0.22, 1, 0.36, 1] }}
              className="group glass rounded-2xl overflow-hidden border border-white/5 hover:border-[#00d4ff]/30 transition-all premium-card"
            >
              <Link to={`/food/${item.id}`} className="block relative h-44 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 img-overlay" />
                {item.badge && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold bg-[#003a5a] text-white">{item.badge}</span>
                )}
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-semibold">Out of Stock</span>
                  </div>
                )}
              </Link>
              <div className="p-4">
                <Link to={`/food/${item.id}`}>
                  <h3 className="font-semibold text-white text-sm mb-0.5 hover:text-[#00d4ff] transition-colors">{item.name}</h3>
                  <p className="text-xs text-white/40 mb-2">{item.vendor}</p>
                </Link>
                <div className="flex items-center gap-3 text-xs text-white/40 mb-3">
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-[#7dd3fc]" />{item.calories} kcal</span>
                  <span>{item.protein}g protein</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.prepTime}m</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-white">{item.price.toLocaleString('vi-VN')}đ</span>
                    <div className="flex items-center gap-1 text-xs text-white/30">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{item.rating} ({item.reviews})
                    </div>
                  </div>
                  <button onClick={() => handleAdd(item)} disabled={!item.inStock}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all btn-cinematic ${added[item.id] ? 'bg-[#003a5a]/20 text-[#7dd3fc] border border-[#003a5a]/30 glow-neon' : 'bg-[#00d4ff] text-black hover:bg-[#00d4ff]/90'} disabled:opacity-40`}>
                    <ShoppingCart className="w-3 h-3" />
                    {added[item.id] ? 'Added!' : 'Add'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/30">
            <Utensils className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No meals found</p>
          </div>
        )}
      </div>
    </div>
  );
}
