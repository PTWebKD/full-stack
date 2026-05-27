import { useState } from 'react';
import { Trophy, Zap, CheckCircle, Clock, Target, Calendar } from 'lucide-react';

const getDaysLeftInWeek = () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const daysLeft = day === 0 ? 0 : 7 - day;
  return daysLeft;
};

const challenges = [
  {
    id: 1,
    title: 'Tập 5 buổi trong tuần',
    description: 'Hoàn thành ít nhất 5 buổi tập gym trong tuần này.',
    current: 3,
    total: 5,
    fcReward: 200,
    xpReward: 50,
    icon: '💪',
    color: '#003a5a',
  },
  {
    id: 2,
    title: 'Nạp 150g protein mỗi ngày trong 7 ngày',
    description: 'Theo dõi và đạt đủ 150g protein mỗi ngày liên tiếp.',
    current: 4,
    total: 7,
    fcReward: 300,
    xpReward: 100,
    icon: '🥩',
    color: '#00d4ff',
  },
  {
    id: 3,
    title: 'Đạt 1 PR mới trong tuần',
    description: 'Phá vỡ personal record của bất kỳ bài tập nào.',
    current: 0,
    total: 1,
    fcReward: 500,
    xpReward: 200,
    icon: '🏋️',
    color: '#f97316',
  },
  {
    id: 4,
    title: 'Mua ít nhất 1 món food trong tuần',
    description: 'Đặt hàng thực phẩm từ cửa hàng FitFuel+.',
    current: 1,
    total: 1,
    fcReward: 100,
    xpReward: 30,
    icon: '🍱',
    color: '#a855f7',
  },
];

const pastChallenges = [
  {
    id: 'p1',
    title: 'Tập đủ 7 ngày liên tiếp',
    completedDate: '2025-05-18',
    fcEarned: 300,
    xpEarned: 100,
    icon: '🔥',
  },
  {
    id: 'p2',
    title: 'Đạt mục tiêu calo trong 5 ngày',
    completedDate: '2025-05-17',
    fcEarned: 150,
    xpEarned: 60,
    icon: '🎯',
  },
];

function ProgressBar({ current, total, color }) {
  const pct = Math.min((current / total) * 100, 100);
  return (
    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

function ChallengeStatus({ current, total }) {
  if (current >= total) return (
    <span className="flex items-center gap-1 text-[#7dd3fc] text-xs font-bold">
      <CheckCircle className="w-3.5 h-3.5" /> Hoàn thành!
    </span>
  );
  if (current === 0) return (
    <span className="text-white/30 text-xs font-medium">Chưa bắt đầu</span>
  );
  return (
    <span className="text-[#00d4ff] text-xs font-medium">Đang thực hiện</span>
  );
}

export default function WeeklyChallengePage() {
  const [claimedIds, setClaimedIds] = useState([]);
  const daysLeft = getDaysLeftInWeek();

  const handleClaim = (id) => {
    setClaimedIds(prev => [...prev, id]);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header banner */}
      <div className="glass-dark rounded-2xl p-5 border border-[#003a5a]/20 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#003a5a]/10 border border-[#003a5a]/20 flex items-center justify-center shrink-0">
          <Trophy className="w-6 h-6 text-[#7dd3fc]" />
        </div>
        <div className="flex-1">
          <h2 className="font-black text-white text-lg">Weekly Challenges</h2>
          <p className="text-white/40 text-xs mt-0.5">Hoàn thành thử thách để nhận FitCoin và XP</p>
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-center gap-1.5 text-white/40 text-xs mb-0.5">
            <Clock className="w-3 h-3" />
            <span>Còn lại</span>
          </div>
          <p className="font-black text-white text-xl">{daysLeft}<span className="text-white/40 text-sm font-normal"> ngày</span></p>
        </div>
      </div>

      {/* Active challenges */}
      <div>
        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">Thử thách tuần này</h3>
        <div className="space-y-4">
          {challenges.map(ch => {
            const done = ch.current >= ch.total;
            const claimed = claimedIds.includes(ch.id);
            return (
              <div
                key={ch.id}
                className={`glass-dark rounded-2xl p-5 border transition-all ${done ? 'border-[#003a5a]/30' : 'border-white/5'}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: `${ch.color}15`, border: `1px solid ${ch.color}30` }}>
                    {ch.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-white text-sm leading-snug">{ch.title}</h4>
                      <ChallengeStatus current={ch.current} total={ch.total} />
                    </div>
                    <p className="text-xs text-white/40 mb-3">{ch.description}</p>
                    <ProgressBar current={ch.current} total={ch.total} color={ch.color} />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-white/30">{ch.current}/{ch.total}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#fbbf24]">⚡ +{ch.fcReward} FC</span>
                        <span className="text-xs font-bold text-[#00d4ff]">+{ch.xpReward} XP</span>
                      </div>
                    </div>
                  </div>
                </div>
                {done && !claimed && (
                  <button
                    onClick={() => handleClaim(ch.id)}
                    className="mt-4 w-full py-2.5 rounded-xl bg-[#003a5a] text-white font-bold text-sm hover:bg-[#003a5a]/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" /> Nhận thưởng
                  </button>
                )}
                {done && claimed && (
                  <div className="mt-4 w-full py-2 rounded-xl border border-[#003a5a]/20 text-[#7dd3fc] text-sm font-bold flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Đã nhận thưởng
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Past challenges */}
      <div>
        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">Thành tích tuần trước</h3>
        <div className="space-y-3">
          {pastChallenges.map(pc => (
            <div key={pc.id} className="glass-dark rounded-xl p-4 border border-white/5 flex items-center gap-4">
              <span className="text-2xl shrink-0">{pc.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white/80">{pc.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3 h-3 text-white/30" />
                  <span className="text-xs text-white/30">{pc.completedDate}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-bold text-[#fbbf24]">+{pc.fcEarned} FC</p>
                <p className="text-xs font-bold text-[#00d4ff]">+{pc.xpEarned} XP</p>
              </div>
              <CheckCircle className="w-5 h-5 text-[#7dd3fc] shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
