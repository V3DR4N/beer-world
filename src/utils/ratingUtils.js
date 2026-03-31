/**
 * Utility functions for the star rating system
 */

/**
 * Render stars based on a rating (e.g., 4.2 → ★★★★☆)
 * @param {number} rating - Average rating (1-5)
 * @returns {string} - Filled and empty stars
 */
export function renderStars(rating) {
  const filledCount = Math.floor(rating);
  const emptyCount = 5 - filledCount;

  const filledStars = '★'.repeat(filledCount);
  const emptyStars = '☆'.repeat(emptyCount);

  return filledStars + emptyStars;
}

/**
 * Get the user's rating for a beer from localStorage
 * @param {string} beerId - Beer ID
 * @returns {number|null} - User's rating (1-5) or null if not rated
 */
export function getRatingFromStorage(beerId) {
  try {
    const ratings = JSON.parse(localStorage.getItem('beerworld_ratings') || '{}');
    return ratings[beerId] || null;
  } catch {
    return null;
  }
}

/**
 * Save user's rating for a beer to localStorage
 * @param {string} beerId - Beer ID
 * @param {number} rating - User's rating (1-5)
 */
export function saveRatingToStorage(beerId, rating) {
  try {
    const ratings = JSON.parse(localStorage.getItem('beerworld_ratings') || '{}');
    ratings[beerId] = rating;
    localStorage.setItem('beerworld_ratings', JSON.stringify(ratings));
  } catch (err) {
    console.error('Error saving rating:', err);
  }
}

/**
 * Check if user is logged in
 * @returns {boolean} - True if user has a session
 */
export function isUserLoggedIn() {
  return !!localStorage.getItem('beerworld_session');
}

/**
 * Format average rating display (e.g., "★★★★☆ 4.2 (47 ratings)")
 * @param {number} averageRating - Average rating (1-5)
 * @param {number} ratingCount - Number of ratings
 * @returns {string} - Formatted rating string
 */
export function formatRatingDisplay(averageRating, ratingCount) {
  const stars = renderStars(averageRating);
  return `${stars} ${averageRating} (${ratingCount} ${ratingCount === 1 ? 'rating' : 'ratings'})`;
}
