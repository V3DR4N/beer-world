import { useState, useContext } from 'react';
import { BrewerSessionContext } from '../../context/BrewerSessionContext';

const Toast = ({ message, type, onClose }) => {
  useState(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? '#2D7A4F' : '#C0392B';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        backgroundColor: bgColor,
        color: '#fff',
        padding: '1rem 1.5rem',
        borderRadius: '4px',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '0.875rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
      }}
    >
      {message}
    </div>
  );
};

export default function BreweryProfileSection() {
  const { brewerData } = useContext(BrewerSessionContext);
  const [formData, setFormData] = useState(
    brewerData || {
      name: '',
      foundedYear: '',
      location: '',
      description: '',
      email: '',
      phone: '',
    }
  );
  const [toast, setToast] = useState(null);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send data to backend
    // For now, it just shows a toast
    setToast({ message: 'Profile updated successfully!', type: 'success' });
  };

  return (
    <div>
      <h1
        style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: '2rem',
          letterSpacing: '1px',
          color: 'var(--text-primary)',
          margin: '0 0 2rem 0',
        }}
      >
        Brewery Profile
      </h1>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            backgroundColor: 'var(--background-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '2rem',
            maxWidth: '600px',
          }}
        >
          {/* Brewery Name */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
                fontWeight: '500',
              }}
            >
              Brewery Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                backgroundColor: 'var(--background-tertiary)',
                color: 'var(--text-primary)',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Founded Year */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
                fontWeight: '500',
              }}
            >
              Founded Year
            </label>
            <input
              type="number"
              value={formData.foundedYear}
              onChange={(e) => handleChange('foundedYear', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                backgroundColor: 'var(--background-tertiary)',
                color: 'var(--text-primary)',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Location */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
                fontWeight: '500',
              }}
            >
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                backgroundColor: 'var(--background-tertiary)',
                color: 'var(--text-primary)',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Description/Tagline */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
                fontWeight: '500',
              }}
            >
              Description / Tagline
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows="4"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                backgroundColor: 'var(--background-tertiary)',
                color: 'var(--text-primary)',
                boxSizing: 'border-box',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
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
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                backgroundColor: 'var(--background-tertiary)',
                color: 'var(--text-primary)',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
                fontWeight: '500',
              }}
            >
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                backgroundColor: 'var(--background-tertiary)',
                color: 'var(--text-primary)',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Photo Upload (UI only) */}
          <div style={{ marginBottom: '2rem' }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
                fontWeight: '500',
              }}
            >
              Brewery Photo
            </label>
            <input
              type="file"
              accept="image/*"
              disabled
              style={{
                width: '100%',
                padding: '0.75rem',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                backgroundColor: 'var(--background-tertiary)',
                color: 'var(--text-secondary)',
                boxSizing: 'border-box',
                opacity: '0.6',
              }}
            />
            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                margin: '0.5rem 0 0 0',
              }}
            >
              (UI only - no actual upload)
            </p>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: 'var(--accent-amber)',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '0.875rem',
              letterSpacing: '1px',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            SAVE CHANGES
          </button>
        </div>
      </form>

      {/* Toast Notification */}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
