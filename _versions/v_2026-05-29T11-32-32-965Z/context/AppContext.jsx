import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

const DEFAULT_CATEGORIES = [
  { id: 'cat-housing', name: 'Housing', icon: 'Home', color: '#3B82F6' },
  { id: 'cat-groceries', name: 'Groceries', icon: 'ShoppingBag', color: '#10B981' },
  { id: 'cat-dining', name: 'Food & Dining', icon: 'Coffee', color: '#F59E0B' },
  { id: 'cat-transport', name: 'Transport', icon: 'Car', color: '#6366F1' },
  { id: 'cat-entertainment', name: 'Entertainment', icon: 'Film', color: '#EC4899' },
  { id: 'cat-utilities', name: 'Utilities', icon: 'Zap', color: '#8B5CF6' },
  { id: 'cat-health', name: 'Health & Wellness', icon: 'Heart', color: '#EF4444' },
  { id: 'cat-shopping', name: 'Shopping', icon: 'Tag', color: '#6B7280' },
  { id: 'cat-other', name: 'Other', icon: 'DollarSign', color: '#14B8A6' }
];

const INITIAL_PROFILE = {
  firstName: '',
  ageGroup: '20-30',
  incomeBracket: '$30k - $60k',
  lifeStage: 'Young Professional',
  coachingStyle: 'Gentle', // Gentle, Direct, Data-driven, Friendly
  notificationIntensity: 'Balanced', // Quiet, Essential, Balanced, Proactive
  onboardingCompleted: false
};

const INITIAL_TRANSACTIONS = [
  { id: 't1', amount: 1500, type: 'income', categoryId: 'cat-other', description: 'Bi-weekly Salary', date: '2026-05-25' },
  { id: 't2', amount: 45, type: 'expense', categoryId: 'cat-dining', description: 'Dinner with friends', date: '2026-05-27' },
  { id: 't3', amount: 85, type: 'expense', categoryId: 'cat-groceries', description: 'Weekly Groceries', date: '2026-05-26' },
  { id: 't4', amount: 15, type: 'expense', categoryId: 'cat-entertainment', description: 'Streaming Subscription', date: '2026-05-20' },
  { id: 't5', amount: 120, type: 'expense', categoryId: 'cat-utilities', description: 'Electric Bill', date: '2026-05-24' }
];

const INITIAL_BUDGETS = {
  'cat-groceries': 350,
  'cat-dining': 200,
  'cat-entertainment': 100,
  'cat-shopping': 150,
  'cat-health': 120
};

const INITIAL_SUBSCRIPTIONS = [
  { id: 'sub1', name: 'Netflix Premium', amount: 15.49, billingCycle: 'monthly', nextBillingDate: '2026-06-12', categoryId: 'cat-entertainment' },
  { id: 'sub2', name: 'Spotify Duo', amount: 14.99, billingCycle: 'monthly', nextBillingDate: '2026-06-18', categoryId: 'cat-entertainment' },
  { id: 'sub3', name: 'Gym Membership', amount: 49.99, billingCycle: 'monthly', nextBillingDate: '2026-06-05', categoryId: 'cat-health' }
];

const INITIAL_SAVINGS_GOALS = [
  { id: 'g1', title: 'Emergency Fund', target: 5000, current: 1200, deadline: '2026-12-31' },
  { id: 'g2', title: 'Summer Trip', target: 1500, current: 450, deadline: '2026-08-15' }
];

const INITIAL_HABITS = [
  { id: 'h1', name: 'Drink 2L Water', frequency: 'daily', streak: 3, completedDates: ['2026-05-26', '2026-05-27'] },
  { id: 'h2', name: '10k Steps Walk', frequency: 'daily', streak: 0, completedDates: ['2026-05-26'] },
  { id: 'h3', name: 'Read 15 Mins', frequency: 'daily', streak: 5, completedDates: ['2026-05-25', '2026-05-26', '2026-05-27'] },
  { id: 'h4', name: 'Breathing Break', frequency: 'daily', streak: 1, completedDates: ['2026-05-27'] }
];

const INITIAL_MOOD_LOGS = [
  { id: 'm1', moodScore: 7, stressScore: 4, notes: 'Feeling productive, had a good meeting', energyLevel: 7, date: '2026-05-27' },
  { id: 'm2', moodScore: 6, stressScore: 6, notes: 'Stressed about project timeline, slept poorly', energyLevel: 5, date: '2026-05-26' },
  { id: 'm3', moodScore: 8, stressScore: 3, notes: 'Nice relaxing weekend day', energyLevel: 8, date: '2026-05-24' }
];

