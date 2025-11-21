// Vercel Serverless Function Entry Point - STATELESS VERSION
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============ MIDDLEWARE ============
// Configure CORS with safe defaults
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://offensive-sec-quiz-2.vercel.app',
      'https://offensive-sec-quiz-2-shadow-dragon-2002s-projects.vercel.app',
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ];
    
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Request-ID']
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============ QUIZ DATA ============
const questions = require('../backend/src/data/questions');
const escapeRoomQuestions = require('../backend/src/data/escapeRoomQuestions');

// ============ ROUTES ============
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Start quiz - returns initial state
app.post('/api/quiz/start', (req, res) => {
  const timeLimit = 30 * 60; // 30 minutes in seconds
  const now = Date.now();
  
  const quizState = {
    currentLevel: 1,
    score: 0,
    answered: [],
    isLocked: false,
    startTime: now,
    timeLimit: timeLimit,
    endTime: now + (timeLimit * 1000)
  };
  
  res.json({
    success: true,
    quizState: quizState,
    message: 'Quiz session started',
    totalQuestions: questions.length,
    timeLimit: timeLimit
  });
});

// Get current question - client sends current state
app.post('/api/quiz/question', (req, res) => {
  const { quizState } = req.body;
  
  if (!quizState) {
    return res.json({ success: false, isLocked: true, message: 'No quiz state provided' });
  }
  
  // Check if time has expired
  const now = Date.now();
  if (now > quizState.endTime) {
    return res.json({
      success: false,
      isLocked: true,
      message: 'Time expired',
      finalScore: quizState.score
    });
  }
  
  if (quizState.isLocked) {
    return res.json({ success: false, isLocked: true, message: 'Session locked' });
  }
  
  const currentLevel = quizState.currentLevel;
  
  if (currentLevel > questions.length) {
    return res.json({
      success: false,
      isCompleted: true,
      message: 'Quiz completed!',
      finalScore: quizState.score
    });
  }
  
  const question = questions[currentLevel - 1];
  
  res.json({
    success: true,
    question: {
      id: question.id,
      level: currentLevel,
      question: question.question,
      options: question.options,
      hint: question.hint,
      category: question.category
    },
    currentLevel: currentLevel,
    score: quizState.score,
    totalQuestions: questions.length
  });
});

// Submit answer - client sends current state + answer
app.post('/api/quiz/answer', (req, res) => {
  const { quizState, answer } = req.body;
  
  if (!quizState) {
    return res.json({ success: false, message: 'No quiz state provided' });
  }
  
  if (!answer) {
    return res.json({ success: false, message: 'No answer provided' });
  }
  
  // Check if time has expired
  const now = Date.now();
  if (now > quizState.endTime) {
    return res.json({
      success: false,
      isLocked: true,
      message: 'Time expired',
      finalScore: quizState.score
    });
  }
  
  if (quizState.isLocked) {
    return res.json({ success: false, isLocked: true, message: 'Session locked' });
  }
  
  const currentLevel = quizState.currentLevel;
  
  if (currentLevel > questions.length) {
    return res.json({ success: false, message: 'Quiz already completed' });
  }
  
  const question = questions[currentLevel - 1];
  const isCorrect = question.correctAnswer === answer;
  
  // Update state
  const newState = { ...quizState };
  
  if (!isCorrect) {
    newState.isLocked = true;
    return res.json({
      success: false,
      isCorrect: false,
      message: '❌ Incorrect answer! Your session has been locked.',
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || 'Incorrect',
      finalScore: newState.score,
      quizState: newState
    });
  }
  
  newState.score += question.points;
  newState.currentLevel += 1;
  newState.answered.push({ level: currentLevel, answer });
  
  res.json({
    success: true,
    isCorrect: true,
    message: '✅ Correct!',
    pointsAwarded: question.points,
    newScore: newState.score,
    nextLevel: newState.currentLevel,
    explanation: question.explanation || 'Correct!',
    quizState: newState
  });
});

// Get quiz stats (for timer) - client sends current state
app.post('/api/quiz/stats', (req, res) => {
  const { quizState } = req.body;
  
  if (!quizState) {
    return res.json({ 
      success: false, 
      message: 'No quiz state provided',
      stats: {
        remainingTime: 0,
        timeLimit: 30 * 60
      }
    });
  }
  
  const now = Date.now();
  const remainingMs = Math.max(0, quizState.endTime - now);
  const remainingSeconds = Math.floor(remainingMs / 1000);
  
  res.json({
    success: true,
    stats: {
      remainingTime: remainingSeconds,
      timeLimit: quizState.timeLimit,
      currentLevel: quizState.currentLevel,
      score: quizState.score
    }
  });
});

// ============ ERROR HANDLER ============
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// ============ 404 HANDLER ============
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

module.exports = app;
