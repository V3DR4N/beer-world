export function useScrollRestoration() {
  const STORAGE_KEY = 'beerworld_scroll_state';

  /**
   * Save scroll position and page state to sessionStorage
   * @param {string} sourceRoute - The route we're saving from (e.g., '/discover', '/brewer/id')
   * @param {number} scrollPosition - Current window.scrollY value
   * @param {object} filters - Optional filters object (mood, searchQuery, etc.)
   */
  const saveScrollState = (sourceRoute, scrollPosition, filters = {}) => {
    const state = {
      sourceRoute,
      scrollPosition,
      discoveryFilters: filters,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  /**
   * Retrieve saved scroll state from sessionStorage
   * @returns {object|null} Saved state object or null if nothing saved
   */
  const restoreScrollState = () => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  };

  /**
   * Clear saved scroll state from sessionStorage
   */
  const clearScrollState = () => {
    sessionStorage.removeItem(STORAGE_KEY);
  };

  /**
   * Check if we should skip auto-scroll-to-top
   * @returns {boolean} true if we should restore scroll, false if we should scroll to top
   */
  const shouldRestoreScroll = () => {
    return sessionStorage.getItem(STORAGE_KEY) !== null;
  };

  return {
    saveScrollState,
    restoreScrollState,
    clearScrollState,
    shouldRestoreScroll,
  };
}
