export const mockPosts = [
  {
    id: 1,
    userId: 1,
    userName: 'Alex Thunder',
    userAvatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=80&h=80&fit=crop&crop=face',
    userLevel: 'Elite',
    type: 'workout',
    content: 'Just crushed a new PR on deadlift — 185kg! 3 months of grinding finally paid off. The secret? Consistency + Clean Fuel Kitchen meals every day. 💪',
    image: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=600&h=400&fit=crop',
    workout: { name: 'Lower Strength', duration: 75, volume: 18400 },
    likes: 128,
    comments: 24,
    shares: 8,
    liked: false,
    postedAt: '2025-05-22T08:00:00'
  },
  {
    id: 2,
    userId: 2,
    userName: 'Sarah Kim',
    userAvatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=80&fit=crop&crop=face',
    userLevel: 'Champion',
    type: 'meal',
    content: 'My go-to meal prep for the week — 7 Salmon Power Packs. 48g protein per meal keeps me full and fueled for every session. Meal prep Sunday hits different! 🍱',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop',
    likes: 94,
    comments: 17,
    shares: 5,
    liked: true,
    postedAt: '2025-05-21T18:30:00'
  },
  {
    id: 3,
    userId: 1,
    userName: 'Alex Thunder',
    userAvatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=80&h=80&fit=crop&crop=face',
    userLevel: 'Elite',
    type: 'achievement',
    content: 'Just hit the 🔥 14-day streak badge! Two weeks straight of hitting every single session. Who else is on a streak? Drop your count below!',
    image: null,
    badge: { name: '14-Day Streak', icon: '🔥', color: '#FF5722' },
    likes: 213,
    comments: 45,
    shares: 12,
    liked: false,
    postedAt: '2025-05-20T07:15:00'
  },
  {
    id: 4,
    userId: 3,
    userName: 'Mike Forge',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    userLevel: 'Nutritionist',
    type: 'promo',
    content: 'Thực đơn mùa hè mới từ đối tác Dinh Dưỡng FitFuel! Nhiều lựa chọn ít carbs hơn, nguyên liệu tươi ngon theo mùa, và món Recovery Smoothie Bowl đang nhận được đánh giá 5 sao. Thử ngay hôm nay!',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&h=400&fit=crop',
    likes: 67,
    comments: 11,
    shares: 3,
    liked: false,
    postedAt: '2025-05-19T12:00:00'
  },
  {
    id: 5,
    userId: 2,
    userName: 'Sarah Kim',
    userAvatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=80&fit=crop&crop=face',
    userLevel: 'Champion',
    type: 'workout',
    content: 'Dumbbell shoulder day was absolutely savage today. Hit 6 sets to failure. Shoulders are going to be on fire tomorrow!',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=400&fit=crop',
    workout: { name: 'Shoulder Hypertrophy', duration: 55, volume: 9800 },
    likes: 78,
    comments: 9,
    shares: 2,
    liked: false,
    postedAt: '2025-05-18T17:45:00'
  }
];

export const mockComments = {
  1: [
    { id: 1, userId: 2, userName: 'Sarah Kim', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=50&h=50&fit=crop&crop=face', text: 'BEAST! Congratulations!! 🏆', postedAt: '2025-05-22T08:15:00' },
    { id: 2, userId: 5, userName: 'Coach Dana', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face', text: 'Solid progression. Keep the form strict at those loads!', postedAt: '2025-05-22T08:32:00' },
  ]
};
