import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Dumbbell, Zap, Award, TrendingUp, ArrowRight, Clock, Brain, ShoppingBag, ShieldCheck, Calendar, Megaphone } from 'lucide-react';
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
    color: '#FF5722',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=420&h=280&fit=crop',
  },
  {
    to: '/nutrition',
    label: 'Đặt thức ăn',
    eyebrow: 'Thức ăn lành mạnh',
    icon: Zap,
    color: '#FF5722',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=420&h=280&fit=crop',
  },
  {
    to: '/gear',
    label: 'Gear Hub',
    eyebrow: 'Gear chính hãng',
    icon: ShoppingBag,
    color: '#FF5722',
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
  const [announcements, setAnnouncements] = useState([]);

  const defaultAnnouncements = [
    {
      announcement_id: 'mock-1',
      title: 'Bảo trì định kỳ khu vực Cardio',
      body: 'Các máy chạy bộ số 3 và số 5 sẽ được bảo trì vào sáng Thứ Hai từ 8:00 đến 11:00. Rất mong quý hội viên thông cảm.',
      priority: 'high',
      created_at: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString(),
    },
    {
      announcement_id: 'mock-2',
      title: 'Thử thách Plank Challenge tuần mới',
      body: 'Hội viên hoàn thành thử thách Plank 5 phút sẽ nhận được 50 FitCoin thưởng. Đăng ký tham gia trực tiếp với huấn luyện viên.',
      priority: 'medium',
      created_at: new Date(Date.now() - 24 * 3600 * 1000 * 4).toISOString(),
    },
    {
      announcement_id: 'mock-3',
      title: 'Khảo sát ý kiến mở lớp Yoga tối',
      body: 'Phòng gym đang lên kế hoạch mở thêm lớp Yoga Vinyasa vào tối Thứ 5 hàng tuần. Vui lòng cho ý kiến phản hồi tại quầy lễ tân.',
      priority: 'low',
      created_at: new Date(Date.now() - 24 * 3600 * 1000 * 6).toISOString(),
    }
  ];

  useEffect(() => {
    api.get('/api/users/me')
      .then(data => setUserStats(data))
      .catch(() => setUserStats(null));

    api.get('/api/gym/announcements')
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setAnnouncements(list.length > 0 ? list : defaultAnnouncements);
      })
      .catch(() => setAnnouncements(defaultAnnouncements));

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
        className="relative rounded-3xl overflow-hidden h-52 border border-[#18181B]/10 shadow-2xl route-reflection"
      >
        <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=360&fit=crop" alt="" className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />
        <div className="absolute right-10 top-6 h-28 w-28 rounded-full bg-[#FF5722]/30 blur-3xl" />
        <div className="absolute inset-0 flex items-center px-6">
          <div>
            <p className="text-xs text-[#FF5722] font-semibold uppercase tracking-wider mb-1">Chào mừng trở lại</p>
            <h2 className="text-3xl font-black text-[#18181B] ">{displayUser.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-[#18181B]/60"><Flame className="w-3 h-3 text-orange-400" />{displayUser.streak} ngày chuỗi</span>
              <span className="flex items-center gap-1 text-xs text-[#18181B]/60"><Award className="w-3 h-3 text-[#FF5722]" />{displayUser.level}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Tổng buổi tập', value: displayUser.stats.workouts, icon: Dumbbell, color: '#FF5722' },
          { label: 'FitPoints', value: displayUser.stats.prs, icon: Zap, color: '#3b82f6', suffix: ' PRs' },
          { label: 'Calo tiêu thụ', value: (displayUser.stats.calories / 1000).toFixed(1) + 'K', icon: Flame, color: '#FF5722' },
          { label: 'Người theo dõi', value: displayUser.stats.followers, icon: TrendingUp, color: '#a855f7' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.38, delay: i * 0.06 }}
            className="glass rounded-2xl p-4 border border-[#18181B]/10 premium-card floating-card"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-[#18181B]/60">{s.label}</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-[0_0_24px_rgba(0,58,90,0.08)]" style={{ background: `${s.color}15` }}>
                <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-2xl font-black text-[#18181B]">{s.value}{s.suffix || ''}</p>
          </motion.div>
        ))}
      </div>

      {/* Membership Card */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.42 }}
        className="glass rounded-2xl p-5 border border-[#FF5722]/30 premium-card"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,87,34,0.1)', border: '1px solid rgba(255,87,34,0.2)' }}>
              <ShieldCheck className="w-5 h-5 text-[#FF5722]" />
            </div>
            <div>
              <p className="text-xs text-[#18181B]/60 mb-0.5">Gói hội viên</p>
              {activeMembership ? (
                <p className="font-bold text-[#18181B] text-sm">
                  {activeMembership.plan_name || 'Gói thành viên'}
                  <span className="ml-2 text-xs font-normal text-[#4ade80]">● Đang hoạt động</span>
                </p>
              ) : (
                <p className="font-bold text-[#18181B]/60 text-sm">Chưa có gói</p>
              )}
            </div>
          </div>
          {activeMembership ? (
            <div className="text-right">
              <p className="text-xs text-[#18181B]/60 flex items-center gap-1 justify-end"><Calendar className="w-3 h-3" />Hết hạn</p>
              <p className="text-sm font-bold text-[#FF5722]">{activeMembership.end_date}</p>
            </div>
          ) : (
            <Link to="/membership" className="px-4 py-2 rounded-xl bg-[#FF5722] text-white text-xs font-bold hover:bg-[#FF5722]/80 transition-colors">
              Đăng ký
            </Link>
          )}
        </div>
      </motion.div>

      {/* Weekly Activity */}
      <div className="glass rounded-2xl p-5 border border-[#18181B]/10 premium-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#18181B]">Tuần này</h3>
          <span className="text-xs text-[#FF5722]">{activityData.filter(Boolean).length}/7 ngày</span>
        </div>
        <div className="flex gap-2">
          {weekDays.map((d, i) => (
            <div key={d} className="flex-1 flex flex-col items-center gap-1.5">
              <motion.div
                initial={{ scaleY: 0.35, opacity: 0.5 }}
                whileInView={{ scaleY: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                className={`w-full rounded-lg transition-all origin-bottom ${activityData[i] ? 'bg-[#FF5722] h-8 shadow-md' : 'bg-white h-8'}`}
              />
              <span className="text-xs text-[#18181B]/40">{d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Announcements */}
      <div className="glass rounded-2xl border border-[#18181B]/10 overflow-hidden premium-card">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[#18181B]/10">
          <Megaphone className="w-4 h-4 text-[#FF5722]" />
          <h3 className="font-semibold text-[#18181B]">Thông báo từ phòng tập</h3>
        </div>
        <div className="divide-y divide-[#18181B]/6">
          {announcements.slice(0, 3).map(a => (
            <div key={a.announcement_id} className="flex items-start gap-4 px-5 py-4">
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.priority === 'high' ? 'bg-red-400' : a.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#18181B]">{a.title}</p>
                <p className="text-xs text-[#18181B]/60 mt-0.5 leading-relaxed">{a.body}</p>
                <p className="text-xs text-[#18181B]/40 mt-1">{new Date(a.created_at).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          ))}
          {announcements.length === 0 && (
            <p className="px-5 py-6 text-sm text-[#18181B]/40 text-center">Không có thông báo mới</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Workouts */}
        <div className="glass rounded-2xl border border-[#18181B]/10 overflow-hidden premium-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#18181B]/10">
            <h3 className="font-semibold text-[#18181B]">Buổi tập gần đây</h3>
            <Link to="/journey/progress" className="text-xs text-[#FF5722] flex items-center gap-1 hover:opacity-80">Xem tất cả <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="divide-y divide-[#18181B]/6">
            {recentWorkouts.map(w => (
              <Link key={w.session_id} to={'/gym/session/' + w.session_id} className="flex items-center gap-4 px-5 py-3 hover:bg-white transition-colors">
                <div className="w-9 h-9 rounded-xl bg-[#FF5722]/10 flex items-center justify-center shrink-0">
                  <Dumbbell className="w-4 h-4 text-[#FF5722]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#18181B]">{w.notes || w.name || 'Buổi tập'}</p>
                  <p className="text-xs text-[#18181B]/60">{w.date} · {w.exercises ? w.exercises.length : 0} bài tập</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-[#18181B]">{w.xp_earned ? w.xp_earned + ' XP' : '—'}</p>
                  <p className="text-xs text-[#18181B]/40 flex items-center gap-0.5"><Clock className="w-3 h-3" />{w.duration || 0}m</p>
                </div>
              </Link>
            ))}
            {recentWorkouts.length === 0 && (
              <div className="px-5 py-6 text-center text-[#18181B]/40 text-sm">Chưa có buổi tập</div>
            )}
          </div>
        </div>

        {/* Personal Records */}
        <div className="glass rounded-2xl border border-[#18181B]/10 overflow-hidden premium-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#18181B]/10">
            <h3 className="font-semibold text-[#18181B]">Kỷ lục cá nhân</h3>
            <Link to="/journey/progress" className="text-xs text-[#FF5722] flex items-center gap-1 hover:opacity-80">Xem tất cả <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="divide-y divide-[#18181B]/6">
            {mockPersonalRecords.map(pr => (
              <div key={pr.exerciseId} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-[#18181B]">{pr.name}</p>
                  <p className="text-xs text-[#18181B]/40">{pr.date}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-black text-[#FF5722]">{pr.pr}</span>
                  <span className="text-xs text-[#18181B]/60">{pr.unit}</span>
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
          <Link to={a.to} className="group block overflow-hidden rounded-2xl border border-[#18181B]/10 glass premium-card">
            <div className="relative h-24 overflow-hidden">
              <img src={a.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-[#FF5722]/5 to-transparent" />
              <div className="absolute right-3 top-3 h-8 w-8 rounded-xl flex items-center justify-center backdrop-blur-xl" style={{ background: `${a.color}22`, border: `1px solid ${a.color}44` }}>
                <a.icon className="w-4 h-4" style={{ color: a.color }} />
              </div>
            </div>
            <div className="p-3 text-left">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: a.color }}>{a.eyebrow}</p>
              <p className="text-xs font-semibold text-[#18181B]/80 group-hover:text-[#18181B] transition-colors">{a.label}</p>
            </div>
          </Link>
          </motion.div>
        ))}
      </div>

      {/* Smart Suggestion */}
      {smartSuggestions.length > 0 && (
        <div className="glass rounded-2xl p-5 border border-[#FF5722]/10 premium-card shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-[#FF5722]/10 flex items-center justify-center">
              <Brain className="w-4 h-4 text-[#FF5722]" />
            </div>
            <div>
              <p className="text-xs text-[#FF5722] font-semibold">AI Gợi ý thông minh</p>
              <p className="text-sm font-bold text-[#18181B]">Nên tập gì tiếp theo?</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {smartSuggestions.map((s, i) => (
              <Link key={s.muscle} to="/journey"
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:border-[#18181B]/20 ${i === 0 ? 'border-[#FF5722]/30 bg-[#FF5722]/5' : 'border-[#18181B]/10 glass'}`}>
                <span className="text-xl">{muscleEmoji[s.muscle] || '💪'}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${i === 0 ? 'text-[#FF5722]' : 'text-[#18181B]/80'}`}>{s.muscle}</p>
                  <p className="text-xs text-[#18181B]/40">{s.daysAgo === 0 ? 'Hôm nay' : `${s.daysAgo} ngày trước`}</p>
                </div>
                {i === 0 && <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#FF5722]/8 text-[#FF5722] font-semibold shrink-0">Nên tập</span>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
