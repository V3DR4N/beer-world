// Mock order data for analytics dashboard
// Orders span the last 90 days with various statuses and customer types

export const initializeMockOrders = () => {
  const existingOrders = localStorage.getItem('beerworld_orders');

  // Only initialize once
  if (existingOrders) {
    return JSON.parse(existingOrders);
  }

  const breweries = [
    { id: 'de-wilde-hop', name: 'De Wilde Hop' },
    { id: 'schwarzwald-brauhaus', name: 'Schwarzwald Brauhaus' },
    { id: 'noorden-brewery', name: 'Noorden Brewery' },
  ];

  const beers = [
    { brewerId: 'de-wilde-hop', name: 'Wilde Saison', price: 4.50 },
    { brewerId: 'de-wilde-hop', name: 'Nacht Lambic', price: 7.50 },
    { brewerId: 'de-wilde-hop', name: 'Zomer Wit', price: 3.80 },
    { brewerId: 'schwarzwald-brauhaus', name: 'Schwarzwald Dunkel', price: 4.20 },
    { brewerId: 'schwarzwald-brauhaus', name: 'Fichten IPA', price: 4.80 },
    { brewerId: 'schwarzwald-brauhaus', name: 'Herbst Rauch', price: 6.50 },
    { brewerId: 'noorden-brewery', name: 'Noorden Pale', price: 3.90 },
    { brewerId: 'noorden-brewery', name: 'Noord Session IPA', price: 3.50 },
    { brewerId: 'noorden-brewery', name: 'Amsterdam Stout', price: 4.10 },
  ];

  const customerNames = [
    'Emma Schmidt', 'Marcus Mueller', 'Sophie Weber', 'Klaus Hoffmann',
    'Anna Fischer', 'Jan van der Berg', 'Lisa Mueller', 'Tom de Cock',
    'Maria Garcia', 'Peter Jansen', 'Sarah Mueller', 'Andreas Fischer',
    'Julia Rossi', 'Martin Larson', 'Elena Kowalski', 'Benjamin Keller',
    'Sophia Wagner', 'David Krämer', 'Hannah Richter', 'Oliver Krause',
  ];

  const cities = [
    'Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt', 'Amsterdam',
    'Rotterdam', 'Utrecht', 'Brussels', 'Antwerp', 'Zurich', 'Bern',
    'Freiburg', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dresden', 'Vienna',
  ];

  const generateOrder = (index) => {
    const orderNum = String(1000 + index).padStart(5, '0');
    const daysAgo = Math.floor(Math.random() * 90);
    const timestamp = Date.now() - daysAgo * 24 * 60 * 60 * 1000;
    const date = new Date(timestamp);

    // Mix of single-brewery (60%) and multi-brewery (40%) orders
    const isMultiBrewery = Math.random() < 0.4;
    const numBeers = isMultiBrewery ? Math.floor(Math.random() * 3) + 2 : 1;

    let selectedBeers = [];
    let items = [];
    let totalAmount = 0;

    if (isMultiBrewery) {
      // Ensure beers from different breweries
      const breweryIds = [...new Set([...Array(numBeers)].map(() =>
        breweries[Math.floor(Math.random() * breweries.length)].id
      ))];

      breweryIds.forEach(breweryId => {
        const breweryBeers = beers.filter(b => b.brewerId === breweryId);
        const selectedBeer = breweryBeers[Math.floor(Math.random() * breweryBeers.length)];
        const quantity = Math.floor(Math.random() * 4) + 1;
        const subtotal = quantity * selectedBeer.price;

        items.push({
          brewerId: breweryId,
          beerName: selectedBeer.name,
          quantity,
          pricePerUnit: selectedBeer.price,
          subtotal: parseFloat(subtotal.toFixed(2)),
        });
        totalAmount += subtotal;
      });
    } else {
      // Single brewery order
      const selectedBeer = beers[Math.floor(Math.random() * beers.length)];
      const quantity = Math.floor(Math.random() * 5) + 1;
      const subtotal = quantity * selectedBeer.price;

      items.push({
        brewerId: selectedBeer.brewerId,
        beerName: selectedBeer.name,
        quantity,
        pricePerUnit: selectedBeer.price,
        subtotal: parseFloat(subtotal.toFixed(2)),
      });
      totalAmount += subtotal;
    }

    // 10-12% failed orders
    const status = Math.random() < 0.11 ? 'failed' : 'successful';

    return {
      id: `BW-${orderNum}`,
      customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
      customerCity: cities[Math.floor(Math.random() * cities.length)],
      customerEmail: `customer${index}@example.com`,
      customerSessionId: `session-${Math.random().toString(36).substring(7)}`,
      timestamp,
      date: date.toISOString().split('T')[0],
      dateFormatted: date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      items,
      status,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
    };
  };

  // Generate 70 orders
  const orders = [...Array(70)].map((_, idx) => generateOrder(idx));

  // Save to localStorage
  localStorage.setItem('beerworld_orders', JSON.stringify(orders));

  return orders;
};

export const getOrdersFromStorage = () => {
  const ordersStr = localStorage.getItem('beerworld_orders');
  return ordersStr ? JSON.parse(ordersStr) : [];
};
