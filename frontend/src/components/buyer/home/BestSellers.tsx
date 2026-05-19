import { ProductCard } from '@/components/buyer/ProductCard';
import { Link } from 'react-router-dom';
import { useProducts } from '@/store/hooks/useProduct';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import { useMemo } from 'react';

export const BestSellers = () => {
    const { data, isSuccess, isLoading, isError } = useProducts({ limit: "5", sort: "rating", order: "desc" });
    const products = useMemo(() => data?.data?.products || [], [data]);
    return (
        <section>
            <div className="flex items-baseline justify-between mb-10 pb-4">
                <h2 className="text-[20px] font-bold uppercase tracking-[0.5em] opacity-60">Best Sellers</h2>
                <Link to='/category/all-items' className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#1A1A1A] transition-all">
                    View All
                </Link>
            </div>
            {(isLoading || isError) && <PageSkeleton />}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {isSuccess && products.map(product => {
                    if (product.discountPrice) {
                        const discount = Math.round(((product.price - product.discountPrice) / product.price) * 100);
                        return <ProductCard key={product._id} product={{ ...product, discount }} />
                    }
                })}
            </div>
        </section>
    );
}