import { useState } from 'react';
import { ShieldAlert, CheckCircle } from 'lucide-react';
import { mockDisputes } from '../../data/mockAdmin';

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState(mockDisputes);

  const resolve = (id) => setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: 'resolved' } : d));

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <h2 className="text-lg font-bold text-white">Gear Disputes</h2>
      <div className="space-y-3">
        {disputes.map(d => (
          <div key={d.id} className="glass rounded-2xl p-5 border border-white/5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-3">
                <ShieldAlert className={`w-4 h-4 mt-0.5 shrink-0 ${d.status === 'open' ? 'text-red-400' : d.status === 'investigating' ? 'text-yellow-400' : 'text-green-400'}`} />
                <div>
                  <p className="font-semibold text-white">{d.issue}</p>
                  <p className="text-xs text-white/40 mt-0.5">
                    <span className="font-medium text-white/60">Buyer:</span> {d.buyer} · <span className="font-medium text-white/60">Seller:</span> {d.seller}
                  </p>
                  <p className="text-xs text-white/30 mt-0.5">{d.orderId} · {d.item} · {d.createdAt}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 capitalize ${d.status === 'open' ? 'bg-red-400/10 text-red-400' : d.status === 'investigating' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-green-400/10 text-green-400'}`}>
                {d.status}
              </span>
            </div>
            {d.status !== 'resolved' && (
              <div className="flex gap-2 mt-3">
                <button onClick={() => resolve(d.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#003a5a] text-white text-xs font-bold hover:bg-[#003a5a]/90">
                  <CheckCircle className="w-3.5 h-3.5" /> Mark Resolved
                </button>
                <button className="px-4 py-2 rounded-xl glass border border-white/10 text-xs text-white/60 hover:text-white">Contact Parties</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
