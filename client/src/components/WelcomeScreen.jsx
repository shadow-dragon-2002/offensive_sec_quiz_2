import { motion } from 'framer-motion';
import soundManager from '../soundManager';

function WelcomeScreen({ onStart, onViewLeaderboard, error }) {
  const handleStart = () => {
    soundManager.beep();
    onStart();
  };

  const handleLeaderboard = () => {
    soundManager.beep();
    onViewLeaderboard();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full"
      >
        {/* Title */}
        <motion.h1 
          className="holographic-text text-5xl md:text-7xl text-center mb-8"
          animate={{ 
            textShadow: [
              '0 0 20px rgba(0,240,255,0.8)',
              '0 0 40px rgba(255,0,255,0.8)',
              '0 0 20px rgba(0,240,255,0.8)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ⚡ CYBER INFILTRATION ⚡
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="cyber-card scan-line"
        >
          <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-cyber-blue mb-6 text-center">
            RED TEAM OPERATIONS - ESCAPE ROOM
          </h2>

          {/* Mission Briefing */}
          <div className="space-y-4 mb-8 text-gray-300">
            <p className="text-lg">
              <span className="text-cyber-pink font-bold">⚡ MISSION BRIEFING:</span>
            </p>
            <ul className="space-y-2 pl-6 text-sm md:text-base">
              <li className="text-neon-green">✓ Infiltrate 30 progressive security stages</li>
              <li className="text-cyber-blue">✓ Navigate 6 attack phases: Reconnaissance → Exfiltration</li>
              <li className="text-hot-pink">✓ 25-minute time limit - no checkpoints</li>
              <li className="text-cyber-purple">✓ Score: Start at 100, -10 per wrong answer</li>
              <li className="text-electric-blue">✓ Complete all stages regardless of score</li>
            </ul>

            <p className="text-lg mt-6">
              <span className="text-hot-pink font-bold">⚠ NEURAL PROTOCOL CONSTRAINTS:</span>
            </p>
            <ul className="space-y-2 pl-6 text-sm md:text-base">
              <li className="text-yellow-400">⚡ One-time playthrough per session (no restarts)</li>
              <li className="text-yellow-400">⚡ Linear progression (stages must be completed in order)</li>
              <li className="text-yellow-400">⚡ Session persists across page refreshes</li>
              <li className="text-yellow-400">⚡ Auto-fail at 00:00 timeout</li>
            </ul>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-red-900/30 border-2 border-red-500 rounded-lg"
            >
              <p className="text-red-400 font-bold">❌ ERROR: {error}</p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              onMouseEnter={() => soundManager.hover()}
              className="cyber-button w-full md:w-auto px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-2 border-cyan-400 text-white font-orbitron font-bold text-lg rounded-lg shadow-lg box-glow"
            >
              ⚡ INITIATE OPERATION
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLeaderboard}
              onMouseEnter={() => soundManager.hover()}
              className="cyber-button w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border-2 border-purple-400 text-white font-orbitron font-bold text-lg rounded-lg shadow-lg"
            >
              🏆 VIEW RANKINGS
            </motion.button>
          </div>

          {/* Flavor Text */}
          <motion.p 
            className="text-center text-gray-500 text-sm mt-8 italic"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            "The matrix has you. Follow the white rabbit."
          </motion.p>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-600 text-xs mt-6"
        >
          Offensive Security Educational Quiz • No external tools required • All skills tested server-side
        </motion.p>
      </motion.div>
    </div>
  );
}

export default WelcomeScreen;
