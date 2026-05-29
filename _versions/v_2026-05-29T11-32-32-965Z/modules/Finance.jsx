import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  PlusCircle, 
  DollarSign, 
  Layers, 
  Calendar,
  AlertTriangle,
  Camera,
  Scan,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

const CATEGORY_NAMES = {
  'cat-housing': 'Housing',
  'cat-groceries': 'Groceries',
  'cat-dining': 'Food & Dining',
  'cat-transport': 'Transport',
  'cat-entertainment': 'Entertainment',
  'cat-utilities': 'Utilities',
  'cat-health': 'Health & Wellness',
  'cat-shopping': 'Shopping',
  'cat-other': 'Other'
};

const CATEGORY_COLORS = {
  'cat-housing': '#3B82F6',
  'cat-groceries': '#10B981',
  'cat-dining': '#F59E0B',
  'cat-transport': '#6366F1',
  'cat-entertainment': '#EC4899',
  'cat-utilities': '#8B5CF6',
  'cat-health': '#EF4444',
  'cat-shopping': '#6B7280',
  'cat-other': '#14B8A6'
};

const SAMPLE_RECEIPTS = [
  { id: 'rec-1', name: 'Starbucks Coffee', amount: 4.85, categoryId: 'cat-dining' },
  { id: 'rec-2', name: 'Target Groceries', amount: 54.20, categoryId: 'cat-groceries' },
  { id: 'rec-3', name: 'Whole Foods Market', amount: 78.10, categoryId: 'cat-groceries' }
];

