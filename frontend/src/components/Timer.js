import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './Timer.css';
import api from '../utils/api';

function Timer({ timeLimit, sessionData, onTimeout }) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [totalTimeLimit, setTotalTimeLimit] = useState(timeLimit);
  const hasTimedOut = useRef(false);

  useEffect(() => {
    // Don't fetch if no session data available
    if (!sessionData?.quizState) {
      return;
    }
    
    // Fetch remaining time from server every second
    const fetchRemainingTime = async () => {
      try {
        const response = await api.post('/quiz/stats', { quizState: sessionData.quizState });
        if (response.data && response.data.stats) {
          const stats = response.data.stats;
          if (stats.remainingTime !== undefined) {
            const remaining = stats.remainingTime;
            setTimeRemaining(remaining);
            
            // Update total time limit if available
            if (stats.timeLimit) {
              setTotalTimeLimit(stats.timeLimit);
            }
            
            // Check if time has expired
            if (remaining <= 0 && !hasTimedOut.current) {
              hasTimedOut.current = true;
              onTimeout();
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch remaining time:', err);
        // Don't trigger timeout on network errors
      }
    };

    // Fetch immediately on mount
    fetchRemainingTime();

    // Poll server every second for accurate time tracking
    const interval = setInterval(fetchRemainingTime, 1000);

    return () => clearInterval(interval);
  }, [onTimeout, sessionData]);

  const formatTime = (seconds) => {
    // API returns seconds, not milliseconds
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    const percentage = (timeRemaining / totalTimeLimit) * 100;
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
          style={{ width: `${(timeRemaining / totalTimeLimit) * 100}%` }}
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
