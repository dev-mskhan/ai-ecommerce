// import type { Product } from '../types/product.types.ts';

export const categories = [
  { id: '1', name: 'Electronics', slug: 'electronics', icon: '📱', subcategories: ['Mobiles', 'Laptops', 'Tablets', 'Accessories', 'Audio'] },
  { id: '2', name: 'Fashion', slug: 'fashion', icon: '👕', subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Bags', 'Watches'] },
  { id: '3', name: 'Home & Living', slug: 'home-living', icon: '🏠', subcategories: ['Furniture', 'Kitchen', 'Bedding', 'Decor', 'Lighting'] },
  { id: '4', name: 'Beauty', slug: 'beauty', icon: '💄', subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Vitamins'] },
  { id: '5', name: 'Sports', slug: 'sports', icon: '⚽', subcategories: ['Gym Equipment', 'Cricket', 'Football', 'Outdoor Gear'] },
  { id: '6', name: 'Books', slug: 'books', icon: '📚', subcategories: ['Fiction', 'Academic', 'Stationery'] },
  { id: '7', name: 'Groceries', slug: 'groceries', icon: '🍎', subcategories: ['Fresh Produce', 'Dairy', 'Snacks'] },
  { id: '8', name: 'Toys', slug: 'toys', icon: '🧸', subcategories: ['Kids', 'Educational', 'Action Figures'] }
];

export const products: any[] = [
  {
    id: 'p1',
    title: 'Samsung Galaxy A55 5G 8GB/256GB',
    slug: 'samsung-galaxy-a55-5g',
    description: 'Experience the next generation of mobile connectivity with the Galaxy A55. Featuring a vibrant 6.6-inch Super AMOLED display and a powerful Exynos 1480 processor.',
    price: 89999,
    compareAtPrice: 109999,
    discount: 18,
    stock: 25,
    sku: 'SAM-A55-8-256',
    category: 'Electronics',
    subcategory: 'Mobiles',
    tags: ['Samsung', '5G', 'Android', 'Smartphone'],
    images: [
      'https://picsum.photos/seed/a55-1/600/600',
      'https://picsum.photos/seed/a55-2/600/600',
      'https://picsum.photos/seed/a55-3/600/600',
      'https://picsum.photos/seed/a55-4/600/600'
    ],
    vendor: {
      id: 'v1',
      name: 'TechZone Official',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TechZone',
      rating: 4.8,
      verified: true
    },
    ratings: { average: 4.6, count: 124 },
    variants: [
      { label: 'Color', options: ['Awesome Blue', 'Awesome Navy', 'Awesome Iceblue'] },
      { label: 'Storage', options: ['128GB', '256GB'] }
    ],
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    shipping: { free: true, estimatedDays: 3 },
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'p2',
    title: 'Master Cricket Bat - Limited Edition',
    slug: 'master-cricket-bat',
    description: 'Handcrafted from premium English Willow, this bat offers exceptional ping and balance for professional players.',
    price: 45000,
    compareAtPrice: 55000,
    discount: 18,
    stock: 5,
    sku: 'CR-BAT-LE',
    category: 'Sports',
    subcategory: 'Cricket',
    tags: ['Cricket', 'Willow', 'Professional'],
    images: [
      'https://picsum.photos/seed/bat-1/600/600',
      'https://picsum.photos/seed/bat-2/600/600'
    ],
    vendor: {
      id: 'v2',
      name: 'SportsHub PK',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SportsHub',
      rating: 4.9,
      verified: true
    },
    ratings: { average: 5.0, count: 42 },
    variants: [{ label: 'Weight', options: ['2.7lb', '2.8lb', '2.9lb'] }],
    isFeatured: true,
    isNew: true,
    isBestSeller: false,
    shipping: { free: true, estimatedDays: 5 },
    createdAt: '2024-02-20T14:30:00Z'
  },
  {
    id: 'p3',
    title: 'Modern Velvet Sofa - 3 Seater',
    slug: 'modern-velvet-sofa',
    description: 'Elegant velvet sofa with golden legs. Adds a touch of luxury to your living room.',
    price: 120000,
    compareAtPrice: 150000,
    discount: 20,
    stock: 2,
    sku: 'SF-VEL-001',
    category: 'Home & Living',
    subcategory: 'Furniture',
    tags: ['Living Room', 'Luxury', 'Velvet'],
    images: [
      'https://picsum.photos/seed/sofa-1/600/600'
    ],
    vendor: {
      id: 'v3',
      name: 'HomeDecor Pakistan',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=HomeDecor',
      rating: 4.5,
      verified: true
    },
    ratings: { average: 4.7, count: 18 },
    variants: [{ label: 'Color', options: ['Emerald Green', 'Royal Blue', 'Charcoal Gray'] }],
    isFeatured: false,
    isNew: false,
    isBestSeller: true,
    shipping: { free: false, estimatedDays: 14 },
    createdAt: '2023-11-10T08:00:00Z'
  },
  {
    id: 'p4',
    title: 'Sony WH-1000XM5 Headphones',
    slug: 'sony-wh-1000xm5',
    description: 'Leading noise cancellation and audio quality.',
    price: 75000,
    compareAtPrice: 85000,
    discount: 12,
    stock: 15,
    sku: 'SONY-XM5-BLK',
    category: 'Electronics',
    subcategory: 'Audio',
    tags: ['Sony', 'Audio'],
    images: ['https://picsum.photos/seed/sony-1/600/600'],
    vendor: { id: 'v1', name: 'TechZone Official', avatar: '', rating: 4.8, verified: true },
    ratings: { average: 4.9, count: 850 },
    variants: [{ label: 'Color', options: ['Black', 'Silver'] }],
    isFeatured: true, isNew: false, isBestSeller: true,
    shipping: { free: true, estimatedDays: 2 },
    createdAt: '2023-12-01T12:00:00Z'
  },
  {
    id: 'p5',
    title: 'Casual Cotton Shirt',
    slug: 'casual-cotton-shirt',
    description: 'Breathable cotton shirt for men.',
    price: 3500,
    compareAtPrice: 4500,
    discount: 22,
    stock: 100,
    sku: 'TS-COT-01',
    category: 'Fashion',
    subcategory: 'Men\'s Clothing',
    tags: ['Fashion', 'Cotton'],
    images: ['https://picsum.photos/seed/shirt-1/600/600'],
    vendor: { id: 'v2', name: 'FashionHub PK', avatar: '', rating: 4.6, verified: true },
    ratings: { average: 4.4, count: 150 },
    variants: [{ label: 'Size', options: ['S', 'M', 'L', 'XL'] }],
    isFeatured: false, isNew: true, isBestSeller: true,
    shipping: { free: true, estimatedDays: 3 },
    createdAt: '2024-03-05T10:00:00Z'
  }
];
