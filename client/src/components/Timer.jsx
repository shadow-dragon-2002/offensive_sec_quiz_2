import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function Timer({ startTime, timeLimit, onTimeout }) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [status, setStatus] = useState('STABLE');

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, timeLimit - elapsed);
      
      setTimeRemaining(remaining);

      // Update status based on remaining time
      if (remaining === 0) {
        clearInterval(interval);
        if (onTimeout) onTimeout();
      } else if (remaining < 60) {
        setStatus('CRITICAL');
      } else if (remaining < 300) {
        setStatus('WARNING');
      } else if (remaining < 600) {
        setStatus('CAUTION');
      } else {
        setStatus('STABLE');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, timeLimit, onTimeout]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const getStatusColor = () => {
    switch (status) {
      case 'CRITICAL': return 'text-red-500';
      case 'WARNING': return 'text-yellow-500';
      case 'CAUTION': return 'text-orange-500';
      default: return 'text-cyber-blue';
    }
  };

  const getStatusBg = () => {
    switch (status) {
      case 'CRITICAL': return 'from-red-500/20 to-red-900/20';
      case 'WARNING': return 'from-yellow-500/20 to-orange-500/20';
      case 'CAUTION': return 'from-orange-500/20 to-yellow-500/20';
      default: return 'from-cyber-blue/20 to-cyber-purple/20';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'CRITICAL': return '⚠ CRITICAL';
      case 'WARNING': return '⚡ WARNING';
      case 'CAUTION': return '▲ CAUTION';
      default: return '✓ STABLE';
    }
  };

  return (
    <motion.div
      className={`bg-gradient-to-r ${getStatusBg()} border ${getStatusColor().replace('text-', 'border-')} rounded-lg p-4 backdrop-blur-sm`}
      animate={status === 'CRITICAL' ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.5, repeat: status === 'CRITICAL' ? Infinity : 0 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-jetbrains text-gray-400 uppercase tracking-wider mb-1">
            Neural Countdown
          </p>
          <motion.p
            className={`text-4xl font-orbitron font-black ${getStatusColor()} tracking-wider`}
            animate={status === 'CRITICAL' ? { opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 0.5, repeat: status === 'CRITICAL' ? Infinity : 0 }}
          >
            {displayTime}
          </motion.p>
        </div>
        <div className="text-right">
          <motion.p
            className={`text-sm font-jetbrains font-bold ${getStatusColor()} uppercase tracking-wider`}
            animate={status === 'CRITICAL' ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, repeat: status === 'CRITICAL' ? Infinity : 0 }}
          >
            {getStatusText()}
          </motion.p>
          <p className="text-xs text-gray-500 font-jetbrains mt-1">
            {status === 'CRITICAL' && 'TIME RUNNING OUT!'}
            {status === 'WARNING' && 'HURRY!'}
            {status === 'CAUTION' && 'ACCELERATE'}
            {status === 'STABLE' && 'ON TRACK'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default Timer;
