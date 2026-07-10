import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShieldCheck, ShoppingCart, Package, Key, History, Store, Users } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function GearDetailPage() {
  const { id } = useParams();
  const { addGear } = useCart();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState('desc');

  useEffect(() => {
    setLoading(true);
    api.get(`/api/gear/${id}`)
      .then(data => setItem(data))
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (item) {
      api.get('/api/gear')
        .then(data => {
          const all = data.items || data || [];
          setRelated(all.filter(g => g.gear_id !== item.gear_id && g.category === item.category).slice(0, 3));
        })
        .catch(() => {});
    }
  }, [item?.gear_id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-[#18181B]/40">
      <div className="py-16 text-center">Đang tải...</div>
    </div>
  );

  if (!item) return (
    <div className="min-h-screen flex items-center justify-center text-[#18181B]/60">
      <div className="text-center">
        <p className="text-2xl mb-4">404</p>
        <Link to="/gear" className="text-[#FF5722] hover:underline">Back to Gear Hub</Link>
      </div>
    </div>
  );

  const fmt = (n) => n.toLocaleString('vi-VN');
  const displayPrice = item.rent_price_day || item.sell_price || 0;

  const handleAdd = () => {
    // Gear items key on `gear_id`, not `id`, and expose `sell_price`/`rent_price_day`
    // instead of a generic `price` — map both, same as GearListPage, so the cart
    // doesn't treat every gear added from this page as the same undefined-id item.
    for (let i = 0; i < qty; i++) addGear({ ...item, id: item.gear_id, price: displayPrice });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/gear" className="inline-flex items-center gap-2 text-sm text-[#18181B]/60 hover:text-[#18181B] transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Gear Hub
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="rounded-2xl overflow-hidden h-72 md:h-auto relative">
          <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 flex gap-2">
            {item.badge && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#FF5722] text-[#18181B]">{item.badge}</span>}
          </div>
          {item.verified && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full glass-neon text-[#FF5722] text-xs">
              <ShieldCheck className="w-3 h-3" /> Verified
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <p className="text-xs text-[#18181B]/60">{item.seller}</p>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#FF5722]/25 bg-[#FF5722]/10 px-2 py-0.5 text-[11px] font-semibold text-[#FF5722]">
              <Store className="h-3 w-3" /> Gym Owner
            </span>
            {item.listing_type === 'sell' ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#7dd3fc]/25 bg-[#FF5722]/15 px-2 py-0.5 text-[11px] font-semibold text-[#FF5722]">
                Chỉ bán
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-orange-400/25 bg-orange-400/10 px-2 py-0.5 text-[11px] font-semibold text-orange-400">
                Cho thuê
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-[#18181B] mb-2">{item.name}</h1>

          <div className="flex items-center gap-4 text-sm mb-4">
            <span className="flex items-center gap-1 text-yellow-400"><Star className="w-4 h-4 fill-yellow-400" />{item.avg_rating} <span className="text-[#18181B]/40">({item.total_reviews})</span></span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${item.is_available ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
              {item.is_available ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className="flex gap-3 mb-6">
            {['desc', 'specs'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all capitalize ${tab === t ? 'bg-[#FF5722]/10 text-[#FF5722] border border-[#FF5722]/20' : 'text-[#18181B]/60 hover:text-[#18181B]'}`}>
                {t === 'desc' ? 'Description' : 'Specifications'}
              </button>
            ))}
          </div>

          {tab === 'desc' ? (
            <p className="text-sm text-[#18181B]/60 leading-relaxed mb-6">{item.description}</p>
          ) : (
            <div className="mb-6 space-y-2">
              {item.specs && Object.entries(item.specs).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-[#18181B]/60 capitalize">{k}</span>
                  <span className="text-[#18181B] font-medium">{String(v)}</span>
                </div>
              ))}
              {item.condition_rating && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#18181B]/60">Condition</span>
                  <span className="text-[#18181B] font-medium">{item.condition_rating}/5</span>
                </div>
              )}
            </div>
          )}

          {item.tags && (
            <div className="flex flex-wrap gap-2 mb-6">
              {item.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded-full glass border border-[#18181B]/10 text-xs text-[#18181B]/60">{tag}</span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mt-auto">
            <div>
              <p className="text-2xl font-black text-[#18181B]">{fmt(displayPrice)}đ</p>
              {item.listing_type === 'rent' && (
                <p className="text-sm text-[#18181B]/40">/ngày thuê</p>
              )}
            </div>
            {item.listing_type === 'sell' && (
              <>
                <div className="flex items-center gap-2 glass rounded-xl border border-[#18181B]/10 px-3 py-1.5">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-[#18181B]/60 hover:text-[#18181B] w-6 h-6 flex items-center justify-center">−</button>
                  <span className="text-[#18181B] font-semibold w-6 text-center">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="text-[#18181B]/60 hover:text-[#18181B] w-6 h-6 flex items-center justify-center">+</button>
                </div>
                <button onClick={handleAdd} disabled={!item.is_available}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${added ? 'bg-[#FF5722]/20 text-[#FF5722] border border-[#FF5722]/30' : 'bg-[#FF5722] text-white hover:bg-[#FF5722]/90'} disabled:opacity-40`}>
                  <ShoppingCart className="w-4 h-4" />
                  {!item.is_available ? 'Out of Stock' : added ? 'Added!' : 'Add to Cart'}
                </button>
              </>
            )}
          </div>

          {item.qrCode && (
            <div className="mt-4 p-3 rounded-xl glass border border-[#18181B]/10 flex items-center gap-3">
              <Package className="w-4 h-4 text-[#18181B]/60" />
              <div>
                <p className="text-xs text-[#18181B]/60">Product QR Code</p>
                <p className="text-xs font-mono text-[#18181B]/60">{item.qrCode}</p>
              </div>
            </div>
          )}

          <div className="mt-3 flex gap-2">
            {item.listing_type === 'rent' && (
              <Link to={'/gear/' + item.gear_id + '/rent'}
                className="flex-1 py-2.5 rounded-xl border border-[#FF5722]/40 bg-[#FF5722]/5 text-[#FF5722] text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#FF5722]/10 transition-colors">
                <Key className="w-4 h-4" /> Thuê gear này
              </Link>
            )}
            <Link to={`/gear/${item.gear_id}/lifecycle`}
              className="flex-1 py-2.5 rounded-xl border border-[#18181B]/10 glass text-[#18181B]/60 text-sm font-medium flex items-center justify-center gap-2 hover:text-[#18181B] hover:border-[#18181B]/20 transition-colors">
              <History className="w-4 h-4" /> Xem lịch sử
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-[#18181B] mb-4">More {item.category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map(r => (
              <Link key={r.gear_id} to={'/gear/' + r.gear_id} className="group glass rounded-xl overflow-hidden border border-[#18181B]/10 hover:border-[#18181B]/10 transition-all">
                <div className="relative h-32 overflow-hidden">
                  <img src={r.images?.[0]} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 img-overlay" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-[#18181B] mb-1 line-clamp-1">{r.name}</p>
                  <p className="text-xs text-[#FF5722]">{(r.rent_price_day || r.sell_price || 0).toLocaleString('vi-VN')}đ</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
