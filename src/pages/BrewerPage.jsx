import { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useBasket } from '../hooks/useBasket';
import brewers from '../data/brewers.json';
import beers from '../data/beers.json';

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

  // Check if coming from discover page
  const fromDiscover = searchParams.get('from') === 'discover';
  const selectedBeerId = searchParams.get('beerId');

  // Find brewer
  const brewer = useMemo(() => {
    return brewers.find((b) => b.id === brewerId);
  }, [brewerId]);

  // Filter beers for this brewer
  const brewerBeers = useMemo(() => {
    return beers.filter((b) => b.brewerId === brewerId);
  }, [brewerId]);

  // Find the selected beer if coming from discover
  const selectedBeer = useMemo(() => {
    if (fromDiscover && selectedBeerId) {
      return beers.find((b) => b.id === selectedBeerId);
    }
    return null;
  }, [fromDiscover, selectedBeerId]);

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
          Back to discovery
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


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ backgroundColor: 'var(--background-primary)', minHeight: '100vh' }}
    >
      {/* Back Button */}
      <div style={{
        position: 'absolute',
        top: 'auto',
        left: '180px',
        zIndex: 10,
        marginTop: '2rem',
      }}>
        <button
          onClick={() => navigate('/discover')}
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid white',
            padding: '0.75rem 1.5rem',
            fontSize: '0.95rem',
            fontFamily: 'DM Sans',
            fontWeight: '600',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-amber)';
            e.currentTarget.style.color = 'var(--accent-amber)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'white';
            e.currentTarget.style.color = 'white';
          }}
        >
          ← Back to discovery
        </button>
      </div>

      {/* Cover Section */}
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'relative',
          width: '100%',
          height: '40vh',
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
          }}
        />

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
            left: '180px',
            right: '2rem',
            zIndex: 5,
          }}
        >
          <h1 style={{
            fontSize: '3rem',
            fontFamily: 'Bebas Neue',
            color: 'white',
            margin: '0 0 0.5rem 0',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}>
            {brewer.name}
          </h1>

          <p style={{
            fontSize: '1.125rem',
            fontFamily: 'DM Sans',
            color: 'rgba(255, 255, 255, 0.7)',
            margin: '0 0 1rem 0',
          }}>
            {brewer.tagline}
          </p>

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
        padding: '0 2rem',
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          alignItems: 'start',
          marginTop: '-120px',
        }}>
          {/* Left Column - Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ paddingTop: '200px' }}
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
                Their story
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
                Our philosophy
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
            }}
          >
            {fromDiscover && selectedBeer ? (
              <>
                {/* Beer Image */}
                <div style={{
                  width: '100%',
                  paddingBottom: '56.25%',
                  position: 'relative',
                  backgroundColor: 'var(--background-tertiary)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginBottom: '1.5rem',
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
                    {selectedBeer.name}
                  </p>
                </div>

                {/* Style */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{
                    fontSize: '0.875rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-muted)',
                    margin: '0 0 0.5rem 0',
                    textTransform: 'uppercase',
                  }}>
                    Style
                  </p>
                  <p style={{
                    fontSize: '1.125rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}>
                    {selectedBeer.style}
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

                {/* Team */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{
                    fontSize: '0.875rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-muted)',
                    margin: '0 0 0.5rem 0',
                  }}>
                    Team
                  </p>
                  <p style={{
                    fontSize: '1.125rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}>
                    {brewer.founders.length} {brewer.founders.length === 1 ? 'founder' : 'founders'}
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
          Their beers
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
              onClick={() => navigate(`/brewer/${brewerId}?beerId=${beer.id}`)}
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
