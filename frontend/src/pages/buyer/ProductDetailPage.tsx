import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Minus, Truck, ShieldCheck, Clock, Share2, Heart } from 'lucide-react';
import { formatPrice, cn } from '@/utils/helpers';
import { Button } from '@/components/ui/Button';
import { RatingStars } from '@/components/common/RatingStars';
import { ReviewsSection } from '@/components/buyer/ReviewsSection';
import { useCartStore } from '@store/zustand/cartStore';
import { useWishlistStore } from '@store/zustand/wishlistStore';
import { useProductBySlug } from '@store/hooks/useProduct';
import { riftToast } from '@/components/common/toastContainer';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [selectedVariant, setSelectedVariant] = React.useState<Record<string, string>>({});

  const { data, isLoading, isError } = useProductBySlug(id!);
  const product = data?.data;

  const addItemToCart = useCartStore(s => s.addItem);
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlistStore();
  const isFavorite = product ? isInWishlist(product._id) : false;

  if (isLoading) return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        <div className="lg:col-span-7 aspect-[4/5] bg-[#1A1A1A]/5 animate-pulse" />
        <div className="lg:col-span-5 space-y-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-10 bg-[#1A1A1A]/5 animate-pulse" />)}
        </div>
      </div>
    </div>
  );

  if (isError || !product) return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-32 text-center">
      <p className="text-4xl font-heading font-black italic">Product not found</p>
    </div>
  );

  const { name, description, price, discountPrice, images, ratings, stock, variants, category, vendor, slug, _id } = product;
  const discountPercent = discountPrice && price > discountPrice
    ? Math.round(((price - discountPrice) / price) * 100)
    : null;

  const handleAddToCart = () => {
    addItemToCart({
      id: _id,
      name,
      price: discountPrice ?? price,
      slug,
      images,
      categoryName: category?.name ?? '',
      vendorName: vendor?.storeName ?? '',
      quantity,
    });
    riftToast.success('Added to cart');
  };

  const toggleWishlist = () => {
    if (isFavorite) {
      removeWishlistItem(_id);
      riftToast.error('Removed from wishlist');
    } else {
      addWishlistItem({
        id: _id,
        name,
        slug,
        discountPrice,
        price,
        image: images[0],
        vendorName: vendor?.storeName ?? '',
        categoryName: category?.name ?? '',
      });
      riftToast.success('Saved to wishlist');
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A1A1A]/40 mb-12 overflow-x-auto whitespace-nowrap pb-4">
        <Link to="/" className="hover:text-[#1A1A1A] hover:line-through">Home</Link>
        <span className="opacity-20 px-2">/</span>
        <Link to={`/category/${category?.slug}`} className="hover:text-[#1A1A1A] hover:line-through">{category?.name}</Link>
        <span className="opacity-20 px-2">/</span>
        <span className="text-[#1A1A1A] truncate">{name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        {/* Images */}
        <div className="lg:col-span-7 space-y-6">
          <div className="aspect-[4/5] overflow-hidden bg-[#EAE8E2] border border-[#1A1A1A]/5">
            <img src={images[selectedImage]} className="w-full h-full object-cover transition-all duration-1000" alt={name} />
          </div>
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {images.map((img: string, idx: number) => (
                <button key={idx} onClick={() => setSelectedImage(idx)}
                  className={cn("w-24 h-32 overflow-hidden border transition-all flex-shrink-0",
                    selectedImage === idx ? "border-[#1A1A1A] opacity-100" : "border-transparent opacity-40 hover:opacity-100")}>
                  <img src={img} className="w-full h-full object-cover" alt={`thumb-${idx}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:col-span-5 flex flex-col gap-10">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#1A1A1A]/40 border-b border-[#1A1A1A]/10 pb-1">
                {vendor?.storeName}
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-heading font-medium italic text-[#1A1A1A] mb-6 leading-[1.1] tracking-tight">
              {name}
            </h1>
            <div className="flex items-center gap-6 border-t border-[#1A1A1A]/5 pt-6">
              <RatingStars rating={ratings.average} count={ratings.count} size={12} />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
                {stock > 0 ? `${stock} In Stock` : 'Sold Out'}
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-6 border-b border-[#1A1A1A]/10 pb-10">
            <span className="text-5xl font-heading font-black text-[#1A1A1A] tracking-tighter">
              {formatPrice(discountPrice ?? price)}
            </span>
            {discountPrice && price > discountPrice && (
              <div className="flex items-center gap-3">
                <span className="text-2xl text-[#1A1A1A]/30 line-through italic font-light">{formatPrice(price)}</span>
                <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 uppercase tracking-widest">
                  -{discountPercent}%
                </span>
              </div>
            )}
          </div>

          {/* Variants */}
          {variants?.map((variant: any) => (
            <div key={variant.label} className="space-y-6">
              <p className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-[0.4em] opacity-40">{variant.label}</p>
              <div className="flex flex-wrap gap-4">
                {variant.options.map((opt: string) => (
                  <button key={opt}
                    onClick={() => setSelectedVariant(prev => ({ ...prev, [variant.label]: opt }))}
                    className={cn(
                      "px-8 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border",
                      selectedVariant[variant.label] === opt
                        ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
                        : "bg-transparent border-[#1A1A1A]/10 text-[#1A1A1A]/60 hover:border-[#1A1A1A]"
                    )}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity & Actions */}
          <div className="flex flex-col sm:flex-row gap-6 mt-6">
            <div className="flex items-center border border-[#1A1A1A]/10 p-1">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-all">
                <Minus size={18} />
              </button>
              <span className="w-10 text-center font-bold text-sm tracking-widest">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                className="w-12 h-12 flex items-center justify-center text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-all">
                <Plus size={18} />
              </button>
            </div>
            <Button size="lg" className="flex-1 h-14" onClick={handleAddToCart} disabled={stock === 0}>
              {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <button onClick={toggleWishlist}
              className={cn("w-14 h-14 flex items-center justify-center border transition-all",
                isFavorite ? "bg-[#1A1A1A] border-[#1A1A1A] text-white" : "border-[#1A1A1A]/10 text-[#1A1A1A]/40 hover:text-red-600")}>
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-6">
            {[{ icon: Truck, text: 'Shipping' }, { icon: ShieldCheck, text: 'Genuine' }, { icon: Clock, text: '7-Day returns' }].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-4 p-6 border border-[#1A1A1A]/5 text-center">
                <item.icon size={18} strokeWidth={1.5} className="opacity-40" />
                <span className="text-[9px] font-bold text-[#1A1A1A]/60 uppercase tracking-[0.3em]">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 border-t border-[#1A1A1A]/10 pt-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">Product Details</h3>
              <button className="text-[#1A1A1A]/40 hover:text-[#1A1A1A]"><Share2 size={18} /></button>
            </div>
            <p className="text-sm text-[#1A1A1A]/70 leading-relaxed font-light tracking-wide first-letter:text-4xl first-letter:font-heading first-letter:mr-3 first-letter:float-left first-letter:leading-none">
              {description}
            </p>
          </div>
        </div>
      </div>

      <ReviewsSection productId={_id} vendorId={vendor?._id} />
    </div>
  );
};