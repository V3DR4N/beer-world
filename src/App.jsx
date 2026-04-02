import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { BasketProvider } from './context/BasketContext';
import { BrewerSessionProvider } from './context/BrewerSessionContext';
import { AdminSessionProvider } from './context/AdminSessionContext';
import { useScrollRestoration } from './hooks/useScrollRestoration';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import DemoControls from './components/dev/DemoControls';
import ZendeskWidget from './components/support/ZendeskWidget';
import QuizPage from './pages/QuizPage';
import DiscoveryPage from './pages/DiscoveryPage';
import BeerDetailPage from './pages/BeerDetailPage';
import BrewerPage from './pages/BrewerPage';
import BrewersListPage from './pages/BrewersListPage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BrewerPortalLoginPage from './pages/BrewerPortalLoginPage';
import BrewerPortalDashboard from './pages/BrewerPortalDashboard';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';

// Route guard for brewer portal
function BrewerSessionRequired({ children }) {
  const location = useLocation();
  const sessionStr = localStorage.getItem('beerworld_brewer_session');
  const session = sessionStr ? JSON.parse(sessionStr) : null;

  if (!session?.isLoggedIn) {
    return <Navigate to="/brewer-portal" replace />;
  }

  return children;
}

// Route guard for admin portal
function AdminSessionRequired({ children }) {
  const location = useLocation();
  const sessionStr = localStorage.getItem('beerworld_admin_session');
  const session = sessionStr ? JSON.parse(sessionStr) : null;

  if (!session?.isLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

function AppContent() {
  const location = useLocation();
  const isBrewerPortal = location.pathname.startsWith('/brewer-portal');
  const isAdmin = location.pathname === '/admin';
  const hideHeader = location.pathname === '/quiz' || location.pathname === '/login' || location.pathname === '/register' || isBrewerPortal || isAdmin;
  const { shouldRestoreScroll } = useScrollRestoration();

  // Scroll to top on route change, unless restoring from saved state
  useEffect(() => {
    // Only scroll to top if we're not restoring scroll state
    // Page components will handle restoration and clearing the state
    if (!shouldRestoreScroll()) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <>
      {!hideHeader && <Header />}
      <div style={{ paddingTop: !hideHeader ? '80px' : '0', backgroundColor: 'var(--background-primary)' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/discover" replace />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/discover" element={<DiscoveryPage />} />
          <Route path="/breweries" element={<BrewersListPage />} />
          <Route path="/beer/:beerId" element={<BeerDetailPage />} />
          <Route path="/brewer/:id" element={<BrewerPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/brewer-portal" element={<BrewerPortalLoginPage />} />
          <Route
            path="/brewer-portal/dashboard"
            element={
              <BrewerSessionRequired>
                <BrewerPortalDashboard />
              </BrewerSessionRequired>
            }
          />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminSessionRequired>
                <AdminPage />
              </AdminSessionRequired>
            }
          />
        </Routes>
        {!hideHeader && <Footer />}
      </div>
      <DemoControls />
      <ZendeskWidget />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <BrewerSessionProvider>
          <AdminSessionProvider>
            <PreferencesProvider>
              <BasketProvider>
                <AppContent />
              </BasketProvider>
            </PreferencesProvider>
          </AdminSessionProvider>
        </BrewerSessionProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
