import React, { useState } from 'react';
import './App.css';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import Timer from './components/Timer';
import api from './utils/api';

function App() {
  const [gameState, setGameState] = useState('start'); // start, playing, result
  const [sessionData, setSessionData] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const startQuiz = async () => {
    try {
      setError(null);
      const response = await api.post('/quiz/start');
      if (response.data.success) {
        setSessionData(response.data);
        setGameState('playing');
      }
    } catch (err) {
      setError('Failed to start quiz. Please try again.');
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
      <div className="cyberpunk-bg"></div>
      <div className="grid-overlay"></div>
      
      <header className="app-header">
        <h1 className="neon-title">
          <span className="glitch" data-text="OFFENSIVE SECURITY">OFFENSIVE SECURITY</span>
        </h1>
        <p className="subtitle">Cybersecurity Challenge Arena</p>
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
        {error && <div className="error-message">{error}</div>}
        
        {gameState === 'start' && (
          <StartScreen onStart={startQuiz} />
        )}
        
        {gameState === 'playing' && (
          <QuizScreen 
            onComplete={handleQuizComplete}
            onSessionLocked={handleSessionLocked}
          />
        )}
        
        {gameState === 'result' && (
          <ResultScreen 
            stats={stats}
            onRestart={resetQuiz}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2024 Offensive Security Quiz | Educational Purpose Only</p>
      </footer>
    </div>
  );
}

export default App;
