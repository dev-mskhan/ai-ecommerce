import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useWishlistStore } from '@store/zustand/wishlistStore';
import { useCartStore } from '@store/zustand/cartStore';
import { formatPrice } from '@/utils/helpers';
import { riftToast } from '../common/toastContainer';

interface WishlistOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WishlistOverlay: React.FC<WishlistOverlayProps> = ({ isOpen, onClose }) => {
  const { items, removeItem } = useWishlistStore();
  const addItemToCart = useCartStore((state) => state.addItem);
  const navigate = useNavigate();

  const handleAddToCart = (item: any) => {
    addItemToCart({
      id: item.id,
      name: item.name,
      price: item.discountPrice ?? item.price,
      slug: item.slug,
      images: item.images,
      categoryName: item.categoryName,
      vendorName: item.vendorName,
      vendorId: item.vendorId,
      categoryId: item.categoryId,
      quantity: 1,
    });
    riftToast.success('Added to cart');
  };

  const handleProductClick = (slug: string) => {
    navigate(`/product/${slug}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#FDFCF8] z-[101] shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-[#1A1A1A]/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart size={16} fill="currentColor" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">Your Wishlist</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-[#1A1A1A]/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-6">
                  <Heart size={48} strokeWidth={1} />
                  <div className="space-y-2">
                    <p className="text-xl font-heading italic">Your wishlist is empty.</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest">Save items to see them here</p>
                  </div>
                  <button
                    onClick={() => { navigate('/category/all-items'); onClose(); }}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] border-b border-[#1A1A1A] pb-1"
                  >
                    Browse Products <ArrowRight size={12} />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8">
                  {items.map((item) => (
                    <div key={item.id} className="group relative flex gap-6 pb-8 border-b border-[#1A1A1A]/5 last:border-0 last:pb-0">
                      <div
                        onClick={() => handleProductClick(item.slug)}
                        className="w-24 h-24 bg-[#1A1A1A]/5 flex-shrink-0 grayscale group-hover:grayscale-0 transition-all cursor-pointer"
                      >
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-30">{item.categoryName}</span>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-[#1A1A1A]/20 hover:text-red-600 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <h4 className="text-sm font-bold tracking-tight mb-2 line-clamp-2">{item.name}</h4>
                          <p className="text-sm font-mono italic">{formatPrice(item.price)}</p>
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-[#FDFCF8] text-[9px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
                          >
                            <ShoppingCart size={12} /> Add to Cart
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex items-center gap-2 px-4 py-2 border border-[#1A1A1A]/10 text-[#1A1A1A]/60 text-[9px] font-black uppercase tracking-widest hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-all"
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-8 border-t border-[#1A1A1A]/10 bg-[#FDFCF8]">
                <button
                  onClick={() => { navigate('/cart'); onClose(); }}
                  className="w-full py-5 bg-[#1A1A1A] text-[#FDFCF8] text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-black transition-all flex items-center justify-center gap-3 group"
                >
                  Go to Cart <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
