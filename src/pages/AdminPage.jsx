import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useResponsive } from '../hooks/useResponsive';
import { AdminSessionContext } from '../context/AdminSessionContext';
import { initializeMockOrders, getOrdersFromStorage } from '../utils/mockOrdersData';
import { getAllAnalytics, getDateRange } from '../utils/analyticsManager';

const MOCK_INVITATIONS = [
  { id: 1, breweryName: 'De Wilde Hop', contactName: 'Lena Vandermeersch', country: 'Belgium', status: 'Live', dateInvited: '15 Jan 2026' },
  { id: 2, breweryName: 'Schwarzwald Brauhaus', contactName: 'Klaus Hoffmann', country: 'Germany', status: 'Live', dateInvited: '18 Jan 2026' },
  { id: 3, breweryName: 'Noorden Brewery', contactName: 'Sara Bakker', country: 'Netherlands', status: 'Live', dateInvited: '20 Jan 2026' },
  { id: 4, breweryName: 'Brouwerij Verzet', contactName: 'Tom De Cock', country: 'Belgium', status: 'Under Review', dateInvited: '10 Mar 2026' },
  { id: 5, breweryName: 'Freigeist Bierkultur', contactName: 'Oliver Wesseloh', country: 'Germany', status: 'Profile Created', dateInvited: '22 Mar 2026' },
  { id: 6, breweryName: 'Oedipus Brewing', contactName: 'Sander Nederveen', country: 'Netherlands', status: 'Invited', dateInvited: '28 Mar 2026' },
];

const COUNTRIES = ['Netherlands', 'Germany', 'Belgium', 'France', 'UK', 'Sweden', 'Denmark'];

const STATUS_COLORS = {
  'Invited': '#E8920A',
  'Profile Created': '#3B82F6',
  'Under Review': '#F97316',
  'Live': '#22C55E',
  'Declined': '#EF4444',
};

const ITEMS_PER_PAGE = 5;

