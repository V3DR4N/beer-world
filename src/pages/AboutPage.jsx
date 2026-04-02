import { motion } from 'framer-motion';
import { useResponsive } from '../hooks/useResponsive';

export default function AboutPage() {
  const isMobile = useResponsive(768);
  return (
    <div style={{ backgroundColor: 'var(--background-primary)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          padding: '4rem 2rem',
          backgroundColor: 'var(--background-secondary)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontFamily: 'Bebas Neue',
            color: 'var(--accent-amber)',
            margin: '0 0 1.5rem 0',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}>
            About Beer World
          </h1>
          <p style={{
            fontSize: '1.25rem',
            fontFamily: 'DM Sans',
            color: 'var(--accent-cream)',
            margin: 0,
            lineHeight: 1.6,
          }}>
            Connecting craft beer enthusiasts with breweries that push boundaries, innovate fearlessly, and brew with purpose.
          </p>
        </div>
      </motion.section>

      {/* Content Sections */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem' }}>
        {/* Our Mission */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ marginBottom: '4rem' }}
        >
          <h2 style={{
            fontSize: '2rem',
            fontFamily: 'Bebas Neue',
            color: 'var(--text-primary)',
            margin: '0 0 1.5rem 0',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Our Mission
          </h2>
          <p style={{
            fontSize: '1.125rem',
            fontFamily: 'DM Sans',
            color: 'var(--text-secondary)',
            lineHeight: 1.8,
            margin: '0 0 1rem 0',
          }}>
            We believe craft beer is more than a beverage—it's a craft, a culture, and a conversation. Beer World exists to bridge the gap between passionate brewers and curious drinkers, making it easier to discover, learn about, and enjoy exceptional beers from independent breweries around the world.
          </p>
          <p style={{
            fontSize: '1.125rem',
            fontFamily: 'DM Sans',
            color: 'var(--text-secondary)',
            lineHeight: 1.8,
            margin: 0,
          }}>
            Our platform helps you navigate the vast world of craft beer through personalized recommendations, brewery stories, and direct connections to the people behind every bottle.
          </p>
        </motion.section>

        {/* Divider */}
        <div style={{
          height: '1px',
          backgroundColor: 'var(--border-subtle)',
          margin: '3rem 0',
        }} />

        {/* Why Beer World */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ marginBottom: '4rem' }}
        >
          <h2 style={{
            fontSize: '2rem',
            fontFamily: 'Bebas Neue',
            color: 'var(--text-primary)',
            margin: '0 0 2rem 0',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Why Beer World
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: isMobile ? '1rem' : '2rem',
          }}>
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              style={{
                backgroundColor: 'var(--background-secondary)',
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <h3 style={{
                fontSize: '1.25rem',
                fontFamily: 'Bebas Neue',
                color: 'var(--accent-amber)',
                margin: '0 0 1rem 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Personalized Discovery
              </h3>
              <p style={{
                fontSize: '0.95rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                margin: 0,
              }}>
                Our mood-based quiz understands your preferences, delivering curated recommendations that match your taste profile and drinking occasion.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                backgroundColor: 'var(--background-secondary)',
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <h3 style={{
                fontSize: '1.25rem',
                fontFamily: 'Bebas Neue',
                color: 'var(--accent-amber)',
                margin: '0 0 1rem 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Brewery Stories
              </h3>
              <p style={{
                fontSize: '0.95rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                margin: 0,
              }}>
                Go beyond the bottle. Learn the stories of the brewers who pour passion into every batch—their inspirations, philosophies, and commitment to craft.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              style={{
                backgroundColor: 'var(--background-secondary)',
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <h3 style={{
                fontSize: '1.25rem',
                fontFamily: 'Bebas Neue',
                color: 'var(--accent-amber)',
                margin: '0 0 1rem 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Sustainable Focus
              </h3>
              <p style={{
                fontSize: '0.95rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                margin: 0,
              }}>
                We champion breweries that prioritize sustainability, local sourcing, and environmental responsibility—because great beer shouldn't come at the planet's expense.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Divider */}
        <div style={{
          height: '1px',
          backgroundColor: 'var(--border-subtle)',
          margin: '3rem 0',
        }} />

        {/* Our Values */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ marginBottom: '4rem' }}
        >
          <h2 style={{
            fontSize: '2rem',
            fontFamily: 'Bebas Neue',
            color: 'var(--text-primary)',
            margin: '0 0 1.5rem 0',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Our Values
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
          }}>
            <div>
              <h3 style={{
                fontSize: '1rem',
                fontFamily: 'Bebas Neue',
                color: 'var(--accent-amber)',
                margin: '0 0 0.75rem 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Authenticity
              </h3>
              <p style={{
                fontSize: '0.95rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                margin: 0,
              }}>
                We celebrate craft beer in its truest form—unfiltered, uncompromising, and genuine.
              </p>
            </div>

            <div>
              <h3 style={{
                fontSize: '1rem',
                fontFamily: 'Bebas Neue',
                color: 'var(--accent-amber)',
                margin: '0 0 0.75rem 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Community
              </h3>
              <p style={{
                fontSize: '0.95rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                margin: 0,
              }}>
                We build connections between brewers and drinkers, fostering a community that appreciates quality and craftsmanship.
              </p>
            </div>

            <div>
              <h3 style={{
                fontSize: '1rem',
                fontFamily: 'Bebas Neue',
                color: 'var(--accent-amber)',
                margin: '0 0 0.75rem 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Innovation
              </h3>
              <p style={{
                fontSize: '0.95rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                margin: 0,
              }}>
                We support brewers who experiment, innovate, and push the boundaries of what beer can be.
              </p>
            </div>

            <div>
              <h3 style={{
                fontSize: '1rem',
                fontFamily: 'Bebas Neue',
                color: 'var(--accent-amber)',
                margin: '0 0 0.75rem 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Responsibility
              </h3>
              <p style={{
                fontSize: '0.95rem',
                fontFamily: 'DM Sans',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                margin: 0,
              }}>
                We promote responsible drinking and environmental stewardship in everything we do.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Divider */}
        <div style={{
          height: '1px',
          backgroundColor: 'var(--border-subtle)',
          margin: '3rem 0',
        }} />

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          style={{
            backgroundColor: 'var(--background-secondary)',
            padding: '3rem 2rem',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            textAlign: 'center',
          }}
        >
          <h2 style={{
            fontSize: '2rem',
            fontFamily: 'Bebas Neue',
            color: 'var(--text-primary)',
            margin: '0 0 1rem 0',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Ready to Explore?
          </h2>
          <p style={{
            fontSize: '1.125rem',
            fontFamily: 'DM Sans',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            margin: '0 0 2rem 0',
          }}>
            Start your craft beer journey today. Take our mood-based quiz to discover beers perfectly matched to your taste.
          </p>
          <a
            href="/quiz"
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--accent-amber)',
              color: 'var(--background-primary)',
              padding: '0.75rem 2rem',
              borderRadius: '6px',
              fontSize: '0.95rem',
              fontFamily: 'DM Sans',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'background-color 200ms ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-amber-light)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-amber)'}
          >
            Take the Quiz
          </a>
        </motion.section>
      </div>
    </div>
  );
}
