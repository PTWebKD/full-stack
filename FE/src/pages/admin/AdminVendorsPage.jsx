import { useState } from 'react';
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { mockVendorApplications } from '../../data/mockAdmin';

export default function AdminVendorsPage() {
  const [apps, setApps] = useState(mockVendorApplications);

  const update = (id, status) => setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <h2 className="text-lg font-bold text-white">Vendor Applications ({apps.filter(a => a.status === 'pending').length} pending)</h2>
      <div className="space-y-3">
        {apps.map(a => (
          <div key={a.id} className="glass rounded-2xl p-5 border border-white/5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{a.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${a.type === 'food' ? 'bg-[#00d4ff]/10 text-[#00d4ff]' : 'bg-[#f97316]/10 text-[#f97316]'}`}>{a.type}</span>
                </div>
                <p className="text-sm text-white/50">{a.owner} · {a.email}</p>
                <p className="text-xs text-white/20 mt-1">Applied {a.appliedAt}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${a.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400' : a.status === 'approved' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                {a.status === 'pending' ? <Clock className="w-3 h-3" /> : a.status === 'approved' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {a.status}
              </span>
            </div>
            <div className="flex gap-2 text-xs text-white/40 mb-4">
              {a.documents.map(doc => (
                <span key={doc} className="flex items-center gap-1 px-2 py-1 rounded-lg glass border border-white/5">
                  <FileText className="w-3 h-3" />{doc}
                </span>
              ))}
            </div>
            {a.status === 'pending' && (
              <div className="flex gap-2">
                <button onClick={() => update(a.id, 'approved')} className="flex-1 py-2 rounded-xl bg-[#003a5a] text-white text-sm font-bold flex items-center justify-center gap-1 hover:bg-[#003a5a]/90">
                  <CheckCircle className="w-3.5 h-3.5" /> Approve
                </button>
                <button onClick={() => update(a.id, 'rejected')} className="flex-1 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold flex items-center justify-center gap-1 hover:bg-red-500/20">
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
