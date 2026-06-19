import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Weight, Dumbbell } from 'lucide-react';
import { api } from '../../services/api';

export default function SessionDetailPage() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/api/gym/sessions/${id}`)
      .then(data => setSession(data))
      .catch(() => setError('Session not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-20 text-[#18181B]/60">Đang tải...</div>;

  if (error || !session) return (
    <div className="text-center py-20 text-[#18181B]/60">
      <p className="mb-4">Session not found</p>
      <Link to="/gym/history" className="text-[#FF5722] hover:underline">Back to History</Link>
    </div>
  );

  const totalSets = session.exercises?.reduce((s, e) => s + (e.sets?.length || 0), 0) || 0;
  const volume = session.exercises?.reduce((s, ex) => s + (ex.sets || []).reduce((ss, set) => ss + (set.weight || 0) * (set.reps || 0), 0), 0) || 0;

  return (
    <div className="max-w-2xl space-y-5 mx-auto">
      <Link to="/gym/history" className="inline-flex items-center gap-2 text-sm text-[#18181B]/60 hover:text-[#18181B] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to History
      </Link>

      <div className="glass rounded-2xl p-5 border border-[#18181B]/10">
        <h2 className="text-xl font-black text-[#18181B] mb-1">{session.notes || 'Workout Session'}</h2>
        <p className="text-[#18181B]/60 text-sm mb-4">{session.date}</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Duration', value: `${session.duration_min || 0}m`, icon: Clock },
            { label: 'Volume', value: `${(volume / 1000).toFixed(1)}T`, icon: Weight },
            { label: 'Sets', value: totalSets, icon: Dumbbell },
          ].map(s => (
            <div key={s.label} className="text-center glass rounded-xl p-3 border border-[#18181B]/10">
              <p className="text-xl font-black text-[#18181B]">{s.value}</p>
              <p className="text-xs text-[#18181B]/60">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {(session.exercises || []).map((ex, i) => (
          <div key={i} className="glass rounded-2xl border border-[#18181B]/10 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-[#18181B]/10">
              <Dumbbell className="w-4 h-4 text-[#FF5722]" />
              <p className="font-semibold text-[#18181B]">{ex.exercise_name}</p>
              <span className="ml-auto text-xs text-[#18181B]/40">{(ex.sets || []).length} sets</span>
            </div>
            <div className="px-5 py-3">
              <div className="grid grid-cols-3 gap-4 text-xs text-[#18181B]/40 mb-2 font-medium uppercase">
                <span>Set</span><span>Reps</span><span>Weight</span>
              </div>
              {(ex.sets || []).map((set, si) => (
                <div key={si} className="grid grid-cols-3 gap-4 text-sm text-[#18181B]/80 py-1.5 border-b border-white/[0.04] last:border-0">
                  <span className="text-[#18181B]/40">{si + 1}</span>
                  <span>{set.reps}</span>
                  <span>{set.weight > 0 ? `${set.weight}kg` : 'BW'}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
