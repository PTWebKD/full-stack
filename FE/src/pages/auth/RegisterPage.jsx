import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const roleHome = {
  member: '/dashboard',
  gymOwner: '/gym-owner/dashboard',
};

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await register({ display_name: form.name, email: form.email, password: form.password });
    setLoading(false);
    if (result.ok) {
      setDone(true);
      setTimeout(() => navigate(roleHome[result.user.role] || '/dashboard'), 1500);
    } else {
      setError(result.error);
    }
  };

  if (done) return (
    <div className="text-center py-8">
      <CheckCircle className="w-12 h-12 text-[#FF5722] mx-auto mb-4" />
      <h3 className="text-xl font-bold text-[#18181B] mb-2">Tạo tài khoản thành công!</h3>
      <p className="text-[#18181B]/60 text-sm">Đang chuyển hướng đến trang của bạn...</p>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-black text-[#18181B] mb-1">Đăng ký Đối tác / Chủ phòng tập</h2>
      <p className="text-[#18181B]/60 text-sm mb-8">Đăng ký tài khoản Gym Owner để quản lý và vận hành hệ thống phòng tập của bạn.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#18181B]/70 mb-1.5">Họ và tên</label>
          <input type="text" required value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Tên của bạn"
            className="w-full px-4 py-3 rounded-xl bg-white border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 focus:outline-none focus:border-[#FF5722] transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#18181B]/70 mb-1.5">Email</label>
          <input type="email" required value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="you@email.com"
            className="w-full px-4 py-3 rounded-xl bg-white border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 focus:outline-none focus:border-[#FF5722] transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#18181B]/70 mb-1.5">Mật khẩu</label>
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} required value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Tối thiểu 6 ký tự"
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

        <button type="submit" disabled={loading || !form.name || !form.email || !form.password}
          className="w-full py-3 rounded-xl bg-[#FF5722] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#FF5722]/90 transition-colors disabled:opacity-40 shadow-md">
          {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <UserPlus className="w-4 h-4" />}
          {loading ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#18181B]/60">
        Đã có tài khoản?{' '}
        <Link to="/auth/login" className="text-[#FF5722] font-medium hover:underline">Đăng nhập</Link>
      </p>
    </div>
  );
}
