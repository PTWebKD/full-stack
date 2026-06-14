import { useState } from 'react';
import { Search, UserCheck, UserX, Shield } from 'lucide-react';
import { mockAllUsers } from '../../data/mockAdmin';

const roleColors = { member: '#003a5a', vendor: '#00d4ff', gymOwner: '#a855f7' };

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState(mockAllUsers);

  const filtered = users.filter(u =>
    (roleFilter === 'all' || u.role === roleFilter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleStatus = (id) => setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none" />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl glass border border-white/10 text-sm text-white bg-transparent focus:outline-none">
          <option value="all" className="bg-[#0d1117]">All Roles</option>
          {['member', 'vendor', 'gymOwner'].map(r => (
            <option key={r} value={r} className="bg-[#0d1117] capitalize">{r}</option>
          ))}
        </select>
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 border-b border-white/5 text-xs text-white/30 uppercase tracking-wider font-medium">
          <span className="col-span-3">User</span>
          <span className="col-span-3">Email</span>
          <span className="col-span-2">Role</span>
          <span className="col-span-2">Revenue</span>
          <span className="col-span-1">Status</span>
          <span className="col-span-1">Action</span>
        </div>
        <div className="divide-y divide-white/5">
          {filtered.map(u => (
            <div key={u.id} className="grid grid-cols-12 px-5 py-3 items-center">
              <div className="col-span-3 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: `${roleColors[u.role] || '#003a5a'}20` }}>
                  <Shield className="w-3.5 h-3.5" style={{ color: roleColors[u.role] }} />
                </div>
                <p className="text-sm text-white truncate">{u.name}</p>
              </div>
              <p className="col-span-3 text-xs text-white/40 truncate">{u.email}</p>
              <span className="col-span-2 text-xs px-2 py-0.5 rounded-full w-fit capitalize" style={{ background: `${roleColors[u.role]}15`, color: roleColors[u.role] }}>{u.role}</span>
              <p className="col-span-2 text-xs text-white/60">{(u.revenue / 1000000).toFixed(1)}M</p>
              <span className={`col-span-1 text-xs ${u.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>{u.status}</span>
              <button onClick={() => toggleStatus(u.id)} className={`col-span-1 p-1.5 rounded-lg w-fit transition-colors ${u.status === 'active' ? 'text-white/30 hover:text-red-400 hover:bg-red-400/10' : 'text-white/30 hover:text-green-400 hover:bg-green-400/10'}`}>
                {u.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
