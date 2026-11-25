import { useState } from 'react';
import { Utensils } from 'lucide-react';

interface DishImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function DishImage({ src, alt, className = '' }: DishImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-stone-100 text-stone-500 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Utensils className="w-8 h-8 mb-2 text-stone-400" aria-hidden="true" />
        <span className="text-sm font-medium text-stone-600 line-clamp-2">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
