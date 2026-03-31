export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--background-secondary)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '3rem 2rem',
      marginTop: '4rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '3rem',
        marginBottom: '2rem',
      }}>
        {/* About */}
        <div>
          <h3 style={{
            fontSize: '1rem',
            fontFamily: 'Bebas Neue',
            color: 'var(--text-primary)',
            margin: '0 0 1rem 0',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            About
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
              }}>
                Our Story
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
              }}>
                The Brewers
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
              }}>
                Sustainability
              </a>
            </li>
            <li>
              <a href="#" style={{
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
              }}>
                Press
              </a>
            </li>
          </ul>
        </div>

        {/* Explore */}
        <div>
          <h3 style={{
            fontSize: '1rem',
            fontFamily: 'Bebas Neue',
            color: 'var(--text-primary)',
            margin: '0 0 1rem 0',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Explore
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
              }}>
                Beer Styles
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
              }}>
                Breweries
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
              }}>
                Events
              </a>
            </li>
            <li>
              <a href="#" style={{
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
              }}>
                Gift Cards
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 style={{
            fontSize: '1rem',
            fontFamily: 'Bebas Neue',
            color: 'var(--text-primary)',
            margin: '0 0 1rem 0',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Support
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
              }}>
                Help Center
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
              }}>
                Shipping Info
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
              }}>
                Returns
              </a>
            </li>
            <li>
              <a href="#" style={{
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
              }}>
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 style={{
            fontSize: '1rem',
            fontFamily: 'Bebas Neue',
            color: 'var(--text-primary)',
            margin: '0 0 1rem 0',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Legal
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
              }}>
                Terms of Service
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
              }}>
                Privacy Policy
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
              }}>
                Age Verification
              </a>
            </li>
            <li>
              <a href="#" style={{
                fontSize: '0.875rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
              }}>
                Cookies
              </a>
            </li>
          </ul>
        </div>

        {/* Brewer Portal */}
        <div>
          <p style={{
            fontSize: '0.75rem',
            fontFamily: 'Bebas Neue',
            color: 'var(--text-secondary)',
            margin: '0 0 0.75rem 0',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Brewer Portal
          </p>
          <a href="/brewer-portal" style={{
            fontSize: '0.875rem',
            fontFamily: 'DM Sans',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
          }}>
            Brewer Login
          </a>
        </div>

        {/* Admin */}
        <div>
          <p style={{
            fontSize: '0.75rem',
            fontFamily: 'Bebas Neue',
            color: 'var(--text-secondary)',
            margin: '0 0 0.75rem 0',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Admin
          </p>
          <a href="/admin" style={{
            fontSize: '0.875rem',
            fontFamily: 'DM Sans',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
          }}>
            Admin Panel
          </a>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '2rem',
      }}>
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          fontSize: '0.875rem',
          fontFamily: 'DM Sans',
          color: 'var(--text-muted)',
        }}>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Instagram</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Facebook</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Twitter</a>
        </div>

        <p style={{
          fontSize: '0.875rem',
          fontFamily: 'DM Sans',
          color: 'var(--text-muted)',
          margin: 0,
        }}>
          © 2026 Beer World. All rights reserved. Please drink responsibly.
        </p>
      </div>
    </footer>
  );
}
