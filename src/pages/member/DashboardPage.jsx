import { Link } from 'react-router-dom';
import { Flame, Dumbbell, Zap, Award, TrendingUp, ArrowRight, Clock, Brain, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { mockWorkoutHistory, mockPersonalRecords, muscleGroups } from '../../data/mockGym';
import CinematicMapLayer from '../../components/common/CinematicMapLayer';

// Compute which muscle groups need training
const computeSmartSuggestion = () => {
  const lastTrained = {};
  mockWorkoutHistory.forEach(session => {
    session.exercises.forEach(ex => {
      if (!lastTrained[ex.muscle] || session.date > lastTrained[ex.muscle]) {
        lastTrained[ex.muscle] = session.date;
      }
    });
  });
  const today = '2025-05-22';
  const suggestions = muscleGroups
    .filter(m => m !== 'Cardio' && m !== 'Full Body')
    .map(m => ({
      muscle: m,
      lastDate: lastTrained[m] || '2025-01-01',
      daysAgo: Math.round((new Date(today) - new Date(lastTrained[m] || '2025-01-01')) / 86400000),
    }))
    .sort((a, b) => b.daysAgo - a.daysAgo);
  return suggestions.slice(0, 3);
};

const smartSuggestions = computeSmartSuggestion();
const muscleEmoji = { Chest: '💪', Back: '🏋️', Legs: '🦵', Shoulders: '🔝', Arms: '💪', Core: '🔥' };

const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const activityData = [1, 1, 0, 1, 1, 0, 1];

const quickActions = [
  {
    to: '/gym/new-session',
    label: 'Bắt đầu tập',
    eyebrow: 'Tiến trình tập luyện',
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

  if (!user) return null;

  const recentWorkouts = mockWorkoutHistory.slice(0, 3);

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
            <h2 className="text-3xl font-black text-white glow-text-neon">{user.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-white/60"><Flame className="w-3 h-3 text-orange-400" />{user.streak} ngày chuỗi</span>
              <span className="flex items-center gap-1 text-xs text-white/60"><Award className="w-3 h-3 text-[#7dd3fc]" />{user.level}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Tổng buổi tập', value: user.stats.workouts, icon: Dumbbell, color: '#003a5a' },
          { label: 'FitPoints', value: user.stats.prs, icon: Zap, color: '#00d4ff', suffix: ' PRs' },
          { label: 'Calo tiêu thụ', value: (user.stats.calories / 1000).toFixed(1) + 'K', icon: Flame, color: '#f97316' },
          { label: 'Người theo dõi', value: user.stats.followers, icon: TrendingUp, color: '#a855f7' },
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
            <Link to="/gym/history" className="text-xs text-[#7dd3fc] flex items-center gap-1 hover:opacity-80">Xem tất cả <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentWorkouts.map(w => (
              <Link key={w.id} to={`/gym/session/${w.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-white/5 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-[#003a5a]/10 flex items-center justify-center shrink-0">
                  <Dumbbell className="w-4 h-4 text-[#7dd3fc]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{w.name}</p>
                  <p className="text-xs text-white/40">{w.date} · {w.exercises.length} bài tập</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-white">{(w.volume / 1000).toFixed(1)}T</p>
                  <p className="text-xs text-white/30 flex items-center gap-0.5"><Clock className="w-3 h-3" />{w.duration}m</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Personal Records */}
        <div className="glass rounded-2xl border border-white/5 overflow-hidden premium-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h3 className="font-semibold text-white">Kỷ lục cá nhân</h3>
            <Link to="/gym/records" className="text-xs text-[#7dd3fc] flex items-center gap-1 hover:opacity-80">Xem tất cả <ArrowRight className="w-3 h-3" /></Link>
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
            <Link key={s.muscle} to="/gym/new-session"
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
    </div>
  );
}
