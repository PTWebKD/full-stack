import { Link } from 'react-router-dom';
import { Dumbbell, Clock, Weight, Plus, ChevronRight } from 'lucide-react';
import { mockWorkoutHistory } from '../../data/mockGym';

export default function GymHistoryPage() {
  const totalVolume = mockWorkoutHistory.reduce((s, w) => s + w.volume, 0);
  const totalTime = mockWorkoutHistory.reduce((s, w) => s + w.duration, 0);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Workout History</h2>
        <Link to="/gym/new-session" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#003a5a] text-white text-sm font-bold hover:bg-[#003a5a]/90 transition-colors">
          <Plus className="w-4 h-4" /> New Session
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Sessions', value: mockWorkoutHistory.length, icon: Dumbbell },
          { label: 'Total Time', value: `${totalTime}m`, icon: Clock },
          { label: 'Volume', value: `${(totalVolume / 1000).toFixed(0)}K kg`, icon: Weight },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-4 border border-white/5 text-center">
            <p className="text-xl font-black text-white mb-1">{s.value}</p>
            <p className="text-xs text-white/40">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {mockWorkoutHistory.map(w => (
          <Link key={w.id} to={`/gym/session/${w.id}`}
            className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#003a5a]/10 flex items-center justify-center shrink-0">
              <Dumbbell className="w-5 h-5 text-[#7dd3fc]" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white mb-1">{w.name}</p>
              <p className="text-xs text-white/40">{w.date} · {w.exercises.length} exercises · {w.exercises.reduce((s, e) => s + e.sets.length, 0)} sets</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-white">{(w.volume / 1000).toFixed(1)}T</p>
              <p className="text-xs text-white/30 flex items-center gap-1 justify-end"><Clock className="w-3 h-3" />{w.duration}m</p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/20" />
          </Link>
        ))}
      </div>
    </div>
  );
}
