import React from 'react';
import { FileText, Download, Calendar, Filter, TrendingUp, DollarSign, ShoppingBag, BarChart2 } from 'lucide-react';
import { cn, formatPrice } from '@/utils/helpers';
import { orders } from '@/mock/orders';

export const VendorReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = React.useState('30D');

  const stats = [
    { label: 'Total Revenue', value: formatPrice(142500), icon: DollarSign, trend: '+12.4%' },
    { label: 'Items Sold', value: '842', icon: ShoppingBag, trend: '+5.2%' },
    { label: 'Average Sale', value: formatPrice(1690), icon: TrendingUp, trend: '-2.1%' },
    { label: 'Total Transactions', value: '42', icon: BarChart2, trend: 'STABLE' },
  ];

  return (
    <div className="space-y-16">
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-12 gap-8">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-8">Sales Reports</div>
          <h1 className="text-5xl lg:text-6xl font-heading font-black italic tracking-tighter uppercase leading-none">
            Detailed <br/> <span className="not-italic font-sans text-sm tracking-[0.5em] font-bold opacity-40">Reports</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-[#1A1A1A]/5 p-1">
            {['7D', '30D', '90D', 'YTD'].map(p => (
              <button 
                key={p} 
                onClick={() => setDateRange(p)}
                className={cn(
                  "px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                  dateRange === p ? "bg-[#1A1A1A] text-[#FDFCF8]" : "opacity-40 hover:opacity-100"
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-6 py-3 border border-[#1A1A1A]/10 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all">
             <Download size={14} /> Export CSV
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#FDFCF8] p-10 flex flex-col justify-between h-48">
            <div className="flex justify-between items-start">
               <stat.icon size={20} className="opacity-20" />
               <span className={cn(
                 "text-[9px] font-mono font-bold tracking-widest",
                 stat.trend.startsWith('+') ? "text-green-600" : stat.trend.startsWith('-') ? "text-red-600" : "opacity-20"
               )}>{stat.trend}</span>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-40 mb-2">{stat.label}</p>
              <p className="text-3xl font-heading font-black tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10 overflow-hidden">
        <div className="bg-[#1A1A1A] p-6 lg:p-8 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.3em] text-[#FDFCF8]/40">
           <div className="w-32">Order ID</div>
           <div className="flex-1 px-8">Customer</div>
           <div className="w-32 text-center">Quantity</div>
           <div className="w-48 text-right px-8">Total Amount</div>
           <div className="w-32 text-right">Date</div>
        </div>

        {orders.map((order) => (
          <div key={order.id} className="bg-[#FDFCF8] p-8 flex items-center justify-between group hover:bg-[#EAE8E2] transition-colors">
            <div className="w-32 font-mono text-[10px] opacity-40 uppercase font-bold">{order.id}</div>
            <div className="flex-1 px-8">
               <h3 className="text-lg font-heading font-medium italic">{order.buyerName}</h3>
            </div>
            <div className="w-32 text-center font-bold tracking-tighter text-lg">
               {order.items.length}
            </div>
            <div className="w-48 text-right px-8 font-mono font-bold">
               {formatPrice(order.total).replace('Rs. ', '')}
            </div>
            <div className="w-32 text-right">
               <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">May 12, 24</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
