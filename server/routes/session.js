import express from 'express';

const router = express.Router();

// Start a new game session
router.post('/start', (req, res) => {
  // Check if session already has a game
  if (req.session.game) {
    return res.status(400).json({ 
      error: 'Session already active. One playthrough per session.' 
    });
  }

  // Initialize new game session
  req.session.game = {
    startTime: Date.now(),
    currentStage: 1,
    score: 100,
    timeRemaining: 1500, // 25 minutes in seconds
    completedStages: 0,
    wrongAnswers: 0,
    isCompleted: false,
    leaderboardSubmitted: false
  };

  res.json({ 
    success: true,
    session: {
      currentStage: req.session.game.currentStage,
      score: req.session.game.score,
      timeRemaining: req.session.game.timeRemaining
    }
  });
});

// Get session status
router.get('/status', (req, res) => {
  if (!req.session.game) {
    return res.status(404).json({ error: 'No active session' });
  }

  // Calculate time remaining
  const elapsed = Math.floor((Date.now() - req.session.game.startTime) / 1000);
  const timeRemaining = Math.max(0, 1500 - elapsed);
  
  // Update time remaining in session
  req.session.game.timeRemaining = timeRemaining;

  // If time expired, mark as completed
  if (timeRemaining === 0 && !req.session.game.isCompleted) {
    req.session.game.isCompleted = true;
  }

  res.json({
    currentStage: req.session.game.currentStage,
    score: req.session.game.score,
    timeRemaining: timeRemaining,
    completedStages: req.session.game.completedStages,
    wrongAnswers: req.session.game.wrongAnswers,
    isCompleted: req.session.game.isCompleted
  });
});

// Update progress (advance to next stage)
router.post('/progress', (req, res) => {
  if (!req.session.game) {
    return res.status(404).json({ error: 'No active session' });
  }

  if (req.session.game.isCompleted) {
    return res.status(400).json({ error: 'Game already completed' });
  }

  // Advance to next stage
  req.session.game.currentStage = Math.min(req.session.game.currentStage + 1, 30);
  req.session.game.completedStages++;

  res.json({ 
    success: true,
    currentStage: req.session.game.currentStage
  });
});

// Complete the game
router.post('/complete', (req, res) => {
  if (!req.session.game) {
    return res.status(404).json({ error: 'No active session' });
  }

  // Mark game as completed
  req.session.game.isCompleted = true;
  
  // Calculate final time
  const elapsed = Math.floor((Date.now() - req.session.game.startTime) / 1000);
  const finalTime = Math.min(elapsed, 1500);

  res.json({
    success: true,
    score: req.session.game.score,
    completedStages: req.session.game.completedStages,
    time: finalTime,
    wrongAnswers: req.session.game.wrongAnswers
  });
});

export default router;
