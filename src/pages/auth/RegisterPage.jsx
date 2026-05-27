import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 800));
    setDone(true);
    setTimeout(() => navigate('/auth/login'), 2000);
  };

  if (done) return (
    <div className="text-center py-8">
      <CheckCircle className="w-12 h-12 text-[#7dd3fc] mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">Account Created!</h3>
      <p className="text-white/40 text-sm">Redirecting to login...</p>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-black text-white mb-1">Create your account</h2>
      <p className="text-white/40 text-sm mb-8">Start your fitness journey today — free, full access.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Full Name</label>
          <input type="text" required value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#003a5a]/50 transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
          <input type="email" required value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="you@email.com"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#003a5a]/50 transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Password</label>
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} required value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Min. 6 characters"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#003a5a]/50 transition-colors text-sm pr-10"
            />
            <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={!form.name || !form.email || !form.password}
          className="w-full py-3 rounded-xl bg-[#003a5a] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#003a5a]/90 transition-colors disabled:opacity-40">
          <UserPlus className="w-4 h-4" />
          Create Account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/40">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-[#7dd3fc] font-medium hover:underline">Login</Link>
      </p>
    </div>
  );
}
