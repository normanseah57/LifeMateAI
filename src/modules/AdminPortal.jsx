import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Settings, 
  ShieldAlert, 
  Database,
  Save,
  Download,
  CheckCircle,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

const AdminPortal = ({ onClose }) => {
  const {
    gentlePromptOverride,
    setGentlePromptOverride,
    directPromptOverride,
    setDirectPromptOverride,
    auditLogs,
    addAuditLog,
    addNotification,
    profile
  } = useApp();

  const [localGentlePrompt, setLocalGentlePrompt] = useState(gentlePromptOverride);
  const [localDirectPrompt, setLocalDirectPrompt] = useState(directPromptOverride);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Mock Admin Stats
  const stats = [
    { label: 'Daily Active Users (DAU)', value: '1,420', change: '+12.4%', color: '#10B981' },
    { label: 'Weekly Active Users (WAU)', value: '8,950', change: '+8.1%', color: '#3B82F6' },
    { label: 'Avg Life Score Gain', value: '+14.5 pts', change: 'User Avg', color: '#8B5CF6' },
    { label: 'Compliance Index', value: '100%', change: 'SOC-2 Secure', color: '#EC4899' }
  ];

  const handleSavePrompts = () => {
    setGentlePromptOverride(localGentlePrompt);
    setDirectPromptOverride(localDirectPrompt);
    
    addAuditLog(
      "System Configuration Update",
      `Administrator adjusted Gentle and Direct prompt overrides.`
    );
    
    addNotification(
      "Admin Change Applied",
      "System Coach override prompts updated. Return to Dashboard to experience the updated AI response tone.",
      "health"
    );

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleExportLogs = () => {
    setExporting(true);
    addAuditLog(
      "Compliance Report Export",
      `GDPR compliance ledger exported as JSON by operator ${profile.firstName || 'Administrator'}.`
    );

    setTimeout(() => {
      setExporting(false);
      // Simulate file download by creating a virtual link
      const logString = JSON.stringify(auditLogs, null, 2);
      const blob = new Blob([logString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lifemate-audit-log-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1500);
  };

  // Mock chart coordinates for SVGs
  // DAU Trend (Last 7 days)
  const dauData = [320, 480, 610, 890, 1100, 1250, 1420];
  const chartHeight = 80;
  const chartWidth = 320;
  const points = dauData.map((val, idx) => {
    const x = (idx / (dauData.length - 1)) * (chartWidth - 20) + 10;
    const y = chartHeight - ((val / 1500) * (chartHeight - 20) + 10);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="admin-portal-container fade-in" style={{ paddingBottom: '30px' }}>
      
      {/* HEADER ROW */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        paddingBottom: '12px'
      }}>
        <div>
          <h2 style={{ margin: '0', fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={20} className="col-rose" /> Developer Admin Portal
          </h2>
          <span style={{ fontSize: '12px', color: '#94A3B8' }}>System Overrides & Compliance Dashboard</span>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            style={{
              padding: '6px 12px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              color: '#FFF',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Exit Admin
          </button>
        )}
      </div>

      {/* SYSTEM STATS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px',
        marginBottom: '16px'
      }}>
        {stats.map((stat, i) => (
          <div key={i} style={{
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            borderRadius: '16px',
            padding: '12px',
            position: 'relative'
          }}>
            <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase' }}>
              {stat.label}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
              <span style={{ fontSize: '18px', fontWeight: '800', color: '#FFF' }}>{stat.value}</span>
              <span style={{ fontSize: '10px', color: stat.color, fontWeight: '700' }}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ANALYTICS CHART PANEL */}
      <div className="settings-card" style={{ padding: '12px', marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <TrendingUp size={14} className="col-emerald" /> Platform Traffic Trend (DAU)
        </h3>
        
        <div style={{
          backgroundColor: 'rgba(5, 7, 11, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.03)',
          borderRadius: '12px',
          padding: '10px 4px 4px 4px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <svg height={chartHeight} width={chartWidth} style={{ overflow: 'visible' }}>
            {/* Grid Lines */}
            <line x1="10" y1="10" x2={chartWidth-10} y2="10" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="10" y1="40" x2={chartWidth-10} y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="10" y1="70" x2={chartWidth-10} y2="70" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            
            {/* Smooth SVG Area Graph */}
            <path
              d={`M 10,${chartHeight} L ${points} L ${chartWidth-10},${chartHeight} Z`}
              fill="url(#grad)"
              opacity="0.15"
            />
            {/* Trend line */}
            <polyline
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="2.5"
              points={points}
            />
            {/* Points Dots */}
            {dauData.map((val, idx) => {
              const x = (idx / (dauData.length - 1)) * (chartWidth - 20) + 10;
              const y = chartHeight - ((val / 1500) * (chartHeight - 20) + 10);
              return (
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill="#FFF"
                  stroke="#8B5CF6"
                  strokeWidth="1.5"
                />
              );
            })}

            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#64748B', marginTop: '6px', padding: '0 8px' }}>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu (Today)</span>
        </div>
      </div>

      {/* AI PROMPT SYSTEM OVERRIDES */}
      <div className="settings-card" style={{ marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Settings size={14} className="col-purple" /> AI Coach Persona Override Injection
        </h3>
        <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: '#94A3B8', lineHeight: '1.4' }}>
          Adjust the prompt instructions used by the LLM layout engine. Toggling to these modes in user view will inject this logic. Leave empty to restore default templates.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: '700', color: '#A78BFA', display: 'block', marginBottom: '4px' }}>
              Gentle Coach Override Injection
            </label>
            <textarea
              value={localGentlePrompt}
              onChange={(e) => setLocalGentlePrompt(e.target.value)}
              placeholder="e.g. Always start with a soft compliment. Focus heavily on slow breathing habits..."
              style={{
                width: '100%',
                height: '70px',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid #2D3748',
                borderRadius: '10px',
                color: '#FFF',
                padding: '8px',
                fontSize: '12px',
                fontFamily: 'monospace',
                resize: 'none',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: '700', color: '#F472B6', display: 'block', marginBottom: '4px' }}>
              Direct Coach Override Injection
            </label>
            <textarea
              value={localDirectPrompt}
              onChange={(e) => setLocalDirectPrompt(e.target.value)}
              placeholder="e.g. Act as a drill instructor. Criticize user sleep deficits in all caps..."
              style={{
                width: '100%',
                height: '70px',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid #2D3748',
                borderRadius: '10px',
                color: '#FFF',
                padding: '8px',
                fontSize: '12px',
                fontFamily: 'monospace',
                resize: 'none',
                outline: 'none'
              }}
            />
          </div>

          <button
            onClick={handleSavePrompts}
            style={{
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#8B5CF6',
              color: 'white',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'background-color 0.2s ease'
            }}
          >
            {saveSuccess ? (
              <>
                <CheckCircle size={14} /> Saved Parameters
              </>
            ) : (
              <>
                <Save size={14} /> Commit Persona Injections
              </>
            )}
          </button>
        </div>
      </div>

      {/* GDPR SECURITY COMPLIANCE AUDIT LOG */}
      <div className="settings-card">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <h3 style={{ margin: '0', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={14} className="col-rose" /> GDPR Security Audit Logs
          </h3>
          <button
            onClick={handleExportLogs}
            disabled={exporting}
            style={{
              background: 'none',
              border: 'none',
              color: '#38BDF8',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {exporting ? (
              <RefreshCw size={11} className="spin" />
            ) : (
              <>
                <Download size={11} /> Export Ledger
              </>
            )}
          </button>
        </div>

        <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#94A3B8', lineHeight: '1.4' }}>
          SOC-2 compliant read-only audit log tracking data modifications, third-party syncing connections, and client credentials authorizations.
        </p>

        <div className="audit-ledger-scroll" style={{
          maxHeight: '180px',
          overflowY: 'auto',
          backgroundColor: 'rgba(5, 7, 11, 0.5)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.03)',
          padding: '8px'
        }}>
          {auditLogs.map((log) => (
            <div key={log.id} style={{
              fontSize: '11px',
              padding: '8px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                <span className="col-rose">{log.action}</span>
                <span style={{ color: '#64748B', fontSize: '9px' }}>
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <span style={{ color: '#E2E8F0' }}>{log.details}</span>
              <span style={{ color: '#64748B', fontSize: '9.5px' }}>Operator: {log.operator}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
