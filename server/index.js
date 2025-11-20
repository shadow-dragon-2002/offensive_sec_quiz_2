const express = require('express');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');

const sessionRoutes = require('./routes/session');
const stagesRoutes = require('./routes/stages');
const leaderboardRoutes = require('./routes/leaderboard');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'offensive-sec-escape-room-secret-2024',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 2 * 60 * 60 * 1000 // 2 hours
  }
}));

// Rate limiting to prevent abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);

// Share sessions between routes
stagesRoutes.setSessions(sessionRoutes.sessions);
leaderboardRoutes.setSessions(sessionRoutes.sessions);

// API Routes
app.use('/api/session', sessionRoutes);
app.use('/api/stages', stagesRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Serve static files from React build
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Offensive Security Escape Room API',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve React app for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('⚡ OFFENSIVE SECURITY ESCAPE ROOM - RED TEAM OPS ⚡');
  console.log('='.repeat(60));
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Application: http://localhost:${PORT}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api`);
  console.log('='.repeat(60));
  console.log('📊 System Information:');
  console.log(`   • Total Stages: 30`);
  console.log(`   • Attack Phases: 6`);
  console.log(`   • Time Limit: 25 minutes`);
  console.log(`   • Scoring: 100 start, -10 per wrong answer`);
  console.log(`   • One-time playthrough per session`);
  console.log('='.repeat(60) + '\n');
});

module.exports = app;
