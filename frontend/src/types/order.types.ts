
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  vendorId: string;
  vendorName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };
  paymentMethod: 'COD' | 'CARD';
}
