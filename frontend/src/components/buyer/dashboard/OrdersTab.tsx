import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { cn, formatPrice } from '@/utils/helpers';

const orders = [
    {
        id: 'ORD-2024-001', date: 'May 10, 2024', status: 'SHIPPED', total: 4500,
        items: [{ name: 'Structural Table Lamp', price: 4500, qty: 1 }],
        timeline: [
            { label: 'Order Placed', date: 'May 10, 10:30', completed: true },
            { label: 'Order Processed', date: 'May 10, 14:15', completed: true },
            { label: 'Shipped', date: 'May 11, 09:00', completed: true },
            { label: 'Delivered', date: 'Pending', completed: false },
        ],
    },
    {
        id: 'ORD-2024-002', date: 'May 05, 2024', status: 'DELIVERED', total: 12200,
        items: [{ name: 'Brutalist Concrete Planter', price: 6100, qty: 2 }],
        timeline: [
            { label: 'Order Placed', date: 'May 05, 08:30', completed: true },
            { label: 'Order Processed', date: 'May 05, 11:15', completed: true },
            { label: 'Shipped', date: 'May 06, 09:00', completed: true },
            { label: 'Delivered', date: 'May 07, 16:45', completed: true },
        ],
    },
];

export const OrdersTab = () => {
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
    const order = orders.find(o => o.id === selectedOrder);

    if (selectedOrder && order) return (
        <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-baseline justify-between border-b border-[#1A1A1A]/10 pb-4">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Order History</h2>
            </div>
            <button onClick={() => setSelectedOrder(null)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-all">
                ← Back to Orders
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-12">
                    <div className="bg-[#FDFCF8] border border-[#1A1A1A]/10 p-10">
                        <div className="flex justify-between items-start mb-12 border-b border-[#1A1A1A]/5 pb-6">
                            <div>
                                <p className="text-[10px] font-mono opacity-40 uppercase mb-1">Order ID: {selectedOrder}</p>
                                <h3 className="text-2xl font-heading font-black italic tracking-tighter uppercase">Order Details</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Status</p>
                                <p className="text-sm font-bold uppercase tracking-widest">{order.status}</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center py-4 border-b border-[#1A1A1A]/5 last:border-0">
                                    <div>
                                        <p className="text-sm font-bold tracking-tight">{item.name}</p>
                                        <p className="text-[10px] font-mono opacity-40 uppercase">Qty: {item.qty}</p>
                                    </div>
                                    <p className="font-mono font-bold">{formatPrice(item.price)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 pt-12 border-t border-[#1A1A1A]/10 flex justify-between items-baseline">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Total Amount</span>
                            <span className="text-4xl font-heading font-black tracking-tighter">{formatPrice(order.total)}</span>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-4 bg-[#1A1A1A] text-[#FDFCF8] p-12 space-y-12">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Shipping Status</h3>
                    <div className="space-y-10 relative">
                        <div className="absolute left-2.5 top-2 bottom-2 w-px bg-[#FDFCF8]/10" />
                        {order.timeline.map((step, idx) => (
                            <div key={idx} className="relative pl-10">
                                <div className={cn("absolute left-0 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center", step.completed ? "bg-[#FDFCF8] border-[#FDFCF8]" : "bg-transparent border-[#FDFCF8]/20")}>
                                    {step.completed && <CheckCircle size={10} className="text-[#1A1A1A]" />}
                                </div>
                                <p className={cn("text-[11px] font-bold uppercase tracking-widest mb-1", !step.completed && "opacity-40")}>{step.label}</p>
                                <p className="text-[10px] font-mono opacity-40 uppercase">{step.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );

    return (
        <section className="space-y-12">
            <div className="flex items-baseline justify-between border-b border-[#1A1A1A]/10 pb-4">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Order History</h2>
            </div>
            <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
                <div className="bg-[#1A1A1A] p-6 text-[9px] font-bold uppercase tracking-[0.3em] text-[#FDFCF8]/40 flex justify-between">
                    <div className="w-32">Order Number</div>
                    <div className="flex-1 px-8 text-center sm:text-left">Items</div>
                    <div className="w-32 text-center hidden sm:block">Status</div>
                    <div className="w-32 text-right">Total</div>
                </div>
                {orders.map((record) => (
                    <button key={record.id} onClick={() => setSelectedOrder(record.id)} className="w-full bg-[#FDFCF8] p-8 flex justify-between items-center group hover:bg-[#EAE8E2] transition-colors text-left">
                        <div className="w-32">
                            <p className="font-mono text-[10px] font-bold opacity-40 uppercase">{record.id}</p>
                            <p className="text-[10px] opacity-40 uppercase mt-1">{record.date}</p>
                        </div>
                        <div className="flex-1 px-8">
                            <p className="text-sm font-bold tracking-tight">{record.items.length} Product(s)</p>
                        </div>
                        <div className="w-32 text-center hidden sm:block">
                            <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-1 border", record.status === 'DELIVERED' ? "border-green-600/30 text-green-700 bg-green-50" : "border-amber-600/30 text-amber-700 bg-amber-50")}>
                                {record.status}
                            </span>
                        </div>
                        <div className="w-32 text-right">
                            <span className="text-lg font-bold tracking-tighter">{formatPrice(record.total)}</span>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
};