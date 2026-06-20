import { MapPin, Home } from 'lucide-react';

export default function DeliveryChoice({ value, onChange }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-bold text-[#18181B]">Hình thức nhận hàng</p>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onChange('pickup')}
          className={`p-3 rounded-lg border-2 transition ${
            value === 'pickup'
              ? 'border-[#FF5722] bg-[#FF5722]/10'
              : 'border-[#18181B]/10 hover:border-[#18181B]/20'
          }`}
        >
          <Home className={`w-4 h-4 mx-auto mb-1 ${value === 'pickup' ? 'text-[#FF5722]' : 'text-[#18181B]/60'}`} />
          <p className={`text-xs font-bold ${value === 'pickup' ? 'text-[#FF5722]' : 'text-[#18181B]/60'}`}>
            Lấy tại quầy
          </p>
        </button>
        <button
          onClick={() => onChange('delivery')}
          className={`p-3 rounded-lg border-2 transition ${
            value === 'delivery'
              ? 'border-[#FF5722] bg-[#FF5722]/10'
              : 'border-[#18181B]/10 hover:border-[#18181B]/20'
          }`}
        >
          <MapPin className={`w-4 h-4 mx-auto mb-1 ${value === 'delivery' ? 'text-[#FF5722]' : 'text-[#18181B]/60'}`} />
          <p className={`text-xs font-bold ${value === 'delivery' ? 'text-[#FF5722]' : 'text-[#18181B]/60'}`}>
            Giao hàng
          </p>
        </button>
      </div>
    </div>
  );
}
