const express = require('express');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
const quizRoutes = require('./routes/quiz');
const sessionManager = require('./models/Session');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'offensive-sec-quiz-secret-key-change-in-production',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  }
}));

// Logging middleware for debugging
app.use((req, res, next) => {
  if (NODE_ENV === 'development') {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  }
  next();
});

// Routes
app.use('/api/quiz', quizRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Offensive Security Quiz API is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Offensive Security Quiz Game API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      startQuiz: 'POST /api/quiz/start',
      getQuestion: 'GET /api/quiz/question',
      submitAnswer: 'POST /api/quiz/answer',
      getStats: 'GET /api/quiz/stats',
      resetQuiz: 'POST /api/quiz/reset'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

// Cleanup old sessions every hour
const cleanupInterval = setInterval(() => {
  try {
    sessionManager.cleanupOldSessions();
    if (NODE_ENV === 'development') {
      console.log('✓ Cleaned up old sessions');
    }
  } catch (err) {
    console.error('Error during session cleanup:', err);
  }
}, 60 * 60 * 1000);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });
  
  res.status(err.status || 500).json({
    success: false,
    message: 'Internal server error',
    error: NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  clearInterval(cleanupInterval);
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  clearInterval(cleanupInterval);
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║  🚀 Offensive Security Quiz API Server    ║');
  console.log('╠════════════════════════════════════════════╣');
  console.log(`║  Server running on port: ${String(PORT).padEnd(26)}║`);
  console.log(`║  Environment: ${String(NODE_ENV).padEnd(35)}║`);
  console.log(`║  Frontend URL: ${String(process.env.FRONTEND_URL || 'http://localhost:3000').padEnd(26)}║`);
  console.log('╠════════════════════════════════════════════╣');
  console.log('║  📊 Features:                              ║');
  console.log('║  ✓ Session management enabled              ║');
  console.log('║  ✓ CORS protection configured              ║');
  console.log('║  ✓ Time limit: 30 minutes per session      ║');
  console.log('║  ✓ Total questions: 30                     ║');
  console.log('║  ✓ Session lock on wrong answer            ║');
  console.log('╚════════════════════════════════════════════╝\n');

  if (NODE_ENV === 'development') {
    console.log('📋 Available endpoints:');
    console.log('  POST   /api/quiz/start   - Start a new quiz session');
    console.log('  GET    /api/quiz/question - Get current question');
    console.log('  POST   /api/quiz/answer   - Submit an answer');
    console.log('  GET    /api/quiz/stats    - Get session statistics');
    console.log('  POST   /api/quiz/reset    - Reset the quiz');
    console.log('  GET    /api/health        - Health check\n');
  }
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Error: Port ${PORT} is already in use`);
    console.error('Please either:');
    console.error(`  1. Stop the process using port ${PORT}`);
    console.error('  2. Change the PORT in .env file');
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

module.exports = app;
