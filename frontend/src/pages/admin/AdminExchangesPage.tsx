import React from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { cn, formatPrice } from '@/utils/helpers';
import { useGetAdminOrdersQuery, useAdminUpdateOrderStatusMutation } from '@store/api/orderApi';

const STATUS_FILTERS = ['ALL', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export const AdminExchangesPage: React.FC = () => {
    const [activeFilter, setActiveFilter] = React.useState('ALL');
    const [search, setSearch] = React.useState('');
    const [page, setPage] = React.useState(1);

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
        ? orders.filter((o: any) => o._id?.toLowerCase().includes(search.toLowerCase()) || o.buyer?.name?.toLowerCase().includes(search.toLowerCase()))
        : orders;

    const handleStatusChange = async (id: string, status: string) => {
        try { await updateStatus({ id, status }).unwrap(); } catch { }
    };

    return (
        <div className="space-y-12">
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
                            className="bg-[#1A1A1A]/5 p-4 pl-11 text-[10px] uppercase font-bold tracking-widest outline-none w-64"
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
                        {/* Header row */}
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
                                            "text-[9px] font-bold uppercase tracking-widest px-2 py-1 border bg-transparent cursor-pointer outline-none",
                                            order.status === 'delivered' ? "border-green-600/30 text-green-700" :
                                                order.status === 'cancelled' ? "border-red-600/30 text-red-700" :
                                                    "border-amber-600/30 text-amber-700"
                                        )}
                                    >
                                        {['confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].map(s => (
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
                                    <div className="w-9 h-9 border border-[#1A1A1A]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight size={13} />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filtered.length === 0 && (
                            <div className="bg-[#FDFCF8] p-12 text-center text-[10px] font-mono opacity-30">No orders found.</div>
                        )}
                    </div>

                    {/* Pagination */}
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