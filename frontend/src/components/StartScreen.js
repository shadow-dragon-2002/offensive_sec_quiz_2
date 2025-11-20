import React from 'react';
import { motion } from 'framer-motion';
import './StartScreen.css';

function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <motion.div 
        className="terminal-window"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="terminal-header">
          <div className="terminal-button red" />
          <div className="terminal-button yellow" />
          <div className="terminal-button green" />
          <span className="terminal-title">MISSION_BRIEFING.exe</span>
        </div>
        
        <div className="terminal-body">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p className="terminal-text">
              <span className="prompt">root@cyber-escape:~$</span> cat mission_brief.txt
            </p>
            <p className="terminal-text" style={{ marginTop: '1.5rem' }}>
              <span className="info-text">[CLASSIFIED]</span> Welcome, operative.
            </p>
            <p className="terminal-text">
              You've been selected for the ultimate cybersecurity challenge.
              Your mission: infiltrate 30 secured systems by solving
              progressively difficult offensive security puzzles.
            </p>
          </motion.div>

          <motion.div 
            className="mission-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <p className="terminal-text" style={{ marginTop: '2rem' }}>
              <span className="prompt">root@cyber-escape:~$</span> ./mission_parameters.sh
            </p>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">CHALLENGE STAGES:</span>
                <span className="stat-value">30</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">TIME LIMIT:</span>
                <span className="stat-value">25:00</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">STARTING POINTS:</span>
                <span className="stat-value">1000</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">PENALTY PER FAILURE:</span>
                <span className="stat-value">-50</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="mission-rules"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <p className="terminal-text" style={{ marginTop: '2rem' }}>
              <span className="warning-text">[PROTOCOL]</span> Mission Rules:
            </p>
            <ul className="rules-list">
              <li><span className="success-text">→</span> Each stage has 4 confusingly similar options</li>
              <li><span className="success-text">→</span> Wrong answers deduct 50 points from your score</li>
              <li><span className="success-text">→</span> No hints provided, no correct answers revealed</li>
              <li><span className="success-text">→</span> You can complete all 30 stages regardless of score</li>
              <li><span className="success-text">→</span> Timer is strict: 25 minutes for all stages</li>
              <li><span className="error-text">→</span> Once you start, there's no going back</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            style={{ textAlign: 'center', marginTop: '3rem' }}
          >
            <p className="terminal-text" style={{ marginBottom: '1.5rem' }}>
              <span className="info-text">[STATUS]</span> System ready. Awaiting authorization...
            </p>
            <button className="neon-button" onClick={onStart}>
              INITIATE MISSION
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default StartScreen;
