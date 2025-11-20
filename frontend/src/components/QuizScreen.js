import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './QuizScreen.css';
import api, { withHealthCheck } from '../utils/api';
import soundEffects from '../utils/soundEffects';

function QuizScreen({ onComplete, onSessionLocked }) {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState({ currentLevel: 1, score: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    fetchQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await withHealthCheck(async () => {
        return await api.get('/quiz/question');
      });
      
      if (response.data.success) {
        if (response.data.isCompleted) {
          onComplete({
            score: response.data.finalScore,
            correctAnswers: response.data.correctAnswers,
            completed: true
          });
        } else {
          setQuestion(response.data.question);
          setStats({
            currentLevel: response.data.currentLevel,
            totalQuestions: response.data.totalQuestions
          });
          setSelectedAnswer(null);
          setFeedback(null);
          setRetryCount(0); // Reset retry count on success
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
    if (!isSubmitting && !feedback) {
      setSelectedAnswer(index);
      soundEffects.click();
    }
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await withHealthCheck(async () => {
        return await api.post('/quiz/answer', {
          questionId: question.id,
          selectedAnswer: selectedAnswer
        });
      });

      if (response.data.success) {
        setFeedback({
          isCorrect: response.data.isCorrect,
          correctAnswer: response.data.correctAnswer, // Only present if correct
          message: response.data.message
        });

        setStats({
          currentLevel: response.data.currentLevel,
          score: response.data.score,
          totalQuestions: stats.totalQuestions
        });

        if (response.data.isCorrect) {
          soundEffects.correct();
          setTimeout(() => {
            if (response.data.isCompleted) {
              soundEffects.levelComplete();
              onComplete({
                score: response.data.score,
                correctAnswers: response.data.currentLevel - 1,
                completed: true
              });
            } else {
              fetchQuestion();
            }
          }, 2000);
        } else if (response.data.isLocked) {
          soundEffects.incorrect();
          setTimeout(() => {
            onSessionLocked({
              score: response.data.score,
              correctAnswers: response.data.currentLevel - 1,
              locked: true
            });
          }, 2000);
        } else {
          // Wrong answer but not locked - play error sound but do NOT reveal correct answer
          soundEffects.incorrect();
        }
      } else {
        soundEffects.incorrect();
        setError('Failed to submit answer: ' + response.data.message);
      }
    } catch (err) {
      console.error('[QuizScreen] Error submitting answer:', err);
      
      let errorMessage = 'Error submitting answer. ';
      
      if (err.type === 'NETWORK_ERROR') {
        errorMessage += 'Please check your connection and try again.';
        setRetryCount(prev => prev + 1);
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
                  // Only show correct highlight if user got it right (feedback.isCorrect)
                  feedback && feedback.isCorrect && index === feedback.correctAnswer ? 'correct' : ''
                } ${
                  feedback && selectedAnswer === index && !feedback.isCorrect ? 'incorrect' : ''
                }`}
                onClick={() => handleAnswerSelect(index)}
                onMouseEnter={() => !feedback && !isSubmitting && soundEffects.hover()}
                disabled={isSubmitting || feedback}
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
          onMouseEnter={() => selectedAnswer !== null && !isSubmitting && !feedback && soundEffects.hover()}
          disabled={selectedAnswer === null || isSubmitting || feedback}
        >
          {isSubmitting ? 'SUBMITTING...' : 'SUBMIT ANSWER'}
        </button>
      </div>
    </div>
  );
}

export default QuizScreen;
