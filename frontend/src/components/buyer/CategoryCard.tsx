import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface Category {
    name: string;
    slug: string;
    images: string[];
}

interface CategoryCardProps {
    category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
    const [current, setCurrent] = useState(0);
    const hasMultiple = category.images?.length > 1;

    useEffect(() => {
        if (!hasMultiple) return;

        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % category.images.length);
        }, 4000);

        return () => clearInterval(timer);
    }, [hasMultiple, category.images.length]);

    return (
        <Link
            to={`/category/${category.slug}`}
            className="group flex flex-col items-start justify-between min-h-[450px] relative overflow-hidden bg-[#EAE8E2] border border-[#1A1A1A]/5"
        >
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={current}
                        src={category.images[current]}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                        className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
                    />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent opacity-60" />
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>

            <div className="relative z-10 w-full p-8 lg:p-12 flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    {hasMultiple && (
                        <div className="flex gap-1 mt-2">
                            {category.images.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "h-[1px] transition-all duration-500",
                                        idx === current ? "w-4 bg-white" : "w-1 bg-white/20"
                                    )}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <span className="text-[10px] font-bold text-white/20 group-hover:text-white/80 transition-colors">
                    0{current + 1} / 0{category.images.length}
                </span>
            </div>
            <div className="relative z-10 w-full p-8 lg:p-12">
                <h2 className="text-4xl lg:text-5xl font-heading font-black italic text-white tracking-tighter leading-none mb-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    {category.name}
                </h2>

                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-100">
                    <div className="w-10 h-10 rounded-none border border-white/20 flex items-center justify-center text-white bg-white/5 hover:bg-white hover:text-[#1A1A1A] transition-all duration-300">
                        <ChevronRight size={18} />
                    </div>
                    <span className="text-[12px] font-black uppercase tracking-[0.3em] text-white/80 font-mono">
                        View Collection
                    </span>
                </div>
            </div>

            {/* Aesthetic Border Frame */}
            <div className="absolute inset-0 border border-white/5 group-hover:border-white/20 transition-colors pointer-events-none" />
        </Link>
    );
};