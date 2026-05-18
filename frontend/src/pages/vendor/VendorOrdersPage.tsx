import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { formatPrice, cn } from '@/utils/helpers';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { useGetVendorOrdersQuery, useVendorUpdateOrderStatusMutation } from '@/store/api/orderApi';

const STATUS_TABS = ['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

const VENDOR_STATUS_OPTIONS = [
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
];

export const VendorOrdersPage: React.FC = () => {
  const [filter, setFilter] = React.useState('ALL');
  const [page, setPage] = React.useState(1);

  const { data, isLoading, isError } = useGetVendorOrdersQuery({
    page,
    limit: 10,
    status: filter === 'ALL' ? undefined : filter.toLowerCase(),
  });

  const [updateStatus, { isLoading: updating }] = useVendorUpdateOrderStatusMutation();

  const orders = data?.data?.orders ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus({ id: orderId, status: newStatus }).unwrap();
    } catch {
      // fail silently — RTK will revert optimistically if needed
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-10 gap-6">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-6">Order Management</div>
          <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
            Orders <br />
            <span className="not-italic font-sans text-xs tracking-[0.5em] font-bold opacity-40">Recent</span>
          </h1>
        </div>
        <div className="flex flex-wrap bg-[#1A1A1A]/5 p-1.5 gap-px">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setFilter(tab); setPage(1); }}
              className={cn(
                'px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all',
                filter === tab ? 'bg-[#1A1A1A] text-[#FDFCF8]' : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A]',
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center p-16">
          <Loader2 className="animate-spin opacity-30" size={28} />
        </div>
      ) : isError ? (
        <div className="flex items-center gap-3 text-red-600 p-8">
          <AlertCircle size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">Failed to load orders</span>
        </div>
      ) : (
        <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10 overflow-hidden">
          {/* Header row */}
          <div className="bg-[#FDFCF8] p-5 lg:p-7 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.3em] opacity-40 border-b border-[#1A1A1A]/5">
            <div className="w-24">Order ID</div>
            <div className="flex-1 px-6">Items</div>
            <div className="w-24 text-center">Qty</div>
            <div className="w-44 text-center">Update Status</div>
            <div className="w-28 text-right">Total</div>
            <div className="w-32 text-right">Date</div>
          </div>

          {orders.length === 0 ? (
            <div className="bg-[#FDFCF8] p-12 text-center text-[10px] font-bold uppercase tracking-widest opacity-30">
              No orders found
            </div>
          ) : (
            orders.map((order: any) => {
              const orderId = order._id?.slice(-6).toUpperCase() ?? '—';
              const itemNames = order.items?.map((i: any) => i.name).join(', ') ?? '—';
              const itemCount = order.items?.length ?? 0;
              const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: '2-digit' }) : '—';

              return (
                <div
                  key={order._id}
                  className="bg-[#FDFCF8] p-7 flex items-center justify-between group hover:bg-[#EAE8E2] transition-colors"
                >
                  <div className="w-24 font-mono text-[10px] opacity-40 uppercase font-bold">#{orderId}</div>

                  <div className="flex-1 px-6 min-w-0">
                    <h3 className="text-sm font-bold uppercase tracking-tight truncate">{itemNames}</h3>
                    <p className="text-[9px] font-mono opacity-30 mt-0.5 uppercase">
                      {order.paymentStatus ?? 'unpaid'} · {order.shippingAddress?.city ?? ''}
                    </p>
                  </div>

                  <div className="w-24 text-center font-bold tracking-tighter text-base">{itemCount}</div>

                  <div className="w-44 flex justify-center p-1">
                    {['pending', 'confirmed', 'processing', 'shipped'].includes(order.status) ? (
                      <CustomDropdown
                        value={order.status}
                        onChange={(val) => handleStatusChange(order._id, val)}
                        options={VENDOR_STATUS_OPTIONS}
                        className="w-full max-w-[140px] text-center"
                      />
                    ) : (
                      <span
                        className={cn(
                          'text-[10px] font-bold uppercase tracking-widest',
                          order.status === 'delivered' ? 'text-green-700' : 'text-red-600',
                        )}
                      >
                        {order.status}
                      </span>
                    )}
                  </div>

                  <div className="w-28 text-right font-mono font-bold text-sm">
                    {formatPrice(order.total ?? 0).replace('Rs. ', '')}
                  </div>

                  <div className="w-32 text-right">
                    <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest whitespace-nowrap">{date}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-[#1A1A1A]/10 disabled:opacity-20 hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all"
          >
            Prev
          </button>
          <span className="px-4 py-2 text-[10px] font-mono opacity-40">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-[#1A1A1A]/10 disabled:opacity-20 hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
