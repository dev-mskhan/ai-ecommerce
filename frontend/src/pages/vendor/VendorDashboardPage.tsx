import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  ChevronRight,
  AlertCircle,
  PlusCircle,
  Activity,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { products } from '@/mock/products';
import { orders } from '@/mock/orders';
import { formatPrice, cn } from '@/utils/helpers';
import { Button } from '@/components/ui/Button';

const vendorSalesData = [
  { day: 'Mon', sales: 12000 },
  { day: 'Tue', sales: 18000 },
  { day: 'Wed', sales: 15000 },
  { day: 'Thu', sales: 22000 },
  { day: 'Fri', sales: 30000 },
  { day: 'Sat', sales: 45000 },
  { day: 'Sun', sales: 38000 },
];

export const VendorDashboardPage: React.FC = () => {
  return (
    <div className="space-y-20">
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-12 gap-8">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-8">Dashboard Summary</div>
          <h1 className="text-5xl lg:text-6xl font-heading font-black italic tracking-tighter uppercase leading-none">
            Vendor <br/> <span className="not-italic font-sans text-sm tracking-[0.5em] font-bold opacity-40">Dashboard</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right hidden sm:block">
            <div className="text-[10px] font-bold tracking-[0.4em] opacity-40 uppercase mb-2">Store</div>
            <div className="font-mono text-xs">Active — Karachi</div>
          </div>
          <Link to="/vendor/products/add">
            <Button className="flex items-center gap-2">
              <PlusCircle size={14} />
              Add Product
            </Button>
          </Link>
        </div>
      </header>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
        {[
          { label: 'Total Revenue', value: 'RS. 142.5K', trend: '+12.4%', icon: DollarSign },
          { label: 'Active Products', value: '42 Units', trend: 'STABLE', icon: Package },
          { label: 'Total Orders', value: '184 Orders', trend: '+18.2%', icon: ShoppingBag },
          { label: 'Pending Orders', value: '12 Pending', trend: 'CRITICAL', icon: Zap },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#FDFCF8] p-10">
            <div className="flex justify-between items-start mb-8">
              <stat.icon size={18} strokeWidth={1.5} className="opacity-40" />
              <span className={cn(
                "text-[9px] font-mono font-bold tracking-widest",
                stat.trend.startsWith('+') ? "text-green-600" : stat.trend === 'CRITICAL' ? "text-red-600" : "opacity-40"
              )}>{stat.trend}</span>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-40 mb-4">{stat.label}</p>
            <p className="text-4xl font-heading font-black tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Sales Line Chart */}
        <div className="bg-[#FDFCF8] p-12 border border-[#1A1A1A]/10 flex flex-col h-[500px]">
          <div className="flex items-baseline justify-between mb-12 border-b border-[#1A1A1A]/5 pb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Sales Growth (30 Days)</h3>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={vendorSalesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A1A1A" strokeOpacity={0.05} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.4 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.4 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', color: '#FDFCF8', fontSize: '10px' }} />
                <Area type="monotone" dataKey="sales" stroke="#1A1A1A" fill="#1A1A1A" fillOpacity={0.05} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products Bar Chart */}
        <div className="bg-[#1A1A1A] p-12 flex flex-col h-[500px] text-[#FDFCF8]">
          <div className="flex items-baseline justify-between mb-12 border-b border-[#FDFCF8]/10 pb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Top Selling Products</h3>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={products.slice(0, 5).map(p => ({ name: p.title.substring(0, 5), value: Math.floor(Math.random() * 100) }))}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#FDFCF8', opacity: 0.4 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#FDFCF8', opacity: 0.4 }} />
                <Tooltip contentStyle={{ backgroundColor: '#FDFCF8', border: 'none', color: '#1A1A1A', fontSize: '10px' }} />
                <Bar dataKey="value" fill="#FDFCF8" radius={[0, 0, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <section>
        <div className="flex items-baseline justify-between mb-12 border-b border-[#1A1A1A]/10 pb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Recent Orders</h2>
          <Link to="/vendor/orders" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:line-through">View All</Link>
        </div>
        <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
          {orders.map((order) => (
            <div key={order.id} className="bg-[#FDFCF8] p-8 flex flex-col md:flex-row justify-between items-center gap-8 group hover:bg-[#EAE8E2] transition-colors">
              <div className="flex items-center gap-8 flex-1">
                <span className="font-mono text-[10px] opacity-40 uppercase">{order.id}</span>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#1A1A1A]/5 flex items-center justify-center font-bold text-[10px]">{order.buyerName.split(' ').map(n => n[0]).join('')}</div>
                  <h3 className="text-lg font-heading font-medium italic">{order.buyerName}</h3>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="text-center">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 block mb-1">Status</span>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    order.status === 'DELIVERED' ? "text-green-700" : "text-amber-700"
                  )}>{order.status}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 block mb-1">Price</span>
                  <span className="text-lg font-bold tracking-tight">{formatPrice(order.total)}</span>
                </div>
                <button className="w-10 h-10 border border-[#1A1A1A]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
