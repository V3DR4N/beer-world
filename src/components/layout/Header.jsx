import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useBasket } from '../../hooks/useBasket';
import Logo from '../ui/Logo';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useBasket();
  const location = useLocation();

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
      backgroundColor: 'var(--background-secondary)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '2rem',
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <Logo variant="icon" />
      </Link>

      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <Link to="/discover" style={navLinkStyle('/discover')}>Discover</Link>
        <Link to="/breweries" style={navLinkStyle('/breweries')}>Breweries</Link>
        <Link to="/about" style={navLinkStyle('/about')}>About</Link>
      </nav>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
