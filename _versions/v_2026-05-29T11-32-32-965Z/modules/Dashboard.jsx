import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  DollarSign, 
  Smile, 
  Activity, 
  TrendingUp, 
  Plus, 
  Check, 
  Flame,
  Wind,
  Bell,
  CloudSun,
  Car,
  Building,
  Award,
  Users,
  ShoppingBag,
  Heart,
  Share2,
  Calendar,
  Lock
} from 'lucide-react';

const Dashboard = () => {
  const { 
    profile, 
    pricingPlan,
    getLifeScore, 
    getFinanceScore, 
    getWellbeingScore, 
    getHealthScore,
    getAIDashboardRecommendation,
    habits,
    toggleHabitCompletion,
    tasks,
    toggleTask,
    setActiveTab,
    getTodayString,
    notifications,
    showNotifications,
    setShowNotifications,
    groceries,
    toggleGroceryItem,
    addGroceryItem,
    isWearableLinked,
    isCalendarLinked,
    addNotification,
    addAuditLog,
    simulationSettings,
    isSimulationActive,
    savingsGoals,
    t
  } = useApp();

  const [groceryInput, setGroceryInput] = useState('');
  const [activeSpace, setActiveSpace] = useState('personal'); // personal, hub
  const [cheeredUsers, setCheeredUsers] = useState({ sarah: false, dave: false });
  const [showBriefing, setShowBriefing] = useState(false);
  const [morningBriefingAccepted, setMorningBriefingAccepted] = useState(false);

  // Phase 13 Simulator Sandbox Local Preview States
  const [simSleep, setSimSleep] = useState(() => simulationSettings?.sleep || 7.5);
  const [simSpend, setSimSpend] = useState(() => simulationSettings?.spend || 45);
  const [simRoutines, setSimRoutines] = useState(() => simulationSettings?.routines || 75);
  const [simHobby, setSimHobby] = useState(() => simulationSettings?.hobby || 1.5);

  React.useEffect(() => {
    if (simulationSettings) {
      setSimSleep(simulationSettings.sleep || 7.5);
      setSimSpend(simulationSettings.spend || 45);
      setSimRoutines(simulationSettings.routines || 75);
      setSimHobby(simulationSettings.hobby || 1.5);
    }
  }, [simulationSettings]);
  const [sharedGroceries, setSharedGroceries] = useState([
    { id: 'sg1', name: 'Almond Milk (Partner)', checked: false },
    { id: 'sg2', name: 'Greek Yogurt (Partner)', checked: true },
    { id: 'sg3', name: 'Organic Avocados', checked: false }
  ]);
  const [sharedGroceryInput, setSharedGroceryInput] = useState('');

  const lifeScore = getLifeScore();
  const financeScore = getFinanceScore();
  const wellbeingScore = getWellbeingScore();
  const healthScore = getHealthScore();
  const aiInsight = getAIDashboardRecommendation();
  const todayStr = getTodayString();

  // Circular progress math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (lifeScore / 100) * circumference;

  // Filter tasks for today (undone first)
  const todayTasks = tasks.slice(0, 3);

  // Quick Action triggers
  const handleQuickAction = (tabId) => {
    setActiveTab(tabId);
  };

  const handleGrocerySubmit = (e) => {
    e.preventDefault();
    if (!groceryInput.trim()) return;
    addGroceryItem(groceryInput);
    setGroceryInput('');
  };

  const handleSharedGrocerySubmit = (e) => {
    e.preventDefault();
    if (!sharedGroceryInput.trim()) return;
    const newItem = {
      id: 'sg-' + Date.now(),
      name: sharedGroceryInput,
      checked: false
    };
    setSharedGroceries(prev => [...prev, newItem]);
    setSharedGroceryInput('');
    addAuditLog("Shared List Modified", `Added item "${sharedGroceryInput}" to Family groceries checklist.`);
  };

  const toggleSharedGrocery = (id, name) => {
    setSharedGroceries(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.checked;
        addAuditLog("Shared Checklist Toggle", `Toggled "${name}" to: ${nextState ? 'COMPLETED' : 'PENDING'}`);
        if (nextState) {
          addNotification(
            "Family List Updated", 
            `You checked off "${name}". Partner's app has been synced.`, 
            "health"
          );
        }
        return { ...item, checked: nextState };
      }
      return item;
    }));
  };

  const handleCheer = (userId, name) => {
    if (cheeredUsers[userId]) return;
    
    setCheeredUsers(prev => ({ ...prev, [userId]: true }));
    addAuditLog("Social Cheering", `Sent motivational cheer notification to colleague ${name}.`);
    
    addNotification(
      "Cheer Sent!",
      `You cheered ${name}! Positive vibes recorded. (+1 Happiness score boost applied).`,
      "health"
    );

    // Simulated reciprocal cheer after 3 seconds
    setTimeout(() => {
      addNotification(
        "Social Reciprocation",
        `${name} cheered you back! Keep up the steps streak.`,
        "health"
      );
    }, 3000);
  };
  // Phase 13: Sandbox Projection calculations
  const simStress = Math.max(1, Math.min(10, (10 - (simSleep * 0.8) + (simSpend > 80 ? (simSpend - 80) * 0.05 : 0) - (simHobby * 0.8) + (100 - simRoutines) * 0.04)));
  const simWellbeing = Math.round(100 - simStress * 8);
  const simFinance = Math.round(100 - (simSpend / 150) * 45 - (simSpend > 50 ? 15 : 0));
  const simHealth = Math.round(Math.min(100, simSleep * 9.5 + (simRoutines / 100) * 20));
  const simLifeScore = Math.round((simWellbeing + simFinance + simHealth) / 3);

  let sandboxInsight = "⚖️ Balanced Outlook: Your simulated daily inputs show a harmonious trade-off between growth and energy conservation.";
  if (simSleep < 6.5) {
    sandboxInsight = "⚠️ Sleep Deficit: Sleep target below 6.5h causes a +25% spike in stress triggers and degrades habit completion chance by 30%.";
  } else if (simSpend >= 100) {
    sandboxInsight = "⚠️ High Spending: Daily spending limit above $100 decreases financial security, offsetting mood gains from entertainment.";
  } else if (simHobby >= 2.5) {
    sandboxInsight = "🎸 Skill Boost: Dedicating 2.5h+ to hobbies and creative interests builds focus, reducing stress projection by 2.0 points.";
  } else if (simRoutines >= 90) {
    sandboxInsight = "⚡ Routine Peak: 90%+ habit consistency builds neural momentum, boosting wellbeing score projection.";
  }
  // Phase 14: Family Pool metrics
  const summerTripGoal = (savingsGoals || []).find(g => g.id === 'g2') || { target: 1500, current: 450, title: "Summer Trip" };
  const poolProgressPercent = Math.min(100, Math.round((summerTripGoal.current / summerTripGoal.target) * 100));

  return (
    <div className="dashboard-container fade-in">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <span className="welcome-tag">{t('welcomeBack')}</span>
          <h1 className="user-greet">{profile.firstName || 'User'}!</h1>
        </div>
        <div className="dashboard-header-right">
          <div className="pricing-badge" onClick={() => setActiveTab('settings')}>
            <span className={`badge-text ${pricingPlan === 'Premium' ? 'premium' : ''}`}>
              {pricingPlan === 'Premium' ? 'PRO' : 'FREE'}
            </span>
          </div>
          <div className="bell-btn-container" onClick={() => setShowNotifications(!showNotifications)}>
            <button className="bell-btn" aria-label="Toggle notifications">
              <Bell size={18} />
            </button>
            {(notifications || []).some(n => !n.read) && <div className="bell-badge"></div>}
          </div>
        </div>
      </div>

      {/* Main Score Card (Always Visible) */}
      <div className="score-hero-card">
        <div className="gauge-section">
          <svg className="progress-ring" width="130" height="130">
            {/* Background track */}
            <circle
              className="progress-ring-bg"
              stroke="#1F293D"
              strokeWidth="10"
              fill="transparent"
              r={radius}
              cx="65"
              cy="65"
            />
            {/* Active circle */}
            <circle
              className="progress-ring-fill"
              stroke="url(#scoreGradient)"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              r={radius}
              cx="65"
              cy="65"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
          <div className="score-number-overlay">
            <span className="score-val">{lifeScore}</span>
            <span className="score-lbl">{t('lifeScore')}</span>
          </div>
        </div>

        <div className="subscores-section">
          <div className="subscore-item">
            <div className="subscore-icon-label">
              <DollarSign size={16} className="col-purple" />
              <span>{t('money')}</span>
            </div>
            <div className="subscore-bar-wrapper">
              <div className="subscore-bar" style={{ width: `${financeScore}%`, backgroundColor: '#8B5CF6' }}></div>
              <span className="subscore-pct">{financeScore}%</span>
            </div>
          </div>

          <div className="subscore-item">
            <div className="subscore-icon-label">
              <Smile size={16} className="col-pink" />
              <span>{t('mind')}</span>
            </div>
            <div className="subscore-bar-wrapper">
              <div className="subscore-bar" style={{ width: `${wellbeingScore}%`, backgroundColor: '#EC4899' }}></div>
              <span className="subscore-pct">{wellbeingScore}%</span>
            </div>
          </div>

          <div className="subscore-item">
            <div className="subscore-icon-label">
              <Activity size={16} className="col-emerald" />
              <span>{t('body')}</span>
            </div>
            <div className="subscore-bar-wrapper">
              <div className="subscore-bar" style={{ width: `${healthScore}%`, backgroundColor: '#10B981' }}></div>
              <span className="subscore-pct">{healthScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* SPACE SEGMENT SELECTOR */}
      <div style={{
        display: 'flex',
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        padding: '3px',
        marginTop: '2px'
      }}>
        <button
          onClick={() => setActiveSpace('personal')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '13px',
            border: 'none',
            backgroundColor: activeSpace === 'personal' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
            color: activeSpace === 'personal' ? '#C084FC' : '#94A3B8',
            fontSize: '12.5px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          👤 Personal Space
        </button>
        <button
          onClick={() => setActiveSpace('hub')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '13px',
            border: 'none',
            backgroundColor: activeSpace === 'hub' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
            color: activeSpace === 'hub' ? '#C084FC' : '#94A3B8',
            fontSize: '12.5px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          🏢 Team & Family Hub
        </button>
      </div>

      {/* PERSONAL VIEWS */}
      {activeSpace === 'personal' && (
        <>
          {/* ☀️ SUNRISE WELCOME CARD */}
          <div 
            className="sunrise-welcome-card"
            onClick={() => {
              setShowBriefing(true);
              addAuditLog("Morning Coordinator", "Opened immersive daily Morning Briefing.");
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
              <div className="sunrise-sun-icon" style={{ fontSize: '24px' }}>☀️</div>
              <div>
                <h4 style={{ margin: '0', fontSize: '13.5px', fontWeight: '800', color: '#FFF' }}>Morning Briefing</h4>
                <span style={{ fontSize: '11px', color: '#FDA4AF', fontWeight: '500' }}>
                  {morningBriefingAccepted ? "✓ Today's challenge active!" : "Review today's agenda, limits & details"}
                </span>
              </div>
            </div>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#FFF',
              fontSize: '11px',
              fontWeight: '700'
            }}>
              ➔
            </div>
          </div>

          {/* Daily Planner Widget */}
          <div className="planner-widget-card">
            <div className="section-header-flex">
              <h3 className="section-title">{t('dailyAgenda')}</h3>
              <span className="welcome-tag" style={{ fontSize: '11px' }}>{todayStr}</span>
            </div>

            <div className="planner-weather-commute-row" style={{ flexWrap: 'wrap', gap: '6px 8px' }}>
              <div className="planner-pill-data">
                <CloudSun size={14} className="col-purple" />
                <span>Partly Cloudy, 68°F</span>
              </div>
              <div className="planner-pill-data">
                <Car size={14} className="col-emerald" />
                <span>15m Commute (Normal)</span>
              </div>
              {isWearableLinked && (
                <div className="planner-pill-data fade-in" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                  <Activity size={12} className="col-rose" />
                  <span className="col-rose" style={{ fontWeight: '700' }}>Garmin: 72 BPM</span>
                </div>
              )}
            </div>

            <div className="planner-schedule-box">
              <div className="schedule-row">
                <span className="schedule-time">09:00 AM</span>
                <span className="schedule-event">Focus Work Sprint</span>
              </div>
              
              {isCalendarLinked && (
                <div className="schedule-row conflict fade-in" style={{ 
                  borderColor: 'rgba(239, 68, 68, 0.3)', 
                  background: 'rgba(239, 68, 68, 0.05)',
                  padding: '6px 8px',
                  borderRadius: '8px'
                }}>
                  <span className="schedule-time col-rose" style={{ fontWeight: '700' }}>10:30 AM</span>
                  <span className="schedule-event" style={{ color: '#FCA5A5', fontSize: '11.5px' }}>
                    ⚠️ Calendar Clash: Demo vs Marketing Sync
                  </span>
                </div>
              )}

              <div className="schedule-row">
                <span className="schedule-time">12:30 PM</span>
                <span className="schedule-event">Team Lunch Sync</span>
              </div>
              <div className="schedule-row">
                <span className="schedule-time">04:30 PM</span>
                <span className="schedule-event">Review Priorities</span>
              </div>

              {isCalendarLinked && (
                <div className="schedule-row fade-in" style={{ 
                  borderColor: 'rgba(59, 130, 246, 0.3)',
                  background: 'rgba(59, 130, 246, 0.05)',
                  padding: '6px 8px',
                  borderRadius: '8px'
                }}>
                  <span className="schedule-time col-blue" style={{ fontWeight: '700' }}>06:00 PM</span>
                  <span className="schedule-event" style={{ color: '#93C5FD', fontSize: '11.5px' }}>
                    📅 Calendar: Evening Gym Cardio Block
                  </span>
                </div>
              )}
            </div>

            {/* Mini Grocery Checklist */}
            <div className="grocery-checklist-box">
              <span className="welcome-tag" style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>
                Grocery Vault ({groceries.filter(g => !g.checked).length} items pending)
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '110px', overflowY: 'auto', marginBottom: '6px' }}>
                {groceries.map(item => (
                  <div key={item.id} className={`habit-row-card ${item.checked ? 'checked' : ''}`} style={{ padding: '6px 10px' }}>
                    <button 
                      onClick={() => toggleGroceryItem(item.id)}
                      className={`habit-checkbox ${item.checked ? 'checked' : ''}`}
                      style={{ width: '15px', height: '15px' }}
                    >
                      {item.checked && <Check size={10} />}
                    </button>
                    <span className="habit-title-text" style={{ fontSize: '12px' }}>{item.name}</span>
                  </div>
                ))}
              </div>
              
              <form onSubmit={handleGrocerySubmit} className="grocery-input-row">
                <input 
                  type="text" 
                  value={groceryInput}
                  onChange={e => setGroceryInput(e.target.value)}
                  placeholder="Add shopping item..." 
                  className="grocery-small-input"
                />
                <button type="submit" className="grocery-add-small-btn" aria-label="Add grocery item">
                  <Plus size={12} />
                </button>
              </form>
            </div>
          </div>

          {/* AI Recommendation Panel */}
          <div className="ai-insight-card">
            <div className="ai-card-title">
              <Sparkles size={18} className="sparkle-glow" />
              <span>Today's AI Focus ({profile.coachingStyle} Style)</span>
            </div>
            <p className="ai-card-text">
              {aiInsight}
            </p>
          </div>

          {/* Quick Actions Buttons */}
          <div className="quick-actions-panel">
            <h3 className="section-title">{t('quickLogs')}</h3>
            <div className="quick-actions-row">
              <button onClick={() => handleQuickAction('finance')} className="quick-action-btn">
                <div className="quick-btn-icon icon-bg-purple">
                  <Plus size={16} />
                </div>
                <span>{t('logSpend')}</span>
              </button>
              <button onClick={() => handleQuickAction('wellbeing')} className="quick-action-btn">
                <div className="quick-btn-icon icon-bg-pink">
                  <Plus size={16} />
                </div>
                <span>{t('logMood')}</span>
              </button>
              <button onClick={() => handleQuickAction('health')} className="quick-action-btn">
                <div className="quick-btn-icon icon-bg-emerald">
                  <Plus size={16} />
                </div>
                <span>{t('logHealth')}</span>
              </button>
              <button onClick={() => handleQuickAction('wellbeing')} className="quick-action-btn">
                <div className="quick-btn-icon icon-bg-blue">
                  <Wind size={16} />
                </div>
                <span>{t('breathe')}</span>
              </button>
            </div>
          </div>

          {/* Daily Habits List */}
          <div className="dashboard-section">
            <div className="section-header-flex">
              <h3 className="section-title">{t('dailyHabits')}</h3>
              <button onClick={() => handleQuickAction('health')} className="section-link-btn">View All</button>
            </div>
            <div className="habits-list-dashboard">
              {habits.map((habit) => {
                const isCompleted = habit.completedDates.includes(todayStr);
                return (
                  <div key={habit.id} className={`habit-row-card ${isCompleted ? 'checked' : ''}`}>
                    <button 
                      onClick={() => toggleHabitCompletion(habit.id)}
                      className={`habit-checkbox ${isCompleted ? 'checked checkbox-bounce-active' : ''}`}
                    >
                      {isCompleted && <Check size={14} />}
                    </button>
                    <span className="habit-title-text" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {isCompleted && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#F472B6" className="pop-celebration-ribbon" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                          <path d="M12 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
                          <path d="M12 15l-3 9 3-3 3 3-3-9z" />
                        </svg>
                      )}
                      {habit.name}
                    </span>
                    <div className="streak-badge">
                      <Flame size={14} className="streak-fire" />
                      <span>{habit.streak}d</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priorities List */}
          <div className="dashboard-section last-section">
            <div className="section-header-flex">
              <h3 className="section-title">{t('focusPriorities')}</h3>
              <button onClick={() => handleQuickAction('settings')} className="section-link-btn">Manage</button>
            </div>
            <div className="tasks-list-dashboard">
              {todayTasks.length > 0 ? (
                todayTasks.map((task) => (
                  <div key={task.id} className={`task-row-card ${task.completed ? 'completed' : ''}`}>
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`task-checkbox ${task.completed ? 'completed' : ''}`}
                    >
                      {task.completed && <Check size={14} />}
                    </button>
                    <span className="task-title-text">{task.title}</span>
                    <span className={`task-priority-tag ${task.priority}`}>{task.priority}</span>
                  </div>
                ))
              ) : (
                <div className="empty-tasks-card">
                  <span>All priorities cleared! Nice work.</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* TEAM & FAMILY HUB VIEWS */}
      {activeSpace === 'hub' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* B2B EMPLOYER BENEFITS CARD */}
          <div className="settings-card" style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 95, 70, 0.4))',
            borderColor: 'rgba(16, 185, 129, 0.3)',
            padding: '14px',
            marginBottom: '0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px',
                  backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(16, 185, 129, 0.4)',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#10B981'
                }}>
                  <Building size={16} />
                </div>
                <div>
                  <h4 style={{ margin: '0', fontSize: '13.5px', fontWeight: '800', color: '#FFF' }}>Hustle Corp Wellness Plan</h4>
                  <span style={{ fontSize: '10px', color: '#A7F3D0' }}>Corporate Health Benefit Claimed</span>
                </div>
              </div>
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399',
                fontSize: '9px', fontWeight: '700', padding: '2px 6px', borderRadius: '6px'
              }}>
                ACTIVE
              </div>
            </div>

            <div style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#E2E8F0' }}>Health Allowance Reimbursement</span>
                <span style={{ fontWeight: '800', color: '#10B981' }}>$500.00 / $500.00</span>
              </div>
              <div className="budget-bar-track" style={{ height: '6px' }}>
                <div className="budget-bar-fill" style={{ width: '100%', backgroundColor: '#10B981' }}></div>
              </div>
            </div>
            
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '9.5px', color: '#A7F3D0', marginTop: '10px',
              borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px'
            }}>
              <Award size={12} />
              <span>SOC-2 Audited Corporate Wellness Integration</span>
            </div>
          </div>

          {/* COWORKER STEP CHALLENGE */}
          <div className="settings-card" style={{ padding: '14px', marginBottom: '0' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '13.5px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={16} className="col-purple" /> Coworker Step Challenge (Daily)
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Sarah */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                backgroundColor: 'rgba(15, 23, 42, 0.4)', padding: '10px', borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.02)'
              }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '700', display: 'block' }}>1. Sarah (Marketing)</span>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>12,400 steps</span>
                </div>
                <button
                  onClick={() => handleCheer('sarah', 'Sarah')}
                  disabled={cheeredUsers.sarah}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: cheeredUsers.sarah ? 'rgba(16, 185, 129, 0.15)' : '#8B5CF6',
                    color: cheeredUsers.sarah ? '#34D399' : '#FFF',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: cheeredUsers.sarah ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Heart size={10} fill={cheeredUsers.sarah ? '#34D399' : 'none'} />
                  <span>{cheeredUsers.sarah ? 'Cheered!' : 'Cheer'}</span>
                </button>
              </div>

              {/* You */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                backgroundColor: 'rgba(139, 92, 246, 0.08)', padding: '10px', borderRadius: '12px',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '800', display: 'block', color: '#C084FC' }}>2. You (Product)</span>
                  <span style={{ fontSize: '11px', color: '#C084FC', opacity: 0.9 }}>{isWearableLinked ? '10,200 steps (Synced)' : 'Logged: 4,800 steps'}</span>
                </div>
                <span style={{ fontSize: '10px', color: '#94A3B8', fontStyle: 'italic', marginRight: '6px' }}>Goal Candidate</span>
              </div>

              {/* Dave */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                backgroundColor: 'rgba(15, 23, 42, 0.4)', padding: '10px', borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.02)'
              }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '700', display: 'block' }}>3. Dave (HR)</span>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>8,400 steps</span>
                </div>
                <button
                  onClick={() => handleCheer('dave', 'Dave')}
                  disabled={cheeredUsers.dave}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: cheeredUsers.dave ? 'rgba(16, 185, 129, 0.15)' : '#8B5CF6',
                    color: cheeredUsers.dave ? '#34D399' : '#FFF',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: cheeredUsers.dave ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Heart size={10} fill={cheeredUsers.dave ? '#34D399' : 'none'} />
                  <span>{cheeredUsers.dave ? 'Cheered!' : 'Cheer'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* FAMILY JOINT SAVINGS TARGET */}
          <div className="settings-card" style={{ padding: '14px', marginBottom: '0' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '13.5px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <DollarSign size={16} className="col-blue" /> Family Joint Goal: Summer Vacation
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span style={{ color: '#CBD5E1' }}>Vacation Airfare Fund</span>
              <span style={{ fontWeight: '800' }}>$1,250.00 / $3,000.00</span>
            </div>

            {/* DUAL LAYER SAVINGS PROGRESS BAR */}
            <div style={{
              height: '10px',
              backgroundColor: '#1F293D',
              borderRadius: '5px',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              marginBottom: '6px'
            }}>
              {/* Self contribution (purple) - $550 is 18.3% */}
              <div style={{ width: '18.3%', backgroundColor: '#8B5CF6', height: '100%' }}></div>
              {/* Partner contribution (pink) - $700 is 23.3% */}
              <div style={{ width: '23.3%', backgroundColor: '#EC4899', height: '100%' }}></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94A3B8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#8B5CF6', borderRadius: '50%' }}></span>
                Self: $550
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#EC4899', borderRadius: '50%' }}></span>
                Partner: $700
              </span>
              <span>41% Saved</span>
            </div>
          </div>

          {/* FAMILY GROCERY CHECKLIST */}
          <div className="settings-card" style={{ padding: '14px', marginBottom: '0' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '13.5px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShoppingBag size={16} className="col-pink" /> Family Shared Checklist
            </h3>
            <span className="welcome-tag" style={{ fontSize: '11px', display: 'block', marginBottom: '8px' }}>
              Instantly syncs across household accounts
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
              {sharedGroceries.map((item) => (
                <div key={item.id} className={`habit-row-card ${item.checked ? 'checked' : ''}`} style={{ padding: '8px 12px' }}>
                  <button
                    onClick={() => toggleSharedGrocery(item.id, item.name)}
                    className={`habit-checkbox ${item.checked ? 'checked' : ''}`}
                    style={{ width: '16px', height: '16px' }}
                  >
                    {item.checked && <Check size={12} />}
                  </button>
                  <span className="habit-title-text" style={{ fontSize: '13px' }}>{item.name}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSharedGrocerySubmit} className="grocery-input-row" style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                value={sharedGroceryInput}
                onChange={e => setSharedGroceryInput(e.target.value)}
                placeholder="Add shared grocery..."
                className="grocery-small-input"
                style={{ flex: 1 }}
              />
              <button type="submit" className="grocery-add-small-btn" style={{ padding: '8px' }}>
                <Plus size={14} />
              </button>
            </form>
          </div>

          {/* FAMILY SYNCD CALENDAR EVENTS */}
          <div className="settings-card" style={{ padding: '14px', marginBottom: '10px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '13.5px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} className="col-purple" /> Shareable Family Calendar
            </h3>
            
            <div className="planner-schedule-box">
              <div className="schedule-row" style={{ padding: '8px 4px' }}>
                <span className="schedule-time">07:30 PM</span>
                <span className="schedule-event" style={{ color: '#EC4899', fontWeight: '600' }}>
                  💑 Dinner Sync (Partner Cal)
                </span>
              </div>
              <div className="schedule-row" style={{ padding: '8px 4px' }}>
                <span className="schedule-time">09:00 PM</span>
                <span className="schedule-event" style={{ color: '#CBD5E1' }}>
                  📺 Movie Night - Standard Block
                </span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Dashboard;
