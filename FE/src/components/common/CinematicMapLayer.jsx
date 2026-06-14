import { motion } from 'framer-motion';

const floatingCards = [
  {
    label: 'Macro meal',
    title: 'Lean power bowl',
    accent: '#003a5a',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=240&h=180&fit=crop',
    className: 'left-[8%] top-[18%]',
  },
  {
    label: 'Workout',
    title: 'Progress +18%',
    accent: '#f97316',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=240&h=180&fit=crop',
    className: 'right-[10%] top-[24%]',
  },
  {
    label: 'Gear hub',
    title: 'Verified kit',
    accent: '#ef4444',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=240&h=180&fit=crop',
    className: 'right-[18%] bottom-[18%]',
  },
];

export default function CinematicMapLayer({ showCards = false, intensity = 'default' }) {
  const opacity = intensity === 'strong' ? 'opacity-80' : 'opacity-45';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className={`absolute inset-0 city-map-layer ${opacity}`} />
      <svg className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 1200 700" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#003a5a" stopOpacity="0" />
            <stop offset="35%" stopColor="#003a5a" stopOpacity="0.9" />
            <stop offset="68%" stopColor="#f97316" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </linearGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d="M60 520 C210 360 320 420 450 300 S690 170 820 260 1010 420 1150 210"
          fill="none"
          stroke="url(#routeGlow)"
          strokeWidth="3"
          strokeDasharray="14 18"
          filter="url(#softGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1, strokeDashoffset: [0, -64] }}
          transition={{ pathLength: { duration: 2.2, ease: 'easeOut' }, strokeDashoffset: { duration: 6, repeat: Infinity, ease: 'linear' } }}
        />
        <motion.path
          d="M140 180 C280 250 340 130 520 210 S780 420 1040 360"
          fill="none"
          stroke="url(#routeGlow)"
          strokeWidth="2"
          strokeDasharray="10 16"
          opacity="0.72"
          filter="url(#softGlow)"
          animate={{ strokeDashoffset: [0, 52] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
        />
        {[
          [60, 520, '#003a5a'],
          [450, 300, '#f97316'],
          [820, 260, '#003a5a'],
          [1150, 210, '#ef4444'],
          [520, 210, '#00d4ff'],
          [1040, 360, '#f97316'],
        ].map(([cx, cy, color]) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="5"
            fill={color}
            filter="url(#softGlow)"
            animate={{ scale: [1, 1.8, 1], opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 2.8, repeat: Infinity, delay: cx / 600 }}
          />
        ))}
      </svg>

      {showCards && floatingCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 24, rotateX: 8 }}
          animate={{ opacity: 1, y: [0, -10, 0], rotateX: 0 }}
          transition={{ opacity: { duration: 0.7, delay: 0.25 + index * 0.12 }, y: { duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.45 } }}
          className={`absolute hidden lg:block w-44 overflow-hidden rounded-2xl border border-white/10 bg-black/35 shadow-2xl backdrop-blur-xl ${card.className}`}
          style={{ boxShadow: `0 24px 90px rgba(0,0,0,0.45), 0 0 44px ${card.accent}22` }}
        >
          <div className="relative h-24 overflow-hidden">
            <img src={card.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
          </div>
          <div className="p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: card.accent }}>{card.label}</p>
            <p className="mt-0.5 truncate text-xs font-semibold text-white">{card.title}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
