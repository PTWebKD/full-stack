import { useAuth } from '../../context/AuthContext';
import { Award, Flame, Zap, Star, Shield, Trophy, Lock, Dumbbell } from 'lucide-react';

const levels = [
  { name: 'Tân Binh', minPts: 0, color: '#6b7280' },
  { name: 'Vận Động Viên', minPts: 500, color: '#22c55e' },
  { name: 'Nhà Vô Địch', minPts: 1500, color: '#3b82f6' },
  { name: 'Tinh Anh', minPts: 3000, color: '#FF5722' },
  { name: 'Huyền Thoại', minPts: 6000, color: '#a855f7' },
];

const badges = [
  { id: 1, name: 'Lần Đầu Tập', desc: 'Ghi lại buổi tập đầu tiên', icon: Dumbbell, color: '#3b82f6', earned: true, earnedAt: '2024-01-15' },
  { id: 2, name: 'Streak 7 Ngày', desc: 'Tập 7 ngày liên tiếp', icon: Flame, color: '#FF5722', earned: true, earnedAt: '2024-02-10' },
  { id: 3, name: '100 Buổi Tập', desc: 'Hoàn thành 100 buổi tập', icon: Trophy, color: '#fbbf24', earned: true, earnedAt: '2024-12-28' },
  { id: 4, name: 'Phá Kỷ Lục', desc: 'Lập 5 kỷ lục cá nhân', icon: Zap, color: '#FF5722', earned: true, earnedAt: '2025-01-30' },
  { id: 5, name: 'Ăn Sạch', desc: 'Đặt 30 bữa ăn lành mạnh', icon: Star, color: '#22c55e', earned: false },
  { id: 6, name: 'Streak 30 Ngày', desc: 'Tập 30 ngày liên tiếp', icon: Shield, color: '#ec4899', earned: false },
  { id: 7, name: 'Máy Nâng Tạ', desc: 'Tổng khối lượng 100.000kg', icon: Trophy, color: '#a855f7', earned: false },
  { id: 8, name: 'Ngôi Sao Cộng Đồng', desc: 'Nhận 500 lượt thích bài đăng', icon: Star, color: '#fbbf24', earned: false },
];

export default function PassportPage() {
  const { user } = useAuth();
  if (!user) return null;

  const points = user.points ?? 0;
  const streak = user.streak ?? 0;
  const stats = user.stats ?? { workouts: 0, prs: 0, calories: 0, followers: 0 };

  const currentLevel = levels.findLast(l => points >= l.minPts) || levels[0];
  const nextLevel = levels.find(l => l.minPts > points);
  const progress = nextLevel ? ((points - currentLevel.minPts) / (nextLevel.minPts - currentLevel.minPts)) * 100 : 100;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Passport Card */}
      <div className="relative rounded-2xl overflow-hidden h-48">
        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=300&fit=crop" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-center gap-6 px-8">
          <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover border-2" style={{ borderColor: currentLevel.color }} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold border" style={{ color: currentLevel.color, borderColor: `${currentLevel.color}50`, background: `${currentLevel.color}15` }}>
                {currentLevel.name}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mb-1">{user.name}</h2>
            <p className="text-white/80 text-sm">Thành viên từ {user.joinedAt}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-white/80">
              <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" />Streak {streak} ngày</span>
              <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-[#FF5722]" />{points} điểm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="glass rounded-2xl p-5 border border-[#18181B]/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[#18181B]">Tiến Độ Cấp Bậc</h3>
          {nextLevel && <span className="text-xs text-[#18181B]/60">Còn {nextLevel.minPts - points} điểm để lên {nextLevel.name}</span>}
        </div>
        <div className="flex items-center gap-3 mb-4">
          {levels.map((l, i) => (
            <div key={l.name} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${points >= l.minPts ? 'border-current' : 'border-[#18181B]/10 bg-white text-[#18181B]/40'}`}
                style={points >= l.minPts ? { color: l.color, borderColor: l.color, background: `${l.color}20` } : {}}>
                {i + 1}
              </div>
              <span className="text-xs text-[#18181B]/40 hidden sm:block">{l.name}</span>
            </div>
          ))}
        </div>
        <div className="h-2 rounded-full bg-white overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${currentLevel.color}, ${nextLevel?.color || currentLevel.color})` }} />
        </div>
      </div>

      {/* Badges */}
      <div className="glass rounded-2xl p-5 border border-[#18181B]/10">
        <h3 className="font-semibold text-[#18181B] mb-4">Huy Hiệu <span className="text-xs text-[#18181B]/40 ml-1">({badges.filter(b => b.earned).length}/{badges.length} đã đạt)</span></h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map(b => (
            <div key={b.id} className={`rounded-xl p-4 text-center border transition-all ${b.earned ? 'border-[#18181B]/10 bg-white/[0.03]' : 'border-[#18181B]/10 opacity-40'}`}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2" style={b.earned ? { background: `${b.color}15`, border: `1px solid ${b.color}30` } : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                {b.earned ? <b.icon className="w-5 h-5" style={{ color: b.color }} /> : <Lock className="w-4 h-4 text-[#18181B]/40" />}
              </div>
              <p className="text-xs font-semibold text-[#18181B] mb-0.5">{b.name}</p>
              <p className="text-xs text-[#18181B]/40 leading-tight">{b.desc}</p>
              {b.earned && b.earnedAt && <p className="text-xs text-[#18181B]/40 mt-1">{b.earnedAt}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Buổi Tập', value: stats.workouts },
          { label: 'Kỷ Lục', value: stats.prs },
          { label: 'Calo', value: ((stats.calories || 0) / 1000).toFixed(0) + 'K' },
          { label: 'Người Theo Dõi', value: stats.followers },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-4 border border-[#18181B]/10 text-center">
            <p className="text-2xl font-black text-[#18181B] mb-1">{s.value}</p>
            <p className="text-xs text-[#18181B]/60">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
