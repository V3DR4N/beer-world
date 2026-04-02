import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useBasket } from '../hooks/useBasket';
import { useScrollRestoration } from '../hooks/useScrollRestoration';
import { useResponsive } from '../hooks/useResponsive';
import beers from '../data/beers.json';
import brewers from '../data/brewers.json';
import RatingDisplay from '../components/ui/RatingDisplay';
import RatingInput from '../components/ui/RatingInput';

export default function BeerDetailPage() {
  const { beerId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useBasket();
  const { restoreScrollState } = useScrollRestoration();
  const isMobile = useResponsive(768);

  const [failedImages, setFailedImages] = useState(new Set());
  const [recentlyAddedBeers, setRecentlyAddedBeers] = useState(new Set());
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Find the beer
  const beer = useMemo(() => {
    return beers.find((b) => b.id === beerId);
  }, [beerId]);

  // Find the brewery
  const brewery = useMemo(() => {
    if (!beer) return null;
    return brewers.find((b) => b.id === beer.brewerId);
  }, [beer]);

  // Find other beers from the same brewery
  const otherBeers = useMemo(() => {
    if (!beer || !brewery) return [];
    return beers.filter((b) => b.brewerId === brewery.id && b.id !== beer.id);
  }, [beer, brewery]);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [beerId]);

  if (!beer || !brewery) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontFamily: 'Bebas Neue',
          color: 'var(--text-primary)',
          marginBottom: '1rem',
          textTransform: 'uppercase',
        }}>
          Beer not found
        </h1>
        <p style={{
          fontSize: '1.125rem',
          fontFamily: 'DM Sans',
          color: 'var(--text-secondary)',
          marginBottom: '2rem',
        }}>
          We couldn't find that beer. Let's get you back to exploring.
        </p>
        <button
          onClick={() => navigate('/discover')}
          style={{
            backgroundColor: 'var(--accent-amber)',
            color: 'var(--background-primary)',
            border: 'none',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontFamily: 'DM Sans',
            fontWeight: '600',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Back to Discover
        </button>
      </div>
    );
  }

  const handleAddToBasket = (beerItem) => {
    addItem(beerItem.id, beerItem.breweryName, beerItem.name, beerItem.price, beerItem.style);
    setRecentlyAddedBeers(prev => new Set([...prev, beerItem.id]));
    setNotificationMessage(`${beerItem.name} added to cart`);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setTimeout(() => setRecentlyAddedBeers(prev => {
        const newSet = new Set(prev);
        newSet.delete(beerItem.id);
        return newSet;
      }), 300);
    }, 2000);
  };

  const handleBackClick = () => {
    const restored = restoreScrollState();
    navigate(-1);
    if (restored && restored.scrollPosition !== undefined) {
      setTimeout(() => {
        window.scrollTo(0, restored.scrollPosition);
      }, 100);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ backgroundColor: 'var(--background-primary)', minHeight: '100vh' }}
    >
      {/* Main content container */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '1rem' : '2rem',
      }}>
        {/* Beer Details Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '2rem' : '3rem',
          alignItems: 'start',
          marginBottom: isMobile ? '2rem' : '4rem',
        }}>
          {/* Left column: Beer image + Story + Philosophy */}
          <div>
            {/* Beer Image */}
            <div style={{
              width: '100%',
              paddingBottom: '100%',
              position: 'relative',
              backgroundColor: 'var(--background-tertiary)',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '2rem',
            }}>
              {failedImages.has(beer.id) ? (
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
                  src={beer.imageUrl}
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

            {/* Our Story */}
            <div style={{ marginBottom: '2.5rem' }}>
              <span style={{
                fontSize: '0.75rem',
                fontFamily: 'Bebas Neue',
                color: 'var(--accent-amber)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '1rem',
                display: 'block',
              }}>
                Our Story
              </span>
              <p style={{
                fontSize: '1rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-primary)',
                lineHeight: 1.8,
                margin: 0,
              }}>
                {brewery.story}
              </p>
            </div>

            {/* Our Philosophy */}
            <div>
              <span style={{
                fontSize: '0.75rem',
                fontFamily: 'Bebas Neue',
                color: 'var(--accent-amber)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '1rem',
                display: 'block',
              }}>
                Our Philosophy
              </span>
              <p style={{
                fontSize: '1rem',
                fontFamily: 'DM Sans',
                fontStyle: 'italic',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                margin: 0,
              }}>
                {brewery.tagline}
              </p>
            </div>
          </div>

          {/* Right column: Beer details */}
          <div style={{
            backgroundColor: 'var(--background-secondary)',
            borderRadius: '12px',
            padding: '2rem',
            overflow: 'hidden',
          }}>
            {/* Back Button */}
            <button
              onClick={handleBackClick}
              style={{
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                padding: '0.4rem 0.8rem',
                fontSize: '0.8rem',
                fontFamily: 'DM Sans',
                fontWeight: '600',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                marginBottom: '1rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-amber)';
                e.currentTarget.style.color = 'var(--accent-amber)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              ← Back
            </button>

            {/* Beer Information */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-muted)',
                margin: '0 0 0.5rem 0',
                textTransform: 'uppercase',
              }}>
                Beer Name
              </p>
              <p style={{
                fontSize: '1.5rem',
                fontFamily: 'Bebas Neue',
                color: 'var(--text-primary)',
                margin: 0,
              }}>
                {beer.name}
              </p>
            </div>

            {/* Brewery Info */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-muted)',
                margin: '0 0 0.5rem 0',
                textTransform: 'uppercase',
              }}>
                Brewer
              </p>
              <button
                onClick={() => navigate(`/brewer/${brewery.id}`)}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--accent-amber)',
                  border: '1px solid var(--accent-amber)',
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.95rem',
                  fontFamily: 'DM Sans',
                  fontWeight: '600',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(232, 146, 10, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {brewery.name}
              </button>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{
                fontSize: '1rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.6,
              }}>
                {beer.humanDescription}
              </p>
            </div>

            {/* Divider */}
            <div style={{
              height: '1px',
              backgroundColor: 'var(--border-subtle)',
              margin: '2rem 0',
            }} />

            {/* Style */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-muted)',
                margin: '0 0 0.5rem 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Beer Style
              </p>
              <p style={{
                fontSize: '1.25rem',
                fontFamily: 'Bebas Neue',
                color: 'var(--accent-amber)',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                {beer.style}
              </p>
              <p style={{
                fontSize: '0.9rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                margin: '0.5rem 0 0 0',
              }}>
                A distinct category of beer with unique characteristics and flavor profiles
              </p>
            </div>

            {/* ABV & Volume */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-muted)',
                margin: '0 0 0.5rem 0',
                textTransform: 'uppercase',
              }}>
                Details
              </p>
              <p style={{
                fontSize: '1.125rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-primary)',
                margin: 0,
              }}>
                {beer.abv}% ABV • {beer.volume}ml
              </p>
            </div>

            {/* Price */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-muted)',
                margin: '0 0 0.5rem 0',
                textTransform: 'uppercase',
              }}>
                Price
              </p>
              <p style={{
                fontSize: '1.5rem',
                fontFamily: 'Bebas Neue',
                color: 'var(--accent-amber)',
                margin: 0,
              }}>
                €{beer.price.toFixed(2)}
              </p>
            </div>

            {/* Moods */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-muted)',
                margin: '0 0 0.75rem 0',
                textTransform: 'uppercase',
              }}>
                Mood
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {beer.moods.map((mood) => (
                  <span
                    key={mood}
                    style={{
                      fontSize: '0.75rem',
                      fontFamily: 'DM Sans',
                      color: 'var(--accent-amber)',
                      backgroundColor: 'rgba(232, 146, 10, 0.1)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '4px',
                    }}
                  >
                    {mood.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Rating Input */}
            <div style={{ marginBottom: '1.5rem' }}>
              <RatingInput
                beerId={beer.id}
                averageRating={beer.averageRating}
                ratingCount={beer.ratingCount}
              />
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => handleAddToBasket(beer)}
              disabled={recentlyAddedBeers.has(beer.id)}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: recentlyAddedBeers.has(beer.id)
                  ? 'var(--background-tertiary)'
                  : 'var(--accent-amber)',
                color: recentlyAddedBeers.has(beer.id)
                  ? 'var(--text-muted)'
                  : 'var(--background-primary)',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontFamily: 'DM Sans',
                fontWeight: '600',
                cursor: recentlyAddedBeers.has(beer.id) ? 'not-allowed' : 'pointer',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={(e) => {
                if (!recentlyAddedBeers.has(beer.id)) {
                  e.currentTarget.style.backgroundColor = 'var(--accent-amber-light)';
                }
              }}
              onMouseLeave={(e) => {
                if (!recentlyAddedBeers.has(beer.id)) {
                  e.currentTarget.style.backgroundColor = 'var(--accent-amber)';
                }
              }}
            >
              {recentlyAddedBeers.has(beer.id) ? 'Added to cart' : 'Add to cart'}
            </button>
          </div>
        </div>


        {/* Other Beers from Brewery Section */}
        {otherBeers.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              marginBottom: '2rem',
            }}
          >
            <h2 style={{
              fontSize: '2rem',
              fontFamily: 'Bebas Neue',
              color: 'var(--text-primary)',
              margin: '0 0 2rem 0',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              More from {brewery.name}
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: isMobile ? '1rem' : '2rem',
              }}
            >
              {otherBeers.map((otherBeer, index) => (
                <motion.div
                  key={otherBeer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => navigate(`/beer/${otherBeer.id}`)}
                  style={{
                    backgroundColor: 'var(--background-secondary)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
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
                    paddingBottom: '56.25%',
                    position: 'relative',
                    backgroundColor: 'var(--background-tertiary)',
                  }}>
                    {failedImages.has(otherBeer.id) ? (
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
                      }}>
                        <div style={{
                          fontSize: '0.875rem',
                          fontFamily: 'DM Sans',
                          color: 'var(--accent-amber)',
                          textAlign: 'center',
                          padding: '1rem',
                        }}>
                          {otherBeer.name}
                        </div>
                      </div>
                    ) : (
                      <img
                        src={otherBeer.imageUrl}
                        alt={otherBeer.name}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={() => {
                          setFailedImages(prev => new Set([...prev, otherBeer.id]));
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: '1.5rem' }}>
                    {/* Beer name */}
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontFamily: 'DM Sans',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      margin: '0 0 0.5rem 0',
                    }}>
                      {otherBeer.name}
                    </h3>

                    {/* Rating */}
                    <RatingDisplay
                      averageRating={otherBeer.averageRating}
                      ratingCount={otherBeer.ratingCount}
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
                      marginTop: '0.75rem',
                    }}>
                      {otherBeer.style}
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
                      {otherBeer.humanDescription}
                    </p>

                    {/* ABV and Volume */}
                    <div style={{
                      fontSize: '0.875rem',
                      fontFamily: 'DM Sans',
                      color: 'var(--text-muted)',
                      marginBottom: '1rem',
                    }}>
                      {otherBeer.abv}% ABV • {otherBeer.volume}ml
                    </div>

                    {/* Price */}
                    <div style={{
                      fontSize: '1.25rem',
                      fontFamily: 'DM Sans',
                      fontWeight: '700',
                      color: 'var(--accent-amber)',
                      marginBottom: '1rem',
                    }}>
                      €{otherBeer.price.toFixed(2)}
                    </div>

                    {/* Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToBasket(otherBeer);
                      }}
                      disabled={!otherBeer.inStock || recentlyAddedBeers.has(otherBeer.id)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: recentlyAddedBeers.has(otherBeer.id)
                          ? 'var(--background-tertiary)'
                          : otherBeer.inStock
                          ? 'var(--accent-amber)'
                          : 'var(--background-tertiary)',
                        color: recentlyAddedBeers.has(otherBeer.id)
                          ? 'var(--text-muted)'
                          : otherBeer.inStock
                          ? 'var(--background-primary)'
                          : 'var(--text-muted)',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.95rem',
                        fontFamily: 'DM Sans',
                        fontWeight: '600',
                        cursor: (otherBeer.inStock && !recentlyAddedBeers.has(otherBeer.id)) ? 'pointer' : 'not-allowed',
                        transition: 'all 200ms ease',
                      }}
                      onMouseEnter={(e) => {
                        if (otherBeer.inStock && !recentlyAddedBeers.has(otherBeer.id)) {
                          e.currentTarget.style.backgroundColor = 'var(--accent-amber-light)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (otherBeer.inStock && !recentlyAddedBeers.has(otherBeer.id)) {
                          e.currentTarget.style.backgroundColor = 'var(--accent-amber)';
                        }
                      }}
                    >
                      {recentlyAddedBeers.has(otherBeer.id) ? 'Added to cart' : otherBeer.inStock ? 'Add to cart' : 'Notify me'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Snackbar Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'var(--background-secondary)',
              border: '1px solid var(--border-medium)',
              borderRadius: '8px',
              padding: '1rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              zIndex: 50,
            }}
          >
            <span style={{
              fontSize: '1.2rem',
            }}>
              ✓
            </span>
            <span style={{
              fontSize: '0.95rem',
              fontFamily: 'DM Sans',
              color: 'var(--text-primary)',
              fontWeight: '500',
            }}>
              {notificationMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
