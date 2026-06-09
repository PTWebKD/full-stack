import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Utensils, ShoppingBag } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';

function CartSection({ title, icon: Icon, items, onRemove, onUpdate, total, color, checkoutTo }) {
  if (items.length === 0) return null;
  const fmt = (n) => n.toLocaleString('vi-VN');

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-2xl overflow-hidden border border-white/5 mb-4 premium-card"
    >
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
        <Icon className="w-4 h-4" style={{ color }} />
        <h3 className="font-semibold text-white">{title}</h3>
        <span className="ml-auto text-sm text-white/40">{items.length} món</span>
      </div>
      <div className="divide-y divide-white/5">
        <AnimatePresence initial={false}>
        {items.map(item => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.22 }}
            className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.035] transition-colors"
          >
            <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shadow-[0_0_24px_rgba(0,0,0,0.35)]" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{item.name}</p>
              <p className="text-xs text-white/40">{fmt(item.price)}đ / món</p>
            </div>
            <div className="flex items-center gap-2 glass rounded-xl border border-white/10 px-2 py-1">
              <button onClick={() => onUpdate(item.id, item.qty - 1)} className="text-white/40 hover:text-white w-5 h-5 flex items-center justify-center">
                <Minus className="w-3 h-3" />
              </button>
              <motion.span
                key={item.qty}
                initial={{ scale: 0.75, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-white text-sm w-5 text-center"
              >
                {item.qty}
              </motion.span>
              <button onClick={() => onUpdate(item.id, item.qty + 1)} className="text-white/40 hover:text-white w-5 h-5 flex items-center justify-center">
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <p className="text-sm font-bold text-white w-20 text-right">{fmt(item.price * item.qty)}đ</p>
            <button onClick={() => onRemove(item.id)} className="text-white/20 hover:text-red-400 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-white/[0.02]">
        <p className="text-sm text-white/50">Tạm tính</p>
        <p className="text-lg font-black text-white">{fmt(total)}đ</p>
      </div>
      <div className="px-6 pb-4">
        <Link to={checkoutTo} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-black transition-all hover:opacity-90 btn-cinematic" style={{ background: color }}>
          Thanh Toán <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function CartPage() {
  const { foodCart, gearCart, removeFood, removeGear, updateFoodQty, updateGearQty, foodTotal, gearTotal, totalItems } = useCart();

  if (totalItems === 0) return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto px-4 py-24 text-center">
      <ShoppingCart className="w-16 h-16 text-white/10 mx-auto mb-6" />
      <h2 className="text-2xl font-black text-white mb-3">Giỏ hàng của bạn đang trống</h2>
      <p className="text-white/40 mb-8">Thêm thực phẩm hoặc gear để bắt đầu</p>
      <div className="flex gap-3 justify-center">
        <Link to="/food" className="px-6 py-3 rounded-xl bg-[#00d4ff] text-black font-bold text-sm btn-cinematic">Xem Thực Phẩm</Link>
        <Link to="/gear" className="px-6 py-3 rounded-xl bg-[#f97316] text-white font-bold text-sm btn-cinematic">Xem Gear</Link>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
        <ShoppingCart className="w-6 h-6 text-[#7dd3fc]" />
        Giỏ Hàng
        <span className="text-sm font-normal text-white/40">({totalItems} món)</span>
      </h1>

      <CartSection
        title="Đơn Hàng Thực Phẩm" icon={Utensils}
        items={foodCart} onRemove={removeFood} onUpdate={updateFoodQty}
        total={foodTotal} color="#00d4ff"
        checkoutTo="/checkout?type=food"
      />
      <CartSection
        title="Đơn Hàng Gear" icon={ShoppingBag}
        items={gearCart} onRemove={removeGear} onUpdate={updateGearQty}
        total={gearTotal} color="#f97316"
        checkoutTo="/checkout?type=gear"
      />
    </div>
  );
}
