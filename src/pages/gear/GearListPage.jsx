import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, ShoppingCart, ShieldCheck, Store, Key, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockGear, gearCategories } from '../../data/mockGear';
import { useCart } from '../../context/CartContext';

export default function GearListPage() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [added, setAdded] = useState({});
  const { addGear } = useCart();

  const filtered = mockGear
    .filter(g => (category === 'All' || g.category === category) && g.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'price_asc' ? a.price - b.price : sortBy === 'price_desc' ? b.price - a.price : sortBy === 'rating' ? b.rating - a.rating : b.reviews - a.reviews);

  const handleAdd = (item) => {
    addGear(item);
    setAdded(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [item.id]: false })), 1200);
  };

  const fmt = (n) => n.toLocaleString('vi-VN');
  const discount = (item) => item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen">
      <div className="relative h-64 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1400&h=500&fit=crop" alt="Gear Hub" className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#152b3a]/88 via-[#0b2535]/62 to-transparent" />
        <div className="absolute inset-0 cinematic-grid opacity-30" />
        <div className="absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-[#f97316]/25 blur-3xl" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-[#f97316] uppercase tracking-widest mb-2">Gear Hub</p>
          <h1 className="text-4xl font-black text-white mb-1 glow-text-neon">Performance Equipment</h1>
          <p className="text-white/60 text-sm">Gym Owners are the main gear providers for sale and rental. Members can also list personal gear from their member account.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f97316]/30 bg-[#f97316]/10 px-3 py-1.5 text-xs font-semibold text-[#f97316]">
              <Store className="h-3.5 w-3.5" /> Gym Owner gear business
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7dd3fc]/30 bg-[#003a5a]/20 px-3 py-1.5 text-xs font-semibold text-[#7dd3fc]">
              <Key className="h-3.5 w-3.5" /> Members can rent
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70">
              <Users className="h-3.5 w-3.5" /> Member personal listings
            </span>
            <Link to="/gear/sell" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 glass px-3 py-1.5 text-xs font-semibold text-white/80 hover:text-white">
              List Gear
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6 glass rounded-2xl border border-white/10 p-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search equipment..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-white/10 text-sm text-white placeholder-white/20 focus-glow focus:border-[#f97316]/50"
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

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {gearCategories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all btn-cinematic ${category === cat ? 'bg-[#f97316] text-black shadow-[0_0_28px_rgba(249,115,22,0.24)]' : 'glass border border-white/10 text-white/60 hover:text-white'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item, i) => {
            const disc = discount(item);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.035, 0.22), ease: [0.22, 1, 0.36, 1] }}
                className="group glass rounded-2xl overflow-hidden border border-white/5 hover:border-[#f97316]/30 transition-all premium-card"
              >
                <Link to={`/gear/${item.id}`} className="block relative h-48 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 img-overlay" />
                  <div className="absolute top-2 left-2 flex gap-1">
                    {item.badge && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#f97316] text-white">{item.badge}</span>}
                    {disc > 0 && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">-{disc}%</span>}
                  </div>
                  {item.verified && (
                    <div className="absolute top-2 right-2">
                      <ShieldCheck className="w-4 h-4 text-[#7dd3fc]" />
                    </div>
                  )}
                  {item.stock <= 5 && item.stock > 0 && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs">Only {item.stock} left</span>
                  )}
                </Link>
                <div className="p-4">
                  <Link to={`/gear/${item.id}`}>
                    <h3 className="font-semibold text-white text-sm mb-0.5 hover:text-[#f97316] transition-colors line-clamp-2">{item.name}</h3>
                    <p className="text-xs text-white/40 mb-2">{item.seller}</p>
                  </Link>
                  <div className="flex items-center gap-1 text-xs text-white/30 mb-3">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{item.rating} ({item.reviews})
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">{fmt(item.price)}đ</p>
                      {item.originalPrice && <p className="text-xs text-white/30 line-through">{fmt(item.originalPrice)}đ</p>}
                    </div>
                    <button onClick={() => handleAdd(item)} disabled={item.stock === 0}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all btn-cinematic ${added[item.id] ? 'bg-[#003a5a]/20 text-[#7dd3fc] border border-[#003a5a]/30 glow-neon' : 'bg-[#f97316] text-white hover:bg-[#f97316]/90'} disabled:opacity-40`}>
                      <ShoppingCart className="w-3 h-3" />
                      {added[item.id] ? 'Added!' : item.stock === 0 ? 'OOS' : 'Add'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
