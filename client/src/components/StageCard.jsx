import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import soundManager from '../soundManager';

function StageCard({ stage, onAnswer, onNext, isAnswered, wasCorrect }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    soundManager.beep();
  };

  const handleSubmit = async () => {
    if (selectedOption === null || isAnswered || isSubmitting) return;
    
    setIsSubmitting(true);
    soundManager.laser();
    
    try {
      await onAnswer(selectedOption);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    soundManager.transition();
    onNext();
  };

  const getPhaseClassName = (phase) => {
    return `phase-${phase.toLowerCase()}`;
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="cyber-card scan-line w-full max-w-4xl mx-auto"
    >
      {/* Phase Badge */}
      <div className="flex justify-between items-start mb-4">
        <span className={`phase-badge ${getPhaseClassName(stage.phase)}`}>
          {stage.phase.replace('_', ' ')}
        </span>
        <span className="text-yellow-400 font-bold text-lg">
          +{stage.points} PTS
        </span>
      </div>

      {/* Title */}
      <h2 className="holographic-text text-3xl md:text-4xl mb-4">
        {stage.title}
      </h2>

      {/* Description */}
      <p className="text-gray-400 italic mb-6 text-sm md:text-base">
        {stage.description}
      </p>

      {/* Question */}
      <div className="bg-black/50 border-2 border-cyan-400/30 rounded-lg p-6 mb-6">
        <p className="text-lg md:text-xl text-white font-semibold">
          {stage.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {stage.options.map((option, index) => {
          const isSelected = selectedOption === index;
          const showResult = isAnswered;
          const isThisCorrect = showResult && wasCorrect && isSelected;
          const isThisWrong = showResult && !wasCorrect && isSelected;

          return (
            <motion.button
              key={index}
              whileHover={!isAnswered ? { scale: 1.02 } : {}}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
              onClick={() => handleSelectOption(index)}
              onMouseEnter={() => !isAnswered && soundManager.hover()}
              disabled={isAnswered}
              className={`
                w-full text-left p-4 rounded-lg border-2 transition-all duration-300
                ${!showResult && !isSelected ? 'bg-gray-900/50 border-gray-700 hover:border-cyan-400' : ''}
                ${!showResult && isSelected ? 'bg-gradient-to-r from-hot-pink/20 to-hot-pink/10 border-hot-pink border-4 box-glow-pink scale-105' : ''}
                ${isThisCorrect ? 'bg-gradient-to-r from-green-900/50 to-green-700/30 border-neon-green border-4 box-glow-green' : ''}
                ${isThisWrong ? 'bg-gradient-to-r from-red-900/50 to-red-700/30 border-red-500 border-4 pulse-glow' : ''}
                ${showResult && !isSelected ? 'opacity-50' : ''}
              `}
            >
              <div className="flex items-start gap-3">
                <span className={`
                  font-bold text-lg flex-shrink-0 w-8 h-8 flex items-center justify-center rounded border-2
                  ${!showResult && !isSelected ? 'border-gray-500 text-gray-500' : ''}
                  ${!showResult && isSelected ? 'border-hot-pink text-hot-pink' : ''}
                  ${isThisCorrect ? 'border-neon-green text-neon-green' : ''}
                  ${isThisWrong ? 'border-red-500 text-red-500' : ''}
                `}>
                  {optionLabels[index]}
                </span>
                <span className="flex-1 text-sm md:text-base">
                  {option}
                </span>
                {isThisCorrect && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-neon-green text-2xl"
                  >
                    ✓
                  </motion.span>
                )}
                {isThisWrong && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-red-500 text-2xl"
                  >
                    ✗
                  </motion.span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Selection Confirmation Banner */}
      <AnimatePresence>
        {selectedOption !== null && !isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-hot-pink/20 border-2 border-hot-pink rounded-lg p-4 mb-4"
          >
            <p className="text-hot-pink font-bold text-center">
              ⚡ PAYLOAD ARMED - Option {optionLabels[selectedOption]}) Selected
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {!isAnswered && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={selectedOption === null || isSubmitting}
            onMouseEnter={() => soundManager.hover()}
            className={`
              flex-1 py-4 rounded-lg font-orbitron font-bold text-lg transition-all
              ${selectedOption === null || isSubmitting
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-2 border-blue-400 box-glow'
              }
            `}
          >
            {isSubmitting ? '⚡ INJECTING...' : '⚡ INJECT PAYLOAD'}
          </motion.button>
        )}

        {isAnswered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            onMouseEnter={() => soundManager.hover()}
            className="flex-1 py-4 rounded-lg font-orbitron font-bold text-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-2 border-cyan-400 box-glow"
          >
            {wasCorrect ? '→ ADVANCE TO NEXT NODE' : '→ RETRY NEXT NODE'}
          </motion.button>
        )}
      </div>

      {/* Result Message */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-lg border-2 ${
              wasCorrect
                ? 'bg-green-900/30 border-neon-green'
                : 'bg-red-900/30 border-red-500'
            }`}
          >
            <p className={`font-bold text-center ${
              wasCorrect ? 'text-neon-green' : 'text-red-400'
            }`}>
              {wasCorrect 
                ? '✓ CORRECT - Node compromised successfully' 
                : '✗ INCORRECT - -10 points penalty applied'
              }
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default StageCard;
