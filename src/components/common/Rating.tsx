import React, { useState, useRef, useEffect } from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  initialRating?: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  onChange?: (rating: number) => void;
}

const Rating: React.FC<RatingProps> = ({
  initialRating = 0,
  maxRating = 10,
  size = 'md',
  readonly = false,
  onChange,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleClick = (value: number) => {
    if (!readonly) {
      setRating(value);
      onChange?.(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (!readonly) {
      setHoverRating(value);
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
    setIsHovering(false);
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const displayRating = isHovering ? hoverRating : rating;

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-1"
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: maxRating }, (_, i) => i + 1).map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => handleClick(value)}
          onMouseEnter={() => handleMouseEnter(value)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer'} focus:outline-none`}
          disabled={readonly}
        >
          <Star
            className={`${sizeClasses[size]} transition-colors ${
              value <= displayRating
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">
        {displayRating.toFixed(1)}
      </span>
    </div>
  );
};

export default Rating;