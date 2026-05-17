import { Order } from '../types/order.types';

export const orders: Order[] = [
  {
    id: 'ORD-827341',
    buyerId: 'u1',
    buyerName: 'Mustafa Khan',
    vendorId: 'v1',
    vendorName: 'TechZone Official',
    items: [
      {
        productId: 'p1',
        title: 'Samsung Galaxy A55 5G 8GB/256GB',
        image: 'https://picsum.photos/seed/a55-1/600/600',
        price: 89999,
        quantity: 1,
        variant: 'Awesome Blue'
      }
    ],
    subtotal: 89999,
    discount: 0,
    shippingFee: 0,
    total: 89999,
    status: 'DELIVERED',
    createdAt: '2024-03-10T14:20:00Z',
    shippingAddress: {
      fullName: 'Mustafa Khan',
      phone: '0300-1234567',
      address: 'Plot 123, Street 4, Phase 5, DHA',
      city: 'Karachi',
      province: 'Sindh',
      postalCode: '75500'
    },
    paymentMethod: 'CARD'
  }
];
