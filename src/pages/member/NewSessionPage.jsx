import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, CheckCircle, Dumbbell, Search, Clock } from 'lucide-react';
import { mockExercises } from '../../data/mockGym';
import AiFoodSuggestion from '../../components/common/AiFoodSuggestion';

const PR_BASELINES = {
  'Bench Press': 100,
  'Deadlift': 150,
  'Squat': 130,
  'Shoulder Press': 60,
  'Overhead Press': 60,
};

export default function NewSessionPage() {
  const [name, setName] = useState('');
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState('');
  const [done, setDone] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [finishedSession, setFinishedSession] = useState(null);
  const [startTime] = useState(Date.now());
  const [newPRs, setNewPRs] = useState([]);
  const [showPRToast, setShowPRToast] = useState(false);
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
    await new Promise(r => setTimeout(r, 600));
    const session = { name, exercises, duration: Math.round((Date.now() - startTime) / 60000) || 45 };
    setFinishedSession(session);
    // Check for new PRs
    const prs = [];
    exercises.forEach(ex => {
      const maxWeight = Math.max(...ex.sets.map(s => s.weight));
      const baseline = PR_BASELINES[ex.name];
      if (baseline !== undefined && maxWeight > baseline) {
        prs.push({ exercise: ex.name, weight: maxWeight });
      }
    });
    if (prs.length > 0) {
      setNewPRs(prs);
      setShowPRToast(true);
      setTimeout(() => {
        setShowPRToast(false);
        setDone(true);
        setShowAI(true);
      }, 3000);
    } else {
      setDone(true);
      setShowAI(true);
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
          <div className="glass-dark rounded-2xl p-8 border border-[#003a5a]/30 text-center max-w-sm mx-4 shadow-2xl">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="text-2xl font-black text-[#7dd3fc] mb-2">NEW PR!</h2>
            <div className="space-y-2 mb-4">
              {newPRs.map((pr, i) => (
                <p key={i} className="text-white font-semibold text-lg">
                  🎉 {pr.exercise}: <span className="text-[#f97316]">{pr.weight}kg</span>
                </p>
              ))}
            </div>
            <p className="text-white/40 text-sm">Personal Record mới! +30 FitCoin</p>
          </div>
        </div>
      )}

      {showAI && finishedSession && (
        <AiFoodSuggestion session={finishedSession} onClose={handleAIClose} />
      )}

      {!done && (
        <div className="space-y-5 max-w-2xl mx-auto">
          {/* Header with timer */}
          <div className="flex items-center gap-3">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Tên buổi tập (VD: Upper Power)"
              className="flex-1 px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#003a5a]/50 text-lg font-bold"
            />
            <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl glass border border-white/10 text-white/50 text-sm shrink-0">
              <Clock className="w-4 h-4" />
              <span>{elapsedMins}m</span>
            </div>
          </div>

          {/* Exercise search */}
          <div className="glass rounded-2xl p-4 border border-white/5">
            <p className="text-xs text-white/40 mb-3 font-medium uppercase tracking-wider">Thêm bài tập</p>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm bài tập..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#003a5a]/50 text-sm"
              />
            </div>
            {search && (
              <div className="space-y-1 max-h-44 overflow-y-auto">
                {filtered.slice(0, 6).map(ex => (
                  <button key={ex.id} onClick={() => addExercise(ex)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left">
                    <img src={ex.image} alt={ex.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                    <div>
                      <p className="text-sm text-white">{ex.name}</p>
                      <p className="text-xs text-white/30">{ex.muscle} · {ex.equipment} · {ex.level}</p>
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && <p className="text-center text-xs text-white/30 py-3">Không tìm thấy bài tập</p>}
              </div>
            )}
          </div>

          {/* Exercise list */}
          <div className="space-y-4">
            {exercises.map(ex => (
              <div key={ex.id} className="glass rounded-2xl border border-white/5 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5">
                  <Dumbbell className="w-4 h-4 text-[#7dd3fc] shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-white">{ex.name}</p>
                    <p className="text-xs text-white/30">{ex.muscle} · {ex.equipment}</p>
                  </div>
                  <button onClick={() => removeExercise(ex.id)} className="text-white/20 hover:text-red-400 transition-colors p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="px-5 py-3">
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {['Set', 'Reps', 'Weight (kg)', ''].map(h => (
                      <span key={h} className="text-xs text-white/25 font-medium uppercase">{h}</span>
                    ))}
                  </div>
                  {ex.sets.map((set, i) => (
                    <div key={i} className="grid grid-cols-4 gap-2 mb-2 items-center">
                      <span className="text-sm text-white/40">{i + 1}</span>
                      <input type="number" value={set.reps} onChange={e => updateSet(ex.id, i, 'reps', e.target.value)}
                        className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm text-center focus:outline-none focus:border-[#003a5a]/50" />
                      <input type="number" value={set.weight} onChange={e => updateSet(ex.id, i, 'weight', e.target.value)}
                        className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm text-center focus:outline-none focus:border-[#003a5a]/50" />
                      <button onClick={() => setExercises(prev => prev.map(e => e.id === ex.id ? { ...e, sets: e.sets.filter((_, si) => si !== i) } : e))}
                        className="text-white/15 hover:text-red-400 flex items-center justify-center p-1 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addSet(ex.id)} className="flex items-center gap-1 text-xs text-[#7dd3fc] mt-1 hover:opacity-80 transition-opacity">
                    <Plus className="w-3 h-3" /> Thêm set
                  </button>
                </div>
              </div>
            ))}
          </div>

          {exercises.length > 0 && (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 glass rounded-xl p-3 border border-white/5 text-center">
                <div>
                  <p className="text-lg font-black text-white">{exercises.length}</p>
                  <p className="text-xs text-white/30">Bài tập</p>
                </div>
                <div>
                  <p className="text-lg font-black text-white">{exercises.reduce((s, e) => s + e.sets.length, 0)}</p>
                  <p className="text-xs text-white/30">Sets</p>
                </div>
                <div>
                  <p className="text-lg font-black text-white">
                    {(exercises.reduce((s, e) => s + e.sets.reduce((ss, set) => ss + set.weight * set.reps, 0), 0) / 1000).toFixed(1)}T
                  </p>
                  <p className="text-xs text-white/30">Volume</p>
                </div>
              </div>
              <button onClick={handleFinish} disabled={!name}
                className="w-full py-3.5 rounded-xl bg-[#003a5a] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#003a5a]/90 transition-colors disabled:opacity-40">
                <CheckCircle className="w-4 h-4" /> Kết thúc buổi tập
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
