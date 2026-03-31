import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/ui/Logo';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  const handleCreateAccount = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!ageConfirmed) {
      setError('Please agree to the Terms of Service and confirm your age');
      return;
    }

    // Check if user already exists
    const existingUser = localStorage.getItem('beerworld_user');
    if (existingUser) {
      try {
        const user = JSON.parse(existingUser);
        if (user.email === email) {
          setError('This email is already registered');
          return;
        }
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }

    // Store user in localStorage
    const newUser = {
      firstName,
      lastName,
      email,
      password,
    };
    localStorage.setItem('beerworld_user', JSON.stringify(newUser));

    // Store session
    localStorage.setItem(
      'beerworld_session',
      JSON.stringify({
        firstName: newUser.firstName,
        email: newUser.email,
      })
    );

    navigate('/discover');
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
            margin: '0 0 1rem 0',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Create your account
        </h1>

        {/* Form */}
        <form onSubmit={handleCreateAccount} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* First Name Input */}
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
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
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

          {/* Last Name Input */}
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
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
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

          {/* Consent Checkbox */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start',
            padding: '1rem',
            backgroundColor: 'var(--background-primary)',
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

          {/* Create Account Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!ageConfirmed}
            style={{
              backgroundColor: ageConfirmed ? 'var(--accent-amber)' : 'var(--background-tertiary)',
              color: ageConfirmed ? 'var(--background-primary)' : 'var(--text-muted)',
              border: 'none',
              padding: '0.75rem',
              fontSize: '1rem',
              fontFamily: 'Bebas Neue',
              fontWeight: '700',
              borderRadius: '6px',
              cursor: ageConfirmed ? 'pointer' : 'not-allowed',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginTop: '0.5rem',
              transition: 'all 200ms ease',
            }}
          >
            Create account
          </motion.button>
        </form>

        {/* Sign In Link */}
        <p
          style={{
            fontSize: '0.95rem',
            fontFamily: 'DM Sans',
            color: 'var(--text-secondary)',
            textAlign: 'center',
            margin: '2rem 0 0 0',
          }}
        >
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--accent-amber)',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.95rem',
              fontFamily: 'DM Sans',
              transition: 'opacity 200ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            Sign in
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
}
