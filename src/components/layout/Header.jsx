import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useBasket } from '../../hooks/useBasket';
import Logo from '../ui/Logo';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useBasket();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef(null);

  useEffect(() => {
    const sessionStr = localStorage.getItem('beerworld_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        setUser(session);
      } catch (e) {
        console.error('Error parsing session:', e);
      }
    }
  }, [location]);

  const handleSignOut = () => {
    localStorage.removeItem('beerworld_session');
    setUser(null);
    navigate('/discover');
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    logoClickCount.current += 1;

    // Clear existing timer
    if (logoClickTimer.current) {
      clearTimeout(logoClickTimer.current);
    }

    // If triple-clicked, trigger demo controls
    if (logoClickCount.current === 3) {
      window.dispatchEvent(new CustomEvent('beerworld_demo_trigger'));
      logoClickCount.current = 0;
      return;
    }

    // Reset counter and handle click count after 500ms
    logoClickTimer.current = setTimeout(() => {
      if (logoClickCount.current === 1) {
        // Single click - navigate to discover
        navigate('/discover');
      }
      logoClickCount.current = 0;
    }, 500);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinkStyle = (path) => ({
    color: 'var(--text-primary)',
    textDecoration: 'none',
    paddingBottom: '0.5rem',
    borderBottom: isActive(path) ? '1px solid var(--accent-amber)' : 'none',
    transition: 'border-bottom 200ms ease',
  });

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      backgroundColor: 'var(--background-secondary)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '2rem',
    }}>
      <div
        onClick={handleLogoClick}
        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
      >
        <Logo variant="icon" />
      </div>

      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <Link to="/discover" style={navLinkStyle('/discover')}>Discover</Link>
        <Link to="/breweries" style={navLinkStyle('/breweries')}>Breweries</Link>
        <Link to="/about" style={navLinkStyle('/about')}>About</Link>
      </nav>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <button
          onClick={toggleTheme}
          style={{
            backgroundColor: 'var(--background-tertiary)',
            color: 'var(--accent-amber)',
            border: '1px solid var(--border-medium)',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* User Authentication */}
        {user ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{
              fontSize: '0.95rem',
              fontFamily: 'DM Sans',
              color: 'var(--text-primary)',
            }}>
              {user.firstName}
            </span>
            <button
              onClick={handleSignOut}
              style={{
                backgroundColor: 'transparent',
                color: 'var(--text-primary)',
                border: 'none',
                fontSize: '0.95rem',
                fontFamily: 'DM Sans',
                cursor: 'pointer',
                textDecoration: 'underline',
                transition: 'color 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-amber)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            style={{
              fontSize: '0.95rem',
              fontFamily: 'DM Sans',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              cursor: 'pointer',
              borderBottom: '1px solid transparent',
              transition: 'border-bottom 200ms ease',
              paddingBottom: '0.25rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderBottomColor = 'var(--accent-amber)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderBottomColor = 'transparent';
            }}
          >
            Sign in
          </Link>
        )}

        <Link to="/checkout" style={{ position: 'relative', display: 'flex' }}>
          <span style={{ fontSize: '24px', color: 'var(--accent-amber)' }}>🛒</span>
          {itemCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: 'var(--accent-amber)',
              color: 'var(--background-primary)',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
            }}>
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
