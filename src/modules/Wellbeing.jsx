import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Smile, 
  Wind, 
  BookOpen, 
  Calendar,
  Frown,
  Activity,
  Plus,
  Play,
  Pause,
  SkipForward,
  Volume2,
  ShieldAlert,
  PhoneCall,
  Info
} from 'lucide-react';

const MEDITATION_TRACKS = [
  { id: 'mt1', title: 'Morning Focus', duration: 180, description: 'Stabilize attention and energize cognitive pathways for focus.', tags: ['Productivity', '3 Min'] },
  { id: 'mt2', title: 'Work Burnout Release', duration: 300, description: 'Decompress neural stress load and release muscular fatigue.', tags: ['De-stress', '5 Min'] },
  { id: 'mt3', title: 'Deep Sleep Therapy', duration: 600, description: 'Binaural-guided delta wave frequencies to trigger sleep transition.', tags: ['Restoration', '10 Min'] }
];

const Wellbeing = () => {
  const { 
    moodLogs, 
    addMoodLog, 
    getTodayString,
    wheelScores,
    updateWheelScore,
    setActiveTab,
    addAuditLog,
    addNotification,
    t,
    activeConnectedFixes,
    reframeHistory,
    addReframeSession,
    transactions,
    healthLogs,
    profile,
    communityContributions,
    setCommunityContributions
  } = useApp();
  
  const [activeSection, setActiveSection] = useState('mood'); // mood, breathe, meditate, balance, correlations, community
  
  // Log Mood Form states
  const [moodVal, setMoodVal] = useState(7);
  const [stressVal, setStressVal] = useState(4);
  const [energyVal, setEnergyVal] = useState(7);
  const [notesVal, setNotesVal] = useState('');
  const [showLogSuccess, setShowLogSuccess] = useState(false);

  // Breathing Coach states
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Ready'); // Ready, Inhale, Hold, Exhale
  const [breathTimer, setBreathTimer] = useState(4);

  // Guided Meditations states
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0); // 0 to 100%
  const [playSeconds, setPlaySeconds] = useState(0);

  // Self-Care Crisis Help states
  const [showCrisisCenter, setShowCrisisCenter] = useState(false);
  const [crisisCountry, setCrisisCountry] = useState('US');
  const [showDecompressionModal, setShowDecompressionModal] = useState(false);

  // Cognitive Reframing Lounge states
  const [stressorInput, setStressorInput] = useState('');
  const [reframeCategory, setReframeCategory] = useState('general');
  const [isReframing, setIsReframing] = useState(false);

  // Community states
  const [newPost, setNewPost] = useState('');
  const [showPostSuccess, setShowPostSuccess] = useState(false);

  // Breathing Cycle loop
  useEffect(() => {
    let interval = null;
    if (isBreathing) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            setBreathPhase((currentPhase) => {
              switch (currentPhase) {
                case 'Ready':
                case 'Exhale':
                  return 'Inhale';
                case 'Inhale':
                  return 'Hold';
                case 'Hold':
                  return 'Exhale';
                default:
                  return 'Inhale';
              }
            });
            return 4; 
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathPhase('Ready');
      setBreathTimer(4);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isBreathing]);

  // Meditations Timer loop
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      const track = MEDITATION_TRACKS[currentTrackIdx];
      interval = setInterval(() => {
        setPlaySeconds(prev => {
          if (prev >= track.duration) {
            setIsPlaying(false);
            setPlayProgress(100);
            
            // Trigger completion alert
            addNotification(
              "Meditation Completed",
              `Splendid! You completed the "${track.title}" session. (+2 Wellbeing points).`,
              "health"
            );
            addAuditLog("Meditation Completed", `Completed session: ${track.title}`);
            return track.duration;
          }
          const nextSecs = prev + 1;
          setPlayProgress((nextSecs / track.duration) * 100);
          return nextSecs;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrackIdx]);

  const handleMoodSubmit = (e) => {
    e.preventDefault();
    addMoodLog(moodVal, stressVal, energyVal, notesVal);
    setNotesVal('');
    setShowLogSuccess(true);
    setTimeout(() => setShowLogSuccess(false), 3000);
    if ((activeConnectedFixes || []).includes('decompression_trigger') && parseInt(stressVal) > 7) {
      setTimeout(() => { setShowDecompressionModal(true); }, 500);
    }
  };

  const handlePlayToggle = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    const track = MEDITATION_TRACKS[currentTrackIdx];
    addAuditLog("Meditation Audio Streamed", `Audio playback for "${track.title}" set to: ${nextState ? 'PLAYING' : 'PAUSED'}`);
  };

  const handleTrackSkip = () => {
    setIsPlaying(false);
    setPlayProgress(0);
    setPlaySeconds(0);
    const nextIdx = (currentTrackIdx + 1) % MEDITATION_TRACKS.length;
    setCurrentTrackIdx(nextIdx);
    addAuditLog("Meditation Track Changed", `Selected next guided audio track: ${MEDITATION_TRACKS[nextIdx].title}`);
  };

  const getMoodEmoji = (val) => {
    if (val >= 8) return '😊';
    if (val >= 6) return '🙂';
    if (val >= 4) return '😐';
    return '😞';
  };

  const formatAudioTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const generateCognitiveReframeLocal = (stressor, category) => {
    if (!stressor.trim()) return;
    setIsReframing(true);
    const style = profile.coachingStyle || 'Gentle';
    
    // Simulate thinking delay of 1.2 seconds for high-fidelity AI feel
    setTimeout(() => {
      let reframe = "";
      if (category === 'finance') {
        if (style === 'Direct') {
          reframe = "Direct Reframing: Financial friction is a metric, not a failure of character. Stop passive spending. You skipped shopping today to protect your cash. Review the numbers and move forward.";
        } else if (style === 'Data-driven') {
          reframe = "Data-driven Reframing: Math shows compound impacts. A $15 coffee savings offsets dining overflow. Your active Save mode caps shopping by 25%, restoring stability within 4.3 days.";
        } else {
          reframe = "Gentle Reframing: Take a breath. Money anxiety is incredibly common. You are actively planning and building security. Today, your coffee/lunch savings are protective steps.";
        }
      } else if (category === 'health' || category === 'sleep') {
        if (style === 'Direct') {
          reframe = "Direct Reframing: Sleep is non-negotiable biology. You cannot execute priority tasks on a sleep deficit. Target 10 PM wind-down today. Disconnect now.";
        } else if (style === 'Data-driven') {
          reframe = "Data-driven Reframing: Research proves 6.5h sleep increases stress triggers by 35%. Extending sleep to 8h improves cognitive clarity. Schedule a 3-minute Breathing Break now.";
        } else {
          reframe = "Gentle Reframing: Rest is a form of self-compassion, not something you must earn. Let go of today's checklist and allow your body the peaceful restoration it deserves.";
        }
      } else if (category === 'career') {
        if (style === 'Direct') {
          reframe = "Direct Reframing: You are overloaded because you say yes too much. Break down the project. Start with the easiest 15-minute task. Block out distractions.";
        } else if (style === 'Data-driven') {
          reframe = "Data-driven Reframing: Focus bursts are most productive. Work in 25-minute Pomodoro cycles. Taking brief breathing breaks reduces burnout likelihood by 40%.";
        } else {
          reframe = "Gentle Reframing: You are doing the best you can with the energy you have. Separate your identity from your output. You are worthy of calm transitions.";
        }
      } else if (category === 'social') {
        if (style === 'Direct') {
          reframe = "Direct Reframing: Isolation breeds overthinking. Send a positive motivation cheer to Sarah today. Take the lead in reconnecting instead of waiting.";
        } else if (style === 'Data-driven') {
          reframe = "Data-driven Reframing: Studies prove 10 minutes of social connection boosts wellbeing score by 15%. Reciprocal cheers lower cortisol parameters.";
        } else {
          reframe = "Gentle Reframing: It is okay to feel disconnected sometimes. Take a small, gentle step: send a motivational cheer to Dave, or call a loved one for a quiet chat.";
        }
      } else {
        if (style === 'Direct') {
          reframe = "Direct Reframing: Anxiety is future-oriented noise. You cannot control tomorrow. Focus on the single action you can execute right now.";
        } else if (style === 'Data-driven') {
          reframe = "Data-driven Reframing: Heart rate data shows stress levels drop by 22% within 2 minutes of box breathing. Run the breathing coach now.";
        } else {
          reframe = "Gentle Reframing: Let go of the need to have it all figured out. Breathe in calm, breathe out tension. You are safe in this present moment.";
        }
      }

      addReframeSession(stressor, category, reframe);
      setStressorInput('');
      setIsReframing(false);
    }, 1200);
  };

  return (
    <div className="wellbeing-container fade-in">
      <h2 className="page-title">{t('wellbeing')}</h2>

      {/* Segment tabs */}
      <div className="finance-nav-tabs">
        <button 
          onClick={() => setActiveSection('mood')} 
          className={`finance-tab-pill ${activeSection === 'mood' ? 'active' : ''}`}
        >
          Check-In
        </button>
        <button 
          onClick={() => setActiveSection('breathe')} 
          className={`finance-tab-pill ${activeSection === 'breathe' ? 'active' : ''}`}
        >
          Breathing
        </button>
        <button 
          onClick={() => setActiveSection('meditate')} 
          className={`finance-tab-pill ${activeSection === 'meditate' ? 'active' : ''}`}
        >
          Meditate
        </button>
        <button 
          onClick={() => setActiveSection('balance')} 
          className={`finance-tab-pill ${activeSection === 'balance' ? 'active' : ''}`}
        >
          Balance
        </button>
        <button 
          onClick={() => setActiveSection('correlations')} 
          className={`finance-tab-pill ${activeSection === 'correlations' ? 'active' : ''}`}
        >
          Correlations
        </button>
        <button 
          onClick={() => setActiveSection('community')} 
          className={`finance-tab-pill ${activeSection === 'community' ? 'active' : ''}`}
        >
          Community
        </button>
      </div>

      {/* MOOD CHECK-IN */}
      {activeSection === 'mood' && (
        <div className="mood-section-wrapper">
          
          {/* CRISIS HELP LAUNCH BUTTON */}
          <button 
            type="button"
            onClick={() => {
              setShowCrisisCenter(true);
              addAuditLog("Crisis Support Center", "Opened Self-Care emergency crisis helpline panel.");
            }}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1.5px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px',
              color: '#F87171',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '12.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginBottom: '10px'
            }}
          >
            <ShieldAlert size={15} />
            <span>🆘 Crisis & Self-Care Center</span>
          </button>

          <form onSubmit={handleMoodSubmit} className="mood-form-card">
            <h3>How are you feeling right now?</h3>
            <p className="mood-emoji-preview">{getMoodEmoji(moodVal)}</p>

            <div className="slider-group">
              <div className="slider-label-row">
                <span>General Mood</span>
                <span className="bold">{moodVal}/10</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={moodVal} 
                onChange={(e) => setMoodVal(e.target.value)} 
                className="slider-input slider-mood"
              />
              <div className="slider-ticks">
                <span>Low</span>
                <span>Neutral</span>
                <span>High</span>
              </div>
            </div>

            <div className="slider-group">
              <div className="slider-label-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Stress Level
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill={stressVal > 7 ? "#EF4444" : stressVal > 4 ? "#EC4899" : "#8B5CF6"} 
                    className="heart-pulse-accent"
                    style={{
                      animationDuration: `${Math.max(0.3, 1.8 - (stressVal * 0.15))}s`
                    }}
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </span>
                <span className="bold col-rose">{stressVal}/10</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={stressVal} 
                onChange={(e) => setStressVal(e.target.value)} 
                className="slider-input slider-stress"
              />
              <div className="slider-ticks">
                <span>Calm</span>
                <span>Mild</span>
                <span>High</span>
              </div>
            </div>

            <div className="slider-group">
              <div className="slider-label-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Physical Energy
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill={energyVal < 4 ? "#F59E0B" : "#3B82F6"}
                    stroke={energyVal < 4 ? "#FBBF24" : "#60A5FA"}
                    strokeWidth="1"
                    className="moon-glow-accent"
                    style={{
                      filter: `drop-shadow(0 0 ${Math.max(4, 12 - energyVal)}px ${energyVal < 4 ? 'rgba(251, 191, 36, 0.8)' : 'rgba(96, 165, 250, 0.5)'})`
                    }}
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </span>
                <span className="bold col-emerald">{energyVal}/10</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={energyVal} 
                onChange={(e) => setEnergyVal(e.target.value)} 
                className="slider-input slider-energy"
              />
              <div className="slider-ticks">
                <span>Tired</span>
                <span>Steady</span>
                <span>Peak</span>
              </div>
            </div>

            <div className="form-group">
              <label>Journal Notes (Optional)</label>
              <textarea
                value={notesVal}
                onChange={(e) => setNotesVal(e.target.value)}
                placeholder="What is influencing your mood or stress today?"
                className="form-textarea"
                rows="2"
              />
            </div>

            <button type="submit" className="onboarding-btn start-app-btn">
              Log Mental State
            </button>

            {showLogSuccess && (
              <div className="success-banner fade-in">
                <span>Logged successfully! Today's Life Score updated.</span>
              </div>
            )}
          </form>

          {/* Historical Logs List */}
          <div className="history-logs-section">
            <h3 className="section-title">Past Check-Ins</h3>
            <div className="mood-history-scrollbox">
              {moodLogs.map((log) => (
                <div key={log.id} className="mood-log-card">
                  <div className="mood-log-header">
                    <span className="mood-log-date">{log.date}</span>
                    <span className="mood-log-emoji">{getMoodEmoji(log.moodScore)}</span>
                  </div>
                  <div className="mood-log-metrics">
                    <span>Mood: {log.moodScore}/10</span>
                    <span>Stress: {log.stressScore}/10</span>
                    <span>Energy: {log.energyLevel || 5}/10</span>
                  </div>
                  {log.notes && <p className="mood-log-note">"{log.notes}"</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BREATHING COACH */}
      {activeSection === 'breathe' && (
        <div className="breathe-section-wrapper">
          <div className="breath-instruction">
            <h3>4-4-4 Breathing Exercise</h3>
            <p>A simple box-breathing cycle designed to deactivate the nervous system's fight-or-flight response, reducing cortisol and stress levels immediately.</p>
          </div>

          <div className="breath-visualizer-container">
            {/* Pulsing Concentric Circles */}
            <div className={`breath-outer-ring ${isBreathing ? breathPhase.toLowerCase() : ''}`}>
              <div className="breath-inner-ring">
                <div className="breath-coach-core">
                  <span className="breath-phase">{breathPhase}</span>
                  {isBreathing && <span className="breath-timer">{breathTimer}s</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="breath-actions">
            <button 
              onClick={() => setIsBreathing(!isBreathing)} 
              className={`breath-toggle-btn ${isBreathing ? 'active' : ''}`}
            >
              {isBreathing ? 'Stop Session' : 'Start Session'}
            </button>
            <p className="breath-prompt-sub text-center">
              {isBreathing 
                ? (breathPhase === 'Inhale' ? 'Breathe in slowly through your nose...' : 
                   breathPhase === 'Hold' ? 'Hold your breath, relax your shoulders...' : 
                   'Release the air slowly through your mouth...') 
                : 'Tap start to begin your breathing coach.'}
            </p>
          </div>
        </div>
      )}

      {/* GUIDED MEDITATIONS AUDIO PLAYER */}
      {activeSection === 'meditate' && (
        <div className="breathe-section-wrapper fade-in">
          <div className="breath-instruction">
            <h3>Guided Audio Meditations</h3>
            <p>Select a mindfulness frequency session. Real-time neural de-stress guides tailored for young professional cognitive load.</p>
          </div>

          {/* AUDIO PLAYER BOARD */}
          <div className="settings-card" style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.08))',
            borderColor: 'rgba(139, 92, 246, 0.3)',
            padding: '20px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <span className="welcome-tag" style={{ color: '#C084FC', fontWeight: '800', textTransform: 'uppercase', fontSize: '9px' }}>
              Mindfulness Deck • Synced
            </span>

            {/* Play track metadata */}
            <h3 style={{ margin: '6px 0 2px 0', fontSize: '18px', fontWeight: '800' }}>
              {MEDITATION_TRACKS[currentTrackIdx].title}
            </h3>
            <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '12px' }}>
              {MEDITATION_TRACKS[currentTrackIdx].description}
            </span>

            {/* Tags row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '20px' }}>
              {MEDITATION_TRACKS[currentTrackIdx].tags.map((tag, idx) => (
                <span key={idx} style={{
                  fontSize: '9.5px', fontWeight: '700', padding: '2px 8px', borderRadius: '8px',
                  backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#C084FC'
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Progress timeline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', color: '#64748B', width: '30px' }}>
                {formatAudioTime(playSeconds)}
              </span>
              <div className="budget-bar-track" style={{ flex: 1, height: '4px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <div className="budget-bar-fill" style={{ width: `${playProgress}%`, backgroundColor: '#8B5CF6' }}></div>
              </div>
              <span style={{ fontSize: '11px', color: '#64748B', width: '30px' }}>
                {formatAudioTime(MEDITATION_TRACKS[currentTrackIdx].duration)}
              </span>
            </div>

            {/* Bouncing Audio Wave visualizer */}
            {isPlaying && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', height: '20px', alignItems: 'center', marginBottom: '16px' }}>
                <style>{`
                  @keyframes eqWave { 0%, 100% { height: 4px; } 50% { height: 18px; } }
                `}</style>
                {[0.1, 0.4, 0.2, 0.6, 0.3].map((delay, idx) => (
                  <span key={idx} style={{
                    width: '3px', height: '8px', backgroundColor: '#EC4899', borderRadius: '1.5px',
                    animation: 'eqWave 0.8s ease-in-out infinite', animationDelay: `${delay}s`
                  }}></span>
                ))}
              </div>
            )}

            {/* Media controls */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
              <button 
                onClick={handlePlayToggle}
                style={{
                  width: '48px', height: '48px', borderRadius: '50%', border: 'none',
                  background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', color: 'white',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
                  boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)'
                }}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
              </button>
              <button
                onClick={handleTrackSkip}
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)',
                  color: '#CBD5E1', display: 'flex', justifyContent: 'center', alignItems: 'center',
                  cursor: 'pointer'
                }}
                title="Skip Track"
              >
                <SkipForward size={14} />
              </button>
            </div>
          </div>

          {/* Guided list select */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {MEDITATION_TRACKS.map((track, idx) => (
              <div 
                key={track.id}
                onClick={() => {
                  setIsPlaying(false);
                  setPlayProgress(0);
                  setPlaySeconds(0);
                  setCurrentTrackIdx(idx);
                }}
                style={{
                  padding: '10px 14px', borderRadius: '16px',
                  backgroundColor: currentTrackIdx === idx ? 'rgba(139,92,246,0.1)' : 'rgba(15,23,42,0.3)',
                  border: '1.5px solid',
                  borderColor: currentTrackIdx === idx ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', display: 'block', color: currentTrackIdx === idx ? '#C084FC' : '#FFF' }}>
                    {track.title}
                  </span>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>{formatAudioTime(track.duration)} mins</span>
                </div>
                {currentTrackIdx === idx && isPlaying ? (
                  <Volume2 size={16} className="col-purple animate-pulse" />
                ) : (
                  <Play size={12} style={{ color: '#64748B' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LIFE BALANCE WHEEL */}
      {activeSection === 'balance' && (
        <div className="wheel-tab-wrapper fade-in">
          <div className="breath-instruction">
            <h3>Interactive Life Balance Wheel</h3>
            <p>Assess and rate your satisfaction across six core domains. Tap category labels to navigate directly to their control center.</p>
          </div>

          {/* SVG Spider Chart */}
          <div className="wheel-svg-container">
            <svg className="wheel-svg" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="75" className="wheel-grid-ring" />
              <circle cx="90" cy="90" r="50" className="wheel-grid-ring" />
              <circle cx="90" cy="90" r="25" className="wheel-grid-ring" />
              
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const angle = (i * Math.PI / 3) - Math.PI / 2;
                const targetX = 90 + 75 * Math.cos(angle);
                const targetY = 90 + 75 * Math.sin(angle);
                return (
                  <line 
                    key={i} 
                    x1="90" y1="90" 
                    x2={targetX} y2={targetY} 
                    className="wheel-poly-axis" 
                  />
                );
              })}

              <polygon 
                points={[
                  { key: 'finance' },
                  { key: 'health' },
                  { key: 'mind' },
                  { key: 'career' },
                  { key: 'social' },
                  { key: 'hobbies' }
                ].map((cat, i) => {
                  const score = wheelScores[cat.key] || 50;
                  const angle = (i * Math.PI / 3) - Math.PI / 2;
                  const x = 90 + 75 * (score / 100) * Math.cos(angle);
                  const y = 90 + 75 * (score / 100) * Math.sin(angle);
                  return `${x},${y}`;
                }).join(' ')} 
                className="wheel-poly-shape" 
              />

              {[
                { key: 'finance', label: 'Money', tab: 'finance' },
                { key: 'health', label: 'Body', tab: 'health' },
                { key: 'mind', label: 'Mind', tab: 'wellbeing' },
                { key: 'career', label: 'Career', tab: 'settings' },
                { key: 'social', label: 'Social', tab: 'dashboard' },
                { key: 'hobbies', label: 'Hobbies', tab: 'dashboard' }
              ].map((cat, i) => {
                const angle = (i * Math.PI / 3) - Math.PI / 2;
                const labelX = 90 + 90 * Math.cos(angle);
                const labelY = 90 + 85 * Math.sin(angle) + 2;
                return (
                  <text 
                    key={cat.key} 
                    x={labelX} 
                    y={labelY} 
                    className="wheel-axis-label"
                    onClick={() => setActiveTab(cat.tab)}
                  >
                    {cat.label}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Rating Sliders Grid */}
          <div className="wheel-sliders-grid">
            {[
              { key: 'finance', label: 'Financial Security' },
              { key: 'health', label: 'Physical Health' },
              { key: 'mind', label: 'Mental Clarity' },
              { key: 'career', label: 'Career Alignment' },
              { key: 'social', label: 'Social Connection' },
              { key: 'hobbies', label: 'Hobby & Growth' }
            ].map(cat => (
              <div key={cat.key} className="wheel-slider-card">
                <label>
                  <span>{cat.label}</span>
                  <span className="bold">{wheelScores[cat.key] || 50}%</span>
                </label>
                <input 
                  type="range" 
                  min="20" 
                  max="100" 
                  value={wheelScores[cat.key] || 50} 
                  onChange={(e) => updateWheelScore(cat.key, e.target.value)}
                  className="wheel-slider-bar"
                />
              </div>
            ))}
          </div>

          {/* Alignment Advice */}
          <div className="wheel-advice-card text-sm">
            <span className="bold" style={{ color: '#C084FC', display: 'block', marginBottom: '4px' }}>
              Balance Coach recommendation:
            </span>
            <span>
              {(() => {
                let minKey = 'finance';
                let minVal = 100;
                ['finance', 'health', 'mind', 'career', 'social', 'hobbies'].forEach(k => {
                  const val = wheelScores[k] || 50;
                  if (val < minVal) {
                    minVal = val;
                    minKey = k;
                  }
                });
                
                switch (minKey) {
                  case 'finance': return "Your financial security rating is your lowest balance index. Action recommendation: Review subscription renewals under Bills to cut money leaks.";
                  case 'health': return "Your physical health rating is your lowest balance index. Action recommendation: Log a 20-minute gym workout under Body to improve metabolic energy.";
                  case 'mind': return "Your mental clarity rating is your lowest balance index. Action recommendation: Engage in a 3-minute Box Breathing break now to decompress.";
                  case 'career': return "Your career alignment rating is your lowest balance index. Action recommendation: Tackle one urgent priority item in settings early today.";
                  case 'social': return "Your social connection rating is your lowest balance index. Action recommendation: Message a close friend to plan a quick coffee catchup.";
                  case 'hobbies': return "Your personal growth rating is your lowest balance index. Action recommendation: Block out 15 minutes of screen-free time for hobbies.";
                  default: return "High alignment! Your domains are balanced. Keep logging daily metrics.";
                }
              })()}
            </span>
          </div>
        </div>
      )}
      {/* CORRELATIONS TAB */}
      {activeSection === 'correlations' && (() => {
        const recentMood = [...(moodLogs || [])].reverse().slice(-7);
        const recentHealth = [...(healthLogs || [])].reverse().slice(-7);
        const sleepStressPoints = recentMood.map(ml => {
          const hl = recentHealth.find(h => h.date === ml.date);
          return hl ? { sleep: hl.sleepHours || 7, stress: ml.stressScore } : null;
        }).filter(Boolean);
        const avgSleep = sleepStressPoints.length > 0 ? (sleepStressPoints.reduce((s, p) => s + p.sleep, 0) / sleepStressPoints.length).toFixed(1) : '7.0';
        const avgStress = recentMood.length > 0 ? (recentMood.reduce((s, m) => s + m.stressScore, 0) / recentMood.length).toFixed(1) : '5.0';
        const sleepStressInfo = parseFloat(avgSleep) >= 7 ? { text: 'Positive Correlation', color: '#10B981' } : { text: 'Sleep Deficit Detected', color: '#F59E0B' };
        const recentTx = (Array.isArray(transactions) ? transactions : []).filter(t => t.type === 'expense').slice(-7);
        const avgSpend = recentTx.length > 0 ? (recentTx.reduce((s, t) => s + (t.amount || 0), 0) / recentTx.length).toFixed(0) : '0';
        const avgMood = recentMood.length > 0 ? (recentMood.reduce((s, m) => s + m.moodScore, 0) / recentMood.length).toFixed(1) : '7.0';
        const spendMoodInfo = parseFloat(avgSpend) < 50 ? { text: 'Mood Stable', color: '#10B981' } : { text: 'High Spend Period', color: '#EC4899' };

        return (
          <div className="breathe-section-wrapper fade-in">
            <div className="breath-instruction">
              <h3>📊 Wellbeing Correlations</h3>
              <p>Cross-data analytics linking your sleep, spending, and mood patterns over the last 7 days.</p>
            </div>

            <div className="settings-card" style={{ padding: '14px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '800' }}>😴 Sleep vs. Stress Level</h4>
                <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.04)', color: sleepStressInfo.color, border: `1px solid ${sleepStressInfo.color}40` }}>{sleepStressInfo.text}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                <div style={{ flex: 1, background: 'rgba(139,92,246,0.08)', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '22px', fontWeight: '900', color: '#8B5CF6', display: 'block' }}>{avgSleep}h</span>
                  <span style={{ fontSize: '10px', color: '#64748B' }}>Avg Sleep</span>
                </div>
                <div style={{ flex: 1, background: 'rgba(236,72,153,0.08)', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '22px', fontWeight: '900', color: '#EC4899', display: 'block' }}>{avgStress}/10</span>
                  <span style={{ fontSize: '10px', color: '#64748B' }}>Avg Stress</span>
                </div>
              </div>
              <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0 }}>
                {parseFloat(avgSleep) >= 7 ? '✅ Good sleep is helping keep your stress in check.' : '⚠️ Low sleep may be elevating your stress. Try the Deep Sleep Therapy meditation.'}
              </p>
            </div>

            <div className="settings-card" style={{ padding: '14px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '800' }}>💰 Daily Spending vs. Mood</h4>
                <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.04)', color: spendMoodInfo.color, border: `1px solid ${spendMoodInfo.color}40` }}>{spendMoodInfo.text}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                <div style={{ flex: 1, background: 'rgba(16,185,129,0.08)', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '22px', fontWeight: '900', color: '#10B981', display: 'block' }}>${avgSpend}</span>
                  <span style={{ fontSize: '10px', color: '#64748B' }}>Avg Daily Spend</span>
                </div>
                <div style={{ flex: 1, background: 'rgba(139,92,246,0.08)', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '22px', fontWeight: '900', color: '#8B5CF6', display: 'block' }}>{avgMood}/10</span>
                  <span style={{ fontSize: '10px', color: '#64748B' }}>Avg Mood</span>
                </div>
              </div>
              <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0 }}>
                {parseFloat(avgSpend) < 50 ? '✅ Controlled spending is positively supporting your mood stability.' : '⚠️ High spend periods may be impacting your mood. Review your Finance tab.'}
              </p>
            </div>

            <div className="settings-card" style={{ padding: '16px' }}>
              <span className="welcome-tag" style={{ color: '#C084FC', fontWeight: '800', fontSize: '9px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>AI Cognitive Reframing Lounge</span>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: '800' }}>🧠 Reframe a Stressor</h4>
              <p style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '12px' }}>
                Describe what's stressing you. Your AI coach will reframe it based on your coaching style ({profile?.coachingStyle || 'Gentle'}).
              </p>
              <select value={reframeCategory} onChange={(e) => setReframeCategory(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(15,23,42,0.4)', border: '1.5px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: '#FFF', fontSize: '12.5px', outline: 'none', marginBottom: '8px' }}>
                <option value="general">🌀 General Anxiety</option>
                <option value="finance">💰 Financial Stress</option>
                <option value="health">❤️ Health & Sleep</option>
                <option value="career">💼 Work & Career</option>
                <option value="social">👥 Social & Relationships</option>
              </select>
              <textarea
                value={stressorInput}
                onChange={(e) => setStressorInput(e.target.value)}
                placeholder="e.g. Worried about credit card limits, feeling behind at work..."
                style={{ width: '100%', height: '70px', padding: '10px', backgroundColor: 'rgba(15,23,42,0.4)', border: '1.5px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: '#FFF', fontSize: '12.5px', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
              />
              <button
                onClick={() => generateCognitiveReframeLocal(stressorInput, reframeCategory)}
                disabled={isReframing || !stressorInput.trim()}
                style={{ width: '100%', marginTop: '10px', padding: '12px', borderRadius: '12px', border: 'none', background: isReframing ? 'rgba(139,92,246,0.3)' : 'linear-gradient(135deg, #8B5CF6, #6366F1)', color: 'white', fontWeight: '700', cursor: isReframing ? 'not-allowed' : 'pointer', fontSize: '13px' }}
              >
                {isReframing ? '🧠 Reframing...' : '✨ Generate Reframe'}
              </button>
              {(reframeHistory || []).length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <h5 style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Recent Reframes</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(reframeHistory || []).slice(0, 3).map(session => (
                      <div key={session.id} style={{ background: 'rgba(139,92,246,0.06)', borderRadius: '12px', padding: '10px', border: '1px solid rgba(139,92,246,0.15)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '10px', fontWeight: '700', color: '#C084FC', textTransform: 'uppercase' }}>{session.category}</span>
                          <span style={{ fontSize: '10px', color: '#64748B' }}>{session.date}</span>
                        </div>
                        <p style={{ fontSize: '11px', color: '#94A3B8', margin: '0 0 4px 0', fontStyle: 'italic' }}>"{session.stressor}"</p>
                        <p style={{ fontSize: '11.5px', color: '#E2E8F0', margin: 0, lineHeight: '1.5' }}>{session.reframe}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* COMMUNITY TAB */}
      {activeSection === 'community' && (
        <div className="breathe-section-wrapper fade-in">
          <div className="breath-instruction">
            <h3>🌐 Social Wellness Community</h3>
            <p>Share wins, cheer teammates, and build accountability with your wellness circle.</p>
          </div>

          <div className="settings-card" style={{ padding: '14px', marginBottom: '12px' }}>
            <span className="welcome-tag" style={{ color: '#F59E0B', fontWeight: '800', fontSize: '9px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>🏆 Weekly Wellness Leaderboard</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { rank: 1, name: 'Marcus L.', avatar: 'ML', score: 94, streak: 14, color: '#F59E0B' },
                { rank: 2, name: 'Sarah K.', avatar: 'SK', score: 88, streak: 7, color: '#8B5CF6' },
                { rank: 3, name: 'You', avatar: '🌟', score: 81, streak: 3, color: '#10B981' },
                { rank: 4, name: 'Alex M.', avatar: 'AM', score: 76, streak: 5, color: '#38BDF8' },
              ].map(entry => (
                <div key={entry.rank} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px', background: entry.name === 'You' ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${entry.name === 'You' ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.04)'}` }}>
                  <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${entry.color}20`, border: `2px solid ${entry.color}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: entry.avatar.length > 2 ? '16px' : '11px', fontWeight: '800', color: entry.color }}>
                    {entry.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', display: 'block', color: entry.name === 'You' ? '#10B981' : '#FFF' }}>{entry.name}</span>
                    <span style={{ fontSize: '10px', color: '#64748B' }}>🔥 {entry.streak} day streak</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '16px', fontWeight: '900', color: entry.color, display: 'block' }}>{entry.score}</span>
                    <span style={{ fontSize: '9px', color: '#64748B' }}>pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="settings-card" style={{ padding: '14px', marginBottom: '12px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '800' }}>💬 Community Wins</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(communityContributions || []).map(post => (
                <div key={post.id} style={{ padding: '10px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: `${post.color}20`, border: `2px solid ${post.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800', color: post.color }}>
                      {post.avatar}
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: '700', display: 'block' }}>{post.user}</span>
                      <span style={{ fontSize: '10px', color: '#64748B' }}>{post.time}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#E2E8F0', margin: '0 0 8px 0', lineHeight: '1.5' }}>{post.message}</p>
                  <button
                    onClick={() => setCommunityContributions(prev => prev.map(p => p.id === post.id ? { ...p, likes: p.likes + 1 } : p))}
                    style={{ background: 'none', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '3px 10px', color: '#94A3B8', fontSize: '11px', cursor: 'pointer' }}
                  >
                    👏 {post.likes}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="settings-card" style={{ padding: '14px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '800' }}>🎉 Share Your Win</h4>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share a wellness win with your community..."
              style={{ width: '100%', height: '60px', padding: '10px', backgroundColor: 'rgba(15,23,42,0.4)', border: '1.5px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: '#FFF', fontSize: '12.5px', outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: '8px' }}
            />
            <button
              onClick={() => {
                if (!newPost.trim()) return;
                const post = { id: 'post-' + Date.now(), user: profile?.name || 'You', avatar: (profile?.name || 'Y')[0].toUpperCase(), message: newPost.trim(), likes: 0, time: 'Just now', color: '#10B981' };
                setCommunityContributions(prev => [post, ...(Array.isArray(prev) ? prev : [])]);
                setNewPost('');
                setShowPostSuccess(true);
                setTimeout(() => setShowPostSuccess(false), 3000);
                addAuditLog('Community Post', `Shared: "${post.message.substring(0, 40)}"`);
              }}
              style={{ width: '100%', padding: '11px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
            >
              📣 Post to Community
            </button>
            {showPostSuccess && (
              <div className="success-banner fade-in" style={{ marginTop: '8px' }}>
                <span>🎉 Win shared with your community!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DECOMPRESSION MODAL */}
      {showDecompressionModal && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(9,13,22,0.95)', zIndex: 120, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }} className="fade-in">
          <div style={{ background: '#131B2E', border: '1.5px solid rgba(139,92,246,0.4)', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '320px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🧘</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '800' }}>High Stress Detected</h3>
            <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 16px 0', lineHeight: '1.5' }}>Your stress level is elevated. Take a moment to decompress with a breathing session.</p>
            <button onClick={() => { setShowDecompressionModal(false); setActiveSection('breathe'); }} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '13px', marginBottom: '8px' }}>
              Start Breathing Exercise
            </button>
            <button onClick={() => setShowDecompressionModal(false)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#2D3748', color: '#E2E8F0', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* CRISIS HELP OVERLAY MODAL */}
      {showCrisisCenter && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(9, 13, 22, 0.95)',
          zIndex: 110,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }} className="fade-in">
          <div style={{
            background: '#131B2E',
            border: '1.5px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '24px',
            padding: '20px',
            width: '100%',
            maxWidth: '320px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '16px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#F87171',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              margin: '0 auto 12px auto', border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <PhoneCall size={26} />
            </div>

            <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '800' }}>Self-Care Helpline</h3>
            <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 16px 0', lineHeight: '1.4' }}>
              If you feel extremely overwhelmed, burned out, or are experiencing a safety crisis, please consult these free 24/7 networks:
            </p>

            {/* Country Selector */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                Select Region Helpline
              </label>
              <select 
                value={crisisCountry}
                onChange={e => setCrisisCountry(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: '10px',
                  backgroundColor: 'rgba(15,23,42,0.6)', border: '1px solid #2D3748',
                  color: 'white', fontSize: '12.5px', outline: 'none'
                }}
              >
                <option value="US">🇺🇸 United States</option>
                <option value="UK">🇬🇧 United Kingdom</option>
                <option value="CA">🇨🇦 Canada</option>
              </select>
            </div>

            {/* Dynamic Contacts */}
            <div style={{
              backgroundColor: 'rgba(5,7,11,0.4)', borderRadius: '12px',
              padding: '12px', border: '1px solid rgba(255,255,255,0.03)',
              marginBottom: '20px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px'
            }}>
              {crisisCountry === 'US' && (
                <>
                  <div style={{ fontSize: '12px' }}>
                    <span style={{ color: '#F87171', fontWeight: '800', display: 'block' }}>Suicide & Crisis Lifeline</span>
                    <span style={{ color: '#E2E8F0', fontSize: '13px', fontWeight: '800' }}>Call or Text: 988</span>
                  </div>
                  <div style={{ fontSize: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6px' }}>
                    <span style={{ color: '#38BDF8', fontWeight: '800', display: 'block' }}>Crisis Text Line</span>
                    <span style={{ color: '#E2E8F0', fontSize: '13px' }}>Text <strong style={{ color: '#FFF' }}>HOME</strong> to 741741</span>
                  </div>
                </>
              )}
              {crisisCountry === 'UK' && (
                <>
                  <div style={{ fontSize: '12px' }}>
                    <span style={{ color: '#F87171', fontWeight: '800', display: 'block' }}>NHS Mental Health Services</span>
                    <span style={{ color: '#E2E8F0', fontSize: '13px', fontWeight: '800' }}>Call: 111</span>
                  </div>
                  <div style={{ fontSize: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6px' }}>
                    <span style={{ color: '#38BDF8', fontWeight: '800', display: 'block' }}>The Samaritans Helpline</span>
                    <span style={{ color: '#E2E8F0', fontSize: '13px' }}>Call: 116 123 (Free Helpline)</span>
                  </div>
                </>
              )}
              {crisisCountry === 'CA' && (
                <>
                  <div style={{ fontSize: '12px' }}>
                    <span style={{ color: '#F87171', fontWeight: '800', display: 'block' }}>Suicide Crisis Helpline</span>
                    <span style={{ color: '#E2E8F0', fontSize: '13px', fontWeight: '800' }}>Call or Text: 988</span>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setShowCrisisCenter(false)}
              style={{
                width: '100%', padding: '12px', borderRadius: '12px',
                border: 'none', backgroundColor: '#2D3748', color: '#E2E8F0',
                fontWeight: '700', cursor: 'pointer', fontSize: '13px'
              }}
            >
              Close Guide
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Wellbeing;
