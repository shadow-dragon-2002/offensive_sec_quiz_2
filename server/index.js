import express from 'express';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Routes
import sessionRoutes from './routes/session.js';
import stagesRoutes from './routes/stages.js';
import leaderboardRoutes from './routes/leaderboard.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173',
  credentials: true
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'offensive-sec-quiz-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Rate limiting for answer submissions
const answerLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  message: 'Too many answer submissions. Please slow down.',
  standardHeaders: true,
  legacyHeaders: false
});

// API Routes
app.use('/api/session', sessionRoutes);
app.use('/api/stages', stagesRoutes);
app.use('/api/stages/:id/answer', answerLimiter);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Serve static files from React build
const clientBuildPath = join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuildPath));

// Serve React app for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(join(clientBuildPath, 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║   ⚡ OFFENSIVE SECURITY QUIZ - SERVER ONLINE ⚡   ║
╚════════════════════════════════════════════════════╝

🎮 Server running on: http://localhost:${PORT}
📡 API endpoint: http://localhost:${PORT}/api
🌐 Environment: ${process.env.NODE_ENV || 'development'}

Ready to infiltrate...
  `);
});

export default app;
