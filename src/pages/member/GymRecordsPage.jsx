import { useState } from 'react';
import { Trophy, TrendingUp, Zap, Calendar } from 'lucide-react';
import { mockPersonalRecords, mockWorkoutHistory } from '../../data/mockGym';

const allPRs = [
  { exerciseId: 1, name: 'Bench Press', pr: 110, prev: 105, date: '2025-04-15', unit: 'kg', muscle: 'Chest', improvement: 4.8 },
  { exerciseId: 2, name: 'Deadlift', pr: 185, prev: 175, date: '2025-03-28', unit: 'kg', muscle: 'Back', improvement: 5.7 },
  { exerciseId: 4, name: 'Squat', pr: 145, prev: 135, date: '2025-05-01', unit: 'kg', muscle: 'Legs', improvement: 7.4 },
  { exerciseId: 5, name: 'Overhead Press', pr: 72.5, prev: 67.5, date: '2025-02-10', unit: 'kg', muscle: 'Shoulders', improvement: 7.4 },
  { exerciseId: 6, name: 'Bicep Curl', pr: 22.5, prev: 20, date: '2025-04-22', unit: 'kg', muscle: 'Arms', improvement: 12.5 },
  { exerciseId: 3, name: 'Pull-ups', pr: 15, prev: 12, date: '2025-03-10', unit: 'reps', muscle: 'Back', improvement: 25 },
  { exerciseId: 7, name: 'Plank', pr: 180, prev: 120, date: '2025-01-28', unit: 'secs', muscle: 'Core', improvement: 50 },
];

const muscleColors = {
  Chest: '#f97316', Back: '#00d4ff', Legs: '#003a5a',
  Shoulders: '#a855f7', Arms: '#fbbf24', Core: '#ec4899',
};

export default function GymRecordsPage() {
  const [selected, setSelected] = useState(null);

  const totalImprovement = allPRs.reduce((s, pr) => s + pr.improvement, 0) / allPRs.length;

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" /> Personal Records
        </h2>
        <span className="text-xs text-white/30">{allPRs.length} bài tập</span>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Tổng PRs', value: allPRs.length, color: '#fbbf24' },
          { label: 'Cải thiện TB', value: `+${totalImprovement.toFixed(1)}%`, color: '#003a5a' },
          { label: 'PR gần nhất', value: 'Squat 145kg', color: '#00d4ff' },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-4 border border-white/5 text-center">
            <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* PR cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {allPRs.map(pr => (
          <button key={pr.exerciseId} onClick={() => setSelected(selected?.exerciseId === pr.exerciseId ? null : pr)}
            className={`glass rounded-2xl p-5 border text-left transition-all hover:border-white/15 ${selected?.exerciseId === pr.exerciseId ? 'border-white/20 bg-white/[0.06]' : 'border-white/5'}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium mb-1 inline-block"
                  style={{ background: `${muscleColors[pr.muscle]}15`, color: muscleColors[pr.muscle] }}>
                  {pr.muscle}
                </span>
                <h4 className="font-bold text-white">{pr.name}</h4>
              </div>
              <Trophy className="w-4 h-4 text-yellow-400 shrink-0 mt-1" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-black text-white">{pr.pr}<span className="text-sm font-normal text-white/40 ml-1">{pr.unit}</span></p>
                <p className="text-xs text-white/30 flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" /> {pr.date}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/30">Trước đây</p>
                <p className="text-sm text-white/50">{pr.prev} {pr.unit}</p>
                <p className="text-xs text-[#7dd3fc] flex items-center gap-0.5 justify-end mt-0.5">
                  <TrendingUp className="w-3 h-3" />+{pr.improvement}%
                </p>
              </div>
            </div>

            {selected?.exerciseId === pr.exerciseId && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-white/30 mb-2">Lịch sử</p>
                <div className="flex items-end gap-1 h-12">
                  {[pr.prev * 0.85, pr.prev * 0.92, pr.prev * 0.97, pr.prev, pr.prev * 1.02, pr.pr].map((v, i) => (
                    <div key={i} className="flex-1 rounded-t"
                      style={{ height: `${(v / pr.pr) * 100}%`, background: i === 5 ? muscleColors[pr.muscle] : `${muscleColors[pr.muscle]}40` }} />
                  ))}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Tips */}
      <div className="glass rounded-2xl p-4 border border-[#003a5a]/10 flex items-start gap-3">
        <Zap className="w-4 h-4 text-[#7dd3fc] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-white mb-0.5">Smart Insight</p>
          <p className="text-xs text-white/50">Bench Press của bạn chưa PR trong 5 tuần. Thử tập kỹ thuật Touch-and-Go hoặc tăng tần suất để phá ngưỡng.</p>
        </div>
      </div>
    </div>
  );
}
