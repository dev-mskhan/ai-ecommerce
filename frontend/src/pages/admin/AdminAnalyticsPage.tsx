import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie, LineChart, Line, Legend
} from 'recharts';
import { useGetDashboardStatsQuery, useGetUserStatsQuery } from '@store/api/adminApi';
import { cn } from '@/utils/helpers';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const AdminAnalyticsPage: React.FC = () => {
    const [period, setPeriod] = React.useState('Monthly');
    const { data: dashData, isLoading: dashLoading } = useGetDashboardStatsQuery();
    const { data: userStats, isLoading: userLoading } = useGetUserStatsQuery();

    const revenueChartData = React.useMemo(() => {
        if (!dashData?.data?.revenueAnalytics) return [];
        return dashData.data.revenueAnalytics.map((item: any) => ({
            name: MONTHS[item._id.month - 1],
            revenue: Math.round(item.totalRevenue),
        }));
    }, [dashData]);

    const orderChartData = React.useMemo(() => {
        if (!dashData?.data?.orderAnalytics) return [];
        return dashData.data.orderAnalytics.map((item: any) => ({
            name: MONTHS[item._id.month - 1],
            orders: item.totalOrders,
        }));
    }, [dashData]);

    const userGrowthData = React.useMemo(() => {
        if (!userStats?.data?.userGrowth) return [];
        return userStats.data.userGrowth.map((item: any) => ({
            name: MONTHS[item._id.month - 1],
            users: item.newUsers,
        }));
    }, [userStats]);

    const topVendors = userStats?.data?.topVendors ?? [];

    const combinedData = React.useMemo(() => {
        const map: Record<string, any> = {};
        revenueChartData.forEach((d: any) => { map[d.name] = { ...map[d.name], name: d.name, revenue: d.revenue }; });
        orderChartData.forEach((d: any) => { map[d.name] = { ...map[d.name], name: d.name, orders: d.orders }; });
        userGrowthData.forEach((d: any) => { map[d.name] = { ...map[d.name], name: d.name, users: d.users }; });
        return Object.values(map);
    }, [revenueChartData, orderChartData, userGrowthData]);

    const isLoading = dashLoading || userLoading;

    return (
        <div className="space-y-14 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-10 gap-8">
                <div>
                    <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-6">Platform Analytics</div>
                    <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
                        Analytics <br /> <span className="not-italic font-sans text-xs tracking-[0.5em] font-bold opacity-40">Sales & Growth</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-[#1A1A1A]/5 p-1">
                        {['Daily', 'Weekly', 'Monthly'].map(p => (
                            <button key={p} onClick={() => setPeriod(p)} className={cn(
                                "px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                                p === period ? "bg-[#1A1A1A] text-[#FDFCF8]" : "opacity-40 hover:opacity-100"
                            )}>
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {isLoading ? (
                <div className="text-[10px] font-mono opacity-30 py-20 text-center">Loading analytics...</div>
            ) : (
                <>
                    {/* Row 1: Revenue + User Growth */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="bg-[#FDFCF8] p-10 border border-[#1A1A1A]/10">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40 mb-10 border-b border-[#1A1A1A]/5 pb-4">Monthly Revenue</h3>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={combinedData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A1A1A" strokeOpacity={0.05} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.4 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.4 }} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', color: '#FDFCF8', fontSize: '10px' }} />
                                        <Line type="monotone" dataKey="revenue" stroke="#1A1A1A" strokeWidth={3} dot={{ r: 4, fill: '#1A1A1A' }} activeDot={{ r: 6 }} name="Revenue (Rs.)" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-[#FDFCF8] p-10 border border-[#1A1A1A]/10">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40 mb-10 border-b border-[#1A1A1A]/5 pb-4">New Users Over Time</h3>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={combinedData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A1A1A" strokeOpacity={0.05} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.4 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.4 }} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', color: '#FDFCF8', fontSize: '10px' }} />
                                        <Area type="monotone" dataKey="users" stroke="#1A1A1A" fill="#1A1A1A" fillOpacity={0.05} strokeWidth={2} name="New Users" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Orders + Top Vendors */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="bg-[#FDFCF8] p-10 border border-[#1A1A1A]/10">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40 mb-10 border-b border-[#1A1A1A]/5 pb-4">Orders Per Month</h3>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={combinedData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A1A1A" strokeOpacity={0.05} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.4 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.4 }} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', color: '#FDFCF8', fontSize: '10px' }} />
                                        <Bar dataKey="orders" fill="#1A1A1A" radius={[2, 2, 0, 0]} barSize={20} name="Orders" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-[#FDFCF8] p-10 border border-[#1A1A1A]/10">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40 mb-10 border-b border-[#1A1A1A]/5 pb-4">Top Vendors by Sales</h3>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={topVendors.map((v: any) => ({ name: v.storeName, sales: v.totalSales }))}
                                        layout="vertical"
                                        margin={{ left: 60 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1A1A1A" strokeOpacity={0.05} />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace', fontStyle: 'italic', fontWeight: 'bold' }} />
                                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', color: '#FDFCF8', fontSize: '10px' }} />
                                        <Bar dataKey="sales" fill="#1A1A1A" radius={[0, 4, 4, 0]} barSize={24} name="Sales (Rs.)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};