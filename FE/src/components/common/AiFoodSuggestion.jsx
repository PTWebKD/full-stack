import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Zap, ShoppingCart, Sparkles, Brain, AlertTriangle, Check, Flame, BatteryLow, CreditCard } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const SEVERITY_STYLES = {
  success: { box: 'bg-emerald-500/10 border-emerald-500/20', icon: Check, iconColor: 'text-emerald-500', titleColor: 'text-emerald-600' },
  warning: { box: 'bg-amber-500/10 border-amber-500/20', icon: AlertTriangle, iconColor: 'text-amber-500', titleColor: 'text-amber-600' },
  danger: { box: 'bg-red-500/10 border-red-500/20', icon: Flame, iconColor: 'text-red-500', titleColor: 'text-red-600' },
  info: { box: 'bg-slate-500/10 border-slate-500/20', icon: BatteryLow, iconColor: 'text-slate-500', titleColor: 'text-slate-600' },
};

// Normalizes the two shapes used across session pages:
// NewSessionPage → { name, muscle, sets: [{reps, weight}] }
// JourneySessionPage → { exercise_name, muscle_group, sets: [{reps, weight}] }
function normalizeExercise(ex) {
  const name = ex.name || ex.exercise_name || '';
  const sets = ex.sets || [];
  const volume = sets.reduce((s, set) => s + (Number(set.reps) || 0) * (Number(set.weight) || 0), 0);
  return { name, sets, volume };
}

