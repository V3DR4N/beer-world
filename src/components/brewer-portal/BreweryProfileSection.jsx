import { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrewerSessionContext } from '../../context/BrewerSessionContext';
import brewers from '../../data/brewers.json';

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

// Preview Modal Component
const ContentPreviewModal = ({ isOpen, onClose, brewerName, story, philosophy }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '2rem',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'var(--background-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
            padding: '2rem',
          }}
        >
          <h2
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '1.5rem',
              color: 'var(--text-primary)',
              marginBottom: '2rem',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            Preview: {brewerName}
          </h2>

          {/* Our Story Section */}
          <div style={{ marginBottom: '2rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontFamily: 'Bebas Neue',
                color: 'var(--accent-amber)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '1rem',
                display: 'block',
              }}
            >
              Our Story
            </span>
            <p
              style={{
                fontSize: '1.125rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-primary)',
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              {story || '(No story set yet)'}
            </p>
          </div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--border-subtle)',
              margin: '2rem 0',
            }}
          />

          {/* Our Philosophy Section */}
          <div style={{ marginBottom: '2rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontFamily: 'Bebas Neue',
                color: 'var(--accent-amber)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '1rem',
                display: 'block',
              }}
            >
              Our Philosophy
            </span>
            <p
              style={{
                fontSize: '1.125rem',
                fontFamily: 'DM Sans',
                fontStyle: 'italic',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              {philosophy || '(No philosophy set yet)'}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
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
              marginTop: '1rem',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            CLOSE
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function BreweryProfileSection() {
  const { brewerData } = useContext(BrewerSessionContext);
  // Initialize formData with defaults from brewerData and brewers.json
  const getInitialFormData = () => {
    if (brewerData?.id) {
      const currentBrewer = brewers.find((b) => b.id === brewerData.id);
      if (currentBrewer) {
        return {
          name: brewerData.name || currentBrewer.name || '',
          foundedYear: brewerData.foundedYear || currentBrewer.founded || '',
          location: brewerData.location || currentBrewer.location || '',
          description: brewerData.description || currentBrewer.tagline || '',
          email: brewerData.email || '',
          phone: brewerData.phone || '',
          founders: brewerData.founders || currentBrewer.founders || [],
          awards: brewerData.awards || currentBrewer.awards || [],
        };
      }
    }
    return {
      name: brewerData?.name || '',
      foundedYear: brewerData?.foundedYear || '',
      location: brewerData?.location || '',
      description: brewerData?.description || '',
      email: brewerData?.email || '',
      phone: brewerData?.phone || '',
      founders: brewerData?.founders || [],
      awards: brewerData?.awards || [],
    };
  };

  const [formData, setFormData] = useState(getInitialFormData());
  // Initialize contentData with defaults from brewers.json
  const getInitialContentData = () => {
    if (brewerData?.id) {
      // First try localStorage
      const storageKey = `brewery_content_${brewerData.id}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Error loading brewery content:', e);
        }
      }

      // Fall back to brewers.json data
      const currentBrewer = brewers.find((b) => b.id === brewerData.id);
      if (currentBrewer) {
        return {
          story: currentBrewer.story || '',
          philosophy: currentBrewer.tagline || '',
        };
      }
    }
    return { story: '', philosophy: '' };
  };

  const [contentData, setContentData] = useState(getInitialContentData());
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState(null);

  // Update content data when brewerData changes
  useEffect(() => {
    if (brewerData?.id) {
      setContentData(getInitialContentData());
    }
  }, [brewerData?.id]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleContentChange = (field, value) => {
    // Enforce 1000 character limit
    if (value.length <= 1000) {
      setContentData({ ...contentData, [field]: value });
    }
  };

  const handleFounderChange = (index, value) => {
    const updatedFounders = [...formData.founders];
    updatedFounders[index] = value;
    setFormData({ ...formData, founders: updatedFounders });
  };

  const handleAddFounder = () => {
    setFormData({ ...formData, founders: [...formData.founders, ''] });
  };

  const handleRemoveFounder = (index) => {
    const updatedFounders = formData.founders.filter((_, i) => i !== index);
    setFormData({ ...formData, founders: updatedFounders });
  };

  const handleAwardChange = (index, value) => {
    const updatedAwards = [...formData.awards];
    updatedAwards[index] = value;
    setFormData({ ...formData, awards: updatedAwards });
  };

  const handleAddAward = () => {
    setFormData({ ...formData, awards: [...formData.awards, ''] });
  };

  const handleRemoveAward = (index) => {
    const updatedAwards = formData.awards.filter((_, i) => i !== index);
    setFormData({ ...formData, awards: updatedAwards });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save content to localStorage
    if (brewerData?.id) {
      const storageKey = `brewery_content_${brewerData.id}`;
      localStorage.setItem(storageKey, JSON.stringify(contentData));
    }
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

          {/* Founded By */}
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
              Founded By
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {formData.founders && formData.founders.map((founder, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={founder}
                    onChange={(e) => handleFounderChange(index, e.target.value)}
                    placeholder={`Founder ${index + 1}`}
                    style={{
                      flex: 1,
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
                  <button
                    type="button"
                    onClick={() => handleRemoveFounder(index)}
                    style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgba(192, 57, 43, 0.2)',
                      color: '#C0392B',
                      border: '1px solid #C0392B',
                      borderRadius: '4px',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#C0392B', e.target.style.color = '#fff')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgba(192, 57, 43, 0.2)', e.target.style.color = '#C0392B')}
                  >
                    REMOVE
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddFounder}
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--background-tertiary)',
                  color: 'var(--accent-amber)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--accent-amber)', e.target.style.color = '#000')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--background-tertiary)', e.target.style.color = 'var(--accent-amber)')}
              >
                + ADD FOUNDER
              </button>
            </div>
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

          {/* Awards */}
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
              Awards
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {formData.awards && formData.awards.length > 0 ? (
                formData.awards.map((award, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.5rem' }}>
                    <textarea
                      value={award}
                      onChange={(e) => handleAwardChange(index, e.target.value)}
                      placeholder={`Award ${index + 1}`}
                      rows="2"
                      style={{
                        flex: 1,
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
                    <button
                      type="button"
                      onClick={() => handleRemoveAward(index)}
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: 'rgba(192, 57, 43, 0.2)',
                        color: '#C0392B',
                        border: '1px solid #C0392B',
                        borderRadius: '4px',
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        height: 'fit-content',
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#C0392B', e.target.style.color = '#fff')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgba(192, 57, 43, 0.2)', e.target.style.color = '#C0392B')}
                    >
                      REMOVE
                    </button>
                  </div>
                ))
              ) : (
                <p style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  margin: '0.5rem 0',
                }}>
                  No awards added yet
                </p>
              )}
              <button
                type="button"
                onClick={handleAddAward}
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--background-tertiary)',
                  color: 'var(--accent-amber)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--accent-amber)', e.target.style.color = '#000')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--background-tertiary)', e.target.style.color = 'var(--accent-amber)')}
              >
                + ADD AWARD
              </button>
            </div>
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

          {/* Divider */}
          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--border-subtle)',
              margin: '2rem 0',
            }}
          />

          <h2
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '1.25rem',
              color: 'var(--text-primary)',
              margin: '2rem 0 1rem 0',
              letterSpacing: '0.5px',
            }}
          >
            Page Content
          </h2>

          {/* Our Story */}
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
              Our Story
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  marginLeft: '0.5rem',
                }}
              >
                ({contentData.story?.length || 0}/1000)
              </span>
            </label>
            <textarea
              value={contentData.story}
              onChange={(e) => handleContentChange('story', e.target.value)}
              rows="5"
              placeholder="Tell your brewery's story..."
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

          {/* Our Philosophy */}
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
              Our Philosophy
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  marginLeft: '0.5rem',
                }}
              >
                ({contentData.philosophy?.length || 0}/1000)
              </span>
            </label>
            <textarea
              value={contentData.philosophy}
              onChange={(e) => handleContentChange('philosophy', e.target.value)}
              rows="4"
              placeholder="Share your brewery's philosophy and approach..."
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

          {/* Button Group */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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

            <button
              type="button"
              onClick={() => setShowPreview(true)}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: 'var(--background-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
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
              PREVIEW
            </button>
          </div>
        </div>
      </form>

      {/* Preview Modal */}
      <ContentPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        brewerName={brewerData?.name || 'Your Brewery'}
        story={contentData.story}
        philosophy={contentData.philosophy}
      />

      {/* Toast Notification */}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
