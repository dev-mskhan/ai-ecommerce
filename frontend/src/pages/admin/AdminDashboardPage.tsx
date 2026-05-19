import React from 'react';
import { Users, Store, ShoppingCart, DollarSign, ArrowUpRight } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useGetDashboardStatsQuery, useGetUserStatsQuery, useGetAllVendorsQuery } from '@store/api/adminApi';
import { useGetAdminOrdersQuery } from '@store/api/orderApi';
import { formatPrice, cn } from '@/utils/helpers';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const StatCard = ({ title, value, icon: Icon, sub }: any) => (
    <div className="bg-[#FDFCF8] p-8 border border-[#1A1A1A]/5 flex flex-col justify-between h-44 group hover:bg-[#EAE8E2] transition-all">
        <div className="flex justify-between items-start">
            <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                <Icon size={16} strokeWidth={1} />
            </div>
        </div>
        <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-70 mb-3">{title}</p>
            <p className="text-3xl font-heading font-black tracking-tighter">{value}</p>
            {sub && <p className="text-[9px] font-mono opacity-30 mt-1 uppercase">{sub}</p>}
        </div>
    </div>
);

export const AdminDashboardPage: React.FC = () => {
    const { data: dashData, isLoading: dashLoading } = useGetDashboardStatsQuery();
    console.log("dashData", dashData);
    const { data: userStats, isLoading: userLoading } = useGetUserStatsQuery();
    console.log("userStats", userStats);
    const { data: vendorsData } = useGetAllVendorsQuery();
    console.log("vendorsData", vendorsData);
    const { data: ordersData } = useGetAdminOrdersQuery({ limit: 5 });
    console.log("ordersData", ordersData);

    const revenueChartData = React.useMemo(() => {
        if (!dashData?.data?.revenueAnalytics) return [];
        return dashData.data.revenueAnalytics.map((item: any) => ({
            name: MONTHS[(item._id.month - 1)],
            revenue: Math.round(item.totalRevenue),
        }));
    }, [dashData]);

    const totalRevenue = dashData?.data?.totalRevenue ?? 0;
    const totalUsers = userStats?.data?.totalUsers ?? 0;
    const totalVendors = userStats?.data?.totalVendors ?? 0;
    const totalOrders = ordersData?.data?.total ?? 0;
    const topVendors = userStats?.data?.topVendors ?? [];
    const recentOrders = ordersData?.data?.orders ?? [];

    const pendingVendors = (vendorsData?.data?.vendors ?? []).filter((v: any) => !v.isApproved && !v.isBanned);

    return (
        <div className="space-y-16">
            <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-10 gap-8">
                <div>
                    <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-6">Admin Dashboard</div>
                    <h1 className="text-4xl lg:text-6xl font-heading font-black italic tracking-tighter uppercase leading-none">
                        Overview <br /> <span className="not-italic font-sans text-xs tracking-[0.5em] font-bold opacity-70">Platform Summary</span>
                    </h1>
                </div>
                <div className="p-4 border border-[#1A1A1A]/10 bg-[#FDFCF8]">
                    <p className="text-[9px] font-mono opacity-70 uppercase mb-1">Last Sync</p>
                    <p className="text-[10px] font-bold">{new Date().toLocaleTimeString()} // PKT</p>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
                <StatCard title="Total Revenue" value={dashLoading ? '...' : `Rs. ${(totalRevenue / 1000).toFixed(0)}K`} icon={DollarSign} sub="5% platform commission" />
                <StatCard title="Total Users" value={userLoading ? '...' : totalUsers.toLocaleString()} icon={Users} />
                <StatCard title="Total Vendors" value={userLoading ? '...' : totalVendors.toLocaleString()} icon={Store} sub={`${pendingVendors.length} pending approval`} />
                <StatCard title="Total Orders" value={totalOrders.toLocaleString()} icon={ShoppingCart} />
            </div>

            {/* Revenue Chart + Pending Approvals */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
                <div className="lg:col-span-8 bg-[#FDFCF8] p-10 h-[420px] flex flex-col">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-70 mb-10 border-b border-[#1A1A1A]/5 pb-4">Revenue History</h3>
                    {dashLoading ? (
                        <div className="flex-1 flex items-center justify-center text-[10px] font-mono opacity-30">Loading chart...</div>
                    ) : (
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueChartData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1A1A1A" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#1A1A1A" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A1A1A" strokeOpacity={0.05} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.4 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.4 }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', color: '#FDFCF8', fontSize: '10px', borderRadius: '0' }} />
                                    <Area type="monotone" dataKey="revenue" stroke="#1A1A1A" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 bg-[#1A1A1A] text-[#FDFCF8] p-10 flex flex-col">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-70 mb-10 border-b border-white/5 pb-4">Pending Approvals</h3>
                    <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar">
                        {pendingVendors.length === 0 ? (
                            <p className="text-[10px] font-mono opacity-30">No pending approvals</p>
                        ) : (
                            pendingVendors.slice(0, 5).map((v: any) => (
                                <div key={v._id} className="flex justify-between items-center group">
                                    <div>
                                        <h4 className="text-sm font-heading font-medium italic mb-1 uppercase opacity-60 group-hover:opacity-100 transition-opacity">{v.storeName || v.name}</h4>
                                        <p className="text-[9px] font-mono opacity-20">VENDOR // {new Date(v.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <ArrowUpRight size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))
                        )}
                    </div>
                    <div className="pt-8 border-t border-white/5">
                        <Link to="/admin/vendors">
                            <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white hover:text-black text-[10px]">View All Vendors</Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Top Vendors + Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-6 bg-[#FDFCF8] border border-[#1A1A1A]/10 p-10 h-[400px] flex flex-col">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-70 mb-10 border-b border-[#1A1A1A]/5 pb-4">Top Vendors by Sales</h3>
                    <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar">
                        {topVendors.length === 0 ? (
                            <p className="text-[10px] font-mono opacity-30">No data yet</p>
                        ) : (
                            topVendors.map((vendor: any, idx: number) => (
                                <div key={vendor._id} className="flex items-center gap-6 group">
                                    <div className="font-mono text-[10px] opacity-20">#{String(idx + 1).padStart(2, '0')}</div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <p className="text-sm font-heading font-medium italic">{vendor.storeName}</p>
                                            <span className="text-[10px] font-bold">Rs. {(vendor.totalSales / 1000).toFixed(0)}K</span>
                                        </div>
                                        <div className="h-[2px] bg-[#1A1A1A]/5 w-full relative">
                                            <div
                                                className="absolute top-0 left-0 h-full bg-[#1A1A1A] transition-all duration-1000"
                                                style={{ width: `${(vendor.totalSales / (topVendors[0]?.totalSales || 1)) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="lg:col-span-6 bg-[#FDFCF8] border border-[#1A1A1A]/10 p-10 h-[400px] flex flex-col">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-70 mb-10 border-b border-[#1A1A1A]/5 pb-4">Recent Orders</h3>
                    <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10 overflow-hidden flex-1 overflow-y-auto no-scrollbar">
                        {recentOrders.length === 0 ? (
                            <div className="bg-[#FDFCF8] p-6 text-[10px] font-mono opacity-30">No orders yet</div>
                        ) : (
                            recentOrders.map((order: any) => (
                                <div key={order._id} className="bg-[#FDFCF8] p-5 flex justify-between items-center group hover:bg-[#EAE8E2] transition-colors">
                                    <div>
                                        <p className="text-[9px] font-mono opacity-20 mb-1">#{order._id?.slice(-6).toUpperCase()} // {order.buyer?.name || '—'}</p>
                                        <span className="text-sm font-heading italic">{formatPrice(order.total)}</span>
                                    </div>
                                    <span className={cn(
                                        "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 border",
                                        order.status === 'delivered' ? "border-green-600/30 text-green-700" :
                                            order.status === 'cancelled' ? "border-red-600/30 text-red-600" :
                                                "border-[#1A1A1A]/10 text-[#1A1A1A]/40"
                                    )}>{order.status}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};