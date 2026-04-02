import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { useBasket } from '../hooks/useBasket';
import { useScrollRestoration } from '../hooks/useScrollRestoration';
import beers from '../data/beers.json';
import brewers from '../data/brewers.json';
import quizConfig from '../data/quizConfig.json';
import SearchBar from '../components/ui/SearchBar';
import RatingDisplay from '../components/ui/RatingDisplay';


const MOOD_LABELS = {
  'light-and-fruity': 'Light & Fruity',
  'easy-drinking': 'Easy Drinking',
  'adventurous': 'Adventurous',
  'rich-and-complex': 'Rich & Complex',
  'sophisticated': 'Sophisticated',
  'special-occasion': 'Special Occasion',
  'everyday': 'Everyday',
};

const ALL_MOODS = [
  'light-and-fruity',
  'easy-drinking',
  'adventurous',
  'rich-and-complex',
  'sophisticated',
];

export default function DiscoveryPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useBasket();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedMood, setSelectedMood] = useState(null);
  const [profileName, setProfileName] = useState('Friend');
  const [profileId, setProfileId] = useState(null);
  const [hasQuizProfile, setHasQuizProfile] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());
  const [recentlyAddedBeers, setRecentlyAddedBeers] = useState(new Set());
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Load profile from cookie
  useEffect(() => {
    const profileCookie = Cookies.get('beerworld_profile');
    if (profileCookie) {
      try {
        const profile = JSON.parse(profileCookie);
        setProfileName(profile.name);
        setProfileId(profile.id);
        setHasQuizProfile(true);
      } catch (e) {
        console.error('Error parsing profile cookie:', e);
        setHasQuizProfile(false);
      }
    } else {
      setHasQuizProfile(false);
    }
  }, []);

  // Restore scroll position and filters when coming back from beer detail
  useEffect(() => {
    const { restoreScrollState, clearScrollState } = useScrollRestoration();
    const restored = restoreScrollState();

    if (restored && restored.sourceRoute === '/discover') {
      // Restore mood filter
      if (restored.discoveryFilters.mood) {
        setSelectedMood(restored.discoveryFilters.mood);
      }
      // Restore search query
      if (restored.discoveryFilters.searchQuery) {
        setSearchQuery(restored.discoveryFilters.searchQuery);
      }
      // Restore scroll position
      setTimeout(() => {
        window.scrollTo(0, restored.scrollPosition);
        // Clear the saved state after restoring so future navigations scroll to top
        clearScrollState();
      }, 100);
    }
  }, []);

  // Update URL when search changes
  useEffect(() => {
    if (searchQuery) {
      setSearchParams({ q: searchQuery });
    } else {
      setSearchParams({});
    }
  }, [searchQuery, setSearchParams]);

  // Get profile moods from cookie for initial filtering
  const getProfileMoods = () => {
    const profileCookie = Cookies.get('beerworld_profile');
    if (profileCookie) {
      try {
        const profile = JSON.parse(profileCookie);
        // Map profile IDs to their dominant moods
        const profileMoods = {
          'explorer': ['adventurous', 'sophisticated'],
          'easy-drinker': ['easy-drinking', 'everyday', 'light-and-fruity'],
          'connoisseur': ['sophisticated', 'rich-and-complex', 'special-occasion'],
        };
        return profileMoods[profile.id] || [];
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  // Filter beers
  const filteredBeers = useMemo(() => {
    let result = [...beers];

    // If no mood filter selected, filter by profile moods on initial load
    if (!selectedMood && searchQuery === '') {
      const profileMoods = getProfileMoods();
      if (profileMoods.length > 0) {
        result = result.filter((beer) =>
          beer.moods.some((mood) => profileMoods.includes(mood))
        );
      }
    }

    // Filter by selected mood pill
    if (selectedMood) {
      result = result.filter((beer) => beer.moods.includes(selectedMood));
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((beer) => {
        const brewer = brewers.find((b) => b.id === beer.brewerId);
        const brewerName = brewer?.name.toLowerCase() || '';
        return (
          beer.name.toLowerCase().includes(query) ||
          beer.style.toLowerCase().includes(query) ||
          brewerName.includes(query)
        );
      });
    }

    return result;
  }, [selectedMood, searchQuery]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleAddToBasket = (e, beer) => {
    e.stopPropagation();
    addItem(
      beer.id,
      beer.breweryName,
      beer.name,
      beer.price,
      beer.style
    );
    setRecentlyAddedBeers(prev => new Set([...prev, beer.id]));
    setNotificationMessage(`${beer.name} added to cart`);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setTimeout(() => setRecentlyAddedBeers(prev => {
        const newSet = new Set(prev);
        newSet.delete(beer.id);
        return newSet;
      }), 300);
    }, 2000);
  };

  const handleBeerClick = (beer) => {
    const { saveScrollState } = useScrollRestoration();
    saveScrollState('/discover', window.scrollY, {
      mood: selectedMood,
      searchQuery: searchQuery,
    });
    navigate(`/brewer/${beer.brewerId}?from=discover&beerId=${beer.id}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleMoodClick = (mood) => {
    setSelectedMood(selectedMood === mood ? null : mood);
  };

  const getBrewer = (brewerId) => {
    return brewers.find((b) => b.id === brewerId);
  };

  return (
    <div style={{ backgroundColor: 'var(--background-primary)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          padding: '3rem 2rem',
          backgroundColor: 'var(--background-secondary)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          {/* STATE 1: No Quiz Taken */}
          {!hasQuizProfile ? (
            <>
              {/* Heading */}
              <h1 style={{
                fontSize: '2.75rem',
                fontFamily: 'Bebas Neue',
                color: 'var(--accent-amber)',
                margin: '0 0 1rem 0',
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}>
                Welcome to Beer World
              </h1>

              {/* Subtitle */}
              <p style={{
                fontSize: '1.125rem',
                fontFamily: 'DM Sans',
                color: 'var(--accent-cream)',
                margin: '0 0 2rem 0',
              }}>
                Discover the world of craft beer.
              </p>

              {/* Quiz Invitation Block */}
              <div style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '2rem',
                marginTop: '1rem',
              }}>
                <p style={{
                  fontSize: '0.875rem',
                  fontFamily: 'DM Sans',
                  color: 'var(--text-secondary)',
                  margin: '0 0 1rem 0',
                }}>
                  Not sure where to start?
                </p>

                <button
                  onClick={() => navigate('/quiz')}
                  style={{
                    backgroundColor: 'var(--accent-amber)',
                    color: 'var(--background-primary)',
                    border: 'none',
                    padding: '12px 24px',
                    fontSize: '0.95rem',
                    fontFamily: 'Bebas Neue',
                    fontWeight: '600',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(232, 146, 10, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Tailor your discovery — take the taste quiz →
                </button>
              </div>
            </>
          ) : (
            /* STATE 2: Quiz Taken */
            <>
              {/* Heading */}
              <h1 style={{
                fontSize: '2.75rem',
                fontFamily: 'Bebas Neue',
                color: 'var(--accent-amber)',
                margin: '0 0 1rem 0',
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}>
                Welcome back, {profileName}.
              </h1>

              {/* Subtitle */}
              <p style={{
                fontSize: '1.125rem',
                fontFamily: 'DM Sans',
                color: 'var(--accent-cream)',
                margin: '0 0 1.5rem 0',
              }}>
                Your picks, based on your taste profile.
              </p>

              {/* Retake Quiz Link */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/quiz');
                }}
                style={{
                  fontSize: '0.875rem',
                  fontFamily: 'DM Sans',
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent-amber)';
                  e.currentTarget.style.borderBottomColor = 'var(--accent-amber)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.borderBottomColor = 'var(--text-muted)';
                }}
              >
                Not feeling these? Retake the quiz →
              </a>
            </>
          )}
        </div>
      </motion.section>

      {/* Search and Filter Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          padding: '2rem',
          backgroundColor: 'var(--background-primary)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'nowrap',
          }}>
            {/* Search Bar */}
            <div style={{ flex: '0 0 350px' }}>
              <SearchBar
                onChange={handleSearchChange}
                variant="full"
                defaultValue={searchQuery}
              />
            </div>

            {/* Mood filter pills */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
              scrollBehavior: 'smooth',
              flex: '1 1 auto',
              minWidth: 0,
            }}>
              <button
                onClick={() => {
                  setSelectedMood(null);
                  setSearchQuery('');
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: !selectedMood && !searchQuery ? 'var(--accent-amber)' : 'transparent',
                  color: !selectedMood && !searchQuery ? 'var(--background-primary)' : 'var(--text-secondary)',
                  border: `1px solid ${!selectedMood && !searchQuery ? 'var(--accent-amber)' : 'var(--border-medium)'}`,
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontFamily: 'DM Sans',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => {
                  if (selectedMood || searchQuery) {
                    e.currentTarget.style.borderColor = 'var(--accent-amber)';
                    e.currentTarget.style.color = 'var(--accent-amber)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedMood || searchQuery) {
                    e.currentTarget.style.borderColor = 'var(--border-medium)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                All
              </button>

              {ALL_MOODS.map((mood) => (
                <button
                  key={mood}
                  onClick={() => handleMoodClick(mood)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: selectedMood === mood ? 'var(--accent-amber)' : 'transparent',
                    color: selectedMood === mood ? 'var(--background-primary)' : 'var(--text-secondary)',
                    border: `1px solid ${selectedMood === mood ? 'var(--accent-amber)' : 'var(--border-medium)'}`,
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontFamily: 'DM Sans',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedMood !== mood) {
                      e.currentTarget.style.borderColor = 'var(--accent-amber)';
                      e.currentTarget.style.color = 'var(--accent-amber)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedMood !== mood) {
                      e.currentTarget.style.borderColor = 'var(--border-medium)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  {MOOD_LABELS[mood]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Beer Grid or No Results */}
      <section style={{ padding: '0.5rem 2rem 2rem 2rem', backgroundColor: 'var(--background-primary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {filteredBeers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: '4rem 2rem' }}
            >
              <p style={{
                fontSize: '1.25rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                marginBottom: '1rem',
              }}>
                No beers found for "{searchQuery}"
              </p>
              <button
                onClick={handleClearSearch}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--accent-amber)',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontFamily: 'DM Sans',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Clear search
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2rem',
              }}
            >
              {filteredBeers.map((beer, index) => {
                const brewer = getBrewer(beer.brewerId);
                const imageUrl = beer.imageUrl;
                const imageFailedToLoad = failedImages.has(beer.id);

                return (
                  <motion.div
                    key={beer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => handleBeerClick(beer)}
                    style={{
                      backgroundColor: 'var(--background-secondary)',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 200ms ease',
                      opacity: beer.inStock ? 1 : 0.6,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-amber)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Image */}
                    <div style={{
                      width: '100%',
                      paddingBottom: '56.25%', // 16:9 ratio
                      position: 'relative',
                      backgroundColor: 'var(--background-tertiary)',
                    }}>
                      {imageFailedToLoad ? (
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'var(--background-tertiary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                        }}>
                          <div style={{
                            fontSize: '0.875rem',
                            fontFamily: 'DM Sans',
                            color: 'var(--accent-amber)',
                            textAlign: 'center',
                            padding: '1rem',
                          }}>
                            {beer.name}
                          </div>
                        </div>
                      ) : (
                        <img
                          src={imageUrl}
                          alt={beer.name}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                          onError={() => {
                            setFailedImages(prev => new Set([...prev, beer.id]));
                          }}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: '1.5rem' }}>
                      {/* Brewer label */}
                      <span style={{
                        display: 'inline-block',
                        fontSize: '0.75rem',
                        fontFamily: 'Bebas Neue',
                        color: 'var(--background-primary)',
                        backgroundColor: 'var(--accent-amber)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '3px',
                        marginBottom: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>
                        {brewer?.name}
                      </span>

                      {/* Beer name */}
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontFamily: 'DM Sans',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        margin: '0.5rem 0',
                      }}>
                        {beer.name}
                      </h3>

                      {/* Rating */}
                      <RatingDisplay
                        averageRating={beer.averageRating}
                        ratingCount={beer.ratingCount}
                        size="small"
                      />

                      {/* Style badge */}
                      <span style={{
                        display: 'inline-block',
                        fontSize: '0.75rem',
                        fontFamily: 'DM Sans',
                        color: 'var(--accent-amber)',
                        backgroundColor: 'rgba(232, 146, 10, 0.1)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px',
                        marginBottom: '0.75rem',
                      }}>
                        {beer.style}
                      </span>

                      {/* Description */}
                      <p style={{
                        fontSize: '0.95rem',
                        fontFamily: 'DM Sans',
                        color: 'var(--text-secondary)',
                        margin: '0.75rem 0',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.5,
                      }}>
                        {beer.humanDescription}
                      </p>

                      {/* ABV and Volume */}
                      <div style={{
                        fontSize: '0.875rem',
                        fontFamily: 'DM Sans',
                        color: 'var(--text-muted)',
                        marginBottom: '1rem',
                      }}>
                        {beer.abv}% ABV • {beer.volume}ml
                      </div>

                      {/* Price */}
                      <div style={{
                        fontSize: '1.25rem',
                        fontFamily: 'DM Sans',
                        fontWeight: '700',
                        color: 'var(--accent-amber)',
                        marginBottom: '1rem',
                      }}>
                        €{beer.price.toFixed(2)}
                      </div>

                      {/* Button */}
                      <button
                        onClick={(e) => handleAddToBasket(e, beer)}
                        disabled={!beer.inStock || recentlyAddedBeers.has(beer.id)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: recentlyAddedBeers.has(beer.id)
                            ? 'var(--background-tertiary)'
                            : beer.inStock ? 'var(--accent-amber)' : 'var(--background-tertiary)',
                          color: recentlyAddedBeers.has(beer.id)
                            ? 'var(--text-muted)'
                            : beer.inStock ? 'var(--background-primary)' : 'var(--text-muted)',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.95rem',
                          fontFamily: 'DM Sans',
                          fontWeight: '600',
                          cursor: (beer.inStock && !recentlyAddedBeers.has(beer.id)) ? 'pointer' : 'not-allowed',
                          transition: 'all 200ms ease',
                        }}
                        onMouseEnter={(e) => {
                          if (beer.inStock && !recentlyAddedBeers.has(beer.id)) {
                            e.currentTarget.style.backgroundColor = 'var(--accent-amber-light)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (beer.inStock && !recentlyAddedBeers.has(beer.id)) {
                            e.currentTarget.style.backgroundColor = 'var(--accent-amber)';
                          }
                        }}
                      >
                        {recentlyAddedBeers.has(beer.id) ? 'Added to cart' : beer.inStock ? 'Add to cart' : 'Notify me'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* Cart Notification */}
      {showNotification && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'var(--background-secondary)',
            borderTop: '2px solid var(--accent-amber)',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 50,
          }}
        >
          <span style={{
            fontSize: '1rem',
            fontFamily: 'DM Sans',
            color: 'var(--text-primary)',
            fontWeight: '600',
          }}>
            {notificationMessage}
          </span>
          <span style={{
            fontSize: '1rem',
            fontFamily: 'DM Sans',
            color: 'var(--accent-amber)',
            fontWeight: '600',
          }}>
            ✓
          </span>
        </motion.div>
      )}
    </div>
  );
}
