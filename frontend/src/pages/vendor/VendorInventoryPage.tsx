import React from 'react';
import { AlertTriangle, ArrowUpRight, ArrowDownRight, Loader2, AlertCircle } from 'lucide-react';
import { cn, formatPrice } from '@/utils/helpers';
import { useGetInventoryStatusQuery } from '@/store/api/vendorApi';
import { useUpdateStockMutation as useProductStockMutation } from '@/store/api/productApi';
import { riftToast } from '@/components/common/toastContainer';

type FilterType = 'ALL' | 'LOW' | 'OUT';

export const VendorInventoryPage: React.FC = () => {
  const [filter, setFilter] = React.useState<FilterType>('ALL');
  const [pendingIds, setPendingIds] = React.useState<Set<string>>(new Set());
  const inputRefs = React.useRef<Record<string, HTMLInputElement | null>>({});

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

  const getInputValue = (id: string) => {
    const el = inputRefs.current[id];
    if (!el) return null;
    const parsed = parseInt(el.value, 10);
    return isNaN(parsed) || parsed < 0 ? null : parsed;
  };

  const adjustInput = (id: string, currentStock: number, delta: number) => {
    const el = inputRefs.current[id];
    if (!el) return;
    const current = parseInt(el.value, 10);
    const base = isNaN(current) ? currentStock : current;
    el.value = String(Math.max(0, base + delta));
    setPendingIds((prev) => new Set(prev).add(id));
  };

  const handleInputChange = (id: string) => {
    setPendingIds((prev) => new Set(prev).add(id));
  };

  const saveStock = async (id: string, currentStock: number) => {
    const qty = getInputValue(id);
    if (qty === null) {
      // revert input to current stock
      const el = inputRefs.current[id];
      if (el) el.value = String(currentStock);
      riftToast.error('Enter a valid stock number.');
      return;
    }
    await riftToast.promise(
      updateStock({ id, stock: qty }).unwrap(),
      {
        loading: 'Updating stock...',
        success: 'Stock updated!',
        error: 'Failed to update stock.',
      },
    );
    setPendingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
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
                key === 'OUT' && count > 0 && filter !== key ? 'text-red-600' : '',
              )}
            >
              {label}
              {count > 0 && (
                <span className={cn('text-[8px] font-mono px-1.5 py-0.5', filter === key ? 'bg-white/20' : 'bg-[#1A1A1A]/10')}>
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
          <div className="bg-[#FDFCF8] p-5 lg:p-7 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.3em] opacity-40 border-b border-[#1A1A1A]/5">
            <div className="w-14">Image</div>
            <div className="flex-1 px-6">Product Name</div>
            <div className="w-24 text-center">Price</div>
            <div className="w-32 text-center">Stock Level</div>
            <div className="w-64" />
          </div>

          {filtered.length === 0 ? (
            <div className="bg-[#FDFCF8] p-12 text-center text-[10px] font-bold uppercase tracking-widest opacity-30">
              No products in this category
            </div>
          ) : (
            filtered.map((item: any) => {
              const currentStock: number = item.stock ?? 0;
              const hasPending = pendingIds.has(item._id);
              const isLow = currentStock > 0 && currentStock <= 10;
              const isOut = currentStock === 0;

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
                      <span className={cn('text-xl font-bold tracking-tighter', isOut ? 'text-red-700' : isLow ? 'text-amber-700' : '')}>
                        {currentStock}
                      </span>
                    </div>
                    {isOut && <span className="text-[8px] font-bold text-red-600 uppercase tracking-widest mt-0.5">Out of stock</span>}
                    {isLow && !isOut && <span className="text-[8px] font-bold text-amber-600 uppercase tracking-widest mt-0.5">Low stock</span>}
                  </div>

                  {/* Controls */}
                  <div className="w-64 flex justify-end items-center gap-2 flex-shrink-0">
                    <div className="flex bg-[#1A1A1A]/5 border border-[#1A1A1A]/5">
                      <button
                        onClick={() => adjustInput(item._id, currentStock, -1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all border-r border-[#1A1A1A]/10"
                      >
                        <ArrowDownRight size={13} />
                      </button>
                      <input
                        ref={(el) => { inputRefs.current[item._id] = el; }}
                        type="number"
                        min={0}
                        defaultValue={currentStock}
                        onChange={() => handleInputChange(item._id)}
                        className="w-14 h-9 text-center text-[11px] font-bold bg-transparent outline-none border-x border-[#1A1A1A]/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        onClick={() => adjustInput(item._id, currentStock, 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all"
                      >
                        <ArrowUpRight size={13} />
                      </button>
                    </div>

                    {hasPending && (
                      <button
                        onClick={() => saveStock(item._id, currentStock)}
                        disabled={stockUpdating}
                        className="px-3 h-9 bg-[#1A1A1A] text-[#FDFCF8] text-[9px] font-bold uppercase tracking-widest hover:opacity-80 transition-all disabled:opacity-40 whitespace-nowrap"
                      >
                        {stockUpdating ? '...' : 'Save'}
                      </button>
                    )}
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