import { useState, useEffect } from 'react';
import { getRatingFromStorage, saveRatingToStorage, renderStars } from '../../utils/ratingUtils';

export default function RatingInput({ beerId, averageRating, ratingCount }) {
  const [userRating, setUserRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Load user's existing rating
    const saved = getRatingFromStorage(beerId);
    setUserRating(saved);
  }, [beerId]);

  const handleStarClick = (rating) => {
    saveRatingToStorage(beerId, rating);
    setUserRating(rating);
    setShowConfirmation(true);

    // Hide confirmation after 2 seconds
    setTimeout(() => {
      setShowConfirmation(false);
    }, 2000);
  };

  const displayRating = hoverRating || userRating || 0;
  const filledStars = Math.ceil(displayRating);
  const stars = Array(5)
    .fill(0)
    .map((_, i) => (i < filledStars ? '★' : '☆'));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        padding: '1.5rem',
        backgroundColor: 'var(--background-secondary)',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Title */}
      <p
        style={{
          fontSize: '0.875rem',
          fontFamily: 'DM Sans',
          color: 'var(--text-secondary)',
          margin: '0 0 0.5rem 0',
          textTransform: 'uppercase',
          fontWeight: '600',
        }}
      >
        Rate this beer
      </p>

      {/* Star Rating Input */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          fontSize: '1.5rem',
          cursor: 'pointer',
        }}
      >
        {[1, 2, 3, 4, 5].map((starValue) => (
          <span
            key={starValue}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(null)}
            style={{
              color:
                starValue <= displayRating ? 'var(--accent-amber)' : 'var(--border-medium)',
              transition: 'color 200ms ease',
              cursor: 'pointer',
            }}
          >
            {starValue <= displayRating ? '★' : '☆'}
          </span>
        ))}
      </div>

      {/* User Rating Label */}
      {userRating && !showConfirmation && (
        <p
          style={{
            fontSize: '0.875rem',
            fontFamily: 'DM Sans',
            color: 'var(--text-secondary)',
            margin: '0',
          }}
        >
          Your rating: {renderStars(userRating)} {userRating}
        </p>
      )}

      {/* Confirmation Message */}
      {showConfirmation && (
        <p
          style={{
            fontSize: '0.875rem',
            fontFamily: 'DM Sans',
            color: '#22C55E',
            margin: '0',
            fontWeight: '600',
          }}
        >
          Thanks for rating!
        </p>
      )}
    </div>
  );
}
