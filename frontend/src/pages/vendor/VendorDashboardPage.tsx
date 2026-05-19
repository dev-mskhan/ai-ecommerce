import React from 'react';
import { Link } from 'react-router-dom';
import {
  Package, TrendingUp, DollarSign, PlusCircle, Activity,
  Zap, ShoppingBag, Loader2, AlertCircle, X, Plus, Trash2,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useForm, useFieldArray } from 'react-hook-form';
import { cn, formatPrice } from '@/utils/helpers';
import { Button } from '@/components/ui/Button';
import { useGetVendorDashboardQuery, useGetRevenueAnalyticsQuery, useGetTopProductsQuery } from '@/store/api/vendorApi';
import { useGetVendorOrdersQuery, useGetOrderByIdQuery } from '@/store/api/orderApi';
import { useGetAllCategoriesQuery } from '@/store/api/categoryApi';
import { useCreateProductMutation } from '@/store/api/productApi';
import { riftToast } from '@/components/common/toastContainer';
import AddProductModal from '@/components/vendor/AddProduct';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ── Order Detail Panel ───────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  pending: 'border-amber-400/30 text-amber-700 bg-amber-50',
  confirmed: 'border-blue-400/30 text-blue-700 bg-blue-50',
  processing: 'border-purple-400/30 text-purple-700 bg-purple-50',
  shipped: 'border-cyan-400/30 text-cyan-700 bg-cyan-50',
  delivered: 'border-green-400/30 text-green-700 bg-green-50',
  cancelled: 'border-red-400/30 text-red-700 bg-red-50',
  refunded: 'border-gray-400/30 text-gray-700 bg-gray-50',
};

