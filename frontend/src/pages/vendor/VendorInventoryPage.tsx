import React from 'react';
import { AlertTriangle, ArrowUpRight, ArrowDownRight, Edit2, Loader2, AlertCircle } from 'lucide-react';
import { cn, formatPrice } from '@/utils/helpers';
import { useGetInventoryStatusQuery, useUpdateStockMutation } from '@/store/api/vendorApi';
import { useUpdateStockMutation as useProductStockMutation } from '@/store/api/productApi';

type FilterType = 'ALL' | 'LOW' | 'OUT';

export const VendorInventoryPage: React.FC = () => {
  const [filter, setFilter] = React.useState<FilterType>('ALL');
  const [pendingStock, setPendingStock] = React.useState<Record<string, number>>({});

  const { data, isLoading, isError } = useGetInventoryStatusQuery();
  const [updateStock, { isLoading: stockUpdating }] = useProductStockMutation();

  const inventoryData = data?.data ?? { out_of_stock: [], low_stock: [], healthy: [] };

  const allProducts = [
    ...inventoryData.out_of_stock,
    ...inventoryData.low_stock,
    ...inventoryData.healthy,
  ];

  const filtered = filter === 'ALL'
    ? allProducts
    : filter === 'LOW'
    ? inventoryData.low_stock
    : inventoryData.out_of_stock;

  const getDisplayStock = (product: any) =>
    pendingStock[product._id] !== undefined ? pendingStock[product._id] : product.stock ?? 0;

  const adjustPending = (id: string, currentStock: number, delta: number) => {
    setPendingStock((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? currentStock) + delta),
    }));
  };

  const saveStock = async (id: string) => {
    if (pendingStock[id] === undefined) return;
    await updateStock({ id, quantity: pendingStock[id] }).unwrap();
    setPendingStock((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-10 gap-6">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-6">Stock Control</div>
          <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
            Inventory <br />
            <span className="not-italic font-sans text-xs tracking-[0.5em] font-bold opacity-40">Stock</span>
          </h1>
        </div>

        {/* Summary pills */}
        <div className="flex items-center gap-3">
          {[
            { label: 'All', key: 'ALL', count: allProducts.length },
            { label: 'Low Stock', key: 'LOW', count: inventoryData.low_stock.length },
            { label: 'Out of Stock', key: 'OUT', count: inventoryData.out_of_stock.length },
          ].map(({ label, key, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key as FilterType)}
              className={cn(
                'px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2',
                filter === key ? 'bg-[#1A1A1A] text-[#FDFCF8]' : 'bg-[#1A1A1A]/5 opacity-50 hover:opacity-100',
                key === 'OUT' && count > 0 ? 'text-red-600' : '',
              )}
            >
              {label}
              {count > 0 && (
                <span className={cn(
                  'text-[8px] font-mono px-1.5 py-0.5',
                  filter === key ? 'bg-white/20' : 'bg-[#1A1A1A]/10',
                )}>
                  {count}
                </span>
              )}
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
          <span className="text-xs font-bold uppercase tracking-widest">Failed to load inventory</span>
        </div>
      ) : (
        <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10 overflow-hidden">
          {/* Header */}
          <div className="bg-[#FDFCF8] p-5 lg:p-7 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.3em] opacity-40 border-b border-[#1A1A1A]/5">
            <div className="w-14">Image</div>
            <div className="flex-1 px-6">Product Name</div>
            <div className="w-24 text-center">Price</div>
            <div className="w-32 text-center">Stock Level</div>
            <div className="w-52" />
          </div>

          {filtered.length === 0 ? (
            <div className="bg-[#FDFCF8] p-12 text-center text-[10px] font-bold uppercase tracking-widest opacity-30">
              No products in this category
            </div>
          ) : (
            filtered.map((item: any) => {
              const displayStock = getDisplayStock(item);
              const hasPending = pendingStock[item._id] !== undefined;
              const isLow = displayStock > 0 && displayStock <= 10;
              const isOut = displayStock === 0;

              return (
                <div
                  key={item._id}
                  className="bg-[#FDFCF8] p-7 flex items-center justify-between group hover:bg-[#EAE8E2] transition-colors"
                >
                  {/* Image */}
                  <div className="w-14 h-16 bg-[#1A1A1A]/5 grayscale flex items-center justify-center overflow-hidden border border-[#1A1A1A]/5 flex-shrink-0">
                    {item.images ? (
                      <img src={Array.isArray(item.images) ? item.images[0] : item.images} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <span className="text-[8px] opacity-20">NO IMG</span>
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex-1 px-6 space-y-1 min-w-0">
                    <h3 className="text-base font-heading font-medium italic leading-none truncate">{item.name}</h3>
                    <p className="text-[10px] font-mono opacity-20 uppercase">ID: {item._id?.slice(-8)}</p>
                  </div>

                  {/* Price */}
                  <div className="w-24 text-center font-mono font-bold text-sm flex-shrink-0">
                    {item.price ? formatPrice(item.price).replace('Rs. ', '') : '—'}
                  </div>

                  {/* Stock indicator */}
                  <div className="w-32 flex flex-col items-center flex-shrink-0">
                    <div className="flex items-center gap-2">
                      {(isLow || isOut) && <AlertTriangle size={13} className="text-red-600" />}
                      <span
                        className={cn(
                          'text-xl font-bold tracking-tighter',
                          isOut ? 'text-red-700' : isLow ? 'text-amber-700' : '',
                        )}
                      >
                        {displayStock}
                      </span>
                    </div>
                    {isOut && <span className="text-[8px] font-bold text-red-600 uppercase tracking-widest mt-0.5">Out of stock</span>}
                    {isLow && !isOut && <span className="text-[8px] font-bold text-amber-600 uppercase tracking-widest mt-0.5">Low stock</span>}
                  </div>

                  {/* Controls */}
                  <div className="w-52 flex justify-end gap-2 flex-shrink-0">
                    <div className="flex bg-[#1A1A1A]/5 border border-[#1A1A1A]/5">
                      <button
                        onClick={() => adjustPending(item._id, item.stock, -1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all border-r border-[#1A1A1A]/10"
                      >
                        <ArrowDownRight size={13} />
                      </button>
                      <div className="w-9 h-9 flex items-center justify-center text-[9px] font-bold opacity-40">Qty</div>
                      <button
                        onClick={() => adjustPending(item._id, item.stock, 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all"
                      >
                        <ArrowUpRight size={13} />
                      </button>
                    </div>

                    {hasPending && (
                      <button
                        onClick={() => saveStock(item._id)}
                        disabled={stockUpdating}
                        className="px-3 h-9 bg-[#1A1A1A] text-[#FDFCF8] text-[9px] font-bold uppercase tracking-widest hover:opacity-80 transition-all disabled:opacity-40 whitespace-nowrap"
                      >
                        {stockUpdating ? '...' : 'Save'}
                      </button>
                    )}

                    <button className="w-9 h-9 border border-[#1A1A1A]/10 flex items-center justify-center opacity-40 hover:opacity-100 transition-all">
                      <Edit2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
