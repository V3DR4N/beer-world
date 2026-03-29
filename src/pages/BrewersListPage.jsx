import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import brewers from '../data/brewers.json';

export default function BrewersListPage() {
  const navigate = useNavigate();

  const handleBrewerClick = (brewerId) => {
    navigate(`/brewer/${brewerId}`);
  };

  return (
    <div style={{ backgroundColor: 'var(--background-primary)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          padding: '3rem 2rem',
          backgroundColor: 'var(--background-secondary)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '2.75rem',
            fontFamily: 'Bebas Neue',
            color: 'var(--accent-amber)',
            margin: '0 0 1rem 0',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}>
            Craft Breweries
          </h1>

          <p style={{
            fontSize: '1.125rem',
            fontFamily: 'DM Sans',
            color: 'var(--accent-cream)',
            margin: 0,
          }}>
            Meet the brewers behind the beers.
          </p>
        </div>
      </motion.section>

      {/* Breweries Grid */}
      <section style={{ padding: '3rem 2rem', backgroundColor: 'var(--background-primary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {brewers.map((brewer, index) => (
              <motion.div
                key={brewer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => handleBrewerClick(brewer.id)}
                style={{
                  backgroundColor: 'var(--background-secondary)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-amber)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Image */}
                <div style={{
                  width: '100%',
                  paddingBottom: '56.25%',
                  position: 'relative',
                  backgroundColor: 'var(--background-tertiary)',
                  overflow: 'hidden',
                }}>
                  <img
                    src={brewer.imageUrl}
                    alt={brewer.name}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.backgroundColor = '#1A1A1A';
                    }}
                  />
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontFamily: 'Bebas Neue',
                    color: 'var(--text-primary)',
                    margin: '0 0 0.5rem 0',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    {brewer.name}
                  </h3>

                  <p style={{
                    fontSize: '0.875rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-muted)',
                    margin: '0 0 1rem 0',
                  }}>
                    📍 {brewer.location}
                  </p>

                  <p style={{
                    fontSize: '1rem',
                    fontFamily: 'DM Sans',
                    fontStyle: 'italic',
                    color: 'var(--text-secondary)',
                    margin: '0 0 1rem 0',
                    lineHeight: 1.6,
                  }}>
                    {brewer.tagline}
                  </p>

                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                  }}>
                    {brewer.styles.slice(0, 2).map((style) => (
                      <span
                        key={style}
                        style={{
                          fontSize: '0.7rem',
                          fontFamily: 'DM Sans',
                          color: 'var(--accent-amber)',
                          backgroundColor: 'rgba(232, 146, 10, 0.1)',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '4px',
                        }}
                      >
                        {style}
                      </span>
                    ))}
                    {brewer.styles.length > 2 && (
                      <span style={{
                        fontSize: '0.7rem',
                        fontFamily: 'DM Sans',
                        color: 'var(--text-muted)',
                      }}>
                        +{brewer.styles.length - 2} more
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBrewerClick(brewer.id);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: 'var(--accent-amber)',
                      color: 'var(--background-primary)',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.95rem',
                      fontFamily: 'DM Sans',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 200ms ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent-amber-light)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent-amber)';
                    }}
                  >
                    Visit Brewery
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
