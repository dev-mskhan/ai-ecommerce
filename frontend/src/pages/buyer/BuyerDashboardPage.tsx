import React from 'react';
import { User, Package, Heart, Star, MessageSquare, MapPin, Shield, Bell, LogOut, Settings, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/helpers';
import { ProfileTab } from '@/components/buyer/dashboard/ProfileTab';
import { OrdersTab } from '@/components/buyer/dashboard/OrdersTab';
import { WishlistTab } from '@/components/buyer/dashboard/WishlistTab';
import { ReviewsTab } from '@/components/buyer/dashboard/ReviewsTab';
import { AIChatHistoryTab } from '@/components/buyer/dashboard/AIChatHistoryTab';
import { AddressesTab } from '@/components/buyer/dashboard/AddressesTab';
import { NotificationsTab } from '@/components/buyer/dashboard/NotificationsTab';

const menuItems = [
  { icon: User, label: 'Profile', component: <ProfileTab /> },
  { icon: Package, label: 'Orders', component: <OrdersTab /> },
  { icon: Heart, label: 'Wishlist', component: <WishlistTab /> },
  { icon: Star, label: 'Reviews', component: <ReviewsTab /> },
  { icon: MessageSquare, label: 'AI Chat History', component: <AIChatHistoryTab /> },
  { icon: MapPin, label: 'Addresses', component: <AddressesTab /> },
  { icon: Bell, label: 'Notifications', component: <NotificationsTab /> },
];

export const BuyerDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('Profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const activeComponent = menuItems.find(m => m.label === activeTab)?.component;

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
      <header className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-[#1A1A1A]/10 pb-12 gap-8">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-8">My Account</div>
          <h1 className="text-5xl lg:text-7xl font-heading font-black italic tracking-tighter uppercase leading-none">
            User <br /><span className="not-italic font-sans text-sm tracking-[0.5em] font-bold opacity-40">Account</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2"><Settings size={14} />Settings</Button>
          <Button variant="danger" className="flex items-center gap-2"><LogOut size={14} />Logout</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        {/* Mobile Menu */}
        <div className="lg:hidden mb-12">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="w-full flex items-center justify-between px-6 py-4 bg-[#1A1A1A] text-[#FDFCF8] text-[10px] font-bold uppercase tracking-widest shadow-lg">
            <span>{activeTab}</span>
            {isMobileMenuOpen ? <X size={14} /> : <ChevronDown size={14} />}
          </button>
          <div className={cn("mt-px bg-[#FDFCF8] border border-[#1A1A1A]/10 shadow-xl transition-all duration-300 overflow-hidden", isMobileMenuOpen ? "max-h-[500px]" : "max-h-0 border-none")}>
            <div className="grid grid-cols-1 divide-y divide-[#1A1A1A]/5">
              {menuItems.map((item) => (
                <button key={item.label} onClick={() => { setActiveTab(item.label); setIsMobileMenuOpen(false); }} className={cn("w-full flex items-center gap-4 px-8 py-4 transition-all text-left", activeTab === item.label ? "bg-[#1A1A1A]/5 italic font-bold" : "text-[#1A1A1A]/40 hover:text-[#1A1A1A]")}>
                  <item.icon size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <nav className="hidden lg:block lg:col-span-3 space-y-12">
          <div className="space-y-6">
            <p className="text-[10px] font-bold text-[#1A1A1A]/40 uppercase tracking-[0.3em]">Menu</p>
            <div className="space-y-4">
              {menuItems.map((item) => (
                <button key={item.label} onClick={() => setActiveTab(item.label)} className={cn("w-full flex items-center justify-between group py-3 transition-all border-b border-transparent hover:border-[#1A1A1A]/5", activeTab === item.label ? "italic font-medium pr-4 translate-x-2" : "opacity-60 hover:opacity-100")}>
                  <div className="flex items-center gap-4">
                    <item.icon size={16} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
                  </div>
                  {activeTab === item.label && <div className="w-1.5 h-1.5 bg-[#1A1A1A] rounded-full" />}
                </button>
              ))}
            </div>
          </div>
          <div className="p-8 bg-[#1A1A1A]/5 italic text-sm font-light leading-relaxed border-l-2 border-[#1A1A1A]">
            "All systems are running smoothly. Your account is fully active."
          </div>
        </nav>

        {/* Content */}
        <div className="lg:col-span-9 min-h-[600px]">
          {activeComponent}
        </div>
      </div>
    </div>
  );
};