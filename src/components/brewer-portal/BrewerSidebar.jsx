import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrewerSessionContext } from '../../context/BrewerSessionContext';

const SECTIONS = [
  { key: 'overview', label: 'OVERVIEW' },
  { key: 'my-beers', label: 'MY BEERS' },
  { key: 'inventory', label: 'INVENTORY' },
  { key: 'profile', label: 'BREWERY PROFILE' },
  { key: 'orders', label: 'ORDERS' },
];

export default function BrewerSidebar({ activeSection, setActiveSection }) {
  const navigate = useNavigate();
  const { brewerEmail, logout } = useContext(BrewerSessionContext);

  const handleLogout = () => {
    logout();
    navigate('/brewer-portal');
  };

  return (
    <div
      style={{
        width: '250px',
        backgroundColor: 'var(--background-secondary)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        overflowY: 'auto',
      }}
    >
      {/* Sidebar Header */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <h2
          style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '0.875rem',
            letterSpacing: '1px',
            color: 'var(--text-secondary)',
            margin: '0 0 0.5rem 0',
            textTransform: 'uppercase',
          }}
        >
          MENU
        </h2>
      </div>

      {/* Navigation Items */}
      <nav style={{ flex: 1, padding: '1rem 0' }}>
        {SECTIONS.map((section) => (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key)}
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              backgroundColor:
                activeSection === section.key
                  ? 'var(--background-tertiary)'
                  : 'transparent',
              border: 'none',
              borderLeft:
                activeSection === section.key
                  ? `4px solid var(--accent-amber)`
                  : '4px solid transparent',
              color: 'var(--text-primary)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.875rem',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'background-color 0.2s, border-left-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (activeSection !== section.key) {
                e.target.style.backgroundColor = 'var(--background-tertiary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeSection !== section.key) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            {section.label}
          </button>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '1.5rem',
          marginTop: 'auto',
        }}
      >
        {/* User Email */}
        <p
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            margin: '0 0 1rem 0',
            wordBreak: 'break-word',
          }}
        >
          {brewerEmail}
        </p>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: 'transparent',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            color: 'var(--text-primary)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.75rem',
            cursor: 'pointer',
            marginBottom: '0.75rem',
            transition: 'background-color 0.2s, border-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--background-tertiary)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          LOGOUT
        </button>

        {/* Back to Beer World Link */}
        <a
          href="/discover"
          style={{
            display: 'block',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.75rem',
            color: 'var(--accent-amber)',
            textDecoration: 'none',
            textAlign: 'center',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = '0.8';
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = '1';
          }}
        >
          ← Back to Beer World
        </a>
      </div>
    </div>
  );
}
