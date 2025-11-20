const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory session storage
const sessions = new Map();

/**
 * POST /api/session/start
 * Initialize a new game session
 */
router.post('/start', (req, res) => {
  try {
    const sessionId = req.sessionID;
    
    // Check if session already exists (one-time playthrough)
    if (sessions.has(sessionId)) {
      const existing = sessions.get(sessionId);
      if (existing.isCompleted || existing.hasStarted) {
        return res.status(403).json({
          success: false,
          message: 'Session already started. One playthrough per session allowed.',
          hasStarted: true
        });
      }
    }

    // Create new session
    const session = {
      id: sessionId,
      startTime: Date.now(),
      currentStage: 1,
      score: 100, // Start at 100 points
      timeRemaining: 25 * 60 * 1000, // 25 minutes in milliseconds
      completedStages: 0,
      wrongAnswers: 0,
      isCompleted: false,
      hasStarted: true,
      leaderboardSubmitted: false
    };

    sessions.set(sessionId, session);

    res.json({
      success: true,
      sessionId: session.id,
      currentStage: session.currentStage,
      score: session.score,
      timeLimit: 25 * 60, // seconds
      totalStages: 30
    });
  } catch (error) {
    console.error('Session start error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start session',
      error: error.message
    });
  }
});

/**
 * GET /api/session/status
 * Retrieve current session status
 */
router.get('/status', (req, res) => {
  try {
    const sessionId = req.sessionID;
    const session = sessions.get(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Calculate remaining time
    const elapsed = Date.now() - session.startTime;
    const remaining = Math.max(0, session.timeRemaining - elapsed);

    res.json({
      success: true,
      currentStage: session.currentStage,
      score: session.score,
      timeRemaining: Math.floor(remaining / 1000), // seconds
      completedStages: session.completedStages,
      isCompleted: session.isCompleted,
      wrongAnswers: session.wrongAnswers
    });
  } catch (error) {
    console.error('Session status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get session status',
      error: error.message
    });
  }
});

/**
 * POST /api/session/progress
 * Update session progress (called after correct answer)
 */
router.post('/progress', (req, res) => {
  try {
    const sessionId = req.sessionID;
    const session = sessions.get(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (session.isCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Session already completed'
      });
    }

    // Check if time expired
    const elapsed = Date.now() - session.startTime;
    if (elapsed > session.timeRemaining) {
      session.isCompleted = true;
      sessions.set(sessionId, session);
      return res.status(403).json({
        success: false,
        message: 'Time expired',
        timeExpired: true
      });
    }

    // Move to next stage
    session.currentStage += 1;
    session.completedStages += 1;

    // Check if completed all stages
    if (session.currentStage > 30) {
      session.isCompleted = true;
    }

    sessions.set(sessionId, session);

    res.json({
      success: true,
      currentStage: session.currentStage,
      completedStages: session.completedStages,
      isCompleted: session.isCompleted
    });
  } catch (error) {
    console.error('Session progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update progress',
      error: error.message
    });
  }
});

/**
 * POST /api/session/complete
 * Finalize session (called when game ends)
 */
router.post('/complete', (req, res) => {
  try {
    const sessionId = req.sessionID;
    const session = sessions.get(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    session.isCompleted = true;
    session.endTime = Date.now();
    sessions.set(sessionId, session);

    const elapsed = session.endTime - session.startTime;
    const timeSpent = Math.floor(elapsed / 1000); // seconds

    res.json({
      success: true,
      finalScore: session.score,
      completedStages: session.completedStages,
      wrongAnswers: session.wrongAnswers,
      timeSpent: timeSpent
    });
  } catch (error) {
    console.error('Session complete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete session',
      error: error.message
    });
  }
});

// Export sessions Map for use in other routes
router.sessions = sessions;

module.exports = router;
