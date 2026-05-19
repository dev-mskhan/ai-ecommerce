import React from 'react';
import { AutoSizer } from 'react-virtualized-auto-sizer';
import { ProductCard } from '@/components/buyer/ProductCard';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/helpers';

interface ProductGridProps {
    products: any[];
    viewMode: 'grid' | 'list';
    isLoading: boolean;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onReset: () => void;
}

const COLUMN_COUNT = 3; // for grid mode
const ROW_HEIGHT = 420;
const CARD_GAP = 1;

export const ProductGrid: React.FC<ProductGridProps> = ({
    products, viewMode, isLoading, currentPage, totalPages, onPageChange, onReset,
}) => {
    if (isLoading) return (
        <div className={cn(
            "grid gap-8",
            viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2"
        )}>
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-[#FDFCF8] animate-pulse h-80" />
            ))}
        </div>
    );

    if (!products.length) return (
        <div className="py-32 text-center space-y-12 bg-[#1A1A1A]/5">
            <div className="space-y-4">
                <p className="text-4xl font-heading font-black italic tracking-tighter uppercase leading-none">No Results</p>
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40">Try changing your filters.</p>
            </div>
            <Button variant="outline" onClick={onReset}>Clear all filters</Button>
        </div>
    );

    // Use react-window only in grid mode with enough products
    const useVirtualized = viewMode === 'grid' && products.length > 20;
    const rowCount = Math.ceil(products.length / COLUMN_COUNT);

    return (
        <div className="space-y-16">
            {useVirtualized ? (
                <div className={cn(
                    "grid gap-8",
                    viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2"
                )}>
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className={cn(
                    "grid gap-8",
                    viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2"
                )}>
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-12 border-t border-[#1A1A1A]/10">
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-30">
                        Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-6 py-3 border border-[#1A1A1A]/10 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all disabled:opacity-20 cursor-pointer"
                        >
                            Prev
                        </button>
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => onPageChange(i + 1)}
                                    className={cn(
                                        "w-10 h-10 text-[10px] font-bold transition-all cursor-pointer",
                                        currentPage === i + 1 ? "bg-[#1A1A1A] text-[#FDFCF8]" : "hover:bg-[#1A1A1A]/5"
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-6 py-3 border border-[#1A1A1A]/10 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all disabled:opacity-20 cursor-pointer"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};