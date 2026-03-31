import { createContext, useState, useEffect } from 'react';

export const AdminSessionContext = createContext();

// Mock admin data
const MOCK_ADMIN_DATA = {
  id: "admin-1",
  name: "Beer World Admin",
  email: "admin@beerworld.com",
};

export function AdminSessionProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const stored = localStorage.getItem('beerworld_admin_session');
    return stored ? JSON.parse(stored).isLoggedIn : false;
  });

  const [adminEmail, setAdminEmail] = useState(() => {
    const stored = localStorage.getItem('beerworld_admin_session');
    return stored ? JSON.parse(stored).adminEmail : null;
  });

  const [adminData, setAdminData] = useState(() => {
    const stored = localStorage.getItem('beerworld_admin_session');
    return stored ? JSON.parse(stored).adminData : null;
  });

  // Persist session to localStorage whenever it changes
  useEffect(() => {
    const sessionData = {
      isLoggedIn,
      adminEmail,
      adminData,
    };
    if (isLoggedIn) {
      localStorage.setItem('beerworld_admin_session', JSON.stringify(sessionData));
    }
  }, [isLoggedIn, adminEmail, adminData]);

  const login = (email) => {
    setIsLoggedIn(true);
    setAdminEmail(email);
    setAdminData(MOCK_ADMIN_DATA);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setAdminEmail(null);
    setAdminData(null);
    localStorage.removeItem('beerworld_admin_session');
  };

  return (
    <AdminSessionContext.Provider value={{ isLoggedIn, adminEmail, adminData, login, logout }}>
      {children}
    </AdminSessionContext.Provider>
  );
}
