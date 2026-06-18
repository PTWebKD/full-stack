import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserCheck, UserX, Award } from 'lucide-react';
import { mockAllUsers } from '../../data/mockAdmin';

export default function GymMembersPage() {
  const [search, setSearch] = useState('');
  const members = mockAllUsers.filter(u => u.role === 'member');
  const filtered = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Hội Viên ({members.length})</h2>
        <button className="px-4 py-2 rounded-xl glass border border-white/10 text-sm text-white/60 hover:text-white">Export CSV</button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm hội viên..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none" />
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 border-b border-white/5 text-xs text-white/30 uppercase tracking-wider font-medium">
          <span className="col-span-4">Member</span>
          <span className="col-span-3">Email</span>
          <span className="col-span-2">Plan</span>
          <span className="col-span-2">Joined</span>
          <span className="col-span-1">Status</span>
        </div>
        <div className="divide-y divide-white/5">
          {filtered.map(m => (
            <Link key={m.id} to={`/gym-owner/members/${m.id}`} className="grid grid-cols-12 px-5 py-3 items-center hover:bg-white/[0.02] transition-all duration-150 cursor-pointer block">
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#003a5a]/10 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-[#7dd3fc]" />
                </div>
                <p className="text-sm text-white truncate">{m.name}</p>
              </div>
              <p className="col-span-3 text-xs text-white/40 truncate">{m.email}</p>
              <span className={`col-span-2 text-xs px-2 py-0.5 rounded-full w-fit capitalize ${m.plan === 'yearly' ? 'bg-[#f97316]/10 text-[#f97316]' : 'bg-[#003a5a]/10 text-[#7dd3fc]'}`}>{m.plan}</span>
              <p className="col-span-2 text-xs text-white/40">{m.joinedAt}</p>
              <div className={`col-span-1 flex items-center gap-1 text-xs ${m.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                {m.status === 'active' ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
