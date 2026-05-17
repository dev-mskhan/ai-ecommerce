import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { formatPrice, cn } from '@/utils/helpers';
import { RatingStars } from '../common/RatingStars';
import { useCartStore } from '@store/zustand/cartStore';
import { useWishlistStore } from '@store/zustand/wishlistStore';
import toast from 'react-hot-toast';

interface Vendor {
  _id: string;
  storeName: string;
  isApproved: boolean;
  avatar?: string;
}

interface CategoryData {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  ratings: { average: number; count: number };
  tags: string[];
  vendorData: Vendor[];
  categoryData: CategoryData[];
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlistStore();

  const vendor = product.vendorData?.[0];
  const category = product.categoryData?.[0];
  const isFavorite = isInWishlist(product._id);

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.discountPrice ?? product.price,
      discountPrice: product.discountPrice,
      images: product.images,
      vendorName: vendor?.storeName,
      categoryName: category?.name,
      vendorId: vendor?._id,
      categoryId: category?._id,
      quantity: 1,
    });
    toast.success('Added to cart');
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFavorite) {
      removeWishlistItem(product._id);
      toast.error('Removed from wishlist');
    } else {
      addWishlistItem({
        id: product._id,
        name: product.name,
        slug: product.slug,
        discountPrice: product.discountPrice,
        price: product.price,
        image: product.images[0],
        vendorName: vendor?.storeName ?? '',
        categoryName: category?.name ?? '',
      });
      toast.success('Saved to wishlist');
    }
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group relative bg-[#FDFCF8] border border-[#1A1A1A]/10 overflow-hidden transition-all hover:border-[#1A1A1A]/30"
    >
      {discount > 0 && (
        <div className="absolute top-0 left-0 z-10 bg-[#1A1A1A] text-[#FDFCF8] text-[9px] font-bold px-3 py-1 uppercase tracking-widest">
          {discount}% OFF
        </div>
      )}

      <button
        onClick={toggleWishlist}
        className={cn(
          "absolute top-3 right-3 z-10 p-2 backdrop-blur-md transition-all border",
          isFavorite ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-white/50 text-[#1A1A1A] border-[#1A1A1A]/10 hover:bg-[#1A1A1A] hover:text-white"
        )}
      >
        <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
      </button>

      <div className="aspect-[4/5] overflow-hidden relative bg-[#EAE8E2]">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-white/10 backdrop-blur-sm">
          <button
            onClick={handleAddToCart}
            className="w-full py-3 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2"
          >
            <ShoppingCart size={14} />
            Quick Add
          </button>
        </div>
      </div>

      <div className="p-5">
        <p className="text-[9px] text-[#1A1A1A]/50 font-bold uppercase tracking-[0.25em] mb-2 leading-none">
          {vendor?.storeName}
        </p>
        <h3 className="font-heading text-lg text-[#1A1A1A] line-clamp-2 leading-[1.2] h-11 mb-3 group-hover:italic transition-all">
          {product.name}
        </h3>

        <div className="mb-4 opacity-80">
          <RatingStars rating={product.ratings.average} count={product.ratings.count} size={10} />
        </div>

        <div className="flex items-baseline gap-3 border-t border-[#1A1A1A]/5 pt-4">
          <span className="text-[#1A1A1A] font-bold text-base tracking-tight">
            {formatPrice(product.discountPrice ?? product.price)}
          </span>
          {product.discountPrice && product.discountPrice < product.price && (
            <span className="text-[#1A1A1A]/30 text-xs line-through italic">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};