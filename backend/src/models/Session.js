const { v4: uuidv4 } = require('uuid');

class SessionManager {
  constructor() {
    this.sessions = new Map();
  }

  createSession(sessionId) {
    const session = {
      id: sessionId,
      currentLevel: 1,
      score: 1000, // Start with 1000 points
      answers: [],
      startTime: Date.now(),
      endTime: null,
      isCompleted: false,
      isLocked: false,
      correctAnswers: 0,
      totalQuestions: 30,
      timeLimit: 25 * 60 * 1000, // 25 minutes for escape room
      wrongAttempts: 0,
      canProgress: true, // Always allow progression
    };
    
    this.sessions.set(sessionId, session);
    return session;
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  updateSession(sessionId, updates) {
    const session = this.sessions.get(sessionId);
    if (session) {
      Object.assign(session, updates);
      this.sessions.set(sessionId, session);
      return session;
    }
    return null;
  }

  lockSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isLocked = true;
      this.sessions.set(sessionId, session);
      return true;
    }
    return false;
  }

  isSessionExpired(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return true;
    
    const elapsed = Date.now() - session.startTime;
    return elapsed > session.timeLimit;
  }

  submitAnswer(sessionId, questionId, selectedAnswer, correctAnswer, points) {
    const session = this.sessions.get(sessionId);
    if (!session || session.isCompleted) {
      return { success: false, message: 'Session is completed' };
    }

    if (this.isSessionExpired(sessionId)) {
      session.isCompleted = true;
      session.endTime = Date.now();
      this.sessions.set(sessionId, session);
      return { success: false, message: 'Time expired', timeExpired: true };
    }

    const isCorrect = selectedAnswer === correctAnswer;
    const penalty = isCorrect ? 0 : 50; // 50 point penalty for wrong answer
    
    const answer = {
      questionId,
      selectedAnswer,
      isCorrect,
      penalty: penalty,
      timestamp: Date.now()
    };

    session.answers.push(answer);
    
    if (isCorrect) {
      // Correct answer - move to next level
      session.correctAnswers += 1;
      session.currentLevel += 1;
    } else {
      // Wrong answer - apply penalty but allow progression
      session.score = Math.max(0, session.score - penalty);
      session.wrongAttempts += 1;
      // DO NOT lock session - allow continuation
      // DO NOT advance level - must answer correctly
    }

    // Check if completed all questions
    if (session.currentLevel > 30) {
      session.isCompleted = true;
      session.endTime = Date.now();
    }

    this.sessions.set(sessionId, session);

    return {
      success: true,
      isCorrect,
      currentLevel: session.currentLevel,
      score: session.score,
      isLocked: false, // Never lock in escape room mode
      isCompleted: session.isCompleted,
      penalty: penalty,
      wrongAttempts: session.wrongAttempts
    };
  }

  getSessionStats(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const elapsed = Date.now() - session.startTime;
    const remainingTime = Math.max(0, session.timeLimit - elapsed);

    return {
      currentLevel: session.currentLevel,
      score: session.score,
      correctAnswers: session.correctAnswers,
      totalQuestions: session.totalQuestions,
      isCompleted: session.isCompleted,
      isLocked: session.isLocked,
      elapsedTime: elapsed,
      remainingTime: remainingTime,
      startTime: session.startTime,
      endTime: session.endTime
    };
  }

  deleteSession(sessionId) {
    return this.sessions.delete(sessionId);
  }

  cleanupOldSessions(maxAge = 60 * 60 * 1000) {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      const age = now - session.startTime;
      if (age > maxAge) {
        this.sessions.delete(sessionId);
      }
    }
  }

  cleanupAllSessions() {
    const count = this.sessions.size;
    this.sessions.clear();
    return count;
  }

  getActiveSessionCount() {
    return this.sessions.size;
  }

  validateSession(sessionId) {
    if (!sessionId || typeof sessionId !== 'string') {
      return false;
    }
    return this.sessions.has(sessionId);
  }

  getSessionHealth() {
    return {
      activeSessions: this.sessions.size,
      totalSessions: this.sessions.size,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new SessionManager();
