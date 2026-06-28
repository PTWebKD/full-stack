import { useState, useEffect } from 'react';
import { Utensils, Plus, Edit2, Eye, EyeOff, Search, Tag, AlertCircle, X, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

export default function GymOwnerNutritionProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Meal Prep',
    price: '',
    calories: '',
    protein_g: '',
    carb_g: '',
    fat_g: '',
    badge: '',
    description: '',
    images: [],
  });

  const categories = ['all', 'Meal Prep', 'Drink', 'Snack', 'Supplements'];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/food/vendor/products');
      setProducts(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Meal Prep',
      price: '',
      calories: '0',
      protein_g: '0',
      carb_g: '0',
      fat_g: '0',
      badge: '',
      description: '',
      images: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category || 'Meal Prep',
      price: String(p.price),
      calories: String(p.calories || 0),
      protein_g: String(p.protein_g || 0),
      carb_g: String(p.carb_g || 0),
      fat_g: String(p.fat_g || 0),
      badge: p.badge || '',
      description: p.description || '',
      images: p.images || [],
    });
    setIsModalOpen(true);
  };

  const handleToggleAvailability = async (productId) => {
    try {
      const updated = await api.patch(`/api/food/products/${productId}/availability`);
      setProducts(prev => prev.map(p => p.product_id === productId ? { ...p, is_available: updated.is_available } : p));
    } catch (err) {
      alert('Không thể cập nhật trạng thái sản phẩm.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Vui lòng nhập tên và giá sản phẩm.');
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      calories: parseInt(formData.calories || 0),
      protein_g: parseFloat(formData.protein_g || 0),
      carb_g: parseFloat(formData.carb_g || 0),
      fat_g: parseFloat(formData.fat_g || 0),
      category: formData.category,
      badge: formData.badge || null,
      images: formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&fit=crop'],
    };

    try {
      if (editingProduct) {
        await api.put(`/api/food/products/${editingProduct.product_id}`, payload);
      } else {
        await api.post('/api/food/products', payload);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert('Lỗi khi lưu sản phẩm. Vui lòng kiểm tra lại thông tin.');
    }
  };

  const filtered = products.filter(p =>
    (category === 'all' || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-[#18181B]">Quản Lý Thực Đơn Dinh Dưỡng</h2>
          <p className="text-sm text-[#18181B]/60">Quản lý các món ăn dinh dưỡng & đồ uống tại phòng gym</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF5722] text-white text-sm font-bold hover:bg-[#FF5722]/90 transition-colors shadow-md btn-cinematic"
        >
          <Plus className="w-4 h-4" /> Thêm Món Ăn
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Tổng số món', value: products.length, icon: Utensils, color: '#FF5722' },
          { label: 'Đang mở bán', value: products.filter(p => p.is_available).length, icon: Tag, color: '#22c55e' },
          { label: 'Đang ẩn', value: products.filter(p => !p.is_available).length, icon: EyeOff, color: '#ef4444' },
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
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm món ăn, đồ uống..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 text-sm focus:outline-none focus:border-[#FF5722]/50"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${category === c ? 'bg-[#FF5722]/10 text-[#FF5722] border border-[#FF5722]/20' : 'glass border border-[#18181B]/10 text-[#18181B]/60'}`}
            >
              {c === 'all' ? 'Tất cả' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-16 text-[#18181B]/60">Đang tải danh sách thực đơn...</div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center border border-[#18181B]/10">
          <AlertCircle className="w-8 h-8 mx-auto text-[#18181B]/30 mb-2" />
          <p className="text-sm text-[#18181B]/60">Không tìm thấy món ăn nào.</p>
        </div>
      ) : (
        <div className="glass rounded-2xl border border-[#18181B]/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#18181B]/10 bg-[#18181B]/[0.02]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#18181B]/60">Món ăn / Đồ uống</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#18181B]/60">Phân loại</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#18181B]/60">Giá bán</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#18181B]/60">Macros (P - C - F)</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#18181B]/60">Calories</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#18181B]/60">Trạng thái</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#18181B]/60">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18181B]/6">
                {filtered.map(item => (
                  <tr key={item.product_id} className={`hover:bg-[#18181B]/[0.02] transition-colors ${!item.is_available ? 'opacity-60' : ''}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&fit=crop'}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover border border-[#18181B]/10"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-[#18181B]">{item.name}</p>
                            {item.badge && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#FF5722]/10 text-[#FF5722] font-black uppercase">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#18181B]/50 truncate max-w-xs">{item.description || 'Không có mô tả.'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#18181B]/60">{item.category}</td>
                    <td className="px-4 py-3 text-right font-black text-[#FF5722]">
                      {parseFloat(item.price).toLocaleString('vi-VN')}đ
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-[#18181B]/70">
                      {parseInt(item.protein_g)}g - {parseInt(item.carb_g)}g - {parseInt(item.fat_g)}g
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-[#18181B]">
                      {item.calories} kcal
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${item.is_available ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                        {item.is_available ? 'Đang Bán' : 'Tạm Ẩn'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg hover:bg-[#18181B]/5 text-[#18181B]/50 hover:text-[#FF5722] transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleAvailability(item.product_id)}
                          className="p-1.5 rounded-lg hover:bg-[#18181B]/5 text-[#18181B]/50 hover:text-[#18181B] transition-colors"
                        >
                          {item.is_available ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#18181B]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-3xl w-full max-w-lg border border-white/20 shadow-2xl p-6 relative overflow-hidden">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#18181B]/5 text-[#18181B]/40 hover:text-[#18181B]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-[#FF5722]" />
              <h3 className="text-lg font-black text-[#18181B]">
                {editingProduct ? 'Chỉnh Sửa Món Ăn' : 'Thêm Món Ăn Dinh Dưỡng'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-[#18181B]/60 uppercase mb-1">Tên món ăn *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#18181B]/15 text-sm text-[#18181B] focus:outline-none focus:border-[#FF5722]/50"
                    placeholder="VD: Power Protein Bowl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18181B]/60 uppercase mb-1">Phân loại</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#18181B]/15 text-sm text-[#18181B] focus:outline-none focus:border-[#FF5722]/50"
                  >
                    <option value="Meal Prep">Meal Prep (Món ăn)</option>
                    <option value="Drink">Drink (Nước uống)</option>
                    <option value="Snack">Snack (Ăn nhẹ)</option>
                    <option value="Supplements">Supplements (Bổ sung)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18181B]/60 uppercase mb-1">Giá bán (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#18181B]/15 text-sm text-[#18181B] focus:outline-none focus:border-[#FF5722]/50"
                    placeholder="VD: 95000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18181B]/60 uppercase mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.calories}
                    onChange={e => setFormData({ ...formData, calories: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#18181B]/15 text-sm text-[#18181B] focus:outline-none focus:border-[#FF5722]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18181B]/60 uppercase mb-1">Protein (g)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.protein_g}
                    onChange={e => setFormData({ ...formData, protein_g: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#18181B]/15 text-sm text-[#18181B] focus:outline-none focus:border-[#FF5722]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18181B]/60 uppercase mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.carb_g}
                    onChange={e => setFormData({ ...formData, carb_g: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#18181B]/15 text-sm text-[#18181B] focus:outline-none focus:border-[#FF5722]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18181B]/60 uppercase mb-1">Fats (g)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.fat_g}
                    onChange={e => setFormData({ ...formData, fat_g: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#18181B]/15 text-sm text-[#18181B] focus:outline-none focus:border-[#FF5722]/50"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-[#18181B]/60 uppercase mb-1">Nhãn đặc biệt (Badge)</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#18181B]/15 text-sm text-[#18181B] focus:outline-none focus:border-[#FF5722]/50"
                    placeholder="VD: High Protein, Low Carb"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-[#18181B]/60 uppercase mb-1">Mô tả món ăn</label>
                  <textarea
                    rows="2"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#18181B]/15 text-sm text-[#18181B] focus:outline-none focus:border-[#FF5722]/50 resize-none"
                    placeholder="Nhập thông tin chi tiết về món ăn..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 justify-end border-t border-[#18181B]/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#18181B]/10 text-sm font-semibold text-[#18181B]/70 hover:bg-[#18181B]/5 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#FF5722] text-white text-sm font-black hover:bg-[#FF5722]/90 transition-colors shadow-md"
                >
                  Lưu Lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
