import React from 'react';
import { AlertTriangle, Star, Eye, Trash2 } from 'lucide-react';
import { cn, formatPrice } from '@/utils/helpers';
import { useGetAllProductsQuery, useAdminDeleteProductMutation, useToggleFeaturedProductMutation } from '@store/api/productApi';

export const AdminInventoryPage: React.FC = () => {
    const [page, setPage] = React.useState(1);
    const { data, isLoading, isFetching } = useGetAllProductsQuery({ page: String(page), limit: '20' });
    const [adminDelete] = useAdminDeleteProductMutation();
    const [toggleFeatured] = useToggleFeaturedProductMutation();

    const products: any[] = data?.data?.products ?? [];
    const totalPages: number = data?.data?.totalPages ?? 1;
    const total: number = data?.data?.total ?? 0;

    const handleDelete = async (id: string) => {
        if (!window.confirm('Remove this product permanently?')) return;
        try { await adminDelete(id).unwrap(); } catch { }
    };

    const handleFeature = async (id: string) => {
        try { await toggleFeatured(id).unwrap(); } catch { }
    };

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-10 gap-8">
                <div>
                    <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-6">Product Management</div>
                    <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
                        Inventory <br /> <span className="not-italic font-sans text-xs tracking-[0.5em] font-bold opacity-40">All Products</span>
                    </h1>
                </div>
                <div className="text-[10px] font-mono opacity-40">{total} products total</div>
            </header>

            {isLoading || isFetching ? (
                <div className="text-[10px] font-mono opacity-30 py-10">Loading inventory...</div>
            ) : (
                <>
                    <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10 overflow-hidden">
                        <div className="bg-[#FDFCF8] p-6 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.3em] opacity-40 border-b border-[#1A1A1A]/5">
                            <div className="w-16">Image</div>
                            <div className="flex-1 px-8">Product / Vendor</div>
                            <div className="w-32 hidden md:block">Category</div>
                            <div className="w-24 text-right">Price</div>
                            <div className="w-24 text-center">Stock</div>
                            <div className="w-24 text-center">Featured</div>
                            <div className="w-40"></div>
                        </div>

                        {products.map((item: any) => (
                            <div key={item._id} className="bg-[#FDFCF8] p-6 flex items-center justify-between group hover:bg-[#EAE8E2] transition-colors">
                                <div className="w-16 h-20 bg-[#1A1A1A]/5 grayscale flex items-center justify-center overflow-hidden border border-[#1A1A1A]/5">
                                    {item.images?.[0] && <img src={item.images[0]} className="w-full h-full object-cover" alt={item.name} />}
                                </div>

                                <div className="flex-1 px-8 space-y-1">
                                    <h3 className="text-base font-heading font-medium italic leading-none">{item.name}</h3>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 italic">
                                        {item.vendor?.storeName ?? item.vendor?.name ?? '—'}
                                    </p>
                                </div>

                                <div className="w-32 hidden md:block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                                        {item.category?.name ?? '—'}
                                    </span>
                                </div>

                                <div className="w-24 text-right font-mono font-bold text-sm">
                                    {formatPrice(item.discountPrice ?? item.price).replace('Rs. ', '')}
                                </div>

                                <div className="w-24 flex justify-center items-center gap-2">
                                    <span className={cn(
                                        "font-bold tracking-tighter text-lg",
                                        (item.stock ?? 0) < 10 ? "text-red-700" : ""
                                    )}>{item.stock ?? 0}</span>
                                    {(item.stock ?? 0) < 10 && <AlertTriangle size={12} className="text-red-600" />}
                                </div>

                                <div className="w-24 text-center">
                                    <span className={cn(
                                        "text-[9px] font-bold uppercase tracking-widest",
                                        item.isFeatured ? "text-amber-600" : "opacity-20"
                                    )}>
                                        {item.isFeatured ? 'YES' : 'NO'}
                                    </span>
                                </div>

                                <div className="w-40 flex justify-end gap-2">
                                    <button
                                        onClick={() => handleFeature(item._id)}
                                        title={item.isFeatured ? 'Unfeature' : 'Feature'}
                                        className={cn(
                                            "w-10 h-10 border flex items-center justify-center transition-all",
                                            item.isFeatured
                                                ? "border-amber-400/30 text-amber-600 opacity-100 hover:bg-amber-600 hover:text-white"
                                                : "border-[#1A1A1A]/10 opacity-40 hover:opacity-100 hover:bg-[#1A1A1A] hover:text-[#FDFCF8]"
                                        )}
                                    >
                                        <Star size={14} />
                                    </button>
                                    <button className="w-10 h-10 border border-[#1A1A1A]/10 flex items-center justify-center opacity-40 hover:opacity-100 transition-all">
                                        <Eye size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="w-10 h-10 border border-red-600/10 text-red-600 flex items-center justify-center opacity-20 hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {products.length === 0 && (
                            <div className="bg-[#FDFCF8] p-12 text-center text-[10px] font-mono opacity-30">No products found.</div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4">
                            <span className="text-[10px] font-mono opacity-40">{total} products</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 text-[9px] font-bold uppercase tracking-widest border border-[#1A1A1A]/10 disabled:opacity-20 hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all"
                                >Prev</button>
                                <span className="px-4 py-2 text-[9px] font-mono opacity-40">Page {page} / {totalPages}</span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 text-[9px] font-bold uppercase tracking-widest border border-[#1A1A1A]/10 disabled:opacity-20 hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all"
                                >Next</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};