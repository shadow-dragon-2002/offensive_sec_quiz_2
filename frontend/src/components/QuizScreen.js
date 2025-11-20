import React, { useState, useEffect } from 'react';
import './QuizScreen.css';
import api from '../utils/api';

function QuizScreen({ onComplete, onSessionLocked }) {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState({ currentLevel: 1, score: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const response = await api.get('/quiz/question');
      
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
        }
      }
    } catch (err) {
      if (err.response?.data?.isLocked) {
        onSessionLocked({
          score: err.response.data.finalScore || 0,
          correctAnswers: err.response.data.correctAnswers || 0,
          locked: true
        });
      } else {
        console.error('Failed to fetch question:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (index) => {
    if (!isSubmitting && !feedback) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await api.post('/quiz/answer', {
        questionId: question.id,
        selectedAnswer: selectedAnswer
      });

      if (response.data.success) {
        setFeedback({
          isCorrect: response.data.isCorrect,
          correctAnswer: response.data.correctAnswer,
          message: response.data.message
        });

        setStats({
          currentLevel: response.data.currentLevel,
          score: response.data.score
        });

        if (response.data.isCorrect) {
          setTimeout(() => {
            if (response.data.isCompleted) {
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
          setTimeout(() => {
            onSessionLocked({
              score: response.data.score,
              correctAnswers: response.data.currentLevel - 1,
              locked: true
            });
          }, 2000);
        }
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
      setFeedback({
        isCorrect: false,
        message: 'Failed to submit answer. Please try again.'
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
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`answer-option ${
                selectedAnswer === index ? 'selected' : ''
              } ${
                feedback && index === feedback.correctAnswer ? 'correct' : ''
              } ${
                feedback && selectedAnswer === index && !feedback.isCorrect ? 'incorrect' : ''
              }`}
              onClick={() => handleAnswerSelect(index)}
              disabled={isSubmitting || feedback}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
            </button>
          ))}
        </div>

        {feedback && (
          <div className={`feedback ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="feedback-icon">
              {feedback.isCorrect ? '✓' : '✗'}
            </div>
            <div className="feedback-message">{feedback.message}</div>
          </div>
        )}

        <button
          className="submit-button neon-button"
          onClick={handleSubmit}
          disabled={selectedAnswer === null || isSubmitting || feedback}
        >
          {isSubmitting ? 'SUBMITTING...' : 'SUBMIT ANSWER'}
        </button>
      </div>
    </div>
  );
}

export default QuizScreen;
