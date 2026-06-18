import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, KeyRound, ArrowLeft, Timer } from 'lucide-react';
import { api } from '../../services/api';

export default function GearOtpPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('phone'); // phone | otp
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const sendOtp = async () => {
    if (!phone.match(/^0\d{9}$/)) { setError('Số điện thoại không hợp lệ'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/api/guest/otp/send', { phone });
      setStep('otp');
      setCountdown(600);
      const timer = setInterval(() => setCountdown(c => { if (c <= 1) { clearInterval(timer); return 0; } return c - 1; }), 1000);
    } catch (err) {
      setError(err.message || 'Gửi OTP thất bại. Vui lòng thử lại.');
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) { setError('Mã OTP phải gồm 6 số'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/api/guest/otp/verify', { phone, otp });
      navigate('/gear/checkout');
    } catch (err) {
      setError(err.message || 'Mã OTP không đúng hoặc đã hết hạn.');
    }
    setLoading(false);
  };

  const fmt = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>

        <div className="glass rounded-3xl p-8 border border-white/10">
          {step === 'phone' ? (
            <>
              <div className="w-12 h-12 rounded-2xl bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center mb-5">
                <Phone className="w-5 h-5 text-[#00d4ff]" />
              </div>
              <h1 className="text-xl font-bold text-white mb-1">Xác thực số điện thoại</h1>
              <p className="text-sm text-white/40 mb-6">Nhập SĐT để nhận mã OTP và tiếp tục mua hàng</p>

              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="0xxxxxxxxx" maxLength={10}
                className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-white/25 text-sm mb-3 focus:outline-none focus:border-[#00d4ff]/50" />
              {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

              <button onClick={sendOtp} disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm bg-[#00d4ff] text-black hover:bg-[#00d4ff]/90 disabled:opacity-50 transition-all">
                {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
              </button>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center mb-5">
                <KeyRound className="w-5 h-5 text-[#00d4ff]" />
              </div>
              <h1 className="text-xl font-bold text-white mb-1">Nhập mã OTP</h1>
              <p className="text-sm text-white/40 mb-1">Mã 6 số đã gửi đến <span className="text-white">{phone}</span></p>
              {countdown > 0 && (
                <div className="flex items-center gap-1 text-xs text-[#00d4ff] mb-5">
                  <Timer className="w-3 h-3" /> Hết hạn sau {fmt(countdown)}
                </div>
              )}

              <input value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,''))} placeholder="_ _ _ _ _ _" maxLength={6}
                className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-white/25 text-center text-2xl font-mono tracking-[0.5em] mb-3 focus:outline-none focus:border-[#00d4ff]/50" />
              {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

              <button onClick={verifyOtp} disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm bg-[#00d4ff] text-black hover:bg-[#00d4ff]/90 disabled:opacity-50 transition-all mb-3">
                {loading ? 'Đang xác thực...' : 'Xác thực'}
              </button>

              {countdown === 0 && (
                <button onClick={() => { setStep('phone'); setOtp(''); setError(''); }}
                  className="w-full text-center text-sm text-white/40 hover:text-white transition-colors">
                  Gửi lại mã OTP
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
