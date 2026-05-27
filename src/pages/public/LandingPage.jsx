import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Dumbbell, Utensils, ShoppingBag, Award, Users, Star, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import CinematicMapLayer from '../../components/common/CinematicMapLayer';

const stats = [
  { value: '1,800+', label: 'Active Athletes' },
  { value: '50+', label: 'Clean Meals Daily' },
  { value: '2,400+', label: 'Gear Products' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const features = [
  { icon: Dumbbell, title: 'Gym Tracker', desc: 'Log every set, track PRs, visualize progress over time.', color: '#003a5a', to: '/dashboard', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=520&h=320&fit=crop' },
  { icon: Utensils, title: 'Food Hub', desc: 'Order macro-tracked meals from certified fitness vendors.', color: '#00d4ff', to: '/food', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=520&h=320&fit=crop' },
  { icon: ShoppingBag, title: 'Gear Hub', desc: 'Shop authenticated sports equipment and supplements.', color: '#f97316', to: '/gear', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=520&h=320&fit=crop' },
  { icon: Award, title: 'Fitness Passport', desc: 'Earn badges, maintain streaks, level up your fitness rank.', color: '#a855f7', to: '/dashboard', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=520&h=320&fit=crop' },
  { icon: Users, title: 'Community', desc: 'Share workouts, meals, and achievements with real athletes.', color: '#ec4899', to: '/social', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=520&h=320&fit=crop' },
];

const trainers = [
  { name: 'Coach Dana', title: 'Strength & Conditioning', rating: 5.0, sessions: 234, img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=400&fit=crop&crop=top' },
  { name: 'Alex Storm', title: 'Olympic Lifting', rating: 4.9, sessions: 198, img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop&crop=top' },
  { name: 'Maya Fit', title: 'HIIT & Nutrition', rating: 5.0, sessions: 312, img: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=300&h=400&fit=crop&crop=top' },
];

const reviews = [
  { name: 'Marcus T.', role: 'Powerlifter', rating: 5, text: 'FitFuel+ completely changed how I approach training. The gym tracker is insane — I can see exactly where I\'m progressing.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face' },
  { name: 'Jess N.', role: 'CrossFit Athlete', rating: 5, text: 'I\'ve tried every app. Nothing compares. The food ordering + macro tracking combo saves me 2 hours every Sunday.', avatar: 'https://images.unsplash.com/photo-1546961342-ea5f62d1a22b?w=60&h=60&fit=crop&crop=face' },
  { name: 'Ryan K.', role: 'Gym Owner', rating: 5, text: 'The B2B dashboard for gym owners is next-level. Finally a platform that understands what we actually need.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face' },
];

export default function LandingPage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop" alt="Hero" className="w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#152b3a]/92 via-[#0b2535]/76 to-[#003a5a]/36" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071f2f] via-transparent to-transparent" />
          <div className="absolute inset-0 cinematic-grid opacity-35" />
          <CinematicMapLayer showCards intensity="strong" />
          <div className="absolute right-[8%] top-[20%] h-60 w-60 rounded-full bg-[#003a5a]/15 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-neon text-[#7dd3fc] text-xs font-semibold mb-6">
              <Zap className="w-3 h-3" />
              The Complete Fitness Ecosystem
            </div>
            <h1 className="text-5xl sm:text-7xl font-black text-white leading-[0.95] mb-6">
              TRAIN.<br />EAT.<br /><span className="text-gradient">PERFORM.</span>
            </h1>
            <p className="text-lg text-white/60 mb-8 max-w-lg leading-relaxed">
              Track every rep. Order clean fuel. Gear up right. FitFuel+ puts your entire fitness life in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/auth/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#003a5a] text-white font-bold hover:bg-[#003a5a]/90 transition-all glow-neon btn-cinematic">
                Start Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/food" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-white font-semibold hover:bg-white/10 transition-all btn-cinematic">
                Explore Hub <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#071f2f] to-transparent" />
      </section>

      {/* STATS */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="text-center glass rounded-2xl p-5 border border-white/5 premium-card"
            >
              <p className="text-3xl font-black text-gradient mb-1">{s.value}</p>
              <p className="text-sm text-white/40">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-[#7dd3fc] uppercase tracking-widest mb-3">Everything You Need</p>
          <h2 className="text-4xl font-black text-white">One Platform.<br />Every Goal.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.42, delay: i * 0.05 }}
            >
            <Link to={f.to} className="group glass rounded-2xl hover:bg-white/[0.06] transition-all border border-white/5 hover:border-white/10 premium-card block h-full">
              <div className="relative h-36 overflow-hidden">
                <img src={f.image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071f2f] via-[#003a5a]/35 to-transparent" />
                <div className="absolute bottom-4 left-4 w-11 h-11 rounded-xl flex items-center justify-center backdrop-blur-xl" style={{ background: `${f.color}22`, border: `1px solid ${f.color}40`, boxShadow: `0 0 34px ${f.color}22` }}>
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
              </div>
              <div className="p-6 pt-4">
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed mb-4">{f.desc}</p>
                <span className="text-xs font-semibold flex items-center gap-1 transition-all" style={{ color: f.color }}>
                  Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOD PREVIEW */}
      <section className="py-16 bg-gradient-to-b from-transparent via-[#123040]/60 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-[#00d4ff] uppercase tracking-widest mb-2">Food Hub</p>
              <h2 className="text-3xl font-black text-white">Fuel for Performance</h2>
            </div>
            <Link to="/food" className="hidden sm:flex items-center gap-1 text-sm text-white/40 hover:text-white transition-colors">
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: 'Power Protein Bowl', cal: 520, protein: 45, price: '89K', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', badge: 'Best Seller' },
              { name: 'Keto Warrior Plate', cal: 480, protein: 38, price: '95K', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', badge: 'Keto' },
              { name: 'Vegan Gains Bowl', cal: 440, protein: 28, price: '79K', img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop', badge: 'Vegan' },
            ].map(item => (
              <Link key={item.name} to="/food" className="group rounded-2xl overflow-hidden glass border border-white/5 hover:border-white/10 transition-all premium-card">
                <div className="relative h-48 overflow-hidden">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 img-overlay" />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-[#003a5a] text-white text-xs font-bold">{item.badge}</span>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-white mb-1">{item.name}</h4>
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <span>{item.cal} kcal · {item.protein}g protein</span>
                    <span className="text-[#00d4ff] font-semibold">{item.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRAINERS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-[#f97316] uppercase tracking-widest mb-2">Elite Coaches</p>
          <h2 className="text-3xl font-black text-white">Train with the Best</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trainers.map(t => (
            <div key={t.name} className="group rounded-2xl overflow-hidden glass border border-white/5 hover:border-white/10 transition-all premium-card floating-card">
              <div className="relative h-64 overflow-hidden">
                <img src={t.img} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 img-overlay-strong" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="font-bold text-white text-lg">{t.name}</h4>
                  <p className="text-sm text-white/60">{t.title}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-white/50">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{t.rating}</span>
                    <span>{t.sessions} sessions</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-16 bg-gradient-to-b from-transparent via-[#123040]/60 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-[#a855f7] uppercase tracking-widest mb-2">Testimonials</p>
            <h2 className="text-3xl font-black text-white">What Athletes Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.map(r => (
              <div key={r.name} className="glass rounded-2xl p-6 border border-white/5 premium-card">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-sm text-white/70 leading-relaxed mb-4">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={r.avatar} alt={r.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-white">{r.name}</p>
                    <p className="text-xs text-white/40">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <div className="relative rounded-3xl overflow-hidden glass-neon p-12 md:p-16 premium-card">
          <div className="absolute inset-0 opacity-10">
            <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=400&fit=crop" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Ready to <span className="text-gradient">Level Up?</span></h2>
            <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">Join 1,800+ athletes. Free forever plan available.</p>
            <Link to="/auth/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#003a5a] text-white font-black text-lg hover:bg-[#003a5a]/90 transition-all glow-neon btn-cinematic">
              Get Started Free <Zap className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
