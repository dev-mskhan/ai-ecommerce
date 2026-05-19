import React from 'react';
import { createPortal } from 'react-dom';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3, Package, ShoppingCart, Settings, LogOut, Bell,
  LayoutDashboard, DollarSign, Activity, Menu, X, MessageSquare,
  Archive, Store, CheckCheck,
} from 'lucide-react';
import { cn } from '@/utils/helpers';
import { SupportChat } from '@/components/common/SupportChat';
import { useGetVendorProfileQuery } from '@/store/api/vendorApi';
import { useGetNotificationsQuery, useMarkAllReadMutation, useMarkOneReadMutation } from '@/store/api/notificationApi';
import { useLogoutMutation } from '@/store/api/authApi';
import { riftToast } from '@/components/common/toastContainer';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/vendor' },
  { label: 'Products', icon: Package, path: '/vendor/products' },
  { label: 'Orders', icon: ShoppingCart, path: '/vendor/orders' },
  { label: 'Inventory', icon: Archive, path: '/vendor/inventory' },
  { label: 'Reports', icon: Activity, path: '/vendor/reports' },
  { label: 'Revenue Analytics', icon: DollarSign, path: '/vendor/revenue' },
  { label: 'Settings', icon: Settings, path: '/vendor/settings' },
];

export const VendorLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isSupportChatOpen, setIsSupportChatOpen] = React.useState(false);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const [dropdownPos, setDropdownPos] = React.useState({ top: 0, right: 0 });

  const notifRef = React.useRef<HTMLDivElement>(null);
  const bellBtnRef = React.useRef<HTMLButtonElement>(null);

  const { data: profileData } = useGetVendorProfileQuery();
  const { data: notifData } = useGetNotificationsQuery();
  const [markAllRead] = useMarkAllReadMutation();
  const [markOneRead] = useMarkOneReadMutation();
  const [logout] = useLogoutMutation();

  const profile = profileData?.data;
  const notifications = notifData?.data?.notifications ?? [];
  const unreadCount = notifData?.data?.unreadCount ?? 0;

  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        notifRef.current && !notifRef.current.contains(e.target as Node) &&
        bellBtnRef.current && !bellBtnRef.current.contains(e.target as Node)
      ) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNotifToggle = () => {
    if (!isNotifOpen && bellBtnRef.current) {
      const rect = bellBtnRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setIsNotifOpen((o) => !o);
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      riftToast.success('Logged out successfully');
    } catch {
      riftToast.error('Failed to log out');
    } finally {
      navigate('/login');
    }
  };

  const handleMarkOne = async (id: string) => {
    await riftToast.promise(markOneRead(id).unwrap(), {
      loading: 'Marking as read...',
      success: 'Marked as read!',
      error: 'Failed to mark as read',
    });
  };

  const handleMarkAll = async () => {
    await riftToast.promise(markAllRead().unwrap(), {
      loading: 'Marking all as read...',
      success: 'Marked all as read!',
      error: 'Failed to mark all as read',
    });
  };

  const initials = profile?.storeName
    ? profile.storeName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : profile?.name
      ? profile.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
      : 'V';

  return (
    <div className="flex h-screen bg-[#FDFCF8] overflow-hidden text-[#1A1A1A]">

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#1A1A1A]/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 w-64 bg-[#1A1A1A] flex flex-col flex-shrink-0 text-[#FDFCF8] z-50 transition-transform duration-300 lg:relative lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="px-8 py-8 border-b border-[#FDFCF8]/10 flex items-center justify-between">
          <Link to="/" className="flex flex-col items-start">
            <span className="font-heading font-black italic text-3xl tracking-tighter leading-none">RIFT</span>
            <span className="text-[8px] font-bold tracking-[0.5em] opacity-30 uppercase mt-0.5">Vendor Portal</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-[#FDFCF8]/40 hover:text-[#FDFCF8] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-0.5 overflow-y-auto">
          <p className="px-4 text-[9px] font-bold opacity-25 uppercase tracking-[0.4em] mb-6">Navigation</p>
          {NAV_ITEMS.map((item) => {
            const isActive = item.path === '/vendor'
              ? location.pathname === '/vendor'
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  'flex items-center justify-between px-4 py-3 transition-all group rounded-none',
                  isActive ? 'bg-[#FDFCF8] text-[#1A1A1A]' : 'opacity-40 hover:opacity-80 hover:bg-[#FDFCF8]/5',
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={15} strokeWidth={isActive ? 2 : 1.5} />
                  <span className={cn('text-xs tracking-wide', isActive ? 'font-bold' : 'font-medium')}>
                    {item.label}
                  </span>
                </div>
                {isActive && <div className="w-1 h-1 bg-[#1A1A1A] rounded-full" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-6 border-t border-[#FDFCF8]/10 space-y-1">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 bg-[#FDFCF8]/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {profile?.storeAvatar ? (
                <img src={profile.storeAvatar} className="w-full h-full object-cover grayscale" alt="" />
              ) : (
                <Store size={14} className="opacity-40" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-tight truncate leading-none">
                {profile?.storeName ?? 'Your Store'}
              </p>
              <p className="text-[9px] font-mono opacity-30 mt-0.5 truncate">
                {profile?.isApproved ? 'Verified' : 'Pending'} · {profile?.phoneNumber ?? '—'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest opacity-30 hover:opacity-70 hover:text-red-400 transition-all"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-20 bg-[#FDFCF8]/90 backdrop-blur-md border-b border-[#1A1A1A]/10 flex items-center justify-between px-6 md:px-10 flex-shrink-0 relative">

          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em]">
              <span className="opacity-30">Store</span>
              <span className="opacity-20">/</span>
              <span className="opacity-70">{profile?.storeName ?? 'Dashboard'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setIsSupportChatOpen(true)}
              className="w-9 h-9 flex items-center justify-center text-[#1A1A1A]/40 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/5 transition-all"
              title="Support"
            >
              <MessageSquare size={16} />
            </button>

            {/* Notifications bell — no wrapper div needed for positioning anymore */}
            <button
              ref={bellBtnRef}
              onClick={handleNotifToggle}
              className="relative w-9 h-9 flex items-center justify-center text-[#1A1A1A]/40 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/5 transition-all"
              title="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#1A1A1A] rounded-full" />
              )}
            </button>

            <div className="w-px h-6 bg-[#1A1A1A]/10 hidden sm:block" />

            <Link to="/vendor/settings" className="flex items-center gap-3 hover:opacity-70 transition-opacity">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold uppercase tracking-wide leading-none">
                  {profile?.storeName ?? 'Vendor'}
                </p>
                <p className="text-[9px] font-mono opacity-30 mt-0.5">
                  {profile?.isApproved ? 'Verified' : 'Pending'}
                </p>
              </div>
              <div className="w-9 h-9 bg-[#1A1A1A] text-[#FDFCF8] flex items-center justify-center overflow-hidden flex-shrink-0">
                {profile?.storeAvatar ? (
                  <img src={profile.storeAvatar} className="w-full h-full object-cover grayscale" alt="" />
                ) : (
                  <span className="text-[10px] font-black tracking-tight">{initials}</span>
                )}
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-14 py-10 lg:py-14">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Notification Dropdown — portaled to body */}
      {isNotifOpen && createPortal(
        <div
          ref={notifRef}
          style={{ top: dropdownPos.top, right: dropdownPos.right }}
          className="fixed w-80 bg-[#FDFCF8] border border-[#1A1A1A]/10 shadow-lg z-[9999]"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1A1A1A]/5">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-50">
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="text-[9px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 flex items-center gap-1 transition-all"
              >
                <CheckCheck size={11} /> All read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-[9px] font-bold uppercase tracking-widest opacity-20 py-8">
                No notifications
              </p>
            ) : (
              notifications.slice(0, 8).map((n: any) => (
                <button
                  key={n._id}
                  onClick={() => handleMarkOne(n._id)}
                  className={cn(
                    'w-full text-left px-5 py-4 border-b border-[#1A1A1A]/5 hover:bg-[#EAE8E2] bg-[#FDFCF8] transition-colors',
                    !n.isRead ? 'bg-[#1A1A1A]/[0.02]' : '',
                  )}
                  disabled={n.isRead}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0',
                      !n.isRead ? 'bg-[#1A1A1A]' : 'bg-[#1A1A1A]/20',
                    )} />
                    <div className="min-w-0">
                      <p className={cn(
                        'text-xs leading-snug truncate',
                        !n.isRead ? 'font-bold' : 'font-medium opacity-60',
                      )}>
                        {n.title}
                      </p>
                      <p className="text-[9px] font-mono opacity-30 mt-0.5 truncate">{n.message}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>,
        document.body
      )}

      <SupportChat isOpen={isSupportChatOpen} onClose={() => setIsSupportChatOpen(false)} />
    </div>
  );
};