import { Link } from 'react-router-dom';
import { Zap, Globe, MessageCircle, Play } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#003a5a] flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">FitFuel<span className="text-[#7dd3fc]">+</span></span>
          </div>
          <p className="text-sm text-white/40 leading-relaxed">The complete fitness ecosystem. Train harder, eat smarter, gear up.</p>
          <div className="flex gap-3 mt-4">
            {[Globe, MessageCircle, Play].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/40 hover:text-[#7dd3fc] transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Platform</p>
          <div className="flex flex-col gap-2">
            {[['/', 'Home'], ['/food', 'Food Hub'], ['/gear', 'Gear Hub'], ['/auth/register', 'Join Free']].map(([to, label]) => (
              <Link key={to} to={to} className="text-sm text-white/50 hover:text-white transition-colors">{label}</Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Business</p>
          <div className="flex flex-col gap-2">
            {[['#', 'Sell Food'], ['#', 'Sell Gear'], ['#', 'List Your Gym'], ['#', 'Become a Trainer']].map(([to, label]) => (
              <a key={label} href={to} className="text-sm text-white/50 hover:text-white transition-colors">{label}</a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Support</p>
          <div className="flex flex-col gap-2">
            {[['#', 'Help Center'], ['#', 'Privacy Policy'], ['#', 'Terms of Service'], ['#', 'Contact']].map(([to, label]) => (
              <a key={label} href={to} className="text-sm text-white/50 hover:text-white transition-colors">{label}</a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 px-4 sm:px-6 py-4">
        <p className="text-center text-xs text-white/20">© 2025 FitFuel+. Built with passion for the fitness community.</p>
      </div>
    </footer>
  );
}
