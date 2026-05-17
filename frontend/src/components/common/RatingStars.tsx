import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({ rating, count, size = 16 }) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={cn(
              'fill-current',
              i <= Math.round(rating) ? 'text-amber-400' : 'text-stone-200'
            )}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-stone-500">({count})</span>
      )}
    </div>
  );
};
