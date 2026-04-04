// Analytics calculation functions for admin dashboard

const BREWERIES = [
  { id: 'de-wilde-hop', name: 'De Wilde Hop' },
  { id: 'schwarzwald-brauhaus', name: 'Schwarzwald Brauhaus' },
  { id: 'noorden-brewery', name: 'Noorden Brewery' },
];

/**
 * Filter orders by date range
 */
export const getOrders = (orders, startDate, endDate) => {
  return orders.filter(order => {
    const orderTime = new Date(order.timestamp).getTime();
    return orderTime >= startDate.getTime() && orderTime <= endDate.getTime();
  });
};

/**
 * Calculate orders per brewery
 * Returns object: { breweryId: { name, count, percentage } }
 */
export const calculateOrdersPerBrewery = (orders) => {
  const result = {};

  BREWERIES.forEach(brewery => {
    result[brewery.id] = {
      name: brewery.name,
      count: 0,
      percentage: 0,
    };
  });

  orders.forEach(order => {
    const breweriesInOrder = new Set();
    order.items.forEach(item => {
      breweriesInOrder.add(item.brewerId);
    });

    breweriesInOrder.forEach(brewerId => {
      if (result[brewerId]) {
        result[brewerId].count += 1;
      }
    });
  });

  const totalOrders = Object.values(result).reduce((sum, b) => sum + b.count, 0);
  Object.keys(result).forEach(brewerId => {
    result[brewerId].percentage = totalOrders > 0
      ? ((result[brewerId].count / totalOrders) * 100).toFixed(1)
      : 0;
  });

  return result;
};

/**
 * Calculate multi-brewery order rate
 * Returns: { rate, combinations }
 */
export const calculateMultiBreweryOrderRate = (orders) => {
  let multiBreweryCount = 0;
  const combinations = {};

  orders.forEach(order => {
    const breweriesInOrder = new Set(order.items.map(item => item.brewerId));

    if (breweriesInOrder.size > 1) {
      multiBreweryCount += 1;

      // Track combinations
      const sortedBrewerIds = Array.from(breweriesInOrder).sort().join('+');
      combinations[sortedBrewerIds] = (combinations[sortedBrewerIds] || 0) + 1;
    }
  });

  // Get top 3 combinations
  const topCombinations = Object.entries(combinations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([combo, count]) => {
      const breweryIds = combo.split('+');
      const breweryNames = breweryIds.map(id => {
        const brewery = BREWERIES.find(b => b.id === id);
        return brewery ? brewery.name : id;
      });
      return {
        breweries: breweryNames.join(' + '),
        count,
      };
    });

  const rate = orders.length > 0
    ? ((multiBreweryCount / orders.length) * 100).toFixed(1)
    : 0;

  return {
    rate: parseFloat(rate),
    count: multiBreweryCount,
    totalOrders: orders.length,
    combinations: topCombinations,
  };
};

/**
 * Calculate average items per order
 */
export const calculateAvgItemsPerOrder = (orders) => {
  if (orders.length === 0) return 0;

  const totalItems = orders.reduce((sum, order) => {
    const itemCount = order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    return sum + itemCount;
  }, 0);

  return (totalItems / orders.length).toFixed(2);
};

/**
 * Calculate repeat purchase rate
 * Returns percentage of unique customers who made 2+ orders
 */
export const calculateRepeatPurchaseRate = (orders) => {
  const customerOrders = {};

  orders.forEach(order => {
    const customerId = order.customerEmail || order.customerSessionId;
    if (!customerOrders[customerId]) {
      customerOrders[customerId] = 0;
    }
    customerOrders[customerId] += 1;
  });

  const totalCustomers = Object.keys(customerOrders).length;
  const repeatCustomers = Object.values(customerOrders).filter(count => count >= 2).length;

  const rate = totalCustomers > 0
    ? ((repeatCustomers / totalCustomers) * 100).toFixed(1)
    : 0;

  return {
    rate: parseFloat(rate),
    repeatCustomers,
    totalCustomers,
  };
};

/**
 * Calculate order status distribution
 * Returns: { successful: count, failed: count, successRate }
 */
export const calculateOrderStats = (orders) => {
  const successful = orders.filter(o => o.status === 'successful').length;
  const failed = orders.filter(o => o.status === 'failed').length;
  const total = orders.length;

  const successRate = total > 0
    ? ((successful / total) * 100).toFixed(1)
    : 0;

  return {
    successful,
    failed,
    total,
    successRate: parseFloat(successRate),
  };
};

/**
 * Calculate total metrics
 * Returns: { totalOrders, totalGMV, avgOrderValue, totalCustomers }
 */
export const calculateTotalMetrics = (orders) => {
  const totalOrders = orders.length;
  const totalGMV = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const avgOrderValue = totalOrders > 0
    ? (totalGMV / totalOrders).toFixed(2)
    : 0;

  const uniqueCustomers = new Set(
    orders.map(o => o.customerEmail || o.customerSessionId)
  ).size;

  return {
    totalOrders,
    totalGMV: parseFloat(totalGMV.toFixed(2)),
    avgOrderValue: parseFloat(avgOrderValue),
    totalCustomers: uniqueCustomers,
  };
};

/**
 * Get all analytics for a date range
 */
export const getAllAnalytics = (orders, startDate, endDate) => {
  const filteredOrders = getOrders(orders, startDate, endDate);

  return {
    orders: filteredOrders,
    ordersPerBrewery: calculateOrdersPerBrewery(filteredOrders),
    multiBreweryRate: calculateMultiBreweryOrderRate(filteredOrders),
    avgItemsPerOrder: calculateAvgItemsPerOrder(filteredOrders),
    repeatPurchaseRate: calculateRepeatPurchaseRate(filteredOrders),
    orderStats: calculateOrderStats(filteredOrders),
    totalMetrics: calculateTotalMetrics(filteredOrders),
  };
};

/**
 * Get date range for preset option
 */
export const getDateRange = (preset) => {
  const endDate = new Date();
  const startDate = new Date();

  switch (preset) {
    case 'last7':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'last30':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case 'last90':
      startDate.setDate(startDate.getDate() - 90);
      break;
    case 'all':
      startDate.setFullYear(2000); // Far in the past
      break;
    default:
      startDate.setDate(startDate.getDate() - 30);
  }

  return { startDate, endDate };
};
