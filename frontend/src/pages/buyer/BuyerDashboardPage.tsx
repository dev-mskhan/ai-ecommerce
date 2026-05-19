import React from 'react';
import { User, Package, Star, MessageSquare, Bell, LogOut, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/helpers';
import { ProfileTab } from '@/components/buyer/dashboard/ProfileTab';
import { OrdersTab } from '@/components/buyer/dashboard/OrdersTab';
import { ReviewsTab } from '@/components/buyer/dashboard/ReviewsTab';
import { AIChatHistoryTab } from '@/components/buyer/dashboard/AIChatHistoryTab';
import { NotificationsTab } from '@/components/buyer/dashboard/NotificationsTab';
import { useLoginMutation, useLogoutMutation } from '@store/api/authApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { riftToast } from '@/components/common/toastContainer';

const menuItems = [
  { icon: User, label: 'Profile', component: <ProfileTab /> },
  { icon: Package, label: 'Orders', component: <OrdersTab /> },
  { icon: Star, label: 'Reviews', component: <ReviewsTab /> },
  { icon: MessageSquare, label: 'AI Chat History', component: <AIChatHistoryTab /> },
  { icon: Bell, label: 'Notifications', component: <NotificationsTab /> },
];

export const BuyerDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('Profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const activeComponent = menuItems.find(m => m.label === activeTab)?.component;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      riftToast.error("Logout failed");
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
      <header className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-[#1A1A1A]/10 pb-12 gap-8">
        <div>
          <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="danger" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut size={14} />Logout
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 xl:gap-24">
        {/* Mobile Menu */}
        <div className="xl:hidden mb-12">
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
        <nav className="hidden xl:block lg:col-span-2 space-y-12">
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