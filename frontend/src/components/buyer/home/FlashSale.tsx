import { Zap } from 'lucide-react';
import { ProductCard } from '@/components/buyer/ProductCard';
import { Button } from '@/components/ui/Button';
import { useProducts } from '@/store/hooks/useProduct';
import { Link } from 'react-router-dom';

export const FlashSale = () => {
    const { data, isLoading, isSuccess } = useProducts({ limit: "6", sort: "rating" });
    console.log(data);
    const products = data?.data?.products;
    return (
        <section>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-3 lg:sticky top-40">
                    <div className="flex items-center gap-2 text-red-600 mb-6">
                        <Zap size={20} className="fill-current" />
                        <span className="text-[10px] font-bold tracking-[0.4em] uppercase">Limited Time</span>
                    </div>
                    <h2 className="text-6xl font-heading font-black italic tracking-tighter mb-8 leading-none uppercase">Flash <br /> Sale</h2>
                    <div className="flex gap-1 mb-12">
                        {['12', '31', '26'].map((t, idx) => (
                            <div key={idx} className="bg-[#1A1A1A] text-[#FDFCF8] px-4 py-3 flex flex-col items-center justify-center font-mono">
                                <span className="text-2xl font-bold leading-none">{t}</span>
                            </div>
                        ))}
                    </div>
                    <Link to="/category/all-items">
                        <Button variant="outline" className="w-full">View All Deals</Button>
                    </Link>
                </div>
                <div className="lg:col-span-9">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {isSuccess && products?.map(product => {
                            const discount = Math.round(((product.price - product.discountPrice) / product.price) * 100);
                            if (discount > 0) {
                                return <ProductCard key={product._id} product={{ ...product, discount }} />
                            }
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}