import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function Timer({ timeRemaining, onTimeout }) {
  const [localTime, setLocalTime] = useState(timeRemaining);

  useEffect(() => {
    setLocalTime(timeRemaining);
  }, [timeRemaining]);

  useEffect(() => {
    if (localTime <= 0) {
      onTimeout?.();
      return;
    }

    const timer = setInterval(() => {
      setLocalTime(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [localTime, onTimeout]);

  const minutes = Math.floor(localTime / 60);
  const seconds = localTime % 60;
  const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Determine status
  let status = 'STABLE';
  let statusColor = 'text-cyan-400';
  let bgColor = 'from-cyan-900/20 to-blue-900/20';
  let borderColor = 'border-cyan-400';
  
  if (localTime <= 300) { // 5 minutes
    status = 'WARNING';
    statusColor = 'text-yellow-400';
    bgColor = 'from-yellow-900/20 to-orange-900/20';
    borderColor = 'border-yellow-400';
  }
  
  if (localTime <= 180) { // 3 minutes
    status = 'CRITICAL';
    statusColor = 'text-red-400';
    bgColor = 'from-red-900/20 to-red-900/20';
    borderColor = 'border-red-400';
  }

  const isCritical = localTime <= 180;
  const isBlinking = localTime <= 60;

  return (
    <motion.div
      animate={isCritical ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 1, repeat: isCritical ? Infinity : 0 }}
      className={`bg-gradient-to-r ${bgColor} border-2 ${borderColor} rounded-lg p-4 ${isBlinking ? 'blink' : ''}`}
    >
      <div className="text-center">
        <div className="text-xs text-gray-400 font-mono mb-1">NEURAL COUNTDOWN</div>
        <div className={`text-4xl font-mono font-bold ${statusColor} neon-glow`}>
          {formatted}
        </div>
        <div className={`text-xs font-bold mt-1 ${statusColor}`}>
          {status === 'STABLE' && '✓ STABLE'}
          {status === 'WARNING' && '⚡ WARNING'}
          {status === 'CRITICAL' && '⚠ CRITICAL'}
        </div>
      </div>
    </motion.div>
  );
}

export default Timer;
