import React from 'react';
import { createPortal } from 'react-dom';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Store, Package, ShoppingCart, BarChart3,
  Settings, LogOut, Bell, MessageSquare, ShieldAlert, Menu, X, Tag, CheckCheck,
} from 'lucide-react';
import { cn } from '@/utils/helpers';
import { SupportChat } from '@/components/common/SupportChat';
import { useAppSelector } from '@store/index';
import { useGetNotificationsQuery, useMarkAllReadMutation, useMarkOneReadMutation } from '@store/api/notificationApi';
import { useGetAllSupportChatsQuery } from '@store/api/supportApi';
import { riftToast } from '@/components/common/toastContainer';

export const AdminLayout: React.FC = () => {
  const [isSupportChatOpen, setIsSupportChatOpen] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const [dropdownPos, setDropdownPos] = React.useState({ top: 0, right: 0 });

  const notifRef = React.useRef<HTMLDivElement>(null);
  const bellBtnRef = React.useRef<HTMLButtonElement>(null);
  const location = useLocation();

  const user = useAppSelector((s: any) => s.auth?.user);

  const { data: notifData } = useGetNotificationsQuery();
  const [unreadCount, notifications] = React.useMemo(() => {
    const notifs: any[] = notifData?.data?.notifications ?? [];
    return [notifs.filter((n: any) => !n.isRead).length, notifs];
  }, [notifData]);

  const [markAllRead] = useMarkAllReadMutation();
  const [markOneRead] = useMarkOneReadMutation();

  const { data: supportData } = useGetAllSupportChatsQuery();
  const openTickets: number = React.useMemo(() => {
    const chats: any[] = supportData?.data ?? [];
    return chats.filter((c: any) => c.status === 'open').length;
  }, [supportData]);

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
      setDropdownPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    }
    setIsNotifOpen((o) => !o);
  };

  const handleMarkOne = async (id: string) => {
    await riftToast.promise(markOneRead(id).unwrap(), {
      loading: 'Marking as read...', success: 'Marked as read!', error: 'Failed to mark as read',
    });
  };

  const handleMarkAll = async () => {
    await riftToast.promise(markAllRead().unwrap(), {
      loading: 'Marking all as read...', success: 'Marked all as read!', error: 'Failed to mark all as read',
    });
  };

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Users', icon: Users, path: '/admin/users' },
    { label: 'Vendors', icon: Store, path: '/admin/vendors' },
    { label: 'Products', icon: Package, path: '/admin/products' },
    { label: 'Categories', icon: LayoutDashboard, path: '/admin/categories' },
    { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { label: 'Coupons', icon: Tag, path: '/admin/coupons' },
    { label: 'Reports', icon: ShieldAlert, path: '/admin/reports' },
    { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-[#FDFCF8] text-[#1A1A1A] overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 w-72 bg-[#1A1A1A] flex flex-col flex-shrink-0 text-[#FDFCF8] z-50 transition-transform duration-300 transform lg:relative lg:translate-x-0',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
      )}>
        <div className="p-10 border-b border-[#FDFCF8]/10 flex items-center justify-between">
          <Link to="/" className="flex flex-col items-start gap-0 group">
            <span className="font-heading font-black italic text-4xl tracking-tighter">SHOP</span>
            <span className="text-[9px] font-bold tracking-[0.5em] opacity-40 uppercase">Admin Panel</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-[#FDFCF8]/40 hover:text-[#FDFCF8]">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 px-6 py-10 space-y-1 overflow-y-auto no-scrollbar">
          <p className="px-4 text-[10px] font-bold opacity-30 uppercase tracking-[0.4em] mb-6">Management</p>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  'flex items-center justify-between px-4 py-3.5 transition-all group',
                  active ? 'bg-[#FDFCF8] text-[#1A1A1A] italic font-medium' : 'opacity-40 hover:opacity-100 hover:pl-6',
                )}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={16} strokeWidth={1.5} />
                  <span className="text-sm tracking-wide">{item.label}</span>
                </div>
                {active && <div className="w-1.5 h-1.5 bg-[#1A1A1A] rounded-full" />}
              </Link>
            );
          })}
        </div>

        <div className="p-8 border-t border-[#FDFCF8]/5 space-y-2">
          {user && (
            <div className="px-4 py-3 mb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 truncate">{user.name ?? 'Administrator'}</p>
              <p className="text-[9px] font-mono opacity-30 truncate">{user.email}</p>
            </div>
          )}
          <Link
            to="/login"
            className="flex items-center gap-4 px-4 py-3 text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-red-400 transition-all"
          >
            <LogOut size={15} /> Logout
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-[#FDFCF8]/80 backdrop-blur-md border-b border-[#1A1A1A]/10 flex items-center justify-between px-6 md:px-12 flex-shrink-0 relative">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
            >
              <Menu size={22} />
            </button>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => setIsSupportChatOpen(true)}
              className="relative p-2 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
              title="Support tickets"
            >
              <MessageSquare size={18} />
              {openTickets > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
              )}
            </button>

            {/* Bell button — no wrapper div needed */}
            <button
              ref={bellBtnRef}
              onClick={handleNotifToggle}
              className="relative p-2 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-[8px] font-black text-white px-0.5">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </span>
              )}
            </button>

            <div className="w-px h-6 bg-[#1A1A1A]/10 hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-widest">{user?.name ?? 'Administrator'}</p>
                <p className="text-[9px] font-mono opacity-40">SUPER ADMIN</p>
              </div>
              <div className="w-9 h-9 bg-[#1A1A1A] flex items-center justify-center text-[#FDFCF8] font-black text-sm">
                {(user?.name ?? 'A')[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16">
          <div className="max-w-[1200px] mx-auto">
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
                      <p className={cn('text-xs leading-snug truncate', !n.isRead ? 'font-bold' : 'font-medium opacity-60')}>
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
        document.body,
      )}

      <SupportChat isOpen={isSupportChatOpen} onClose={() => setIsSupportChatOpen(false)} />
    </div>
  );
};