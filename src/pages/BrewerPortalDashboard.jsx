import { useState, useContext } from 'react';
import { BrewerSessionContext } from '../context/BrewerSessionContext';
import BrewerSidebar from '../components/brewer-portal/BrewerSidebar';
import DashboardOverview from '../components/brewer-portal/DashboardOverview';
import MyBeersSection from '../components/brewer-portal/MyBeersSection';
import BreweryProfileSection from '../components/brewer-portal/BreweryProfileSection';
import OrdersSection from '../components/brewer-portal/OrdersSection';

export default function BrewerPortalDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const { brewerData } = useContext(BrewerSessionContext);

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview />;
      case 'my-beers':
        return <MyBeersSection />;
      case 'profile':
        return <BreweryProfileSection />;
      case 'orders':
        return <OrdersSection />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: 'var(--background-primary)',
      }}
    >
      {/* Sidebar */}
      <BrewerSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content (offset for fixed sidebar) */}
      <div
        style={{
          marginLeft: '250px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          backgroundColor: 'var(--background-primary)',
        }}
      >
        <div style={{ padding: '2rem', flex: 1 }}>
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
