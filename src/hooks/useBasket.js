import { useContext } from 'react';
import { BasketContext } from '../context/BasketContext';

export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error('useBasket must be used within BasketProvider');
  }
  return context;
}
