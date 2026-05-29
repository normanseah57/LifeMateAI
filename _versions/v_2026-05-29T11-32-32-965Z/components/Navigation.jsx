import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  DollarSign, 
  Smile, 
  Activity, 
  MessageSquare, 
  Store,
  Settings 
} from 'lucide-react';

const Navigation = () => {
  const { activeTab, setActiveTab, t } = useApp();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'wellbeing', label: 'Wellbeing', icon: Smile },
    { id: 'health', label: 'Health', icon: Activity },
    { id: 'ai', label: 'AI Coach', icon: MessageSquare },
    { id: 'marketplace', label: 'Marketplace', icon: Store },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <nav className="mobile-nav" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;
        const labelKey = tab.id === 'ai' ? 'aiCoach' : tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-item ${isActive ? 'active' : ''}`}
            aria-label={tab.label}
          >
            <div className="nav-icon-wrapper">
              <IconComponent size={20} className="nav-icon" />
            </div>
            <span className="nav-label">{t(labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
