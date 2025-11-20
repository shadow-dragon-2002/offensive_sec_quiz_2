import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import soundManager from '../soundManager';

function Leaderboard({ onBack }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/leaderboard');
      setLeaderboard(response.data);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error('Error loading leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankEmoji = (rank) => {
    switch (rank) {
      case 'GOLD': return '🥇';
      case 'SILVER': return '🥈';
      case 'BRONZE': return '🥉';
      default: return '✅';
    }
  };

  const getRankClassName = (rank) => {
    switch (rank) {
      case 'GOLD': return 'text-yellow-400';
      case 'SILVER': return 'text-gray-300';
      case 'BRONZE': return 'text-orange-400';
      default: return 'text-green-400';
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl w-full"
      >
        {/* Title */}
        <motion.h1
          className="holographic-text text-4xl md:text-6xl text-center mb-8"
          animate={{
            textShadow: [
              '0 0 20px rgba(0,240,255,0.8)',
              '0 0 40px rgba(255,0,255,0.8)',
              '0 0 20px rgba(0,240,255,0.8)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🏆 ELITE OPERATORS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-400 text-lg mb-8"
        >
          GLOBAL RANKINGS - TOP 10 INFILTRATORS
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="cyber-card scan-line"
        >
          {loading ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="text-cyan-400 text-6xl inline-block"
              >
                ⚡
              </motion.div>
              <p className="text-gray-400 mt-4">Loading rankings...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 text-xl mb-4">❌ {error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadLeaderboard}
                className="cyber-button px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg"
              >
                ↻ RETRY
              </motion.button>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-xl">No rankings yet. Be the first!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-cyan-400">
                    <th className="text-left py-4 px-4 text-cyan-400 font-orbitron">RANK</th>
                    <th className="text-left py-4 px-4 text-cyan-400 font-orbitron">AGENT</th>
                    <th className="text-center py-4 px-4 text-cyan-400 font-orbitron">SCORE</th>
                    <th className="text-center py-4 px-4 text-cyan-400 font-orbitron">TIME</th>
                    <th className="text-center py-4 px-4 text-cyan-400 font-orbitron">TIER</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ 
                        backgroundColor: 'rgba(0, 240, 255, 0.05)',
                        scale: 1.02
                      }}
                      className="border-b border-gray-800 transition-all"
                    >
                      <td className="py-4 px-4">
                        <span className="text-2xl">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && `#${index + 1}`}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono text-lg">
                        {entry.playerName}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-yellow-400 font-bold text-xl neon-glow">
                          {entry.score}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center text-gray-300 font-mono">
                        {formatTime(entry.completedTime)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`font-bold ${getRankClassName(entry.rank)}`}>
                          {getRankEmoji(entry.rank)} {entry.rank}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              onMouseEnter={() => soundManager.hover()}
              className="w-full py-4 rounded-lg font-orbitron font-bold text-lg bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white border-2 border-gray-600"
            >
              ← BACK TO WELCOME
            </motion.button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-600 text-xs mt-6"
        >
          Rankings update in real-time • Top 10 displayed
        </motion.p>
      </motion.div>
    </div>
  );
}

export default Leaderboard;
