import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrewerSessionContext } from '../context/BrewerSessionContext';

export default function BrewerPortalLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(BrewerSessionContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email);
    navigate('/brewer-portal/dashboard');
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--background-primary)',
        padding: '2rem',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--background-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '3rem',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Logo/Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '2rem',
              letterSpacing: '2px',
              color: 'var(--text-primary)',
              margin: '0 0 0.5rem 0',
            }}
          >
            BEER WORLD
          </h1>
          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              margin: '0',
            }}
          >
            Brewer Portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
                fontWeight: '500',
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@schwarzwald-brauhaus.de"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                backgroundColor: 'var(--background-tertiary)',
                color: 'var(--text-primary)',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-amber)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-subtle)';
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '2rem' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
                fontWeight: '500',
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                backgroundColor: 'var(--background-tertiary)',
                color: 'var(--text-primary)',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-amber)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-subtle)';
              }}
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '0.875rem',
              letterSpacing: '1px',
              backgroundColor: 'var(--accent-amber)',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = '1';
            }}
          >
            SIGN IN
          </button>
        </form>

        {/* Contact Note */}
        <p
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            textAlign: 'center',
            marginTop: '2rem',
            margin: '2rem 0 0 0',
          }}
        >
          Don't have an account?{' '}
          <a
            href="mailto:hello@beerworld.com"
            style={{
              color: 'var(--accent-amber)',
              textDecoration: 'none',
              fontWeight: '500',
            }}
          >
            Contact hello@beerworld.com
          </a>
        </p>
      </div>
    </div>
  );
}
