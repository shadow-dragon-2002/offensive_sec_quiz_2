import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './QuizScreen.css';
import api, { withHealthCheck, activateCheat } from '../utils/api';
import audioManager from '../utils/audioManager';

function QuizScreen({ sessionData, onSessionUpdate, onComplete, onSessionLocked }) {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState({ currentLevel: 1, score: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cheatSequence, setCheatSequence] = useState(''); // Track key presses for cheat code
  
  // Cheat code: UUDDLRLR (Up, Up, Down, Down, Left, Right, Left, Right - Konami Code style)
  const CHEAT_SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
  const CHEAT_CODE = 'CIPHER_OVERRIDE_9X2Z';

  useEffect(() => {
    // Initialize audio on mount
    audioManager.init();
    audioManager.playDigitalHum();
    fetchQuestion();
    
    // Setup cheat code listener
    const handleKeyDown = (event) => {
      // Only track arrow keys for cheat code
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        return;
      }

      // Build sequence with arrow key
      let newSequence = cheatSequence + event.key;
      
      // Keep only last 8 keys (length of cheat sequence)
      if (newSequence.length > CHEAT_SEQUENCE.length) {
        newSequence = newSequence.slice(-CHEAT_SEQUENCE.length);
      }

      setCheatSequence(newSequence);

      // Check if sequence matches cheat code pattern
      const sequenceArray = newSequence.split('');
      const cheatString = CHEAT_SEQUENCE.join('');
      const currentString = sequenceArray.join('');
      
      if (currentString === cheatString) {
        triggerCheat();
        setCheatSequence(''); // Reset sequence after activation
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      audioManager.stopAmbient();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cheatSequence]);

  const triggerCheat = async () => {
    try {
      console.log('🔓 Cheat code activated! UUDDLRLR!');
      
      const response = await activateCheat(CHEAT_CODE);
      
      if (response.success) {
        // Show visual/audio feedback
        audioManager.playCorrectAnswer();
        
        // Complete quiz with perfect score
        onComplete({
          score: response.finalScore,
          correctAnswers: response.correctAnswers,
          wrongAttempts: response.wrongAttempts,
          remainingTime: response.remainingTime,
          completed: true
        });
      }
    } catch (err) {
      console.error('Cheat activation failed:', err);
    }
  };

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await withHealthCheck(async () => {
        return await api.post('/quiz/question', { quizState: sessionData?.quizState });
      });
      
      // Check if session is locked first
      if (response.data.isLocked) {
        onSessionLocked({
          score: response.data.finalScore || 0,
          correctAnswers: 0,
          locked: true,
          reason: response.data.message
        });
        return;
      }
      
      if (response.data.success) {
        if (response.data.isCompleted) {
          onComplete({
            score: response.data.finalScore,
            correctAnswers: response.data.correctAnswers,
            wrongAttempts: response.data.wrongAttempts || 0,
            remainingTime: response.data.remainingTime || 0,
            completed: true
          });
        } else {
          // Update session with any state changes from response
          if (response.data.quizState && onSessionUpdate) {
            onSessionUpdate({ ...sessionData, quizState: response.data.quizState });
          }
          setQuestion(response.data.question);
          setStats({
            currentLevel: response.data.currentLevel,
            totalQuestions: response.data.totalQuestions,
            score: response.data.score
          });
          setSelectedAnswer(null);
          setFeedback(null);
          audioManager.playGlitch(); // Play sound when question loads
        }
      } else {
        setError('Failed to load question: ' + response.data.message);
      }
    } catch (err) {
      console.error('[QuizScreen] Error fetching question:', err);
      
      if (err.response?.data?.isLocked) {
        onSessionLocked({
          score: err.response.data.finalScore || 0,
          correctAnswers: err.response.data.correctAnswers || 0,
          locked: true
        });
        return;
      }
      
      // Enhanced error handling
      let errorMessage = 'Failed to load question. ';
      
      if (err.type === 'NETWORK_ERROR') {
        errorMessage += 'Please check your connection.';
      } else if (err.type === 'API_ERROR') {
        errorMessage += err.message;
      } else if (err.response?.status === 404) {
        errorMessage = 'Session not found. Please start a new quiz.';
      } else {
        errorMessage += 'Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (index) => {
    if (!isSubmitting && !(feedback && feedback.isCorrect)) {
      setSelectedAnswer(index);
      audioManager.playButtonClick();
      // Clear feedback if selecting new answer after wrong answer
      if (feedback && !feedback.isCorrect) {
        setFeedback(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null || isSubmitting) return;

    if (!sessionData?.quizState) {
      setError('Quiz state not found. Please refresh and start again.');
      return;
    }

    console.log('[QuizScreen] Submitting answer:', selectedAnswer, 'State:', sessionData.quizState);
    
    setIsSubmitting(true);
    try {
      const response = await withHealthCheck(async () => {
        return await api.post('/quiz/answer', {
          quizState: sessionData.quizState,
          answer: selectedAnswer
        });
      });

      // Handle both success and failure responses
      const data = response.data;
      
      // Check if answer was correct or incorrect
      if (data.isCorrect !== undefined) {
        const rewardMsg = data.isCorrect && data.reward 
          ? ` +${data.reward} points!` 
          : '';
        const penaltyMsg = !data.isCorrect && data.penalty 
          ? ` -${data.penalty} points penalty!` 
          : '';
        
        setFeedback({
          isCorrect: data.isCorrect,
          correctAnswer: data.correctAnswer,
          message: data.message + rewardMsg + penaltyMsg,
          explanation: data.explanation
        });

        // Update session with new quiz state from response
        if (data.quizState && onSessionUpdate) {
          onSessionUpdate({ ...sessionData, quizState: data.quizState });
        }

        setStats({
          currentLevel: data.nextLevel || data.currentLevel || stats.currentLevel,
          score: data.newScore || data.score || data.finalScore || stats.score,
          totalQuestions: stats.totalQuestions
        });

        if (data.isCorrect) {
          audioManager.playCorrectAnswer(); // Play success sound
          audioManager.playLaserSwoosh(); // Add laser effect
          setTimeout(() => {
            if (data.isCompleted) {
              onComplete({
                score: data.newScore || data.score,
                correctAnswers: data.nextLevel - 1,
                wrongAttempts: data.wrongAttempts || 0,
                remainingTime: data.remainingTime || 0,
                completed: true
              });
            } else {
              fetchQuestion();
            }
          }, 2000);
        } else {
          // Wrong answer
          audioManager.playWrongAnswer();
          
          // Check if session is locked
          if (data.isLocked) {
            setTimeout(() => {
              onSessionLocked({
                score: data.finalScore || stats.score,
                correctAnswers: stats.currentLevel - 1,
                locked: true,
                reason: 'incorrect_answer'
              });
            }, 2000);
          } else {
            // Allow retry - clear selection and feedback after showing penalty
            setTimeout(() => {
              setFeedback(null);
              setSelectedAnswer(null);
            }, 2000);
          }
        }
      } else if (!data.success) {
        setError('Failed to submit answer: ' + data.message);
      }
    } catch (err) {
      console.error('[QuizScreen] Error submitting answer:', err);
      
      let errorMessage = 'Error submitting answer. ';
      
      if (err.type === 'NETWORK_ERROR') {
        errorMessage += 'Please check your connection and try again.';
      } else if (err.type === 'API_ERROR') {
        errorMessage += err.message;
      } else {
        errorMessage += 'Please try again.';
      }
      
      setError(errorMessage);
      setFeedback({
        isCorrect: false,
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="quiz-screen">
        <div className="loading-container">
          <div className="loader"></div>
          <p className="loading-text">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-screen">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p className="error-text">{error}</p>
          <button className="retry-button neon-button" onClick={fetchQuestion}>
            RETRY
          </button>
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="quiz-screen">
      <div className="quiz-header">
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${(stats.currentLevel / 30) * 100}%` }}
          ></div>
        </div>
        <div className="quiz-stats">
          <span className="stat">
            <span className="stat-label">Level:</span>
            <span className="stat-value">{stats.currentLevel}/30</span>
          </span>
          <span className="stat">
            <span className="stat-label">Score:</span>
            <span className="stat-value">{stats.score || 0}</span>
          </span>
        </div>
      </div>

      <div className="question-container">
        <div className="question-header">
          <span className="question-category">{question.category}</span>
          <span className={`question-difficulty ${question.difficulty}`}>
            {question.difficulty?.toUpperCase()}
          </span>
          <span className="question-points">+{question.points} pts</span>
        </div>
        
        <h2 className="question-text">{question.question}</h2>

        <div className="answers-grid">
          {question.options && question.options.map((option, index) => {
            // Extract label if option starts with a), b), c), d)
            const optionLabel = ['a)', 'b)', 'c)', 'd)'][index];
            const displayText = option.startsWith(optionLabel) 
              ? option.substring(2).trim() 
              : option;

            return (
              <motion.button
                key={index}
                className={`answer-option ${
                  selectedAnswer === index ? 'selected' : ''
                } ${
                  feedback && index === feedback.correctAnswer ? 'correct' : ''
                } ${
                  feedback && selectedAnswer === index && !feedback.isCorrect ? 'incorrect' : ''
                }`}
                onClick={() => handleAnswerSelect(index)}
                onMouseEnter={() => !(feedback && feedback.isCorrect) && audioManager.playButtonHover()}
                disabled={isSubmitting || (feedback && feedback.isCorrect)}
                whileHover={{ scale: feedback ? 1 : 1.02 }}
                whileTap={{ scale: feedback ? 1 : 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="option-letter">{optionLabel}</span>
                <span className="option-text">{displayText}</span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div 
              className={`feedback ${feedback.isCorrect ? 'correct' : 'incorrect'}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="feedback-icon">
                {feedback.isCorrect ? '✓' : '✗'}
              </div>
              <div className="feedback-message">{feedback.message}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          className="submit-button neon-button"
          onClick={handleSubmit}
          disabled={selectedAnswer === null || isSubmitting || (feedback && feedback.isCorrect)}
        >
          {isSubmitting ? 'SUBMITTING...' : 'SUBMIT ANSWER'}
        </button>
      </div>
    </div>
  );
}

export default QuizScreen;
