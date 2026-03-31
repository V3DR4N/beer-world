import { renderStars } from '../../utils/ratingUtils';

export default function RatingDisplay({ averageRating, ratingCount, size = 'small' }) {
  const stars = renderStars(averageRating);
  const starSize = size === 'medium' ? '1rem' : '0.9rem';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginTop: '0.5rem',
        marginBottom: '0.5rem',
      }}
    >
      <span
        style={{
          fontSize: starSize,
          color: 'var(--accent-amber)',
          fontFamily: 'system-ui',
          letterSpacing: '-0.1em',
        }}
      >
        {stars.substring(0, Math.floor(averageRating))}
      </span>
      <span
        style={{
          fontSize: starSize,
          color: 'var(--border-medium)',
          fontFamily: 'system-ui',
          letterSpacing: '-0.1em',
        }}
      >
        {stars.substring(Math.floor(averageRating))}
      </span>
      <span
        style={{
          fontSize: '0.75rem',
          fontFamily: 'DM Sans',
          color: 'var(--text-muted)',
          marginLeft: '0.25rem',
        }}
      >
        {averageRating} ({ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'})
      </span>
    </div>
  );
}
