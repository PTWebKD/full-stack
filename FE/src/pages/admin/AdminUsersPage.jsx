import { useState } from 'react';
import { Search, UserCheck, UserX, Shield } from 'lucide-react';
import { mockAllUsers } from '../../data/mockAdmin';

const roleColors = { member: '#FF5722', gymOwner: '#a855f7' };

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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#18181B]/40" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm người dùng..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-[#18181B]/10 text-sm text-[#18181B] placeholder-[#18181B]/40 focus:outline-none" />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl glass border border-[#18181B]/10 text-sm text-[#18181B] bg-transparent focus:outline-none">
          <option value="all" className="bg-white">Tất Cả Vai Trò</option>
          {['member', 'gymOwner'].map(r => (
            <option key={r} value={r} className="bg-white">{r === 'gymOwner' ? 'Chủ Phòng Gym' : 'Hội Viên'}</option>
          ))}
        </select>
      </div>

      <div className="glass rounded-2xl border border-[#18181B]/10 overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 border-b border-[#18181B]/10 text-xs text-[#18181B]/40 uppercase tracking-wider font-medium">
          <span className="col-span-3">Người Dùng</span>
          <span className="col-span-3">Email</span>
          <span className="col-span-2">Vai Trò</span>
          <span className="col-span-2">Doanh Thu</span>
          <span className="col-span-1">Trạng Thái</span>
          <span className="col-span-1">Hành Động</span>
        </div>
        <div className="divide-y divide-[#18181B]/6">
          {filtered.map(u => (
            <div key={u.id} className="grid grid-cols-12 px-5 py-3 items-center">
              <div className="col-span-3 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: `${roleColors[u.role] || '#FF5722'}20` }}>
                  <Shield className="w-3.5 h-3.5" style={{ color: roleColors[u.role] || '#FF5722' }} />
                </div>
                <p className="text-sm text-[#18181B] truncate">{u.name}</p>
              </div>
              <p className="col-span-3 text-xs text-[#18181B]/60 truncate">{u.email}</p>
              <span className="col-span-2 text-xs px-2 py-0.5 rounded-full w-fit" style={{ background: `${roleColors[u.role]}15`, color: roleColors[u.role] }}>{u.role === 'gymOwner' ? 'Chủ phòng gym' : 'Hội viên'}</span>
              <p className="col-span-2 text-xs text-[#18181B]/60">{(u.revenue / 1000000).toFixed(1)}M đ</p>
              <span className={`col-span-1 text-xs ${u.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>{u.status === 'active' ? 'Đang hoạt động' : 'Tạm khóa'}</span>
              <button onClick={() => toggleStatus(u.id)} className={`col-span-1 p-1.5 rounded-lg w-fit transition-colors ${u.status === 'active' ? 'text-[#18181B]/40 hover:text-red-500 hover:bg-red-500/10' : 'text-[#18181B]/40 hover:text-green-500 hover:bg-green-500/10'}`}>
                {u.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
