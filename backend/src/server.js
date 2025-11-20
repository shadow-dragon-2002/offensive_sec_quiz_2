const express = require('express');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
const quizRoutes = require('./routes/quiz');
const sessionManager = require('./models/Session');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Routes
app.use('/api/quiz', quizRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Offensive Security Quiz API is running',
    timestamp: new Date().toISOString()
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

// Cleanup old sessions every hour
setInterval(() => {
  sessionManager.cleanupOldSessions();
  console.log('Cleaned up old sessions');
}, 60 * 60 * 1000);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🎮 Offensive Security Quiz Game API`);
  console.log(`🔒 Session management enabled`);
  console.log(`⏱️  Time limit: 30 minutes per session`);
  console.log(`📚 Total questions: 30`);
});

module.exports = app;
