import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './Timer.css';
import soundEffects from '../utils/soundEffects';

function Timer({ timeLimit, onTimeout }) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const lastWarningTimeRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1000) {
          clearInterval(interval);
          onTimeout();
          return 0;
        }
        
        // Play warning sound when time is critically low
        const percentage = (prevTime / timeLimit) * 100;
        if (percentage <= 10 && percentage > 9) {
          // Play warning every few seconds in critical time
          const currentTime = Date.now();
          if (!lastWarningTimeRef.current || currentTime - lastWarningTimeRef.current > 3000) {
            soundEffects.timerWarning();
            lastWarningTimeRef.current = currentTime;
          }
        }
        
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLimit, onTimeout]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    const percentage = (timeRemaining / timeLimit) * 100;
    if (percentage <= 10) return 'critical';
    if (percentage <= 25) return 'warning';
    return 'normal';
  };

  const timerClass = getTimerClass();
  
  return (
    <motion.div 
      className={`timer-container ${timerClass}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: timerClass === 'critical' ? [1, 1.05, 1] : 1
      }}
      transition={{ 
        opacity: { duration: 0.5 },
        scale: { repeat: timerClass === 'critical' ? Infinity : 0, duration: 0.5 }
      }}
    >
      <div className="timer-icon">⏱️</div>
      <div className="timer-display">
        <div className="timer-label">MISSION TIMER</div>
        <motion.div 
          className="timer-value"
          animate={{ 
            color: timerClass === 'critical' 
              ? ['#ff006e', '#ffff00', '#ff006e'] 
              : timerClass === 'warning'
              ? '#ffa500'
              : '#00f3ff'
          }}
          transition={{ duration: 0.5, repeat: timerClass === 'critical' ? Infinity : 0 }}
        >
          {formatTime(timeRemaining)}
        </motion.div>
      </div>
      <div className="timer-bar">
        <motion.div 
          className="timer-fill" 
          style={{ width: `${(timeRemaining / timeLimit) * 100}%` }}
          animate={{ 
            boxShadow: timerClass === 'critical' 
              ? [
                  '0 0 10px rgba(255, 0, 110, 0.8)',
                  '0 0 20px rgba(255, 0, 110, 1)',
                  '0 0 10px rgba(255, 0, 110, 0.8)'
                ]
              : '0 0 10px rgba(0, 243, 255, 0.5)'
          }}
          transition={{ duration: 0.5, repeat: timerClass === 'critical' ? Infinity : 0 }}
        />
      </div>
    </motion.div>
  );
}

export default Timer;
