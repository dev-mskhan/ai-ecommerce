import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts';
import { Activity, TrendingUp, Users, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import {
  useGetVendorDashboardQuery,
  useGetRevenueAnalyticsQuery,
  useGetTopProductsQuery,
} from '@/store/api/vendorApi';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const VendorAnalyticsPage: React.FC = () => {
  const [timeframe, setTimeframe] = React.useState('monthly');

  const { data: dashData, isLoading: dashLoading } = useGetVendorDashboardQuery();
  const { data: revenueData, isLoading: revLoading } = useGetRevenueAnalyticsQuery();
  const { data: topData, isLoading: topLoading } = useGetTopProductsQuery();

  const stats = dashData?.data;

  // Build revenue chart data from API
  const revenueChart = (revenueData?.data ?? []).map((r: any) => ({
    name: MONTH_LABELS[(r._id?.month ?? 1) - 1],
    revenue: r.netRevenue ?? 0,
  }));

  // Top products for bar chart
  const topProducts = (topData?.data ?? []).map((p: any) => ({
    name: (p.productName ?? '').substring(0, 10),
    value: p.totalQuantitySold ?? 0,
  }));

  // Category breakdown from top products (group by category if available, fallback to product names)
  const categoryData = topData?.data?.slice(0, 4).map((p: any, i: number) => ({
    name: (p.productName ?? 'Product').substring(0, 8),
    value: p.grossRevenue ?? 100,
  })) ?? [];

  const kpis = [
    {
      label: 'Total Revenue',
      value: stats ? `RS. ${(stats.netRevenue / 1000).toFixed(1)}K` : '—',
      trend: '+12.5%',
      icon: DollarSign,
    },
    {
      label: 'Total Orders',
      value: stats ? `${stats.totalOrders}` : '—',
      trend: '+4%',
      icon: Users,
    },
    {
      label: 'Pending Orders',
      value: stats ? `${stats.pendingOrders}` : '—',
      trend: stats?.pendingOrders > 5 ? 'HIGH' : 'LOW',
      icon: Activity,
    },
    {
      label: 'Total Products',
      value: stats ? `${stats.totalProducts}` : '—',
      trend: 'STABLE',
      icon: TrendingUp,
    },
  ];

  const isLoading = dashLoading || revLoading || topLoading;

  return (
    <div className="space-y-20 pb-16">
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-10 gap-6">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-6">Performance Overview</div>
          <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
            Analytics <br />
            <span className="not-italic font-sans text-xs tracking-[0.5em] font-bold opacity-40">Data</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center w-56 bg-[#1A1A1A]/5 p-2">
            <CustomDropdown
              value={timeframe}
              onChange={setTimeframe}
              options={[
                { label: 'Daily', value: 'daily' },
                { label: 'Weekly', value: 'weekly' },
                { label: 'Monthly', value: 'monthly' },
              ]}
              className="w-full bg-transparent p-0"
              placeholder="Select Timeframe"
            />
          </div>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
        {kpis.map((stat) => (
          <div key={stat.label} className="bg-[#FDFCF8] p-8">
            <div className="flex justify-between items-start mb-5">
              <stat.icon size={16} strokeWidth={1} className="opacity-40" />
              {isLoading ? (
                <Loader2 size={10} className="animate-spin opacity-30" />
              ) : (
                <span className={cn(
                  'text-[9px] font-mono',
                  stat.trend.startsWith('+') ? 'text-green-600' : stat.trend.startsWith('-') ? 'text-red-600' : 'opacity-40',
                )}>
                  {stat.trend}
                </span>
              )}
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-40 mb-3">{stat.label}</p>
            <p className="text-3xl font-heading font-black tracking-tighter">
              {dashLoading ? <span className="opacity-20">—</span> : stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Revenue area chart */}
        <div className="lg:col-span-8 bg-[#FDFCF8] p-10 border border-[#1A1A1A]/10 h-[520px] flex flex-col">
          <div className="flex items-baseline justify-between mb-10 border-b border-[#1A1A1A]/5 pb-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Monthly Revenue</h3>
            {revLoading && <Loader2 size={12} className="animate-spin opacity-30" />}
          </div>
          <div className="flex-1">
            {revenueChart.length === 0 && !revLoading ? (
              <div className="flex items-center justify-center h-full text-[10px] font-bold uppercase tracking-widest opacity-20">
                No revenue data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChart}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A1A1A" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#1A1A1A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A1A1A" strokeOpacity={0.05} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.4 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.4 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', color: '#FDFCF8', fontSize: '10px' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#1A1A1A" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category donut */}
        <div className="lg:col-span-4 bg-[#1A1A1A] text-[#FDFCF8] p-10 flex flex-col h-[520px]">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40 mb-10">Top Products</h3>
          <div className="flex-1 flex flex-col justify-center">
            {topLoading ? (
              <div className="flex justify-center"><Loader2 className="animate-spin opacity-30" size={24} /></div>
            ) : categoryData.length === 0 ? (
              <div className="text-center text-[10px] font-bold uppercase tracking-widest opacity-20">No data yet</div>
            ) : (
              <>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value" stroke="none">
                        {categoryData.map((_: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index === 0 ? '#FDFCF8' : `rgba(253, 252, 248, ${0.4 - index * 0.08})`}
                          />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#FDFCF8', border: 'none', color: '#1A1A1A', fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 pt-6">
                  {categoryData.map((item: any, idx: number) => (
                    <div
                      key={item.name}
                      className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest border-b border-[#FDFCF8]/5 pb-2"
                    >
                      <span className="opacity-40 flex items-center gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: idx === 0 ? '#FDFCF8' : `rgba(253,252,248,${0.4 - idx * 0.08})` }}
                        />
                        {item.name}
                      </span>
                      <span>RS. {(item.value / 1000).toFixed(1)}K</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Top products bar chart */}
      <div className="bg-[#FDFCF8] p-10 border border-[#1A1A1A]/10">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40 mb-10 border-b border-[#1A1A1A]/5 pb-3">
          Units Sold — Top 5 Products
        </h3>
        {topLoading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin opacity-30" size={24} /></div>
        ) : topProducts.length === 0 ? (
          <div className="text-center p-12 text-[10px] font-bold uppercase tracking-widest opacity-20">No sales data yet</div>
        ) : (
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, opacity: 0.4 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, opacity: 0.4 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', color: '#FDFCF8', fontSize: '10px' }} />
                <Bar dataKey="value" fill="#1A1A1A" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};
