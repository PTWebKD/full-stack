import { useState, useEffect } from 'react';
import { Plus, Trash2, Star } from 'lucide-react';
import { api } from '../../services/api';

export default function ShippingAddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/delivery/addresses', form);
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
      fetchAddresses();
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Xóa địa chỉ này?')) {
      try {
        await api.delete(`/api/delivery/addresses/${id}`);
        fetchAddresses();
      } catch (error) {
        console.error('Failed to delete address:', error);
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await api.put(`/api/delivery/addresses/${id}`, { is_default: true });
      fetchAddresses();
    } catch (error) {
      console.error('Failed to set default:', error);
    }
  };

  if (loading) return <div className="py-16 text-center text-[#18181B]/40">Đang tải...</div>;

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#18181B]">Địa chỉ giao hàng</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF5722] text-white text-sm font-bold hover:bg-[#FF5722]/90 transition"
        >
          <Plus className="w-4 h-4" />
          Thêm địa chỉ
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-5 space-y-4 border border-[#18181B]/10">
          <input
            type="text"
            placeholder="Tên người nhận"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[#18181B]/5 text-[#18181B] border border-[#18181B]/10 text-sm"
            required
          />
          <input
            type="tel"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[#18181B]/5 text-[#18181B] border border-[#18181B]/10 text-sm"
            required
          />
          <input
            type="text"
            placeholder="Địa chỉ cụ thể"
            value={form.address_line}
            onChange={(e) => setForm({ ...form, address_line: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[#18181B]/5 text-[#18181B] border border-[#18181B]/10 text-sm"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Phường/Xã"
              value={form.ward}
              onChange={(e) => setForm({ ...form, ward: e.target.value })}
              className="px-3 py-2 rounded-lg bg-[#18181B]/5 text-[#18181B] border border-[#18181B]/10 text-sm"
              required
            />
            <input
              type="text"
              placeholder="Quận/Huyện"
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              className="px-3 py-2 rounded-lg bg-[#18181B]/5 text-[#18181B] border border-[#18181B]/10 text-sm"
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
            />
            <span className="text-[#18181B]/70">Đặt làm địa chỉ mặc định</span>
          </label>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-[#FF5722] text-white text-sm font-bold hover:bg-[#FF5722]/90">
              Thêm
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 px-4 py-2 rounded-lg bg-[#18181B]/10 text-[#18181B] text-sm font-bold hover:bg-[#18181B]/20"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {addresses.length === 0 ? (
          <p className="text-center text-[#18181B]/40 py-8">Chưa có địa chỉ nào</p>
        ) : (
          addresses.map(addr => (
            <div key={addr.address_id} className="glass rounded-2xl p-4 border border-[#18181B]/10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-bold text-[#18181B]">{addr.full_name}</p>
                  <p className="text-sm text-[#18181B]/70">{addr.phone}</p>
                  <p className="text-sm text-[#18181B]/70">{addr.address_line}, {addr.ward}, {addr.district}, {addr.city}</p>
                </div>
                <div className="flex gap-2">
                  {addr.is_default && <Star className="w-4 h-4 text-[#FF5722]" />}
                  <button
                    onClick={() => handleSetDefault(addr.address_id)}
                    className={`text-xs px-2 py-1 rounded-lg ${addr.is_default ? 'bg-[#FF5722]/20 text-[#FF5722]' : 'bg-[#18181B]/10 text-[#18181B]/60'}`}
                  >
                    Mặc định
                  </button>
                  <button
                    onClick={() => handleDelete(addr.address_id)}
                    className="text-xs px-2 py-1 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
