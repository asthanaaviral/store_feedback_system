import { useState } from 'react';

const StarRating = ({ value = 0, onChange, readOnly = false, size = 'md' }) => {
  const [hovered, setHovered] = useState(0);

  const sizeClass = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl';
  const current = hovered || value;

  const handleClick = (star) => {
    if (!readOnly && onChange) onChange(star);
  };

  return (
    <div className="flex items-center gap-0.5" id="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          className={`${sizeClass} transition-colors leading-none disabled:cursor-default ${
            readOnly ? '' : 'cursor-pointer hover:scale-110 transition-transform'
          }`}
          aria-label={`Rate ${star} out of 5`}
        >
          <span className={star <= current ? 'text-yellow-400' : 'text-slate-200'}>★</span>
        </button>
      ))}
      {value > 0 && (
        <span className="text-xs text-slate-500 ml-1">({value}/5)</span>
      )}
    </div>
  );
};

export default StarRating;
