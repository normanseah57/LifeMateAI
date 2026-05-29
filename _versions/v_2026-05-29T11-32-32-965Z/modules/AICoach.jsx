import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  Mic, 
  Volume2, 
  VolumeX,
  Play
} from 'lucide-react';

const AICoach = () => {
  const {
    profile,
    setProfile,
    transactions,
    budgets,
    moodLogs,
    healthLogs,
    aiConversations,
    setAiConversations,
    getTodayHealthLog,
    updateTodayHealthLog,
    addNotification,
    addAuditLog,
    t
  } = useApp();

  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeAudioMsgIdx, setActiveAudioMsgIdx] = useState(null);
  
  const chatEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiConversations, isTyping]);

  const handleStyleChange = (style) => {
    setProfile(prev => ({ ...prev, coachingStyle: style }));
    
    // Add assistant check-in message matching new style
    let intro = "";
    if (style === 'Gentle') {
      intro = "I am now set to your Gentle Coach. I am here to encourage you, support your mental peace, and guide you through small, stress-free daily changes.";
    } else if (style === 'Direct') {
      intro = "Direct Coach mode activated. I will provide direct feedback, flag inefficiencies in your habits/budgets, and omit pleasantries. Ready to work.";
    } else if (style === 'Data-driven') {
      intro = "Data-driven mode active. Analyzing correlation coefficient variables. I will highlight statistics, graphs, and patterns between your sleep, stress, and transactions.";
    } else {
      intro = "Hey! I am your friendly companion now. Think of me like a buddy who keeps you honest but wants to hear how you are really doing.";
    }

    setAiConversations(prev => [
      ...prev,
      { role: 'assistant', content: intro, timestamp: new Date().toISOString() }
    ]);
  };

  // Custom Local AI Engine simulating LLM outputs by correlating active data
  const generateSimulatedReply = (userText) => {
    const text = userText.toLowerCase();
    const sleepLog = getTodayHealthLog();
    const sleepVal = parseFloat(sleepLog.sleepHours || 7.0);
    const stressLogs = moodLogs.slice(0, 3);
    const avgStress = stressLogs.length > 0 ? stressLogs.reduce((sum, l) => sum + l.stressScore, 0) / stressLogs.length : 4;
    
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlySpend = transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= firstDay)
      .reduce((sum, t) => sum + t.amount, 0);
    const totalBudget = Object.values(budgets).reduce((sum, b) => sum + b, 0) || 500;
    const remainingBudget = Math.max(0, totalBudget - monthlySpend);

    const style = profile.coachingStyle;

    // Safety Trigger
    if (text.includes('kill') || text.includes('depressed') || text.includes('suicide') || text.includes('hurt myself') || text.includes('overwhelmed') && avgStress > 8) {
      return {
        reply: "I hear that you're going through a very difficult time right now. Please know that you are not alone. As an AI assistant, I can't provide professional care. I strongly encourage you to reach out to a professional counselor, contact a local helpline, or talk to someone you trust. You can call or text 988 in the US/Canada to reach the Suicide & Crisis Lifeline immediately. Please stay safe.",
        safety: true
      };
    }

    // Question: Affordability
    if (text.includes('afford') || text.includes('buy') || text.includes('cost')) {
      const match = text.match(/\d+/);
      const amt = match ? parseFloat(match[0]) : 50;

      if (style === 'Gentle') {
        if (remainingBudget >= amt) {
          return { reply: `Yes, you can afford it! You have $${remainingBudget.toFixed(2)} left in your budget, so spending $${amt} fits within your limits. Let's make sure it's something that brings you genuine happiness.` };
        } else {
          return { reply: `It might feel tight right now. You only have $${remainingBudget.toFixed(2)} remaining this month. If possible, could we delay this purchase by a week or wait to see if it feels essential later? Your peace of mind is worth it.` };
        }
      } else if (style === 'Direct') {
        if (remainingBudget >= amt) {
          return { reply: `Affordable: Yes. Price is $${amt}. Remaining budget is $${remainingBudget.toFixed(2)}. Make sure this is an asset, not consumer clutter.` };
        } else {
          return { reply: `Negative. Denied. Spending $${amt} exceeds your remaining budget of $${remainingBudget.toFixed(2)}. Postpone immediately.` };
        }
      } else if (style === 'Data-driven') {
        const pct = (amt / totalBudget) * 100;
        return { reply: `Analysis: Purchase of $${amt} represents ${pct.toFixed(1)}% of your monthly budget. Current balance: $${remainingBudget.toFixed(2)}. If executed, budget capacity drops to $${Math.max(0, remainingBudget - amt).toFixed(2)}. Recommendation: Avoid if discretionary.` };
      } else {
        return { reply: `Sure, you've got $${remainingBudget.toFixed(2)} left in the kitty. If you really want it, go for it, but maybe sleep on it first just to be sure!` };
      }
    }

    // Question: Stress and Sleep connection
    if (text.includes('stress') || text.includes('tired') || text.includes('anxiety')) {
      if (style === 'Gentle') {
        if (sleepVal < 6.5) {
          return { reply: `I hear you, and it makes complete sense that you're feeling stressed. Your sleep log shows only ${sleepVal} hours last night. When you are tired, your brain finds it harder to manage daily tasks. Let's take a 3-minute breathing break, drink a warm cup of herbal tea, and plan to get into bed early tonight. You deserve rest.` };
        } else {
          return { reply: `I'm sorry you're feeling overwhelmed. Even though you slept ${sleepVal} hours, daily pressures accumulate. Let's write down your top task, clear it, and take a 10-minute quiet walk. Let's protect your energy together.` };
        }
      } else if (style === 'Direct') {
        return { reply: `Stress at ${avgStress.toFixed(1)}/10 correlates with sleep of ${sleepVal} hours. You are run-down. Reschedule low-priority appointments. Put away your phone by 9 PM. Complete 10 minutes of box-breathing now.` };
      } else if (style === 'Data-driven') {
        const correlation = sleepVal < 6.5 ? 40 : 10;
        return { reply: `Data correlation: Sleep duration of ${sleepVal}h matches a ${correlation}% increase in cortisol stress signals. Your current stress is ${avgStress.toFixed(1)}/10. Sleep efficiency must increase to 7.5h to stabilize mood. Schedule 15 minutes of quiet time.` };
      } else {
        return { reply: `Aw, sorry you're stressed out. Sounds like that ${sleepVal}h sleep is catching up to you! Why don't you close your tabs for 5 minutes and just stretch? I'm here if you need to vent.` };
      }
    }

    // Question: Money leak
    if (text.includes('leak') || text.includes('overspending') || text.includes('dining')) {
      // Find dining expense total
      const diningSpend = transactions
        .filter(t => t.type === 'expense' && t.categoryId === 'cat-dining')
        .reduce((sum, t) => sum + t.amount, 0);

      if (style === 'Gentle') {
        return { reply: `It looks like our biggest expenditure recently has been Food & Dining, totaling $${diningSpend.toFixed(2)}. It's so nice to eat out, but small logs add up. Maybe we can try cooking a simple favorite dish at home this weekend? It's a sweet way to save and nurture ourselves.` };
      } else if (style === 'Direct') {
        return { reply: `Money leak detected: Food & Dining represents $${diningSpend.toFixed(2)} this week. Reduce dining frequency by 50% immediately. Cook meals at home.` };
      } else if (style === 'Data-driven') {
        const pct = monthlySpend > 0 ? (diningSpend / monthlySpend) * 100 : 0;
        return { reply: `Financial leak analysis: Category 'Food & Dining' represents ${pct.toFixed(1)}% of all discretionary expenses this period, totaling $${diningSpend.toFixed(2)}. Target adjustment: reduce category budget by 20% to save an extra $40/month.` };
      } else {
        return { reply: `Looks like you're spending a bit on food, about $${diningSpend.toFixed(2)} on takeout/restaurants. Maybe make it a challenge to clear out your fridge first? You'd be surprised what you save!` };
      }
    }

    // Default responses
    if (style === 'Gentle') {
      return { reply: "I'm listening. Tell me more about what's on your mind. We can check your budgets, sleep logs, or work on stress reduction together. Small steps lead to big change." };
    } else if (style === 'Direct') {
      return { reply: "Understood. Specify if you require budget review, habit optimization instructions, or a sleep recovery routine. Keep requests clear." };
    } else if (style === 'Data-driven') {
      return { reply: "Query logged. Awaiting specific logs query. I can analyze correlation indicators between: 1) Sleep & Stress, 2) Spending & Stress, 3) Daily Task completion rates." };
    } else {
      return { reply: "Nice! Tell me more. Let's figure out a simple game plan for this week. What do you want to handle first?" };
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    triggerMessageSend(inputMsg);
  };

  const triggerMessageSend = (textVal) => {
    if (!textVal.trim()) return;

    const userMessage = {
      role: 'user',
      content: textVal,
      timestamp: new Date().toISOString()
    };

    setAiConversations(prev => [...prev, userMessage]);
    setInputMsg('');
    setIsTyping(true);

    // Dynamic voice logic: if they say "Log a cup of water"
    if (textVal.toLowerCase().includes('water')) {
      const current = getTodayHealthLog().waterMl || 0;
      updateTodayHealthLog({ waterMl: current + 250 });
      addNotification(
        "Water Logged via Voice", 
        "Dynamic Voice Assistant added 250ml water to your daily hydration grid.", 
        "health"
      );
      addAuditLog("Voice Log Command", "Logged 250ml water via Voice Speech transcription.");
    }

    setTimeout(() => {
      let replyContent = "";
      if (textVal.toLowerCase().includes('water')) {
        replyContent = `Got it! I have recorded a 250ml cup of water to your daily logs. Your total hydration level is now updated. Keep drinking to reach your 2L target!`;
      } else {
        const response = generateSimulatedReply(textVal);
        replyContent = response.reply;
      }

      setAiConversations(prev => [
        ...prev,
        {
          role: 'assistant',
          content: replyContent,
          timestamp: new Date().toISOString(),
          isAudioAvailable: true
        }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleChipClick = (msg) => {
    setInputMsg(msg);
  };

  const startListeningMock = () => {
    setIsListening(true);
    addAuditLog("Voice Recording", "Voice microphone activated listening recorder.");
    
    // After 2.5 seconds, select a random mock voice command
    setTimeout(() => {
      const commands = [
        "Log a cup of water",
        "How is my budget?",
        "I feel stressed and tired"
      ];
      const randomCmd = commands[Math.floor(Math.random() * commands.length)];
      setIsListening(false);
      
      // Auto submit command
      triggerMessageSend(randomCmd);
    }, 2800);
  };

  const playAudioSynthesis = (idx, content) => {
    if (activeAudioMsgIdx === idx) {
      setActiveAudioMsgIdx(null);
      return;
    }
    
    setActiveAudioMsgIdx(idx);
    addAuditLog("Text-To-Speech Playback", `Synthesized voice playback triggered for message: "${content.substring(0, 30)}..."`);
    
    // Reset after 3.5 seconds
    setTimeout(() => {
      setActiveAudioMsgIdx(prev => prev === idx ? null : prev);
    }, 3500);
  };

  const chips = [
    "Can I afford a $60 purchase?",
    "Why is my stress score high today?",
    "Identify my biggest money leaks",
    "Give me a quick calm routine"
  ];

  return (
    <div className="chat-container fade-in">
      {/* Title with Coach selector */}
      <div className="chat-header">
        <div className="header-meta">
          <Bot size={24} className="bot-glow" />
          <div>
            <h3>{t('aiCoach')}</h3>
            <span className="style-indicator">Active: {profile.coachingStyle} Profile</span>
          </div>
        </div>
      </div>

      {/* Dynamic style selector pills */}
      <div className="coach-selector-pills">
        {['Gentle', 'Direct', 'Data-driven', 'Friendly'].map((style) => (
          <button
            key={style}
            onClick={() => handleStyleChange(style)}
            className={`coach-pill ${profile.coachingStyle === style ? 'active' : ''}`}
          >
            {style}
          </button>
        ))}
      </div>

      {/* Messages Scroll Box */}
      <div className="chat-messages-box">
        {aiConversations.map((msg, idx) => {
          const isBot = msg.role === 'assistant';
          return (
            <div key={idx} className={`message-bubble-wrapper ${isBot ? 'bot-wrap' : 'user-wrap'}`}>
              <div className="avatar-icon">
                {isBot ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className={`message-bubble ${isBot ? 'bot-bubble' : 'user-bubble'} ${msg.isSafety ? 'safety-warning' : ''}`} style={{ position: 'relative', minWidth: '160px' }}>
                {msg.isSafety && (
                  <div className="safety-warning-header">
                    <ShieldAlert size={14} /> Medical/Safety Notice
                  </div>
                )}
                <p style={{ margin: '0 0 4px 0' }}>{msg.content}</p>
                {isBot && msg.isAudioAvailable && (
                  <button 
                    onClick={() => playAudioSynthesis(idx, msg.content)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      color: activeAudioMsgIdx === idx ? '#C084FC' : '#94A3B8',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '9.5px',
                      fontWeight: '700',
                      marginTop: '6px',
                      float: 'right',
                      clear: 'both'
                    }}
                    title="Speak text out loud"
                  >
                    <Volume2 size={11} className={activeAudioMsgIdx === idx ? 'pulse' : ''} />
                    <span>{activeAudioMsgIdx === idx ? 'Playing Audio...' : 'Read Aloud'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="message-bubble-wrapper bot-wrap">
            <div className="avatar-icon">
              <Bot size={16} />
            </div>
            <div className="message-bubble bot-bubble typing-bubble">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Chips Row */}
      <div className="quick-chips-row">
        {chips.map((chip, idx) => (
          <button 
            key={idx} 
            onClick={() => handleChipClick(chip)}
            className="chip-btn"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input box */}
      <form onSubmit={handleSend} className="chat-input-bar">
        <button
          type="button"
          onClick={startListeningMock}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            color: '#A78BFA',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '6px'
          }}
          title="Simulate Voice Input"
        >
          <Mic size={16} />
        </button>
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder={`${t('aiCoach')} (${profile.coachingStyle} Style)...`}
          className="chat-input-field"
        />
        <button type="submit" className="chat-send-btn" aria-label="Send message">
          <Send size={16} />
        </button>
      </form>

      {/* VOICE RECORDING POPUP OVERLAY */}
      {isListening && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(9, 13, 22, 0.95)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '24px'
        }} className="fade-in">
          <style>{`
            @keyframes pulseMic {
              0%, 100% { transform: scale(1); opacity: 0.8; }
              50% { transform: scale(1.15); opacity: 1; }
            }
            @keyframes waveBar {
              0%, 100% { height: 10px; }
              50% { height: 40px; }
            }
          `}</style>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'rgba(139, 92, 246, 0.2)',
            border: '2px solid rgba(139, 92, 246, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#A78BFA',
            animation: 'pulseMic 2s infinite'
          }}>
            <Mic size={36} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ margin: '0', fontSize: '18px', fontWeight: '800', color: '#FFF' }}>{t('aiCoach')} Listening...</h4>
            <span style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginTop: '4px' }}>Try saying: "Log a cup of water" or "How is my budget?"</span>
          </div>

          <div style={{ display: 'flex', gap: '6px', height: '40px', alignItems: 'center' }}>
            {[0.1, 0.3, 0.6, 0.4, 0.2].map((delay, idx) => (
              <span key={idx} style={{
                width: '4px',
                backgroundColor: '#C084FC',
                borderRadius: '2px',
                animation: 'waveBar 1.0s ease-in-out infinite',
                animationDelay: `${delay}s`
              }}></span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AICoach;
