import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [foodCart, setFoodCart] = useState([]);
  const [gearCart, setGearCart] = useState([]);

  const addFood = (item) => {
    setFoodCart(prev => {
      const exist = prev.find(i => i.id === item.id);
      return exist ? prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...item, qty: 1 }];
    });
  };

  const addGear = (item) => {
    setGearCart(prev => {
      const exist = prev.find(i => i.id === item.id);
      return exist ? prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFood = (id) => setFoodCart(prev => prev.filter(i => i.id !== id));
  const removeGear = (id) => setGearCart(prev => prev.filter(i => i.id !== id));

  const updateFoodQty = (id, qty) => {
    if (qty <= 0) return removeFood(id);
    setFoodCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const updateGearQty = (id, qty) => {
    if (qty <= 0) return removeGear(id);
    setGearCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const clearCart = (type = 'all') => {
    if (type === 'food' || type === 'all') setFoodCart([]);
    if (type === 'gear' || type === 'all') setGearCart([]);
  };

  const foodTotal = foodCart.reduce((s, i) => s + i.price * i.qty, 0);
  const gearTotal = gearCart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalItems = foodCart.length + gearCart.length;

  return (
    <CartContext.Provider value={{
      foodCart, gearCart,
      addFood, addGear,
      removeFood, removeGear,
      updateFoodQty, updateGearQty,
      clearCart,
      foodTotal, gearTotal, totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
