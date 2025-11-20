import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Timer from './Timer';
import ProgressBar from './ProgressBar';
import StageCard from './StageCard';
import soundManager from '../soundManager';

function GameScreen({ sessionData, setSessionData, onComplete, isMuted, onToggleMute }) {
  const [currentStage, setCurrentStage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Load current stage
  useEffect(() => {
    loadStage(sessionData.currentStage);
  }, [sessionData.currentStage]);

  const loadStage = async (stageId) => {
    try {
      setLoading(true);
      setError(null);
      setIsAnswered(false);
      setWasCorrect(false);
      
      const response = await axios.get(`/api/stages/${stageId}`);
      setCurrentStage(response.data);
    } catch (err) {
      setError('Failed to load stage');
      console.error('Error loading stage:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (answerId) => {
    try {
      setError(null);
      const response = await axios.post(
        `/api/stages/${currentStage.id}/answer`,
        { answerId }
      );

      setIsAnswered(true);
      setWasCorrect(response.data.isCorrect);
      
      // Play sound
      if (response.data.isCorrect) {
        soundManager.correct();
      } else {
        soundManager.wrong();
      }

      // Update session data
      setSessionData(prev => ({
        ...prev,
        score: response.data.currentScore,
        wrongAnswers: response.data.wrongAnswers
      }));

      setRetryCount(0);
    } catch (err) {
      // Handle retry with exponential backoff
      if (err.response?.status === 429) {
        const delay = Math.pow(2, retryCount) * 1000;
        setError(`Rate limited. Retry in ${delay / 1000}s`);
        setRetryCount(prev => prev + 1);
        
        setTimeout(() => {
          setError(null);
        }, delay);
      } else {
        setError(err.response?.data?.error || 'Failed to submit answer');
      }
      soundManager.glitch();
      console.error('Error submitting answer:', err);
    }
  };

  const handleNext = async () => {
    try {
      // Update progress
      await axios.post('/api/session/progress');
      
      const nextStage = sessionData.currentStage + 1;
      
      // Check if completed all stages
      if (nextStage > 30) {
        onComplete();
      } else {
        setSessionData(prev => ({
          ...prev,
          currentStage: nextStage,
          completedStages: prev.completedStages + 1
        }));
      }
    } catch (err) {
      setError('Failed to progress to next stage');
      console.error('Error progressing:', err);
    }
  };

  const handleTimeout = () => {
    onComplete();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-cyan-400 text-6xl"
        >
          ⚡
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="cyber-card">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Title and Stage Counter */}
            <div className="flex-1">
              <h1 className="holographic-text text-3xl md:text-4xl mb-2 text-center lg:text-left">
                ⚡ CYBER INFILTRATION ⚡
              </h1>
              <p className="text-gray-400 text-sm text-center lg:text-left">
                STAGE {sessionData.currentStage} / 30
              </p>
            </div>

            {/* Timer */}
            <div className="w-full lg:w-auto">
              <Timer 
                timeRemaining={sessionData.timeRemaining} 
                onTimeout={handleTimeout}
              />
            </div>

            {/* Score and Audio Toggle */}
            <div className="flex flex-col gap-3 items-center">
              <div className="text-center">
                <div className="text-xs text-gray-400 font-mono">SCORE</div>
                <motion.div 
                  className="text-4xl font-bold text-yellow-400 neon-glow"
                  animate={{ textShadow: [
                    '0 0 10px rgba(255,215,0,0.5)',
                    '0 0 20px rgba(255,215,0,0.8)',
                    '0 0 10px rgba(255,215,0,0.5)'
                  ]}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {sessionData.score}
                </motion.div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onToggleMute}
                className="text-2xl"
              >
                {isMuted ? '🔇' : '🔊'}
              </motion.button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <ProgressBar 
              current={sessionData.completedStages} 
              total={30}
            />
          </div>
        </div>
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto mb-6 p-4 bg-red-900/30 border-2 border-red-500 rounded-lg"
          >
            <p className="text-red-400 font-bold text-center">❌ {error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage Card */}
      {currentStage && (
        <AnimatePresence mode="wait">
          <StageCard
            key={currentStage.id}
            stage={currentStage}
            onAnswer={handleAnswer}
            onNext={handleNext}
            isAnswered={isAnswered}
            wasCorrect={wasCorrect}
          />
        </AnimatePresence>
      )}
    </div>
  );
}

export default GameScreen;
