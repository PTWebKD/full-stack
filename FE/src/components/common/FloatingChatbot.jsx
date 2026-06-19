import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Sparkles, Send, X, RefreshCw, Dumbbell, Utensils, ShoppingBag, Brain, Zap, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import aiIcon from '../../assets/ai-assistant-icon.png';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';

const quickPrompts = [
  { text: 'Tôi nên tập gì tiếp theo?', icon: Dumbbell },
  { text: 'Cần nạp bao nhiêu protein?', icon: Utensils },
  { text: 'Cách hồi phục sau tập nặng?', icon: Zap },
  { text: 'Mua gear gì để squat tốt hơn?', icon: ShoppingBag },
  { text: 'Tỷ lệ macro tối ưu tăng cơ?', icon: Brain },
  { text: 'Lợi ích của creatine?', icon: Sparkles },
];

const bubbleIn = (isUser) => ({
  hidden: { opacity: 0, x: isUser ? 20 : -20, scale: 0.88 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', stiffness: 380, damping: 26 } },
});

export default function FloatingChatbot() {
  const { user } = useAuth();
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  const hasKey = apiKey && apiKey.length > 10;

  const [systemPrompt, setSystemPrompt] = useState(
    `Bạn là FitAI — trợ lý thể hình và dinh dưỡng thông minh của ứng dụng FitFuel+ (Việt Nam).\nVai trò: tư vấn dinh dưỡng, lập kế hoạch tập luyện, hướng dẫn hồi phục, gợi ý thực phẩm bổ sung và gear.\nQuy tắc: luôn trả lời tiếng Việt, thân thiện, ngắn gọn (tối đa 150 từ), dùng bullet khi liệt kê.\nKHÔNG chẩn đoán bệnh hoặc thay thế tư vấn y tế.`
  );

  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(false);
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: `Xin chào${user?.name ? ` **${user.name}**` : ''}! Tôi là **FitAI** 🤖\nHỏi tôi về dinh dưỡng, lịch tập hoặc gear nhé!`,
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const inputContainerRef = useRef(null);

  // 3D Parallax Effect for the avatar
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);
  const imgX = useTransform(mouseXSpring, [-0.5, 0.5], [-6, 6]);
  const imgY = useTransform(mouseYSpring, [-0.5, 0.5], [-6, 6]);
  const imgRotateZ = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  useEffect(() => {
    if (!user) return;
    api.get('/api/gym/sessions/my')
      .then(sessions => {
        const last = Array.isArray(sessions) ? sessions[0] : null;
        if (last) {
          setSystemPrompt(prev => prev + `\nBuổi tập gần nhất: ${last.notes || 'Workout'} (${last.date}), hoàn thành: ${last.status === 'done' ? 'có' : 'chưa'}.`);
        }
      })
      .catch(() => {});
  }, [user]);

  const handleMouseMove = (e) => {
    if (open) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    if (open) {
      setUnread(false);
      x.set(0);
      y.set(0);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const callGroq = async (history) => {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'system', content: systemPrompt }, ...history.map(m => ({ role: m.role, content: m.content }))],
        max_tokens: 400, temperature: 0.7,
      }),
    });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e?.error?.message || `Lỗi ${res.status}`); }
    return (await res.json()).choices[0].message.content;
  };

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput('');
    setError(null);
    if (textareaRef.current) { textareaRef.current.style.height = 'auto'; }
    const next = [...messages, { role: 'user', content: q }];
    setMessages(next);
    setLoading(true);
    try {
      if (!hasKey) throw new Error('no_key');
      const reply = await callGroq(next);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      if (!open) setUnread(true);
    } catch (err) {
      setError(err.message === 'no_key' ? 'Chưa có API key Groq.' : `Lỗi: ${err.message}`);
      setMessages(prev => prev.slice(0, -1));
    } finally { setLoading(false); }
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
  };

  const reset = () => {
    setMessages([{ role: 'assistant', content: 'Cuộc trò chuyện đã đặt lại! Hỏi tôi bất cứ điều gì về thể hình nhé 💪' }]);
    setError(null);
  };

  const renderText = (text) =>
    text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={i} className="text-[#18181B] font-semibold">{p.slice(2, -2)}</strong>
        : p
    );

  if (user?.role !== 'member') return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="w-[360px] flex flex-col rounded-3xl border border-[#18181B]/15 shadow-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(24px)',
              maxHeight: '520px',
              boxShadow: '0 8px 48px rgba(24,24,27,0.12), 0 0 0 1px rgba(24,24,27,0.05)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#18181B]/10 shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(255,87,34,0.08) 0%, transparent 100%)' }}>
              <motion.div
                animate={{ boxShadow: ['0 0 0px #FF5722', '0 0 16px #FF572255', '0 0 0px #FF5722'] }}
                transition={{ repeat: Infinity, duration: 2.2 }}
                className="w-8 h-8 rounded-xl bg-[#FF5722]/15 border border-[#FF5722]/20 flex items-center justify-center shrink-0 overflow-hidden p-[2px]"
              >
                <img src={aiIcon} alt="FitAI" className="w-full h-full object-contain drop-shadow-md" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#18181B] leading-tight">FitAI</p>
                <div className="flex items-center gap-1">
                  <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1.6 }}
                    className={`w-1.5 h-1.5 rounded-full ${hasKey ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <p className="text-xs text-[#18181B]/60">{hasKey ? 'Trực tuyến' : 'Chế độ Demo'}</p>
                </div>
              </div>
              <button onClick={reset} className="p-1.5 rounded-lg text-[#18181B]/60 hover:text-[#18181B] hover:bg-[#18181B]/5 transition-all">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-[#18181B]/60 hover:text-[#18181B] hover:bg-[#18181B]/5 transition-all">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="mx-3 mt-2 px-3 py-2 rounded-xl bg-red-400/8 border border-red-400/20 flex items-center gap-2 shrink-0">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <p className="text-xs text-red-400 flex-1">{error}</p>
                  <button onClick={() => setError(null)} className="text-red-400/40 hover:text-red-400 text-xs">✕</button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 scrollbar-none" style={{ minHeight: 0 }}>
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => {
                  const isUser = msg.role === 'user';
                  return (
                    <motion.div key={i} variants={bubbleIn(isUser)} initial="hidden" animate="visible"
                      className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!isUser && (
                        <div className="w-6 h-6 rounded-xl bg-[#FF5722]/15 border border-[#FF5722]/20 flex items-center justify-center shrink-0 mb-0.5 overflow-hidden p-[1px]">
                          <img src={aiIcon} alt="FitAI" className="w-full h-full object-contain" />
                        </div>
                      )}
                      {isUser && user?.avatar && (
                        <img src={user.avatar} alt="" className="w-6 h-6 rounded-xl object-cover shrink-0 mb-0.5 border border-[#18181B]/10" />
                      )}
                      <div className={`max-w-[82%] px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                        isUser
                          ? 'bg-[#FF5722] text-white rounded-2xl rounded-br-sm shadow-[0_2px_12px_rgba(255,87,34,0.25)] font-medium'
                          : 'text-[#18181B] rounded-2xl rounded-bl-sm border border-[#18181B]/10 shadow-sm bg-white'
                      }`}>
                        {isUser ? msg.content : renderText(msg.content)}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Typing */}
              <AnimatePresence>
                {loading && (
                  <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                    className="flex items-end gap-2">
                    <div className="w-6 h-6 rounded-xl bg-[#FF5722]/15 border border-[#FF5722]/20 flex items-center justify-center shrink-0 overflow-hidden p-[1px]">
                      <img src={aiIcon} alt="FitAI" className="w-full h-full object-contain" />
                    </div>
                    <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm border border-[#18181B]/10 flex items-center gap-1 bg-white">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 0.65, delay: i * 0.13, ease: 'easeInOut' }}
                          className="w-1.5 h-1.5 rounded-full bg-[#FF5722]/40"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Quick prompts */}
            <div className="flex gap-1.5 px-3 py-2 overflow-x-auto scrollbar-none shrink-0 border-t border-[#18181B]/10">
              {quickPrompts.map(p => (
                <button key={p.text} onClick={() => send(p.text)} disabled={loading}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl border border-zinc-200 text-[10px] text-zinc-500 hover:text-[#FF5722] hover:border-[#FF5722]/30 transition-all whitespace-nowrap shrink-0 disabled:opacity-25"
                  style={{ background: 'rgba(255,255,255,0.6)' }}>
                  <p.icon className="w-2.5 h-2.5 shrink-0" />
                  {p.text}
                </button>
              ))}
            </div>

            {/* Input */}
            <div ref={inputContainerRef}
              className="flex items-end gap-2 px-3 pb-3 shrink-0">
              <div className="flex-1 flex items-end gap-2 rounded-2xl border border-[#18181B]/10 px-3 py-2 focus-within:border-[#FF5722]/50 transition-colors"
                style={{ background: 'rgba(24,24,27,0.03)' }}>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKey}
                  rows={1}
                  placeholder="Nhắn tin với FitAI..."
                  className="flex-1 bg-transparent text-xs text-[#18181B] placeholder-[#18181B]/40 focus:outline-none resize-none leading-relaxed"
                  style={{ maxHeight: 96 }}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => send()} disabled={!input.trim() || loading}
                  className="w-7 h-7 rounded-xl bg-[#FF5722] flex items-center justify-center shrink-0 disabled:opacity-30 hover:bg-[#FF5722]/80 transition-all shadow-[0_0_12px_rgba(255,87,34,0.3)]"
                >
                  <Send className="w-3 h-3 text-white" />
                </motion.button>
              </div>
            </div>

            {/* Tail arrow */}
            <div className="absolute -bottom-[6px] right-[26px] w-3 h-3 rotate-45 border-r border-b border-[#18181B]/15"
              style={{ background: 'rgba(255,255,255,0.92)' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button */}
      <motion.button
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
        onClick={() => setOpen(v => !v)}
        className="relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl"
        style={{
          perspective: 1000,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          background: open
            ? 'linear-gradient(135deg, #e4e4e7, #d4d4d8)'
            : 'linear-gradient(135deg, #FF5722, #FF5722)',
          boxShadow: open
            ? '0 4px 24px rgba(24,24,27,0.1)'
            : '0 4px 32px rgba(255,87,34,0.4), 0 0 0 1px rgba(255,87,34,0.2)',
        }}
        animate={{
          boxShadow: open ? undefined : [
            '0 4px 32px rgba(255,87,34,0.3), 0 0 0 1px rgba(255,87,34,0.1)',
            '0 4px 40px rgba(255,87,34,0.5), 0 0 0 4px rgba(255,87,34,0.1)',
            '0 4px 32px rgba(255,87,34,0.3), 0 0 0 1px rgba(255,87,34,0.1)',
          ],
        }}
        transition={{ repeat: open ? 0 : Infinity, duration: 2.8 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <X className="w-5 h-5 text-zinc-700" />
            </motion.div>
          ) : (
            <motion.div key="open"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: [-2, 2, -2]
              }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{
                duration: 0.18,
                y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
              }}
              style={{ transformStyle: "preserve-3d", translateZ: 20 }}
            >
              <motion.img
                src={aiIcon}
                alt="FitAI"
                className="w-10 h-10 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
                style={{
                   x: imgX,
                   y: imgY,
                   rotateZ: imgRotateZ
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread dot */}
        <AnimatePresence>
          {unread && !open && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-[#0a0e14] flex items-center justify-center">
              <span className="text-[8px] font-bold text-[#18181B] leading-none">!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
