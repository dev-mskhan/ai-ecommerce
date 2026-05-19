export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number;
  discount: number;
  stock: number;
  sku: string;
  category: string;
  subcategory: string;
  tags: string[];
  images: string[];
  vendor: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
  };
  ratings: {
    average: number;
    count: number;
  };
  variants: {
    label: string;
    options: string[];
  }[];
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  shipping: {
    free: boolean;
    estimatedDays: number;
  };
  createdAt: string;
}
export interface IProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  vendor: {
    id: string;
    storeName: string;
    storeAvatar: string;
    isApproved: boolean;
  };
  variants: {
    name: string;
    options: string[];
  }[];
  tags: string[];
  ratings: {
    average: number;
    count: number;
  };
  isActive: boolean;
  isFeatured: boolean;
  isReported: boolean;
  reportCount: number;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
  };
  createdAt: string;
  updatedAt: string;
}
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  subcategories: string[];
}
export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}