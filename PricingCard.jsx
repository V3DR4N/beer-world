import React from 'react';

function PricingCard({ title, price, buttonLabel = 'Get Started', onButtonClick }) {
  return (
    <div style={styles.card}>
      <h2 style={styles.title}>{title}</h2>
      <p style={styles.price}>{price}</p>
      <button style={styles.button} onClick={onButtonClick}>
        {buttonLabel}
      </button>
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '32px',
    textAlign: 'center',
    maxWidth: '300px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#333',
  },
  price: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#4f46e5',
    marginBottom: '24px',
  },
  button: {
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 24px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

export default PricingCard;
