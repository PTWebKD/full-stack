import { useState, useEffect } from 'react';
import { Plus, MapPin } from 'lucide-react';
import { api } from '../../services/api';

export default function AddressSelector({ value, onChange }) {
  const [addresses, setAddresses] = useState([]);
  const [defaultAddr, setDefaultAddr] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p className="text-sm text-[#18181B]/60">Đang tải...</p>;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-[#18181B]">Địa chỉ giao hàng</p>
        <a href="/profile/addresses" className="text-xs text-[#FF5722] hover:text-[#FF5722]/80 flex items-center gap-1">
          <Plus className="w-3 h-3" />
          Quản lý
        </a>
      </div>
      {addresses.length === 0 ? (
        <p className="text-sm text-[#18181B]/60">Chưa có địa chỉ. <a href="/profile/addresses" className="text-[#FF5722]">Thêm mới</a></p>
      ) : (
        <div className="space-y-2">
          {addresses.map(addr => (
            <label key={addr.address_id} className="flex items-start gap-3 p-3 rounded-lg border border-[#18181B]/10 hover:border-[#FF5722] cursor-pointer transition">
              <input
                type="radio"
                name="address"
                value={addr.address_id}
                checked={value === addr.address_id}
                onChange={(e) => onChange(Number(e.target.value))}
                className="mt-1"
              />
              <div className="flex-1 text-sm">
                <p className="font-bold text-[#18181B]">{addr.full_name}</p>
                <p className="text-[#18181B]/70">{addr.address_line}, {addr.ward}, {addr.district}</p>
                {addr.is_default && <p className="text-xs text-[#FF5722] mt-1">Mặc định</p>}
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
