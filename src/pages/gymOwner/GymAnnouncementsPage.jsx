import { useState } from 'react';
import { Plus, Megaphone, Trash2 } from 'lucide-react';
import { mockGymAnnouncements } from '../../data/mockGym';

export default function GymAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(mockGymAnnouncements);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', priority: 'medium' });

  const handleAdd = () => {
    if (!form.title || !form.body) return;
    setAnnouncements(prev => [{ id: Date.now(), ...form, date: new Date().toISOString().split('T')[0] }, ...prev]);
    setForm({ title: '', body: '', priority: 'medium' });
    setShowForm(false);
  };

  const priorityColor = { high: 'bg-red-400/10 text-red-400 border-red-400/20', medium: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20', low: 'bg-green-400/10 text-green-400 border-green-400/20' };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Announcements</h2>
        <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#003a5a] text-white text-sm font-bold hover:bg-[#003a5a]/90 transition-colors">
          <Plus className="w-4 h-4" /> New
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-5 border border-[#003a5a]/20 space-y-3">
          <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Title"
            className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#003a5a]/50 text-sm"
          />
          <textarea value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} placeholder="Message..." rows={3}
            className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#003a5a]/50 text-sm resize-none"
          />
          <div className="flex gap-2">
            {['low', 'medium', 'high'].map(p => (
              <button key={p} onClick={() => setForm(f => ({ ...f, priority: p }))}
                className={`flex-1 py-2 rounded-xl border text-xs font-medium capitalize transition-all ${form.priority === p ? priorityColor[p] : 'border-white/5 text-white/30'}`}>
                {p}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-xl glass border border-white/10 text-white text-sm">Cancel</button>
            <button onClick={handleAdd} disabled={!form.title || !form.body} className="flex-1 py-2 rounded-xl bg-[#003a5a] text-white text-sm font-bold disabled:opacity-40">Post</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {announcements.map(a => (
          <div key={a.id} className="glass rounded-2xl p-5 border border-white/5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Megaphone className={`w-4 h-4 mt-0.5 shrink-0 ${a.priority === 'high' ? 'text-red-400' : a.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'}`} />
                <div>
                  <p className="font-semibold text-white">{a.title}</p>
                  <p className="text-sm text-white/60 mt-1 leading-relaxed">{a.body}</p>
                  <p className="text-xs text-white/20 mt-2">{a.date}</p>
                </div>
              </div>
              <button onClick={() => setAnnouncements(prev => prev.filter(x => x.id !== a.id))} className="text-white/20 hover:text-red-400 transition-colors shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
