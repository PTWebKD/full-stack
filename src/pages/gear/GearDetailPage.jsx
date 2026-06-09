import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShieldCheck, ShoppingCart, Package, Key, History, Store, Users } from 'lucide-react';
import { getGearById, mockGear } from '../../data/mockGear';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';

export default function GearDetailPage() {
  const { id } = useParams();
  const item = getGearById(id);
  const { addGear } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState('desc');

  if (!item) return (
    <div className="min-h-screen flex items-center justify-center text-white/40">
      <div className="text-center">
        <p className="text-2xl mb-4">404</p>
        <Link to="/gear" className="text-[#f97316] hover:underline">Back to Gear Hub</Link>
      </div>
    </div>
  );

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addGear(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const fmt = (n) => n.toLocaleString('vi-VN');
  const disc = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;
  const related = mockGear.filter(g => g.id !== item.id && g.category === item.category).slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/gear" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Gear Hub
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="rounded-2xl overflow-hidden h-72 md:h-auto relative">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 flex gap-2">
            {item.badge && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#f97316] text-white">{item.badge}</span>}
            {disc > 0 && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">-{disc}%</span>}
          </div>
          {item.verified && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full glass-neon text-[#7dd3fc] text-xs">
              <ShieldCheck className="w-3 h-3" /> Verified
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <p className="text-xs text-white/50">{item.seller}</p>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#f97316]/25 bg-[#f97316]/10 px-2 py-0.5 text-[11px] font-semibold text-[#f97316]">
              <Store className="h-3 w-3" /> Gym Owner listing
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#7dd3fc]/25 bg-[#003a5a]/15 px-2 py-0.5 text-[11px] font-semibold text-[#7dd3fc]">
              Bán & Cho thuê
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-white/60">
              <Users className="h-3 w-3" /> Member listing: chỉ cho thuê
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mb-2">{item.name}</h1>

          <div className="flex items-center gap-4 text-sm mb-4">
            <span className="flex items-center gap-1 text-yellow-400"><Star className="w-4 h-4 fill-yellow-400" />{item.rating} <span className="text-white/30">({item.reviews})</span></span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${item.stock > 5 ? 'bg-green-400/10 text-green-400' : item.stock > 0 ? 'bg-orange-400/10 text-orange-400' : 'bg-red-400/10 text-red-400'}`}>
              {item.stock > 5 ? 'In Stock' : item.stock > 0 ? `Only ${item.stock} left` : 'Out of Stock'}
            </span>
          </div>

          <div className="flex gap-3 mb-6">
            {['desc', 'specs'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all capitalize ${tab === t ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}>
                {t === 'desc' ? 'Description' : 'Specifications'}
              </button>
            ))}
          </div>

          {tab === 'desc' ? (
            <p className="text-sm text-white/60 leading-relaxed mb-6">{item.description}</p>
          ) : (
            <div className="mb-6 space-y-2">
              {Object.entries(item.specs).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-white/40 capitalize">{k}</span>
                  <span className="text-white font-medium">{String(v)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {item.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-full glass border border-white/10 text-xs text-white/50">{tag}</span>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-auto">
            <div>
              <p className="text-2xl font-black text-white">{fmt(item.price)}đ</p>
              {item.originalPrice && <p className="text-sm text-white/30 line-through">{fmt(item.originalPrice)}đ</p>}
            </div>
            <div className="flex items-center gap-2 glass rounded-xl border border-white/10 px-3 py-1.5">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-white/50 hover:text-white w-6 h-6 flex items-center justify-center">−</button>
              <span className="text-white font-semibold w-6 text-center">{qty}</span>
              <button onClick={() => setQty(q => Math.min(item.stock, q + 1))} className="text-white/50 hover:text-white w-6 h-6 flex items-center justify-center">+</button>
            </div>
            <button onClick={handleAdd} disabled={item.stock === 0}
              className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${added ? 'bg-[#003a5a]/20 text-[#7dd3fc] border border-[#003a5a]/30' : 'bg-[#f97316] text-white hover:bg-[#f97316]/90'} disabled:opacity-40`}>
              <ShoppingCart className="w-4 h-4" />
              {item.stock === 0 ? 'Out of Stock' : added ? 'Added!' : 'Add to Cart'}
            </button>
          </div>

          {item.qrCode && (
            <div className="mt-4 p-3 rounded-xl glass border border-white/5 flex items-center gap-3">
              <Package className="w-4 h-4 text-white/40" />
              <div>
                <p className="text-xs text-white/40">Product QR Code</p>
                <p className="text-xs font-mono text-white/60">{item.qrCode}</p>
              </div>
            </div>
          )}

          <div className="mt-3 flex gap-2">
            <Link to={`/gear/${item.id}/rent`}
              className="flex-1 py-2.5 rounded-xl border border-[#f97316]/40 bg-[#f97316]/5 text-[#f97316] text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#f97316]/10 transition-colors">
              <Key className="w-4 h-4" /> Member rent this gear
            </Link>
            <Link to={`/gear/${item.id}/lifecycle`}
              className="flex-1 py-2.5 rounded-xl border border-white/10 glass text-white/60 text-sm font-medium flex items-center justify-center gap-2 hover:text-white hover:border-white/20 transition-colors">
              <History className="w-4 h-4" /> Xem lịch sử
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4">More {item.category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map(r => (
              <Link key={r.id} to={`/gear/${r.id}`} className="group glass rounded-xl overflow-hidden border border-white/5 hover:border-white/10 transition-all">
                <div className="relative h-32 overflow-hidden">
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 img-overlay" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-white mb-1 line-clamp-1">{r.name}</p>
                  <p className="text-xs text-[#f97316]">{r.price.toLocaleString('vi-VN')}đ</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
