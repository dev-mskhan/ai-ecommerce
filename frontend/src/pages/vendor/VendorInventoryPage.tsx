import React from 'react';
import { Package, AlertTriangle, Search, Filter, ArrowUpRight, ArrowDownRight, RefreshCw, Edit2 } from 'lucide-react';
import { cn, formatPrice } from '@/utils/helpers';
import { products } from '@/mock/products';

export const VendorInventoryPage: React.FC = () => {
  const [inventory, setInventory] = React.useState(products.slice(0, 8));
  const [filter, setFilter] = React.useState<'ALL' | 'LOW'>('ALL');

  const filtered = filter === 'ALL' 
    ? inventory 
    : inventory.filter(p => p.stock < 10);

  const updateStock = (id: string, amount: number) => {
    setInventory(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, stock: Math.max(0, p.stock + amount) };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-12 gap-8">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-8">Inventory Control</div>
          <h1 className="text-5xl lg:text-6xl font-heading font-black italic tracking-tighter uppercase leading-none">
            Manage <br/> <span className="not-italic font-sans text-sm tracking-[0.5em] font-bold opacity-40">Stock</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-[#1A1A1A]/5 p-1 flex">
             <button 
              onClick={() => setFilter('ALL')}
              className={cn(
                "px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                filter === 'ALL' ? "bg-[#1A1A1A] text-[#FDFCF8]" : "opacity-40 hover:opacity-100"
              )}
             >
               All Items
             </button>
             <button 
              onClick={() => setFilter('LOW')}
              className={cn(
                "px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                filter === 'LOW' ? "bg-[#1A1A1A] text-[#FDFCF8]" : "opacity-40 hover:opacity-100 text-red-600"
              )}
             >
               Low Stock
             </button>
           </div>
        </div>
      </header>

      <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10 overflow-hidden">
        <div className="bg-[#FDFCF8] p-6 lg:p-8 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.3em] opacity-40 border-b border-[#1A1A1A]/5">
          <div className="w-16">Product</div>
          <div className="flex-1 px-8">Name</div>
          <div className="w-32 hidden md:block">Category</div>
          <div className="w-48 text-center px-4">Price</div>
          <div className="w-32 text-center">Stock Level</div>
          <div className="w-48"></div>
        </div>

        {filtered.map((item) => (
          <div key={item.id} className="bg-[#FDFCF8] p-8 flex items-center justify-between group hover:bg-[#EAE8E2] transition-colors">
            <div className="w-16 h-20 bg-[#1A1A1A]/5 grayscale flex items-center justify-center overflow-hidden border border-[#1A1A1A]/5">
              <img src={item.images[0]} className="w-full h-full object-cover" alt="" />
            </div>
            
            <div className="flex-1 px-8 space-y-1">
              <h3 className="text-lg font-heading font-medium italic leading-none">{item.title}</h3>
              <p className="text-[10px] font-mono opacity-20 uppercase">PROP: {item.id}</p>
            </div>

            <div className="w-32 hidden md:block">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 italic">{item.category}</span>
            </div>

            <div className="w-48 text-center px-4 font-mono font-bold">
              {formatPrice(item.price).replace('Rs. ', '')}
            </div>

            <div className="w-32 flex flex-col items-center">
              <div className="flex items-center gap-2">
                 {item.stock < 10 && <AlertTriangle size={14} className="text-red-600" />}
                 <span className={cn(
                   "text-2xl font-bold tracking-tighter",
                   item.stock < 10 ? "text-red-700" : ""
                 )}>{item.stock}</span>
              </div>
              {item.stock < 10 && <span className="text-[8px] font-bold text-red-600 uppercase tracking-widest mt-1">Out of stock soon</span>}
            </div>

            <div className="w-48 flex justify-end gap-2">
              <div className="flex bg-[#1A1A1A]/5 border border-[#1A1A1A]/5">
                <button 
                  onClick={() => updateStock(item.id, -1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all border-r border-[#1A1A1A]/10"
                >
                  <ArrowDownRight size={14} />
                </button>
                <div className="w-10 h-10 flex items-center justify-center text-[10px] font-bold opacity-40">
                  Qty
                </div>
                <button 
                  onClick={() => updateStock(item.id, 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all"
                >
                  <ArrowUpRight size={14} />
                </button>
              </div>
              <button className="w-10 h-10 border border-[#1A1A1A]/10 flex items-center justify-center opacity-40 hover:opacity-100 transition-all">
                <Edit2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
