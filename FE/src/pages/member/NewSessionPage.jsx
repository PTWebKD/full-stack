import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, CheckCircle, Dumbbell, Search, Clock } from 'lucide-react';
import { mockExercises } from '../../data/mockGym';
import AiFoodSuggestion from '../../components/common/AiFoodSuggestion';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';


const getBaselinePR = (name) => {
  if (name.toLowerCase().includes('bench')) return 80;
  if (name.toLowerCase().includes('squat')) return 100;
  if (name.toLowerCase().includes('deadlift')) return 120;
  if (name.toLowerCase().includes('shoulder')) return 40;
  return 50;
};

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
  const [restTimeLeft, setRestTimeLeft] = useState(0);

  useEffect(() => {
    if (restTimeLeft <= 0) return;
    const timer = setInterval(() => {
      setRestTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [restTimeLeft]);

  const filtered = mockExercises.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  const addExercise = (ex) => {
    if (exercises.find(e => e.id === ex.id)) return;
    setExercises(prev => [...prev, { ...ex, notes: '', sets: [{ reps: 8, weight: 0, rpe: 7 }] }]);
    setSearch('');
  };

  const removeExercise = (id) => setExercises(prev => prev.filter(e => e.id !== id));

  const addSet = (id) => setExercises(prev => prev.map(e => e.id === id ? { ...e, sets: [...e.sets, { reps: 8, weight: 0, rpe: 7 }] } : e));

  const updateSet = (exId, setIdx, field, value) => {
    setExercises(prev => prev.map(e => e.id === exId ? {
      ...e, sets: e.sets.map((s, i) => i === setIdx ? { ...s, [field]: value === '' ? '' : Number(value) } : s)
    } : e));
  };

  const updateExerciseNotes = (exId, value) => {
    setExercises(prev => prev.map(e => e.id === exId ? { ...e, notes: value } : e));
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
          sets: ex.sets.map(s => ({
            reps: Number(s.reps) || 0,
            weight: Number(s.weight) || 0,
            rpe: s.rpe ? Number(s.rpe) : null
          })),
          notes: ex.notes || null,
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
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
          exercises={exercises}
          durationMin={elapsedMins}
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
                  <div className="grid grid-cols-5 gap-2 mb-2">
                    {['Set', 'Reps', 'Weight (kg)', 'RPE (1-10)', ''].map(h => (
                      <span key={h} className="text-xs text-[#18181B]/25 font-semibold uppercase text-center">{h}</span>
                    ))}
                  </div>
                  {ex.sets.map((set, i) => {
                    const isNewPR = set.weight > getBaselinePR(ex.name);
                    return (
                      <div key={i} className="grid grid-cols-5 gap-2 mb-2 items-center relative text-center">
                        <span className="text-sm text-[#18181B]/60 font-bold">{i + 1}</span>
                        
                        {/* Reps increment / decrement buttons */}
                        <div className="flex items-center gap-1 justify-center">
                          <button type="button" onClick={() => updateSet(ex.id, i, 'reps', Math.max(0, set.reps - 1))}
                            className="w-5 h-7 flex items-center justify-center bg-[#18181B]/5 hover:bg-[#18181B]/10 border border-[#18181B]/10 rounded-md text-[10px] font-bold transition-all select-none cursor-pointer">-</button>
                          <input type="number" value={set.reps} onChange={e => updateSet(ex.id, i, 'reps', e.target.value)}
                            className="w-9 py-1 rounded-lg bg-white border border-[#18181B]/10 text-[#18181B] text-xs text-center focus:outline-none focus:border-[#FF5722]/50" />
                          <button type="button" onClick={() => updateSet(ex.id, i, 'reps', set.reps + 1)}
                            className="w-5 h-7 flex items-center justify-center bg-[#18181B]/5 hover:bg-[#18181B]/10 border border-[#18181B]/10 rounded-md text-[10px] font-bold transition-all select-none cursor-pointer">+</button>
                        </div>

                        {/* Weight increment / decrement buttons */}
                        <div className="flex items-center gap-1 justify-center relative">
                          <button type="button" onClick={() => updateSet(ex.id, i, 'weight', Math.max(0, set.weight - 2.5))}
                            className="w-5 h-7 flex items-center justify-center bg-[#18181B]/5 hover:bg-[#18181B]/10 border border-[#18181B]/10 rounded-md text-[10px] font-bold transition-all select-none cursor-pointer">-</button>
                          <input type="number" value={set.weight} onChange={e => updateSet(ex.id, i, 'weight', e.target.value)}
                            className="w-11 py-1 rounded-lg bg-white border border-[#18181B]/10 text-[#18181B] text-xs text-center focus:outline-none focus:border-[#FF5722]/50" />
                          <button type="button" onClick={() => updateSet(ex.id, i, 'weight', set.weight + 2.5)}
                            className="w-5 h-7 flex items-center justify-center bg-[#18181B]/5 hover:bg-[#18181B]/10 border border-[#18181B]/10 rounded-md text-[10px] font-bold transition-all select-none cursor-pointer">+</button>
                          {isNewPR && (
                            <span className="absolute -top-3.5 -right-3.5 px-1 py-0.5 rounded bg-[#FF5722] text-[6px] font-black text-white uppercase tracking-wider animate-bounce shadow">PR!</span>
                          )}
                        </div>

                        {/* RPE selection input */}
                        <div className="flex justify-center">
                          <select
                            value={set.rpe || 7}
                            onChange={e => updateSet(ex.id, i, 'rpe', e.target.value)}
                            className="w-16 py-1 rounded-lg bg-white border border-[#18181B]/10 text-[#18181B] text-xs focus:outline-none focus:border-[#FF5722]/50 text-center font-semibold"
                          >
                            {[...Array(10)].map((_, idx) => (
                              <option key={idx + 1} value={idx + 1}>RPE {idx + 1}</option>
                            ))}
                          </select>
                        </div>

                        <button onClick={() => setExercises(prev => prev.map(e => e.id === ex.id ? { ...e, sets: e.sets.filter((_, si) => si !== i) } : e))}
                          className="text-[#18181B]/15 hover:text-red-400 flex items-center justify-center p-1 transition-colors mx-auto">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}

                  {/* Feel / notes field for AI Recommendation feedback */}
                  <div className="mt-3">
                    <input
                      type="text"
                      value={ex.notes || ''}
                      onChange={e => updateExerciseNotes(ex.id, e.target.value)}
                      placeholder="Ghi chú cảm nhận (ví dụ: khớp gối nhói nhẹ, quá tải, mỏi cơ...)"
                      className="w-full px-3 py-1.5 rounded-lg bg-white/50 border border-[#18181B]/10 text-xs text-[#18181B] placeholder-[#18181B]/40 focus:outline-none focus:border-[#FF5722]/50"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-1 border-t border-[#18181B]/5">
                    <button onClick={() => addSet(ex.id)} className="flex items-center gap-1 text-xs text-[#FF5722] hover:opacity-80 transition-opacity">
                      <Plus className="w-3 h-3" /> Thêm set
                    </button>
                    <button onClick={() => setRestTimeLeft(90)} className="flex items-center gap-1 text-xs text-[#18181B]/60 hover:text-[#FF5722] transition-colors">
                      <Clock className="w-3.5 h-3.5 text-[#FF5722]" /> Nghỉ 90s
                    </button>
                  </div>
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

      {/* Floating Rest Timer Widget */}
      {restTimeLeft > 0 && (
        <div className="fixed bottom-6 right-6 z-40 glass border border-[#FF5722]/30 rounded-2xl p-4 shadow-xl flex items-center gap-4 max-w-sm">
          <div className="w-10 h-10 rounded-full border-2 border-[#FF5722] flex items-center justify-center text-xs font-black text-[#FF5722]">
            {Math.floor(restTimeLeft / 60)}:{(restTimeLeft % 60).toString().padStart(2, '0')}
          </div>
          <div>
            <p className="text-xs font-bold text-[#18181B]">Thời gian nghỉ</p>
            <div className="flex items-center gap-2 mt-1">
              <button onClick={() => setRestTimeLeft(prev => prev + 30)} className="text-[10px] bg-[#18181B]/5 hover:bg-[#18181B]/10 text-[#18181B]/80 px-2 py-1 rounded-md font-bold transition-all">
                +30s
              </button>
              <button onClick={() => setRestTimeLeft(0)} className="text-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-400 px-2 py-1 rounded-md font-bold transition-all">
                Bỏ qua
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
