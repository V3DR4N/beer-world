export const BREWER_DATA = {
  id: "schwarzwald-brauhaus",
  name: "Schwarzwald Brauhaus",
  location: "Freiburg, Germany",
  foundedYear: 2009,
  email: "hello@schwarzwald-brauhaus.de",
  phone: "+49 761 123 4567",
  description: "Ancient forest. Modern craft.",
};

export const BREWER_BEERS = [
  {
    id: "beer-1",
    name: "Schwarzwald Dunkel",
    style: "Dark Lager",
    abv: 5.4,
    volume: 500,
    price: 5.20,
    inStock: true,
  },
  {
    id: "beer-2",
    name: "Schwarzwald Smoked",
    style: "Smoked Beer",
    abv: 5.8,
    volume: 500,
    price: 5.80,
    inStock: true,
  },
  {
    id: "beer-3",
    name: "Schwarzwald IPA",
    style: "IPA",
    abv: 6.5,
    volume: 500,
    price: 6.20,
    inStock: false,
  },
];

export const BREWER_ORDERS = [
  {
    id: "ORD-001",
    customerName: "Emma Schmidt",
    city: "Berlin",
    date: "2026-03-28",
    status: "pending",
    beers: [
      { name: "Schwarzwald Dunkel", quantity: 10, pricePerUnit: 5.20 },
    ],
    amount: 52.00,
  },
  {
    id: "ORD-002",
    customerName: "Marcus Mueller",
    city: "Munich",
    date: "2026-03-27",
    status: "shipped",
    beers: [
      { name: "Schwarzwald Smoked", quantity: 8, pricePerUnit: 5.80 },
      { name: "Schwarzwald IPA", quantity: 12, pricePerUnit: 6.20 },
    ],
    amount: 120.80,
  },
  {
    id: "ORD-003",
    customerName: "Anna Weber",
    city: "Berlin",
    date: "2026-03-26",
    status: "delivered",
    beers: [
      { name: "Schwarzwald Dunkel", quantity: 10, pricePerUnit: 5.20 },
    ],
    amount: 52.00,
  },
  {
    id: "ORD-004",
    customerName: "Klaus Fischer",
    city: "Frankfurt",
    date: "2026-03-25",
    status: "pending",
    beers: [
      { name: "Schwarzwald Smoked", quantity: 10, pricePerUnit: 5.80 },
    ],
    amount: 58.00,
  },
  {
    id: "ORD-005",
    customerName: "Sarah Hoffmann",
    city: "Stuttgart",
    date: "2026-03-24",
    status: "shipped",
    beers: [
      { name: "Schwarzwald IPA", quantity: 10, pricePerUnit: 6.20 },
    ],
    amount: 62.00,
  },
  {
    id: "ORD-006",
    customerName: "Thomas Mueller",
    city: "Hamburg",
    date: "2026-03-23",
    status: "delivered",
    beers: [
      { name: "Schwarzwald Dunkel", quantity: 10, pricePerUnit: 5.20 },
      { name: "Schwarzwald Smoked", quantity: 5, pricePerUnit: 5.80 },
    ],
    amount: 81.00,
  },
  {
    id: "ORD-007",
    customerName: "Petra Schmidt",
    city: "Cologne",
    date: "2026-03-22",
    status: "delivered",
    beers: [
      { name: "Schwarzwald IPA", quantity: 10, pricePerUnit: 6.20 },
    ],
    amount: 62.00,
  },
  {
    id: "ORD-008",
    customerName: "Michael Beck",
    city: "Leipzig",
    date: "2026-03-21",
    status: "pending",
    beers: [
      { name: "Schwarzwald Dunkel", quantity: 8, pricePerUnit: 5.20 },
      { name: "Schwarzwald IPA", quantity: 8, pricePerUnit: 6.20 },
    ],
    amount: 95.20,
  },
  {
    id: "ORD-009",
    customerName: "Julia Braun",
    city: "Düsseldorf",
    date: "2026-03-20",
    status: "shipped",
    beers: [
      { name: "Schwarzwald Smoked", quantity: 10, pricePerUnit: 5.80 },
    ],
    amount: 58.00,
  },
  {
    id: "ORD-010",
    customerName: "Wolfgang Lang",
    city: "Nuremberg",
    date: "2026-03-19",
    status: "delivered",
    beers: [
      { name: "Schwarzwald Dunkel", quantity: 10, pricePerUnit: 5.20 },
      { name: "Schwarzwald Smoked", quantity: 5, pricePerUnit: 5.80 },
      { name: "Schwarzwald IPA", quantity: 8, pricePerUnit: 6.20 },
    ],
    amount: 148.40,
  },
];
