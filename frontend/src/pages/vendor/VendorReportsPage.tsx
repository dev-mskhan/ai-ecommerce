import React from 'react';
import { FileText, Download, TrendingUp, DollarSign, ShoppingBag, BarChart2, Loader2, AlertCircle } from 'lucide-react';
import { cn, formatPrice } from '@/utils/helpers';
import { useGetSalesReportQuery, useGetVendorDashboardQuery } from '@/store/api/vendorApi';
import { useGetVendorOrdersQuery } from '@/store/api/orderApi';

const DATE_RANGES = ['7D', '30D', '90D', 'YTD'] as const;

export const VendorReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = React.useState<string>('30D');

  const { data: dashData, isLoading: dashLoading } = useGetVendorDashboardQuery();
  const { data: salesData, isLoading: salesLoading } = useGetSalesReportQuery();
  const { data: ordersData, isLoading: ordersLoading } = useGetVendorOrdersQuery({ page: 1, limit: 20 });

  const dash = dashData?.data;
  const salesReport = salesData?.data ?? [];
  const orders = ordersData?.data?.orders ?? [];

  // Compute totals from sales report
  const totalItemsSold = salesReport.reduce((acc: number, p: any) => acc + (p.totalQuantitySold ?? 0), 0);
  const grossRevenue = salesReport.reduce((acc: number, p: any) => acc + (p.grossRevenue ?? 0), 0);
  const avgSale = orders.length ? grossRevenue / orders.length : 0;

  const stats = [
    {
      label: 'Total Revenue',
      value: formatPrice(dash?.netRevenue ?? 0),
      icon: DollarSign,
      trend: '+12.4%',
    },
    {
      label: 'Items Sold',
      value: String(totalItemsSold),
      icon: ShoppingBag,
      trend: '+5.2%',
    },
    {
      label: 'Avg. Order Value',
      value: formatPrice(avgSale),
      icon: TrendingUp,
      trend: '-2.1%',
    },
    {
      label: 'Total Orders',
      value: String(dash?.totalOrders ?? 0),
      icon: BarChart2,
      trend: 'STABLE',
    },
  ];

  const handleExportCSV = () => {
    if (salesReport.length === 0) return;

    const headers = ['Product', 'Units Sold', 'Gross Revenue (RS.)', 'Net Revenue (RS.)', 'Orders'];
    const rows = salesReport.map((p: any) => [
      p.productName ?? '—',
      p.totalQuantitySold ?? 0,
      p.grossRevenue?.toFixed(2) ?? '0',
      p.netRevenue?.toFixed(2) ?? '0',
      p.orderCount ?? 0,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${dateRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-14">
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-10 gap-6">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-6">Sales Reports</div>
          <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
            Reports <br />
            <span className="not-italic font-sans text-xs tracking-[0.5em] font-bold opacity-40">Detailed</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[#1A1A1A]/5 p-1">
            {DATE_RANGES.map((p) => (
              <button
                key={p}
                onClick={() => setDateRange(p)}
                className={cn(
                  'px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all',
                  dateRange === p ? 'bg-[#1A1A1A] text-[#FDFCF8]' : 'opacity-40 hover:opacity-100',
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={handleExportCSV}
            disabled={salesReport.length === 0}
            className="flex items-center gap-2 px-5 py-3 border border-[#1A1A1A]/10 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all disabled:opacity-30"
          >
            <Download size={13} /> Export CSV
          </button>
        </div>
      </header>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#FDFCF8] p-8 flex flex-col justify-between h-44">
            <div className="flex justify-between items-start">
              <stat.icon size={18} className="opacity-20" />
              {dashLoading ? (
                <Loader2 size={10} className="animate-spin opacity-30" />
              ) : (
                <span className={cn(
                  'text-[9px] font-mono font-bold tracking-widest',
                  stat.trend.startsWith('+') ? 'text-green-600' : stat.trend.startsWith('-') ? 'text-red-600' : 'opacity-20',
                )}>
                  {stat.trend}
                </span>
              )}
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-40 mb-2">{stat.label}</p>
              <p className="text-2xl font-heading font-black tracking-tighter">
                {dashLoading ? '—' : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Sales by product table */}
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40 mb-6 border-b border-[#1A1A1A]/5 pb-3">
          Sales by Product
        </h3>

        {salesLoading ? (
          <div className="flex justify-center p-16"><Loader2 className="animate-spin opacity-30" size={24} /></div>
        ) : (
          <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10 overflow-hidden">
            <div className="bg-[#1A1A1A] p-5 lg:p-7 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.3em] text-[#FDFCF8]/40">
              <div className="w-14">Image</div>
              <div className="flex-1 px-6">Product</div>
              <div className="w-28 text-center">Units Sold</div>
              <div className="w-36 text-right px-4">Gross Revenue</div>
              <div className="w-36 text-right">Net Revenue</div>
            </div>

            {salesReport.length === 0 ? (
              <div className="bg-[#FDFCF8] p-12 text-center text-[10px] font-bold uppercase tracking-widest opacity-30">
                No sales data yet
              </div>
            ) : (
              salesReport.map((item: any) => (
                <div
                  key={item._id}
                  className="bg-[#FDFCF8] p-7 flex items-center justify-between group hover:bg-[#EAE8E2] transition-colors"
                >
                  <div className="w-14 h-14 bg-[#1A1A1A]/5 grayscale flex items-center justify-center overflow-hidden border border-[#1A1A1A]/5 flex-shrink-0">
                    {item.productImage ? (
                      <img src={item.productImage} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <FileText size={14} className="opacity-20" />
                    )}
                  </div>
                  <div className="flex-1 px-6 min-w-0">
                    <h3 className="text-base font-heading font-medium italic truncate">{item.productName ?? '—'}</h3>
                    <p className="text-[9px] font-mono opacity-30 mt-0.5">{item.orderCount ?? 0} orders</p>
                  </div>
                  <div className="w-28 text-center font-bold tracking-tighter text-base">
                    {item.totalQuantitySold ?? 0}
                  </div>
                  <div className="w-36 text-right px-4 font-mono font-bold text-sm">
                    {formatPrice(item.grossRevenue ?? 0).replace('Rs. ', '')}
                  </div>
                  <div className="w-36 text-right font-mono font-bold text-sm text-green-700">
                    {formatPrice(item.netRevenue ?? 0).replace('Rs. ', '')}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Recent orders table */}
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40 mb-6 border-b border-[#1A1A1A]/5 pb-3">
          Recent Transactions
        </h3>
        {ordersLoading ? (
          <div className="flex justify-center p-10"><Loader2 className="animate-spin opacity-30" size={20} /></div>
        ) : (
          <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10 overflow-hidden">
            <div className="bg-[#1A1A1A] p-5 lg:p-7 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.3em] text-[#FDFCF8]/40">
              <div className="w-28">Order ID</div>
              <div className="flex-1 px-6">Items</div>
              <div className="w-24 text-center">Qty</div>
              <div className="w-44 text-right px-6">Total</div>
              <div className="w-28 text-right">Date</div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-[#FDFCF8] p-10 text-center text-[10px] font-bold uppercase tracking-widest opacity-30">
                No orders yet
              </div>
            ) : (
              orders.map((order: any) => {
                const orderId = order._id?.slice(-6).toUpperCase() ?? '—';
                const itemNames = order.items?.map((i: any) => i.name).join(', ') ?? '—';
                const qty = order.items?.reduce((a: number, i: any) => a + (i.quantity ?? 0), 0) ?? 0;
                const date = order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: '2-digit' })
                  : '—';

                return (
                  <div
                    key={order._id}
                    className="bg-[#FDFCF8] p-7 flex items-center justify-between group hover:bg-[#EAE8E2] transition-colors"
                  >
                    <div className="w-28 font-mono text-[10px] opacity-40 uppercase font-bold">#{orderId}</div>
                    <div className="flex-1 px-6 min-w-0">
                      <p className="text-sm font-heading font-medium italic truncate">{itemNames}</p>
                    </div>
                    <div className="w-24 text-center font-bold tracking-tighter text-base">{qty}</div>
                    <div className="w-44 text-right px-6 font-mono font-bold text-sm">
                      {formatPrice(order.total ?? 0).replace('Rs. ', '')}
                    </div>
                    <div className="w-28 text-right">
                      <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest whitespace-nowrap">{date}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
