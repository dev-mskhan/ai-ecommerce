import React from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { useAppContext } from '@/store/context/AppContext';

interface Category { id: string; name: string; slug: string; }

interface ProductFiltersProps {
    categories: Category[];
    activeCategory: string | null;
    sortBy: string;
    minPrice: number;
    maxPrice: number;
    selectedRatings: number[];
    limit: number;
    isMobileOpen: boolean;
    onUpdateFilters: (updates: Record<string, string | number | null>) => void;
    onReset: () => void;
}

const FilterSection = ({ title, summary, children, isOpen, onToggle, alwaysShow = false }: any) => (
    <div className="space-y-4 text-left border-b border-[#1A1A1A]/5 pb-6 last:border-none">
        <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold text-[#1A1A1A]/30 uppercase tracking-[0.4em] font-sans">{title}</p>
            <span className="text-[8px] font-mono opacity-40 italic">{summary}</span>
        </div>
        <div className="relative">
            {!alwaysShow && (
                <button
                    onClick={onToggle}
                    className="w-full flex items-center justify-between py-1 text-sm font-medium italic transition-all cursor-pointer"
                >
                    <span className="uppercase text-[10px] font-bold tracking-widest">{summary || 'Select'}</span>
                    <ChevronDown size={12} className={cn("transition-transform duration-500", isOpen ? "rotate-180" : "")} />
                </button>
            )}
            {(isOpen || alwaysShow) && (
                <div className={cn("space-y-4", !alwaysShow ? "pt-4" : "")}>{children}</div>
            )}
        </div>
    </div>
);

export const ProductFilters: React.FC<ProductFiltersProps> = ({
    categories, activeCategory, sortBy, minPrice, maxPrice,
    selectedRatings, limit, isMobileOpen, onUpdateFilters, onReset,
}) => {
    const [isCategoryOpen, setIsCategoryOpen] = React.useState(false);
    const { setIsAiModalOpen } = useAppContext();
    const toggleRating = (r: number) => {
        const next = selectedRatings.includes(r)
            ? selectedRatings.filter(x => x !== r)
            : [...selectedRatings, r];
        onUpdateFilters({ rating: next.length > 0 ? next.join(',') : null });
    };

    return (
        <aside className={cn(
            "lg:w-72 space-y-12 flex-shrink-0 lg:block",
            isMobileOpen ? "block pb-12 border-b border-[#1A1A1A]/10" : "hidden"
        )}>
            <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#1A1A1A]/10">
                    <h3 className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.4em] flex items-center gap-3">
                        <SlidersHorizontal size={14} /> Filters
                    </h3>
                    <button onClick={onReset} className="text-[10px] text-[#1A1A1A]/40 font-bold uppercase tracking-widest hover:line-through">
                        Reset
                    </button>
                </div>

                <FilterSection
                    title="Sort"
                    summary={sortBy}
                    alwaysShow
                >
                    <CustomDropdown
                        value={sortBy}
                        onChange={(val) => onUpdateFilters({ sort: val })}
                        options={[
                            { label: 'Default', value: 'newest' },
                            { label: 'Price: Ascending', value: 'price_asc' },
                            { label: 'Price: Descending', value: 'price_desc' },
                            { label: 'Rating: Top', value: 'rating' },
                        ]}
                        className="w-full"
                    />
                </FilterSection>

                <FilterSection
                    title="Categories"
                    summary={activeCategory ? activeCategory.replace(/-/g, ' ') : 'All Products'}
                    isOpen={isCategoryOpen}
                    onToggle={() => setIsCategoryOpen(p => !p)}
                >
                    <div className="grid grid-cols-1 gap-1">
                        <Link
                            to="/products"
                            className={cn(
                                "block p-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A1A1A]/5 transition-all",
                                !activeCategory ? "bg-[#1A1A1A] text-white" : "opacity-60"
                            )}
                            onClick={() => setIsCategoryOpen(false)}
                        >
                            All Products
                        </Link>
                        {categories.map(cat => (
                            <Link
                                key={cat.id}
                                to={`/category/${cat.slug}`}
                                className={cn(
                                    "block p-2 text-[9px] font-bold uppercase tracking-widest hover:bg-[#1A1A1A]/5 transition-all text-left",
                                    activeCategory === cat.slug ? "bg-[#1A1A1A] text-white" : "opacity-50"
                                )}
                                onClick={() => setIsCategoryOpen(false)}
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </FilterSection>

                <FilterSection
                    title="Price Range"
                    summary={`RS. ${minPrice} — ${maxPrice >= 50000 ? '50K+' : maxPrice}`}
                    alwaysShow
                >
                    <div className="space-y-4 text-left">
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={minPrice}
                                onChange={(e) => onUpdateFilters({ minPrice: Number(e.target.value) })}
                                className="w-full bg-[#1A1A1A]/5 border-none p-2 text-[9px] font-mono font-bold outline-none"
                            />
                            <span className="opacity-20">—</span>
                            <input
                                type="number"
                                value={maxPrice}
                                onChange={(e) => onUpdateFilters({ maxPrice: Number(e.target.value) })}
                                className="w-full bg-[#1A1A1A]/5 border-none p-2 text-[9px] font-mono font-bold outline-none text-right"
                            />
                        </div>
                        <div className="relative h-px bg-[#1A1A1A]/10">
                            <input
                                type="range"
                                min="0" max="50000" step="500"
                                value={maxPrice}
                                onChange={(e) => onUpdateFilters({ maxPrice: Number(e.target.value) })}
                                className="absolute inset-0 w-full accent-[#1A1A1A] h-2 -top-1 appearance-none bg-transparent cursor-pointer z-10"
                            />
                        </div>
                    </div>
                </FilterSection>

                <FilterSection
                    title="Rating"
                    summary={selectedRatings.length > 0 ? `${Math.min(...selectedRatings)}.0+ Avg` : 'All Ratings'}
                    alwaysShow
                >
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                        {[4, 3, 2, 1].map(r => (
                            <button
                                key={r}
                                onClick={() => toggleRating(r)}
                                className={cn(
                                    "flex items-center justify-between p-3 border transition-all text-[10px] font-bold uppercase tracking-widest",
                                    selectedRatings.includes(r)
                                        ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
                                        : "border-[#1A1A1A]/10 opacity-60 hover:opacity-100"
                                )}
                            >
                                <span>{r}.0+ stars</span>
                                <span className="text-amber-600">★</span>
                            </button>
                        ))}
                    </div>
                </FilterSection>

                <FilterSection title="Number of Products" alwaysShow>
                    <div className="grid grid-cols-3 gap-2">
                        {[12, 24, 48].map(size => (
                            <button
                                key={size}
                                onClick={() => onUpdateFilters({ limit: size })}
                                className={cn(
                                    "p-3 border transition-all text-[10px] font-bold uppercase tracking-widest text-center",
                                    limit === size ? "bg-[#1A1A1A] border-[#1A1A1A] text-white" : "border-[#1A1A1A]/10 opacity-60"
                                )}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </FilterSection>
            </div>

            <div className="bg-[#1A1A1A] p-10 text-[#FDFCF8] relative overflow-hidden group">
                <div className="relative z-10">
                    <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40 mb-6 font-sans">Support</h4>
                    <p className="text-xl font-heading font-light italic leading-tight mb-8">Need help?</p>
                    <button onClick={() => setIsAiModalOpen(true)} className="w-full py-4 border border-white/20 text-white hover:bg-white hover:text-black text-[10px] uppercase font-bold tracking-widest transition-all">
                        Ask Assistant
                    </button>
                </div>
                <div className="absolute -right-8 -bottom-8 text-8xl opacity-10 group-hover:scale-110 transition-transform">🤖</div>
            </div>
        </aside>
    );
};