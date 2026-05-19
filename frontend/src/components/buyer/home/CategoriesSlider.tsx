import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useCategories } from '@/store/hooks/useCategory';
import { PageSkeleton } from '@/components/common/PageSkeleton';

export const CategoriesSlider = () => {
    const { data, isLoading, isSuccess, isError } = useCategories();
    const categories = data?.data;
    return (
        <section className="overflow-hidden">
            <div className="flex items-baseline justify-between mb-10 pb-4">
                <h2 className="text-[20px] font-bold uppercase tracking-[0.5em] opacity-60">Categories</h2>
                <Link to='/categories' className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#1A1A1A] transition-all">
                    View All
                </Link>
            </div>
            <div className="relative group px-0">
                {(isLoading || isError) && <PageSkeleton />}
                <div className="flex gap-0 bg-[#1A1A1A]/10 border-x border-[#1A1A1A]/10 overflow-hidden">
                    <motion.div className="flex" animate={{ x: [0, -1200] }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}>
                        {isSuccess && categories?.map((cat, idx) => {
                            const catImages = cat.images;
                            return (
                                <Link to={`/category/${cat.slug}`} key={`${cat.id}-${idx}`} className="relative w-64 lg:w-80 aspect-[4/5] flex-shrink-0 bg-[#FDFCF8] group/item overflow-hidden border-r border-[#1A1A1A]/10 last:border-r-0">
                                    <img src={catImages[0]} alt={cat.name} className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${catImages?.length > 1 ? 'group-hover/item:opacity-0' : 'group-hover/item:opacity-80'} group-hover/item:scale-110`} />
                                    {catImages[1] && <img src={catImages[1]} alt={`${cat.name} alternate`} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover/item:opacity-100 scale-110 group-hover/item:scale-100 transition-all duration-1000" />}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover/item:translate-y-0 transition-all duration-500">
                                        <p className="text-[10px] font-bold text-[#FDFCF8] uppercase tracking-[0.4em] mb-2 drop-shadow-sm">{cat.name}</p>
                                        <div className="h-px w-0 group-hover/item:w-full bg-[#FDFCF8] transition-all duration-700" />
                                    </div>
                                    <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-[#1A1A1A]/10 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                </Link>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}