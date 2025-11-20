import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import soundManager from '../soundManager';

function Leaderboard({ onBack, currentScore }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get('/leaderboard');

      if (response.data.success) {
        setLeaderboard(response.data.leaderboard);
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
      setError('Failed to load leaderboard. Please try again.');
      soundManager.glitch();
    } finally {
      setIsLoading(false);
    }
  };

  const getRankColor = (rank) => {
    const colors = {
      'GOLD': 'text-yellow-500',
      'SILVER': 'text-gray-300',
      'BRONZE': 'text-orange-600',
      'COMPLETE': 'text-gray-500'
    };
    return colors[rank] || 'text-gray-500';
  };

  const getRankEmoji = (rank) => {
    const emojis = {
      'GOLD': '🥇',
      'SILVER': '🥈',
      'BRONZE': '🥉',
      'COMPLETE': '✅'
    };
    return emojis[rank] || '✅';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            🏆
          </motion.div>
          <p className="text-xl font-orbitron text-cyber-blue">
            LOADING RANKINGS...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl w-full"
      >
        {/* Title */}
        <motion.h1
          className="text-4xl md:text-6xl font-orbitron font-black text-center mb-4 holographic-text"
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          🏆 ELITE OPERATORS 🏆
        </motion.h1>

        <motion.p
          className="text-center text-xl font-jetbrains text-gray-400 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Global Rankings - Top Infiltrators
        </motion.p>

        {/* Leaderboard Card */}
        <motion.div
          className="cyber-card mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {error ? (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-6 rounded-lg text-center">
              <p className="font-jetbrains text-lg mb-4">{error}</p>
              <button
                className="cyber-button px-6 py-3 rounded-lg font-orbitron uppercase"
                onClick={loadLeaderboard}
                onMouseEnter={() => soundManager.hover()}
              >
                RETRY
              </button>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-xl font-orbitron text-gray-400 mb-2">
                No Rankings Yet
              </p>
              <p className="font-jetbrains text-gray-500">
                Be the first to complete the challenge and claim your spot!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-cyber-blue">
                    <th className="text-left py-3 px-4 font-orbitron font-bold text-cyber-blue uppercase text-sm">
                      Rank
                    </th>
                    <th className="text-left py-3 px-4 font-orbitron font-bold text-cyber-blue uppercase text-sm">
                      Agent
                    </th>
                    <th className="text-center py-3 px-4 font-orbitron font-bold text-cyber-blue uppercase text-sm">
                      Score
                    </th>
                    <th className="text-center py-3 px-4 font-orbitron font-bold text-cyber-blue uppercase text-sm">
                      Time
                    </th>
                    <th className="text-center py-3 px-4 font-orbitron font-bold text-cyber-blue uppercase text-sm">
                      Tier
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => {
                    const isCurrentPlayer = currentScore && entry.score === currentScore;
                    
                    return (
                      <motion.tr
                        key={entry.id}
                        className={`border-b border-gray-800 hover:bg-dark-surface/30 transition-colors
                          ${isCurrentPlayer ? 'bg-cyber-blue/10' : ''}
                        `}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onMouseEnter={() => soundManager.hover()}
                      >
                        {/* Position */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">
                              {index === 0 && '🥇'}
                              {index === 1 && '🥈'}
                              {index === 2 && '🥉'}
                              {index > 2 && (
                                <span className="font-orbitron font-bold text-gray-500">
                                  #{index + 1}
                                </span>
                              )}
                            </span>
                          </div>
                        </td>

                        {/* Player Name */}
                        <td className="py-4 px-4">
                          <span className={`font-jetbrains font-bold ${
                            isCurrentPlayer ? 'text-cyber-blue' : 'text-gray-200'
                          }`}>
                            {entry.playerName}
                            {isCurrentPlayer && (
                              <span className="ml-2 text-xs text-cyber-blue">
                                (YOU)
                              </span>
                            )}
                          </span>
                        </td>

                        {/* Score */}
                        <td className="py-4 px-4 text-center">
                          <motion.span
                            className="text-2xl font-orbitron font-black text-neon-green"
                            animate={index === 0 ? { 
                              textShadow: ['0 0 10px #00ff41', '0 0 20px #00ff41', '0 0 10px #00ff41'] 
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {entry.score}
                          </motion.span>
                        </td>

                        {/* Time */}
                        <td className="py-4 px-4 text-center">
                          <span className="font-jetbrains text-gray-400">
                            {formatTime(entry.completedTime)}
                          </span>
                        </td>

                        {/* Rank Badge */}
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${getRankColor(entry.rank)} border-current bg-current/10 font-orbitron font-bold text-xs`}>
                            <span>{getRankEmoji(entry.rank)}</span>
                            <span>{entry.rank}</span>
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Back Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            className="cyber-button px-12 py-4 rounded-lg font-orbitron text-lg uppercase tracking-wider"
            onClick={onBack}
            onMouseEnter={() => soundManager.hover()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← BACK TO WELCOME
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Leaderboard;
