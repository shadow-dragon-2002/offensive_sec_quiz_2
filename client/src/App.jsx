import { useState, useEffect } from 'react';
import axios from 'axios';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';
import CompletionScreen from './components/CompletionScreen';
import Leaderboard from './components/Leaderboard';
import soundManager from './soundManager';

function App() {
  const [screen, setScreen] = useState('welcome'); // welcome, game, completion, leaderboard
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await axios.get('/api/session/status');
      setSessionData(response.data);
      
      // If session exists and not completed, go to game screen
      if (response.data && !response.data.isCompleted) {
        setScreen('game');
      } else if (response.data && response.data.isCompleted) {
        setScreen('completion');
      }
    } catch (err) {
      // No session exists, stay on welcome screen
      if (err.response?.status !== 404) {
        console.error('Error checking session:', err);
      }
    }
  };

  const startGame = async () => {
    try {
      setError(null);
      const response = await axios.post('/api/session/start');
      setSessionData(response.data.session);
      setScreen('game');
      soundManager.laser();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to start game');
      soundManager.glitch();
    }
  };

  const completeGame = async () => {
    try {
      const response = await axios.post('/api/session/complete');
      setSessionData(prev => ({
        ...prev,
        ...response.data,
        isCompleted: true
      }));
      setScreen('completion');
      soundManager.celebrate();
    } catch (err) {
      console.error('Error completing game:', err);
    }
  };

  const viewLeaderboard = () => {
    setScreen('leaderboard');
    soundManager.transition();
  };

  const backToWelcome = () => {
    setScreen('welcome');
    soundManager.transition();
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundManager.setEnabled(!newMuted);
    soundManager.beep();
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {screen === 'welcome' && (
        <WelcomeScreen 
          onStart={startGame} 
          onViewLeaderboard={viewLeaderboard}
          error={error}
        />
      )}
      
      {screen === 'game' && sessionData && (
        <GameScreen 
          sessionData={sessionData}
          setSessionData={setSessionData}
          onComplete={completeGame}
          isMuted={isMuted}
          onToggleMute={toggleMute}
        />
      )}
      
      {screen === 'completion' && sessionData && (
        <CompletionScreen 
          sessionData={sessionData}
          onViewLeaderboard={viewLeaderboard}
          onBackToWelcome={backToWelcome}
        />
      )}
      
      {screen === 'leaderboard' && (
        <Leaderboard 
          onBack={backToWelcome}
        />
      )}
    </div>
  );
}

export default App;
