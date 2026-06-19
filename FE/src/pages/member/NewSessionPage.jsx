import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, CheckCircle, Dumbbell, Search, Clock } from 'lucide-react';
import { mockExercises } from '../../data/mockGym';
import AiFoodSuggestion from '../../components/common/AiFoodSuggestion';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const MUSCLE_MAP = {
  'Chest': 'chest', 'Back': 'back', 'Legs': 'legs',
  'Shoulders': 'shoulders', 'Arms': 'arms', 'Core': 'core',
  'Full Body': 'back', 'Cardio': 'core',
};

export default function NewSessionPage() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState('');
  const [done, setDone] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [finishedSession, setFinishedSession] = useState(null);
  const [startTime] = useState(Date.now());
  const [newPRs, setNewPRs] = useState([]);
  const [showPRToast, setShowPRToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const filtered = mockExercises.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  const addExercise = (ex) => {
    if (exercises.find(e => e.id === ex.id)) return;
    setExercises(prev => [...prev, { ...ex, sets: [{ reps: 8, weight: 0 }] }]);
    setSearch('');
  };

  const removeExercise = (id) => setExercises(prev => prev.filter(e => e.id !== id));

  const addSet = (id) => setExercises(prev => prev.map(e => e.id === id ? { ...e, sets: [...e.sets, { reps: 8, weight: 0 }] } : e));

  const updateSet = (exId, setIdx, field, value) => {
    setExercises(prev => prev.map(e => e.id === exId ? {
      ...e, sets: e.sets.map((s, i) => i === setIdx ? { ...s, [field]: Number(value) } : s)
    } : e));
  };

  const handleFinish = async () => {
    if (!name || exercises.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const today = new Date().toISOString().split('T')[0];
      // 1. Create session
      const session = await api.post('/api/gym/sessions', {
        date: today,
        notes: name,
        duration_min: Math.round((Date.now() - startTime) / 60000) || null,
      });
      // 2. Log each exercise
      for (const ex of exercises) {
        await api.post(`/api/gym/sessions/${session.session_id}/exercises`, {
          exercise_name: ex.name,
          muscle_group: MUSCLE_MAP[ex.muscle] || 'core',
          sets: ex.sets.map(s => ({ reps: Number(s.reps), weight: Number(s.weight) })),
        });
      }
      // 3. Complete session
      const result = await api.post(`/api/gym/sessions/${session.session_id}/complete`, {});
      setFinishedSession({ ...result, sessionId: session.session_id });
      // 4. Check PRs from server response
      const prs = result.session?.exercises?.filter(e => e.is_pr)
        .map(e => ({ exercise: e.exercise_name, weight: Math.max(...e.sets.map(s => s.weight || 0)) })) || [];
      if (prs.length > 0) {
        setNewPRs(prs);
        setShowPRToast(true);
        setTimeout(() => { setShowPRToast(false); setDone(true); setShowAI(true); }, 3000);
      } else {
        setDone(true);
        setShowAI(true);
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi lưu buổi tập');
    } finally {
      setLoading(false);
    }
  };

  const handleAIClose = () => {
    setShowAI(false);
    navigate('/gym/history');
  };

  const elapsedMins = Math.round((Date.now() - startTime) / 60000);

  if (done && !showAI) return null;

  return (
    <>
      {/* PR Toast Notification */}
      {showPRToast && newPRs.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass rounded-2xl p-8 border border-[#FF5722]/30 text-center max-w-sm mx-4 shadow-2xl">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="text-2xl font-black text-[#FF5722] mb-2">NEW PR!</h2>
            <div className="space-y-2 mb-4">
              {newPRs.map((pr, i) => (
                <p key={i} className="text-[#18181B] font-semibold text-lg">
                  🎉 {pr.exercise}: <span className="text-[#FF5722]">{pr.weight}kg</span>
                </p>
              ))}
            </div>
            <p className="text-[#18181B]/60 text-sm">Personal Record mới! +30 FitCoin</p>
          </div>
        </div>
      )}

      {showAI && finishedSession && (
        <AiFoodSuggestion
          sessionId={finishedSession.sessionId}
          sessionName={name}
          xpEarned={finishedSession.xp_earned}
          newStreak={finishedSession.new_streak}
          badgesEarned={finishedSession.badges_earned}
          onClose={handleAIClose}
        />
      )}

      {!done && (
        <div className="space-y-5 max-w-2xl mx-auto">
          {/* Header with timer */}
          <div className="flex items-center gap-3">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Tên buổi tập (VD: Upper Power)"
              className="flex-1 px-4 py-3 rounded-xl glass border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 focus:outline-none focus:border-[#FF5722]/50 text-lg font-bold"
            />
            <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl glass border border-[#18181B]/10 text-[#18181B]/60 text-sm shrink-0">
              <Clock className="w-4 h-4" />
              <span>{elapsedMins}m</span>
            </div>
          </div>

          {/* Exercise search */}
          <div className="glass rounded-2xl p-4 border border-[#18181B]/10">
            <p className="text-xs text-[#18181B]/60 mb-3 font-medium uppercase tracking-wider">Thêm bài tập</p>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#18181B]/40" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm bài tập..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 focus:outline-none focus:border-[#FF5722]/50 text-sm"
              />
            </div>
            {search && (
              <div className="space-y-1 max-h-44 overflow-y-auto">
                {filtered.slice(0, 6).map(ex => (
                  <button key={ex.id} onClick={() => addExercise(ex)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white transition-colors text-left">
                    <img src={ex.image} alt={ex.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                    <div>
                      <p className="text-sm text-[#18181B]">{ex.name}</p>
                      <p className="text-xs text-[#18181B]/40">{ex.muscle} · {ex.equipment} · {ex.level}</p>
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && <p className="text-center text-xs text-[#18181B]/40 py-3">Không tìm thấy bài tập</p>}
              </div>
            )}
          </div>

          {/* Exercise list */}
          <div className="space-y-4">
            {exercises.map(ex => (
              <div key={ex.id} className="glass rounded-2xl border border-[#18181B]/10 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-[#18181B]/10">
                  <Dumbbell className="w-4 h-4 text-[#FF5722] shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-[#18181B]">{ex.name}</p>
                    <p className="text-xs text-[#18181B]/40">{ex.muscle} · {ex.equipment}</p>
                  </div>
                  <button onClick={() => removeExercise(ex.id)} className="text-[#18181B]/40 hover:text-red-400 transition-colors p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="px-5 py-3">
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {['Set', 'Reps', 'Weight (kg)', ''].map(h => (
                      <span key={h} className="text-xs text-[#18181B]/25 font-medium uppercase">{h}</span>
                    ))}
                  </div>
                  {ex.sets.map((set, i) => (
                    <div key={i} className="grid grid-cols-4 gap-2 mb-2 items-center">
                      <span className="text-sm text-[#18181B]/60">{i + 1}</span>
                      <input type="number" value={set.reps} onChange={e => updateSet(ex.id, i, 'reps', e.target.value)}
                        className="px-2 py-1.5 rounded-lg bg-white border border-[#18181B]/10 text-[#18181B] text-sm text-center focus:outline-none focus:border-[#FF5722]/50" />
                      <input type="number" value={set.weight} onChange={e => updateSet(ex.id, i, 'weight', e.target.value)}
                        className="px-2 py-1.5 rounded-lg bg-white border border-[#18181B]/10 text-[#18181B] text-sm text-center focus:outline-none focus:border-[#FF5722]/50" />
                      <button onClick={() => setExercises(prev => prev.map(e => e.id === ex.id ? { ...e, sets: e.sets.filter((_, si) => si !== i) } : e))}
                        className="text-[#18181B]/15 hover:text-red-400 flex items-center justify-center p-1 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addSet(ex.id)} className="flex items-center gap-1 text-xs text-[#FF5722] mt-1 hover:opacity-80 transition-opacity">
                    <Plus className="w-3 h-3" /> Thêm set
                  </button>
                </div>
              </div>
            ))}
          </div>

          {exercises.length > 0 && (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 glass rounded-xl p-3 border border-[#18181B]/10 text-center">
                <div>
                  <p className="text-lg font-black text-[#18181B]">{exercises.length}</p>
                  <p className="text-xs text-[#18181B]/40">Bài tập</p>
                </div>
                <div>
                  <p className="text-lg font-black text-[#18181B]">{exercises.reduce((s, e) => s + e.sets.length, 0)}</p>
                  <p className="text-xs text-[#18181B]/40">Sets</p>
                </div>
                <div>
                  <p className="text-lg font-black text-[#18181B]">
                    {(exercises.reduce((s, e) => s + e.sets.reduce((ss, set) => ss + set.weight * set.reps, 0), 0) / 1000).toFixed(1)}T
                  </p>
                  <p className="text-xs text-[#18181B]/40">Volume</p>
                </div>
              </div>
              {error && (
                <p className="text-xs text-red-400 text-center px-2">{error}</p>
              )}
              <button onClick={handleFinish} disabled={!name || loading}
                className="w-full py-3.5 rounded-xl bg-[#FF5722] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#FF5722]/90 transition-colors disabled:opacity-40">
                <CheckCircle className="w-4 h-4" />
                {loading ? 'Đang lưu...' : 'Kết thúc buổi tập'}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