const INITIAL_HEALTH_LOGS = [
  { date: '2026-05-28', sleepHours: 6.8, waterMl: 1200, steps: 4800 },
  { date: '2026-05-27', sleepHours: 7.2, waterMl: 2000, steps: 11200 },
  { date: '2026-05-26', sleepHours: 5.8, waterMl: 1000, steps: 6000 }
];

const INITIAL_TASKS = [
  { id: 't-1', title: 'Add Savings Goal in LifeMate', priority: 'high', completed: true, dueDate: '2026-05-28' },
  { id: 't-2', title: 'Schedule dental checkup', priority: 'medium', completed: false, dueDate: '2026-06-01' },
  { id: 't-3', title: 'Review subscription costs', priority: 'high', completed: false, dueDate: '2026-05-29' },
  { id: 't-4', title: 'Call parents', priority: 'low', completed: false, dueDate: '2026-05-31' }
];

const INITIAL_GROCERIES = [
  { id: 'gr1', name: 'Organic Spinach', quantity: 1, checked: false },
  { id: 'gr2', name: 'Almond Milk', quantity: 2, checked: true },
  { id: 'gr3', name: 'Avocados', quantity: 3, checked: false },
  { id: 'gr4', name: 'Greek Yogurt', quantity: 1, checked: false }
];

const INITIAL_AI_CONVERSATIONS = [
  { role: 'assistant', content: 'Hi there! I am your LifeMate AI Coach. How are you feeling today? We can chat about your budget, stress, sleep, or goals.', timestamp: new Date().toISOString() }
];

// Phase 2 Initial States
const INITIAL_NOTIFICATIONS = [
  { id: 'n1', title: 'Billing Alert', message: 'Netflix subscription ($15.49) renews in 2 days. Want to review your active bills?', type: 'finance', date: '2026-05-28', read: false },
  { id: 'n2', title: 'Stress & Energy Coach', message: 'You slept only 5.8h recently. Take a 3-minute breathing break to lower your physical strain.', type: 'health', date: '2026-05-27', read: true }
];

const INITIAL_MEALS = [
  { id: 'meal1', name: 'Avocado Toast & Egg', type: 'Breakfast', calories: 340, tags: ['Low-Sugar'], date: '2026-05-28' },
  { id: 'meal2', name: 'High-Protein Grain Bowl', type: 'Lunch', calories: 550, tags: ['High-Protein', 'Halal'], date: '2026-05-28' }
];

const INITIAL_WORKOUTS = [
  { id: 'wrk1', name: 'Gym Strength Cardio', type: 'Cardio', duration: 30, date: '2026-05-28' },
  { id: 'wrk2', name: 'Yoga Stretching', type: 'Flexibility', duration: 20, date: '2026-05-27' }
];

const INITIAL_WHEEL_SCORES = {
  finance: 80,
  health: 75,
  mind: 65,
  career: 70,
  social: 85,
  hobbies: 60
};

// Phase 3 Initial States
const INITIAL_AUDIT_LOGS = [
  { id: 'a1', action: 'Compliance Audit', details: 'GDPR consent logs validated successfully.', timestamp: '2026-05-28T12:00:00Z', operator: 'Privacy Daemon' },
  { id: 'a2', action: 'Data Encryption', details: 'Database connection verified (AES-256 rest standard).', timestamp: '2026-05-28T09:30:00Z', operator: 'Security Controller' }
];

// Helper to safely load and parse keys
const safeLoad = (key, defaultValue, validator) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved || saved === 'undefined' || saved === 'null') {
      return defaultValue;
    }
    const parsed = JSON.parse(saved);
    if (validator && !validator(parsed)) {
      console.warn(`Validator failed for key ${key}, reverting to defaults.`);
      return defaultValue;
    }
    return parsed;
  } catch (e) {
    console.error(`Error loading localStorage key "${key}":`, e);
    return defaultValue;
  }
};

