import { Link } from 'react-router-dom';
import { Plus, Edit2, QrCode, ShieldCheck, TrendingUp, Package, Store, Key } from 'lucide-react';
import { mockGear } from '../../data/mockGear';
import { useAuth } from '../../context/AuthContext';

export default function GearManagePage() {
  const { user } = useAuth();
  const myGear = mockGear.slice(0, 5);
  const totalRevenue = myGear.reduce((s, g) => s + g.price * 12, 0);
  const fmt = (n) => n.toLocaleString('vi-VN');
  const isGymOwner = user?.role === 'gymOwner';

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <div className="glass rounded-2xl border border-[#f97316]/20 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#f97316]">
              <Store className="h-4 w-4" /> {isGymOwner ? 'Gym Owner Gear Business' : 'Member Community Listings'}
            </p>
            <h2 className="mt-1 text-lg font-bold text-white">
              {isGymOwner ? 'Danh sách bán & cho thuê' : 'Danh sách cho thuê của tôi'}
            </h2>
            <p className="mt-1 text-sm text-white/50">
              {isGymOwner
                ? 'Gym Owner quản lý kho thiết bị để member mua hoặc thuê từ Gear Hub.'
                : 'Quản lý thiết bị cá nhân bạn đăng để cho thuê. Member không được bán gear trực tiếp (BR-11B).'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-[#f97316]/25 bg-[#f97316]/10 px-3 py-1.5 font-semibold text-[#f97316]">
              {isGymOwner ? 'Gym Owner listings' : 'Member rental listings'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#7dd3fc]/25 bg-[#003a5a]/15 px-3 py-1.5 font-semibold text-[#7dd3fc]">
              <Key className="h-3.5 w-3.5" /> {isGymOwner ? 'Bán & Cho thuê' : 'Chỉ cho thuê'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <Link to="/gear/sell" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f97316] text-white text-sm font-bold hover:bg-[#f97316]/90 transition-colors">
          <Plus className="w-4 h-4" /> {isGymOwner ? 'Đăng sản phẩm' : 'Đăng cho thuê'}
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Products', value: myGear.length, icon: Package, color: '#f97316' },
          { label: 'Verified', value: myGear.filter(g => g.verified).length, icon: ShieldCheck, color: '#003a5a' },
          { label: 'Est. Revenue', value: `${(totalRevenue / 1000000).toFixed(0)}M`, icon: TrendingUp, color: '#00d4ff' },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-4 border border-white/5 text-center">
            <p className="text-2xl font-black text-white mb-1">{s.value}</p>
            <p className="text-xs text-white/40">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="divide-y divide-white/5">
          {myGear.map(g => (
            <div key={g.id} className="flex items-center gap-4 px-5 py-4">
              <img src={g.image} alt={g.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white truncate">{g.name}</p>
                  {g.verified && <ShieldCheck className="w-3.5 h-3.5 text-[#7dd3fc] shrink-0" />}
                </div>
                <p className="text-xs text-white/40">{g.category} · Stock: {g.stock}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">{fmt(g.price)}đ</p>
                <p className="text-xs text-yellow-400">{g.rating}★ ({g.reviews})</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg glass border border-white/10 text-white/40 hover:text-[#f97316] hover:border-[#f97316]/30 transition-colors">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button className="p-2 rounded-lg glass border border-white/10 text-white/40 hover:text-[#00d4ff] hover:border-[#00d4ff]/30 transition-colors">
                  <QrCode className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
