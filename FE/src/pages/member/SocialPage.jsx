import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Dumbbell, Send, Image as ImageIcon, Gift, Copy, Check, Users, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockPosts } from '../../data/mockSocial';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

function InviteFriendsCard() {
  const [info, setInfo] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get('/api/users/me/referral').then(setInfo).catch(() => setInfo(null));
  }, []);

  if (!info) return null;

  const link = `${window.location.origin}/nutrition?ref=${info.referral_code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass rounded-2xl p-4 border border-[#FF5722]/20 premium-card bg-gradient-to-br from-[#FF5722]/5 to-transparent">
      <div className="flex items-center gap-2 mb-2">
        <Gift className="w-4 h-4 text-[#FF5722]" />
        <p className="text-sm font-bold text-[#18181B]">Mời bạn bè, cùng nhận FitCoin</p>
      </div>
      <p className="text-xs text-[#18181B]/60 mb-3">
        Chia sẻ mã của bạn — khi bạn bè đăng ký gói tập bằng mã này, <b>cả hai cùng nhận FitCoin</b> ngay lập tức.
      </p>
      <div className="flex items-center gap-2 mb-3">
        <code className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#18181B]/10 text-sm font-black text-[#FF5722] tracking-wider text-center">
          {info.referral_code}
        </code>
        <button onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#18181B] text-white text-xs font-bold hover:bg-black transition-all shrink-0">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Đã sao chép' : 'Sao chép link'}
        </button>
      </div>
      <div className="flex items-center gap-4 text-xs text-[#18181B]/50">
        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {info.referred_count} bạn đã tham gia</span>
        <span className="flex items-center gap-1">🪙 {Number(info.total_referral_fitcoin)} FitCoin đã nhận</span>
      </div>
    </div>
  );
}

function PostCard({ post, onImageClick }) {
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
        <div 
          onClick={() => onImageClick(post.image)}
          className="mx-5 mb-4 rounded-xl overflow-hidden max-h-[400px] cursor-pointer border border-[#18181B]/5 bg-black/5"
        >
          <img src={post.image} alt="" className="w-full h-full object-contain transition-transform duration-700 hover:scale-[1.02]" />
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

  useEffect(() => {
    api.get('/api/social/feed')
      .then(data => {
        if (data && data.length > 0) {
          const formatted = data.map(p => ({
            id: p.post_id,
            userId: p.user_id,
            userName: p.user_id === user?.user_id ? user?.name : 'FitFuel Member',
            userAvatar: p.user_id === user?.user_id ? (user?.avatar || 'https://i.pravatar.cc/150?img=11') : `https://i.pravatar.cc/150?u=${p.user_id}`,
            userLevel: p.user_id === user?.user_id ? (user?.level || 'Athlete') : 'Athlete',
            type: (p.type === 'general' || p.type === 'review') ? 'post' : p.type,
            content: p.content,
            image: p.media_urls?.[0] || null,
            likes: p.likes_count || 0,
            comments: p.comments_count || 0,
            shares: 0,
            liked: false,
            postedAt: p.created_at
          }));
          setPosts([...formatted, ...mockPosts]);
        }
      })
      .catch(err => console.error("Could not load feed:", err));
  }, [user]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [viewImage, setViewImage] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.upload('/api/upload', formData);
      if (res.success) {
        setUploadedImageUrl(res.url);
      }
    } catch (err) {
      alert('Lỗi upload ảnh. Vui lòng thử lại.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePost = async () => {
    if (!newPost.trim() && !uploadedImageUrl) return;
    
    // Optimistic UI update
    const tempId = Date.now();
    const p = {
      id: tempId,
      userId: user?.user_id || 1,
      userName: user?.display_name || user?.name || 'You',
      userAvatar: user?.avatar || 'https://i.pravatar.cc/150?img=11',
      userLevel: user?.level || 'Athlete',
      type: 'post',
      content: newPost,
      image: uploadedImageUrl,
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      postedAt: new Date().toISOString()
    };
    setPosts(prev => [p, ...prev]);
    setNewPost('');
    setUploadedImageUrl(null);

    // Persist to DB
    try {
      await api.post('/api/social/posts', {
        type: 'general', // Database enum now supports 'general'
        content: p.content,
        media_urls: p.image ? [p.image] : []
      });
    } catch (err) {
      console.error("Failed to post:", err);
      alert('Đăng bài thất bại, vui lòng thử lại.');
      // Revert optimistic update
      setPosts(prev => prev.filter(post => post.id !== tempId));
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {user && <InviteFriendsCard />}

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

          {uploadedImageUrl && (
            <div className="mt-3 ml-12 relative w-32 h-32 rounded-xl overflow-hidden border border-[#18181B]/10 shadow-sm">
              <img src={uploadedImageUrl} alt="preview" className="w-full h-full object-cover" />
              <button 
                onClick={() => setUploadedImageUrl(null)} 
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#18181B]/10">
            <label className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${uploadingImage ? 'text-[#FF5722] font-semibold animate-pulse' : 'text-[#18181B]/60 hover:text-[#18181B]'}`}>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
              <ImageIcon className="w-4 h-4" /> 
              {uploadingImage ? 'Đang tải ảnh...' : 'Photo'}
            </label>
            <button onClick={handlePost} disabled={(!newPost.trim() && !uploadedImageUrl) || uploadingImage}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#FF5722] text-white text-xs font-bold disabled:opacity-40 hover:bg-[#FF5722]/90 transition-colors btn-cinematic">
              <Send className="w-3 h-3" /> Post
            </button>
          </div>
        </div>
      )}

      {posts.map(post => <PostCard key={post.id} post={post} onImageClick={setViewImage} />)}

      {/* Fullscreen Image Modal */}
      {viewImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setViewImage(null)}
        >
          <button 
            onClick={() => setViewImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={viewImage} 
            alt="Fullscreen" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl cursor-default" 
            onClick={e => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
}
