import { useState } from 'react';

export default function ZendeskWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('options');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, this would send to Zendesk
    alert(`Thank you ${formData.name}! We've received your message and will get back to you shortly.`);
    setFormData({ name: '', email: '', message: '' });
    setIsOpen(false);
  };

  const handleQuickOption = (option) => {
    if (option === 'email') {
      window.location.href = 'mailto:support@beerworld.com';
    } else if (option === 'chat') {
      alert('Chat support is currently unavailable. Please send us an email at support@beerworld.com');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleToggle}
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 9998,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-amber)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          transition: 'all 200ms ease',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title="Support"
      >
        💬
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 9998,
        backgroundColor: 'var(--background-secondary)',
        borderRadius: '12px',
        padding: '0',
        width: '360px',
        maxHeight: '500px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
        borderTop: '3px solid var(--accent-amber)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            fontFamily: 'Bebas Neue',
            color: 'var(--accent-amber)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: '700',
          }}
        >
          Customer Support
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

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--background-tertiary)',
        }}
      >
        <button
          onClick={() => setActiveTab('options')}
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            backgroundColor: activeTab === 'options' ? 'var(--background-secondary)' : 'transparent',
            color: activeTab === 'options' ? 'var(--text-primary)' : 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '13px',
            fontFamily: 'DM Sans',
            fontWeight: '600',
            transition: 'all 200ms ease',
            borderBottom: activeTab === 'options' ? '2px solid var(--accent-amber)' : 'none',
          }}
        >
          Quick Help
        </button>
        <button
          onClick={() => setActiveTab('form')}
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            backgroundColor: activeTab === 'form' ? 'var(--background-secondary)' : 'transparent',
            color: activeTab === 'form' ? 'var(--text-primary)' : 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '13px',
            fontFamily: 'DM Sans',
            fontWeight: '600',
            transition: 'all 200ms ease',
            borderBottom: activeTab === 'form' ? '2px solid var(--accent-amber)' : 'none',
          }}
        >
          Send Message
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
        {activeTab === 'options' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p
              style={{
                fontSize: '13px',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                margin: '0 0 8px 0',
              }}
            >
              How can we help you?
            </p>

            <button
              onClick={() => handleQuickOption('email')}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'var(--background-tertiary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'DM Sans',
                fontWeight: '600',
                color: 'var(--text-primary)',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-amber)';
                e.currentTarget.style.color = 'var(--background-primary)';
                e.currentTarget.style.borderColor = 'var(--accent-amber)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--background-tertiary)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              📧 Email Support
            </button>

            <button
              onClick={() => handleQuickOption('chat')}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'var(--background-tertiary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'DM Sans',
                fontWeight: '600',
                color: 'var(--text-primary)',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-amber)';
                e.currentTarget.style.color = 'var(--background-primary)';
                e.currentTarget.style.borderColor = 'var(--accent-amber)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--background-tertiary)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              💬 Live Chat
            </button>

            <div
              style={{
                marginTop: '8px',
                padding: '12px',
                backgroundColor: 'rgba(232, 146, 10, 0.1)',
                borderRadius: '6px',
                fontSize: '12px',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                lineHeight: '1.5',
              }}
            >
              <strong>Hours:</strong> Mon-Fri, 9am-6pm CET
              <br />
              <strong>Email:</strong> support@beerworld.com
            </div>
          </div>
        )}

        {activeTab === 'form' && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontFamily: 'DM Sans',
                  color: 'var(--text-muted)',
                  marginBottom: '4px',
                  fontWeight: '600',
                }}
              >
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
                placeholder="Enter your name"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontFamily: 'DM Sans',
                  backgroundColor: 'var(--background-tertiary)',
                  color: 'var(--text-primary)',
                  boxSizing: 'border-box',
                  transition: 'border-color 200ms ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-amber)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontFamily: 'DM Sans',
                  color: 'var(--text-muted)',
                  marginBottom: '4px',
                  fontWeight: '600',
                }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                required
                placeholder="your@email.com"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontFamily: 'DM Sans',
                  backgroundColor: 'var(--background-tertiary)',
                  color: 'var(--text-primary)',
                  boxSizing: 'border-box',
                  transition: 'border-color 200ms ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-amber)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontFamily: 'DM Sans',
                  color: 'var(--text-muted)',
                  marginBottom: '4px',
                  fontWeight: '600',
                }}
              >
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                required
                placeholder="How can we help?"
                rows={4}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontFamily: 'DM Sans',
                  backgroundColor: 'var(--background-tertiary)',
                  color: 'var(--text-primary)',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  transition: 'border-color 200ms ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-amber)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'var(--accent-amber)',
                color: 'var(--background-primary)',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontFamily: 'DM Sans',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
