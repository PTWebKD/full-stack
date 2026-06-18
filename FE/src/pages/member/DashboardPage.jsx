import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Dumbbell, Zap, Award, TrendingUp, ArrowRight, Clock, Brain, ShoppingBag, ShieldCheck, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { mockPersonalRecords, muscleGroups } from '../../data/mockGym';
import CinematicMapLayer from '../../components/common/CinematicMapLayer';
import { api } from '../../services/api';

const muscleEmoji = { Chest: '💪', Back: '🏋️', Legs: '🦵', Shoulders: '🔝', Arms: '💪', Core: '🔥' };

const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const activityData = [1, 1, 0, 1, 1, 0, 1];

const quickActions = [
  {
    to: '/journey',
    label: 'Bắt đầu tập',
    eyebrow: 'Transformation Journey',
    icon: Dumbbell,
    color: '#003a5a',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=420&h=280&fit=crop',
  },
  {
    to: '/food',
    label: 'Đặt thức ăn',
    eyebrow: 'Thức ăn lành mạnh',
    icon: Zap,
    color: '#00d4ff',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=420&h=280&fit=crop',
  },
  {
    to: '/gear',
    label: 'Gear Hub',
    eyebrow: 'Gear chính hãng',
    icon: ShoppingBag,
    color: '#f97316',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=420&h=280&fit=crop',
  },
  {
    to: '/passport',
    label: 'Hộ Chiếu',
    eyebrow: 'Hộ chiếu thể hình',
    icon: Award,
    color: '#a855f7',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=420&h=280&fit=crop',
  },
  {
    to: '/social',
    label: 'Cộng Đồng',
    eyebrow: 'Bảng tin xã hội',
    icon: TrendingUp,
    color: '#ef4444',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=420&h=280&fit=crop',
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState(null);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [smartSuggestions, setSmartSuggestions] = useState([]);
  const [activeMembership, setActiveMembership] = useState(null);

  useEffect(() => {
    api.get('/api/users/me')
      .then(data => setUserStats(data))
      .catch(() => setUserStats(null));

    api.get('/api/gym/memberships/my')
      .then(data => {
        const list = data.items || data || [];
        const active = list.find(m => m.status === 'active') || list[0] || null;
        setActiveMembership(active);
      })
      .catch(() => setActiveMembership(null));

    api.get('/api/gym/sessions/my')
      .then(data => {
        const sessions = data.items || data || [];
        setRecentWorkouts(sessions.slice(0, 3));

        // Compute smart suggestions from session data
        const lastTrained = {};
        sessions.forEach(session => {
          if (session.exercises) {
            session.exercises.forEach(ex => {
              if (!lastTrained[ex.muscle] || session.date > lastTrained[ex.muscle]) {
                lastTrained[ex.muscle] = session.date;
              }
            });
          }
        });
        const today = new Date().toISOString().split('T')[0];
        const suggestions = (muscleGroups || [])
          .filter(m => m !== 'Cardio' && m !== 'Full Body')
          .map(m => ({
            muscle: m,
            lastDate: lastTrained[m] || '2025-01-01',
            daysAgo: Math.round((new Date(today) - new Date(lastTrained[m] || '2025-01-01')) / 86400000),
          }))
          .sort((a, b) => b.daysAgo - a.daysAgo);
        setSmartSuggestions(suggestions.slice(0, 3));
      })
      .catch(() => {
        setRecentWorkouts([]);
        setSmartSuggestions([]);
      });
  }, []);

  if (!user) return null;

  // Merge API user stats with auth user for display
  const displayUser = {
    name: userStats?.name || user.name,
    streak: userStats?.current_streak ?? user.streak ?? 0,
    level: user.level,
    stats: {
      workouts: userStats?.stats?.workouts ?? user.stats?.workouts ?? 0,
      prs: userStats?.stats?.prs ?? user.stats?.prs ?? 0,
      calories: userStats?.stats?.calories ?? user.stats?.calories ?? 0,
      followers: userStats?.stats?.followers ?? user.stats?.followers ?? 0,
    },
    fitcoin_balance: userStats?.fitcoin_balance ?? user.fitcoin_balance ?? 0,
    xp_total: userStats?.xp_total ?? user.xp_total ?? 0,
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-3xl overflow-hidden h-52 border border-white/10 shadow-2xl route-reflection"
      >
        <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=360&fit=crop" alt="" className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#152b3a]/86 via-[#0b2535]/56 to-transparent" />
        <div className="absolute inset-0 cinematic-grid opacity-30" />
        <CinematicMapLayer intensity="strong" />
        <div className="absolute right-10 top-6 h-28 w-28 rounded-full bg-[#003a5a]/20 blur-3xl" />
        <div className="absolute inset-0 flex items-center px-6">
          <div>
            <p className="text-xs text-[#7dd3fc] font-semibold uppercase tracking-wider mb-1">Chào mừng trở lại</p>
            <h2 className="text-3xl font-black text-white glow-text-neon">{displayUser.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-white/60"><Flame className="w-3 h-3 text-orange-400" />{displayUser.streak} ngày chuỗi</span>
              <span className="flex items-center gap-1 text-xs text-white/60"><Award className="w-3 h-3 text-[#7dd3fc]" />{displayUser.level}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Tổng buổi tập', value: displayUser.stats.workouts, icon: Dumbbell, color: '#003a5a' },
          { label: 'FitPoints', value: displayUser.stats.prs, icon: Zap, color: '#00d4ff', suffix: ' PRs' },
          { label: 'Calo tiêu thụ', value: (displayUser.stats.calories / 1000).toFixed(1) + 'K', icon: Flame, color: '#f97316' },
          { label: 'Người theo dõi', value: displayUser.stats.followers, icon: TrendingUp, color: '#a855f7' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.38, delay: i * 0.06 }}
            className="glass rounded-2xl p-4 border border-white/5 premium-card floating-card"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-white/40">{s.label}</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-[0_0_24px_rgba(0,58,90,0.08)]" style={{ background: `${s.color}15` }}>
                <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-2xl font-black text-white">{s.value}{s.suffix || ''}</p>
          </motion.div>
        ))}
      </div>

      {/* Membership Card */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.42 }}
        className="glass rounded-2xl p-5 border border-[#003a5a]/30 premium-card"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(0,58,90,0.2)', border: '1px solid rgba(0,58,90,0.4)' }}>
              <ShieldCheck className="w-5 h-5 text-[#7dd3fc]" />
            </div>
            <div>
              <p className="text-xs text-white/40 mb-0.5">Gói hội viên</p>
              {activeMembership ? (
                <p className="font-bold text-white text-sm">
                  {activeMembership.plan_name || 'Gói thành viên'}
                  <span className="ml-2 text-xs font-normal text-[#4ade80]">● Đang hoạt động</span>
                </p>
              ) : (
                <p className="font-bold text-white/50 text-sm">Chưa có gói</p>
              )}
            </div>
          </div>
          {activeMembership ? (
            <div className="text-right">
              <p className="text-xs text-white/40 flex items-center gap-1 justify-end"><Calendar className="w-3 h-3" />Hết hạn</p>
              <p className="text-sm font-bold text-[#7dd3fc]">{activeMembership.end_date}</p>
            </div>
          ) : (
            <Link to="/membership" className="px-4 py-2 rounded-xl bg-[#003a5a] text-white text-xs font-bold hover:bg-[#003a5a]/80 transition-colors">
              Đăng ký
            </Link>
          )}
        </div>
      </motion.div>

      {/* Weekly Activity */}
      <div className="glass rounded-2xl p-5 border border-white/5 premium-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Tuần này</h3>
          <span className="text-xs text-[#7dd3fc]">{activityData.filter(Boolean).length}/7 ngày</span>
        </div>
        <div className="flex gap-2">
          {weekDays.map((d, i) => (
            <div key={d} className="flex-1 flex flex-col items-center gap-1.5">
              <motion.div
                initial={{ scaleY: 0.35, opacity: 0.5 }}
                whileInView={{ scaleY: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                className={`w-full rounded-lg transition-all origin-bottom ${activityData[i] ? 'bg-[#003a5a] h-8 glow-neon' : 'bg-white/5 h-8'}`}
              />
              <span className="text-xs text-white/30">{d}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Workouts */}
        <div className="glass rounded-2xl border border-white/5 overflow-hidden premium-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h3 className="font-semibold text-white">Buổi tập gần đây</h3>
            <Link to="/journey/progress" className="text-xs text-[#7dd3fc] flex items-center gap-1 hover:opacity-80">Xem tất cả <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentWorkouts.map(w => (
              <Link key={w.session_id} to={'/gym/session/' + w.session_id} className="flex items-center gap-4 px-5 py-3 hover:bg-white/5 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-[#003a5a]/10 flex items-center justify-center shrink-0">
                  <Dumbbell className="w-4 h-4 text-[#7dd3fc]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{w.notes || w.name || 'Buổi tập'}</p>
                  <p className="text-xs text-white/40">{w.date} · {w.exercises ? w.exercises.length : 0} bài tập</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-white">{w.xp_earned ? w.xp_earned + ' XP' : '—'}</p>
                  <p className="text-xs text-white/30 flex items-center gap-0.5"><Clock className="w-3 h-3" />{w.duration || 0}m</p>
                </div>
              </Link>
            ))}
            {recentWorkouts.length === 0 && (
              <div className="px-5 py-6 text-center text-white/30 text-sm">Chưa có buổi tập</div>
            )}
          </div>
        </div>

        {/* Personal Records */}
        <div className="glass rounded-2xl border border-white/5 overflow-hidden premium-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h3 className="font-semibold text-white">Kỷ lục cá nhân</h3>
            <Link to="/journey/progress" className="text-xs text-[#7dd3fc] flex items-center gap-1 hover:opacity-80">Xem tất cả <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="divide-y divide-white/5">
            {mockPersonalRecords.map(pr => (
              <div key={pr.exerciseId} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-white">{pr.name}</p>
                  <p className="text-xs text-white/30">{pr.date}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-black text-[#7dd3fc]">{pr.pr}</span>
                  <span className="text-xs text-white/40">{pr.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {quickActions.map((a, i) => (
          <motion.div
            key={a.to}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.42, delay: i * 0.05 }}
            className="floating-card"
          >
          <Link to={a.to} className="group block overflow-hidden rounded-2xl border border-white/5 glass premium-card">
            <div className="relative h-24 overflow-hidden">
              <img src={a.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071f2f]/88 via-[#003a5a]/20 to-transparent" />
              <div className="absolute right-3 top-3 h-8 w-8 rounded-xl flex items-center justify-center backdrop-blur-xl" style={{ background: `${a.color}22`, border: `1px solid ${a.color}44` }}>
                <a.icon className="w-4 h-4" style={{ color: a.color }} />
              </div>
            </div>
            <div className="p-3 text-left">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: a.color }}>{a.eyebrow}</p>
              <p className="text-xs font-semibold text-white/80 group-hover:text-white transition-colors">{a.label}</p>
            </div>
          </Link>
          </motion.div>
        ))}
      </div>

      {/* Smart Suggestion */}
      {smartSuggestions.length > 0 && (
        <div className="glass rounded-2xl p-5 border border-[#00d4ff]/10 premium-card glow-neon">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-[#00d4ff]/10 flex items-center justify-center">
              <Brain className="w-4 h-4 text-[#00d4ff]" />
            </div>
            <div>
              <p className="text-xs text-[#00d4ff] font-semibold">AI Gợi ý thông minh</p>
              <p className="text-sm font-bold text-white">Nên tập gì tiếp theo?</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {smartSuggestions.map((s, i) => (
              <Link key={s.muscle} to="/journey"
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:border-white/20 ${i === 0 ? 'border-[#00d4ff]/30 bg-[#00d4ff]/5' : 'border-white/5 glass'}`}>
                <span className="text-xl">{muscleEmoji[s.muscle] || '💪'}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${i === 0 ? 'text-[#00d4ff]' : 'text-white/70'}`}>{s.muscle}</p>
                  <p className="text-xs text-white/30">{s.daysAgo === 0 ? 'Hôm nay' : `${s.daysAgo} ngày trước`}</p>
                </div>
                {i === 0 && <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#00d4ff]/15 text-[#00d4ff] font-semibold shrink-0">Nên tập</span>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
