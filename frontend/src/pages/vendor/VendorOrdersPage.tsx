import React from 'react';
import { Loader2, AlertCircle, ChevronDown } from 'lucide-react';
import { formatPrice, cn } from '@/utils/helpers';
import { useGetVendorOrdersQuery, useVendorUpdateOrderStatusMutation } from '@/store/api/orderApi';
import { riftToast } from '@/components/common/toastContainer';

const STATUS_TABS = ['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

const STATUS_STYLES: Record<string, string> = {
  pending: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  confirmed: 'text-blue-700 bg-blue-50 border-blue-200',
  processing: 'text-orange-700 bg-orange-50 border-orange-200',
  shipped: 'text-purple-700 bg-purple-50 border-purple-200',
  delivered: 'text-green-700 bg-green-50 border-green-200',
  cancelled: 'text-red-700 bg-red-50 border-red-200',
  refunded: 'text-gray-600 bg-gray-50 border-gray-200',
};

// Only statuses a vendor can transition TO
const VENDOR_NEXT_STATUSES: Record<string, string[]> = {
  pending: ['confirmed'],
  confirmed: ['processing'],
  processing: ['shipped'],
  shipped: [],
  delivered: [],
  cancelled: [],
  refunded: [],
};

function StatusDropdown({
  orderId,
  currentStatus,
  onUpdate,
}: {
  orderId: string;
  currentStatus: string;
  onUpdate: (id: string, status: string) => void;
}) {
  const options = VENDOR_NEXT_STATUSES[currentStatus] ?? [];
  const isTerminal = options.length === 0;

  return (
    <div className="relative inline-flex items-center">
      <span
        className={cn(
          'text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 border',
          STATUS_STYLES[currentStatus] ?? 'text-gray-600 bg-gray-50 border-gray-200',
        )}
      >
        {currentStatus}
      </span>

      {!isTerminal && (
        <div className="relative ml-1.5">
          <select
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                onUpdate(orderId, e.target.value);
                e.target.value = '';
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="appearance-none bg-[#1A1A1A] text-[#FDFCF8] text-[8px] font-bold uppercase tracking-widest pl-2.5 pr-5 py-1.5 outline-none cursor-pointer border-none"
          >
            <option value="" disabled>Move to</option>
            {options.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={9} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#FDFCF8] pointer-events-none" />
        </div>
      )}
    </div>
  );
}

export const VendorOrdersPage: React.FC = () => {
  const [filter, setFilter] = React.useState('ALL');
  const [page, setPage] = React.useState(1);

  const { data, isLoading, isError, isFetching } = useGetVendorOrdersQuery({
    page,
    limit: 10,
    status: filter === 'ALL' ? undefined : filter.toLowerCase(),
  });

  const [updateStatus] = useVendorUpdateOrderStatusMutation();

  const orders: any[] = data?.data?.orders ?? [];
  const totalPages: number = data?.data?.totalPages ?? 1;
  const total: number = data?.data?.total ?? 0;

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await riftToast.promise(
      updateStatus({ id: orderId, status: newStatus }).unwrap(),
      {
        loading: 'Updating status...',
        success: 'Order status updated!',
        error: 'Failed to update status.',
      },
    );
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-10 gap-6">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-6">Order Management</div>
          <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
            Orders <br />
            <span className="not-italic font-sans text-xs tracking-[0.5em] font-bold opacity-40">Recent</span>
          </h1>
        </div>

        {/* Status tabs */}
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
        <>
          <div className={cn('space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10 overflow-hidden transition-opacity', isFetching ? 'opacity-50' : '')}>
            {/* Table header */}
            <div className="bg-[#FDFCF8] px-7 py-4 grid grid-cols-[80px_1fr_80px_100px_180px_110px] items-center text-[9px] font-bold uppercase tracking-[0.3em] opacity-40 border-b border-[#1A1A1A]/5">
              <div>Order</div>
              <div className="px-4">Items</div>
              <div className="text-center">Qty</div>
              <div className="text-right">Total</div>
              <div className="text-center">Status</div>
              <div className="text-right">Date</div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-[#FDFCF8] p-12 text-center text-[10px] font-bold uppercase tracking-widest opacity-30">
                No orders found
              </div>
            ) : (
              orders.map((order: any) => {
                const orderId = order._id?.slice(-6).toUpperCase() ?? '—';
                // Vendor only sees their items (backend already filters, but guard here too)
                const items: any[] = order.items ?? [];
                const vendorItemStatus: string = items[0]?.status ?? order.status ?? 'pending';
                const itemNames = items.map((i) => i.name ?? i.product?.name ?? '—').join(', ');
                const totalQty = items.reduce((sum: number, i: any) => sum + (i.quantity ?? 1), 0);
                const date = order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: '2-digit' })
                  : '—';
                // Use order-level status for display / dropdown logic
                const status: string = order.status ?? 'pending';

                return (
                  <div
                    key={order._id}
                    className="bg-[#FDFCF8] px-7 py-5 grid grid-cols-[80px_1fr_80px_100px_180px_110px] items-center hover:bg-[#EAE8E2] transition-colors"
                  >
                    {/* Order ID */}
                    <div className="font-mono text-[10px] opacity-40 uppercase font-bold">#{orderId}</div>

                    {/* Items */}
                    <div className="px-4 min-w-0">
                      <p className="text-sm font-bold uppercase tracking-tight truncate">{itemNames}</p>
                      <p className="text-[9px] font-mono opacity-30 mt-0.5 uppercase">
                        {order.paymentStatus ?? 'unpaid'}
                        {order.shippingAddress?.city ? ` · ${order.shippingAddress.city}` : ''}
                        {order.status !== vendorItemStatus ? ` · order: ${order.status}` : ''}
                      </p>
                    </div>

                    {/* Qty */}
                    <div className="text-center font-bold text-sm">{totalQty}</div>

                    {/* Total */}
                    <div className="text-right font-mono font-bold text-sm">
                      {formatPrice(order.total ?? 0)}
                    </div>

                    {/* Status + action */}
                    <div className="flex justify-center">
                      <StatusDropdown
                        orderId={order._id}
                        currentStatus={vendorItemStatus}
                        onUpdate={handleStatusChange}
                      />
                    </div>

                    {/* Date */}
                    <div className="text-right">
                      <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest whitespace-nowrap">{date}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-mono opacity-40">{total} total orders</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-[#1A1A1A]/10 disabled:opacity-20 hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all"
                >
                  Prev
                </button>
                <span className="px-4 py-2 text-[10px] font-mono opacity-40">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-[#1A1A1A]/10 disabled:opacity-20 hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};