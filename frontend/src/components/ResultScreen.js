import React from 'react';
import './ResultScreen.css';

function ResultScreen({ stats, onRestart }) {
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
  const scorePercentage = stats.correctAnswers ? (stats.correctAnswers / 30) * 100 : 0;

  const getRank = (percentage) => {
    if (percentage === 100) return { rank: 'ELITE HACKER', icon: '👑', color: '#ffd700' };
    if (percentage >= 90) return { rank: 'MASTER', icon: '⭐', color: '#00ff41' };
    if (percentage >= 70) return { rank: 'ADVANCED', icon: '🎖️', color: '#00d4ff' };
    if (percentage >= 50) return { rank: 'INTERMEDIATE', icon: '📊', color: '#ff6b6b' };
    if (percentage >= 30) return { rank: 'NOVICE', icon: '🔰', color: '#ffa500' };
    return { rank: 'BEGINNER', icon: '📝', color: '#888' };
  };

  const rankInfo = getRank(scorePercentage);

  return (
    <div className="result-screen">
      <div className={`result-container ${result.class}`}>
        <div className="terminal-window result-terminal">
          <div className="terminal-header">
            <span className="terminal-button red"></span>
            <span className="terminal-button yellow"></span>
            <span className="terminal-button green"></span>
            <span className="terminal-title">challenge_result.log</span>
          </div>
          <div className="terminal-body">
            <h1 className="result-title">{result.title}</h1>
            <p className="result-message">{result.message}</p>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">💯</div>
                <div className="stat-label">Final Score</div>
                <div className="stat-number">{stats.score || 0}</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✓</div>
                <div className="stat-label">Correct Answers</div>
                <div className="stat-number">{stats.correctAnswers || 0}/30</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-label">Success Rate</div>
                <div className="stat-number">{scorePercentage.toFixed(1)}%</div>
              </div>

              <div className="stat-card rank-card" style={{ borderColor: rankInfo.color }}>
                <div className="stat-icon">{rankInfo.icon}</div>
                <div className="stat-label">Your Rank</div>
                <div className="stat-number" style={{ color: rankInfo.color }}>
                  {rankInfo.rank}
                </div>
              </div>
            </div>

            <div className="progress-visualization">
              <div className="progress-label">
                <span>Challenge Progress</span>
                <span>{stats.correctAnswers || 0}/30 Levels</span>
              </div>
              <div className="progress-bar-full">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${scorePercentage}%`,
                    background: `linear-gradient(90deg, ${rankInfo.color}, #00ff41)`
                  }}
                >
                  <span className="progress-text">{scorePercentage.toFixed(0)}%</span>
                </div>
              </div>
            </div>

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
              {scorePercentage < 100 && (
                <p className="terminal-text">
                  <span className="info-text">[i]</span> Review the topics you struggled with
                </p>
              )}
              <p className="terminal-text">
                <span className="success-text">[✓]</span> Session analysis complete
              </p>
            </div>
          </div>
        </div>

        <button className="restart-button neon-button" onClick={onRestart}>
          <span className="button-text">START NEW CHALLENGE</span>
          <span className="button-icon">🔄</span>
        </button>
      </div>
    </div>
  );
}

export default ResultScreen;
