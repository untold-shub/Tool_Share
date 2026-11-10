import { Star } from 'lucide-react';

export default function StarRating({ value = 0, onChange, size = 18, readOnly = false }) {
  return (
    <div className="star-rating" role={readOnly ? 'img' : 'radiogroup'} aria-label={`Rating: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          className="star-btn"
          onClick={() => onChange && onChange(star)}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            size={size}
            className={star <= Math.round(value) ? 'star-filled' : 'star-empty'}
            fill={star <= Math.round(value) ? 'currentColor' : 'none'}
          />
        </button>
      ))}
    </div>
  );
}
