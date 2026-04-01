import { useState } from 'react';
import { BREWER_ORDERS } from '../../data/brewerPortalMockData';
import OrderDetailModal from './OrderDetailModal';

const STATUS_COLORS = {
  pending: 'var(--accent-amber)',
  shipped: '#3B82F6',
  delivered: '#2D7A4F',
};

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

export default function OrdersSection() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredOrders =
    activeFilter === 'all' ? BREWER_ORDERS : BREWER_ORDERS.filter((o) => o.status === activeFilter);

  const getStatusBadge = (status) => (
    <span
      style={{
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        backgroundColor: STATUS_COLORS[status],
        color: status === 'pending' ? '#000' : '#fff',
        borderRadius: '4px',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '0.75rem',
        fontWeight: '500',
        textTransform: 'uppercase',
      }}
    >
      {status}
    </span>
  );

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
        Orders
      </h1>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom:
                activeFilter === tab.key ? `2px solid var(--accent-amber)` : '2px solid transparent',
              color:
                activeFilter === tab.key
                  ? 'var(--accent-amber)'
                  : 'var(--text-secondary)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.875rem',
              fontWeight: activeFilter === tab.key ? '600' : '400',
              cursor: 'pointer',
              transition: 'color 0.2s, border-bottom-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (activeFilter !== tab.key) {
                e.target.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== tab.key) {
                e.target.style.color = 'var(--text-secondary)';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div
        style={{
          backgroundColor: 'var(--background-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th
                  style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    backgroundColor: 'var(--background-tertiary)',
                  }}
                >
                  Order ID
                </th>
                <th
                  style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    backgroundColor: 'var(--background-tertiary)',
                  }}
                >
                  Customer
                </th>
                <th
                  style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    backgroundColor: 'var(--background-tertiary)',
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    backgroundColor: 'var(--background-tertiary)',
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    backgroundColor: 'var(--background-tertiary)',
                  }}
                >
                  Items
                </th>
                <th
                  style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'right',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    backgroundColor: 'var(--background-tertiary)',
                  }}
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowDetailModal(true);
                  }}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background-color 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--background-tertiary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td
                    style={{
                      padding: '1rem 1.5rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {order.id}
                  </td>
                  <td
                    style={{
                      padding: '1rem 1.5rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {order.customerName}
                  </td>
                  <td
                    style={{
                      padding: '1rem 1.5rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {order.date}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>{getStatusBadge(order.status)}</td>
                  <td
                    style={{
                      padding: '1rem 1.5rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {order.beers.map((item) => item.name.replace('Schwarzwald ', '')).join(', ')}
                  </td>
                  <td
                    style={{
                      padding: '1rem 1.5rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem',
                      textAlign: 'right',
                      fontWeight: '500',
                    }}
                  >
                    €{order.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                margin: '0',
              }}
            >
              No orders found for this filter.
            </p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          statusColors={STATUS_COLORS}
        />
      )}
    </div>
  );
}
