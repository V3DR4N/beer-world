import { useState } from 'react';
import { BREWER_BEERS } from '../../data/brewerPortalMockData';

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

const BeerForm = ({ beer, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    beer || {
      name: '',
      style: 'IPA',
      abv: '',
      volume: '',
      price: '',
      inStock: true,
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div
      style={{
        fixed: 'true',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        zIndex: 999,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: 'var(--background-secondary)',
          borderRadius: '8px',
          padding: '2rem',
          maxWidth: '500px',
          width: '100%',
          border: '1px solid var(--border-subtle)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '1.5rem',
            letterSpacing: '1px',
            color: 'var(--text-primary)',
            margin: '0 0 1.5rem 0',
          }}
        >
          {beer ? 'EDIT BEER' : 'ADD NEW BEER'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Name */}
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
              }}
            >
              Beer Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              required
            />
          </div>

          {/* Style */}
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
              }}
            >
              Style
            </label>
            <select
              value={formData.style}
              onChange={(e) => setFormData({ ...formData, style: e.target.value })}
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
            >
              <option>IPA</option>
              <option>Stout</option>
              <option>Lager</option>
              <option>Wheat Beer</option>
              <option>Sour</option>
              <option>Other</option>
            </select>
          </div>

          {/* ABV */}
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
              }}
            >
              ABV (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.abv}
              onChange={(e) => setFormData({ ...formData, abv: e.target.value })}
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
              required
            />
          </div>

          {/* Volume */}
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
              }}
            >
              Volume (mL)
            </label>
            <input
              type="number"
              value={formData.volume}
              onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
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
              required
            />
          </div>

          {/* Price */}
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
              }}
            >
              Price (€)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
              required
            />
          </div>

          {/* In Stock */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                style={{ cursor: 'pointer' }}
              />
              In Stock
            </label>
          </div>

          {/* Photo Upload (UI only) */}
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
              }}
            >
              Beer Photo
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

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '0.75rem',
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
              SAVE
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: 'transparent',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: '0.875rem',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--background-tertiary)')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function MyBeersSection() {
  const [beers, setBeers] = useState(BREWER_BEERS);
  const [showForm, setShowForm] = useState(false);
  const [editingBeer, setEditingBeer] = useState(null);
  const [toast, setToast] = useState(null);

  const handleAddBeer = (formData) => {
    const newBeer = {
      id: `beer-${Date.now()}`,
      ...formData,
    };
    setBeers([...beers, newBeer]);
    setShowForm(false);
    setToast({ message: 'Beer added successfully!', type: 'success' });
  };

  const handleEditBeer = (formData) => {
    setBeers(beers.map((b) => (b.id === editingBeer.id ? { ...editingBeer, ...formData } : b)));
    setEditingBeer(null);
    setShowForm(false);
    setToast({ message: 'Beer updated successfully!', type: 'success' });
  };

  const handleRemoveBeer = (beerId) => {
    if (window.confirm('Are you sure you want to remove this beer?')) {
      setBeers(beers.filter((b) => b.id !== beerId));
      setToast({ message: 'Beer removed successfully!', type: 'success' });
    }
  };

  const handleFormSubmit = (formData) => {
    if (editingBeer) {
      handleEditBeer(formData);
    } else {
      handleAddBeer(formData);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1
          style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '2rem',
            letterSpacing: '1px',
            color: 'var(--text-primary)',
            margin: '0',
          }}
        >
          My Beers
        </h1>
        <button
          onClick={() => {
            setEditingBeer(null);
            setShowForm(true);
          }}
          style={{
            padding: '0.75rem 1.5rem',
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
          + ADD NEW BEER
        </button>
      </div>

      {/* Beers List */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {beers.map((beer) => (
          <div
            key={beer.id}
            style={{
              backgroundColor: 'var(--background-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--background-tertiary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
            }}
          >
            <div>
              <h3
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '1.25rem',
                  letterSpacing: '0.5px',
                  color: 'var(--text-primary)',
                  margin: '0 0 0.5rem 0',
                }}
              >
                {beer.name}
              </h3>
              <div
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <span>{beer.style}</span>
                <span>{beer.abv}% ABV</span>
                <span>{beer.volume}mL</span>
                <span>€{beer.price.toFixed(2)}</span>
                <span>{beer.inStock ? '✓ In Stock' : '✗ Out of Stock'}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  setEditingBeer(beer);
                  setShowForm(true);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  color: 'var(--accent-amber)',
                  border: '1px solid var(--accent-amber)',
                  borderRadius: '4px',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--accent-amber)';
                  e.target.style.color = '#000';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--accent-amber)';
                }}
              >
                EDIT
              </button>
              <button
                onClick={() => handleRemoveBeer(beer.id)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  color: '#C0392B',
                  border: '1px solid #C0392B',
                  borderRadius: '4px',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#C0392B';
                  e.target.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#C0392B';
                }}
              >
                REMOVE
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <BeerForm
          beer={editingBeer}
          onSave={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingBeer(null);
          }}
        />
      )}

      {/* Toast Notification */}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
