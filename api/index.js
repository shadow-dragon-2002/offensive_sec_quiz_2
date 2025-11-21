// Vercel Serverless Function Entry Point
const express = require('express');
const session = require('express-session');
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

// ============ SESSION CONFIGURATION ============
app.use(session({
  secret: process.env.SESSION_SECRET || 'offensive-sec-quiz-secret-key-change-in-production',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  }
}));

// ============ QUIZ DATA ============
const questions = require('../backend/src/data/questions');
const escapeRoomQuestions = require('../backend/src/data/escapeRoomQuestions');

// ============ SESSION STORE (in-memory for serverless) ============
const sessions = {};

// ============ ROUTES ============
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

app.post('/api/quiz/start', (req, res) => {
  const sessionId = `session-${Date.now()}-${Math.random()}`;
  const timeLimit = 30 * 60; // 30 minutes in seconds
  
  sessions[sessionId] = {
    currentLevel: 1,
    score: 0,
    answered: [],
    isLocked: false,
    startTime: Date.now(),
    timeLimit: timeLimit,
    endTime: Date.now() + (timeLimit * 1000)
  };
  
  req.session.sessionId = sessionId;
  req.session.save((err) => {
    if (err) {
      console.error('Session save error:', err);
      return res.status(500).json({ success: false, message: 'Session error' });
    }
    
    res.json({
      success: true,
      sessionId,
      message: 'Quiz session started',
      totalQuestions: questions.length,
      timeLimit: timeLimit
    });
  });
});

// Support both GET and POST for question endpoint
app.all('/api/quiz/question', (req, res) => {
  const sessionId = req.session?.sessionId;
  
  if (!sessionId || !sessions[sessionId]) {
    return res.json({ success: false, isLocked: true, message: 'Session not found' });
  }
  
  const session = sessions[sessionId];
  
  // Check if time has expired
  const now = Date.now();
  if (now > session.endTime) {
    session.isLocked = true;
    return res.json({
      success: false,
      isLocked: true,
      message: 'Time expired',
      finalScore: session.score
    });
  }
  
  if (session.isLocked) {
    return res.json({ success: false, isLocked: true, message: 'Session locked' });
  }
  
  const currentLevel = session.currentLevel;
  
  if (currentLevel > questions.length) {
    return res.json({
      success: true,
      isCompleted: true,
      completed: true,
      finalScore: session.score,
      correctAnswers: session.answered.length,
      remainingTime: Math.max(0, Math.floor((session.endTime - now) / 1000)),
      message: 'Quiz completed!'
    });
  }
  
  const question = questions[currentLevel - 1];
  
  res.json({
    success: true,
    question: {
      id: question.id,
      level: currentLevel,
      text: question.text,
      options: question.options,
      points: question.points
    },
    currentLevel,
    totalQuestions: questions.length,
    currentScore: session.score
  });
});

app.post('/api/quiz/answer', (req, res) => {
  const { answer } = req.body;
  const sessionId = req.session?.sessionId;
  
  if (!sessionId || !sessions[sessionId]) {
    return res.json({ success: false, isLocked: true, message: 'Session not found' });
  }
  
  const session = sessions[sessionId];
  
  if (session.isLocked) {
    return res.json({ success: false, isLocked: true, message: 'Session locked' });
  }
  
  const currentLevel = session.currentLevel;
  
  if (currentLevel > questions.length) {
    return res.json({ success: false, message: 'Quiz already completed' });
  }
  
  const question = questions[currentLevel - 1];
  const isCorrect = question.correctAnswer === answer;
  
  if (!isCorrect) {
    session.isLocked = true;
    return res.json({
      success: false,
      isCorrect: false,
      message: '❌ Incorrect answer! Your session has been locked.',
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || 'Incorrect',
      finalScore: session.score
    });
  }
  
  session.score += question.points;
  session.currentLevel += 1;
  session.answered.push({ level: currentLevel, answer });
  
  res.json({
    success: true,
    isCorrect: true,
    message: '✅ Correct!',
    pointsAwarded: question.points,
    newScore: session.score,
    nextLevel: session.currentLevel,
    explanation: question.explanation || 'Correct!'
  });
});

// ============ QUIZ STATS ENDPOINT (for timer) ============
app.get('/api/quiz/stats', (req, res) => {
  const sessionId = req.session?.sessionId;
  
  if (!sessionId || !sessions[sessionId]) {
    return res.json({ 
      success: false, 
      message: 'Session not found',
      stats: {
        remainingTime: 0,
        timeLimit: 30 * 60
      }
    });
  }
  
  const session = sessions[sessionId];
  const now = Date.now();
  const remainingTime = Math.max(0, Math.floor((session.endTime - now) / 1000));
  
  res.json({
    success: true,
    stats: {
      currentLevel: session.currentLevel,
      score: session.score,
      totalQuestions: questions.length,
      remainingTime: remainingTime,
      timeLimit: session.timeLimit,
      isLocked: session.isLocked
    }
  });
});

// ============ ERROR HANDLING ============
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
