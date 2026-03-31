import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/ui/Logo';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    setError('');

    // Retrieve user from localStorage
    const userStr = localStorage.getItem('beerworld_user');
    if (!userStr) {
      setError('Email or password incorrect. Try again.');
      return;
    }

    try {
      const user = JSON.parse(userStr);

      // Validate email and password
      if (user.email === email && user.password === password) {
        // Store session
        localStorage.setItem(
          'beerworld_session',
          JSON.stringify({
            firstName: user.firstName,
            email: user.email,
          })
        );
        navigate('/discover');
      } else {
        setError('Email or password incorrect. Try again.');
      }
    } catch (e) {
      setError('Email or password incorrect. Try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ marginBottom: '3rem' }}
      >
        <Logo variant="icon" />
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{
          backgroundColor: 'var(--background-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '3rem',
          maxWidth: '450px',
          width: '100%',
        }}
      >
        {/* Heading */}
        <h1
          style={{
            fontSize: '2.5rem',
            fontFamily: 'Bebas Neue',
            color: 'var(--text-primary)',
            margin: '0 0 0.5rem 0',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Welcome back
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '1rem',
            fontFamily: 'DM Sans',
            color: 'var(--text-secondary)',
            margin: '0 0 2rem 0',
          }}
        >
          Sign in to your Beer World account
        </p>

        {/* Form */}
        <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Email Input */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-muted)',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'var(--background-primary)',
                border: '1px solid var(--border-medium)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontFamily: 'DM Sans',
                fontSize: '1rem',
                boxSizing: 'border-box',
                transition: 'border-color 200ms ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-amber)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-medium)';
              }}
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-muted)',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  paddingRight: '2.5rem',
                  backgroundColor: 'var(--background-primary)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontFamily: 'DM Sans',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  transition: 'border-color 200ms ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-amber)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-medium)';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  color: 'var(--text-muted)',
                  padding: '0.25rem',
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <p
                style={{
                  fontSize: '0.875rem',
                  fontFamily: 'DM Sans',
                  color: '#EF4444',
                  margin: '0.5rem 0 0 0',
                }}
              >
                {error}
              </p>
            )}
          </div>

          {/* Sign In Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            style={{
              backgroundColor: 'var(--accent-amber)',
              color: 'var(--background-primary)',
              border: 'none',
              padding: '0.75rem',
              fontSize: '1rem',
              fontFamily: 'Bebas Neue',
              fontWeight: '700',
              borderRadius: '6px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginTop: '0.5rem',
              transition: 'all 200ms ease',
            }}
          >
            Sign in
          </motion.button>
        </form>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            margin: '2rem 0',
          }}
        >
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
        </div>

        {/* Create Account Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/register')}
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            color: 'var(--accent-amber)',
            border: '1px solid var(--accent-amber)',
            padding: '0.75rem',
            fontSize: '1rem',
            fontFamily: 'DM Sans',
            fontWeight: '600',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            marginBottom: '1rem',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(232, 146, 10, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Create an account
        </motion.button>

        {/* Guest Link */}
        <button
          onClick={() => navigate('/discover')}
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            border: 'none',
            fontSize: '0.95rem',
            fontFamily: 'DM Sans',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'color 200ms ease',
            padding: '0.5rem 0',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--accent-amber)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          Continue as guest →
        </button>
      </motion.div>
    </motion.div>
  );
}
