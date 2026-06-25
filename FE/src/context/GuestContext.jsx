import { createContext, useContext, useState, useEffect } from 'react';

const GuestContext = createContext(null);

export function GuestProvider({ children }) {
  // Initial state - restore from localStorage or start fresh
  const [guest_id, setGuestId] = useState(null);
  const [phone, setPhone] = useState('');
  const [is_recognized, setIsRecognized] = useState(false);
  const [is_returning_customer, setIsReturningCustomer] = useState(false);
  const [available_voucher, setAvailableVoucherState] = useState(null);
  const [discount_amount, setDiscountAmount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  // Restore from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('fitfuel_guest');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setGuestId(data.guest_id);
        setPhone(data.phone);
        setIsRecognized(data.is_recognized);
        setIsReturningCustomer(data.is_returning_customer);
        setAvailableVoucherState(data.available_voucher);
        setDiscountAmount(data.discount_amount);
        setSubtotal(data.subtotal);
        setTotal(data.total);
      } catch (e) {
        console.error('Failed to restore guest session:', e);
      }
    }
  }, []);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    const guestData = {
      guest_id,
      phone,
      is_recognized,
      is_returning_customer,
      available_voucher,
      discount_amount,
      subtotal,
      total
    };
    localStorage.setItem('fitfuel_guest', JSON.stringify(guestData));
  }, [guest_id, phone, is_recognized, is_returning_customer, available_voucher, discount_amount, subtotal, total]);

  // Action: Set guest phone
  const setGuestPhone = (phoneNum) => {
    setPhone(phoneNum);
  };

  // Action: Update guest info after API recognition
  const setRecognizedGuest = (guestInfo) => {
    setGuestId(guestInfo.guest_id);
    setIsRecognized(true);
    setIsReturningCustomer(guestInfo.is_returning_customer);
    setSubtotal(guestInfo.subtotal);
    setDiscountAmount(guestInfo.discount_amount);
    setTotal(guestInfo.total);
  };

  // Action: Update available voucher when user accepts/rejects
  const updateAvailableVoucher = (voucher) => {
    setAvailableVoucherState(voucher);
  };

  // Action: Clear guest session (on order complete or logout)
  const clearGuest = () => {
    setGuestId(null);
    setPhone('');
    setIsRecognized(false);
    setIsReturningCustomer(false);
    setAvailableVoucherState(null);
    setDiscountAmount(0);
    setSubtotal(0);
    setTotal(0);
    localStorage.removeItem('fitfuel_guest');
  };

  return (
    <GuestContext.Provider value={{
      guest_id,
      phone,
      is_recognized,
      is_returning_customer,
      available_voucher,
      discount_amount,
      subtotal,
      total,
      setGuestPhone,
      setRecognizedGuest,
      updateAvailableVoucher,
      clearGuest
    }}>
      {children}
    </GuestContext.Provider>
  );
}

export const useGuest = () => {
  const ctx = useContext(GuestContext);
  if (!ctx) throw new Error('useGuest must be used within GuestProvider');
  return ctx;
};
