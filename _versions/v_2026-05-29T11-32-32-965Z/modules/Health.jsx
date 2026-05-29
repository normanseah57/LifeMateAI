import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Check, 
  Flame, 
  Plus, 
  Moon, 
  Droplet, 
  Activity,
  PlusCircle,
  Calendar as CalIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Health = () => {
  const {
    habits,
    setHabits,
    toggleHabitCompletion,
    getTodayHealthLog,
    updateTodayHealthLog,
    getTodayString,
    meals,
    logMeal,
    deleteMeal,
    workouts,
    logWorkout,
    deleteWorkout,
    isWearableLinked,
    addAuditLog,
    addNotification,
    t,
    moodLogs,
    addGroceryItem
  } = useApp();

  const [activeSection, setActiveSection] = useState('habits'); // habits, sleep, water, nutrition
  
  // Custom habit input
  const [newHabitName, setNewHabitName] = useState('');
  const [showAddHabit, setShowAddHabit] = useState(false);

  // Active selected habit for monthly calendar grid details
  const [selectedHabitId, setSelectedHabitId] = useState(habits[0]?.id || 'h1');

  // Cardio exercise inputs
  const [workoutName, setWorkoutName] = useState('');
  const [workoutType, setWorkoutType] = useState('Cardio');
  const [workoutDuration, setWorkoutDuration] = useState(30);

  const todayStr = getTodayString();
  const todayHealth = getTodayHealthLog();

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    const newHabit = {
      id: 'hab-' + Date.now(),
      name: newHabitName,
      frequency: 'daily',
      streak: 0,
      completedDates: []
    };
    setHabits(prev => [...prev, newHabit]);
    setSelectedHabitId(newHabit.id);
    setNewHabitName('');
    setShowAddHabit(false);
    addAuditLog("Habit Created", `Created custom habit: "${newHabitName}"`);
  };

  const addWater = (amt) => {
    const newWater = Math.min(4000, todayHealth.waterMl + amt);
    updateTodayHealthLog({ waterMl: newWater });
  };

  const resetWater = () => {
    updateTodayHealthLog({ waterMl: 0 });
  };

  const handleSleepChange = (val) => {
    updateTodayHealthLog({ sleepHours: parseFloat(val) });
  };

  const handleStepsChange = (val) => {
    updateTodayHealthLog({ steps: parseInt(val) });
  };

  // Retroactive date completion toggle
  const toggleRetroactiveHabitDate = (habitId, dateStr) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const dates = Array.isArray(h.completedDates) ? h.completedDates : [];
        const isCompleted = dates.includes(dateStr);
        let newDates = [];
        if (isCompleted) {
          newDates = dates.filter(d => d !== dateStr);
        } else {
          newDates = [...dates, dateStr];
        }

        // Recalculate streak backwards from today
        let tempStreak = 0;
        let checkDate = new Date();
        while (true) {
          const checkDateStr = checkDate.toISOString().split('T')[0];
          if (newDates.includes(checkDateStr)) {
            tempStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
        
        addAuditLog(
          "Habit Calendar Interaction",
          `Toggled habit "${h.name}" completion for date: ${dateStr}. Calculated streak: ${tempStreak} days.`
        );

        return { ...h, completedDates: newDates, streak: tempStreak };
      }
      return h;
    }));
  };

  // Dynamic monthly grid builder
  const getCalendarDays = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11
    
    const firstDay = new Date(year, month, 1);
    const startDayOfWeek = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
    
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    
    const days = [];
    // Weekday start offset padding
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    // Days array
    for (let day = 1; day <= totalDays; day++) {
      const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({ day, dateStr: dStr });
    }
    return days;
  };

  const calendarDays = getCalendarDays();
  const activeHabit = habits.find(h => h.id === selectedHabitId) || habits[0];

  // Water percentage calculation
  const waterGoal = 2000;
  const waterPct = Math.min(100, Math.round((todayHealth.waterMl / waterGoal) * 100));

  return (
    <div className="health-container fade-in">
      <h2 className="page-title">{t('health')}</h2>

      {/* Navigation Pills */}
      <div className="finance-nav-tabs">
        <button 
          onClick={() => setActiveSection('habits')} 
          className={`finance-tab-pill ${activeSection === 'habits' ? 'active' : ''}`}
        >
          Habits
        </button>
        <button 
          onClick={() => setActiveSection('sleep')} 
          className={`finance-tab-pill ${activeSection === 'sleep' ? 'active' : ''}`}
        >
          Sleep & Steps
        </button>
        <button 
          onClick={() => setActiveSection('water')} 
          className={`finance-tab-pill ${activeSection === 'water' ? 'active' : ''}`}
        >
          Water
        </button>
        <button 
          onClick={() => setActiveSection('nutrition')} 
          className={`finance-tab-pill ${activeSection === 'nutrition' ? 'active' : ''}`}
        >
          Nutrition
        </button>
      </div>

      {/* HABITS CHECKLIST & CALENDAR STREAKS */}
      {activeSection === 'habits' && (
        <div className="health-section-wrapper">
          <div className="section-header-flex">
            <h3 className="section-title">Habit Board</h3>
            <button onClick={() => setShowAddHabit(true)} className="add-btn-small">
              <Plus size={14} /> Custom Habit
            </button>
          </div>

          {/* Add Habit Modal */}
          {showAddHabit && (
            <div className="modal-overlay">
              <div className="modal-card">
                <h3>Add New Habit</h3>
                <form onSubmit={handleAddHabit}>
                  <div className="form-group">
                    <label>Habit Name</label>
                    <input 
                      type="text" 
                      value={newHabitName} 
                      onChange={(e) => setNewHabitName(e.target.value)} 
                      placeholder="e.g. Meditate 10 Mins" 
                      className="form-input" 
                      required 
                    />
                  </div>
                  <div className="modal-actions">
                    <button type="button" onClick={() => setShowAddHabit(false)} className="modal-cancel-btn">Cancel</button>
                    <button type="submit" className="modal-save-btn">Create</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* LIST OF HABITS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {habits.map((habit) => {
              const isCompleted = habit.completedDates.includes(todayStr);
              const isSelected = selectedHabitId === habit.id;
              return (
                <div 
                  key={habit.id} 
                  onClick={() => setSelectedHabitId(habit.id)}
                  className={`habit-card-full ${isCompleted ? 'completed' : ''} ${isSelected ? 'selected' : ''}`}
                  style={{
                    cursor: 'pointer',
                    border: isSelected ? '1.5px solid #8B5CF6' : '1px solid #1F293D',
                    backgroundColor: isSelected ? 'rgba(139,92,246,0.06)' : 'rgba(15,23,42,0.3)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div className="habit-card-meta" style={{ flex: 1, pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="habit-card-name" style={{ fontWeight: isSelected ? '700' : '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {isCompleted && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" className="pop-celebration-trophy" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6V9zm12 0h1.5a2.5 2.5 0 0 0 0-5H18V9zM12 2a7 7 0 0 1 7 7c0 4-3 7-7 7s-7-3-7-7a7 7 0 0 1 7-7zm0 14a3 3 0 0 0-3 3v2h6v-2a3 3 0 0 0-3-3z"/>
                          </svg>
                        )}
                        {habit.name}
                      </span>
                      <div className="streak-badge">
                        <Flame size={14} className="streak-fire" />
                        <span>{habit.streak} day streak</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Stop parent click selection
                      toggleHabitCompletion(habit.id);
                    }}
                    className={`habit-check-trigger ${isCompleted ? 'checked checkbox-bounce-active' : ''}`}
                    style={{ zIndex: 5 }}
                  >
                    {isCompleted ? <Check size={18} /> : 'Complete'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* VISUAL habit STREAK CALENDAR GRID FOR SELECTED HABIT */}
          {activeHabit && (
            <div className="settings-card fade-in" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ margin: '0', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CalIcon size={14} className="col-purple" /> Streak Calendar: {activeHabit.name}
                </h4>
                <span className="welcome-tag" style={{ fontSize: '10px', fontWeight: '700' }}>
                  {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <p style={{ margin: '0 0 12px 0', fontSize: '10.5px', color: '#94A3B8', lineHeight: '1.3' }}>
                Click past dates to retroactively log completions and recalculate streaks.
              </p>

              {/* Weekly Headers */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
                textAlign: 'center', fontSize: '9px', fontWeight: '700',
                color: '#64748B', textTransform: 'uppercase', marginBottom: '6px'
              }}>
                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
              </div>

              {/* Monthly Grid */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '4px', textAlign: 'center'
              }}>
                {calendarDays.map((cell, idx) => {
                  if (!cell) {
                    return <div key={`empty-${idx}`} style={{ height: '30px' }}></div>;
                  }

                  const { day, dateStr } = cell;
                  const isCompleted = activeHabit.completedDates.includes(dateStr);
                  const isToday = dateStr === todayStr;

                  return (
                    <button
                      key={dateStr}
                      onClick={() => toggleRetroactiveHabitDate(activeHabit.id, dateStr)}
                      style={{
                        height: '30px', display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', alignItems: 'center',
                        borderRadius: '8px', border: 'none',
                        backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.2)' : isToday ? 'rgba(255,255,255,0.06)' : 'rgba(15, 23, 42, 0.4)',
                        borderStyle: isToday ? 'solid' : 'none',
                        borderWidth: '1.5px', borderColor: '#8B5CF6',
                        color: isCompleted ? '#34D399' : '#CBD5E1',
                        fontSize: '11px', fontWeight: isCompleted || isToday ? '800' : '500',
                        cursor: 'pointer', transition: 'all 0.15s ease'
                      }}
                    >
                      {day}
                      {isCompleted && (
                        <div style={{ width: '4px', height: '4px', backgroundColor: '#10B981', borderRadius: '50%', marginTop: '1px' }}></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* SLEEP AND STEPS LOGGER */}
      {activeSection === 'sleep' && (
        <div className="health-section-wrapper">
          {isWearableLinked && (
            <div className="health-metric-card fade-in" style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(127, 29, 29, 0.4))',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              padding: '14px'
            }}>
              <div className="card-header-icon-lbl">
                <Activity size={20} className="col-rose" style={{ animation: 'pulse 2s infinite' }} />
                <span>Live Wearable Signals</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <div>
                  <span style={{ fontSize: '24px', fontWeight: '800', color: '#FFF' }}>72 BPM</span>
                  <span style={{ fontSize: '11px', display: 'block', color: '#FDA4AF' }}>Resting Heart Rate</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '24px', fontWeight: '800', color: '#FFF' }}>88%</span>
                  <span style={{ fontSize: '11px', display: 'block', color: '#FDA4AF' }}>Sleep Efficiency</span>
                </div>
              </div>
              <p className="health-card-advice" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '8px', marginTop: '10px', marginBottom: '0' }}>
                Garmin index: HRV status normal. Sleep restoration cycle is optimal for daily cognitive tasks.
              </p>
            </div>
          )}
          <div className="health-metric-card">
            <div className="card-header-icon-lbl">
              <Moon size={20} className="col-purple" />
              <span>Sleep Quality</span>
            </div>
            
            <div className="sleep-slider-wrapper">
              <span className="sleep-hours-val">{todayHealth.sleepHours || 7.0}h</span>
              <span className="sleep-hours-sub">Logged for last night</span>
              
              <input 
                type="range" 
                min="4.0" 
                max="12.0" 
                step="0.1"
                value={todayHealth.sleepHours || 7.0}
                onChange={(e) => handleSleepChange(e.target.value)}
                className="slider-input slider-sleep"
              />
              <div className="slider-ticks">
                <span>4h</span>
                <span>8h (Target)</span>
                <span>12h</span>
              </div>
            </div>

            <p className="health-card-advice">
              {todayHealth.sleepHours < 6.5 
                ? "Low sleep increases stress response indicators. We've adjusted today's AI advice card to prioritize calm." 
                : "Great sleep duration! This supports stable cognitive function and metabolic energy."}
            </p>
          </div>

          <div className="health-metric-card">
            <div className="card-header-icon-lbl">
              <Activity size={20} className="col-emerald" />
              <span>Daily Step Goal</span>
            </div>

            <div className="sleep-slider-wrapper">
              <span className="sleep-hours-val">{todayHealth.steps || 0}</span>
              <span className="sleep-hours-sub">Steps completed today</span>

              <input 
                type="range" 
                min="0" 
                max="15000" 
                step="500"
                value={todayHealth.steps || 0}
                onChange={(e) => handleStepsChange(e.target.value)}
                className="slider-input slider-steps"
              />
              <div className="slider-ticks">
                <span>0</span>
                <span>10,000 (Target)</span>
                <span>15,000</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WATER TRACKER */}
      {activeSection === 'water' && (
        <div className="health-section-wrapper">
          <div className="water-tracker-card">
            <div className="card-header-icon-lbl">
              <Droplet size={20} className="col-blue" />
              <span>Hydration Goal</span>
            </div>

            <div className="water-status-gauge">
              <div className="glass-container">
                <div className="glass-water-level" style={{ height: `${waterPct}%` }}>
                  {waterPct > 15 && <span className="water-pct-lbl">{waterPct}%</span>}
                </div>
              </div>
              
              <div className="water-stats-lbl">
                <span className="water-current">{todayHealth.waterMl} ml</span>
                <span className="water-goal">Target: {waterGoal} ml</span>
              </div>
            </div>

            <div className="water-entry-actions">
              <button onClick={() => addWater(250)} className="water-add-btn">
                +250ml (Cup)
              </button>
              <button onClick={() => addWater(500)} className="water-add-btn">
                +500ml (Bottle)
              </button>
              <button onClick={resetWater} className="water-reset-btn" aria-label="Reset water intake">
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NUTRITION & EXERCISE */}
      {activeSection === 'nutrition' && (() => {
        // Calculate dynamic baseline target values
        const todaySteps = todayHealth.steps || 0;
        const todayWorkoutMin = workouts.filter(w => w.date === todayStr).reduce((sum, w) => sum + w.duration, 0);
        const targetCals = 2000 + Math.round(todaySteps * 0.04) + (todayWorkoutMin * 8);
        const targetProtein = 60 + Math.round(todayWorkoutMin * 0.5);

        // Analyze logs for recipe matching
        const recentMood = moodLogs && moodLogs.length > 0 ? moodLogs[0] : null;
        const recentStress = recentMood ? recentMood.stressScore : 4;
        const recentSleep = todayHealth.sleepHours || 7.0;

        // Recipe selection
        let recommendedRecipe = {
          name: "Mediterranean Chickpea & Green Salad",
          type: "Lunch/Dinner",
          calories: 450,
          protein: 15,
          carbs: 45,
          fat: 18,
          ingredients: ["Chickpeas", "Cucumber", "Cherry Tomatoes", "Olive Oil", "Feta Cheese", "Spinach"],
          benefit: "Rich in fiber and micronutrients, supporting stable metabolism and heart health."
        };

        if (recentStress > 6) {
          recommendedRecipe = {
            name: "Magnesium-Rich Salmon & Avocado Bowl",
            type: "Dinner",
            calories: 580,
            protein: 38,
            carbs: 25,
            fat: 32,
            ingredients: ["Salmon Fillet", "Avocado", "Brown Rice", "Baby Spinach", "Sesame Seeds"],
            benefit: "Omega-3 and Magnesium lower cortisol spikes and reduce cardiovascular stress signals."
          };
        } else if (recentSleep < 6.2) {
          recommendedRecipe = {
            name: "Restorative Walnut Oatmeal & Warm Berries",
            type: "Breakfast",
            calories: 390,
            protein: 12,
            carbs: 58,
            fat: 14,
            ingredients: ["Rolled Oats", "Walnuts", "Mixed Berries", "Almond Milk", "Chia Seeds"],
            benefit: "Complex carbohydrates and melatonin-boosting walnuts facilitate restorative sleep cycles."
          };
        } else if (todaySteps > 8000 || todayWorkoutMin >= 30) {
          recommendedRecipe = {
            name: "Protein-Dense Quinoa Chicken Bowl",
            type: "Lunch",
            calories: 620,
            protein: 45,
            carbs: 60,
            fat: 16,
            ingredients: ["Grilled Chicken", "Quinoa", "Broccoli", "Olive Oil", "Hummus"],
            benefit: "High amino acid content triggers muscle synthesis and glycogen replenishment."
          };
        }

        const handleAddIngredientsToGrocery = () => {
          recommendedRecipe.ingredients.forEach(item => {
            addGroceryItem(item);
          });
          addNotification(
            "Groceries Synced",
            `Ingredients for "${recommendedRecipe.name}" added to your Grocery List.`,
            "health"
          );
          addAuditLog("Grocery Auto-Cart Sync", `Added ingredients: ${recommendedRecipe.ingredients.join(', ')}`);
        };

        const handleLogRecipeMeal = () => {
          logMeal(recommendedRecipe.name, recommendedRecipe.type, recommendedRecipe.calories);
        };

        return (
          <div className="health-section-wrapper fade-in">
            {/* AI NUTRITIONAL OPTIMISER */}
            <div className="settings-card recipe-card-gradient" style={{ textAlign: 'left', padding: '16px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="welcome-tag" style={{ color: '#FBBF24', fontWeight: '800', textTransform: 'uppercase', fontSize: '9px' }}>
                  AI Nutritional Optimizer • Live Targets
                </span>
                <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '700' }}>
                  Based on activity &amp; stress
                </span>
              </div>

              {/* Dynamic Target Metrics Row */}
              <div className="nutrition-target-row" style={{ display: 'flex', gap: '14px', marginTop: '12px', marginBottom: '14px' }}>
                <div style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.4)', borderRadius: '12px', padding: '8px 10px', border: '1px solid rgba(255,255,255,0.03)' }}>
                  <span style={{ fontSize: '9px', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>Today's Target</span>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: '#FFF' }}>{targetCals} kcal</span>
                </div>
                <div style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.4)', borderRadius: '12px', padding: '8px 10px', border: '1px solid rgba(255,255,255,0.03)' }}>
                  <span style={{ fontSize: '9px', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>Protein Goal</span>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: '#34D399' }}>{targetProtein}g</span>
                </div>
              </div>

              {/* Suggestion content */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: '800' }}>🥗 AI Recommended: {recommendedRecipe.name}</h4>
                  <span style={{
                    fontSize: '8.5px', fontWeight: '800', padding: '2px 6px', borderRadius: '8px',
                    backgroundColor: 'rgba(139,92,246,0.15)', color: '#C084FC', border: '1px solid rgba(139,92,246,0.3)'
                  }}>
                    {recommendedRecipe.type}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#94A3B8', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                  {recommendedRecipe.benefit}
                </p>

                {/* Macro Badges Row */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '10px', color: '#FFF', backgroundColor: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '6px' }}>
                    🔥 {recommendedRecipe.calories} kcal
                  </span>
                  <span style={{ fontSize: '10px', color: '#34D399', backgroundColor: 'rgba(52,211,153,0.05)', padding: '2px 8px', borderRadius: '6px' }}>
                    💪 {recommendedRecipe.protein}g Protein
                  </span>
                  <span style={{ fontSize: '10px', color: '#60A5FA', backgroundColor: 'rgba(96,165,250,0.05)', padding: '2px 8px', borderRadius: '6px' }}>
                    🍞 {recommendedRecipe.carbs}g Carbs
                  </span>
                </div>

                {/* Ingredients tag listing */}
                <div style={{ marginBottom: '14px' }}>
                  <span style={{ fontSize: '9px', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Required Ingredients
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {recommendedRecipe.ingredients.map((ing, i) => (
                      <span key={i} style={{ fontSize: '9.5px', color: '#CBD5E1', backgroundColor: 'rgba(15,23,42,0.3)', padding: '2px 6px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)' }}>
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleAddIngredientsToGrocery}
                    className="water-add-btn"
                    style={{ flex: 1.2, margin: 0, fontSize: '11.5px', padding: '10px 0' }}
                  >
                    🛒 Add Ingredients to Grocery List
                  </button>
                  <button
                    onClick={handleLogRecipeMeal}
                    className="add-task-btn"
                    style={{ flex: 0.8, margin: 0, fontSize: '11.5px', padding: '10px 0', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFF' }}
                  >
                    🍳 Log to Daily Meals
                  </button>
                </div>

              </div>
            </div>

            {/* Meal Planner */}
            <div className="health-metric-card">
              <div className="section-header-flex">
                <h3 className="section-title">Today's Meals</h3>
              <span className="welcome-tag" style={{ fontSize: '11px', fontWeight: 'bold', color: '#10B981' }}>
                Calories: {meals.filter(m => m.date === todayStr).reduce((sum, m) => sum + m.calories, 0)} kcal
              </span>
            </div>

            <span className="welcome-tag" style={{ fontSize: '10px', display: 'block', marginBottom: '4px', textAlign: 'left' }}>Log Healthy Presets</span>
            <div className="meals-selection-grid">
              {[
                { id: 'p1', name: 'Avocado Toast', type: 'Breakfast', calories: 340 },
                { id: 'p2', name: 'Oatmeal & Fruit', type: 'Breakfast', calories: 380 },
                { id: 'p3', name: 'Chicken Bowl', type: 'Lunch', calories: 550 },
                { id: 'p4', name: 'Salmon Salad', type: 'Dinner', calories: 480 }
              ].map(preset => (
                <div 
                  key={preset.id} 
                  onClick={() => logMeal(preset.name, preset.type, preset.calories)}
                  className="meal-choice-card"
                >
                  <span className="meal-choice-name">{preset.name}</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="meal-choice-cals">{preset.calories} kcal</span>
                    <span className="meal-tag-chip">{preset.type}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Logged Meals List */}
            <div className="logged-meals-list">
              {meals.filter(m => m.date === todayStr).map(m => (
                <div key={m.id} className="meal-log-item">
                  <div className="meal-log-meta" style={{ textAlign: 'left' }}>
                    <span className="meal-log-title">{m.name}</span>
                    <span className="meal-log-sub">{m.type}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="meal-log-cals">{m.calories} kcal</span>
                    <button 
                      onClick={() => deleteMeal(m.id)} 
                      className="delete-row-btn"
                      aria-label="Delete meal log"
                      style={{ fontSize: '14px', fontWeight: 'bold' }}
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exercise Logger */}
          <div className="health-metric-card">
            <h3>Active Exercise Logger</h3>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!workoutName.trim()) return;
                logWorkout(workoutName, workoutType, workoutDuration);
                setWorkoutName('');
              }} 
              className="add-task-form"
            >
              <input 
                type="text" 
                value={workoutName}
                onChange={e => setWorkoutName(e.target.value)}
                placeholder="e.g. Evening Gym Run" 
                className="form-input text-sm"
                required
              />
              <div className="exercise-select-row">
                <select 
                  value={workoutType}
                  onChange={e => setWorkoutType(e.target.value)}
                  className="priority-selector-input"
                >
                  <option value="Cardio">Cardio</option>
                  <option value="Strength">Strength</option>
                  <option value="Flexibility">Flexibility</option>
                </select>
                <button type="submit" className="add-task-btn">
                  Log Workout
                </button>
              </div>

              <div className="slider-group" style={{ marginTop: '8px' }}>
                <div className="slider-label-row">
                  <span>Exercise Duration</span>
                  <span className="bold">{workoutDuration} mins</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="90" 
                  step="5"
                  value={workoutDuration}
                  onChange={e => setWorkoutDuration(parseInt(e.target.value))}
                  className="slider-input slider-sleep"
                />
              </div>
            </form>

            <div className="logged-meals-list" style={{ maxHeight: '120px' }}>
              {workouts.filter(w => w.date === todayStr).map(w => (
                <div key={w.id} className="meal-log-item">
                  <div className="meal-log-meta" style={{ textAlign: 'left' }}>
                    <span className="meal-log-title">{w.name}</span>
                    <span className="meal-log-sub">{w.type}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="meal-log-cals" style={{ color: '#A78BFA' }}>{w.duration} mins</span>
                    <button 
                      onClick={() => deleteWorkout(w.id)} 
                      className="delete-row-btn"
                      aria-label="Delete workout log"
                      style={{ fontSize: '14px', fontWeight: 'bold' }}
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    })()}
    </div>
  );
};

export default Health;
