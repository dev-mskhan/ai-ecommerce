import React, { Suspense } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Heart, Bell, User, Menu, X, Sparkles, MessageSquare } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useCartStore } from '@/store/zustand/cartStore';
import { useWishlistStore } from '@/store/zustand/wishlistStore';
import { AiAssistantModal } from '@/components/common/AiAssistantModal';
import { SearchOverlay } from '@/components/buyer/SearchOverlay';
import { WishlistOverlay } from '@/components/buyer/WishlistOverlay';
import { SupportChat } from '@/components/common/SupportChat';
import { useAppContext } from '@/store/context/AppContext';
import { useCategories } from '@/store/hooks/useCategory';
import { useAppSelector } from '@/store';

export const BuyerLayout: React.FC = () => {
  const { isMobileMenuOpen, isAiModalOpen, isSearchOpen, isWishlistOpen, isSupportChatOpen, setIsMobileMenuOpen, setIsAiModalOpen, setIsSearchOpen, setIsWishlistOpen, setIsSupportChatOpen, currentCategory, setCurrentCategory } = useAppContext();
  const location = useLocation();
  const cartItemsCount = useCartStore((state) => state.items.length);
  const wishlistItemsCount = useWishlistStore((state) => state.items.length);
  const { data, isSuccess } = useCategories();
  const categories = data?.data;
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const hiddenRoutes = ["/category/", "/categories", "/product/", "/checkout", "/cart", "/payment-success", "/account", "/vendor-onboarding"];
  const shouldHide = hiddenRoutes.some(path => location.pathname.startsWith(path));
  return (
    <div className="min-h-screen bg-[#FDFCF8]">
      {/* Announcement Bar */}
      <div className="bg-[#1A1A1A] text-[#FDFCF8] py-3 px-4 text-center text-[10px] uppercase font-bold tracking-[0.3em] border-b border-[#1A1A1A]">
        ISSUE NO. 14 — FREE DELIVERY ON ALL ORDERS ABOVE RS.2,000 — SUMMER {new Date().getFullYear()}
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#FDFCF8]/90 backdrop-blur-md border-b border-[#1A1A1A]/10">
        <nav className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-18 sm:h-24 gap-4">
            {/* Logo */}
            <Link to="/" className="flex flex-col items-start gap-0 flex-shrink-0 group">
              <span className="font-heading font-black italic text-4xl text-[#1A1A1A] tracking-tighter transition-all group-hover:scale-105">
                SHOP
              </span>
              <span className="text-[10px] font-bold tracking-[0.5em] text-[#1A1A1A]/40 uppercase mt-[-4px]">
                RIFT
              </span>
            </Link>

            {/* Icons */}
            <div className="flex items-center gap-2 sm:gap-6">
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="p-3 bg-[#1A1A1A] text-[#FDFCF8] hover:bg-black transition-all flex items-center gap-2 group"
              >
                <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                <span className="hidden lg:block text-[10px] font-bold uppercase tracking-widest">AI Assistant</span>
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-3 text-[#1A1A1A] hover:bg-black/5 transition-all"
              >
                <Search size={20} />
              </button>

              <button
                onClick={() => setIsWishlistOpen(true)}
                className="p-3 text-[#1A1A1A] hover:bg-black/5 transition-all relative hidden sm:block"
              >
                <Heart size={20} />
                {wishlistItemsCount > 0 && (
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center border border-[#FDFCF8]">
                    {wishlistItemsCount}
                  </span>
                )}
              </button>

              <Link to="/cart" className="p-3 text-[#1A1A1A] hover:bg-black/5 transition-all relative">
                <ShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute top-2 right-2 bg-[#1A1A1A] text-white text-[8px] font-black w-4 h-4 flex items-center justify-center border border-[#FDFCF8]">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <Link to="/account" className="flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white hover:bg-black transition-all cursor-pointer">
                  <User size={16} />
                  <span className="hidden sm:block text-[10px] font-bold uppercase tracking-widest">Account</span>
                </Link>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login" className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#1A1A1A] transition-all">
                    Login
                  </Link>
                  <Link to="/signup" className="px-5 py-2.5 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all">
                    Sign Up
                  </Link>
                </div>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-3 text-[#1A1A1A] hover:bg-black/5"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Desktop Categories */}
          {!shouldHide && <div className="hidden md:flex items-center justify-center gap-12">
            {isSuccess && [{ name: "All Items", slug: "all-items", _id: "0" }, ...categories]?.map((category) => (
              <Link
                key={category._id}
                to={`/category/${category.slug}`}
                onClick={() => setCurrentCategory(category.slug)}
                className={cn(
                  "text-[10px] font-bold text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-all uppercase tracking-[0.3em] py-2 border-b-2 border-transparent hover:border-[#1A1A1A]",
                  category.slug === currentCategory && "text-[#1A1A1A] border-[#1A1A1A]"
                )}
              >
                {category.name}
              </Link>
            ))}
          </div>}
        </nav>
      </header>

      {/* Main Content */}
      <main className="min-h-screen">
        <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="w-12 h-[2px] bg-[#1A1A1A] animate-pulse"></div></div>}>
          <Outlet />
        </Suspense>
      </main>

      {/* AI Assistant Modal */}
      <AiAssistantModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />

      {/* Overlays */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <WishlistOverlay isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />

      {/* Support Chat */}
      <SupportChat isOpen={isSupportChatOpen} onClose={() => setIsSupportChatOpen(false)} />

      {/* Floating Support Button */}
      {!isSupportChatOpen && (
        <button
          onClick={() => setIsSupportChatOpen(true)}
          className="fixed bottom-8 right-8 z-[90] w-16 h-16 bg-[#1A1A1A] text-[#FDFCF8] flex items-center justify-center shadow-2xl hover:scale-105 transition-all group"
        >
          <MessageSquare size={24} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-[#FDFCF8]"></span>
        </button>
      )}

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-[#FDFCF8] py-12 lg:py-15">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-10 border-b border-[#FDFCF8]/10 pb-20">
            <div className="md:col-span-4">
              <div className="flex flex-col items-start gap-0 mb-8 text-[#FDFCF8]">
                <span className="font-heading font-black italic text-5xl tracking-tighter">SHOP</span>
                <span className="text-xs font-bold tracking-[0.5em] opacity-40 uppercase">RIFT</span>
              </div>
              <p className="text-[#FDFCF8]/60 text-sm leading-relaxed max-w-sm font-light">
                A curated destination for the modern minimalist. Bringing global excellence to your architectural space.
              </p>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-[#FDFCF8]/40">Inquiry</h4>
              <ul className="space-y-4 text-xs font-medium">
                <li><Link to="#" className="hover:underline transition-all">Support</Link></li>
                <li><Link to="#" className="hover:underline transition-all">Tracking</Link></li>
                <li><Link to="#" className="hover:underline transition-all">Returns</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-[#FDFCF8]/40">Company</h4>
              <ul className="space-y-4 text-xs font-medium">
                <li><Link to="#" className="hover:underline transition-all">Manifesto</Link></li>
                <li><Link to="#" className="hover:underline transition-all">Careers</Link></li>
                <li><Link to="/vendor/login" className="hover:underline transition-all">Partners</Link></li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-[#FDFCF8]/40">Correspondence</h4>
              <ul className="space-y-4 text-xs font-medium text-[#FDFCF8]">
                <li className="opacity-60 italic underline underline-offset-4 decoration-[#FDFCF8]/20">info@shoprift.pk</li>
                <li className="font-mono opacity-60">+21 111-RIFT-01</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">
              © {new Date().getFullYear()} — Berlin / Tokyo / Karachi
            </div>
            <div className="flex gap-8">
              <div className="inline-block border border-[#FDFCF8]/20 px-3 py-1 text-[12px] uppercase tracking-tighter opacity-50 font-mono">
                ISSN 2471-8890
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
