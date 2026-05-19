import { Bell, Check, Shield, Trash2 } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useNotifications } from '@store/hooks/useNotification';
import { riftToast } from '@/components/common/toastContainer';
import { useMemo } from 'react';

export const NotificationsTab = () => {
    const { data, isLoading, isError, refetch, markOne, markAll } = useNotifications();
    const notifications = useMemo(() => data?.data?.notifications ?? [], [data]);

    if (isLoading) return <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Loading notifications...</p>;
    if (isError) return <p className="text-[10px] font-bold uppercase tracking-widest text-red-600">Failed to load notifications.</p>;
    const markAllRead = async () => {
        await riftToast.promise(
            markAll(undefined),
            {
                loading: "Marking all notifications as read...",
                success: "All notifications marked as read!",
                error: "Failed to mark all notifications as read.",
            }
        );
        refetch();
    };
    const markOneRead = async (id: string) => {
        await riftToast.promise(
            markOne(id),
            {
                loading: "Marking notification as read...",
                success: "Notification marked as read!",
                error: "Failed to mark notification as read.",
            }
        );
        refetch();
    };

    return (
        <section className="space-y-12">
            <div className="flex items-baseline justify-between border-b border-[#1A1A1A]/10 pb-4">
                <h2 className="text-[14px] font-bold uppercase tracking-[0.5em] opacity-70">Notifications</h2>
                <div className="flex gap-4">
                    <button
                        onClick={() => markAllRead()}
                        className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 hover:line-through transition-all"
                    >
                        Mark All As Read
                    </button>
                </div>
            </div>
            {notifications.length === 0 ? (
                <p className="text-sm font-light opacity-40">No notifications.</p>
            ) : (
                <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10 overflow-hidden">
                    {notifications.map((n: any) => (
                        <div
                            key={n._id ?? n.id}
                            className={cn(
                                "bg-[#FDFCF8] p-8 flex gap-8 items-start group hover:bg-[#EAE8E2] transition-colors relative",
                                !n.isRead && "after:content-[''] after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1 after:bg-[#1A1A1A]"
                            )}
                        >
                            <div className="mt-1">
                                {n.urgent ? <Shield size={16} className="text-red-600" /> : <Bell size={16} className={cn(n.isRead ? "opacity-10" : "opacity-40")} />}
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-baseline">
                                    <h3 className={cn("text-lg font-heading font-medium italic", n.urgent && "text-red-700")}>{n.title}</h3>
                                    <span className="font-mono text-[9px] opacity-40 uppercase">{n.time ?? n.createdAt?.slice(0, 10)}</span>
                                </div>
                                <p className="text-sm font-light text-[#1A1A1A]/60 leading-relaxed max-w-xl">{n.message}</p>
                            </div>
                            {!n.isRead && (
                                <button
                                    onClick={() => markOneRead(n._id ?? n.id)}
                                    className="p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#1A1A1A]"
                                    title="Mark as read"
                                >
                                    <Check size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};