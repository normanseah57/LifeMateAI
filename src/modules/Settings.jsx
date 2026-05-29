import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Trash2, 
  CreditCard, 
  Plus, 
  CheckCircle,
  Info
} from 'lucide-react';

const Settings = () => {
  const {
    profile,
    pricingPlan,
    setPricingPlan,
    tasks,
    addTask,
    toggleTask,
    resetAllData,
    moodLogs,
    healthLogs,
    isCalendarLinked,
    getTodayString,
    isReviewAdopted,
    adoptWeeklyActionPlan,
    setWheelScores,
    addNotification,
    addAuditLog,
    setTasks
  } = useApp();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
  const [showLockoutModal, setShowLockoutModal] = useState(false);

  // Privacy toggles local state
  const [localOnly, setLocalOnly] = useState(true);
  const [allowFinanceAI, setAllowFinanceAI] = useState(true);
  const [allowHealthAI, setAllowHealthAI] = useState(true);

  // 1. Finance calculations
  const financeScore = useApp().getFinanceScore();
  const activeTx = useApp().transactions || [];
  const activeBudgets = useApp().budgets || {};
  const activeSubs = useApp().subscriptions || [];
  
  // Weekly spend (last 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const totalWeeklySpend = activeTx
    .filter(t => t.type === 'expense' && new Date(t.date) >= oneWeekAgo)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalBudget = Object.values(activeBudgets).reduce((sum, b) => sum + b, 0) || 500;
  const weeklyBudgetLimit = totalBudget / 4;
  
  const potentialSubSavings = activeSubs.reduce((sum, s) => sum + s.amount, 0);

  // 2. Rest & Stress calculations
  const recentHealth = healthLogs || [];
  const avgSleepHours = recentHealth.length > 0
    ? recentHealth.reduce((sum, h) => sum + parseFloat(h.sleepHours || 0), 0) / recentHealth.length
    : 7.0;
    
  const recentMood = moodLogs || [];
  const avgStressScore = recentMood.length > 0
    ? recentMood.reduce((sum, m) => sum + (m.stressScore || 4), 0) / recentMood.length
    : 4.0;
    
  const sleepRating = avgSleepHours >= 7.0 && avgStressScore <= 4.0 ? 'Optimal' : avgSleepHours >= 6.0 ? 'Vulnerable' : 'Critical';
  const sleepProgressPercent = Math.min(100, Math.round((avgSleepHours / 8) * 100));

  // 3. Habit Consistency
  const habitConsistencyPercent = useApp().getHealthScore(); // fallback to health score

  // 4. Hobbies
  const totalHobbyHours = 3.5; // mock
  const hobbyGoalHours = 5.0; // mock
  const hobbyProgressPercent = Math.min(100, Math.round((totalHobbyHours / hobbyGoalHours) * 100));

  // AI Directive
  const actionableDirective = avgSleepHours < 6.5
    ? "Critical Sleep Alert: Set a strict screen blackout at 9:30 PM and automate saving $10 for every hour of sleep under 7 hours."
    : "Your biometric indices are stable. Maintain your current habit routines and savings rate.";
  
  const adoptTaskTitle = avgSleepHours < 6.5 ? "Establish 9:30 PM Sleep Routine & Auto-Save" : "Maintain Daily Wellness Balanced Habits";

  // Calculate dynamic Burnout Risk Index
  let burnoutRisk = 'Safe';
  let burnoutColor = '#34D399'; // green
  let burnoutReason = 'Your biometrics and stress logs indicate a healthy baseline balance.';

  // Determine stress
  const todayMood = moodLogs && moodLogs.length > 0 ? moodLogs[0] : null;
  const currentStress = todayMood ? todayMood.stressScore : 4;
  const todaySleep = healthLogs && healthLogs.length > 0 ? healthLogs[0].sleepHours : 7.2;
  const meetingsCount = isCalendarLinked ? 4 : 1; // mock meetings count
  const todaySteps = healthLogs && healthLogs.length > 0 ? healthLogs[0].steps : 5000;

  if (currentStress > 7 || todaySleep < 5.8) {
    burnoutRisk = 'Critical';
    burnoutColor = '#F87171'; // red
    burnoutReason = 'Critical sleep deficit or high stress score detected. Risk of mental fatigue is extremely high.';
  } else if (currentStress > 5 || todaySleep < 6.5 || meetingsCount > 3) {
    burnoutRisk = 'High';
    burnoutColor = '#FBBF24'; // yellow
    burnoutReason = 'High workload or low sleep hours detected. We recommend boundary corrections.';
  } else if (todaySteps < 4000) {
    burnoutRisk = 'Elevated';
    burnoutColor = '#C084FC'; // purple
    burnoutReason = 'Physical inactivity registered. Movement breaks are advised to offset work tension.';
  }

  // Deferral suggestions
  const pendingTasks = tasks.filter(t => !t.completed && t.dueDate === getTodayString() && !t.title.includes('☀️ Challenge') && !t.title.includes('📊 Plan') && !t.title.includes('😴 Simulation'));
  const taskToDefer = pendingTasks.length > 0 ? pendingTasks[0] : null;

  const handleDeferTask = () => {
    if (!taskToDefer) return;
    
    // Move task due date to tomorrow
    const tomorrowStr = new Date();
    tomorrowStr.setDate(tomorrowStr.getDate() + 1);
    const tomorrowDateStr = tomorrowStr.toISOString().split('T')[0];
    
    setTasks(prev => prev.map(t => t.id === taskToDefer.id ? { ...t, dueDate: tomorrowDateStr } : t));
    
    // Reward wellbeing points
    setWheelScores(prev => ({
      ...prev,
      mind: Math.min(100, (prev.mind || 65) + 5)
    }));

    addNotification(
      "Downtime Deferral Applied",
      `Task "${taskToDefer.title}" deferred to tomorrow. (+5 Wellbeing points applied).`,
      "health"
    );
    addAuditLog("Downtime Coordinator", `Deferred task: "${taskToDefer.title}" to ${tomorrowDateStr} due to burnout risk.`);
  };

  const handleAddTaskSubmit = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const success = addTask(newTaskTitle, newTaskPriority);
    if (!success) {
      setShowLockoutModal(true);
    } else {
      setNewTaskTitle('');
    }
  };

  const handlePurge = () => {
    if (window.confirm("Are you sure you want to clear all data? This deletes your local storage, reset your logs, and restarts the onboarding questionnaire.")) {
      resetAllData();
      alert("All data purged successfully. Restarting...");
      window.location.reload();
    }
  };

  return (
    <div className="settings-container fade-in">
      <h2 className="page-title">Settings & Control</h2>

      {/* PLAN SELECTOR CARD */}
      <div className="settings-card">
        <div className="card-header-icon-lbl">
          <CreditCard size={18} className="col-purple" />
          <span>Membership Plan</span>
        </div>
        
        <div className="plan-tiers-grid">
          <button 
            onClick={() => setPricingPlan('Free')}
            className={`plan-selector-card ${pricingPlan === 'Free' ? 'active-tier' : ''}`}
          >
            <span className="tier-title">Free Basic</span>
            <span className="tier-price">Free</span>
            <ul className="tier-features-list">
              <li>• Base Life Score</li>
              <li>• Manual spending logging</li>
              <li>• 3 AI chats/day</li>
            </ul>
          </button>

          <button 
            onClick={() => setPricingPlan('Premium')}
            className={`plan-selector-card ${pricingPlan === 'Premium' ? 'active-tier' : ''}`}
          >
            <span className="tier-title">Premium Coach</span>
            <span className="tier-price">$7.99/mo</span>
            <ul className="tier-features-list">
              <li>• Unlimited AI chats</li>
              <li>• Dynamic correlations</li>
              <li>• Active budget advice</li>
            </ul>
          </button>
        </div>
        {pricingPlan === 'Premium' && (
          <div className="success-banner text-center" style={{ marginTop: '12px' }}>
            <span>Premium Coaching features unlocked!</span>
          </div>
        )}
      </div>

      {/* FOCUS PRIORITY MANAGER */}
      <div className="settings-card">
        <h3>Focus Tasks Manager</h3>
        <form onSubmit={handleAddTaskSubmit} className="add-task-form">
          <input 
            type="text" 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add priority task..." 
            className="form-input text-sm"
            required
          />
          <div className="task-priority-select-row">
            <select 
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className="priority-selector-input"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button type="submit" className="add-task-btn">
              <Plus size={16} /> Add
            </button>
          </div>
        </form>

        <div className="settings-tasks-scroll">
          {tasks.map((task) => (
            <div key={task.id} className="task-manager-row">
              <span className={`task-manager-text ${task.completed ? 'completed-text' : ''}`}>{task.title}</span>
              <button 
                type="button"
                onClick={() => toggleTask(task.id)}
                className={`task-action-toggle-btn ${task.completed ? 'done' : ''}`}
              >
                {task.completed ? 'Done' : 'Toggle'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* PRIVACY CONTROLS DASHBOARD */}
      <div className="settings-card">
        <div className="card-header-icon-lbl">
          <ShieldCheck size={18} className="col-emerald" />
          <span>Privacy & Data Dashboard</span>
        </div>
        <p className="privacy-card-desc">LifeMate AI operates on privacy-first engineering. Configure data sharing permissions below.</p>

        <div className="privacy-toggles-list">
          <div className="privacy-toggle-row">
            <div>
              <span className="toggle-main-label">Lock cache to local storage</span>
              <span className="toggle-sub-desc">No data sent to cloud servers</span>
            </div>
            <input 
              type="checkbox" 
              checked={localOnly} 
              onChange={() => setLocalOnly(!localOnly)}
              className="checkbox-custom"
            />
          </div>

          <div className="privacy-toggle-row">
            <div>
              <span className="toggle-main-label">Allow AI finance analysis</span>
              <span className="toggle-sub-desc">AI can read spending habits to suggest leaks</span>
            </div>
            <input 
              type="checkbox" 
              checked={allowFinanceAI} 
              onChange={() => setAllowFinanceAI(!allowFinanceAI)}
              className="checkbox-custom"
            />
          </div>

          <div className="privacy-toggle-row">
            <div>
              <span className="toggle-main-label">Allow AI wellness profiling</span>
              <span className="toggle-sub-desc">AI scans sleep duration to adjust stress advice</span>
            </div>
            <input 
              type="checkbox" 
              checked={allowHealthAI} 
              onChange={() => setAllowHealthAI(!allowHealthAI)}
              className="checkbox-custom"
            />
          </div>
        </div>

        <button 
          onClick={handlePurge}
          className="purge-data-btn"
        >
          <Trash2 size={16} /> Wipe Local Cache & Reset
        </button>
      </div>

      {/* AI WEEKLY PROGRESS REVIEW CONSOLE CARD */}
      <div className="settings-card review-card-highlight">
        <div className="card-header-icon-lbl">
          <span style={{ fontSize: '18px' }}>📊</span>
          <span style={{ fontWeight: '700' }}>AI Weekly Performance Review</span>
          {isReviewAdopted && (
            <span className="review-adopted-badge" style={{ marginLeft: 'auto' }}>
              ✓ Plan Active
            </span>
          )}
        </div>
        <p className="privacy-card-desc" style={{ color: '#E2E8F0', marginTop: '6px' }}>
          Synthesize your Finance, Sleep, Habits, and Hobbies signals into an actionable AI weekly progress review alignment.
        </p>
        <button
          onClick={() => {
            setShowDiagnosticModal(true);
            addAuditLog("Weekly Review Console", "Opened AI weekly progress review diagnostics.");
          }}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isReviewAdopted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(167, 139, 250, 0.18)',
            border: isReviewAdopted ? '1.5px solid rgba(16, 185, 129, 0.3)' : '1.5px solid rgba(167, 139, 250, 0.4)',
            borderRadius: '12px',
            color: '#FFF',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '13px',
            transition: 'all 0.2s ease',
            marginTop: '10px'
          }}
        >
          {isReviewAdopted ? 'View Active Action Plan' : 'Generate Performance Diagnostic'}
        </button>
      </div>

      {/* AI Weekly Progress Review Diagnostic Modal */}
      {showDiagnosticModal && (
        <div className="modal-overlay" style={{ zIndex: 130 }}>
          <div className="modal-card review-modal-sheet">
            <div className="diagnostic-title-area">
              <span style={{ fontSize: '28px', display: 'block', marginBottom: '4px' }}>📊</span>
              <h3 className="diagnostic-gradient-title">AI Weekly Performance Review</h3>
              <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                Multi-Signal Diagnostics &amp; Alignment
              </p>
            </div>

            <div className="diagnostic-metrics-grid">
              {/* Financial Efficiency Index */}
              <div className="metric-diagnostic-row">
                <div className="metric-diagnostic-header">
                  <div className="metric-label-group">
                    <span>💰</span>
                    <span className="metric-lbl-text">Financial Efficiency</span>
                  </div>
                  <span className={`metric-status-badge ${financeScore >= 80 ? 'status-optimal' : financeScore >= 50 ? 'status-vulnerable' : 'status-critical'}`}>
                    {financeScore}%
                  </span>
                </div>
                <div className="metric-meter-container" style={{ marginBottom: '6px' }}>
                  <div className="metric-meter-bar meter-finance" style={{ width: `${financeScore}%` }} />
                </div>
                <div className="metric-val-text">
                  Weekly Spend: ${totalWeeklySpend.toFixed(2)} / ${weeklyBudgetLimit.toFixed(2)} limit. Potential subscription leak: ${potentialSubSavings.toFixed(2)}/mo.
                </div>
              </div>

              {/* Rest & Stress Buffer Index */}
              <div className="metric-diagnostic-row">
                <div className="metric-diagnostic-header">
                  <div className="metric-label-group">
                    <span>😴</span>
                    <span className="metric-lbl-text">Rest &amp; Stress Buffer</span>
                  </div>
                  <span className={`metric-status-badge ${sleepRating === 'Optimal' ? 'status-optimal' : sleepRating === 'Vulnerable' ? 'status-vulnerable' : 'status-critical'}`}>
                    {sleepRating}
                  </span>
                </div>
                <div className="metric-meter-container" style={{ marginBottom: '6px' }}>
                  <div className="metric-meter-bar meter-sleep" style={{ width: `${sleepProgressPercent}%` }} />
                </div>
                <div className="metric-val-text">
                  Average Sleep: {avgSleepHours.toFixed(1)}h/day. Average Stress Level: {avgStressScore.toFixed(1)}/10.
                </div>
              </div>

              {/* Habit Consistency Score */}
              <div className="metric-diagnostic-row">
                <div className="metric-diagnostic-header">
                  <div className="metric-label-group">
                    <span>⚡</span>
                    <span className="metric-lbl-text">Habit Consistency</span>
                  </div>
                  <span className={`metric-status-badge ${habitConsistencyPercent >= 80 ? 'status-optimal' : habitConsistencyPercent >= 50 ? 'status-vulnerable' : 'status-critical'}`}>
                    {habitConsistencyPercent}%
                  </span>
                </div>
                <div className="metric-meter-container" style={{ marginBottom: '6px' }}>
                  <div className="metric-meter-bar meter-habits" style={{ width: `${habitConsistencyPercent}%` }} />
                </div>
                <div className="metric-val-text">
                  Consistency rate of scheduled routines across the last 3 days.
                </div>
              </div>

              {/* Growth & Hobby Progress */}
              <div className="metric-diagnostic-row">
                <div className="metric-diagnostic-header">
                  <div className="metric-label-group">
                    <span>🎸</span>
                    <span className="metric-lbl-text">Growth &amp; Hobby Progress</span>
                  </div>
                  <span className={`metric-status-badge ${hobbyProgressPercent >= 85 ? 'status-optimal' : hobbyProgressPercent >= 50 ? 'status-vulnerable' : 'status-critical'}`}>
                    {hobbyProgressPercent}%
                  </span>
                </div>
                <div className="metric-meter-container" style={{ marginBottom: '6px' }}>
                  <div className="metric-meter-bar meter-hobbies" style={{ width: `${hobbyProgressPercent}%` }} />
                </div>
                <div className="metric-val-text">
                  Hobbies practice: {totalHobbyHours}h logged this week against {hobbyGoalHours}h goals.
                </div>
              </div>
            </div>

            {/* AI Actionable Directive Box */}
            <div className="ai-directive-box">
              <div className="ai-directive-header">AI Directive Recommendation</div>
              <p className="ai-directive-content">{actionableDirective}</p>
            </div>

            <div className="modal-actions" style={{ flexDirection: 'column', gap: '8px' }}>
              {!isReviewAdopted ? (
                <button
                  type="button"
                  onClick={() => {
                    adoptWeeklyActionPlan(adoptTaskTitle);
                    setShowDiagnosticModal(false);
                  }}
                  className="adopt-plan-btn"
                >
                  Adopt Recommended Action Plan
                </button>
              ) : (
                <div style={{
                  padding: '10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '10px',
                  color: '#34D399',
                  fontSize: '12px',
                  fontWeight: '700',
                  textAlign: 'center',
                  width: '100%',
                  marginBottom: '4px'
                }}>
                  ✓ Weekly action plan is active in your priorities task list.
                </div>
              )}
              
              <button 
                type="button" 
                onClick={() => setShowDiagnosticModal(false)} 
                className="modal-cancel-btn"
                style={{ width: '100%', margin: 0, padding: '10px' }}
              >
                Close Diagnostic Console
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INFORMATION FOOTER */}
      <div className="settings-info-card">
        <div className="info-flex">
          <Info size={16} />
          <span>Compliance Framework: GDPR & PDPA Ready</span>
        </div>
        <p className="text-xs">LifeMate AI v1.0.0. Developed under ethical wellness guidelines. Chat advice is for educational and habit-forming purposes only. It is not a replacement for clinical advice.</p>
      </div>
    </div>
  );
};

export default Settings;
