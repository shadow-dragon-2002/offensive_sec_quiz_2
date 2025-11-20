import express from 'express';
import { stages } from '../models/stages.js';

const router = express.Router();

// Get all stages (without correct answers)
router.get('/', (req, res) => {
  // Strip correct answers from response
  const sanitizedStages = stages.map(stage => ({
    id: stage.id,
    phase: stage.phase,
    title: stage.title,
    description: stage.description,
    question: stage.question,
    options: stage.options,
    points: stage.points
  }));

  res.json(sanitizedStages);
});

// Get specific stage
router.get('/:id', (req, res) => {
  const stageId = parseInt(req.params.id);
  const stage = stages.find(s => s.id === stageId);

  if (!stage) {
    return res.status(404).json({ error: 'Stage not found' });
  }

  // Don't send correct answer
  const sanitizedStage = {
    id: stage.id,
    phase: stage.phase,
    title: stage.title,
    description: stage.description,
    question: stage.question,
    options: stage.options,
    points: stage.points
  };

  res.json(sanitizedStage);
});

// Submit answer for validation
router.post('/:id/answer', (req, res) => {
  if (!req.session.game) {
    return res.status(401).json({ error: 'No active session' });
  }

  if (req.session.game.isCompleted) {
    return res.status(400).json({ error: 'Game already completed' });
  }

  const stageId = parseInt(req.params.id);
  const { answerId } = req.body;

  if (answerId === undefined || answerId === null) {
    return res.status(400).json({ error: 'Answer ID required' });
  }

  const stage = stages.find(s => s.id === stageId);
  
  if (!stage) {
    return res.status(404).json({ error: 'Stage not found' });
  }

  // Verify this is the current stage
  if (req.session.game.currentStage !== stageId) {
    return res.status(400).json({ 
      error: 'Cannot answer this stage. Complete stages in order.' 
    });
  }

  // Check if answer is correct
  const isCorrect = stage.correctAnswer === parseInt(answerId);
  
  // Update score
  if (!isCorrect) {
    req.session.game.score = Math.max(0, req.session.game.score - 10);
    req.session.game.wrongAnswers++;
  }

  // Determine next stage
  const nextStage = stageId < 30 ? stageId + 1 : null;

  res.json({
    isCorrect,
    earnedPoints: isCorrect ? stage.points : 0,
    currentScore: req.session.game.score,
    nextStage,
    wrongAnswers: req.session.game.wrongAnswers
  });
});

export default router;
