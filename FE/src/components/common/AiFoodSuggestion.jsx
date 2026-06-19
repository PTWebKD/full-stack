import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Zap, ShoppingCart, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';

export default function AiFoodSuggestion({
  sessionId = null,
  sessionName = '',
  xpEarned = 0,
  newStreak = 0,
  badgesEarned = [],
  onClose,
  // legacy prop — no longer used for data, kept for backward compat
  session,
}) {
  const { addFood } = useCart();
  const [added, setAdded] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [mode, setMode] = useState('best_seller');

  // Resolve display name: prefer explicit sessionName prop, fall back to legacy session.name
  const displayName = sessionName || session?.name || '';

  useEffect(() => {
    if (!sessionId) return;
    setLoading(true);
    api.post('/api/ai/food-recommendation', { session_id: sessionId })
      .then(data => {
        setSuggestions(data.recommendations || []);
        setReason(data.reason || '');
        setMuscleGroup(data.muscle_group || '');
        setMode(data.mode || 'best_seller');
      })
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (!sessionId && !session) return null;

  const handleAdd = (item) => {
    addFood({ ...item, id: item.product_id });
    setAdded(prev => ({ ...prev, [item.product_id]: true }));
  };

  const fmt = (n) => n.toLocaleString('vi-VN');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md glass rounded-2xl overflow-hidden border border-[#FF5722]/20">
        <div className="bg-gradient-to-r from-[#FF5722]/10 to-transparent px-5 py-4 flex items-center justify-between border-b border-[#18181B]/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF5722]/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#FF5722]" />
            </div>
            <div>
              <p className="text-xs text-[#FF5722] font-semibold">AI Gợi ý sau tập</p>
              <h3 className="font-bold text-[#18181B] text-sm">Nạp năng lượng sau {displayName}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-[#18181B]/40 hover:text-[#18181B] p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* XP / streak badge */}
        {(xpEarned > 0 || newStreak > 0) && (
          <div className="px-5 py-2 flex items-center gap-3 bg-white/[0.03] border-b border-[#18181B]/10">
            {xpEarned > 0 && (
              <span className="text-xs font-bold text-[#FF5722] bg-[#FF5722]/10 px-2 py-0.5 rounded-full">+{xpEarned} XP</span>
            )}
            {newStreak > 0 && (
              <span className="text-xs font-bold text-[#FF5722] bg-[#FF5722]/20 px-2 py-0.5 rounded-full">🔥 {newStreak} ngày liên tiếp</span>
            )}
            {badgesEarned?.length > 0 && (
              <span className="text-xs text-[#18181B]/60">{badgesEarned.join(', ')}</span>
            )}
          </div>
        )}

        <div className="px-5 py-3 flex items-center gap-2 bg-white/[0.02]">
          <Zap className="w-3 h-3 text-[#FF5722]" />
          <p className="text-xs text-[#18181B]/60 truncate">
            {reason || (muscleGroup ? `Nhóm cơ: ${muscleGroup}` : 'Gợi ý dinh dưỡng sau tập')}
          </p>
        </div>

        <div className="p-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#FF5722]/30 border-t-[#FF5722] rounded-full animate-spin" />
            </div>
          ) : suggestions.length === 0 ? (
            <p className="text-center text-xs text-[#18181B]/40 py-6">Không có gợi ý phù hợp</p>
          ) : (
            suggestions.map(item => (
              <div key={item.product_id} className="flex items-center gap-3 glass rounded-xl p-3 border border-[#18181B]/10">
                <img src={item.images?.[0]} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#18181B] truncate">{item.name}</p>
                  <div className="flex items-center gap-2 text-xs text-[#18181B]/60 mt-0.5">
                    <span className="text-[#FF5722]">{item.protein_g}g P</span>
                    <span>{item.calories} kcal</span>
                    <span className="text-[#18181B]/60">{fmt(item.price)}đ</span>
                  </div>
                </div>
                <button onClick={() => handleAdd(item)}
                  className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${added[item.product_id] ? 'bg-[#FF5722]/20 text-[#FF5722]' : 'bg-[#FF5722] text-white hover:bg-[#FF5722]/90'}`}>
                  <ShoppingCart className="w-3 h-3" />
                  {added[item.product_id] ? '✓' : 'Thêm'}
                </button>
              </div>
            ))
          )}
        </div>

        <div className="px-5 pb-4 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl glass border border-[#18181B]/10 text-[#18181B] text-sm font-medium hover:bg-white">
            Bỏ qua
          </button>
          <Link to="/cart" onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-[#FF5722] text-white text-sm font-bold text-center hover:bg-[#FF5722]/90 transition-colors">
            Xem giỏ hàng
          </Link>
        </div>
      </div>
    </div>
  );
}