export const AppProvider = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // App States with safety wrappers
  const [profile, setProfile] = useState(() => 
    safeLoad('lm_profile', INITIAL_PROFILE, p => p && typeof p === 'object' && 'onboardingCompleted' in p)
  );

  const [transactions, setTransactions] = useState(() => 
    safeLoad('lm_transactions', INITIAL_TRANSACTIONS, Array.isArray)
  );

  const [budgets, setBudgets] = useState(() => 
    safeLoad('lm_budgets', INITIAL_BUDGETS, b => b && typeof b === 'object')
  );

  const [subscriptions, setSubscriptions] = useState(() => 
    safeLoad('lm_subscriptions', INITIAL_SUBSCRIPTIONS, Array.isArray)
  );

  const [savingsGoals, setSavingsGoals] = useState(() => 
    safeLoad('lm_savingsGoals', INITIAL_SAVINGS_GOALS, Array.isArray)
  );

  const [habits, setHabits] = useState(() => {
    const loaded = safeLoad('lm_habits', INITIAL_HABITS, Array.isArray);
    return loaded.map(h => ({
      completedDates: [],
      streak: 0,
      ...h
    }));
  });

  const [moodLogs, setMoodLogs] = useState(() => 
    safeLoad('lm_moodLogs', INITIAL_MOOD_LOGS, Array.isArray)
  );

  const [healthLogs, setHealthLogs] = useState(() => 
    safeLoad('lm_healthLogs', INITIAL_HEALTH_LOGS, Array.isArray)
  );

  const [tasks, setTasks] = useState(() => 
    safeLoad('lm_tasks', INITIAL_TASKS, Array.isArray)
  );

  const [groceries, setGroceries] = useState(() => 
    safeLoad('lm_groceries', INITIAL_GROCERIES, Array.isArray)
  );

  const [aiConversations, setAiConversations] = useState(() => 
    safeLoad('lm_aiConversations', INITIAL_AI_CONVERSATIONS, Array.isArray)
  );

  const [pricingPlan, setPricingPlan] = useState(() => {
    try {
      return localStorage.getItem('lm_pricingPlan') || 'Free';
    } catch {
      return 'Free';
    }
  });

  // Phase 2 States
  const [notifications, setNotifications] = useState(() => 
    safeLoad('lm_notifications', INITIAL_NOTIFICATIONS, Array.isArray)
  );

  const [meals, setMeals] = useState(() => 
    safeLoad('lm_meals', INITIAL_MEALS, Array.isArray)
  );

  const [workouts, setWorkouts] = useState(() => 
    safeLoad('lm_workouts', INITIAL_WORKOUTS, Array.isArray)
  );

  const [wheelScores, setWheelScores] = useState(() => 
    safeLoad('lm_wheelScores', INITIAL_WHEEL_SCORES, w => w && typeof w === 'object')
  );

  const [showNotifications, setShowNotifications] = useState(false);

  // Phase 3 States (Mock Linkages & Admin Parameters)
  const [isBankLinked, setIsBankLinked] = useState(() => localStorage.getItem('lm_isBankLinked') === 'true');
  const [isWearableLinked, setIsWearableLinked] = useState(() => localStorage.getItem('lm_isWearableLinked') === 'true');
  const [isCalendarLinked, setIsCalendarLinked] = useState(() => localStorage.getItem('lm_isCalendarLinked') === 'true');
  
  const [gentlePromptOverride, setGentlePromptOverride] = useState(() => localStorage.getItem('lm_gentlePromptOverride') || '');
  const [directPromptOverride, setDirectPromptOverride] = useState(() => localStorage.getItem('lm_directPromptOverride') || '');

  const [isSimulationActive, setIsSimulationActive] = useState(() => localStorage.getItem('lm_isSimulationActive') === 'true');
  const [simulationSettings, setSimulationSettings] = useState(() => {
    const saved = localStorage.getItem('lm_simulationSettings');
    return saved ? JSON.parse(saved) : { sleep: 7.5, spend: 45, routines: 75, hobby: 1.5 };
  });

  const [isReviewAdopted, setIsReviewAdopted] = useState(() => localStorage.getItem('lm_isReviewAdopted') === 'true');

  const t = (key) => {
    const translations = {
      welcomeBack: 'Welcome back,',
      lifeScore: 'Life Score',
      money: 'Money',
      mind: 'Mind',
      body: 'Body',
      dailyAgenda: 'Daily Agenda',
      quickLogs: 'Quick Logs',
      logSpend: 'Log Spend',
      logMood: 'Log Mood',
      logHealth: 'Log Health',
      breathe: 'Breathe',
      dailyHabits: 'Daily Habits',
      focusPriorities: 'Focus Priorities'
    };
    return translations[key] || key;
  };

  const [auditLogs, setAuditLogs] = useState(() => 
    safeLoad('lm_auditLogs', INITIAL_AUDIT_LOGS, Array.isArray)
  );

  // Persist state updates to LocalStorage
  useEffect(() => { localStorage.setItem('lm_profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('lm_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('lm_budgets', JSON.stringify(budgets)); }, [budgets]);
  useEffect(() => { localStorage.setItem('lm_subscriptions', JSON.stringify(subscriptions)); }, [subscriptions]);
  useEffect(() => { localStorage.setItem('lm_savingsGoals', JSON.stringify(savingsGoals)); }, [savingsGoals]);
  useEffect(() => { localStorage.setItem('lm_habits', JSON.stringify(habits)); }, [habits]);
  useEffect(() => { localStorage.setItem('lm_moodLogs', JSON.stringify(moodLogs)); }, [moodLogs]);
  useEffect(() => { localStorage.setItem('lm_healthLogs', JSON.stringify(healthLogs)); }, [healthLogs]);
  useEffect(() => { localStorage.setItem('lm_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('lm_groceries', JSON.stringify(groceries)); }, [groceries]);
  useEffect(() => { localStorage.setItem('lm_aiConversations', JSON.stringify(aiConversations)); }, [aiConversations]);
  useEffect(() => { localStorage.setItem('lm_pricingPlan', pricingPlan); }, [pricingPlan]);
  
  // Phase 2 storage persistence
  useEffect(() => { localStorage.setItem('lm_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('lm_meals', JSON.stringify(meals)); }, [meals]);
  useEffect(() => { localStorage.setItem('lm_workouts', JSON.stringify(workouts)); }, [workouts]);
  useEffect(() => { localStorage.setItem('lm_wheelScores', JSON.stringify(wheelScores)); }, [wheelScores]);

  // Phase 3 storage persistence
  useEffect(() => { localStorage.setItem('lm_isBankLinked', isBankLinked); }, [isBankLinked]);
  useEffect(() => { localStorage.setItem('lm_isWearableLinked', isWearableLinked); }, [isWearableLinked]);
  useEffect(() => { localStorage.setItem('lm_isCalendarLinked', isCalendarLinked); }, [isCalendarLinked]);
  useEffect(() => { localStorage.setItem('lm_gentlePromptOverride', gentlePromptOverride); }, [gentlePromptOverride]);
  useEffect(() => { localStorage.setItem('lm_directPromptOverride', directPromptOverride); }, [directPromptOverride]);
  useEffect(() => { localStorage.setItem('lm_isSimulationActive', isSimulationActive); }, [isSimulationActive]);
  useEffect(() => { localStorage.setItem('lm_simulationSettings', JSON.stringify(simulationSettings)); }, [simulationSettings]);
  useEffect(() => { localStorage.setItem('lm_isReviewAdopted', isReviewAdopted); }, [isReviewAdopted]);
  useEffect(() => { localStorage.setItem('lm_auditLogs', JSON.stringify(auditLogs)); }, [auditLogs]);

  // Current Date Helper
  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Get current health metrics
  const getTodayHealthLog = () => {
    const todayStr = getTodayString();
    const log = Array.isArray(healthLogs) ? healthLogs.find(l => l.date === todayStr) : null;
    return log || { date: todayStr, sleepHours: 7.0, waterMl: 0, steps: 0 };
  };

  const updateTodayHealthLog = (fields) => {
    const todayStr = getTodayString();
    setHealthLogs(prev => {
      const activeLogs = Array.isArray(prev) ? prev : [];
      const idx = activeLogs.findIndex(l => l.date === todayStr);
      if (idx >= 0) {
        const updated = [...activeLogs];
        updated[idx] = { ...updated[idx], ...fields };
        return updated;
      } else {
        return [{ date: todayStr, sleepHours: 7.0, waterMl: 0, steps: 0, ...fields }, ...activeLogs];
      }
    });
  };

  // Habit completion toggle
  const toggleHabitCompletion = (habitId) => {
    const todayStr = getTodayString();
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const dates = Array.isArray(h.completedDates) ? h.completedDates : [];
        const isCompleted = dates.includes(todayStr);
        let newDates = [];
        let newStreak = h.streak || 0;
        if (isCompleted) {
          newDates = dates.filter(d => d !== todayStr);
          newStreak = Math.max(0, newStreak - 1);
        } else {
          newDates = [...dates, todayStr];
          newStreak = newStreak + 1;
        }
        return { ...h, streak: newStreak, completedDates: newDates };
      }
      return h;
    }));
  };

  // Finance Actions
  const addTransaction = (t) => {
    const newTx = {
      id: 't-' + Date.now(),
      amount: parseFloat(t.amount) || 0,
      type: t.type,
      categoryId: t.categoryId,
      description: t.description || 'Manual Entry',
      date: t.date || getTodayString()
    };
    setTransactions(prev => [newTx, ...(Array.isArray(prev) ? prev : [])]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => (Array.isArray(prev) ? prev.filter(t => t.id !== id) : []));
  };

  // Wellbeing Actions
  const addMoodLog = (moodVal, stressVal, energyVal, noteVal) => {
    const newLog = {
      id: 'm-' + Date.now(),
      moodScore: parseInt(moodVal) || 7,
      stressScore: parseInt(stressVal) || 4,
      energyLevel: parseInt(energyVal) || 7,
      notes: noteVal,
      date: getTodayString()
    };
    setMoodLogs(prev => [newLog, ...(Array.isArray(prev) ? prev : [])]);
  };

  // Task Actions
  const toggleTask = (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (title, priority = 'medium', dueDate = '') => {
    const newTask = {
      id: 'task-' + Date.now(),
      title,
      priority,
      completed: false,
      dueDate: dueDate || getTodayString()
    };
    setTasks(prev => [newTask, ...(Array.isArray(prev) ? prev : [])]);
  };

  // Grocery Actions
  const toggleGroceryItem = (itemId) => {
    setGroceries(prev => prev.map(item => item.id === itemId ? { ...item, checked: !item.checked } : item));
  };

  const addGroceryItem = (name) => {
    const newItem = {
      id: 'gro-' + Date.now(),
      name,
      quantity: 1,
      checked: false
    };
    setGroceries(prev => [...(Array.isArray(prev) ? prev : []), newItem]);
  };

  // Savings Goal updates
  const addSavingsProgress = (goalId, amount) => {
    setSavingsGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return { ...g, current: Math.min(g.target, (g.current || 0) + parseFloat(amount)) };
      }
      return g;
    }));
  };

  // Subscriptions Tracker
  const addSubscription = (sub) => {
    const newSub = {
      id: 'sub-' + Date.now(),
      name: sub.name,
      amount: parseFloat(sub.amount) || 0,
      billingCycle: sub.billingCycle,
      nextBillingDate: sub.nextBillingDate,
      categoryId: sub.categoryId
    };
    setSubscriptions(prev => [...(Array.isArray(prev) ? prev : []), newSub]);
  };

  const deleteSubscription = (id) => {
    setSubscriptions(prev => (Array.isArray(prev) ? prev.filter(s => s.id !== id) : []));
  };

  // Phase 2 Actions
  const addNotification = (title, message, type) => {
    const newAlert = {
      id: 'alert-' + Date.now(),
      title,
      message,
      type,
      date: getTodayString(),
      read: false
    };
    setNotifications(prev => [newAlert, ...(Array.isArray(prev) ? prev : [])]);
  };

  const markNotificationsRead = () => {
    setNotifications(prev => (Array.isArray(prev) ? prev.map(n => ({ ...n, read: true })) : []));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => (Array.isArray(prev) ? prev.filter(n => n.id !== id) : []));
  };

  const logMeal = (name, type, calories, tags = []) => {
    const newMeal = {
      id: 'meal-' + Date.now(),
      name,
      type,
      calories: parseInt(calories) || 300,
      tags,
      date: getTodayString()
    };
    setMeals(prev => [newMeal, ...(Array.isArray(prev) ? prev : [])]);
    
    const todayMeals = [newMeal, ...(Array.isArray(prev) ? prev : [])].filter(m => m.date === getTodayString());
    const totalCal = todayMeals.reduce((sum, m) => sum + m.calories, 0);
    if (totalCal > 2200) {
      addNotification("Caloric Alert", `Your logged calories reached ${totalCal} kcal. Consider a lighter dinner.`, "health");
    }
  };

  const deleteMeal = (id) => {
    setMeals(prev => (Array.isArray(prev) ? prev.filter(m => m.id !== id) : []));
  };

  const logWorkout = (name, type, duration) => {
    const newWrk = {
      id: 'wrk-' + Date.now(),
      name,
      type,
      duration: parseInt(duration) || 20,
      date: getTodayString()
    };
    setWorkouts(prev => [newWrk, ...(Array.isArray(prev) ? prev : [])]);
    addNotification("Workout Goal Logged", `Nice job! You completed ${duration} mins of ${type} exercise.`, "health");
  };

  const deleteWorkout = (id) => {
    setWorkouts(prev => (Array.isArray(prev) ? prev.filter(w => w.id !== id) : []));
  };

  const updateWheelScore = (category, val) => {
    setWheelScores(prev => {
      const activeWheel = prev && typeof prev === 'object' ? prev : INITIAL_WHEEL_SCORES;
      const updated = { ...activeWheel, [category]: parseInt(val) || 50 };
      
      if (val < 50) {
        let correctionTip = "";
        if (category === 'hobbies') correctionTip = "Schedule 15 mins of unplugged guitar/reading this evening.";
        if (category === 'mind') correctionTip = "Take a 4-minute box-breathing break to restore calm.";
        if (category === 'social') correctionTip = "Send a quick check-in text to one close friend.";
        
        addNotification(
          "Balance Alert", 
          `Your ${category} rating dipped to ${val}%. Correction suggestion: ${correctionTip}`, 
          category === 'finance' ? 'finance' : 'health'
        );
      }
      return updated;
    });
  };

  // Phase 3 Actions
  const addAuditLog = (action, details) => {
    const newLog = {
      id: 'audit-' + Date.now(),
      action,
      details,
      timestamp: new Date().toISOString(),
      operator: 'Active User'
    };
    setAuditLogs(prev => [newLog, ...(Array.isArray(prev) ? prev : [])]);
  };

  const adoptWeeklyActionPlan = (taskTitle) => {
    setIsReviewAdopted(true);
    addTask(taskTitle, 'high');
    addAuditLog("Weekly Review Action", `Adopted weekly action plan: "${taskTitle}"`);
    addNotification("Action Plan Adopted", `Goal "${taskTitle}" added to your focus priorities.`, "health");
  };

  // Clear data
  const resetAllData = () => {
    try {
      localStorage.clear();
    } catch {}
    setProfile(INITIAL_PROFILE);
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(INITIAL_BUDGETS);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setSavingsGoals(INITIAL_SAVINGS_GOALS);
    setHabits(INITIAL_HABITS);
    setMoodLogs(INITIAL_MOOD_LOGS);
    setHealthLogs(INITIAL_HEALTH_LOGS);
    setTasks(INITIAL_TASKS);
    setGroceries(INITIAL_GROCERIES);
    setAiConversations(INITIAL_AI_CONVERSATIONS);
    setPricingPlan('Free');
    setNotifications(INITIAL_NOTIFICATIONS);
    setMeals(INITIAL_MEALS);
    setWorkouts(INITIAL_WORKOUTS);
    setWheelScores(INITIAL_WHEEL_SCORES);
    setIsBankLinked(false);
    setIsWearableLinked(false);
    setIsCalendarLinked(false);
    setGentlePromptOverride('');
    setDirectPromptOverride('');
    setIsReviewAdopted(false);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setActiveTab('dashboard');
  };

  // DYNAMIC INSIGHTS & CONNECTED SIGNALS CORE
  // 1. Finance Score: based on spending vs budgets
  const getFinanceScore = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Total monthly spending
    const thisMonthExpenses = (Array.isArray(transactions) ? transactions : [])
      .filter(t => t.type === 'expense' && new Date(t.date) >= firstDay)
      .reduce((sum, t) => sum + t.amount, 0);

    const activeBudgets = budgets && typeof budgets === 'object' ? budgets : INITIAL_BUDGETS;
    const totalBudget = Object.values(activeBudgets).reduce((sum, b) => sum + b, 0) || 500;
    
    if (thisMonthExpenses === 0) return 100;
    if (thisMonthExpenses >= totalBudget) return 40;
    
    const pct = thisMonthExpenses / totalBudget;
    return Math.round(100 - (pct * 50));
  };

  // 2. Wellbeing Score: recent mood & stress
  const getWellbeingScore = () => {
    const activeMood = Array.isArray(moodLogs) ? moodLogs : [];
    if (activeMood.length === 0) return 80;
    
    const recentLogs = activeMood.slice(0, 5);
    const avgMood = recentLogs.reduce((sum, l) => sum + (l.moodScore || 6), 0) / recentLogs.length; // 1-10
    const avgStress = recentLogs.reduce((sum, l) => sum + (l.stressScore || 4), 0) / recentLogs.length; // 1-10
    
    const moodContribution = avgMood * 10;
    const stressPenalty = (avgStress - 1) * 7.5;
    
    return Math.round(Math.max(10, Math.min(100, moodContribution - stressPenalty + 30)));
  };

  // 3. Health Score: sleep, water, and habit completion
  const getHealthScore = () => {
    const todayStr = getTodayString();
    const activeHealth = Array.isArray(healthLogs) ? healthLogs : [];
    
    const recentSleep = activeHealth.slice(0, 3);
    const avgSleep = recentSleep.length > 0 
      ? recentSleep.reduce((sum, l) => sum + parseFloat(l.sleepHours || 0), 0) / recentSleep.length 
      : 7.0;
    
    let sleepScore = 100;
    if (avgSleep < 7) {
      sleepScore = Math.max(40, 100 - (7 - avgSleep) * 25);
    } else if (avgSleep > 9) {
      sleepScore = Math.max(70, 100 - (avgSleep - 9) * 15);
    }

    const todayHealth = getTodayHealthLog();
    const waterPct = Math.min(1.0, (todayHealth.waterMl || 0) / 2000);
    const waterScore = waterPct * 100;

    const activeHabits = Array.isArray(habits) ? habits : [];
    const habitsCompletedToday = activeHabits.filter(h => Array.isArray(h.completedDates) && h.completedDates.includes(todayStr)).length;
    
    const todayWorkouts = workouts.filter(w => w.date === todayStr);
    const activeMinutes = todayWorkouts.reduce((sum, w) => sum + w.duration, 0);
    const exerciseBonus = Math.min(20, (activeMinutes / 30) * 20); // max 20 bonus pts

    const baseHabitScore = activeHabits.length > 0 ? (habitsCompletedToday / activeHabits.length) * 100 : 80;
    const habitScore = Math.min(100, baseHabitScore + exerciseBonus);

    return Math.round((sleepScore * 0.4) + (waterScore * 0.3) + (habitScore * 0.3));
  };

  // 4. Combined Life Score
  const getLifeScore = () => {
    const finance = getFinanceScore();
    const wellbeing = getWellbeingScore();
    const health = getHealthScore();
    
    return Math.round((finance * 0.35) + (wellbeing * 0.35) + (health * 0.30));
  };

  // Dynamic dashboard AI text insights reflecting the "Connected Signals"
  const getAIDashboardRecommendation = () => {
    // Advanced prompt overrides if set by admin
    const coaching = profile.coachingStyle || 'Gentle';
    if (coaching === 'Gentle' && gentlePromptOverride) {
      return gentlePromptOverride;
    }
    if (coaching === 'Direct' && directPromptOverride) {
      return directPromptOverride;
    }

    const sleepLog = getTodayHealthLog();
    const sleep = parseFloat(sleepLog.sleepHours || 7.0);
    const activeMood = Array.isArray(moodLogs) ? moodLogs : [];
    const stressLogs = activeMood.slice(0, 3);
    const avgStress = stressLogs.length > 0 ? stressLogs.reduce((sum, l) => sum + (l.stressScore || 4), 0) / stressLogs.length : 4;
    
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const activeTx = Array.isArray(transactions) ? transactions : [];
    const monthlySpend = activeTx
      .filter(t => t.type === 'expense' && new Date(t.date) >= firstDay)
      .reduce((sum, t) => sum + t.amount, 0);
    const activeBudgets = budgets && typeof budgets === 'object' ? budgets : INITIAL_BUDGETS;
    const monthlyBudget = Object.values(activeBudgets).reduce((sum, b) => sum + b, 0) || 500;

    let text = "";
    
    if (coaching === 'Gentle') {
      if (isWearableLinked && sleep < 6.0 && avgStress > 6) {
        text = "Your Garmin logged an elevated heart rate (105 bpm) during your busy schedule today, likely compounded by sleeping only " + sleep + " hours. Today's Focus: Rest. Please reschedule any non-essential calendar tasks, take a 3-minute Box Breathing break, and aim for bed by 9:30 PM. You're doing great.";
      } else if (sleep < 6.0 && avgStress > 6) {
        text = "Today's Focus: Rest and recuperate. Your sleep has been quite low recently, which might explain why your stress levels feel elevated. Please let yourself off the hook today—postpone heavy tasks, take a 5-minute deep breathing break, and plan an early lights-out by 9:30 PM. You're doing great, one step at a time.";
      } else if (monthlySpend > monthlyBudget * 0.85) {
        text = "Energy Alert: You are close to your monthly spending target. No need to worry! Let's protect your peace of mind by planning a cozy, low-cost weekend at home. Maybe try a self-care evening, read that book on your shelf, or catch up with a friend over a walk.";
      } else if (sleepLog.waterMl < 800) {
        text = "Gentle Check-in: Hydration is the simplest way to boost your focus today. Keep a water bottle on your desk, and try to take a sip every time you complete a task. Let's aim for just one more glass before lunch.";
      } else {
        text = "Wonderful job showing up for yourself today! Your Life Score is steady. Focus on keeping up your habits, take a short active walk after lunch, and take a moment to write down one thing you are grateful for this evening.";
      }
    } else if (coaching === 'Direct') {
      if (isCalendarLinked && sleep < 6.0) {
        text = "Overload Warning: Sleep at " + sleep + "h and Google Calendar shows 4 events today. Rest deficit is critical. AI Coordinator has flagged task rescheduling recommendations. Complete 10 minutes of box-breathing immediately. Disconnect screens by 9 PM.";
      } else if (sleep < 6.0 && avgStress > 6) {
        text = "Warning: Rest deficit. Sleep is at " + sleep + "h and stress is at " + Math.round(avgStress) + "/10. This is an unsustainable combination. Reschedule non-critical tasks immediately. Take a 3-minute breath break now. Sleep early tonight.";
      } else if (monthlySpend > monthlyBudget * 0.85) {
        text = "Budget Alert: Monthly expenses are at " + Math.round((monthlySpend/monthlyBudget)*100) + "% of your limit. Stop dining out and cut discretionary spending for the next 4 days. Lock your savings allocation today.";
      } else if (sleepLog.waterMl < 1000) {
        text = "Hydration critical: Logged water is only " + sleepLog.waterMl + "ml. Drink 2 full glasses of water now to avoid headaches and energy crashes.";
      } else {
        text = "Status: Steady. Life Score is optimal. Clear your priority tasks by 4 PM, hit your step goal, and avoid screen time 45 minutes before sleep.";
      }
    } else if (coaching === 'Data-driven') {
      const stressIncrease = avgStress > 5 ? 20 : 0;
      text = `Correlation analysis: When your sleep falls below 6.5 hours, your logged stress index averages ${5 + stressIncrease/10}/10 (+30% increase). Today, your sleep is ${sleep}h. Recommendation: Limit caffeine intake after 12 PM, and take two 2-minute micro-breaks to offset cognitive fatigue.`;
    } else { // Friendly / Minimal
      text = "Hey! Hope you are doing okay. Let's make today a good one. Try to log your spending, take a 10-minute walk outside to get some fresh air, and sleep early tonight. You've got this!";
    }

    return text;
  };

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      profile,
      setProfile,
      transactions,
      setTransactions,
      budgets,
      setBudgets,
      subscriptions,
      setSubscriptions,
      savingsGoals,
      setSavingsGoals,
      habits,
      setHabits,
      moodLogs,
      setMoodLogs,
      healthLogs,
      setHealthLogs,
      tasks,
      setTasks,
      groceries,
      setGroceries,
      aiConversations,
      setAiConversations,
      pricingPlan,
      setPricingPlan,
      
      // Phase 2 States
      notifications,
      setNotifications,
      meals,
      setMeals,
      workouts,
      setWorkouts,
      wheelScores,
      setWheelScores,
      showNotifications,
      setShowNotifications,

      // Phase 3 States
      isBankLinked,
      setIsBankLinked,
      isWearableLinked,
      setIsWearableLinked,
      isCalendarLinked,
      setIsCalendarLinked,
      gentlePromptOverride,
      setGentlePromptOverride,
      directPromptOverride,
      setDirectPromptOverride,
      isSimulationActive,
      setIsSimulationActive,
      simulationSettings,
      setSimulationSettings,
      isReviewAdopted,
      setIsReviewAdopted,
      t,
      auditLogs,
      setAuditLogs,
      
      // Methods
      adoptWeeklyActionPlan,
      getTodayString,
      getTodayHealthLog,
      updateTodayHealthLog,
      toggleHabitCompletion,
      addTransaction,
      deleteTransaction,
      addMoodLog,
      toggleTask,
      addTask,
      toggleGroceryItem,
      addGroceryItem,
      addSavingsProgress,
      addSubscription,
      deleteSubscription,
      resetAllData,
      
      // Phase 2 Actions
      addNotification,
      markNotificationsRead,
      deleteNotification,
      logMeal,
      deleteMeal,
      logWorkout,
      deleteWorkout,
      updateWheelScore,

      // Phase 3 Actions
      addAuditLog,
      
      // Scores
      getFinanceScore,
      getWellbeingScore,
      getHealthScore,
      getLifeScore,
      getAIDashboardRecommendation
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