const Finance = () => {
  const {
    transactions,
    budgets,
    subscriptions,
    savingsGoals,
    addTransaction,
    deleteTransaction,
    addSubscription,
    deleteSubscription,
    addSavingsProgress,
    getTodayString,
    addNotification,
    isBankLinked,
    addAuditLog,
    isSimulationActive,
    simulationSettings,
    t
  } = useApp();

  const [activeSection, setActiveSection] = useState('transactions'); // transactions, budgets, savings, subscriptions
  
  // Modals / Input fields states
  const [showAddTx, setShowAddTx] = useState(false);
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState('expense');
  const [txCategory, setTxCategory] = useState('cat-dining');
  const [txDesc, setTxDesc] = useState('');
  
  const [showAddSub, setShowAddSub] = useState(false);
  const [subName, setSubName] = useState('');
  const [subAmount, setSubAmount] = useState('');
  const [subCategory, setSubCategory] = useState('cat-entertainment');
  const [subDate, setSubDate] = useState('2026-06-01');

  const [savingGoalId, setSavingGoalId] = useState(null);
  const [addGoalAmt, setAddGoalAmt] = useState('');

  // Phase 2 states
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanningStep, setScanningStep] = useState('');
  const [scannedSuccess, setScannedSuccess] = useState(false);

  // Phase 5 states (Auto-Saver rules)
  const [autoSaverActive, setAutoSaverActive] = useState(() => localStorage.getItem('lm_autoSaverActive') === 'true');

  useEffect(() => {
    localStorage.setItem('lm_autoSaverActive', autoSaverActive);
  }, [autoSaverActive]);

  // Math totals for the current month
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  const monthlyIncome = transactions
    .filter(t => t.type === 'income' && new Date(t.date) >= firstDay)
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = transactions
    .filter(t => t.type === 'expense' && new Date(t.date) >= firstDay)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBudget = Object.values(budgets).reduce((sum, val) => sum + val, 0);

  // Compute category-wise spending
  const getCategorySpend = (catId) => {
    return transactions
      .filter(t => t.type === 'expense' && t.categoryId === catId && new Date(t.date) >= firstDay)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleTxSubmit = (e) => {
    e.preventDefault();
    if (!txAmount || parseFloat(txAmount) <= 0) return;
    
    const amtFloat = parseFloat(txAmount);
    
    addTransaction({
      amount: amtFloat,
      type: txType,
      categoryId: txCategory,
      description: txDesc,
      date: getTodayString()
    });

    // Auto-Saver Spare Change Rule execution
    if (txType === 'expense' && autoSaverActive) {
      let isUnderBudget = true;
      if (txCategory === 'cat-dining') {
        const diningSpent = getCategorySpend('cat-dining') + amtFloat;
        const diningLimit = budgets['cat-dining'] || 200;
        if (diningSpent > diningLimit) {
          isUnderBudget = false;
        }
      }

      if (isUnderBudget) {
        const roundup = Math.ceil(amtFloat) - amtFloat;
        if (roundup > 0) {
          // g1 is Emergency Fund
          addSavingsProgress('g1', roundup);
          addNotification(
            "Auto-Saver Spare Change Rule",
            `Auto-saver active: Rounded up ${roundup.toFixed(2)} from "${txDesc || 'Log'}" and moved to Emergency Fund.`,
            "finance"
          );
          addAuditLog(
            "Open-Banking Auto-Saver",
            `Transferred roundup change ${roundup.toFixed(2)} for transaction amount ${amtFloat} to emergency savings goal.`
          );
        }
      } else {
        const excessAmt = Math.ceil(amtFloat) - amtFloat;
        addNotification(
          "Auto-Saver Suspended",
          `Dining budget limit of ${budgets['cat-dining'] || 200} reached. Spare change auto-saver suspended for this category.`,
          "finance"
        );
        addAuditLog(
          "Auto-Saver Suspended",
          `Skipped spare change transfer of ${excessAmt.toFixed(2)} because dining budget cap is exceeded.`
        );
      }
    }

    setTxAmount('');
    setTxDesc('');
    setShowAddTx(false);
  };

  const handleSubSubmit = (e) => {
    e.preventDefault();
    if (!subName || !subAmount || parseFloat(subAmount) <= 0) return;
    addSubscription({
      name: subName,
      amount: subAmount,
      billingCycle: 'monthly',
      nextBillingDate: subDate,
      categoryId: subCategory
    });
    setSubName('');
    setSubAmount('');
    setShowAddSub(false);
  };

  const handleAddSavings = (e) => {
    e.preventDefault();
    if (!addGoalAmt || parseFloat(addGoalAmt) <= 0 || !savingGoalId) return;
    addSavingsProgress(savingGoalId, addGoalAmt);
    setAddGoalAmt('');
    setSavingGoalId(null);
  };

  const handleScanSubmit = () => {
    if (!selectedReceipt) return;
    const item = SAMPLE_RECEIPTS.find(r => r.id === selectedReceipt);
    if (!item) return;

    setIsScanning(true);
    setScanningStep("AI Scanning Upload...");

    setTimeout(() => {
      setScanningStep("Extracting text and amounts...");
    }, 600);

    setTimeout(() => {
      setScanningStep("Mapping transaction categories...");
    }, 1100);

    setTimeout(() => {
      addTransaction({
        amount: item.amount,
        type: 'expense',
        categoryId: item.categoryId,
        description: `${item.name} (OCR)`,
        date: getTodayString()
      });

      // Auto-Saver Spare Change Rule execution for scanned receipts
      if (autoSaverActive) {
        const roundup = Math.ceil(item.amount) - item.amount;
        if (roundup > 0) {
          addSavingsProgress('g1', roundup);
          addNotification(
            "Auto-Saver Spare Change Rule",
            `Auto-saver active: Rounded up $${roundup.toFixed(2)} from "${item.name}" and saved.`,
            "finance"
          );
        }
      }

      setIsScanning(false);
      setScanningStep("");
      setSelectedReceipt(null);
      setScannedSuccess(true);
      setTimeout(() => setScannedSuccess(false), 3000);
    }, 1800);
  };

  // Subscription Auto Detector scanner logic
  const getDetectedSubscription = () => {
    const counts = {};
    const amounts = {};
    const categories = {};
    
    transactions.forEach(t => {
      if (t.type === 'expense' && t.description && !t.description.includes('(OCR)')) {
        const name = t.description.trim();
        counts[name] = (counts[name] || 0) + 1;
        amounts[name] = t.amount;
        categories[name] = t.categoryId;
      }
    });

    const duplicate = Object.keys(counts).find(name => {
      if (counts[name] < 2) return false;
      const isAlreadySub = subscriptions.some(s => s.name.toLowerCase().includes(name.toLowerCase()));
      return !isAlreadySub;
    });

    if (duplicate) {
      return {
        description: duplicate,
        amount: amounts[duplicate],
        categoryId: categories[duplicate]
      };
    }
    return null;
  };

  const detectedSubTx = getDetectedSubscription();

  // Mock Subscription Usage Risk Indices
  const getSubscriptionRiskDetails = (name) => {
    const n = name.toLowerCase();
    if (n.includes('netflix')) {
      return { score: 'HIGH', color: '#EF4444', advice: 'Unused for 14 days. Cancel recommendation.', usage: 'Active: 4%' };
    }
    if (n.includes('spotify')) {
      return { score: 'LOW', color: '#10B981', advice: 'High daily utilization. Value optimized.', usage: 'Active: 92%' };
    }
    if (n.includes('gym')) {
      return { score: 'MEDIUM', color: '#F59E0B', advice: 'Visit at least twice weekly to justify cost.', usage: 'Active: 40%' };
    }
    return { score: 'MEDIUM', color: '#F59E0B', advice: 'Usage signals moderate. Monitor billing cycles.', usage: 'Active: 50%' };
  };

  return (
    <div className="finance-container fade-in">
      {/* Title */}
      <h2 className="page-title">{t('finance')}</h2>

      {/* Cash Flow Summary Card */}
      <div className="cashflow-card">
        <div className="cashflow-stat border-right">
          <div className="stat-label">
            <TrendingUp size={16} className="col-emerald" />
            <span>Monthly Income</span>
          </div>
          <span className="stat-value col-emerald">${monthlyIncome.toFixed(2)}</span>
        </div>
        <div className="cashflow-stat">
          <div className="stat-label">
            <TrendingDown size={16} className="col-rose" />
            <span>Monthly Spent</span>
          </div>
          <span className="stat-value col-rose">${monthlyExpense.toFixed(2)}</span>
        </div>
      </div>

      {/* MOCK CHASE BANK CARD IF LINKED */}
      {isBankLinked && (
        <div className="settings-card fade-in" style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(30, 58, 138, 0.4))',
          borderColor: 'rgba(59, 130, 246, 0.4)',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#34D399', borderRadius: '50%' }}></div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#93C5FD', textTransform: 'uppercase' }}>Chase Bank Synced</span>
            </div>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: '800', color: '#FFF' }}>$4,250.00</h3>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>Checking Account • **** 9824</span>
          </div>
          <div style={{
            padding: '6px 12px',
            backgroundColor: 'rgba(52, 211, 153, 0.1)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            borderRadius: '10px',
            fontSize: '11px',
            color: '#34D399',
            fontWeight: '700'
          }}>
            Auto-Sync Active
          </div>
        </div>
      )}

      {/* Navigation Pills */}
      <div className="finance-nav-tabs">
        <button 
          onClick={() => setActiveSection('transactions')} 
          className={`finance-tab-pill ${activeSection === 'transactions' ? 'active' : ''}`}
        >
          Ledger
        </button>
        <button 
          onClick={() => setActiveSection('budgets')} 
          className={`finance-tab-pill ${activeSection === 'budgets' ? 'active' : ''}`}
        >
          Budgets
        </button>
        <button 
          onClick={() => setActiveSection('subscriptions')} 
          className={`finance-tab-pill ${activeSection === 'subscriptions' ? 'active' : ''}`}
        >
          Bills
        </button>
        <button 
          onClick={() => setActiveSection('savings')} 
          className={`finance-tab-pill ${activeSection === 'savings' ? 'active' : ''}`}
        >
          Savings
        </button>
      </div>

      {/* TRANSACTIONS SECTION */}
      {activeSection === 'transactions' && (
        <div className="finance-section-wrapper">
          <div className="section-header-flex">
            <h3 className="section-title">Transaction Ledger</h3>
            <button onClick={() => setShowAddTx(true)} className="add-btn-small">
              <Plus size={14} /> Add Log
            </button>
          </div>

          {/* Mock Receipt OCR Scanner */}
          <div className="ocr-scanner-card">
            <div className="card-header-icon-lbl">
              <Camera size={18} className="col-purple" />
              <span>Smart Receipt OCR Scanner</span>
            </div>
            <p className="subtitle" style={{ margin: '0', fontSize: '11px', textAlign: 'left' }}>
              Select a sample invoice to simulate AI text and amount extraction.
            </p>
            <div className="sample-receipts-row">
              {SAMPLE_RECEIPTS.map(rec => (
                <button
                  key={rec.id}
                  onClick={() => setSelectedReceipt(rec.id)}
                  className={`receipt-chip ${selectedReceipt === rec.id ? 'selected' : ''}`}
                >
                  {rec.name} (${rec.amount.toFixed(2)})
                </button>
              ))}
            </div>
            {selectedReceipt && (
              <button 
                onClick={handleScanSubmit} 
                disabled={isScanning} 
                className="scanner-scan-trigger animate-bounce"
              >
                <Scan size={14} /> Scan Selected Receipt
              </button>
            )}
            {isScanning && (
              <div className="form-group" style={{ gap: '8px' }}>
                <div className="scanning-bar-track">
                  <div className="scanning-bar-fill"></div>
                </div>
                <span className="receipt-scanner-status-text">{scanningStep}</span>
              </div>
            )}
            {scannedSuccess && (
              <div className="success-banner fade-in">
                <span>Receipt scanned successfully! Expense logged to ledger.</span>
              </div>
            )}
          </div>

          {/* Subscription Auto Detector Banner */}
          {detectedSubTx && (
            <div className="detector-warning-card fade-in">
              <div className="detector-label-row">
                <AlertTriangle size={14} />
                <span>Subscription Auto-Detector</span>
              </div>
              <p className="detector-desc" style={{ textAlign: 'left' }}>
                We detected multiple repeat payments for <strong>"{detectedSubTx.description}"</strong> (${detectedSubTx.amount.toFixed(2)}). Would you like to track this as a recurring bill to receive alerts?
              </p>
              <button 
                onClick={() => {
                  addSubscription({
                    name: detectedSubTx.description,
                    amount: detectedSubTx.amount,
                    billingCycle: 'monthly',
                    nextBillingDate: '2026-06-01',
                    categoryId: detectedSubTx.categoryId || 'cat-entertainment'
                  });
                  addNotification("Subscription Tracked", `Added "${detectedSubTx.description}" to your recurring bills list.`, "finance");
                }} 
                className="detector-action-btn"
              >
                Track as Subscription
              </button>
            </div>
          )}

          {/* Add Tx Modal Overlay */}
          {showAddTx && (
            <div className="modal-overlay">
              <div className="modal-card">
                <h3>Log Transaction</h3>
                <form onSubmit={handleTxSubmit}>
                  <div className="form-group">
                    <label>Transaction Type</label>
                    <div className="toggle-selector">
                      <button 
                        type="button"
                        onClick={() => setTxType('expense')}
                        className={`toggle-btn ${txType === 'expense' ? 'active-expense' : ''}`}
                      >
                        Expense
                      </button>
                      <button 
                        type="button"
                        onClick={() => setTxType('income')}
                        className={`toggle-btn ${txType === 'income' ? 'active-income' : ''}`}
                      >
                        Income
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Amount ($)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={txAmount} 
                      onChange={(e) => setTxAmount(e.target.value)} 
                      placeholder="0.00" 
                      className="form-input" 
                      required 
                    />
                  </div>

                  {txType === 'expense' && (
                    <div className="form-group">
                      <label>Category</label>
                      <select 
                        value={txCategory} 
                        onChange={(e) => setTxCategory(e.target.value)}
                        className="form-input"
                      >
                        {Object.entries(CATEGORY_NAMES).map(([id, name]) => (
                          <option key={id} value={id}>{name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="form-group">
                    <label>Description</label>
                    <input 
                      type="text" 
                      value={txDesc} 
                      onChange={(e) => setTxDesc(e.target.value)} 
                      placeholder="e.g. Target Grocery" 
                      className="form-input" 
                    />
                  </div>

                  <div className="modal-actions">
                    <button type="button" onClick={() => setShowAddTx(false)} className="modal-cancel-btn">Cancel</button>
                    <button type="submit" className="modal-save-btn">Save Log</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="ledger-scrollbox">
            {transactions.length > 0 ? (
              transactions.map((tx) => {
                const isExpense = tx.type === 'expense';
                return (
                  <div key={tx.id} className="ledger-row">
                    <div className="ledger-meta">
                      <div 
                        className="category-dot" 
                        style={{ backgroundColor: isExpense ? CATEGORY_COLORS[tx.categoryId] || '#6B7280' : '#10B981' }}
                      >
                        <DollarSign size={14} />
                      </div>
                      <div className="ledger-details">
                        <span className="ledger-desc">{tx.description}</span>
                        <span className="ledger-sub">{isExpense ? CATEGORY_NAMES[tx.categoryId] : 'Income'} • {tx.date}</span>
                      </div>
                    </div>
                    <div className="ledger-actions">
                      <span className={`ledger-amount ${isExpense ? 'col-rose' : 'col-emerald'}`}>
                        {isExpense ? '-' : '+'}${parseFloat(tx.amount).toFixed(2)}
                      </span>
                      <button onClick={() => deleteTransaction(tx.id)} className="delete-row-btn" aria-label="Delete transaction">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state-card">
                <span>No transactions logged yet.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BUDGETS SECTION */}
      {activeSection === 'budgets' && (
        <div className="finance-section-wrapper">
          {isSimulationActive && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(167, 139, 250, 0.08))',
              border: '1.5px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '14px',
              padding: '12px',
              marginBottom: '14px',
              fontSize: '11.5px',
              lineHeight: '1.4',
              color: '#FFF',
              textAlign: 'left'
            }}>
              <span style={{ fontWeight: '800', color: '#FBBF24', display: 'block', marginBottom: '2px' }}>
                ⚡ Sandbox Simulation Override Active
              </span>
              All budget limits are scaled proportionally to align with your daily spend target of <strong>${simulationSettings?.spend}</strong>. Disable in Dashboard to restore defaults.
            </div>
          )}
          <div className="section-header-flex">
            <h3 className="section-title">Monthly Limits</h3>
            <span className="budget-summary-tag">Total Cap: ${totalBudget}</span>
          </div>

          <div className="budgets-scrollbox">
            {Object.entries(budgets).map(([categoryId, limit]) => {
              const spent = getCategorySpend(categoryId);
              const pct = Math.min(100, Math.round((spent / limit) * 100));
              const isOver = spent > limit;
              return (
                <div key={categoryId} className="budget-progress-card">
                  <div className="budget-card-meta">
                    <span className="budget-cat-name">{CATEGORY_NAMES[categoryId]}</span>
                    <span className={`budget-cat-values ${isOver ? 'col-rose bold' : ''}`}>
                      ${spent.toFixed(0)} / ${limit}
                    </span>
                  </div>
                  <div className="budget-bar-track">
                    <div 
                      className={`budget-bar-fill ${isOver ? 'bg-rose' : ''}`}
                      style={{ 
                        width: `${pct}%`, 
                        backgroundColor: isOver ? '#EF4444' : CATEGORY_COLORS[categoryId] 
                      }}
                    ></div>
                  </div>
                  {isOver && (
                    <div className="budget-warning-tag fade-in">
                      <AlertTriangle size={12} /> Over budget! Cut down discretionary spend.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBSCRIPTIONS / BILLS SECTION */}
      {activeSection === 'subscriptions' && (
        <div className="finance-section-wrapper">
          <div className="section-header-flex">
            <h3 className="section-title">Active Subscriptions</h3>
            <button onClick={() => setShowAddSub(true)} className="add-btn-small">
              <Plus size={14} /> Add Bill
            </button>
          </div>

          {/* Add Sub Modal */}
          {showAddSub && (
            <div className="modal-overlay">
              <div className="modal-card">
                <h3>Track New Bill</h3>
                <form onSubmit={handleSubSubmit}>
                  <div className="form-group">
                    <label>Service Name</label>
                    <input 
                      type="text" 
                      value={subName} 
                      onChange={(e) => setSubName(e.target.value)} 
                      placeholder="e.g. Netflix, Gym" 
                      className="form-input" 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Amount ($ / month)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={subAmount} 
                      onChange={(e) => setSubAmount(e.target.value)} 
                      placeholder="0.00" 
                      className="form-input" 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Billing Date</label>
                    <input 
                      type="date" 
                      value={subDate} 
                      onChange={(e) => setSubDate(e.target.value)} 
                      className="form-input" 
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select 
                      value={subCategory} 
                      onChange={(e) => setSubCategory(e.target.value)}
                      className="form-input"
                    >
                      {Object.entries(CATEGORY_NAMES).map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="modal-actions">
                    <button type="button" onClick={() => setShowAddSub(false)} className="modal-cancel-btn">Cancel</button>
                    <button type="submit" className="modal-save-btn">Add Track</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ACTIVE BILLS SCROLL LIST WITH OPTIMIZATION INDEX CARDS */}
          <div className="subs-scrollbox" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {subscriptions.length > 0 ? (
              subscriptions.map((sub) => {
                const opt = getSubscriptionRiskDetails(sub.name);
                return (
                  <div key={sub.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div className="sub-row-card" style={{ marginBottom: '0' }}>
                      <div className="sub-card-details">
                        <span className="sub-name">{sub.name}</span>
                        <span className="sub-billing-date">
                          <Calendar size={12} /> Renews: {sub.nextBillingDate}
                        </span>
                      </div>
                      <div className="sub-actions">
                        <span className="sub-cost">${parseFloat(sub.amount).toFixed(2)}/mo</span>
                        <button onClick={() => deleteSubscription(sub.id)} className="delete-row-btn" aria-label="Delete subscription">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    {/* RISK LEAK INDICATOR CARD */}
                    <div style={{
                      backgroundColor: 'rgba(15, 23, 42, 0.4)',
                      border: '1.5px solid rgba(255,255,255,0.02)',
                      borderRadius: '12px',
                      padding: '8px 12px',
                      fontSize: '11px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          fontWeight: '800', color: opt.color,
                          backgroundColor: `${opt.color}15`, padding: '2px 6px', borderRadius: '6px'
                        }}>
                          {opt.score} RISK
                        </span>
                        <span style={{ color: '#CBD5E1' }}>{opt.advice}</span>
                      </div>
                      <span style={{ color: '#94A3B8', fontWeight: '700', fontSize: '10px' }}>
                        {opt.usage}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state-card">
                <span>No recurring bills tracked.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SAVINGS GOALS SECTION */}
      {activeSection === 'savings' && (
        <div className="finance-section-wrapper">
          
          {/* OPEN BANKING AUTO-SAVER SPARE CHANGE RULE */}
          <div className="settings-card" style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(30, 58, 138, 0.3))',
            borderColor: 'rgba(139, 92, 246, 0.3)',
            padding: '14px',
            marginBottom: '14px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(139, 92, 246, 0.4)',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#A78BFA'
                }}>
                  <Zap size={16} />
                </div>
                <div>
                  <h4 style={{ margin: '0', fontSize: '13px', fontWeight: '800', color: '#FFF' }}>Open-Banking Auto-Saver</h4>
                  <span style={{ fontSize: '10px', color: '#94A3B8' }}>Spare Change Roundup Rule</span>
                </div>
              </div>
              
              <input 
                type="checkbox" 
                checked={autoSaverActive} 
                onChange={(e) => {
                  setAutoSaverActive(e.target.checked);
                  addAuditLog("Auto-Saver Toggled", `Spare change roundup ruleset changed to: ${e.target.checked ? 'ACTIVE' : 'INACTIVE'}`);
                  addNotification(
                    "Auto-Saver Rule Updated",
                    `Rounded spare change will now automatically allocate to savings on manual logs.`,
                    "finance"
                  );
                }}
                className="checkbox-custom"
              />
            </div>
            
            <p style={{ margin: '10px 0 0 0', fontSize: '11px', color: '#CBD5E1', lineHeight: '1.4' }}>
              Automatically rounds up discretionary expenses (e.g. $4.85 gets rounded up to $5.00) and transfers the $0.15 surplus from Chase balances directly into the **Emergency Fund** target!
            </p>
          </div>

          <h3 className="section-title">Savings Targets</h3>

          {/* Add Money Progress Modal */}
          {savingGoalId && (
            <div className="modal-overlay">
              <div className="modal-card">
                <h3>Allocate Savings</h3>
                <form onSubmit={handleAddSavings}>
                  <div className="form-group">
                    <label>Amount to Allocate ($)</label>
                    <input 
                      type="number" 
                      step="1" 
                      value={addGoalAmt} 
                      onChange={(e) => setAddGoalAmt(e.target.value)} 
                      placeholder="0.00" 
                      className="form-input" 
                      required 
                    />
                  </div>
                  <div className="modal-actions">
                    <button type="button" onClick={() => setSavingGoalId(null)} className="modal-cancel-btn">Cancel</button>
                    <button type="submit" className="modal-save-btn">Add Fund</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="savings-scrollbox">
            {savingsGoals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
              return (
                <div key={goal.id} className="savings-progress-card">
                  <div className="savings-meta">
                    <div>
                      <span className="savings-title">{goal.title}</span>
                      <span className="savings-deadline">Deadline: {goal.deadline}</span>
                    </div>
                    <button onClick={() => setSavingGoalId(goal.id)} className="allocate-fund-btn">
                      <PlusCircle size={14} /> Fund
                    </button>
                  </div>
                  <div className="savings-amounts">
                    <span>${goal.current} / ${goal.target}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="savings-bar-track">
                    <div className="savings-bar-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
