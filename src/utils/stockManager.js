const STOCK_KEY = 'beerworld_brewer_stock';

// Initialize stock from mock data
export const initializeStock = (beers) => {
  const existingStock = localStorage.getItem(STOCK_KEY);
  if (!existingStock) {
    const initialStock = {};
    beers.forEach(beer => {
      initialStock[beer.id] = beer.stock || 0;
    });
    localStorage.setItem(STOCK_KEY, JSON.stringify(initialStock));
  }
};

// Get all stock
export const getAllStock = () => {
  const stock = localStorage.getItem(STOCK_KEY);
  return stock ? JSON.parse(stock) : {};
};

// Get stock for specific beer
export const getStock = (beerId) => {
  const allStock = getAllStock();
  return allStock[beerId] || 0;
};

// Set stock for specific beer
export const setStock = (beerId, quantity) => {
  const allStock = getAllStock();
  allStock[beerId] = Math.max(0, quantity);
  localStorage.setItem(STOCK_KEY, JSON.stringify(allStock));
};

// Reduce stock by quantity (when order is placed)
export const reduceStock = (beerId, quantity) => {
  const currentStock = getStock(beerId);
  const newStock = Math.max(0, currentStock - quantity);
  setStock(beerId, newStock);
  return newStock;
};

// Check if beer is in stock
export const isInStock = (beerId) => {
  return getStock(beerId) > 0;
};

// Check if stock is low (< 20)
export const isLowStock = (beerId) => {
  const stock = getStock(beerId);
  return stock > 0 && stock < 20;
};

// Get low stock items (for brewer alert)
export const getLowStockItems = (beers) => {
  return beers.filter(beer => isLowStock(beer.id));
};

// Reduce stock for multiple beers (from order items)
export const reduceStockForOrder = (items) => {
  items.forEach(item => {
    reduceStock(item.brewerId, item.quantity);
  });
};
