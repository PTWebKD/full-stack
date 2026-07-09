import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserCheck, UserX, Award } from 'lucide-react';
import { mockAllUsers } from '../../data/mockAdmin';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function GymMembersPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [realMembers, setRealMembers] = useState([]);
  
  useEffect(() => {
    if (user?.role === 'gymOwner') {
      api.get('/api/gym/mine/members')
        .then(data => setRealMembers(data || []))
        .catch(err => console.error("Could not load real members:", err));
    }
  }, [user]);

  // Merge real members with mock members (avoiding duplicate IDs if they overlap, though they shouldn't)
  const mockMembers = mockAllUsers.filter(u => u.role === 'member');
  const allMembers = [...realMembers, ...mockMembers];
  
  const filtered = allMembers.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#18181B]">Hội Viên ({allMembers.length})</h2>
        <button className="px-4 py-2 rounded-xl glass border border-[#18181B]/10 text-sm text-[#18181B]/60 hover:text-[#18181B]">Export CSV</button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#18181B]/40" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm hội viên..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-[#18181B]/10 text-sm text-[#18181B] placeholder-[#18181B]/40 focus:outline-none" />
      </div>

      <div className="glass rounded-2xl border border-[#18181B]/10 overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 border-b border-[#18181B]/10 text-xs text-[#18181B]/40 uppercase tracking-wider font-medium">
          <span className="col-span-4">Member</span>
          <span className="col-span-3">Email</span>
          <span className="col-span-2">Plan</span>
          <span className="col-span-2">Joined</span>
          <span className="col-span-1">Status</span>
        </div>
        <div className="divide-y divide-[#18181B]/6">
          {filtered.map(m => (
            <Link key={m.id} to={`/gym-owner/members/${m.id}`} className="grid grid-cols-12 px-5 py-3 items-center hover:bg-white/[0.02] transition-all duration-150 cursor-pointer block">
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FF5722]/10 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-[#FF5722]" />
                </div>
                <p className="text-sm text-[#18181B] truncate">{m.name}</p>
              </div>
              <p className="col-span-3 text-xs text-[#18181B]/60 truncate">{m.email}</p>
              <span className={`col-span-2 text-xs px-2 py-0.5 rounded-full w-fit capitalize ${m.plan === 'yearly' ? 'bg-[#FF5722]/10 text-[#FF5722]' : 'bg-[#FF5722]/10 text-[#FF5722]'}`}>{m.plan}</span>
              <p className="col-span-2 text-xs text-[#18181B]/60">{m.joinedAt}</p>
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
