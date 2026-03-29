import { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const PreferencesContext = createContext();

export function PreferencesProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    const stored = Cookies.get('beerworld_profile');
    return stored ? JSON.parse(stored) : null;
  });

  const saveProfile = (newProfile) => {
    setProfile(newProfile);
    Cookies.set('beerworld_profile', JSON.stringify(newProfile), { expires: 30 });
  };

  const clearProfile = () => {
    setProfile(null);
    Cookies.remove('beerworld_profile');
  };

  return (
    <PreferencesContext.Provider value={{ profile, saveProfile, clearProfile }}>
      {children}
    </PreferencesContext.Provider>
  );
}
