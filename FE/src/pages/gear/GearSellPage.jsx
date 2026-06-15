import { useState } from 'react';
import { CheckCircle, Upload, Store, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const gearCats = ['Weights', 'Apparel', 'Supplements', 'Accessories', 'Cardio', 'Recovery'];
const conditions = ['Mới (100%)', 'Như mới (95%)', 'Tốt (80%)', 'Trung bình (60%)', 'Đã qua sử dụng nhiều (40%)'];

export default function GearSellPage() {
  const { user } = useAuth();
  const isGymOwner = user?.role === 'gymOwner';

  const [form, setForm] = useState({
    name: '',
    category: 'Weights',
    description: '',
    price: '',
    stock: '',
    rentPricePerDay: '',
    condition: conditions[0],
  });
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 800));
    setDone(true);
  };

  if (done) return (
    <div className="max-w-md mx-auto py-24 text-center">
      <CheckCircle className="w-16 h-16 text-[#7dd3fc] mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">
        {isGymOwner ? 'Sản phẩm đã được đăng!' : 'Đăng cho thuê thành công!'}
      </h3>
      <p className="text-white/40 text-sm">
        {isGymOwner
          ? 'Sản phẩm đã được đăng và hiển thị ngay trên Gear Hub.'
          : 'Gear của bạn đang chờ duyệt. Member khác có thể thuê sau khi được phê duyệt.'}
      </p>
    </div>
  );

  return (
    <div className="max-w-2xl space-y-5 mx-auto">
      <div className="glass rounded-2xl border border-[#f97316]/20 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f97316]/15 text-[#f97316]">
            {isGymOwner ? <Store className="h-5 w-5" /> : <Key className="h-5 w-5" />}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#f97316]">
              {isGymOwner ? 'Phòng tập kinh doanh' : 'Hội viên — Cho thuê thiết bị'}
            </p>
            <h2 className="text-lg font-bold text-white">
              {isGymOwner ? 'Đăng bán thiết bị (Gym Owner)' : 'Đăng cho thuê thiết bị cá nhân'}
            </h2>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60">
            <Store className="mr-1.5 inline h-3.5 w-3.5 text-[#f97316]" />
            Chủ phòng tập là nhà cung cấp chính cho Gear Hub.
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60">
            <Key className="mr-1.5 inline h-3.5 w-3.5 text-[#7dd3fc]" />
            Hội viên chỉ được đăng thiết bị cá nhân để <strong className="text-[#7dd3fc]">cho thuê</strong> (không được bán).
          </div>
        </div>

        {!isGymOwner && (
          <div className="mt-3 rounded-xl border border-[#7dd3fc]/20 bg-[#003a5a]/15 px-3 py-2 text-xs text-[#7dd3fc]">
            Lưu ý: Bạn đang đăng thiết bị cá nhân để cho thuê từ tài khoản Hội viên. Hội viên không được phép bán gear trực tiếp (BR-11B).
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="glass rounded-2xl p-5 border border-white/5 space-y-4">
          <h3 className="font-semibold text-white text-sm">Thông tin thiết bị</h3>

          <div>
            <label className="block text-xs text-white/40 mb-1.5">Tên thiết bị</label>
            <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="VD: Tạ đòn 20kg Olympic" required
              className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#f97316]/50 text-sm" />
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1.5">Mô tả chi tiết</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Mô tả tình trạng, xuất xứ, lý do cho thuê..." rows={3}
              className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#f97316]/50 text-sm resize-none" />
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1.5">Danh mục</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white bg-transparent focus:outline-none text-sm">
              {gearCats.map(c => <option key={c} value={c} className="bg-[#0d1117]">{c}</option>)}
            </select>
          </div>

          {/* Gym Owner: chỉ bán (BR-11B) */}
          {isGymOwner && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#f97316]/60 mb-1.5">Giá bán (VNĐ)</label>
                <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                  placeholder="500000" required
                  className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#f97316]/50 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[#f97316]/60 mb-1.5">Số lượng tồn kho</label>
                <input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))}
                  placeholder="10" required
                  className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#f97316]/50 text-sm" />
              </div>
            </div>
          )}

          {/* Member: chỉ cho thuê (BR-11B) */}
          {!isGymOwner && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Giá thuê / ngày (VNĐ)</label>
                <input type="number" value={form.rentPricePerDay} onChange={e => setForm(p => ({ ...p, rentPricePerDay: e.target.value }))}
                  placeholder="50000" required
                  className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#f97316]/50 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Tình trạng thiết bị</label>
                <select value={form.condition} onChange={e => setForm(p => ({ ...p, condition: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white bg-transparent focus:outline-none text-sm">
                  {conditions.map(c => <option key={c} value={c} className="bg-[#0d1117]">{c}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-5 border border-white/5">
          <h3 className="font-semibold text-white text-sm mb-3">Hình ảnh sản phẩm</h3>
          <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-white/20 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <p className="text-sm text-white/40">Nhấn để tải lên hoặc kéo thả ảnh</p>
            <p className="text-xs text-white/20 mt-1">PNG, JPG tối đa 5MB · Tối thiểu 2 ảnh thực tế</p>
          </div>
        </div>

        <button type="submit"
          disabled={isGymOwner ? (!form.name || !form.price) : (!form.name || !form.rentPricePerDay)}
          className="w-full py-3.5 rounded-xl bg-[#f97316] text-white font-bold text-sm hover:bg-[#f97316]/90 transition-colors disabled:opacity-40">
          {isGymOwner ? 'Đăng bán ngay' : 'Đăng cho thuê'}
        </button>
      </form>
    </div>
  );
}
