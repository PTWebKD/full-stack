import { useState } from 'react';
import { Trophy, Flame, Dumbbell, TrendingUp, Crown, Medal } from 'lucide-react';

const mockLeaderboard = {
  volume: [
    { rank: 1, name: 'Alex Thunder', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&facepad=3', value: '48.2T', badge: 'Legend', streak: 42 },
    { rank: 2, name: 'Sarah Kim', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b19e7e56?w=100&h=100&fit=crop&facepad=3', value: '41.7T', badge: 'Elite', streak: 28 },
    { rank: 3, name: 'Jake Power', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&facepad=3', value: '39.4T', badge: 'Elite', streak: 35 },
    { rank: 4, name: 'Mike D.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&facepad=3', value: '35.1T', badge: 'Pro', streak: 21 },
    { rank: 5, name: 'Dana Flex', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&facepad=3', value: '33.8T', badge: 'Pro', streak: 19 },
    { rank: 6, name: 'Tony V.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&facepad=3', value: '31.2T', badge: 'Pro', streak: 14 },
    { rank: 7, name: 'Lena Gains', avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&facepad=3', value: '29.9T', badge: 'Athlete', streak: 10 },
    { rank: 8, name: 'Chris B.', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&facepad=3', value: '28.3T', badge: 'Athlete', streak: 8 },
    { rank: 9, name: 'You (Alex)', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&facepad=3', value: '18.4T', badge: 'Rookie', streak: 5, isMe: true },
    { rank: 10, name: 'Sam Rush', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&facepad=3', value: '17.7T', badge: 'Rookie', streak: 3 },
  ],
  streak: [
    { rank: 1, name: 'Alex Thunder', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&facepad=3', value: '42 days', badge: 'Legend', streak: 42 },
    { rank: 2, name: 'Jake Power', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&facepad=3', value: '35 days', badge: 'Elite', streak: 35 },
    { rank: 3, name: 'Sarah Kim', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b19e7e56?w=100&h=100&fit=crop&facepad=3', value: '28 days', badge: 'Elite', streak: 28 },
    { rank: 4, name: 'Mike D.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&facepad=3', value: '21 days', badge: 'Pro', streak: 21 },
    { rank: 5, name: 'Dana Flex', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&facepad=3', value: '19 days', badge: 'Pro', streak: 19 },
    { rank: 6, name: 'Tony V.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&facepad=3', value: '14 days', badge: 'Pro', streak: 14 },
    { rank: 7, name: 'Lena Gains', avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&facepad=3', value: '10 days', badge: 'Athlete', streak: 10 },
    { rank: 8, name: 'Chris B.', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&facepad=3', value: '8 days', badge: 'Athlete', streak: 8 },
    { rank: 9, name: 'You (Alex)', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&facepad=3', value: '5 days', badge: 'Rookie', streak: 5, isMe: true },
    { rank: 10, name: 'Sam Rush', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&facepad=3', value: '3 days', badge: 'Rookie', streak: 3 },
  ],
  prs: [
    { rank: 1, name: 'Jake Power', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&facepad=3', value: '18 PRs', badge: 'Elite', streak: 35 },
    { rank: 2, name: 'Alex Thunder', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&facepad=3', value: '15 PRs', badge: 'Legend', streak: 42 },
    { rank: 3, name: 'Sarah Kim', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b19e7e56?w=100&h=100&fit=crop&facepad=3', value: '14 PRs', badge: 'Elite', streak: 28 },
    { rank: 4, name: 'Dana Flex', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&facepad=3', value: '12 PRs', badge: 'Pro', streak: 19 },
    { rank: 5, name: 'Tony V.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&facepad=3', value: '11 PRs', badge: 'Pro', streak: 14 },
    { rank: 6, name: 'Mike D.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&facepad=3', value: '9 PRs', badge: 'Pro', streak: 21 },
    { rank: 7, name: 'You (Alex)', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&facepad=3', value: '7 PRs', badge: 'Rookie', streak: 5, isMe: true },
    { rank: 8, name: 'Lena Gains', avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&facepad=3', value: '6 PRs', badge: 'Athlete', streak: 10 },
    { rank: 9, name: 'Chris B.', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&facepad=3', value: '5 PRs', badge: 'Athlete', streak: 8 },
    { rank: 10, name: 'Sam Rush', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&facepad=3', value: '2 PRs', badge: 'Rookie', streak: 3 },
  ],
};

const tabs = [
  { id: 'volume', label: 'Total Volume', icon: Dumbbell, color: '#003a5a' },
  { id: 'streak', label: 'Streak', icon: Flame, color: '#f97316' },
  { id: 'prs', label: 'PRs', icon: TrendingUp, color: '#00d4ff' },
];

const badgeColors = {
  Legend: '#fbbf24', Elite: '#00d4ff', Pro: '#a855f7', Athlete: '#003a5a', Rookie: '#ffffff60',
};

const rankIcons = { 1: Crown, 2: Medal, 3: Medal };

export default function LeaderboardPage() {
  const [tab, setTab] = useState('volume');
  const list = mockLeaderboard[tab] || [];
  const active = tabs.find(t => t.id === tab);

  const top3 = list.slice(0, 3);
  const rest = list.slice(3);

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <h2 className="text-lg font-bold text-white">Leaderboard</h2>
        <span className="text-xs text-white/30 ml-auto">This Month</span>
      </div>

      {/* Tab selector */}
      <div className="flex gap-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t.id ? 'text-black font-bold' : 'glass border border-white/10 text-white/50 hover:text-white'}`}
            style={tab === t.id ? { background: t.color } : {}}>
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Top 3 podium */}
      <div className="glass rounded-2xl p-6 border border-white/5">
        <div className="flex items-end justify-center gap-4">
          {[top3[1], top3[0], top3[2]].map((entry, i) => {
            if (!entry) return <div key={i} className="w-24" />;
            const heights = ['h-20', 'h-28', 'h-16'];
            const podiumColors = ['#9ca3af', '#fbbf24', '#cd7c00'];
            const isCenter = i === 1;
            return (
              <div key={entry.rank} className="flex flex-col items-center gap-2">
                {isCenter && <Crown className="w-5 h-5 text-yellow-400 mb-1" />}
                <img src={entry.avatar} alt={entry.name} className={`rounded-full object-cover border-2 ${isCenter ? 'w-14 h-14 border-yellow-400' : 'w-10 h-10 border-white/20'}`} />
                <p className="text-xs text-white font-semibold text-center w-20 truncate">{entry.name}</p>
                <p className="text-xs font-bold" style={{ color: active?.color }}>{entry.value}</p>
                <div className={`w-20 ${heights[i]} rounded-t-xl flex items-start justify-center pt-2`}
                  style={{ background: `${podiumColors[i]}20`, border: `1px solid ${podiumColors[i]}40` }}>
                  <span className="text-xl font-black" style={{ color: podiumColors[i] }}>{entry.rank}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ranks 4–10 */}
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        {rest.map((entry, i) => (
          <div key={entry.rank} className={`flex items-center gap-4 px-5 py-3 border-b border-white/5 last:border-0 transition-colors ${entry.isMe ? 'bg-[#003a5a]/5 border-l-2 border-l-[#003a5a]' : 'hover:bg-white/5'}`}>
            <span className="w-6 text-center text-sm font-bold text-white/40">{entry.rank}</span>
            <img src={entry.avatar} alt={entry.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${entry.isMe ? 'text-[#7dd3fc]' : 'text-white'}`}>{entry.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ background: `${badgeColors[entry.badge]}15`, color: badgeColors[entry.badge] }}>
                  {entry.badge}
                </span>
                <span className="text-xs text-white/30 flex items-center gap-0.5"><Flame className="w-3 h-3 text-orange-400" />{entry.streak}d</span>
              </div>
            </div>
            <span className="text-sm font-bold" style={{ color: active?.color }}>{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
