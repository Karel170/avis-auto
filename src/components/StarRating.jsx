import { Star } from 'lucide-react';
import { cn } from '../lib/utils';

export default function StarRating({ rating, size = 'sm', showNumber = false }) {
  const sizes = { xs: 'w-3 h-3', sm: 'w-4 h-4', md: 'w-5 h-5' };
  const iconSize = sizes[size] || sizes.sm;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(iconSize, star <= rating ? 'text-amber-400' : 'text-slate-700')}
          fill={star <= rating ? 'currentColor' : 'none'}
        />
      ))}
      {showNumber && (
        <span className="text-sm font-medium text-slate-300 ml-1">{rating}/5</span>
      )}
    </div>
  );
}
