import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import soundManager from '../soundManager';

function CompletionScreen({ data, onViewLeaderboard, onBackToWelcome }) {
  const [playerName, setPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const getRank = (score) => {
    if (score >= 85) return { name: 'GOLD', color: 'text-yellow-500', emoji: '🥇' };
    if (score >= 70) return { name: 'SILVER', color: 'text-gray-300', emoji: '🥈' };
    if (score >= 50) return { name: 'BRONZE', color: 'text-orange-600', emoji: '🥉' };
    return { name: 'COMPLETE', color: 'text-gray-500', emoji: '✅' };
  };

  const rank = getRank(data.finalScore);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmitScore = async (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setSubmitError('Please enter your name');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      soundManager.beep();

      const response = await axios.post('/leaderboard', {
        playerName: playerName.trim(),
        score: data.finalScore,
        time: data.timeSpent
      });

      if (response.data.success) {
        setSubmitted(true);
        soundManager.celebrate();
        
        // Auto-navigate to leaderboard after 2 seconds
        setTimeout(() => {
          onViewLeaderboard();
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to submit score:', err);
      setSubmitError(err.response?.data?.message || 'Failed to submit score');
      soundManager.glitch();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl w-full"
      >
        {/* Title */}
        <motion.h1
          className="text-5xl md:text-7xl font-orbitron font-black text-center mb-4 holographic-text"
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          ⚡ BREACH COMPLETE ⚡
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-center text-xl font-jetbrains text-gray-400 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Neural link severed. Exfiltration successful.
        </motion.p>

        {/* Stats Card */}
        <motion.div
          className="cyber-card mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Rank Display */}
          <div className="text-center mb-8 p-6 bg-dark-surface/50 rounded-lg border border-current/30">
            <motion.div
              className="text-8xl mb-4"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {rank.emoji}
            </motion.div>
            <motion.h2
              className={`text-5xl font-orbitron font-black ${rank.color} mb-2`}
              animate={{ textShadow: ['0 0 10px currentColor', '0 0 30px currentColor', '0 0 10px currentColor'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {rank.name}
            </motion.h2>
            <p className="text-gray-400 font-jetbrains">
              {rank.name === 'GOLD' && 'Elite Operator'}
              {rank.name === 'SILVER' && 'Skilled Operative'}
              {rank.name === 'BRONZE' && 'Competent Hacker'}
              {rank.name === 'COMPLETE' && 'Persistent Learner'}
            </p>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-dark-surface/50 p-4 rounded-lg border border-neon-green/30 text-center">
              <p className="text-xs font-jetbrains text-gray-400 uppercase mb-2">
                Final Score
              </p>
              <p className="text-4xl font-orbitron font-black text-neon-green">
                {data.finalScore}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                out of 100
              </p>
            </div>

            <div className="bg-dark-surface/50 p-4 rounded-lg border border-cyber-blue/30 text-center">
              <p className="text-xs font-jetbrains text-gray-400 uppercase mb-2">
                Stages Completed
              </p>
              <p className="text-4xl font-orbitron font-black text-cyber-blue">
                {data.completedStages}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                out of 30
              </p>
            </div>

            <div className="bg-dark-surface/50 p-4 rounded-lg border border-cyber-pink/30 text-center">
              <p className="text-xs font-jetbrains text-gray-400 uppercase mb-2">
                Time Elapsed
              </p>
              <p className="text-4xl font-orbitron font-black text-cyber-pink">
                {formatTime(data.timeSpent)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                MM:SS
              </p>
            </div>
          </div>

          {/* Wrong Answers */}
          {data.wrongAnswers > 0 && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-8">
              <p className="text-center font-jetbrains">
                <span className="text-red-400 font-bold">Security Penalties:</span>{' '}
                <span className="text-white">{data.wrongAnswers} wrong answers</span>{' '}
                <span className="text-red-400">(-{data.wrongAnswers * 10} points)</span>
              </p>
            </div>
          )}

          {/* Submit to Leaderboard */}
          {!submitted ? (
            <form onSubmit={handleSubmitScore} className="space-y-4">
              <div>
                <label className="block text-sm font-jetbrains text-gray-400 uppercase mb-2">
                  Enter Your Codename for Leaderboard
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Agent_XXX"
                  maxLength={50}
                  className="w-full px-4 py-3 rounded-lg bg-dark-surface border border-cyber-blue/30 text-white font-jetbrains focus:border-cyber-blue focus:outline-none transition-colors"
                  onFocus={() => soundManager.hover()}
                />
              </div>

              {submitError && (
                <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded font-jetbrains text-sm">
                  {submitError}
                </div>
              )}

              <div className="flex gap-4">
                <motion.button
                  type="submit"
                  className="flex-1 cyber-button py-4 rounded-lg font-orbitron uppercase tracking-wider"
                  disabled={isSubmitting || !playerName.trim()}
                  onMouseEnter={() => soundManager.hover()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? 'SUBMITTING...' : '📊 SUBMIT TO LEADERBOARD'}
                </motion.button>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-neon-green/20 border border-neon-green rounded-lg p-6 text-center"
            >
              <div className="text-5xl mb-3">✓</div>
              <p className="font-orbitron font-bold text-neon-green text-xl mb-2">
                SCORE SUBMITTED
              </p>
              <p className="font-jetbrains text-gray-300">
                Redirecting to leaderboard...
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            className="flex-1 bg-gradient-to-r from-cyber-blue to-cyan-500 hover:from-cyber-blue/80 hover:to-cyan-500/80 py-4 rounded-lg font-orbitron font-bold uppercase tracking-wider transition-all"
            onClick={onViewLeaderboard}
            onMouseEnter={() => soundManager.hover()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🏆 VIEW LEADERBOARD
          </motion.button>
          
          <motion.button
            className="flex-1 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 py-4 rounded-lg font-orbitron font-bold uppercase tracking-wider transition-all"
            onClick={onBackToWelcome}
            onMouseEnter={() => soundManager.hover()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ← BACK TO WELCOME
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default CompletionScreen;
