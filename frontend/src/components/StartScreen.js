import React from 'react';
import './StartScreen.css';

function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <div className="terminal-window">
        <div className="terminal-header">
          <span className="terminal-button red"></span>
          <span className="terminal-button yellow"></span>
          <span className="terminal-button green"></span>
          <span className="terminal-title">system_init.exe</span>
        </div>
        <div className="terminal-body">
          <p className="terminal-text">
            <span className="prompt">root@security:~$</span> ./initialize_challenge
          </p>
          <p className="terminal-text">
            <span className="success-text">[✓]</span> System initialized
          </p>
          <p className="terminal-text">
            <span className="success-text">[✓]</span> Loading challenge database...
          </p>
          <p className="terminal-text">
            <span className="info-text">[i]</span> 30 progressive security challenges detected
          </p>
          <div className="challenge-info">
            <h2>MISSION BRIEFING</h2>
            <ul>
              <li>🎯 <strong>Objective:</strong> Complete 30 progressive offensive security challenges</li>
              <li>⏱️ <strong>Time Limit:</strong> 30 minutes</li>
              <li>🔒 <strong>Warning:</strong> One wrong answer locks your session permanently</li>
              <li>💯 <strong>Scoring:</strong> Earn points for each correct answer (10-30 points)</li>
              <li>📈 <strong>Progression:</strong> Each level unlocks after completing the previous one</li>
            </ul>
            <div className="difficulty-levels">
              <h3>CHALLENGE CATEGORIES:</h3>
              <div className="categories">
                <span className="category easy">🔍 Reconnaissance</span>
                <span className="category medium">🌐 Web Exploitation</span>
                <span className="category medium">💥 Exploitation</span>
                <span className="category hard">🎯 Post-Exploitation</span>
                <span className="category hard">⬆️ Privilege Escalation</span>
                <span className="category expert">🔐 Persistence & Advanced</span>
              </div>
            </div>
          </div>
          <p className="terminal-text warning">
            <span className="warning-text">[!]</span> Are you ready to begin the challenge?
          </p>
        </div>
      </div>
      <button className="start-button neon-button" onClick={onStart}>
        <span className="button-text">INITIATE CHALLENGE</span>
        <span className="button-icon">▶</span>
      </button>
    </div>
  );
}

export default StartScreen;
