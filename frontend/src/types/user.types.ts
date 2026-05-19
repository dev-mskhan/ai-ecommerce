export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'ADMIN' | 'VENDOR' | 'BUYER';
  status: 'ACTIVE' | 'BANNED';
  joinedAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  logo: string;
  rating: number;
  totalProducts: number;
  totalSales: number;
  status: 'PENDING' | 'APPROVED' | 'BANNED';
  joinedAt: string;
}
