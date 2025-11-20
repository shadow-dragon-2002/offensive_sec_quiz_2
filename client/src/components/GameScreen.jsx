import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Timer from './Timer';
import ProgressBar from './ProgressBar';
import StageCard from './StageCard';
import axios from 'axios';
import soundManager from '../soundManager';

function GameScreen({ sessionData, onComplete }) {
  const [currentStage, setCurrentStage] = useState(null);
  const [stageNumber, setStageNumber] = useState(sessionData.currentStage);
  const [score, setScore] = useState(sessionData.score);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    loadStage(stageNumber);
  }, [stageNumber]);

  const loadStage = async (stageId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`/stages/${stageId}`);
      
      if (response.data.success) {
        setCurrentStage(response.data.stage);
      }
    } catch (err) {
      console.error('Failed to load stage:', err);
      
      if (err.response?.data?.isCompleted) {
        handleComplete();
      } else if (err.response?.data?.timeExpired) {
        handleComplete();
      } else {
        setError('Failed to load stage. Please refresh the page.');
        soundManager.glitch();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async (answerId) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await axios.post(`/stages/${currentStage.id}/answer`, {
        answerId: answerId
      });

      if (response.data.success) {
        setScore(response.data.currentScore);

        // Wait a moment for user to see result
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (response.data.isCompleted) {
          handleComplete();
        } else if (response.data.nextStage) {
          setStageNumber(response.data.nextStage);
        }

        return response.data;
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
      setError('Failed to submit answer. Please try again.');
      soundManager.glitch();
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    try {
      const response = await axios.post('/session/complete');
      
      if (response.data.success) {
        onComplete({
          finalScore: response.data.finalScore,
          completedStages: response.data.completedStages,
          wrongAnswers: response.data.wrongAnswers,
          timeSpent: response.data.timeSpent
        });
      }
    } catch (err) {
      console.error('Failed to complete session:', err);
      // Still complete locally
      onComplete({
        finalScore: score,
        completedStages: stageNumber - 1,
        wrongAnswers: Math.floor((100 - score) / 10),
        timeSpent: Math.floor((Date.now() - startTime) / 1000)
      });
    }
  };

  const handleTimeout = () => {
    soundManager.glitch();
    handleComplete();
  };

  if (isLoading && !currentStage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            ⚡
          </motion.div>
          <p className="text-xl font-orbitron text-cyber-blue">
            INITIALIZING NODE...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-orbitron font-black text-center mb-6 holographic-text">
            ⚡ CYBER INFILTRATION ⚡
          </h1>

          {/* Stats Row */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {/* Stage Counter */}
            <div className="bg-dark-surface/50 p-4 rounded-lg border border-cyber-blue/30 text-center">
              <p className="text-xs font-jetbrains text-gray-400 uppercase mb-1">
                Current Node
              </p>
              <p className="text-3xl font-orbitron font-black text-cyber-blue">
                {stageNumber} <span className="text-gray-500">/</span> 30
              </p>
            </div>

            {/* Score */}
            <div className="bg-dark-surface/50 p-4 rounded-lg border border-neon-green/30 text-center">
              <p className="text-xs font-jetbrains text-gray-400 uppercase mb-1">
                Integrity Score
              </p>
              <motion.p
                className="text-3xl font-orbitron font-black text-neon-green"
                animate={{ textShadow: ['0 0 10px #00ff41', '0 0 20px #00ff41', '0 0 10px #00ff41'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {score}
              </motion.p>
            </div>

            {/* Phase Indicator */}
            <div className="bg-dark-surface/50 p-4 rounded-lg border border-cyber-pink/30 text-center">
              <p className="text-xs font-jetbrains text-gray-400 uppercase mb-1">
                Attack Phase
              </p>
              <p className="text-sm font-orbitron font-bold text-cyber-pink">
                {currentStage?.phase.replace('_', ' ')}
              </p>
            </div>
          </div>

          {/* Timer */}
          <div className="mb-6">
            <Timer
              startTime={startTime}
              timeLimit={sessionData.timeLimit}
              onTimeout={handleTimeout}
            />
          </div>

          {/* Progress Bar */}
          <ProgressBar current={stageNumber} total={30} />
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6 font-jetbrains"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚠️</span>
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {/* Stage Card */}
        <AnimatePresence mode="wait">
          {currentStage && (
            <StageCard
              key={currentStage.id}
              stage={currentStage}
              onSubmitAnswer={handleSubmitAnswer}
              isSubmitting={isSubmitting}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default GameScreen;
