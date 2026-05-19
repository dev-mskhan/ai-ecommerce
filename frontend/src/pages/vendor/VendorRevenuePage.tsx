import React from 'react';
import { TrendingUp, DollarSign, Wallet, Download, Loader2, AlertCircle } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { formatPrice, cn } from '@/utils/helpers';
import { Button } from '@/components/ui/Button';
import { useGetRevenueAnalyticsQuery, useGetVendorDashboardQuery } from '@/store/api/vendorApi';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const VendorRevenuePage: React.FC = () => {
  const { data: revData, isLoading: revLoading, isError: revError } = useGetRevenueAnalyticsQuery();
  const { data: dashData, isLoading: dashLoading } = useGetVendorDashboardQuery();

  const dash = dashData?.data;
  const revenueTimeline = (revData?.data ?? []).map((r: any) => ({
    name: `${MONTH_LABELS[(r._id?.month ?? 1) - 1]} '${String(r._id?.year ?? '').slice(-2)}`,
    amount: r.netRevenue ?? 0,
    gross: r.grossRevenue ?? 0,
    orders: r.orderCount ?? 0,
  }));

  // Compute projected monthly from last data point or average
  const avgMonthly =
    revenueTimeline.length
      ? revenueTimeline.reduce((a: number, r: any) => a + r.amount, 0) / revenueTimeline.length
      : 0;

  const kpis = [
    {
      label: 'Gross Revenue',
      value: formatPrice(dash?.grossRevenue ?? 0),
      delta: '+18.2%',
      icon: DollarSign,
    },
    {
      label: 'Net Revenue (5% fee)',
      value: formatPrice(dash?.netRevenue ?? 0),
      delta: 'STABLE',
      icon: Wallet,
    },
    {
      label: 'Avg. Monthly',
      value: formatPrice(avgMonthly),
      delta: '+5.4%',
      icon: TrendingUp,
    },
  ];

  const handleExport = () => {
    if (!revenueTimeline.length) return;
    const headers = ['Month', 'Gross Revenue (RS.)', 'Net Revenue (RS.)', 'Orders'];
    const rows = revenueTimeline.map((r: any) => [r.name, r.gross.toFixed(2), r.amount.toFixed(2), r.orders]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'revenue-log.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-14">
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-10 gap-6">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-6">Revenue Overview</div>
          <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
            Revenue <br />
            <span className="not-italic font-sans text-xs tracking-[0.5em] font-bold opacity-40">Breakdown</span>
          </h1>
        </div>
        <Button variant="outline" onClick={handleExport} className="flex items-center gap-2" disabled={!revenueTimeline.length}>
          <Download size={13} /> Download Log
        </Button>
      </header>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
        {kpis.map((stat) => (
          <div key={stat.label} className="bg-[#FDFCF8] p-10">
            <stat.icon size={18} className="opacity-20 mb-7" />
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-40 mb-3">{stat.label}</p>
            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-heading font-black tracking-tighter">
                {dashLoading ? <span className="opacity-20">—</span> : stat.value}
              </p>
              <span className={cn(
                'text-[9px] font-mono opacity-40',
                stat.delta.startsWith('+') ? 'text-green-600' : stat.delta.startsWith('-') ? 'text-red-600' : '',
              )}>
                {stat.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-[#FDFCF8] border border-[#1A1A1A]/10 p-10 h-[460px] flex flex-col">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40 mb-10 border-b border-[#1A1A1A]/5 pb-3">
          Monthly Net Revenue
        </h3>
        <div className="flex-1">
          {revLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin opacity-30" size={24} />
            </div>
          ) : revError ? (
            <div className="flex items-center justify-center gap-2 text-red-600 h-full">
              <AlertCircle size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Failed to load revenue data</span>
            </div>
          ) : revenueTimeline.length === 0 ? (
            <div className="flex items-center justify-center h-full text-[10px] font-bold uppercase tracking-widest opacity-20">
              No revenue data yet — make your first sale!
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTimeline}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A1A1A" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#1A1A1A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A1A1A" strokeOpacity={0.05} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.4 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.4 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', color: '#FDFCF8', fontSize: '10px', borderRadius: '0' }} />
                <Area type="monotone" dataKey="amount" stroke="#1A1A1A" fillOpacity={1} fill="url(#colorAmt)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Monthly breakdown table */}
      <section className="space-y-6">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40 border-b border-[#1A1A1A]/10 pb-3">
          Monthly Breakdown
        </h3>

        {revLoading ? (
          <div className="flex justify-center p-10"><Loader2 className="animate-spin opacity-30" size={20} /></div>
        ) : revenueTimeline.length === 0 ? (
          <div className="text-center p-10 text-[10px] font-bold uppercase tracking-widest opacity-20">No data</div>
        ) : (
          <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
            <div className="bg-[#1A1A1A] p-5 lg:p-7 grid grid-cols-4 text-[9px] font-bold uppercase tracking-[0.3em] text-[#FDFCF8]/40">
              <div>Month</div>
              <div className="text-center">Orders</div>
              <div className="text-right">Gross (RS.)</div>
              <div className="text-right">Net (RS.)</div>
            </div>

            {[...revenueTimeline].reverse().map((r: any, idx: number) => (
              <div
                key={idx}
                className="bg-[#FDFCF8] p-7 grid grid-cols-4 items-center group hover:bg-[#EAE8E2] transition-colors"
              >
                <p className="text-sm font-heading italic">{r.name}</p>
                <p className="text-center font-bold tracking-tighter text-base">{r.orders}</p>
                <p className="text-right font-mono font-bold text-sm">
                  {formatPrice(r.gross).replace('Rs. ', '')}
                </p>
                <p className="text-right font-mono font-bold text-sm text-green-700">
                  {formatPrice(r.amount).replace('Rs. ', '')}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
