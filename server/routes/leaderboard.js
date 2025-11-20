const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory leaderboard storage
const leaderboard = [];

// Import sessions from session route
let sessions;

router.setSessions = (sessionsMap) => {
  sessions = sessionsMap;
};

/**
 * Calculate rank based on score
 */
function calculateRank(score) {
  if (score >= 85) return 'GOLD';
  if (score >= 70) return 'SILVER';
  if (score >= 50) return 'BRONZE';
  return 'COMPLETE';
}

/**
 * GET /api/leaderboard
 * Get top 10 scores
 */
router.get('/', (req, res) => {
  try {
    // Sort by score (descending), then by time (ascending)
    const topScores = [...leaderboard]
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.completedTime - b.completedTime;
      })
      .slice(0, 10);

    res.json({
      success: true,
      leaderboard: topScores,
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

/**
 * POST /api/leaderboard
 * Submit score to leaderboard
 */
router.post('/', (req, res) => {
  try {
    const { playerName, score, time } = req.body;
    const sessionId = req.sessionID;

    if (!sessions) {
      return res.status(500).json({
        success: false,
        message: 'Session storage not initialized'
      });
    }

    const session = sessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (!session.isCompleted) {
      return res.status(403).json({
        success: false,
        message: 'Session not completed yet'
      });
    }

    if (session.leaderboardSubmitted) {
      return res.status(403).json({
        success: false,
        message: 'Score already submitted for this session'
      });
    }

    // Validate input
    if (!playerName || playerName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Player name is required'
      });
    }

    if (playerName.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Player name too long (max 50 characters)'
      });
    }

    // Sanitize player name (alphanumeric + spaces only)
    const sanitizedName = playerName.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    
    if (sanitizedName.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Player name must contain alphanumeric characters'
      });
    }

    // Validate score matches session
    if (score !== session.score) {
      return res.status(400).json({
        success: false,
        message: 'Score mismatch'
      });
    }

    // Create leaderboard entry
    const entry = {
      id: uuidv4(),
      playerName: sanitizedName,
      score: session.score,
      completedTime: time || Math.floor((session.endTime - session.startTime) / 1000),
      rank: calculateRank(session.score),
      submittedAt: Date.now(),
      sessionId: sessionId,
      completedStages: session.completedStages
    };

    leaderboard.push(entry);

    // Mark session as submitted
    session.leaderboardSubmitted = true;
    sessions.set(sessionId, session);

    // Return updated position in leaderboard
    const sortedLeaderboard = [...leaderboard]
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.completedTime - b.completedTime;
      });

    const position = sortedLeaderboard.findIndex(e => e.id === entry.id) + 1;

    res.json({
      success: true,
      entry: entry,
      position: position,
      totalEntries: leaderboard.length
    });
  } catch (error) {
    console.error('Submit leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit score',
      error: error.message
    });
  }
});

/**
 * GET /api/leaderboard/rank/:score
 * Get rank for a given score
 */
router.get('/rank/:score', (req, res) => {
  try {
    const score = parseInt(req.params.score);
    
    if (isNaN(score)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid score'
      });
    }

    const rank = calculateRank(score);

    res.json({
      success: true,
      score: score,
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

module.exports = router;
