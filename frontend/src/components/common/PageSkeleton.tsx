import React from 'react';

export const PageSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      <div className="h-64 bg-stone-100 rounded-3xl"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 4, 1, 2, 4].map((i, idx) => (
          <div key={idx} className="space-y-4">
            <div className="aspect-square bg-stone-100 rounded-2xl"></div>
            <div className="h-4 bg-stone-100 rounded w-2/3"></div>
            <div className="h-4 bg-stone-100 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
