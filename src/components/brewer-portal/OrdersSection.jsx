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

const ITEMS_PER_PAGE = 5;

export default function OrdersSection() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // First filter by status
  const statusFiltered =
    activeFilter === 'all' ? BREWER_ORDERS : BREWER_ORDERS.filter((o) => o.status === activeFilter);

  // Then filter by search query
  const filteredOrders = statusFiltered.filter((order) => {
    const query = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.city.toLowerCase().includes(query)
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // Reset to page 1 when filter changes
  const handleFilterChange = (newFilter) => {
    setActiveFilter(newFilter);
    setCurrentPage(1);
    setSearchQuery('');
  };

  // Reset pagination when search changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

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

      {/* Search Box */}
      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search by Order ID, Customer, or City..."
          value={searchQuery}
          onChange={handleSearchChange}
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
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--accent-amber)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
        />
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleFilterChange(tab.key)}
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
              {paginatedOrders.map((order) => (
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

      {/* Pagination Controls */}
      {filteredOrders.length > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '2rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          {/* Page Info */}
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              margin: '0',
            }}
          >
            Showing {startIdx + 1} to {Math.min(startIdx + ITEMS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length}
          </p>

          {/* Page Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  padding: '0.5rem 0.75rem',
                  backgroundColor:
                    currentPage === page ? 'var(--accent-amber)' : 'var(--background-tertiary)',
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
