import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Zap, Calendar } from 'lucide-react';
import { api } from '../../services/api';

const muscleColors = {
  Chest: '#FF5722', Back: '#3b82f6', Legs: '#71717a',
  Shoulders: '#a855f7', Arms: '#fbbf24', Core: '#ec4899',
};

export default function GymRecordsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/api/gym/records/my')
      .then(data => setRecords(data.items || data || []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, []);

  // Only show PR records
  const allPRs = records.filter(r => r.is_pr);

  if (loading) return (
    <div className="py-16 text-center text-[#18181B]/40">Đang tải...</div>
  );

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#18181B] flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" /> Personal Records
        </h2>
        <span className="text-xs text-[#18181B]/40">{allPRs.length} bài tập</span>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Tổng PRs', value: allPRs.length, color: '#fbbf24' },
          { label: 'Tổng logs', value: records.length, color: '#71717a' },
          { label: 'PR gần nhất', value: allPRs[0]?.exercise_name || '—', color: '#FF5722' },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-4 border border-[#18181B]/10 text-center">
            <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#18181B]/60 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* PR cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {allPRs.map(pr => {
          const color = muscleColors[pr.muscle_group] || '#7dd3fc';
          const sets = Array.isArray(pr.sets) ? pr.sets : [];
          const bestSet = sets.reduce((best, s) => ((s.weight || 0) > (best.weight || 0) ? s : best), sets[0] || {});
          return (
            <button key={pr.log_id} onClick={() => setSelected(selected?.log_id === pr.log_id ? null : pr)}
              className={`glass rounded-2xl p-5 border text-left transition-all hover:border-white/15 ${selected?.log_id === pr.log_id ? 'border-[#18181B]/20 bg-white/[0.06]' : 'border-[#18181B]/10'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium mb-1 inline-block"
                    style={{ background: `${color}15`, color }}>
                    {pr.muscle_group}
                  </span>
                  <h4 className="font-bold text-[#18181B]">{pr.exercise_name}</h4>
                </div>
                <Trophy className="w-4 h-4 text-yellow-400 shrink-0 mt-1" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-black text-[#18181B]">
                    {bestSet.weight || '—'}<span className="text-sm font-normal text-[#18181B]/60 ml-1">kg</span>
                  </p>
                  <p className="text-xs text-[#18181B]/40 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" /> {pr.date || '—'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#18181B]/40">{sets.length} sets</p>
                  <p className="text-sm text-[#18181B]/60">{bestSet.reps || '—'} reps</p>
                </div>
              </div>

              {selected?.log_id === pr.log_id && sets.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#18181B]/10">
                  <p className="text-xs text-[#18181B]/40 mb-2">Sets chi tiết</p>
                  <div className="space-y-1">
                    {sets.map((s, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-[#18181B]/60">Set {i + 1}</span>
                        <span className="text-[#18181B]/80">{s.weight}kg × {s.reps} reps</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {allPRs.length === 0 && (
        <div className="text-center py-16 text-[#18181B]/40">
          <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Chưa có kỷ lục nào</p>
        </div>
      )}

      {/* Tips */}
      <div className="glass rounded-2xl p-4 border border-[#FF5722]/20 flex items-start gap-3">
        <Zap className="w-4 h-4 text-[#FF5722] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-[#18181B] mb-0.5">Smart Insight</p>
          <p className="text-xs text-[#18181B]/60">Bench Press của bạn chưa PR trong 5 tuần. Thử tập kỹ thuật Touch-and-Go hoặc tăng tần suất để phá ngưỡng.</p>
        </div>
      </div>
    </div>
  );
}
