import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CyberpunkApp.css';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import Timer from './components/Timer';
import api from './utils/api';
import audioManager from './utils/audioManager';

function App() {
  const [gameState, setGameState] = useState('start'); // start, playing, result
  const [sessionData, setSessionData] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [apiReady, setApiReady] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking'); // checking, online, offline

  // Check API availability on component mount and periodically
  useEffect(() => {
    const checkAPI = async () => {
      try {
        const response = await api.get('/health');
        if (response.data && response.data.status === 'ok') {
          setApiReady(true);
          setBackendStatus('online');
          setError(null);
        }
      } catch (err) {
        console.error('API Health Check Failed:', err);
        setBackendStatus('offline');
        setApiReady(false);
        if (gameState === 'start') {
          setError('❌ Backend Server Offline - Expected at http://localhost:5000. Retrying automatically...');
        }
      }
    };

    // Initial check
    checkAPI();

    // Periodic checks (every 5 seconds when on start screen, less frequent otherwise)
    const checkInterval = gameState === 'start' ? 5000 : 15000;
    const healthCheckInterval = setInterval(() => {
      checkAPI();
    }, checkInterval);

    return () => clearInterval(healthCheckInterval);
  }, [gameState]);

  const startQuiz = async () => {
    try {
      setError(null);
      // Initialize audio on first user interaction
      audioManager.init();
      audioManager.playLaserSwoosh();
      
      if (!apiReady) {
        setError('Backend server is not available. Please start the backend server.');
        return;
      }
      const response = await api.post('/quiz/start');
      if (response.data.success) {
        setSessionData(response.data);
        setGameState('playing');
      } else {
        setError('Failed to start quiz. Please try again.');
      }
    } catch (err) {
      setError('Failed to start quiz. Please ensure the backend server is running.');
      console.error('Start quiz error:', err);
    }
  };

  const handleQuizComplete = (finalStats) => {
    setStats(finalStats);
    setGameState('result');
  };

  const handleSessionLocked = (finalStats) => {
    setStats(finalStats);
    setGameState('result');
  };

  const resetQuiz = async () => {
    try {
      await api.post('/quiz/reset');
      setGameState('start');
      setSessionData(null);
      setStats(null);
      setError(null);
    } catch (err) {
      console.error('Reset quiz error:', err);
      // Still reset locally even if API call fails
      setGameState('start');
      setSessionData(null);
      setStats(null);
      setError(null);
    }
  };

  return (
    <div className="App">
      {/* Animated Background Layers */}
      <div className="cyberpunk-bg" />
      <div className="grid-overlay" />
      <div className="scanline" />
      
      <header className="app-header">
        <motion.h1 
          className="neon-title glitch" 
          data-text="CYBER ESCAPE ROOM"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          CYBER ESCAPE ROOM
        </motion.h1>
        <motion.p 
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          OFFENSIVE SECURITY CHALLENGE
        </motion.p>
      </header>

      {gameState === 'playing' && sessionData && (
        <Timer 
          timeLimit={sessionData.timeLimit} 
          onTimeout={() => handleSessionLocked({ 
            score: 0, 
            correctAnswers: 0, 
            reason: 'timeout' 
          })}
        />
      )}

      <main className="main-content">
        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <span className="error-icon">⚠</span>
            <span className="error-text">SYSTEM ERROR:</span> {error}
            {!apiReady && (
              <p style={{ fontSize: '0.85em', marginTop: '10px', fontFamily: 'Share Tech Mono, monospace' }}>
                <span className="prompt">$</span> Backend expected at: http://localhost:5000
              </p>
            )}
          </motion.div>
        )}
        
        <AnimatePresence mode="wait">
          {gameState === 'start' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <StartScreen onStart={startQuiz} />
            </motion.div>
          )}
          
          {gameState === 'playing' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <QuizScreen 
                onComplete={handleQuizComplete}
                onSessionLocked={handleSessionLocked}
              />
            </motion.div>
          )}
          
          {gameState === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.5 }}
            >
              <ResultScreen 
                stats={stats}
                onRestart={resetQuiz}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="app-footer">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <p>SYSTEM v2.0.77 // NEURAL NETWORK ACTIVE // TIMESTAMP: {new Date().toISOString()}</p>
          <div className="backend-status" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontSize: '0.9em'
          }}>
            <span style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: backendStatus === 'online' ? '#00ff00' : backendStatus === 'checking' ? '#ffaa00' : '#ff0000',
              animation: backendStatus === 'checking' ? 'pulse 1s infinite' : 'none'
            }} />
            <span>{backendStatus === 'online' ? 'BACKEND ONLINE' : backendStatus === 'checking' ? 'CHECKING...' : 'BACKEND OFFLINE'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
