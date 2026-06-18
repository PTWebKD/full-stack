import { useState } from 'react';
import { BarChart2, Dumbbell, Scale, TrendingUp } from 'lucide-react';

const TABS = [
  { key: 'journey', label: 'Hành Trình', icon: BarChart2 },
  { key: 'strength', label: 'Sức Mạnh', icon: Dumbbell },
  { key: 'body', label: 'Cơ Thể', icon: Scale },
];

// Placeholder data
const strengthData = [
  { week: 'T1', bench: 60, squat: 80, deadlift: 100 },
  { week: 'T2', bench: 62, squat: 82, deadlift: 105 },
  { week: 'T3', bench: 65, squat: 85, deadlift: 107 },
  { week: 'T4', bench: 67, squat: 90, deadlift: 112 },
  { week: 'T5', bench: 70, squat: 92, deadlift: 115 },
];

const bodyData = [
  { week: 'T1', weight: 75 },
  { week: 'T2', weight: 74.5 },
  { week: 'T3', weight: 74 },
  { week: 'T4', weight: 73.2 },
  { week: 'T5', weight: 72.8 },
];

export default function JourneyProgressPage() {
  const [tab, setTab] = useState('journey');

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-white mb-6">Tiến độ của bạn</h1>

      {/* Tab bar */}
      <div className="flex gap-2 mb-6">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t.key ? 'bg-[#00d4ff] text-black' : 'glass border border-white/10 text-white/60 hover:text-white'}`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'journey' && (
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5 border border-white/5">
            <h2 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wide">Streak & Tổng buổi tập</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Streak hiện tại', value: '—', unit: 'ngày', color: '#f97316' },
                { label: 'Streak dài nhất', value: '—', unit: 'ngày', color: '#fbbf24' },
                { label: 'Tổng buổi tập', value: '—', unit: 'buổi', color: '#00d4ff' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs text-white/30 mt-0.5">{s.unit}</p>
                  <p className="text-xs text-white/20 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-5 border border-white/5">
            <p className="text-sm text-white/40 text-center">Dữ liệu tiến độ sẽ hiển thị sau khi hoàn thành các buổi tập.</p>
          </div>
        </div>
      )}

      {tab === 'strength' && (
        <div className="glass rounded-2xl p-5 border border-white/5">
          <h2 className="text-sm font-semibold text-white mb-4">Sức mạnh theo tuần (kg)</h2>
          <div className="flex items-end gap-2 h-32 mb-3">
            {strengthData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col gap-0.5" style={{ height: '100%', justifyContent: 'flex-end' }}>
                  <div className="w-full rounded-t" style={{ height: `${(d.deadlift/130)*100}%`, background: '#f97316', opacity: 0.7 }} />
                  <div className="w-full rounded-t" style={{ height: `${(d.squat/100)*100}%`, background: '#a855f7', opacity: 0.7 }} />
                  <div className="w-full rounded-t" style={{ height: `${(d.bench/80)*100}%`, background: '#00d4ff', opacity: 0.7 }} />
                </div>
                <span className="text-xs text-white/25">{d.week}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 justify-center">
            {[['#00d4ff','Bench'],['#a855f7','Squat'],['#f97316','Deadlift']].map(([c,n])=>(
              <div key={n} className="flex items-center gap-1.5 text-xs text-white/50">
                <div className="w-3 h-2 rounded" style={{background:c}}/>
                {n}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'body' && (
        <div className="glass rounded-2xl p-5 border border-white/5">
          <h2 className="text-sm font-semibold text-white mb-4">Cân nặng theo tuần (kg)</h2>
          <div className="space-y-2">
            {bodyData.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-white/30 w-6">{d.week}</span>
                <div className="flex-1 h-5 glass rounded-full overflow-hidden border border-white/5">
                  <div className="h-full rounded-full bg-[#22c55e]/70 transition-all" style={{ width: `${((d.weight - 72) / 5) * 100}%` }} />
                </div>
                <span className="text-xs font-mono text-[#22c55e] w-12 text-right">{d.weight}kg</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-white/30">
            <TrendingUp className="w-3.5 h-3.5 text-[#22c55e]" />
            <span>Xu hướng: giảm cân</span>
          </div>
        </div>
      )}
    </div>
  );
}
