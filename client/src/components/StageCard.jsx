import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import soundManager from '../soundManager';

function StageCard({ stage, onSubmitAnswer, isSubmitting }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);

  const getPhaseColor = (phase) => {
    const colors = {
      'RECONNAISSANCE': 'text-cyber-blue border-cyber-blue',
      'SCANNING': 'text-neon-green border-neon-green',
      'EXPLOITATION': 'text-hot-pink border-hot-pink',
      'PRIVILEGE_ESCALATION': 'text-cyber-purple border-cyber-purple',
      'LATERAL_MOVEMENT': 'text-electric-blue border-electric-blue',
      'EXFILTRATION': 'text-cyber-pink border-cyber-pink'
    };
    return colors[phase] || 'text-gray-400 border-gray-400';
  };

  const handleOptionSelect = (index) => {
    if (!isSubmitting && !answerResult) {
      setSelectedOption(index);
      soundManager.hover();
    }
  };

  const handleSubmit = async () => {
    if (selectedOption === null || isSubmitting || answerResult) return;

    soundManager.beep();
    
    try {
      const result = await onSubmitAnswer(selectedOption);
      setAnswerResult(result);
      
      if (result.isCorrect) {
        soundManager.correct();
      } else {
        soundManager.wrong();
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      soundManager.glitch();
    }
  };

  const handleNext = () => {
    soundManager.transition();
    // Reset state for next question
    setSelectedOption(null);
    setAnswerResult(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="cyber-card max-w-4xl mx-auto"
    >
      {/* Phase and Points Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className={`px-4 py-2 rounded border ${getPhaseColor(stage.phase)} bg-current/10 font-orbitron font-bold text-sm uppercase tracking-wider`}>
          {stage.phase.replace('_', ' ')}
        </div>
        <div className="px-4 py-2 rounded border border-yellow-500 text-yellow-500 bg-yellow-500/10 font-orbitron font-bold">
          +{stage.points} PTS
        </div>
      </div>

      {/* Title */}
      <motion.h2
        className="text-3xl md:text-4xl font-orbitron font-black holographic-text mb-4"
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        {stage.title}
      </motion.h2>

      {/* Description */}
      <p className="text-gray-400 font-jetbrains italic mb-6 text-sm">
        {stage.description}
      </p>

      {/* Question */}
      <div className="bg-dark-surface/50 p-6 rounded-lg border border-cyber-blue/30 mb-6">
        <p className="text-lg md:text-xl font-jetbrains text-gray-200 leading-relaxed">
          {stage.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {stage.options.map((option, index) => {
          const isSelected = selectedOption === index;
          const isCorrect = answerResult && answerResult.isCorrect && isSelected;
          const isWrong = answerResult && !answerResult.isCorrect && isSelected;
          
          return (
            <motion.button
              key={index}
              className={`w-full p-4 rounded-lg border-2 text-left font-jetbrains transition-all
                ${isSelected && !answerResult ? 'border-hot-pink bg-hot-pink/20 scale-105' : ''}
                ${!isSelected && !answerResult ? 'border-gray-700 bg-dark-surface/30 hover:border-cyber-blue hover:bg-dark-surface/50' : ''}
                ${isCorrect ? 'border-neon-green bg-neon-green/20 animate-pulse-glow' : ''}
                ${isWrong ? 'border-red-500 bg-red-500/20 animate-pulse' : ''}
                ${answerResult ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
              onClick={() => handleOptionSelect(index)}
              onMouseEnter={() => !answerResult && soundManager.hover()}
              disabled={isSubmitting || answerResult}
              whileHover={!answerResult ? { scale: 1.02 } : {}}
              whileTap={!answerResult ? { scale: 0.98 } : {}}
            >
              <div className="flex items-start gap-4">
                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold border-2
                  ${isSelected && !answerResult ? 'border-hot-pink bg-hot-pink/30 text-hot-pink' : ''}
                  ${!isSelected && !answerResult ? 'border-gray-600 bg-gray-800 text-gray-400' : ''}
                  ${isCorrect ? 'border-neon-green bg-neon-green/30 text-neon-green' : ''}
                  ${isWrong ? 'border-red-500 bg-red-500/30 text-red-500' : ''}
                `}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1 text-gray-200">
                  {option}
                </span>
                {isCorrect && (
                  <span className="text-neon-green text-2xl">✓</span>
                )}
                {isWrong && (
                  <span className="text-red-500 text-2xl">✗</span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Confirmation Banner */}
      <AnimatePresence>
        {selectedOption !== null && !answerResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-hot-pink/20 border border-hot-pink rounded-lg p-4 mb-6"
          >
            <p className="font-jetbrains text-hot-pink font-bold text-center">
              ⚡ PAYLOAD ARMED - Option {String.fromCharCode(65 + selectedOption)}) Selected
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Display */}
      <AnimatePresence>
        {answerResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`rounded-lg p-6 mb-6 border-2 ${
              answerResult.isCorrect
                ? 'bg-neon-green/20 border-neon-green'
                : 'bg-red-500/20 border-red-500'
            }`}
          >
            <div className="text-center">
              <div className={`text-6xl mb-3 ${answerResult.isCorrect ? 'text-neon-green' : 'text-red-500'}`}>
                {answerResult.isCorrect ? '✓' : '✗'}
              </div>
              <p className={`text-2xl font-orbitron font-bold mb-2 ${
                answerResult.isCorrect ? 'text-neon-green' : 'text-red-500'
              }`}>
                {answerResult.isCorrect ? 'PAYLOAD SUCCESSFUL' : 'PAYLOAD REJECTED'}
              </p>
              <p className="font-jetbrains text-gray-300">
                {answerResult.isCorrect
                  ? 'Access granted. Proceeding to next node...'
                  : `Access denied. Security penalty applied: ${answerResult.earnedPoints} points`
                }
              </p>
              <p className="font-jetbrains text-lg mt-3 text-cyber-blue">
                Current Score: {answerResult.currentScore}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {!answerResult ? (
          <motion.button
            className={`flex-1 cyber-button py-4 rounded-lg font-orbitron text-lg uppercase tracking-wider
              ${selectedOption === null || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={handleSubmit}
            disabled={selectedOption === null || isSubmitting}
            onMouseEnter={() => selectedOption !== null && soundManager.hover()}
            whileHover={selectedOption !== null ? { scale: 1.02 } : {}}
            whileTap={selectedOption !== null ? { scale: 0.98 } : {}}
          >
            {isSubmitting ? 'INJECTING...' : '⚡ INJECT PAYLOAD'}
          </motion.button>
        ) : (
          <motion.button
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 py-4 rounded-lg font-orbitron text-lg font-bold uppercase tracking-wider transition-all"
            onClick={handleNext}
            onMouseEnter={() => soundManager.hover()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            PROCEED TO NEXT NODE →
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default StageCard;
