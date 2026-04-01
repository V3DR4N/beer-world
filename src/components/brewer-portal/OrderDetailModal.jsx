import { useState } from 'react';

const STATUS_MESSAGES = {
  pending: 'Awaiting shipment',
  shipped: 'In transit',
  delivered: 'Delivered',
};

export default function OrderDetailModal({ order, isOpen, onClose, statusColors }) {
  if (!isOpen || !order) return null;

  // Calculate totals
  const itemsTotal = order.beers.reduce((sum, item) => {
    return sum + item.quantity * item.pricePerUnit;
  }, 0);

  return (
    <div
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
        padding: '2rem',
        zIndex: 998,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--background-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: '2rem',
          fontFamily: 'DM Sans, sans-serif',
          zIndex: 999,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0',
            width: '2rem',
            height: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.target.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
        >
          ×
        </button>

        {/* Order Header */}
        <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div>
              <h1
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '1.5rem',
                  letterSpacing: '1px',
                  color: 'var(--text-primary)',
                  margin: '0 0 0.5rem 0',
                }}
              >
                {order.id}
              </h1>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  margin: '0',
                }}
              >
                {order.date}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: statusColors[order.status],
                  color: order.status === 'pending' ? '#000' : '#fff',
                  borderRadius: '4px',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                }}
              >
                {order.status}
              </span>
              <div style={{ textAlign: 'right' }}>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    margin: '0 0 0.25rem 0',
                    textTransform: 'uppercase',
                  }}
                >
                  Total
                </p>
                <p
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    margin: '0',
                  }}
                >
                  €{order.amount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div
          style={{
            marginBottom: '2rem',
            padding: '1rem',
            backgroundColor: 'var(--background-tertiary)',
            borderRadius: '4px',
          }}
        >
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              margin: '0 0 0.5rem 0',
              textTransform: 'uppercase',
              fontWeight: '500',
            }}
          >
            Customer Information
          </p>
          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--text-primary)',
              margin: '0 0 0.25rem 0',
              fontWeight: '500',
            }}
          >
            {order.customerName}
          </p>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              margin: '0',
            }}
          >
            {order.city}
          </p>
        </div>

        {/* Items Ordered */}
        <div style={{ marginBottom: '2rem' }}>
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              margin: '0 0 1rem 0',
              textTransform: 'uppercase',
              fontWeight: '500',
            }}
          >
            Items Ordered
          </p>

          {/* Items Table */}
          <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.875rem',
              }}
            >
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <th
                    style={{
                      padding: '0.75rem 0',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    Beer
                  </th>
                  <th
                    style={{
                      padding: '0.75rem 0',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    Qty
                  </th>
                  <th
                    style={{
                      padding: '0.75rem 0',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    Price
                  </th>
                  <th
                    style={{
                      padding: '0.75rem 0',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.beers.map((item, index) => {
                  const subtotal = item.quantity * item.pricePerUnit;
                  return (
                    <tr
                      key={index}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                      }}
                    >
                      <td
                        style={{
                          padding: '0.75rem 0',
                          color: 'var(--text-primary)',
                          fontWeight: '500',
                        }}
                      >
                        {item.name.replace('Schwarzwald ', '')}
                      </td>
                      <td
                        style={{
                          padding: '0.75rem 0',
                          textAlign: 'center',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {item.quantity}
                      </td>
                      <td
                        style={{
                          padding: '0.75rem 0',
                          textAlign: 'right',
                          color: 'var(--text-primary)',
                        }}
                      >
                        €{item.pricePerUnit.toFixed(2)}
                      </td>
                      <td
                        style={{
                          padding: '0.75rem 0',
                          textAlign: 'right',
                          color: 'var(--text-primary)',
                          fontWeight: '500',
                        }}
                      >
                        €{subtotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Items Summary */}
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--background-tertiary)',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                fontWeight: '500',
              }}
            >
              {order.beers.length} item{order.beers.length !== 1 ? 's' : ''}
            </span>
            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
              }}
            >
              €{order.amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Status Timeline */}
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--background-tertiary)',
            borderRadius: '4px',
            borderLeft: `4px solid ${statusColors[order.status]}`,
          }}
        >
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              margin: '0 0 0.5rem 0',
              textTransform: 'uppercase',
              fontWeight: '500',
            }}
          >
            Status
          </p>
          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--text-primary)',
              margin: '0',
              fontWeight: '500',
            }}
          >
            {STATUS_MESSAGES[order.status]}
          </p>
        </div>
      </div>
    </div>
  );
}
