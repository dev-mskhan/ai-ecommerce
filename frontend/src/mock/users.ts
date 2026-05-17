import { User, Vendor } from '../types/user.types';

export const currentUser: User = {
  id: 'u1',
  name: 'Mustafa Khan',
  email: 'khan.mustafa4582@gmail.com',
  avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Mustafa+Khan',
  role: 'BUYER',
  status: 'ACTIVE',
  joinedAt: '2023-01-01T00:00:00Z'
};

export const vendors: Vendor[] = [
  {
    id: 'v1',
    name: 'TechZone Official',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TechZone',
    rating: 4.8,
    totalProducts: 142,
    totalSales: 3420,
    status: 'APPROVED',
    joinedAt: '2022-05-12T00:00:00Z'
  },
  {
    id: 'v2',
    name: 'FashionHub PK',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=FashionHub',
    rating: 4.6,
    totalProducts: 89,
    totalSales: 1200,
    status: 'APPROVED',
    joinedAt: '2023-02-10T00:00:00Z'
  },
  {
    id: 'v3',
    name: 'HomeDecor Pakistan',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=HomeDecor',
    rating: 4.5,
    totalProducts: 56,
    totalSales: 800,
    status: 'APPROVED',
    joinedAt: '2023-06-15T00:00:00Z'
  }
];
