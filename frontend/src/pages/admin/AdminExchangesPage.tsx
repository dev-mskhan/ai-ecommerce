import React from 'react';
import { Search, ArrowRight, X, Package, MapPin, CreditCard, Clock } from 'lucide-react';
import { cn, formatPrice } from '@/utils/helpers';
import { riftToast } from '@/components/common/toastContainer';
import { useGetAdminOrdersQuery, useAdminUpdateOrderStatusMutation, useGetOrderByIdQuery } from '@store/api/orderApi';

const STATUS_FILTERS = ['ALL', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

const STATUS_STYLES: Record<string, string> = {
    delivered: "border-green-600/30 text-green-700 bg-green-50",
    cancelled: "border-red-600/30 text-red-700 bg-red-50",
    refunded: "border-purple-600/30 text-purple-700 bg-purple-50",
    shipped: "border-blue-600/30 text-blue-700 bg-blue-50",
    processing: "border-amber-600/30 text-amber-700 bg-amber-50",
    pending: "border-[#1A1A1A]/20 text-[#1A1A1A]/60",
    confirmed: "border-teal-600/30 text-teal-700 bg-teal-50"
};

// ── Order Detail Panel ──────────────────────────────────────────────
const OrderDetailPanel: React.FC<{ orderId: string; onClose: () => void }> = ({ orderId, onClose }) => {
    const { data, isLoading } = useGetOrderByIdQuery(orderId);
    const order = data?.data;

    return (
        <div className="fixed inset-0 h-screen z-50 flex justify-end bg-[#1A1A1A]/40 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-[#FDFCF8] w-full max-w-xl h-full overflow-y-auto border-l border-[#1A1A1A]/10 flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-10 border-b border-[#1A1A1A]/10 flex items-start justify-between shrink-0">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-2">Order Details</p>
                        <h2 className="text-2xl font-heading font-black italic tracking-tighter uppercase">
                            #{orderId.slice(-6).toUpperCase()}
                        </h2>
                    </div>
                    <button onClick={onClose} className="opacity-30 hover:opacity-100 transition-opacity mt-1">
                        <X size={20} strokeWidth={1.5} />
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center text-[10px] font-mono opacity-30">Loading order...</div>
                ) : !order ? (
                    <div className="flex-1 flex items-center justify-center text-[10px] font-mono opacity-30">Order not found.</div>
                ) : (
                    <div className="flex-1 p-10 space-y-10">

                        {/* Status + Payment */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="border border-[#1A1A1A]/10 p-5 space-y-2">
                                <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-30">Order Status</p>
                                <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-1 border inline-block", STATUS_STYLES[order.status])}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="border border-[#1A1A1A]/10 p-5 space-y-2">
                                <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-30">Payment</p>
                                <span className={cn(
                                    "text-[9px] font-bold uppercase tracking-widest px-2 py-1 border inline-block",
                                    order.paymentStatus === 'paid' ? "border-green-600/30 text-green-700 bg-green-50" : "border-[#1A1A1A]/20 text-[#1A1A1A]/60"
                                )}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>

                        {/* Customer */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] opacity-30">
                                <CreditCard size={11} /> Customer
                            </div>
                            <div className="border border-[#1A1A1A]/10 p-6 space-y-1">
                                <p className="font-heading font-medium italic text-base">{order.buyer?.name ?? '—'}</p>
                                <p className="text-[10px] font-mono opacity-40">{order.buyer?.email}</p>
                                <p className="text-[10px] font-mono opacity-40">{order.phone}</p>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] opacity-30">
                                <MapPin size={11} /> Shipping Address
                            </div>
                            <div className="border border-[#1A1A1A]/10 p-6 text-[11px] font-mono opacity-60 leading-relaxed">
                                <p>{order.shippingAddress?.fullName}</p>
                                <p>{order.shippingAddress?.addressLine1}</p>
                                {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
                                <p>{order.shippingAddress?.country}</p>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] opacity-30">
                                <Package size={11} /> Items ({order.items?.length})
                            </div>
                            <div className="space-y-px border border-[#1A1A1A]/10">
                                {order.items?.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center gap-5 p-5 bg-[#FDFCF8] hover:bg-[#EAE8E2] transition-colors">
                                        <div className="w-12 h-12 border border-[#1A1A1A]/10 overflow-hidden shrink-0 grayscale">
                                            {item.image && <img src={item.image} className="w-full h-full object-cover" alt="" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-bold truncate">{item.name}</p>
                                            {item.selectedVariants && (
                                                <p className="text-[9px] font-mono opacity-30 mt-0.5">
                                                    {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-[10px] font-bold">{formatPrice(item.price * item.quantity)}</p>
                                            <p className="text-[9px] font-mono opacity-30">x{item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="border border-[#1A1A1A]/10 p-6 space-y-3">
                            {[
                                { label: 'Subtotal', value: order.subtotal },
                                { label: 'Discount', value: -order.discount },
                                { label: 'Shipping', value: order.shippingCost },
                                { label: 'Tax', value: order.tax },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-50">
                                    <span>{label}</span>
                                    <span>{formatPrice(value)}</span>
                                </div>
                            ))}
                            <div className="border-t border-[#1A1A1A]/10 pt-3 flex justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-widest">Total</span>
                                <span className="text-base font-black tracking-tight">{formatPrice(order.total)}</span>
                            </div>
                            {order.couponCode && (
                                <p className="text-[9px] font-mono opacity-30">Coupon: {order.couponCode}</p>
                            )}
                        </div>

                        {/* Status History */}
                        {order.statusHistory?.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] opacity-30">
                                    <Clock size={11} /> Status History
                                </div>
                                <div className="space-y-px border border-[#1A1A1A]/10">
                                    {order.statusHistory.map((h: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-[#FDFCF8] text-[10px]">
                                            <span className={cn("font-bold uppercase tracking-widest px-2 py-0.5 border text-[9px]", STATUS_STYLES[h.status])}>
                                                {h.status}
                                            </span>
                                            <span className="font-mono opacity-30">
                                                {new Date(h.changedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// ── Main Page ───────────────────────────────────────────────────────
export const AdminExchangesPage: React.FC = () => {
    const [activeFilter, setActiveFilter] = React.useState('ALL');
    const [search, setSearch] = React.useState('');
    const [page, setPage] = React.useState(1);
    const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);

    const { data, isLoading, isFetching } = useGetAdminOrdersQuery({
        page,
        limit: 20,
        status: activeFilter !== 'ALL' ? activeFilter : undefined,
    });

    const [updateStatus] = useAdminUpdateOrderStatusMutation();

    const orders: any[] = data?.data?.orders ?? [];
    const total: number = data?.data?.total ?? 0;
    const totalPages: number = data?.data?.totalPages ?? 1;

    const filtered = search.trim()
        ? orders.filter((o: any) =>
            o._id?.toLowerCase().includes(search.toLowerCase()) ||
            o.buyer?.name?.toLowerCase().includes(search.toLowerCase())
        )
        : orders;

    const handleStatusChange = async (id: string, status: string) => {
        await riftToast.promise(
            updateStatus({ id, status }).unwrap(),
            {
                loading: 'Updating status...',
                success: 'Order status updated!',
                error: 'Failed to update status',
            }
        );
    };

    return (
        <div className="space-y-12">
            {selectedOrderId && (
                <OrderDetailPanel orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />
            )}

            <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-10 gap-8">
                <div>
                    <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-6">Order Management</div>
                    <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
                        Orders <br /> <span className="not-italic font-sans text-xs tracking-[0.5em] font-bold opacity-40">All Transactions</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search order or customer..."
                            className="bg-[#1A1A1A]/5 p-4 pl-11 text-[10px] font-bold tracking-widest outline-none w-64"
                        />
                    </div>
                </div>
            </header>

            {/* Filter Tabs */}
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-4 border-b border-[#1A1A1A]/5">
                {STATUS_FILTERS.map(f => (
                    <button
                        key={f}
                        onClick={() => { setActiveFilter(f); setPage(1); }}
                        className={cn(
                            "text-[9px] font-bold uppercase tracking-widest whitespace-nowrap transition-all px-4 py-2 border",
                            activeFilter === f
                                ? "bg-[#1A1A1A] text-[#FDFCF8] border-[#1A1A1A]"
                                : "opacity-40 border-transparent hover:border-[#1A1A1A]/10 hover:opacity-100"
                        )}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {isLoading || isFetching ? (
                <div className="text-[10px] font-mono opacity-30 py-10">Loading orders...</div>
            ) : (
                <>
                    <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10 overflow-hidden">
                        <div className="bg-[#FDFCF8] p-6 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.3em] opacity-40 border-b border-[#1A1A1A]/5">
                            <div className="w-28">Order ID</div>
                            <div className="flex-1 px-8">Customer</div>
                            <div className="w-24 hidden md:block text-center">Items</div>
                            <div className="w-44 hidden md:block text-center">Status</div>
                            <div className="w-32 hidden lg:block text-right">Date</div>
                            <div className="w-32 text-right">Total</div>
                            <div className="w-12"></div>
                        </div>

                        {filtered.map((order: any) => (
                            <div key={order._id} className="bg-[#FDFCF8] p-6 flex items-center justify-between group hover:bg-[#EAE8E2] transition-colors">
                                <div className="w-28 font-mono text-[10px] opacity-40 uppercase font-bold truncate">
                                    #{order._id?.slice(-6).toUpperCase()}
                                </div>

                                <div className="flex-1 px-8 space-y-1">
                                    <h3 className="text-base font-heading font-medium italic leading-none">{order.buyer?.name ?? '—'}</h3>
                                    <p className="text-[9px] font-mono opacity-20 uppercase">{order.buyer?.email ?? ''}</p>
                                </div>

                                <div className="w-24 hidden md:block text-center">
                                    <span className="text-[10px] font-bold opacity-40">{order.items?.length ?? 0} items</span>
                                </div>

                                <div className="w-44 hidden md:block text-center">
                                    <select
                                        value={order.status}
                                        onChange={e => handleStatusChange(order._id, e.target.value)}
                                        onClick={e => e.stopPropagation()}
                                        className={cn(
                                            "text-[9px] font-bold tracking-widest px-2 py-1 border bg-transparent cursor-pointer outline-none",
                                            STATUS_STYLES[order.status]
                                        )}
                                    >
                                        {['delivered', 'cancelled', 'refunded', 'pending', 'processing', 'shipped'].map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="w-32 hidden lg:block text-right">
                                    <span className="text-[10px] font-bold opacity-40 tracking-tighter">
                                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>

                                <div className="w-32 text-right">
                                    <span className="text-base font-bold tracking-tight">{formatPrice(order.total)}</span>
                                </div>

                                <div className="w-12 flex justify-end">
                                    <button
                                        onClick={() => setSelectedOrderId(order._id)}
                                        className="w-9 h-9 border border-[#1A1A1A]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#1A1A1A] hover:text-[#FDFCF8]"
                                    >
                                        <ArrowRight size={13} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filtered.length === 0 && (
                            <div className="bg-[#FDFCF8] p-12 text-center text-[10px] font-mono opacity-30">No orders found.</div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4">
                            <span className="text-[10px] font-mono opacity-40">{total} total orders</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 text-[9px] font-bold uppercase tracking-widest border border-[#1A1A1A]/10 disabled:opacity-20 hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all"
                                >
                                    Prev
                                </button>
                                <span className="px-4 py-2 text-[9px] font-mono opacity-40">Page {page} / {totalPages}</span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 text-[9px] font-bold uppercase tracking-widest border border-[#1A1A1A]/10 disabled:opacity-20 hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};