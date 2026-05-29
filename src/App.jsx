import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import MobileShell from './components/MobileShell';
import Navigation from './components/Navigation';
import Onboarding from './modules/Onboarding';
import Dashboard from './modules/Dashboard';
import Finance from './modules/Finance';
import Wellbeing from './modules/Wellbeing';
import Health from './modules/Health';
import AICoach from './modules/AICoach';
import Settings from './modules/Settings';
import Marketplace from './modules/Marketplace';

// Error Boundary to catch render crashes and print diagnostic reports directly on screen
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '24px', 
          color: '#F87171', 
          backgroundColor: '#0F172A', 
          minHeight: '100vh', 
          fontFamily: 'monospace',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'left',
          width: '100vw',
          boxSizing: 'border-box'
        }}>
          <div style={{ maxWidth: '600px', width: '100%', background: '#1E293B', padding: '24px', borderRadius: '16px', border: '1px solid #EF4444' }}>
            <h2 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>LifeMate AI Runtime Diagnostics</h2>
            <p style={{ fontSize: '14px', fontWeight: 'bold' }}>Error: {this.state.error?.toString()}</p>
            <pre style={{ 
              fontSize: '11px', 
              background: '#090D16', 
              padding: '12px', 
              borderRadius: '8px', 
              overflowX: 'auto',
              maxHeight: '300px'
            }}>
              {this.state.error?.stack}
            </pre>
            <p style={{ fontSize: '12px', color: '#94A3B8' }}>This screen will show you the exact React crash stack trace instead of a blank screen.</p>
            <button 
              onClick={() => { localStorage.clear(); window.location.reload(); }} 
              style={{ 
                padding: '12px 20px', 
                backgroundColor: '#EF4444', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                cursor: 'pointer', 
                marginTop: '16px',
                fontWeight: 'bold',
                width: '100%'
              }}
            >
              Reset Local Storage & Restart
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppContent = () => {
  const { 
    activeTab, 
    profile, 
    showNotifications, 
    setShowNotifications, 
    notifications, 
    deleteNotification, 
    markNotificationsRead 
  } = useApp();

  // If onboarding is not completed, force the onboarding questionnaire
  if (!profile.onboardingCompleted) {
    return (
      <MobileShell>
        <Onboarding />
      </MobileShell>
    );
  }

  // Active module router
  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'finance':
        return <Finance />;
      case 'wellbeing':
        return <Wellbeing />;
      case 'health':
        return <Health />;
      case 'ai':
        return <AICoach />;
      case 'settings':
        return <Settings />;
      case 'marketplace':
        return <Marketplace />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <MobileShell>
      {renderActiveModule()}
      
      {/* Notification Drawer Overlay */}
      {showNotifications && (
        <div className="notification-drawer fade-in">
          <div className="drawer-header">
            <h3>Notification Center</h3>
            <button 
              onClick={() => {
                markNotificationsRead();
                setShowNotifications(false);
              }} 
              className="drawer-clear-btn"
            >
              Close
            </button>
          </div>
          <div className="notifications-scroll">
            {(notifications || []).length > 0 ? (
              (notifications || []).map((notif) => (
                <div key={notif.id} className={`notification-card ${notif.read ? '' : 'unread'}`}>
                  {!notif.read && <div className="notif-badge-unread-dot"></div>}
                  <div className="notif-body">
                    <span className="notif-title">{notif.title}</span>
                    <span className="notif-message">{notif.message}</span>
                    <span className="notif-date">{notif.date}</span>
                  </div>
                  <button 
                    onClick={() => deleteNotification(notif.id)} 
                    className="notif-delete-btn"
                    aria-label="Delete notification"
                    style={{ fontSize: '18px', fontWeight: 'bold' }}
                  >
                    &times;
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-state-card" style={{ margin: '40px 0' }}>
                <span>No alerts in notification center.</span>
              </div>
            )}
          </div>
        </div>
      )}

      <Navigation />
    </MobileShell>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
