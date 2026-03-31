import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const BrewerSessionContext = createContext();

// Mock brewery data - always Schwarzwald Brauhaus regardless of login input
const MOCK_BREWER_DATA = {
  id: "schwarzwald-brauhaus",
  name: "Schwarzwald Brauhaus",
  location: "Freiburg, Germany",
  foundedYear: 2009,
  email: "hello@schwarzwald-brauhaus.de",
  phone: "+49 761 123 4567",
  description: "Ancient forest. Modern craft.",
};

export function BrewerSessionProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const stored = localStorage.getItem('beerworld_brewer_session');
    return stored ? JSON.parse(stored).isLoggedIn : false;
  });

  const [brewerEmail, setBrewerEmail] = useState(() => {
    const stored = localStorage.getItem('beerworld_brewer_session');
    return stored ? JSON.parse(stored).brewerEmail : null;
  });

  const [brewerData, setBrewerData] = useState(() => {
    const stored = localStorage.getItem('beerworld_brewer_session');
    return stored ? JSON.parse(stored).brewerData : null;
  });

  // Persist session to localStorage whenever it changes
  useEffect(() => {
    const sessionData = {
      isLoggedIn,
      brewerEmail,
      brewerData,
    };
    if (isLoggedIn) {
      localStorage.setItem('beerworld_brewer_session', JSON.stringify(sessionData));
    }
  }, [isLoggedIn, brewerEmail, brewerData]);

  const login = (email) => {
    setIsLoggedIn(true);
    setBrewerEmail(email);
    setBrewerData(MOCK_BREWER_DATA);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setBrewerEmail(null);
    setBrewerData(null);
    localStorage.removeItem('beerworld_brewer_session');
  };

  return (
    <BrewerSessionContext.Provider value={{ isLoggedIn, brewerEmail, brewerData, login, logout }}>
      {children}
    </BrewerSessionContext.Provider>
  );
}
