const express = require('express');
const router = express.Router();
const stages = require('../data/stages');

// Import sessions from session route (will be set in index.js)
let sessions;

router.setSessions = (sessionsMap) => {
  sessions = sessionsMap;
};

/**
 * GET /api/stages
 * Get all stages (without correct answers)
 */
router.get('/', (req, res) => {
  try {
    // Remove correct answers from response
    const safeStages = stages.map(stage => {
      const { correctAnswer, ...safeStage } = stage;
      return safeStage;
    });

    res.json({
      success: true,
      stages: safeStages,
      totalStages: stages.length
    });
  } catch (error) {
    console.error('Get stages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get stages',
      error: error.message
    });
  }
});

/**
 * GET /api/stages/:id
 * Get a specific stage (without correct answer)
 */
router.get('/:id', (req, res) => {
  try {
    const stageId = parseInt(req.params.id);
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
        message: 'Session not found. Please start a new game.'
      });
    }

    // Check if session completed or time expired
    if (session.isCompleted) {
      return res.status(403).json({
        success: false,
        message: 'Session completed',
        isCompleted: true
      });
    }

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

    // Only allow access to current stage
    if (stageId !== session.currentStage) {
      return res.status(403).json({
        success: false,
        message: 'Can only access current stage',
        currentStage: session.currentStage
      });
    }

    const stage = stages.find(s => s.id === stageId);
    
    if (!stage) {
      return res.status(404).json({
        success: false,
        message: 'Stage not found'
      });
    }

    // Remove correct answer from response
    const { correctAnswer, ...safeStage } = stage;

    res.json({
      success: true,
      stage: safeStage,
      currentStage: session.currentStage,
      totalStages: 30
    });
  } catch (error) {
    console.error('Get stage error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get stage',
      error: error.message
    });
  }
});

/**
 * POST /api/stages/:id/answer
 * Submit answer for a stage
 */
router.post('/:id/answer', (req, res) => {
  try {
    const stageId = parseInt(req.params.id);
    const { answerId } = req.body;
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

    if (session.isCompleted) {
      return res.status(403).json({
        success: false,
        message: 'Session completed'
      });
    }

    // Check if answering correct stage
    if (stageId !== session.currentStage) {
      return res.status(403).json({
        success: false,
        message: 'Can only answer current stage'
      });
    }

    const stage = stages.find(s => s.id === stageId);
    
    if (!stage) {
      return res.status(404).json({
        success: false,
        message: 'Stage not found'
      });
    }

    if (answerId === undefined || answerId === null) {
      return res.status(400).json({
        success: false,
        message: 'Answer ID required'
      });
    }

    // Check answer
    const isCorrect = answerId === stage.correctAnswer;
    let earnedPoints = 0;

    if (isCorrect) {
      // Correct answer: keep score, move to next stage
      earnedPoints = 0; // No bonus, just maintain score
    } else {
      // Wrong answer: deduct 10 points, but still allow progression
      session.score = Math.max(0, session.score - 10);
      session.wrongAnswers += 1;
      earnedPoints = -10;
    }

    // Always move to next stage (key difference from old implementation)
    session.currentStage += 1;
    session.completedStages += 1;

    // Check if completed all stages
    if (session.currentStage > 30) {
      session.isCompleted = true;
      session.endTime = Date.now();
    }

    sessions.set(sessionId, session);

    res.json({
      success: true,
      isCorrect: isCorrect,
      earnedPoints: earnedPoints,
      currentScore: session.score,
      nextStage: session.currentStage <= 30 ? session.currentStage : null,
      isCompleted: session.isCompleted
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit answer',
      error: error.message
    });
  }
});

module.exports = router;
