import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import soundManager from '../soundManager';

function CompletionScreen({ sessionData, onViewLeaderboard, onBackToWelcome }) {
  const [playerName, setPlayerName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const calculateRank = (score) => {
    if (score >= 85) return 'GOLD';
    if (score >= 70) return 'SILVER';
    if (score >= 50) return 'BRONZE';
    return 'COMPLETE';
  };

  const rank = calculateRank(sessionData.score);
  const finalTime = sessionData.time || 0;
  const minutes = Math.floor(finalTime / 60);
  const seconds = finalTime % 60;

  const getRankClassName = (rank) => {
    switch (rank) {
      case 'GOLD': return 'rank-gold';
      case 'SILVER': return 'rank-silver';
      case 'BRONZE': return 'rank-bronze';
      default: return 'rank-complete';
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

  const handleSubmit = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      await axios.post('/api/leaderboard', {
        playerName: playerName.trim(),
        score: sessionData.score,
        time: finalTime
      });

      setSubmitted(true);
      soundManager.celebrate();
      
      // Auto-navigate to leaderboard after 2 seconds
      setTimeout(() => {
        onViewLeaderboard();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit score');
      soundManager.glitch();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
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
          ⚡ BREACH COMPLETE ⚡
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="cyber-card scan-line"
        >
          <p className="text-center text-gray-400 text-lg mb-8 italic">
            Neural link severed. Exfiltration successful.
          </p>

          {/* Stats Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-black/50 border-2 border-cyan-400 rounded-lg p-6 text-center">
              <div className="text-gray-400 text-sm mb-2">FINAL SCORE</div>
              <div className="text-5xl font-bold text-yellow-400 neon-glow">
                {sessionData.score}
              </div>
              <div className="text-gray-500 text-xs mt-2">out of 100</div>
            </div>

            <div className="bg-black/50 border-2 border-neon-green rounded-lg p-6 text-center">
              <div className="text-gray-400 text-sm mb-2">STAGES COMPLETED</div>
              <div className="text-5xl font-bold text-neon-green neon-glow-green">
                {sessionData.completedStages || 30}
              </div>
              <div className="text-gray-500 text-xs mt-2">out of 30</div>
            </div>

            <div className="bg-black/50 border-2 border-hot-pink rounded-lg p-6 text-center">
              <div className="text-gray-400 text-sm mb-2">TIME ELAPSED</div>
              <div className="text-5xl font-bold text-hot-pink neon-glow-pink">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-gray-500 text-xs mt-2">minutes</div>
            </div>
          </div>

          {/* Rank Display */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="text-center mb-8"
          >
            <div className="text-gray-400 text-sm mb-2">YOUR RANK</div>
            <div className={`text-7xl md:text-8xl font-orbitron font-black ${getRankClassName(rank)}`}>
              {getRankEmoji(rank)} {rank}
            </div>
            <div className="text-gray-500 text-sm mt-2">
              {rank === 'GOLD' && 'Elite Operator'}
              {rank === 'SILVER' && 'Skilled Operative'}
              {rank === 'BRONZE' && 'Competent Hacker'}
              {rank === 'COMPLETE' && 'Persistent Learner'}
            </div>
          </motion.div>

          {/* Leaderboard Submission */}
          {!submitted ? (
            <div className="mb-8">
              <label className="block text-gray-400 text-sm mb-2">
                AGENT DESIGNATION (NAME):
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Enter your name..."
                maxLength={50}
                className="cyber-input mb-4"
              />

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm mb-4 text-center"
                >
                  ❌ {error}
                </motion.p>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={submitting || !playerName.trim()}
                onMouseEnter={() => soundManager.hover()}
                className={`
                  w-full py-4 rounded-lg font-orbitron font-bold text-lg transition-all
                  ${submitting || !playerName.trim()
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-2 border-purple-400 box-glow'
                  }
                `}
              >
                {submitting ? '⚡ SUBMITTING...' : '⚡ SUBMIT TO LEADERBOARD'}
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 bg-green-900/30 border-2 border-neon-green rounded-lg"
            >
              <p className="text-neon-green font-bold text-center text-lg">
                ✓ Score submitted successfully!
              </p>
              <p className="text-gray-400 text-center text-sm mt-2">
                Redirecting to leaderboard...
              </p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewLeaderboard}
              onMouseEnter={() => soundManager.hover()}
              className="flex-1 py-4 rounded-lg font-orbitron font-bold text-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-2 border-cyan-400"
            >
              🏆 VIEW LEADERBOARD
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBackToWelcome}
              onMouseEnter={() => soundManager.hover()}
              className="flex-1 py-4 rounded-lg font-orbitron font-bold text-lg bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white border-2 border-gray-600"
            >
              ← BACK TO WELCOME
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default CompletionScreen;
