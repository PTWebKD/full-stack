import { useState, useEffect } from 'react';
import { Search, Utensils, ShoppingCart, Package, TrendingUp, Plus, Edit2, EyeOff, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

const mockProducts = [
  { id: 1, name: 'Protein Shake Vanilla', price: 89000, calories: 180, protein: 25, stock: 42, status: 'available' },
  { id: 2, name: 'Power Protein Bowl', price: 95000, calories: 520, protein: 45, stock: 18, status: 'available' },
  { id: 3, name: 'Keto Warrior Plate', price: 105000, calories: 480, protein: 38, stock: 7, status: 'available' },
  { id: 4, name: 'Vegan Gains Bowl', price: 79000, calories: 440, protein: 28, stock: 0, status: 'out_of_stock' },
  { id: 5, name: 'BCAA Recovery Drink', price: 55000, calories: 30, protein: 5, stock: 60, status: 'available' },
  { id: 6, name: 'Pre-workout Lemon', price: 65000, calories: 15, protein: 0, stock: 3, status: 'available' },
];

export default function GymOwnerNutritionPOSPage() {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [memberQuery, setMemberQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);

  const products = mockProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) && p.status === 'available'
  );

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const totalAmount = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    alert(`✅ Đã tạo hóa đơn thành công!\nTổng tiền: ${totalAmount.toLocaleString('vi-VN')}đ${selectedMember ? `\nHội viên: ${selectedMember}` : '\n(Khách vãng lai)'}`);
    setCart([]);
    setSelectedMember(null);
    setMemberQuery('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#18181B]">POS Dinh Dưỡng</h2>
          <p className="text-sm text-[#18181B]/60">Bán tại quầy cho hội viên & khách vãng lai</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FF5722]/10 text-[#FF5722]">
            {mockProducts.filter(p => p.stock > 0 && p.stock <= 5).length} sản phẩm sắp hết
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Product Grid */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#18181B]/40" />
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 text-sm focus:outline-none focus:border-[#FF5722]/50"
            />
          </div>

          {/* Products */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {products.map(p => (
              <button key={p.id} onClick={() => addToCart(p)}
                className="glass rounded-2xl p-4 border border-[#18181B]/10 hover:border-[#FF5722]/30 text-left transition-all group premium-card">
                <div className="w-10 h-10 rounded-xl bg-[#FF5722]/10 flex items-center justify-center mb-3">
                  <Utensils className="w-5 h-5 text-[#FF5722]" />
                </div>
                <p className="text-sm font-semibold text-[#18181B] mb-1 leading-tight">{p.name}</p>
                <p className="text-xs text-[#18181B]/50 mb-2">{p.calories} kcal · {p.protein}g protein</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-[#FF5722]">{p.price.toLocaleString('vi-VN')}đ</span>
                  {p.stock <= 5 && <span className="text-[10px] text-amber-500 font-semibold">Còn {p.stock}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="glass rounded-2xl border border-[#18181B]/10 flex flex-col h-fit">
          <div className="px-4 py-3 border-b border-[#18181B]/10 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-[#FF5722]" />
            <h3 className="font-semibold text-[#18181B]">Giỏ hàng ({cart.length})</h3>
          </div>

          {/* Member search */}
          <div className="px-4 py-3 border-b border-[#18181B]/10">
            <input
              type="text"
              placeholder="Tìm hội viên (SDT/tên)..."
              value={memberQuery}
              onChange={e => { setMemberQuery(e.target.value); setSelectedMember(e.target.value || null); }}
              className="w-full px-3 py-2 rounded-lg bg-white border border-[#18181B]/10 text-sm text-[#18181B] placeholder-[#18181B]/40 focus:outline-none focus:border-[#FF5722]/50"
            />
            {selectedMember && (
              <p className="text-xs text-[#FF5722] mt-1 font-medium">Hội viên: {selectedMember}</p>
            )}
            {!selectedMember && (
              <p className="text-xs text-[#18181B]/40 mt-1">Để trống = Khách vãng lai</p>
            )}
          </div>

          {/* Items */}
          <div className="flex-1 divide-y divide-[#18181B]/6 max-h-64 overflow-y-auto">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#18181B] truncate">{item.name}</p>
                  <p className="text-xs text-[#18181B]/50">{item.price.toLocaleString('vi-VN')}đ × {item.qty}</p>
                </div>
                <span className="text-sm font-bold text-[#18181B] shrink-0">{(item.price * item.qty).toLocaleString('vi-VN')}đ</span>
                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 text-xs shrink-0">✕</button>
              </div>
            ))}
            {cart.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-[#18181B]/40">Chưa có sản phẩm</p>
            )}
          </div>

          {/* Total & Checkout */}
          <div className="px-4 py-4 border-t border-[#18181B]/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#18181B]/60">Tổng cộng</span>
              <span className="text-lg font-black text-[#FF5722]">{totalAmount.toLocaleString('vi-VN')}đ</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full py-3 rounded-xl bg-[#FF5722] text-white font-bold text-sm disabled:opacity-50 hover:bg-[#FF5722]/90 transition-colors">
              Thanh toán & Tạo hóa đơn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
