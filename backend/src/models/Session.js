const { v4: uuidv4 } = require('uuid');

class SessionManager {
  constructor() {
    this.sessions = new Map();
  }

  createSession(sessionId) {
    const session = {
      id: sessionId,
      currentLevel: 1,
      score: 0,
      answers: [],
      startTime: Date.now(),
      endTime: null,
      isCompleted: false,
      isLocked: false,
      correctAnswers: 0,
      totalQuestions: 30,
      timeLimit: 30 * 60 * 1000, // 30 minutes in milliseconds
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
    if (!session || session.isLocked || session.isCompleted) {
      return { success: false, message: 'Session is locked or completed' };
    }

    if (this.isSessionExpired(sessionId)) {
      this.lockSession(sessionId);
      return { success: false, message: 'Session has expired' };
    }

    const isCorrect = selectedAnswer === correctAnswer;
    const answer = {
      questionId,
      selectedAnswer,
      isCorrect,
      points: isCorrect ? points : 0,
      timestamp: Date.now()
    };

    session.answers.push(answer);
    
    if (isCorrect) {
      session.score += points;
      session.correctAnswers += 1;
      session.currentLevel += 1;
    } else {
      // Lock session on wrong answer (session-locked progressive challenges)
      session.isLocked = true;
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
      isLocked: session.isLocked,
      isCompleted: session.isCompleted
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
}

module.exports = new SessionManager();
