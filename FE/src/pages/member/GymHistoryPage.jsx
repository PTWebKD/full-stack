import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Clock, Weight, Plus, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';

export default function GymHistoryPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/gym/sessions/my')
      .then(data => setSessions(data.items || data || []))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, []);

  // Compute total volume from exercises sets (each set has weight + reps)
  const computeVolume = (session) => {
    if (!session.exercises) return 0;
    return session.exercises.reduce((total, ex) => {
      const sets = Array.isArray(ex.sets) ? ex.sets : [];
      return total + sets.reduce((s, set) => s + ((set.weight || 0) * (set.reps || 0)), 0);
    }, 0);
  };

  const totalVolume = sessions.reduce((s, w) => s + computeVolume(w), 0);
  const totalTime = sessions.reduce((s, w) => s + (w.duration || 0), 0);

  if (loading) return (
    <div className="py-16 text-center text-[#18181B]/40">Đang tải...</div>
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#18181B]">Workout History</h2>
        <Link to="/gym/new-session" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5722] text-white text-sm font-bold hover:bg-[#FF5722]/90 transition-colors">
          <Plus className="w-4 h-4" /> New Session
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Sessions', value: sessions.length, icon: Dumbbell },
          { label: 'Total Time', value: `${totalTime}m`, icon: Clock },
          { label: 'Volume', value: `${(totalVolume / 1000).toFixed(0)}K kg`, icon: Weight },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-4 border border-[#18181B]/10 text-center">
            <p className="text-xl font-black text-[#18181B] mb-1">{s.value}</p>
            <p className="text-xs text-[#18181B]/60">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {sessions.map(w => {
          const vol = computeVolume(w);
          const exerciseCount = w.exercises ? w.exercises.length : 0;
          const setCount = w.exercises ? w.exercises.reduce((s, e) => s + (Array.isArray(e.sets) ? e.sets.length : 0), 0) : 0;
          return (
            <Link key={w.session_id} to={'/gym/session/' + w.session_id}
              className="glass rounded-2xl p-5 border border-[#18181B]/10 hover:border-[#18181B]/10 transition-all flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF5722]/10 flex items-center justify-center shrink-0">
                <Dumbbell className="w-5 h-5 text-[#FF5722]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#18181B] mb-1">{w.notes || w.name || 'Buổi tập'}</p>
                <p className="text-xs text-[#18181B]/60">{w.date} · {exerciseCount} exercises · {setCount} sets</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#18181B]">{(vol / 1000).toFixed(1)}T</p>
                <p className="text-xs text-[#18181B]/40 flex items-center gap-1 justify-end"><Clock className="w-3 h-3" />{w.duration || 0}m</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#18181B]/40" />
            </Link>
          );
        })}
      </div>

      {sessions.length === 0 && (
        <div className="text-center py-16 text-[#18181B]/40">
          <Dumbbell className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Chưa có buổi tập nào</p>
        </div>
      )}
    </div>
  );
}
