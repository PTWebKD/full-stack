import { useState } from 'react';
import { X, Zap, ShoppingCart, Sparkles } from 'lucide-react';
import { mockFood } from '../../data/mockFood';
import { useCart } from '../../context/CartContext';

// Logic: muscle group → macro priority → filter food
const muscleToMacro = {
  Chest: 'High Protein',
  Back: 'High Protein',
  Legs: 'Bulk',
  Shoulders: 'High Protein',
  Arms: 'High Protein',
  Core: 'Cut',
  'Full Body': 'High Protein',
  Cardio: 'Recovery',
};

export default function AiFoodSuggestion({ session, onClose }) {
  const { addFood } = useCart();
  const [added, setAdded] = useState({});

  if (!session) return null;

  // Detect dominant muscle group
  const muscles = session.exercises?.map(e => e.muscle || 'Full Body') || ['Full Body'];
  const dominant = muscles.sort((a, b) => muscles.filter(m => m === b).length - muscles.filter(m => m === a).length)[0];
  const targetMacro = muscleToMacro[dominant] || 'High Protein';

  const suggestions = mockFood
    .filter(f => f.category === targetMacro || f.tags?.includes(targetMacro) || f.category === 'Recovery')
    .slice(0, 3);

  const handleAdd = (item) => {
    addFood(item);
    setAdded(prev => ({ ...prev, [item.id]: true }));
  };

  const fmt = (n) => n.toLocaleString('vi-VN');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md glass-dark rounded-2xl overflow-hidden border border-[#003a5a]/20">
        <div className="bg-gradient-to-r from-[#003a5a]/10 to-transparent px-5 py-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#003a5a]/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#7dd3fc]" />
            </div>
            <div>
              <p className="text-xs text-[#7dd3fc] font-semibold">AI Gợi ý sau tập</p>
              <h3 className="font-bold text-white text-sm">Nạp năng lượng sau {session.name}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-3 flex items-center gap-2 bg-white/[0.02]">
          <Zap className="w-3 h-3 text-[#7dd3fc]" />
          <p className="text-xs text-white/50">Nhóm cơ chính: <span className="text-white font-medium">{dominant}</span> → Ưu tiên: <span className="text-[#00d4ff]">{targetMacro}</span></p>
        </div>

        <div className="p-4 space-y-3">
          {suggestions.map(item => (
            <div key={item.id} className="flex items-center gap-3 glass rounded-xl p-3 border border-white/5">
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
                  <span className="text-[#7dd3fc]">{item.protein}g P</span>
                  <span>{item.calories} kcal</span>
                  <span className="text-white/60">{fmt(item.price)}đ</span>
                </div>
              </div>
              <button onClick={() => handleAdd(item)} disabled={!item.inStock}
                className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${added[item.id] ? 'bg-[#003a5a]/20 text-[#7dd3fc]' : 'bg-[#00d4ff] text-black hover:bg-[#00d4ff]/90'} disabled:opacity-40`}>
                <ShoppingCart className="w-3 h-3" />
                {added[item.id] ? '✓' : 'Thêm'}
              </button>
            </div>
          ))}
        </div>

        <div className="px-5 pb-4 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl glass border border-white/10 text-white text-sm font-medium hover:bg-white/5">
            Bỏ qua
          </button>
          <a href="/cart" onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-[#003a5a] text-white text-sm font-bold text-center hover:bg-[#003a5a]/90 transition-colors">
            Xem giỏ hàng
          </a>
        </div>
      </div>
    </div>
  );
}
