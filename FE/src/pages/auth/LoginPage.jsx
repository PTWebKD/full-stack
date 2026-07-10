import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const roleHome = {
  member: '/dashboard',
  gymOwner: '/gym-owner/dashboard',
};

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.ok) {
      navigate(from || roleHome[result.user.role] || '/dashboard', { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-black text-[#18181B] mb-1">Chào mừng trở lại</h2>
      <p className="text-[#18181B]/60 text-sm mb-8">Đăng nhập vào tài khoản FitFuel+ của bạn</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#18181B]/70 mb-1.5">Email</label>
          <input
            type="email" required value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="you@email.com"
            className="w-full px-4 py-3 rounded-xl bg-white border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 focus:outline-none focus:border-[#FF5722] transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#18181B]/70 mb-1.5">Mật khẩu</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'} required value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 focus:outline-none focus:border-[#FF5722] transition-colors text-sm pr-10"
            />
            <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#18181B]/40 hover:text-[#FF5722]">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-xl bg-[#FF5722] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#FF5722]/90 transition-colors shadow-md disabled:opacity-60">
          {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <LogIn className="w-4 h-4" />}
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#18181B]/60">
        Chưa có tài khoản?{' '}
        <Link to="/" state={{ openTrial: true }} className="text-[#FF5722] font-medium hover:underline">Tham gia Miễn phí</Link>
      </p>
    </div>
  );
}
