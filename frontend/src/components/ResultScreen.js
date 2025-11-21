import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { submitScore, getLeaderboard } from '../utils/api';
import './ResultScreen.css';

function ResultScreen({ stats, onRestart }) {
  const [username, setUsername] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userRank, setUserRank] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [gradeInfo, setGradeInfo] = useState(null);
  const [error, setError] = useState(null);

  // Calculate stats
  const totalAttempts = (stats.correctAnswers || 0) + (stats.wrongAttempts || 0);
  const accuracyRate = totalAttempts > 0 ? ((stats.correctAnswers || 0) / totalAttempts) * 100 : 0;
  const timeRemainingMinutes = (stats.remainingTime || 0) / (60 * 1000);

  // Load leaderboard on mount
  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await getLeaderboard(100);
      if (response.success) {
        setLeaderboard(response.leaderboard);
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (username.length > 30) {
      setError('Username must be 30 characters or less');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await submitScore(username.trim());
      if (response.success) {
        setIsSubmitted(true);
        setUserRank(response.rank);
        setGradeInfo({
          grade: response.entry.grade,
          title: response.entry.gradeTitle,
          color: response.entry.gradeColor,
          icon: response.entry.gradeIcon,
          description: response.entry.gradeDescription
        });
        await loadLeaderboard(); // Refresh leaderboard
      }
    } catch (err) {
      setError(err.data?.message || 'Failed to submit score. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getResultMessage = () => {
    if (stats.completed) {
      return {
        title: '🎉 CHALLENGE COMPLETED! 🎉',
        message: 'Congratulations! You have successfully completed all 30 challenges!',
        class: 'success'
      };
    } else if (stats.locked) {
      return {
        title: '🔒 SESSION LOCKED',
        message: 'Your session has been locked due to an incorrect answer.',
        class: 'locked'
      };
    } else if (stats.reason === 'timeout') {
      return {
        title: '⏱️ TIME EXPIRED',
        message: 'Your session has expired. Time limit reached.',
        class: 'timeout'
      };
    } else {
      return {
        title: '❌ CHALLENGE ENDED',
        message: 'Your challenge session has ended.',
        class: 'ended'
      };
    }
  };

  const result = getResultMessage();

  return (
    <div className="result-screen">
      <motion.div 
        className={`result-container ${result.class}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="terminal-window result-terminal">
          <div className="terminal-header">
            <span className="terminal-button red"></span>
            <span className="terminal-button yellow"></span>
            <span className="terminal-button green"></span>
            <span className="terminal-title">MISSION_RESULTS.log</span>
          </div>
          <div className="terminal-body">
            <motion.h1 
              className="result-title"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {result.title}
            </motion.h1>
            <motion.p 
              className="result-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {result.message}
            </motion.p>

            {/* Stats Grid */}
            <motion.div 
              className="stats-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.div 
                className="stat-card"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9, type: "spring" }}
              >
                <div className="stat-icon">💯</div>
                <div className="stat-label">Final Score</div>
                <div className="stat-number">{stats.score || 0}</div>
              </motion.div>

              <motion.div 
                className="stat-card"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.0, type: "spring" }}
              >
                <div className="stat-icon">❌</div>
                <div className="stat-label">Wrong Attempts</div>
                <div className="stat-number">{stats.wrongAttempts || 0}</div>
              </motion.div>

              <motion.div 
                className="stat-card"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.1, type: "spring" }}
              >
                <div className="stat-icon">🎯</div>
                <div className="stat-label">Accuracy Rate</div>
                <div className="stat-number">{accuracyRate.toFixed(1)}%</div>
              </motion.div>

              <motion.div 
                className="stat-card"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring" }}
              >
                <div className="stat-icon">⏱️</div>
                <div className="stat-label">Time Remaining</div>
                <div className="stat-number">{timeRemainingMinutes.toFixed(1)}m</div>
              </motion.div>
            </motion.div>

            {/* Grade Display (if submitted) */}
            {isSubmitted && gradeInfo && (
              <motion.div 
                className="grade-banner"
                style={{ borderColor: gradeInfo.color }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <div className="grade-icon" style={{ color: gradeInfo.color }}>
                  {gradeInfo.icon}
                </div>
                <div className="grade-info">
                  <div className="grade-letter" style={{ color: gradeInfo.color }}>
                    GRADE: {gradeInfo.grade}
                  </div>
                  <div className="grade-title">{gradeInfo.title}</div>
                  <div className="grade-description">{gradeInfo.description}</div>
                </div>
              </motion.div>
            )}

            {/* Username Submission Form */}
            {!isSubmitted ? (
              <motion.div 
                className="username-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <h3 className="form-title">🏆 Submit Your Score to Leaderboard</h3>
                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username..."
                      maxLength={30}
                      className="username-input"
                      disabled={submitting}
                    />
                    <button 
                      type="submit" 
                      className="submit-btn"
                      disabled={submitting || !username.trim()}
                    >
                      {submitting ? 'Submitting...' : 'Submit Score'}
                    </button>
                  </div>
                  {error && <div className="error-message">{error}</div>}
                </form>
              </motion.div>
            ) : (
              <motion.div 
                className="submission-success"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                <div className="success-icon">✓</div>
                <p className="success-text">Score submitted successfully!</p>
                <p className="rank-text">Your Rank: #{userRank}</p>
              </motion.div>
            )}

            {/* Leaderboard Display */}
            {leaderboard.length > 0 && (
              <motion.div 
                className="leaderboard-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <h3 className="leaderboard-title">🏆 GLOBAL LEADERBOARD 🏆</h3>
                <div className="leaderboard-table">
                  <div className="leaderboard-header">
                    <span className="col-rank">Rank</span>
                    <span className="col-username">Username</span>
                    <span className="col-grade">Grade</span>
                    <span className="col-score">Score</span>
                    <span className="col-accuracy">Accuracy</span>
                    <span className="col-time">Time Left</span>
                  </div>
                  <div className="leaderboard-body">
                    {leaderboard.slice(0, 10).map((entry, index) => (
                      <div 
                        key={index} 
                        className={`leaderboard-row ${index < 3 ? 'top-three' : ''}`}
                      >
                        <span className="col-rank">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && `#${index + 1}`}
                        </span>
                        <span className="col-username">{entry.username}</span>
                        <span className="col-grade" style={{ color: entry.gradeColor }}>
                          {entry.gradeIcon} {entry.grade}
                        </span>
                        <span className="col-score">{entry.score}</span>
                        <span className="col-accuracy">{entry.accuracyRate.toFixed(1)}%</span>
                        <span className="col-time">{(entry.timeRemaining / 60000).toFixed(1)}m</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {stats.completed && (
              <div className="achievement-banner">
                <div className="achievement-glow"></div>
                <h3>🏆 ACHIEVEMENT UNLOCKED 🏆</h3>
                <p>Master of Offensive Security</p>
                <p className="achievement-desc">
                  You've proven your expertise by completing all 30 progressive challenges!
                </p>
              </div>
            )}

            <div className="terminal-footer">
              <p className="terminal-text">
                <span className="prompt">root@security:~$</span> ./analyze_performance
              </p>
              <p className="terminal-text">
                <span className="info-text">[i]</span> Total Attempts: {totalAttempts} | Accuracy: {accuracyRate.toFixed(1)}%
              </p>
              <p className="terminal-text">
                <span className="success-text">[✓]</span> Session analysis complete
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ResultScreen;
