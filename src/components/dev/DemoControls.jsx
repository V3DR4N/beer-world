import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function DemoControls() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load panel state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('beerworld_demo_open');
    if (saved === 'true') setIsOpen(true);
  }, []);

  // Listen for demo trigger event (from triple-click)
  useEffect(() => {
    const handleTrigger = () => {
      setIsOpen(true);
      localStorage.setItem('beerworld_demo_open', 'true');
    };
    window.addEventListener('beerworld_demo_trigger', handleTrigger);
    return () => window.removeEventListener('beerworld_demo_trigger', handleTrigger);
  }, []);

  // Load current profile from cookie
  useEffect(() => {
    const profileCookie = Cookies.get('beerworld_profile');
    if (profileCookie) {
      try {
        const profile = JSON.parse(profileCookie);
        setCurrentProfile(profile.id);
      } catch {
        setCurrentProfile(null);
      }
    } else {
      setCurrentProfile(null);
    }
  }, []);

  // Load login status from localStorage
  useEffect(() => {
    const session = localStorage.getItem('beerworld_session');
    setIsLoggedIn(!!session);
  }, []);

  const handleProfileClick = (profileId) => {
    if (profileId === 'none') {
      Cookies.remove('beerworld_profile');
      setCurrentProfile(null);
    } else {
      const profiles = {
        'explorer': { id: 'explorer', name: 'The Explorer' },
        'connoisseur': { id: 'connoisseur', name: 'The Connoisseur' },
        'easy-drinker': { id: 'easy-drinker', name: 'Easy Drinker' },
      };
      Cookies.set('beerworld_profile', JSON.stringify(profiles[profileId]), { expires: 30 });
      setCurrentProfile(profileId);
    }
    // Refresh page to update discovery feed
    window.location.reload();
  };

  const handleReset = () => {
    Cookies.remove('beerworld_profile');
    localStorage.removeItem('beerworld_basket');
    localStorage.removeItem('beerworld_theme');
    navigate('/quiz');
  };

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem('beerworld_demo_open', newState.toString());
  };

  const handleNavigate = (route) => {
    navigate(route);
    setIsOpen(false);
  };

  const handleLoginToggle = () => {
    if (isLoggedIn) {
      // Logged out
      localStorage.removeItem('beerworld_session');
      setIsLoggedIn(false);
    } else {
      // Logged in
      localStorage.setItem(
        'beerworld_session',
        JSON.stringify({
          firstName: 'Demo',
          email: 'demo@beerworld.com',
        })
      );
      setIsLoggedIn(true);
    }
    window.location.reload();
  };

  // Only render in development mode
  if (!import.meta.env.DEV) return null;

  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 9999,
        backgroundColor: 'var(--background-secondary)',
        borderRadius: '12px',
        padding: '16px',
        minWidth: '320px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
        borderTop: '3px solid var(--accent-amber)',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <div style={{
          fontSize: '10px',
          fontFamily: 'Bebas Neue',
          color: 'var(--accent-amber)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontWeight: '700',
        }}>
          Demo Controls
        </div>
        <button
          onClick={handleToggle}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '0',
          }}
        >
          ×
        </button>
      </div>

      {/* Quiz Profile Section */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          fontSize: '12px',
          fontFamily: 'DM Sans',
          color: 'var(--text-muted)',
          marginBottom: '8px',
          textTransform: 'uppercase',
          fontWeight: '600',
        }}>
          Quiz profile
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
        }}>
          <button
            onClick={() => handleProfileClick('explorer')}
            style={{
              padding: '8px 12px',
              fontSize: '12px',
              fontFamily: 'DM Sans',
              fontWeight: '600',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: currentProfile === 'explorer' ? 'var(--accent-amber)' : 'var(--background-tertiary)',
              color: currentProfile === 'explorer' ? 'var(--background-primary)' : 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            Explorer
          </button>
          <button
            onClick={() => handleProfileClick('connoisseur')}
            style={{
              padding: '8px 12px',
              fontSize: '12px',
              fontFamily: 'DM Sans',
              fontWeight: '600',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: currentProfile === 'connoisseur' ? 'var(--accent-amber)' : 'var(--background-tertiary)',
              color: currentProfile === 'connoisseur' ? 'var(--background-primary)' : 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            Connoisseur
          </button>
          <button
            onClick={() => handleProfileClick('easy-drinker')}
            style={{
              padding: '8px 12px',
              fontSize: '12px',
              fontFamily: 'DM Sans',
              fontWeight: '600',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: currentProfile === 'easy-drinker' ? 'var(--accent-amber)' : 'var(--background-tertiary)',
              color: currentProfile === 'easy-drinker' ? 'var(--background-primary)' : 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            Easy Drinker
          </button>
          <button
            onClick={() => handleProfileClick('none')}
            style={{
              padding: '8px 12px',
              fontSize: '12px',
              fontFamily: 'DM Sans',
              fontWeight: '600',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: currentProfile === null ? 'var(--accent-amber)' : 'var(--background-tertiary)',
              color: currentProfile === null ? 'var(--background-primary)' : 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            No quiz
          </button>
        </div>
      </div>

      {/* Reset Button */}
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={handleReset}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '12px',
            fontFamily: 'DM Sans',
            fontWeight: '600',
            borderRadius: '6px',
            border: '2px solid var(--accent-amber)',
            backgroundColor: 'transparent',
            color: 'var(--accent-amber)',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            textTransform: 'uppercase',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-amber)';
            e.currentTarget.style.color = 'var(--background-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--accent-amber)';
          }}
        >
          Reset everything → /quiz
        </button>
      </div>

      {/* Login/Logout Toggle */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          fontSize: '12px',
          fontFamily: 'DM Sans',
          color: 'var(--text-muted)',
          marginBottom: '8px',
          textTransform: 'uppercase',
          fontWeight: '600',
        }}>
          Authentication
        </div>
        <button
          onClick={handleLoginToggle}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '12px',
            fontFamily: 'DM Sans',
            fontWeight: '600',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: isLoggedIn ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            color: isLoggedIn ? '#22C55E' : '#EF4444',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            textTransform: 'uppercase',
          }}
        >
          {isLoggedIn ? '✓ Logged in' : '✗ Logged out'}
        </button>
      </div>

      {/* Quick Navigate Section */}
      <div>
        <div style={{
          fontSize: '12px',
          fontFamily: 'DM Sans',
          color: 'var(--text-muted)',
          marginBottom: '8px',
          textTransform: 'uppercase',
          fontWeight: '600',
        }}>
          Jump to
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: '8px',
        }}>
          <button
            onClick={() => handleNavigate('/quiz')}
            style={{
              padding: '8px 12px',
              fontSize: '11px',
              fontFamily: 'DM Sans',
              fontWeight: '600',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--background-tertiary)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            Quiz
          </button>
          <button
            onClick={() => handleNavigate('/discover')}
            style={{
              padding: '8px 12px',
              fontSize: '11px',
              fontFamily: 'DM Sans',
              fontWeight: '600',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--background-tertiary)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            Discover
          </button>
          <button
            onClick={() => handleNavigate('/brewer/de-wilde-hop')}
            style={{
              padding: '8px 12px',
              fontSize: '11px',
              fontFamily: 'DM Sans',
              fontWeight: '600',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--background-tertiary)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            Brewer
          </button>
          <button
            onClick={() => handleNavigate('/checkout')}
            style={{
              padding: '8px 12px',
              fontSize: '11px',
              fontFamily: 'DM Sans',
              fontWeight: '600',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--background-tertiary)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
