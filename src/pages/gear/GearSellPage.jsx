import { useState } from 'react';
import { CheckCircle, Upload, Store, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const gearCats = ['Weights', 'Apparel', 'Supplements', 'Accessories', 'Cardio', 'Recovery'];

export default function GearSellPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', category: 'Weights', price: '', stock: '', description: '' });
  const [done, setDone] = useState(false);
  const isGymOwner = user?.role === 'gymOwner';

  const handleSubmit = async (e) => {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 800));
    setDone(true);
  };

  if (done) return (
    <div className="max-w-md mx-auto py-24 text-center">
      <CheckCircle className="w-16 h-16 text-[#7dd3fc] mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">Product Listed!</h3>
      <p className="text-white/40 text-sm">Your product is under review and will go live soon.</p>
    </div>
  );

  return (
    <div className="max-w-2xl space-y-5 mx-auto">
      <div className="glass rounded-2xl border border-[#f97316]/20 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f97316]/15 text-[#f97316]">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#f97316]">{isGymOwner ? 'Gym Owner Gear Business' : 'Member Community Listing'}</p>
            <h2 className="text-lg font-bold text-white">List gear for sale and rental</h2>
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60">
            <Store className="mr-1.5 inline h-3.5 w-3.5 text-[#f97316]" /> Gym Owners are the primary business providers for Gear Hub.
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60">
            <Key className="mr-1.5 inline h-3.5 w-3.5 text-[#7dd3fc]" /> Members can list personal gear as community listings inside their member account.
          </div>
        </div>
        {!isGymOwner && (
          <div className="mt-3 rounded-xl border border-[#7dd3fc]/20 bg-[#003a5a]/15 px-3 py-2 text-xs text-[#7dd3fc]">
            Note: You are listing personal gear from your Member account, not as a Gym Owner business.
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="glass rounded-2xl p-5 border border-white/5 space-y-4">
          <h3 className="font-semibold text-white text-sm">Product Info</h3>
          {[
            { key: 'name', label: 'Product Name', placeholder: 'e.g. Titan Barbell 20kg' },
            { key: 'description', label: 'Description', placeholder: 'Describe your product...', textarea: true },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs text-white/40 mb-1.5">{f.label}</label>
              {f.textarea ? (
                <textarea value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} rows={3}
                  className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#f97316]/50 text-sm resize-none" />
              ) : (
                <input type="text" value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} required
                  className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#f97316]/50 text-sm" />
              )}
            </div>
          ))}
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Category</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white bg-transparent focus:outline-none text-sm">
              {gearCats.map(c => <option key={c} value={c} className="bg-[#0d1117]">{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Price (VND)</label>
              <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                placeholder="500000" required
                className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#f97316]/50 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Stock Quantity</label>
              <input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))}
                placeholder="10" required
                className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#f97316]/50 text-sm" />
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-white/5">
          <h3 className="font-semibold text-white text-sm mb-3">Product Image</h3>
          <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-white/20 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <p className="text-sm text-white/40">Click to upload or drag & drop</p>
            <p className="text-xs text-white/20 mt-1">PNG, JPG up to 5MB</p>
          </div>
        </div>

        <button type="submit" disabled={!form.name || !form.price || !form.stock}
          className="w-full py-3.5 rounded-xl bg-[#f97316] text-white font-bold text-sm hover:bg-[#f97316]/90 transition-colors disabled:opacity-40">
          Submit for Review
        </button>
      </form>
    </div>
  );
}
