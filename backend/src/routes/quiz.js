const express = require('express');
const router = express.Router();
const sessionManager = require('../models/Session');
const questions = require('../data/escapeRoomQuestions');
const errorHandler = require('../middleware/errorHandler');

// Middleware to validate session exists
router.use((req, res, next) => {
  if (!req.sessionID) {
    return res.status(400).json(
      errorHandler.createErrorResponse(400, 'Session ID is required')
    );
  }
  next();
});

// Start a new quiz session
router.post('/start', (req, res) => {
  try {
    const sessionId = req.sessionID;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }
    
    const session = sessionManager.createSession(sessionId);
    
    if (!session) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create session'
      });
    }
    
    res.json({
      success: true,
      sessionId: session.id,
      message: 'Quiz session started',
      timeLimit: session.timeLimit,
      totalQuestions: session.totalQuestions
    });
  } catch (error) {
    console.error('Start quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start quiz session',
      error: error.message
    });
  }
});

// Shuffle array function
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

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
      const remainingTime = session.endTime 
        ? Math.max(0, session.timeLimit - (session.endTime - session.startTime))
        : 0;
      
      return res.status(200).json({
        success: true,
        message: 'Quiz completed!',
        isCompleted: true,
        finalScore: session.score,
        correctAnswers: session.correctAnswers,
        wrongAttempts: session.wrongAttempts,
        remainingTime: remainingTime,
        totalTime: session.endTime - session.startTime
      });
    }

    if (sessionManager.isSessionExpired(sessionId)) {
      sessionManager.lockSession(sessionId);
      return res.status(403).json({
        success: false,
        message: 'Session has expired. Time limit exceeded.',
        isLocked: true,
        isExpired: true,
        finalScore: session.score
      });
    }

    const currentQuestion = questions.find(q => q.level === session.currentLevel);
    
    if (!currentQuestion) {
      return res.status(404).json({
        success: false,
        message: 'Question not found for current level'
      });
    }

    // Shuffle options and track new position of correct answer
    const originalOptions = [...currentQuestion.options];
    const correctOption = originalOptions[currentQuestion.correctAnswer];
    const shuffledOptions = shuffleArray(originalOptions);
    const newCorrectIndex = shuffledOptions.indexOf(correctOption);

    // Store the shuffled mapping in session for validation
    if (!session.questionMappings) {
      session.questionMappings = {};
    }
    session.questionMappings[session.currentLevel] = {
      shuffledOptions,
      correctIndex: newCorrectIndex
    };

    // Don't send the correct answer to the client
    const questionData = {
      id: currentQuestion.id,
      level: currentQuestion.level,
      category: currentQuestion.category,
      question: currentQuestion.question,
      options: shuffledOptions,
      difficulty: currentQuestion.difficulty,
      points: currentQuestion.points
    };

    res.json({
      success: true,
      question: questionData,
      currentLevel: session.currentLevel,
      totalQuestions: session.totalQuestions,
      currentScore: session.score,
      correctAnswers: session.correctAnswers
    });
  } catch (error) {
    console.error('Get question error:', error);
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

    if (selectedAnswer === undefined || selectedAnswer === null) {
      return res.status(400).json({
        success: false,
        message: 'Selected answer is required'
      });
    }

    if (questionId === undefined || questionId === null) {
      return res.status(400).json({
        success: false,
        message: 'Question ID is required'
      });
    }

    const session = sessionManager.getSession(sessionId);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (session.isLocked) {
      return res.status(403).json({
        success: false,
        message: 'Session is locked',
        isLocked: true
      });
    }

    if (session.isCompleted) {
      return res.status(403).json({
        success: false,
        message: 'Quiz is already completed'
      });
    }

    const question = questions.find(q => q.id === questionId);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Get the shuffled mapping for this question
    const questionMapping = session.questionMappings?.[session.currentLevel];
    const correctAnswerIndex = questionMapping ? questionMapping.correctIndex : question.correctAnswer;

    const result = sessionManager.submitAnswer(
      sessionId,
      questionId,
      selectedAnswer,
      correctAnswerIndex,
      question.points
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Calculate remaining time if completed
    let remainingTime = 0;
    if (result.isCompleted) {
      const session = sessionManager.getSession(sessionId);
      if (session && session.endTime) {
        remainingTime = Math.max(0, session.timeLimit - (session.endTime - session.startTime));
      }
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
      remainingTime: remainingTime,
      message: result.isCorrect 
        ? 'ACCESS GRANTED - Proceeding to next sector...' 
        : 'ACCESS DENIED - Security breach detected. Point penalty applied.'
    });
  } catch (error) {
    console.error('Submit answer error:', error);
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
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }
    
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
    console.error('Get stats error:', error);
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
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }
    
    sessionManager.deleteSession(sessionId);
    const newSession = sessionManager.createSession(sessionId);
    
    if (!newSession) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create new session'
      });
    }
    
    res.json({
      success: true,
      message: 'Quiz reset successfully',
      sessionId: newSession.id
    });
  } catch (error) {
    console.error('Reset quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset quiz',
      error: error.message
    });
  }
});

// Submit score to leaderboard
router.post('/leaderboard/submit', (req, res) => {
  try {
    const sessionId = req.sessionID;
    const { username } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    if (!username || username.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }

    if (username.length > 30) {
      return res.status(400).json({
        success: false,
        message: 'Username must be 30 characters or less'
      });
    }

    const result = sessionManager.submitToLeaderboard(sessionId, username);
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      message: 'Score submitted successfully',
      entry: result.entry,
      rank: result.rank
    });
  } catch (error) {
    console.error('Submit leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit score to leaderboard',
      error: error.message
    });
  }
});

// Get leaderboard
router.get('/leaderboard', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const leaderboard = sessionManager.getLeaderboard(limit);
    
    res.json({
      success: true,
      leaderboard: leaderboard,
      total: leaderboard.length
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get leaderboard',
      error: error.message
    });
  }
});

// Get user rank
router.get('/leaderboard/rank', (req, res) => {
  try {
    const sessionId = req.sessionID;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    const rank = sessionManager.getUserRank(sessionId);
    
    if (rank === null) {
      return res.status(404).json({
        success: false,
        message: 'User not found in leaderboard'
      });
    }

    res.json({
      success: true,
      rank: rank
    });
  } catch (error) {
    console.error('Get rank error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get rank',
      error: error.message
    });
  }
});

// Hidden cheat code endpoint - instantly complete quiz with perfect score
router.post('/cheat/activate', (req, res) => {
  try {
    const sessionId = req.sessionID;
    const { code } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    // Validate cheat code - secret combination
    const validCode = 'CIPHER_OVERRIDE_9X2Z';
    
    if (code !== validCode) {
      return res.status(403).json({
        success: false,
        message: 'Invalid cheat code'
      });
    }

    const session = sessionManager.getSession(sessionId);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Instantly complete the quiz with perfect score
    // 30 correct answers + maximum points possible
    session.currentLevel = 31; // Move past level 30
    session.correctAnswers = 30;
    session.wrongAttempts = 0;
    session.score = 4000; // Perfect score
    session.isCompleted = true;
    session.endTime = Date.now();

    sessionManager.updateSession(sessionId, session);

    res.json({
      success: true,
      message: 'Cheat code activated! Quiz completed with perfect score.',
      finalScore: session.score,
      correctAnswers: session.correctAnswers,
      wrongAttempts: session.wrongAttempts,
      remainingTime: Math.max(0, session.timeLimit - (session.endTime - session.startTime))
    });
  } catch (error) {
    console.error('Cheat code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to activate cheat code',
      error: error.message
    });
  }
});

module.exports = router;
