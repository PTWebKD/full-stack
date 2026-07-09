import { useState, useEffect } from 'react';
import { Plus, MapPin } from 'lucide-react';
import { api } from '../../services/api';

export default function AddressSelector({ value, onChange }) {
  const [addresses, setAddresses] = useState([]);
  const [defaultAddr, setDefaultAddr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address_line: '',
    ward: '',
    district: '',
    city: 'Ho Chi Minh',
    is_default: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const data = await api.get('/api/delivery/addresses');
      setAddresses(data || []);
      const def = data?.find(a => a.is_default);
      setDefaultAddr(def);
      if (def && !value) onChange(def.address_id);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setError('');

    const phoneDigits = form.phone.replace(/\D/g, '');
    if (!form.full_name.trim()) {
      setError('Vui lòng nhập tên người nhận.');
      return;
    }
    if (phoneDigits.length < 10) {
      setError('Số điện thoại phải có ít nhất 10 chữ số.');
      return;
    }
    if (form.address_line.trim().length < 5) {
      setError('Địa chỉ cụ thể phải có ít nhất 5 ký tự.');
      return;
    }
    if (!form.ward.trim() || !form.district.trim()) {
      setError('Vui lòng nhập đầy đủ Phường/Xã và Quận/Huyện.');
      return;
    }

    setSubmitting(true);
    try {
      const newAddr = await api.post('/api/delivery/addresses', { ...form, phone: phoneDigits });
      setForm({
        full_name: '',
        phone: '',
        address_line: '',
        ward: '',
        district: '',
        city: 'Ho Chi Minh',
        is_default: false
      });
      setShowForm(false);
      await fetchAddresses();
      if (newAddr && newAddr.address_id) {
        onChange(newAddr.address_id);
      }
    } catch (err) {
      console.error('Failed to save address:', err);
      setError(err.message || 'Không thể lưu địa chỉ. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-sm text-[#18181B]/60">Đang tải...</p>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-[#18181B]">Địa chỉ giao hàng</p>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="text-xs text-[#FF5722] hover:text-[#FF5722]/80 flex items-center gap-1 font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm địa chỉ mới
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSaveAddress} className="bg-white/60 rounded-2xl p-4 border border-[#18181B]/15 space-y-3 shadow-sm">
          <p className="text-xs font-bold text-[#18181B] border-b border-[#18181B]/10 pb-1.5">Thêm địa chỉ mới</p>
          {error && (
            <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-2.5 py-1.5">
              {error}
            </p>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Tên người nhận"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white border border-[#18181B]/10 text-xs focus:outline-none focus:border-[#FF5722]"
              required
            />
            <input
              type="tel"
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white border border-[#18181B]/10 text-xs focus:outline-none focus:border-[#FF5722]"
              required
            />
          </div>

          <input
            type="text"
            placeholder="Số nhà, tên đường (Địa chỉ cụ thể)"
            value={form.address_line}
            onChange={(e) => setForm({ ...form, address_line: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-white border border-[#18181B]/10 text-xs focus:outline-none focus:border-[#FF5722]"
            required
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Phường/Xã"
              value={form.ward}
              onChange={(e) => setForm({ ...form, ward: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white border border-[#18181B]/10 text-xs focus:outline-none focus:border-[#FF5722]"
              required
            />
            <input
              type="text"
              placeholder="Quận/Huyện"
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white border border-[#18181B]/10 text-xs focus:outline-none focus:border-[#FF5722]"
              required
            />
          </div>

          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
              className="rounded text-[#FF5722]"
            />
            <span className="text-[#18181B]/70">Đặt làm địa chỉ mặc định</span>
          </label>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2 rounded-lg bg-[#FF5722] text-white text-xs font-bold hover:bg-[#FF5722]/90 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Đang lưu...' : 'Lưu địa chỉ'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setError(''); }}
              className="px-4 py-2 rounded-lg bg-[#18181B]/10 text-[#18181B]/70 text-xs font-bold hover:bg-[#18181B]/15 cursor-pointer"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="p-4 rounded-xl border border-dashed border-[#18181B]/15 text-center">
          <p className="text-xs text-[#18181B]/50 mb-2">Bạn chưa có địa chỉ giao hàng nào.</p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="px-3 py-1.5 bg-[#FF5722] text-white text-xs font-bold rounded-lg hover:bg-[#FF5722]/90 transition cursor-pointer"
          >
            Thêm địa chỉ ngay
          </button>
        </div>
      ) : (
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {addresses.map(addr => (
            <label key={addr.address_id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${value === addr.address_id ? 'border-[#FF5722] bg-[#FF5722]/5' : 'border-[#18181B]/10 hover:border-[#18181B]/20 bg-white/40'}`}>
              <input
                type="radio"
                name="address"
                value={addr.address_id}
                checked={value === addr.address_id}
                onChange={(e) => onChange(Number(e.target.value))}
                className="mt-1"
              />
              <div className="flex-1 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#18181B]">{addr.full_name}</span>
                  <span className="text-[#18181B]/40">|</span>
                  <span className="text-[#18181B]/60 font-medium">{addr.phone}</span>
                </div>
                <p className="text-[#18181B]/70 mt-1">{addr.address_line}, {addr.ward}, {addr.district}, {addr.city}</p>
                {addr.is_default && <span className="inline-block text-[10px] text-[#FF5722] bg-[#FF5722]/10 px-1.5 py-0.5 rounded font-black mt-1.5">Mặc định</span>}
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
