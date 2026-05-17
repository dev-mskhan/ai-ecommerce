import React from 'react';
import { ShoppingCart, Package, Truck, CheckCircle, Search, Filter, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatPrice, cn } from '@/utils/helpers';
import { CustomDropdown } from '@/components/ui/CustomDropdown';

export const VendorOrdersPage: React.FC = () => {
  const [vendorOrders, setVendorOrders] = React.useState([
    { id: 'ORD-9921', date: 'May 12, 2024', customer: 'Elias Thorne', items: 2, total: 12500, status: 'SHIPPED' },
    { id: 'ORD-9918', date: 'May 10, 2024', customer: 'Margot Vanhoutte', items: 1, total: 4500, status: 'PENDING' },
    { id: 'ORD-9882', date: 'May 08, 2024', customer: 'S. OBSCURE', items: 4, total: 42000, status: 'DELIVERED' },
  ]);
  const [filter, setFilter] = React.useState('ALL');

  const filteredOrders = vendorOrders.filter(o => filter === 'ALL' || o.status === filter);

  const updateStatus = (id: string, newStatus: string) => {
    setVendorOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-12 gap-8">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-8">Order Summary</div>
          <h1 className="text-5xl lg:text-6xl font-heading font-black italic tracking-tighter uppercase leading-none">
            Recent <br/> <span className="not-italic font-sans text-sm tracking-[0.5em] font-bold opacity-40">Orders</span>
          </h1>
        </div>
        <div className="flex bg-[#1A1A1A]/5 p-2">
          {['ALL', 'PENDING', 'SHIPPED', 'DELIVERED'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                filter === tab ? "bg-[#1A1A1A] text-[#FDFCF8]" : "text-[#1A1A1A]/40 hover:text-[#1A1A1A]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10 overflow-hidden">
        <div className="bg-[#FDFCF8] p-6 lg:p-8 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.3em] opacity-40 border-b border-[#1A1A1A]/5">
          <div className="w-24">Order ID</div>
          <div className="flex-1 px-8">Customer Name</div>
          <div className="w-24 text-center">Items</div>
          <div className="w-48 text-center">Status</div>
          <div className="w-32 text-right">Total</div>
          <div className="w-32 text-right">Date</div>
        </div>

        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-[#FDFCF8] p-8 flex items-center justify-between group hover:bg-[#EAE8E2] transition-colors">
            <div className="w-24 font-mono text-[10px] opacity-40 uppercase font-bold">{order.id}</div>
            
            <div className="flex-1 px-8">
              <h3 className="text-sm font-bold uppercase tracking-tight">{order.customer}</h3>
            </div>

            <div className="w-24 text-center font-bold tracking-tighter text-lg">
              {order.items}
            </div>

            <div className="w-48 flex justify-center p-2">
              <CustomDropdown 
                value={order.status}
                onChange={(val) => updateStatus(order.id, val)}
                options={[
                  { label: 'Pending', value: 'PENDING' },
                  { label: 'Shipped', value: 'SHIPPED' },
                  { label: 'Delivered', value: 'DELIVERED' }
                ]}
                className="w-full max-w-[140px] text-center"
              />
            </div>

            <div className="w-32 text-right font-mono font-bold">
               {formatPrice(order.total).replace('Rs. ', '')}
            </div>

            <div className="w-32 text-right">
               <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest whitespace-nowrap">{order.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
