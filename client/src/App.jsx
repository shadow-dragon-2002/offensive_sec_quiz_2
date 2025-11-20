import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';
import CompletionScreen from './components/CompletionScreen';
import Leaderboard from './components/Leaderboard';
import soundManager from './soundManager';
import axios from 'axios';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = '/api';

function App() {
  const [screen, setScreen] = useState('welcome'); // welcome, game, completion, leaderboard
  const [sessionData, setSessionData] = useState(null);
  const [completionData, setCompletionData] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize sound manager
    soundManager.init();
  }, []);

  const startGame = async () => {
    try {
      setError(null);
      soundManager.laser();
      
      const response = await axios.post('/session/start');
      
      if (response.data.success) {
        setSessionData(response.data);
        setScreen('game');
        soundManager.transition();
      }
    } catch (err) {
      console.error('Failed to start game:', err);
      
      if (err.response?.data?.hasStarted) {
        setError('Session already started. Refresh the page to view your current game or wait for it to complete.');
      } else {
        setError('Failed to start game. Please try again.');
      }
      soundManager.glitch();
    }
  };

  const handleGameComplete = (data) => {
    setCompletionData(data);
    setScreen('completion');
    soundManager.celebrate();
  };

  const handleViewLeaderboard = () => {
    setScreen('leaderboard');
    soundManager.beep();
  };

  const handleBackToWelcome = () => {
    setScreen('welcome');
    setSessionData(null);
    setCompletionData(null);
    setError(null);
    soundManager.beep();
  };

  const toggleMute = () => {
    const newMuteState = soundManager.toggleMute();
    setIsMuted(newMuteState);
    if (!newMuteState) {
      soundManager.beep();
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg relative overflow-hidden crt-effect">
      {/* Background Effects */}
      <div className="scan-lines"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-cyber-blue/10 via-ultraviolet/5 to-hot-pink/10 pointer-events-none"></div>
      
      {/* Additional neon glow spots */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-electric-blue/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-hot-pink/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Grid Overlay */}
      <div className="fixed inset-0 opacity-10 pointer-events-none" 
           style={{
             backgroundImage: 'linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)',
             backgroundSize: '50px 50px'
           }}>
      </div>

      {/* Mute Button */}
      {screen !== 'welcome' && (
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50 p-3 rounded-lg bg-dark-surface/80 border border-cyber-blue/30 hover:border-cyber-blue hover:bg-dark-surface backdrop-blur-sm transition-all"
          onClick={toggleMute}
          onMouseEnter={() => soundManager.hover()}
        >
          {isMuted ? (
            <span className="text-2xl">🔇</span>
          ) : (
            <span className="text-2xl">🔊</span>
          )}
        </motion.button>
      )}

      {/* Main Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {screen === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <WelcomeScreen 
                onStart={startGame}
                error={error}
              />
            </motion.div>
          )}

          {screen === 'game' && sessionData && (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GameScreen 
                sessionData={sessionData}
                onComplete={handleGameComplete}
              />
            </motion.div>
          )}

          {screen === 'completion' && completionData && (
            <motion.div
              key="completion"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CompletionScreen 
                data={completionData}
                onViewLeaderboard={handleViewLeaderboard}
                onBackToWelcome={handleBackToWelcome}
              />
            </motion.div>
          )}

          {screen === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Leaderboard 
                onBack={handleBackToWelcome}
                currentScore={completionData?.finalScore}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
