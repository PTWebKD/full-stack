import { useState, useEffect } from 'react';
import { Plus, Megaphone, Trash2 } from 'lucide-react';
import { api } from '../../services/api';

export default function GymAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', priority: 'medium' });

  useEffect(() => {
    api.get('/api/gym/announcements')
      .then(data => setAnnouncements(Array.isArray(data) ? data : []))
      .catch(() => setAnnouncements([]));
  }, []);

  const handleAdd = async () => {
    if (!form.title || !form.body) return;
    try {
      const ann = await api.post('/api/gym/announcements', form);
      setAnnouncements(prev => [ann, ...prev]);
      setForm({ title: '', body: '', priority: 'medium' });
      setShowForm(false);
    } catch { /* ignore */ }
  };

  const priorityColor = { high: 'bg-red-400/10 text-red-400 border-red-400/20', medium: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20', low: 'bg-green-400/10 text-green-400 border-green-400/20' };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#18181B]">Announcements</h2>
        <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5722] text-white text-sm font-bold hover:bg-[#FF5722]/90 transition-colors">
          <Plus className="w-4 h-4" /> New
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-5 border border-[#FF5722]/20 space-y-3">
          <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Title"
            className="w-full px-4 py-2.5 rounded-xl glass border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 focus:outline-none focus:border-[#FF5722]/50 text-sm"
          />
          <textarea value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} placeholder="Message..." rows={3}
            className="w-full px-4 py-2.5 rounded-xl glass border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 focus:outline-none focus:border-[#FF5722]/50 text-sm resize-none"
          />
          <div className="flex gap-2">
            {['low', 'medium', 'high'].map(p => (
              <button key={p} onClick={() => setForm(f => ({ ...f, priority: p }))}
                className={`flex-1 py-2 rounded-xl border text-xs font-medium capitalize transition-all ${form.priority === p ? priorityColor[p] : 'border-[#18181B]/10 text-[#18181B]/40'}`}>
                {p}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-xl glass border border-[#18181B]/10 text-[#18181B] text-sm">Cancel</button>
            <button onClick={handleAdd} disabled={!form.title || !form.body} className="flex-1 py-2 rounded-xl bg-[#FF5722] text-white text-sm font-bold disabled:opacity-40">Post</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {announcements.map(a => (
          <div key={a.announcement_id} className="glass rounded-2xl p-5 border border-[#18181B]/10">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Megaphone className={`w-4 h-4 mt-0.5 shrink-0 ${a.priority === 'high' ? 'text-red-400' : a.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'}`} />
                <div>
                  <p className="font-semibold text-[#18181B]">{a.title}</p>
                  <p className="text-sm text-[#18181B]/60 mt-1 leading-relaxed">{a.body}</p>
                  <p className="text-xs text-[#18181B]/40 mt-2">{new Date(a.created_at).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
              <button onClick={async () => {
                try {
                  await api.delete(`/api/gym/announcements/${a.announcement_id}`);
                  setAnnouncements(prev => prev.filter(x => x.announcement_id !== a.announcement_id));
                } catch { /* ignore */ }
              }} className="text-[#18181B]/40 hover:text-red-400 transition-colors shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <div className="glass rounded-2xl p-8 border border-[#18181B]/10 text-center text-[#18181B]/40">
            <p>Chưa có thông báo nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
