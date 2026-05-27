import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const roleHome = {
  member: '/dashboard',
  vendor: '/vendor/dashboard',
  gymOwner: '/gym-owner/dashboard',
};

const demoAccounts = [
  { label: 'Member', email: 'alex@fitfuel.com', password: '123456' },
  { label: 'Vendor', email: 'vendor@fitfuel.com', password: '123456' },
  { label: 'Gym Owner', email: 'gym@fitfuel.com', password: '123456' },
];

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
    await new Promise(r => setTimeout(r, 600));
    const result = login(form.email, form.password);
    setLoading(false);
    if (result.ok) {
      navigate(from || roleHome[result.user.role] || '/dashboard', { replace: true });
    } else {
      setError(result.error);
    }
  };

  const fillDemo = (acc) => setForm({ email: acc.email, password: acc.password });

  return (
    <div>
      <h2 className="text-2xl font-black text-white mb-1">Welcome back</h2>
      <p className="text-white/40 text-sm mb-8">Login to your FitFuel+ account</p>

      <div className="mb-6">
        <p className="text-xs text-white/30 mb-2">Quick Demo Access:</p>
        <div className="grid grid-cols-3 gap-2">
          {demoAccounts.map(acc => (
            <button key={acc.label} onClick={() => fillDemo(acc)}
              className="px-3 py-1.5 rounded-lg glass text-xs text-white/60 hover:text-[#7dd3fc] hover:border-[#003a5a]/30 transition-all border border-white/5">
              {acc.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
          <input
            type="email" required value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="you@email.com"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#003a5a]/50 transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'} required value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#003a5a]/50 transition-colors text-sm pr-10"
            />
            <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
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
          className="w-full py-3 rounded-xl bg-[#003a5a] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#003a5a]/90 transition-colors disabled:opacity-60">
          {loading ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <LogIn className="w-4 h-4" />}
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/40">
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-[#7dd3fc] font-medium hover:underline">Join Free</Link>
      </p>
    </div>
  );
}
