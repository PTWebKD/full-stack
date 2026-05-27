export const mockFoodOrders = [
  {
    id: 'FO-2025-001',
    userId: 1,
    items: [
      { foodId: 1, name: 'Power Protein Bowl', price: 89000, qty: 2, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop' },
      { foodId: 6, name: 'Pre-Workout Fuel', price: 65000, qty: 1, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=100&h=100&fit=crop' }
    ],
    total: 243000,
    status: 'delivered',
    deliveryAddress: '123 Gym St, District 3, HCMC',
    orderedAt: '2025-05-21T09:30:00',
    deliveredAt: '2025-05-21T10:00:00',
    vendor: 'Clean Fuel Kitchen',
    rating: 5
  },
  {
    id: 'FO-2025-002',
    userId: 1,
    items: [
      { foodId: 4, name: 'Bulk King Meal', price: 115000, qty: 1, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop' }
    ],
    total: 115000,
    status: 'preparing',
    deliveryAddress: '123 Gym St, District 3, HCMC',
    orderedAt: '2025-05-22T11:45:00',
    deliveredAt: null,
    vendor: 'Mass Factory',
    rating: null
  }
];

export const mockGearOrders = [
  {
    id: 'GO-2025-001',
    userId: 1,
    items: [
      { gearId: 3, name: 'Whey Isolate 2kg', price: 950000, qty: 2, image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=100&h=100&fit=crop' }
    ],
    total: 1900000,
    status: 'shipped',
    shippingAddress: '123 Gym St, District 3, HCMC',
    orderedAt: '2025-05-18T14:20:00',
    trackingCode: 'VN-EXPRESS-789456',
    seller: 'NutriForce',
    rating: null
  }
];

export const orderStatuses = {
  pending: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  confirmed: { label: 'Confirmed', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  preparing: { label: 'Preparing', color: 'text-orange-400', bg: 'bg-orange-400/10' },
  shipped: { label: 'Shipped', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  delivered: { label: 'Delivered', color: 'text-green-400', bg: 'bg-green-400/10' },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-400/10' },
};
