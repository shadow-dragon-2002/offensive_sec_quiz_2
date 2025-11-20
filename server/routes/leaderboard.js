import express from 'express';
import { randomUUID } from 'crypto';

const router = express.Router();

// In-memory leaderboard storage
let leaderboard = [];

// Calculate rank based on score
function calculateRank(score) {
  if (score >= 85) return 'GOLD';
  if (score >= 70) return 'SILVER';
  if (score >= 50) return 'BRONZE';
  return 'COMPLETE';
}

// Get top 10 leaderboard entries
router.get('/', (req, res) => {
  // Sort by score (desc), then by time (asc)
  const sortedLeaderboard = [...leaderboard]
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.completedTime - b.completedTime;
    })
    .slice(0, 10);

  res.json(sortedLeaderboard);
});

// Submit score to leaderboard
router.post('/', (req, res) => {
  const { playerName, score, time } = req.body;

  // Validate input
  if (!playerName || playerName.length === 0) {
    return res.status(400).json({ error: 'Player name required' });
  }

  if (playerName.length > 50) {
    return res.status(400).json({ error: 'Player name too long (max 50 characters)' });
  }

  // Sanitize player name (alphanumeric + spaces only)
  const sanitizedName = playerName.replace(/[^a-zA-Z0-9 ]/g, '').trim();
  
  if (sanitizedName.length === 0) {
    return res.status(400).json({ error: 'Invalid player name' });
  }

  if (score === undefined || score === null || score < 0 || score > 100) {
    return res.status(400).json({ error: 'Invalid score' });
  }

  if (time === undefined || time === null || time < 0) {
    return res.status(400).json({ error: 'Invalid time' });
  }

  // Check if session already submitted
  if (req.session.game && req.session.game.leaderboardSubmitted) {
    return res.status(400).json({ 
      error: 'Score already submitted for this session' 
    });
  }

  // Calculate rank
  const rank = calculateRank(score);

  // Create leaderboard entry
  const entry = {
    id: randomUUID(),
    playerName: sanitizedName,
    score,
    completedTime: time,
    rank,
    submittedAt: Date.now(),
    sessionId: req.sessionID
  };

  // Add to leaderboard
  leaderboard.push(entry);

  // Mark as submitted in session
  if (req.session.game) {
    req.session.game.leaderboardSubmitted = true;
  }

  res.json({
    success: true,
    entry,
    rank
  });
});

// Get rank for a specific score
router.get('/rank/:score', (req, res) => {
  const score = parseInt(req.params.score);
  
  if (isNaN(score) || score < 0 || score > 100) {
    return res.status(400).json({ error: 'Invalid score' });
  }

  const rank = calculateRank(score);
  
  res.json({ rank, score });
});

export default router;
