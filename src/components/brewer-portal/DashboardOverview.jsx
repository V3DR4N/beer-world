import { useContext } from 'react';
import { BrewerSessionContext } from '../../context/BrewerSessionContext';
import { BREWER_ORDERS } from '../../data/brewerPortalMockData';

const STATUS_COLORS = {
  pending: 'var(--accent-amber)',
  shipped: '#3B82F6',
  delivered: '#2D7A4F',
};

const StatCard = ({ title, value }) => (
  <div
    style={{
      flex: 1,
      backgroundColor: 'var(--background-secondary)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '8px',
      padding: '1.5rem',
      minWidth: '0',
    }}
  >
    <p
      style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
        margin: '0 0 0.5rem 0',
      }}
    >
      {title}
    </p>
    <p
      style={{
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: '2rem',
        letterSpacing: '1px',
        color: 'var(--accent-amber)',
        margin: '0',
      }}
    >
      {value}
    </p>
  </div>
);

export default function DashboardOverview() {
  const { brewerData } = useContext(BrewerSessionContext);
  const recentOrders = BREWER_ORDERS.slice(0, 5);

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
      {/* Welcome Message */}
      <h1
        style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: '2rem',
          letterSpacing: '1px',
          color: 'var(--text-primary)',
          margin: '0 0 2rem 0',
        }}
      >
        Welcome back, {brewerData?.name}
      </h1>

      {/* Stat Cards */}
      <div
        style={{
          display: 'flex',
          gap: '1.5rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        <StatCard title="Total Orders" value="24" />
        <StatCard title="Beers Listed" value="3" />
        <StatCard title="Monthly Revenue" value="€1,240" />
      </div>

      {/* Recent Orders Section */}
      <div
        style={{
          backgroundColor: 'var(--background-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '1.25rem',
              letterSpacing: '1px',
              color: 'var(--text-primary)',
              margin: '0',
            }}
          >
            Recent Orders
          </h2>
        </div>

        {/* Table */}
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
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background-color 0.2s',
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
                    {order.customerName} ({order.city})
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
      </div>
    </div>
  );
}
