import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Frown, 
  Target, 
  MessageCircle, 
  Bell, 
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

const Onboarding = () => {
  const { profile, setProfile } = useApp();
  const [step, setStep] = useState(1);
  const [tempProfile, setTempProfile] = useState({
    firstName: profile.firstName || '',
    stressTrigger: 'Work & Career',
    primaryGoal: 'Save Money',
    coachingStyle: 'Gentle',
    notificationIntensity: 'Balanced'
  });

  const stressOptions = [
    { label: 'Rising Cost of Living', value: 'Cost of Living' },
    { label: 'Work Stress & Burnout', value: 'Work & Career' },
    { label: 'Lack of Personal Time', value: 'Time Management' },
    { label: 'Poor Health / Sleep Habits', value: 'Health Habits' },
    { label: 'Social Loneliness', value: 'Social Isolation' }
  ];

  const goalOptions = [
    { label: 'Reduce Financial Stress', value: 'Save Money' },
    { label: 'Improve Sleep & Energy', value: 'Better Sleep' },
    { label: 'Lower Daily Anxiety', value: 'Manage Stress' },
    { label: 'Build Healthy Habits', value: 'Build Habits' },
    { label: 'Explore Hobbies & Hikes', value: 'Social Connection' }
  ];

  const styleOptions = [
    { 
      label: 'Gentle Coach', 
      value: 'Gentle', 
      desc: 'Empathetic, positive, praises tiny steps, no pressure.' 
    },
    { 
      label: 'Direct Coach', 
      value: 'Direct', 
      desc: 'Honest, high-efficiency, calls out habits directly.' 
    },
    { 
      label: 'Data-driven Coach', 
      value: 'Data-driven', 
      desc: 'Correlations, statistics, numbers, and logical suggestions.' 
    },
    { 
      label: 'Friendly Companion', 
      value: 'Friendly', 
      desc: 'Casual chat, checks on your weekends, asks questions.' 
    }
  ];

  const intensityOptions = [
    { label: 'Quiet Mode', value: 'Quiet', desc: 'No daily prompts. Open only when you decide.' },
    { label: 'Essential Only', value: 'Essential', desc: 'Bill alerts and critical health drop warnings.' },
    { label: 'Balanced', value: 'Balanced', desc: 'A morning check-in and evening reflection summary.' },
    { label: 'Proactive Coach', value: 'Proactive', desc: 'Actionable suggestions spaced throughout the day.' }
  ];

  const nextStep = () => {
    if (step === 1 && !tempProfile.firstName.trim()) return;
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const completeOnboarding = () => {
    setProfile({
      ...profile,
      firstName: tempProfile.firstName,
      coachingStyle: tempProfile.coachingStyle,
      notificationIntensity: tempProfile.notificationIntensity,
      onboardingCompleted: true,
      stressTrigger: tempProfile.stressTrigger,
      primaryGoal: tempProfile.primaryGoal
    });
  };

  return (
    <div className="onboarding-container">
      {/* ProgressBar */}
      <div className="onboarding-progress">
        <div 
          className="onboarding-progress-bar" 
          style={{ width: `${(step / 6) * 100}%` }}
        ></div>
      </div>

      <div className="onboarding-card-wrapper">
        {step === 1 && (
          <div className="onboarding-step fade-in">
            <div className="icon-badge">
              <User size={32} />
            </div>
            <h2>Let's start with your name</h2>
            <p className="subtitle">LifeMate AI personalizes your metrics and coaching style around your daily rhythm.</p>
            
            <div className="input-group">
              <input
                type="text"
                value={tempProfile.firstName}
                onChange={(e) => setTempProfile({ ...tempProfile, firstName: e.target.value })}
                placeholder="Enter your first name"
                className="onboarding-input"
                maxLength={20}
                required
              />
            </div>
            
            <button 
              disabled={!tempProfile.firstName.trim()}
              onClick={nextStep} 
              className="onboarding-btn next-btn"
            >
              Continue <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-step fade-in">
            <div className="icon-badge">
              <Frown size={32} />
            </div>
            <h2>What causes you the most stress right now?</h2>
            <p className="subtitle">We use this to customize your life dashboard priority indicators.</p>
            
            <div className="options-grid">
              {stressOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTempProfile({ ...tempProfile, stressTrigger: opt.value })}
                  className={`option-card ${tempProfile.stressTrigger === opt.value ? 'selected' : ''}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            
            <div className="onboarding-nav-btns">
              <button onClick={prevStep} className="onboarding-btn back-btn">
                <ArrowLeft size={18} /> Back
              </button>
              <button onClick={nextStep} className="onboarding-btn next-btn">
                Continue <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="onboarding-step fade-in">
            <div className="icon-badge">
              <Target size={32} />
            </div>
            <h2>What is your primary goal?</h2>
            <p className="subtitle">We will assemble a personalized 7-Day Starter Plan for this.</p>
            
            <div className="options-grid">
              {goalOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTempProfile({ ...tempProfile, primaryGoal: opt.value })}
                  className={`option-card ${tempProfile.primaryGoal === opt.value ? 'selected' : ''}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            
            <div className="onboarding-nav-btns">
              <button onClick={prevStep} className="onboarding-btn back-btn">
                <ArrowLeft size={18} /> Back
              </button>
              <button onClick={nextStep} className="onboarding-btn next-btn">
                Continue <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="onboarding-step fade-in">
            <div className="icon-badge">
              <MessageCircle size={32} />
            </div>
            <h2>Choose your AI Coaching Tone</h2>
            <p className="subtitle">Select the style of interaction that keeps you motivated.</p>
            
            <div className="options-list">
              {styleOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTempProfile({ ...tempProfile, coachingStyle: opt.value })}
                  className={`list-card ${tempProfile.coachingStyle === opt.value ? 'selected' : ''}`}
                >
                  <div className="list-card-content">
                    <span className="card-title">{opt.label}</span>
                    <span className="card-desc">{opt.desc}</span>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="onboarding-nav-btns">
              <button onClick={prevStep} className="onboarding-btn back-btn">
                <ArrowLeft size={18} /> Back
              </button>
              <button onClick={nextStep} className="onboarding-btn next-btn">
                Continue <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="onboarding-step fade-in">
            <div className="icon-badge">
              <Bell size={32} />
            </div>
            <h2>Notification Frequency</h2>
            <p className="subtitle">Control how often LifeMate updates you. Avoid dashboard overload.</p>
            
            <div className="options-list">
              {intensityOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTempProfile({ ...tempProfile, notificationIntensity: opt.value })}
                  className={`list-card ${tempProfile.notificationIntensity === opt.value ? 'selected' : ''}`}
                >
                  <div className="list-card-content">
                    <span className="card-title">{opt.label}</span>
                    <span className="card-desc">{opt.desc}</span>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="onboarding-nav-btns">
              <button onClick={prevStep} className="onboarding-btn back-btn">
                <ArrowLeft size={18} /> Back
              </button>
              <button onClick={nextStep} className="onboarding-btn next-btn">
                Assemble Plan <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="onboarding-step plan-step fade-in">
            <div className="icon-badge success-badge">
              <CheckCircle size={32} />
            </div>
            <h2>Your 7-Day Starter Plan</h2>
            <p className="subtitle">We've built this simple structure to target <strong>{tempProfile.primaryGoal}</strong> without overwhelming you.</p>
            
            <div className="plan-scrollbox">
              <div className="plan-day">
                <span className="day-tag">Day 1</span>
                <p>Track today's spending & do a 2-minute stress check-in.</p>
              </div>
              <div className="plan-day">
                <span className="day-tag">Day 2</span>
                <p>Add a savings goal & take a 10-minute active outdoor walk.</p>
              </div>
              <div className="plan-day">
                <span className="day-tag">Day 3</span>
                <p>Review current active subscriptions & drink 2L of water.</p>
              </div>
              <div className="plan-day">
                <span className="day-tag">Day 4</span>
                <p>Set a bill reminder & try a 3-minute deep breathing break.</p>
              </div>
              <div className="plan-day">
                <span className="day-tag">Day 5</span>
                <p>Identify your biggest monthly spend category & sleep 30m early.</p>
              </div>
              <div className="plan-day">
                <span className="day-tag">Day 6</span>
                <p>Schedule a hobby block and note a win on the wellbeing board.</p>
              </div>
              <div className="plan-day">
                <span className="day-tag">Day 7</span>
                <p>Reflect on weekly Life Score progress & celebrate small victories.</p>
              </div>
            </div>
            
            <button onClick={completeOnboarding} className="onboarding-btn start-app-btn">
              Get Started with LifeMate AI
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
