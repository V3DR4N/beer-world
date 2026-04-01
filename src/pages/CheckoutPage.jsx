import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useBasket } from '../hooks/useBasket';
import beers from '../data/beers.json';
import brewers from '../data/brewers.json';

const BREWER_MESSAGES = {
  'de-wilde-hop': 'Thank you for your first order. We hope the Wilde Saison finds you well. — Lena & Pieter',
  'schwarzwald-brauhaus': 'The forest thanks you. Enjoy slowly. — Klaus',
  'noorden-brewery': 'Sara said you have great taste. Thijs disagrees. Either way, enjoy. — Noorden',
};

function AnimatedCheckmark() {
  return (
    <motion.svg
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      viewBox="0 0 100 100"
      style={{ width: '120px', height: '120px', marginBottom: '2rem' }}
    >
      {/* Circle */}
      <motion.circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="#E8920A"
        strokeWidth="3"
        initial={{ strokeDashoffset: 282.7, strokeDasharray: 282.7 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      />

      {/* Checkmark */}
      <motion.polyline
        points="30,50 45,65 70,35"
        fill="none"
        stroke="#E8920A"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ strokeDashoffset: 100, strokeDasharray: 100 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      />
    </motion.svg>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, clearBasket, removeItem, updateQuantity } = useBasket();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [stage, setStage] = useState('account'); // 'account' | 'delivery' | 'confirmation'
  const [orderNumber, setOrderNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [failedImages, setFailedImages] = useState(new Set());

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('Netherlands');
  const [phone, setPhone] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  // Payment form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentErrors, setPaymentErrors] = useState({});
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const discountPercent = promoApplied ? 15 : 0;
  const subtotal = total;
  const discount = subtotal * (discountPercent / 100);
  const delivery = Math.min(4.95, subtotal);
  const finalTotal = subtotal - discount + delivery;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'BEERWORLD') {
      setPromoApplied(true);
      setPromoCode('');
    }
  };

  const handleAccountSubmit = (asGuest) => {
    if (asGuest || (email && password)) {
      if (!asGuest) {
        setEmail(email);
      }
      setStage('delivery');
    }
  };

  const handleDeliverySubmit = () => {
    if (!validatePaymentDetails()) {
      return;
    }

    if (firstName && lastName && email && address1 && city && postcode && ageConfirmed) {
      const num = Math.floor(Math.random() * 9000) + 1000;
      setOrderNumber(`#BW-${num}`);
      setDeliveryAddress(`${address1}${address2 ? ', ' + address2 : ''}, ${city} ${postcode}, ${country}`);
      setStage('confirmation');

      // Store user account if not already exists
      if (password && !localStorage.getItem('beerworld_user')) {
        const newUser = {
          firstName,
          lastName,
          email,
          password,
        };
        localStorage.setItem('beerworld_user', JSON.stringify(newUser));
      }

      // Store session
      localStorage.setItem(
        'beerworld_session',
        JSON.stringify({
          firstName,
          email,
        })
      );

      // Clear basket on successful order
      clearBasket();

      // Trigger confetti
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E8920A', '#F5F0E8'],
          duration: 3000,
        });
      }, 300);
    }
  };

  const handleContinueDiscovering = () => {
    clearBasket();
    navigate('/discover');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://beerworld.com');
    setCopiedToClipboard(true);
    setShowCopySuccess(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  // Payment formatting functions
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + ' / ' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const validatePaymentDetails = () => {
    const errors = {};

    // Card number validation (16 digits)
    const cardDigits = cardNumber.replace(/\s/g, '');
    if (!cardDigits || cardDigits.length !== 16 || !/^\d+$/.test(cardDigits)) {
      errors.cardNumber = 'Card number must be 16 digits';
    }

    // Expiry validation (MM/YY format and not in the past)
    const expiryRegex = /^(\d{2}) \/ (\d{2})$/;
    const expiryMatch = expiryDate.match(expiryRegex);
    if (!expiryMatch) {
      errors.expiryDate = 'Expiry must be in MM / YY format';
    } else {
      const month = parseInt(expiryMatch[1]);
      const year = parseInt(expiryMatch[2]);
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;

      if (month < 1 || month > 12) {
        errors.expiryDate = 'Month must be 01-12';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.expiryDate = 'Card has expired';
      }
    }

    // CVV validation (3 digits)
    if (!cvv || cvv.length !== 3 || !/^\d+$/.test(cvv)) {
      errors.cvv = 'CVV must be 3 digits';
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getBrewerName = (beerId) => {
    const beer = beers.find((b) => b.id === beerId);
    return beer?.brewerId;
  };

  const firstBeerBrewerId = items.length > 0 ? getBrewerName(items[0].brewerId) : null;

  if (items.length === 0 && stage !== 'confirmation') {
    return (
      <div style={{ backgroundColor: 'var(--background-primary)', minHeight: '100vh' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '3rem 2rem',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontFamily: 'Bebas Neue',
            color: 'var(--text-primary)',
            marginBottom: '1rem',
            textTransform: 'uppercase',
          }}>
            Your basket is empty
          </h1>
          <p style={{
            fontSize: '1.125rem',
            fontFamily: 'DM Sans',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
          }}>
            Add some beers to get started
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
            Go back to discover
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'confirmation') {
    return (
      <div style={{ backgroundColor: 'var(--background-primary)', minHeight: '100vh' }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '4rem 2rem',
          textAlign: 'center',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatedCheckmark />

            <h1 style={{
              fontSize: '3rem',
              fontFamily: 'Bebas Neue',
              color: 'var(--accent-cream)',
              margin: '0 0 0.5rem 0',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}>
              Order placed.
            </h1>

            <p style={{
              fontSize: '1rem',
              fontFamily: 'DM Sans',
              color: 'var(--text-muted)',
              marginBottom: '2rem',
            }}>
              {orderNumber}
            </p>

            {/* Summary Card */}
            <div style={{
              backgroundColor: 'var(--background-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '2rem',
              textAlign: 'left',
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontFamily: 'Bebas Neue',
                color: 'var(--text-primary)',
                margin: '0 0 1rem 0',
                textTransform: 'uppercase',
              }}>
                Order summary
              </h3>

              {/* Items */}
              <div style={{ marginBottom: '1.5rem' }}>
                {items.map((item) => (
                  <div
                    key={item.brewerId}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.95rem',
                      fontFamily: 'DM Sans',
                      color: 'var(--text-primary)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <span>{item.beerName} × {item.quantity}</span>
                    <span>€{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '1rem',
                marginBottom: '1rem',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.95rem',
                  fontFamily: 'DM Sans',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem',
                }}>
                  <span>Delivery address:</span>
                </div>
                <p style={{
                  fontSize: '0.95rem',
                  fontFamily: 'DM Sans',
                  color: 'var(--text-primary)',
                  margin: '0.5rem 0 0 0',
                }}>
                  {deliveryAddress}
                </p>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.95rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
              }}>
                <span>Estimated delivery:</span>
                <span>3-5 working days</span>
              </div>
            </div>

            {/* Brewer Message */}
            {firstBeerBrewerId && (
              <div style={{
                backgroundColor: 'var(--background-secondary)',
                borderLeft: '3px solid var(--accent-amber)',
                borderRadius: '0 12px 12px 0',
                padding: '1.5rem',
                marginBottom: '2rem',
                textAlign: 'left',
              }}>
                <p style={{
                  fontSize: '0.75rem',
                  fontFamily: 'Bebas Neue',
                  color: 'var(--accent-amber)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  margin: '0 0 1rem 0',
                }}>
                  A note from the brewers
                </p>
                <p style={{
                  fontSize: '1rem',
                  fontFamily: 'DM Sans',
                  color: 'var(--text-primary)',
                  margin: 0,
                  fontStyle: 'italic',
                }}>
                  {BREWER_MESSAGES[firstBeerBrewerId] || 'Thank you for your order!'}
                </p>
              </div>
            )}

            {/* Social Sharing Section */}
            <div style={{
              marginBottom: '2rem',
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontFamily: 'Bebas Neue',
                color: 'var(--text-primary)',
                margin: '0 0 1.5rem 0',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                Tell your friends what's on the way 🍺
              </h3>

              {/* Copy Success Message */}
              {showCopySuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    backgroundColor: '#22C55E',
                    color: 'white',
                    padding: '0.75rem 1rem',
                    borderRadius: '6px',
                    marginBottom: '1rem',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontFamily: 'DM Sans',
                  }}
                >
                  Clicked! Link copied to clipboard.
                </motion.div>
              )}

              <div style={{
                display: 'flex',
                gap: '1.5rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}>
                {/* Facebook Icon */}
                <a
                  href="https://www.facebook.com/sharer/sharer.php?u=https://beerworld.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--background-secondary)',
                    border: '2px solid var(--border-medium)',
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
                    e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
                    e.currentTarget.style.borderColor = 'var(--border-medium)';
                  }}
                  title="Share on Facebook"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--text-primary)' }}>
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* X/Twitter Icon */}
                <a
                  href="https://twitter.com/intent/tweet?text=Just ordered some incredible craft beer from Beer World 🍺 Discover yours at beerworld.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--background-secondary)',
                    border: '2px solid var(--border-medium)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#000000';
                    e.currentTarget.style.borderColor = '#000000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
                    e.currentTarget.style.borderColor = 'var(--border-medium)';
                  }}
                  title="Share on X"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--text-primary)' }}>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.106-6.666-5.829 6.666H2.306l7.644-8.74L2.25 2.25h6.734l4.611 6.09 5.649-6.09zM11.5 12.5L9.25 9l-2.5 3.5L7.5 16l2-4.5L15.5 21h2L11.5 12.5z" />
                  </svg>
                </a>

                {/* Copy Link Icon */}
                <button
                  onClick={handleCopyLink}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--background-secondary)',
                    border: '2px solid var(--border-medium)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-amber)';
                    e.currentTarget.style.borderColor = 'var(--accent-amber)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
                    e.currentTarget.style.borderColor = 'var(--border-medium)';
                  }}
                  title="Copy link to clipboard"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-primary)' }}>
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinueDiscovering}
              style={{
                backgroundColor: 'var(--accent-amber)',
                color: 'var(--background-primary)',
                border: 'none',
                padding: '1rem 2rem',
                fontSize: '1.125rem',
                fontFamily: 'Bebas Neue',
                fontWeight: '700',
                borderRadius: '6px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Continue discovering →
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ backgroundColor: 'var(--background-primary)', minHeight: '100vh' }}
    >
      {/* Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '3rem 2rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem',
      }}>
        {/* Left Column - Basket Summary */}
        <div>
          <h2 style={{
            fontSize: '2rem',
            fontFamily: 'Bebas Neue',
            color: 'var(--text-primary)',
            margin: '0 0 2rem 0',
            textTransform: 'uppercase',
          }}>
            Your basket
          </h2>

          <div style={{ marginBottom: '2rem' }}>
            {items.map((item) => (
              <motion.div
                key={item.brewerId}
                initial={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '64px 1fr',
                  gap: '1rem',
                  padding: '1.5rem',
                  backgroundColor: 'var(--background-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                }}
              >
                {/* Image */}
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  backgroundColor: 'var(--background-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {failedImages.has(item.brewerId) ? (
                    <span style={{
                      fontSize: '0.5rem',
                      fontFamily: 'DM Sans',
                      color: 'var(--accent-amber)',
                      textAlign: 'center',
                      padding: '0.25rem',
                    }}>
                      {item.beerName}
                    </span>
                  ) : (
                    <img
                      src={beers.find(b => b.id === item.brewerId)?.imageUrl || '/images/beers/1.jpg'}
                      alt={item.beerName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={() => {
                        setFailedImages(prev => new Set([...prev, item.brewerId]));
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div>
                  <h4 style={{
                    fontSize: '1rem',
                    fontFamily: 'DM Sans',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    margin: '0 0 0.25rem 0',
                  }}>
                    {item.beerName}
                  </h4>

                  <p style={{
                    fontSize: '0.75rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--accent-amber)',
                    textTransform: 'uppercase',
                    margin: '0 0 0.75rem 0',
                  }}>
                    {item.breweryName}
                  </p>

                  {/* Quantity Controls */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.75rem',
                  }}>
                    <button
                      onClick={() => updateQuantity(item.brewerId, item.quantity - 1)}
                      style={{
                        backgroundColor: 'var(--background-tertiary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-medium)',
                        width: '28px',
                        height: '28px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontFamily: 'DM Sans',
                      }}
                    >
                      −
                    </button>
                    <span style={{
                      color: 'var(--accent-cream)',
                      fontSize: '0.875rem',
                      fontFamily: 'DM Sans',
                      minWidth: '20px',
                      textAlign: 'center',
                    }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.brewerId, item.quantity + 1)}
                      style={{
                        backgroundColor: 'var(--background-tertiary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-medium)',
                        width: '28px',
                        height: '28px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontFamily: 'DM Sans',
                      }}
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.brewerId)}
                      style={{
                        backgroundColor: 'transparent',
                        color: 'var(--text-muted)',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        marginLeft: 'auto',
                      }}
                    >
                      ×
                    </button>
                  </div>

                  <div style={{
                    fontSize: '1rem',
                    fontFamily: 'DM Sans',
                    fontWeight: '700',
                    color: 'var(--accent-amber)',
                  }}>
                    €{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Price Summary */}
          <div style={{
            backgroundColor: 'var(--background-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.95rem',
              fontFamily: 'DM Sans',
              color: 'var(--text-secondary)',
              marginBottom: '0.75rem',
            }}>
              <span>Subtotal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>

            {discountPercent > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.95rem',
                fontFamily: 'DM Sans',
                color: 'var(--success)',
                marginBottom: '0.75rem',
              }}>
                <span>Discount ({discountPercent}%)</span>
                <span>−€{discount.toFixed(2)}</span>
              </div>
            )}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.95rem',
              fontFamily: 'DM Sans',
              color: 'var(--text-secondary)',
              marginBottom: '1rem',
            }}>
              <span>Delivery</span>
              <span>€{delivery.toFixed(2)}</span>
            </div>

            <div style={{
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.5rem',
              fontFamily: 'DM Sans',
              fontWeight: '700',
              color: 'var(--accent-amber)',
            }}>
              <span>Total</span>
              <span>€{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Promo Code */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Promo code"
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                padding: '0.75rem',
                fontSize: '0.95rem',
                fontFamily: 'DM Sans',
                borderRadius: '6px',
              }}
            />
            <button
              onClick={handleApplyPromo}
              disabled={promoApplied}
              style={{
                backgroundColor: promoApplied ? 'transparent' : 'var(--accent-amber)',
                color: promoApplied ? 'var(--success)' : 'var(--background-primary)',
                border: promoApplied ? '1px solid var(--success)' : 'none',
                padding: '0.75rem 1.5rem',
                fontSize: '0.95rem',
                fontFamily: 'DM Sans',
                fontWeight: '600',
                borderRadius: '6px',
                cursor: promoApplied ? 'default' : 'pointer',
              }}
            >
              {promoApplied ? 'Applied' : 'Apply'}
            </button>
          </div>
        </div>

        {/* Right Column - Account/Form */}
        <AnimatePresence mode="wait">
          {stage === 'account' ? (
            <motion.div
              key="account"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              style={{
                backgroundColor: 'var(--background-secondary)',
                border: '1px solid var(--border-subtle)',
                borderTop: '3px solid var(--accent-amber)',
                borderRadius: '12px',
                padding: '2rem',
                height: 'fit-content',
              }}
            >
              <h3 style={{
                fontSize: '1.5rem',
                fontFamily: 'Bebas Neue',
                color: 'var(--text-primary)',
                margin: '0 0 0.5rem 0',
                textTransform: 'uppercase',
              }}>
                Save your order
              </h3>

              <p style={{
                fontSize: '0.95rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                marginBottom: '2rem',
                lineHeight: 1.6,
              }}>
                Create an account to track your delivery and get personalised picks every week.
              </p>

              {/* Email */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontFamily: 'DM Sans',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem',
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--background-tertiary)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontFamily: 'DM Sans',
                    borderRadius: '12px',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-amber)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: '2rem', position: 'relative' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontFamily: 'DM Sans',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem',
                }}>
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--background-tertiary)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontFamily: 'DM Sans',
                    borderRadius: '12px',
                    boxSizing: 'border-box',
                    paddingRight: '2.5rem',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-amber)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '2.5rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>

              {/* Consent Checkbox */}
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
                marginBottom: '1.5rem',
                padding: '1rem',
                backgroundColor: 'var(--background-tertiary)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
              }}>
                <input
                  type="checkbox"
                  id="age-consent"
                  checked={ageConfirmed}
                  onChange={(e) => setAgeConfirmed(e.target.checked)}
                  style={{
                    marginTop: '0.25rem',
                    cursor: 'pointer',
                    width: '18px',
                    height: '18px',
                    accentColor: 'var(--accent-amber)',
                    flexShrink: 0,
                  }}
                />
                <label
                  htmlFor="age-consent"
                  style={{
                    fontSize: '0.875rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    lineHeight: 1.5,
                  }}
                >
                  I agree to the Terms of Service and Privacy Policy, and I certify that I am at least 18 years of age.
                </label>
              </div>

              {/* Create Account */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAccountSubmit(false)}
                disabled={!email || !password || !ageConfirmed}
                style={{
                  width: '100%',
                  backgroundColor: email && password && ageConfirmed ? 'var(--accent-amber)' : 'var(--background-tertiary)',
                  color: email && password && ageConfirmed ? 'var(--background-primary)' : 'var(--text-muted)',
                  border: 'none',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontFamily: 'Bebas Neue',
                  fontWeight: '700',
                  borderRadius: '6px',
                  cursor: email && password && ageConfirmed ? 'pointer' : 'not-allowed',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '1.5rem',
                }}
              >
                Create account & continue
              </motion.button>

              {/* Divider */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-medium)' }} />
                <span style={{
                  fontSize: '0.875rem',
                  fontFamily: 'DM Sans',
                  color: 'var(--text-muted)',
                }}>
                  or
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-medium)' }} />
              </div>

              {/* Guest */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAccountSubmit(true)}
                style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-medium)',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontFamily: 'DM Sans',
                  fontWeight: '600',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginBottom: '1rem',
                }}
              >
                Continue as guest →
              </motion.button>

              {/* Sign In */}
              <p style={{
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-muted)',
                textAlign: 'center',
                margin: 0,
              }}>
                Already have an account?{' '}
                <span style={{
                  color: 'var(--accent-amber)',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}>
                  Sign in
                </span>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="delivery"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h3 style={{
                fontSize: '1.5rem',
                fontFamily: 'Bebas Neue',
                color: 'var(--text-primary)',
                margin: '0 0 2rem 0',
                textTransform: 'uppercase',
              }}>
                Delivery details
              </h3>

              {/* First Name + Last Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.5rem',
                  }}>
                    First name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--background-tertiary)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      padding: '1rem',
                      fontSize: '1rem',
                      fontFamily: 'DM Sans',
                      borderRadius: '12px',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-amber)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.5rem',
                  }}>
                    Last name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--background-tertiary)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      padding: '1rem',
                      fontSize: '1rem',
                      fontFamily: 'DM Sans',
                      borderRadius: '12px',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-amber)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
                  />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontFamily: 'DM Sans',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem',
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--background-tertiary)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontFamily: 'DM Sans',
                    borderRadius: '12px',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-amber)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
                />
              </div>

              {/* Address 1 */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontFamily: 'DM Sans',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem',
                }}>
                  Address
                </label>
                <input
                  type="text"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--background-tertiary)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontFamily: 'DM Sans',
                    borderRadius: '12px',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-amber)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
                />
              </div>

              {/* Address 2 */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontFamily: 'DM Sans',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem',
                }}>
                  Address line 2 (optional)
                </label>
                <input
                  type="text"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--background-tertiary)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontFamily: 'DM Sans',
                    borderRadius: '12px',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-amber)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
                />
              </div>

              {/* City + Postcode */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.5rem',
                  }}>
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--background-tertiary)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      padding: '1rem',
                      fontSize: '1rem',
                      fontFamily: 'DM Sans',
                      borderRadius: '12px',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-amber)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.5rem',
                  }}>
                    Postcode
                  </label>
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--background-tertiary)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      padding: '1rem',
                      fontSize: '1rem',
                      fontFamily: 'DM Sans',
                      borderRadius: '12px',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-amber)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
                  />
                </div>
              </div>

              {/* Country */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontFamily: 'DM Sans',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem',
                }}>
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--background-tertiary)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontFamily: 'DM Sans',
                    borderRadius: '12px',
                    boxSizing: 'border-box',
                  }}
                >
                  <option>Netherlands</option>
                  <option>Germany</option>
                  <option>Belgium</option>
                </select>
              </div>

              {/* Phone */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontFamily: 'DM Sans',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem',
                }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--background-tertiary)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontFamily: 'DM Sans',
                    borderRadius: '12px',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-amber)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
                />
              </div>

              {/* Delivery Note */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontFamily: 'DM Sans',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem',
                }}>
                  Delivery note (optional)
                </label>
                <textarea
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  rows="3"
                  placeholder="Any delivery instructions?"
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--background-tertiary)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontFamily: 'DM Sans',
                    borderRadius: '12px',
                    boxSizing: 'border-box',
                    resize: 'none',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-amber)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
                />
              </div>

              {/* Age Confirmation */}
              <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <input
                  type="checkbox"
                  checked={ageConfirmed}
                  onChange={(e) => setAgeConfirmed(e.target.checked)}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginTop: '2px',
                    cursor: 'pointer',
                    accentColor: 'var(--accent-amber)',
                  }}
                />
                <label style={{
                  fontSize: '0.95rem',
                  fontFamily: 'DM Sans',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                }}>
                  I agree to the Terms of Service and Privacy Policy, and I certify that I am at least 18 years of age.
                </label>
              </div>

              {/* Payment Details Section */}
              <div style={{ marginBottom: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontFamily: 'Bebas Neue',
                  color: 'var(--text-primary)',
                  margin: '0 0 1.5rem 0',
                  textTransform: 'uppercase',
                }}>
                  Payment Details
                </h3>

                {/* Card Number */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.5rem',
                  }}>
                    Card number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => {
                      setCardNumber(formatCardNumber(e.target.value));
                      if (paymentErrors.cardNumber) {
                        setPaymentErrors({ ...paymentErrors, cardNumber: '' });
                      }
                    }}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--background-tertiary)',
                      border: paymentErrors.cardNumber ? '1px solid var(--error)' : '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      padding: '1rem',
                      fontSize: '1rem',
                      fontFamily: 'DM Sans',
                      borderRadius: '12px',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => e.target.style.borderColor = paymentErrors.cardNumber ? 'var(--error)' : 'var(--accent-amber)'}
                    onBlur={(e) => e.target.style.borderColor = paymentErrors.cardNumber ? 'var(--error)' : 'var(--border-medium)'}
                  />
                  {paymentErrors.cardNumber && (
                    <p style={{
                      fontSize: '0.75rem',
                      fontFamily: 'DM Sans',
                      color: 'var(--error)',
                      margin: '0.5rem 0 0 0',
                    }}>
                      {paymentErrors.cardNumber}
                    </p>
                  )}
                </div>

                {/* Expiry + CVV */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontFamily: 'DM Sans',
                      color: 'var(--text-secondary)',
                      marginBottom: '0.5rem',
                    }}>
                      Expiry date
                    </label>
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={(e) => {
                        setExpiryDate(formatExpiryDate(e.target.value));
                        if (paymentErrors.expiryDate) {
                          setPaymentErrors({ ...paymentErrors, expiryDate: '' });
                        }
                      }}
                      placeholder="MM / YY"
                      maxLength="7"
                      style={{
                        width: '100%',
                        backgroundColor: 'var(--background-tertiary)',
                        border: paymentErrors.expiryDate ? '1px solid var(--error)' : '1px solid var(--border-medium)',
                        color: 'var(--text-primary)',
                        padding: '1rem',
                        fontSize: '1rem',
                        fontFamily: 'DM Sans',
                        borderRadius: '12px',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => e.target.style.borderColor = paymentErrors.expiryDate ? 'var(--error)' : 'var(--accent-amber)'}
                      onBlur={(e) => e.target.style.borderColor = paymentErrors.expiryDate ? 'var(--error)' : 'var(--border-medium)'}
                    />
                    {paymentErrors.expiryDate && (
                      <p style={{
                        fontSize: '0.75rem',
                        fontFamily: 'DM Sans',
                        color: 'var(--error)',
                        margin: '0.5rem 0 0 0',
                      }}>
                        {paymentErrors.expiryDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontFamily: 'DM Sans',
                      color: 'var(--text-secondary)',
                      marginBottom: '0.5rem',
                    }}>
                      CVV
                    </label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                        setCvv(value);
                        if (paymentErrors.cvv) {
                          setPaymentErrors({ ...paymentErrors, cvv: '' });
                        }
                      }}
                      placeholder="•••"
                      maxLength="3"
                      style={{
                        width: '100%',
                        backgroundColor: 'var(--background-tertiary)',
                        border: paymentErrors.cvv ? '1px solid var(--error)' : '1px solid var(--border-medium)',
                        color: 'var(--text-primary)',
                        padding: '1rem',
                        fontSize: '1rem',
                        fontFamily: 'DM Sans',
                        borderRadius: '12px',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => e.target.style.borderColor = paymentErrors.cvv ? 'var(--error)' : 'var(--accent-amber)'}
                      onBlur={(e) => e.target.style.borderColor = paymentErrors.cvv ? 'var(--error)' : 'var(--border-medium)'}
                    />
                    {paymentErrors.cvv && (
                      <p style={{
                        fontSize: '0.75rem',
                        fontFamily: 'DM Sans',
                        color: 'var(--error)',
                        margin: '0.5rem 0 0 0',
                      }}>
                        {paymentErrors.cvv}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Icons */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  marginBottom: '1rem',
                  alignItems: 'center',
                }}>
                  <span style={{
                    backgroundColor: 'rgba(232, 146, 10, 0.1)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--accent-amber)',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontFamily: 'DM Sans',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}>
                    Visa
                  </span>
                  <span style={{
                    backgroundColor: 'rgba(232, 146, 10, 0.1)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--accent-amber)',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontFamily: 'DM Sans',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}>
                    Mastercard
                  </span>
                  <span style={{
                    backgroundColor: 'rgba(232, 146, 10, 0.1)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--accent-amber)',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontFamily: 'DM Sans',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}>
                    Amex
                  </span>
                </div>

                {/* SSL Security */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontFamily: 'DM Sans',
                  color: 'var(--text-muted)',
                }}>
                  <span style={{ fontSize: '1rem' }}>🔒</span>
                  <span>Secured with 256-bit SSL encryption</span>
                </div>
              </div>

              {/* Place Order */}
              <motion.button
                whileHover={ageConfirmed && firstName && lastName && email && address1 && city && postcode && cardNumber && expiryDate && cvv ? { scale: 1.02 } : {}}
                whileTap={ageConfirmed && firstName && lastName && email && address1 && city && postcode && cardNumber && expiryDate && cvv ? { scale: 0.98 } : {}}
                onClick={handleDeliverySubmit}
                disabled={!ageConfirmed || !firstName || !lastName || !email || !address1 || !city || !postcode || !cardNumber || !expiryDate || !cvv}
                style={{
                  width: '100%',
                  backgroundColor:
                    ageConfirmed && firstName && lastName && email && address1 && city && postcode && cardNumber && expiryDate && cvv
                      ? 'var(--accent-amber)'
                      : 'var(--background-tertiary)',
                  color:
                    ageConfirmed && firstName && lastName && email && address1 && city && postcode && cardNumber && expiryDate && cvv
                      ? 'var(--background-primary)'
                      : 'var(--text-muted)',
                  border: 'none',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontFamily: 'Bebas Neue',
                  fontWeight: '700',
                  borderRadius: '6px',
                  cursor:
                    ageConfirmed && firstName && lastName && email && address1 && city && postcode
                      ? 'pointer'
                      : 'not-allowed',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Place order →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
