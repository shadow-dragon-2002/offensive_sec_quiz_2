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
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Request-ID']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
    const beforeCount = sessionManager.getActiveSessionCount?.();
    sessionManager.cleanupOldSessions();
    const afterCount = sessionManager.getActiveSessionCount?.();
    if (NODE_ENV === 'development') {
      console.log(`✓ Cleaned up old sessions (${beforeCount} -> ${afterCount})`);
    }
  } catch (err) {
    console.error('Error during session cleanup:', err);
  }
}, 60 * 60 * 1000);

// Periodic health log
const healthLogInterval = setInterval(() => {
  if (NODE_ENV === 'development') {
    const health = sessionManager.getSessionHealth?.();
    if (health) {
      console.log(`📊 Health: ${health.activeSessions} active sessions`);
    }
  }
}, 5 * 60 * 1000);

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

// Graceful shutdown handler
const gracefulShutdown = () => {
  console.log('\n\n🛑 Graceful shutdown initiated...');
  clearInterval(cleanupInterval);
  clearInterval(healthLogInterval);
  
  server.close(() => {
    console.log('✓ HTTP server closed');
    try {
      const clearedCount = sessionManager.cleanupAllSessions?.();
      console.log(`✓ Cleaned up ${clearedCount || 0} sessions`);
    } catch (err) {
      console.error('Error during cleanup:', err.message);
    }
    console.log('✓ Shutdown complete');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Force shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

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
    console.error(`\n❌ Error: Port ${PORT} is already in use`);
    console.error('Please either:');
    console.error(`  1. Stop the process using port ${PORT}`);
    console.error('  2. Change the PORT in .env file');
    console.error('  3. Use: lsof -ti:' + PORT + ' | xargs kill -9\n');
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

// Uncaught exception handler
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  console.error('Stack:', err.stack);
  process.exit(1);
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;
