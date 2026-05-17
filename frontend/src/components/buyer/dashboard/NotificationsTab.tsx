import { Bell, Shield, Trash2 } from 'lucide-react';
import { cn } from '@/utils/helpers';

const notifications = [
    { id: 1, title: 'Security Alert', message: 'New login from unknown device in Berlin.', time: '2h ago', urgent: true, read: false },
    { id: 2, title: 'Inventory Update', message: 'An item in your wishlist is almost sold out.', time: '5h ago', urgent: false, read: true },
    { id: 3, title: 'Shipment Milestone', message: 'Order ORD-2024-001 has cleared customs.', time: '1d ago', urgent: false, read: false },
];

export const NotificationsTab = () => (
    <section className="space-y-12">
        <div className="flex items-baseline justify-between border-b border-[#1A1A1A]/10 pb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Notifications</h2>
            <div className="flex gap-4">
                <button className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 hover:line-through transition-all">Mark All As Read</button>
                <button className="text-[10px] font-bold uppercase tracking-widest text-red-600 opacity-40 hover:opacity-100 hover:line-through transition-all">Clear All</button>
            </div>
        </div>
        <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10 overflow-hidden">
            {notifications.map((n) => (
                <div key={n.id} className={cn("bg-[#FDFCF8] p-8 flex gap-8 items-start group hover:bg-[#EAE8E2] transition-colors relative", !n.read && "after:content-[''] after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1 after:bg-[#1A1A1A]")}>
                    <div className="mt-1">
                        {n.urgent ? <Shield size={16} className="text-red-600" /> : <Bell size={16} className={cn(n.read ? "opacity-10" : "opacity-40")} />}
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-baseline">
                            <h3 className={cn("text-lg font-heading font-medium italic", n.urgent && "text-red-700")}>{n.title}</h3>
                            <span className="font-mono text-[9px] opacity-40 uppercase">{n.time}</span>
                        </div>
                        <p className="text-sm font-light text-[#1A1A1A]/60 leading-relaxed max-w-xl">{n.message}</p>
                    </div>
                    <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"><Trash2 size={14} /></button>
                </div>
            ))}
        </div>
    </section>
);