import { useState } from 'react';
import { ShoppingBag, Plus, Edit2, Eye, EyeOff, Package, Search, Tag } from 'lucide-react';

const mockGear = [
  { id: 1, name: 'Tạ Tay 5kg (cặp)', category: 'Tạ', price_sale: 850000, price_rental: 15000, stock: 12, is_for_sale: true, is_for_rental: true, status: 'active' },
  { id: 2, name: 'Dây Nhảy Cao Cấp', category: 'Cardio', price_sale: 250000, price_rental: 8000, stock: 25, is_for_sale: true, is_for_rental: true, status: 'active' },
  { id: 3, name: 'Thảm Yoga 6mm', category: 'Phụ kiện', price_sale: 320000, price_rental: 10000, stock: 30, is_for_sale: true, is_for_rental: true, status: 'active' },
  { id: 4, name: 'Bao Tay Tập Gym', category: 'Phụ kiện', price_sale: 180000, price_rental: null, stock: 8, is_for_sale: true, is_for_rental: false, status: 'active' },
  { id: 5, name: 'Đai Lưng Squat', category: 'Hỗ trợ', price_sale: 450000, price_rental: 20000, stock: 5, is_for_sale: true, is_for_rental: true, status: 'active' },
  { id: 6, name: 'Máy Chạy Bộ Mini', category: 'Cardio', price_sale: null, price_rental: 150000, stock: 3, is_for_sale: false, is_for_rental: true, status: 'active' },
];

export default function GymOwnerGearProductsPage() {
  const [gear, setGear] = useState(mockGear);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const categories = ['all', ...new Set(mockGear.map(g => g.category))];

  const filtered = gear.filter(g =>
    (category === 'all' || g.category === category) &&
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id) => {
    setGear(prev => prev.map(g =>
      g.id === id ? { ...g, status: g.status === 'active' ? 'hidden' : 'active' } : g
    ));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-[#18181B]">Quản Lý Gear Marketplace</h2>
          <p className="text-sm text-[#18181B]/60">Catalog thiết bị bán & cho thuê</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF5722] text-white text-sm font-bold hover:bg-[#FF5722]/90 transition-colors">
          <Plus className="w-4 h-4" /> Thêm Gear
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Tổng sản phẩm', value: gear.length, icon: Package, color: '#FF5722' },
          { label: 'Đang bán', value: gear.filter(g => g.is_for_sale).length, icon: Tag, color: '#FF5722' },
          { label: 'Cho thuê', value: gear.filter(g => g.is_for_rental).length, icon: ShoppingBag, color: '#a855f7' },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-4 border border-[#18181B]/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15` }}>
                <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-2xl font-black text-[#18181B]">{s.value}</p>
            <p className="text-xs text-[#18181B]/60">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#18181B]/40" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 text-sm focus:outline-none focus:border-[#FF5722]/50"
          />
        </div>
        <div className="flex gap-1">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${category === c ? 'bg-[#FF5722]/10 text-[#FF5722] border border-[#FF5722]/20' : 'glass border border-[#18181B]/10 text-[#18181B]/60'}`}>
              {c === 'all' ? 'Tất cả' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl border border-[#18181B]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#18181B]/10 bg-[#18181B]/[0.02]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#18181B]/60">Tên sản phẩm</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#18181B]/60">Loại</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#18181B]/60">Giá bán</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#18181B]/60">Giá thuê/ngày</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#18181B]/60">Tồn kho</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-[#18181B]/60">Trạng thái</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-[#18181B]/60">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18181B]/6">
              {filtered.map(item => (
                <tr key={item.id} className={`hover:bg-[#18181B]/[0.02] transition-colors ${item.status === 'hidden' ? 'opacity-50' : ''}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FF5722]/10 flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-4 h-4 text-[#FF5722]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#18181B]">{item.name}</p>
                        <div className="flex gap-1 mt-0.5">
                          {item.is_for_sale && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600 font-semibold">Bán</span>}
                          {item.is_for_rental && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-600 font-semibold">Thuê</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#18181B]/60">{item.category}</td>
                  <td className="px-4 py-3 text-right font-medium text-[#18181B]">
                    {item.price_sale ? `${item.price_sale.toLocaleString('vi-VN')}đ` : '—'}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-[#18181B]">
                    {item.price_rental ? `${item.price_rental.toLocaleString('vi-VN')}đ` : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-bold ${item.stock <= 5 ? 'text-amber-500' : 'text-[#18181B]'}`}>{item.stock}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-[#18181B]/10 text-[#18181B]/50'}`}>
                      {item.status === 'active' ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-[#18181B]/5 text-[#18181B]/50 hover:text-[#FF5722] transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => toggleStatus(item.id)} className="p-1.5 rounded-lg hover:bg-[#18181B]/5 text-[#18181B]/50 hover:text-[#18181B] transition-colors">
                        {item.status === 'active' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