export default function AdminPage() {
  const navigate = useNavigate();
  const { logout } = useContext(AdminSessionContext);
  const isMobile = useResponsive(768);
  const [activeSection, setActiveSection] = useState('invitations');
  const [invitations, setInvitations] = useState([]);

  // Search and pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Form states
  const [breweryName, setBreweryName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('Netherlands');

  // Analytics states
  const [selectedDateRange, setSelectedDateRange] = useState('last30');
  const [analyticsData, setAnalyticsData] = useState(null);

  // Load invitations from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('beerworld_invitations');
    if (stored) {
      try {
        setInvitations(JSON.parse(stored));
      } catch {
        setInvitations(MOCK_INVITATIONS);
      }
    } else {
      setInvitations(MOCK_INVITATIONS);
      localStorage.setItem('beerworld_invitations', JSON.stringify(MOCK_INVITATIONS));
    }
  }, []);

  // Initialize mock orders and calculate analytics
  useEffect(() => {
    initializeMockOrders();
    const orders = getOrdersFromStorage();
    const { startDate, endDate } = getDateRange(selectedDateRange);
    const analytics = getAllAnalytics(orders, startDate, endDate);
    setAnalyticsData(analytics);
  }, [selectedDateRange]);

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!breweryName || !contactName || !email || !country) return;

    const newInvitation = {
      id: invitations.length + 1,
      breweryName,
      contactName,
      country,
      email,
      status: 'Invited',
      dateInvited: new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' }),
    };

    const updated = [...invitations, newInvitation];
    setInvitations(updated);
    localStorage.setItem('beerworld_invitations', JSON.stringify(updated));

    // Reset form
    setBreweryName('');
    setContactName('');
    setEmail('');
    setCountry('Netherlands');
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = invitations.map(inv =>
      inv.id === id ? { ...inv, status: newStatus } : inv
    );
    setInvitations(updated);
    localStorage.setItem('beerworld_invitations', JSON.stringify(updated));
  };

  const handleDecline = (id) => {
    handleStatusChange(id, 'Declined');
  };

  const handleMarkAsLive = (id) => {
    handleStatusChange(id, 'Live');
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'var(--background-primary)',
    }}>
      {/* Sidebar */}
      <motion.div
        initial={{ x: -240 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          width: '240px',
          backgroundColor: 'var(--background-secondary)',
          borderRight: '1px solid var(--border-subtle)',
          padding: '2rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '3rem',
        }}
      >
        {/* Logo */}
        <div style={{
          fontSize: '24px',
          fontFamily: 'Bebas Neue',
          color: 'var(--accent-amber)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          textAlign: 'center',
        }}>
          BeerWorld
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveSection('invitations')}
            style={{
              backgroundColor: activeSection === 'invitations' ? 'var(--accent-amber)' : 'transparent',
              color: activeSection === 'invitations' ? 'var(--background-primary)' : 'var(--text-primary)',
              border: 'none',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontFamily: 'DM Sans',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 200ms ease',
            }}
            onMouseEnter={(e) => {
              if (activeSection !== 'invitations') {
                e.currentTarget.style.backgroundColor = 'var(--background-tertiary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeSection !== 'invitations') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            Brewery Invitations
          </button>
          <button
            onClick={() => setActiveSection('analytics')}
            style={{
              backgroundColor: activeSection === 'analytics' ? 'var(--accent-amber)' : 'transparent',
              color: activeSection === 'analytics' ? 'var(--background-primary)' : 'var(--text-primary)',
              border: 'none',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontFamily: 'DM Sans',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 200ms ease',
            }}
            onMouseEnter={(e) => {
              if (activeSection !== 'analytics') {
                e.currentTarget.style.backgroundColor = 'var(--background-tertiary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeSection !== 'analytics') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            Platform Analytics
          </button>
        </nav>

        {/* Logout Button */}
        <button
          onClick={() => {
            logout();
            navigate('/admin');
          }}
          style={{
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontFamily: 'DM Sans',
            cursor: 'pointer',
            marginTop: 'auto',
            transition: 'all 200ms ease',
            textTransform: 'uppercase',
            fontWeight: '600',
            letterSpacing: '0.5px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--background-tertiary)';
            e.currentTarget.style.color = 'var(--accent-amber)';
            e.currentTarget.style.borderColor = 'var(--accent-amber)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
          }}
        >
          Logout
        </button>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          flex: 1,
          padding: '2rem',
          overflow: 'auto',
        }}
      >
        {/* Admin Header */}
        <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontFamily: 'Bebas Neue',
            color: 'var(--accent-amber)',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Beer World Admin
          </h1>
          <div style={{
            backgroundColor: 'var(--accent-amber)',
            color: 'var(--background-primary)',
            padding: '0.35rem 0.75rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontFamily: 'DM Sans',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Admin Panel
          </div>
        </div>

        {/* Brewery Invitations Section */}
        {activeSection === 'invitations' && (
          <div>
            {/* Section Header */}
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{
                fontSize: '1.875rem',
                fontFamily: 'Bebas Neue',
                color: 'var(--text-primary)',
                margin: '0 0 0.5rem 0',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                Brewery Invitations
              </h2>
              <p style={{
                fontSize: '1rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.6,
              }}>
                Invite independent breweries to join Beer World. Quality and authenticity is reviewed manually before each brewery goes live.
              </p>
            </div>

            {/* Invite Form */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              style={{
                backgroundColor: 'var(--background-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '2rem',
                marginBottom: '3rem',
              }}
            >
              <h3 style={{
                fontSize: '1.25rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-primary)',
                margin: '0 0 1.5rem 0',
                fontWeight: '600',
              }}>
                Send Invitation
              </h3>

              <form onSubmit={handleInviteSubmit} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem',
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-muted)',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                  }}>
                    Brewery Name
                  </label>
                  <input
                    type="text"
                    value={breweryName}
                    onChange={(e) => setBreweryName(e.target.value)}
                    placeholder="e.g. Brouwerij Verzet"
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

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-muted)',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                  }}>
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Tom De Cock"
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

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-muted)',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@brewery.com"
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

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-muted)',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                  }}>
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
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
                  >
                    {COUNTRIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  style={{
                    gridColumn: '1 / -1',
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
                    transition: 'all 200ms ease',
                  }}
                >
                  Send Invitation
                </motion.button>
              </form>
            </motion.div>

            {/* Search and Pagination Setup */}
            {(() => {
              // Filter invitations by search query
              const filtered = invitations.filter((inv) => {
                const query = searchQuery.toLowerCase();
                return (
                  inv.breweryName.toLowerCase().includes(query) ||
                  inv.contactName.toLowerCase().includes(query) ||
                  inv.country.toLowerCase().includes(query) ||
                  inv.status.toLowerCase().includes(query)
                );
              });

              // Calculate pagination
              const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
              const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
              const paginatedInvitations = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

              return (
                <>
                  {/* Search Box */}
                  <div style={{ marginBottom: '2rem' }}>
                    <input
                      type="text"
                      placeholder="Search by Brewery Name, Contact, Country, or Status..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'var(--background-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '0.875rem',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent-amber)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
                    />
                  </div>

                  {/* Invitations Table */}
                  <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              style={{
                backgroundColor: 'var(--background-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}>
                  <thead>
                    <tr style={{
                      backgroundColor: 'var(--background-tertiary)',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontFamily: 'DM Sans', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Brewery Name</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontFamily: 'DM Sans', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Contact</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontFamily: 'DM Sans', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Country</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontFamily: 'DM Sans', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontFamily: 'DM Sans', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Date Invited</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontFamily: 'DM Sans', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedInvitations.map((inv, index) => (
                      <tr key={inv.id} style={{
                        borderBottom: index < paginatedInvitations.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      }}>
                        <td style={{ padding: '1rem', fontSize: '0.95rem', fontFamily: 'DM Sans', color: 'var(--text-primary)' }}>{inv.breweryName}</td>
                        <td style={{ padding: '1rem', fontSize: '0.95rem', fontFamily: 'DM Sans', color: 'var(--text-primary)' }}>{inv.contactName}</td>
                        <td style={{ padding: '1rem', fontSize: '0.95rem', fontFamily: 'DM Sans', color: 'var(--text-primary)' }}>{inv.country}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            display: 'inline-block',
                            backgroundColor: STATUS_COLORS[inv.status] + '20',
                            color: STATUS_COLORS[inv.status],
                            padding: '0.35rem 0.75rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontFamily: 'DM Sans',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}>
                            {inv.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.95rem', fontFamily: 'DM Sans', color: 'var(--text-secondary)' }}>{inv.dateInvited}</td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {inv.status !== 'Live' && inv.status !== 'Declined' && (
                              <button
                                onClick={() => handleMarkAsLive(inv.id)}
                                style={{
                                  backgroundColor: '#22C55E',
                                  color: 'white',
                                  border: 'none',
                                  padding: '0.5rem 0.75rem',
                                  borderRadius: '4px',
                                  fontSize: '0.75rem',
                                  fontFamily: 'DM Sans',
                                  cursor: 'pointer',
                                  transition: 'opacity 200ms ease',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.opacity = '0.8';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.opacity = '1';
                                }}
                              >
                                Mark as Live
                              </button>
                            )}
                            {inv.status !== 'Declined' && (
                              <button
                                onClick={() => handleDecline(inv.id)}
                                style={{
                                  backgroundColor: '#EF4444',
                                  color: 'white',
                                  border: 'none',
                                  padding: '0.5rem 0.75rem',
                                  borderRadius: '4px',
                                  fontSize: '0.75rem',
                                  fontFamily: 'DM Sans',
                                  cursor: 'pointer',
                                  transition: 'opacity 200ms ease',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.opacity = '0.8';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.opacity = '1';
                                }}
                              >
                                Decline
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Empty State */}
            {filtered.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0' }}>
                  No invitations found for this search.
                </p>
              </div>
            )}

            {/* Pagination Controls */}
            {filtered.length > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '2rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-subtle)',
              }}>
                {/* Page Info */}
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  margin: '0',
                }}>
                  Showing {startIdx + 1} to {Math.min(startIdx + ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                </p>

                {/* Page Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        backgroundColor: currentPage === page ? 'var(--accent-amber)' : 'var(--background-tertiary)',
                        color: currentPage === page ? 'var(--background-primary)' : 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '0.875rem',
                        fontWeight: currentPage === page ? '600' : '400',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s, color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage !== page) {
                          e.target.style.backgroundColor = 'var(--background-secondary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== page) {
                          e.target.style.backgroundColor = 'var(--background-tertiary)';
                        }
                      }}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
          );
            })()}
          </div>
        )}

        {/* Platform Analytics Section */}
        {activeSection === 'analytics' && (
          <div>
            {/* Section Header */}
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{
                fontSize: '1.875rem',
                fontFamily: 'Bebas Neue',
                color: 'var(--text-primary)',
                margin: '0 0 0.5rem 0',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                Platform Analytics
              </h2>
              <p style={{
                fontSize: '1rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.6,
              }}>
                Live overview of Beer World platform performance across all active markets.
              </p>
            </div>

            {/* Date Range Selector */}
            {analyticsData && (
              <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '2rem',
                flexWrap: 'wrap',
              }}>
                {[
                  { label: 'Last 7 Days', value: 'last7' },
                  { label: 'Last 30 Days', value: 'last30' },
                  { label: 'Last 90 Days', value: 'last90' },
                  { label: 'All Time', value: 'all' },
                ].map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setSelectedDateRange(range.value)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: selectedDateRange === range.value
                        ? 'var(--accent-amber)'
                        : 'var(--background-secondary)',
                      color: selectedDateRange === range.value
                        ? 'var(--background-primary)'
                        : 'var(--text-primary)',
                      border: `1px solid ${selectedDateRange === range.value ? 'var(--accent-amber)' : 'var(--border-subtle)'}`,
                      borderRadius: '6px',
                      fontFamily: 'DM Sans',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 200ms ease',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedDateRange !== range.value) {
                        e.currentTarget.style.borderColor = 'var(--accent-amber)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedDateRange !== range.value) {
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      }
                    }}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            )}

            {/* Stat Cards - Row 1 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
              gap: '1.5rem',
              marginBottom: '2rem',
            }}>
              {(analyticsData ? [
                { label: 'Active Breweries', value: '3' },
                { label: 'Total Orders', value: analyticsData.totalMetrics.totalOrders },
                { label: 'Registered Consumers', value: analyticsData.totalMetrics.totalCustomers },
                { label: 'Gross GMV', value: `€${analyticsData.totalMetrics.totalGMV.toLocaleString('de-DE', { minimumFractionDigits: 2 })}` },
              ] : [
                { label: 'Active Breweries', value: '—' },
                { label: 'Total Orders', value: '—' },
                { label: 'Registered Consumers', value: '—' },
                { label: 'Gross GMV', value: '—' },
              ]).map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 + idx * 0.05 }}
                  style={{
                    backgroundColor: 'var(--background-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderTop: '3px solid var(--accent-amber)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                  }}
                >
                  <p style={{
                    fontSize: '0.875rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-muted)',
                    margin: '0 0 0.75rem 0',
                    textTransform: 'uppercase',
                  }}>
                    {stat.label}
                  </p>
                  <p style={{
                    fontSize: '2rem',
                    fontFamily: 'Bebas Neue',
                    color: 'var(--accent-amber)',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Stat Cards - Row 2 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              marginBottom: '2rem',
            }}>
              {(analyticsData ? [
                { label: 'Avg Order Value', value: `€${analyticsData.totalMetrics.avgOrderValue.toLocaleString('de-DE', { minimumFractionDigits: 2 })}` },
                { label: 'Repeat Order Rate', value: `${analyticsData.repeatPurchaseRate.rate}%` },
              ] : [
                { label: 'Avg Order Value', value: '—' },
                { label: 'Repeat Order Rate', value: '—' },
              ]).map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 + idx * 0.05 }}
                  style={{
                    backgroundColor: 'var(--background-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderTop: '3px solid var(--accent-amber)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                  }}
                >
                  <p style={{
                    fontSize: '0.875rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-muted)',
                    margin: '0 0 0.75rem 0',
                    textTransform: 'uppercase',
                  }}>
                    {stat.label}
                  </p>
                  <p style={{
                    fontSize: '2rem',
                    fontFamily: 'Bebas Neue',
                    color: 'var(--accent-amber)',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* New Analytics Sections */}
            {analyticsData && (
              <>
                {/* Orders per Brewery */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.35 }}
                  style={{
                    backgroundColor: 'var(--background-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                  }}
                >
                  <h3 style={{
                    fontSize: '1rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-primary)',
                    margin: '0 0 1rem 0',
                    fontWeight: '600',
                  }}>
                    Orders per Brewery
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {Object.entries(analyticsData.ordersPerBrewery).map(([breweryId, data]) => (
                      <div key={breweryId} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{
                            margin: '0 0 0.5rem 0',
                            fontSize: '0.875rem',
                            fontFamily: 'DM Sans',
                            color: 'var(--text-secondary)',
                          }}>
                            {data.name}
                          </p>
                          <div style={{
                            height: '8px',
                            backgroundColor: 'var(--background-tertiary)',
                            borderRadius: '4px',
                            overflow: 'hidden',
                          }}>
                            <div style={{
                              height: '100%',
                              backgroundColor: 'var(--accent-amber)',
                              width: `${data.percentage}%`,
                              transition: 'width 300ms ease',
                            }} />
                          </div>
                        </div>
                        <div style={{ minWidth: '80px', textAlign: 'right' }}>
                          <p style={{
                            margin: 0,
                            fontSize: '1rem',
                            fontFamily: 'Bebas Neue',
                            color: 'var(--accent-amber)',
                            fontWeight: '600',
                          }}>
                            {data.count}
                          </p>
                          <p style={{
                            margin: 0,
                            fontSize: '0.75rem',
                            fontFamily: 'DM Sans',
                            color: 'var(--text-muted)',
                          }}>
                            {data.percentage}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Multi-Brewery Order Rate */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  style={{
                    backgroundColor: 'var(--background-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                  }}
                >
                  <h3 style={{
                    fontSize: '1rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-primary)',
                    margin: '0 0 1.5rem 0',
                    fontWeight: '600',
                  }}>
                    Multi-Brewery Order Rate
                  </h3>
                  <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{
                        margin: 0,
                        fontSize: '0.875rem',
                        fontFamily: 'DM Sans',
                        color: 'var(--text-muted)',
                        marginBottom: '0.5rem',
                      }}>
                        OF TOTAL ORDERS
                      </p>
                      <p style={{
                        margin: 0,
                        fontSize: '2.5rem',
                        fontFamily: 'Bebas Neue',
                        color: 'var(--accent-amber)',
                        letterSpacing: '1px',
                      }}>
                        {analyticsData.multiBreweryRate.rate}%
                      </p>
                    </div>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                      <p style={{
                        margin: '0 0 1rem 0',
                        fontSize: '0.875rem',
                        fontFamily: 'DM Sans',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                      }}>
                        Top Combinations
                      </p>
                      {analyticsData.multiBreweryRate.combinations.length > 0 ? (
                        <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                          {analyticsData.multiBreweryRate.combinations.map((combo, idx) => (
                            <li key={idx} style={{
                              marginBottom: '0.5rem',
                              color: 'var(--text-secondary)',
                              fontFamily: 'DM Sans',
                            }}>
                              {combo.breweries} ({combo.count} orders)
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                          No multi-brewery orders yet
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Avg Items per Order */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.45 }}
                  style={{
                    backgroundColor: 'var(--background-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderTop: '3px solid var(--accent-amber)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                  }}
                >
                  <p style={{
                    fontSize: '0.875rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-muted)',
                    margin: '0 0 0.75rem 0',
                    textTransform: 'uppercase',
                  }}>
                    Average Items per Order
                  </p>
                  <p style={{
                    fontSize: '2rem',
                    fontFamily: 'Bebas Neue',
                    color: 'var(--accent-amber)',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    {analyticsData.avgItemsPerOrder}
                  </p>
                </motion.div>

                {/* Order Status Distribution */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: '1.5rem',
                  marginBottom: '2rem',
                }}>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    style={{
                      backgroundColor: 'var(--background-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderTop: '3px solid #22C55E',
                      borderRadius: '12px',
                      padding: '1.5rem',
                    }}
                  >
                    <p style={{
                      fontSize: '0.875rem',
                      fontFamily: 'DM Sans',
                      color: 'var(--text-muted)',
                      margin: '0 0 0.75rem 0',
                      textTransform: 'uppercase',
                    }}>
                      Successful Orders
                    </p>
                    <p style={{
                      fontSize: '2rem',
                      fontFamily: 'Bebas Neue',
                      color: '#22C55E',
                      margin: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}>
                      {analyticsData.orderStats.successful}
                    </p>
                    <p style={{
                      fontSize: '0.75rem',
                      fontFamily: 'DM Sans',
                      color: 'var(--text-muted)',
                      margin: '0.5rem 0 0 0',
                    }}>
                      {analyticsData.orderStats.successRate}% of total
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.55 }}
                    style={{
                      backgroundColor: 'var(--background-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderTop: '3px solid #EF4444',
                      borderRadius: '12px',
                      padding: '1.5rem',
                    }}
                  >
                    <p style={{
                      fontSize: '0.875rem',
                      fontFamily: 'DM Sans',
                      color: 'var(--text-muted)',
                      margin: '0 0 0.75rem 0',
                      textTransform: 'uppercase',
                    }}>
                      Failed Orders
                    </p>
                    <p style={{
                      fontSize: '2rem',
                      fontFamily: 'Bebas Neue',
                      color: '#EF4444',
                      margin: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}>
                      {analyticsData.orderStats.failed}
                    </p>
                    <p style={{
                      fontSize: '0.75rem',
                      fontFamily: 'DM Sans',
                      color: 'var(--text-muted)',
                      margin: '0.5rem 0 0 0',
                    }}>
                      {(100 - analyticsData.orderStats.successRate).toFixed(1)}% of total
                    </p>
                  </motion.div>
                </div>
              </>
            )}

            {/* Top Performing Breweries */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              style={{
                backgroundColor: 'var(--background-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '2rem',
                marginBottom: '2rem',
              }}
            >
              <h3 style={{
                fontSize: '1.25rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-primary)',
                margin: '0 0 1.5rem 0',
                fontWeight: '600',
              }}>
                Top Performing Breweries
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}>
                  <thead>
                    <tr style={{
                      borderBottom: '1px solid var(--border-subtle)',
                    }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontFamily: 'DM Sans', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Brewery</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontFamily: 'DM Sans', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Market</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontFamily: 'DM Sans', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Orders</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontFamily: 'DM Sans', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Revenue</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontFamily: 'DM Sans', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Avg Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { brewery: 'De Wilde Hop', market: 'Belgium', orders: 312, revenue: '€4,847', rating: '4.8★' },
                      { brewery: 'Noorden Brewery', market: 'Netherlands', orders: 298, revenue: '€3,621', rating: '4.6★' },
                      { brewery: 'Schwarzwald Brauhaus', market: 'Germany', orders: 237, revenue: '€3,938', rating: '4.7★' },
                    ].map((row, idx) => (
                      <tr key={idx} style={{
                        borderBottom: idx < 2 ? '1px solid var(--border-subtle)' : 'none',
                      }}>
                        <td style={{ padding: '1rem', fontSize: '0.95rem', fontFamily: 'DM Sans', color: 'var(--text-primary)' }}>{row.brewery}</td>
                        <td style={{ padding: '1rem', fontSize: '0.95rem', fontFamily: 'DM Sans', color: 'var(--text-primary)' }}>{row.market}</td>
                        <td style={{ padding: '1rem', fontSize: '0.95rem', fontFamily: 'DM Sans', color: 'var(--text-primary)' }}>{row.orders}</td>
                        <td style={{ padding: '1rem', fontSize: '0.95rem', fontFamily: 'DM Sans', color: 'var(--accent-amber)', fontWeight: '600' }}>{row.revenue}</td>
                        <td style={{ padding: '1rem', fontSize: '0.95rem', fontFamily: 'DM Sans', color: 'var(--text-primary)' }}>{row.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Top Performing Beers */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              style={{
                backgroundColor: 'var(--background-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '2rem',
                marginBottom: '2rem',
              }}
            >
              <h3 style={{
                fontSize: '1.25rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-primary)',
                margin: '0 0 1.5rem 0',
                fontWeight: '600',
              }}>
                Top Performing Beers
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}>
                  <thead>
                    <tr style={{
                      borderBottom: '1px solid var(--border-subtle)',
                    }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontFamily: 'DM Sans', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Beer</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontFamily: 'DM Sans', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Brewery</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontFamily: 'DM Sans', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Orders</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontFamily: 'DM Sans', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { beer: 'Wilde Saison', brewery: 'De Wilde Hop', orders: 187, revenue: '€841' },
                      { beer: 'Noorden Pale', brewery: 'Noorden Brewery', orders: 156, revenue: '€608' },
                      { beer: 'Schwarzwald Dunkel', brewery: 'Schwarzwald Brauhaus', orders: 143, revenue: '€601' },
                      { beer: 'Zomer Wit', brewery: 'De Wilde Hop', orders: 125, revenue: '€475' },
                      { beer: 'Fichten IPA', brewery: 'Schwarzwald Brauhaus', orders: 94, revenue: '€451' },
                    ].map((row, idx) => (
                      <tr key={idx} style={{
                        borderBottom: idx < 4 ? '1px solid var(--border-subtle)' : 'none',
                      }}>
                        <td style={{ padding: '1rem', fontSize: '0.95rem', fontFamily: 'DM Sans', color: 'var(--text-primary)' }}>{row.beer}</td>
                        <td style={{ padding: '1rem', fontSize: '0.95rem', fontFamily: 'DM Sans', color: 'var(--text-primary)' }}>{row.brewery}</td>
                        <td style={{ padding: '1rem', fontSize: '0.95rem', fontFamily: 'DM Sans', color: 'var(--text-primary)' }}>{row.orders}</td>
                        <td style={{ padding: '1rem', fontSize: '0.95rem', fontFamily: 'DM Sans', color: 'var(--accent-amber)', fontWeight: '600' }}>{row.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Market Breakdown */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '1.5rem',
            }}>
              {[
                { market: 'Netherlands', orders: 412, gmv: '€5,842' },
                { market: 'Germany', orders: 248, gmv: '€3,938' },
                { market: 'Belgium', orders: 187, gmv: '€2,626' },
              ].map((data, idx) => (
                <motion.div
                  key={idx}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + idx * 0.05 }}
                  style={{
                    backgroundColor: 'var(--background-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderTop: '3px solid var(--accent-amber)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center',
                  }}
                >
                  <p style={{
                    fontSize: '1.125rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-primary)',
                    margin: '0 0 0.75rem 0',
                    fontWeight: '600',
                  }}>
                    {data.market}
                  </p>
                  <p style={{
                    fontSize: '0.95rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-secondary)',
                    margin: 0,
                  }}>
                    {data.orders} orders · {data.gmv} GMV
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
