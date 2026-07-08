import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Zap, ShoppingCart, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

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
  const { user } = useAuth();
  const [added, setAdded] = useState({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [userPoints, setUserPoints] = useState(user?.points || 250);
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(null);
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


  const handleBuyWithFitCoin = (item) => {
    const cost = Math.round(item.price / 1000);
    if (userPoints < cost) {
      alert(`Bạn không đủ FitCoins! Cần ${cost} FitCoins nhưng hiện tại bạn chỉ có ${userPoints} FitCoins. Hãy hoàn thành thêm nhiều buổi tập để tích lũy!`);
      return;
    }
    
    setUserPoints(prev => prev - cost);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setShowPurchaseSuccess(item);
  };

  const fmt = (n) => n.toLocaleString('vi-VN');

  return (
    <>
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
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button onClick={() => handleAdd(item)}
                    className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all ${added[item.product_id] ? 'bg-[#FF5722]/20 text-[#FF5722]' : 'bg-[#FF5722] text-white hover:bg-[#FF5722]/90'} cursor-pointer`}>
                    <ShoppingCart className="w-3 h-3" />
                    {added[item.product_id] ? 'Đã thêm' : 'Thêm giỏ'}
                  </button>
                  <button onClick={() => handleBuyWithFitCoin(item)}
                    className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-black bg-amber-500 hover:bg-amber-600 text-black transition-all cursor-pointer">
                    🪙 {Math.round(item.price / 1000)} FitCoins
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-5 py-2 border-t border-[#18181B]/10 bg-[#FF5722]/5">
          <button onClick={() => setShowShareModal(true)} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#18181B] hover:bg-black text-white text-xs font-black transition-all cursor-pointer">
            ✨ Tạo Thẻ Kỷ Lục & Streak Đẹp Mắt (+20 FitCoins)
          </button>
        </div>

        <div className="px-5 pb-4 pt-2 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl glass border border-[#18181B]/10 text-[#18181B] text-sm font-medium hover:bg-white">
            Bỏ qua
          </button>
          <Link to="/cart" onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-[#FF5722] text-white text-sm font-bold text-center hover:bg-[#FF5722]/90 transition-colors">
            Xem giỏ hàng
          </Link>
        </div>
      </div>
    </div>

      {/* ── FITCOIN PURCHASE SUCCESS MODAL ── */}
      {showPurchaseSuccess && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="glass rounded-3xl p-6 border border-[#FF5722]/30 text-center max-w-sm w-full bg-white text-[#18181B] shadow-2xl">
            <span className="text-4xl">🎉</span>
            <h4 className="font-black text-lg text-[#FF5722] mt-2 mb-1">Mua Hàng Thành Công!</h4>
            <p className="text-xs text-[#18181B]/60 mb-4">
              Đã trừ <b className="text-[#FF5722]">{Math.round(showPurchaseSuccess.price / 1000)} FitCoins</b>. Sản phẩm <b>{showPurchaseSuccess.name}</b> đã được đặt và sẽ chuẩn bị sẵn tại quầy bar thể hình cho bạn nhận sau buổi tập.
            </p>
            <div className="bg-[#FF5722]/5 p-3 rounded-2xl border border-[#FF5722]/10 mb-4 text-xs font-bold flex justify-between">
              <span>Số dư FitCoins còn lại:</span>
              <span className="text-amber-500">🪙 {userPoints} FitCoins</span>
            </div>
            <button onClick={() => setShowPurchaseSuccess(null)} className="w-full py-2.5 rounded-xl bg-[#18181B] text-white font-bold text-xs hover:bg-black cursor-pointer">
              Tuyệt vời
            </button>
          </div>
        </div>
      )}

      {/* ── SHARE ACHIEVEMENT CARD MODAL ── */}
      {showShareModal && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
          <div className="glass rounded-3xl p-6 border border-white/20 text-center max-w-md w-full bg-[#18181B] text-white shadow-2xl relative my-8">
            <button onClick={() => setShowShareModal(false)} className="absolute right-4 top-4 text-white/40 hover:text-white transition-all p-1">
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-black uppercase text-[#FF5722] tracking-widest block mb-1">FitFuel+ Athlete achievement</span>
            <h4 className="font-extrabold text-base uppercase text-white mb-4">Thẻ Thành Tựu Hội Viên</h4>

            {/* Achievement Card Wrapper (Notion style, but premium orange gradients) */}
            <div className="bg-gradient-to-br from-[#27272A] via-[#18181B] to-[#111] border border-white/10 rounded-2xl p-5 text-left relative overflow-hidden mb-5">
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#FF5722]/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-3 border-b border-white/10 pb-3.5 mb-3.5">
                <img src={user?.avatar || 'https://images.unsplash.com/photo-1546961342-ea5f62d1a22b?w=80&h=80&fit=crop'} alt="" className="w-11 h-11 rounded-full object-cover border" />
                <div>
                  <h5 className="font-black text-xs uppercase text-white leading-none">{user?.name || 'Hội viên FitFuel+'}</h5>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-wider inline-block mt-1">Level 4. Tinh Anh</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-white/80">
                <div className="flex justify-between">
                  <span className="text-white/40 font-medium">Buổi tập kết thúc:</span>
                  <span className="font-bold text-white">{sessionName || 'Workout Power Session'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 font-medium">Tích lũy buổi tập:</span>
                  <span className="font-bold text-[#FF5722]">🔥 {newStreak || 7} Ngày liên tiếp</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 font-medium">Điểm kinh nghiệm:</span>
                  <span className="font-bold text-emerald-400">+{xpEarned || 120} XP</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-2.5">
                  <span className="text-white/40 font-medium">Link giới thiệu nhận quà:</span>
                  <span className="font-mono text-[9px] text-[#FF5722] select-all">fitfuel.plus/join?ref=FIT_{user?.name?.toUpperCase() || 'MEMBER'}</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-white/40 mb-4 px-2 leading-relaxed">
              * Dữ liệu nhạy cảm (cân nặng, mỡ cơ thể) được ẩn đi để bạn tự tin đăng tải lên mạng xã hội.
            </p>

            <button onClick={() => {
              confetti({ particleCount: 60, spread: 50 });
              setUserPoints(prev => prev + 20);
              alert('Đăng bài thành công! Bạn nhận được thêm +20 FitCoins thưởng.');
              setShowShareModal(false);
            }} className="w-full py-3 rounded-xl bg-[#FF5722] text-white font-extrabold text-xs hover:opacity-95 transition-all shadow-md shadow-[#FF5722]/30 flex items-center justify-center gap-1.5 cursor-pointer">
              <span>Đăng Facebook / Instagram để nhận 20 FitCoins</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
