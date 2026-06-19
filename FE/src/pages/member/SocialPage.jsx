import { useState } from 'react';
import { Heart, MessageCircle, Share2, Dumbbell, Send, Image } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockPosts } from '../../data/mockSocial';
import { useAuth } from '../../context/AuthContext';

function PostCard({ post }) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [renderedAt] = useState(() => Date.now());

  const handleLike = () => {
    setLiked(l => !l);
    setLikes(n => liked ? n - 1 : n + 1);
  };

  const timeAgo = (dateStr) => {
    const diff = renderedAt - new Date(dateStr).getTime();
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(h / 24);
    return d > 0 ? `${d}d ago` : h > 0 ? `${h}h ago` : 'Just now';
  };

  const badgeColors = { member: '#71717a', Nutritionist: '#3b82f6', gymOwner: '#FF5722', admin: '#a855f7', Champion: '#FF5722', Elite: '#FF5722' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-2xl border border-[#18181B]/10 overflow-hidden premium-card"
    >
      <div className="flex items-center gap-3 px-5 py-4">
        <img src={post.userAvatar} alt={post.userName} className="w-10 h-10 rounded-full object-cover border border-[#FF5722]/20 shadow-[0_0_22px_rgba(255,87,34,0.08)]" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-[#18181B]">{post.userName}</p>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: `${badgeColors[post.userLevel] || '#FF5722'}20`, color: badgeColors[post.userLevel] || '#FF5722' }}>
              {post.userLevel}
            </span>
          </div>
          <p className="text-xs text-[#18181B]/40">{timeAgo(post.postedAt)}</p>
        </div>
        {post.type === 'workout' && <Dumbbell className="w-4 h-4 text-[#FF5722]" />}
      </div>

      <div className="px-5 pb-3">
        <p className="text-sm text-[#18181B]/80 leading-relaxed">{post.content}</p>
        {post.workout && (
          <div className="mt-3 flex gap-3 px-3 py-2 rounded-xl glass border border-[#18181B]/10 text-xs text-[#18181B]/60">
            <span className="text-[#FF5722] font-medium">{post.workout.name}</span>
            <span>{post.workout.duration} min</span>
            <span>{(post.workout.volume / 1000).toFixed(1)}T volume</span>
          </div>
        )}
        {post.badge && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold" style={{ borderColor: `${post.badge.color}40`, color: post.badge.color, background: `${post.badge.color}10` }}>
            <span>{post.badge.icon}</span>{post.badge.name}
          </div>
        )}
      </div>

      {post.image && (
        <div className="mx-5 mb-4 rounded-xl overflow-hidden h-52">
          <img src={post.image} alt="" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
        </div>
      )}

      <div className="flex items-center gap-1 px-5 py-3 border-t border-[#18181B]/10">
        <button onClick={handleLike} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-all ${liked ? 'text-red-400 bg-red-400/10' : 'text-[#18181B]/60 hover:text-red-400 hover:bg-red-400/5'}`}>
          <Heart className={`w-4 h-4 ${liked ? 'fill-red-400' : ''}`} />{likes}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-[#18181B]/60 hover:text-[#18181B] hover:bg-white transition-all">
          <MessageCircle className="w-4 h-4" />{post.comments}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-[#18181B]/60 hover:text-[#18181B] hover:bg-white transition-all">
          <Share2 className="w-4 h-4" />{post.shares}
        </button>
      </div>
    </motion.div>
  );
}

export default function SocialPage() {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState(mockPosts);

  const handlePost = () => {
    if (!newPost.trim()) return;
    const p = {
      id: Date.now(),
      userId: user?.id || 1,
      userName: user?.name || 'You',
      userAvatar: user?.avatar || '',
      userLevel: user?.level || 'Athlete',
      type: 'post',
      content: newPost,
      image: null,
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      postedAt: new Date().toISOString()
    };
    setPosts(prev => [p, ...prev]);
    setNewPost('');
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Post composer */}
      {user && (
        <div className="glass rounded-2xl p-4 border border-[#18181B]/10 premium-card">
          <div className="flex gap-3">
            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
            <textarea value={newPost} onChange={e => setNewPost(e.target.value)}
              placeholder="Share your workout, meal, or milestone..."
              className="flex-1 bg-transparent text-sm text-[#18181B] placeholder-[#18181B]/40 resize-none focus:outline-none min-h-[60px] focus-glow"
            />
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#18181B]/10">
            <button className="flex items-center gap-1.5 text-xs text-[#18181B]/60 hover:text-[#18181B] transition-colors">
              <Image className="w-4 h-4" /> Photo
            </button>
            <button onClick={handlePost} disabled={!newPost.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#FF5722] text-white text-xs font-bold disabled:opacity-40 hover:bg-[#FF5722]/90 transition-colors btn-cinematic">
              <Send className="w-3 h-3" /> Post
            </button>
          </div>
        </div>
      )}

      {posts.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  );
}
