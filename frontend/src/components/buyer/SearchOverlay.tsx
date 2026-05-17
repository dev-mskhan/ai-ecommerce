import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPrice, useDebounce } from '@/utils/helpers';
import { useProducts } from '@store/hooks/useProduct';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading, isFetching } = useProducts(
    { q: debouncedQuery, limit: '6' },
  );

  const results = data?.data?.products ?? [];
  const isSearching = isLoading || isFetching;

  const handleProductClick = (slug: string) => {
    navigate(`/product/${slug}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#FDFCF8] z-[101] shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-[#1A1A1A]/10 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">Search Products</span>
              <button onClick={onClose} className="p-2 hover:bg-[#1A1A1A]/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              <div className="relative">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 opacity-20" size={20} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search for anything..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-[#1A1A1A]/10 py-4 pl-10 text-xl font-heading italic focus:border-[#1A1A1A] outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-8 no-scrollbar">
              {!query.trim() ? (
                <div className="space-y-8 pt-4">
                  <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-30 mb-6">Popular Categories</h4>
                  <div className="flex flex-wrap gap-3">
                    {['Electronics', 'Fashion', 'Home Decor', 'New Arrivals'].map(tag => (
                      <button key={tag} onClick={() => setQuery(tag)}
                        className="px-4 py-2 bg-[#1A1A1A]/5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-30">
                    {isSearching ? 'Searching...' : `Results (${results.length})`}
                  </h4>

                  {results.length > 0 ? (
                    <div className="grid grid-cols-1 gap-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
                      {results.map((product: any) => (
                        <button key={product._id} onClick={() => handleProductClick(product.slug)}
                          className="flex items-center gap-6 p-4 bg-[#FDFCF8] hover:bg-[#EAE8E2] transition-colors text-left group">
                          <div className="w-16 h-16 bg-[#1A1A1A]/5 overflow-hidden flex-shrink-0 grayscale group-hover:grayscale-0 transition-all">
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-1">{product.category?.name}</p>
                            <h5 className="text-sm font-bold tracking-tight truncate">{product.name}</h5>
                            <p className="text-sm font-mono mt-1 italic">{formatPrice(product.discountPrice ?? product.price)}</p>
                          </div>
                          <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                        </button>
                      ))}
                    </div>
                  ) : !isSearching && (
                    <div className="py-20 text-center opacity-40">
                      <ShoppingBag size={32} className="mx-auto mb-4 stroke-1" />
                      <p className="text-sm italic">No products found.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};