import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Delete } from 'lucide-react';

const SecurityLock = () => {
  const { appPasscode, unlockApp } = useApp();
  const [pin, setPin] = useState('');
  const [isError, setIsError] = useState(false);

  const handleKeyPress = (num) => {
    if (isError) setIsError(false);
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      
      if (nextPin.length === 4) {
        if (nextPin === appPasscode) {
          setTimeout(() => {
            unlockApp();
          }, 150);
        } else {
          setTimeout(() => {
            setIsError(true);
            setPin('');
          }, 200);
        }
      }
    }
  };

  const handleBackspace = () => {
    if (isError) setIsError(false);
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#090D16',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Outfit, sans-serif',
      color: '#FFFFFF'
    }}>
      {/* Header Info */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(139, 92, 246, 0.1)',
          border: '1px solid',
          borderColor: isError ? 'rgba(239, 68, 68, 0.3)' : 'rgba(139, 92, 246, 0.3)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto 16px auto',
          color: isError ? '#EF4444' : '#C084FC',
          transition: 'all 0.3s ease'
        }}>
          <Lock size={28} className={isError ? 'animate-bounce' : ''} />
        </div>
        <h2 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: '800' }}>
          {isError ? 'Incorrect Passcode' : 'Enter Passcode'}
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>
          {isError ? 'Please try again' : 'Secure Lock Screen Active'}
        </p>
      </div>

      {/* Dots Display */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '40px',
        justifyContent: 'center'
      }}>
        {[0, 1, 2, 3].map((idx) => {
          const isFilled = pin.length > idx;
          return (
            <div
              key={idx}
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: isError 
                  ? '#EF4444' 
                  : isFilled 
                    ? '#A78BFA' 
                    : 'rgba(255,255,255,0.05)',
                border: '1.5px solid',
                borderColor: isError 
                  ? '#EF4444' 
                  : isFilled 
                    ? '#A78BFA' 
                    : 'rgba(255,255,255,0.15)',
                boxShadow: isFilled && !isError ? '0 0 10px rgba(167, 139, 250, 0.5)' : 'none',
                transition: 'all 0.2s ease-in-out'
              }}
            />
          );
        })}
      </div>

      {/* Keypad */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px 24px',
        maxWidth: '280px',
        width: '100%'
      }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleKeyPress(num.toString())}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.03)',
              backgroundColor: 'rgba(255,255,255,0.03)',
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'background-color 0.2s ease, transform 0.1s ease',
              outline: 'none'
            }}
            onMouseDown={(e) => { e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.2)'; e.currentTarget.style.transform = 'scale(0.95)'; }}
            onMouseUp={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'scale(1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {num}
          </button>
        ))}

        {/* Empty / Left helper key */}
        <div style={{ width: '72px', height: '72px' }}></div>

        {/* 0 Key */}
        <button
          onClick={() => handleKeyPress('0')}
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.03)',
            backgroundColor: 'rgba(255,255,255,0.03)',
            color: '#FFFFFF',
            fontSize: '24px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'background-color 0.2s ease, transform 0.1s ease',
            outline: 'none'
          }}
          onMouseDown={(e) => { e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.2)'; e.currentTarget.style.transform = 'scale(0.95)'; }}
          onMouseUp={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'scale(1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          0
        </button>

        {/* Backspace Key */}
        <button
          onClick={handleBackspace}
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#94A3B8',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'color 0.2s ease',
            outline: 'none'
          }}
          onMouseDown={(e) => e.currentTarget.style.color = '#FFFFFF'}
          onMouseUp={(e) => e.currentTarget.style.color = '#94A3B8'}
        >
          <Delete size={24} />
        </button>
      </div>
    </div>
  );
};

export default SecurityLock;