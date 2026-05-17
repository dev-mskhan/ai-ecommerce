import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  LogOut,
  Bell,
  Search,
  MessageSquare,
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/utils/helpers';
import { SupportChat } from '@/components/common/SupportChat';

export const AdminLayout: React.FC = () => {
  const [isSupportChatOpen, setIsSupportChatOpen] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Users', icon: Users, path: '/admin/users' },
    { label: 'Vendors', icon: Store, path: '/admin/vendors' },
    { label: 'Products', icon: Package, path: '/admin/products' },
    { label: 'Categories', icon: LayoutDashboard, path: '/admin/categories' },
    { label: 'System Logs', icon: ShieldAlert, path: '/admin/reports' },
    { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  // Close sidebar on route change
  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-[#FDFCF8] text-[#1A1A1A] overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-[#1A1A1A] flex flex-col flex-shrink-0 text-[#FDFCF8] z-50 transition-transform duration-300 transform lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-10 border-b border-[#FDFCF8]/10 flex items-center justify-between">
          <Link to="/" className="flex flex-col items-start gap-0 group">
            <span className="font-heading font-black italic text-4xl tracking-tighter">SHOP</span>
            <span className="text-[9px] font-bold tracking-[0.5em] opacity-40 uppercase">ADMIN PANEL</span>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-[#FDFCF8]/40 hover:text-[#FDFCF8]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 px-6 py-12 space-y-2 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold opacity-30 uppercase tracking-[0.4em] mb-8">Management</p>
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                "flex items-center justify-between px-4 py-4 transition-all group",
                location.pathname === item.path 
                  ? "bg-[#FDFCF8] text-[#1A1A1A] italic font-medium" 
                  : "opacity-40 hover:opacity-100 hover:pl-6"
              )}
            >
              <div className="flex items-center gap-4">
                <item.icon size={18} strokeWidth={1} />
                <span className="text-sm tracking-wide">{item.label}</span>
              </div>
              {location.pathname === item.path && <div className="w-1.5 h-1.5 bg-[#1A1A1A] rounded-full"></div>}
            </Link>
          ))}
        </div>

        <div className="p-8 border-t border-[#FDFCF8]/5">
          <Link to="/login" className="flex items-center gap-4 px-4 py-3 text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-red-400 transition-all">
            <LogOut size={16} />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-24 bg-[#FDFCF8]/80 backdrop-blur-md border-b border-[#1A1A1A]/10 flex items-center justify-between px-6 md:px-12 flex-shrink-0">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex-1 max-w-xl relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30" size={16} />
              <input 
                type="text" 
                placeholder="Search records..."
                className="w-full bg-[#1A1A1A]/5 border-none p-4 text-[10px] uppercase font-bold tracking-widest outline-none pl-12"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <button 
              onClick={() => setIsSupportChatOpen(true)}
              className="p-2 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
            >
              <MessageSquare size={18} />
            </button>
            <button className="relative p-2 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-600 rounded-full"></span>
            </button>
            <div className="w-px h-8 bg-[#1A1A1A]/10 hidden sm:block"></div>
            <div className="flex items-center gap-3 md:gap-5">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold uppercase tracking-widest">Administrator</p>
                <p className="text-[9px] font-mono opacity-40">SUPER_ADMIN</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1A1A1A]/5 border border-[#1A1A1A]/5 flex items-center justify-center grayscale">
                <LayoutDashboard size={20} className="opacity-40" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16">
          <div className="max-w-[1200px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <SupportChat isOpen={isSupportChatOpen} onClose={() => setIsSupportChatOpen(false)} />
    </div>
  );
};
