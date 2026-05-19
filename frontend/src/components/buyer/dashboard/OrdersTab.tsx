import { useMemo, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { cn, formatPrice } from '@/utils/helpers';
import { useMyOrders } from '@store/hooks/useOrder';

export const OrdersTab = () => {
    const { data: res, isLoading, isError } = useMyOrders();
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [orders, order] = useMemo(() => {
        const orders = res?.data?.orders;
        const order = orders?.find((o: any) => o._id?.toString() === selectedOrderId);
        return [orders, order];
    }, [res, selectedOrderId]);
    console.log(orders, order)
    if (isLoading) return <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Loading orders...</p>;
    if (isError) return <p className="text-[10px] font-bold uppercase tracking-widest text-red-600">Failed to load orders.</p>;

    if (selectedOrderId && order) return (
        <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-baseline justify-between border-b border-[#1A1A1A]/10 pb-4">
                <h2 className="text-[12px] font-bold uppercase tracking-[0.5em] opacity-60">Order History</h2>
            </div>
            <button onClick={() => setSelectedOrderId(null)} className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-all">
                ← Back to Orders
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-12">
                    <div className="bg-[#FDFCF8] border border-[#1A1A1A]/10 p-10">
                        <div className="flex justify-between items-start mb-12 border-b border-[#1A1A1A]/5 pb-6">
                            <div>
                                <p className="text-[10px] font-mono opacity-40 uppercase mb-1">Order ID: {order._id ?? order.id}</p>
                                <h3 className="text-2xl font-heading font-black italic tracking-tighter uppercase">Order Details</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Status</p>
                                <p className="text-sm font-bold uppercase tracking-widest">{order.status}</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center py-4 border-b border-[#1A1A1A]/5 last:border-0">
                                    <div>
                                        <p className="text-sm font-bold tracking-tight">{item.name ?? item.product?.name}</p>
                                        <p className="text-[10px] font-mono opacity-40 uppercase">Qty: {item.qty ?? item.quantity}</p>
                                    </div>
                                    <p className="font-mono font-bold">{formatPrice(item.price)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 pt-12 border-t border-[#1A1A1A]/10 flex justify-between items-baseline">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Total Amount</span>
                            <span className="text-4xl font-heading font-black tracking-tighter">{formatPrice(order.total ?? order.totalPrice)}</span>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-4 bg-[#1A1A1A] text-[#FDFCF8] p-12 space-y-12">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Shipping Status</h3>
                    {order.statusHistory?.length ? (
                        <div className="space-y-10 relative">
                            <div className="absolute left-2.5 top-2 bottom-2 w-px bg-[#FDFCF8]/10" />
                            {order.statusHistory.map((step: any, idx: number) => (
                                <div key={idx} className="relative pl-10">
                                    <div className="absolute left-0 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-[#FDFCF8] border-[#FDFCF8]">
                                        {step.completed && <CheckCircle size={10} className="text-[#1A1A1A]" />}
                                    </div>
                                    <p className="text-[11px] font-bold uppercase tracking-widest mb-1">{step.status}</p>
                                    <p className="text-[10px] font-mono opacity-40 uppercase">{new Date(step.changedAt).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[10px] font-mono opacity-40 uppercase">No tracking info available.</p>
                    )}
                </div>
            </div>
        </section>
    );

    return (
        <section className="space-y-12">
            <div className="flex items-baseline justify-between border-b border-[#1A1A1A]/10 pb-4">
                <h2 className="text-[12px] font-bold uppercase tracking-[0.5em] opacity-60">Order History</h2>
            </div>
            {orders.length === 0 ? (
                <p className="text-sm font-light opacity-40">No orders yet.</p>
            ) : (
                <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
                    <div className="bg-[#1A1A1A] p-6 text-[9px] font-bold uppercase tracking-[0.3em] text-[#FDFCF8]/40 flex justify-between">
                        <div className="w-32">Order Number</div>
                        <div className="flex-1 px-8 text-center sm:text-left">Items</div>
                        <div className="w-32 text-center hidden sm:block">Status</div>
                        <div className="w-32 text-right">Total</div>
                    </div>
                    {orders?.map((record: any) => (
                        <button key={record._id ?? record.id} onClick={() => setSelectedOrderId(record._id?.toString())} className="w-full bg-[#FDFCF8] p-8 flex justify-between items-center group hover:bg-[#EAE8E2] transition-colors text-left">
                            <div className="w-32">
                                <p className="font-mono text-[10px] font-bold opacity-40 uppercase">{record._id ?? record.id}</p>
                                <p className="text-[10px] opacity-40 uppercase mt-1">{record.date ?? record.createdAt?.slice(0, 10)}</p>
                            </div>
                            <div className="flex-1 px-8">
                                <p className="text-sm font-bold tracking-tight">{record.items?.length ?? 0} Product(s)</p>
                            </div>
                            <div className="w-32 text-center hidden sm:block">
                                <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-1 border", record.status === 'DELIVERED' ? "border-green-600/30 text-green-700 bg-green-50" : "border-amber-600/30 text-amber-700 bg-amber-50")}>
                                    {record.status}
                                </span>
                            </div>
                            <div className="w-32 text-right">
                                <span className="text-lg font-bold tracking-tighter">{formatPrice(record.total ?? record.totalPrice)}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
};