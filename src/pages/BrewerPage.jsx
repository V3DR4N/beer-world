import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useBasket } from '../hooks/useBasket';
import { useScrollRestoration } from '../hooks/useScrollRestoration';
import brewers from '../data/brewers.json';
import beers from '../data/beers.json';
import RatingDisplay from '../components/ui/RatingDisplay';
import RatingInput from '../components/ui/RatingInput';

const BREWER_COVER_IMAGES = {
  'de-wilde-hop': '/images/breweries/1.jpg',
  'schwarzwald-brauhaus': '/images/breweries/2.jpg',
  'noorden-brewery': '/images/breweries/3.jpg',
};

export default function BrewerPage() {
  const { id: brewerId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useBasket();
  const [searchParams] = useSearchParams();

  const [lastAddedBeer, setLastAddedBeer] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());
  const [recentlyAddedBeers, setRecentlyAddedBeers] = useState(new Set());
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [copiedBrewerLink, setCopiedBrewerLink] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  // Check if coming from discover page
  const fromDiscover = searchParams.get('from') === 'discover';
  const selectedBeerId = searchParams.get('beerId');

  // Restore scroll position when coming back from beer detail
  useEffect(() => {
    const { restoreScrollState, clearScrollState } = useScrollRestoration();
    const restored = restoreScrollState();

    if (restored && restored.sourceRoute.startsWith('/brewer/')) {
      setTimeout(() => {
        window.scrollTo(0, restored.scrollPosition);
        // Clear the saved state after restoring so future navigations scroll to top
        clearScrollState();
      }, 100);
    }
  }, [brewerId]);

  // Find brewer
  const brewer = useMemo(() => {
    return brewers.find((b) => b.id === brewerId);
  }, [brewerId]);

  // Filter beers for this brewer
  const brewerBeers = useMemo(() => {
    return beers.filter((b) => b.brewerId === brewerId);
  }, [brewerId]);

  // Find the selected beer (from either discover or clicking within brewery page)
  const selectedBeer = useMemo(() => {
    if (selectedBeerId) {
      return beers.find((b) => b.id === selectedBeerId);
    }
    return null;
  }, [selectedBeerId]);

  if (!brewer) {
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
          Brewer not found
        </h1>
        <p style={{
          fontSize: '1.125rem',
          fontFamily: 'DM Sans',
          color: 'var(--text-secondary)',
          marginBottom: '2rem',
        }}>
          We couldn't find that brewer. Let's get you back to exploring.
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

  const coverImage = BREWER_COVER_IMAGES[brewerId];

  const handleAddToBasket = (beer) => {
    addItem(beer.id, beer.breweryName, beer.name, beer.price, beer.style);
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

  const handleCopyBrewerLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedBrewerLink(true);
    setShowCopySuccess(true);
    setTimeout(() => setCopiedBrewerLink(false), 2000);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ backgroundColor: 'var(--background-primary)', minHeight: '100vh' }}
    >
      {/* Cover Section */}
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(25vh, 50vw, 40vh)',
          overflow: 'visible',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <img
            src={coverImage}
            alt={brewer.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: 'linear-gradient(to bottom, transparent, #0F0F0F)',
            pointerEvents: 'none',
          }}
        />

        {/* Brewer info overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: 0,
            right: 0,
            zIndex: 20,
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <h1 style={{
              fontSize: 'clamp(1.75rem, 8vw, 3rem)',
              fontFamily: 'Bebas Neue',
              color: 'white',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}>
              {brewer.name}
            </h1>

          </div>

          {/* Share Section */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            marginBottom: '1rem',
            alignItems: 'center',
          }}>
            {/* Facebook Icon */}
            <a
              href="https://www.facebook.com/sharer/sharer.php?u=https://beerworld.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1877F2';
                e.currentTarget.style.borderColor = '#1877F2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
              title="Share on Facebook"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* X/Twitter Icon */}
            <a
              href={`https://twitter.com/intent/tweet?text=Check out ${brewer.name} on Beer World 🍺 beerworld.com`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
              title="Share on X"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.106-6.666-5.829 6.666H2.306l7.644-8.74L2.25 2.25h6.734l4.611 6.09 5.649-6.09zM11.5 12.5L9.25 9l-2.5 3.5L7.5 16l2-4.5L15.5 21h2L11.5 12.5z" />
              </svg>
            </a>

            {/* Copy Link Icon */}
            <button
              onClick={handleCopyBrewerLink}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
              title="Copy link to clipboard"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </button>

            {/* Copy Success Message */}
            {showCopySuccess && (
              <span style={{
                color: '#22C55E',
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                marginLeft: '0.5rem',
              }}>
                Copied!
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.875rem',
              fontFamily: 'DM Sans',
              color: 'var(--text-muted)',
            }}>
              📍 {brewer.location}
            </span>
            <span style={{
              fontSize: '0.875rem',
              fontFamily: 'DM Sans',
              color: 'var(--text-muted)',
            }}>
              Founded {brewer.founded}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Content Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
          alignItems: 'start',
          marginTop: '-120px',
        }}>
          {/* Left Column - Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ paddingTop: 'clamp(80px, 20vw, 180px)' }}
          >
            {/* Story */}
            <div style={{ marginBottom: '3rem' }}>
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
                fontSize: '1.125rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-primary)',
                lineHeight: 1.8,
                margin: '0 0 1.5rem 0',
              }}>
                {brewer.story}
              </p>
            </div>

            {/* Divider */}
            <div style={{
              height: '1px',
              backgroundColor: 'var(--border-subtle)',
              margin: '2rem 0',
            }} />

            {/* Philosophy */}
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
                fontSize: '1.125rem',
                fontFamily: 'DM Sans',
                fontStyle: 'italic',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                margin: 0,
              }}>
                {brewer.tagline}
              </p>
            </div>
          </motion.div>

          {/* Right Column - Details Card or Beer Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              backgroundColor: 'var(--background-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '2rem',
              overflow: 'hidden',
            }}
          >
            {selectedBeer ? (
              <>
                {/* Beer Image */}
                <div style={{
                  width: '100%',
                  paddingBottom: '56.25%',
                  position: 'relative',
                  backgroundColor: 'var(--background-tertiary)',
                  borderRadius: '8px 8px 0 0',
                  overflow: 'hidden',
                  marginBottom: 0,
                }}>
                  {failedImages.has(selectedBeer.id) ? (
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
                        {selectedBeer.name}
                      </div>
                    </div>
                  ) : (
                    <img
                      src={selectedBeer.imageUrl}
                      alt={selectedBeer.name}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={() => {
                        setFailedImages(prev => new Set([...prev, selectedBeer.id]));
                      }}
                    />
                  )}
                </div>

                {/* Beer Information */}
                <div style={{ marginBottom: '1.5rem', paddingTop: '1.5rem' }}>
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
                    {selectedBeer.name}
                  </p>
                </div>

                {/* Back Button */}
                <button
                  onClick={() => {
                    const { restoreScrollState } = useScrollRestoration();
                    const restored = restoreScrollState();
                    navigate(-1);
                    if (restored && restored.scrollPosition !== undefined) {
                      setTimeout(() => {
                        window.scrollTo(0, restored.scrollPosition);
                      }, 100);
                    }
                  }}
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

                {/* Description */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{
                    fontSize: '1rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-secondary)',
                    margin: 0,
                    lineHeight: 1.6,
                  }}>
                    {selectedBeer.humanDescription}
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
                    {selectedBeer.style}
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
                    {selectedBeer.abv}% ABV • {selectedBeer.volume}ml
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
                    €{selectedBeer.price.toFixed(2)}
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
                    {selectedBeer.moods.map((mood) => (
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
                    beerId={selectedBeer.id}
                    averageRating={selectedBeer.averageRating}
                    ratingCount={selectedBeer.ratingCount}
                  />
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToBasket(selectedBeer)}
                  disabled={recentlyAddedBeers.has(selectedBeer.id)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: recentlyAddedBeers.has(selectedBeer.id)
                      ? 'var(--background-tertiary)'
                      : 'var(--accent-amber)',
                    color: recentlyAddedBeers.has(selectedBeer.id)
                      ? 'var(--text-muted)'
                      : 'var(--background-primary)',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    fontFamily: 'DM Sans',
                    fontWeight: '600',
                    cursor: recentlyAddedBeers.has(selectedBeer.id) ? 'not-allowed' : 'pointer',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!recentlyAddedBeers.has(selectedBeer.id)) {
                      e.currentTarget.style.backgroundColor = 'var(--accent-amber-light)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!recentlyAddedBeers.has(selectedBeer.id)) {
                      e.currentTarget.style.backgroundColor = 'var(--accent-amber)';
                    }
                  }}
                >
                  {recentlyAddedBeers.has(selectedBeer.id) ? 'Added to cart' : 'Add to cart'}
                </button>
              </>
            ) : (
              <>
                {/* Brewery Information */}
                {/* Founded */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{
                    fontSize: '0.875rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-muted)',
                    margin: '0 0 0.5rem 0',
                  }}>
                    Founded
                  </p>
                  <p style={{
                    fontSize: '1.5rem',
                    fontFamily: 'Bebas Neue',
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}>
                    {brewer.founded}
                  </p>
                </div>

                {/* Location */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{
                    fontSize: '0.875rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-muted)',
                    margin: '0 0 0.5rem 0',
                  }}>
                    Location
                  </p>
                  <p style={{
                    fontSize: '1.125rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}>
                    {brewer.location}
                  </p>
                </div>

                {/* Founded By */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{
                    fontSize: '0.875rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-muted)',
                    margin: '0 0 0.5rem 0',
                  }}>
                    Founded By
                  </p>
                  <p style={{
                    fontSize: '1.125rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}>
                    {brewer.founders.join(brewer.founders.length === 2 ? ' & ' : ', ')}
                  </p>
                </div>

                {/* Styles */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{
                    fontSize: '0.875rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-muted)',
                    margin: '0 0 0.75rem 0',
                  }}>
                    Beer styles
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {brewer.styles.map((style) => (
                      <span
                        key={style}
                        style={{
                          fontSize: '0.75rem',
                          fontFamily: 'DM Sans',
                          color: 'var(--accent-amber)',
                          backgroundColor: 'rgba(232, 146, 10, 0.1)',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '4px',
                        }}
                      >
                        {style}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Awards */}
                {brewer.awards && brewer.awards.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{
                      fontSize: '0.75rem',
                      fontFamily: 'Bebas Neue',
                      color: 'var(--accent-amber)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      margin: '0 0 0.75rem 0',
                    }}>
                      Awards
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {brewer.awards.map((award) => (
                        <div
                          key={award}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.75rem',
                            fontSize: '0.95rem',
                            fontFamily: 'DM Sans',
                            color: 'var(--text-primary)',
                          }}
                        >
                          <span style={{
                            color: 'var(--accent-amber)',
                            marginTop: '0.25rem',
                            flexShrink: 0,
                          }}>
                            •
                          </span>
                          <span>{award}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Beer Catalogue Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '3rem 2rem',
          backgroundColor: 'var(--background-primary)',
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
          Beers
        </h2>

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
          {brewerBeers.map((beer, index) => (
            <motion.div
              key={beer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => {
                const { clearScrollState } = useScrollRestoration();
                // Clear scroll state so page scrolls to top to show the beer detail
                clearScrollState();
                navigate(`/brewer/${brewerId}?beerId=${beer.id}`);
              }}
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
                paddingBottom: '56.25%',
                position: 'relative',
                backgroundColor: 'var(--background-tertiary)',
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToBasket(beer);
                  }}
                  disabled={!beer.inStock || recentlyAddedBeers.has(beer.id)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: recentlyAddedBeers.has(beer.id)
                      ? 'var(--background-tertiary)'
                      : beer.inStock
                      ? 'var(--accent-amber)'
                      : 'var(--background-tertiary)',
                    color: recentlyAddedBeers.has(beer.id)
                      ? 'var(--text-muted)'
                      : beer.inStock
                      ? 'var(--background-primary)'
                      : 'var(--text-muted)',
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
          ))}
        </motion.div>
      </motion.section>

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
