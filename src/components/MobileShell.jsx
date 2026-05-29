import React, { useState, useEffect } from 'react';

const MobileShell = ({ children }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const minutesStr = minutes < 10 ? '0' + minutes : minutes;
      setTime(`${hours}:${minutesStr} ${ampm}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="phone-wrapper">
      {/* Physical phone elements mockup */}
      <div className="phone-container">
        {/* Notch */}
        <div className="phone-notch">
          <div className="camera-lens"></div>
          <div className="speaker-grill"></div>
        </div>

        {/* Side Buttons */}
        <div className="phone-button volume-up"></div>
        <div className="phone-button volume-down"></div>
        <div className="phone-button power-btn"></div>

        {/* Status Bar */}
        <div className="phone-status-bar">
          <span className="status-time">{time}</span>
          <div className="status-icons">
            {/* Wifi Icon */}
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.55a11 11 0 0 1 14.08 0" />
              <path d="M1.42 9a16 16 0 0 1 21.16 0" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
            </svg>
            {/* Cellular Icon */}
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="16" width="3" height="5" rx="0.5" fill="currentColor" />
              <rect x="7" y="12" width="3" height="9" rx="0.5" fill="currentColor" />
              <rect x="12" y="8" width="3" height="13" rx="0.5" fill="currentColor" />
              <rect x="17" y="3" width="3" height="18" rx="0.5" fill="currentColor" />
            </svg>
            {/* Battery Icon */}
            <div className="battery-icon-container">
              <div className="battery-body">
                <div className="battery-level"></div>
              </div>
              <div className="battery-tip"></div>
            </div>
          </div>
        </div>

        {/* Screen Viewport */}
        <div className="phone-screen">
          <div className="screen-content">
            {children}
          </div>
        </div>

        {/* Home Indicator */}
        <div className="phone-home-indicator"></div>
      </div>
    </div>
  );
};

export default MobileShell;
