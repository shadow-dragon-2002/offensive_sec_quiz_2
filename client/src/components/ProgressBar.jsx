import { motion } from 'framer-motion';

function ProgressBar({ current, total }) {
  const percentage = Math.round(((current || 0) / total) * 100) || 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-mono text-gray-400">
          INFILTRATION DEPTH: {current}/{total} NODES
        </span>
        <motion.span 
          className="text-sm font-bold text-cyber-blue"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {percentage}%
        </motion.span>
      </div>
      
      <div className="progress-bar-container">
        <motion.div 
          className="progress-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