export default function AiFoodSuggestion({
  sessionId = null,
  sessionName = '',
  xpEarned = 0,
  newStreak = 0,
  badgesEarned = [],
  exercises = [],
  durationMin = null,
  onClose,
  // legacy prop — no longer used for data, kept for backward compat
  session,
}) {
  const { addFood } = useCart();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [added, setAdded] = useState({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [userPoints, setUserPoints] = useState(user?.points || 250);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [mode, setMode] = useState('best_seller');
  const [progress, setProgress] = useState(null);
  const [progressLoading, setProgressLoading] = useState(false);
  const [referralCode, setReferralCode] = useState(null);
  const [onboardingAllergies, setOnboardingAllergies] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(!user?.allergies || user?.allergies?.length === 0);

  // Resolve display name: prefer explicit sessionName prop, fall back to legacy session.name
  const displayName = sessionName || session?.name || '';

  // ── Tổng kết buổi tập (computed client-side from what was just logged) ──
  const normalizedExercises = useMemo(() => exercises.map(normalizeExercise), [exercises]);
  const totalSets = normalizedExercises.reduce((s, e) => s + e.sets.length, 0);
  const totalVolume = normalizedExercises.reduce((s, e) => s + e.volume, 0);
  // The "main lift" of the session — highest volume — is what the AI Progress panel analyzes.
  const mainExercise = normalizedExercises.reduce(
    (best, e) => (!best || e.volume > best.volume ? e : best), null
  );

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

  // AI gợi ý chung (RE-3 Progress/Plateau) cho bài tập chính vừa tập — cùng 1 popup với dinh dưỡng.
  useEffect(() => {
    if (!mainExercise?.name) return;
    setProgressLoading(true);
    api.get(`/api/gym/progress?exercise_name=${encodeURIComponent(mainExercise.name)}`)
      .then(data => setProgress(data))
      .catch(() => setProgress(null))
      .finally(() => setProgressLoading(false));
  }, [mainExercise?.name]);

  // Mã giới thiệu thật của Member (UC-11) — lấy khi mở thẻ chia sẻ thành tích.
  useEffect(() => {
    if (!showShareModal || referralCode) return;
    api.get('/api/users/me/referral')
      .then(data => setReferralCode(data.referral_code))
      .catch(() => {});
  }, [showShareModal, referralCode]);

  if (!sessionId && !session) return null;

  const handleAdd = (item) => {
    addFood({ ...item, id: item.product_id });
    setAdded(prev => ({ ...prev, [item.product_id]: true }));
  };


  const handleOrderNow = (item) => {
    addFood({ ...item, id: item.product_id });
    onClose();
    navigate('/checkout');
  };

  const fmt = (n) => n.toLocaleString('vi-VN');

  function getProductAllergens(name) {
    const lower = name.toLowerCase();
    const allergens = [];
    if (lower.includes('whey') || lower.includes('sữa') || lower.includes('yogurt') || lower.includes('cheese') || lower.includes('milk')) {
      allergens.push('lactose');
    }
    if (lower.includes('seafood') || lower.includes('tôm') || lower.includes('cua') || lower.includes('cá') || lower.includes('hàu') || lower.includes('salmon') || lower.includes('fish')) {
      allergens.push('seafood');
    }
    if (lower.includes('peanuts') || lower.includes('đậu phộng') || lower.includes('peanut')) {
      allergens.push('peanuts');
    }
    if (lower.includes('gluten') || lower.includes('bánh mì') || lower.includes('bread') || lower.includes('oat')) {
      allergens.push('gluten');
    }
    if (lower.includes('trứng') || lower.includes('egg')) {
      allergens.push('eggs');
    }
    return allergens;
  }

  const filteredSuggestions = useMemo(() => {
    if (!user?.allergies || user.allergies.includes('none')) return suggestions;
    return suggestions.filter(item => {
      const itemAllergens = getProductAllergens(item.name);
      const hasIntersection = itemAllergens.some(a => user.allergies.includes(a));
      return !hasIntersection;
    });
  }, [suggestions, user?.allergies]);

  const handleSaveMealPlan = () => {
    const newPlan = {
      date: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      reason: reason || 'Gợi ý dinh dưỡng sau tập',
      items: filteredSuggestions.map(s => ({ name: s.name, protein_g: s.protein_g, calories: s.calories })),
    };
    const existingPlans = user?.savedMealPlans || [];
    updateUser({ savedMealPlans: [newPlan, ...existingPlans] });
    alert('Đã lưu thực đơn dinh dưỡng này vào hồ sơ cá nhân thành công!');
  };

  const handleOnboardingSubmit = () => {
    const selected = onboardingAllergies.length > 0 ? onboardingAllergies : ['none'];
    updateUser({ allergies: selected });
    setShowOnboarding(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md glass rounded-2xl overflow-hidden border border-[#FF5722]/20">
        <div className="bg-gradient-to-r from-[#FF5722]/10 to-transparent px-5 py-4 flex items-center justify-between border-b border-[#18181B]/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF5722]/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#FF5722]" />
            </div>
            <div>
              <p className="text-xs text-[#FF5722] font-semibold">Tổng kết buổi tập & AI Gợi ý</p>
              <h3 className="font-bold text-[#18181B] text-sm">{displayName || 'Buổi tập'} đã hoàn tất</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-[#18181B]/40 hover:text-[#18181B] p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {showOnboarding ? (
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="text-center">
              <span className="text-3xl">⚠️</span>
              <h4 className="font-extrabold text-[#18181B] mt-2 text-sm">Xác nhận Dị ứng & Hạn chế ăn uống</h4>
              <p className="text-xs text-[#18181B]/60 mt-1 leading-relaxed">
                Theo quy trình nghiệp vụ hệ thống (BR-77), vui lòng khai báo các dị ứng của bạn để AI lọc bỏ các sản phẩm không an toàn.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-2">
              {[
                { id: 'lactose', label: 'Lactose (Sữa bò)' },
                { id: 'seafood', label: 'Hải sản' },
                { id: 'peanuts', label: 'Đậu phộng' },
                { id: 'gluten', label: 'Gluten' },
                { id: 'eggs', label: 'Trứng' },
              ].map(item => {
                const selected = onboardingAllergies.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (selected) {
                        setOnboardingAllergies(prev => prev.filter(a => a !== item.id));
                      } else {
                        setOnboardingAllergies(prev => [...prev, item.id]);
                      }
                    }}
                    className={`py-2 px-3 rounded-xl border text-center text-xs font-bold transition-all ${
                      selected
                        ? 'border-red-500 bg-red-500/10 text-red-550'
                        : 'border-[#18181B]/10 text-[#18181B]/60 hover:border-[#18181B]/20'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => {
                updateUser({ allergies: ['none'] });
                setShowOnboarding(false);
              }}
              className="w-full text-center text-xs text-[#FF5722] hover:underline pt-1 block font-semibold"
            >
              Tôi không dị ứng thành phần nào
            </button>

            <button
              onClick={handleOnboardingSubmit}
              className="w-full py-3 rounded-xl bg-[#FF5722] text-white text-xs font-bold hover:bg-[#FF5722]/90 transition-all mt-4"
            >
              Xác nhận & Xem gợi ý AI
            </button>
          </div>
        ) : (
          <>
            <div className="max-h-[70vh] overflow-y-auto">
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

            {/* ── Tổng kết buổi tập ── */}
            {normalizedExercises.length > 0 && (
              <div className="px-5 py-4 border-b border-[#18181B]/10">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#18181B]/40 mb-2.5">Tổng kết buổi tập</p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-base font-black text-[#18181B]">{normalizedExercises.length}</p>
                    <p className="text-[9px] text-[#18181B]/50 uppercase">Bài tập</p>
                  </div>
                  <div>
                    <p className="text-base font-black text-[#18181B]">{totalSets}</p>
                    <p className="text-[9px] text-[#18181B]/50 uppercase">Sets</p>
                  </div>
                  <div>
                    <p className="text-base font-black text-[#18181B]">{Math.round(totalVolume).toLocaleString('vi-VN')}</p>
                    <p className="text-[9px] text-[#18181B]/50 uppercase">Volume (kg)</p>
                  </div>
                  <div>
                    <p className="text-base font-black text-[#18181B]">{durationMin != null ? `${durationMin}p` : '—'}</p>
                    <p className="text-[9px] text-[#18181B]/50 uppercase">Thời lượng</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── AI Gợi ý chung (RE-3 Progress/Plateau) — bài tập chính vừa tập ── */}
            {mainExercise?.name && (
              <div className="px-5 py-4 border-b border-[#18181B]/10">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Brain className="w-3.5 h-3.5 text-[#FF5722]" />
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#18181B]/40">AI Tiến độ · {mainExercise.name}</p>
                </div>
                {progressLoading ? (
                  <div className="flex items-center gap-2 text-xs text-[#18181B]/40 py-2">
                    <div className="w-3.5 h-3.5 border-2 border-[#FF5722]/30 border-t-[#FF5722] rounded-full animate-spin" />
                    Đang phân tích...
                  </div>
                ) : progress?.diagnosis ? (
                  (() => {
                    const sev = SEVERITY_STYLES[progress.diagnosis.severity] || SEVERITY_STYLES.info;
                    const SevIcon = sev.icon;
                    return (
                      <div className={`flex items-start gap-2.5 border rounded-xl p-3 ${sev.box}`}>
                        <SevIcon className={`w-4 h-4 shrink-0 mt-0.5 ${sev.iconColor}`} />
                        <div>
                          <p className={`text-[10px] font-extrabold uppercase tracking-wider mb-0.5 ${sev.titleColor}`}>{progress.diagnosis.title}</p>
                          <p className="text-xs text-[#18181B]/70 leading-relaxed">{progress.diagnosis.detail}</p>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <p className="text-xs text-[#18181B]/40">Chưa đủ dữ liệu để AI phân tích tiến độ bài này.</p>
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
              ) : filteredSuggestions.length === 0 ? (
                <p className="text-center text-xs text-[#18181B]/40 py-6">Không có gợi ý phù hợp (hoặc sản phẩm bị ẩn do trùng thành phần dị ứng của bạn)</p>
              ) : (
                filteredSuggestions.map(item => (
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
                      <button onClick={() => handleOrderNow(item)}
                        className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-black bg-amber-500 hover:bg-amber-600 text-black transition-all cursor-pointer">
                        <CreditCard className="w-3 h-3" /> Đặt ngay
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {filteredSuggestions.length > 0 && (
              <div className="px-4 pb-4">
                <button
                  onClick={handleSaveMealPlan}
                  className="w-full py-2.5 rounded-xl border border-[#FF5722]/30 text-[#FF5722] hover:bg-[#FF5722]/10 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  💾 Lưu Thực Đơn Vào Hồ Sơ Cá Nhân
                </button>
              </div>
            )}

            <div className="px-5 py-2 border-t border-[#18181B]/10 bg-[#FF5722]/5">
              <button onClick={() => setShowShareModal(true)} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#18181B] hover:bg-black text-white text-xs font-black transition-all cursor-pointer">
                ✨ Tạo Thẻ Kỷ Lục & Streak Đẹp Mắt (+20 FitCoins)
              </button>
            </div>
            </div>

            <div className="px-5 pb-4 pt-2 flex gap-2">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl glass border border-[#18181B]/10 text-[#18181B] text-sm font-medium hover:bg-white">
                Bỏ qua
              </button>
              <Link to="/cart" onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-[#FF5722] text-white text-sm font-bold text-center hover:bg-[#FF5722]/90 transition-colors">
                Xem giỏ hàng
              </Link>
            </div>
          </>
        )}
      </div>
    </div>

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
                  <span className="text-white/40 font-medium">Mã giới thiệu nhận quà:</span>
                  <span className="font-mono text-[9px] text-[#FF5722] select-all">{referralCode || 'Đang tải...'}</span>
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
