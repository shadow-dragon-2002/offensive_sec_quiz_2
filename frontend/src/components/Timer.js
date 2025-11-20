import React, { useState, useEffect } from 'react';
import './Timer.css';

function Timer({ timeLimit, onTimeout }) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1000) {
          clearInterval(interval);
          onTimeout();
          return 0;
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

  return (
    <div className={`timer-container ${getTimerClass()}`}>
      <div className="timer-icon">⏱️</div>
      <div className="timer-display">
        <div className="timer-label">Time Remaining</div>
        <div className="timer-value">{formatTime(timeRemaining)}</div>
      </div>
      <div className="timer-bar">
        <div 
          className="timer-fill" 
          style={{ width: `${(timeRemaining / timeLimit) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}

export default Timer;
