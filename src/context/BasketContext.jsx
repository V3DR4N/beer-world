import { createContext, useState, useEffect } from 'react';

export const BasketContext = createContext();

export function BasketProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('beerworld_basket');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('beerworld_basket', JSON.stringify(items));
  }, [items]);

  const addItem = (brewerId, breweryName, beerName, price, style) => {
    setItems(prev => {
      const existing = prev.find(item => item.brewerId === brewerId);
      if (existing) {
        return prev.map(item =>
          item.brewerId === brewerId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { brewerId, breweryName, beerName, price, style, quantity: 1 }];
    });
  };

  const removeItem = (brewerId) => {
    setItems(prev => prev.filter(item => item.brewerId !== brewerId));
  };

  const updateQuantity = (brewerId, quantity) => {
    if (quantity <= 0) {
      removeItem(brewerId);
    } else {
      setItems(prev =>
        prev.map(item =>
          item.brewerId === brewerId ? { ...item, quantity } : item
        )
      );
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const clearBasket = () => setItems([]);

  return (
    <BasketContext.Provider value={{ items, addItem, removeItem, updateQuantity, itemCount, total, clearBasket }}>
      {children}
    </BasketContext.Provider>
  );
}
