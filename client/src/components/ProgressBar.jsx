import React from 'react';
import { motion } from 'framer-motion';

function ProgressBar({ current, total }) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-jetbrains text-gray-400 uppercase tracking-wider">
          INFILTRATION DEPTH: {current}/{total} NODES
        </span>
        <motion.span
          className="text-sm font-jetbrains font-bold text-cyber-blue"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {percentage.toFixed(0)}%
        </motion.span>
      </div>
      
      <div className="relative h-4 bg-dark-surface/50 rounded-full overflow-hidden border border-cyber-blue/30">
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyber-blue via-cyber-pink to-neon-green"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Animated scan line */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default ProgressBar;
