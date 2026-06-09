import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { api } from '../../services/api';

export default function VendorProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const fmt = (n) => Number(n || 0).toLocaleString('vi-VN');

  useEffect(() => {
    api.get('/api/food/vendor/products')
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleAvailability = async (id) => {
    try {
      const updated = await api.patch(`/api/food/products/${id}/availability`, {});
      setProducts(prev => prev.map(p => p.product_id === id ? updated : p));
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">My Products ({products.length})</h2>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#003a5a] text-white text-sm font-bold hover:bg-[#003a5a]/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {loading && <div className="py-8 text-center text-white/30">Đang tải...</div>}

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/5 text-xs text-white/30 font-medium uppercase tracking-wider">
          <span className="col-span-5">Product</span>
          <span className="col-span-2">Price</span>
          <span className="col-span-2">Macros</span>
          <span className="col-span-1">Rating</span>
          <span className="col-span-2">Actions</span>
        </div>
        <div className="divide-y divide-white/5">
          {products.map(p => (
            <div key={p.product_id} className="grid grid-cols-12 gap-4 px-5 py-4 items-center">
              <div className="col-span-5 flex items-center gap-3">
                <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{p.name}</p>
                  <p className="text-xs text-white/40">{p.category}</p>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-white">{fmt(p.price)}đ</p>
              </div>
              <div className="col-span-2 text-xs text-white/40">
                <p>{Number(p.protein_g || 0).toFixed(0)}g P</p>
                <p>{p.calories} kcal</p>
              </div>
              <div className="col-span-1 text-sm text-yellow-400">
                {p.avg_rating}★
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <button onClick={() => toggleAvailability(p.product_id)} className={`p-1.5 rounded-lg transition-colors ${p.is_available ? 'text-green-400 hover:bg-green-400/10' : 'text-white/20 hover:bg-white/5'}`}>
                  {p.is_available ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button className="p-1.5 rounded-lg text-white/40 hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 transition-colors">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
