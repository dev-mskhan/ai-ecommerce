import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Loader2, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatPrice, cn } from '@/utils/helpers';
import {
  useGetVendorProductsQuery,
  useDeleteProductMutation,
  useToggleProductStatusMutation,
} from '@/store/api/productApi';

export const VendorProductsPage: React.FC = () => {
  const [search, setSearch] = React.useState('');
  const { data, isLoading, isError } = useGetVendorProductsQuery();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();
  const [toggleStatus] = useToggleProductStatusMutation();

  const products = (data?.data?.products ?? []).filter((p: any) =>
    p.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id);
  };

  const handleToggle = async (id: string) => {
    await toggleStatus(id);
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-10 gap-6">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-6">Inventory Management</div>
          <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
            All <br />
            <span className="not-italic font-sans text-xs tracking-[0.5em] font-bold opacity-40">Products</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30" size={14} />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-5 py-3 bg-[#1A1A1A]/5 border-none text-[10px] font-bold uppercase tracking-widest outline-none w-52"
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

      {isLoading ? (
        <div className="flex justify-center p-16">
          <Loader2 className="animate-spin opacity-30" size={28} />
        </div>
      ) : isError ? (
        <div className="flex items-center gap-3 text-red-600 p-8">
          <AlertCircle size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">Failed to load products</span>
        </div>
      ) : (
        <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10 overflow-hidden">
          {/* Header row */}
          <div className="bg-[#FDFCF8] p-5 lg:p-7 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.3em] opacity-40 border-b border-[#1A1A1A]/5">
            <div className="w-14">Image</div>
            <div className="flex-1 px-6">Name</div>
            <div className="w-28 hidden md:block">Category</div>
            <div className="w-22 text-right">Price</div>
            <div className="w-20 text-center">Stock</div>
            <div className="w-20 text-center">Active</div>
            <div className="w-44" />
          </div>

          {products.length === 0 ? (
            <div className="bg-[#FDFCF8] p-12 text-center text-[10px] font-bold uppercase tracking-widest opacity-30">
              No products found
            </div>
          ) : (
            products.map((product: any) => (
              <div
                key={product._id}
                className="bg-[#FDFCF8] p-7 flex items-center justify-between group hover:bg-[#EAE8E2] transition-colors"
              >
                {/* Image */}
                <div className="w-14 h-16 bg-[#1A1A1A]/5 grayscale flex items-center justify-center overflow-hidden border border-[#1A1A1A]/5 flex-shrink-0">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <span className="text-[8px] opacity-20">NO IMG</span>
                  )}
                </div>

                {/* Name */}
                <div className="flex-1 px-6 space-y-1 min-w-0">
                  <h3 className="text-base font-heading font-medium italic leading-none truncate">{product.name}</h3>
                  <p className="text-[10px] font-mono opacity-20 uppercase truncate">ID: {product._id?.slice(-8)}</p>
                </div>

                {/* Category */}
                <div className="w-28 hidden md:block flex-shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 italic">
                    {product.category?.name ?? '—'}
                  </span>
                </div>

                {/* Price */}
                <div className="w-22 text-right font-mono font-bold text-sm flex-shrink-0">
                  {formatPrice(product.price).replace('Rs. ', '')}
                </div>

                {/* Stock */}
                <div className="w-20 text-center flex-shrink-0">
                  <span
                    className={cn(
                      'font-bold tracking-tighter text-base',
                      (product.stock ?? 0) < 10 ? 'text-red-700' : '',
                    )}
                  >
                    {product.stock ?? 0}
                  </span>
                </div>

                {/* Active toggle */}
                <div className="w-20 flex justify-center flex-shrink-0">
                  <button
                    onClick={() => handleToggle(product._id)}
                    className="text-[#1A1A1A]/30 hover:text-[#1A1A1A] transition-colors"
                    title={product.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {product.isActive ? <ToggleRight size={20} className="text-green-600" /> : <ToggleLeft size={20} />}
                  </button>
                </div>

                {/* Actions */}
                <div className="w-44 flex justify-end gap-2 flex-shrink-0">
                  <Link to={`/vendor/products/edit/${product._id}`}>
                    <button className="w-10 h-10 border border-[#1A1A1A]/10 flex items-center justify-center opacity-40 hover:opacity-100 hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all">
                      <Edit size={13} />
                    </button>
                  </Link>
                  <Link to={`/products/slug/${product.slug}`} target="_blank">
                    <button className="w-10 h-10 border border-[#1A1A1A]/10 flex items-center justify-center opacity-40 hover:opacity-100 transition-all">
                      <Eye size={13} />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    disabled={deleting}
                    className="w-10 h-10 border border-red-600/10 text-red-600 flex items-center justify-center opacity-30 hover:opacity-100 transition-all disabled:opacity-20"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination hint */}
      {data?.data?.totalPages > 1 && (
        <p className="text-[9px] font-mono opacity-30 uppercase tracking-widest text-right">
          Page {data.data.page} of {data.data.totalPages} · {data.data.total} total
        </p>
      )}
    </div>
  );
};
