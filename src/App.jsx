import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { BasketProvider } from './context/BasketContext';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import QuizPage from './pages/QuizPage';
import DiscoveryPage from './pages/DiscoveryPage';
import BrewerPage from './pages/BrewerPage';
import BrewersListPage from './pages/BrewersListPage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';

function AppContent() {
  const location = useLocation();
  const hideHeader = location.pathname === '/quiz';

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Navigate to="/discover" replace />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/discover" element={<DiscoveryPage />} />
        <Route path="/breweries" element={<BrewersListPage />} />
        <Route path="/brewer/:id" element={<BrewerPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      {!hideHeader && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <PreferencesProvider>
          <BasketProvider>
            <AppContent />
          </BasketProvider>
        </PreferencesProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
