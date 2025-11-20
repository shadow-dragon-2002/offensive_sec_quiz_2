const express = require('express');
const router = express.Router();
const sessionManager = require('../models/Session');
const questions = require('../data/escapeRoomQuestions');

// Start a new quiz session
router.post('/start', (req, res) => {
  try {
    const sessionId = req.sessionID;
    const session = sessionManager.createSession(sessionId);
    
    res.json({
      success: true,
      sessionId: session.id,
      message: 'Quiz session started',
      timeLimit: session.timeLimit,
      totalQuestions: session.totalQuestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to start quiz session',
      error: error.message
    });
  }
});

// Get current question
router.get('/question', (req, res) => {
  try {
    const sessionId = req.sessionID;
    const session = sessionManager.getSession(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found. Please start a new quiz.'
      });
    }

    if (session.isLocked) {
      return res.status(403).json({
        success: false,
        message: 'Session is locked due to incorrect answer',
        isLocked: true,
        finalScore: session.score,
        correctAnswers: session.correctAnswers
      });
    }

    if (session.isCompleted) {
      return res.status(200).json({
        success: true,
        message: 'Quiz completed!',
        isCompleted: true,
        finalScore: session.score,
        correctAnswers: session.correctAnswers
      });
    }

    if (sessionManager.isSessionExpired(sessionId)) {
      sessionManager.lockSession(sessionId);
      return res.status(403).json({
        success: false,
        message: 'Session has expired',
        isLocked: true,
        finalScore: session.score
      });
    }

    const currentQuestion = questions.find(q => q.level === session.currentLevel);
    
    if (!currentQuestion) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Don't send the correct answer to the client
    const { correctAnswer, ...questionData } = currentQuestion;

    res.json({
      success: true,
      question: questionData,
      currentLevel: session.currentLevel,
      totalQuestions: session.totalQuestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get question',
      error: error.message
    });
  }
});

// Submit answer
router.post('/answer', (req, res) => {
  try {
    const sessionId = req.sessionID;
    const { questionId, selectedAnswer } = req.body;

    if (selectedAnswer === undefined || questionId === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Question ID and selected answer are required'
      });
    }

    const session = sessionManager.getSession(sessionId);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const question = questions.find(q => q.id === questionId);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const result = sessionManager.submitAnswer(
      sessionId,
      questionId,
      selectedAnswer,
      question.correctAnswer,
      question.points
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      isCorrect: result.isCorrect,
      currentLevel: result.currentLevel,
      score: result.score,
      isLocked: false,
      isCompleted: result.isCompleted,
      penalty: result.penalty,
      wrongAttempts: result.wrongAttempts,
      message: result.isCorrect 
        ? 'ACCESS GRANTED - Proceeding to next sector...' 
        : 'ACCESS DENIED - Security breach detected. Point penalty applied.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit answer',
      error: error.message
    });
  }
});

// Get session stats
router.get('/stats', (req, res) => {
  try {
    const sessionId = req.sessionID;
    const stats = sessionManager.getSessionStats(sessionId);

    if (!stats) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get stats',
      error: error.message
    });
  }
});

// Reset/restart quiz
router.post('/reset', (req, res) => {
  try {
    const sessionId = req.sessionID;
    sessionManager.deleteSession(sessionId);
    const newSession = sessionManager.createSession(sessionId);
    
    res.json({
      success: true,
      message: 'Quiz reset successfully',
      sessionId: newSession.id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reset quiz',
      error: error.message
    });
  }
});

module.exports = router;
