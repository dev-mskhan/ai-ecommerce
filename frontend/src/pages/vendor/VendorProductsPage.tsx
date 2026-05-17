import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { products } from '@/mock/products';
import { Button } from '@/components/ui/Button';
import { formatPrice, cn } from '@/utils/helpers';

export const VendorProductsPage: React.FC = () => {
  // Only show products from the "TechZone" vendor (mocked)
  const vendorProducts = products.filter(p => p.vendor.name === 'TechZone');

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-12 gap-8">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-8">Inventory Management</div>
          <h1 className="text-5xl lg:text-6xl font-heading font-black italic tracking-tighter uppercase leading-none">
            All <br/> <span className="not-italic font-sans text-sm tracking-[0.5em] font-bold opacity-40">Products</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30" size={16} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="pl-12 pr-6 py-3 bg-[#1A1A1A]/5 border-none text-sm focus:ring-1 focus:ring-[#1A1A1A]/20 transition-all w-64 uppercase tracking-widest font-bold text-[10px]"
            />
          </div>
          <Link to="/vendor/products/add">
            <Button className="flex items-center gap-2">
              <Plus size={14} />
              Add New
            </Button>
          </Link>
        </div>
      </header>

      <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10 overflow-hidden">
        <div className="bg-[#FDFCF8] p-6 lg:p-8 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.3em] opacity-40 border-b border-[#1A1A1A]/5">
          <div className="w-16">Image</div>
          <div className="flex-1 px-8">Product Name</div>
          <div className="w-32 hidden md:block">Category</div>
          <div className="w-24 text-right">Price</div>
          <div className="w-24 text-center">Stock</div>
          <div className="w-24 text-center">Featured</div>
          <div className="w-48"></div>
        </div>

        {vendorProducts.map((product) => (
          <div key={product.id} className="bg-[#FDFCF8] p-8 flex items-center justify-between group hover:bg-[#EAE8E2] transition-colors">
            <div className="w-16 h-20 bg-[#1A1A1A]/5 grayscale flex items-center justify-center overflow-hidden border border-[#1A1A1A]/5">
              <img src={product.images[0]} className="w-full h-full object-cover" alt="" />
            </div>
            
            <div className="flex-1 px-8 space-y-1">
              <h3 className="text-lg font-heading font-medium italic leading-none">{product.title}</h3>
              <p className="text-[10px] font-mono opacity-20 uppercase">PROP: {product.id}</p>
            </div>

            <div className="w-32 hidden md:block">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 italic">{product.category}</span>
            </div>

            <div className="w-24 text-right font-mono font-bold">
              {formatPrice(product.price).replace('Rs. ', '')}
            </div>

            <div className="w-24 text-center">
              <span className={cn(
                "font-bold tracking-tighter text-lg",
                product.stock < 10 ? "text-red-700" : ""
              )}>{product.stock}</span>
            </div>

            <div className="w-24 flex justify-center">
               <div className={cn(
                 "w-4 h-4 border-2 transition-all",
                 product.isNew ? "bg-[#1A1A1A] border-[#1A1A1A]" : "border-[#1A1A1A]/10"
               )}></div>
            </div>

            <div className="w-48 flex justify-end gap-2">
              <Link to={`/vendor/products/add?id=${product.id}`}>
                <button className="w-11 h-11 border border-[#1A1A1A]/10 flex items-center justify-center opacity-40 hover:opacity-100 hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all">
                  <Edit size={14} />
                </button>
              </Link>
              <button className="w-11 h-11 border border-[#1A1A1A]/10 flex items-center justify-center opacity-40 hover:opacity-100 transition-all">
                <Eye size={14} />
              </button>
              <button className="w-11 h-11 border border-red-600/10 text-red-600 flex items-center justify-center opacity-20 hover:opacity-100 transition-all">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
