import React, { useMemo } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { useProducts } from '@store/hooks/useProduct';
import { useCategories, useCategoryBySlug } from '@store/hooks/useCategory';
import { ProductFilters } from '@/components/buyer/products/ProductFilters';
import { ProductGrid } from '@/components/buyer/products/ProductGrid';
import { ProductListingHeader } from '@/components/buyer/products/ProductListingHeader';
import { PageSkeleton } from '@/components/common/PageSkeleton';

export const ProductListingPage: React.FC = () => {
  const { category: categorySlug } = useParams(); // e.g. "electronics" or undefined
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);

  const sortBy = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || undefined;
  const maxPrice = searchParams.get('maxPrice') || undefined;
  const limit = searchParams.get('limit') || '12';
  const currentPage = searchParams.get('page') || '1';
  const ratingParam = searchParams.get('rating') || undefined;
  const searchQuery = searchParams.get('q') || undefined;

  const selectedRatings = ratingParam ? ratingParam.split(',').map(Number) : [];

  const { data: categoryData } = useCategoryBySlug(categorySlug);
  const categoryId = useMemo(() => categoryData?.data?._id, [categoryData]);

  const productParams = React.useMemo(() => ({
    ...(categoryId && { categoryId }),
    sort: sortBy,
    ...(minPrice && { minPrice }),
    ...(maxPrice && Number(maxPrice) < 50000 && { maxPrice }),
    ...(ratingParam && { rating: Math.min(...selectedRatings).toString() }),
    ...(searchQuery && { search: searchQuery }),
    page: currentPage,
    limit,
  }), [categoryId, sortBy, minPrice, maxPrice, ratingParam, searchQuery, currentPage, limit]);

  const { data, isLoading, isError } = useProducts(productParams);

  const { data: categoriesData } = useCategories();

  const rawProducts = useMemo(() => data?.data?.products ?? [], [data]);
  const totalCount = useMemo(() => data?.data?.total ?? 0, [data]);
  const totalPages = useMemo(() => data?.data?.totalPages ?? Math.ceil(totalCount / Number(limit)), [data]);

  // Calculate discount % and pass enriched products
  const products = useMemo(() => rawProducts.map((p: any) => ({
    ...p,
    discountPercent: p.discountPrice && p.price > p.discountPrice
      ? Math.round(((p.price - p.discountPrice) / p.price) * 100)
      : null,
  })), [rawProducts]);

  const updateFilters = (updates: Record<string, string | number | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 0) newParams.delete(key);
      else newParams.set(key, String(value));
    });
    if (!updates.page) newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleReset = () => {
    setSearchParams({});
    setIsMobileFiltersOpen(false);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
      <ProductListingHeader
        activeCategory={categorySlug ?? null}
        totalCount={totalCount}
        viewMode={viewMode}
        isMobileFiltersOpen={isMobileFiltersOpen}
        onViewModeChange={setViewMode}
        onToggleMobileFilters={() => setIsMobileFiltersOpen(p => !p)}
      />
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
        <ProductFilters
          categories={categoriesData?.data ?? []}
          activeCategory={categorySlug ?? null}
          sortBy={sortBy}
          minPrice={Number(minPrice) || 0}
          maxPrice={Number(maxPrice) || 50000}

          selectedRatings={selectedRatings}
          limit={Number(limit)}
          isMobileOpen={isMobileFiltersOpen}
          onUpdateFilters={updateFilters}
          onReset={handleReset}
        />
        <div className="flex-1">
          {(isLoading || isError) ? <PageSkeleton /> : <ProductGrid
            products={products}
            viewMode={viewMode}
            isLoading={isLoading}
            currentPage={Number(currentPage)}
            totalPages={totalPages}
            onPageChange={(page) => updateFilters({ page })}
            onReset={handleReset}
          />}
        </div>
      </div>
    </div>
  );
};