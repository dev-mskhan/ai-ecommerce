import React from 'react';
import { Link } from 'react-router-dom'
import { useCategories } from '@/store/hooks/useCategory';
import { CategoryCard } from '@/components/buyer/CategoryCard';
import { PageSkeleton } from '@/components/common/PageSkeleton';

export const CategoryListingPage: React.FC = () => {
  const { data, isSuccess, isLoading, error } = useCategories();
  const categories = data?.data;
  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 lg:py-15">
      <header className="flex justify-between items-baseline mb-15 pb-8">
        <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
          Featured Categories <br />
        </h1>
        <div className="text-[10px] tracking-[0.4em] font-bold uppercase opacity-40 hidden md:block">
          {new Date().getFullYear()} Collection
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
        {(isLoading || error) && <PageSkeleton />}
        {isSuccess && categories.map((cat) => {
          return <CategoryCard key={cat._id} category={cat} />
        })}
      </div>

      <footer className="mt-15 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-6 text-[10px] font-bold tracking-[0.3em] uppercase opacity-40 max-w-sm leading-relaxed">
          The Shop Rift represents a permanent record of our curated selections. Each category is very carefully selected.
        </div>
        <div className="md:col-span-6 flex justify-end">
          <Link to="/" className="text-[10px] font-bold tracking-[0.3em] uppercase hover:underline">
            Return to Home
          </Link>
        </div>
      </footer>
    </div>
  );
};
