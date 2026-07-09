import { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Edit2, Eye, EyeOff, Package, Search, Tag, X } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const mockGear = [
  { id: 1, name: 'Tạ Tay 5kg (cặp)', category: 'Tạ', price_sale: 850000, price_rental: 15000, stock: 12, is_for_sale: true, is_for_rental: true, status: 'active' },
  { id: 2, name: 'Dây Nhảy Cao Cấp', category: 'Cardio', price_sale: 250000, price_rental: 8000, stock: 25, is_for_sale: true, is_for_rental: true, status: 'active' },
  { id: 3, name: 'Thảm Yoga 6mm', category: 'Phụ kiện', price_sale: 320000, price_rental: 10000, stock: 30, is_for_sale: true, is_for_rental: true, status: 'active' },
  { id: 4, name: 'Bao Tay Tập Gym', category: 'Phụ kiện', price_sale: 180000, price_rental: null, stock: 8, is_for_sale: true, is_for_rental: false, status: 'active' },
  { id: 5, name: 'Đai Lưng Squat', category: 'Hỗ trợ', price_sale: 450000, price_rental: 20000, stock: 5, is_for_sale: true, is_for_rental: true, status: 'active' },
  { id: 6, name: 'Máy Chạy Bộ Mini', category: 'Cardio', price_sale: null, price_rental: 150000, stock: 3, is_for_sale: false, is_for_rental: true, status: 'active' },
];

export default function GymOwnerGearProductsPage() {
  const { user } = useAuth();
  const [gear, setGear] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGear, setNewGear] = useState({
    name: '', category: 'Weights', listing_type: 'both',
    sell_price: '', rent_price_day: '', rent_price_week: '', condition_rating: 10
  });

  const loadGear = async () => {
    try {
      const data = await api.get('/api/gear');
      // format to match UI structure
      const formatted = data.filter(g => g.current_owner_id === user?.user_id).map(g => ({
        id: g.gear_id,
        name: g.name,
        category: g.category,
        price_sale: g.sell_price,
        price_rental: g.rent_price_day,
        stock: 1, // backend model doesn't have stock natively, default to 1
        is_for_sale: g.listing_type === 'sell' || g.listing_type === 'both',
        is_for_rental: g.listing_type === 'rent' || g.listing_type === 'both',
        status: g.is_available ? 'active' : 'hidden'
      }));
      setGear([...formatted, ...mockGear]);
    } catch (err) {
      console.error(err);
      setGear(mockGear);
    }
  };

  useEffect(() => {
    loadGear();
  }, [user]);

  const categories = ['all', ...new Set(mockGear.map(g => g.category))];

  const filtered = gear.filter(g =>
    (category === 'all' || g.category === category) &&
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = async (id) => {
    if (typeof id === 'string') { // Real gear (uuid/nanoid)
      const item = gear.find(g => g.id === id);
      try {
        await api.put(`/api/gear/${id}`, { is_available: item.status === 'hidden' });
        loadGear();
      } catch (err) {
        alert('Lỗi cập nhật trạng thái: ' + err.message);
      }
    } else { // Mock gear
      setGear(prev => prev.map(g =>
        g.id === id ? { ...g, status: g.status === 'active' ? 'hidden' : 'active' } : g
      ));
    }
  };

  const handleAddGear = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/gear', {
        name: newGear.name,
        category: newGear.category,
        listing_type: newGear.listing_type,
        sell_price: newGear.sell_price ? parseFloat(newGear.sell_price) : null,
        rent_price_day: newGear.rent_price_day ? parseFloat(newGear.rent_price_day) : null,
        rent_price_week: newGear.rent_price_week ? parseFloat(newGear.rent_price_week) : null,
        condition_rating: parseInt(newGear.condition_rating) || 10
      });
      setShowAddModal(false);
      setNewGear({ name: '', category: 'Weights', listing_type: 'both', sell_price: '', rent_price_day: '', rent_price_week: '', condition_rating: 10 });
      loadGear();
    } catch (err) {
      alert('Lỗi thêm Gear: ' + err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-[#18181B]">Quản Lý Gear Marketplace</h2>
          <p className="text-sm text-[#18181B]/60">Catalog thiết bị bán & cho thuê</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF5722] text-white text-sm font-bold hover:bg-[#FF5722]/90 transition-colors">
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

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden border border-[#18181B]/10">
            <div className="p-5 border-b border-[#18181B]/10 flex items-center justify-between">
              <h2 className="text-xl font-black text-[#18181B]">Thêm Thiết Bị Mới</h2>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddGear} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
                <input required value={newGear.name} onChange={e => setNewGear({ ...newGear, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#18181B]/10 focus:border-[#FF5722]" placeholder="VD: Tạ tay cao cấp 10kg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Danh mục</label>
                  <select value={newGear.category} onChange={e => setNewGear({ ...newGear, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-[#18181B]/10">
                    <option value="Weights">Weights</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Supplements">Supplements</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Recovery">Recovery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hình thức</label>
                  <select value={newGear.listing_type} onChange={e => setNewGear({ ...newGear, listing_type: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-[#18181B]/10">
                    <option value="sell">Chỉ Bán</option>
                    <option value="rent">Chỉ Cho Thuê</option>
                    <option value="both">Bán & Cho Thuê</option>
                  </select>
                </div>
              </div>
              {(newGear.listing_type === 'sell' || newGear.listing_type === 'both') && (
                <div>
                  <label className="block text-sm font-medium mb-1">Giá bán (VND)</label>
                  <input type="number" value={newGear.sell_price} onChange={e => setNewGear({ ...newGear, sell_price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#18181B]/10 focus:border-[#FF5722]" placeholder="VD: 500000" />
                </div>
              )}
              {(newGear.listing_type === 'rent' || newGear.listing_type === 'both') && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Giá thuê/ngày</label>
                    <input type="number" value={newGear.rent_price_day} onChange={e => setNewGear({ ...newGear, rent_price_day: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#18181B]/10" placeholder="VD: 20000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Giá thuê/tuần</label>
                    <input type="number" value={newGear.rent_price_week} onChange={e => setNewGear({ ...newGear, rent_price_week: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#18181B]/10" placeholder="VD: 100000" />
                  </div>
                </div>
              )}
              <button type="submit" className="w-full py-3 rounded-xl bg-[#FF5722] text-white font-bold hover:bg-[#FF5722]/90 transition-colors mt-2">
                Xác nhận Thêm Gear
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
