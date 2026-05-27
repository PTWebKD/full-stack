import { Star } from 'lucide-react';

const reviews = [
  { id: 1, user: 'Alex T.', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=50&h=50&fit=crop&crop=face', item: 'Power Protein Bowl', rating: 5, text: 'Amazing quality, delivered hot and fresh. The macros are spot on!', date: '2025-05-21' },
  { id: 2, user: 'Sarah K.', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=50&h=50&fit=crop&crop=face', item: 'Pre-Workout Fuel', rating: 5, text: 'Best pre-workout meal I\'ve had. Packaging is great too.', date: '2025-05-18' },
  { id: 3, user: 'Mike D.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face', item: 'Keto Warrior Plate', rating: 4, text: 'Really solid keto option. I\'d like slightly more variety but great overall.', date: '2025-05-14' },
];

export default function VendorReviewsPage() {
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div className="glass rounded-2xl p-5 border border-white/5 flex items-center gap-6">
        <div className="text-center">
          <p className="text-5xl font-black text-white">{avg}</p>
          <div className="flex gap-0.5 my-1">{[1,2,3,4,5].map(i => <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(avg) ? 'text-yellow-400 fill-yellow-400' : 'text-white/10'}`} />)}</div>
          <p className="text-xs text-white/30">{reviews.length} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5,4,3,2,1].map(r => {
            const count = reviews.filter(rv => rv.rating === r).length;
            const pct = (count / reviews.length) * 100;
            return (
              <div key={r} className="flex items-center gap-2 text-xs text-white/40">
                <span>{r}★</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-yellow-400" style={{ width: `${pct}%` }} />
                </div>
                <span>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map(r => (
          <div key={r.id} className="glass rounded-2xl p-5 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <img src={r.avatar} alt={r.user} className="w-9 h-9 rounded-full object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{r.user}</p>
                <p className="text-xs text-white/30">{r.item} · {r.date}</p>
              </div>
              <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} className={`w-3.5 h-3.5 ${i <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/10'}`} />)}</div>
            </div>
            <p className="text-sm text-white/70">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
