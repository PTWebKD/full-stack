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
      <div className="relative z-10 w-full max-w-md glass-dark rounded-2xl overflow-hidden border border-[#003a5a]/20">
        <div className="bg-gradient-to-r from-[#003a5a]/10 to-transparent px-5 py-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#003a5a]/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#7dd3fc]" />
            </div>
            <div>
              <p className="text-xs text-[#7dd3fc] font-semibold">AI Gợi ý sau tập</p>
              <h3 className="font-bold text-white text-sm">Nạp năng lượng sau {displayName}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* XP / streak badge */}
        {(xpEarned > 0 || newStreak > 0) && (
          <div className="px-5 py-2 flex items-center gap-3 bg-white/[0.03] border-b border-white/5">
            {xpEarned > 0 && (
              <span className="text-xs font-bold text-[#f97316] bg-[#f97316]/10 px-2 py-0.5 rounded-full">+{xpEarned} XP</span>
            )}
            {newStreak > 0 && (
              <span className="text-xs font-bold text-[#7dd3fc] bg-[#003a5a]/20 px-2 py-0.5 rounded-full">🔥 {newStreak} ngày liên tiếp</span>
            )}
            {badgesEarned?.length > 0 && (
              <span className="text-xs text-white/50">{badgesEarned.join(', ')}</span>
            )}
          </div>
        )}

        <div className="px-5 py-3 flex items-center gap-2 bg-white/[0.02]">
          <Zap className="w-3 h-3 text-[#7dd3fc]" />
          <p className="text-xs text-white/50 truncate">
            {reason || (muscleGroup ? `Nhóm cơ: ${muscleGroup}` : 'Gợi ý dinh dưỡng sau tập')}
          </p>
        </div>

        <div className="p-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#7dd3fc]/30 border-t-[#7dd3fc] rounded-full animate-spin" />
            </div>
          ) : suggestions.length === 0 ? (
            <p className="text-center text-xs text-white/30 py-6">Không có gợi ý phù hợp</p>
          ) : (
            suggestions.map(item => (
              <div key={item.product_id} className="flex items-center gap-3 glass rounded-xl p-3 border border-white/5">
                <img src={item.images?.[0]} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                  <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
                    <span className="text-[#7dd3fc]">{item.protein_g}g P</span>
                    <span>{item.calories} kcal</span>
                    <span className="text-white/60">{fmt(item.price)}đ</span>
                  </div>
                </div>
                <button onClick={() => handleAdd(item)}
                  className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${added[item.product_id] ? 'bg-[#003a5a]/20 text-[#7dd3fc]' : 'bg-[#00d4ff] text-black hover:bg-[#00d4ff]/90'}`}>
                  <ShoppingCart className="w-3 h-3" />
                  {added[item.product_id] ? '✓' : 'Thêm'}
                </button>
              </div>
            ))
          )}
        </div>

        <div className="px-5 pb-4 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl glass border border-white/10 text-white text-sm font-medium hover:bg-white/5">
            Bỏ qua
          </button>
          <Link to="/cart" onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-[#003a5a] text-white text-sm font-bold text-center hover:bg-[#003a5a]/90 transition-colors">
            Xem giỏ hàng
          </Link>
        </div>
      </div>
    </div>
  );
}
