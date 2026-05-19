import React from 'react';
import { Link } from 'react-router-dom';
import { Filter, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface ProductListingHeaderProps {
    activeCategory: string | null;
    totalCount: number;
    viewMode: 'grid' | 'list';
    isMobileFiltersOpen: boolean;
    onViewModeChange: (mode: 'grid' | 'list') => void;
    onToggleMobileFilters: () => void;
}

export const ProductListingHeader: React.FC<ProductListingHeaderProps> = ({
    activeCategory, totalCount, viewMode, isMobileFiltersOpen,
    onViewModeChange, onToggleMobileFilters,
}) => (
    <header className="flex flex-col md:flex-row justify-between items-start mb-16 border-b border-[#1A1A1A]/10 pb-12 gap-8">
        <div>
            <nav className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A1A1A]/40 mb-8 overflow-x-auto whitespace-nowrap pb-2 text-left">
                <Link to="/" className="hover:text-[#1A1A1A] hover:line-through">Home</Link>
                <span className="opacity-20">/</span>
                <Link to="/categories" className="hover:text-[#1A1A1A] hover:line-through">Categories</Link>
                {activeCategory && (
                    <>
                        <span className="opacity-20">/</span>
                        <span className="text-[#1A1A1A] uppercase">{activeCategory.replace(/-/g, ' ')}</span>
                    </>
                )}
            </nav>
            <div className="flex items-baseline gap-6">
                <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
                    {activeCategory ? activeCategory.replace(/-/g, ' ') : 'Products'}
                </h1>
                <span className="text-[10px] font-mono opacity-30 italic">[{totalCount} items]</span>
            </div>
        </div>

        <div className="flex items-center gap-8 w-full md:w-auto">
            <button
                onClick={onToggleMobileFilters}
                className="lg:hidden flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#1A1A1A] text-[#FDFCF8] text-[10px] font-bold uppercase tracking-widest"
            >
                <Filter size={14} />
                {isMobileFiltersOpen ? 'Close Filters' : 'Filters'}
            </button>

            <div className="flex bg-[#1A1A1A]/5 p-1">
                <button
                    onClick={() => onViewModeChange('grid')}
                    className={cn("p-3 transition-all cursor-pointer", viewMode === 'grid' ? "bg-white text-[#1A1A1A] shadow-sm" : "text-[#1A1A1A]/30")}
                >
                    <LayoutGrid size={16} />
                </button>
                <button
                    onClick={() => onViewModeChange('list')}
                    className={cn("p-3 transition-all cursor-pointer", viewMode === 'list' ? "bg-white text-[#1A1A1A] shadow-sm" : "text-[#1A1A1A]/30")}
                >
                    <List size={16} />
                </button>
            </div>
        </div>
    </header>
);