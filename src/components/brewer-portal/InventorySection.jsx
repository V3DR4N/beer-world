import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllStock, setStock, isLowStock } from '../../utils/stockManager';
import { BREWER_BEERS } from '../../data/brewerPortalMockData';

export default function InventorySection() {
  const [beers, setBeers] = useState([]);
  const [editingBeer, setEditingBeer] = useState(null);
  const [editQuantity, setEditQuantity] = useState('');
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    const stock = getAllStock();
    const beersWithStock = BREWER_BEERS.map(beer => ({
      ...beer,
      currentStock: stock[beer.id] || beer.stock || 0,
    }));
    setBeers(beersWithStock);

    // Check for low stock items
    const low = beersWithStock.filter(beer => isLowStock(beer.id));
    setLowStockItems(low);
  }, []);

  const handleEditClick = (beer) => {
    setEditingBeer(beer.id);
    setEditQuantity(beer.currentStock.toString());
  };

  const handleSaveStock = (beerId) => {
    const quantity = parseInt(editQuantity, 10);
    if (!isNaN(quantity) && quantity >= 0) {
      setStock(beerId, quantity);
      setBeers(prev =>
        prev.map(beer =>
          beer.id === beerId
            ? { ...beer, currentStock: quantity }
            : beer
        )
      );

      // Update low stock alert
      const low = beers.filter(beer => isLowStock(beer.id));
      setLowStockItems(low);

      setEditingBeer(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor: 'var(--background-primary)',
        minHeight: '100vh',
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
      }}>
        {/* Header */}
        <h1 style={{
          fontSize: '2rem',
          fontFamily: 'Bebas Neue',
          color: 'var(--text-primary)',
          margin: '0 0 1rem 0',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          Inventory Management
        </h1>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              backgroundColor: 'rgba(232, 146, 10, 0.15)',
              border: '1px solid var(--accent-amber)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '2rem',
            }}
          >
            <p style={{
              fontSize: '0.875rem',
              fontFamily: 'DM Sans',
              color: 'var(--accent-amber)',
              margin: '0 0 0.5rem 0',
              fontWeight: '600',
              textTransform: 'uppercase',
            }}>
              ⚠️ Low Stock Alert
            </p>
            <p style={{
              fontSize: '0.875rem',
              fontFamily: 'DM Sans',
              color: 'var(--text-secondary)',
              margin: 0,
            }}>
              {lowStockItems.map(beer => beer.name).join(', ')} {lowStockItems.length === 1 ? 'has' : 'have'} less than 20 units in stock.
            </p>
          </motion.div>
        )}

        {/* Inventory Table */}
        <div style={{
          backgroundColor: 'var(--background-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}>
            <thead>
              <tr style={{
                backgroundColor: 'var(--background-tertiary)',
                borderBottom: '1px solid var(--border-subtle)',
              }}>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontFamily: 'DM Sans',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                }}>
                  Beer Name
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontFamily: 'DM Sans',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                }}>
                  Style
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontFamily: 'DM Sans',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                }}>
                  Current Stock
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontFamily: 'DM Sans',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                }}>
                  Status
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontFamily: 'DM Sans',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {beers.map((beer, idx) => (
                <tr
                  key={beer.id}
                  style={{
                    borderBottom: idx < beers.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  }}
                >
                  {/* Beer Name */}
                  <td style={{
                    padding: '1rem',
                    fontSize: '0.95rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-primary)',
                    fontWeight: '600',
                  }}>
                    {beer.name}
                  </td>

                  {/* Style */}
                  <td style={{
                    padding: '1rem',
                    fontSize: '0.875rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-secondary)',
                  }}>
                    {beer.style}
                  </td>

                  {/* Current Stock */}
                  <td style={{
                    padding: '1rem',
                    textAlign: 'center',
                    fontSize: '0.95rem',
                    fontFamily: 'DM Sans',
                    color: 'var(--text-primary)',
                    fontWeight: '600',
                  }}>
                    {editingBeer === beer.id ? (
                      <input
                        type="number"
                        value={editQuantity}
                        onChange={(e) => setEditQuantity(e.target.value)}
                        min="0"
                        style={{
                          width: '80px',
                          padding: '0.5rem',
                          backgroundColor: 'var(--background-tertiary)',
                          border: '1px solid var(--accent-amber)',
                          color: 'var(--text-primary)',
                          fontFamily: 'DM Sans',
                          borderRadius: '4px',
                          textAlign: 'center',
                        }}
                        autoFocus
                      />
                    ) : (
                      beer.currentStock
                    )}
                  </td>

                  {/* Status */}
                  <td style={{
                    padding: '1rem',
                    textAlign: 'center',
                  }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.3rem 0.75rem',
                      backgroundColor: beer.currentStock === 0 ? 'rgba(192, 57, 43, 0.2)' : isLowStock(beer.id) ? 'rgba(232, 146, 10, 0.2)' : 'rgba(45, 122, 79, 0.2)',
                      color: beer.currentStock === 0 ? '#C0392B' : isLowStock(beer.id) ? 'var(--accent-amber)' : '#2D7A4F',
                      fontSize: '0.75rem',
                      fontFamily: 'DM Sans',
                      fontWeight: '600',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                    }}>
                      {beer.currentStock === 0 ? 'Out of Stock' : isLowStock(beer.id) ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>

                  {/* Action */}
                  <td style={{
                    padding: '1rem',
                    textAlign: 'center',
                  }}>
                    {editingBeer === beer.id ? (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleSaveStock(beer.id)}
                          style={{
                            padding: '0.4rem 0.8rem',
                            backgroundColor: 'var(--accent-amber)',
                            color: 'var(--background-primary)',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontFamily: 'DM Sans',
                            fontWeight: '600',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            transition: 'all 200ms ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--accent-amber-light)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--accent-amber)';
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingBeer(null)}
                          style={{
                            padding: '0.4rem 0.8rem',
                            backgroundColor: 'transparent',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-medium)',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontFamily: 'DM Sans',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 200ms ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--text-secondary)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-medium)';
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditClick(beer)}
                        style={{
                          padding: '0.4rem 0.8rem',
                          backgroundColor: 'transparent',
                          color: 'var(--accent-amber)',
                          border: '1px solid var(--accent-amber)',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontFamily: 'DM Sans',
                          fontWeight: '600',
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                          transition: 'all 200ms ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--accent-amber)';
                          e.currentTarget.style.color = 'var(--background-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--accent-amber)';
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
