import { Trash2, ShoppingCart } from 'lucide-react';
import { products } from '@/mock/products';
import { ProductCard } from '@/components/buyer/ProductCard';

export const WishlistTab = () => {
    const wishlist = products.slice(0, 3);
    return (
        <section className="space-y-12">
            <div className="flex items-baseline justify-between border-b border-[#1A1A1A]/10 pb-4">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Your Wishlist</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
                {wishlist.map((product) => (
                    <div key={product.id} className="bg-[#FDFCF8] relative group">
                        <ProductCard product={product} />
                        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-3 bg-[#1A1A1A] text-[#FDFCF8] hover:bg-red-600 transition-all"><Trash2 size={16} /></button>
                            <button className="p-3 bg-[#FDFCF8] text-[#1A1A1A] border border-[#1A1A1A]/10 hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all"><ShoppingCart size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};