const OrderDetailPanel: React.FC<{ orderId: string; onClose: () => void }> = ({ orderId, onClose }) => {
  const { data, isLoading } = useGetOrderByIdQuery(orderId);
  const order = data?.data;

  return (
    <div className="fixed inset-0 h-screen z-50 flex justify-end bg-[#1A1A1A]/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#FDFCF8] w-full max-w-xl h-full overflow-y-auto border-l border-[#1A1A1A]/10 flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-10 border-b border-[#1A1A1A]/10 flex items-start justify-between shrink-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-2">Order Details</p>
            <h2 className="text-2xl font-heading font-black italic tracking-tighter uppercase">#{orderId.slice(-6).toUpperCase()}</h2>
          </div>
          <button onClick={onClose} className="opacity-30 hover:opacity-100 transition-opacity mt-1"><X size={20} strokeWidth={1.5} /></button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-[10px] font-mono opacity-30">Loading order...</div>
        ) : !order ? (
          <div className="flex-1 flex items-center justify-center text-[10px] font-mono opacity-30">Order not found.</div>
        ) : (
          <div className="flex-1 p-10 space-y-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-[#1A1A1A]/10 p-5 space-y-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-30">Order Status</p>
                <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-1 border inline-block", STATUS_STYLES[order.status])}>{order.status}</span>
              </div>
              <div className="border border-[#1A1A1A]/10 p-5 space-y-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-30">Payment</p>
                <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-1 border inline-block",
                  order.paymentStatus === 'paid' ? "border-green-600/30 text-green-700 bg-green-50" : "border-[#1A1A1A]/20 text-[#1A1A1A]/60"
                )}>{order.paymentStatus}</span>
              </div>
            </div>

            <div className="border border-[#1A1A1A]/10 p-6 space-y-1">
              <p className="font-heading font-medium italic text-base">{order.buyer?.name ?? '—'}</p>
              <p className="text-[10px] font-mono opacity-40">{order.buyer?.email}</p>
              <p className="text-[10px] font-mono opacity-40">{order.phone}</p>
            </div>

            <div className="border border-[#1A1A1A]/10 p-6 text-[11px] font-mono opacity-60 leading-relaxed">
              <p>{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
              <p>{order.shippingAddress?.country}</p>
            </div>

            <div className="space-y-px border border-[#1A1A1A]/10">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-5 p-5 bg-[#FDFCF8]">
                  <div className="w-12 h-12 border border-[#1A1A1A]/10 overflow-hidden shrink-0 grayscale">
                    {item.image && <img src={item.image} className="w-full h-full object-cover" alt="" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold truncate">{item.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] font-bold">{formatPrice(item.price * item.quantity)}</p>
                    <p className="text-[9px] font-mono opacity-30">x{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-[#1A1A1A]/10 p-6 space-y-3">
              {[
                { label: 'Subtotal', value: order.subtotal },
                { label: 'Discount', value: -order.discount },
                { label: 'Shipping', value: order.shippingCost },
                { label: 'Tax', value: order.tax },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-50">
                  <span>{label}</span><span>{formatPrice(value)}</span>
                </div>
              ))}
              <div className="border-t border-[#1A1A1A]/10 pt-3 flex justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest">Total</span>
                <span className="text-base font-black tracking-tight">{formatPrice(order.total)}</span>
              </div>
              {order.couponCode && <p className="text-[9px] font-mono opacity-30">Coupon: {order.couponCode}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// ── Main Page ────────────────────────────────────────────────────────
export const VendorDashboardPage: React.FC = () => {
  const [showAddProduct, setShowAddProduct] = React.useState(false);
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);

  const { data: dashData, isLoading: dashLoading, isError: dashError } = useGetVendorDashboardQuery();
  const { data: revenueData, isLoading: revLoading } = useGetRevenueAnalyticsQuery();
  const { data: topData, isLoading: topLoading } = useGetTopProductsQuery();
  const { data: ordersData, isLoading: ordersLoading } = useGetVendorOrdersQuery({ page: 1, limit: 5 });

  const stats = dashData?.data;
  const revenueChart = (revenueData?.data ?? []).map((r: any) => ({
    day: MONTH_LABELS[(r._id?.month ?? 1) - 1],
    sales: r.netRevenue ?? 0,
  }));
  const topProducts = (topData?.data ?? []).map((p: any) => ({
    name: (p.productName ?? '').substring(0, 8),
    value: p.totalQuantitySold ?? 0,
  }));
  const recentOrders = ordersData?.data?.orders ?? [];

  const kpis = [
    { label: 'Total Revenue', value: stats ? `RS. ${(stats.netRevenue / 1000).toFixed(1)}K` : '—', trend: '+12.4%', icon: DollarSign },
    { label: 'Total Products', value: stats ? `${stats.totalProducts} Units` : '—', trend: 'STABLE', icon: Package },
    { label: 'Total Orders', value: stats ? `${stats.totalOrders} Orders` : '—', trend: '+18.2%', icon: ShoppingBag },
    { label: 'Pending Orders', value: stats ? `${stats.pendingOrders} Pending` : '—', trend: stats?.pendingOrders > 0 ? 'CRITICAL' : 'STABLE', icon: Zap },
  ];

  if (dashLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin opacity-40" size={32} /></div>;
  if (dashError) return <div className="flex items-center gap-3 text-red-600 p-8"><AlertCircle size={18} /><span className="text-sm font-bold uppercase tracking-widest">Failed to load dashboard</span></div>;

  return (
    <div className="space-y-16">
      {showAddProduct && <AddProductModal showAddProduct={showAddProduct} setShowAddProduct={setShowAddProduct} onClose={() => setShowAddProduct(false)} />}
      {selectedOrderId && <OrderDetailPanel orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />}

      <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-10 gap-6">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-6">Dashboard Summary</div>
          <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
            Vendor <br /><span className="not-italic font-sans text-xs tracking-[0.5em] font-bold opacity-40">Dashboard</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-bold tracking-[0.4em] opacity-40 uppercase mb-1">Store</div>
            <div className="font-mono text-xs">Active — Karachi</div>
          </div>
          <Button onClick={() => setShowAddProduct(true)} className="flex items-center gap-2">
            <PlusCircle size={14} /> Add Product
          </Button>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
        {kpis.map((stat) => (
          <div key={stat.label} className="bg-[#FDFCF8] p-8">
            <div className="flex justify-between items-start mb-6">
              <stat.icon size={16} strokeWidth={1.5} className="opacity-40" />
              <span className={cn('text-[9px] font-mono font-bold tracking-widest',
                stat.trend.startsWith('+') ? 'text-green-600' : stat.trend === 'CRITICAL' ? 'text-red-600' : 'opacity-40')}>
                {stat.trend}
              </span>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-40 mb-3">{stat.label}</p>
            <p className="text-3xl font-heading font-black tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-[#FDFCF8] p-10 border border-[#1A1A1A]/10 flex flex-col h-[440px]">
          <div className="flex items-baseline justify-between mb-10 border-b border-[#1A1A1A]/5 pb-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Monthly Revenue</h3>
            {revLoading && <Loader2 size={12} className="animate-spin opacity-30" />}
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A1A1A" strokeOpacity={0.05} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.4 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.4 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', color: '#FDFCF8', fontSize: '10px' }} />
                <Area type="monotone" dataKey="sales" stroke="#1A1A1A" fill="#1A1A1A" fillOpacity={0.05} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-10 flex flex-col h-[440px] text-[#FDFCF8]">
          <div className="flex items-baseline justify-between mb-10 border-b border-[#FDFCF8]/10 pb-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Top Products</h3>
            {topLoading && <Loader2 size={12} className="animate-spin opacity-30" />}
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#FDFCF8', opacity: 0.4 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#FDFCF8', opacity: 0.4 }} />
                <Tooltip contentStyle={{ backgroundColor: '#FDFCF8', border: 'none', color: '#1A1A1A', fontSize: '10px' }} />
                <Bar dataKey="value" fill="#FDFCF8" barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <section>
        <div className="flex items-baseline justify-between mb-10 border-b border-[#1A1A1A]/10 pb-3">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Recent Orders</h2>
          <Link to="/vendor/orders" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:line-through">View All</Link>
        </div>

        {ordersLoading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin opacity-30" size={24} /></div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center p-12 text-[10px] font-bold uppercase tracking-widest opacity-30">No orders yet</div>
        ) : (
          <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
            {recentOrders.map((order: any) => {
              const itemCount = order.items?.length ?? 0;
              const orderId = order._id?.slice(-6).toUpperCase() ?? order._id;
              const status = order.status?.toUpperCase() ?? 'PENDING';

              return (
                <div key={order._id} className="bg-[#FDFCF8] p-7 flex flex-col md:flex-row justify-between items-center gap-6 group hover:bg-[#EAE8E2] transition-colors">
                  <div className="flex items-center gap-6 flex-1">
                    <span className="font-mono text-[10px] opacity-40 uppercase">#{orderId}</span>
                    <span className="text-[10px] font-bold opacity-40">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="text-center">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 block mb-1">Status</span>
                      <span className={cn('text-[10px] font-bold uppercase tracking-widest',
                        status === 'DELIVERED' ? 'text-green-700' : status === 'CANCELLED' ? 'text-red-700' : 'text-amber-700')}>
                        {status}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 block mb-1">Total</span>
                      <span className="text-base font-bold tracking-tight">{formatPrice(order.total)}</span>
                    </div>
                    <button
                      onClick={() => setSelectedOrderId(order._id)}
                      className="w-9 h-9 border border-[#1A1A1A]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#1A1A1A] hover:text-[#FDFCF8]"
                    >
                      →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};